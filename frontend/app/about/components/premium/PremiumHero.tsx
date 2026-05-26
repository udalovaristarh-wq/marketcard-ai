"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { heroShots, metrics } from "./aboutContent";
import { PremiumButton } from "./SectionPrimitives";
import styles from "./premium-about.module.css";

export default function PremiumHero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroVideoLayer}>
        <video autoPlay muted loop playsInline aria-hidden="true">
          <source src="/bg.mp4" type="video/mp4" />
        </video>
      </div>

      <div className={styles.heroGradientLayer} aria-hidden="true" />
      <div className={styles.heroGridLayer} aria-hidden="true" />

      <motion.header
        initial={{ opacity: 0, x: "-50%", y: -16 }}
        animate={{ opacity: 1, x: "-50%", y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={styles.topbar}
      >
        <Link href="/" className={styles.brandMark} aria-label="MarketCard AI home">
          <span>MC</span>
          <strong>MarketCard AI</strong>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-300 md:flex">
          <a href="#ecosystem" className={styles.navLink}>
            Ecosystem
          </a>
          <a href="#pipeline" className={styles.navLink}>
            Pipeline
          </a>
          <a href="#integrations" className={styles.navLink}>
            Marketplaces
          </a>
          <a href="#vision" className={styles.navLink}>
            Vision
          </a>
        </nav>
        <Link href="/login" className={styles.loginButton}>
          Войти
        </Link>
      </motion.header>

      <div className={styles.heroShotStage} aria-hidden="true">
        {heroShots.map((src, index) => (
          <motion.div
            key={src}
            className={styles.heroShot}
            initial={{ opacity: 0, y: 42, rotate: index % 2 ? 7 : -7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.18 + index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              left: `${8 + index * 15}%`,
              top: index % 2 ? "16%" : "58%",
            }}
          >
            <Image src={src} alt="" width={260} height={340} priority={index < 2} />
          </motion.div>
        ))}
      </div>

      <div className={styles.heroContent}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className={styles.heroBadge}
        >
          AI SaaS for marketplace sellers
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.82, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className={styles.heroTitle}
          aria-label="MarketCard AI"
        >
          <span className={styles.heroTitleWord}>MarketCard</span>
          <span className={styles.heroTitleWord}>AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className={styles.heroSubtitle}
        >
          Премиальная AI-платформа, которая превращает фото товара в
          продающие карточки, SEO, аналитику и стратегию запуска для Uzum,
          Wildberries, Ozon и Yandex Market.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.46 }}
          className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <PremiumButton href="/register">Запустить платформу</PremiumButton>
          <PremiumButton href="/pricing" variant="secondary">
            Смотреть тарифы
          </PremiumButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.58 }}
          className={styles.heroMetrics}
        >
          {metrics.map((metric) => (
            <div key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
