import { ok, safeJson, localMarket, scoreFrom } from './_lib.js';

const IDS = 'bitcoin,ethereum,binancecoin,ripple,solana,chainlink,avalanche-2,near,render-token,ondo-finance,arbitrum,optimism';
const BINANCE = ['BTCUSDT','ETHUSDT','BNBUSDT','XRPUSDT','SOLUSDT','LINKUSDT','AVAXUSDT','NEARUSDT'];

function normalizeAnyRows(data) {
  const root = data?.data?.data ?? data?.data ?? data;
  const list = Array.isArray(root) ? root : (root?.list || root?.items || root?.records || root?.data || []);
  if (!Array.isArray(list)) return [];
  return list.slice(0, 18).map((row, i) => {
    const symbol = String(row.symbol || row.tokenSymbol || row.ticker || row.baseSymbol || row.coin || row.name || `ASSET${i}`).toUpperCase();
    const name = row.name || row.tokenName || row.projectName || row.fullName || symbol;
    const price = Number(row.current_price ?? row.price ?? row.lastPrice ?? row.close ?? row.value ?? row.nav ?? 0);
    const change = Number(row.price_change_percentage_24h ?? row.change24h ?? row.change ?? row.pctChange ?? row.priceChangePercent ?? 0);
    const volume = Number(row.total_volume ?? row.volume ?? row.quoteVolume ?? row.amount ?? row.marketVolume ?? 0);
    const marketCap = Number(row.market_cap ?? row.marketCap ?? row.fdv ?? row.circulatingMarketCap ?? volume * 10 ?? 0);
    return { id: row.id || symbol, name, symbol, price, marketCap, volume, change24h: change, sparkline: row.sparkline_in_7d?.price || row.sparkline || [], score: Number(row.score || scoreFrom(change, 76)), route: 'SoSoValue' };
  }).filter((row) => row.symbol && (row.price || row.volume || row.marketCap));
}

function normalizeCoinGecko(rows = []) {
  return rows.map((coin) => ({
    id: coin.id,
    name: coin.name,
    symbol: String(coin.symbol || '').toUpperCase(),
    price: coin.current_price,
    marketCap: coin.market_cap,
    volume: coin.total_volume,
    change24h: coin.price_change_percentage_24h,
    sparkline: coin.sparkline_in_7d?.price || [],
    score: scoreFrom(coin.price_change_percentage_24h, 76),
    route: 'CoinGecko'
  }));
}

function normalizeBinance(rows = []) {
  return rows.map((row) => ({
    id: row.symbol,
    name: row.symbol.replace('USDT', ''),
    symbol: row.symbol.replace('USDT', ''),
    price: Number(row.lastPrice),
    marketCap: Number(row.quoteVolume) * 10,
    volume: Number(row.quoteVolume),
    change24h: Number(row.priceChangePercent),
    sparkline: [],
    score: scoreFrom(row.priceChangePercent, 72),
    route: 'Binance'
  }));
}

async function trySoSoValue(req) {
  const apiKey = process.env.SOSOVALUE_API_KEY;
  if (!apiKey) return null;
  const base = (process.env.SOSOVALUE_BASE_URL || 'https://openapi.sosovalue.com/openapi/v1').replace(/\/+$/, '');
  const path = process.env.SOSOVALUE_MARKET_PATH || '/token/market/list';
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  const data = await safeJson(url, { headers: { 'x-soso-api-key': apiKey, 'X-SOSO-API-KEY': apiKey }, timeout: 8500 });
  const rows = normalizeAnyRows(data);
  return rows.length ? { source: 'SoSoValue API', rows } : null;
}

export default async function handler(req, res) {
  try {
    const soso = await trySoSoValue(req);
    if (soso) return ok(res, { ok: true, ...soso });
  } catch {}

  try {
    const cg = await safeJson(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${IDS}&order=market_cap_desc&per_page=12&page=1&sparkline=true&price_change_percentage=24h`);
    return ok(res, { ok: true, source: 'CoinGecko', rows: normalizeCoinGecko(cg) });
  } catch {
    try {
      const bn = await safeJson(`https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(BINANCE))}`);
      return ok(res, { ok: true, source: 'Binance', rows: normalizeBinance(bn) });
    } catch {
      return ok(res, { ok: true, source: 'Local Market Cache', rows: localMarket.map((x) => ({ ...x, symbol: x.symbol.toUpperCase(), price: x.current_price, marketCap: x.market_cap, volume: x.total_volume, change24h: x.price_change_percentage_24h })) });
    }
  }
}
