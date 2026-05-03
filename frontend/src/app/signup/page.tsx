'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, Briefcase, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';

const EDUCATION_LEVELS = ['10th Grade', '12th Grade', 'Undergraduate', 'Postgraduate', 'Working Professional'];
const DOMAINS = ['Education', 'Business', 'Sports', 'Medical', 'Engineering', 'Arts', 'Law', 'Government', 'Research'];
const COUNTRIES = ['India', 'USA', 'UK', 'Canada', 'Australia', 'Germany', 'Other'];

export default function SignupPage() {
  const [role, setRole] = useState<'seeker' | 'consultant'>('seeker');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
    educationLevel: '', consultantType: '', institution: '', degree: '',
    bio: '', ratePerSession: '', countryOfInstitution: 'India',
  });
  const router = useRouter();

  const toggleDomain = (d: string) => setSelectedDomains(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);
  const toggleCountry = (c: string) => setSelectedCountries(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      const endpoint = role === 'seeker' ? '/api/auth/register/seeker' : '/api/auth/register/consultant';
      const payload = role === 'seeker'
        ? { ...form, interestedDomains: selectedDomains, preferredCountries: selectedCountries }
        : { ...form, domains: selectedDomains, ratePerSession: Number(form.ratePerSession), durationOptions: [30, 60] };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(data.message);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  if (success) return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="max-w-md text-center animate-fade-up">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
          <span className="text-4xl">✅</span>
        </div>
        <h2 className="text-2xl font-bold mb-3">You're almost there!</h2>
        <p className="text-slate-400 mb-6">{success}</p>
        <Link href="/login" className="btn-primary">Go to Login</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="orb orb-purple w-96 h-96 -top-24 -left-24 fixed opacity-10" />
      <div className="w-full max-w-lg animate-fade-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)' }}>
            <Sparkles size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Join Mentroo</h1>
          <p className="text-slate-400">Start your guided career journey today</p>
        </div>

        {/* Role Toggle */}
        <div className="flex gap-3 mb-6">
          {(['seeker', 'consultant'] as const).map(r => (
            <button key={r} id={`role-${r}`} onClick={() => setRole(r)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${role === r ? 'text-white' : 'glass text-slate-400 hover:text-white'}`}
              style={role === r ? { background: 'linear-gradient(135deg,#a855f7,#6366f1)' } : {}}>
              {r === 'seeker' ? <GraduationCap size={16} /> : <Briefcase size={16} />}
              {r === 'seeker' ? "I'm a Seeker" : "I'm a Consultant"}
            </button>
          ))}
        </div>

        <div className="card">
          {error && <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-300 bg-red-500/10 border border-red-500/20">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name *</label>
                <input id="signup-fullname" type="text" required value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} placeholder="Your full name" className="input-field text-sm" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone *</label>
                <input id="signup-phone" type="tel" required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" className="input-field text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email *</label>
              <input id="signup-email" type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@email.com" className="input-field text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Password *</label>
                <div className="relative">
                  <input id="signup-password" type={show ? 'text' : 'password'} required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Min 8 chars" className="input-field text-sm pr-9" />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"><Eye size={14} /></button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirm Password *</label>
                <input id="signup-confirm-password" type="password" required value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="Re-enter" className="input-field text-sm" />
              </div>
            </div>

            {role === 'seeker' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Education Level</label>
                  <select value={form.educationLevel} onChange={e => setForm(p => ({ ...p, educationLevel: e.target.value }))} className="input-field text-sm">
                    <option value="">Select level</option>
                    {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Interested Domains</label>
                  <div className="flex flex-wrap gap-2">
                    {DOMAINS.map(d => (
                      <button type="button" key={d} onClick={() => toggleDomain(d)}
                        className="text-xs px-3 py-1.5 rounded-full transition-all"
                        style={selectedDomains.includes(d) ? { background: 'linear-gradient(135deg,#a855f7,#6366f1)', color: 'white' } : { background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {role === 'consultant' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Consultant Type *</label>
                    <select required value={form.consultantType} onChange={e => setForm(p => ({ ...p, consultantType: e.target.value }))} className="input-field text-sm">
                      <option value="">Select type</option>
                      <option>Current Student</option><option>Alumni/Passed Out</option><option>Industry Professional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Rate/Session (₹) *</label>
                    <input type="number" required min="100" value={form.ratePerSession} onChange={e => setForm(p => ({ ...p, ratePerSession: e.target.value }))} placeholder="e.g. 800" className="input-field text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Institution *</label>
                  <input type="text" required value={form.institution} onChange={e => setForm(p => ({ ...p, institution: e.target.value }))} placeholder="IIT Bombay, IIM Ahmedabad..." className="input-field text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Bio (50–500 chars) *</label>
                  <textarea required minLength={50} maxLength={500} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Tell seekers about your expertise..." rows={3} className="input-field text-sm resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Domains of Expertise *</label>
                  <div className="flex flex-wrap gap-2">
                    {DOMAINS.map(d => (
                      <button type="button" key={d} onClick={() => toggleDomain(d)}
                        className="text-xs px-3 py-1.5 rounded-full transition-all"
                        style={selectedDomains.includes(d) ? { background: 'linear-gradient(135deg,#a855f7,#6366f1)', color: 'white' } : { background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <label className="flex items-start gap-2 cursor-pointer">
              <input id="signup-terms" type="checkbox" required className="mt-0.5 accent-purple-500" />
              <span className="text-xs text-slate-400">I agree to the <Link href="/terms" className="text-purple-400">Terms & Conditions</Link> and <Link href="/privacy" className="text-purple-400">Privacy Policy</Link></span>
            </label>

            <button id="signup-submit-btn" type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-60">
              {loading ? 'Creating account...' : role === 'seeker' ? 'Create Account' : 'Apply as Consultant'} {!loading && <ArrowRight size={16} />}
            </button>
          </form>
          <div className="mt-5 text-center text-sm text-slate-400">
            Already have an account? <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">Sign in →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
