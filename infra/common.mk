# =============================================================================
# infra/common.mk — the shared make interface for ALL apps.
#
# This file is VENDORED: it is copied verbatim from the infra repo into
# <app>/infra/common.mk. Never edit it inside an app repo; change it in the
# infra repo and re-copy (infra/scripts/sync-infra.sh).
#
# The app's Makefile sets the variables listed below, then does
#     include infra/common.mk
# =============================================================================
INFRA_VERSION := 1

SHELL       := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := help
INFRA_DIR   := $(dir $(lastword $(MAKEFILE_LIST)))

# ---- Variables the app Makefile MUST set (before the include) ---------------
#   APP           short lowercase name [a-z0-9-], used for image names and /opt/<APP>
#   UNITS         images to build, e.g. "api web admin". One image per Dockerfile,
#                 NOT one per compose service (a worker can reuse the api image).
#   CTX_<unit>    docker build context for that unit
#   DF_<unit>     Dockerfile for that unit
# ---- Optional ---------------------------------------------------------------
#   ARGS_<unit>   build args, space separated "K=V K2=V2" (non-secret only)
#   MIGRATE_SVC   compose service whose image runs migrations
#   MIGRATE       shell command run inside that image, e.g. "uv run alembic upgrade head"
#   DB_KIND       postgres | mongo | none        (default none)  — used by backups
#   DB_SERVICE    compose service of the database (default db)
#   DEPLOY_HOST   ssh target for prod, e.g. deploy@1.2.3.4 (env var overrides)
#   VERSION_FILES files whose version field `make release` bumps
#   TEST_CMD / LINT_CMD / SEED_CMD   shell commands (use `=` not `:=` if they
#                 reference $(COMPOSE), which is defined here)
#   DEV_COMPOSE   dev compose file            (default docker-compose.yml)
#   PROD_COMPOSE  prod compose file           (default deploy/compose.prod.yml)
#   UP_FLAGS      flags for `make up`         (default -d --build)
#   KEEP_IMAGES   image versions kept on host (default 3)
#   DEV_ROOT      where all your repos live   (default ~/Desktop/dev)
# -----------------------------------------------------------------------------

APP          ?= $(error APP is not set in the app Makefile)
UNITS        ?= $(error UNITS is not set in the app Makefile)
DB_KIND      ?= none
DB_SERVICE   ?= db
DEV_COMPOSE  ?= docker-compose.yml
PROD_COMPOSE ?= deploy/compose.prod.yml
UP_FLAGS     ?= -d --build
KEEP_IMAGES  ?= 3
DEV_ROOT     ?= $(HOME)/Desktop/dev
VERSION_FILES ?=

# ---- Port slots (local dev only; prod is one VPS per app) -------------------
# PROJECT_SLOT lives in the repo's root .env (not committed). Ports derive
# from it so no compose file ever hardcodes a host port.
PROJECT_SLOT := $(strip $(shell grep -E '^PROJECT_SLOT=' .env 2>/dev/null | head -1 | cut -d= -f2 | tr -d '"'))
ifeq ($(PROJECT_SLOT),)
PROJECT_SLOT := 0
endif
export PROJECT_SLOT
export COMPOSE_PROJECT_NAME ?= $(APP)
export HOST_API_PORT           := $(shell echo $$((8000 + $(PROJECT_SLOT)*100)))
export HOST_WEB_PORT           := $(shell echo $$((3000 + $(PROJECT_SLOT)*100)))
export HOST_ADMIN_PORT         := $(shell echo $$((3001 + $(PROJECT_SLOT)*100)))
export HOST_WEB_COMPOSE_PORT   := $(shell echo $$((3010 + $(PROJECT_SLOT)*100)))
export HOST_ADMIN_COMPOSE_PORT := $(shell echo $$((3011 + $(PROJECT_SLOT)*100)))
export HOST_POSTGRES_PORT      := $(shell echo $$((5433 + $(PROJECT_SLOT))))
export HOST_MONGO_PORT         := $(shell echo $$((27018 + $(PROJECT_SLOT))))
export HOST_REDIS_PORT         := $(shell echo $$((6380 + $(PROJECT_SLOT))))
export HOST_MINIO_PORT         := $(shell echo $$((9000 + $(PROJECT_SLOT)*100)))
export HOST_MINIO_CONSOLE_PORT := $(shell echo $$((9001 + $(PROJECT_SLOT)*100)))

COMPOSE := docker compose -f $(DEV_COMPOSE)

# VERSION: explicit, else the exact tag on HEAD, else short sha (dev builds)
VERSION ?= $(shell git describe --tags --exact-match 2>/dev/null || git rev-parse --short HEAD 2>/dev/null || echo dev)
IMAGES  := $(foreach u,$(UNITS),$(APP)-$(u):$(VERSION))
DEPLOY_DIR := /opt/$(APP)

