"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Globe,
  ImageIcon,
  Layers,
  Palette,
  Search,
  Shield,
  TypeIcon,
  Wand2,
} from "@/components/icons";

const features = [
  {
    icon: Wand2,
    title: "AI-генерация",
    description: "Создает визуальную концепцию, композицию и акценты без ручной сборки в редакторе.",
    gradient: "from-cyan-300 to-sky-500",
  },
  {
    icon: Palette,
    title: "Премиум стилистика",
    description: "Не шаблонный дизайн, а карточки с глубиной, светом, текстурами и читаемой иерархией.",
    gradient: "from-violet-400 to-fuchsia-500",
  },
  {
    icon: TypeIcon,
    title: "SEO-тексты",
    description: "Генерация заголовков, офферов и описаний с логикой поисковой выдачи маркетплейсов.",
    gradient: "from-pink-400 to-rose-500",
  },
  {
    icon: ImageIcon,
    title: "Обработка фото",
    description: "Улучшение исходника, выравнивание цвета, чистый фон и визуальное усиление товара.",
    gradient: "from-emerald-300 to-cyan-400",
  },
  {
    icon: Layers,
    title: "Инфографика",
    description: "Бейджи, преимущества, свойства и сценарии использования собираются в готовую структуру.",
    gradient: "from-amber-300 to-orange-500",
  },
  {
    icon: Search,
    title: "Анализ конкурентов",
    description: "AI помогает найти визуальный угол, который выглядит сильнее соседних карточек в выдаче.",
    gradient: "from-sky-400 to-violet-500",
  },
  {
    icon: BarChart3,
    title: "A/B варианты",
    description: "Создавай несколько подач для одного товара и быстрее проверяй гипотезы на продажах.",
    gradient: "from-lime-300 to-emerald-500",
  },
  {
    icon: Globe,
    title: "Мультиязычность",
    description: "Русский, узбекский и английский для разных рынков, витрин и товарных категорий.",
    gradient: "from-blue-300 to-indigo-500",
  },
  {
    icon: Shield,
    title: "Форматы площадок",
    description: "Карточки собираются под требования Uzum, WB, Ozon и Yandex Market.",
    gradient: "from-rose-300 to-fuchsia-500",
  },
];

export function Features() {
  return (
    <section id="features" className="relative overflow-hidden px-4 py-24 sm:px-6 md:py-32">
      <div className="absolute inset-0">
        <div className="absolute right-[-180px] top-20 h-[520px] w-[520px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
        <div className="absolute bottom-10 left-[-180px] h-[520px] w-[520px] rounded-full bg-cyan-400/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-fuchsia-200/70">Product Stack</p>
          <h2 className="text-3xl font-black leading-tight text-white sm:text-5xl">
            Все что нужно для <span className="gradient-text">продаж</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/[0.58]">
            Полный набор инструментов для запуска товара: от исходника до визуала, текста и проверки.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="group"
            >
              <div className="premium-reflection relative h-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl transition duration-500 hover:-translate-y-1 hover:border-white/18 hover:bg-white/[0.07]">
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-black shadow-[0_0_30px_rgba(56,189,248,0.18)]`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/[0.58]">{feature.description}</p>
                <div className={`absolute inset-x-0 bottom-0 h-px bg-gradient-to-r ${feature.gradient} opacity-30`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
