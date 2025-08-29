# Zenhub automation notes

This starter includes `scripts/zenhub/apply-blueprint.mjs`, which:

- Reads `zenhub/blueprint.yml`
- Ensures GitHub labels exist
- Creates seed issues (including the top-level Epic issue(s))

You can then convert the Epic issues into Zenhub Epics in the Zenhub UI.
Once your Zenhub GraphQL schema and workspace IDs are known, you can extend
the script to automate pipeline creation and estimates via the Zenhub API.