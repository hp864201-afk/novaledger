const fallbackMarket = [
  { symbol: 'BTC', name: 'Bitcoin', price: 69678.25, change: 1.32, volume: 32410000000, marketCap: 1370000000000, score: 94 },
  { symbol: 'ETH', name: 'Ethereum', price: 3827.65, change: 2.18, volume: 18730000000, marketCap: 460120000000, score: 91 },
  { symbol: 'SOL', name: 'Solana', price: 181.46, change: -0.84, volume: 3210000000, marketCap: 86320000000, score: 82 },
  { symbol: 'BNB', name: 'BNB', price: 606.38, change: 0.63, volume: 1670000000, marketCap: 88460000000, score: 79 },
  { symbol: 'XRP', name: 'XRP', price: 0.5284, change: -1.21, volume: 1090000000, marketCap: 29450000000, score: 72 },
  { symbol: 'LINK', name: 'Chainlink', price: 16.42, change: 5.45, volume: 842310000, marketCap: 10240000000, score: 88 },
  { symbol: 'ARB', name: 'Arbitrum', price: 1.164, change: 6.87, volume: 1280000000, marketCap: 4300000000, score: 86 },
  { symbol: 'UNI', name: 'Uniswap', price: 9.18, change: 3.92, volume: 556220000, marketCap: 6310000000, score: 84 }
];
const fallbackDefi = [
  { name: 'Lido', category: 'Liquid Staking', tvl: 24130000000, change_1d: 3.21 },
  { name: 'Aave', category: 'Lending', tvl: 12470000000, change_1d: 2.05 },
  { name: 'Maker', category: 'CDP', tvl: 7820000000, change_1d: -0.61 },
  { name: 'Uniswap', category: 'DEX', tvl: 6310000000, change_1d: 1.48 },
  { name: 'Curve', category: 'DEX', tvl: 4170000000, change_1d: 0.97 }
];
const fallbackNews = [
  { title: 'Bitcoin volume accelerates as market breadth improves', source: 'NovaLedger Signals', sentiment: 'Bullish' },
  { title: 'Ethereum staking metrics remain strong across liquid staking protocols', source: 'NovaLedger Signals', sentiment: 'Bullish' },
  { title: 'DeFi TVL expands as lending and DEX activity recovers', source: 'NovaLedger Signals', sentiment: 'Neutral' },
  { title: 'Layer 2 ecosystems show renewed developer activity', source: 'NovaLedger Signals', sentiment: 'Bullish' }
];
const ok = (body) => ({ statusCode: 200, headers: {'content-type':'application/json','cache-control':'no-store'}, body: JSON.stringify(body) });
async function getJson(url, options={}){ const r=await fetch(url,{...options,headers:{accept:'application/json',...(options.headers||{})}}); if(!r.ok) throw new Error('bad'); return r.json(); }
function normMarket(rows=[]){ return rows.map(x=>({symbol:String(x.symbol||x.tokenSymbol||'ASSET').replace('USDT','').toUpperCase(),name:x.name||x.tokenName||String(x.symbol||'Asset').replace('USDT',''),price:Number(x.current_price??x.price??x.lastPrice??0),change:Number(x.price_change_percentage_24h??x.change24h??x.priceChangePercent??0),volume:Number(x.total_volume??x.volume??x.quoteVolume??0),marketCap:Number(x.market_cap??x.marketCap??0),score:Math.round(70+Math.max(-10,Math.min(20,Number(x.price_change_percentage_24h??x.priceChangePercent??0)*2)))})); }
module.exports={fallbackMarket,fallbackDefi,fallbackNews,ok,getJson,normMarket};
