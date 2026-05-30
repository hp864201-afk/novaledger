import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  Bell,
  BookOpen,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Code2,
  Coins,
  Database,
  GitFork,
  Github,
  Globe2,
  GraduationCap,
  Layers3,
  LineChart,
  Link2,
  Loader2,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  WalletCards,
  Zap
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import './styles.css';

const fmtUsd = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return '$0';
  if (Math.abs(n) >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(2)}K`;
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

const fmtPct = (value) => {
  const n = Number(value || 0);
  return `${n > 0 ? '+' : ''}${n.toFixed(2)}%`;
};

async function fetchJson(url) {
  const res = await fetch(url, { cache: 'no-store' });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
  return json;
}

const sideItems = [
  { key: 'home', label: 'Home', icon: GraduationCap },
  { key: 'market', label: 'Market API', icon: Coins },
  { key: 'defi', label: 'DeFi TVL', icon: Database },
  { key: 'repo', label: 'Repo Health', icon: Github },
  { key: 'news', label: 'Signals', icon: Bell },
  { key: 'tasks', label: 'Build Tasks', icon: CheckCircle2 },
  { key: 'docs', label: 'Docs', icon: BookOpen },
  { key: 'settings', label: 'Settings', icon: ShieldCheck }
];

const tasks = [
  { title: 'Finalize Wave 2 product scope', area: 'Product', due: 'Today', status: 'Ready', progress: 100 },
  { title: 'Connect free public APIs', area: 'Data', due: 'Today', status: 'Live', progress: 100 },
  { title: 'Polish LMS-style dashboard UI', area: 'UX', due: 'Tomorrow', status: 'In progress', progress: 84 },
  { title: 'Prepare submission story', area: 'Pitch', due: '2 days', status: 'In progress', progress: 67 },
  { title: 'Add wallet action layer', area: 'Web3', due: 'Next', status: 'Planned', progress: 35 }
];

const modules = [
  { name: 'Market Intelligence', icon: Coins, color: 'purple', progress: 94, note: 'CoinGecko + Binance fallback' },
  { name: 'DeFi Protocol Radar', icon: Database, color: 'green', progress: 88, note: 'DefiLlama public API' },
  { name: 'Repo Health Monitor', icon: Github, color: 'blue', progress: 82, note: 'GitHub REST API' },
  { name: 'News Signal Layer', icon: Bell, color: 'orange', progress: 76, note: 'CryptoCompare + trend fallback' },
  { name: 'Builder AI Coach', icon: Bot, color: 'teal', progress: 69, note: 'Rule-based guidance' }
];

function StatCard({ icon: Icon, label, value, hint, tone }) {
  return (
    <section className={`statCard ${tone || ''}`}>
      <div className="statIcon"><Icon size={20} /></div>
      <div>
        <p>{label}</p>
        <h3>{value}</h3>
        <span>{hint}</span>
      </div>
    </section>
  );
}

function TaskRow({ task }) {
  return (
    <div className="taskRow">
      <div className="taskLeft">
        <div className="taskIcon"><CheckCircle2 size={18} /></div>
        <div><b>{task.title}</b><span>{task.area}</span></div>
      </div>
      <div className="taskMeta"><em>{task.status}</em><span>{task.due}</span></div>
      <div className="taskProgress"><i style={{ width: `${task.progress}%` }} /></div>
    </div>
  );
}

function ModuleCard({ module }) {
  const Icon = module.icon;
  return (
    <section className={`moduleCard ${module.color}`}>
      <div className="moduleTop"><Icon size={20} /><span>{module.progress}%</span></div>
      <h4>{module.name}</h4>
      <p>{module.note}</p>
      <div className="moduleBar"><i style={{ width: `${module.progress}%` }} /></div>
    </section>
  );
}

function MarketTable({ rows }) {
  return (
    <section className="panel widePanel">
      <div className="panelHead"><div><h2>Live Market API</h2><p>Prices, volume, 24h movement and opportunity score.</p></div><span>{rows.length} assets</span></div>
      <div className="tableWrap">
        <table>
          <thead><tr><th>#</th><th>Asset</th><th>Price</th><th>24h</th><th>Volume</th><th>Market Cap</th><th>Score</th></tr></thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={`${row.symbol}-${i}`}>
                <td>{i + 1}</td>
                <td><div className="asset"><span>{String(row.symbol || 'A').slice(0, 1)}</span><div><b>{row.symbol}</b><small>{row.name}</small></div></div></td>
                <td>{fmtUsd(row.price)}</td>
                <td className={Number(row.change24h) >= 0 ? 'up' : 'down'}>{fmtPct(row.change24h)}</td>
                <td>{fmtUsd(row.volume)}</td>
                <td>{fmtUsd(row.marketCap)}</td>
                <td><em className="score">{row.score}</em></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DeFiPanel({ rows }) {
  return (
    <section className="panel">
      <div className="panelHead"><div><h2>DeFi Protocol Radar</h2><p>TVL and category tracking from public protocol data.</p></div><span>{rows.length} protocols</span></div>
      <div className="protocolList">
        {rows.slice(0, 8).map((row) => (
          <div className="protocol" key={row.name}>
            <div><b>{row.name}</b><span>{row.category} • {row.chain}</span></div>
            <div><b>{fmtUsd(row.tvl)}</b><span className={Number(row.change7d) >= 0 ? 'up' : 'down'}>{fmtPct(row.change7d)} 7d</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RepoPanel({ rows }) {
  return (
    <section className="panel">
      <div className="panelHead"><div><h2>GitHub Repo Health</h2><p>Public repo API for builder credibility signals.</p></div><span>{rows.length} repos</span></div>
      <div className="repoGrid">
        {rows.map((row) => (
          <a className="repoCard" href={row.url} target="_blank" rel="noreferrer" key={row.name}>
            <Github size={18} />
            <b>{row.name}</b>
            <div><span><Star size={14} /> {row.stars}</span><span><GitFork size={14} /> {row.forks}</span></div>
            <small>{row.language} • score {row.score}</small>
          </a>
        ))}
      </div>
    </section>
  );
}

function NewsPanel({ rows }) {
  return (
    <section className="panel">
      <div className="panelHead"><div><h2>News Signal Feed</h2><p>Latest crypto headlines for builder context.</p></div><span>{rows.length} signals</span></div>
      <div className="newsList">
        {rows.slice(0, 6).map((row, i) => (
          <a className="newsItem" href={row.url} target="_blank" rel="noreferrer" key={`${row.title}-${i}`}>
            <div><Sparkles size={16} /><b>{row.title}</b></div>
            <span>{row.source} • sentiment {row.sentiment}</span>
          </a>
        ))}
      </div>
    </section>
  );
}


function SoDEXPanel({ data }) {
  return (
    <section className="panel">
      <div className="panelHead"><div><h2>SoDEX Execution Layer</h2><p>Server-side trading/account route using protected environment variables.</p></div><span>{data?.network || 'mainnet'}</span></div>
      <div className="sodexBox">
        <div><b>Status</b><span>{data?.configured ? 'Account route configured' : 'Waiting for SODEX_USER_ADDRESS'}</span></div>
        <div><b>Trading Key</b><span>{data?.tradingKeyReady ? 'Ready' : 'Add API key name + private key'}</span></div>
        <div><b>Account ID</b><span>{data?.accountID || 'optional'}</span></div>
        <div><b>Message</b><span>{data?.message || 'SoDEX route ready for configuration.'}</span></div>
      </div>
    </section>
  );
}

function QuickActions({ refresh, loading }) {
  return (
    <section className="panel quickPanel">
      <div className="panelHead"><div><h2>Quick Actions</h2><p>Builder operations for Wave 2 execution.</p></div></div>
      <div className="quickGrid">
        <button onClick={refresh}><Activity /> {loading ? 'Refreshing...' : 'Refresh APIs'}</button>
        <button onClick={() => navigator.clipboard?.writeText(window.location.href)}><Link2 /> Copy demo link</button>
        <button onClick={() => window.open('https://github.com', '_blank')}><Github /> Open GitHub</button>
        <button onClick={() => alert('Pitch checklist: problem, solution, API usage, demo, next steps.')}><Rocket /> Pitch checklist</button>
      </div>
    </section>
  );
}

function App() {
  const [active, setActive] = useState('home');
  const [market, setMarket] = useState([]);
  const [defi, setDefi] = useState([]);
  const [repos, setRepos] = useState([]);
  const [news, setNews] = useState([]);
  const [sources, setSources] = useState({});
  const [sodex, setSodex] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [m, d, g, n, sx] = await Promise.all([
        fetchJson('/api/market'),
        fetchJson('/api/defi'),
        fetchJson('/api/github'),
        fetchJson('/api/news'),
        fetchJson('/api/sodex')
      ]);
      setMarket(m.rows || []);
      setDefi(d.rows || []);
      setRepos(g.rows || []);
      setNews(n.rows || []);
      setSodex(sx);
      setSources({ market: m.source, defi: d.source, github: g.source, news: n.source, sodex: sx?.source || 'SoDEX' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const volume = market.reduce((sum, row) => sum + Number(row.volume || 0), 0);
    const tvl = defi.reduce((sum, row) => sum + Number(row.tvl || 0), 0);
    const repoScore = repos.length ? Math.round(repos.reduce((sum, row) => sum + Number(row.score || 0), 0) / repos.length) : 0;
    const avgMove = market.length ? market.reduce((sum, row) => sum + Number(row.change24h || 0), 0) / market.length : 0;
    return { volume, tvl, repoScore, avgMove };
  }, [market, defi, repos]);

  const marketChart = market.slice(0, 8).map((row) => ({ name: row.symbol, value: Number(row.change24h || 0), volume: Number(row.volume || 0) / 1000000 }));
  const defiPie = defi.slice(0, 5).map((row) => ({ name: row.name, value: Number(row.tvl || 0) }));

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><div className="brandIcon"><Globe2 /></div><div><b>Wave2 Portal</b><span>Web3 Builder OS</span></div></div>
        <nav>
          {sideItems.map(({ key, label, icon: Icon }) => (
            <button key={key} className={active === key ? 'active' : ''} onClick={() => setActive(key)}><Icon size={18} />{label}</button>
          ))}
        </nav>
        <div className="aiBox"><Bot size={20} /><b>AI Builder Coach</b><span>APIs connected. Keep the demo story simple: data → insight → action.</span></div>
      </aside>

      <main>
        <header className="topbar">
          <button className="menuBtn"><Layers3 size={20} /></button>
          <div className="search"><Zap size={18} /><input placeholder="Search modules, APIs, protocols, tasks..." /></div>
          <button className="apiBadge"><span /> API Powered</button>
          <div className="profile"><b>lucky_star</b><span>Wave 2 Builder</span><div>L</div></div>
        </header>

        <section className="welcome">
          <div>
            <span className="eyebrow">Live API dashboard</span>
            <h1>Build, monitor, and present your Wave 2 Web3 product.</h1>
            <p>Track crypto markets, DeFi protocols, repository health, builder tasks, and news signals from one clean portal.</p>
          </div>
          <div className="dateCard"><CalendarDays size={20} /><span>Wave 2</span><b>Builder sprint</b></div>
        </section>

        <section className="statsGrid">
          <StatCard icon={Coins} label="24h Tracked Volume" value={fmtUsd(stats.volume)} hint={sources.market || 'Market API'} tone="purple" />
          <StatCard icon={Database} label="DeFi TVL Watch" value={fmtUsd(stats.tvl)} hint={sources.defi || 'Protocol API'} tone="green" />
          <StatCard icon={Github} label="Repo Health Score" value={stats.repoScore || '—'} hint={sources.github || 'GitHub API'} tone="blue" />
          <StatCard icon={LineChart} label="Market Pulse" value={fmtPct(stats.avgMove)} hint="Average 24h move" tone="orange" />
          <StatCard icon={WalletCards} label="SoDEX Layer" value={sodex?.configured ? 'Connected' : 'Ready'} hint={sodex?.message || 'Trading API route'} tone="teal" />
        </section>

        <section className="alert"><Rocket size={20} /><b>Wave 2 Focus:</b><span>Show a working demo with real API data, clear user value, and practical Web3 workflow.</span><button onClick={load}>{loading ? <Loader2 className="spin" size={16} /> : 'Refresh data'}</button></section>

        <section className="twoCol">
          <section className="panel tasksPanel">
            <div className="panelHead"><div><h2>Wave 2 Build Tasks</h2><p>Execution list for product submission.</p></div><a onClick={() => setActive('tasks')}>View all <ChevronRight size={15} /></a></div>
            {tasks.map((task) => <TaskRow key={task.title} task={task} />)}
          </section>
          <section className="panel schedulePanel">
            <div className="panelHead"><div><h2>Today's Build Schedule</h2><p>Keep the sprint moving.</p></div></div>
            <div className="timeline">
              <div><time>09:00</time><b>API health check</b><span>Market + DeFi endpoints</span></div>
              <div><time>11:00</time><b>UI polish round</b><span>Dashboard + mobile states</span></div>
              <div><time>14:30</time><b>Submission writing</b><span>Problem, solution, tech stack</span></div>
              <div><time>18:00</time><b>Final demo recording</b><span>Show live API updates</span></div>
            </div>
          </section>
        </section>

        <section className="modulesRow">
          {modules.map((module) => <ModuleCard key={module.name} module={module} />)}
        </section>

        <section className="chartsGrid">
          <section className="panel chartPanel">
            <div className="panelHead"><div><h2>Market Movement</h2><p>24h change by tracked asset.</p></div></div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={marketChart}><XAxis dataKey="name" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip contentStyle={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12 }} /><Bar dataKey="value" radius={[8,8,0,0]}>{marketChart.map((entry, i) => <Cell key={i} fill={entry.value >= 0 ? '#22c55e' : '#ef4444'} />)}</Bar></BarChart>
            </ResponsiveContainer>
          </section>
          <section className="panel chartPanel">
            <div className="panelHead"><div><h2>DeFi TVL Mix</h2><p>Top protocol weight by TVL.</p></div></div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart><Pie data={defiPie} dataKey="value" nameKey="name" outerRadius={88} innerRadius={48}>{defiPie.map((_, i) => <Cell key={i} fill={['#7c3aed','#22c55e','#3b82f6','#f59e0b','#14b8a6'][i % 5]} />)}</Pie><Tooltip formatter={(value) => fmtUsd(value)} /></PieChart>
            </ResponsiveContainer>
          </section>
        </section>

        <section className="mainGrid">
          <MarketTable rows={market} />
          <div className="sideStack">
            <DeFiPanel rows={defi} />
            <RepoPanel rows={repos} />
            <NewsPanel rows={news} />
            <SoDEXPanel data={sodex} />
            <QuickActions refresh={load} loading={loading} />
          </div>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
