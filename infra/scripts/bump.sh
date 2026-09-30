#!/usr/bin/env bash
# Set the version field in package.json / pyproject.toml / VERSION files
# (first occurrence only). Uses perl so it behaves the same on macOS and Linux.
#   bump.sh 1.2.0 apps/web/package.json apps/api/pyproject.toml
set -euo pipefail
v=${1:?version without leading v}; shift
for f in "$@"; do
  [ -f "$f" ] || { echo "no such file: $f" >&2; exit 1; }
  case "$f" in
    *package.json)   perl -0pi -e 's/("version"\s*:\s*")[^"]*/${1}'"$v"'/' "$f" ;;
    *pyproject.toml) perl -0pi -e 's/(^version\s*=\s*")[^"]*/${1}'"$v"'/m' "$f" ;;
    *VERSION)        printf '%s\n' "$v" > "$f" ;;
    *) echo "don't know how to bump $f" >&2; exit 1 ;;
  esac
  echo "bumped $f -> $v"
done
