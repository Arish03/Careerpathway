'use client';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';

interface Consultant {
  id: string;
  fullName: string;
  institution: string;
  domains: string[];
  averageRating: number;
  totalSessions: number;
  ratePerSession: number;
  currency: string;
  profilePhoto: string | null;
}

const COLORS = ['#a855f7', '#6366f1', '#10b981', '#3b82f6'];

export default function TopConsultants() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const res = await api.get('/api/consultants?limit=4&sortBy=rating');
        if (res.data && res.data.data && res.data.data.consultants) {
          setConsultants(res.data.data.consultants);
        }
      } catch (error) {
        console.error('Failed to fetch consultants', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultants();
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <section className="py-24 px-4" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.05) 0%, transparent 70%)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">Featured Experts</p>
          <h2 className="section-title mb-4">Top <span className="gradient-text">Consultants</span></h2>
          <p className="text-slate-400 max-w-xl mx-auto">Verified experts ready to guide your career journey.</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
          </div>
        ) : consultants.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {consultants.map((c, idx) => {
              const color = COLORS[idx % COLORS.length];
              return (
                <div key={c.id} className="card group flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    {c.profilePhoto ? (
                      <img src={c.profilePhoto} alt={c.fullName} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
                        {getInitials(c.fullName)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-sm leading-tight">{c.fullName}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 leading-tight">{c.institution}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {c.domains.slice(0, 3).map(d => <span key={d} className="badge text-xs">{d}</span>)}
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/08">
                    <div className="flex items-center gap-1">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold">{c.averageRating?.toFixed(1) || 'New'}</span>
                      <span className="text-xs text-slate-400">({c.totalSessions || 0})</span>
                    </div>
                    <span className="text-sm font-semibold text-purple-300">₹{c.ratePerSession}/session</span>
                  </div>
                  <Link href={`/consultants/${c.id}`} className="btn-primary text-xs py-2.5 mt-3 text-center">Book Now</Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400">
            No consultants found.
          </div>
        )}
        
        <div className="text-center mt-10">
          <Link href="/consultants" className="btn-outline px-8 py-3">View All Consultants →</Link>
        </div>
      </div>
    </section>
  );
}
