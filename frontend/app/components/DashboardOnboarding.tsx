"use client"

import { useEffect, useState } from "react"

type Lang = "ru" | "uz"

const text = {
  ru: {
    welcomeTitle: "Добро пожаловать в MarketCard AI",
    welcomeText: "Оплата временно доступна только через Payme. Для работы активируйте один из 3 тарифов.",
    payme: "Payme",
    close: "Понятно",
    congrats: "Поздравляем с приобретением тарифа",
    photo: "Загрузите фото товара хорошего качества. От качества фото напрямую зависит результат генерации.",
    title: "Опишите товар максимально подробно: название, марка, модель, количество штук и характеристики.",
    variants: "Выберите количество изображений за одну генерацию. Start: 1. Business: 1 или 3. Premium: 1, 3 или 5.",
    fix: "Первые 3 исправления на каждую отдельную фотографию бесплатные. С 4-го исправления списывается 1 генерация.",
    economy: "Юнит-экономика считает себестоимость, комиссии, логистику и прибыль, чтобы не уйти в ноль.",
    seo: "После генерации карточки перейдите в SEO / Описание — текст будет готов автоматически.",
    audit: "Оценка карточки показывает слабые места изображения и помогает понять, что улучшить.",
    analytics: "Аналитика товара показывает конкуренцию, цены, спрос и рекомендации по нише.",
    abc: "ABC-анализ оценивает товар по ссылке: класс A/B/C, риски, спрос, конкуренцию и рекомендации.",
    search: "Поиск и закуп товара помогает найти перспективные товары для продажи.",
    deficit: "Дефицит товаров показывает, где есть спрос, но мало предложений.",
    auditsBuy: "Аудиты нужны для оценки карточек, аналитики товара и ABC-анализа.",
  },
  uz: {
    welcomeTitle: "MarketCard AI platformasiga xush kelibsiz",
    welcomeText: "To‘lov vaqtincha faqat Payme orqali mavjud. Ishlash uchun 3 ta tarifdan birini faollashtiring.",
    payme: "Payme",
    close: "Tushunarli",
    congrats: "Tarif xaridingiz bilan tabriklaymiz",
    photo: "Mahsulot rasmini sifatli yuklang. Rasm sifati generatsiya natijasiga ta’sir qiladi.",
    title: "Mahsulot nomini batafsil yozing: nomi, brendi, modeli, soni va xususiyatlari.",
    variants: "Bitta generatsiyada nechta rasm yaratishni tanlang. Start: 1. Business: 1 yoki 3. Premium: 1, 3 yoki 5.",
    fix: "Har bir rasm uchun dastlabki 3 ta tuzatish bepul. 4-tuzatishdan boshlab 1 generatsiya yechiladi.",
    economy: "Unit-ekonomika tannarx, komissiya, logistika va foydani hisoblaydi.",
    seo: "Kartochka yaratilgandan so‘ng SEO / Tavsif bo‘limiga o‘ting — matn avtomatik tayyor bo‘ladi.",
    audit: "Kartochka baholash rasmning zaif joylarini ko‘rsatadi.",
    analytics: "Mahsulot analitikasi raqobat, narxlar va talabni ko‘rsatadi.",
    abc: "ABC-tahlil havola orqali mahsulotni baholaydi: A/B/C sinfi, xavflar va tavsiyalar.",
    search: "Mahsulot qidirish va xarid qilish sotishga mos mahsulotlarni topishga yordam beradi.",
    deficit: "Tovar defitsiti talab bor, lekin taklif kam bo‘lgan yo‘nalishlarni ko‘rsatadi.",
    auditsBuy: "Auditlar kartochka baholash, analitika va ABC-tahlil uchun kerak.",
  },
}

