import Layout from '@/components/Layout';
import TarotCard from '@/components/TarotCard';
import { useEffect } from 'react';

const tarotPackages = [
  {
    title: "Resumo de Luz e Sombra",
    price: "85",
    description: "Uma imersão profunda nas energias que te impulsionam e nos bloqueios que te limitam.",
    items: ["Mapa Energético", "Conselhos Práticos", "Previsão Trimestral"],
    imageCardUrl: "/cards/luz-sombra.png"
  },
  {
    title: "Mesa Aberta Intermediária",
    price: "115",
    description: "45 minutos de conexão profunda para múltiplas áreas da vida.",
    items: ["Múltiplas Tiragens", "Perguntas Ilimitadas (Tempo)", "Acompanhamento 48h"],
    imageCardUrl: "/cards/mesa-aberta.png"
  },
  {
    title: "Questões Objetivas",
    price: "35",
    description: "Ideal para dúvidas pontuais e diretas sobre situações específicas.",
    items: ["Resposta Direta", "Conselho das Cartas", "Atendimento em 24h"],
    imageCardUrl: "/cards/questoes.png"
  },
  {
    title: "Pergunta Avulsa",
    price: "15",
    description: "Uma pergunta rápida para clareza imediata.",
    items: ["Resposta Sim/Não", "Motivação Oculta", "Envio via WhatsApp"],
    imageCardUrl: "/cards/pergunta.png"
  },
  {
    title: "Prosperidade Feminina",
    price: "40",
    description: "Ative seu poder de receber e equilibre sua doação energética.",
    items: ["Poder de Receber", "Valor Pessoal", "Conselho da Prosperidade"],
    imageCardUrl: "/cards/prosperidade.png"
  },
  {
    title: "Mapa Financeiro",
    price: "60",
    description: "Analise o fluxo do dinheiro e identifique riscos e oportunidades para os próximos 30 dias.",
    items: ["Energia do Dinheiro", "Oportunidade do Mês", "Resultado Provável"],
    imageCardUrl: "/cards/mapa-financeiro.png"
  },
  {
    title: "Cura da Alma",
    price: "50",
    description: "Identifique feridas abertas e receba uma carta de conforto e direção espiritual.",
    items: ["Liberação de Bloqueios", "Lição da Dor", "Início da Cura"],
    imageCardUrl: "/cards/cura-alma.png"
  },
  {
    title: "Leitura da Conexão",
    price: "55",
    description: "Entenda o que essa conexão veio te ensinar e quais as reais intenções envolvidas.",
    items: ["Lição da Conexão", "Sentimentos Ocultos", "Como ser Inesquecível"],
    imageCardUrl: "/cards/conexao.png"
  }
];

// Custom fly paths from the deck pile
const dealOffsets = [
  { x: '-80px', y: '-150px', rot: '-35deg' },
  { x: '100px', y: '-120px', rot: '40deg' },
  { x: '-120px', y: '-100px', rot: '-20deg' },
  { x: '80px', y: '-140px', rot: '25deg' },
  { x: '-60px', y: '-180px', rot: '-45deg' },
  { x: '120px', y: '-160px', rot: '30deg' },
  { x: '-90px', y: '-130px', rot: '-30deg' },
  { x: '90px', y: '-150px', rot: '35deg' }
];

