import '../styles/index.css';
import logoImage from '../assets/logo.jpeg';
import skinImage from '../assets/women-image.png';

const homePath = import.meta.env.BASE_URL;
const analyzePath = `${homePath}analyze`;
const reportPath = `${homePath}report`;

const analyses = [
	{ date: '24 Aug 2025', time: '10:30 AM', score: '82', status: 'Good', tone: 'good' },
	{ date: '10 Aug 2025', time: '11:15 AM', score: '74', status: 'Moderate', tone: 'moderate' },
	{ date: '27 Jul 2025', time: '09:45 AM', score: '68', status: 'Moderate', tone: 'moderate' },
];

const sidebarItems = [
	['⌂', 'Dashboard', true],
	['♧', 'Analysis', false, analyzePath],
	['▤', 'Reports', false, reportPath],
	['☵', 'AI Assistant'],
	['♙', 'Profile'],
	['⚙', 'Settings'],
];

function StatusBadge({ children, tone = 'good' }) {
	const styles = tone === 'good'
		? 'bg-[#e1f6ec] text-[#258b5b]'
		: 'bg-[#fff1d9] text-[#b78123]';

	return <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${styles}`}>{children}</span>;
}

function Card({ children, className = '' }) {
	return <section className={`rounded-xl border border-[#e5eaf0] bg-white shadow-[0_3px_12px_rgba(25,53,90,0.04)] ${className}`}>{children}</section>;
}

function ScoreSparkline() {
	return (
		<svg viewBox="0 0 300 80" className="h-20 w-full" role="img" aria-label="Skin score trend rising from 68 to 82">
			<defs>
				<linearGradient id="score-fill" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0" stopColor="#68c9c0" stopOpacity="0.28" />
					<stop offset="1" stopColor="#68c9c0" stopOpacity="0" />
				</linearGradient>
			</defs>
			<path d="M0 63 C25 57 38 58 61 59 S91 54 110 43 S141 42 157 49 S188 41 204 29 S241 25 263 22 S286 13 300 10 V80 H0 Z" fill="url(#score-fill)" />
			<path d="M0 63 C25 57 38 58 61 59 S91 54 110 43 S141 42 157 49 S188 41 204 29 S241 25 263 22 S286 13 300 10" fill="none" stroke="#197b82" strokeWidth="2.5" />
			{[[61, 59], [204, 29], [300, 10]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" fill="#197b82" />)}
		</svg>
	);
}

function ProgressChart() {
	return (
		<div className="relative h-[190px] pt-2">
			<div className="absolute inset-x-0 top-3 bottom-7 flex flex-col justify-between text-[10px] text-[#69758a]">
				{[100, 80, 60, 40, 20, 0].map((value) => (
					<div key={value} className="flex items-center gap-2"><span className="w-6 text-right">{value}</span><span className="h-px flex-1 bg-[#edf1f5]" /></div>
				))}
			</div>
			<svg viewBox="0 0 520 150" preserveAspectRatio="none" className="absolute left-9 right-0 top-3 h-[150px] w-[calc(100%-36px)]" role="img" aria-label="Skin score progress from 70 to 82">
				<defs>
					<linearGradient id="progress-fill" x1="0" x2="0" y1="0" y2="1">
						<stop offset="0" stopColor="#62c8bd" stopOpacity="0.26" />
						<stop offset="1" stopColor="#62c8bd" stopOpacity="0" />
					</linearGradient>
				</defs>
				<path d="M20 62 L140 56 L260 43 L380 40 L500 35 V150 H20 Z" fill="url(#progress-fill)" />
				<path d="M20 62 L140 56 L260 43 L380 40 L500 35" fill="none" stroke="#18777e" strokeWidth="3" />
				{[[20, 62, '70'], [140, 56, '74'], [260, 43, '78'], [380, 40, '80'], [500, 35, '82']].map(([cx, cy, value]) => (
					<g key={value}><circle cx={cx} cy={cy} r="4" fill="#18777e" /><text x={cx} y={Number(cy) - 12} textAnchor="middle" fontSize="11" fill="#273550">{value}</text></g>
				))}
			</svg>
			<div className="absolute bottom-0 left-10 right-0 flex justify-between text-[10px] text-[#69758a]">
				<span>10 Aug</span><span>17 Aug</span><span>24 Aug</span><span>31 Aug</span><span>07 Sep</span>
			</div>
		</div>
	);
}

export default function DashboardPage() {
	return (
		<div className="min-h-screen bg-[#f7f9fc] text-[#182440] lg:flex">
			<aside className="flex w-full shrink-0 flex-col bg-[#062456] px-4 py-5 text-white lg:min-h-screen lg:w-[218px] lg:px-3">
				<a href={homePath} className="mb-7 flex items-center gap-2 px-2 lg:px-3">
					<img src={logoImage} alt="DermaCare AI logo" className="h-10 w-10 rounded-xl object-cover" />
					<div>
						<strong className="block text-[17px] leading-tight">DermaCare <span className="text-[#38c8c6]">AI</span></strong>
						<span className="text-[9px] leading-tight text-white/75">AI-Powered Skin Analysis<br />&amp; Care</span>
					</div>
				</a>

				<nav className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:block" aria-label="Dashboard navigation">
					{sidebarItems.map(([icon, label, active]) => (
						<a key={label} href={active ? '#dashboard' : (label === 'Analysis' ? analyzePath : label === 'Reports' ? reportPath : '#')} className={`mb-1 flex min-h-11 items-center justify-center gap-3 rounded-lg px-3 text-[13px] font-semibold transition sm:flex-col sm:gap-1 lg:justify-start lg:flex-row lg:gap-3 ${active ? 'bg-[#0aa9ad] text-white shadow-[0_5px_15px_rgba(0,196,190,0.2)]' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
							<span className="text-lg leading-none" aria-hidden="true">{icon}</span><span>{label}</span>
						</a>
					))}
				</nav>

				<div className="mt-4 hidden border-t border-white/20 pt-4 lg:block">
					<a href={homePath} className="flex items-center gap-3 rounded-lg px-3 py-3 text-[13px] font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"><span className="text-lg" aria-hidden="true">↪</span>Log out</a>
				</div>

				<div className="mt-auto hidden rounded-xl bg-[#087c93] p-4 lg:block">
					<div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg text-[#087c93]">♢</div>
					<strong className="block text-sm">Premium Care</strong>
					<p className="mt-1 text-[11px] leading-5 text-white/80">Unlock advanced insights and personalized recommendations.</p>
					<button type="button" className="mt-3 w-full rounded-lg bg-white px-3 py-2 text-[11px] font-bold text-[#14717c] transition hover:bg-[#e9ffff]">Upgrade Now</button>
				</div>
			</aside>

			<main id="dashboard" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
				<header className="mb-6 flex items-center justify-between gap-4">
					<div>
						<h1 className="text-2xl font-bold tracking-[-0.5px] text-[#10245c] sm:text-3xl">Welcome back, Priya <span aria-hidden="true">👋</span></h1>
						<p className="mt-1 text-sm text-[#69758a]">Here&apos;s your skin health overview.</p>
					</div>
					<div className="flex items-center gap-4">
						<button type="button" aria-label="View notifications" className="relative hidden text-2xl text-[#182440] sm:block">♧<span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#bd3f4d] text-[9px] text-white">3</span></button>
						<button type="button" aria-label="Open profile menu" className="flex items-center gap-2"><img src={skinImage} alt="Priya profile" className="h-10 w-10 rounded-full object-cover object-[48%_35%]" /><span className="text-sm text-[#69758a]">⌄</span></button>
					</div>
				</header>

				<div className="grid gap-4 xl:grid-cols-3">
					<Card className="p-5">
						<div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e5f8f6] text-xl text-[#147b82]">⌁</div><h2 className="text-sm font-bold">Overall Skin Score</h2></div><StatusBadge>Good</StatusBadge></div>
						<div className="mt-2 flex items-baseline gap-2"><strong className="text-4xl font-bold text-[#10245c]">82</strong><span className="text-sm text-[#69758a]">/ 100</span></div>
						<ScoreSparkline />
						<a href="#reports" className="text-xs font-bold text-[#287878]">View Details&nbsp; →</a>
					</Card>

					<Card className="p-5"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef4fb] text-xl text-[#182440]">□</div><h2 className="text-sm font-bold">Last Analysis</h2></div><strong className="mt-5 block text-2xl font-bold text-[#10245c]">24 Aug 2025</strong><div className="mt-2"><StatusBadge>Completed</StatusBadge></div><a href="#reports" className="mt-11 block text-xs font-bold text-[#287878]">View Report&nbsp; →</a></Card>

					<Card className="p-5"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff0ed] text-xl text-[#b84d50]">!</div><h2 className="text-sm font-bold">Active Concerns</h2></div><strong className="text-2xl text-[#10245c]">2</strong></div><div className="mt-5 space-y-3 text-xs"><div className="flex justify-between"><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-[#f1ae2d]" />Acne</span><b className="font-normal text-[#c18b24]">Moderate</b></div><div className="flex justify-between"><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-[#1ea866]" />Dark Spots</span><b className="font-normal text-[#26945f]">Low</b></div></div><a href="#reports" className="mt-7 block text-xs font-bold text-[#287878]">View Details&nbsp; →</a></Card>
				</div>

				<div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.45fr]">
					<Card className="p-5"><div className="flex items-center justify-between"><h2 className="text-sm font-bold">Concern Overview</h2><span className="text-2xl text-[#50b6b2]">◯</span></div><div className="mt-5 grid grid-cols-[1fr_120px] items-center gap-4"><div className="space-y-3 text-xs"><div className="flex justify-between gap-4"><span>Acne</span><span className="text-[#c18b24]">● Moderate</span></div><div className="flex justify-between gap-4"><span>Dark Spots</span><span className="text-[#26945f]">● Low</span></div><div className="flex justify-between gap-4"><span>Pores</span><span className="text-[#c18b24]">● Moderate</span></div><div className="flex justify-between gap-4"><span>Redness</span><span className="text-[#26945f]">● Low</span></div></div><div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border-[10px] border-[#6ac8bd] border-l-[#f08b8d] border-b-[#f08b8d] text-2xl text-[#58b5b0]">♧</div></div><a href="#reports" className="mt-5 block text-xs font-bold text-[#287878]">View Full Report&nbsp; →</a></Card>
					<Card className="p-5"><div className="flex items-center justify-between"><h2 className="text-sm font-bold">Skin Score Progress</h2><button type="button" className="rounded-lg border border-[#e2e7ee] px-3 py-2 text-[10px] text-[#273550]">Last 1 Month&nbsp;⌄</button></div><ProgressChart /></Card>
				</div>

				<div className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_1fr]">
					<Card id="reports" className="p-5"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-bold">Recent Analyses</h2><a href="#reports" className="text-xs font-bold text-[#287878]">View All&nbsp; →</a></div><div>{analyses.map((analysis) => <div key={analysis.date} className="flex items-center gap-3 border-t border-[#edf0f4] py-3 text-xs"><img src={skinImage} alt="Skin analysis thumbnail" className="h-11 w-11 rounded-lg object-cover object-[48%_35%]" /><div className="min-w-0 flex-1"><p className="font-semibold">{analysis.date} <span className="font-normal text-[#69758a]">• &nbsp;{analysis.time}</span></p><p className="mt-1 text-[11px] text-[#69758a]">Completed</p></div><div className="hidden sm:block"><span className="text-[11px] text-[#69758a]">Score</span><strong className="ml-2 text-lg">{analysis.score}<small className="text-[10px] font-normal"> /100</small></strong></div><StatusBadge tone={analysis.tone}>{analysis.status}</StatusBadge><span className="text-lg text-[#69758a]">›</span></div>)}</div></Card>
					<div className="space-y-4"><Card className="p-5"><h2 className="text-sm font-bold">Quick Action</h2><div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-[#a9cfce] bg-[#fbffff] p-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e4f7f5] text-2xl text-[#147b82]">↥</div><div className="min-w-0 flex-1"><strong className="block text-xs">Start New Analysis</strong><p className="mt-1 text-[11px] leading-4 text-[#69758a]">Upload your skin image to get AI-powered insights.</p></div><a href={analyzePath} className="rounded-lg bg-[#09275d] px-3 py-2 text-[11px] font-bold text-white transition hover:bg-[#0b2c78]">＋ New Analysis</a></div></Card><Card className="p-5"><h2 className="text-sm font-bold">AI Assistant</h2><div className="mt-3 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e4f7f5] text-xl text-[#147b82]">♧</div><p className="flex-1 text-[11px] leading-4 text-[#69758a]">Ask me anything about your skin health.</p><button type="button" className="rounded-lg border border-[#75bdbb] px-4 py-2 text-[11px] font-bold text-[#287878] transition hover:bg-[#e9f8f7]">Chat Now</button></div></Card></div>
				</div>
			</main>
		</div>
	);
}