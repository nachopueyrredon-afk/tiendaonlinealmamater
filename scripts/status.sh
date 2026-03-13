#!/usr/bin/env bash

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO_ROOT="$(git -C "$PROJECT_ROOT" rev-parse --show-toplevel)"
PROJECT_RELATIVE="$(git -C "$PROJECT_ROOT" rev-parse --show-prefix)"

cd "$REPO_ROOT"

echo "== Proyecto =="
echo "${PROJECT_RELATIVE%/}"
echo

echo "== Estado del proyecto =="
git status --short -- "$PROJECT_RELATIVE"
echo

echo "== Ultimos commits del repo raiz =="
git log --oneline --decorate -5 -- "$PROJECT_RELATIVE"
