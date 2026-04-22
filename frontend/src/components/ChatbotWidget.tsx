'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot, ChevronDown } from 'lucide-react';

const SUGGESTIONS = ['Which college suits me?', 'Career after 12th Science', 'How to crack IIT JEE?', 'Study abroad — USA'];

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: "👋 Hi! I'm CareerPathway AI. Ask me anything about careers, colleges, or exams!" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput('');
    setMessages(p => [...p, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages.map(m => ({ role: m.role === 'ai' ? 'model' : 'user', content: m.content })) }),
      });
      const data = await res.json();
      setMessages(p => [...p, { role: 'ai', content: data.data?.response || 'Sorry, try again.' }]);
    } catch {
      setMessages(p => [...p, { role: 'ai', content: 'Connection error. Please try the full AI Guide page.' }]);
    } finally { setLoading(false); }
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} id="chatbot-toggle-btn"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 animate-pulse-glow"
        style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)' }}>
        {open ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[350px] h-[500px] glass rounded-3xl shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-fade-up">
          <div className="flex items-center gap-3 p-4 border-b border-white/08" style={{ background: 'linear-gradient(135deg,rgba(168,85,247,0.15),rgba(99,102,241,0.15))' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)' }}>
              <Bot size={18} className="text-white" />
            </div>
            <div><p className="font-semibold text-sm">CareerPathway AI</p>
              <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /><p className="text-xs text-slate-400">Online</p></div>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-slate-400 hover:text-white"><ChevronDown size={16} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                {m.role === 'ai' && <div className="w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)' }}><Sparkles size={11} className="text-white" /></div>}
                <div className={`max-w-[220px] px-3 py-2.5 text-xs leading-relaxed ${m.role === 'user' ? 'chat-bubble-user text-white' : 'chat-bubble-ai text-slate-200'}`}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)' }}><Sparkles size={11} className="text-white" /></div>
                <div className="chat-bubble-ai px-4 py-3 flex gap-1">
                  {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {messages.length === 1 && (
            <div className="px-4 pb-2 flex gap-2 flex-wrap">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)} className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(168,85,247,0.12)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.25)' }}>{s}</button>
              ))}
            </div>
          )}

          <div className="p-3 border-t border-white/08 flex gap-2">
            <input id="chatbot-input" type="text" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder="Ask about your career..." className="input-field text-xs py-2 flex-1" />
            <button id="chatbot-send-btn" onClick={() => send(input)} disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)' }}>
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
