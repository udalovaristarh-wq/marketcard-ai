"use client"

import React, { useState } from "react"

type ABCResult = {
  abc_class: string
  decision: string
  confidence?: number
  product_query?: string
  marketplace?: string
  why?: string[]
  risks?: string[]
  opportunities?: string[]
  entry_strategy?: string[]
  launch_plan_7_days?: string[]
  audit_credits_left?: number
}

type Props = {
  open: boolean
  onClose: () => void
}

function Section({ title, items, icon }: { title: string; items?: string[]; icon: string }) {
  if (!items) return null
  if (items.length === 0) return null

  return (
    <div style={sectionStyle}>
      <div style={{ fontSize: 18, fontWeight: 950, marginBottom: 10 }}>{icon} {title}</div>
      <div style={{ display: "grid", gap: 8 }}>
        {items.map((item, i) => (
          <div key={i} style={itemStyle}>
            <span style={{ color: "#a78bfa", fontWeight: 950 }}>•</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ABCAnalysisModal({ open, onClose }: Props) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<ABCResult | null>(null)

  if (!open) return null

  async function runABC() {
    setError("")
    setResult(null)

    const cleanUrl = url.trim()
    const token = localStorage.getItem("access_token")

    if (!cleanUrl) {
      setError("Вставьте ссылку")
      return
    }

    if (!token) {
      setError("Нет токена")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/abc-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({ url: cleanUrl }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.detail || "Ошибка")
        return
      }

      setResult(data)
    } catch {
      setError("Ошибка сети")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2>ABC анализ</h2>
          <button onClick={onClose}>×</button>
        </div>

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Ссылка"
          style={inputStyle}
        />

        <button onClick={runABC} style={buttonStyle}>
          {loading ? "Анализ..." : "Запустить"}
        </button>

        {error && <div style={{ color: "red" }}>{error}</div>}

        {result && (
          <div>
            <h3>{result.decision}</h3>
            <div>Класс: {result.abc_class}</div>
            <div>Уверенность: {result.confidence}%</div>

            <Section title="Почему" icon="🧠" items={result.why} />
            <Section title="Риски" icon="⚠️" items={result.risks} />
            <Section title="Возможности" icon="🚀" items={result.opportunities} />
          </div>
        )}
      </div>
    </div>
  )
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}

const modalStyle: React.CSSProperties = {
  width: "600px",
  background: "#111",
  padding: "20px",
  borderRadius: "12px",
  color: "white",
}

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
}

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  background: "#4f46e5",
  color: "white",
  border: "none",
}

const sectionStyle: React.CSSProperties = {
  marginTop: "10px",
}

const itemStyle: React.CSSProperties = {
  display: "flex",
  gap: "6px",
}
