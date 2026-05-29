"use client"

import { useState } from "react"
import "./support-widget.css"

type Msg = {
  role: "bot" | "user"
  text: string
}

const TEXTS = {
  ru: {
    title: "MarketCard Support",
    status: "Online 24/7",
    welcome: "Здравствуйте! Я виртуальный помощник MarketCard AI. Напишите ваш вопрос.",
    placeholder: "Напишите сообщение...",
    error: "Ошибка соединения с поддержкой.",
    empty: "Нет ответа от сервера.",
  },
  uz: {
    title: "MarketCard Support",
    status: "Online 24/7",
    welcome: "Salom! Men MarketCard AI virtual yordamchisiman. Savolingizni yozing.",
    placeholder: "Xabar yozing...",
    error: "Yordam xizmatiga ulanishda xatolik.",
    empty: "Serverdan javob kelmadi.",
  },
  en: {
    title: "MarketCard Support",
    status: "Online 24/7",
    welcome: "Hello! I am the virtual assistant of MarketCard AI. Write your question.",
    placeholder: "Write a message...",
    error: "Support connection error.",
    empty: "No response from server.",
  },
} as const

export default function SupportWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [lang, setLang] = useState<"ru" | "uz" | "en">("ru")
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: TEXTS[lang].welcome,
    },
  ])

  const sendMessage = async () => {
    const value = input.trim()
    if (!value) return

    setMessages((prev) => [...prev, { role: "user", text: value }])
    setInput("")

    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: value, lang })
      })

      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.reply || TEXTS[lang].empty },
      ])
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: TEXTS[lang].error },
      ])
    }
  }

  return (
    <>
      <button
        type="button"
        className="support-launcher-pulse"
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          width: "64px",
          height: "64px",
          borderRadius: "999px",
          border: "none",
          background: "transparent",
          padding: 0,
          cursor: "pointer",
          zIndex: 99999,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(34,197,94,0.35)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <img
          src="/support/icon.jpg"
          alt="Support"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "999px",
            display: "block",
          }}
        />
      </button>

      {!open && (
        <button
          type="button"
          className="support-greeting-bubble"
          onClick={() => setOpen(true)}
        >
          Здравствуйте! Чем могу помочь?
        </button>
      )}

      
      {open && (
        <div
          style={{
            position: "fixed",
            right: "20px",
            bottom: "96px",
            width: "390px",
            height: "620px",
            borderRadius: "20px",
            background: "linear-gradient(180deg, rgba(17,24,39,0.96) 0%, rgba(10,15,30,0.97) 100%)",
            border: "1px solid rgba(255,255,255,0.12)",
            zIndex: 99999,
            color: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "16px", fontWeight: 800 }}>
          <div style={{ padding: "18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
  src="/support/icon.jpg"
  style={{
    width: "40px",
    height: "40px",
    borderRadius: "999px",
    objectFit: "cover",
  }}
/>
                <div>
                  <div style={{ fontWeight: 900, fontSize: "16px" }}>{TEXTS[lang].title}</div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    {(["ru", "uz", "en"] as const).map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setLang(item)
                          setMessages([{ role: "bot", text: TEXTS[item].welcome }])
                        }}
                        style={{
                          height: "28px",
                          minWidth: "44px",
                          borderRadius: "8px",
                          border: lang === item ? "1px solid #22c55e" : "1px solid rgba(255,255,255,0.1)",
                          background: lang === item ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)",
                          color: "white",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {item.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.7 }}>
                    <span className="support-online-dot" style={{ width: "8px", height: "8px", background: "linear-gradient(135deg,#22c55e,#16a34a)", borderRadius: "999px", display: "inline-block", marginRight: "6px" }}></span>
                    Online 24/7
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: "transparent", border: "none", color: "white", fontSize: "18px", cursor: "pointer" }}>×</button>
            </div>
          </div>
          </div>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  background:
                    msg.role === "user"
                      ? "#22c55e"
                      : "rgba(255,255,255,0.06)",
                  padding: "14px",
                  borderRadius: "18px",
                  maxWidth: "80%",
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", padding: "14px", gap: "6px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              style={{
                flex: 1,
                height: "48px",
                borderRadius: "10px",
                border: "none",
                padding: "0 10px",
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                padding: "0 12px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg,#22c55e,#16a34a)",
                color: "white",
              }}
            >
              ➜
            </button>
          </div>
        </div>
      )}
    </>
  )
}
