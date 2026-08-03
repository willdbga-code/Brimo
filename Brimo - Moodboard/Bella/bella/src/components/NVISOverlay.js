import React from 'react';

export default function NVISOverlay() {
  return (
    <>
      <div className="nvis-overlay"></div>
      <style jsx>{`
        .nvis-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 9998;
          mix-blend-mode: overlay;
          background: radial-gradient(circle at center, transparent 50%, rgba(15, 5, 26, 0.4) 100%);
        }

        .nvis-overlay::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          );
          opacity: 0.3;
          animation: scanline 10s linear infinite;
        }

        @keyframes scanline {
          0% { background-position: 0 0; }
          100% { background-position: 0 100vh; }
        }
      `}</style>
    </>
  );
}
