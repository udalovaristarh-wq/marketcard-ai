"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap } from "./icons";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24 pb-16">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 h-96 w-96 animate-pulse rounded-full bg-cyan-500/20 blur-[128px]" />
        <div className="absolute top-1/3 right-0 h-[500px] w-[500px] animate-pulse rounded-full bg-purple-500/15 blur-[128px] delay-1000" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 animate-pulse rounded-full bg-pink-500/10 blur-[100px] delay-500" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="uppercase tracking-wider">AI карточки для маркетплейсов</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              <span className="text-foreground">Одно фото.</span>
              <br />
              <span className="gradient-text-cyan">Продающая</span>
              <br />
              <span className="gradient-text-pink">карточка.</span>
              <br />
              <span className="text-foreground">Тысячи продаж.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mb-8 max-w-md text-lg text-muted-foreground lg:mx-0"
            >
              Превращаем ваши фотографии товаров в профессиональные карточки для Uzum, Wildberries, Ozon и Yandex Market.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
            >
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-8 py-4 text-base font-semibold text-background transition-all duration-300 hover:opacity-90 glow-cyan"
              >
                Начать бесплатно
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="#before-after" className="glass inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-medium text-foreground transition-all duration-300 hover:bg-white/5">
                Смотреть примеры
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            >
              {["Uzum", "Wildberries", "Ozon", "Yandex Market"].map((marketplace) => (
                <div key={marketplace} className="glass rounded-xl px-4 py-2 text-xs font-medium text-muted-foreground">
                  {marketplace}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="glass absolute -top-4 -right-4 z-20 flex items-center gap-3 rounded-2xl px-4 py-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">25 сек</div>
                  <div className="text-xs text-muted-foreground">до результата</div>
                </div>
              </motion.div>

              <div className="glass-strong overflow-hidden rounded-3xl p-1">
                <div className="overflow-hidden rounded-[22px] bg-card/50">
                  <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-500/60" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                      <div className="h-3 w-3 rounded-full bg-green-500/60" />
                    </div>
                    <div className="flex-1 text-center text-xs text-muted-foreground">MarketCard AI Studio</div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">До</div>
                        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-gray-800 to-gray-900">
                          <Image src="/about/lacoste-lhomme-source.png" alt="Исходное фото товара" fill sizes="(max-width: 768px) 45vw, 260px" className="object-contain p-4" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs text-primary">После</div>
                        <div className="relative aspect-square overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-cyan-900/30 to-purple-900/30">
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />
                          <Image src="/examples/2.webp" alt="Карточка MarketCard AI" fill sizes="(max-width: 768px) 45vw, 260px" className="object-cover" />
                          <div className="absolute top-2 right-2 rounded-md bg-primary/20 px-2 py-1 text-[10px] font-medium text-primary">AI</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Генерация карточки...</span>
                        <span className="text-primary">100%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
