"use client"

import React, { useEffect, useState } from "react"

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

function Block({ title, icon, items }: { title: string; icon: string; items?: string[] }) {
  if (!items || items.length === 0) return null

  return (
    <div style={blockStyle}>
      <div style={{ fontSize: 18, fontWeight: 950, marginBottom: 10 }}>{icon} {title}</div>
      <div style={{ display: "grid", gap: 8 }}>
        {items.map((x, i) => (
          <div key={i} style={itemStyle}>
            <span style={{ color: "#a78bfa", fontWeight: 950 }}>•</span>
            <span>{x}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ABCFloatingAnalysis() {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<ABCResult | null>(null)

  useEffect(() => {
    const openWindow = () => setOpen(true)
    window.addEventListener("marketcard:open-abc", openWindow)
    return () => window.removeEventListener("marketcard:open-abc", openWindow)
  }, [])

  async function runABC() {
    setError("")
    setResult(null)

    const token = localStorage.getItem("access_token")
    const cleanUrl = url.trim()

    if (!cleanUrl) return setError("Вставьте ссылку на товар")
    if (!token) return setError("Войдите в аккаунт")

    setLoading(true)
    try {
      const res = await fetch("/api/abc-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ url: cleanUrl }),
      })

      const data = await res.json()
      if (!res.ok) return setError(data?.detail || "Ошибка ABC анализа")

      setResult(data)
      window.dispatchEvent(new Event("marketcard:profile-refresh"))
    } catch {
      setError("Ошибка запроса")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <div>
            <div style={eyebrowStyle}>MARKETCARD AI · ABC</div>
            <h2 style={titleStyle}>ABC анализ</h2>
          </div>
          <button onClick={() => setOpen(false)} style={closeStyle}>×</button>
        </div>

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Вставьте ссылку на товар"
          style={inputStyle}
        />

        <button onClick={runABC} disabled={loading} style={mainButtonStyle}>
          {loading ? "Анализируем..." : "Запустить ABC анализ"}
        </button>

        {error && <div style={errorStyle}>{error}</div>}

        {result && (
          <div style={resultWrapStyle}>
            <div style={heroStyle}>
              <div>
                <div style={miniLabelStyle}>РЕШЕНИЕ</div>
                <div style={decisionStyle}>{result.decision}</div>
                <div style={productStyle}>
                  {result.product_query || "Товар"} · {result.marketplace || "market"}
                </div>
              </div>
              <div style={badgeStyle}>{result.abc_class}</div>
            </div>

            <div style={miniGridStyle}>
              <div style={miniCardStyle}><div style={miniLabelStyle}>Класс</div><div style={miniValueStyle}>{result.abc_class}</div></div>
              <div style={miniCardStyle}><div style={miniLabelStyle}>Уверенность</div><div style={miniValueStyle}>{result.confidence || 0}%</div></div>
              <div style={miniCardStyle}><div style={miniLabelStyle}>Аудиты</div><div style={miniValueStyle}>{result.audit_credits_left ?? "-"}</div></div>
            </div>

            <Block title="Почему" icon="🧠" items={result.why} />
            <Block title="Риски" icon="⚠️" items={result.risks} />
            <Block title="Возможности" icon="🚀" items={result.opportunities} />
            <Block title="Стратегия входа" icon="🎯" items={result.entry_strategy} />
            <Block title="План на 7 дней" icon="📅" items={result.launch_plan_7_days} />
          </div>
        )}
      </div>
    </div>
  )
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 10050,
  background: "rgba(15,23,42,0.18)",
  backdropFilter: "blur(10px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "70px 16px 24px",
  overflowY: "auto",
}

const modalStyle: React.CSSProperties = {
  width: "min(920px, 100%)",
  maxHeight: "calc(100vh - 100px)",
  overflowY: "auto",
  background: "rgba(15,23,42,0.94)",
  border: "1px solid rgba(255,255,255,0.14)",
  boxShadow: "0 28px 90px rgba(0,0,0,0.45)",
  borderRadius: 28,
  padding: 28,
  color: "white",
}

const headerStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", marginBottom: 18 }
const eyebrowStyle: React.CSSProperties = { fontSize: 13, opacity: 0.8, fontWeight: 950 }
const titleStyle: React.CSSProperties = { margin: 0, marginTop: 8, fontSize: 38, fontWeight: 950 }
const closeStyle: React.CSSProperties = { width: 44, height: 44, borderRadius: 14, border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.1)", color: "white", fontSize: 22, fontWeight: 950, cursor: "pointer" }

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "16px 18px",
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(15,23,42,0.72)",
  color: "white",
  fontWeight: 850,
  marginBottom: 12,
}

const mainButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "17px",
  borderRadius: 18,
  border: "none",
  background: "linear-gradient(135deg,#60a5fa,#c084fc)",
  color: "white",
  fontWeight: 950,
}

const errorStyle: React.CSSProperties = { marginTop: 14, padding: 14, borderRadius: 16, background: "rgba(244,63,94,0.14)", color: "#fecdd3", fontWeight: 900 }

const resultWrapStyle: React.CSSProperties = { display: "grid", gap: 14, marginTop: 18 }
const heroStyle: React.CSSProperties = { padding: 20, borderRadius: 24, background: "rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }
const decisionStyle: React.CSSProperties = { fontSize: 32, fontWeight: 950, marginTop: 8 }
const productStyle: React.CSSProperties = { marginTop: 8, opacity: 0.78 }

const badgeStyle: React.CSSProperties = { width: 78, height: 78, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, fontWeight: 950, background: "linear-gradient(135deg,#60a5fa,#c084fc)" }

const miniGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }
const miniCardStyle: React.CSSProperties = { padding: 14, borderRadius: 18, background: "rgba(255,255,255,0.06)" }
const miniLabelStyle: React.CSSProperties = { fontSize: 12, opacity: 0.72 }
const miniValueStyle: React.CSSProperties = { marginTop: 6, fontSize: 24, fontWeight: 950 }

const blockStyle: React.CSSProperties = { padding: 16, borderRadius: 18, background: "rgba(255,255,255,0.06)" }
const itemStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "16px 1fr", gap: 8 }
