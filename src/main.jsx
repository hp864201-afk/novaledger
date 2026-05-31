import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const zh = {
  overview: '总览', market: '市场', defi: 'DeFi TVL', repo: '仓库健康', signals: '信号', tasks: '任务', docs: '文档', settings: '设置',
  subtitle: 'Web3 情报平台', search: '搜索资产、协议、API、任务...', title: 'Real-time Web3 intelligence for builders and investors.',
  desc: 'Track markets, DeFi, repositories, and on-chain activity. All in one unified platform.', api: 'API 已连接', refresh: '刷新数据',
  volume: '24H 市场交易量', tvl: 'DeFi 锁仓量', repos: '活跃仓库', pulse: '市场脉冲', operational: '运行正常',
  insight: 'NovaLedger 洞察', overviewChart: '市场概览', defiTrend: 'DeFi TVL 趋势', gainers: '涨幅榜', repoHealth: '仓库健康', latestSignals: '最新信号', networkStatus: '网络状态', buildTasks: '构建任务', schedule: '构建日程'
};
const en = {
  overview: 'Overview', market: 'Market API', defi: 'DeFi TVL', repo: 'Repository Health', signals: 'Signals', tasks: 'Build Tasks', docs: 'Documentation', settings: 'Settings',
  subtitle: 'Web3 Intelligence Platform', search: 'Search assets, protocols, APIs, tasks...', title: 'Real-time Web3 intelligence for builders and investors.',
  desc: 'Track markets, DeFi, repositories, and on-chain activity. All in one unified platform.', api: 'API Connected', refresh: 'Refresh Data',
  volume: '24H Market Volume', tvl: 'DeFi TVL', repos: 'Active Repositories', pulse: 'Market Pulse', operational: 'Operational',
  insight: 'NovaLedger Insight', overviewChart: 'Market Overview', defiTrend: 'DeFi TVL Trend', gainers: 'Top Gainers', repoHealth: 'Repository Health', latestSignals: 'Latest Signals', networkStatus: 'Network Status', buildTasks: 'Build Tasks', schedule: 'Build Schedule'
};

const nav = [
  ['overview', '⌂'], ['market', '⌁'], ['defi', '◉'], ['repo', '◌'], ['signals', '♢'], ['tasks', '☑'], ['docs', '▤'], ['settings', '⚙']
];
const fallbackMarket = [
  { symbol: 'BTC', name: 'Bitcoin', price: 69678.25, change: 1.32, volume: 32410000000, marketCap: 1370000000000, score: 94 },
  { symbol: 'ETH', name: 'Ethereum', price: 3827.65, change: 2.18, volume: 18730000000, marketCap: 460120000000, score: 91 },
  { symbol: 'SOL', name: 'Solana', price: 181.46, change: -0.84, volume: 3210000000, marketCap: 86320000000, score: 82 },
  { symbol: 'BNB', name: 'BNB', price: 606.38, change: 0.63, volume: 1670000000, marketCap: 88460000000, score: 79 },
  { symbol: 'LINK', name: 'Chainlink', price: 16.42, change: 5.45, volume: 842310000, marketCap: 10240000000, score: 88 }
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
  { title: 'DeFi TVL expands as lending and DEX activity recovers', source: 'NovaLedger Signals', sentiment: 'Neutral' }
];

