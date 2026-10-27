import { useEffect, useState } from 'react';
import '../styles/index.css';
import logoImage from '../assets/logo.jpeg';
import skinImage from '../assets/women-image.png';
import { apiRequest } from '../lib/api';

const homePath = import.meta.env.BASE_URL;
const analyzePath = `${homePath}analyze`;
const reportPath = `${homePath}report`;
const profilePath = `${homePath}profile`; 

const sidebarItems = [
  ['⌂', 'Dashboard', true],
  ['♧', 'Analysis', false, analyzePath],
  ['▤', 'Reports', false, reportPath],
  ['♙', 'Profile', false, profilePath],
  ['☵', 'AI Assistant'],
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
		<p className="mt-3 text-xs leading-5 text-[#69758a]">A validated skin score is not available from the current image-quality service.</p>
	);
}

function ProgressChart({ analyses }) {
	return (
		<div className="mt-5 space-y-3">
			{analyses.length ? analyses.slice(0, 5).map((analysis) => (
				<div key={analysis._id} className="flex items-center justify-between border-b border-[#edf1f5] pb-2 text-xs">
					<span>{new Date(analysis.createdAt).toLocaleDateString()}</span>
					<span className="text-[#69758a]">Informational analysis</span>
				</div>
			)) : <p className="text-xs text-[#69758a]">Completed analyses will appear here.</p>}
		</div>
	);
}

