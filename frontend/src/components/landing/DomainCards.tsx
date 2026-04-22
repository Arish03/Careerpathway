import Link from 'next/link';
import { GraduationCap, Briefcase, Trophy, Stethoscope, Cpu, Palette, Scale, Shield, FlaskConical } from 'lucide-react';

const DOMAINS = [
  { icon: GraduationCap, label: 'Education', desc: 'Colleges, entrance exams, study abroad', count: 420, color: '#a855f7', slug: 'education' },
  { icon: Briefcase, label: 'Business', desc: 'MBA, entrepreneurship, finance', count: 280, color: '#6366f1', slug: 'business' },
  { icon: Trophy, label: 'Sports', desc: 'Athletic careers, coaching, sports management', count: 95, color: '#f59e0b', slug: 'sports' },
  { icon: Stethoscope, label: 'Medical', desc: 'MBBS, USMLE, medical specialties', count: 310, color: '#10b981', slug: 'medical' },
  { icon: Cpu, label: 'Engineering', desc: 'JEE, GATE, tech careers', count: 390, color: '#3b82f6', slug: 'engineering' },
  { icon: Palette, label: 'Arts & Design', desc: 'Creative careers, design schools', count: 120, color: '#ec4899', slug: 'arts' },
  { icon: Scale, label: 'Law', desc: 'CLAT, LLB, legal careers', count: 85, color: '#f97316', slug: 'law' },
  { icon: Shield, label: 'Government', desc: 'UPSC, SSC, civil services', count: 175, color: '#14b8a6', slug: 'government' },
  { icon: FlaskConical, label: 'Research', desc: 'PhD, fellowships, academia', count: 140, color: '#8b5cf6', slug: 'research' },
];

export default function DomainCards() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">Explore Domains</p>
          <h2 className="section-title mb-4">Every Career Path, <span className="gradient-text">Covered</span></h2>
          <p className="text-slate-400 max-w-xl mx-auto">From IIT to NBA — find expert consultants across every domain.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {DOMAINS.map((d, i) => (
            <Link key={d.slug} href={`/domains/${d.slug}`} id={`domain-card-${d.slug}`}
              className="card group flex items-start gap-4 cursor-pointer"
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                style={{ background: `${d.color}22`, border: `1px solid ${d.color}44` }}>
                <d.icon size={22} style={{ color: d.color }} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100 mb-1 group-hover:text-purple-300 transition-colors">{d.label}</h3>
                <p className="text-xs text-slate-400 mb-2">{d.desc}</p>
                <span className="text-xs font-medium" style={{ color: d.color }}>{d.count}+ consultants</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/domains" className="btn-outline px-8 py-3">View All Domains</Link>
        </div>
      </div>
    </section>
  );
}
