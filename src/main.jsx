import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BarChart3, Bell, BookOpen, CheckSquare, ChevronRight, Database, FileText, Flame, Github, Home, LineChart, Menu, Moon, RefreshCw, Search, Settings, ShieldCheck, Sparkles, TrendingUp, WalletCards, Zap } from 'lucide-react';
import './styles.css';

const fallbackMarket = [
  { symbol:'SOL', name:'Solana', price:156.82, change:7.24, volume:3.12e9, marketCap:72.3e9, color:'#7c3aed' },
  { symbol:'ETH', name:'Ethereum', price:3472.56, change:4.13, volume:18.45e9, marketCap:417.2e9, color:'#6474ff' },
  { symbol:'ARB', name:'Arbitrum', price:1.164, change:6.87, volume:1.28e9, marketCap:4.6e9, color:'#2d9cdb' },
  { symbol:'LINK', name:'Chainlink', price:16.42, change:5.45, volume:842.31e6, marketCap:9.7e9, color:'#2563eb' },
  { symbol:'UNI', name:'Uniswap', price:9.18, change:3.92, volume:556.22e6, marketCap:5.4e9, color:'#ff4db8' },
  { symbol:'BTC', name:'Bitcoin', price:67420.12, change:2.31, volume:34.21e9, marketCap:1.33e12, color:'#f59e0b' }
];
const fallbackDefi = [
  { protocol:'Lido', tvl:24.13e9, change:3.21, icon:'💧' }, { protocol:'Aave', tvl:12.47e9, change:2.05, icon:'🌈' }, { protocol:'Maker', tvl:7.82e9, change:-0.61, icon:'Ⓜ' }, { protocol:'Uniswap', tvl:6.31e9, change:1.48, icon:'🦄' }, { protocol:'Curve', tvl:4.17e9, change:0.97, icon:'🌈' }
];
const fallbackNews = [
  { title:'BTC breaks key resistance as market liquidity improves', source:'Market Desk', time:'10 min ago', token:'₿', accent:'#f59e0b' },
  { title:'Ethereum staking demand rises after mainnet upgrade', source:'Protocol Watch', time:'28 min ago', token:'◆', accent:'#6474ff' },
  { title:'Arbitrum DAO approves ecosystem growth proposal', source:'Governance Feed', time:'52 min ago', token:'↗', accent:'#2d9cdb' },
  { title:'Solana DeFi volume climbs after network update', source:'DeFi Signal', time:'1h ago', token:'S', accent:'#111827' }
];
const chartPoints = [2.04,2.12,2.22,2.08,2.19,2.18,2.31,2.49,2.36,2.19,2.42,2.51,2.45,2.38,2.50,2.67,2.61,2.48];
const tvlPoints = [82,84,85,86,87,86,88,90,91,90,92,94,93,95,98,99,101,103];
const onchainCards = [
  ['Active wallets (24h)', '1.24M', '+6.18%', '💠'], ['Transactions (24h)', '3.67M', '+4.73%', '🔁'], ['New addresses', '156.2K', '+9.14%', '👥'], ['Stablecoin cap', '$153.8B', '+1.26%', '🪙']
];

const en = {
  nav:['Overview','Market','DeFi TVL','Repo Health','News','Tasks','Documents','Settings'],
  title:'NovaLedger Overview', sub:'Real-time market, DeFi, on-chain and builder metrics in one intelligence dashboard.',
  search:'Search token, protocol, API, task...', updated:'Updated', pro:'NovaLedger Pro', proText:'API connected • Real-time on-chain data • Smart insight', upgrade:'Upgrade', system:'System', healthy:'Operational', marketCap:'Crypto Market Cap', volume:'24h Volume', defi:'DeFi TVL', dominance:'BTC Dominance', gas:'Ethereum Gas', chart:'Market Movement', days:'7 days', topDefi:'Top DeFi Protocol', news:'Hot News', gainers:'Top Gainers', repo:'Repo Health', onchain:'On-chain Overview', view:'View all', statusGood:'Good activity', warn:'Watchlist', risk:'Risk', all:'All good'
};
const zh = {
  nav:['概览','市场','DeFi TVL','代码健康','新闻','任务','文档','设置'],
  title:'NovaLedger 总览', sub:'实时跟踪市场、DeFi、链上与构建者指标。',
  search:'搜索代币、协议、API、任务...', updated:'更新时间', pro:'NovaLedger Pro', proText:'API 已连接 • 实时链上数据 • 智能洞察', upgrade:'升级', system:'系统', healthy:'运行正常', marketCap:'加密总市值', volume:'24小时成交量', defi:'DeFi TVL', dominance:'BTC 占比', gas:'以太坊 Gas', chart:'市场波动', days:'7天', topDefi:'Top DeFi 协议', news:'热门新闻', gainers:'24小时涨幅榜', repo:'代码仓库健康', onchain:'链上总览', view:'查看全部', statusGood:'活跃良好', warn:'警告', risk:'风险', all:'全部正常'
};

