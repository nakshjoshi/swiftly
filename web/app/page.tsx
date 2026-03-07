import Hero from '@/components/landing/Hero';
import ProblemSection from '@/components/landing/ProblemSection';
import SolutionSection from '@/components/landing/SolutionSection';
import HowItWorks from '@/components/landing/HowItWorks';
import ProductComponents from '@/components/landing/ProductComponents';
import BenefitsSection from '@/components/landing/BenefitsSection';
import CTASection from '@/components/landing/CTASection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <HowItWorks />
      <ProductComponents />
      <BenefitsSection />
      <CTASection />
    </main>
  );
}
