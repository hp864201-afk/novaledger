import { ok, safeJson, localProtocols, scoreFrom } from './_lib.js';

export default async function handler(req, res) {
  try {
    const data = await safeJson('https://api.llama.fi/protocols');
    const rows = data
      .filter((p) => Number(p.tvl) > 100000000)
      .sort((a, b) => Number(b.tvl) - Number(a.tvl))
      .slice(0, 14)
      .map((p) => ({
        name: p.name,
        category: p.category || 'Protocol',
        chain: p.chain || p.chains?.[0] || 'Multi-chain',
        tvl: Number(p.tvl || 0),
        change1d: Number(p.change_1d || 0),
        change7d: Number(p.change_7d || 0),
        score: scoreFrom(p.change_7d, 72),
        url: p.url || '#'
      }));
    return ok(res, { ok: true, source: 'DefiLlama', rows });
  } catch {
    return ok(res, { ok: true, source: 'Local DeFi Cache', rows: localProtocols.map((p) => ({ ...p, change1d: p.change_1d, change7d: p.change_7d, score: scoreFrom(p.change_7d, 72) })) });
  }
}
