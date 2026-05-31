"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download, Layers, Upload, Wand2 } from "./icons";

const steps = [
  {
    step: "01",
    title: "Загрузка",
    subtitle: "Product Intake",
    description: "Загрузите фото товара в любом формате. AI автоматически определит категорию и оптимальный стиль.",
    icon: Upload,
    gradient: "from-cyan-500 to-cyan-400",
  },
  {
    step: "02",
    title: "AI-анализ",
    subtitle: "Deep Processing",
    description: "Нейросеть анализирует продукт, конкурентов и тренды. Формирует уникальное торговое предложение.",
    icon: Wand2,
    gradient: "from-purple-500 to-purple-400",
  },
  {
    step: "03",
    title: "Генерация",
    subtitle: "Card Assembly",
    description: "Создание профессиональной карточки с инфографикой, текстами и визуальными акцентами.",
    icon: Layers,
    gradient: "from-pink-500 to-pink-400",
  },
  {
    step: "04",
    title: "Экспорт",
    subtitle: "Multi-Platform",
    description: "Готовые карточки в форматах всех маркетплейсов. Одним кликом — на Uzum, WB, Ozon.",
    icon: Download,
    gradient: "from-emerald-500 to-emerald-400",
  },
];

export function PipelineSection() {
  return (
    <section id="pipeline" className="relative scroll-mt-28 overflow-hidden px-4 py-32">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/5 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <div className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-primary">
            <span className="uppercase tracking-wider">Ecosystem / Pipeline</span>
          </div>
          <h2 className="mb-6 text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
            <span className="text-foreground">От product intake</span>
            <br />
            <span className="text-foreground">до SEO-аудита в</span>
            <br />
            <span className="gradient-text">одном AI-потоке.</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            MarketCard AI работает как операционная система запуска товара: понимает продукт, создаёт визуал, адаптирует под платформу.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute top-24 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="glass relative h-full rounded-3xl p-6 transition-all duration-500 hover:bg-white/[0.04]">
                  <div className="relative mb-6">
                    <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${step.gradient} p-[1px]`}>
                      <div className="relative flex h-full w-full items-center justify-center rounded-2xl bg-background">
                        <step.icon className="h-6 w-6 text-foreground" />
                        <div className={`absolute -top-2 -right-2 rounded-md bg-gradient-to-r ${step.gradient} px-2 py-0.5 text-[10px] font-bold text-background`}>
                          {step.step}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{step.subtitle}</div>
                    <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="absolute top-[72px] -right-3 z-10 hidden h-6 w-6 items-center justify-center lg:flex">
                      <div className="glass flex h-6 w-6 items-center justify-center rounded-full">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <a
            href="/register"
            className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:opacity-90 glow-cyan"
          >
            Попробовать Pipeline
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
