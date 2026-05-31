"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const examples = [
  {
    id: 1,
    title: "Премиум карточка",
    category: "Marketplace",
    src: "/examples/1.webp",
    gradient: "from-cyan-400/20 to-sky-500/20",
  },
  {
    id: 2,
    title: "Инфографика товара",
    category: "Wildberries",
    src: "/examples/2.webp",
    gradient: "from-violet-400/20 to-fuchsia-500/20",
  },
  {
    id: 3,
    title: "Визуальный оффер",
    category: "Ozon",
    src: "/examples/3.webp",
    gradient: "from-pink-400/20 to-rose-500/20",
  },
  {
    id: 4,
    title: "Запуск витрины",
    category: "Uzum",
    src: "/examples/4.webp",
    gradient: "from-emerald-400/20 to-cyan-500/20",
  },
  {
    id: 5,
    title: "SEO + дизайн",
    category: "Yandex Market",
    src: "/examples/5.webp",
    gradient: "from-amber-400/20 to-orange-500/20",
  },
  {
    id: 6,
    title: "AI-концепт",
    category: "Product Card",
    src: "/examples/6.webp",
    gradient: "from-blue-400/20 to-indigo-500/20",
  },
];

export function Examples() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="examples" className="relative overflow-hidden px-4 py-24 sm:px-6 md:py-32">
      <div className="absolute inset-0">
        <div className="absolute right-0 top-0 h-[620px] w-[620px] rounded-full bg-violet-500/10 blur-[130px]" />
        <div className="absolute bottom-0 left-0 h-[620px] w-[620px] rounded-full bg-cyan-500/[0.08] blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 grid gap-7 lg:grid-cols-[0.85fr_1fr] lg:items-end"
        >
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-cyan-200/70">Generated Showcase</p>
            <h2 className="text-3xl font-black leading-tight text-white sm:text-5xl">
              Примеры <span className="gradient-text">работ</span>
            </h2>
          </div>
          <p className="text-lg leading-8 text-white/[0.58]">
            Вместо серых заглушек используются реальные визуалы проекта. Карточки раскрываются на hover и показывают,
            как MarketCard AI превращает товар в дорогую витрину.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map((example, index) => (
            <motion.article
              key={example.id}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              onMouseEnter={() => setHoveredId(example.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group cursor-pointer"
            >
              <div className="premium-reflection relative overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/[0.045] p-2 backdrop-blur-2xl transition duration-500 hover:-translate-y-1 hover:border-white/18">
                <div className={`relative aspect-[4/5] overflow-hidden rounded-[1.35rem] bg-gradient-to-br ${example.gradient}`}>
                  <Image
                    src={example.src}
                    alt={example.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/[0.86] via-black/10 to-white/[0.06]" />
                  <motion.div
                    animate={{
                      opacity: hoveredId === example.id ? 1 : 0,
                      y: hoveredId === example.id ? 0 : 18,
                    }}
                    className="absolute inset-x-4 top-4 rounded-2xl border border-white/12 bg-black/[0.36] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100 backdrop-blur-xl"
                  >
                    AI-карточка готова
                  </motion.div>
                  <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/12 bg-black/[0.45] p-4 backdrop-blur-xl">
                    <div className="text-xs uppercase tracking-[0.24em] text-white/[0.45]">{example.category}</div>
                    <h3 className="mt-1 text-xl font-black text-white">{example.title}</h3>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
