import { Star, Quote } from 'lucide-react';
import Link from 'next/link';

const CONSULTANTS = [
  { name: 'Priya Sharma', institution: 'IIT Bombay — CS (Final Year)', domains: ['Education', 'Engineering'], rating: 4.9, sessions: 312, rate: '₹800', avatar: 'PS', color: '#a855f7' },
  { name: 'Arjun Mehta', institution: 'IIM Ahmedabad — MBA', domains: ['Business', 'Education'], rating: 4.8, sessions: 245, rate: '₹1200', avatar: 'AM', color: '#6366f1' },
  { name: 'Dr. Kavya Nair', institution: 'AIIMS Delhi — MBBS Graduate', domains: ['Medical'], rating: 5.0, sessions: 189, rate: '₹1500', avatar: 'KN', color: '#10b981' },
  { name: 'Rohit Verma', institution: 'Columbia University — MS CS', domains: ['Education', 'Engineering'], rating: 4.7, sessions: 156, rate: '$50', avatar: 'RV', color: '#3b82f6' },
];

export default function TopConsultants() {
  return (
    <section className="py-24 px-4" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.05) 0%, transparent 70%)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">Featured Experts</p>
          <h2 className="section-title mb-4">Top <span className="gradient-text">Consultants</span></h2>
          <p className="text-slate-400 max-w-xl mx-auto">Verified experts ready to guide your career journey.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CONSULTANTS.map((c) => (
            <div key={c.name} className="card group flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}99)` }}>
                  {c.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-tight">{c.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-tight">{c.institution}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {c.domains.map(d => <span key={d} className="badge text-xs">{d}</span>)}
              </div>
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/08">
                <div className="flex items-center gap-1">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold">{c.rating}</span>
                  <span className="text-xs text-slate-400">({c.sessions})</span>
                </div>
                <span className="text-sm font-semibold text-purple-300">{c.rate}/session</span>
              </div>
              <Link href="/consultants" className="btn-primary text-xs py-2.5 mt-3 text-center">Book Now</Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/consultants" className="btn-outline px-8 py-3">View All Consultants →</Link>
        </div>
      </div>
    </section>
  );
}
