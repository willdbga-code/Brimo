import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { auth, db } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function AdminInvite() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("validating"); // validating, login_required, success, invalid, error
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (!token) return;

    const validateInvite = async () => {
      try {
        const inviteRef = doc(db, "admin_invites", token);
        const inviteSnap = await getDoc(inviteRef);

        if (!inviteSnap.exists() || inviteSnap.data().used) {
          setStatus("invalid");
          setLoading(false);
          return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (!user) {
            setStatus("login_required");
            setLoading(false);
            return;
          }

          // Tentar resgatar o cargo apenas se estiver logado
          try {
            await updateDoc(doc(db, "users", user.uid), { role: 'admin' });
            await updateDoc(inviteRef, { 
              used: true, 
              usedBy: user.email, 
              usedAt: new Date().toISOString() 
            });
            
            setStatus("success");
            setLoading(false);
            
            // Redirecionar após 3 segundos
            setTimeout(() => router.push("/admin"), 3000);
          } catch (e) {
            console.error("Erro ao atualizar cargo:", e);
            setStatus("error");
            setLoading(false);
          }
        });

        return () => unsubscribe();
      } catch (err) {
        console.error("Erro na validação:", err);
        setStatus("error");
        setLoading(false);
      }
    };

    validateInvite();
  }, [token, router]);

  return (
    <Layout title="Convite do Trono | Bella Bruxa">
      <div className="invite-page section">
        <div className="container glass reveal">
          <span className="vintage-text gold-glow">Ritual de Sucessão</span>
          
          {status === "validating" && (
            <div className="loading-msg">Consultando as sombras...</div>
          )}

          {status === "login_required" && (
            <>
              <h2 className="gothic-title">Identidade Necessária</h2>
              <p>Você precisa estar logado no portal para reivindicar este cargo.</p>
              <button onClick={() => router.push("/login")} className="cta-btn">ENTRAR</button>
            </>
          )}

          {status === "success" && (
            <>
              <h2 className="gothic-title gold-glow">O Trono é Seu</h2>
              <p>O ritual foi concluído. Você agora faz parte do Círculo Interno como Mestra.</p>
              <p className="redirect-hint">Redirecionando para o painel administrativo...</p>
            </>
          )}

          {status === "invalid" && (
            <>
              <h2 className="gothic-title">Elo Quebrado</h2>
              <p>Este convite é inválido ou já foi utilizado por outra alma.</p>
              <button onClick={() => router.push("/")} className="cta-btn">VOLTAR AO INÍCIO</button>
            </>
          )}

          {status === "error" && (
            <>
              <h2 className="gothic-title">Erro no Ritual</h2>
              <p>Houve uma interferência nas energias. Tente novamente mais tarde.</p>
              <button onClick={() => router.push("/")} className="cta-btn">VOLTAR AO INÍCIO</button>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .invite-page { 
          min-height: 100vh; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          padding: 2rem;
          background: var(--bg-primary);
        }
        .container { 
          padding: 5rem 3rem; 
          max-width: 600px; 
          width: 100%;
          border: 1px solid var(--border-color); 
          text-align: center;
          background: rgba(10, 10, 10, 0.8);
        }
        h2 { font-size: 2.8rem; margin: 2rem 0; }
        p { color: var(--text-secondary); margin-bottom: 3rem; line-height: 1.6; }
        
        .cta-btn { 
          background: var(--accent-silver); 
          color: var(--text-dark); 
          border: none; 
          padding: 1.2rem 2.5rem; 
          cursor: pointer; 
          font-family: var(--font-gothic);
          letter-spacing: 0.1em;
          transition: all 0.3s ease;
        }
        .cta-btn:hover { background: #fff; transform: translateY(-2px); }
        
        .loading-msg { margin-top: 2rem; font-style: italic; color: var(--text-secondary); }
        .redirect-hint { font-size: 0.8rem; font-style: italic; opacity: 0.6; }

        @media (max-width: 600px) {
          .container { padding: 3rem 1.5rem; }
          h2 { font-size: 2rem; }
        }
      `}</style>
    </Layout>
  );
}
