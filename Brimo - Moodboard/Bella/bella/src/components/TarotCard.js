import { useState, useRef } from 'react';

// Helper to normalize strings into safe slug identifiers
const getSlug = (str) => {
  if (!str) return '';
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

// Exquisite Inline SVG Medieval Woodblock Illustrations
const TarotWoodcutIllustration = ({ title }) => {
  const slug = getSlug(title);
  
  // Base properties for all engravings
  const svgProps = {
    width: "100%",
    height: "220",
    viewBox: "0 0 200 220",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  };

  switch (slug) {
    case 'resumo-de-luz-e-sombra':
      return (
        <svg {...svgProps}>
          {/* Radiant Sun */}
          <circle cx="100" cy="110" r="30" fill="url(#sun-beam)" stroke="#11091e" strokeWidth="2.5" />
          <circle cx="100" cy="110" r="24" fill="none" stroke="#11091e" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Sun Rays */}
          <path d="M100 65V45M100 155V175M55 110H35M165 110H145" stroke="#11091e" strokeWidth="3" strokeLinecap="round" />
          <path d="M68 78L54 64M132 142L146 156M68 142L54 156M132 78L146 64" stroke="#11091e" strokeWidth="2" strokeLinecap="round" />
          {/* Shorter flame-like rays */}
          <path d="M100 75C104 85 96 85 100 95M100 145C104 135 96 135 100 125" stroke="#11091e" strokeWidth="1.5" />
          {/* Classic Face Profile Moon Overlap */}
          <path d="M100 80C116.569 80 130 93.4315 130 110C130 126.569 116.569 140 100 140C94.5 140 88 136.5 86 132C94 132 102 124 102 110C102 96 94 88 86 88C88 83.5 94.5 80 100 80Z" fill="#f4ecd8" stroke="#11091e" strokeWidth="2.5" />
          <path d="M96 98C97 99.5 97.5 100.5 96 102" stroke="#11091e" strokeWidth="1.5" strokeLinecap="round" /> {/* Closed Eye */}
          {/* Stars */}
          <path d="M145 60L147 65L152 66L148 70L149 75L145 72L141 75L142 70L138 66L143 65L145 60Z" fill="#c29d38" stroke="#11091e" strokeWidth="1" />
          <path d="M55 155L57 160L62 161L58 165L59 170L55 167L51 170L52 165L48 161L53 160L55 155Z" fill="#c29d38" stroke="#11091e" strokeWidth="1" />
          <circle cx="140" cy="145" r="2" fill="#11091e" />
          <circle cx="60" cy="55" r="2.5" fill="#11091e" />
          <defs>
            <radialGradient id="sun-beam" cx="100" cy="110" r="30" fx="100" fy="110" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f7f3eb" />
              <stop offset="1" stopColor="#c29d38" />
            </radialGradient>
          </defs>
        </svg>
      );
    case 'mesa-aberta-intermediaria':
      return (
        <svg {...svgProps}>
          {/* Radiant Aura background */}
          <circle cx="100" cy="110" r="60" stroke="#11091e" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
          {/* The Open Hand facing upwards */}
          <path d="M85 185C85 185 82 155 82 140C82 125 70 120 72 100C74 80 77 65 80 50C81.5 45 86 45 86 52C86 65 87 95 87 95M87 95C87 95 91 60 92 42C92.5 37 97 37 97 45C97 60 97 90 97 90M97 90C97 90 101 58 103 40C103.5 35 108 35 108 42C108 58 107 92 107 92M107 92C107 92 112 65 114 48C115 43 119.5 43 119 50C117 78 115 105 115 115C115 125 127 122 131 105C135 88 138 78 138 78C138 74 143 74 142 80C138 105 128 135 122 150C116 165 115 185 115 185H85Z" fill="#f4ecd8" stroke="#11091e" strokeWidth="3" strokeLinejoin="round" />
          {/* Girdle of the palm */}
          <path d="M85 160C92 165 108 165 115 160" stroke="#11091e" strokeWidth="1.5" />
          {/* The Runic Eye in the Palm */}
          <path d="M88 115C88 115 94 103 101 103C108 103 114 115 114 115C114 115 108 127 101 127C94 127 88 115 88 115Z" fill="#c29d38" stroke="#11091e" strokeWidth="2.5" />
          <circle cx="101" cy="115" r="5" fill="#11091e" />
          {/* Light Beams from Eye */}
          <path d="M101 98V88M82 108L72 105M120 108L130 105M101 132V142" stroke="#11091e" strokeWidth="1.5" />
        </svg>
      );
    case 'questoes-objetivas':
      return (
        <svg {...svgProps}>
          {/* Ornate Circular Target Lines */}
          <circle cx="100" cy="110" r="45" stroke="#11091e" strokeWidth="1" strokeDasharray="3 3" />
          {/* Crossed Sword and Key */}
          {/* Sword pointing down */}
          <g transform="translate(100, 110) rotate(-45) translate(-100, -110)">
            <path d="M96 25H104V155H96V25Z" fill="#f4ecd8" stroke="#11091e" strokeWidth="3" />
            <path d="M96 25L100 12L104 25H96Z" fill="#11091e" />
            {/* Guard */}
            <path d="M80 155H120V163H80V155Z" fill="#c29d38" stroke="#11091e" strokeWidth="2.5" />
            {/* Pommel */}
            <circle cx="100" cy="180" r="7" fill="#c29d38" stroke="#11091e" strokeWidth="2.5" />
          </g>
          {/* Antique Key pointing up */}
          <g transform="translate(100, 110) rotate(45) translate(-100, -110)">
            {/* Bow (Handle) */}
            <circle cx="100" cy="165" r="14" fill="none" stroke="#11091e" strokeWidth="3" />
            <circle cx="100" cy="165" r="8" fill="none" stroke="#11091e" strokeWidth="1.5" />
            {/* Shaft */}
            <path d="M98 50H102V151H98V50Z" fill="#f4ecd8" stroke="#11091e" strokeWidth="3" />
            {/* Bit (Teeth) */}
            <path d="M102 52H118V67H102V52ZM102 75H112V85H102V75Z" fill="#f4ecd8" stroke="#11091e" strokeWidth="2.5" />
            <rect x="108" y="57" width="4" height="4" fill="#11091e" />
          </g>
        </svg>
      );
    case 'pergunta-avulsa':
      return (
        <svg {...svgProps}>
          {/* Starry Orbit Ring */}
          <circle cx="100" cy="110" r="50" stroke="#11091e" strokeWidth="1" strokeDasharray="5 5" opacity="0.3" />
          {/* Brass candle holder */}
          <path d="M70 170H130C130 170 135 180 120 180H80C65 180 70 170 70 170Z" fill="#c29d38" stroke="#11091e" strokeWidth="2.5" />
          <path d="M125 170C135 170 145 160 140 148C135 138 122 148 122 148" stroke="#11091e" strokeWidth="2.5" fill="none" /> {/* Loop handle */}
          {/* Thick wax candle */}
          <rect x="91" y="90" width="18" height="80" fill="#f4ecd8" stroke="#11091e" strokeWidth="3" />
          {/* Wax Drips */}
          <path d="M91 100C91 106 95 108 95 114C95 120 92 120 92 120" stroke="#11091e" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M109 110C109 116 106 118 106 124" stroke="#11091e" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Wick */}
          <path d="M100 90V80" stroke="#11091e" strokeWidth="3" strokeLinecap="round" />
          {/* Flickering Flame Silhouette */}
          <path d="M100 45C100 45 91 62 94 72C97 82 103 82 106 72C109 62 100 45 100 45Z" fill="#c29d38" stroke="#11091e" strokeWidth="2" />
          {/* Core Flame */}
          <path d="M100 58C100 58 96 66 97 72C98 78 102 78 103 72C104 66 100 58 100 58Z" fill="#f4ecd8" />
        </svg>
      );
    case 'prosperidade-feminina':
      return (
        <svg {...svgProps}>
          {/* Crescent Moon Background */}
          <path d="M140 40C125 40 110 52 110 72C110 92 125 104 140 104C130 104 122 92 122 72C122 52 130 40 140 40Z" fill="#c29d38" stroke="#11091e" strokeWidth="1.5" />
          {/* Ornate Chalice (Holy Grail) */}
          <path d="M70 70C70 70 70 120 100 120C130 120 130 70 130 70H70Z" fill="#f4ecd8" stroke="#11091e" strokeWidth="3" />
          {/* Chalice Stem */}
          <path d="M96 120H104V165H96V120Z" fill="#f4ecd8" stroke="#11091e" strokeWidth="2.5" />
          {/* Chalice Base */}
          <path d="M80 165H120C120 165 125 177 100 177C75 177 80 165 80 165Z" fill="#c29d38" stroke="#11091e" strokeWidth="2.5" />
          {/* Chalice Engraving Details */}
          <circle cx="100" cy="95" r="10" stroke="#11091e" strokeWidth="1.5" fill="none" />
          <path d="M100 85V105" stroke="#11091e" strokeWidth="1.5" />
          {/* Vines / Leaves growing around Chalice */}
          <path d="M60 160C50 140 60 110 65 95" stroke="#11091e" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M140 160C150 140 140 110 135 95" stroke="#11091e" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Vine Leaves */}
          <path d="M53 130C50 125 45 130 53 130Z" fill="#11091e" />
          <path d="M147 130C150 125 155 130 147 130Z" fill="#11091e" />
        </svg>
      );
    case 'mapa-financeiro':
      return (
        <svg {...svgProps}>
          {/* Scale balance structure */}
          {/* Vertical pillar */}
          <path d="M97 50H103V175H97V50Z" fill="#f4ecd8" stroke="#11091e" strokeWidth="3" />
          <path d="M85 175H115C115 175 120 185 100 185C80 185 85 175 85 175Z" fill="#c29d38" stroke="#11091e" strokeWidth="2.5" />
          {/* Top crossbeam */}
          <path d="M40 70H160V76H40V70Z" fill="#c29d38" stroke="#11091e" strokeWidth="3" />
          <circle cx="100" cy="46" r="8" fill="#c29d38" stroke="#11091e" strokeWidth="2" />
          {/* Scale Pans Left (Sun) */}
          <line x1="45" y1="76" x2="25" y2="126" stroke="#11091e" strokeWidth="1.5" />
          <line x1="45" y1="76" x2="65" y2="126" stroke="#11091e" strokeWidth="1.5" />
          <path d="M20 126H70C70 126 65 140 45 140C25 140 20 126 20 126Z" fill="#f4ecd8" stroke="#11091e" strokeWidth="2.5" />
          <circle cx="45" cy="110" r="6" fill="#c29d38" /> {/* Sun coin */}
          {/* Scale Pans Right (Moon) */}
          <line x1="155" y1="76" x2="135" y2="126" stroke="#11091e" strokeWidth="1.5" />
          <line x1="155" y1="76" x2="175" y2="126" stroke="#11091e" strokeWidth="1.5" />
          <path d="M130 126H180C180 126 175 140 155 140C135 140 130 126 130 126Z" fill="#f4ecd8" stroke="#11091e" strokeWidth="2.5" />
          <path d="M158 106C153 106 150 110 150 114C150 118 153 122 158 122C155 122 153 118 153 114C153 110 155 106 158 106Z" fill="#11091e" /> {/* Moon coin */}
        </svg>
      );
    case 'cura-da-alma':
      return (
        <svg {...svgProps}>
          {/* Earth horizon roots */}
          <path d="M40 165C70 168 130 168 160 165" stroke="#11091e" strokeWidth="2" strokeDasharray="3 3" />
          {/* Anatomical Heart with roots and herbs */}
          <g transform="translate(0, -10)">
            <path d="M100 80C90 60 70 60 65 80C60 100 80 120 100 145C120 120 140 100 135 80C130 60 110 60 100 80Z" fill="#f4ecd8" stroke="#11091e" strokeWidth="3" strokeLinejoin="round" />
            {/* Heart chambers details */}
            <path d="M96 60V80H104V55H96V60Z" fill="#c29d38" stroke="#11091e" strokeWidth="2.5" />
            <path d="M85 62L76 53L82 47L91 56L85 62Z" fill="#c29d38" stroke="#11091e" strokeWidth="2" />
            {/* Heart Muscle Fibers / Rays */}
            <path d="M80 90Q90 92 100 90M100 105Q110 110 120 105" stroke="#11091e" strokeWidth="1.5" />
            {/* Root system growing into soil */}
            <path d="M100 145C95 160 85 172 80 185" stroke="#11091e" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M100 145C105 160 115 172 120 185" stroke="#11091e" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M100 145C100 165 100 178 95 190" stroke="#11091e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Lavender blooming from top */}
            <path d="M112 60C125 50 135 52 142 42" stroke="#11091e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <circle cx="140" cy="45" r="2.5" fill="#c29d38" />
            <circle cx="134" cy="49" r="2" fill="#c29d38" />
          </g>
        </svg>
      );
    case 'leitura-da-conexao':
      return (
        <svg {...svgProps}>
          {/* Two hands reaching for each other */}
          {/* Left hand */}
          <path d="M15 115C45 115 50 95 68 95C72 95 85 100 87 101C89 102 91 100 89 98C82 92 78 92 78 88C78 84 82 82 84 84C88 88 95 91 97 91" stroke="#11091e" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M15 125C35 125 45 128 60 120C65 117 72 110 74 110" stroke="#11091e" strokeWidth="2.5" fill="none" />
          {/* Right hand */}
          <g transform="translate(200, 220) rotate(180) translate(-200, -220)">
            <path d="M15 115C45 115 50 95 68 95C72 95 85 100 87 101C89 102 91 100 89 98C82 92 78 92 78 88C78 84 82 82 84 84C88 88 95 91 97 91" stroke="#11091e" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
          {/* Red/Golden Thread of Fate weaving between fingertips */}
          <path d="M92 98C92 98 100 70 105 110C110 150 114 110 114 110" stroke="#c29d38" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Sparkles of fate */}
          <path d="M104 80L106 85L111 86L107 90L108 95L104 92L100 95L101 90L97 86L102 85L104 80Z" fill="#c29d38" />
          <circle cx="85" cy="70" r="1.5" fill="#11091e" />
          <circle cx="120" cy="140" r="2" fill="#11091e" />
        </svg>
      );
      
    // Rituals (4 items)
    case 'vira-pensamento':
      return (
        <svg {...svgProps}>
          {/* Astral Spiral Orbit */}
          <path d="M100 110M70 110C70 85 90 70 100 70C115 70 130 90 120 115C110 135 85 130 85 110C85 98 100 92 108 100C112 104 105 112 102 110" stroke="#11091e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Head profile facing left */}
          <path d="M130 185C130 185 132 165 128 150C124 135 125 115 125 105C125 80 115 60 95 60C75 60 68 80 68 95C68 105 60 105 60 110C60 115 66 117 66 122C66 127 60 127 60 132C60 137 68 139 70 145C72 152 74 165 74 165L65 185" stroke="#11091e" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {/* Wind currents swirling from mouth */}
          <path d="M52 112C42 110 32 118 25 112" stroke="#c29d38" strokeWidth="2" strokeLinecap="round" />
          <path d="M50 130C38 126 30 136 20 130" stroke="#c29d38" strokeWidth="2" strokeLinecap="round" />
          <circle cx="85" cy="90" r="4.5" fill="#c29d38" /> {/* Third Eye circle */}
        </svg>
      );
    case 'abertura-de-caminhos':
      return (
        <svg {...svgProps}>
          {/* Branch-like Gnarled Archway */}
          <path d="M40 185C40 185 30 140 38 100C45 65 65 45 100 45C135 45 155 65 162 100C170 140 160 185 160 185" stroke="#11091e" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M28 185C28 185 35 150 48 115C60 85 75 58 100 58C125 58 140 85 152 115C165 150 172 185 172 185" stroke="#11091e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Gnarled roots on ground */}
          <path d="M20 185H180" stroke="#11091e" strokeWidth="3" strokeLinecap="round" />
          {/* Mystic Ornate Key hanging in archway */}
          <g transform="translate(100, 105) scale(0.85) translate(-100, -105)">
            <circle cx="100" cy="65" r="15" fill="none" stroke="#c29d38" strokeWidth="3.5" />
            <circle cx="100" cy="65" r="7" fill="none" stroke="#11091e" strokeWidth="1.5" />
            <path d="M98 80H102V155H98V80Z" fill="#11091e" />
            <path d="M102 125H118V140H102V125ZM102 143H112V153H102V143Z" fill="#c29d38" stroke="#11091e" strokeWidth="2" />
          </g>
          {/* Triple stars in the sky */}
          <circle cx="65" cy="80" r="2.5" fill="#c29d38" />
          <circle cx="135" cy="80" r="2.5" fill="#c29d38" />
          <path d="M100 22L102 26L107 27L103 30L104 35L100 32L96 35L97 30L93 27L98 26L100 22Z" fill="#c29d38" />
        </svg>
      );
    case 'corte-de-lacos':
      return (
        <svg {...svgProps}>
          {/* Braided cord hanging vertically */}
          <path d="M100 20C100 20 95 40 100 55C105 70 95 85 100 100M100 130C105 145 95 160 100 175C105 190 100 200 100 200" stroke="#11091e" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          {/* Segmented cut lines */}
          <path d="M85 110L92 112M108 118L115 120" stroke="#11091e" strokeWidth="2.5" />
          {/* Sharp Iron Shears (blacksmith style scissors) */}
          <g transform="translate(100, 115) rotate(15) translate(-100, -115)">
            {/* Shear blades */}
            <path d="M55 115C65 115 98 112 108 112L108 117C98 117 65 120 55 120" fill="#f4ecd8" stroke="#11091e" strokeWidth="3" />
            <path d="M55 120C65 120 98 123 108 123L108 118C98 118 65 115 55 115" fill="#f4ecd8" stroke="#11091e" strokeWidth="3" />
            {/* Handles loops */}
            <circle cx="43" cy="112" r="10" fill="none" stroke="#11091e" strokeWidth="3" />
            <circle cx="43" cy="123" r="10" fill="none" stroke="#11091e" strokeWidth="3" />
            {/* Pivot pin */}
            <circle cx="100" cy="117.5" r="3.5" fill="#c29d38" stroke="#11091e" strokeWidth="1.5" />
          </g>
          {/* Sparkles of cut ties */}
          <path d="M135 90L137 95L142 96L138 100L139 105L135 102L131 105L132 100L128 96L133 95L135 90Z" fill="#c29d38" />
        </svg>
      );
    case 'quebra-de-demanda':
      return (
        <svg {...svgProps}>
          {/* Orbital protective grid */}
          <circle cx="100" cy="110" r="55" stroke="#11091e" strokeWidth="1" strokeDasharray="3 4" opacity="0.3" />
          {/* Medieval kite shield */}
          <path d="M60 65H140V105C140 145 100 175 100 175C100 175 60 145 60 105V65Z" fill="#f4ecd8" stroke="#11091e" strokeWidth="3.5" strokeLinejoin="round" />
          {/* Shield rim details */}
          <path d="M68 73H132V105C132 137 100 162 100 162C100 162 68 137 68 105V73Z" fill="none" stroke="#c29d38" strokeWidth="2.5" />
          {/* Radiant defensive Eye in shield center */}
          <path d="M85 105C85 105 91 97 100 97C109 97 115 105 115 105C115 105 109 113 100 113C91 113 85 105 85 105Z" fill="#c29d38" stroke="#11091e" strokeWidth="2" />
          <circle cx="100" cy="105" r="4.5" fill="#11091e" />
          <path d="M100 90V97M100 113V120M80 105H85M115 105H120" stroke="#11091e" strokeWidth="1.5" />
          {/* Falling broken arrows deflection */}
          <path d="M45 55L32 68M30 52L25 57" stroke="#11091e" strokeWidth="2" strokeLinecap="round" />
          <path d="M150 50L165 65M145 42L140 37" stroke="#11091e" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
      
    default:
      // Fallback illustration: Runic celestial wheel
      return (
        <svg {...svgProps}>
          <circle cx="100" cy="110" r="40" stroke="#11091e" strokeWidth="3" />
          <circle cx="100" cy="110" r="28" fill="none" stroke="#c29d38" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M100 50V170M40 110H160M58 68L142 152M58 152L142 68" stroke="#11091e" strokeWidth="1.5" />
          <circle cx="100" cy="110" r="8" fill="#f4ecd8" stroke="#11091e" strokeWidth="2" />
        </svg>
      );
  }
};

