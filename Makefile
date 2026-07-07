SHELL := /bin/bash

# プロジェクトごとに各コマンドを上書きしてください。
PRECHECK_CMD ?= printf '%s\n' 'PRECHECK_CMD is not set. Update Makefile for this project.' >&2; exit 1
UNIT_TEST_CMD ?= printf '%s\n' 'UNIT_TEST_CMD is not set. Update Makefile for this project.' >&2; exit 1
E2E_TEST_CMD ?= printf '%s\n' 'E2E_TEST_CMD is not set. Update Makefile for this project.' >&2; exit 1
LINT_CMD ?= printf '%s\n' 'LINT_CMD is not set. Update Makefile for this project.' >&2; exit 1
FORMAT_CHECK_CMD ?= printf '%s\n' 'FORMAT_CHECK_CMD is not set. Update Makefile for this project.' >&2; exit 1

.PHONY: help check check-pre test test-unit test-e2e lint format-check

help:
	@printf '%s\n' \
		'Available targets:' \
		'  make check        - pre-check + lint + format-check + tests' \
		'  make check-pre    - validate current project state before changes' \
		'  make lint         - run linter' \
		'  make format-check - verify formatting' \
		'  make test         - run all tests' \
		'  make test-unit    - run unit/integration tests' \
		'  make test-e2e     - run e2e tests'

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