define need_host
	@test -n "$(DEPLOY_HOST)" || { echo "DEPLOY_HOST is not set (Makefile or env)"; exit 1; }
endef

# =============================================================================
help: ## Show this help
	@echo "$(APP)  —  slot $(PROJECT_SLOT)  —  infra v$(INFRA_VERSION)"
	@grep -hE '^[a-zA-Z0-9_-]+:.*## ' $(MAKEFILE_LIST) | sort | awk -F':.*## ' '{printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

infra-version: ## Print the vendored infra version
	@echo $(INFRA_VERSION)

# ---- Local development ------------------------------------------------------
doctor: ## Check tools and that this repo's port slot is unique in DEV_ROOT
	@command -v docker >/dev/null || { echo "docker is not installed"; exit 1; }
	@docker compose version >/dev/null 2>&1 || { echo "docker compose v2 is missing"; exit 1; }
	@test -f .env || { echo "no .env — copy .env.example and set PROJECT_SLOT"; exit 1; }
	@grep -qE '^PROJECT_SLOT=[0-9]+' .env || { echo "PROJECT_SLOT is missing in .env"; exit 1; }
	@bash $(INFRA_DIR)scripts/slots.sh check "$(DEV_ROOT)" "$(CURDIR)" "$(PROJECT_SLOT)"
	@echo "ok: $(APP) slot $(PROJECT_SLOT)  api=$(HOST_API_PORT) web=$(HOST_WEB_PORT)/$(HOST_WEB_COMPOSE_PORT) db=$(HOST_POSTGRES_PORT)"

ports: ## Print the port registry for every repo in DEV_ROOT
	@bash $(INFRA_DIR)scripts/slots.sh list "$(DEV_ROOT)"

up: doctor ## Start the dev stack
	$(COMPOSE) up $(UP_FLAGS)

down: ## Stop the dev stack
	$(COMPOSE) down

nuke: ## Stop the dev stack and delete its volumes
	$(COMPOSE) down -v --remove-orphans

restart: ## Restart one service: make restart S=api
	$(COMPOSE) restart $(S)

ps: ## Dev stack status
	$(COMPOSE) ps

logs: ## Tail dev logs (all, or S=api)
	$(COMPOSE) logs -f --tail=200 $(S)

sh: ## Shell into a dev service: make sh S=api
	$(COMPOSE) exec $(S) sh

migrate: ## Run migrations against the dev stack
	@test -n "$(MIGRATE)" || { echo "MIGRATE is not set — nothing to do"; exit 0; }
	$(COMPOSE) exec $(MIGRATE_SVC) sh -c '$(MIGRATE)'

seed: ## Seed the dev database
	@test -n "$(SEED_CMD)" || { echo "SEED_CMD is not set"; exit 1; }
	$(SEED_CMD)

test: ## Run the test suite
	@test -n "$(TEST_CMD)" || { echo "TEST_CMD is not set"; exit 1; }
	$(TEST_CMD)

lint: ## Run linters
	@test -n "$(LINT_CMD)" || { echo "LINT_CMD is not set"; exit 1; }
	$(LINT_CMD)

secrets: ## Print strong random values for the secret fields of deploy/.env.prod.example
	@echo "# paste into /opt/$(APP)/.env — generated $$(date -I)"
	@# alphanumeric: safe inside a DATABASE_URL and any shell/YAML context
	@for k in POSTGRES_PASSWORD SECRET JWT_ACCESS_SECRET JWT_REFRESH_SECRET; do \
	  printf '%s=%s\n' "$$k" "$$(LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c 40)"; done
	@# Fernet key: exactly 32 random bytes, url-safe base64 WITH padding — do not strip characters
	@printf 'PASSCODE_ENCRYPTION_KEY=%s\n' "$$(openssl rand 32 | openssl base64 -A | tr '+/' '-_')"
	@echo "# never commit these; store the finished .env in your password manager"
	@echo "# remember: a password used inside DATABASE_URL must match POSTGRES_PASSWORD"

