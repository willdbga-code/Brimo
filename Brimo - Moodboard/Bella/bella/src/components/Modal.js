import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "BANIR DEFINITIVAMENTE" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
        <div className="modal-inner">
          <span className="ritual-symbol">◈</span>
          <h3 className="gothic-title gold-glow">{title}</h3>
          <p className="modal-message">{message}</p>
          
          <div className="modal-actions">
            <button className="cancel-btn" onClick={onClose}>RETORNAR AO CÍRCULO</button>
            <button className="confirm-btn" onClick={onConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
          z-index: 11000;
          padding: 2rem;
          animation: fadeIn 0.5s ease forwards;
        }
        
        .modal-content {
          max-width: 550px;
          width: 100%;
          background: rgba(10, 10, 10, 0.95);
          border: 1px solid rgba(209, 213, 219, 0.1);
          position: relative;
          overflow: hidden;
          animation: modalScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .modal-inner {
          padding: 4rem 3rem;
          border: 1px solid rgba(255, 215, 0, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .ritual-symbol {
          font-size: 2rem;
          color: var(--accent-silver-muted);
          margin-bottom: 2rem;
          display: block;
          opacity: 0.5;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modalScale {
          from { opacity: 0; transform: scale(0.85) translateY(30px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        h3 { font-size: 2rem; margin-bottom: 1.5rem; letter-spacing: 0.05em; }
        .modal-message { 
          color: var(--text-secondary); 
          margin-bottom: 4rem; 
          line-height: 1.8; 
          font-size: 1rem; 
          font-family: inherit;
          max-width: 400px;
        }
        
        .modal-actions { 
          display: flex; 
          flex-direction: column;
          gap: 1.5rem; 
          width: 100%;
        }
        
        .cancel-btn, .confirm-btn {
          width: 100%;
          padding: 1.2rem;
          font-family: var(--font-gothic);
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }
        
        .cancel-btn { 
          background: transparent; 
          border-color: rgba(209, 213, 219, 0.2); 
          color: var(--text-secondary); 
        }
        .cancel-btn:hover { 
          border-color: var(--accent-silver); 
          color: var(--accent-silver); 
          letter-spacing: 0.3em;
        }
        
        .confirm-btn { 
          background: rgba(255, 68, 68, 0.1); 
          border-color: rgba(255, 68, 68, 0.4); 
          color: #ff4444; 
        }
        .confirm-btn:hover { 
          background: #ff4444; 
          color: #000; 
          border-color: #ff4444;
          box-shadow: 0 0 30px rgba(255, 68, 68, 0.3);
        }

        @media (max-width: 600px) {
          .modal-inner { padding: 3rem 1.5rem; }
          h3 { font-size: 1.5rem; }
          .modal-message { font-size: 0.9rem; }
        }
      `}</style>
    </div>
  );
};

export default Modal;
