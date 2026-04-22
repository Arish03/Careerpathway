'use client';
import { useState } from 'react';
import { Search, SlidersHorizontal, Star, MapPin } from 'lucide-react';
import Link from 'next/link';

const MOCK_CONSULTANTS = [
  { id: '1', name: 'Priya Sharma', institution: 'IIT Bombay', domain: 'Education', rating: 4.9, sessions: 312, rate: '₹800', avatar: 'PS', color: '#a855f7' },
  { id: '2', name: 'Arjun Mehta', institution: 'IIM Ahmedabad', domain: 'Business', rating: 4.8, sessions: 245, rate: '₹1200', avatar: 'AM', color: '#6366f1' },
  { id: '3', name: 'Dr. Kavya Nair', institution: 'AIIMS Delhi', domain: 'Medical', rating: 5.0, sessions: 189, rate: '₹1500', avatar: 'KN', color: '#10b981' },
  { id: '4', name: 'Rohit Verma', institution: 'Columbia University', domain: 'Engineering', rating: 4.7, sessions: 156, rate: '$50', avatar: 'RV', color: '#3b82f6' },
  { id: '5', name: 'Sneha Patel', institution: 'NLU Delhi', domain: 'Law', rating: 4.6, sessions: 98, rate: '₹900', avatar: 'SP', color: '#f97316' },
  { id: '6', name: 'Vikram Singh', institution: 'SAI India', domain: 'Sports', rating: 4.9, sessions: 201, rate: '₹700', avatar: 'VS', color: '#f59e0b' },
];

const DOMAINS = ['All', 'Education', 'Business', 'Medical', 'Engineering', 'Sports', 'Law', 'Government', 'Research', 'Arts'];

export default function ConsultantsPage() {
  const [search, setSearch] = useState('');
  const [activeDomain, setActiveDomain] = useState('All');

  const filtered = MOCK_CONSULTANTS.filter(c =>
    (activeDomain === 'All' || c.domain === activeDomain) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.institution.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">Find <span className="gradient-text">Expert Consultants</span></h1>
          <p className="text-slate-400">Connect with verified experts for personalized 1-on-1 career guidance.</p>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input id="consultant-search" type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, institution, or specialization..." className="input-field pl-11 py-3.5" />
          </div>
          <button className="btn-outline px-5 gap-2"><SlidersHorizontal size={16} /> Filters</button>
        </div>

        {/* Domain Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {DOMAINS.map(d => (
            <button key={d} id={`filter-${d.toLowerCase()}`} onClick={() => setActiveDomain(d)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={activeDomain === d ? { background: 'linear-gradient(135deg,#a855f7,#6366f1)', color: 'white' } : { background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
              {d}
            </button>
          ))}
        </div>

        {/* Results */}
        <p className="text-sm text-slate-400 mb-5">{filtered.length} consultants found</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <div key={c.id} className="card group flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg,${c.color},${c.color}99)` }}>{c.avatar}</div>
                <div>
                  <h2 className="font-bold text-base">{c.name}</h2>
                  <p className="text-sm text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={11} />{c.institution}</p>
                </div>
              </div>
              <span className="badge mb-4 w-fit">{c.domain}</span>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/08">
                <div className="flex items-center gap-1.5">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-sm">{c.rating}</span>
                  <span className="text-xs text-slate-400">({c.sessions} sessions)</span>
                </div>
                <span className="font-bold text-purple-300 text-sm">{c.rate}/session</span>
              </div>
              <div className="flex gap-2 mt-4">
                <Link href={`/consultants/${c.id}`} id={`view-profile-${c.id}`} className="btn-outline text-xs py-2 flex-1 text-center">View Profile</Link>
                <Link href={`/book/${c.id}`} id={`book-${c.id}`} className="btn-primary text-xs py-2 flex-1 text-center">Book Now</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
