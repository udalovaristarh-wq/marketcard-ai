'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [pricingOpen, setPricingOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoImage, setDemoImage] = useState("");
  const [demoFile, setDemoFile] = useState<File | null>(null);
  const [demoTitle, setDemoTitle] = useState("");
  const [demoSpecs, setDemoSpecs] = useState("");
  const [demoBrand, setDemoBrand] = useState("");
  const [demoMarketplace, setDemoMarketplace] = useState("uzum");
  const [demoAnalyzing, setDemoAnalyzing] = useState(false);
  const [demoGenerating, setDemoGenerating] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);
  const [demoResultUrl, setDemoResultUrl] = useState("");
  const [demoError, setDemoError] = useState("");

  async function handleDemoImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setDemoFile(file);
    setDemoResultUrl("");
    setDemoError("");

    const url = URL.createObjectURL(file);
    setDemoImage(url);
    setDemoAnalyzing(true);

    try {
      const form = new FormData();
      form.append("image", file);

      const res = await fetch("/api/analyze-product-photo", {
        method: "POST",
        body: form,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.detail || "AI не смог определить товар");
      }

      setDemoTitle(data.title || "Товар для маркетплейса");
      setDemoSpecs(data.category || "Товар для маркетплейса");
      if (data.brand) setDemoBrand(data.brand);

    } catch (err) {
      console.error("AI analyze error:", err);
      setDemoTitle("Товар для маркетплейса");
      setDemoSpecs("AI не смог точно определить характеристики. Заполните вручную.");
    } finally {
      setDemoAnalyzing(false);
    }
  }

  async function handleDemoGenerate() {
    if (!demoFile) {
      setDemoError("Сначала загрузите фото товара.");
      return;
    }

    setDemoGenerating(true);
    setDemoError("");

    try {
      const form = new FormData();
      form.append("image", demoFile);
      form.append("product_title", demoTitle || "Демо товар");
      form.append("category", demoSpecs || "Товар для маркетплейса");
      form.append("brand", demoBrand || "");
      form.append("marketplace", demoMarketplace || "uzum");
      form.append("language_mode", "ru");

      const res = await fetch("/api/demo-generate", {
        method: "POST",
        body: form,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.detail || data.message || "Не удалось создать демо-карточку");
      }

      // progress timer fallback
      setDemoProgress(100);

      setDemoResultUrl(data.demo_image_url);
    } catch (err) {
      setDemoError(err instanceof Error ? err.message : "Ошибка генерации");
    } finally {
      setTimeout(() => {
        setDemoGenerating(false);
      }, 800);
    }
  }

  return (
    <main className="bg-black text-white min-h-screen overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-cyan-400 rounded-3xl flex items-center justify-center text-4xl font-black">MC</div>
            <h1 className="text-3xl font-bold tracking-tighter">MarketCard AI</h1>
          </div>

          <div className="hidden md:flex gap-10 text-lg">
            <a href="#how" className="hover:text-cyan-400 transition">Как работает</a>
            <a href="#examples" className="hover:text-cyan-400 transition">Примеры</a>
            <a href="#reviews" className="hover:text-cyan-400 transition">Отзывы</a>
            <button onClick={() => setPricingOpen(true)} className="hover:text-cyan-400 transition">Тарифы</button>
          </div>

          <div className="flex gap-4">
            <button onClick={() => router.push("/login")} className="px-6 py-3 hover:text-cyan-400">Войти</button>
            <button onClick={() => setDemoOpen(true)} className="px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl font-semibold hover:scale-105 transition">
              Попробовать бесплатно
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen pt-28 flex items-center relative bg-gradient-to-br from-zinc-950 to-black">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/10">
              <span className="text-emerald-400">●</span> AI для Uzum, Wildberries, Ozon
            </div>
            <h1 className="text-7xl lg:text-8xl font-bold tracking-tighter leading-none">
              Одна фото →<br />
              <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">Продающая карточка</span><br />за 30 секунд
            </h1>
            <p className="text-2xl text-gray-300">Мощный AI создаёт премиум инфографику, SEO-тексты и дизайн, который реально продаёт.</p>
            
            <button 
              onClick={() => setDemoOpen(true)}
              className="px-12 py-6 text-xl bg-gradient-to-r from-violet-600 to-cyan-500 rounded-3xl font-semibold hover:scale-105 transition-all"
            >
              Создать карточку бесплатно
            </button>
          </div>

          <div className="relative">
            <div className="absolute -inset-12 bg-gradient-to-br from-violet-500/30 to-cyan-500/30 blur-3xl rounded-3xl" />
            <img src="/works/work1.jpg" alt="Пример" className="relative rounded-3xl shadow-2xl border border-white/10" />
          </div>
        </div>
      </section>
      {/* Marketplaces */}
      <section className="py-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 flex justify-center gap-16 flex-wrap">
          <img src="/marketplaces-premium/uzum.png" className="h-12" alt="Uzum"/>
          <img src="/marketplaces-premium/wildberries.png" className="h-12" alt="Wildberries"/>
          <img src="/marketplaces-premium/ozon.png" className="h-12" alt="Ozon"/>
        </div>
      </section>

      {/* Как работает */}
      <section id="how" className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-5xl font-bold mb-16">Как это работает</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-10 bg-white/5 rounded-3xl border border-white/10">
              <div className="text-5xl mb-6">📸</div>
              <h3 className="text-2xl font-semibold">1. Загрузи фото</h3>
            </div>
            <div className="p-10 bg-white/5 rounded-3xl border border-white/10">
              <div className="text-5xl mb-6">🎯</div>
              <h3 className="text-2xl font-semibold">2. Выбери маркетплейс</h3>
            </div>
            <div className="p-10 bg-white/5 rounded-3xl border border-white/10">
              <div className="text-5xl mb-6">✨</div>
              <h3 className="text-2xl font-semibold">3. Получи результат</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Примеры */}
      <section id="examples" className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-5xl font-bold text-center mb-16">Примеры работ</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="rounded-3xl overflow-hidden border border-white/10 hover:border-cyan-400 transition">
                <img src={`/showcase/wb/${i}.webp`} className="w-full h-96 object-cover" alt="Пример" />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Отзывы */}
      <section id="reviews" className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-5xl font-bold text-center mb-16">Что говорят продавцы</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
              <p>"Отличный сервис! Карточки получаются очень качественные."</p>
              <p className="mt-6 font-semibold">- Азиз, Uzum</p>
            </div>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
              <p>"Сэкономил кучу времени и денег на дизайнерах."</p>
              <p className="mt-6 font-semibold">- Руслан, Wildberries</p>
            </div>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
              <p>"Качество на уровне топовых продавцов."</p>
              <p className="mt-6 font-semibold">- Мадина, Ozon</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Тарифы */}
      <section className="py-32 text-center">
        <button 
          onClick={() => setPricingOpen(true)}
          className="px-16 py-8 text-3xl font-bold bg-gradient-to-r from-violet-600 to-cyan-500 rounded-3xl hover:scale-105 transition"
        >
          Посмотреть тарифы
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 py-16 text-center border-t border-white/10">
        <p>© 2026 MarketCard AI • Все права защищены</p>
      </footer>

      {/* Модальные окна */}
      {/* DEMO GENERATION MODAL */}
      {demoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-x-hidden bg-black/80 backdrop-blur-xl p-4">

          <div className="relative max-h-[92vh] w-full max-w-3xl overflow-x-hidden overflow-y-auto rounded-[32px] border border-white/15 bg-zinc-950 shadow-[0_0_120px_rgba(34,211,238,.22)]">

            {/* glow */}
            <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-violet-600/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl" />

            {/* header */}
            <div className="relative flex items-center justify-between border-b border-white/10 p-6">

              <div>

                <div className="mb-2 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-black text-cyan-300">
                  FREE AI DEMO
                </div>

                <h2 className="text-3xl font-black tracking-tight">
                  Создать карточку бесплатно
                </h2>

              </div>

              <button
                onClick={() => setDemoOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-2xl hover:bg-white/20"
              >
                ×
              </button>

            </div>

            <div className="relative space-y-6 p-6">

              {/* upload */}
              <label className="block cursor-pointer rounded-[26px] border-2 border-dashed border-cyan-400/40 bg-white/[.04] p-7 text-center transition hover:border-cyan-300 hover:bg-cyan-400/5">

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleDemoImageUpload}
                />

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-violet-600 to-cyan-400 text-4xl font-black shadow-[0_0_45px_rgba(34,211,238,.45)]">
                  +
                </div>

                <h3 className="mt-5 text-2xl font-black">
                  {demoImage ? "Фото загружено" : "Загрузить фото товара"}
                </h3>

                <p className="mt-2 text-sm text-white/50">
                  AI определит название и характеристики автоматически
                </p>

              </label>

              {/* fields */}
              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-bold text-white/60">
                    Название товара
                  </label>

                  <input
                    value={demoTitle}
                    onChange={(e) => setDemoTitle(e.target.value)}
                    placeholder={demoAnalyzing ? "AI определяет..." : "Определится после загрузки фото"}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 font-semibold text-white outline-none transition focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-white/60">
                    Бренд
                  </label>

                  <input
                    value={demoBrand}
                    onChange={(e) => setDemoBrand(e.target.value)}
                    placeholder="Например: Samsung"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 font-semibold text-white outline-none transition focus:border-cyan-400"
                  />
                </div>

              </div>

              <div>

                <label className="mb-2 block text-sm font-bold text-white/60">
                  Характеристики товара
                </label>

                <textarea
                  value={demoSpecs}
                  onChange={(e) => setDemoSpecs(e.target.value)}
                  placeholder={demoAnalyzing ? "AI анализирует фото..." : "Преимущества, материал, размер, функции..."}
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-5 py-4 font-semibold text-white outline-none transition focus:border-cyan-400"
                />

              </div>

              {/* marketplaces */}
              <div>

                <label className="mb-3 block text-sm font-bold text-white/60">
                  Формат маркетплейса
                </label>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">

                  {[
                    ["uzum", "Uzum", "1080×1440"],
                    ["wb", "Wildberries", "900×1200"],
                    ["ozon", "Ozon", "1200×1600"],
                    ["yandex", "Yandex", "1000×1000"]
                  ].map(([id, name, size]) => (


                    <button
                      key={id}
                      type="button"
                      onClick={() => setDemoMarketplace(id)}
                      className={
                        "rounded-2xl border p-4 text-center transition " +
                        (demoMarketplace === id
                          ? "border-cyan-300 bg-cyan-400/15 shadow-[0_0_35px_rgba(34,211,238,.25)]"
                          : "border-white/10 bg-white/[.04] hover:border-violet-400/60 hover:bg-violet-400/10")
                      }
                    >
                      <div className="font-black">{name}</div>
                      <div className="mt-1 text-xs text-white/55">{size}</div>
                    </button>
                  ))}

                </div>
              </div>


              {/* preview */}
              <div className="rounded-[26px] border border-white/10 bg-white/[.04] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black tracking-wide text-cyan-300">
                      LIVE PREVIEW
                    </p>
                    <h3 className="text-xl font-black">
                      Предпросмотр карточки
                    </h3>
                  </div>

                  <div className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-300">
                    READY
                  </div>
                </div>

                <div className="overflow-hidden rounded-[22px] border border-white/10 bg-black/40">
                  <img
                    src={demoResultUrl || demoImage || "/works/work1.jpg"}
                    alt="preview"
                    className="h-[300px] w-full object-contain"
                  />
                </div>
              </div>


              {demoGenerating && (
                <div className="rounded-[24px] border border-cyan-300/30 bg-cyan-400/10 p-5 text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 animate-spin items-center justify-center rounded-full border border-cyan-300/40 bg-black/40 text-3xl shadow-[0_0_35px_rgba(34,211,238,.35)]">
                    ⏳
                  </div>

                  <div className="text-xl font-black text-white">
                    AI создаёт карточку... {demoProgress}%
                  </div>

                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${demoProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {demoError && (
                <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
                  {demoError}
                </div>
              )}

              <button
                onClick={handleDemoGenerate}
                disabled={demoGenerating}
                className="w-full rounded-[24px] bg-gradient-to-r from-violet-600 via-blue-500 to-cyan-400 py-5 text-xl font-black text-white shadow-[0_0_45px_rgba(34,211,238,.28)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {demoGenerating ? "AI генерирует карточку..." : "Сгенерировать карточку →"}
              </button>

            </div>
          </div>
        </div>
      )}


      {pricingOpen && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <div className="bg-zinc-900 p-10 rounded-3xl max-w-4xl w-full">
            <h2 className="text-4xl font-bold text-center mb-10">Тарифы</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 border border-white/20 rounded-3xl text-center">
                <h3 className="text-2xl font-bold">START</h3>
                <p className="text-4xl font-bold my-6">249 000 сум</p>
                <p>20 генераций</p>
              </div>
              <div className="p-8 border border-cyan-400 rounded-3xl text-center relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-500 text-black px-6 py-1 rounded-full text-sm font-bold">ПОПУЛЯРНЫЙ</div>
                <h3 className="text-2xl font-bold">BUSINESS</h3>
                <p className="text-4xl font-bold my-6">799 000 сум</p>
                <p>60 генераций</p>
              </div>
              <div className="p-8 border border-white/20 rounded-3xl text-center">
                <h3 className="text-2xl font-bold">PREMIUM</h3>
                <p className="text-4xl font-bold my-6">1 900 000 сум</p>
                <p>200 генераций</p>
              </div>
            </div>
            <button onClick={() => setPricingOpen(false)} className="mt-10 w-full py-4 bg-white text-black rounded-2xl">Закрыть</button>
          </div>
        </div>
      )}
    </main>
  );
}
