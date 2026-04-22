import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  { name: 'Ananya Reddy', role: 'Got into IIM Bangalore', content: 'CareerPathway connected me with an IIM alumnus who guided my entire MBA application. Best investment I made!', rating: 5, avatar: 'AR' },
  { name: 'Karan Patel', role: 'Now at MIT', content: 'The AI chatbot helped me shortlist universities and the consultant reviewed my SOPs. Accepted to MIT with a scholarship!', rating: 5, avatar: 'KP' },
  { name: 'Sneha Joshi', role: 'National-level Athlete', content: 'Found a sports management consultant who helped me balance athletics with academics. Changed my life!', rating: 5, avatar: 'SJ' },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">Success Stories</p>
          <h2 className="section-title mb-4">Students Who <span className="gradient-text">Made It</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card flex flex-col">
              <Quote size={28} className="text-purple-500/40 mb-4" />
              <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5">{t.content}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/08">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)' }}>{t.avatar}</div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-purple-400">{t.role}</p>
                </div>
                <div className="ml-auto flex">
                  {[...Array(t.rating)].map((_,i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