export default function TarotPage() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('dealt');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.deal-slot-wrapper').forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  return (
    <Layout title="Tarot & Oráculos | Bella Bruxa">
      {/* Header section */}
      <section className="section page-header reveal">
        <div className="header-glow"></div>
        <div className="container header-container gothic-panel gothic-corners">
          <span className="vintage-text gold-pulse-text">O Oráculo</span>
          <h1 className="gothic-title page-title">TAROT & CONEXÃO</h1>
          
          <div className="ornament-divider">
            <span className="divider-star">✦</span>
            <span className="divider-line"></span>
            <span className="divider-symbol">☾</span>
            <span className="divider-line"></span>
            <span className="divider-star">✦</span>
          </div>

          <p className="subtitle">Escolha seu caminho sagrado através das cartas e mistérios revelados.</p>
        </div>
      </section>

      {/* Runic Grid */}
      <section className="section tarot-grid">
        <div className="container">
          <div className="deck-description">
            <span className="mystic-icon">◈</span>
            <p>O baralho está sendo distribuído no altar. Role a tela para virar as cartas.</p>
          </div>
          
          <div className="cards-wrapper">
            {tarotPackages.map((pkg, idx) => {
              const offset = dealOffsets[idx % dealOffsets.length];
              return (
                <div 
                  key={idx} 
                  className="deal-slot-wrapper"
                  style={{
                    '--deal-x': offset.x,
                    '--deal-y': offset.y,
                    '--deal-rot': offset.rot
                  }}
                >
                  {/* ALCHEMICAL CELESTIAL UI RINGS - Behind each card */}
                  <div className="alchemical-ring"></div>
                  <div className="alchemical-ring-outer"></div>
                  
                  {/* Virtual Backside of the Card */}
                  <div className="virtual-card-back">
                    <div className="back-pattern">
                      <span>✦</span>
                      <div className="moon-symbol">☾</div>
                      <span>✦</span>
                    </div>
                  </div>
                  
                  {/* Actual Woodblock Card */}
                  <div className="actual-card-container">
                    <TarotCard {...pkg} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-header {
          padding-top: 10rem;
          text-align: center;
          background: radial-gradient(circle at bottom, var(--bg-secondary) 0%, var(--bg-primary) 100%);
          display: flex;
          justify-content: center;
        }

        .header-glow {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 70vw;
          height: 150px;
          background: radial-gradient(circle, rgba(139, 50, 204, 0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .header-container {
          padding: 3rem 4rem;
          max-width: 850px;
          width: 100%;
        }
        
        .page-title {
          font-size: 3.5rem;
          margin: 0.5rem 0;
        }

        .ornament-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin: 1.2rem 0;
          color: var(--accent-gold);
        }

        .divider-line {
          height: 1px;
          width: 60px;
          background: linear-gradient(to right, transparent, var(--accent-gold), transparent);
        }

        .divider-star {
          font-size: 6px;
          color: var(--accent-purple-bright);
        }

        .divider-symbol {
          font-size: 1.1rem;
          text-shadow: 0 0 8px var(--accent-gold);
        }
        
        .subtitle {
          color: var(--text-lavender);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .tarot-grid {
          padding: 4rem 2rem 8rem;
          background: linear-gradient(to bottom, var(--bg-primary) 0%, var(--bg-secondary) 100%);
          position: relative;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .deck-description {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          margin-bottom: 5rem;
          font-size: 0.85rem;
          color: var(--accent-gold);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .mystic-icon {
          font-size: 1.1rem;
          text-shadow: 0 0 8px var(--accent-gold);
        }
        
        .cards-wrapper {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 5rem 3rem;
          justify-items: center;
        }

        /* 3D Card Dealer Animation Slot */
        .deal-slot-wrapper {
          position: relative;
          width: 320px;
          height: 500px;
          perspective: 1000px;
        }

        /* Alchemical Orbits styling */
        .alchemical-ring, .alchemical-ring-outer {
          opacity: 0;
          transition: opacity 1.5s cubic-bezier(0.19, 1, 0.22, 1) 0.5s;
        }

        /* Once slot is active/scrolled-in, alchemical orbital lines fade in beautifully */
        .deal-slot-wrapper.dealt .alchemical-ring {
          opacity: 0.22;
        }
        
        .deal-slot-wrapper.dealt .alchemical-ring-outer {
          opacity: 0.15;
        }

        /* Deal fly-out animation rules */
        .virtual-card-back {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: #0d0617;
          border: 2px solid var(--accent-gold);
          border-radius: 4px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.8);
          z-index: 5;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.9s cubic-bezier(0.19, 1, 0.22, 1);
          transform: translate3d(var(--deal-x), var(--deal-y), -50px) rotate(var(--deal-rot));
          opacity: 0;
          pointer-events: none;
        }

        .back-pattern {
          width: 100%; height: 100%;
          border: 1px dashed rgba(212, 175, 55, 0.35);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 0;
          color: var(--accent-gold);
        }

        .moon-symbol {
          font-size: 2.2rem;
          text-shadow: 0 0 10px var(--accent-gold);
          color: var(--accent-gold-bright);
        }

        .actual-card-container {
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 6;
          transition: all 0.9s cubic-bezier(0.19, 1, 0.22, 1);
          transform: translate3d(var(--deal-x), var(--deal-y), -80px) rotate(var(--deal-rot)) scale(0.7);
          opacity: 0;
        }

        /* Once slot is dealt / enters viewport */
        .deal-slot-wrapper.dealt .virtual-card-back {
          transform: translate3d(0, 0, 0) rotateY(180deg);
          opacity: 0; /* Fully flip and fade out back */
        }

        .deal-slot-wrapper.dealt .actual-card-container {
          transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          opacity: 1; /* Fully reveal face up */
        }
        
        @media (max-width: 900px) {
          .page-title { font-size: 2.8rem; }
          .header-container { padding: 2rem 1.5rem; }
        }

        @media (max-width: 768px) {
          .tarot-grid { padding: 3rem 1rem; }
          .cards-wrapper { grid-template-columns: 1fr; gap: 4rem; }
          .deck-description { font-size: 0.75rem; text-align: center; line-height: 1.5; }
          
          /* Smaller alchemical orbits on mobile */
          .alchemical-ring { width: 330px; height: 330px; }
          .alchemical-ring-outer { width: 360px; height: 360px; }
        }
      `}</style>
    </Layout>
  );
}
