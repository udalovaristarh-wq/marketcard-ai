"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Crown, Sparkles, Zap } from "@/components/icons";

const plans = [
  {
    name: "Старт",
    price: "Бесплатно",
    period: "",
    description: "Попробуй возможности AI",
    features: ["5 карточек в месяц", "Базовые шаблоны", "Водяной знак", "Email поддержка"],
    cta: "Начать бесплатно",
    popular: false,
    icon: Sparkles,
    gradient: "from-slate-400 to-slate-600",
  },
  {
    name: "Про",
    price: "990,000",
    period: "сум/мес",
    description: "Для активных продавцов",
    features: [
      "100 карточек в месяц",
      "Все премиум шаблоны",
      "Без водяного знака",
      "SEO-тексты",
      "Приоритетная поддержка",
      "API доступ",
    ],
    cta: "Выбрать Про",
    popular: true,
    icon: Zap,
    gradient: "from-cyan-300 to-fuchsia-500",
  },
  {
    name: "Бизнес",
    price: "2,990,000",
    period: "сум/мес",
    description: "Для команд и агентств",
    features: [
      "Безлимитные карточки",
      "Все премиум функции",
      "Командный доступ",
      "Персональный менеджер",
      "Кастомные шаблоны",
      "White-label решение",
    ],
    cta: "Связаться с нами",
    popular: false,
    icon: Crown,
    gradient: "from-amber-300 to-orange-500",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden px-4 py-24 sm:px-6 md:py-32">
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[620px] w-[980px] -translate-x-1/2 rounded-full bg-cyan-500/[0.08] blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-cyan-200/70">Pricing</p>
          <h2 className="text-3xl font-black leading-tight text-white sm:text-5xl">
            Выбери свой <span className="gradient-text">тариф</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/[0.58]">
            Гибкие планы для тестов, регулярных запусков и командной работы.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className={`relative ${plan.popular ? "md:-mt-5 md:mb-5" : ""}`}
            >
              {plan.popular ? (
                <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2">
                  <span className="rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-500 px-4 py-1.5 text-sm font-black text-black shadow-[0_0_32px_rgba(56,189,248,0.35)]">
                    Популярный
                  </span>
                </div>
              ) : null}

              <div
                className={`premium-reflection h-full rounded-[1.75rem] border p-7 backdrop-blur-2xl transition duration-500 hover:-translate-y-1 ${
                  plan.popular
                    ? "border-cyan-300/40 bg-white/[0.07] shadow-[0_0_60px_rgba(56,189,248,0.18)]"
                    : "border-white/10 bg-white/[0.045]"
                }`}
              >
                <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${plan.gradient} text-black`}>
                  <plan.icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                <p className="mt-2 text-sm text-white/[0.52]">{plan.description}</p>

                <div className="mt-7">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  {plan.period ? <span className="ml-2 text-white/[0.45]">{plan.period}</span> : null}
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-300/[0.14] text-cyan-200">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm leading-6 text-white/[0.62]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.name === "Бизнес" ? "https://t.me/marketcardai_support_bot" : "/register"}
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-2xl px-5 py-4 text-sm font-black transition hover:scale-[1.02] ${
                    plan.popular
                      ? "bg-gradient-to-r from-cyan-300 to-fuchsia-500 text-black shadow-[0_0_34px_rgba(56,189,248,0.34)]"
                      : "border border-white/10 bg-white/[0.045] text-white hover:bg-white/[0.08]"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
