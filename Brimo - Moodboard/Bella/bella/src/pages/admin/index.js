import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Modal from "../../components/Modal";
import { ADMIN_EMAIL_LEGACY } from "../../lib/constants";

export default function AdminDashboard() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [inviteLink, setInviteLink] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      
      // Verificar se o usuário é admin via e-mail (legado) ou cargo (novo)
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

    return () => {
      if (typeof unsubscribeAuth === 'function') unsubscribeAuth();
    };
  }, [router]);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchClients = async () => {
      try {
        const q = query(collection(db, "users"));
        const snapshot = await getDocs(q);
        const clientList = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(client => client.role !== 'admin');
        setClients(clientList);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar feed do admin:", err);
        setLoading(false);
      }
    };

    fetchClients();
  }, [isAdmin]);

  const toggleApproval = async (clientId, currentStatus) => {
    const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
    await updateDoc(doc(db, "users", clientId), { status: newStatus });
  };
  
  const deleteRegistration = (clientId, clientName) => {
    setSelectedClient({ id: clientId, name: clientName });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedClient) return;
    try {
      await deleteDoc(doc(db, "users", selectedClient.id));
      setIsModalOpen(false);
      setSelectedClient(null);
    } catch (err) {
      console.error("Erro ao apagar registro:", err);
      alert("As sombras resistiram à sua ordem. Tente novamente.");
    }
  };

  if (!isAdmin && !loading) return null; // Proteção adicional
  if (loading) return <div className="loading-dark">Consultando as Sombras...</div>;

  const generateInvite = async () => {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const inviteRef = doc(db, "admin_invites", token);
    await setDoc(inviteRef, {
      used: false,
      createdAt: new Date().toISOString()
    });
    setInviteLink(`${window.location.origin}/admin/invite/${token}`);
  };

  return (
    <Layout title="O Trono | Painel Admin">
      <div className="admin-page section">
        <div className="container">
          <header className="admin-header reveal">
            <h1 className="gothic-title gold-glow">O TRONO</h1>
            <p className="subtitle">Gestão de Almas & Rituais — CRM Bella Bruxa</p>
            
            <div className="invite-section">
              {!inviteLink ? (
                <button onClick={generateInvite} className="invite-gen-btn">
                  Gerar Convite para Novo Admin ◈
                </button>
              ) : (
                <div className="invite-box">
                  <p className="invite-label">Link de Convite Gerado (Uso Único):</p>
                  <code className="invite-url">{inviteLink}</code>
                  <button className="copy-btn" onClick={() => {
                    navigator.clipboard.writeText(inviteLink);
                    alert("Elo de convite copiado!");
                  }}>Copiar Link</button>
                </div>
              )}
            </div>
          </header>

          <div className="admin-feed">
            {clients.map((client) => (
              <div key={client.id} className={`client-card glass reveal ${client.status}`}>
                <div className="card-header">
                  <div className="client-avatar">
                    <span className="initial">{client.name?.charAt(0) || "I"}</span>
                  </div>
                  <div className="client-info">
                    <h4 className="gothic-title">{client.name}</h4>
                    <p className="email">{client.email}</p>
                  </div>
                  <div className={`status-badge ${client.status}`}>
                    {client.status === 'approved' ? '✓ Ativa' : '⏳ Pendente'}
                  </div>
                </div>

                <div className="card-body">
                  <div className="stat-item">
                    <span>Triagem:</span>
                    <strong className={client.hasCompletedTriage ? "done" : "todo"}>
                      {client.hasCompletedTriage ? "Concluída" : "Pendente"}
                    </strong>
                  </div>
                  <div className="stat-item">
                    <span>Foco:</span>
                    <strong>{client.triage?.focus || "Não definido"}</strong>
                  </div>
                </div>

                <div className="card-actions">
                  <button 
                    className={`approve-btn ${client.status === 'approved' ? 'revoke' : ''}`}
                    onClick={() => toggleApproval(client.id, client.status)}
                  >
                    {client.status === 'approved' ? "Revogar Acesso" : "Conceder Acesso"}
                  </button>
                  <button className="view-btn" onClick={() => router.push(`/admin/client/${client.id}`)}>
                    Ver Detalhes
                  </button>
                  <button className="delete-btn" onClick={() => deleteRegistration(client.id, client.name)}>
                    Banir Registro
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Modal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
          title="BANIMENTO RITUALÍSTICO"
          message={`Tem certeza que deseja banir "${selectedClient?.name}" e apagar todos os seus registros das sombras para sempre? Esta ação é irreversível.`}
        />
      </div>

      <style jsx>{`
        .admin-page { min-height: 100vh; padding-top: 10rem; background: #050505; }
        .admin-header { text-align: center; margin-bottom: 5rem; }
        .subtitle { color: var(--text-secondary); letter-spacing: 0.2em; text-transform: uppercase; font-size: 0.8rem; }
        
        .admin-feed {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .client-card {
          padding: 2rem;
          border: 1px solid var(--border-color);
          background: rgba(15, 15, 15, 0.8);
          transition: all 0.3s ease;
        }

        .client-card.pending { border-left: 4px solid #ffaa00; }
        .client-card.approved { border-left: 4px solid var(--accent-silver); }

        .card-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; position: relative; }
        
        .client-avatar {
          width: 50px; height: 50px;
          background: var(--bg-secondary);
          border: 1px solid var(--accent-silver-muted);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        
        .initial { font-family: var(--font-gothic); color: var(--accent-silver); font-size: 1.5rem; }
        
        .client-info h4 { font-size: 1.2rem; }
        .email { font-size: 0.8rem; color: var(--text-secondary); }
        
        .status-badge {
          position: absolute; top: 0; right: 0;
          font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em;
          padding: 0.2rem 0.5rem; border-radius: 3px;
        }
        .status-badge.approved { color: var(--accent-silver); background: rgba(209,213,219,0.1); }
        .status-badge.pending { color: #ffaa00; background: rgba(255,170,0,0.1); }

        .card-body { margin-bottom: 2rem; padding: 1rem 0; border-top: 1px solid rgba(255,255,255,0.05); }
        .stat-item { display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.5rem; }
        .stat-item span { color: var(--text-secondary); }
        .stat-item strong.done { color: #00ff88; }
        .stat-item strong.todo { color: #ff4444; }

        .card-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        
        .approve-btn, .view-btn {
          padding: 0.8rem; font-family: var(--font-gothic); font-size: 0.7rem; cursor: pointer;
          transition: all 0.2s ease; border: 1px solid transparent;
        }
        
        .approve-btn { background: var(--accent-silver); color: var(--text-dark); }
        .approve-btn.revoke { background: transparent; border-color: #ff4444; color: #ff4444; }
        
        .view-btn { background: transparent; border-color: var(--border-color); color: var(--text-primary); }
        .view-btn:hover { border-color: var(--accent-silver); }

        .invite-section { margin-top: 3rem; display: flex; justify-content: center; }
        .invite-gen-btn { background: transparent; border: 1px solid var(--accent-silver-muted); color: var(--accent-silver); padding: 0.8rem 2rem; cursor: pointer; font-family: var(--font-gothic); font-size: 0.7rem; transition: all 0.3s ease; }
        .invite-gen-btn:hover { border-color: var(--accent-silver); background: rgba(209,213,219,0.05); }
        
        .invite-box { background: rgba(20, 20, 20, 0.9); padding: 1.5rem; border: 1px solid var(--accent-silver-muted); max-width: 500px; width: 100%; }
        .invite-label { font-size: 0.6rem; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 0.5rem; }
        .invite-url { display: block; background: #000; padding: 0.8rem; font-size: 0.7rem; color: var(--accent-silver); margin-bottom: 1rem; border: 1px solid #222; overflow-x: auto; }
        .copy-btn { width: 100%; padding: 0.6rem; background: var(--accent-silver); color: var(--text-dark); border: none; font-family: var(--font-gothic); font-size: 0.7rem; cursor: pointer; }

        .delete-btn {
          grid-column: span 2;
          background: rgba(255, 68, 68, 0.05);
          border: 1px solid rgba(255, 68, 68, 0.2);
          color: #ff4444;
          padding: 0.6rem;
          font-family: var(--font-gothic);
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 0.5rem;
        }
        .delete-btn:hover {
          background: #ff4444;
          color: var(--text-dark);
        }

        @media (max-width: 600px) {
          .admin-feed { grid-template-columns: 1fr; }
        }
      `}</style>
    </Layout>
  );
}
