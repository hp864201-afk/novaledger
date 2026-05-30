import { ok, safeJson, localNews } from './_lib.js';

function normalizeSoSoNews(data) {
  const root = data?.data?.data ?? data?.data ?? data;
  const list = Array.isArray(root) ? root : (root?.list || root?.items || root?.records || root?.data || []);
  if (!Array.isArray(list)) return [];
  return list.slice(0, 8).map((n, i) => ({
    title: n.title || n.newsTitle || n.name || 'Market signal update',
    source: n.source || n.sourceName || n.author || 'SoSoValue',
    url: n.url || n.link || '#',
    publishedAt: n.publishedAt || n.publishTime || n.time || null,
    sentiment: Number(n.sentiment || n.score || (72 - i * 2))
  })).filter((n) => n.title);
}

async function trySoSoValueNews() {
  const apiKey = process.env.SOSOVALUE_API_KEY;
  if (!apiKey) return null;
  const base = (process.env.SOSOVALUE_BASE_URL || 'https://openapi.sosovalue.com/openapi/v1').replace(/\/+$/, '');
  const path = process.env.SOSOVALUE_NEWS_PATH || '/news/list';
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  const data = await safeJson(url, { headers: { 'x-soso-api-key': apiKey, 'X-SOSO-API-KEY': apiKey }, timeout: 8500 });
  const rows = normalizeSoSoNews(data);
  return rows.length ? rows : null;
}

export default async function handler(req, res) {
  try {
    const rows = await trySoSoValueNews();
    if (rows) return ok(res, { ok: true, source: 'SoSoValue News', rows });
  } catch {}

  try {
    const data = await safeJson('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
    const rows = (data.Data || []).slice(0, 8).map((n, i) => ({
      title: n.title,
      source: n.source_info?.name || n.source || 'CryptoCompare',
      url: n.url,
      publishedAt: n.published_on ? new Date(n.published_on * 1000).toISOString() : null,
      sentiment: 60 + (i % 5) * 6
    }));
    return ok(res, { ok: true, source: 'CryptoCompare News', rows });
  } catch {
    try {
      const trend = await safeJson('https://api.coingecko.com/api/v3/search/trending');
      const rows = (trend.coins || []).slice(0, 8).map(({ item }, i) => ({
        title: `${item.name} is trending across crypto search`,
        source: 'CoinGecko Trending',
        url: `https://www.coingecko.com/en/coins/${item.id}`,
        publishedAt: null,
        sentiment: 76 - i * 3
      }));
      return ok(res, { ok: true, source: 'CoinGecko Trending', rows });
    } catch {
      return ok(res, { ok: true, source: 'Local News Cache', rows: localNews });
    }
  }
}
