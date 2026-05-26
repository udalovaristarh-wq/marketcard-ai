"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ecosystemItems,
  futurePoints,
  marketplaceLogos,
  pipelineSteps,
  sellerReasons,
  technologies,
} from "./aboutContent";
import {
  GlassPanel,
  PremiumButton,
  Reveal,
  SectionHeader,
  SectionShell,
} from "./SectionPrimitives";
import styles from "./premium-about.module.css";

export function StorySection() {
  return (
    <SectionShell>
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <SectionHeader
          eyebrow="Company"
          title="MarketCard AI строится как операционная система продавца."
          text="Мы не делаем ещё один генератор картинок. Мы собираем слой принятия решений вокруг товара: визуальная упаковка, SEO, экономика, конкурентная среда и подготовка к публикации."
        />
        <Reveal delay={0.12}>
          <GlassPanel className="p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/80">
                  Product belief
                </p>
                <p className="mt-4 text-2xl font-semibold leading-tight text-white">
                  AI должен не украшать карточку, а продавать товар быстрее.
                </p>
              </div>
              <p className="text-base leading-8 text-slate-300">
                MarketCard AI соединяет creative automation и marketplace
                intelligence. Продавец получает результат, который выглядит
                дорого, считывается быстро и экономит часы ручной работы.
              </p>
            </div>
          </GlassPanel>
        </Reveal>
      </div>
    </SectionShell>
  );
}

