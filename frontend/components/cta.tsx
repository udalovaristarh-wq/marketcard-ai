"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "@/components/icons";

export function CTA() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 md:py-32">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
        <div className="absolute left-1/2 top-1/2 h-[430px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.13] blur-[120px]" />
        <div className="absolute left-1/3 top-1/2 h-[340px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/[0.13] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="premium-reflection relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.055] p-8 text-center backdrop-blur-2xl sm:p-12 lg:p-16"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute right-8 top-8 h-20 w-20 rounded-full border border-cyan-300/18"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-8 left-8 h-16 w-16 rounded-full border border-fuchsia-300/18"
          />

          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-300 to-fuchsia-500 text-black shadow-[0_0_42px_rgba(56,189,248,0.38)]">
            <Sparkles className="h-8 w-8" />
          </div>

          <h2 className="mx-auto max-w-4xl text-3xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            Готов увеличить <span className="gradient-text">продажи</span>?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/60">
            Присоединяйся к продавцам, которые уже используют MarketCard AI для быстрых запусков и премиальных карточек.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="premium-reflection inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-fuchsia-500 px-8 py-4 text-base font-black text-black shadow-[0_0_42px_rgba(56,189,248,0.38)] transition hover:scale-[1.02] sm:w-auto"
            >
              Посмотреть тарифы
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center rounded-2xl border border-white/12 bg-white/[0.04] px-8 py-4 text-base font-semibold text-white transition hover:bg-white/[0.08] sm:w-auto"
            >
              Попробовать бесплатно
            </Link>
          </div>

          <p className="mt-6 text-sm text-white/[0.42]">Не нужна карта • 5 карточек бесплатно • Отмена в любой момент</p>
        </motion.div>
      </div>
    </section>
  );
}
