import { useState } from "react";
import Layout from "../components/Layout";
import { auth, db } from "../lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/dashboard");
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        // Criar perfil no Firestore com status 'pending'
        await setDoc(doc(db, "users", res.user.uid), {
          name,
          email,
          createdAt: new Date().toISOString(),
          status: 'pending',
          role: 'client',
          hasCompletedTriage: false
        });
        setIsLogin(true);
        setError("Sua inscrição foi enviada às sombras. Bella validará seu acesso em breve.");
      }
    } catch (err) {
      console.error("Erro detalhado de autenticação:", err);
      setError(`Erro no ritual: ${err.message || err.code || "Verifique suas credenciais."}`);
    }
  };

  return (
    <Layout title={isLogin ? "Portal | Bella Bruxa" : "Inscrição | Bella Bruxa"}>
      <div className="login-page section">
        <div className="container">
          <div className="login-card gothic-panel gothic-corners reveal active">
            <span className="vintage-text gold-pulse-text">
              {isLogin ? "Círculo Interno" : "Novo Destino"}
            </span>
            <h2 className="gothic-title card-header-title">{isLogin ? "Identidade" : "Inscrição"}</h2>
            
            <form onSubmit={handleAuth} className="login-form">
              {!isLogin && (
                <div className="input-group">
                  <label className="input-label">Como devemos te chamar?</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Seu nome"
                    className="gothic-input"
                    required 
                  />
                </div>
              )}
              
              <div className="input-group">
                <label className="input-label">Email das Sombras</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="seu@ritual.com"
                  className="gothic-input"
                  required 
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Chave do Oráculo</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  className="gothic-input"
                  required 
                />
              </div>
              
              {error && <p className={`msg ${error.includes('enviada') ? 'success-msg' : 'error-msg'}`}>{error}</p>}
              
              <button type="submit" className="cta-game primary login-submit-btn">
                <span className="btn-shine"></span>
                <span className="btn-inner">{isLogin ? "ENTRAR ☾" : "SOLICITAR ACESSO ✦"}</span>
              </button>
            </form>
            
            <p className="login-info">
              {isLogin ? (
                <>Não possui uma chave? <span onClick={() => setIsLogin(false)}>Inscreva-se aqui.</span></>
              ) : (
                <>Já faz parte do círculo? <span onClick={() => setIsLogin(true)}>Entre aqui.</span></>
              )}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle, var(--bg-secondary) 0%, var(--bg-primary) 100%);
          padding-top: 100px;
        }
        
        .login-card {
          max-width: 480px;
          margin: 0 auto;
          padding: 4rem 3rem;
          text-align: center;
          background: rgba(8, 3, 15, 0.95);
          border-color: var(--border-gold);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.95), 0 0 35px var(--accent-purple-glow);
        }
        
        .card-header-title {
          font-size: 2.8rem;
          margin-bottom: 2.5rem;
          letter-spacing: 2px;
        }
        
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.8rem;
          text-align: left;
        }
        
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        
        .input-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15rem;
          color: var(--text-lavender);
          font-weight: 500;
        }
        
        .gothic-input {
          padding: 1rem 1.2rem;
          background: #08030e;
          border: 1px solid var(--border-gold);
          color: var(--text-primary);
          font-family: var(--font-editorial);
          transition: var(--transition-fast);
          font-size: 0.9rem;
          border-radius: 4px;
        }
        
        .gothic-input:focus {
          outline: none;
          border-color: var(--accent-purple-bright);
          box-shadow: 0 0 12px rgba(184, 102, 255, 0.4);
          background: #0d0617;
        }
        
        .error-msg {
          color: #ff5e57;
          font-size: 0.85rem;
          text-align: center;
          line-height: 1.4;
          font-weight: 400;
          letter-spacing: 0.5px;
        }

        .success-msg {
          color: var(--accent-gold-bright);
          font-size: 0.85rem;
          text-align: center;
          font-style: italic;
          line-height: 1.4;
        }
        
        .login-submit-btn {
          width: 100%;
          margin-top: 0.8rem;
          padding: 1.1rem !important;
          min-width: 0 !important;
        }
        
        .login-info {
          margin-top: 3rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
          letter-spacing: 0.5px;
        }

        .login-info span {
          color: var(--accent-gold);
          cursor: pointer;
          text-decoration: underline;
          transition: var(--transition-fast);
        }

        .login-info span:hover {
          color: var(--accent-gold-bright);
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
        }

        @media (max-width: 600px) {
          .login-card {
            padding: 3rem 1.5rem;
            margin: 1rem;
          }
          .card-header-title {
            font-size: 2.2rem;
            margin-bottom: 2rem;
          }
          .login-form {
            gap: 1.5rem;
          }
        }
      `}</style>
    </Layout>
  );
}