const fmtUsd = (v) => {
  const n = Number(v); if (!Number.isFinite(n)) return '$0';
  if (Math.abs(n) >= 1e12) return `$${(n/1e12).toFixed(2)}T`;
  if (Math.abs(n) >= 1e9) return `$${(n/1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6) return `$${(n/1e6).toFixed(2)}M`;
  if (Math.abs(n) >= 1) return `$${n.toLocaleString(undefined,{maximumFractionDigits:2})}`;
  return `$${n.toFixed(6)}`;
};
const fmtPct = (v) => `${Number(v || 0) > 0 ? '+' : ''}${Number(v || 0).toFixed(2)}%`;
const sum = (arr, key) => arr.reduce((a,b)=>a + Number(b[key] || 0), 0);
async function getApi(path, fallback){
  const paths = [path, `/.netlify/functions/${path.replace('/api/','')}`];
  for (const p of paths) {
    try { const r = await fetch(p, { cache: 'no-store' }); if (r.ok) { const d = await r.json(); const rows = d?.data || []; if (Array.isArray(rows) && rows.length) return rows; } } catch {}
  }
  return fallback;
}
function LineChart({ points, color='var(--blue)' }){
  const vals = points?.length ? points : [2.05,2.18,2.24,2.19,2.36,2.51,2.42,2.48,2.61];
  const min=Math.min(...vals), max=Math.max(...vals), range=max-min||1;
  const d=vals.map((v,i)=>`${i?'L':'M'} ${(i/(vals.length-1))*100} ${54-((v-min)/range)*42}`).join(' ');
  return <svg className="lineChart" viewBox="0 0 100 60" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".24"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs><path d={`${d} L100 60 L0 60Z`} fill="url(#fill)"/><path d={d} fill="none" stroke={color} strokeWidth="2.2"/></svg>;
}
function Donut({ value=78 }) { return <div className="donut" style={{'--p': `${Math.min(100,Math.max(0,value))}%`}}><b>{value}</b><span>Score</span></div>; }
function StatCard({ icon, label, value, sub, trend, tone='blue' }){ return <div className={`statCard ${tone}`}><div className="statIcon">{icon}</div><div><small>{label}</small><b>{value}</b><em className={Number(trend)>=0?'up':'down'}>{trend !== undefined ? fmtPct(trend) : sub}</em></div><LineChart points={[1,1.2,1.15,1.35,1.3,1.5,1.45,1.62]} color={`var(--${tone})`}/></div>; }
function Sidebar({ page, setPage, t }){ return <aside className="sidebar"><div className="brand"><div className="brandLogo">N</div><div><b>NovaLedger</b><span>{t.subtitle}</span></div></div><nav>{nav.map(([key,ic])=><button key={key} className={page===key?'active':''} onClick={()=>setPage(key)}><span>{ic}</span>{t[key]}</button>)}</nav><div className="assistant"><b>AI Builder Assistant</b><p>Connected to on-chain and off-chain data. Turn insights into action.</p><button>Open Assistant →</button></div><div className="status"><span/> System healthy</div></aside>; }
function Header({ lang, setLang, query, setQuery, t, refresh }){ return <header className="topbar"><div className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search}/></div><button className="apiBadge"><span/> {t.api}</button><select className="language" value={lang} onChange={e=>setLang(e.target.value)}><option value="en">English</option><option value="zh">中文</option></select><button className="bell">◷</button><button className="avatar">NL</button></header>; }
function Hero({ t }){ return <section className="hero"><div><small>NOVALEDGER DASHBOARD</small><h1>{t.title}</h1><p>{t.desc}</p></div><div className="dateBox"><b>{new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</b><span>{new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}</span></div></section>; }
function MarketTable({ rows }){ return <div className="panel tablePanel"><div className="panelHead"><h3>Top Gainers <span>(24H)</span></h3><a>View all</a></div><table><thead><tr><th>#</th><th>Token</th><th>Price</th><th>24h %</th><th>Volume</th></tr></thead><tbody>{rows.slice(0,7).map((r,i)=><tr key={r.symbol}><td>{i+1}</td><td><b>{r.symbol}</b><small>{r.name}</small></td><td>{fmtUsd(r.price)}</td><td className={r.change>=0?'up':'down'}>{fmtPct(r.change)}</td><td>{fmtUsd(r.volume)}</td></tr>)}</tbody></table></div>; }
function DefiPanel({ rows }){ return <div className="panel"><div className="panelHead"><h3>Top DeFi Protocol <span>(by TVL)</span></h3><a>View all</a></div><div className="protocols">{rows.slice(0,5).map((p,i)=><div className="protocol" key={p.name}><span>{i+1}</span><b>{p.name}</b><em>{fmtUsd(p.tvl)}</em><strong className={p.change_1d>=0?'up':'down'}>{fmtPct(p.change_1d)}</strong></div>)}</div></div>; }
function NewsPanel({ rows }){ return <div className="panel"><div className="panelHead"><h3>Hot News <span>(Crypto News)</span></h3><a>View all</a></div><div className="newsList">{rows.slice(0,5).map((n,i)=><div className="news" key={i}><div className="newsIcon">{i===0?'₿':i===1?'Ξ':'↗'}</div><div><b>{n.title}</b><span>{n.source} • {n.sentiment}</span></div></div>)}</div></div>; }
function TasksPanel(){ const tasks=['Connect live API routes','Polish NovaLedger UI','Verify market and DeFi charts','Prepare submission story','Record final demo']; return <div className="panel"><div className="panelHead"><h3>Wave 2 Tasks</h3><a>View all</a></div>{tasks.map((x,i)=><div className="task" key={x}><span className={i<3?'done':''}>✓</span><div><b>{x}</b><small>{i<3?'Completed':i===3?'In progress':'Pending'}</small></div><em>{i<3?'Ready':i===3?'Today':'Next'}</em></div>)}</div>; }
function SchedulePanel(){ return <div className="panel"><div className="panelHead"><h3>Today's Build Schedule</h3></div>{[['09:00','API health check','Market + DeFi endpoints'],['11:00','UI polish round','Dashboard + mobile states'],['14:30','Submission writing','Problem, solution, tech stack'],['18:00','Final demo recording','Show live API updates']].map(x=><div className="schedule" key={x[0]}><span>{x[0]}</span><b>{x[1]}</b><small>{x[2]}</small></div>)}</div>; }
function RepoPanel({ repos }){ return <div className="panel"><div className="panelHead"><h3>Repository Health</h3><a>View all</a></div>{repos.slice(0,4).map(r=><div className="repo" key={r.name}><b>{r.name}</b><span>{r.health || 94}/100</span><div><i style={{width:`${r.health||94}%`}}/></div></div>)}</div>; }
function NetworkPanel({ sodex }){ return <div className="panel"><div className="panelHead"><h3>Network Status</h3><a>View all</a></div>{['Market API','DeFi API','GitHub API','News API','SoDEX Layer'].map((x,i)=><div className="network" key={x}><span>{x}</span><b className="up">Operational</b></div>)}</div>; }
function DocsPage(){ return <div className="panel pagePanel"><h2>Documentation</h2><p>NovaLedger combines live market APIs, DeFi protocol data, repository metrics, news signals, and execution readiness into one Web3 analytics workspace.</p><div className="docGrid"><div><b>API Layer</b><span>Server-side routes protect keys and normalize market data.</span></div><div><b>Dashboard</b><span>Cards, charts, tables and tasks are designed for hackathon demo clarity.</span></div><div><b>Execution</b><span>SoDEX status and readiness panels stay separated from frontend secrets.</span></div></div></div>; }
function SettingsPage({ lang,setLang }){ return <div className="panel pagePanel"><h2>Settings</h2><label>Language<select value={lang} onChange={e=>setLang(e.target.value)}><option value="en">English</option><option value="zh">中文</option></select></label><p>Default language is English. The dropdown can switch the interface to Chinese.</p></div>; }
function DashboardPage({ t, market, defi, news, repos, sodex }){
  const volume=sum(market,'volume'), tvl=sum(defi,'tvl'), avg=market.length?market.reduce((s,r)=>s+r.change,0)/market.length:0;
  return <><Hero t={t}/><section className="stats"><StatCard icon="⌁" label={t.volume} value={fmtUsd(volume)} trend={6.84} tone="blue"/><StatCard icon="◉" label={t.tvl} value={fmtUsd(tvl)} trend={3.46} tone="green"/><StatCard icon="⌬" label={t.repos} value={repos.length || 3} sub="Developers tracked" tone="blue"/><StatCard icon="⌁" label={t.pulse} value={avg>=0?'Bullish':'Cautious'} trend={avg} tone="orange"/><StatCard icon="◈" label="SoDEX Status" value={t.operational} sub="All systems normal" tone="teal"/></section><div className="insight"><b>🚀 {t.insight}:</b> Bitcoin volume and DeFi liquidity are updating through live API routes. <button>{t.refresh}</button></div><section className="gridTop"><div className="panel chartPanel"><div className="panelHead"><h3>{t.overviewChart}</h3><select><option>7D</option><option>24H</option></select></div><LineChart points={[2.05,2.12,2.19,2.36,2.28,2.41,2.39,2.55,2.48]} /></div><div className="panel chartPanel"><div className="panelHead"><h3>{t.defiTrend}</h3><select><option>7D</option></select></div><LineChart points={[82,84,85,86,88,91,90,94,96]} color="var(--green)" /></div><MarketTable rows={market}/></section><section className="gridBottom"><RepoPanel repos={repos}/><DefiPanel rows={defi}/><NewsPanel rows={news}/><NetworkPanel sodex={sodex}/><TasksPanel/><SchedulePanel/></section></>;
}
function App(){
  const [lang,setLang]=useState('en'); const t=lang==='zh'?zh:en;
  const [page,setPage]=useState('overview'); const [query,setQuery]=useState('');
  const [market,setMarket]=useState(fallbackMarket); const [defi,setDefi]=useState(fallbackDefi); const [news,setNews]=useState(fallbackNews); const [repos,setRepos]=useState([{name:'novaledger/dashboard',health:94}]); const [sodex,setSodex]=useState({status:'Ready'});
  const load=async()=>{ setMarket(await getApi('/api/market', fallbackMarket)); setDefi(await getApi('/api/defi', fallbackDefi)); setNews(await getApi('/api/news', fallbackNews)); setRepos(await getApi('/api/github', [{name:'novaledger/dashboard',health:94}])); try{const d=await fetch('/api/sodex').then(r=>r.json()); setSodex(d.data||d)}catch{} };
  useEffect(()=>{ load(); },[]);
  const filteredMarket=useMemo(()=>market.filter(x=>`${x.symbol} ${x.name}`.toLowerCase().includes(query.toLowerCase())),[market,query]);
  let content;
  if(page==='docs') content=<DocsPage/>; else if(page==='settings') content=<SettingsPage lang={lang} setLang={setLang}/>; else if(page==='market') content=<><div className="pageTitle"><h2>Market API</h2><button onClick={load}>{t.refresh}</button></div><MarketTable rows={filteredMarket}/></>; else if(page==='defi') content=<><div className="pageTitle"><h2>DeFi TVL</h2><button onClick={load}>{t.refresh}</button></div><DefiPanel rows={defi}/></>; else if(page==='repo') content=<><div className="pageTitle"><h2>Repository Health</h2></div><RepoPanel repos={repos}/></>; else if(page==='signals') content=<><div className="pageTitle"><h2>Signals</h2></div><NewsPanel rows={news}/></>; else if(page==='tasks') content=<><div className="pageTitle"><h2>Build Tasks</h2></div><TasksPanel/><SchedulePanel/></>; else content=<DashboardPage t={t} market={filteredMarket} defi={defi} news={news} repos={repos} sodex={sodex}/>;
  return <div className="app"><Sidebar page={page} setPage={setPage} t={t}/><main><Header lang={lang} setLang={setLang} query={query} setQuery={setQuery} t={t} refresh={load}/>{content}</main></div>;
}

createRoot(document.getElementById('root')).render(<App/>);
