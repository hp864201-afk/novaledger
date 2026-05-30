export function ok(res, data, status = 200) {
  res.status(status).setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 's-maxage=60, stale-while-revalidate=300');
  res.end(JSON.stringify(data));
}

export async function safeJson(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeout || 9000);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        accept: 'application/json',
        'user-agent': 'Wave2-Web3-API-Portal/1.0',
        ...(options.headers || {})
      }
    });
    const text = await response.text();
    let json;
    try { json = JSON.parse(text); } catch { json = { raw: text }; }
    if (!response.ok) {
      const err = new Error(`upstream_${response.status}`);
      err.status = response.status;
      err.data = json;
      throw err;
    }
    return json;
  } finally {
    clearTimeout(timer);
  }
}

export const localMarket = [
  { id:'bitcoin', name:'Bitcoin', symbol:'btc', current_price:73537.34, market_cap:1470000000000, total_volume:34200000000, price_change_percentage_24h:-0.33, score:88 },
  { id:'ethereum', name:'Ethereum', symbol:'eth', current_price:2015.22, market_cap:243400000000, total_volume:13300000000, price_change_percentage_24h:-0.17, score:82 },
  { id:'binancecoin', name:'BNB', symbol:'bnb', current_price:667.38, market_cap:89900000000, total_volume:1100000000, price_change_percentage_24h:4.59, score:91 },
  { id:'ripple', name:'XRP', symbol:'xrp', current_price:1.34, market_cap:83400000000, total_volume:2360000000, price_change_percentage_24h:2.06, score:79 },
  { id:'solana', name:'Solana', symbol:'sol', current_price:182.34, market_cap:86500000000, total_volume:2430000000, price_change_percentage_24h:0.15, score:77 },
  { id:'chainlink', name:'Chainlink', symbol:'link', current_price:19.14, market_cap:9140000000, total_volume:321700000, price_change_percentage_24h:1.23, score:75 },
  { id:'avalanche-2', name:'Avalanche', symbol:'avax', current_price:24.16, market_cap:10020000000, total_volume:430000000, price_change_percentage_24h:-0.84, score:71 },
  { id:'near', name:'NEAR Protocol', symbol:'near', current_price:3.12, market_cap:3780000000, total_volume:212000000, price_change_percentage_24h:3.42, score:84 }
];

export const localProtocols = [
  { name:'Aave', category:'Lending', chain:'Ethereum', tvl:20500000000, change_1d:0.8, change_7d:2.3 },
  { name:'Lido', category:'Liquid Staking', chain:'Ethereum', tvl:33400000000, change_1d:-0.2, change_7d:1.1 },
  { name:'Uniswap', category:'Dexes', chain:'Ethereum', tvl:5100000000, change_1d:1.7, change_7d:5.1 },
  { name:'Pendle', category:'Yield', chain:'Ethereum', tvl:4200000000, change_1d:2.5, change_7d:8.3 },
  { name:'Jito', category:'Liquid Staking', chain:'Solana', tvl:2700000000, change_1d:1.1, change_7d:3.2 },
  { name:'Ethena', category:'Stablecoin', chain:'Ethereum', tvl:5900000000, change_1d:-1.4, change_7d:4.9 }
];

export const localNews = [
  { title:'ETF flow watch: crypto markets price in fresh institutional demand', source:'Market Desk', url:'#', sentiment:72 },
  { title:'DeFi protocols compete on stablecoin yield and liquidity incentives', source:'DeFi Radar', url:'#', sentiment:66 },
  { title:'AI x Web3 apps gain traction among hackathon builders', source:'Builder Feed', url:'#', sentiment:78 },
  { title:'Layer 2 ecosystems expand incentives for consumer crypto apps', source:'Chain Watch', url:'#', sentiment:69 }
];

export function scoreFrom(value, base = 70) {
  const n = Number(value || 0);
  return Math.max(30, Math.min(98, Math.round(base + n * 2)));
}
