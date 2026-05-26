"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Lang = "ru" | "en"

const content = {
  ru: {
    back: "← Назад",
    title: "MarketCard AI",
    subtitle: "AI-платформа нового поколения для создания карточек товаров, инфографики и SEO-контента для маркетплейсов. Загрузи одно фото — получи готовую продающую карточку за секунды.",
    founderLabel: "Основатель",
    founderValue: "Aristarkh Aleksandrovich Udalov",
    supportTitle: "Ссылки",
    telegram: "Telegram бот",
    instagram: "Instagram",
    lang: "Язык",
  },
  en: {
    back: "← Back",
    title: "MarketCard AI",
    subtitle: "AI platform for generating marketplace product content.",
    founderLabel: "Founder",
    founderValue: "Aristarkh Aleksandrovich Udalov",
    supportTitle: "Links",
    telegram: "Telegram bot",
    instagram: "Instagram",
    lang: "Language",
  },
} as const

export default function AboutPage() {
  const router = useRouter()
  const [lang, setLang] = useState<Lang>("en")
  const t = content[lang]

  return (
    <main style={{ minHeight: "100vh", padding: "60px 20px", color: "white", background: "radial-gradient(circle at top, #1e3a8a, #020617)" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", background: "rgba(255,255,255,0.05)", padding: "30px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)" }}>

        <button onClick={() => router.back()}>
          {t.back}
        </button>

        <div style={{ marginTop: "20px" }}>
          <button onClick={() => setLang("ru")} style={{padding:"8px 12px",borderRadius:"10px",background:"#1e40af",color:"#fff",border:"none"}}>RU</button>
          <button onClick={() => setLang("en")} style={{padding:"8px 12px",borderRadius:"10px",background:"#1e40af",color:"#fff",border:"none"}}>EN</button>
        </div>

        <h1 style={{ fontSize: "56px", marginTop: "20px", fontWeight: "900", background: "linear-gradient(90deg,#fff,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {t.title}
        </h1>

        <p style={{ fontSize: "18px" }}>
          {t.subtitle}
        <p style={{marginTop:"20px",opacity:0.8,lineHeight:"1.6"}}>
        MarketCard AI автоматически генерирует изображения, тексты и структуру карточки товара.
        Сервис подходит для Uzum, Wildberries, Ozon и других маркетплейсов.
        </p>
        <p style={{marginTop:"10px",opacity:0.8,lineHeight:"1.6"}}>
        Мы упрощаем запуск товаров, увеличиваем конверсию и экономим десятки часов ручной работы.
        </p>

        </p>

        <div style={{ marginTop: "20px" }}>
          <b>{t.founderLabel}:</b> {t.founderValue}
        <div style={{marginTop:"30px"}}>
          <h2 style={{fontSize:"24px"}}>Возможности</h2>
        <div style={{marginTop:"30px"}}>
          <h2 style={{fontSize:"24px"}}>Почему MarketCard AI</h2>
        <div style={{marginTop:"40px"}}>
          <h2 style={{fontSize:"24px"}}>Как это работает</h2>
        <div style={{marginTop:"40px"}}>
          <h2 style={{fontSize:"24px"}}>Для кого эта платформа</h2>
        <div style={{marginTop:"40px"}}>
          <h2 style={{fontSize:"24px"}}>Что вы получаете</h2>
        <div style={{marginTop:"40px"}}>
          <h2 style={{fontSize:"24px"}}>Преимущества</h2>
        <div style={{marginTop:"40px"}}>
          <h2 style={{fontSize:"24px"}}>Наше видение</h2>
          <p style={{marginTop:"10px",opacity:0.85,lineHeight:"1.7"}}>
          Мы создаём универсальную AI-платформу для e-commerce,
          которая полностью автоматизирует процесс создания контента для товаров.
          </p>
          <p style={{marginTop:"10px",opacity:0.85,lineHeight:"1.7"}}>
          В будущем MarketCard AI станет стандартом для всех продавцов,
          работающих с маркетплейсами.
          </p>
        </div>

          <ul style={{marginTop:"10px",lineHeight:"1.8",opacity:0.9}}>
            <li>— Экономия времени до 95%</li>
            <li>— Снижение затрат на дизайнеров</li>
            <li>— Увеличение конверсии карточек</li>
            <li>— Массовая генерация контента</li>
            <li>— Простота использования</li>
          </ul>
        </div>

          <p style={{marginTop:"10px",opacity:0.85,lineHeight:"1.7"}}>
          Готовый набор карточек товара, полностью адаптированных под маркетплейсы,
          включая визуал, тексты и структуру.
          </p>
          <p style={{marginTop:"10px",opacity:0.85,lineHeight:"1.7"}}>
          Это позволяет сразу запускать товар в продажу без дополнительных затрат.
          </p>
        </div>

          <ul style={{marginTop:"10px",lineHeight:"1.8",opacity:0.9}}>
            <li>— Продавцы на маркетплейсах (Uzum, Wildberries, Ozon)</li>
            <li>— Владельцы интернет-магазинов</li>
            <li>— Дропшипперы</li>
            <li>— Маркетологи и дизайнеры</li>
            <li>— Стартапы и e-commerce проекты</li>
          </ul>
        </div>

          <p style={{marginTop:"10px",opacity:0.85,lineHeight:"1.7"}}>
          Пользователь загружает фотографию товара. Система анализирует изображение,
          определяет тип продукта, категорию и автоматически генерирует серию карточек,
          инфографику, заголовки и описание.
          </p>
          <p style={{marginTop:"10px",opacity:0.85,lineHeight:"1.7"}}>
          Весь процесс занимает считанные секунды и не требует навыков дизайна или маркетинга.
          </p>
        </div>

          <p style={{marginTop:"10px",opacity:0.8}}>
          Наш алгоритм создаёт контент, который выглядит как работа профессионального дизайнера и маркетолога.
          </p>
        </div>

          <ul style={{marginTop:"10px",lineHeight:"1.8",opacity:0.9}}>
            <li>— Генерация карточек товаров из 1 фото</li>
            <li>— SEO заголовки и описания</li>
            <li>— Автоматическая инфографика</li>
            <li>— Поддержка популярных маркетплейсов</li>
          </ul>
        </div>

        </div>


        <div style={{ marginTop: "40px" }}>
          <h2>{t.supportTitle}</h2>

          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>

            <a
              href="https://t.me/marketcardai_support_bot"
              target="_blank"
              rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "10px", padding:"10px 15px", background:"rgba(255,255,255,0.05)", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.1)" }}
            >
              <img src="/social/telegram.svg" style={{ width: "30px" }} />
              {t.telegram}
            </a>

            <a
              href="https://www.instagram.com/marketcard.ai?igsh=MWtwM3pwdmowd3VmYg=="
              target="_blank"
              rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "10px", padding:"10px 15px", background:"rgba(255,255,255,0.05)", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.1)" }}
            >
              <img src="/social/instagram.svg" style={{ width: "30px" }} />
              {t.instagram}
            </a>

          </div>
        </div>

      </div>
    </main>
  )
}
