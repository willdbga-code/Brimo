import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container gothic-panel">
        <Link href="/" className="logo gold-pulse-text" aria-label="Bella Bruxa">
          <svg viewBox="0 0 220 36" width="220" height="36" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
            <defs>
              <linearGradient id="gold-logo-grad" x1="0" y1="0" x2="100%" y2="0">
                <stop offset="0%" stopColor="#c29d38"/>
                <stop offset="35%" stopColor="#ffd700"/>
                <stop offset="65%" stopColor="#ffd700"/>
                <stop offset="100%" stopColor="#c29d38"/>
              </linearGradient>
              <filter id="logo-glow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Left Crescent Moon */}
            <path d="M 12,12 A 6,6 0 1 0 20,20 A 5,5 0 1 1 12,12 Z" fill="url(#gold-logo-grad)" filter="url(#logo-glow)" />
            
            {/* Main Gothic Title Text using Google Font */}
            <text x="110" y="25" fontFamily="'Pirata One', display" fontSize="24" fill="url(#gold-logo-grad)" textAnchor="middle" letterSpacing="1.5" filter="url(#logo-glow)">BELLA BRUXA</text>
            
            {/* Right Alchemical Sun */}
            <circle cx="204" cy="16" r="4.5" fill="none" stroke="url(#gold-logo-grad)" strokeWidth="1.5" filter="url(#logo-glow)" />
            <path d="M 204,7 V 10 M 204,22 V 25 M 195,16 H 198 M 210,16 H 213 M 198,10 L 200,12 M 210,22 L 208,20 M 198,22 L 200,20 M 210,10 L 208,12" stroke="url(#gold-logo-grad)" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </Link>
        
        {/* Hamburger Menu Toggle */}
        <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          <span className={`toggle-line ${isOpen ? "open" : ""}`}></span>
          <span className={`toggle-line ${isOpen ? "open" : ""}`}></span>
          <span className={`toggle-line ${isOpen ? "open" : ""}`}></span>
        </div>

        {/* Desktop Links */}
        <div className="nav-links">
          <Link href="/rituais" className="nav-item">
            <span className="bullet">✦</span> RITUAS
          </Link>
          <Link href="/tarot" className="nav-item">
            <span className="bullet">✦</span> TAROT
          </Link>
          <Link href="/login" className="login-btn">
            PORTAL DELA
          </Link>
        </div>
      </div>

      {/* Mobile Grimoire Menu Overlay */}
      <div className={`mobile-grimoire-overlay ${isOpen ? "active" : ""}`}>
        <div className="grimoire-bg"></div>
        <div className="grimoire-content">
          <div className="grimoire-header">
            <span className="grimoire-title font-vintage">Grimório de Bella</span>
          </div>
          
          <div className="grimoire-links">
            <Link href="/" className="grimoire-link" onClick={() => setIsOpen(false)}>
              <span className="rune">Ⅰ</span> Home
            </Link>
            <Link href="/rituais" className="grimoire-link" onClick={() => setIsOpen(false)}>
              <span className="rune">Ⅱ</span> Rituais de Poder
            </Link>
            <Link href="/tarot" className="grimoire-link" onClick={() => setIsOpen(false)}>
              <span className="rune">Ⅲ</span> O Oráculo
            </Link>
            <Link href="/login" className="grimoire-link portal" onClick={() => setIsOpen(false)}>
              <span className="rune">Ⅳ</span> Portal Oculto
            </Link>
          </div>
          
          <div className="grimoire-footer">
            <p>SALEM EDITORIAL</p>
            <span className="grimoire-symbol">◈</span>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 15px;
          left: 0;
          width: 100%;
          z-index: 1000;
          padding: 0 2rem;
          pointer-events: none; /* Let clicks pass to background elements unless they hit the panel */
        }
        
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 3rem;
          background: rgba(12, 4, 20, 0.9);
          border-color: var(--border-gold);
          border-radius: 4px;
          pointer-events: auto; /* Enable clicks on navbar panel */
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 15px var(--accent-purple-glow);
        }
        
        .logo {
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .logo:hover {
          transform: scale(1.02);
        }

        .logo-svg {
          display: block;
          max-width: 100%;
          height: auto;
        }
        
        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        
        .nav-item {
          letter-spacing: 0.15em;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          gap: 0.4rem;
          position: relative;
          padding: 0.5rem 0;
        }

        .nav-item .bullet {
          color: var(--accent-purple-bright);
          font-size: 8px;
          transition: var(--transition-fast);
          opacity: 0.6;
        }
        
        .nav-item:hover {
          color: var(--accent-gold-bright);
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
        }

        .nav-item:hover .bullet {
          color: var(--accent-gold-bright);
          transform: rotate(45deg) scale(1.3);
          opacity: 1;
        }

        .nav-item::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--accent-gold), transparent);
          transition: width 0.4s ease;
        }

        .nav-item:hover::after {
          width: 100%;
        }
        
        .login-btn {
          padding: 0.6rem 1.8rem;
          background: transparent;
          border: 1px solid var(--accent-gold);
          color: var(--accent-gold) !important;
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          font-weight: 600;
          position: relative;
          overflow: hidden;
          transition: var(--transition-fast);
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.15);
        }

        .login-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .login-btn:hover::before {
          left: 100%;
        }
        
        .login-btn:hover {
          background: rgba(212, 175, 55, 0.1);
          border-color: var(--accent-gold-bright);
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
          transform: translateY(-2px);
        }

        /* Mobile Burger Toggle */
        .mobile-toggle {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          z-index: 1001;
          pointer-events: auto;
          padding: 5px;
        }
        
        .toggle-line {
          width: 22px;
          height: 2px;
          background: var(--accent-gold);
          transition: all 0.3s ease;
        }
        
        .toggle-line.open:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
          background: var(--accent-gold-bright);
        }
        
        .toggle-line.open:nth-child(2) {
          opacity: 0;
        }
        
        .toggle-line.open:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
          background: var(--accent-gold-bright);
        }
        
        /* Mobile Grimoire Overlay */
        .mobile-grimoire-overlay {
          position: fixed;
          top: 0;
          right: -100%;
          width: 100%;
          height: 100vh;
          z-index: 998;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: right 0.6s cubic-bezier(0.19, 1, 0.22, 1);
          pointer-events: auto;
        }

        .mobile-grimoire-overlay.active {
          right: 0;
        }

        .grimoire-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(20, 8, 30, 0.98) 0%, rgba(5, 2, 8, 1) 100%);
          backdrop-filter: blur(15px);
          opacity: 0.98;
        }

        .grimoire-bg::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url("https://www.transparenttextures.com/patterns/dark-matter.png");
          opacity: 0.15;
        }

        .grimoire-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          height: 70%;
          width: 80%;
          max-width: 400px;
          border: 1px solid var(--border-gold);
          padding: 3rem 2rem;
          background: rgba(12, 4, 20, 0.85);
          box-shadow: 0 0 50px rgba(139, 50, 204, 0.2), inset 0 0 30px rgba(0, 0, 0, 0.8);
        }

        .grimoire-content::before {
          content: '';
          position: absolute;
          top: 6px;
          left: 6px;
          right: 6px;
          bottom: 6px;
          border: 1px dashed rgba(212, 175, 55, 0.15);
          pointer-events: none;
        }

        .grimoire-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .grimoire-title {
          font-size: 2.2rem;
          color: var(--accent-gold);
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.4);
        }

        .grimoire-links {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          width: 100%;
          align-items: center;
        }

        .grimoire-link {
          font-family: var(--font-gothic);
          font-size: 1.8rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: var(--transition-fast);
        }

        .grimoire-link .rune {
          font-family: var(--font-editorial);
          font-size: 0.8rem;
          color: var(--accent-gold);
          border: 1px solid rgba(212, 175, 55, 0.3);
          width: 25px;
          height: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(5, 2, 8, 0.8);
        }

        .grimoire-link:hover {
          color: var(--accent-gold-bright);
          transform: scale(1.05);
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
        }

        .grimoire-link:hover .rune {
          border-color: var(--accent-gold-bright);
          box-shadow: 0 0 8px var(--accent-gold);
        }

        .grimoire-link.portal {
          color: var(--accent-purple-bright);
        }

        .grimoire-link.portal:hover {
          color: #fff;
          text-shadow: 0 0 15px var(--accent-purple-bright);
        }

        .grimoire-footer {
          text-align: center;
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          color: var(--text-lavender);
          opacity: 0.7;
          margin-top: 2rem;
        }

        .grimoire-symbol {
          display: block;
          margin-top: 0.5rem;
          font-size: 1.2rem;
          color: var(--accent-gold);
        }
        
        @media (max-width: 768px) {
          .navbar {
            padding: 0 1rem;
            top: 10px;
          }
          
          .nav-container {
            padding: 0.8rem 1.5rem;
            border-radius: 4px;
          }
          
          .logo {
            font-size: 1.1rem;
          }
          
          .nav-links {
            display: none;
          }
          
          .mobile-toggle {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
}
