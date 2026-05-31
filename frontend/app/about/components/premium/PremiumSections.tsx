"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  beforeAfter,
  ecosystemCards,
  pipelineSteps,
  results,
  stats,
} from "./aboutContent";
import { Reveal, SectionHeader, SectionShell } from "./SectionPrimitives";
import styles from "./premium-about.module.css";

export function StatsSection() {
  return (
    <SectionShell>
      <SectionHeader
        eyebrow="Метрики"
        title="Цифры, которые продавец чувствует в запуске."
        text="MarketCard AI создан не для красивой презентации, а для скорости: быстрее собрать карточку, быстрее проверить гипотезу, быстрее выйти в продажи."
        align="center"
      />
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 0.05}>
            <motion.div whileHover={{ y: -8 }} className={styles.statCard}>
              <div className={styles.statGlow} aria-hidden="true" />
              <strong className={styles.statValue}>
                {stat.value}
                {stat.suffix && <small>{stat.suffix}</small>}
              </strong>
              <span className={styles.statLabel}>{stat.label}</span>
              <p>{stat.text}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

export function BeforeAfterSection() {
  const [position, setPosition] = useState(46);

  return (
    <SectionShell id="compare">
      <div className={styles.compareLayout}>
        <SectionHeader
          eyebrow="До / После"
          title="До и после без обрезания товара, с нормальной премиальной подачей."
          text="Свайпер показывает идею продукта: продавец приносит исходник, MarketCard AI собирает визуальную подачу, смысловые акценты и marketplace-формат."
        />

        <Reveal delay={0.12}>
          <div className={styles.compareFrame}>
            <div className={styles.compareBackdrop} aria-hidden="true" />
            <Image
              src={beforeAfter.before}
              alt="До генерации MarketCard AI"
              fill
              sizes="(max-width: 768px) 100vw, 680px"
              className={styles.compareImage}
            />
            <div
              className={styles.compareAfter}
              style={{ clipPath: `inset(0 0 0 ${position}%)` }}
            >
              <Image
                src={beforeAfter.after}
                alt="После генерации MarketCard AI"
                fill
                sizes="(max-width: 768px) 100vw, 680px"
                className={styles.compareImage}
              />
            </div>
            <div className={styles.compareLabels}>
              <span>До</span>
              <span>После • MarketCard AI</span>
            </div>
            <div className={styles.compareDivider} style={{ left: `${position}%` }}>
              <span />
            </div>
            <input
              aria-label="Сравнить до и после"
              className={styles.compareRange}
              max="92"
              min="8"
              type="range"
              value={position}
              onChange={(event) => setPosition(Number(event.target.value))}
            />
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}

export function EcosystemPipelineSection() {
  return (
    <SectionShell id="pipeline">
      <SectionHeader
        eyebrow="Экосистема / Пайплайн"
        title="От product intake до SEO-аудита в одном AI-потоке."
        text="MarketCard AI работает как операционная система запуска товара: понимает продукт, рынок, визуальную стратегию, генерацию и качество финального ассета."
        align="center"
      />

      <div className={styles.pipelineGrid}>
        <Reveal>
          <div className={styles.pipelineMap}>
            {pipelineSteps.map((step, index) => (
              <motion.div
                key={step.title}
                className={styles.pipelineStep}
                whileHover={{ x: 7, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <div className={styles.stepIndex}>{String(index + 1).padStart(2, "0")}</div>
                <div className={styles.stepBody}>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <div className={styles.ecosystemCards}>
          {ecosystemCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.06}>
              <motion.div whileHover={{ y: -8 }} className={styles.ecosystemCard}>
                <span>{card.accent}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

export function ResultsSection() {
  return (
    <SectionShell id="results">
      <SectionHeader
        eyebrow="Отзывы / Результаты"
        title="Продавцы используют MarketCard AI, когда скорость стала преимуществом."
        text="Карточки, тексты и визуальные гипотезы перестают быть узким местом. Команда быстрее тестирует офферы и запускает SKU."
      />
      <div className={styles.resultsGrid}>
        {results.map((result, index) => (
          <Reveal key={result.author} delay={index * 0.06}>
            <motion.article whileHover={{ y: -9 }} className={styles.resultCard}>
              <div className={styles.resultImage}>
                <Image
                  src={result.image}
                  alt={`Кейс ${result.marketplace}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                />
                <span>{result.marketplace}</span>
              </div>
              <div className={styles.resultBody}>
                <div className={styles.resultTop}>
                  <span className={styles.stars}>★★★★★</span>
                  <strong>{result.metric}</strong>
                </div>
                <p>{result.quote}</p>
                <small>{result.author}</small>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

export function FounderSection() {
  return (
    <SectionShell>
      <Reveal>
        <div className={styles.founderPanel}>
          <div>
            <div className={styles.eyebrow}>Founder</div>
            <h2>Основатель: Удалов Аристарх Александрович</h2>
            <p className={styles.founderLead}>Разработано командой MarketCard AI</p>
            <p>
              MarketCard AI создан вокруг реальной боли продавцов. Мы не просто
              генерируем картинки — мы строим операционную систему для запуска товаров
              на Uzum, Wildberries, Ozon и Yandex Market.
            </p>
          </div>
          <div className={styles.founderArtifact} aria-hidden="true">
            <span>
              <Image src="/logo.jpg" alt="" width={150} height={150} />
            </span>
            <strong>ОС продавца</strong>
            <small>стратегия / генерация / SEO / аудит</small>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}

export function FinalCTASection() {
  return (
    <SectionShell>
      <Reveal>
        <div className={styles.ctaPanel}>
          <div className={styles.ctaGlow} aria-hidden="true" />
          <div className={styles.eyebrow}>Быстрый запуск</div>
          <h2>Готов запускать товары быстрее конкурентов?</h2>
          <p>
            Загрузите фото товара и получите первую AI-карточку, которую можно тестировать
            на маркетплейсе уже сегодня.
          </p>
          <Link href="/register" className={styles.primaryButton}>
            Создать первую карточку →
          </Link>
        </div>
      </Reveal>
    </SectionShell>
  );
}

export function PremiumFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerBrand}>
        <Image src="/logo.jpg" alt="MarketCard AI" width={58} height={58} className={styles.footerLogo} />
        <div>
          <strong>MarketCard AI</strong>
          <span>Премиальная AI-платформа для продавцов маркетплейсов</span>
        </div>
      </div>
      <nav>
        <Link href="/">Главная</Link>
        <Link href="/pricing">Тарифы</Link>
        <a
          className={styles.socialLink}
          href="https://t.me/marketcardai_support_bot"
          target="_blank"
          rel="noreferrer"
        >
          <Image src="/social/telegram.svg" alt="" width={20} height={20} />
          Telegram
        </a>
        <a
          className={styles.socialLink}
          href="https://www.instagram.com/marketcard.ai"
          target="_blank"
          rel="noreferrer"
        >
          <Image src="/social/instagram.svg" alt="" width={20} height={20} />
          Instagram
        </a>
      </nav>
    </footer>
  );
}