export default function DashboardOnboarding() {
  const [lang, setLang] = useState<Lang>("ru")
  const [welcomeOpen, setWelcomeOpen] = useState(false)
  const [tip, setTip] = useState<string | null>(null)
  const [confetti, setConfetti] = useState(false)

  const t = text[lang]

  useEffect(() => {
    const hasActiveTariff = /Тариф:\s*(Start|Business|Premium)/.test(document.body.innerText)
    if (!localStorage.getItem("marketcard_welcome_v3_seen") && !hasActiveTariff) {
      setWelcomeOpen(true)
    }

    const style = document.createElement("style")
    style.innerHTML = ` 
      @keyframes marketcardPulseTariff {
        0% { transform: scale(1); box-shadow: 0 0 0 rgba(34,197,94,0); }
        50% { transform: scale(1.012); box-shadow: 0 0 10px rgba(34,197,94,.32); }
        100% { transform: scale(1); box-shadow: 0 0 0 rgba(34,197,94,0); }
      }
      .marketcard-tariff-pulse { animation: marketcardPulseTariff 1.2s infinite; }

      .marketcard-tip-bubble {
        position: fixed;
        z-index: 9998;
        right: 24px;
        top: 50%;
        transform: translateY(-50%);
        max-width: 430px;
        padding: 20px 22px;
        border-radius: 24px;
        background: radial-gradient(circle at top left, rgba(34,211,238,.22), transparent 38%), linear-gradient(180deg, rgba(15,23,42,.98), rgba(2,6,23,.98));
        color: white;
        border: 1px solid rgba(34,211,238,.42);
        box-shadow: 0 24px 70px rgba(0,0,0,.58), 0 0 28px rgba(34,211,238,.14);
        font-weight: 900;
        line-height: 1.5;
        font-size: 17px;
        backdrop-filter: blur(16px);
        cursor: pointer;
      }

      .marketcard-tip-bubble:before {
        content: "💡 Подсказка / Maslahat";
        display: block;
        margin-bottom: 10px;
        color: #67e8f9;
        font-size: 14px;
      }

      .marketcard-confetti-piece {
        position: fixed;
        top: 50vh;
        width: 11px;
        height: 18px;
        z-index: 10001;
        border-radius: 4px;
        opacity: .98;
        animation: marketcardSideConfetti 1.9s ease-out forwards;
      }

      @keyframes marketcardSideConfetti {
        0% { transform: translate(0,0) rotate(0deg) scale(1); opacity: 1; }
        100% { transform: translate(var(--x), var(--y)) rotate(860deg) scale(.7); opacity: 0; }
      }
    `
    document.head.appendChild(style)

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const el = target?.closest("button, div, input, label") as HTMLElement | null
      const html = (el?.textContent || target?.getAttribute?.("placeholder") || "").trim()
      if (html.includes("Выберите тариф") || html.includes("Tarifni tanlang")) {
        localStorage.setItem("marketcard_tariff_clicked", "1")
        document.querySelectorAll(".marketcard-tariff-pulse").forEach((x) =>
          x.classList.remove("marketcard-tariff-pulse")
        )
      }

      if (html.includes("Генератор карточек")) setTip(t.photo)
      else if (html.includes("Загрузить фото") || html.includes("Файл не выбран")) setTip(t.photo)
      else if (html.includes("Название товара") || html.includes("Насос") || html.includes("Mahsulot nomi")) setTip(t.title)
      else if (html.includes("Количество вариантов") || html === "1" || html === "3" || html === "5") setTip(t.variants)
      else if (html.includes("Исправление изображения") || html.includes("Исправить ошибки")) setTip(t.fix)
      else if (html.includes("Юнит-экономика")) setTip(t.economy)
      else if (html.includes("SEO") || html.includes("Описание")) setTip(t.seo)
      else if (html.includes("Оценка карточки")) setTip(t.audit)
      else if (html.includes("Аналитика товара")) setTip(t.analytics)
      else if (html.includes("ABC анализ")) setTip(t.abc)
      else if (html.includes("Поиск и закуп")) setTip(t.search)
      else if (html.includes("Дефицит товаров")) setTip(t.deficit)
      else if (
        html.includes("Купить 10 аудитов") ||
        html.includes("Купить 30 аудитов") ||
        html.includes("Оценок карточек")
      ) setTip(t.auditsBuy)
    }

    const scan = () => {
      const activeTariff = /Тариф:\s*(Start|Business|Premium)/.test(document.body.innerText)

      document.querySelectorAll("button").forEach((el) => {
        const html = (el.textContent || "").trim()

        if (!activeTariff && (html === "Выберите тариф" || html === "Tarifni tanlang")) {
          el.classList.add("marketcard-tariff-pulse")
        }
      })
    }

    const checkPaidTariff = () => {
      const pendingPurchase =
        localStorage.getItem("marketcard_pending_tariff_purchase") === "1"

      const currentTariff =
        document.body.innerText.match(/Тариф:\s*(Start|Business|Premium)/)?.[1]

      const oldTariff = localStorage.getItem("marketcard_last_tariff")
      if (currentTariff && (currentTariff !== oldTariff || pendingPurchase)) {
        localStorage.setItem("marketcard_last_tariff", currentTariff)
        localStorage.removeItem("marketcard_pending_tariff_purchase")
        setTip(`${t.congrats}: ${currentTariff}`)
        setConfetti(true)
        setTimeout(() => setConfetti(false), 3500)
      }
    }

    document.addEventListener("click", handleClick)

    setTimeout(scan, 700)
    const scanId = setInterval(scan, 3000)

    checkPaidTariff()
    const paidPoll = setInterval(checkPaidTariff, 1000)
    setTimeout(() => clearInterval(paidPoll), 30000)

    return () => {
      clearInterval(scanId)
      clearInterval(paidPoll)
      document.removeEventListener("click", handleClick)
      style.remove()
    }
  }, [lang, t])

  const closeWelcome = () => {
    localStorage.setItem("marketcard_welcome_v3_seen", "1")
    setWelcomeOpen(false)
  }

  return (
    <>
      {confetti &&
        Array.from({ length: 90 }).map((_, i) => (
          <span
            key={i}
            className="marketcard-confetti-piece"
            style={{
              left: i % 2 === 0 ? "-2vw" : "102vw",
              top: `${35 + Math.random() * 30}vh`,
              background: ["#22c55e", "#06b6d4", "#f59e0b", "#a855f7", "#f43f5e"][i % 5],
              animationDelay: `${Math.random() * 0.25}s`,
              ["--x" as any]: i % 2 === 0 ? `${40 + Math.random() * 38}vw` : `${-(40 + Math.random() * 38)}vw`,
              ["--y" as any]: `${-35 + Math.random() * 70}vh`,
            }}
          />
        ))}

      {welcomeOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ maxWidth: 520, width: "100%", borderRadius: 28, background: "linear-gradient(180deg,#0f172a,#020617)", color: "#fff", padding: 28, border: "1px solid rgba(34,211,238,.35)", boxShadow: "0 30px 90px rgba(0,0,0,.55)" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button onClick={() => setLang("ru")} style={{ padding: "8px 14px", borderRadius: 999, border: "none", background: lang === "ru" ? "#22c55e" : "#1e293b", color: "#fff", fontWeight: 900 }}>RU</button>
              <button onClick={() => setLang("uz")} style={{ padding: "8px 14px", borderRadius: 999, border: "none", background: lang === "uz" ? "#22c55e" : "#1e293b", color: "#fff", fontWeight: 900 }}>UZ</button>
            </div>
            <h2 style={{ fontSize: 30, margin: "0 0 12px", fontWeight: 950 }}>{t.welcomeTitle}</h2>
            <p style={{ color: "#cbd5e1", fontSize: 17, lineHeight: 1.6 }}>{t.welcomeText}</p>
            <div style={{ marginTop: 16, padding: 14, borderRadius: 16, background: "rgba(6,182,212,.12)", border: "1px solid rgba(6,182,212,.35)", fontWeight: 950 }}>💳 {t.payme}</div>
            <button onClick={closeWelcome} style={{ marginTop: 22, width: "100%", padding: 15, borderRadius: 16, border: "none", background: "linear-gradient(135deg,#22c55e,#06b6d4)", color: "#fff", fontWeight: 950, fontSize: 16, cursor: "pointer" }}>{t.close}</button>
          </div>
        </div>
      )}

      {tip && tip.startsWith(t.congrats) && (
        <div onClick={() => setTip(null)} style={{ position: "fixed", inset: 0, background: "transparent", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ maxWidth: "720px", width: "100%", borderRadius: "34px", background: "linear-gradient(180deg,#052e16,#064e3b,#022c22)", border: "2px solid rgba(34,197,94,.45)", boxShadow: "0 0 80px rgba(34,197,94,.35)", padding: "42px", textAlign: "center", color: "white" }}>
            <div style={{ fontSize: "64px", marginBottom: "18px" }}>🎉</div>
            <div style={{ fontSize: "42px", fontWeight: 1000, marginBottom: "14px" }}>{t.congrats}</div>
            <div style={{ fontSize: "28px", color: "#bbf7d0", fontWeight: 900 }}>{tip.split(": ")[1] || ""}</div>
            <div style={{ marginTop: "20px", fontSize: "18px", color: "#dcfce7" }}>Ваш тариф успешно активирован. Добро пожаловать в MarketCard AI.</div>
          </div>
        </div>
      )}

      {tip && !tip.startsWith(t.congrats) && (
        <div className="marketcard-tip-bubble" onClick={() => setTip(null)}>
          {tip}
          <div style={{ marginTop: 10, color: "#67e8f9", fontSize: 13 }}>Нажмите, чтобы закрыть / Yopish uchun bosing</div>
        </div>
      )}
    </>
  )
}
