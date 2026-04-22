import { Users, Star, Globe, TrendingUp } from 'lucide-react';

const STATS = [
  { icon: Users, value: '10,000+', label: 'Students Guided', color: '#a855f7' },
  { icon: Star, value: '2,000+', label: 'Expert Consultants', color: '#f59e0b' },
  { icon: Globe, value: '50+', label: 'Countries Served', color: '#10b981' },
  { icon: TrendingUp, value: '98%', label: 'Satisfaction Rate', color: '#6366f1' },
];

export default function StatsBar() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="glass rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 border border-white/10">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${s.color}20`, border: `1px solid ${s.color}40` }}>
                <s.icon size={22} style={{ color: s.color }} />
              </div>
              <div className="text-3xl font-bold mb-1 gradient-text">{s.value}</div>
              <div className="text-sm text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
