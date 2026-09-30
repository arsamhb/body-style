#!/usr/bin/env bash
# =============================================================================
# deploy.sh — runs ON THE VPS at /opt/<app>/deploy.sh. Copied there by
# `make ship`; never edit it on the host.
#
#   deploy.sh v1.2.0                          switch to v1.2.0 now
#   deploy.sh v1.2.0 --at "2026-10-01 09:00"  schedule the switch (host time)
#   deploy.sh --status                        current version + scheduled jobs
#   deploy.sh --cancel                        drop scheduled deploys
#
# Flow: verify images → record previous version → run migrations with the new
# image → compose up → wait until every service is healthy → log. On any
# failure the previous version is restored automatically.
# Rollback is just deploying an older version that is still on the host.
# =============================================================================
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"
[ -f app.conf ] || { echo "app.conf missing — run 'make ship' first"; exit 1; }
# shellcheck disable=SC1091
source ./app.conf
ENV_FILE="$DIR/.env"
COMPOSE=(docker compose -f "$DIR/compose.yml" --env-file "$ENV_FILE")
PLATFORM=/opt/platform
HEALTH_TIMEOUT=${HEALTH_TIMEOUT:-180}
LOG="$DIR/releases.log"

usage() { sed -n '5,10p' "$0"; exit 2; }
current_version() { grep -E '^APP_VERSION=' "$ENV_FILE" 2>/dev/null | cut -d= -f2 || true; }
set_version() {
  if grep -qE '^APP_VERSION=' "$ENV_FILE" 2>/dev/null; then
    sed -i "s/^APP_VERSION=.*/APP_VERSION=$1/" "$ENV_FILE"
  else
    printf 'APP_VERSION=%s\n' "$1" >> "$ENV_FILE"
  fi
}
scheduled_jobs() { for j in $(atq 2>/dev/null | awk '{print $1}'); do at -c "$j" | grep -q "$DIR/deploy.sh" && echo "$j"; done; true; }

case "${1:-}" in
  --status)
    echo "app:      $APP"
    echo "version:  $(current_version || echo none)"
    echo "images:   $(for u in $UNITS; do docker images "$APP-$u" --format '{{.Tag}}' | grep -v none | sort -V | tr '\n' ' '; done)"
    echo "scheduled:"; for j in $(scheduled_jobs); do atq | awk -v j="$j" '$1==j'; done
    "${COMPOSE[@]}" ps 2>/dev/null || true
    exit 0 ;;
  --cancel)
    n=0; for j in $(scheduled_jobs); do atrm "$j" && n=$((n+1)); done
    echo "cancelled $n scheduled deploy(s)"; exit 0 ;;
  ""|-*) usage ;;
esac

VERSION=$1; shift
[ -f "$ENV_FILE" ] || { echo "$ENV_FILE missing — create it from deploy/.env.prod.example (chmod 600)"; exit 1; }