export default function TarotCard({ title, price, description, items = [], isRitual = false, imageCardUrl }) {
  const whatsappUrl = `https://wa.me/5512991916776?text=Olá Bella, gostaria de agendar: ${title}`;
  const cardRef = useRef(null);
  
  // Dynamic 3D tilt styles reactive to mouse/touch cursor coordinates
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
    boxShadow: '0 15px 35px rgba(0,0,0,0.7)'
  });

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinates (-0.5 to 0.5)
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    
    const maxTilt = 15; // Maximum tilt angle in degrees
    const rX = -y * maxTilt;
    const rY = x * maxTilt;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale(1.04)`,
      boxShadow: `${-x * 25}px ${-y * 25}px 35px rgba(184, 102, 255, 0.25), 0 20px 45px rgba(0,0,0,0.85)`
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
      boxShadow: '0 15px 35px rgba(0,0,0,0.7)'
    });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="tarot-card-3d parchment-panel medieval-ink-border reveal"
      style={tiltStyle}
    >
      <div className="card-top">
        <span className="card-type font-vintage">{isRitual ? 'Preito Ritual' : 'Arcano Oráculo'}</span>
        <h3 className="card-title font-vintage">{title}</h3>
      </div>
      
      {/* Dynamic Medieval Woodblock SVG Graphic */}
      <div className="card-illustration-frame">
        <div className="inner-illustration-border">
          <TarotWoodcutIllustration title={title} />
        </div>
      </div>
      
      <div className="card-content">
        <p className="card-description">{description}</p>
        <ul className="card-items">
          {items.map((item, idx) => (
            <li key={idx} className="perk-bullet">
              <span className="star">✦</span> {item}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="card-footer">
        <a 
          href={whatsappUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className="cta-game primary card-button"
        >
          <span className="btn-shine"></span>
          <span className="btn-inner">{isRitual ? 'Invoque este Rito ☾' : 'Agendar Consulta ☾'}</span>
        </a>
      </div>
      
      <style jsx>{`
        .tarot-card-3d {
          width: 320px;
          height: 500px;
          padding: 1.8rem 1.4rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 4px;
          transition: transform 0.1s ease-out, box-shadow 0.1s ease-out;
          position: relative;
        }
        
        .card-top {
          text-align: center;
        }
        
        .card-type {
          font-size: 0.8rem;
          color: var(--accent-gold);
          letter-spacing: 1px;
          display: block;
          text-transform: uppercase;
        }
        
        .card-title {
          font-size: 1.5rem;
          margin: 0.2rem 0;
          line-height: 1.1;
          color: var(--text-ink);
          min-height: 2.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-illustration-frame {
          padding: 4px;
          border: 1px dashed rgba(17, 9, 30, 0.25);
          margin: 0.5rem 0;
        }

        .inner-illustration-border {
          border: 1.5px solid var(--text-ink);
          padding: 8px 4px;
          background: var(--bg-parchment-dark);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .card-description {
          font-size: 0.8rem;
          text-align: center;
          margin-bottom: 0.8rem;
          font-style: italic;
          color: var(--text-ink);
          line-height: 1.4;
          font-weight: 400;
          opacity: 0.85;
        }
        
        .card-items {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        
        .perk-bullet {
          font-size: 0.75rem;
          color: var(--text-ink-muted);
          display: flex;
          align-items: center;
          gap: 0.4rem;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .perk-bullet .star {
          color: var(--accent-gold);
          font-size: 6px;
        }

        .card-footer {
          margin-top: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.8rem;
          border-top: 1px dashed rgba(17, 9, 30, 0.2);
          padding-top: 0.8rem;
        }

        .price-tag {
          font-size: 1.4rem;
          color: var(--text-ink);
          line-height: 1;
          text-shadow: none;
        }
        
        .card-button {
          padding: 0.6rem 1rem !important;
          min-width: 0 !important;
          flex: 1;
          border: 1px solid var(--text-ink) !important;
          background: var(--text-ink) !important;
          color: var(--bg-parchment) !important;
          box-shadow: none !important;
        }

        .card-button::before {
          display: none;
        }

        .card-button:hover {
          background: var(--bg-parchment-dark) !important;
          color: var(--text-ink) !important;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </div>
  );
}
