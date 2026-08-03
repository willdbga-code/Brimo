import { useEffect, useState, useRef } from "react";
import { db } from "../lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";

export default function Chat({ chatId, senderId, senderName, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }, (err) => {
      console.error("Erro no canal do chat do oráculo:", err);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const msg = input;
    setInput("");

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: msg,
      senderId,
      senderName,
      timestamp: serverTimestamp()
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-avatar">◈</div>
        <div className="chat-info">
          <span className="chat-name gothic-title">{senderId === 'admin' ? senderName : "Bella Bruxa"}</span>
          <span className="chat-status">{senderId === 'admin' ? "Membro do Portal" : "Mestra do Círculo"}</span>
        </div>
        {onClose && (
          <button className="chat-close" onClick={onClose}>✕</button>
        )}
      </div>

      <div className="messages-area">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.senderId === senderId ? "sent" : "received"}`}>
            <div className="message-bubble">
              <span className="sender">{msg.senderName}</span>
              <p className="text">{msg.text}</p>
              <span className="time">
                {msg.timestamp?.toDate()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={scrollRef}></div>
      </div>

      <form onSubmit={sendMessage} className="chat-input-area">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Invoque sua mensagem..."
          className="chat-input"
        />
        <button type="submit" className="send-btn">
          <span className="icon">◈</span>
        </button>
      </form>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 500px;
          background: rgba(5, 5, 5, 0.9);
          border: 1px solid var(--border-color);
          position: relative;
        }

        .chat-header {
          padding: 1rem 1.5rem;
          background: #0a0a0a;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .chat-avatar {
          width: 40px;
          height: 40px;
          background: var(--bg-secondary);
          border: 1px solid var(--accent-silver-muted);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-silver);
          font-size: 1.2rem;
        }

        .chat-info {
          display: flex;
          flex-direction: column;
        }

        .chat-name {
          font-size: 0.9rem;
          letter-spacing: 0.1em;
          color: var(--accent-silver);
        }

        .chat-status {
          font-size: 0.6rem;
          color: #00ff88; /* Online glow */
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .chat-close {
          margin-left: auto;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 1.2rem;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .chat-close:hover { color: var(--accent-silver); transform: scale(1.1); }
        
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background-image: url("https://www.transparenttextures.com/patterns/carbon-fibre.png");
          background-opacity: 0.05;
        }
        
        .message-wrapper {
          display: flex;
          width: 100%;
        }
        
        .message-wrapper.sent { justify-content: flex-end; }
        .message-wrapper.received { justify-content: flex-start; }
        
        .message-bubble {
          max-width: 80%;
          padding: 0.8rem 1.2rem;
          background: rgba(30, 30, 30, 0.8);
          border: 1px solid var(--border-color);
          position: relative;
          border-radius: 4px;
        }
        
        .sent .message-bubble {
          background: rgba(209, 213, 219, 0.08);
          border-color: var(--accent-silver-muted);
          border-bottom-right-radius: 0;
        }

        .received .message-bubble {
          border-bottom-left-radius: 0;
        }
        
        .sender {
          display: block;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent-silver-muted);
          margin-bottom: 0.3rem;
        }
        
        .text {
          font-size: 0.95rem;
          line-height: 1.5;
          color: var(--text-primary);
        }
        
        .time {
          display: block;
          font-size: 0.6rem;
          text-align: right;
          margin-top: 0.5rem;
          color: rgba(255,255,255,0.2);
        }
        
        .chat-input-area {
          display: flex;
          padding: 1rem;
          border-top: 1px solid var(--border-color);
          background: #050505;
          align-items: center;
        }
        
        .chat-input {
          flex: 1;
          background: #111;
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 0.8rem 1.2rem;
          font-family: var(--font-editorial);
          border-radius: 2rem;
          margin-right: 1rem;
        }
        
        .chat-input:focus { outline: none; border-color: var(--accent-silver-muted); }
        
        .send-btn {
          background: var(--accent-silver);
          border: none;
          color: var(--text-dark);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        
        .send-btn:hover { transform: scale(1.1); background: #fff; }

        @media (max-width: 768px) {
          .chat-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh !important;
            z-index: 2000;
            border: none;
            background: #050505;
          }
          .chat-header {
            padding-top: 3rem; /* Espaço para notch/status bar */
          }
          .messages-area {
            padding: 1.5rem 1rem;
          }
          .chat-input-area {
            padding: 1rem;
            padding-bottom: calc(1rem + env(safe-area-inset-bottom));
          }
          .message-bubble {
            max-width: 85%;
          }
        }

        /* Custom Scrollbar */
        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-track { background: transparent; }
        .messages-area::-webkit-scrollbar-thumb { background: var(--border-color); }
      `}</style>
    </div>
  );
}
