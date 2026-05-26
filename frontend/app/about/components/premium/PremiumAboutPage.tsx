"use client";

import PremiumHero from "./PremiumHero";
import {
  CTASection,
  EcosystemSection,
  FounderSection,
  FutureVisionSection,
  MarketplaceIntegrationsSection,
  MetricsSection,
  PipelineSection,
  PremiumFooter,
  SellerReasonsSection,
  StorySection,
  TechnologiesSection,
} from "./PremiumSections";
import styles from "./premium-about.module.css";

export default function PremiumAboutPage() {
  return (
    <main className={styles.pageShell}>
      <PremiumHero />
      <div className={styles.contentShell}>
        <StorySection />
        <EcosystemSection />
        <PipelineSection />
        <MarketplaceIntegrationsSection />
        <FounderSection />
        <SellerReasonsSection />
        <TechnologiesSection />
        <MetricsSection />
        <FutureVisionSection />
        <CTASection />
        <PremiumFooter />
      </div>
    </main>
  );
}
