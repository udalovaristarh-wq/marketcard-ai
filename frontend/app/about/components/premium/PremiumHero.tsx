"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { heroShowcase, marketplaceLogos, navLinks } from "./aboutContent";
import styles from "./premium-about.module.css";

export default function PremiumHero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroMeshLayer} aria-hidden="true" />
      <div className={styles.heroGradientLayer} aria-hidden="true" />
      <div className={styles.heroGridLayer} aria-hidden="true" />
      <div className={styles.heroNoise} aria-hidden="true" />

      <header className={styles.topbar}>
        <Link href="/" className={styles.brandMark} aria-label="MarketCard AI">
          <span>MC</span>
          <strong>MarketCard AI</strong>
        </Link>

        <nav className={styles.heroNav} aria-label="Навигация">
          <Link href="/">Главная</Link>
          {navLinks.map((link) =>
            link.external ? (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ) : (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            )
          )}
        </nav>

        <div className={styles.topbarActions}>
          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={menuOpen}
            aria-label="Меню"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
          <Link href="/login" className={styles.loginButton}>
            Войти
          </Link>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <Link href="/" onClick={() => setMenuOpen(false)}>
              Главная
            </Link>
            {navLinks.map((link) =>
              link.external ? (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              )
            )}
            <Link href="/login" className={styles.loginButton} onClick={() => setMenuOpen(false)}>
              Войти
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.heroShell}>
        <motion.div
          className={styles.heroCopy}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.heroBadge}>
            <span className={styles.badgeDot} />
            О MarketCard AI
          </div>
          <h1 className={styles.heroTitle}>
            <span>Одно фото.</span>
            <span className={styles.gradientText}>Продающая карточка.</span>
            <span className={styles.heroTitleAccent}>Тысячи продаж.</span>
          </h1>
          <p className={styles.heroLead}>
            AI-платформа для продавцов Uzum, Wildberries, Ozon и Yandex Market:
            карточки, SEO, аудит и запуск SKU без команды дизайнеров.
          </p>

          <div className={styles.heroActions}>
            <Link href="/register" className={styles.primaryButton}>
              Начать бесплатно →
            </Link>
            <Link href="/pricing" className={styles.secondaryButton}>
              Тарифы
            </Link>
          </div>

          <div className={styles.heroTrustRow}>
            {marketplaceLogos.map((mp) => (
              <div key={mp.name} className={styles.marketplacePill} title={mp.name}>
                <Image
                  src={mp.image}
                  alt={mp.name}
                  width={88}
                  height={32}
                  unoptimized
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.display = "none";
                    const parent = el.parentElement;
                    if (parent && !parent.querySelector("[data-fallback]")) {
                      const span = document.createElement("span");
                      span.dataset.fallback = "1";
                      span.textContent = mp.name;
                      span.className = styles.marketplaceFallback;
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={styles.heroVisual}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.visualAura} aria-hidden="true" />
          <div className={styles.bentoGrid}>
            <div className={styles.bentoMain}>
              <Image
                src={heroShowcase.main}
                alt="Пример AI-карточки"
                fill
                className={styles.bentoImage}
                priority
                unoptimized
              />
              <div className={styles.bentoMainOverlay}>
                <span>AI Card Studio</span>
                <strong>Готово к публикации</strong>
              </div>
            </div>
            <div className={styles.bentoSide}>
              <div className={styles.bentoThumb}>
                <Image
                  src={heroShowcase.secondary}
                  alt=""
                  fill
                  className={styles.bentoImage}
                  unoptimized
                />
              </div>
              <div className={styles.bentoThumb}>
                <Image
                  src={heroShowcase.tertiary}
                  alt=""
                  fill
                  className={styles.bentoImage}
                  unoptimized
                />
              </div>
            </div>
          </div>

          <div className={styles.floatingBadge}>
            <span className={styles.floatingValue}>25 сек</span>
            <small>до первого результата</small>
          </div>
          <div className={styles.floatingBadgeAlt}>
            <span className={styles.floatingValue}>4 MP</span>
            <small>один workflow</small>
          </div>
        </motion.div>
      </div>

      <a href="#mission" className={styles.scrollHint} aria-label="Прокрутить вниз">
        <span />
      </a>
    </section>
  );
}
