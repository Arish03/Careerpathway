import Link from 'next/link';
import { Twitter, Linkedin, Instagram, Youtube, Mail, Phone } from 'lucide-react';

const LINKS = {
  Platform: [
    { label: 'Explore Domains', href: '/domains' },
    { label: 'Find Consultants', href: '/consultants' },
    { label: 'AI Career Guide', href: '/ai-guide' },
    { label: 'Become a Consultant', href: '/signup?role=consultant' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Help & Support', href: '/support' },
    { label: 'Careers', href: '/about#careers' },
  ],
  Legal: [
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Commission Terms', href: '/commission-terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/08 py-16 px-4 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)' }}>
                <span className="text-white font-bold text-sm">CP</span>
              </div>
              <span className="font-bold text-lg">Career<span className="gradient-text">Pathway</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-5">Connecting students and professionals with expert consultants for personalized career guidance across every domain.</p>
            <div className="flex gap-3">
              {[Twitter, Linkedin, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all hover:scale-110" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-semibold text-sm mb-4 text-slate-200">{group}</h4>
              <ul className="space-y-2.5">
                {links.map(l => (
                  <li key={l.href}><Link href={l.href} className="text-sm text-slate-400 hover:text-purple-300 transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/08 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">© 2026 Mentroo. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <a href="mailto:hello@mentroo.com" className="flex items-center gap-1.5 hover:text-purple-300 transition-colors"><Mail size={13} /> hello@mentroo.com</a>
            <a href="tel:+911234567890" className="flex items-center gap-1.5 hover:text-purple-300 transition-colors"><Phone size={13} /> +91 12345 67890</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
