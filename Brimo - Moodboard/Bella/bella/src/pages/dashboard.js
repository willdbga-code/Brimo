import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Chat from "../components/Chat";
import TriageForm from "../components/TriageForm";

import { ADMIN_EMAIL_LEGACY } from "../lib/constants";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPracticesOpen, setIsPracticesOpen] = useState(true);
  const router = useRouter();

  const fetchUserData = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    } catch (err) {
      console.error("Erro ao carregar dados do usuário no Firestore:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserData(user.uid);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = () => signOut(auth).then(() => router.push("/"));

  const updatePracticeCount = async (type) => {
    if (!user) return;
    const currentCount = userData?.practices?.[type] || 0;
    const newCount = currentCount + 1;
    
    // Atualização otimista no estado local
    setUserData(prev => ({
      ...prev,
      practices: {
        ...(prev?.practices || {}),
        [type]: newCount
      }
    }));

    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        [`practices.${type}`]: newCount
      });
    } catch (err) {
      console.error("Erro ao registrar prática:", err);
      // Reverter se falhar (opcional)
    }
  };

  if (loading) return <div className="loading-dark">Invocando Dados...</div>;

  // ESTADO 1: ACESSO PENDENTE
  const isAdmin = user?.email === ADMIN_EMAIL_LEGACY || userData?.role === 'admin';

  if (userData?.status === 'pending' && !isAdmin) {
    return (
      <Layout title="Aguardando Validação | Bella Bruxa">
        <div className="status-page section">
          <div className="container glass reveal">
            <span className="vintage-text">Ritual em Andamento</span>
            <h2 className="gothic-title">Acesso sob Validação</h2>
            <p>Seu registro foi enviado às sombras. Bella Bruxa validará seu acesso em breve.</p>
            <p className="hint">Você receberá uma confirmação assim que o portal for aberto para você.</p>
            <button onClick={handleSignOut} className="signout-btn">Voltar ao Início</button>
          </div>
        </div>
        <style jsx>{`
          .status-page { height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 2rem; }
          .container { padding: 4rem 2rem; max-width: 600px; border: 1px solid var(--border-color); }
          h2 { font-size: 2.5rem; margin: 1.5rem 0; }
          p { color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6; }
          .hint { font-size: 0.8rem; font-style: italic; opacity: 0.6; }
          .signout-btn { margin-top: 2rem; background: transparent; border: 1px solid var(--accent-silver); color: var(--accent-silver); padding: 1rem 2rem; cursor: pointer; }
          @media (max-width: 600px) { h2 { font-size: 1.8rem; } .container { padding: 2rem 1rem; } }
        `}</style>
      </Layout>
    );
  }

  // ESTADO 2: TRIAGEM PENDENTE
  if (!userData?.hasCompletedTriage && !isAdmin) {
    return (
      <Layout title="Triagem Espiritual | Bella Bruxa">
        <div className="triage-page section">
          <div className="container">
            <div className="triage-intro reveal">
              <span className="vintage-text">O Primeiro Passo</span>
              <h2 className="gothic-title">Conexão Inicial</h2>
              <p>Antes de abrirmos o oráculo, precisamos entender as sombras que te cercam.</p>
            </div>
            <TriageForm userId={user.uid} onComplete={() => fetchUserData(user.uid)} />
          </div>
        </div>
        <style jsx>{`
          .triage-page { min-height: 100vh; padding: 10rem 2rem; background: var(--bg-primary); }
          .triage-intro { text-align: center; margin-bottom: 5rem; }
          h2 { font-size: 3rem; margin: 1rem 0; }
          p { color: var(--text-secondary); }
          @media (max-width: 600px) { .triage-page { padding-top: 6rem; } h2 { font-size: 2rem; } }
        `}</style>
      </Layout>
    );
  }

  // ESTADO 3: DASHBOARD COMPLETO (APROVADO E TRIADO)
  return (
    <Layout title="Meu Dashboard | Bella Bruxa">
      <div className="dashboard-page section">
        <div className="container">
          <header className="dashboard-header reveal">
            <div className="user-info">
              <span className="vintage-text">Bem-vinda, {isAdmin ? "Mestra" : "Irmã"}</span>
              <h1 className="gothic-title gold-glow">{userData?.name || "Iniciada"}</h1>
            </div>
            <div className="header-actions">
              {isAdmin && <a href="/admin" className="admin-link">Ir para o Trono</a>}
              <button onClick={handleSignOut} className="signout-btn">Sair</button>
            </div>
          </header>

          <div className="dashboard-grid">
            {/* Registro de Práticas - AGORA NO TOPO */}
            <section className="dashboard-section glass reveal">
              {isAdmin ? (
                <>
                  <h3 className="gothic-title section-title">Controle de Arquivos (Admin)</h3>
                  <div className="data-list">
                    {userData?.files?.length > 0 ? (
                      userData.files.map((file, i) => (
                        <div key={i} className="data-item">
                          <span className="icon">◈</span>
                          <a href={file.url} target="_blank" rel="noreferrer">{file.name}</a>
                        </div>
                      ))
                    ) : (
                      <p className="empty-msg">Nenhum registro encontrado nas sombras.</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="section-header-flex" onClick={() => setIsPracticesOpen(!isPracticesOpen)} style={{ cursor: 'pointer' }}>
                    <h3 className="gothic-title section-title">Diário de Práticas</h3>
                    <span className={`collapse-icon ${isPracticesOpen ? 'open' : ''}`}>▼</span>
                  </div>
                  
                  <div className={`practices-collapsible ${isPracticesOpen ? 'expanded' : 'collapsed'}`}>
                    <p className="section-desc">Registre sua evolução espiritual no portal.</p>
                    
                    <div className="practices-container">
                      <div className="practice-card">
                        <span className="practice-label">Rituais Realizados</span>
                        <div className="counter-box">
                          <span className="count-value gold-glow">{userData?.practices?.rituais || 0}</span>
                          <button className="increment-btn" onClick={(e) => { e.stopPropagation(); updatePracticeCount('rituais'); }}>
                            <span>◈</span> INVOCAR
                          </button>
                        </div>
                      </div>

                      <div className="practice-card">
                        <span className="practice-label">Oráculos Consultados</span>
                        <div className="counter-box">
                          <span className="count-value gold-glow">{userData?.practices?.tarot || 0}</span>
                          <button className="increment-btn" onClick={(e) => { e.stopPropagation(); updatePracticeCount('tarot'); }}>
                            <span>◈</span> CONSULTAR
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </section>

            {/* Chat do Oráculo */}
            <section className="dashboard-section glass reveal" style={{ animationDelay: '0.2s' }}>
              <div className="section-header-flex">
                <h3 className="gothic-title section-title">Mensagens do Oráculo</h3>
                <button className="mobile-chat-btn" onClick={() => { setIsChatOpen(true); setIsPracticesOpen(false); }}>
                  VER MENSAGENS ◈
                </button>
              </div>
              
              <div className={`chat-container-wrapper ${isChatOpen ? 'mobile-visible' : ''}`}>
                <Chat 
                  chatId={user.uid} 
                  senderId={user.uid} 
                  senderName={userData?.name || "Irmã"} 
                  onClose={() => setIsChatOpen(false)}
                />
              </div>
            </section>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-page { min-height: 100vh; padding-top: 10rem; background: var(--bg-primary); }
        .dashboard-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 2rem; }
        .header-actions { display: flex; gap: 2rem; align-items: center; }
        .admin-link { color: var(--accent-silver); text-decoration: underline; font-family: var(--font-gothic); font-size: 0.8rem; }
        .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
        .dashboard-section { padding: 3rem; background: rgba(15, 15, 15, 0.5); }
        .section-title { font-size: 1.4rem; margin-bottom: 2rem; }
        .section-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        
        .mobile-chat-btn { display: none; background: var(--accent-silver); color: var(--text-dark); border: none; padding: 0.8rem 1.5rem; font-family: var(--font-gothic); font-size: 0.7rem; cursor: pointer; }
        
        .signout-btn { background: transparent; border: 1px solid var(--accent-silver-muted); color: var(--accent-silver-muted); padding: 0.5rem 1.5rem; cursor: pointer; transition: var(--transition-fast); }
        .signout-btn:hover { border-color: var(--accent-silver); color: var(--accent-silver); }
        
        .data-item { margin-bottom: 1rem; display: flex; align-items: center; gap: 1rem; }
        .data-item a { color: var(--accent-silver); text-decoration: underline; font-size: 0.9rem; }
        .empty-msg { color: var(--text-secondary); font-style: italic; font-size: 0.9rem; }

        .section-desc { font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 2rem; }
        
        .practices-container { display: flex; flex-direction: column; gap: 2rem; }
        .practice-card { background: rgba(255,255,255,0.02); padding: 1.5rem; border: 1px solid var(--border-color); }
        .practice-label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--accent-silver-muted); margin-bottom: 1rem; }
        .counter-box { display: flex; align-items: center; justify-content: space-between; }
        .count-value { font-size: 3rem; font-family: var(--font-gothic); color: var(--accent-silver); line-height: 1; }
        .increment-btn { background: transparent; border: 1px solid var(--accent-silver-muted); color: var(--accent-silver); padding: 0.6rem 1.2rem; cursor: pointer; font-family: var(--font-gothic); font-size: 0.7rem; transition: all 0.3s ease; }
        .increment-btn:hover { background: var(--accent-silver); color: var(--text-dark); border-color: var(--accent-silver); }

        /* Acordeão */
        .practices-collapsible {
          max-height: 0;
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
        }
        
        .practices-collapsible.expanded {
          max-height: 1000px;
          opacity: 1;
          margin-top: 2rem;
        }
        
        .collapse-icon {
          color: var(--accent-silver-muted);
          font-size: 0.8rem;
          transition: transform 0.3s ease;
        }
        
        .collapse-icon.open {
          transform: rotate(180deg);
        }

        @media (max-width: 900px) { 
          .dashboard-page { padding-top: 6rem; }
          .dashboard-header { flex-direction: column; align-items: flex-start; gap: 2rem; margin-bottom: 3rem; }
          .dashboard-grid { grid-template-columns: 1fr; gap: 2rem; }
          .dashboard-section { padding: 2rem 1.5rem; }
          .section-title { font-size: 1.2rem; margin-bottom: 0.5rem; }
          .section-desc { margin-bottom: 2rem; }
          
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
          
          .count-value { font-size: 2.5rem; }
        }
      `}</style>
    </Layout>
  );
}
