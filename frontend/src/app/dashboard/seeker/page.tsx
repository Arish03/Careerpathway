'use client';
import Link from 'next/link';
import { LayoutDashboard, BookOpen, Brain, Star, Bell, Calendar, TrendingUp, Users, ArrowRight, Sparkles, Clock } from 'lucide-react';

const QUICK_ACTIONS = [
  { icon: Brain, label: 'Chat with AI', href: '/ai-guide', color: '#a855f7' },
  { icon: Users, label: 'Find Consultants', href: '/consultants', color: '#6366f1' },
  { icon: Calendar, label: 'My Bookings', href: '/bookings', color: '#10b981' },
  { icon: TrendingUp, label: 'Explore Domains', href: '/domains', color: '#f59e0b' },
];

const UPCOMING = [
  { consultant: 'Priya Sharma', domain: 'Education', date: 'Apr 20, 2026', time: '3:00 PM', type: 'Video', avatar: 'PS', color: '#a855f7' },
  { consultant: 'Arjun Mehta', domain: 'Business', date: 'Apr 22, 2026', time: '5:30 PM', type: 'Chat', avatar: 'AM', color: '#6366f1' },
];

const AI_RECS = [
  { title: 'IIT Bombay — Computer Science', match: '94% match', tag: 'Education' },
  { title: 'IIM Calcutta — MBA', match: '87% match', tag: 'Business' },
  { title: 'BITS Pilani — Electronics', match: '82% match', tag: 'Engineering' },
];

const PROGRESS = ['Profile Setup', 'Domain Selected', 'AI Consultation', 'Expert Consultation', 'Application Started'];

export default function SeekerDashboard() {
  const completedSteps = 2;
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 fixed left-0 top-16 bottom-0 glass border-r border-white/08 flex flex-col pt-6 pb-4 px-3 overflow-y-auto hidden lg:flex">
        {[
          { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/seeker', active: true },
          { icon: TrendingUp, label: 'Explore Domains', href: '/domains' },
          { icon: Users, label: 'Find Consultants', href: '/consultants' },
          { icon: BookOpen, label: 'My Bookings', href: '/bookings' },
          { icon: Brain, label: 'AI Career Guide', href: '/ai-guide' },
          { icon: Bell, label: 'Messages', href: '/messages' },
          { icon: Star, label: 'Saved', href: '/saved' },
        ].map(item => (
          <Link key={item.href} href={item.href} className={`sidebar-link ${item.active ? 'active' : ''}`}>
            <item.icon size={18} />{item.label}
          </Link>
        ))}
      </aside>

      {/* Main */}
      <main className="lg:ml-64 flex-1 pt-20 px-4 lg:px-8 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Welcome */}
          <div className="glass rounded-3xl p-7 mb-6 border border-white/10 relative overflow-hidden">
            <div className="orb orb-purple w-48 h-48 -right-12 -top-12 opacity-20" />
            <h1 className="text-2xl font-bold mb-1">Welcome back, Student! 👋</h1>
            <p className="text-slate-400 text-sm">Continue your career journey. You're 2 steps closer to your goal!</p>
            <div className="flex gap-3 mt-5">
              <Link href="/ai-guide" className="btn-primary text-sm py-2.5"><Brain size={15} /> Chat with AI</Link>
              <Link href="/consultants" className="btn-outline text-sm py-2.5"><Users size={15} /> Find Consultants</Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {QUICK_ACTIONS.map(a => (
              <Link key={a.href} href={a.href} className="card flex flex-col items-center text-center py-5 group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                  style={{ background: `${a.color}20`, border: `1px solid ${a.color}40` }}>
                  <a.icon size={22} style={{ color: a.color }} />
                </div>
                <span className="text-sm font-medium">{a.label}</span>
              </Link>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Upcoming Sessions */}
            <div className="lg:col-span-2 card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold flex items-center gap-2"><Calendar size={16} className="text-purple-400" /> Upcoming Sessions</h2>
                <Link href="/bookings" className="text-xs text-purple-400">View all →</Link>
              </div>
              {UPCOMING.map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl mb-3 last:mb-0" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: `linear-gradient(135deg,${s.color},${s.color}99)` }}>{s.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{s.consultant}</p>
                    <p className="text-xs text-slate-400">{s.date} · {s.time} · {s.type}</p>
                  </div>
                  <span className="badge text-xs">{s.domain}</span>
                  <button className="btn-primary text-xs px-3 py-1.5">Join</button>
                </div>
              ))}
              {UPCOMING.length === 0 && (
                <div className="text-center py-8 text-slate-500"><Calendar size={32} className="mx-auto mb-2 opacity-30" /><p>No upcoming sessions</p><Link href="/consultants" className="text-purple-400 text-sm mt-2 inline-block">Book one now →</Link></div>
              )}
            </div>

            {/* Progress Tracker */}
            <div className="card">
              <h2 className="font-semibold mb-5 flex items-center gap-2"><TrendingUp size={16} className="text-purple-400" /> Your Progress</h2>
              <div className="space-y-3">
                {PROGRESS.map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i < completedSteps ? 'bg-purple-500 text-white' : i === completedSteps ? 'border-2 border-purple-500 text-purple-400' : 'bg-white/05 text-slate-500'}`}>
                      {i < completedSteps ? '✓' : i + 1}
                    </div>
                    <span className={`text-sm ${i < completedSteps ? 'text-slate-300 line-through opacity-60' : i === completedSteps ? 'text-white font-medium' : 'text-slate-500'}`}>{step}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 h-2 rounded-full bg-white/05 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(completedSteps / PROGRESS.length) * 100}%`, background: 'linear-gradient(90deg,#a855f7,#6366f1)' }} />
              </div>
              <p className="text-xs text-slate-400 mt-2">{completedSteps}/{PROGRESS.length} steps completed</p>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={16} className="text-purple-400" />
              <h2 className="font-semibold">AI Recommendations For You</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {AI_RECS.map(r => (
                <div key={r.title} className="p-4 rounded-2xl glass-hover cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="badge text-xs mb-2">{r.tag}</span>
                  <h3 className="text-sm font-medium mt-2 mb-1">{r.title}</h3>
                  <p className="text-xs text-green-400">{r.match}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
