import '../styles/index.css';

export function App() {
  return (
    <>
      {/* NAVBAR */}
      <header className="h-[82px] px-[5%] flex items-center justify-between bg-white border-b border-[#e8edf5] relative z-10">
        <div className="flex items-center gap-[12px]">
          <div className="w-[42px] h-[42px] rounded-[12px] bg-gradient-to-br from-[#2878e8] to-[#173d9c] text-white flex items-center justify-center text-[25px] font-bold">
            ✚
          </div>
          <div>
            <h2 className="text-[24px] leading-[1.1] text-[#10245c] font-bold">DermaCare AI</h2>
            <span className="block mt-[3px] text-[12px] text-[#68758d] font-normal">AI-Powered Skin Analysis & Care</span>
          </div>
        </div>

        <nav className="flex gap-[38px] max-md:hidden">
          <a href="#features" className="text-[15px] font-semibold text-[#17223d] hover:text-[#1e65d6] transition duration-300">
            Features
          </a>
          <a href="#about" className="text-[15px] font-semibold text-[#17223d] hover:text-[#1e65d6] transition duration-300">
            About
          </a>
          <a href="#how-it-works" className="text-[15px] font-semibold text-[#17223d] hover:text-[#1e65d6] transition duration-300">
            How it works
          </a>
          <a href="#contact" className="text-[15px] font-semibold text-[#17223d] hover:text-[#1e65d6] transition duration-300">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-[14px]">
          <a href="#" className="px-[28px] py-[13px] border border-[#dce2ec] rounded-[10px] font-semibold bg-white hover:border-[#1e65d6] hover:text-[#1e65d6] transition duration-300">
            Login
          </a>
          <a href="#" className="inline-flex items-center justify-center px-[27px] py-[14px] rounded-[10px] bg-[#123a91] text-white font-semibold hover:bg-[#0b2c78] hover:-translate-y-[2px] transition duration-300">
            Get Started
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="min-h-[590px] px-[5%] pt-[65px] pb-[55px] grid grid-cols-1 lg:grid-cols-2 items-center gap-[35px] overflow-hidden bg-[radial-gradient(circle_at_80%_45%,#e9f4ff_0%,#f5f9ff_35%,#ffffff_70%)]">
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
            <a href="#about" className="inline-flex items-center justify-center px-[29px] py-[14px] rounded-[10px] border border-[#cfd8e8] bg-white text-[#182440] font-semibold hover:border-[#2168d7] hover:text-[#2168d7] transition duration-300">
              Learn More
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
            src="/src/assets/women-image.png"
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

      {/* WHY SECTION */}
      <section className="px-[5%] pt-[55px] pb-[70px] bg-white" id="features">
        <h2 className="text-center text-[#10245c] text-[32px] mb-[35px] font-bold">
          Why Choose DermaCare AI?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[25px]">
          {/* Feature 1 */}
          <div className="min-h-[145px] px-[20px] py-[25px] flex items-start gap-[18px] border border-[#e2e7ef] rounded-[15px] bg-white hover:-translate-y-[5px] hover:shadow-[0_12px_30px_rgba(38,75,130,0.1)] transition duration-300">
            <div className="min-w-[55px] h-[55px] rounded-full bg-[#f0f5ff] text-[#294cc4] flex items-center justify-center text-[25px] font-bold">
              ▣
            </div>
            <div>
              <h3 className="text-[#182440] text-[16px] mb-[7px] font-bold">Advanced AI Analysis</h3>
              <p className="text-[#69758a] text-[13px] leading-[1.55] font-normal">State-of-the-art AI models analyze your skin with high accuracy.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="min-h-[145px] px-[20px] py-[25px] flex items-start gap-[18px] border border-[#e2e7ef] rounded-[15px] bg-white hover:-translate-y-[5px] hover:shadow-[0_12px_30px_rgba(38,75,130,0.1)] transition duration-300">
            <div className="min-w-[55px] h-[55px] rounded-full bg-[#f0f5ff] text-[#294cc4] flex items-center justify-center text-[25px] font-bold">
              ☷
            </div>
            <div>
              <h3 className="text-[#182440] text-[16px] mb-[7px] font-bold">Detailed Reports</h3>
              <p className="text-[#69758a] text-[13px] leading-[1.55] font-normal">Get comprehensive reports with scores and useful insights.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="min-h-[145px] px-[20px] py-[25px] flex items-start gap-[18px] border border-[#e2e7ef] rounded-[15px] bg-white hover:-translate-y-[5px] hover:shadow-[0_12px_30px_rgba(38,75,130,0.1)] transition duration-300">
            <div className="min-w-[55px] h-[55px] rounded-full bg-[#f0f5ff] text-[#294cc4] flex items-center justify-center text-[25px] font-bold">
              ✧
            </div>
            <div>
              <h3 className="text-[#182440] text-[16px] mb-[7px] font-bold">Personalized Care</h3>
              <p className="text-[#69758a] text-[13px] leading-[1.55] font-normal">Receive personalized skincare recommendations just for you.</p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="min-h-[145px] px-[20px] py-[25px] flex items-start gap-[18px] border border-[#e2e7ef] rounded-[15px] bg-white hover:-translate-y-[5px] hover:shadow-[0_12px_30px_rgba(38,75,130,0.1)] transition duration-300">
            <div className="min-w-[55px] h-[55px] rounded-full bg-[#f0f5ff] text-[#294cc4] flex items-center justify-center text-[25px] font-bold">
              ♙
            </div>
            <div>
              <h3 className="text-[#182440] text-[16px] mb-[7px] font-bold">Privacy First</h3>
              <p className="text-[#69758a] text-[13px] leading-[1.55] font-normal">Your images and data are stored securely and privately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-[25px] text-center bg-[#eef6ff] text-[#68758d] text-[13px] font-normal">
        <p>© 2026 DermaCare AI. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;