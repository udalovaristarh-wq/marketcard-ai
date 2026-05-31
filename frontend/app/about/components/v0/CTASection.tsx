"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "./icons";

export function CTASection() {
  return (
    <section className="relative overflow-hidden px-4 py-32">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-cyan-500/5" />
        <div className="absolute bottom-0 left-1/2 h-[500px] w-full max-w-3xl -translate-x-1/2 rounded-full bg-gradient-to-t from-cyan-500/20 via-purple-500/10 to-transparent blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Начните прямо сейчас</span>
          </div>

          <h2 className="mb-6 text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
            <span className="text-foreground">Готовы превратить</span>
            <br />
            <span className="gradient-text">фото в продажи?</span>
          </h2>

          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
            Присоединяйтесь к тысячам продавцов, которые уже используют MarketCard AI для создания премиальных карточек товаров.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-8 py-4 text-base font-semibold text-background transition-all duration-300 hover:opacity-90 glow-cyan"
            >
              Создать карточку бесплатно
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="https://t.me/marketcardai_support_bot" target="_blank" rel="noreferrer" className="glass inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-medium text-foreground transition-all duration-300 hover:bg-white/5">
              Связаться с нами
            </a>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
            <div className="text-center">
              <div className="gradient-text-cyan text-2xl font-bold">10,000+</div>
              <div className="text-xs text-muted-foreground">Активных продавцов</div>
            </div>
            <div className="hidden h-8 w-px bg-border sm:block" />
            <div className="text-center">
              <div className="gradient-text text-2xl font-bold">200K+</div>
              <div className="text-xs text-muted-foreground">Карточек создано</div>
            </div>
            <div className="hidden h-8 w-px bg-border sm:block" />
            <div className="text-center">
              <div className="gradient-text-pink text-2xl font-bold">98%</div>
              <div className="text-xs text-muted-foreground">Довольных клиентов</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
