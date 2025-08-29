# Agentic Dev Starter

A ready-to-fork repository that combines:

- **Claude Sub-Agent** (as a git submodule) for a structured planning → build → validate workflow.
- A clean set of **Zenhub** boards, labels and starter epics, wired through GitHub Actions.
- An optional **Crystal** preset to run multiple Claude Code sessions in parallel (via git worktrees).

> **Note on licensing**: We reference `zhsama/claude-sub-agent` as a **git submodule** and do **not** re-distribute its files here. You will clone and sync it locally. This avoids licensing issues if the upstream does not provide a permissive license.

---

## Quick start

**Prerequisites**

- Node.js 18+ (for the helper script)
- GitHub account and repository
- (Optional) [GitHub CLI](https://cli.github.com) for convenience (`gh`)
- Zenhub account and the GitHub browser extension *or* Zenhub web app
- Claude Code (or similar) locally
- (Optional) Crystal app for parallel sessions

**1) Create a new GitHub repo and push this scaffold**

```bash
# If using git directly:
git init
git add .
git commit -m "chore: bootstrap agentic dev starter"
git remote add origin https://github.com/<your-org>/<your-repo>.git
git push -u origin main

# Or using GitHub CLI:
gh repo create <your-org>/<your-repo> --source=. --public --push
```

**2) Add the Claude Sub-Agent upstream and sync to .claude/**

```bash
# Adds upstream as a submodule (tracked reference, not copied files)
bash scripts/setup.sh

# This populates .claude/agents and .claude/commands locally (not committed)
bash scripts/agents/sync.sh
```

**3) Set up Zenhub**

1. Install the [Zenhub extension](https://www.zenhub.com/extension) or open the [Zenhub web app](https://app.zenhub.com).

2. Create a Workspace and add your GitHub repo.

3. In GitHub, add a repo secret named `ZENHUB_API_TOKEN` (optional, used for future API work).

4. Trigger the **Apply Zenhub Blueprint** workflow in Actions (manual run).
   - This will create labels and seed epic/issues on the GitHub side. 
   - You can then convert the created Epic issue(s) into Zenhub Epics in the UI.

5. Pipelines are defined in `zenhub/blueprint.yml`. You can mirror them in Zenhub's UI in seconds. Programmatic pipeline creation differs between accounts; the script focuses on GitHub resources (labels/issues) which are stable and reliable.

**4) Start building with the sub-agents**

In Claude Code, run the `/agent-workflow` command from `.claude/commands/` against `examples/webapp` (or your own project).

Commit agent artefacts to `docs/` for traceability before moving Zenhub pipeline state.

**5) (Optional) Use Crystal to explore alternatives in parallel**

Open the repo in Crystal and use the preset in `crystal/project.settings.json`.

Spin up 2–3 sessions, compare diffs/tests, then squash & rebase the winning path to main.

---

## Repository layout

```
.
├─ .github/
│  ├─ ISSUE_TEMPLATE/               # Zenhub-aligned issue forms
│  └─ workflows/
│     ├─ zenhub-apply.yml           # Applies blueprint labels & seed issues
│     └─ agents-sync.yml            # Nightly sync of upstream sub-agents into .claude/, opens PR
├─ .claude/                         # Local-only agent files (synced from submodule)
│  └─ .gitkeep
├─ crystal/
│  ├─ project.settings.json
│  └─ README.md
├─ docs/
│  ├─ playbooks/agentic-dev.md
│  ├─ practices/sub-agents.md
│  └─ governance/
│     ├─ ai-usage.md
│     └─ dpia-template.md
├─ examples/
│  └─ webapp/
│     ├─ package.json
│     ├─ tests/smoke.mjs
│     └─ README.md
├─ scripts/
│  ├─ setup.sh
│  ├─ agents/sync.sh
│  └─ zenhub/
│     ├─ apply-blueprint.mjs
│     └─ README.md
├─ zenhub/
│  └─ blueprint.yml
├─ .gitignore
├─ LICENSE
└─ package.json
```

## Key workflows

### Issue Templates

- **Story** - User stories with acceptance criteria and story points
- **Bug** - Bug reports with reproduction steps
- **Tech Debt** - Technical improvements
- **Documentation** - Documentation tasks
- **Agent Session** - Capture agent runs and their artefacts

### GitHub Actions

- **zenhub-apply.yml** - Applies labels and creates seed issues from `zenhub/blueprint.yml`
- **agents-sync.yml** - Nightly sync of upstream claude-sub-agent, opens PR with changes

### Scripts

- **scripts/setup.sh** - Adds the claude-sub-agent submodule
- **scripts/agents/sync.sh** - Syncs upstream content into `.claude/`
- **scripts/zenhub/apply-blueprint.mjs** - Applies Zenhub blueprint via GitHub API

## Documentation

- **docs/playbooks/** - Step-by-step workflow guides
- **docs/practices/** - Field-tested sub-agent practices
- **docs/governance/** - AI usage policies and DPIA templates

## Example usage

1. **Create an Epic** in Zenhub from the seeded issues
2. **Run the agent workflow**:
   ```bash
   # In Claude Code
   /agent-workflow "Build a task management web app with user authentication"
   ```
3. **Review artefacts** (requirements.md, architecture.md, tasks.md, test-plan.md)
4. **Move through phases**: Planning → Development → Validation
5. **Commit artefacts** to `docs/YYYY-MM-DD/<issue-number>/` for audit trail

## Crystal integration (optional)

Crystal enables parallel development with isolated git worktrees:

1. Install Crystal: `brew install --cask stravu-crystal`
2. Open this repo in Crystal
3. Create 2-3 sessions for different approaches
4. Use run-scripts to test each approach
5. Compare diffs and squash/rebase the winning solution

## Notes

- The **agents-sync workflow** opens a PR with any updates pulled from the submodule into `.claude/`. We ignore `.claude/` in `.gitignore` to avoid accidentally committing third-party content; the PR step explicitly commits only generated metadata if you decide to include it.

- The **apply-blueprint script** creates GitHub labels and seed issues defined in `zenhub/blueprint.yml`. Converting issues to Zenhub Epics is a one-click UI step (or can be automated later with Zenhub GraphQL once your account schema is confirmed).

## License

MIT. See LICENSE.