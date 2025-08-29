#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
UP="$ROOT/upstream/claude-sub-agent"

if [ -d "$UP/.git" ]; then
  echo "Submodule already present at $UP"
else
  mkdir -p "$ROOT/upstream"
  git submodule add https://github.com/zhsama/claude-sub-agent.git upstream/claude-sub-agent
  echo "Added claude-sub-agent as submodule."
fi

echo "Now run: bash scripts/agents/sync.sh"