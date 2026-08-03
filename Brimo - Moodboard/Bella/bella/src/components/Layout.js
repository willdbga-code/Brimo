import Head from 'next/head';
import Navbar from './Navbar';
import NVISOverlay from './NVISOverlay';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Layout({ children, title = "Bella Bruxa | Salem Editorial" }) {
  const canvasRef = useRef(null);
  const router = useRouter();
  const currentPath = router.pathname;

  useEffect(() => {
    // Intersection Observer for scroll reveal animations
    const observerOptions = {
      threshold: 0.08
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    // Ambient Particle Canvas System
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let particles = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    class Particle {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = -(Math.random() * 0.8 + 0.3);
        this.speedX = Math.random() * 0.4 - 0.2;
        this.color = Math.random() > 0.5 ? 'rgba(212, 175, 55, ' : 'rgba(184, 102, 255, ';
        this.opacity = Math.random() * 0.4 + 0.1;
        this.fadeSpeed = Math.random() * 0.002 + 0.001;
      }
      
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        
        // Float side to side slightly
        this.speedX += Math.random() * 0.02 - 0.01;
        this.speedX = Math.max(-0.4, Math.min(0.4, this.speedX));
        
        if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset();
        }
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = this.color.includes('212') ? '#d4af37' : '#b866ff';
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow for efficiency
      }
    }
    
    // Spawn 50 particles
    const particleCount = Math.min(60, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
      // Distribute particles across height initially
      particles[i].y = Math.random() * canvas.height;
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [children]);

  return (
    <div className="layout-container">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Bella Bruxa - Maria Mulambo. Tarot, Rituais de Poder e Ativação de Magnetismo Ancestral." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      
      {/* Dynamic Magical Embers Canvas */}
      <canvas ref={canvasRef} className="magic-canvas" />
      
      <Navbar />
      
      <NVISOverlay />
      <div className="fog-overlay"></div>
      
      {/* Decorative Gothic Side Lines (Screen Borders) */}
      <div className="gothic-frame-left"></div>
      <div className="gothic-frame-right"></div>
      
      <main className="main-content">
        {children}
      </main>
      
      {/* Mobile-Only Glassmorphic App Navigation Bar */}
      <div className="mobile-app-bar">
        <Link href="/" className={`app-bar-item ${currentPath === '/' ? 'active' : ''}`}>
          <span className="app-bar-icon">🜏</span>
          <span className="app-bar-label font-vintage">Início</span>
        </Link>
        <Link href="/rituais" className={`app-bar-item ${currentPath === '/rituais' ? 'active' : ''}`}>
          <span className="app-bar-icon">🔑</span>
          <span className="app-bar-label font-vintage">Rituais</span>
        </Link>
        <Link href="/tarot" className={`app-bar-item ${currentPath === '/tarot' ? 'active' : ''}`}>
          <span className="app-bar-icon">☽</span>
          <span className="app-bar-label font-vintage">Oráculo</span>
        </Link>
        <Link href="/login" className={`app-bar-item ${currentPath.startsWith('/login') || currentPath.startsWith('/dashboard') ? 'active' : ''}`}>
          <span className="app-bar-icon">🛡</span>
          <span className="app-bar-label font-vintage">Portal</span>
        </Link>
      </div>
      
      <footer className="footer gothic-panel">
        <div className="gothic-corners"></div>
        <div className="footer-content">
          <div className="footer-symbols">
            <span>☾</span> <span>◈</span> <span>☼</span>
          </div>
          <h4 className="gothic-title footer-title gold-pulse-text">@BELLABRUXXA</h4>
          <p className="footer-desc">SALEM EDITORIAL</p>
          <div className="footer-links">
            <a href="/rituais">Rituais</a>
            <span className="dot">•</span>
            <a href="/tarot">Tarot</a>
            <span className="dot">•</span>
            <a href="/login">Portal</a>
          </div>
          <p className="footer-copy">© 2026 Bella Bruxa. Todos os direitos consagrados.</p>
        </div>
      </footer>
      
      <style jsx>{`
        .layout-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          background-color: var(--bg-primary);
          overflow-x: hidden;
        }
        
        .magic-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 1; /* Behind content but above background */
        }
        
        .fog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 50% 50%, transparent 20%, rgba(5, 2, 8, 0.75) 100%);
          opacity: 0.6;
          pointer-events: none;
          z-index: 2;
        }

        /* Screen Gothic Borders */
        .gothic-frame-left, .gothic-frame-right {
          position: fixed;
          top: 0;
          width: 2px;
          height: 100vh;
          background: linear-gradient(to bottom, transparent 10%, var(--accent-gold) 50%, transparent 90%);
          opacity: 0.25;
          z-index: 999;
          pointer-events: none;
        }
        
        .gothic-frame-left { left: 10px; }
        .gothic-frame-right { right: 10px; }

        .main-content {
          flex: 1;
          position: relative;
          z-index: 10;
        }
        
        /* Premium Gothic Footer */
        .footer {
          margin: 6rem auto 2rem;
          width: calc(100% - 4rem);
          max-width: 1200px;
          padding: 4rem 2rem;
          text-align: center;
          position: relative;
          z-index: 10;
        }
        
        .footer-symbols {
          font-size: 1.5rem;
          color: var(--accent-gold);
          letter-spacing: 1.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: center;
          padding-left: 1.5rem;
          opacity: 0.8;
        }
        
        .footer-title {
          font-size: 2.2rem;
          margin-bottom: 0.5rem;
          letter-spacing: 0.1em;
        }
        
        .footer-desc {
          font-family: var(--font-gothic);
          letter-spacing: 0.3em;
          color: var(--text-lavender);
          font-size: 0.9rem;
          margin-bottom: 2rem;
        }
        
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          font-size: 0.9rem;
          font-family: var(--font-editorial);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        
        .footer-links a {
          color: var(--text-secondary);
          transition: var(--transition-fast);
        }
        
        .footer-links a:hover {
          color: var(--accent-gold);
          text-shadow: 0 0 8px rgba(212, 175, 55, 0.4);
        }
        
        .dot {
          color: var(--accent-gold);
        }
        
        .footer-copy {
          font-size: 0.75rem;
          color: var(--text-lavender);
          opacity: 0.6;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        /* Mobile Sticky Bottom App Bar styles */
        .mobile-app-bar {
          display: none;
        }

        @media (max-width: 768px) {
          .footer {
            width: calc(100% - 2rem);
            margin: 4rem auto 5rem; /* Add margin-bottom to clear navigation bar */
            padding: 3rem 1.5rem;
          }
          .footer-title {
            font-size: 1.8rem;
          }
          .gothic-frame-left, .gothic-frame-right {
            display: none;
          }
          
          .main-content {
            padding-bottom: 80px; /* Pad bottom for mobile app bar */
          }
          
          .mobile-app-bar {
            display: flex;
            position: fixed;
            bottom: 12px;
            left: 10px;
            right: 10px;
            height: 64px;
            background: rgba(8, 3, 15, 0.94);
            backdrop-filter: blur(15px);
            border: 1px solid var(--accent-gold);
            border-radius: 12px;
            z-index: 9999;
            box-shadow: 0 10px 30px rgba(0,0,0,0.85), 0 0 15px rgba(184, 102, 255, 0.15);
            justify-content: space-around;
            align-items: center;
            padding: 0 0.5rem;
            pointer-events: auto;
          }

          .mobile-app-bar::before {
            content: '';
            position: absolute;
            top: 3px; left: 3px; right: 3px; bottom: 3px;
            border: 1px dashed rgba(194, 157, 56, 0.25);
            border-radius: 9px;
            pointer-events: none;
          }

          .app-bar-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--text-lavender);
            transition: all 0.3s ease;
            gap: 2px;
            flex: 1;
            height: 100%;
            position: relative;
            z-index: 2;
            pointer-events: auto;
          }

          .app-bar-icon {
            font-size: 1.2rem;
            color: var(--accent-gold);
            transition: all 0.3s ease;
          }

          .app-bar-label {
            font-size: 0.65rem;
            font-weight: 600;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
          }

          .app-bar-item.active {
            color: var(--text-primary);
          }

          .app-bar-item.active .app-bar-icon {
            color: var(--accent-purple-bright);
            transform: translateY(-4px) scale(1.15);
            text-shadow: 0 0 10px var(--accent-purple-bright);
          }

          .app-bar-item.active .app-bar-label {
            color: var(--accent-gold-bright);
            font-weight: 800;
          }
        }
      `}</style>
    </div>
  );
}
