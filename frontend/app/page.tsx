import { CTA } from "@/components/cta";
import { Examples } from "@/components/examples";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Pricing } from "@/components/pricing";
import { Reviews } from "@/components/reviews";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="fixed inset-0 z-50 pointer-events-none noise-overlay" />
      <Header />
      <Hero />
      <HowItWorks />
      <Features />
      <Examples />
      <Reviews />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
