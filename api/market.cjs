const fallback = [
  { symbol:'SOL', name:'Solana', price:156.82, change:7.24, volume:3.12e9, marketCap:72.3e9, color:'#7c3aed' },
  { symbol:'ETH', name:'Ethereum', price:3472.56, change:4.13, volume:18.45e9, marketCap:417.2e9, color:'#6474ff' },
  { symbol:'ARB', name:'Arbitrum', price:1.164, change:6.87, volume:1.28e9, marketCap:4.6e9, color:'#2d9cdb' },
  { symbol:'LINK', name:'Chainlink', price:16.42, change:5.45, volume:842.31e6, marketCap:9.7e9, color:'#2563eb' },
  { symbol:'UNI', name:'Uniswap', price:9.18, change:3.92, volume:556.22e6, marketCap:5.4e9, color:'#ff4db8' },
  { symbol:'BTC', name:'Bitcoin', price:67420.12, change:2.31, volume:34.21e9, marketCap:1.33e12, color:'#f59e0b' }
];
exports.handler = async()=>{try{const ids='bitcoin,ethereum,solana,arbitrum,chainlink,uniswap';const r=await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`);const d=await r.json();if(Array.isArray(d)&&d.length){return {statusCode:200,body:JSON.stringify({data:d.map(x=>({symbol:String(x.symbol).toUpperCase(),name:x.name,price:x.current_price,change:x.price_change_percentage_24h,volume:x.total_volume,marketCap:x.market_cap,color:'#2563ff'}))})}}}catch(e){}return {statusCode:200,body:JSON.stringify({data:fallback})}}
