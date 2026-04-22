import Link from 'next/link';
import { ArrowRight, Star, Sparkles, GraduationCap, Briefcase } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
      <div className="max-w-6xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/20 mb-8 animate-fade-up">
          <Sparkles size={14} className="text-purple-400" />
          <span className="text-sm text-purple-300 font-medium">AI-Powered Career Guidance Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-up delay-100">
          Your Career{' '}
          <span className="relative inline-block">
            <span className="gradient-text glow-text">Starts Here</span>
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
              <path d="M0 8 Q150 0 300 8" stroke="url(#underline-grad)" strokeWidth="2.5" strokeLinecap="round"/>
              <defs><linearGradient id="underline-grad" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#a855f7"/><stop offset="1" stopColor="#6366f1"/></linearGradient></defs>
            </svg>
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up delay-200">
          Get personalized guidance from expert consultants in <strong className="text-purple-300">Education, Business, Sports, Medical</strong> & more. Powered by AI for instant recommendations.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-up delay-300">
          <Link href="/signup" id="hero-get-started-btn" className="btn-primary text-base px-8 py-4 group">
            Get Started Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/signup?role=consultant" id="hero-become-consultant-btn" className="btn-outline text-base px-8 py-4 group">
            <GraduationCap size={18} />
            Become a Consultant
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 animate-fade-up delay-400">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {['#a855f7','#6366f1','#3b82f6','#10b981'].map((c,i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-[#07070e]" style={{ background: c }} />
              ))}
            </div>
            <span>10,000+ Students Guided</span>
          </div>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
            <span className="ml-1">4.9/5 Rating</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase size={14} className="text-purple-400" />
            <span>2,000+ Expert Consultants</span>
          </div>
        </div>

        {/* Hero card preview */}
        <div className="mt-16 relative animate-float">
          <div className="glass rounded-3xl p-6 max-w-2xl mx-auto border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div className="flex-1 h-6 rounded-md bg-white/05 ml-2" />
            </div>
            <div className="text-left space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)' }}>
                  <Sparkles size={14} className="text-white" />
                </div>
                <div className="flex-1 glass rounded-2xl rounded-tl-sm p-3 text-sm text-slate-300">
                  Based on your profile (12th Science, 90%), I recommend: <strong className="text-purple-300">IIT Bombay (CS)</strong>, <strong className="text-purple-300">IIT Delhi (ECE)</strong>. You should also consider applying abroad — <strong className="text-purple-300">MIT, Stanford</strong> for Fall 2027. Shall I connect you with an IIT alumnus consultant?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="chat-bubble-user text-sm px-4 py-2 text-white max-w-[70%]">
                  Yes! Show me IIT consultants available this week.
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-20 w-3/4 bg-purple-500/20 blur-3xl rounded-full" />
        </div>
      </div>
    </section>
  );
}