# ---- Release ----------------------------------------------------------------
release: ## Cut a release: make release VERSION=v1.2.0  (bumps, commits, tags, pushes → CI deploys)
	@[[ "$(VERSION)" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$$ ]] || { echo "usage: make release VERSION=vX.Y.Z"; exit 1; }
	@git diff --quiet && git diff --cached --quiet || { echo "working tree is not clean"; exit 1; }
	@! git rev-parse "$(VERSION)" >/dev/null 2>&1 || { echo "tag $(VERSION) already exists"; exit 1; }
	@if [ -n "$(VERSION_FILES)" ]; then \
	  bash $(INFRA_DIR)scripts/bump.sh "$(VERSION:v%=%)" $(VERSION_FILES) && \
	  git add $(VERSION_FILES) && git commit -q -m "release $(VERSION)"; fi
	git tag -a "$(VERSION)" -m "$(VERSION)"
	git push && git push origin "$(VERSION)"
	@echo "tagged $(VERSION). CI will ship+deploy; or run: make ship deploy VERSION=$(VERSION)"

build: ## Build prod images for all UNITS (VERSION=…)
	$(foreach u,$(UNITS),docker build -f $(DF_$(u)) -t $(APP)-$(u):$(VERSION) \
	  $(foreach a,$(ARGS_$(u)),--build-arg '$(a)') $(CTX_$(u)) && ) true
	@echo "built: $(IMAGES)"

ship: build ## Build, then copy images + deploy files to DEPLOY_HOST (no switch yet)
	$(need_host)
	@test -f $(PROD_COMPOSE) || { echo "missing $(PROD_COMPOSE)"; exit 1; }
	@test -f deploy/Caddyfile || { echo "missing deploy/Caddyfile"; exit 1; }
	ssh $(DEPLOY_HOST) 'mkdir -p $(DEPLOY_DIR)'
	docker save $(IMAGES) | gzip -1 | ssh $(DEPLOY_HOST) 'gunzip | docker load'
	scp -q $(PROD_COMPOSE) $(DEPLOY_HOST):$(DEPLOY_DIR)/compose.yml
	scp -q deploy/Caddyfile $(DEPLOY_HOST):$(DEPLOY_DIR)/Caddyfile
	scp -q $(INFRA_DIR)deploy.sh $(DEPLOY_HOST):$(DEPLOY_DIR)/deploy.sh
	printf 'APP=%q\nUNITS=%q\nMIGRATE_SVC=%q\nMIGRATE=%q\nDB_KIND=%q\nDB_SERVICE=%q\nKEEP_IMAGES=%q\n' \
	  "$(APP)" "$(UNITS)" "$(MIGRATE_SVC)" "$(MIGRATE)" "$(DB_KIND)" "$(DB_SERVICE)" "$(KEEP_IMAGES)" \
	  | ssh $(DEPLOY_HOST) 'cat > $(DEPLOY_DIR)/app.conf && chmod +x $(DEPLOY_DIR)/deploy.sh'
	@echo "shipped $(VERSION) to $(DEPLOY_HOST):$(DEPLOY_DIR). Next: make deploy VERSION=$(VERSION) [AT=\"YYYY-MM-DD HH:MM\"]"

deploy: ## Switch prod to VERSION now, or later: make deploy VERSION=v1.2.0 AT="2026-10-01 09:00"
	$(need_host)
	ssh -t $(DEPLOY_HOST) '$(DEPLOY_DIR)/deploy.sh $(VERSION) $(if $(AT),--at "$(AT)")'

deploy-cancel: ## Cancel a scheduled deploy
	$(need_host)
	ssh $(DEPLOY_HOST) '$(DEPLOY_DIR)/deploy.sh --cancel'

deploy-status: ## Show current prod version and any scheduled deploy
	$(need_host)
	ssh $(DEPLOY_HOST) '$(DEPLOY_DIR)/deploy.sh --status'

releases: ## Deploy history on the host (for rollback: make deploy VERSION=<older>)
	$(need_host)
	ssh $(DEPLOY_HOST) 'cat $(DEPLOY_DIR)/releases.log 2>/dev/null || echo "no deploys yet"'

# ---- Production operations --------------------------------------------------
logs-prod: ## Tail prod logs (all, or S=api)
	$(need_host)
	ssh -t $(DEPLOY_HOST) 'cd $(DEPLOY_DIR) && docker compose logs -f --tail=200 $(S)'

ps-prod: ## Prod stack status
	$(need_host)
	ssh $(DEPLOY_HOST) 'cd $(DEPLOY_DIR) && docker compose ps'

sh-prod: ## Shell into a prod service: make sh-prod S=api
	$(need_host)
	ssh -t $(DEPLOY_HOST) 'cd $(DEPLOY_DIR) && docker compose exec $(S) sh'

backup-now: ## Run the nightly backup right now
	$(need_host)
	ssh $(DEPLOY_HOST) '/opt/platform/backup.sh'

.PHONY: help infra-version doctor ports up down nuke restart ps logs sh migrate seed test lint secrets \
        release build ship deploy deploy-cancel deploy-status releases logs-prod ps-prod sh-prod backup-now
