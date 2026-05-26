"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { heroShowcase, marketplaceLogos } from "./aboutContent";
import styles from "./premium-about.module.css";

export default function PremiumHero() {
  const [activeCard, setActiveCard] = useState(0);
  const orderedShowcase = [
    ...heroShowcase.slice(activeCard, activeCard + 1),
    ...heroShowcase.slice(activeCard + 1),
    ...heroShowcase.slice(0, activeCard),
  ];

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroVideoLayer} aria-hidden="true">
        <video autoPlay muted loop playsInline>
          <source src="/bg.mp4" type="video/mp4" />
        </video>
      </div>
      <div className={styles.heroGradientLayer} aria-hidden="true" />
      <div className={styles.heroGridLayer} aria-hidden="true" />
      <div className={styles.heroParticles} aria-hidden="true" />

      <motion.header
        className={styles.topbar}
        initial={{ opacity: 0, x: "-50%", y: -18 }}
        animate={{ opacity: 1, x: "-50%", y: 0 }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link href="/" className={styles.brandMark} aria-label="MarketCard AI">
          <span className={styles.brandLogoFrame}>
            <Image
              src="/logo.jpg"
              alt=""
              width={44}
              height={44}
              className={styles.brandLogo}
              priority
            />
          </span>
          <strong>MarketCard AI</strong>
        </Link>
        <nav className={styles.heroNav} aria-label="About navigation">
          <a href="#compare">До/После</a>
          <a href="#results">Результаты</a>
          <a href="#pipeline">Пайплайн</a>
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
          <div className={styles.heroBadge}>AI карточки для маркетплейсов</div>
          <h1 className={styles.heroTitle}>
            <span>Одно фото.</span>
            <span className={styles.gradientText}>Продающая карточка.</span>
            <span>Тысячи продаж.</span>
          </h1>
          <p className={styles.heroLead}>
            MarketCard AI превращает исходное фото товара в премиальные карточки, SEO,
            аудит и визуальную стратегию для Uzum, Wildberries, Ozon и Yandex Market.
          </p>

          <div className={styles.heroActions}>
            <motion.div whileHover={{ y: -3, scale: 1.015 }} whileTap={{ scale: 0.985 }}>
              <Link href="/register" className={styles.primaryButton}>
                Создать первую карточку →
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -3, scale: 1.015 }} whileTap={{ scale: 0.985 }}>
              <Link href="/pricing" className={styles.secondaryButton}>
                Смотреть тарифы
              </Link>
            </motion.div>
          </div>

          <div className={styles.heroTrustRow} aria-label="Marketplace integrations">
            {marketplaceLogos.map((marketplace) => (
              <div key={marketplace.name} className={styles.marketplacePill}>
                <Image src={marketplace.image} alt={marketplace.name} width={96} height={36} />
              </div>
            ))}
          </div>

          <div className={styles.heroMetricDock} aria-label="MarketCard AI launch system">
            <span>AI-визуал</span>
            <span>SEO-аудит</span>
            <span>Логика маркетплейса</span>
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
            <div className={styles.visualMesh} aria-hidden="true" />
            <div className={styles.generatorBeam} aria-hidden="true" />
            <div className={styles.visualTitle}>Студия генерации</div>
            <div className={styles.visualStack}>
              {orderedShowcase.map((src, slot) => {
                const originalIndex = heroShowcase.indexOf(src);

                return (
                  <button
                    key={src}
                    type="button"
                    className={styles.showcaseCard}
                    data-slot={slot}
                    onClick={(event) => {
                      setActiveCard(originalIndex);
                      event.currentTarget.blur();
                    }}
                    aria-label="Показать эту карточку первой"
                    style={{ zIndex: heroShowcase.length - slot }}
                  >
                    <Image
                      src={src}
                      alt="Пример карточки MarketCard AI"
                      width={280}
                      height={360}
                      priority={slot === 0}
                    />
                  </button>
                );
              })}
            </div>
            <div className={styles.showcaseDots} aria-hidden="true">
              {heroShowcase.map((src, index) => (
                <span key={src} data-active={index === activeCard} />
              ))}
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
