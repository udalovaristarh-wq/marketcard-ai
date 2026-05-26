import { BeforeAfterSection } from "./BeforeAfterSection";
import { CTASection } from "./CTASection";
import { Footer } from "./Footer";
import { HeroSection } from "./HeroSection";
import { Navbar } from "./Navbar";
import { PipelineSection } from "./PipelineSection";
import { StatsSection } from "./StatsSection";

export default function AboutLanding() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="noise fixed inset-0 pointer-events-none" />
      <Navbar />
      <HeroSection />
      <StatsSection />
      <BeforeAfterSection />
      <PipelineSection />
      <CTASection />
      <Footer />
    </main>
  );
}
