SHELL := /bin/bash

PRECHECK_CMD ?= test -f package.json
UNIT_TEST_CMD ?= npm run test
E2E_TEST_CMD ?= npm run build
LINT_CMD ?= npm run lint
FORMAT_CHECK_CMD ?= npm run typecheck

.PHONY: help check check-pre test test-unit test-e2e lint format-check

help:
	@printf '%s\n' \
		'Available targets:' \
		'  make check        - pre-check + lint + typecheck + tests + build' \
		'  make check-pre    - validate current project state before changes' \
		'  make lint         - run ESLint' \
		'  make format-check - run TypeScript typecheck' \
		'  make test         - run smoke tests and build verification' \
		'  make test-unit    - run node:test smoke tests' \
		'  make test-e2e     - run production build as app-level verification'

check: check-pre lint format-check test

check-pre:
	@$(PRECHECK_CMD)

lint:
	@$(LINT_CMD)

format-check:
	@$(FORMAT_CHECK_CMD)

test: test-unit test-e2e

test-unit:
	@$(UNIT_TEST_CMD)

test-e2e:
	@$(E2E_TEST_CMD)