export default function DashboardPage() {
	const [userName, setUserName] = useState(() => {
		try {
			const user = JSON.parse(localStorage.getItem('dermacare-user') || 'null');
			return typeof user?.name === 'string' && user.name.trim()
				? user.name.trim()
				: 'there';
		} catch {
			return 'there';
		}
	});
	const [analyses, setAnalyses] = useState([]);
	const [historyError, setHistoryError] = useState('');

	useEffect(() => {
		if (!localStorage.getItem('dermacare-auth-token')) {
			window.location.href = `${homePath}login`;
			return;
		}
		let active = true;
		Promise.all([apiRequest('/api/profile'), apiRequest('/api/analyses')])
			.then(([profile, history]) => {
				if (!active) return;
				if (profile.user?.name) setUserName(profile.user.name);
				setAnalyses(Array.isArray(history.analyses) ? history.analyses : []);
			})
			.catch((error) => {
				if (active) setHistoryError(error.message || 'Analysis history could not be loaded.');
			});
		return () => { active = false; };
	}, []);

	const latestAnalysis = analyses[0];
	const latestAnalysisDate = latestAnalysis?.createdAt
		? new Date(latestAnalysis.createdAt).toLocaleString()
		: 'No analyses yet';

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
  {sidebarItems.map(([icon, label, active, path]) => (
    <a
      key={label}
      href={active ? '#dashboard' : path || '#'}
      className={`mb-1 flex min-h-11 items-center justify-center gap-3 rounded-lg px-3 text-[13px] font-semibold transition sm:flex-col sm:gap-1 lg:flex-row lg:justify-start lg:gap-3 ${
        active
          ? 'bg-[#0aa9ad] text-white shadow-[0_5px_15px_rgba(0,196,190,0.2)]'
          : 'text-white/80 hover:bg-white/10 hover:text-white'
      }`}
    >
      <span className="text-lg leading-none" aria-hidden="true">{icon}</span>
      <span>{label}</span>
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
						<h1 className="text-2xl font-bold tracking-[-0.5px] text-[#10245c] sm:text-3xl">Welcome back, {userName} <span aria-hidden="true">👋</span></h1>
						<p className="mt-1 text-sm text-[#69758a]">Here&apos;s your skin health overview.</p>
					</div>
					<div className="flex items-center gap-4">
						<button type="button" aria-label="View notifications" className="relative hidden text-2xl text-[#182440] sm:block">♧<span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#bd3f4d] text-[9px] text-white">3</span></button>
						<button type="button" aria-label="Open profile menu" className="flex items-center gap-2"><img src={skinImage} alt={`${userName} profile`} className="h-10 w-10 rounded-full object-cover object-[48%_35%]" /><span className="text-sm text-[#69758a]">⌄</span></button>
					</div>
				</header>

				{historyError && <p role="alert" className="mb-4 rounded-lg bg-[#fff0f0] px-4 py-3 text-sm text-[#a8333a]">{historyError}</p>}
				<div className="grid gap-4 xl:grid-cols-3">
					<Card className="p-5">
						<div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e5f8f6] text-xl text-[#147b82]">⌁</div><h2 className="text-sm font-bold">Skin Score</h2></div><StatusBadge>Not assessed</StatusBadge></div>
						<div className="mt-2 flex items-baseline gap-2"><strong className="text-4xl font-bold text-[#10245c]">—</strong><span className="text-sm text-[#69758a]">/ 100</span></div>
						<ScoreSparkline />
						<a href={analyzePath} className="mt-3 inline-block text-xs font-bold text-[#287878]">Start an analysis&nbsp; →</a>
					</Card>

					<Card className="p-5"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef4fb] text-xl text-[#182440]">□</div><h2 className="text-sm font-bold">Last Analysis</h2></div><strong className="mt-5 block text-xl font-bold text-[#10245c]">{latestAnalysisDate}</strong><div className="mt-2"><StatusBadge>{latestAnalysis ? 'Saved' : 'No history'}</StatusBadge></div><a href="#reports" className="mt-8 block text-xs font-bold text-[#287878]">View History&nbsp; →</a></Card>

					<Card className="p-5"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff0ed] text-xl text-[#b84d50]">!</div><h2 className="text-sm font-bold">Skin Concerns</h2></div><strong className="text-sm text-[#10245c]">Not assessed</strong></div><p className="mt-5 text-xs leading-5 text-[#69758a]">The current service reports image quality and color measurements. It does not identify or diagnose skin conditions.</p></Card>
				</div>

				<div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.45fr]">
					<Card className="p-5"><div className="flex items-center justify-between"><h2 className="text-sm font-bold">Latest Image Quality</h2><span className="text-2xl text-[#50b6b2]">◯</span></div>{latestAnalysis?.analysisResult?.quality ? <div className="mt-5 grid grid-cols-2 gap-3 text-xs"><div className="rounded-lg bg-[#f5f9fb] p-3"><span className="block text-[#69758a]">Brightness</span><strong>{latestAnalysis.analysisResult.quality.brightness ?? '—'}</strong></div><div className="rounded-lg bg-[#f5f9fb] p-3"><span className="block text-[#69758a]">Sharpness</span><strong>{latestAnalysis.analysisResult.quality.sharpness ?? '—'}</strong></div><div className="rounded-lg bg-[#f5f9fb] p-3"><span className="block text-[#69758a]">Color spread</span><strong>{latestAnalysis.analysisResult.quality.colorSpread ?? '—'}</strong></div></div> : <p className="mt-5 text-xs text-[#69758a]">Measurements will appear after your first analysis.</p>}<a href={latestAnalysis ? `${reportPath}?analysis=${latestAnalysis._id}` : reportPath} className="mt-5 block text-xs font-bold text-[#287878]">Open latest report&nbsp; →</a></Card>
					<Card className="p-5"><div className="flex items-center justify-between"><h2 className="text-sm font-bold">Analysis Activity</h2><span className="text-xs text-[#69758a]">{analyses.length} saved</span></div><ProgressChart analyses={analyses} /></Card>
				</div>

				<div className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_1fr]">
					<Card id="reports" className="p-5"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-bold">Recent Analyses</h2><span className="text-xs text-[#69758a]">{analyses.length} saved</span></div>{analyses.length ? analyses.map((analysis) => <a key={analysis._id} href={`${reportPath}?analysis=${analysis._id}`} className="flex items-center gap-3 border-t border-[#edf0f4] py-3 text-xs hover:bg-[#f8fbfc]"><img src={skinImage} alt="Skin analysis" className="h-11 w-11 rounded-lg object-cover object-[48%_35%]" /><div className="min-w-0 flex-1"><p className="font-semibold">{new Date(analysis.createdAt).toLocaleString()}</p><p className="mt-1 text-[11px] text-[#69758a]">{analysis.analysisResult?.analysisType || 'Informational image analysis'}</p></div><StatusBadge>Saved</StatusBadge><span className="text-lg text-[#69758a]">›</span></a>) : <p className="py-8 text-center text-sm text-[#69758a]">{historyError ? 'History is unavailable.' : 'No saved analyses yet.'}</p>}</Card>
					<div className="space-y-4"><Card className="p-5"><h2 className="text-sm font-bold">Quick Action</h2><div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-[#a9cfce] bg-[#fbffff] p-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e4f7f5] text-2xl text-[#147b82]">↥</div><div className="min-w-0 flex-1"><strong className="block text-xs">Start New Analysis</strong><p className="mt-1 text-[11px] leading-4 text-[#69758a]">Upload your skin image to get AI-powered insights.</p></div><a href={analyzePath} className="rounded-lg bg-[#09275d] px-3 py-2 text-[11px] font-bold text-white transition hover:bg-[#0b2c78]">＋ New Analysis</a></div></Card><Card className="p-5"><h2 className="text-sm font-bold">AI Assistant</h2><div className="mt-3 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e4f7f5] text-xl text-[#147b82]">♧</div><p className="flex-1 text-[11px] leading-4 text-[#69758a]">Ask me anything about your skin health.</p><button type="button" className="rounded-lg border border-[#75bdbb] px-4 py-2 text-[11px] font-bold text-[#287878] transition hover:bg-[#e9f8f7]">Chat Now</button></div></Card></div>
				</div>
			</main>
		</div>
	);
}