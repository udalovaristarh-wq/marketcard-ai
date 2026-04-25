"use client"

import React, { useState } from "react"

type Result = {
  count: number
  sellers: number
  avg_price: number
  min_price: number
  max_price: number
  recommended_price: string
  competition: string
  demand: string
  saturation: string
  reviews_total?: number
  avg_rating?: number
  price_buckets?: { range: string; count: number }[]
}

export default function ProductIntelligencePanel() {
  const [marketplace, setMarketplace] = useState("uzum")
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<Result | null>(null)

  async function analyze() {
    setError("")
    setResult(null)

    const q = query.trim()
    const c = category.trim() || "товары"

    if (!q) {
      setError("Введите товар")
      return
    }

    if (marketplace !== "uzum") {
      setError("Сейчас подключён анализ Uzum. Остальные маркетплейсы добавим следующим шагом.")
      return
    }

    setLoading(true)

    try {
      const url = `/api/analysis/uzum?query=${encodeURIComponent(q)}&category=${encodeURIComponent(c)}`
      const res = await fetch(url)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(getErrorText(data?.detail || data || "Ошибка анализа"))
      }

      setResult(data)
    } catch (e: any) {
      setError(getErrorText(e?.message || e || "Ошибка анализа"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={panelStyle}>
      <h2 style={{ fontSize: "34px", fontWeight: 900, marginBottom: "10px" }}>
        📊 Аналитика товара
      </h2>

      <p style={{ opacity: 0.85, marginBottom: "18px", fontWeight: 700 }}>
        Введите товар, выберите маркетплейс — система найдёт конкурентов и рассчитает цену, спрос и насыщенность.
      </p>

      <div style={{ display: "grid", gap: "12px" }}>
        <select value={marketplace} onChange={(e) => setMarketplace(e.target.value)} style={inputStyle}>
          <option value="uzum">Uzum</option>
          <option value="wb">Wildberries скоро</option>
          <option value="ozon">Ozon скоро</option>
          <option value="yandex">Yandex Market скоро</option>
        </select>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Например: наушники"
          style={inputStyle}
        />

        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Категория: электроника, одежда..."
          style={inputStyle}
        />

        <button onClick={analyze} disabled={loading} style={buttonStyle}>
          {loading ? "Анализируем..." : "Проанализировать товар · 2 аудита"}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: "16px", color: "#fb7185", fontWeight: 900 }}>
          {getErrorText(error)}
        </div>
      )}

      {result && (
        <div style={{ marginTop: "22px" }}>
          <div style={statsGridStyle}>
            <Stat label="Товаров найдено" value={result.count} />
            <Stat label="Продавцов" value={result.sellers} />
            <Stat label="Средняя цена" value={formatUZS(result.avg_price)} />
            <Stat label="Минимальная цена" value={formatUZS(result.min_price)} />
            <Stat label="Максимальная цена" value={formatUZS(result.max_price)} />
            <Stat label="Рекомендуемая цена" value={formatRangeUZS(result.recommended_price)} />
          </div>

          {result.price_buckets && result.price_buckets.length > 0 && (
            <LivePricePulse buckets={result.price_buckets} />
          )}

          <div style={summaryStyle}>
            Конкуренция: {result.competition}<br />
            Спрос: {result.demand}<br />
            Средний рейтинг: {result.avg_rating ?? "-"}<br />
            Отзывов всего: {(result.reviews_total ?? 0).toLocaleString("ru-RU")}<br />
            Вывод: {result.saturation}
          </div>
        </div>
      )}
    </div>
  )
}

















const panelStyle: React.CSSProperties = {
  padding: "28px",
  borderRadius: "28px",
  background: "rgba(15,23,42,0.72)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "0 24px 70px rgba(0,0,0,0.35)",
  color: "white",
  maxWidth: "1100px",
  marginTop: "24px",
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(15,23,42,0.65)",
  color: "white",
  fontWeight: 800,
  outline: "none",
}

const buttonStyle: React.CSSProperties = {
  padding: "18px",
  borderRadius: "18px",
  border: "none",
  background: "linear-gradient(135deg,#22c55e,#06b6d4)",
  color: "white",
  fontWeight: 900,
  fontSize: "16px",
  cursor: "pointer",
}

const statsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
  gap: "12px",
  marginBottom: "16px",
}

const statStyle: React.CSSProperties = {
  padding: "14px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.14)",
}

const chartBoxStyle: React.CSSProperties = {
  padding: "18px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.14)",
  marginBottom: "16px",
  overflow: "hidden",
}

const scannerStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "70px",
  height: "100%",
  background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.18), transparent)",
  animation: "scanPulse 2.4s linear infinite",
}

const summaryStyle: React.CSSProperties = {
  padding: "18px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.14)",
  fontWeight: 900,
  lineHeight: 1.7,
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={statStyle}>
      <div style={{ fontSize: "13px", opacity: 0.75, fontWeight: 800 }}>
        {label}
      </div>
      <div style={{ fontSize: "20px", fontWeight: 900, marginTop: "6px" }}>
        {value}
      </div>
    </div>
  )
}

function formatUZS(value: number | string | undefined | null) {
  if (value === undefined || value === null) return "0 сум"

  const n = Number(value)
  if (!Number.isFinite(n)) return String(value)

  return `${n.toLocaleString("ru-RU")} сум`
}

function formatRangeUZS(value: string | number | undefined | null) {
  if (value === undefined || value === null) return "0 сум"

  const raw = String(value)

  if (raw.includes("-")) {
    const [a, b] = raw.split("-").map((x) => Number(x.trim()))

    if (Number.isFinite(a) && Number.isFinite(b)) {
      return `${a.toLocaleString("ru-RU")} – ${b.toLocaleString("ru-RU")} сум`
    }
  }

  return formatUZS(raw)
}

function LivePricePulse({ buckets }: { buckets?: { range: string; count: number }[] }) {
  const values = buckets?.map(b => b.count) ?? [4, 12, 7, 18, 10, 22, 13, 19, 8, 14]

  const max = Math.max(...values, 1)

  const points = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * 100
      const y = 50 - (v / max) * 34
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div style={{
      padding: "18px",
      borderRadius: "18px",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.14)",
      marginBottom: "16px",
      overflow: "hidden",
    }}>
      <div style={{ fontSize: "22px", fontWeight: 900, marginBottom: "10px" }}>
        📉 Живой график цены
      </div>

      <div style={{ position: "relative", height: "180px" }}>
        <svg viewBox="0 0 100 60" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="pulseLine" x1="0" x2="1">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          { [10,20,30,40,50].map(y => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />
          ))}

          <polyline
            points={points}
            fill="none"
            stroke="url(#pulseLine)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}


function getErrorText(value: any) {
  if (!value) return ""
  if (typeof value === "string") return value
  if (typeof value?.detail === "string") return value.detail
  try {
    return JSON.stringify(value)
  } catch {
    return "Ошибка анализа"
  }
}
