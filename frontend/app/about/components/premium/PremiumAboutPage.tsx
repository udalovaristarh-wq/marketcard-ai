"use client";

import PremiumHero from "./PremiumHero";
import {
  BeforeAfterSection,
  EcosystemPipelineSection,
  FinalCTASection,
  FounderSection,
  PremiumFooter,
  ResultsSection,
  StatsSection,
} from "./PremiumSections";
import styles from "./premium-about.module.css";

export default function PremiumAboutPage() {
  return (
    <main className={styles.pageShell}>
      <PremiumHero />
      <div className={styles.contentShell}>
        <StatsSection />
        <BeforeAfterSection />
        <EcosystemPipelineSection />
        <ResultsSection />
        <FounderSection />
        <FinalCTASection />
        <PremiumFooter />
      </div>
    </main>
  );
}