export function EcosystemSection() {
  return (
    <SectionShell id="ecosystem">
      <SectionHeader
        eyebrow="Ecosystem"
        title="Один продукт вместо набора разрозненных инструментов."
        text="MarketCard AI закрывает путь от сырого фото до готового marketplace asset pack."
        align="center"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ecosystemItems.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.04}>
            <motion.div whileHover={{ y: -7 }} className={styles.featurePanel}>
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

export function PipelineSection() {
  return (
    <SectionShell id="pipeline">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <SectionHeader
          eyebrow="Generation pipeline"
          title="AI-пайплайн, который думает как art director и marketplace analyst."
          text="Карточка не собирается случайным prompt. Сначала формируется brief, затем стиль, серия, формат, текстовые роли и финальный набор visual assets."
        />
        <Reveal delay={0.1}>
          <div className={styles.pipelineFrame}>
            {pipelineSteps.map((step, index) => (
              <motion.div
                key={step.step}
                className={styles.pipelineStep}
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <div className={styles.pipelineIndex}>{step.step}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
                {index < pipelineSteps.length - 1 && (
                  <div className={styles.pipelineConnector} aria-hidden="true" />
                )}
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}

export function MarketplaceIntegrationsSection() {
  return (
    <SectionShell id="integrations">
      <SectionHeader
        eyebrow="Marketplace integrations"
        title="Форматы и логика под каждую площадку."
        text="Платформа учитывает контекст продажи: пропорции, язык, плотность информации, ожидания покупателей и визуальный стандарт площадки."
        align="center"
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {marketplaceLogos.map((marketplace, index) => (
          <Reveal key={marketplace.name} delay={index * 0.05}>
            <motion.div whileHover={{ y: -8, scale: 1.01 }} className={styles.marketplacePanel}>
              <div className={styles.marketplaceLogoWrap}>
                <Image
                  src={marketplace.image}
                  alt={`${marketplace.name} logo`}
                  width={190}
                  height={80}
                />
              </div>
              <h3>{marketplace.name}</h3>
              <p>{marketplace.detail}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

export function FounderSection() {
  return (
    <SectionShell>
      <GlassPanel className={styles.founderPanel}>
        <Reveal>
          <div className="max-w-3xl">
            <div className={styles.eyebrow}>Founder</div>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-normal text-white md:text-6xl">
              Основано вокруг реальной боли продавцов.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              MarketCard AI создан Удаловым Аристархом Александровичем как
              продукт для предпринимателей, которым нужно запускать товары
              быстрее, выглядеть сильнее конкурентов и тратить меньше времени
              на рутину контента.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className={styles.founderSignature}>
            <span>Founder vision</span>
            <strong>AI не заменяет продавца. AI делает его командой.</strong>
          </div>
        </Reveal>
      </GlassPanel>
    </SectionShell>
  );
}

export function SellerReasonsSection() {
  return (
    <SectionShell>
      <SectionHeader
        eyebrow="Why sellers use it"
        title="Продавцы используют MarketCard AI, потому что скорость стала преимуществом."
        text="Побеждает не тот, кто дольше полирует карточку, а тот, кто быстрее тестирует визуалы, цены, ниши и офферы."
      />
      <div className="grid gap-4 lg:grid-cols-4">
        {sellerReasons.map((reason, index) => (
          <Reveal key={reason} delay={index * 0.05}>
            <div className={styles.reasonPanel}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{reason}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

export function TechnologiesSection() {
  return (
    <SectionShell>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <SectionHeader
          eyebrow="AI technologies"
          title="Внутри: vision, generation, SEO и аналитика."
          text="Технологический слой MarketCard AI объединяет мультимодальные модели, marketplace rules, анализ товара, визуальное планирование и расчёт себестоимости генераций."
        />
        <Reveal delay={0.1}>
          <div className={styles.techMatrix}>
            {technologies.map((tech, index) => (
              <motion.div
                key={tech}
                whileHover={{ scale: 1.04, y: -4 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {tech}
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}

export function MetricsSection() {
  const rows = [
    ["Visual generation", "Product-first AI cards"],
    ["Listing content", "SEO title, descriptions, characteristics"],
    ["Market analysis", "Demand, competition, recommended price"],
    ["Financial layer", "Margin, ROI, launch strategy"],
  ];

  return (
    <SectionShell>
      <SectionHeader
        eyebrow="Operating metrics"
        title="Платформа измеряется не картинками, а запуском товара."
        text="MarketCard AI строит production-путь, где каждая генерация связана с экономикой, лимитами, качеством и дальнейшими действиями продавца."
        align="center"
      />
      <Reveal>
        <div className={styles.metricsTable}>
          {rows.map(([left, right]) => (
            <div key={left}>
              <span>{left}</span>
              <strong>{right}</strong>
            </div>
          ))}
        </div>
      </Reveal>
    </SectionShell>
  );
}

export function FutureVisionSection() {
  return (
    <SectionShell id="vision">
      <div className={styles.visionBand}>
        <SectionHeader
          eyebrow="Future vision"
          title="Следующая версия marketplace commerce будет AI-native."
          text="MarketCard AI движется к системе, где продавец загружает каталог, а платформа помогает выбрать нишу, упаковать товар, рассчитать цену и подготовить публикацию."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {futurePoints.map((point, index) => (
            <Reveal key={point} delay={index * 0.05}>
              <div className={styles.futurePoint}>{point}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

export function CTASection() {
  return (
    <SectionShell>
      <Reveal>
        <div className={styles.ctaPanel}>
          <div>
            <div className={styles.eyebrow}>Launch</div>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-normal text-white md:text-6xl">
              Создайте карточку товара, которая выглядит как работа дорогой команды.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Начните с одного фото. MarketCard AI соберёт визуал, SEO и
              marketplace-ready asset pack для запуска продаж.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <PremiumButton href="/register">Создать аккаунт</PremiumButton>
            <PremiumButton href="/pricing" variant="secondary">
              Выбрать тариф
            </PremiumButton>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}

export function PremiumFooter() {
  return (
    <footer className={styles.footer}>
      <div>
        <strong>MarketCard AI</strong>
        <span>AI SaaS platform for marketplace sellers</span>
      </div>
      <nav>
        <Link href="/">Главная</Link>
        <Link href="/pricing">Тарифы</Link>
        <Link href="/terms">Оферта</Link>
        <Link href="/privacy">Privacy</Link>
      </nav>
    </footer>
  );
}
