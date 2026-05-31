"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "@/components/icons";

const stats = [
  { value: "50,000+", label: "Карточек создано" },
  { value: "3,500+", label: "Активных продавцов" },
  { value: "+287%", label: "Рост конверсии" },
  { value: "35-40 сек", label: "Среднее время" },
];

const reviews = [
  {
    id: 1,
    name: "Азиз",
    platform: "Uzum",
    avatar: "А",
    rating: 5,
    text: "Карточки стали выглядеть как у топовых продавцов. Запускаем новые товары быстрее, без ожидания дизайнера.",
    gradient: "from-emerald-300 to-cyan-400",
  },
  {
    id: 2,
    name: "Руслан",
    platform: "Wildberries",
    avatar: "Р",
    rating: 5,
    text: "Сервис экономит время и сразу дает несколько визуальных направлений. Самое ценное - карточки не выглядят дешево.",
    gradient: "from-violet-400 to-fuchsia-500",
  },
  {
    id: 3,
    name: "Мадина",
    platform: "Ozon",
    avatar: "М",
    rating: 5,
    text: "Раньше одна карточка занимала день. Теперь за вечер готовим целую линейку и тестируем разные офферы.",
    gradient: "from-amber-300 to-orange-500",
  },
];

export function Reviews() {
  return (
    <section id="reviews" className="relative overflow-hidden px-4 py-24 sm:px-6 md:py-32">
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/2 h-[620px] w-[620px] rounded-full bg-fuchsia-500/[0.09] blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-20 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 text-center backdrop-blur-2xl sm:p-6"
            >
              <div className="gradient-text text-3xl font-black sm:text-4xl">{stat.value}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.18em] text-white/[0.44] sm:text-sm sm:normal-case sm:tracking-normal">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-fuchsia-200/70">Seller Results</p>
          <h2 className="text-3xl font-black leading-tight text-white sm:text-5xl">
            Что говорят <span className="gradient-text">продавцы</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/[0.58]">
            MarketCard AI помогает селлерам быстрее тестировать товарные гипотезы и выглядеть дороже в выдаче.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="group"
            >
              <div className="relative h-full overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl transition duration-500 hover:-translate-y-1 hover:border-white/18 hover:bg-white/[0.07]">
                <Quote className="mb-5 h-10 w-10 text-cyan-200/22" />
                <p className="min-h-[128px] text-base leading-8 text-white/[0.76]">&ldquo;{review.text}&rdquo;</p>
                <div className="mt-6 flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-cyan-300 text-cyan-300" />
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${review.gradient} text-lg font-black text-black`}>
                    {review.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white">{review.name}</div>
                    <div className="text-sm text-white/[0.45]">{review.platform}</div>
                  </div>
                </div>
                <div className={`absolute inset-x-0 bottom-0 h-px bg-gradient-to-r ${review.gradient} opacity-35`} />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
