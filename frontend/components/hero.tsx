"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Timer, Zap } from "@/components/icons";

const marketplaceNames = ["Uzum", "Wildberries", "Ozon", "Yandex Market"];

const showcaseCards = [
  { src: "/showcase/wb/1.webp", title: "Market visual", rotate: "-rotate-6", z: "z-30" },
  { src: "/showcase/wb/5.webp", title: "AI card", rotate: "rotate-3", z: "z-20" },
  { src: "/showcase/wb/8.webp", title: "Product launch", rotate: "rotate-[8deg]", z: "z-10" },
];

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:pt-32">
      <div className="absolute inset-0 overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-[0.16]"
          src="/bg.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(56,189,248,0.22),transparent_34%),radial-gradient(circle_at_80%_35%,rgba(168,85,247,0.24),transparent_32%),linear-gradient(180deg,rgba(6,7,18,0.62),#090914_78%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4 }}
          className="absolute -left-40 top-24 h-[520px] w-[520px] rounded-full bg-cyan-400/18 blur-[130px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.25 }}
          className="absolute -right-48 bottom-12 h-[620px] w-[620px] rounded-full bg-fuchsia-500/18 blur-[140px]"
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200 shadow-[0_0_40px_rgba(34,211,238,0.13)]">
            <Sparkles className="h-4 w-4" />
            AI для Uzum, Wildberries, Ozon
          </div>

          <h1 className="mx-auto max-w-5xl text-4xl font-black leading-[0.98] tracking-tight text-white sm:text-6xl lg:mx-0 lg:text-7xl xl:text-8xl">
            Одно фото
            <span className="mx-3 inline-flex h-10 w-10 translate-y-1 items-center justify-center rounded-full border border-cyan-300/25 bg-white/[0.08] text-cyan-200 sm:h-14 sm:w-14">
              <ArrowRight className="h-5 w-5 sm:h-7 sm:w-7" />
            </span>
            <br />
            <span className="gradient-text animate-gradient-x text-glow">Продающая карточка</span>
            <br />
            за 35-40 секунд
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/[0.62] sm:text-lg lg:mx-0">
            MarketCard AI создает премиальную инфографику, SEO-тексты и дизайн карточек,
            который выглядит дороже конкурентов и быстрее выводит товар в продажи.
          </p>

          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <Link
              href="/register"
              className="premium-reflection inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-500 px-8 py-4 text-base font-black text-black shadow-[0_0_44px_rgba(56,189,248,0.42)] transition hover:scale-[1.02] sm:w-auto"
            >
              Создать карточку бесплатно
              <Zap className="h-5 w-5" />
            </Link>
            <a
              href="#examples"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.035] px-8 py-4 text-base font-semibold text-white transition hover:border-white/22 hover:bg-white/[0.07] sm:w-auto"
            >
              Смотреть примеры
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 text-sm text-white/[0.62] sm:grid-cols-3">
            <div className="glass rounded-2xl px-4 py-3">
              <Timer className="mb-2 h-5 w-5 text-cyan-300" />
              <span className="font-semibold text-white">35-40 сек</span> до первого результата
            </div>
            <div className="glass rounded-2xl px-4 py-3">
              <Zap className="mb-2 h-5 w-5 text-fuchsia-300" />
              <span className="font-semibold text-white">+300%</span> к визуальной силе карточки
            </div>
            <div className="glass rounded-2xl px-4 py-3">
              <Sparkles className="mb-2 h-5 w-5 text-emerald-300" />
              SEO, инфографика и marketplace-логика
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[590px]"
        >
          <div className="absolute -right-2 top-3 z-40 hidden h-32 w-32 items-center justify-center rounded-full border border-violet-200/70 bg-violet-400/10 text-center shadow-[0_0_42px_rgba(168,85,247,0.78),inset_0_0_32px_rgba(255,255,255,0.12)] backdrop-blur-xl sm:flex">
            <div>
              <div className="text-3xl font-light text-white">35-40 сек</div>
              <div className="mt-1 text-xs leading-tight text-white/70">до готовой карточки</div>
            </div>
          </div>

          <div className="relative h-[520px] sm:h-[610px]">
            {showcaseCards.map((card, index) => (
              <motion.div
                key={card.src}
                animate={{ y: [0, index % 2 === 0 ? -14 : 12, 0] }}
                transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute left-1/2 top-1/2 ${card.z} w-[68%] max-w-[360px] -translate-x-1/2 -translate-y-1/2 ${card.rotate}`}
                style={{
                  marginLeft: `${(index - 1) * 86}px`,
                  marginTop: `${index * 18}px`,
                }}
              >
                <div className="premium-reflection rounded-[2rem] bg-gradient-to-br from-cyan-300 via-violet-400 to-fuchsia-400 p-[1.5px] shadow-[0_0_55px_rgba(56,189,248,0.32)]">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.9rem] bg-black">
                    <Image
                      src={card.src}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 70vw, 360px"
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/[0.34] via-transparent to-white/[0.08]" />
                    {index === 0 ? (
                      <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/12 bg-black/38 p-3 backdrop-blur-xl">
                        <div className="text-xs uppercase tracking-[0.28em] text-cyan-200">AI card ready</div>
                        <div className="mt-1 text-lg font-black text-white">MarketCard Studio</div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-4 rounded-full border border-white/10 bg-white/[0.035] px-5 py-3 backdrop-blur-xl lg:flex"
      >
        <span className="text-xs uppercase tracking-[0.26em] text-white/[0.42]">Работает с</span>
        {marketplaceNames.map((name) => (
          <span key={name} className="text-sm font-semibold text-white/[0.72]">
            {name}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
