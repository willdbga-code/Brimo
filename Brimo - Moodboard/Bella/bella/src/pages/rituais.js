import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';

const ritualsData = [
  {
    title: "Vira Pensamento",
    price: "95",
    description: "Influencie positivamente o fluxo mental e a percepção de terceiros através de emanações mentais concentradas nas forças do elemento Ar.",
    items: ["Duração: 7 dias de ritos contínuos", "Elemento Principal: Ar & Mental", "Feedback: Áudio explicativo pós-consagração", "Efeito: Foco e Influência"],
    tabClass: "tab-red",
    symbol: "⚔",
    color: "#a73838",
    slug: "vira-pensamento"
  },
  {
    title: "Abertura de Caminhos",
    price: "109",
    description: "Remoção absoluta de bloqueios energéticos nas esferas financeira e profissional através de oferendas ancestrais de Quimbanda e contato direto com a Terra.",
    items: ["Duração: Rito de desobstrução imediata", "Elemento Principal: Terra & Fogo", "Banho Consagrado: Ervas aromáticas incluídas", "Efeito: Prosperidade & Destino"],
    tabClass: "tab-green",
    symbol: "🔑",
    color: "#287d64",
    slug: "abertura-caminhos"
  },
  {
    title: "Corte de Laços",
    price: "130",
    description: "Rompimento definitivo de conexões e cordões energéticos obsessivos, doentios ou obsoletos com pessoas ou situações do passado.",
    items: ["Duração: Selamento áurico em 3 dias", "Elemento Principal: Água & Ferro", "Acompanhamento: 48h de suporte espiritual", "Efeito: Limpeza & Libertação"],
    tabClass: "tab-blue",
    symbol: "✂",
    color: "#305f8f",
    slug: "corte-lacos"
  },
  {
    title: "Quebra de Demanda",
    price: "77",
    description: "Escudo de proteção impenetrável contra inveja direcionada, mau-olhado e ataques energéticos hostis sobre sua aura e o ambiente de seu lar.",
    items: ["Duração: Blindagem ativa permanente", "Elemento Principal: Fogo & Escudo", "Proteção: Banho purificador e consagração do lar", "Efeito: Defesa Ativa"],
    tabClass: "tab-brown",
    symbol: "🛡",
    color: "#836124",
    slug: "quebra-demanda"
  }
];

