"use client";

import PremiumHero from "./PremiumHero";
import {
  BeforeAfterSection,
  ContactSection,
  EcosystemPipelineSection,
  FeaturesSection,
  FinalCTASection,
  FounderSection,
  MissionSection,
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
        <MissionSection />
        <StatsSection />
        <FeaturesSection />
        <BeforeAfterSection />
        <EcosystemPipelineSection />
        <ResultsSection />
        <FounderSection />
        <ContactSection />
        <FinalCTASection />
        <PremiumFooter />
      </div>
    </main>
  );
}
