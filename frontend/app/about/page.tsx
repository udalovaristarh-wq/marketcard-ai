"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

type Lang = "ru" | "en"

const content = {
  ru: { back: "← Назад", title: "MarketCard AI", subtitle: "AI-платформа для создания контента для маркетплейсов.", cta: "Перейти на платформу", founderLabel: "Основатель:", supportTitle: "Связь с нами" },
  en: { back: "← Back", title: "MarketCard AI", subtitle: "AI platform for marketplace product content.", cta: "Go to platform", founderLabel: "Founder:", supportTitle: "Contact Us" },
} as const

export default function AboutPage() {
  const router = useRouter()
  const [lang, setLang] = useState<Lang>("ru")
  const t = content[lang]

  return (
    <main style={{ minHeight: "100vh", padding: "40px 20px", color: "white", background: "linear-gradient(to bottom, #020617, #1e3a8a)" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", background: "rgba(0,0,0,0.3)", padding: "40px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer", marginBottom: "20px" }}>{t.back}</button>
        <h1 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "15px" }}>{t.title}</h1>
        <p style={{ fontSize: "18px", opacity: 0.9, marginBottom: "30px" }}>{t.subtitle}</p>
        <button onClick={() => router.push("/")} style={{ padding: "15px 30px", borderRadius: "12px", background: "#3b82f6", color: "white", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginBottom: "40px" }}>{t.cta}</button>
        
        <h2 style={{ marginTop: "40px" }}>{t.supportTitle}</h2>
        <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
          <a href="https://t.me/marketcardai_support_bot" target="_blank" style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "65px", height: "65px", background: "rgba(255,255,255,0.05)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <img src="/social/telegram.svg" style={{ width: "40px", height: "40px" }} />
          </a>
          <a href="https://www.instagram.com/marketcard.ai" target="_blank" style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "65px", height: "65px", background: "rgba(255,255,255,0.05)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <img src="/social/instagram.svg" style={{ width: "40px", height: "40px" }} />
          </a>
        </div>
      </div>
    </main>
  )
}
