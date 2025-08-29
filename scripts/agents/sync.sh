#!/usr/bin/env bash
set -euo pipefail

# Sync the upstream claude-sub-agent content into .claude/ for local use.
# We do not commit upstream code by default.

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
UP="$ROOT/upstream/claude-sub-agent"

if [ ! -d "$UP/.git" ]; then
  echo "Upstream submodule not found. Run scripts/setup.sh first."
  exit 1
fi

echo "Updating submodule to latest remote..."
git submodule update --init --remote upstream/claude-sub-agent

mkdir -p "$ROOT/.claude/agents" "$ROOT/.claude/commands"

if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete "$UP/agents/" "$ROOT/.claude/agents/" || true
  rsync -a "$UP/commands/" "$ROOT/.claude/commands/" || true
else
  echo "rsync not found; falling back to cp."
  rm -rf "$ROOT/.claude/agents" && mkdir -p "$ROOT/.claude/agents"
  cp -R "$UP/agents/." "$ROOT/.claude/agents/" || true
  cp -R "$UP/commands/." "$ROOT/.claude/commands/" || true
fi

echo "Synced Claude agents & commands into .claude/"