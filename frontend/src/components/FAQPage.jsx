import { useState } from 'react';
import '../styles/index.css';
import logoImage from '../assets/logo.jpeg';

const homePath = import.meta.env.BASE_URL;

const questions = [
	{
		question: 'What is DermaCare AI?',
		answer:
			'DermaCare AI is an image-based skin health assistant that helps you understand visible skin concerns and discover useful care insights.',
	},
	{
		question: 'How does the skin analysis work?',
		answer:
			'Upload a clear image of the area you want to review. The AI analyzes visible characteristics and presents possible concerns, observations, and general skincare guidance.',
	},
	{
		question: 'Can DermaCare AI diagnose a skin condition?',
		answer:
			'No. The analysis is informational and is not a medical diagnosis. For a diagnosis, treatment plan, or concern about a changing symptom, consult a qualified healthcare professional.',
	},
	{
		question: 'What kind of image should I upload?',
		answer:
			'Use a well-lit, in-focus image with the skin area clearly visible. Avoid heavy filters, glare, and images that are too dark or blurry.',
	},
	{
		question: 'Is my information private?',
		answer:
			'Privacy is a core part of the experience. Your images and information should be handled according to the platform privacy policy and security practices.',
	},
	{
		question: 'How quickly will I receive results?',
		answer:
			'Most analyses are designed to return results within seconds, depending on image size, connection speed, and system availability.',
	},
];

function FAQAccordion() {
	const [openIndex, setOpenIndex] = useState(0);

	const toggleQuestion = (index) => {
		setOpenIndex((currentIndex) => (currentIndex === index ? -1 : index));
	};

	return (
		<section id="faq" className="bg-[#f7faff] px-[5%] py-20">
			<div className="mx-auto max-w-[1100px]">
				<div className="mx-auto mb-12 max-w-[680px] text-center">
					<p className="mb-3 text-sm font-bold uppercase tracking-[2px] text-[#2878e8]">FAQ</p>
					<h2 className="mb-4 text-3xl font-bold text-[#10245c] sm:text-4xl">
						Clear answers for better skin decisions.
					</h2>
					<p className="text-[#5f6d84]">
						Find quick answers about skin analysis, privacy, and how DermaCare AI can support your skincare routine.
					</p>
				</div>

				<div className="mx-auto max-w-[850px] space-y-4">
					{questions.map(({ question, answer }, index) => {
						const isOpen = openIndex === index;
						const answerId = `faq-answer-${index}`;

						return (
							<div
								key={question}
								className="overflow-hidden rounded-2xl border border-[#e2e7ef] bg-white shadow-[0_8px_25px_rgba(35,77,130,0.05)]"
							>
								<h3>
									<button
										type="button"
										aria-expanded={isOpen}
										aria-controls={answerId}
										onClick={() => toggleQuestion(index)}
										className="flex min-h-16 w-full items-center justify-between gap-6 px-6 py-5 text-left text-[16px] font-bold text-[#182440] transition hover:text-[#2168d7] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2168d7] sm:px-7"
									>
										<span>{question}</span>
										<span
											aria-hidden="true"
											className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e9f3ff] text-xl font-normal text-[#2168d7] transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
										>
											+
										</span>
									</button>
								</h3>

								<div
									id={answerId}
									hidden={!isOpen}
									className="border-t border-[#edf1f6] px-6 pb-5 pt-4 text-sm leading-6 text-[#5f6d84] sm:px-7"
								>
									{answer}
								</div>
							</div>
						);
					})}
				</div>

				<p className="mx-auto mt-10 max-w-[650px] text-center text-sm text-[#69758a]">
					Have a concern that is not covered here? A healthcare professional can provide advice tailored to your skin and medical history.
				</p>
			</div>
		</section>
	);
}

export default function FAQPage() {
	return (
		<div className="min-h-screen bg-white">
			<header className="sticky top-0 z-50 border-b border-[#e8edf5] bg-white/95 backdrop-blur">
				<div className="mx-auto flex h-[78px] max-w-[1400px] items-center justify-between px-[5%]">
					<a href={homePath} className="flex items-center gap-3">
						<img
							src={logoImage}
							alt="DermaCare AI logo"
							className="h-11 w-11 rounded-xl object-cover"
						/>
						<div>
							<h1 className="text-[21px] font-bold leading-tight text-[#10245c]">DermaCare AI</h1>
							<span className="hidden text-[11px] text-[#68758d] sm:block">
								AI-Powered Skin Analysis &amp; Care
							</span>
						</div>
					</a>

					<a
						href={homePath}
						className="rounded-[10px] border border-[#cfd8e8] px-5 py-3 text-sm font-semibold text-[#182440] transition hover:border-[#2168d7] hover:text-[#2168d7]"
					>
						Back to Home
					</a>
				</div>
			</header>

			<main>
				<div className="bg-[radial-gradient(circle_at_50%_0%,#e9f4ff_0%,#f7faff_45%,#ffffff_78%)] px-[5%] pb-16 pt-20 text-center sm:pb-20 sm:pt-28">
					<p className="mb-3 text-sm font-bold uppercase tracking-[2px] text-[#2878e8]">Help Center</p>
					<h2 className="mx-auto mb-5 max-w-[760px] text-4xl font-bold leading-tight text-[#10245c] sm:text-5xl">
						Frequently asked questions
					</h2>
					<p className="mx-auto max-w-[620px] text-lg leading-7 text-[#5f6d84]">
						Everything you need to know about DermaCare AI, from image uploads to privacy and results.
					</p>
				</div>
				<FAQAccordion />
			</main>

			<footer className="border-t border-[#dfe8f3] bg-[#eef6ff] px-[5%] py-8">
				<div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-5 sm:flex-row">
					<a href={homePath} className="flex items-center gap-3">
						<img src={logoImage} alt="DermaCare AI logo" className="h-9 w-9 rounded-lg object-cover" />
						<span className="font-bold text-[#10245c]">DermaCare AI</span>
					</a>
					<p className="text-center text-xs text-[#68758d]">&copy; 2026 DermaCare AI. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
}