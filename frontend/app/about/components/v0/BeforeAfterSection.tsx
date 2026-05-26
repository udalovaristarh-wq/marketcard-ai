"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "./icons";

const examples = [
  {
    id: 1,
    category: "Парфюмерия",
    brand: "LACOSTE",
    beforeImage: "/about/lacoste-lhomme-source.png",
    afterImage: "/examples/2.webp",
    before: {
      description: "Обычное фото на белом фоне",
    },
    after: {
      features: ["Мужской аромат", "Древесно-пряный", "Люксовый аромат"],
    },
  },
  {
    id: 2,
    category: "Автошины",
    brand: "PRINX",
    beforeImage: "/about/lacoste-lhomme-source.png",
    afterImage: "/examples/1.webp",
    before: {
      description: "Стандартное изображение товара",
    },
    after: {
      features: ["HiCity HT1", "235/55 R18", "Флагман"],
    },
  },
  {
    id: 3,
    category: "Электроника",
    brand: "S26 Ultra",
    beforeImage: "/about/lacoste-lhomme-source.png",
    afterImage: "/examples/3.webp",
    before: {
      description: "Простое фото без продающей структуры",
    },
    after: {
      features: ["16 ГБ ОЗУ", "512 ГБ ПЗУ", "Marketplace-ready"],
    },
  },
];

export function BeforeAfterSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const active = examples[activeIndex];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % examples.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + examples.length) % examples.length);
  };

  const updateSlider = (clientX: number, container: HTMLElement) => {
    const rect = container.getBoundingClientRect();
    const newPosition = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(10, Math.min(90, newPosition)));
  };

  return (
    <section id="before-after" className="relative scroll-mt-28 overflow-hidden px-4 py-32">
      <div className="absolute inset-0">
        <div className="absolute right-0 bottom-0 h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[150px]" />
        <div className="absolute top-1/2 left-0 h-[400px] w-[400px] rounded-full bg-pink-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-primary">
            <span className="uppercase tracking-wider">Before / After</span>
          </div>
          <div className="grid items-end gap-8 lg:grid-cols-2">
            <h2 className="text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              <span className="text-foreground">Из обычного фото</span>
              <br />
              <span className="text-foreground">в карточку,</span>
              <br />
              <span className="gradient-text-cyan">которая продаёт.</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Продавец приносит исходник, MarketCard AI собирает визуальную подачу, смысловые акценты и marketplace-формат.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="glass-strong overflow-hidden rounded-3xl p-2 lg:p-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-card sm:aspect-[16/9] lg:aspect-[21/9]">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="mb-4 text-sm uppercase tracking-wider text-muted-foreground">До</div>
                    <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-gray-700 to-gray-800 lg:h-64 lg:w-64">
                      <Image src={active.beforeImage} alt="До MarketCard AI" fill sizes="(max-width: 768px) 70vw, 260px" className="object-contain p-4" />
                    </div>
                    <p className="mx-auto mt-4 max-w-xs text-sm text-muted-foreground">{active.before.description}</p>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950/50 to-cyan-950/50" style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}>
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="mb-4 flex items-center justify-center gap-2">
                      <span className="text-sm uppercase tracking-wider text-primary">После</span>
                      <span className="text-xs text-muted-foreground">MarketCard AI</span>
                    </div>
                    <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-cyan-900/30 to-purple-900/30 lg:h-64 lg:w-64">
                      <Image src={active.afterImage} alt="После MarketCard AI" fill sizes="(max-width: 768px) 70vw, 260px" className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />
                      <div className="absolute inset-4 flex flex-col justify-between">
                        <div className="text-left">
                          <div className="text-xs font-semibold text-primary">{active.brand}</div>
                          <div className="text-[10px] text-muted-foreground">{active.category}</div>
                        </div>
                        <div className="space-y-1">
                          {active.after.features.map((feature) => (
                            <div key={feature} className="rounded-md bg-white/5 px-2 py-1 text-[10px] text-foreground/80">
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="group absolute top-0 bottom-0 w-1 cursor-ew-resize touch-none"
                style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
                onMouseDown={(event) => {
                  const container = event.currentTarget.parentElement;
                  if (!container) return;
                  const handleMouseMove = (moveEvent: MouseEvent) => updateSlider(moveEvent.clientX, container);
                  const handleMouseUp = () => {
                    document.removeEventListener("mousemove", handleMouseMove);
                    document.removeEventListener("mouseup", handleMouseUp);
                  };
                  document.addEventListener("mousemove", handleMouseMove);
                  document.addEventListener("mouseup", handleMouseUp);
                }}
              >
                <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500" />
                <div className="glass absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full glow-cyan">
                  <div className="flex gap-0.5">
                    <ChevronLeft className="h-3 w-3 text-primary" />
                    <ChevronRight className="h-3 w-3 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button onClick={prevSlide} className="glass rounded-full p-3 transition-colors hover:bg-white/5" aria-label="Previous">
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <div className="flex gap-2">
              {examples.map((example, index) => (
                <button
                  key={example.id}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex ? "w-8 bg-gradient-to-r from-cyan-500 to-purple-500" : "w-2 bg-muted hover:bg-muted-foreground"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <button onClick={nextSlide} className="glass rounded-full p-3 transition-colors hover:bg-white/5" aria-label="Next">
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
