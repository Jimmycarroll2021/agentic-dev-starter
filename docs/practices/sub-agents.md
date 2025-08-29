# Sub-agent practices (field-tested)

## Core principles

- **Short, role-clean prompts**; one artefact per hand-off.

- **Explicit gates** between phases. Define pass/fail criteria.

- **Artefact contract** that the next phase consumes.

- **Parallel exploration** for risky tasks (use Crystal to run 2–3 alternatives).

- **Time-box agent runs**. Prefer iteration over single large prompts.

## Quality gates

Each phase should produce specific outputs:

- **Planning**: requirements.md, architecture.md, tasks.md
- **Development**: working code + tests
- **Validation**: test results, acceptance criteria verification

## Hand-off protocol

1. Agent completes phase and produces artefacts
2. Human reviews artefacts against quality gate criteria
3. If passed: commit artefacts and move to next phase
4. If failed: iterate with agent or reassign