import React from 'react';
import "../css/landing.css";

function App() {
  return (
    <>
      <header className="navbar">
        <div className="logo">
          <div className="logo-icon">✚</div>
          <div>
            <h2>DermaCare AI</h2>
            <span>AI-Powered Skin Analysis & Care</span>
          </div>
        </div>

        <nav>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#how-it-works">How it works</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="nav-buttons">
          <a href="#" className="login-btn">Login</a>
          <a href="#" className="primary-btn">Get Started</a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="badge">✨ AI-Powered Skin Health Analysis</div>
            <h1>
              Your AI-Powered
              <span>Skin Health Companion</span>
            </h1>
            <p>Analyze, understand and improve your skin with advanced AI technology.</p>
            
            <div className="hero-buttons">
              <a href="#" className="primary-btn">Get Started →</a>
              <a href="#about" className="secondary-btn">Learn More</a>
            </div>

            <div className="benefits">
              <div className="benefit">
                <div className="benefit-icon">✓</div>
                <div>
                  <strong>Secure & Private</strong>
                  <p>Your data is encrypted and protected</p>
                </div>
              </div>
              <div className="benefit">
                <div className="benefit-icon">✦</div>
                <div>
                  <strong>AI-Powered</strong>
                  <p>Advanced AI models for accurate analysis</p>
                </div>
              </div>
              <div className="benefit">
                <div className="benefit-icon">ϟ</div>
                <div>
                  <strong>Fast Results</strong>
                  <p>Get results in seconds with detailed insights</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <img src="/assets/women-image.png" alt="AI-powered skin analysis" />
            
            <div className="analysis-card">
              <small>AI Analysis</small>
              <strong>82<span>/100</span></strong>
              <label>Good</label>
            </div>

            <div className="recommendation-card">
              <div className="card-icon">✚</div>
              <strong>Personalized</strong>
              <span>Recommendations</span>
            </div>

            <div className="detect-card">
              <strong>Detects</strong>
              <ul>
                <li>Acne</li>
                <li>Dark Spots</li>
                <li>Pores</li>
              </ul>
            </div>

            <div className="progress-card">
              <div className="card-icon">↗</div>
              <strong>Track</strong>
              <span>Progress</span>
            </div>
          </div>
        </section>

        <section className="why-section" id="features">
          <h2>Why Choose DermaCare AI?</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">▣</div>
              <div>
                <h3>Advanced AI Analysis</h3>
                <p>State-of-the-art AI models analyze your skin with high accuracy.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">☷</div>
              <div>
                <h3>Detailed Reports</h3>
                <p>Get comprehensive reports with scores and useful insights.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✧</div>
              <div>
                <h3>Personalized Care</h3>
                <p>Receive personalized skincare recommendations just for you.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">♙</div>
              <div>
                <h3>Privacy First</h3>
                <p>Your images and data are stored securely and privately.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact">
        <p>© 2026 DermaCare AI. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;