function fmtUsd(n){ n=Number(n)||0; if(n>=1e12)return `$${(n/1e12).toFixed(2)}T`; if(n>=1e9)return `$${(n/1e9).toFixed(2)}B`; if(n>=1e6)return `$${(n/1e6).toFixed(2)}M`; if(n>=1)return `$${n.toLocaleString(undefined,{maximumFractionDigits:2})}`; return `$${n.toFixed(6)}`; }
function fmtPct(n){ n=Number(n)||0; return `${n>0?'▲':'▼'} ${Math.abs(n).toFixed(2)}%`; }
function chartPath(points,w=420,h=170){ const min=Math.min(...points),max=Math.max(...points),r=max-min||1; return points.map((p,i)=>`${i?'L':'M'}${(i/(points.length-1))*w} ${h-((p-min)/r)*h}`).join(' '); }
function MiniLine({points,color='#2563ff'}){ const d=chartPath(points,120,34); return <svg viewBox="0 0 120 36" className="miniLine"><path d={d} style={{stroke:color}}/></svg>; }
function BigLine({points,color='#2563ff'}){ const d=chartPath(points,620,240); const area=`${d} L620 260 L0 260 Z`; return <svg viewBox="0 0 620 270" className="bigChart"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop stopColor={color} stopOpacity=".22"/><stop offset="1" stopColor={color} stopOpacity="0"/></linearGradient></defs><path d={area} fill="url(#area)"/><path d={d} stroke={color}/><circle cx="598" cy="72" r="6" fill={color}/></svg>; }
function Donut(){ return <div className="donut"><div><b>287</b><span>Repositories</span></div></div>; }

