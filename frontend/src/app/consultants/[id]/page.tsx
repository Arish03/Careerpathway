import type { Metadata } from 'next';
import Link from 'next/link';
import { Star, MapPin, Clock, Video, MessageCircle } from 'lucide-react';
export const metadata: Metadata = { title: 'Consultant Profile' };

export default function ConsultantProfilePage({ params }: { params: { id: string } }) {
  const consultant = { id: params.id, name: 'Priya Sharma', institution: 'IIT Bombay — CS (Final Year)', domain: 'Education', rating: 4.9, sessions: 312, rate: '₹800', avatar: 'PS', color: '#a855f7', bio: 'Final year CS student at IIT Bombay with experience helping 300+ students with JEE preparation, college selection, and academic planning. Specialized in IIT/NIT admissions and engineering career paths.', specializations: ['IIT JEE Prep', 'College Selection', 'Engineering Career', 'Study Plans'], durations: [{ min: 30, price: '₹800' }, { min: 60, price: '₹1400' }] };

  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-bold text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg,${consultant.color},${consultant.color}88)` }}>{consultant.avatar}</div>
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-2xl font-bold mb-1">{consultant.name}</h1>
                  <p className="text-slate-400 flex items-center gap-1.5"><MapPin size={14} />{consultant.institution}</p>
                </div>
                <span className="badge">{consultant.domain}</span>
              </div>
              <div className="flex gap-6 mt-4 text-sm">
                <div className="flex items-center gap-1.5"><Star size={14} className="fill-amber-400 text-amber-400" /><strong>{consultant.rating}</strong><span className="text-slate-400">rating</span></div>
                <div className="flex items-center gap-1.5"><Video size={14} className="text-purple-400" /><strong>{consultant.sessions}</strong><span className="text-slate-400">sessions</span></div>
                <div className="flex items-center gap-1.5"><Clock size={14} className="text-green-400" /><strong>~15 min</strong><span className="text-slate-400">response</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card"><h2 className="font-bold mb-3">About</h2><p className="text-slate-300 text-sm leading-relaxed">{consultant.bio}</p></div>
            <div className="card">
              <h2 className="font-bold mb-3">Specializations</h2>
              <div className="flex flex-wrap gap-2">{consultant.specializations.map(s => <span key={s} className="badge">{s}</span>)}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card">
              <h2 className="font-bold mb-4">Book a Session</h2>
              {consultant.durations.map(d => (
                <div key={d.min} className="flex items-center justify-between p-3 rounded-xl mb-2 cursor-pointer glass-hover" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
                  <span className="text-sm">{d.min} minutes</span>
                  <span className="font-bold text-purple-300">{d.price}</span>
                </div>
              ))}
              <Link href={`/book/${consultant.id}`} id="book-session-btn" className="btn-primary w-full text-center mt-4 block">Book Consultation</Link>
              <button className="btn-outline w-full mt-2 gap-2 text-sm"><MessageCircle size={14} />Send Message</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
