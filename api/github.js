import { ok, safeJson } from './_lib.js';

const DEFAULT_REPOS = ['ethereum/solidity', 'Uniswap/v4-core', 'aave/aave-v3-core', 'defillama/defillama-app'];

export default async function handler(req, res) {
  const repoParam = req.query?.repo;
  const repos = repoParam ? String(repoParam).split(',').map((x) => x.trim()).filter(Boolean).slice(0, 4) : DEFAULT_REPOS;
  const rows = [];
  for (const repo of repos) {
    try {
      const data = await safeJson(`https://api.github.com/repos/${repo}`);
      rows.push({
        repo,
        name: data.full_name,
        stars: data.stargazers_count,
        forks: data.forks_count,
        issues: data.open_issues_count,
        language: data.language || 'Code',
        updatedAt: data.updated_at,
        url: data.html_url,
        score: Math.min(98, Math.round(60 + Math.log10((data.stargazers_count || 1)) * 8))
      });
    } catch {
      rows.push({ repo, name: repo, stars: 0, forks: 0, issues: 0, language: 'Code', updatedAt: null, url: '#', score: 60 });
    }
  }
  ok(res, { ok: true, source: 'GitHub REST API', rows });
}
