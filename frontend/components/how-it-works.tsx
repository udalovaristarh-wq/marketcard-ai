"use client";

import { motion } from "framer-motion";
import { ArrowRight, MousePointer2, Sparkles, Upload } from "@/components/icons";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Загрузи фото",
    description:
      "Добавь исходник товара с любого ракурса. AI распознает категорию, форму, цвет и ключевые детали продукта.",
    gradient: "from-cyan-300 to-sky-500",
  },
  {
    number: "02",
    icon: MousePointer2,
    title: "Выбери маркетплейс",
    description:
      "Uzum, Wildberries, Ozon или Yandex Market. Дизайн адаптируется под формат, визуальную подачу и требования площадки.",
    gradient: "from-violet-400 to-fuchsia-500",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Получи результат",
    description:
      "За секунды получи готовую карточку с инфографикой, офферами, SEO-логикой и продающей визуальной иерархией.",
    gradient: "from-emerald-300 to-cyan-400",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden px-4 py-24 sm:px-6 md:py-32">
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.07] blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-cyan-200/70">AI Workflow</p>
          <h2 className="text-3xl font-black leading-tight text-white sm:text-5xl">
            Как это <span className="gradient-text">работает</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/[0.58]">
            Три шага от обычного фото до карточки, которая готова к запуску на маркетплейсе.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.12 }}
              className="group relative"
            >
              {index < steps.length - 1 ? (
                <div className="absolute right-[-32px] top-1/2 z-10 hidden h-px w-16 bg-gradient-to-r from-white/22 to-transparent md:block">
                  <ArrowRight className="absolute -right-1 -top-2 h-4 w-4 text-white/35" />
                </div>
              ) : null}

              <div className="premium-reflection relative h-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-2xl transition duration-500 hover:-translate-y-1 hover:border-white/18 hover:bg-white/[0.07]">
                <span className="absolute right-5 top-4 text-7xl font-black leading-none text-white/[0.035]">
                  {step.number}
                </span>
                <div className={`mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} text-black shadow-[0_0_32px_rgba(56,189,248,0.24)] transition duration-500 group-hover:scale-110`}>
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black text-white">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/[0.58]">{step.description}</p>
                <div className={`absolute inset-0 -z-10 rounded-[1.75rem] bg-gradient-to-br ${step.gradient} opacity-0 blur-2xl transition duration-500 group-hover:opacity-10`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
