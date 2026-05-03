'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, Plus, Trash2, GraduationCap, Briefcase, Trophy, Stethoscope, Cpu } from 'lucide-react';
import Link from 'next/link';

const SUGGESTED = [
  'Which college is best for me?', 'How to prepare for IIT JEE?',
  'Career options after 12th Science', 'Study abroad in USA',
  'Sports career guidance', 'Medical entrance exams India',
];

const DOMAINS = [
  { icon: GraduationCap, label: 'Education', slug: 'education' },
  { icon: Briefcase, label: 'Business', slug: 'business' },
  { icon: Trophy, label: 'Sports', slug: 'sports' },
  { icon: Stethoscope, label: 'Medical', slug: 'medical' },
  { icon: Cpu, label: 'Engineering', slug: 'engineering' },
];

export default function AIGuidePage() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Welcome! I'm your AI Career Guide 🎓\nI can help with career paths, college recommendations, entrance exams, study abroad, and more.\n\nWhat would you like to explore today?" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState('');
  const [sessions] = useState([
    { id: '1', title: 'IIT vs NIT comparison', updatedAt: '2 hours ago' },
    { id: '2', title: 'MBA admissions USA', updatedAt: 'Yesterday' },
    { id: '3', title: 'NEET preparation strategy', updatedAt: '3 days ago' },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const msg = text.trim();
    setInput('');
    setMessages(p => [...p, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role === 'ai' ? 'model' : 'user', content: m.content }));
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history, domain }),
      });
      const data = await res.json();
      setMessages(p => [...p, { role: 'ai', content: data.data?.response || 'Sorry, I could not process that.' }]);
    } catch {
      setMessages(p => [...p, { role: 'ai', content: 'Connection error. Please check your internet and try again.' }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex h-screen pt-16">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 glass border-r border-white/08 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-white/08">
          <button className="btn-primary w-full text-sm py-2.5 gap-2"><Plus size={15} /> New Chat</button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-xs text-slate-500 font-medium px-2 mb-2 uppercase tracking-wider">Recent Chats</p>
          {sessions.map(s => (
            <button key={s.id} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/05 transition-colors group mb-1">
              <p className="text-sm text-slate-300 truncate">{s.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.updatedAt}</p>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-white/08">
          <Link href="/dashboard/seeker" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2">← Back to Dashboard</Link>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="glass border-b border-white/08 px-6 py-4 flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)' }}>
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base">Mentroo AI Guide</h1>
            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /><p className="text-xs text-slate-400">Powered by Gemini</p></div>
          </div>
          <div className="ml-auto flex gap-2">
            {DOMAINS.map(d => (
              <button key={d.slug} onClick={() => setDomain(d.slug === domain ? '' : d.slug)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
                style={domain === d.slug ? { background: 'linear-gradient(135deg,#a855f7,#6366f1)', color: 'white' } : { background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
                <d.icon size={12} /> {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-10 py-6 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
              {m.role === 'ai' && (
                <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center mt-1" style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)' }}>
                  <Sparkles size={16} className="text-white" />
                </div>
              )}
              <div className={`max-w-2xl ${m.role === 'user' ? 'chat-bubble-user text-white px-5 py-3.5' : 'chat-bubble-ai text-slate-200 px-5 py-4'} text-sm leading-relaxed whitespace-pre-wrap`}>
                {m.content}
                {m.role === 'ai' && i === messages.length - 1 && !loading && (
                  <div className="mt-4 pt-4 border-t border-white/08">
                    <p className="text-xs text-slate-400 mb-2">Want personalised expert advice?</p>
                    <Link href="/consultants" className="btn-primary text-xs py-2 px-4 inline-flex">Book a Consultant →</Link>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)' }}>
                <Sparkles size={16} className="text-white" />
              </div>
              <div className="chat-bubble-ai px-5 py-4 flex items-center gap-2">
                {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="px-4 md:px-10 pb-4 flex gap-2 flex-wrap">
            {SUGGESTED.map(s => (
              <button key={s} onClick={() => send(s)}
                className="text-sm px-4 py-2 rounded-xl transition-all hover:scale-105"
                style={{ background: 'rgba(168,85,247,0.1)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)' }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="glass border-t border-white/08 px-4 md:px-10 py-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <input id="ai-guide-input" type="text" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder="Ask anything about careers, colleges, exams..."
              className="input-field flex-1 text-sm py-3.5" />
            <button id="ai-guide-send-btn" onClick={() => send(input)} disabled={!input.trim() || loading}
              className="w-12 h-12 rounded-xl flex items-center justify-center disabled:opacity-40 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)' }}>
              <Send size={18} className="text-white" />
            </button>
          </div>
          <p className="text-center text-xs text-slate-600 mt-2">AI can make mistakes. Verify important information with a consultant.</p>
        </div>
      </div>
    </div>
  );
}
