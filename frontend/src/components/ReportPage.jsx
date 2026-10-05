import { useState } from 'react';
import '../styles/index.css';
import logoImage from '../assets/logo.jpeg';

const homePath = import.meta.env.BASE_URL;
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

function ReportCard({ children, className = '' }) {
	return <section className={`rounded-2xl border border-[#e3eaf1] bg-white p-5 shadow-[0_6px_20px_rgba(25,53,90,0.05)] sm:p-6 ${className}`}>{children}</section>;
}

function Measurement({ label, value, unit = '' }) {
	return <div className="rounded-xl bg-[#f5f9fb] p-4"><span className="block text-xs text-[#69758a]">{label}</span><strong className="mt-1 block text-xl text-[#10245c]">{value}{unit}</strong></div>;
}

export default function ReportPage() {
	const [analysis] = useState(() => {
		try {
			return JSON.parse(sessionStorage.getItem('dermacare-analysis') || 'null');
		} catch {
			return null;
		}
	});

	return (
		<div className="min-h-screen bg-[#f7f9fc] text-[#182440]">
			<header className="border-b border-[#e5eaf0] bg-white">
				<div className="mx-auto flex h-[78px] max-w-[1400px] items-center justify-between px-[5%]">
					<a href={`${homePath}dashboard`} className="flex items-center gap-3"><img src={logoImage} alt="DermaCare AI logo" className="h-11 w-11 rounded-xl object-cover" /><div><strong className="block text-[20px] leading-tight text-[#10245c]">DermaCare <span className="text-[#1aa7a6]">AI</span></strong><span className="hidden text-[11px] text-[#68758d] sm:block">AI-Powered Skin Analysis &amp; Care</span></div></a>
					<a href={`${homePath}dashboard`} className="text-sm font-bold text-[#287878] transition hover:text-[#0b2c78]">← Dashboard</a>
				</div>
			</header>

			<main className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 lg:py-12">
				<div className="mb-8"><p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-[#2878e8]">Image analysis</p><h1 className="text-3xl font-bold text-[#10245c] sm:text-4xl">Your image report</h1><p className="mt-2 text-sm text-[#69758a]">Informational image-quality and color measurements</p></div>

				{!analysis ? (
					<ReportCard><h2 className="text-lg font-bold">No analysis found</h2><p className="mt-2 text-sm text-[#69758a]">Upload an image to create an analysis report.</p><a href={`${homePath}analyze`} className="mt-5 inline-flex rounded-lg bg-[#09275d] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#0b2c78]">Analyze an image →</a></ReportCard>
				) : (
					<>
						<div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
							<ReportCard>
								<h2 className="text-base font-bold">Uploaded image</h2>
								<img src={`${apiBaseUrl}${analysis.imageUrl}`} alt="Image used for analysis" className="mt-4 max-h-[420px] w-full rounded-xl object-contain" />
								<p className="mt-3 text-xs text-[#69758a]">{analysis.image?.width} × {analysis.image?.height} pixels</p>
							</ReportCard>
							<ReportCard>
								<h2 className="text-base font-bold">Image characteristics</h2>
								<p className="mt-1 text-xs text-[#69758a]">Measurements can change with lighting, camera settings, and image quality.</p>
								<div className="mt-5 grid gap-3 sm:grid-cols-2">
									<Measurement label="Brightness" value={analysis.quality?.brightness ?? '—'} />
									<Measurement label="Sharpness" value={analysis.quality?.sharpness ?? '—'} />
									<Measurement label="Color spread" value={analysis.quality?.colorSpread ?? '—'} />
									<Measurement label="Mean hue" value={analysis.visualMeasurements?.meanHue ?? '—'} />
								</div>
								{analysis.quality?.notes?.length > 0 && <div className="mt-5 rounded-xl bg-[#fff9ec] p-4"><h3 className="text-sm font-bold text-[#8b641e]">Image quality suggestions</h3><ul className="mt-2 list-inside list-disc space-y-2 text-xs leading-5 text-[#6f5a34]">{analysis.quality.notes.map((note) => <li key={note}>{note}</li>)}</ul></div>}
							</ReportCard>
						</div>

						<ReportCard className="mt-5">
							<div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><h2 className="text-base font-bold">Optional classifier</h2><p className="mt-1 text-xs text-[#69758a]">Predictions only appear after a project-specific model has been trained and configured.</p></div><span className="w-fit rounded-full bg-[#f0f3f7] px-3 py-1.5 text-xs font-bold text-[#5f6d84]">{analysis.classifier?.status === 'available' ? 'Configured' : 'Not configured'}</span></div>
							{analysis.classifier?.predictions?.length > 0 && <ul className="mt-4 space-y-2">{analysis.classifier.predictions.map(({ label, score }) => <li key={label} className="flex justify-between rounded-lg bg-[#f5f9fb] px-4 py-3 text-sm"><span>{label}</span><strong>{Math.round(score * 100)}%</strong></li>)}</ul>}
							<p className="mt-5 rounded-xl bg-[#fff8eb] p-4 text-xs leading-5 text-[#715b34]">{analysis.disclaimer} This report is not medical advice and must not be used to diagnose, treat, or rule out a condition. Consult a qualified healthcare professional about skin concerns.</p>
						</ReportCard>
					</>
				)}
			</main>
		</div>
	);
}
