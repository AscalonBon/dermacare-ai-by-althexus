import { useState } from 'react';
import '../styles/index.css';
import logoImage from '../assets/logo.jpeg';
import skinImage from '../assets/women-image.png';

const homePath = import.meta.env.BASE_URL;
const reportPath = `${homePath}report`;

export default function AnalyzePage() {
	const [selectedImage, setSelectedImage] = useState(null);
	const [previewUrl, setPreviewUrl] = useState('');

	const handleImageChange = (event) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setSelectedImage(file);
		setPreviewUrl(URL.createObjectURL(file));
	};

	return (
		<div className="min-h-screen bg-[#f7f9fc] text-[#182440]">
			<header className="border-b border-[#e5eaf0] bg-white">
				<div className="mx-auto flex h-[78px] max-w-[1400px] items-center justify-between px-[5%]">
					<a href={`${homePath}dashboard`} className="flex items-center gap-3">
						<img src={logoImage} alt="DermaCare AI logo" className="h-11 w-11 rounded-xl object-cover" />
						<div>
							<strong className="block text-[20px] leading-tight text-[#10245c]">DermaCare <span className="text-[#1aa7a6]">AI</span></strong>
							<span className="hidden text-[11px] text-[#68758d] sm:block">AI-Powered Skin Analysis &amp; Care</span>
						</div>
					</a>
					<a href={`${homePath}dashboard`} className="text-sm font-bold text-[#287878] transition hover:text-[#0b2c78]">← Back to Dashboard</a>
				</div>
			</header>

			<main className="mx-auto max-w-[1050px] px-4 py-8 sm:px-6 lg:py-12">
				<div className="mb-8 max-w-[680px]">
					<p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-[#2878e8]">New Analysis</p>
					<h1 className="text-3xl font-bold text-[#10245c] sm:text-4xl">Understand your skin better.</h1>
					<p className="mt-3 text-sm leading-6 text-[#69758a]">Upload a clear image and our AI will highlight visible skin concerns with practical, easy-to-understand insights.</p>
				</div>

				<div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
					<section className="rounded-2xl border border-[#e3eaf1] bg-white p-5 shadow-[0_6px_20px_rgba(25,53,90,0.05)] sm:p-7">
						<div className="mb-5 flex items-center justify-between">
							<div><h2 className="text-lg font-bold text-[#182440]">Upload skin image</h2><p className="mt-1 text-xs text-[#69758a]">JPG, PNG, or WEBP up to 10 MB</p></div>
							<span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4f7f5] text-xl text-[#147b82]">↥</span>
						</div>

						<label className={`flex min-h-[330px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 text-center transition ${previewUrl ? 'border-[#65bdb9] bg-[#f5fffe]' : 'border-[#b8cfda] bg-[#fbfdff] hover:border-[#2878e8] hover:bg-[#f5faff]'}`}>
							{previewUrl ? <img src={previewUrl} alt="Selected skin preview" className="h-[250px] w-full rounded-lg object-cover object-[50%_30%]" /> : <><img src={skinImage} alt="Example skin analysis" className="mb-4 h-28 w-28 rounded-full object-cover object-[50%_30%] opacity-80" /><strong className="text-sm text-[#182440]">Drag and drop your image here</strong><span className="my-2 text-xs text-[#69758a]">or</span><span className="rounded-lg bg-[#e5f7f5] px-4 py-2 text-xs font-bold text-[#147b82]">Browse Files</span></>}
							<input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} className="sr-only" />
						</label>

						{selectedImage && <div className="mt-4 flex items-center justify-between rounded-lg bg-[#f3f8fc] px-4 py-3 text-xs"><span className="truncate text-[#5f6d84]">{selectedImage.name}</span><button type="button" onClick={() => { setSelectedImage(null); setPreviewUrl(''); }} className="font-bold text-[#b84d50]">Remove</button></div>}
						<a href={selectedImage ? reportPath : '#'} className={`mt-6 flex min-h-12 items-center justify-center rounded-lg text-sm font-bold text-white transition ${selectedImage ? 'bg-[#09275d] hover:bg-[#0b2c78]' : 'cursor-not-allowed bg-[#b7c4d3]'}`}>Analyze My Skin&nbsp; →</a>
					</section>

					<aside className="space-y-5">
						<section className="rounded-2xl border border-[#e3eaf1] bg-white p-6 shadow-[0_6px_20px_rgba(25,53,90,0.05)]"><h2 className="text-base font-bold">For the best results</h2><ul className="mt-5 space-y-4 text-xs leading-5 text-[#69758a]"><li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e4f7f5] font-bold text-[#147b82]">1</span>Use natural or evenly distributed lighting.</li><li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e4f7f5] font-bold text-[#147b82]">2</span>Keep the camera focused and the skin area clear.</li><li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e4f7f5] font-bold text-[#147b82]">3</span>Avoid filters, makeup, glare, and blurry images.</li></ul></section>
						<section className="rounded-2xl bg-[#e8f7f6] p-6"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl text-[#147b82]">♧</div><h2 className="text-base font-bold text-[#10245c]">A helpful starting point</h2><p className="mt-2 text-xs leading-5 text-[#5f6d84]">Your results are informational and do not replace advice from a qualified healthcare professional.</p></section>
					</aside>
				</div>
			</main>
		</div>
	);
}