// Custom SVG illustrations inside the book pages
const GrimoireIllustration = ({ slug }) => {
  const svgProps = {
    width: "100%",
    height: "170",
    viewBox: "0 0 200 170",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  };

  switch (slug) {
    case 'vira-pensamento':
      return (
        <svg {...svgProps}>
          <path d="M100 85M70 85C70 65 90 50 100 50C115 50 130 68 120 88C110 108 85 102 85 85C85 75 100 70 108 76" stroke="#11091e" strokeWidth="1.5" fill="none" />
          <path d="M130 145C130 145 132 130 128 118C124 106 125 90 125 82C125 62 115 46 95 46C75 46 68 62 68 74C68 82 60 82 60 86C60 90 66 91 66 95C66 99 60 99 60 103L74 130" stroke="#11091e" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M52 88C40 86 32 92 25 88" stroke="#c29d38" strokeWidth="2" strokeLinecap="round" />
          <path d="M48 102C38 98 30 106 20 102" stroke="#c29d38" strokeWidth="2" strokeLinecap="round" />
          <circle cx="85" cy="70" r="3.5" fill="#11091e" />
        </svg>
      );
    case 'abertura-caminhos':
      return (
        <svg {...svgProps}>
          <path d="M45 145C45 145 35 110 43 80C50 52 68 36 100 36C132 36 150 52 157 80C165 110 155 145 155 145" stroke="#11091e" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M35 145C35 145 40 118 50 90C60 66 72 46 100 46C128 46 140 66 150 90C160 118 165 145 165 145" stroke="#11091e" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M25 145H175" stroke="#11091e" strokeWidth="2.5" strokeLinecap="round" />
          <g transform="translate(100, 85) scale(0.7) translate(-100, -85)">
            <circle cx="100" cy="65" r="15" fill="none" stroke="#c29d38" strokeWidth="3" />
            <circle cx="100" cy="65" r="7" fill="none" stroke="#11091e" strokeWidth="1.5" />
            <path d="M98 80H102V145H98V80Z" fill="#11091e" />
            <path d="M102 115H118V130H102V115Z" fill="#c29d38" stroke="#11091e" strokeWidth="2" />
          </g>
          <circle cx="65" cy="70" r="2" fill="#c29d38" />
          <circle cx="135" cy="70" r="2" fill="#c29d38" />
        </svg>
      );
    case 'corte-lacos':
      return (
        <svg {...svgProps}>
          <path d="M100 15C100 15 95 32 100 44C105 56 95 68 100 80M100 105C105 118 95 130 100 142C105 154 100 162 100 162" stroke="#11091e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M85 88L92 90M108 94L115 96" stroke="#11091e" strokeWidth="2" />
          <g transform="translate(100, 92) rotate(15) translate(-100, -92)">
            <path d="M55 92C65 92 98 89 108 89L108 94C98 94 65 97 55 97" fill="#f4ecd8" stroke="#11091e" strokeWidth="2.5" />
            <path d="M55 97C65 97 98 100 108 100L108 95C98 95 65 92 55 92" fill="#f4ecd8" stroke="#11091e" strokeWidth="2.5" />
            <circle cx="43" cy="89" r="8" fill="none" stroke="#11091e" strokeWidth="2.5" />
            <circle cx="43" cy="98" r="8" fill="none" stroke="#11091e" strokeWidth="2.5" />
            <circle cx="100" cy="94.5" r="3" fill="#c29d38" stroke="#11091e" strokeWidth="1" />
          </g>
          <path d="M135 70L137 74L142 75L138 78L139 82L135 80L131 82L132 78L128 75L133 74L135 70Z" fill="#c29d38" />
        </svg>
      );
    case 'quebra-demanda':
      return (
        <svg {...svgProps}>
          <circle cx="100" cy="85" r="45" stroke="#11091e" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
          <path d="M68 50H132V82C132 114 100 138 100 138C100 138 68 114 68 82V50Z" fill="#f4ecd8" stroke="#11091e" strokeWidth="3" strokeLinejoin="round" />
          <path d="M74 56H126V82C126 108 100 128 100 128C100 128 74 108 74 82V56Z" fill="none" stroke="#c29d38" strokeWidth="2" />
          <path d="M88 82C88 82 93 75 100 75C107 75 112 82 112 82C112 82 107 89 100 89C93 89 88 82 88 82Z" fill="#c29d38" stroke="#11091e" strokeWidth="1.5" />
          <circle cx="100" cy="82" r="3.5" fill="#11091e" />
          <path d="M45 42L35 52M155 38L167 50" stroke="#11091e" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
};

export default function RitualsPage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [currentPageSide, setCurrentPageSide] = useState('left'); // 'left' or 'right' on mobile
  const activeRitual = ritualsData[activeIdx];
  const whatsappUrl = `https://wa.me/5512991916776?text=Olá Bella, gostaria de iniciar o rito consagrado: ${activeRitual.title}`;

  // When active ritual changes, reset to the first page (left page)
  useEffect(() => {
    setCurrentPageSide('left');
  }, [activeIdx]);

  return (
    <Layout title="Rituais & Feitiços | Bella Bruxa">
      <div className="rituals-page-table">
        <div className="candle-glow-left"></div>
        <div className="candle-glow-right"></div>
        
        <div className="container grimoire-container">
          
          <div className="deck-description">
            <span className="mystic-icon">◈</span>
            <p>O Grimório de Feitiços de Bella Bruxa está aberto. Escolha sua página nas abas superiores.</p>
          </div>

          {/* THE DYNAMIC INTERACTIVE GRIMOIRE BOOK */}
          <div className="grimoire-book-wrap">
            
            {/* BOOK NAVIGATION TABS (Bookmarks at the top edge - Leather Bookmark styling) */}
            <div className="grimoire-tabs">
              {ritualsData.map((rit, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`grimoire-tab ${rit.tabClass} ${activeIdx === idx ? 'active' : ''}`}
                  style={{ 
                    '--tab-color': rit.color,
                    transform: activeIdx === idx ? 'translateY(-2px)' : 'translateY(10px) rotate(1deg)'
                  }}
                >
                  <span className="tab-stitch"></span>
                  <span className="tab-symbol">{rit.symbol}</span>
                  <span className="tab-label font-vintage">{rit.title.split(" ")[0]}</span>
                </button>
              ))}
            </div>

            {/* THE BOOK INNER SHELL ENVELOPED IN A HEAVY LEATHER COVER */}
            <div className={`grimoire-book-cover mobile-show-${currentPageSide}`}>
              <div className="grimoire-book-body">
                
                {/* LEFT PAGE: Botanical Sketch & Lore Bullets */}
                <div 
                  key={`left-${activeIdx}`} 
                  className={`grimoire-page page-left ${currentPageSide === 'left' ? 'mobile-page-active' : 'mobile-page-hidden'} page-flip-turn`}
                >
                  <div className="grimoire-page-header">
                    <span className="grimoire-folklore font-vintage">Consagração Botânica</span>
                    <h2 className="grimoire-headline font-vintage">{activeRitual.title}</h2>
                  </div>

                  <div className="botanical-sketch-frame">
                    <div className="inner-sketch-border">
                      <GrimoireIllustration slug={activeRitual.slug} />
                    </div>
                  </div>

                  <ul className="botanical-notes-list">
                    {activeRitual.items.map((item, id) => (
                      <li key={id} className="botanical-bullet font-vintage">
                        • {item}
                      </li>
                    ))}
                  </ul>

                  {/* Tactile Mobile-Only turn button */}
                  <div className="mobile-page-turn-hint">
                    <button 
                      onClick={() => setCurrentPageSide('right')} 
                      className="mobile-turn-btn font-vintage"
                    >
                      Ler Instruções e Preço ☞
                    </button>
                  </div>
                </div>

                {/* CENTER CREASE BINDER RINGS */}
                <div className="grimoire-binder-crease">
                  <div className="crease-shadow"></div>
                  <div className="binder-rings-horizontal">
                    <div className="binder-ring"></div>
                    <div className="binder-ring"></div>
                    <div className="binder-ring"></div>
                    <div className="binder-ring"></div>
                    <div className="binder-ring"></div>
                    <div className="binder-ring"></div>
                  </div>
                </div>

                {/* RIGHT PAGE: Calligraphy & Leather Buckle Trigger */}
                <div 
                  key={`right-${activeIdx}`} 
                  className={`grimoire-page page-right ${currentPageSide === 'right' ? 'mobile-page-active' : 'mobile-page-hidden'} page-flip-turn`}
                >
                  <div className="grimoire-page-header">
                    <span className="grimoire-folklore font-vintage">Instruções de Ritos</span>
                    <h3 className="grimoire-headline-small font-vintage">Emanação Alquímica</h3>
                  </div>

                  <div className="spell-calligraphy-desc">
                    <p>{activeRitual.description}</p>
                    <p className="seal-tag">
                      "Que a terra acolha as cinzas, que o fogo purifique os nós, e que pelo sangue se sele este intento sob o manto da Quimbanda."
                    </p>
                  </div>

                  <div className="spell-pricing-trigger">
                    <div className="medieval-price-tag">
                      <span className="price-label">Preço de Consagração</span>
                      <span className="price-value gothic-title">R$ {activeRitual.price}</span>
                    </div>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cta-game primary grimoire-leather-btn"
                    >
                      <span className="btn-shine"></span>
                      <span className="btn-inner">INICIAR CONSAGRAÇÃO ☾</span>
                    </a>
                  </div>

                  {/* Tactile Mobile-Only turn button */}
                  <div className="mobile-page-turn-hint">
                    <button 
                      onClick={() => setCurrentPageSide('left')} 
                      className="mobile-turn-btn font-vintage"
                    >
                      ☜ Ver Consagração Botânica
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .rituals-page-table {
          min-height: 100vh;
          width: 100%;
          background: radial-gradient(circle at center, var(--bg-secondary) 0%, var(--bg-primary) 100%);
          padding: 8rem 1.5rem 6rem;
          position: relative;
          overflow-x: hidden;
        }

        .candle-glow-left, .candle-glow-right {
          position: absolute;
          width: 30vw;
          height: 300px;
          filter: blur(80px);
          opacity: 0.15;
          pointer-events: none;
        }
        
        .candle-glow-left {
          top: 20%; left: -5%;
          background: radial-gradient(circle, var(--accent-purple-bright) 0%, transparent 75%);
        }
        .candle-glow-right {
          bottom: 10%; right: -5%;
          background: radial-gradient(circle, var(--accent-gold) 0%, transparent 75%);
        }

        .grimoire-container {
          max-width: 900px; /* Reduced from 980px to prevent horizontal stretching and create taller aspect ratio */
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .deck-description {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          margin-bottom: 3rem;
          font-size: 0.85rem;
          color: var(--accent-gold);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .mystic-icon {
          font-size: 1.1rem;
          text-shadow: 0 0 8px var(--accent-gold);
        }

        /* GRIMOIRE BOOK WRAPPER */
        .grimoire-book-wrap {
          position: relative;
          width: 100%;
          margin: 0 auto;
        }

        /* Leather Tabs layout sticking out of Book (Authentic Hanging Bookmarks) */
        .grimoire-tabs {
          display: flex;
          gap: 0.5rem;
          padding-left: 3rem;
          position: relative;
          z-index: 1;
        }

        .grimoire-tab {
          border: 2.5px solid var(--text-ink);
          border-bottom: none;
          background: var(--tab-color, #11091e);
          color: #f4ecd8;
          padding: 0.8rem 1.5rem 1rem;
          cursor: pointer;
          border-radius: 8px 8px 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          position: relative;
          transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
          box-shadow: 0 -8px 15px rgba(0, 0, 0, 0.45);
          overflow: hidden;
        }

        .tab-stitch {
          position: absolute;
          top: 3px; left: 3px; right: 3px; bottom: 0;
          border: 1px dashed rgba(244, 236, 216, 0.25);
          border-bottom: none;
          border-radius: 6px 6px 0 0;
          pointer-events: none;
        }

        .tab-symbol {
          font-size: 1.1rem;
        }

        .tab-label {
          font-size: 0.95rem;
          font-weight: bold;
          letter-spacing: 0.5px;
        }

        .grimoire-tab:hover {
          transform: translateY(2px) !important;
          padding-top: 1rem;
        }

        .grimoire-tab.active {
          transform: translateY(0px) !important;
          padding-top: 1.2rem;
          z-index: 10;
          border-bottom: 3.5px solid var(--bg-parchment) !important;
          background: var(--bg-parchment);
          color: var(--text-ink);
          box-shadow: 0 -8px 25px rgba(184, 102, 255, 0.2);
        }

        .grimoire-tab.active .tab-stitch {
          border-color: rgba(17, 9, 30, 0.2);
        }

        /* HEAVY LEATHER COVER OUTER SHELL WITH STACKED PAGES DEPTH */
        .grimoire-book-cover {
          background: #1f1107; /* Dark leather mahogany casing */
          background-image: repeating-linear-gradient(45deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 2px, transparent 2px, transparent 10px);
          border: 3.5px solid var(--text-ink);
          border-radius: 8px;
          padding: 12px 14px;
          box-shadow: 
            0 35px 75px rgba(0, 0, 0, 0.95), 
            0 0 30px rgba(194, 157, 56, 0.1),
            /* Simulated page stack thickness beneath the cover */
            -4px 4px 0px #e8dcb9,
            -3px 3px 0px var(--text-ink),
            4px 4px 0px #e8dcb9,
            3px 3px 0px var(--text-ink),
            0px 6px 0px #e8dcb9,
            0px 5px 0px var(--text-ink);
          position: relative;
          z-index: 5;
          transition: box-shadow 0.5s ease;
        }

        .grimoire-book-cover::before {
          content: '';
          position: absolute;
          top: 4px; left: 4px; right: 4px; bottom: 4px;
          border: 1px dashed rgba(194, 157, 56, 0.3);
          border-radius: 6px;
          pointer-events: none;
        }

        /* DUAL PAGE GRID BODY */
        .grimoire-book-body {
          display: grid;
          grid-template-columns: 1fr 32px 1fr;
          border: 2.5px solid var(--text-ink);
          background-color: var(--bg-parchment);
          border-radius: 4px;
          overflow: hidden;
        }

        .grimoire-page {
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          min-height: 600px; /* Taller page size for desktop book realism */
        }

        /* 3D Paper fold shadow curvature (spine bend) */
        .page-left {
          background: linear-gradient(to right, var(--bg-parchment) 93%, var(--bg-parchment-dark) 100%);
        }

        .page-right {
          background: linear-gradient(to left, var(--bg-parchment) 93%, var(--bg-parchment-dark) 100%);
        }

        /* 3D Y-Axis page flipping rotation animations */
        .page-left.page-flip-turn {
          animation: leaf-turn-left 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }

        .page-right.page-flip-turn {
          animation: leaf-turn-right 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }

        @keyframes leaf-turn-left {
          0% {
            opacity: 0.2;
            transform: rotateY(25deg);
            transform-origin: right center;
            filter: blur(1px);
          }
          100% {
            opacity: 1;
            transform: rotateY(0deg);
            transform-origin: right center;
            filter: blur(0);
          }
        }

        @keyframes leaf-turn-right {
          0% {
            opacity: 0.2;
            transform: rotateY(-25deg);
            transform-origin: left center;
            filter: blur(1px);
          }
          100% {
            opacity: 1;
            transform: rotateY(0deg);
            transform-origin: left center;
            filter: blur(0);
          }
        }

        .grimoire-page-header {
          border-bottom: 1.5px solid rgba(17, 9, 30, 0.15);
          padding-bottom: 0.8rem;
          margin-bottom: 1.2rem;
        }

        .grimoire-folklore {
          font-size: 0.8rem;
          color: var(--accent-gold);
          letter-spacing: 1px;
          display: block;
          text-transform: uppercase;
        }

        .grimoire-headline {
          font-size: 2.2rem;
          color: var(--text-ink);
          line-height: 1;
          margin-top: 0.2rem;
        }

        .grimoire-headline-small {
          font-size: 1.6rem;
          color: var(--text-ink);
          line-height: 1;
          margin-top: 0.2rem;
        }

        /* Botanical Drawing box */
        .botanical-sketch-frame {
          padding: 3px;
          border: 1px dashed rgba(17, 9, 30, 0.2);
          margin-bottom: 1.5rem;
        }

        .inner-sketch-border {
          border: 1.5px solid var(--text-ink);
          background: var(--bg-parchment-dark);
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .botanical-notes-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .botanical-bullet {
          font-size: 0.85rem;
          color: var(--text-ink);
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        /* CENTER SPINE / BINDER RINGS (Horizontal Ring Binder Realism) */
        .grimoire-binder-crease {
          position: relative;
          width: 32px;
          height: 100%;
          background: linear-gradient(90deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.15) 100%);
          border-left: 1px solid rgba(17, 9, 30, 0.15);
          border-right: 1px solid rgba(17, 9, 30, 0.15);
        }

        .crease-shadow {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
        }

        .binder-rings-horizontal {
          position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          height: 100%;
          width: 44px; /* Extends 6px on left page and 6px on right page */
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          padding: 2.5rem 0;
          z-index: 10;
        }

        .binder-ring {
          width: 100%;
          height: 10px;
          background: linear-gradient(to bottom, #d4af37 0%, #ffd700 30%, #8a6f27 75%, #5a4512 100%);
          border-radius: 5px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.6);
          position: relative;
          pointer-events: none;
        }

        /* Ring binder paper holes */
        .binder-ring::before, .binder-ring::after {
          content: '';
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          background: #06020c;
          border-radius: 50%;
          border: 1.2px solid rgba(17, 9, 30, 0.45);
          box-shadow: inset 0 2px 3px rgba(0,0,0,0.9);
          z-index: -1;
        }

        .binder-ring::before {
          left: -3px;
        }

        .binder-ring::after {
          right: -3px;
        }

        /* RIGHT PAGE TEXT & DETAILS */
        .spell-calligraphy-desc p {
          font-size: 0.95rem;
          line-height: 1.8;
          color: var(--text-ink);
          font-weight: 400;
          margin-bottom: 1.5rem;
          text-align: justify;
        }

        .spell-calligraphy-desc p.seal-tag {
          font-family: var(--font-vintage);
          font-size: 1.05rem;
          line-height: 1.5;
          color: var(--text-ink-muted);
          border-left: 1.5px dashed var(--accent-gold);
          padding-left: 1rem;
          margin-top: 1.8rem;
          text-align: left;
        }

        .spell-pricing-trigger {
          border-top: 1.5px dashed rgba(17, 9, 30, 0.15);
          padding-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .medieval-price-tag {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .price-label {
          font-size: 0.65rem;
          color: var(--text-ink-muted);
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: bold;
        }

        .price-value {
          font-size: 2rem;
          color: var(--text-ink);
          text-shadow: none;
        }

        .grimoire-leather-btn {
          width: 100%;
          border: 2px solid var(--text-ink) !important;
          background: var(--text-ink) !important;
          color: var(--bg-parchment) !important;
          box-shadow: none !important;
          padding: 1.1rem !important;
        }

        .grimoire-leather-btn::before {
          display: none;
        }

        .grimoire-leather-btn:hover {
          background: var(--bg-parchment-dark) !important;
          color: var(--text-ink) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }

        .cta-game {
          position: relative;
          cursor: pointer;
          transition: var(--transition-fast);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .btn-inner {
          font-family: var(--font-serif);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          z-index: 2;
        }

        /* Tactile Mobile Turn Page styling */
        .mobile-page-turn-hint {
          display: none;
        }

        /* RESPONSIVE SCALING */
        @media (max-width: 960px) {
          .grimoire-book-body {
            grid-template-columns: 1fr;
          }
          
          /* Stacking is disabled in favor of the Mobile Pocket Grimoire page-flipping layout */
          .mobile-page-hidden {
            display: none !important;
          }

          .mobile-page-active {
            display: flex !important;
          }

          .grimoire-page {
            min-height: 520px;
            padding: 2.2rem 1.8rem 1.8rem;
          }

          /* Crease spine is hidden in mobile single page view */
          .grimoire-binder-crease {
            display: none !important;
          }

          /* Simulate center page spine curve on the edge based on active side */
          .mobile-show-left .grimoire-page {
            /* Crease/Spine is on the right margin */
            background: linear-gradient(to right, var(--bg-parchment) 93%, var(--bg-parchment-dark) 100%);
            border-right: 5px solid rgba(17, 9, 30, 0.8);
          }

          .mobile-show-right .grimoire-page {
            /* Crease/Spine is on the left margin */
            background: linear-gradient(to left, var(--bg-parchment) 93%, var(--bg-parchment-dark) 100%);
            border-left: 5px solid rgba(17, 9, 30, 0.8);
          }

          /* Simulated stacked page thickness adjustments for mobile single cover */
          .mobile-show-left.grimoire-book-cover {
            box-shadow: 
              0 30px 60px rgba(0, 0, 0, 0.95), 
              0 0 30px rgba(194, 157, 56, 0.1),
              -4px 4px 0px #e8dcb9,
              -3px 3px 0px var(--text-ink),
              0px 5px 0px #e8dcb9,
              0px 4px 0px var(--text-ink);
          }

          .mobile-show-right.grimoire-book-cover {
            box-shadow: 
              0 30px 60px rgba(0, 0, 0, 0.95), 
              0 0 30px rgba(194, 157, 56, 0.1),
              4px 4px 0px #e8dcb9,
              3px 3px 0px var(--text-ink),
              0px 5px 0px #e8dcb9,
              0px 4px 0px var(--text-ink);
          }

          .mobile-page-turn-hint {
            display: block;
            width: 100%;
            text-align: center;
            margin-top: 1.5rem;
            border-top: 1.5px dashed rgba(17, 9, 30, 0.12);
            padding-top: 1.2rem;
          }

          .mobile-turn-btn {
            background: transparent;
            border: none;
            color: var(--accent-gold);
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            letter-spacing: 0.5px;
            font-weight: 700;
            text-transform: uppercase;
            text-decoration: underline;
            text-decoration-style: dotted;
          }

          .mobile-turn-btn:hover {
            color: var(--text-ink);
            transform: scale(1.03);
          }
        }

        @media (max-width: 768px) {
          .rituals-page-table {
            padding: 6rem 1rem 4rem;
          }

          /* Clean Grid Bookmarks for Mobile width fit */
          .grimoire-tabs {
            padding-left: 0;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2px;
            margin-bottom: 0.1rem;
          }

          .grimoire-tab {
            padding: 0.6rem 0.2rem 0.8rem;
            transform: translateY(4px) !important;
            border-radius: 6px 6px 0 0;
            border-width: 1.5px;
            gap: 2px;
          }

          .grimoire-tab:hover {
            padding-top: 0.6rem;
            transform: translateY(4px) !important;
          }

          .grimoire-tab.active {
            transform: translateY(0px) !important;
            padding-top: 0.9rem;
            border-bottom: 2px solid var(--bg-parchment) !important;
          }

          .tab-label {
            font-size: 0.68rem;
            letter-spacing: 0px;
          }

          .tab-symbol {
            font-size: 0.75rem;
          }

          .grimoire-folklore {
            font-size: 0.72rem;
          }
          .grimoire-headline {
            font-size: 1.6rem;
          }
          .grimoire-headline-small {
            font-size: 1.25rem;
          }
          .spell-calligraphy-desc p {
            font-size: 0.85rem;
            line-height: 1.55;
            margin-bottom: 1rem;
          }
          .spell-calligraphy-desc p.seal-tag {
            font-size: 0.92rem;
            margin-top: 1rem;
          }
          .price-value {
            font-size: 1.5rem;
          }
          .deck-description {
            font-size: 0.75rem;
            text-align: center;
            line-height: 1.5;
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </Layout>
  );
}
