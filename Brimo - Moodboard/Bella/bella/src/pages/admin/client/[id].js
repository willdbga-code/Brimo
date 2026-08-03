import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { auth, db } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Chat from "../../../components/Chat";
import { ADMIN_EMAIL_LEGACY } from "../../../lib/constants";

export default function ClientDetail() {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        if (user.email === ADMIN_EMAIL_LEGACY || userData?.role === 'admin') {
          setIsAdmin(true);
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Erro ao verificar cargo no Firestore:", err);
        // Fallback robusto para o administrador legado
        if (user.email === ADMIN_EMAIL_LEGACY) {
          setIsAdmin(true);
        } else {
          router.push("/dashboard");
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!isAdmin || !id) return;

    const fetchClient = async () => {
      try {
        const docSnap = await getDoc(doc(db, "users", id));
        if (docSnap.exists()) {
          setClient({ id: docSnap.id, ...docSnap.data() });
        }
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar cliente:", err);
      }
    };
    fetchClient();
  }, [id, isAdmin]);

  const deleteRegistration = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "users", client.id));
      setIsDeleteModalOpen(false);
      router.push("/admin");
    } catch (err) {
      console.error("Erro ao apagar registro:", err);
      alert("As sombras resistiram à sua ordem. Tente novamente.");
    }
  };

  if (!isAdmin && !loading) return null;
  if (loading) return <div className="loading-dark">Invocando Perfil...</div>;
  if (!client) return <div className="loading-dark">Cliente não encontrada nas sombras.</div>;

  return (
    <Layout title={`CRM | ${client.name}`}>
      <div className="admin-detail-page section">
        <div className="container">
          <header className="detail-header reveal">
            <button onClick={() => router.push("/admin")} className="back-btn">← Voltar</button>
            <div className="client-main-info">
              <h1 className="gothic-title">{client.name}</h1>
              <p className="email">{client.email} • Status: <strong>{client.status?.toUpperCase()}</strong></p>
            </div>
          </header>

          <div className="detail-grid">
            {/* Coluna 1: CRM & Triagem */}
            <div className="crm-panel glass reveal">
              <h3 className="section-title gothic-title">Triagem Espiritual</h3>
              <div className="triage-results">
                <div className="result-item">
                  <label>Foco Principal:</label>
                  <p>{client.triage?.focus || "Não informado"}</p>
                </div>
                <div className="result-item">
                  <label>Energia & Bloqueios:</label>
                  <p>{client.triage?.drained || "Nenhum comentário"}</p>
                </div>
                <div className="result-item">
                  <label>Histórico com o Invisível:</label>
                  <p>{client.triage?.history || "Sem registros anteriores"}</p>
                </div>
                <div className="result-item">
                  <label>Desejo Sagrado (Mudança):</label>
                  <p>{client.triage?.change || "Não declarado"}</p>
                </div>
                <div className="result-item">
                  <label>Compromisso:</label>
                  <p>{client.triage?.ready ? "✓ Declarou-se pronta" : "✗ Ainda em hesitação"}</p>
                </div>
              </div>

              <div className="client-actions-box">
                <button 
                  className="cta-approve" 
                  onClick={() => updateDoc(doc(db, "users", client.id), { status: 'approved' })}
                >
                  Confirmar Aprovação
                </button>
                <button 
                  className="cta-delete" 
                  onClick={deleteRegistration}
                >
                  Banir do Círculo
                </button>
              </div>
            </div>

            {/* Coluna NOVA: Estatísticas de Prática no Admin */}
            <div className="crm-panel glass reveal" style={{ animationDelay: '0.1s' }}>
              <h3 className="section-title gothic-title">Progresso da Alma</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Rituais</span>
                  <span className="stat-value gold-glow">{client.practices?.rituais || 0}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Oráculos</span>
                  <span className="stat-value gold-glow">{client.practices?.tarot || 0}</span>
                </div>
              </div>
            </div>

            {/* Coluna 2: Chat Privado */}
            <div className="chat-panel glass reveal" style={{ animationDelay: '0.2s' }}>
              <div className="section-header-flex">
                <h3 className="section-title gothic-title">O Oráculo</h3>
                <button className="mobile-chat-btn" onClick={() => setIsChatOpen(true)}>ABRIR CHAT</button>
              </div>
              
              <div className={`chat-container-wrapper ${isChatOpen ? 'mobile-visible' : ''}`}>
                <Chat 
                  chatId={client.id} 
                  senderId="admin" 
                  senderName="Bella Bruxa" 
                  onClose={() => setIsChatOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>

        <Modal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="BANIMENTO DEFINITIVO"
          message={`Tem certeza que deseja banir "${client?.name}"? Esta ação removerá sua presença das sombras e todos os registros associados permanentemente.`}
        />
      </div>

      <style jsx>{`
        .admin-detail-page { min-height: 100vh; padding-top: 8rem; background: #050505; }
        .detail-header { display: flex; align-items: flex-start; gap: 3rem; margin-bottom: 4rem; }
        .back-btn { background: transparent; border: 1px solid var(--border-color); color: var(--text-secondary); padding: 0.5rem 1rem; cursor: pointer; }
        .client-main-info h1 { font-size: 3rem; margin-bottom: 0.5rem; }
        
        .detail-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 3rem; align-items: flex-start; }
        
        .crm-panel, .chat-panel { padding: 3rem; background: rgba(15, 15, 15, 0.8); border: 1px solid var(--border-color); }
        .section-title { font-size: 1.5rem; margin-bottom: 3rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; flex: 1; }
        
        .section-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
        .mobile-chat-btn { display: none; background: var(--accent-silver); color: var(--text-dark); border: none; padding: 0.8rem 1.5rem; font-family: var(--font-gothic); font-size: 0.7rem; cursor: pointer; }

        .triage-results { display: flex; flex-direction: column; gap: 2rem; }
        .result-item label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent-silver-muted); margin-bottom: 0.5rem; }
        .result-item p { font-size: 1.1rem; line-height: 1.6; color: var(--text-primary); font-style: italic; }
        
        .client-actions-box { margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 1rem; }
        .cta-approve { width: 100%; padding: 1.2rem; background: var(--accent-silver); color: var(--text-dark); font-family: var(--font-gothic); border: none; cursor: pointer; transition: all 0.2s ease; }
        .cta-approve:hover { background: #fff; }
        
        .cta-delete { width: 100%; padding: 1rem; background: transparent; border: 1px solid rgba(255, 68, 68, 0.3); color: #ff4444; font-family: var(--font-gothic); font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease; }
        .cta-delete:hover { background: #ff4444; color: var(--text-dark); border-color: #ff4444; }
        
        @media (max-width: 1000px) {
          .admin-detail-page { padding-top: 6rem; }
          .detail-header { flex-direction: column; gap: 2rem; }
          .client-main-info h1 { font-size: 2rem; }
          .detail-grid { grid-template-columns: 1fr; }
          .crm-panel, .chat-panel { padding: 2rem 1.5rem; }
          
          .mobile-chat-btn { display: block; }
          .chat-container-wrapper { display: none; }
          .chat-container-wrapper.mobile-visible { 
            display: block; 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100vh; 
            z-index: 9999; 
          }
        }
      `}</style>
    </Layout>
  );
}
