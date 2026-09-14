import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const ACCENT = '#5B4FFF';
const ACCENT_HOVER = '#4A3FE8';
const ONLINE = '#34D399';
const INK = '#12131A';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Ciao! Sono l'assistente virtuale di Simone. Chiedimi pure dei suoi progetti, competenze o servizi." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Segue la classe "dark" sul body, sia all'avvio sia quando cambia a runtime
  useEffect(() => {
    const syncTheme = () => setIsDark(document.body.classList.contains('dark'));
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    const userMsg = input.trim();
    if (!userMsg || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    const API_URL = window.location.hostname === 'simonecodarin.github.io'
      ? 'https://simonecodarin.netlify.app/.netlify/functions/chat'
      : '/.netlify/functions/chat';

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: "Ops, c'è stato un piccolo problema di connessione. Riprova tra poco." }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'ai', text: 'Errore di rete. Controlla la connessione.' }]);
    } finally {
      setLoading(false);
    }
  };

  const themeVars = {
    '--simai-accent': ACCENT,
    '--simai-accent-hover': ACCENT_HOVER,
    '--simai-online': ONLINE,
    '--simai-header-bg': INK,
    '--simai-header-text': '#FFFFFF',
    '--simai-header-sub': 'rgba(255,255,255,0.55)',
    '--simai-panel-bg': isDark ? '#1B1C24' : '#FFFFFF',
    '--simai-messages-bg': isDark ? '#17181F' : '#F6F6F9',
    '--simai-ai-bubble-bg': isDark ? '#242530' : '#FFFFFF',
    '--simai-ai-bubble-text': isDark ? '#ECEDF3' : '#1A1B23',
    '--simai-user-bubble-text': '#FFFFFF',
    '--simai-input-area-bg': isDark ? '#1B1C24' : '#FFFFFF',
    '--simai-input-field-bg': isDark ? '#26272F' : '#F1F1F5',
    '--simai-input-text': isDark ? '#ECEDF3' : '#1A1B23',
    '--simai-placeholder': isDark ? '#6C6D79' : '#9C9DA8',
    '--simai-border': isDark ? 'rgba(255,255,255,0.08)' : 'rgba(18,19,26,0.08)',
    '--simai-label': isDark ? '#82838F' : '#9294A0',
    '--simai-shadow': isDark
      ? '0 24px 60px -16px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06)'
      : '0 24px 60px -16px rgba(18,19,26,0.28), 0 0 0 1px rgba(18,19,26,0.04)'
  };

  return (
    <div className="simai-widget" style={themeVars}>
      <style>{`
        .simai-widget, .simai-widget * { box-sizing: border-box; }
        .simai-widget {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 2147483647;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        /* --- Pulsante flottante --- */
        .simai-launcher {
          display: flex;
          align-items: center;
          gap: 10px;
          border: none;
          cursor: pointer;
          background: var(--simai-header-bg);
          color: #fff;
          padding: 14px 20px 14px 16px;
          border-radius: 999px;
          box-shadow: 0 14px 30px -8px rgba(18,19,26,0.45);
          font-size: 14px;
          font-weight: 600;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .simai-launcher:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 36px -8px rgba(18,19,26,0.55);
        }
        .simai-launcher:focus-visible {
          outline: 2px solid var(--simai-accent);
          outline-offset: 3px;
        }
        .simai-launcher-glyph {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--simai-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
        }

        /* --- Pannello --- */
        .simai-panel {
          width: 380px;
          max-width: calc(100vw - 32px);
          height: 560px;
          max-height: calc(100vh - 120px);
          margin-bottom: 16px;
          background: var(--simai-panel-bg);
          border-radius: 20px;
          box-shadow: var(--simai-shadow);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: simai-pop 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (prefers-reduced-motion: reduce) {
          .simai-panel { animation: none; }
        }
        @keyframes simai-pop {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* --- Header --- */
        .simai-header {
          background: var(--simai-header-bg);
          color: var(--simai-header-text);
          padding: 16px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .simai-header-left { display: flex; align-items: center; gap: 12px; }
        .simai-avatar {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--simai-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .simai-avatar-dot {
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--simai-online);
          border: 2px solid var(--simai-header-bg);
        }
        .simai-avatar-dot::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: var(--simai-online);
          animation: simai-pulse 2s ease-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .simai-avatar-dot::after { animation: none; }
        }
        @keyframes simai-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .simai-title { font-size: 14px; font-weight: 700; line-height: 1.2; }
        .simai-subtitle { font-size: 11.5px; color: var(--simai-header-sub); margin-top: 2px; }
        .simai-close {
          background: none;
          border: none;
          color: var(--simai-header-sub);
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .simai-close:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .simai-close:focus-visible { outline: 2px solid var(--simai-accent); outline-offset: 2px; }

        /* --- Messaggi --- */
        .simai-messages {
          flex: 1;
          overflow-y: auto;
          background: var(--simai-messages-bg);
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .simai-messages::-webkit-scrollbar { width: 6px; }
        .simai-messages::-webkit-scrollbar-thumb { background: var(--simai-border); border-radius: 6px; }

        .simai-row { display: flex; }
        .simai-row.user { justify-content: flex-end; }
        .simai-row.ai { justify-content: flex-start; }

        .simai-bubble {
          max-width: 82%;
          padding: 11px 14px;
          font-size: 14px;
          line-height: 1.5;
        }
        .simai-bubble.user {
          background: var(--simai-accent);
          color: var(--simai-user-bubble-text);
          border-radius: 16px 16px 4px 16px;
        }
        .simai-bubble.ai {
          background: var(--simai-ai-bubble-bg);
          color: var(--simai-ai-bubble-text);
          border-left: 3px solid var(--simai-accent);
          border-radius: 4px 14px 14px 4px;
        }

        .simai-typing {
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--simai-ai-bubble-bg);
          border-left: 3px solid var(--simai-accent);
          border-radius: 4px 14px 14px 4px;
          padding: 13px 16px;
        }
        .simai-typing span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--simai-accent);
          animation: simai-bounce 1.2s infinite ease-in-out;
        }
        .simai-typing span:nth-child(2) { animation-delay: 0.15s; }
        .simai-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes simai-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }

        /* --- Input --- */
        .simai-input-row {
          background: var(--simai-input-area-bg);
          border-top: 1px solid var(--simai-border);
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .simai-input {
          flex: 1;
          background: var(--simai-input-field-bg);
          color: var(--simai-input-text);
          border: 1px solid transparent;
          border-radius: 12px;
          padding: 11px 14px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .simai-input::placeholder { color: var(--simai-placeholder); }
        .simai-input:focus { border-color: var(--simai-accent); }

        .simai-send {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: none;
          background: var(--simai-accent);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease;
        }
        .simai-send:hover:not(:disabled) { background: var(--simai-accent-hover); }
        .simai-send:active:not(:disabled) { transform: scale(0.94); }
        .simai-send:disabled { opacity: 0.4; cursor: not-allowed; }
        .simai-send:focus-visible { outline: 2px solid var(--simai-accent); outline-offset: 2px; }
      `}</style>

      {isOpen && (
        <div className="simai-panel" role="dialog" aria-label="Assistente virtuale">
          <div className="simai-header">
            <div className="simai-header-left">
              <div className="simai-avatar">
                {'</>'}
                <span className="simai-avatar-dot" />
              </div>
              <div>
                <div className="simai-title">Assistente di Simone</div>
                <div className="simai-subtitle">Sempre operativo</div>
              </div>
            </div>
            <button className="simai-close" onClick={() => setIsOpen(false)} aria-label="Chiudi la chat">
              ✕
            </button>
          </div>

          <div className="simai-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`simai-row ${msg.sender}`}>
                <div className={`simai-bubble ${msg.sender}`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}

            {loading && (
              <div className="simai-row ai">
                <div className="simai-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="simai-input-row" onSubmit={handleSend}>
            <input
              ref={inputRef}
              type="text"
              className="simai-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Chiedi qualcosa sui progetti..."
              aria-label="Scrivi un messaggio"
            />
            <button
              type="submit"
              className="simai-send"
              disabled={loading || !input.trim()}
              aria-label="Invia messaggio"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <button className="simai-launcher" onClick={() => setIsOpen(true)} aria-label="Apri l'assistente virtuale">
          <span className="simai-launcher-glyph">{'</>'}</span>
          <span>Assistente IA</span>
        </button>
      )}
    </div>
  );
}