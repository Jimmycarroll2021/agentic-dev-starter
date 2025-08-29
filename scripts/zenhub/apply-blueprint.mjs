/**
 * Applies parts of zenhub/blueprint.yml to the current GitHub repository:
 * - Ensures labels exist
 * - Creates an "Epic" issue and its child issues
 * 
 * Notes:
 * - Uses the GitHub REST API via fetch. Requires GITHUB_TOKEN in CI (Actions provides it).
 * - Pipelines and estimates are left to Zenhub UI/API (account-specific). This script
 *   focuses on GitHub resources that are stable across accounts.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blueprintPath = path.join(__dirname, '../../zenhub/blueprint.yml');
if (!fs.existsSync(blueprintPath)) {
  console.error('blueprint.yml not found at', blueprintPath);
  process.exit(1);
}
const blueprint = YAML.parse(fs.readFileSync(blueprintPath, 'utf8'));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.GITHUB_PAT;
if (!GITHUB_TOKEN) {
  console.error('GITHUB_TOKEN not set. In GitHub Actions this is provided automatically.');
  process.exit(1);
}

const repoEnv = process.env.GITHUB_REPOSITORY; // e.g. "owner/repo" in Actions
let owner, repo;
if (repoEnv) {
  [owner, repo] = repoEnv.split('/');
} else {
  console.error('GITHUB_REPOSITORY not set. Run inside GitHub Actions, or set OWNER and REPO env vars.');
  owner = process.env.OWNER;
  repo = process.env.REPO;
  if (!owner || !repo) process.exit(1);
}

const gh = async (method, url, body) => {
  const res = await fetch(`https://api.github.com${url}`, {
    method,
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${url} failed: ${res.status} ${res.statusText} :: ${text}`);
  }
  return await res.json();
};

async function ensureLabels(labels) {
  const existing = await gh('GET', `/repos/${owner}/${repo}/labels?per_page=100`);
  const existingNames = new Set(existing.map(l => l.name.toLowerCase()));
  
  for (const name of labels) {
    const lower = name.toLowerCase();
    if (!existingNames.has(lower)) {
      await gh('POST', `/repos/${owner}/${repo}/labels`, {
        name,
        color: 'ededed',
        description: 'Managed by blueprint'
      }).catch(e => {
        console.warn(`Label ${name} creation warning: ${e.message}`);
      });
    }
  }
}

async function createIssue(title, body, labels = []) {
  const res = await gh('POST', `/repos/${owner}/${repo}/issues`, {
    title, body, labels
  });
  return res;
}

async function run() {
  console.log(`Applying blueprint to ${owner}/${repo}`);
  
  // 1) Ensure labels (include required defaults)
  const labelList = [
    ...(blueprint.labels || []),
    'epic', 'type:feature', 'type:bug', 'phase:planning',
    'phase:development', 'phase:validation', 'quality-gate:passed', 'quality-gate:failed'
  ];
  await ensureLabels([...new Set(labelList)]);
  console.log('Labels ensured.');
  
  // 2) Create Epic(s) and child issues
  const epics = blueprint.epics || [];
  for (const epic of epics) {
    const epicTitle = epic.title || 'Epic';
    const epicDesc = epic.description || '';
    const epicIssue = await createIssue(
      `${epicTitle} (EPIC)`,
      `${epicDesc}\n\n> Convert this issue into a Zenhub Epic in the Zenhub UI.`,
      ['epic', 'type:feature']
    );
    console.log(`Epic issue created: #${epicIssue.number}`);
    
    if (Array.isArray(epic.children)) {
      for (const child of epic.children) {
        if (typeof child !== 'string') continue;
        const childIssue = await createIssue(
          child,
          `Part of Epic #${epicIssue.number}\n\nAcceptance Criteria:\n- [ ] `,
          ['type:feature', 'phase:planning']
        );
        console.log(`  Child issue created: #${childIssue.number}`);
      }
    }
  }
  
  console.log('Blueprint application completed.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});