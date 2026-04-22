import { Search, Calendar, Video } from 'lucide-react';

const STEPS = [
  { icon: Search, step: '01', title: 'Choose Your Domain', desc: 'Browse Education, Business, Sports, Medical and more. Let AI guide you to the right path.', color: '#a855f7' },
  { icon: Calendar, step: '02', title: 'Book a Session', desc: 'Pick a consultant, choose a time slot, and confirm with secure payment. 15 to 60 min options.', color: '#6366f1' },
  { icon: Video, step: '03', title: 'Get Expert Guidance', desc: '1-on-1 video, audio or chat session with your consultant. Leave with a clear action plan.', color: '#10b981' },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">Simple Process</p>
          <h2 className="section-title mb-4">How It <span className="gradient-text">Works</span></h2>
          <p className="text-slate-400 max-w-lg mx-auto">Three steps from confusion to clarity.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.4), transparent)' }} />
          {STEPS.map((s, i) => (
            <div key={s.step} className="card text-center relative group" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold" style={{ background: `${s.color}22`, color: s.color, border: `1px solid ${s.color}44` }}>{s.step}</div>
              <div className="w-16 h-16 rounded-2xl mx-auto mb-5 mt-4 flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                <s.icon size={28} style={{ color: s.color }} />
              </div>
              <h3 className="font-bold text-lg mb-3">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
