"use client"

import React, { useState } from "react"

type AuditResult = {
  raw?: string
  score?: number
  summary?: string
  pros?: string[]
  cons?: string[]
  recommendations?: string[]
  sales_verdict?: string
  conversion_score?: number
  design_score?: number
  readability_score?: number
  trust_score?: number
}

export default function CardAuditPanel() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AuditResult | null>(null)
  const [error, setError] = useState("")

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    setResult(null)
    setError("")
  }

  const analyze = async () => {
    if (!file) {
      setError("Сначала загрузите изображение карточки")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      setLoading(true)
      setError("")
      setResult(null)

      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("Вы не авторизованы")
      }

      const res = await fetch("/api/card-audit/analyze", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data?.detail || data?.error || "Ошибка анализа")
      }

      let audit = data.audit

      try {
        const raw = data.audit?.raw
        if (raw && typeof raw === "string") {
          let clean = raw.trim()

          if (clean.startsWith("```json")) {
            clean = clean.replace("```json", "").replace("```", "").trim()
          }

          if (clean.startsWith("json")) {
            clean = clean.slice(4).trim()
          }

          audit = JSON.parse(clean)
        }
      } catch (e) {
        console.error("JSON parse error:", e)
      }

      setResult(audit)
    } catch (e: any) {
      setError(e?.message || "Не удалось проанализировать карточку")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: "1180px", padding: "28px", borderRadius: "24px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}>
      <div style={{ fontSize: "34px", fontWeight: 900, marginBottom: "12px" }}>Оценка карточки товара</div>

      <input type="file" accept="image/*" onChange={onFileChange} style={{ color: "#fff", marginBottom: "18px" }} />

      {preview && <img src={preview} alt="preview" style={{ maxWidth: "340px", borderRadius: "18px", marginBottom: "18px" }} />}

      <button onClick={analyze} disabled={loading} style={{ padding: "14px 24px", borderRadius: "999px", border: "none", background: "linear-gradient(135deg,#22c55e,#06b6d4)", color: "#fff", fontWeight: 900 }}>
        {loading ? "AI анализирует..." : "Оценить карточку"}
      </button>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "18px", color: "#67e8f9", fontWeight: 900 }}>
          <div style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            border: "3px solid rgba(103,232,249,0.3)",
            borderTop: "3px solid #67e8f9",
            animation: "spin 0.8s linear infinite"
          }} />
          <span>AI анализирует карточку...</span>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      {error && <div style={{ color: "#fca5a5", marginTop: "18px", fontWeight: 800 }}>{error}</div>}

      {result && (
        <div style={{ display: "grid", gap: "16px", marginTop: "20px" }}>
          <div style={{ fontSize: "26px", fontWeight: 900, color: "#67e8f9" }}>
            Общая оценка: {result.score ?? "—"} / 100
          </div>

          <Score title="Конверсия" value={result.conversion_score} />
          <Score title="Дизайн" value={result.design_score} />
          <Score title="Читаемость" value={result.readability_score} />
          <Score title="Доверие" value={result.trust_score} />

          <Block title="Плюсы" items={result.pros} />
          <Block title="Минусы" items={result.cons} />
          <Block title="Рекомендации" items={result.recommendations} />

          <div style={boxStyle}>{result.sales_verdict}</div>
        </div>
      )}
    </div>
  )
}

function Score({ title, value }: { title: string; value?: number }) {
  return (
    <div style={boxStyle}>
      <b>{title}</b>
      <div>{value ?? "—"} / 10</div>
    </div>
  )
}

function Block({ title, items }: { title: string; items?: string[] }) {
  return (
    <div style={boxStyle}>
      <b>{title}</b>
      {(items || []).map((x, i) => (
        <div key={i}>{i + 1}. {x}</div>
      ))}
    </div>
  )
}

const boxStyle: React.CSSProperties = {
  padding: "16px",
  borderRadius: "18px",
  background: "rgba(15,23,42,0.55)",
  border: "1px solid rgba(255,255,255,0.10)",
  color: "#e5e7eb"
}
