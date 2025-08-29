# Crystal preset

## Overview

[Stravu Crystal](https://github.com/stravu/crystal) is an Electron app that allows you to run multiple Claude Code sessions in parallel using git worktrees, with built-in diff viewing and rebase/squash capabilities.

## Setup

1. Install Crystal:
   ```bash
   # macOS
   brew install --cask stravu-crystal
   
   # Or download from GitHub releases
   ```

2. Open this repository in Crystal and use the preset in `project.settings.json`.

## Suggested workflow

1. **Create 2–3 sessions** for the same Epic (different approaches).

2. **Use the diff viewer** to compare outputs; run `webapp:devTest` run-script.

3. **Squash & rebase** the winning path to main.

## Run scripts

- `webapp:devTest` - Runs the example webapp tests

## Environment variables

- `CLAUDE_CODE_USE_BEDROCK` - Set to "1" to use Amazon Bedrock
- `AWS_REGION` - AWS region for Bedrock (defaults to eu-west-2)

## Benefits for agentic development

- **Parallel exploration**: Test multiple sub-agent approaches simultaneously
- **Clean history**: Squash and rebase winning approaches
- **Testing integration**: Run tests across different approaches before merging
- **Isolation**: Each session has its own git worktree