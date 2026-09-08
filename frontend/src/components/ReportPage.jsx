import '../styles/index.css';
import logoImage from '../assets/logo.jpeg';
import skinImage from '../assets/women-image.png';

const homePath = import.meta.env.BASE_URL;

function ScoreRing() {
	return <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-[16px] border-[#61c8bd] border-l-[#f08b8d] border-b-[#f08b8d]"><div className="text-center"><strong className="block text-5xl font-bold text-[#10245c]">82</strong><span className="text-xs text-[#69758a]">out of 100</span></div></div>;
}

function ReportCard({ children, className = '' }) {
	return <section className={`rounded-2xl border border-[#e3eaf1] bg-white p-5 shadow-[0_6px_20px_rgba(25,53,90,0.05)] sm:p-6 ${className}`}>{children}</section>;
}

export default function ReportPage() {
	return (
		<div className="min-h-screen bg-[#f7f9fc] text-[#182440]">
			<header className="border-b border-[#e5eaf0] bg-white">
				<div className="mx-auto flex h-[78px] max-w-[1400px] items-center justify-between px-[5%]">
					<a href={`${homePath}dashboard`} className="flex items-center gap-3"><img src={logoImage} alt="DermaCare AI logo" className="h-11 w-11 rounded-xl object-cover" /><div><strong className="block text-[20px] leading-tight text-[#10245c]">DermaCare <span className="text-[#1aa7a6]">AI</span></strong><span className="hidden text-[11px] text-[#68758d] sm:block">AI-Powered Skin Analysis &amp; Care</span></div></a>
					<div className="flex items-center gap-4"><button type="button" className="hidden rounded-lg border border-[#cfd8e8] px-4 py-2 text-xs font-bold text-[#182440] transition hover:border-[#2878e8] hover:text-[#2878e8] sm:block">Download Report</button><a href={`${homePath}dashboard`} className="text-sm font-bold text-[#287878] transition hover:text-[#0b2c78]">← Dashboard</a></div>
				</div>
			</header>

			<main className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 lg:py-12">
				<div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-[#2878e8]">Analysis Report</p><h1 className="text-3xl font-bold text-[#10245c] sm:text-4xl">Your skin health report</h1><p className="mt-2 text-sm text-[#69758a]">Completed 24 Aug 2025&nbsp; • &nbsp;10:30 AM</p></div><span className="inline-flex w-fit rounded-full bg-[#e1f6ec] px-4 py-2 text-xs font-bold text-[#258b5b]">Analysis completed</span></div>

				<div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
					<ReportCard className="flex flex-col items-center justify-center text-center"><h2 className="mb-6 self-start text-left text-base font-bold">Overall Skin Score</h2><ScoreRing /><span className="mt-5 rounded-full bg-[#e1f6ec] px-4 py-2 text-xs font-bold text-[#258b5b]">Good condition</span><p className="mt-4 max-w-[270px] text-xs leading-5 text-[#69758a]">Your skin is showing a healthy baseline with a few areas that could benefit from consistent care.</p></ReportCard>
					<ReportCard><div className="flex items-start justify-between"><div><h2 className="text-base font-bold">Image analyzed</h2><p className="mt-1 text-xs text-[#69758a]">Face and visible skin characteristics</p></div><span className="rounded-lg bg-[#e8f7f6] px-3 py-2 text-xl text-[#147b82]">✓</span></div><div className="mt-5 grid gap-5 sm:grid-cols-[160px_1fr] sm:items-center"><img src={skinImage} alt="Analyzed skin image" className="h-40 w-full rounded-xl object-cover object-[50%_30%] sm:w-40" /><div className="space-y-4"><div><div className="mb-1 flex justify-between text-xs"><span>Skin clarity</span><strong>84%</strong></div><div className="h-2 rounded-full bg-[#e8eef3]"><div className="h-2 w-[84%] rounded-full bg-[#53b9b2]" /></div></div><div><div className="mb-1 flex justify-between text-xs"><span>Even tone</span><strong>78%</strong></div><div className="h-2 rounded-full bg-[#e8eef3]"><div className="h-2 w-[78%] rounded-full bg-[#53b9b2]" /></div></div><div><div className="mb-1 flex justify-between text-xs"><span>Texture</span><strong>82%</strong></div><div className="h-2 rounded-full bg-[#e8eef3]"><div className="h-2 w-[82%] rounded-full bg-[#53b9b2]" /></div></div></div></div></ReportCard>
				</div>

				<div className="mt-5 grid gap-5 lg:grid-cols-2">
					<ReportCard><h2 className="text-base font-bold">Detected concerns</h2><p className="mt-1 text-xs text-[#69758a]">Visible concerns found in this analysis</p><div className="mt-5 space-y-4"><div className="flex items-center justify-between rounded-xl bg-[#fff9ec] p-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffe7b4] text-[#bb831d]">●</span><div><strong className="block text-sm">Acne</strong><span className="text-xs text-[#69758a]">Small areas of active blemishes</span></div></div><span className="text-xs font-bold text-[#b78123]">Moderate</span></div><div className="flex items-center justify-between rounded-xl bg-[#f0fbf5] p-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d6f3e3] text-[#26945f]">●</span><div><strong className="block text-sm">Dark spots</strong><span className="text-xs text-[#69758a]">Mild uneven pigmentation</span></div></div><span className="text-xs font-bold text-[#26945f]">Low</span></div></div></ReportCard>
					<ReportCard><h2 className="text-base font-bold">Personalized recommendations</h2><p className="mt-1 text-xs text-[#69758a]">Simple steps to support your skin health</p><ul className="mt-5 space-y-4 text-xs leading-5 text-[#5f6d84]"><li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e4f7f5] font-bold text-[#147b82]">1</span>Use a gentle cleanser and avoid scrubbing active blemishes.</li><li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e4f7f5] font-bold text-[#147b82]">2</span>Apply broad-spectrum sunscreen daily to help prevent dark spots.</li><li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e4f7f5] font-bold text-[#147b82]">3</span>Track changes with another analysis in two to four weeks.</li></ul></ReportCard>
				</div>

				<ReportCard className="mt-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-base font-bold">Keep your skin journey moving</h2><p className="mt-1 text-xs text-[#69758a]">This report is informational and does not replace medical advice.</p></div><a href={`${homePath}analyze`} className="rounded-lg bg-[#09275d] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#0b2c78]">Start New Analysis&nbsp; →</a></ReportCard>
			</main>
		</div>
	);
}
