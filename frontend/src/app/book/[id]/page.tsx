'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, CreditCard, Calendar, Video, FileText, ChevronRight } from 'lucide-react';

const STEPS = ['Select Session', 'Pick Date & Time', 'Session Details', 'Review & Pay', 'Confirmation'];

export default function BookingPage({ params }: { params: { id: string } }) {
  const [step, setStep] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const durations = [{ min: 15, price: 400 }, { min: 30, price: 800 }, { min: 45, price: 1100 }, { min: 60, price: 1400 }];

  if (step === 4) return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="max-w-md text-center animate-fade-up">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)' }}>
          <CheckCircle size={40} className="text-green-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Booking Confirmed! 🎉</h1>
        <p className="text-slate-400 mb-2">Your session has been booked successfully.</p>
        <p className="text-sm text-slate-500 mb-8">Booking ID: <span className="text-purple-300">CP-{Date.now().toString().slice(-6)}</span></p>
        <div className="flex gap-3 justify-center">
          <Link href="/bookings" className="btn-primary">My Bookings</Link>
          <Link href="/dashboard/seeker" className="btn-outline">Dashboard</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Book a Consultation</h1>

        {/* Stepper */}
        <div className="flex items-center mb-10 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-shrink-0">
              <div className={`flex items-center gap-2 ${i <= step ? 'text-purple-300' : 'text-slate-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${i < step ? 'bg-purple-500 border-purple-500 text-white' : i === step ? 'border-purple-500 text-purple-300' : 'border-slate-600 text-slate-500'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && <ChevronRight size={14} className="mx-2 text-slate-600 flex-shrink-0" />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="card">
          {step === 0 && (
            <div>
              <h2 className="font-bold text-lg mb-5 flex items-center gap-2"><Video size={18} className="text-purple-400" /> Choose Session Duration</h2>
              <div className="grid grid-cols-2 gap-3">
                {durations.map(d => (
                  <button key={d.min} onClick={() => setSelectedDuration(d.min)} id={`duration-${d.min}`}
                    className="p-5 rounded-2xl text-center transition-all"
                    style={selectedDuration === d.min ? { background: 'linear-gradient(135deg,rgba(168,85,247,0.2),rgba(99,102,241,0.2))', border: '2px solid #a855f7' } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="text-2xl font-bold mb-1">{d.min}<span className="text-base font-normal"> min</span></div>
                    <div className="text-purple-300 font-bold">₹{d.price}</div>
                  </button>
                ))}
              </div>
              <button onClick={() => selectedDuration && setStep(1)} disabled={!selectedDuration} className="btn-primary w-full mt-6 disabled:opacity-40">Continue →</button>
            </div>
          )}
          {step === 1 && (
            <div>
              <h2 className="font-bold text-lg mb-5 flex items-center gap-2"><Calendar size={18} className="text-purple-400" /> Select Date & Time</h2>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {['Apr 20', 'Apr 21', 'Apr 22', 'Apr 23', 'Apr 24', 'Apr 25'].map(d => (
                  <button key={d} className="p-3 rounded-xl text-sm text-center glass-hover" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>{d}</button>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {['9:00 AM', '10:00 AM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'].map(t => (
                  <button key={t} className="p-2.5 rounded-xl text-xs text-center glass-hover" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>{t}</button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="btn-outline flex-1">← Back</button>
                <button onClick={() => setStep(2)} className="btn-primary flex-1">Continue →</button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="font-bold text-lg mb-5 flex items-center gap-2"><FileText size={18} className="text-purple-400" /> Session Details</h2>
              <div className="space-y-4">
                <div><label className="block text-sm text-slate-400 mb-2">Topic / Agenda *</label><textarea rows={3} className="input-field resize-none" placeholder="What do you want to discuss? (e.g. IIT JEE strategy, college shortlisting...)" /></div>
                <div><label className="block text-sm text-slate-400 mb-2">Preferred Language</label>
                  <select className="input-field"><option>English</option><option>Hindi</option><option>Tamil</option><option>Telugu</option></select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn-outline flex-1">← Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1">Continue →</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 className="font-bold text-lg mb-5 flex items-center gap-2"><CreditCard size={18} className="text-purple-400" /> Review & Pay</h2>
              <div className="rounded-2xl p-4 mb-6 space-y-3 text-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex justify-between"><span className="text-slate-400">Consultant</span><span>Priya Sharma</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Duration</span><span>{selectedDuration} minutes</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Session Fee</span><span>₹{durations.find(d=>d.min===selectedDuration)?.price}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Platform Fee</span><span className="text-green-400">Free</span></div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-white/08"><span>Total</span><span className="gradient-text">₹{durations.find(d=>d.min===selectedDuration)?.price}</span></div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-outline flex-1">← Back</button>
                <button onClick={() => setStep(4)} id="confirm-pay-btn" className="btn-primary flex-1">Confirm & Pay →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
