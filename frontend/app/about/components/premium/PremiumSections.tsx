"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  beforeAfter,
  contacts,
  ecosystemCards,
  features,
  missionPoints,
  pipelineSteps,
  results,
  stats,
} from "./aboutContent";
import { Reveal, SectionHeader, SectionShell } from "./SectionPrimitives";
import styles from "./premium-about.module.css";

export function MissionSection() {
  return (
    <SectionShell id="mission">
      <SectionHeader
        eyebrow="Миссия"
        title="Мы убираем барьер между «есть товар» и «он продаётся на маркетплейсе»."
        text="MarketCard AI создан для продавцов, которым нужна скорость: быстрее собрать карточку, быстрее проверить гипотезу, быстрее выйти в продажи — без команды дизайнеров и копирайтеров."
        align="center"
      />
      <div className={styles.missionGrid}>
        {missionPoints.map((point, index) => (
          <Reveal key={point.title} delay={index * 0.06}>
            <motion.div whileHover={{ y: -6 }} className={styles.missionCard}>
              <span className={styles.missionIcon}>{point.icon}</span>
              <h3>{point.title}</h3>
              <p>{point.text}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

export function FeaturesSection() {
  return (
    <SectionShell id="features">
      <SectionHeader
        eyebrow="Возможности"
        title="Всё, что нужно продавцу — в одном workspace."
        text="Генерация, SEO, аудит, аналитика ниши и массовые операции. Не набор разрозненных инструментов, а единый поток запуска SKU."
        align="center"
      />
      <div className={styles.featuresGrid}>
        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 0.04}>
            <motion.div whileHover={{ y: -6 }} className={styles.featureCard}>
              <span>{feature.tag}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

export function StatsSection() {
  return (
    <SectionShell>
      <SectionHeader
        eyebrow="Цифры"
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
  const [position, setPosition] = useState(58);

  return (
    <SectionShell id="compare">
      <div className={styles.compareLayout}>
        <SectionHeader
          eyebrow="До / После"
          title="Из обычного фото в карточку, которая выглядит как работа сильной команды."
          text="Свайпер показывает идею продукта: продавец приносит исходник, MarketCard AI собирает визуальную подачу, смысловые акценты и marketplace-формат."
        />

        <Reveal delay={0.12}>
          <div className={styles.compareFrame}>
            <Image
              src={beforeAfter.before}
              alt="До генерации MarketCard AI"
              fill
              sizes="(max-width: 768px) 100vw, 680px"
              className={styles.compareImage}
              unoptimized
            />
            <div
              className={styles.compareAfter}
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
              <Image
                src={beforeAfter.after}
                alt="После генерации MarketCard AI"
                fill
                sizes="(max-width: 768px) 100vw, 680px"
                className={styles.compareImage}
                unoptimized
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
        eyebrow="Как это работает"
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
        eyebrow="Отзывы"
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
                  unoptimized
                />
                <span>{result.marketplace}</span>
              </div>
              <div className={styles.resultBody}>
                <div className={styles.resultTop}>
                  <span className={styles.stars}>★★★★★</span>
                  <strong>{result.metric}</strong>
                </div>
                <p>“{result.quote}”</p>
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
            <div className={styles.eyebrow}>Основатель</div>
            <h2>Основатель: Удалов Аристарх Александрович</h2>
            <p className={styles.founderLead}>Разработано командой MarketCard AI</p>
            <p>
              MarketCard AI создан вокруг реальной боли продавцов. Мы не просто
              генерируем картинки — мы строим операционную систему для запуска товаров
              на Uzum, Wildberries, Ozon и Yandex Market.
            </p>
          </div>
          <div className={styles.founderArtifact} aria-hidden="true">
            <span>MC</span>
            <strong>Seller OS</strong>
            <small>strategy / generation / SEO / audit</small>
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
          <div className={styles.eyebrow}>Старт</div>
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

export function ContactSection() {
  return (
    <SectionShell id="contact">
      <SectionHeader
        eyebrow="Контакты"
        title="Свяжитесь с командой MarketCard AI"
        text="Поддержка, партнёрство и вопросы по тарифам — мы на связи в Telegram, Instagram и по email."
        align="center"
      />
      <div className={styles.contactGrid}>
        {contacts.map((item, index) => (
          <Reveal key={item.label} delay={index * 0.05}>
            <motion.a
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              whileHover={{ y: -6 }}
              className={styles.contactCard}
            >
              <strong>{item.label}</strong>
              <span>{item.description}</span>
            </motion.a>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

export function PremiumFooter() {
  return (
    <footer className={styles.footer}>
      <div>
        <strong>MarketCard AI</strong>
        <span>AI для продавцов маркетплейсов Узбекистана и СНГ</span>
      </div>
      <nav>
        <Link href="/">Главная</Link>
        <Link href="/about">О нас</Link>
        <Link href="/pricing">Тарифы</Link>
        <a href="#contact">Контакты</a>
        <a href="https://t.me/marketcardai_support_bot" target="_blank" rel="noreferrer">
          Telegram
        </a>
        <a href="https://www.instagram.com/marketcard.ai" target="_blank" rel="noreferrer">
          Instagram
        </a>
      </nav>
    </footer>
  );
}
