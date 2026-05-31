const { ok, getJson, normMarket, fallbackMarket } = require('./_common.cjs');
exports.handler = async function(){
 const key=process.env.SOSOVALUE_API_KEY; const base=(process.env.SOSOVALUE_BASE_URL||'https://openapi.sosovalue.com/openapi/v1').replace(/\/+$/,''); const path=process.env.SOSOVALUE_MARKET_PATH||'/token/market/list';
 if(key){try{const d=await getJson(`${base}${path}`,{headers:{'x-soso-api-key':key,'X-SOSO-API-KEY':key}}); const arr=d?.data?.list||d?.data?.data||d?.data||d?.list||[]; if(Array.isArray(arr)&&arr.length)return ok({source:'primary',data:normMarket(arr)});}catch(e){}}
 try{const cg=await getJson('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,binancecoin,ripple,chainlink,arbitrum,uniswap&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h');return ok({source:'market',data:normMarket(cg)});}catch(e){}
 try{const s=encodeURIComponent(JSON.stringify(['BTCUSDT','ETHUSDT','SOLUSDT','BNBUSDT','XRPUSDT','LINKUSDT']));const b=await getJson(`https://api.binance.com/api/v3/ticker/24hr?symbols=${s}`);return ok({source:'exchange',data:normMarket(b)});}catch(e){}
 return ok({source:'resilience',data:fallbackMarket});
}
