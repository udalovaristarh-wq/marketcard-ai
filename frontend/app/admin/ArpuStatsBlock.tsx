"use client"

import { useEffect, useState } from "react"

function formatUzs(value: number) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(value || 0)) + " сум"
}

function formatUsd(value: number) {
  return "$" + Number(value || 0).toFixed(4)
}

type ArpuData = {
  total_users: number
  paying_users: number
  total_income_uzs: number
  total_expense_usd: number
  total_generations: number
  arpu_uzs: number
  avg_check_uzs: number
  revenue_per_generation_uzs: number
  avg_cost_per_generation_usd: number
  profit_note?: string
}

import { authFetch } from "@/lib/auth"

export default function ArpuStatsBlock() {
  const [data, setData] = useState<ArpuData | null>(null)

  useEffect(() => {
    authFetch("/api/admin/arpu-stats")
      .then(res => res.json())
      .then(setData)
  }, [])

  if (!data) {
    return (
      <div style={{
        marginTop: 24,
        padding: 20,
        borderRadius: 20,
        background: "rgba(255,255,255,0.04)",
        color: "white"
      }}>
        Загрузка ARPU...
      </div>
    )
  }

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 18,
    color: "white"
  }

  return (
    <div style={{ marginTop: 28 }}>
      <div style={{
        fontSize: 30,
        fontWeight: 900,
        color: "white",
        marginBottom: 18
      }}>
        ARPU и бизнес-метрики
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 16
      }}>
        <div style={cardStyle}>
          <div style={{ opacity: 0.7, marginBottom: 8 }}>Всего пользователей</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{data.total_users}</div>
        </div>

        <div style={cardStyle}>
          <div style={{ opacity: 0.7, marginBottom: 8 }}>Платящих пользователей</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{data.paying_users}</div>
        </div>

        <div style={cardStyle}>
          <div style={{ opacity: 0.7, marginBottom: 8 }}>Всего генераций</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{data.total_generations}</div>
        </div>

        <div style={cardStyle}>
          <div style={{ opacity: 0.7, marginBottom: 8 }}>ARPU</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{formatUzs(data.arpu_uzs)}</div>
        </div>

        <div style={cardStyle}>
          <div style={{ opacity: 0.7, marginBottom: 8 }}>Средний чек</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{formatUzs(data.avg_check_uzs)}</div>
        </div>

        <div style={cardStyle}>
          <div style={{ opacity: 0.7, marginBottom: 8 }}>Доход на 1 генерацию</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{formatUzs(data.revenue_per_generation_uzs)}</div>
        </div>

        <div style={cardStyle}>
          <div style={{ opacity: 0.7, marginBottom: 8 }}>Общий доход</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{formatUzs(data.total_income_uzs)}</div>
        </div>

        <div style={cardStyle}>
          <div style={{ opacity: 0.7, marginBottom: 8 }}>Общий расход</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{formatUsd(data.total_expense_usd)}</div>
        </div>

        <div style={cardStyle}>
          <div style={{ opacity: 0.7, marginBottom: 8 }}>Средняя себестоимость 1 генерации</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{formatUsd(data.avg_cost_per_generation_usd)}</div>
        </div>
      </div>
    </div>
  )
}