# ---- schedule instead of run --------------------------------------------------
if [ "${1:-}" = "--at" ]; then
  when=${2:?--at needs \"YYYY-MM-DD HH:MM\"}
  command -v at >/dev/null || { echo "'at' is not installed (bootstrap.sh installs it)"; exit 1; }
  for u in $UNITS; do docker image inspect "$APP-$u:$VERSION" >/dev/null 2>&1 || { echo "image $APP-$u:$VERSION not on host — run make ship first"; exit 1; }; done
  echo "$DIR/deploy.sh $VERSION >> $DIR/scheduled.log 2>&1" | at "${when#* }" "${when%% *}"
  echo "scheduled deploy of $VERSION at $when ($(date +%Z)). Cancel with: deploy.sh --cancel"
  exit 0
fi

# ---- 1. preflight -------------------------------------------------------------
# refuse placeholder secrets and world-readable env files
PLACEHOLDER='change-?me|changeme|CHANGEME|placeholder|your-?secret|example\.com|TODO|xxxxx|s3cret|123456'
if grep -vE '^\s*#' "$ENV_FILE" | grep -qiE "$PLACEHOLDER"; then
  echo "refusing: $ENV_FILE still contains placeholder values (anywhere in the line, including inside URLs):"
  grep -nviE '^\s*#' "$ENV_FILE" | grep -iE "$PLACEHOLDER" | sed -E 's/=(.{0,6}).*/=\1…/'
  echo "generate real ones with: make secrets"; exit 1
fi
# a bare 'password' or 'postgres' as the DB password is a placeholder too
if grep -qE '^POSTGRES_PASSWORD=(password|postgres|admin|root|test)$' "$ENV_FILE"; then
  echo "refusing: POSTGRES_PASSWORD is a default/dictionary value"; exit 1
fi
if [ "$(stat -c %a "$ENV_FILE")" != "600" ]; then chmod 600 "$ENV_FILE"; echo "fixed permissions on $ENV_FILE (600)"; fi
for k in OTP_DEV_MODE OTP_MOCK_ENABLED; do
  grep -qE "^$k=(true|1)$" "$ENV_FILE" && { echo "refusing: $k is enabled in $ENV_FILE"; exit 1; }
done
for u in $UNITS; do
  docker image inspect "$APP-$u:$VERSION" >/dev/null 2>&1 || { echo "image $APP-$u:$VERSION not on host — run make ship VERSION=$VERSION"; exit 1; }
done
PREV=$(current_version)
[ "$PREV" = "$VERSION" ] && echo "note: $VERSION is already the current version — redeploying"
echo "==> $APP: ${PREV:-none} -> $VERSION"

rollback() {
  echo "!!! deploy of $VERSION failed"
  "${COMPOSE[@]}" logs --tail=50 2>/dev/null || true
  if [ -n "$PREV" ] && [ "$PREV" != "$VERSION" ]; then
    echo "==> restoring $PREV"
    set_version "$PREV"
    "${COMPOSE[@]}" up -d --remove-orphans || true
    echo "$(date -Is) ROLLBACK to $PREV after failed $VERSION" >> "$LOG"
  fi
  exit 1
}
trap rollback ERR
set_version "$VERSION"

# ---- 2. migrations (with the NEW image, before switching containers) ----------
if [ -n "${MIGRATE:-}" ]; then
  if [ "${DB_KIND:-none}" != "none" ]; then
    "${COMPOSE[@]}" up -d "$DB_SERVICE"
  fi
  echo "==> migrate: $MIGRATE"
  "${COMPOSE[@]}" run --rm --no-deps --entrypoint sh "$MIGRATE_SVC" -c "$MIGRATE"
fi

# ---- 3. switch ----------------------------------------------------------------
"${COMPOSE[@]}" up -d --remove-orphans

# ---- 4. wait for health -------------------------------------------------------
echo "==> waiting for services to be healthy (timeout ${HEALTH_TIMEOUT}s)"
deadline=$((SECONDS + HEALTH_TIMEOUT))
while :; do
  bad=""
  for id in $("${COMPOSE[@]}" ps -q); do
    st=$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$id")
    name=$(docker inspect -f '{{.Name}}' "$id" | sed 's#^/##')
    case "$st" in
      healthy|running) ;;
      exited) [ "$(docker inspect -f '{{.State.ExitCode}}' "$id")" = 0 ] || bad="$bad $name($st)" ;;
      *) bad="$bad $name($st)" ;;
    esac
  done
  [ -z "$bad" ] && break
  if [ $SECONDS -ge $deadline ]; then echo "unhealthy:$bad"; false; fi
  sleep 3
done
trap - ERR

# ---- 5. caddy site ------------------------------------------------------------
if [ -f "$DIR/Caddyfile" ] && [ -d "$PLATFORM/sites" ]; then
  install -m 644 "$DIR/Caddyfile" "$PLATFORM/sites/$APP.caddy"
  docker exec caddy caddy reload --config /etc/caddy/Caddyfile 2>&1 | grep -v '^$' || true
fi

# ---- 6. record + prune --------------------------------------------------------
echo "$(date -Is) $VERSION (prev: ${PREV:-none}) by ${SUDO_USER:-$USER}" >> "$LOG"
for u in $UNITS; do
  docker images "$APP-$u" --format '{{.Tag}}' | grep -v none | sort -V | head -n "-${KEEP_IMAGES:-3}" \
    | grep -vx -e "$VERSION" -e "${PREV:-__}" | xargs -r -I{} docker rmi "$APP-$u:{}" >/dev/null 2>&1 || true
done
docker image prune -f >/dev/null 2>&1 || true
echo "==> $APP is now $VERSION"
