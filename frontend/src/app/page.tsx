import type { Metadata } from 'next';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import DomainCards from '@/components/landing/DomainCards';
import TopConsultants from '@/components/landing/TopConsultants';
import StatsBar from '@/components/landing/StatsBar';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'CareerPathway — Your Career Starts Here',
  description: 'Get expert career guidance from consultants in Education, Business, Sports, Medical, Engineering & more. AI-powered recommendations. Book 1-on-1 sessions.',
};

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-purple w-[600px] h-[600px] -top-32 -left-32 fixed" />
      <div className="orb orb-indigo w-[500px] h-[500px] top-1/2 -right-48 fixed" />
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <DomainCards />
      <TopConsultants />
      <Testimonials />
      <Footer />
    </div>
  );
}
