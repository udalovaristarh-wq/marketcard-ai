"use client";

import { motion } from "framer-motion";
import { Clock, Layers, TrendingUp, Zap } from "./icons";

const stats = [
  {
    value: "200K+",
    label: "Карточек сгенерировано",
    description: "для товарных категорий Uzum, WB, Ozon и Yandex Market",
    icon: Layers,
    gradient: "from-cyan-500 to-cyan-400",
  },
  {
    value: "25 сек",
    label: "Время генерации",
    description: "от загрузки фото до готовой продающей карточки",
    icon: Clock,
    gradient: "from-purple-500 to-purple-400",
  },
  {
    value: "+340%",
    label: "Рост конверсии",
    description: "средний показатель у клиентов после перехода на AI-карточки",
    icon: TrendingUp,
    gradient: "from-pink-500 to-pink-400",
  },
  {
    value: "4 МП",
    label: "Маркетплейса",
    description: "полная поддержка форматов и требований",
    icon: Zap,
    gradient: "from-emerald-500 to-emerald-400",
  },
];

export function StatsSection() {
  return (
    <section id="stats" className="relative scroll-mt-28 overflow-hidden px-4 py-32">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[120px]" />
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
            <span className="uppercase tracking-wider">Operating Numbers</span>
          </div>
          <h2 className="mb-6 text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
            <span className="text-foreground">Цифры, которые</span>
            <br />
            <span className="text-foreground">продавец чувствует</span>
            <br />
            <span className="gradient-text">в запуске.</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            MarketCard AI создан не для красивой презентации, а для скорости: быстрее собрать карточку, быстрее проверить гипотезу, быстрее выйти в продажи.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass relative h-full overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:bg-white/[0.04]">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-5`} />
                <div className={`mb-6 h-12 w-12 rounded-2xl bg-gradient-to-br ${stat.gradient} p-[1px]`}>
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-background/90">
                    <stat.icon className="h-5 w-5 text-foreground" />
                  </div>
                </div>
                <div className={`mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-4xl font-bold text-transparent lg:text-5xl`}>{stat.value}</div>
                <div className="mb-2 font-medium text-foreground">{stat.label}</div>
                <p className="text-sm leading-relaxed text-muted-foreground">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
