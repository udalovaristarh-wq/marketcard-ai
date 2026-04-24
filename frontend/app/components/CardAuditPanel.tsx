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
}

export default function CardAuditPanel() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
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

      const res = await fetch("/api/card-audit/analyze", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data?.detail || data?.error || "Ошибка анализа")
      }

      const audit = data.audit?.raw ? JSON.parse(data.audit.raw) : data.audit
      setResult(audit)
    } catch (e: any) {
      setError(e?.message || "Не удалось проанализировать карточку")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      maxWidth: "1180px",
      padding: "28px",
      borderRadius: "24px",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.10)",
      boxShadow: "0 18px 45px rgba(0,0,0,0.28)",
      backdropFilter: "blur(14px)"
    }}>
      <div style={{ fontSize: "34px", fontWeight: 900, marginBottom: "12px" }}>
        Оценка карточки товара
      </div>

      <input type="file" accept="image/*" onChange={onFileChange} />

      {preview && <img src={preview} style={{ maxWidth: "300px", marginTop: "10px" }} />}

      <button onClick={analyze} style={{
        marginTop: "12px",
        padding: "12px 18px",
        borderRadius: "999px",
        background: "#22c55e",
        color: "#fff",
        border: "none"
      }}>
        {loading ? "Анализ..." : "Оценить"}
      </button>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <div>Оценка: {result.score}</div>
          <div>{result.summary}</div>

          <Block title="Плюсы" items={result.pros} />
          <Block title="Минусы" items={result.cons} />
          <Block title="Рекомендации" items={result.recommendations} />

          <div>{result.sales_verdict}</div>
        </div>
      )}
    </div>
  )
}

function Block({ title, items }: { title: string; items?: string[] }) {
  return (
    <div style={{ marginTop: "10px" }}>
      <b>{title}</b>
      {(items || []).map((item, i) => (
        <div key={i}>{i + 1}. {item}</div>
      ))}
    </div>
  )
}
