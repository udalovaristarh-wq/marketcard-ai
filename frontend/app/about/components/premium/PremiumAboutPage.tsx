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
        <StatsSection />
        <div className={styles.sectionDivider} />
        <MissionSection />
        <div className={styles.sectionDivider} />
        <FeaturesSection />
        <div className={styles.sectionDivider} />
        <BeforeAfterSection />
        <div className={styles.sectionDivider} />
        <EcosystemPipelineSection />
        <div className={styles.sectionDivider} />
        <ResultsSection />
        <div className={styles.sectionDivider} />
        <FounderSection />
        <div className={styles.sectionDivider} />
        <ContactSection />
        <FinalCTASection />
        <PremiumFooter />
      </div>
    </main>
  );
}
