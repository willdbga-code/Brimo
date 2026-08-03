import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Import our interactive 3D WebGL diorama scene dynamically, shielding from Next.js SSR crashes
const ThreeDioramaScene = dynamic(
  () => import('./ThreeDioramaScene'),
  { ssr: false }
);

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="hero-section">
      {/* Dynamic 3D WebGL Diorama Central Scene */}
      <div className="three-diorama-container">
        <ThreeDioramaScene />
      </div>

      {/* Ambient background celestial stars for depth */}
      <div className="constellations-overlay-bg">
        <svg className="constellation const-left" viewBox="0 0 200 200">
          <path d="M20 50 L50 80 L90 60 L140 100 L180 70" stroke="rgba(194, 157, 56, 0.12)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
          <circle cx="20" cy="50" r="2.5" fill="var(--accent-gold)" className="star-flicker" />
          <circle cx="90" cy="60" r="2" fill="var(--accent-purple-bright)" />
          <circle cx="140" cy="100" r="2.5" fill="var(--accent-gold)" className="star-flicker" style={{ animationDelay: '1.5s' }} />
        </svg>

        <svg className="constellation const-right" viewBox="0 0 200 200">
          <path d="M100 20 L100 180 M40 100 L160 100" stroke="rgba(184, 102, 255, 0.1)" strokeWidth="0.8" strokeDasharray="2 2" fill="none" />
          <circle cx="100" cy="20" r="2" fill="var(--accent-purple-bright)" />
          <circle cx="160" cy="100" r="2.5" fill="var(--accent-gold)" className="star-flicker" />
          <circle cx="100" cy="100" r="3.5" fill="var(--accent-gold)" style={{ filter: 'drop-shadow(0 0 4px var(--accent-gold))' }} />
        </svg>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #050209;
          overflow: hidden;
          z-index: 10;
        }

        .three-diorama-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
        }

        /* Gothic Header Overlay styling */
        .mystical-hero-header {
          position: absolute;
          top: 100px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          pointer-events: none; /* Let user clicks pass through to 3D canvas below */
          width: 90%;
          max-width: 680px;
          text-align: center;
          transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .header-gothic-border {
          background: rgba(8, 3, 15, 0.82);
          backdrop-filter: blur(10px);
          padding: 1.2rem 2.5rem;
          border-color: rgba(212, 175, 55, 0.35);
          box-shadow: 0 10px 40px rgba(0,0,0,0.85);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
        }

        .star-sigil {
          color: var(--accent-purple-bright);
          font-size: 10px;
          letter-spacing: 2px;
        }

        .hero-gothic-title {
          font-size: 2.1rem;
          color: var(--accent-gold);
          letter-spacing: 4px;
          text-transform: uppercase;
          text-shadow: 0 0 12px rgba(212, 175, 55, 0.45);
          margin: 0;
        }

        .hero-gothic-subtitle {
          font-size: 0.8rem;
          color: var(--text-lavender);
          font-family: var(--font-editorial);
          letter-spacing: 0.8px;
          opacity: 0.9;
          margin: 0;
          text-transform: uppercase;
        }

        /* 3D Interactive guidance banner */
        .diorama-interactive-hints {
          position: absolute;
          bottom: 25px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          pointer-events: none;
          background: rgba(12, 4, 20, 0.85);
          border: 1px solid rgba(212, 175, 55, 0.25);
          padding: 0.6rem 1.8rem;
          border-radius: 40px;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 8px 30px rgba(0,0,0,0.9);
          white-space: nowrap;
        }

        .hint-item {
          font-size: 0.72rem;
          color: var(--text-lavender);
          letter-spacing: 0.8px;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          text-transform: uppercase;
        }

        .hint-rune {
          color: var(--accent-gold);
          font-size: 0.95rem;
          text-shadow: 0 0 5px var(--accent-gold);
        }

        .hint-divider {
          color: var(--accent-purple-bright);
          font-size: 8px;
          opacity: 0.5;
        }

        /* Background constellations */
        .constellations-overlay-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .constellation {
          position: absolute;
          opacity: 0.22;
          width: 150px;
          height: 150px;
        }

        .const-left {
          top: 15%;
          left: 5%;
        }

        .const-right {
          bottom: 12%;
          right: 5%;
        }

        .star-flicker {
          animation: sparkle-light 4s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes sparkle-light {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        .animate-pulse {
          animation: header-pulse 3s ease-in-out infinite alternate;
        }

        @keyframes header-pulse {
          0% { text-shadow: 0 0 10px rgba(212, 175, 55, 0.35); }
          100% { text-shadow: 0 0 18px rgba(212, 175, 55, 0.7); }
        }

        /* Responsiveness for Mobile Viewports */
        @media (max-width: 768px) {
          .mystical-hero-header {
            top: 90px;
            width: 95%;
          }

          .header-gothic-border {
            padding: 1rem 1.2rem;
          }

          .hero-gothic-title {
            font-size: 1.4rem;
            letter-spacing: 2px;
          }

          .hero-gothic-subtitle {
            font-size: 0.68rem;
            line-height: 1.35;
          }

          .diorama-interactive-hints {
            bottom: 85px; /* Push above mobile app sticky navigation bar */
            padding: 0.5rem 1rem;
            gap: 0.5rem;
            border-radius: 8px;
            flex-direction: column;
            width: 90%;
            align-items: center;
          }

          .hint-divider {
            display: none;
          }

          .hint-item {
            font-size: 0.65rem;
          }

          .constellations-overlay-bg {
            display: none; /* De-clutter mobile backgrounds */
          }
        }
      `}</style>
    </section>
  );
}
