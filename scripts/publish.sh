#!/usr/bin/env bash

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO_ROOT="$(git -C "$PROJECT_ROOT" rev-parse --show-toplevel)"
PROJECT_RELATIVE="$(git -C "$PROJECT_ROOT" rev-parse --show-prefix)"
REMOTE_NAME="tiendaonlinealmamater"
BRANCH_NAME="main"

if [ "${1:-}" = "" ]; then
  echo "Uso: ./scripts/publish.sh \"mensaje del commit\""
  exit 1
fi

COMMIT_MESSAGE="$1"

cd "$REPO_ROOT"

if ! git remote get-url "$REMOTE_NAME" >/dev/null 2>&1; then
  echo "No existe el remote '$REMOTE_NAME'."
  exit 1
fi

if [ -n "$(git status --porcelain -- "$PROJECT_RELATIVE")" ]; then
  git add -- "$PROJECT_RELATIVE"

  if ! git diff --cached --quiet -- "$PROJECT_RELATIVE"; then
    git commit -m "$COMMIT_MESSAGE"
  fi
fi

git subtree push --prefix="$PROJECT_RELATIVE" "$REMOTE_NAME" "$BRANCH_NAME"
