"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { heroShowcase, marketplaceLogos } from "./aboutContent";
import styles from "./premium-about.module.css";

export default function PremiumHero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroMeshLayer} aria-hidden="true" />
      <div className={styles.heroGradientLayer} aria-hidden="true" />
      <div className={styles.heroGridLayer} aria-hidden="true" />

      <motion.header
        className={styles.topbar}
        initial={{ opacity: 0, x: "-50%", y: -18 }}
        animate={{ opacity: 1, x: "-50%", y: 0 }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link href="/" className={styles.brandMark} aria-label="MarketCard AI">
          <span>MC</span>
          <strong>MarketCard AI</strong>
        </Link>
        <nav className={styles.heroNav} aria-label="Навигация">
          <Link href="/">Главная</Link>
          <a href="#mission">Миссия</a>
          <a href="#compare">До/После</a>
          <a href="#results">Кейсы</a>
          <Link href="/pricing">Тарифы</Link>
        </nav>
        <Link href="/login" className={styles.loginButton}>
          Войти
        </Link>
      </motion.header>

      <div className={styles.heroShell}>
        <motion.div
          className={styles.heroCopy}
          initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.82, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.heroBadge}>О MarketCard AI</div>
          <h1 className={styles.heroTitle}>
            <span>Одно фото.</span>
            <span className={styles.gradientText}>Продающая карточка.</span>
            <span>Тысячи продаж.</span>
          </h1>
          <p className={styles.heroLead}>
            Мы строим AI-платформу для продавцов маркетплейсов: от исходного фото до
            премиальных карточек, SEO-текстов, аудита и стратегии запуска на Uzum,
            Wildberries, Ozon и Yandex Market.
          </p>

          <div className={styles.heroActions}>
            <motion.div whileHover={{ y: -3, scale: 1.015 }} whileTap={{ scale: 0.985 }}>
              <Link href="/register" className={styles.primaryButton}>
                Начать бесплатно →
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -3, scale: 1.015 }} whileTap={{ scale: 0.985 }}>
              <Link href="/pricing" className={styles.secondaryButton}>
                Тарифы
              </Link>
            </motion.div>
          </div>

          <div className={styles.heroTrustRow} aria-label="Маркетплейсы">
            {marketplaceLogos.map((marketplace) => (
              <div key={marketplace.name} className={styles.marketplacePill}>
                <Image
                  src={marketplace.image}
                  alt={marketplace.name}
                  width={96}
                  height={36}
                  unoptimized
                />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={styles.heroVisual}
          initial={{ opacity: 0, x: 48, rotateX: 10 }}
          animate={{ opacity: 1, x: 0, rotateX: 0 }}
          transition={{ duration: 0.95, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.visualAura} aria-hidden="true" />
          <div className={styles.generatorWindow}>
            <div className={styles.windowChrome}>
              <span />
              <span />
              <span />
              <strong>MarketCard AI Studio</strong>
            </div>
            <div className={styles.visualStack}>
              {heroShowcase.map((src, index) => (
                <div
                  key={src}
                  className={styles.showcaseCard}
                  style={{ zIndex: heroShowcase.length - index }}
                >
                  <Image
                    src={src}
                    alt="Пример карточки MarketCard AI"
                    width={280}
                    height={360}
                    priority={index === 0}
                    unoptimized
                  />
                </div>
              ))}
            </div>
            <div className={styles.promptPanel}>
              <span>AI Pipeline</span>
              <strong>фото товара → art direction → карточка для маркетплейса</strong>
              <div className={styles.aiProgress}>
                <i />
              </div>
            </div>
          </div>
          <div className={styles.orbitBadge}>
            <span>25 сек</span>
            <small>до первого результата</small>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
