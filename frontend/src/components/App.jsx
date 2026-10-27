import { useEffect, useState } from "react";

import logoImage from '../assets/logo.jpeg';
import womenImage from '../assets/women-image.png';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminUsers from './admin/AdminUsers';
import AdminSkinAnalysis from './admin/AdminSkinAnalysis';
import AdminReports from './admin/AdminReports';
import AdminContent from './admin/AdminContent';
import AdminSettings from './admin/AdminSettings';
import { apiRequest } from '../lib/api';

export function App() {
  // Normalize the URL so /admin, /admin/, etc. work consistently.
  const pathname = window.location.pathname
  .replace(/\/+$/, "")
  .replace(/^\/dermacare-ai-by-althexus/, "");

  const [contents, setContents] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('dermacare-auth-token')) return undefined;
    let active = true;
    apiRequest('/api/profile')
      .then(({ user }) => {
        if (active && user?.id) setIsSignedIn(true);
      })
      .catch(() => {
        localStorage.removeItem('dermacare-auth-token');
        localStorage.removeItem('dermacare-user');
        localStorage.removeItem('dermacare-user-id');
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (window.location.pathname.replace(/\/+$/, "").includes("/admin")) return;

    const loadPublishedContent = async () => {
      try {
        const data = await apiRequest('/api/content', { auth: false });
        setContents(data.contents || []);
      } catch (error) {
        console.error("Unable to load published content:", error);
      }
    };

    loadPublishedContent();
  }, []);

  // Admin-only routes
  if (pathname.endsWith("/admin/skin-analysis")) {
    return <AdminSkinAnalysis />;
  }

  if (pathname.endsWith("/admin/users")) {
    return <AdminUsers />;
  }

  if (pathname.endsWith("/admin/reports")) {
    return <AdminReports />;
  }

  if (pathname.endsWith("/admin/content")) {
    return <AdminContent />;
  }

  if (pathname.endsWith("/admin/settings")) {
    return <AdminSettings />;
  }

  if (pathname.endsWith("/admin/dashboard")) {
    return <AdminDashboard />;
  }

  if (pathname.endsWith("/admin")) {
    return <AdminLogin />;
  }

  // Normal public website
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
            <a href={`${import.meta.env.BASE_URL}faq`} className="text-[15px] font-semibold text-[#17223d] transition hover:text-[#2168d7]">FAQ</a>
          </nav>

          <a
            href={`${import.meta.env.BASE_URL}${isSignedIn ? 'dashboard' : 'login'}`}
            className="inline-flex min-h-11 items-center justify-center rounded-[10px] bg-[#123a91] px-5 text-sm font-semibold text-white transition hover:-translate-y-[2px] hover:bg-[#0b2c78]"
          >
            {isSignedIn ? 'Dashboard' : 'Get Started'}
          </a>

        </div>
      </header>

      {/* HERO */}
      <section id="home" className="min-h-[590px] px-[5%] pt-[65px] pb-[55px] grid grid-cols-1 lg:grid-cols-2 items-center gap-[35px] overflow-hidden bg-[radial-gradient(circle_at_80%_45%,#e9f4ff_0%,#f5f9ff_35%,#ffffff_70%)]">
        <div className="max-w-[710px] relative z-[2] text-center lg:text-left mx-auto lg:mx-0">
          <div className="inline-block px-[18px] py-[10px] mb-[25px] rounded-[25px] bg-[#e9f3ff] text-[#2365b3] text-[15px] font-semibold">
            ✨ Image Quality &amp; Color Measurements
          </div>
          
          <h1 className="text-[clamp(44px,4vw,60px)] leading-[1.08] tracking-[0px] text-[#10245c] mb-[25px] font-bold">
            Your AI-Powered
            <span className="block text-[#2168d7]">Skin Health Companion</span>
          </h1>
          
          <p className="max-w-[540px] mx-auto lg:mx-0 text-[#5f6d84] text-[20px] leading-[1.6] mb-[30px] font-normal">
            Review photo clarity and basic color measurements before sharing an image with a healthcare professional.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-[15px] justify-center lg:justify-start mb-[42px]">
            <a href={`${import.meta.env.BASE_URL}${isSignedIn ? 'dashboard' : 'login'}`} className="inline-flex items-center justify-center px-[27px] py-[14px] rounded-[10px] bg-[#123a91] text-white font-semibold hover:bg-[#0b2c78] hover:-translate-y-[2px] transition duration-300">
              {isSignedIn ? 'Go to Dashboard →' : 'Get Started →'}
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px] max-w-[750px] mx-auto lg:mx-0 text-left">
            {/* Benefit 1 */}
            <div className="flex items-start gap-[12px]">
              <div className="min-w-[38px] h-[38px] border-2 border-[#2580d9] rounded-full flex items-center justify-center text-[#2580d9] text-[19px] font-bold">
                ✓
              </div>
              <div>
                <strong className="block text-[#182440] text-[14px] mb-[3px] font-bold">Consent First</strong>
                <p className="text-[12px] text-[#6b778c] leading-[1.5] font-normal">You choose whether to submit an image for analysis</p>
              </div>
            </div>
            {/* Benefit 2 */}
            <div className="flex items-start gap-[12px]">
              <div className="min-w-[38px] h-[38px] border-2 border-[#2580d9] rounded-full flex items-center justify-center text-[#2580d9] text-[19px] font-bold">
                ✦
              </div>
              <div>
                <strong className="block text-[#182440] text-[14px] mb-[3px] font-bold">Image Measurements</strong>
                <p className="text-[12px] text-[#6b778c] leading-[1.5] font-normal">Basic photo-quality and color values</p>
              </div>
            </div>
            {/* Benefit 3 */}
            <div className="flex items-start gap-[12px]">
              <div className="min-w-[38px] h-[38px] border-2 border-[#2580d9] rounded-full flex items-center justify-center text-[#2580d9] text-[19px] font-bold">
                ϟ
              </div>
              <div>
                <strong className="block text-[#182440] text-[14px] mb-[3px] font-bold">Clear Limits</strong>
                <p className="text-[12px] text-[#6b778c] leading-[1.5] font-normal">Informational results, not a medical diagnosis</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto flex min-h-[500px] w-full max-w-[590px] items-center justify-center px-2 py-5 sm:px-6">
          <div className="absolute inset-x-2 inset-y-5 overflow-hidden rounded-[20px] sm:inset-x-4">
            <img
              src={womenImage}
              alt="Example skin photo for image-quality review"
              className="h-full w-full scale-[1.25] origin-[50%_top] object-cover object-[40%_center]"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-[76px] bg-gradient-to-r from-[#e6efff] via-[#e6efff]/90 to-transparent sm:w-[96px]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-[76px] bg-gradient-to-l from-[#e6efff] via-[#e6efff]/90 to-transparent sm:w-[96px]" />
          </div>
          <div className="absolute left-0 top-[138px] z-10 min-h-[112px] w-[min(154px,40vw)] -translate-x-3 rounded-xl border border-[#dce6ef] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(27,52,80,0.14)] sm:left-1 sm:top-[74px] sm:w-[154px] sm:-translate-x-16">
            <span className="block text-[10px] font-bold uppercase text-[#287878]">Photo check</span>
            <strong className="mt-1 block text-sm leading-5 text-[#182440]">Clarity &amp; lighting</strong>
            <span className="mt-1 block text-[10px] leading-4 text-[#69758a]">Image-quality notes</span>
          </div>
          <div className="absolute right-0 top-[112px] z-10 min-h-[94px] w-[min(154px,40vw)] translate-x-3 rounded-xl border border-[#dce6ef] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(27,52,80,0.14)] sm:right-12 sm:w-[154px] sm:translate-x-20">
            <span className="block text-[10px] font-bold uppercase text-[#287878]">Measurements</span>
            <strong className="mt-1 block text-sm leading-5 text-[#182440]">Basic color values</strong>
            <span className="mt-1 block text-[10px] leading-4 text-[#69758a]">Lighting can change results</span>
          </div>
          <div className="absolute bottom-[66px] left-0 z-10 min-h-[94px] w-[min(154px,40vw)] -translate-x-3 rounded-xl border border-[#dce6ef] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(27,52,80,0.14)] sm:left-1 sm:w-[154px] sm:-translate-x-16">
            <span className="block text-[10px] font-bold uppercase text-[#287878]">Your choice</span>
            <strong className="mt-1 block text-sm leading-5 text-[#182440]">Consent before upload</strong>
            <span className="mt-1 block text-[10px] leading-4 text-[#69758a]">Optional image submission</span>
          </div>
          <div className="absolute bottom-[132px] right-0 z-10 min-h-[94px] w-[min(154px,40vw)] translate-x-3 rounded-xl border border-[#dce6ef] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(27,52,80,0.14)] sm:right-12 sm:w-[154px] sm:translate-x-20">
            <span className="block text-[10px] font-bold uppercase text-[#287878]">Important</span>
            <strong className="mt-1 block text-sm leading-5 text-[#182440]">Not a diagnosis</strong>
            <span className="mt-1 block text-[10px] leading-4 text-[#69758a]">For information only</span>
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
              DermaCare AI reports image-quality and basic color measurements to help users review their photos.
            </p>
            <p className="leading-7 text-[#5f6d84]">
              Results are informational and affected by lighting, image quality, and camera settings. The service does not identify or diagnose skin conditions.
            </p>
          </div>

          <div className="rounded-3xl bg-[#f3f8ff] p-8 sm:p-10">
            <div className="mb-5 text-4xl text-[#2878e8]">✦</div>
            <h3 className="mb-3 text-xl font-bold text-[#182440]">Image-Quality Review</h3>
            <p className="leading-7 text-[#5f6d84]">
              Upload a skin photo to review basic image-quality and color measurements. This tool does not detect or diagnose skin conditions.
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
              ['02', 'Image Measurements', 'The service measures basic image quality and color values.'],
              ['03', 'Review Measurements', 'See basic image-quality and color measurements.'],
              ['04', 'Check the Report', 'Review image notes and limitations; results are not a diagnosis.'],
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
              Designed to make photo-quality checks simple and informative.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              ['▣', 'Image Quality', 'Review basic measurements related to image clarity and lighting.'],
              ['☷', 'Color Measurements', 'See simple color measurements that can vary with lighting and camera settings.'],
              ['✧', 'Informational Results', 'Use the report as a photo-quality reference, not as medical advice.'],
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

      {/* PUBLISHED CONTENT */}
      {contents.length > 0 && (
        <section className="px-[5%] py-20 bg-[#f7faff]">
          <div className="mx-auto max-w-[1200px]">

            <div className="mx-auto mb-12 max-w-[700px] text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-[2px] text-[#2878e8]">
                Latest From DermaCare AI
              </p>

              <h2 className="mb-4 text-3xl font-bold text-[#10245c] sm:text-4xl">
                Skincare Tips & Insights
              </h2>

              <p className="text-[#5f6d84]">
                Helpful skincare information and insights from DermaCare AI.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {contents.map((item) => (
                <article
                  key={item._id}
                  className="rounded-2xl border border-[#e1e8f2] bg-white p-6 shadow-[0_8px_25px_rgba(35,77,130,0.05)] transition hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(38,75,130,0.1)]"
                >
                  <span className="inline-block rounded-full bg-[#e9f3ff] px-3 py-1 text-xs font-semibold uppercase text-[#2168d7]">
                    {item.category}
                  </span>

                  <h3 className="mt-4 text-xl font-bold text-[#182440]">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="mt-3 text-sm leading-6 text-[#69758a]">
                      {item.description}
                    </p>
                  )}

                  {item.content && (
                    <p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#5f6d84]">
                      {item.content}
                    </p>
                  )}
                </article>
              ))}
            </div>

          </div>
        </section>
      )}

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
            <a href={`${import.meta.env.BASE_URL}faq`} className="transition hover:text-[#2168d7]">FAQ</a>
          </nav>

          <p className="text-center text-xs text-[#68758d]">© 2026 DermaCare AI. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
