import type { Metadata } from 'next';
import { GraduationCap, Briefcase, Trophy, Stethoscope, Cpu, Palette, Scale, Shield, FlaskConical } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Explore Domains' };

const DOMAINS = [
  { icon: GraduationCap, label: 'Education', desc: 'Colleges, entrance exams, study abroad', count: 420, color: '#a855f7', slug: 'education' },
  { icon: Briefcase, label: 'Business', desc: 'MBA, entrepreneurship, finance', count: 280, color: '#6366f1', slug: 'business' },
  { icon: Trophy, label: 'Sports', desc: 'Athletic careers, coaching, management', count: 95, color: '#f59e0b', slug: 'sports' },
  { icon: Stethoscope, label: 'Medical', desc: 'MBBS, USMLE, medical specialties', count: 310, color: '#10b981', slug: 'medical' },
  { icon: Cpu, label: 'Engineering', desc: 'JEE, GATE, tech careers', count: 390, color: '#3b82f6', slug: 'engineering' },
  { icon: Palette, label: 'Arts & Design', desc: 'Creative careers, design schools', count: 120, color: '#ec4899', slug: 'arts' },
  { icon: Scale, label: 'Law', desc: 'CLAT, LLB, legal careers', count: 85, color: '#f97316', slug: 'law' },
  { icon: Shield, label: 'Government', desc: 'UPSC, SSC, civil services', count: 175, color: '#14b8a6', slug: 'government' },
  { icon: FlaskConical, label: 'Research', desc: 'PhD, fellowships, academia', count: 140, color: '#8b5cf6', slug: 'research' },
];

export default function DomainsPage() {
  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold mb-4">Explore Career <span className="gradient-text">Domains</span></h1>
          <p className="text-slate-400 max-w-xl mx-auto">Find expert consultants across every career domain. From IIT to NBA — we've got you covered.</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {DOMAINS.map((d) => (
            <Link key={d.slug} href={`/domains/${d.slug}`} id={`domain-${d.slug}`}
              className="card group cursor-pointer flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                style={{ background: `${d.color}18`, border: `1px solid ${d.color}35` }}>
                <d.icon size={26} style={{ color: d.color }} />
              </div>
              <div>
                <h2 className="font-bold text-lg mb-1 group-hover:text-purple-300 transition-colors">{d.label}</h2>
                <p className="text-sm text-slate-400 mb-2">{d.desc}</p>
                <span className="text-sm font-medium" style={{ color: d.color }}>{d.count}+ consultants →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
