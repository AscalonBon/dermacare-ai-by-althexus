import '../styles/index.css';
import logoImage from '../assets/logo.jpeg';
import womenImage from '../assets/women-image.png';

export function App() {
  return (
    <>
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-[#e8edf5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[78px] max-w-[1400px] items-center justify-between px-[5%]">
          <a href="#home" className="flex items-center gap-3">
            <img
              src={logoImage}
              alt="DermaCare AI logo"
              className="h-11 w-11 rounded-xl object-cover"
            />
            <div>
              <h2 className="text-[21px] font-bold leading-tight text-[#10245c]">DermaCare AI</h2>
              <span className="hidden text-[11px] text-[#68758d] sm:block">
                AI-Powered Skin Analysis & Care
              </span>
            </div>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#home" className="text-[15px] font-semibold text-[#17223d] transition hover:text-[#2168d7]">Home</a>
            <a href="#about" className="text-[15px] font-semibold text-[#17223d] transition hover:text-[#2168d7]">About</a>
            <a href="#how-it-works" className="text-[15px] font-semibold text-[#17223d] transition hover:text-[#2168d7]">How It Works</a>
            <a href="#features" className="text-[15px] font-semibold text-[#17223d] transition hover:text-[#2168d7]">Features</a>
          </nav>

          <div className="w-[110px] md:w-[135px]" aria-hidden="true" />
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="min-h-[590px] px-[5%] pt-[65px] pb-[55px] grid grid-cols-1 lg:grid-cols-2 items-center gap-[35px] overflow-hidden bg-[radial-gradient(circle_at_80%_45%,#e9f4ff_0%,#f5f9ff_35%,#ffffff_70%)]">
        <div className="max-w-[650px] relative z-[2] text-center lg:text-left mx-auto lg:mx-0">
          <div className="inline-block px-[18px] py-[10px] mb-[25px] rounded-[25px] bg-[#e9f3ff] text-[#2365b3] text-[15px] font-semibold">
            ✨ AI-Powered Skin Health Analysis
          </div>
          
          <h1 className="text-[clamp(44px,5vw,68px)] leading-[1.08] tracking-[-2px] text-[#10245c] mb-[25px] font-bold">
            Your AI-Powered
            <span className="block text-[#2168d7]">Skin Health Companion</span>
          </h1>
          
          <p className="max-w-[540px] mx-auto lg:mx-0 text-[#5f6d84] text-[20px] leading-[1.6] mb-[30px] font-normal">
            Analyze, understand and improve your skin with advanced AI technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-[15px] justify-center lg:justify-start mb-[42px]">
            <a href="#" className="inline-flex items-center justify-center px-[27px] py-[14px] rounded-[10px] bg-[#123a91] text-white font-semibold hover:bg-[#0b2c78] hover:-translate-y-[2px] transition duration-300">
              Get Started →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px] max-w-[750px] mx-auto lg:mx-0 text-left">
            {/* Benefit 1 */}
            <div className="flex items-start gap-[12px]">
              <div className="min-w-[38px] h-[38px] border-2 border-[#2580d9] rounded-full flex items-center justify-center text-[#2580d9] text-[19px] font-bold">
                ✓
              </div>
              <div>
                <strong className="block text-[#182440] text-[14px] mb-[3px] font-bold">Secure & Private</strong>
                <p className="text-[12px] text-[#6b778c] leading-[1.5] font-normal">Your data is encrypted and protected</p>
              </div>
            </div>
            {/* Benefit 2 */}
            <div className="flex items-start gap-[12px]">
              <div className="min-w-[38px] h-[38px] border-2 border-[#2580d9] rounded-full flex items-center justify-center text-[#2580d9] text-[19px] font-bold">
                ✦
              </div>
              <div>
                <strong className="block text-[#182440] text-[14px] mb-[3px] font-bold">AI-Powered</strong>
                <p className="text-[12px] text-[#6b778c] leading-[1.5] font-normal">Advanced AI models for accurate analysis</p>
              </div>
            </div>
            {/* Benefit 3 */}
            <div className="flex items-start gap-[12px]">
              <div className="min-w-[38px] h-[38px] border-2 border-[#2580d9] rounded-full flex items-center justify-center text-[#2580d9] text-[19px] font-bold">
                ϟ
              </div>
              <div>
                <strong className="block text-[#182440] text-[14px] mb-[3px] font-bold">Fast Results</strong>
                <p className="text-[12px] text-[#6b778c] leading-[1.5] font-normal">Get results in seconds with detailed insights</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-[530px] flex items-end justify-center">
          <img
            src={womenImage}
            alt="AI-powered skin analysis"
            className="w-full max-w-[590px] h-[530px] object-cover object-center rounded-[20px]"
          />

          {/* Analysis Card */}
          <div className="absolute top-[45px] left-[3%] w-[145px] bg-white/95 border border-[#e3eaf4] rounded-[16px] shadow-[0_12px_35px_rgba(35,77,130,0.12)] p-[18px] z-[3] max-sm:scale-80">
            <small className="block text-[#69758a] text-xs mb-[5px] font-normal">AI Analysis</small>
            <strong className="block text-[30px] text-[#123a91] font-bold">
              82<span className="text-[14px] text-[#69758a] font-normal">/100</span>
            </strong>
            <label className="text-[#25a878] text-[13px] font-bold">Good</label>
          </div>

          {/* Recommendation Card */}
          <div className="absolute top-[95px] right-0 w-[170px] bg-white/95 border border-[#e3eaf4] rounded-[16px] shadow-[0_12px_35px_rgba(35,77,130,0.12)] p-[18px] z-[3] max-sm:scale-80">
            <div className="text-[24px] font-bold text-[#2878e8] mb-[7px]">✚</div>
            <strong className="block text-[13px] text-[#273550] font-bold">Personalized</strong>
            <span className="block text-[13px] text-[#273550] font-normal">Recommendations</span>
          </div>

          {/* Detect Card */}
          <div className="absolute bottom-[105px] left-[12%] w-[145px] bg-white/95 border border-[#e3eaf4] rounded-[16px] shadow-[0_12px_35px_rgba(35,77,130,0.12)] p-[18px] z-[3] max-sm:scale-80">
            <strong className="text-[14px] font-bold">Detects</strong>
            <ul className="pl-[17px] mt-[8px] text-[#286db5] text-[12px] font-normal">
              <li>Acne</li>
              <li>Dark Spots</li>
              <li>Pores</li>
            </ul>
          </div>

          {/* Progress Card */}
          <div className="absolute bottom-[90px] right-[2%] w-[110px] bg-white/95 border border-[#e3eaf4] rounded-[16px] shadow-[0_12px_35px_rgba(35,77,130,0.12)] p-[18px] z-[3] max-sm:scale-80">
            <div className="text-[24px] font-bold text-[#2878e8] mb-[7px]">↗</div>
            <strong className="block text-[13px] font-bold">Track</strong>
            <span className="block text-[13px] font-normal">Progress</span>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="px-[5%] py-20 bg-white">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[2px] text-[#2878e8]">About DermaCare AI</p>
            <h2 className="mb-5 text-3xl font-bold leading-tight text-[#10245c] sm:text-4xl">
              Smarter skin care starts with better insights.
            </h2>
            <p className="mb-5 leading-7 text-[#5f6d84]">
              DermaCare AI is an AI-powered platform designed to help users understand visible skin concerns through image-based analysis.
            </p>
            <p className="leading-7 text-[#5f6d84]">
              The platform combines intelligent analysis with clear insights and personalized skincare guidance, making skin health information easier to understand and access.
            </p>
          </div>

          <div className="rounded-3xl bg-[#f3f8ff] p-8 sm:p-10">
            <div className="mb-5 text-4xl text-[#2878e8]">✦</div>
            <h3 className="mb-3 text-xl font-bold text-[#182440]">AI-Powered Skin Assistance</h3>
            <p className="leading-7 text-[#5f6d84]">
              Upload a skin image, receive an AI-based analysis, and get useful insights to better understand your skin.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="px-[5%] py-20 bg-[#f7faff]">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto mb-12 max-w-[650px] text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[2px] text-[#2878e8]">How It Works</p>
            <h2 className="mb-4 text-3xl font-bold text-[#10245c] sm:text-4xl">Simple steps. Clear skin insights.</h2>
            <p className="text-[#5f6d84]">
              DermaCare AI keeps the process simple so users can move from an image to useful insights in just a few steps.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['01', 'Upload Image', 'Upload a clear image of the skin area you want to analyze.'],
              ['02', 'AI Analysis', 'Our AI processes the image and analyzes visible skin characteristics.'],
              ['03', 'Detect Condition', 'The system identifies possible visible skin concerns from the analysis.'],
              ['04', 'Get Insights', 'Receive clear results and personalized skincare guidance.'],
            ].map(([number, title, description]) => (
              <div key={number} className="rounded-2xl border border-[#e1e8f2] bg-white p-6 shadow-[0_8px_25px_rgba(35,77,130,0.05)]">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9f3ff] text-sm font-bold text-[#2168d7]">
                  {number}
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#182440]">{title}</h3>
                <p className="text-sm leading-6 text-[#69758a]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-[5%] py-20 bg-white">
        <div className="mx-auto max-w-[1250px]">
          <div className="mx-auto mb-12 max-w-[650px] text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[2px] text-[#2878e8]">Features</p>
            <h2 className="mb-4 text-3xl font-bold text-[#10245c] sm:text-4xl">
              Everything you need for smarter skin care
            </h2>
            <p className="text-[#5f6d84]">
              Designed to make skin analysis simple, informative and personalized.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              ['▣', 'AI-Powered Detection', 'AI-based analysis helps identify visible skin concerns from uploaded images.'],
              ['☷', 'Detailed Analysis', 'Get clear results with useful scores, observations and insights.'],
              ['✧', 'Personalized Care', 'Receive skincare guidance based on the analysis and your needs.'],
              ['✓', 'Secure & Private', 'Your images and information are handled with privacy and security in mind.'],
            ].map(([icon, title, description]) => (
              <div key={title} className="rounded-2xl border border-[#e2e7ef] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(38,75,130,0.1)]">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f5ff] text-2xl font-bold text-[#294cc4]">
                  {icon}
                </div>
                <h3 className="mb-3 text-[17px] font-bold text-[#182440]">{title}</h3>
                <p className="text-[13px] leading-6 text-[#69758a]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#dfe8f3] bg-[#eef6ff] px-[5%] py-8">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-5 sm:flex-row">
          <a href="#home" className="flex items-center gap-3">
            <img src={logoImage} alt="DermaCare AI logo" className="h-9 w-9 rounded-lg object-cover" />
            <span className="font-bold text-[#10245c]">DermaCare AI</span>
          </a>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[#68758d]">
            <a href="#home" className="transition hover:text-[#2168d7]">Home</a>
            <a href="#about" className="transition hover:text-[#2168d7]">About</a>
            <a href="#how-it-works" className="transition hover:text-[#2168d7]">How It Works</a>
            <a href="#features" className="transition hover:text-[#2168d7]">Features</a>
          </nav>

          <p className="text-center text-xs text-[#68758d]">© 2026 DermaCare AI. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
