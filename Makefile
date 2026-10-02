# =============================================================================
# ghahremani-bodystyle — Makefile. App-specific settings only; every target comes
# from infra/common.mk (vendored, do not edit). Run `make help`.
#
# Keep comments on their own lines: make keeps trailing spaces before an
# inline `# comment` as part of the value, which breaks image names.
# =============================================================================

# ---- identity ---------------------------------------------------------------
# must equal `name:` in deploy/compose.prod.yml
APP   := ghahremani-bodystyle
# one entry per IMAGE (Dockerfile); named after the compose services
UNITS := server web

# ---- how each image is built -----------------------------------------------
CTX_server := server
DF_server  := server/Dockerfile
CTX_web    := client
DF_web     := client/Dockerfile
# Build args: non-secret only, baked into the bundle. API_INTERNAL_URL is the
# compose service name and stays as it is.
# TODO(human): replace example.ir with the real domain before the first release.
ARGS_web := NEXT_PUBLIC_BASE_URL=https://api.example.ir \
            NEXT_PUBLIC_SITE_URL=https://example.ir \
            NEXT_PUBLIC_DEFAULT_LOCALE=fa \
            API_INTERNAL_URL=http://server:4000

# ---- database & migrations --------------------------------------------------
# MongoDB has no schema migrations, so MIGRATE stays empty and deploy.sh skips
# that step. DB_KIND drives the nightly mongodump.
DB_KIND     := mongo
DB_SERVICE  := mongo
MIGRATE_SVC := server
MIGRATE     :=

# ---- production host (env var overrides; CI sets it from a secret) ----------
# TODO(human): deploy@<VPS ip> once the server exists.
DEPLOY_HOST ?= deploy@TODO

# ---- files whose version field `make release` bumps -------------------------
VERSION_FILES := server/package.json client/package.json

# ---- dev commands (use `=` when referencing $(COMPOSE)) ----------------------
# No test suite yet: `make test` type-checks the API. The web app is
# type-checked by `next build`, which `make build` runs.
TEST_CMD = cd server && npm run typecheck
LINT_CMD = cd server && npm run lint && cd ../client && npm run lint
# Accounts + demo content. Idempotent; runs the compiled seed inside the image.
SEED_CMD = $(COMPOSE) exec server node dist/db/seed/index.js

include infra/common.mk

# ---- app-specific extra targets go below this line -------------------------
MONGO_DEV_URI := mongodb://localhost:$(HOST_MONGO_PORT)/ghahremani_bodystyle

dev-db: doctor ## Start only MongoDB, for the native dev servers below
	$(COMPOSE) up -d mongo

dev-api: ## Native API dev server (tsx watch) on the slot's API port
	cd server && PORT=$(HOST_API_PORT) MONGODB_URI=$(MONGO_DEV_URI) \
	  CORS_ORIGIN=http://localhost:$(HOST_WEB_PORT) \
	  REVALIDATE_URL=http://localhost:$(HOST_WEB_PORT) npm run dev

dev-web: ## Native Next.js dev server on the slot's web port
	cd client && NEXT_PUBLIC_BASE_URL=http://localhost:$(HOST_API_PORT) \
	  API_INTERNAL_URL=http://localhost:$(HOST_API_PORT) \
	  NEXT_PUBLIC_SITE_URL=http://localhost:$(HOST_WEB_PORT) npm run dev -- -p $(HOST_WEB_PORT)

dev-seed: ## Seed the database used by the native dev servers
	cd server && MONGODB_URI=$(MONGO_DEV_URI) npm run seed

seed-prod: ## Seed production once, after the first deploy (uses the *_SEED_* values in /opt/<app>/.env)
	$(need_host)
	ssh -t $(DEPLOY_HOST) 'cd $(DEPLOY_DIR) && docker compose exec server node dist/db/seed/index.js'

app-secrets: ## Print strong random values for this app's deploy/.env.prod.example
	@echo "# paste into /opt/$(APP)/.env — generated $$(date +%F)"
	@for k in MONGO_INITDB_ROOT_PASSWORD JWT_ACCESS_SECRET JWT_REFRESH_SECRET REVALIDATE_SECRET \
	  TICKET_TOKEN_SECRET IP_HASH_SALT DEVELOPER_SEED_PASSWORD ADMIN_SEED_PASSWORD; do \
	  printf '%s=%s\n' "$$k" "$$(LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c 40)"; done
	@echo "# MONGODB_URI must carry the same password as MONGO_INITDB_ROOT_PASSWORD"
	@echo "# never commit these; store the finished .env in your password manager"

.PHONY: dev-db dev-api dev-web dev-seed seed-prod app-secrets