function App(){
  const [lang,setLang]=useState('en'); const t=lang==='zh'?zh:en; const [active,setActive]=useState(0); const [data,setData]=useState({market:fallbackMarket,defi:fallbackDefi,news:fallbackNews}); const [now,setNow]=useState(new Date());
  useEffect(()=>{ const id=setInterval(()=>setNow(new Date()),1000); return()=>clearInterval(id);},[]);
  useEffect(()=>{ Promise.allSettled([fetch('/api/market').then(r=>r.json()),fetch('/api/defi').then(r=>r.json()),fetch('/api/news').then(r=>r.json())]).then(([m,d,n])=>setData({market:m.value?.data?.length?m.value.data:fallbackMarket,defi:d.value?.data?.length?d.value.data:fallbackDefi,news:n.value?.data?.length?n.value.data:fallbackNews})).catch(()=>{});},[]);
  const marketCap=data.market.reduce((s,x)=>s+(Number(x.marketCap)||0),0)||2.48e12; const volume=data.market.reduce((s,x)=>s+(Number(x.volume)||0),0)||112.37e9;
  const kpis=[{label:t.marketCap,value:fmtUsd(marketCap),chg:2.31,icon:<TrendingUp/>,color:'#3366ff',line:chartPoints},{label:t.volume,value:fmtUsd(volume),chg:6.84,icon:<BarChart3/>,color:'#10b981',line:[2,4,3,5,4,6,5,7,7,9,8,10]},{label:t.defi,value:'$86.91B',chg:1.17,icon:<Database/>,color:'#2f6bff',line:tvlPoints},{label:t.dominance,value:'54.32%',chg:-0.42,icon:<Flame/>,color:'#fb923c',line:[4,4.3,4.1,4.8,4.4,4.9,5,5.4,5.1,5.5]},{label:t.gas,value:'18.6 Gwei',chg:-5.12,icon:<Zap/>,color:'#8b5cf6',line:[7,6,6.5,6.1,5.8,6.4,5.7,5.4,5.8,5.2]}];
  const navIcons=[Home,LineChart,Database,Github,FileText,CheckSquare,BookOpen,Settings];
  return <div className="app">
    <aside className="sidebar"><div className="brand"><div className="logo">N</div><div><h2>NovaLedger</h2><p>Web3 Analytics & Builder OS</p></div></div><nav>{t.nav.map((n,i)=>{const Icon=navIcons[i];return <button key={n} className={active===i?'on':''} onClick={()=>setActive(i)}><Icon size={20}/><span>{n}</span></button>})}</nav><div className="pro"><Sparkles/><h3>{t.pro}</h3><p>{t.proText}</p><button>{t.upgrade}<ChevronRight size={18}/></button></div><div className="sys"><ShieldCheck size={18}/><b>{t.system}</b><span></span><em>{t.healthy}</em></div></aside>
    <main><header className="top"><div className="search"><Search size={22}/><input placeholder={t.search}/><Menu size={19}/></div><div className="status"><span></span>API Connected</div><select value={lang} onChange={e=>setLang(e.target.value)}><option value="en">English</option><option value="zh">中文</option></select><button className="bell"><Bell/><i>3</i></button><button className="avatar">NL</button></header>
      <section className="hero"><div><h1>{t.title}</h1><p>{t.sub}</p></div><div className="time"><span><i></i>{t.updated}: {now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'})}</span></div></section>
      <section className="kpis">{kpis.map(k=><div className="card kpi" key={k.label}><div className="ico" style={{background:`${k.color}18`,color:k.color}}>{k.icon}</div><div><p>{k.label}</p><h2>{k.value}</h2><em className={k.chg>=0?'green':'red'}>{fmtPct(k.chg)} <small>24h</small></em></div><MiniLine points={k.line} color={k.color}/></div>)}</section>
      <section className="gridA"><div className="card movement"><div className="head"><div><h3>{t.chart} (Market Cap)</h3><p>{t.days}</p></div><div className="range"><button>1H</button><button>24H</button><button className="sel">7D</button><button>30D</button></div></div><BigLine points={chartPoints}/><div className="tip"><span>18/06 21:00</span><b>{fmtUsd(marketCap)}</b><em>▲ 2.31%</em></div></div>
      <div className="card defi"><div className="head"><h3>{t.topDefi} (TVL)</h3></div><table><thead><tr><th>#</th><th>Protocol</th><th>TVL</th><th>24h %</th></tr></thead><tbody>{data.defi.slice(0,5).map((r,i)=><tr key={r.protocol}><td>{i+1}</td><td><span className="tokenIcon">{r.icon||'◈'}</span>{r.protocol}</td><td>{fmtUsd(r.tvl)}</td><td className={r.change>=0?'green':'red'}>{fmtPct(r.change).replace('▲ ','+').replace('▼ ','-')}</td></tr>)}</tbody></table><button className="view">{t.view}<ChevronRight size={16}/></button></div>
      <div className="card news"><div className="head"><h3>{t.news} (Crypto News)</h3><button>{t.view}<ChevronRight size={14}/></button></div>{data.news.slice(0,4).map((n,i)=><div className="newsItem" key={i}><div style={{background:n.accent||'#eef2ff'}}>{n.token||'•'}</div><p><b>{n.title}</b><span>{n.time||'recent'}</span></p></div>)}</div></section>
      <section className="gridB"><div className="card gainers"><div className="head"><h3>{t.gainers}</h3></div><table><thead><tr><th>#</th><th>Token</th><th>Price</th><th>24h %</th><th>Volume</th></tr></thead><tbody>{data.market.slice(0,5).map((m,i)=><tr key={m.symbol}><td>{i+1}</td><td><span className="coin" style={{background:m.color}}>{m.symbol[0]}</span><b>{m.symbol}</b><small>{m.name}</small></td><td>{fmtUsd(m.price)}</td><td className={m.change>=0?'green':'red'}>{fmtPct(m.change).replace('▲ ','+').replace('▼ ','-')}</td><td>{fmtUsd(m.volume)}</td></tr>)}</tbody></table></div>
      <div className="card repo"><h3>{t.repo} (GitHub)</h3><div className="repoFlex"><Donut/><ul><li><span className="dot greenBg"></span>{t.statusGood} <b>198 (69%)</b></li><li><span className="dot orangeBg"></span>{t.warn} <b>56 (20%)</b></li><li><span className="dot redBg"></span>{t.risk} <b>33 (11%)</b></li></ul></div><p className="stamp">{t.updated} {now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</p></div>
      <div className="card onchain"><h3>{t.onchain}</h3><div className="onGrid">{onchainCards.map(([a,b,c,d])=><div><span>{d}</span><p>{a}</p><b>{b}</b><em>{c}</em></div>)}</div></div></section>
    </main></div>
}

createRoot(document.getElementById('root')).render(<App/>);
