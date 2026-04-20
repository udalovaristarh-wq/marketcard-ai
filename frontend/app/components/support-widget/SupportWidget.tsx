"use client"

import { useState } from "react"

type Msg = {
  role: "bot" | "user"
  text: string
}

export default function SupportWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "Здравствуйте! Я виртуальный помощник MarketCard AI. Напишите ваш вопрос.",
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
        body: JSON.stringify({ message: value })
      })

      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.reply || "Нет ответа от сервера." },
      ])
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Ошибка соединения с поддержкой." },
      ])
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          width: "64px",
          height: "64px",
          borderRadius: "999px",
          border: "none",
          background: "linear-gradient(135deg,#22c55e,#16a34a)",
          color: "white",
          fontWeight: 900,
          fontSize: "22px",
          cursor: "pointer",
          zIndex: 99999,
        }}
      >
        M
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            right: "20px",
            bottom: "96px",
            width: "360px",
            height: "520px",
            borderRadius: "20px",
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.12)",
            zIndex: 99999,
            color: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "16px", fontWeight: 800 }}>
            Поддержка MarketCard
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
                  padding: "10px",
                  borderRadius: "12px",
                  maxWidth: "80%",
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", padding: "10px", gap: "6px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              style={{
                flex: 1,
                height: "40px",
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
                background: "#22c55e",
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
