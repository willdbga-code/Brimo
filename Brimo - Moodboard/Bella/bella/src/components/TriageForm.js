import { useState } from "react";
import { db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function TriageForm({ userId, onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    focus: "",
    drained: "",
    history: "",
    change: "",
    ready: false
  });

  const handleNext = () => setStep(step + 1);
  
  const handleSubmit = async () => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        triage: formData,
        hasCompletedTriage: true
      });
      onComplete();
    } catch (err) {
      console.error("Erro ao salvar triagem:", err);
    }
  };

  return (
    <div className="triage-form glass reveal">
      <div className="triage-header">
        <span className="step-count gothic-title">Passo {step} de 5</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step/5)*100}%` }}></div>
        </div>
      </div>

      <div className="triage-steps">
        {step === 1 && (
          <div className="step">
            <h3>Onde as sombras estão mais densas hoje?</h3>
            <div className="options-grid">
              {["Amor e Magnetismo", "Caminhos Financeiros", "Proteção Espiritual", "Autoconhecimento"].map(opt => (
                <button 
                  key={opt}
                  className={formData.focus === opt ? "active" : ""}
                  onClick={() => { setFormData({...formData, focus: opt}); handleNext(); }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step">
            <h3>Você sente que sua energia está sendo "drenada" ou bloqueada?</h3>
            <textarea 
              placeholder="Descreva o que você sente (opcional)"
              value={formData.drained}
              onChange={(e) => setFormData({...formData, drained: e.target.value})}
            />
            <button className="cta-next" onClick={handleNext}>Continuar</button>
          </div>
        )}

        {step === 3 && (
          <div className="step">
            <h3>Qual o seu histórico com o invisível?</h3>
            <p className="hint">Já realizou rituais antes ou é sua primeira busca pelo oráculo?</p>
            <textarea 
              placeholder="Conte-me um pouco sobre sua jornada espiritual..."
              value={formData.history}
              onChange={(e) => setFormData({...formData, history: e.target.value})}
            />
            <button className="cta-next" onClick={handleNext}>Continuar</button>
          </div>
        )}

        {step === 4 && (
          <div className="step">
            <h3>Se você pudesse invocar uma única mudança agora, qual seria?</h3>
            <textarea 
              placeholder="Seu desejo mais profundo..."
              value={formData.change}
              onChange={(e) => setFormData({...formData, change: e.target.value})}
            />
            <button className="cta-next" onClick={handleNext}>Continuar</button>
          </div>
        )}

        {step === 5 && (
          <div className="step">
            <h3>Altar de Consagração...</h3>
            <p>Você está pronta para o que as cartas e os rituais revelarem?</p>
            <label className="checkbox-container gothic-title">
              ESTOU PRONTA
              <input 
                type="checkbox" 
                checked={formData.ready} 
                onChange={(e) => setFormData({...formData, ready: e.target.checked})} 
              />
              <span className="checkmark"></span>
            </label>
            <button 
              className="cta-complete" 
              disabled={!formData.ready}
              onClick={handleSubmit}
            >
              CONCLUIR TRIAGEM
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .triage-form {
          padding: 4rem;
          max-width: 600px;
          margin: 0 auto;
          background: rgba(10, 10, 10, 0.9);
          border: 1px solid var(--border-color);
        }
        
        .triage-header { margin-bottom: 3rem; }
        .step-count { font-size: 0.8rem; color: var(--accent-silver-muted); }
        
        .progress-bar {
          height: 2px;
          background: rgba(255,255,255,0.05);
          margin-top: 1rem;
        }
        
        .progress-fill {
          height: 100%;
          background: var(--accent-silver);
          transition: width 0.5s ease;
        }
        
        .step h3 { font-size: 1.8rem; margin-bottom: 2rem; }
        
        .options-grid {
          display: grid;
          gap: 1rem;
        }
        
        .options-grid button {
          padding: 1.5rem;
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          cursor: pointer;
          transition: var(--transition-fast);
          font-family: var(--font-editorial);
        }
        
        .options-grid button:hover, .options-grid button.active {
          border-color: var(--accent-silver);
          background: rgba(209, 213, 219, 0.05);
        }
        
        textarea {
          width: 100%;
          height: 150px;
          background: #050505;
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 1rem;
          margin-bottom: 2rem;
          font-family: var(--font-editorial);
        }
        
        .cta-next, .cta-complete {
          width: 100%;
          padding: 1.2rem;
          background: var(--accent-silver);
          color: var(--text-dark);
          font-family: var(--font-gothic);
          letter-spacing: 0.2em;
          border: none;
          cursor: pointer;
        }
        
        .cta-complete:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        
        .checkbox-container {
          display: block;
          position: relative;
          padding-left: 35px;
          margin: 3rem 0;
          cursor: pointer;
          font-size: 1.2rem;
          color: var(--accent-silver);
        }
        
        .hint { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem; }
      `}</style>
    </div>
  );
}
