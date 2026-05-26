"use client"

import { useEffect, useState } from "react"

type TopUser = {
  user_id: number
  email: string
  full_name: string
  tariff_name: string
  income_uzs: number
  expense_usd: number
  generations: number
}

type TopUsersResponse = {
  count: number
  items: TopUser[]
}

function formatUzs(value: number) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(value || 0)) + " сум"
}

function formatUsd(value: number) {
  return "$" + Number(value || 0).toFixed(4)
}

export default function TopUsersBlock() {
  const [data, setData] = useState<TopUsersResponse | null>(null)

  useEffect(() => {
    fetch("/api/admin/top-users")
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
        Загрузка top users...
      </div>
    )
  }

  return (
    <div style={{ marginTop: 28 }}>
      <div style={{
        fontSize: 30,
        fontWeight: 900,
        color: "white",
        marginBottom: 18
      }}>
        Топ пользователи
      </div>

      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 18,
        overflow: "hidden"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
          gap: 12,
          padding: "14px 16px",
          fontWeight: 800,
          color: "#cbd5e1",
          borderBottom: "1px solid rgba(255,255,255,0.08)"
        }}>
          <div>Email</div>
          <div>Тариф</div>
          <div>Генерации</div>
          <div>Доход</div>
          <div>Расход</div>
        </div>

        {data.items.map((item, idx) => (
          <div
            key={item.user_id || idx}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
              gap: 12,
              padding: "14px 16px",
              color: "white",
              borderBottom: idx === data.items.length - 1 ? "none" : "1px solid rgba(255,255,255,0.06)"
            }}
          >
            <div>{item.email || "—"}</div>
            <div>{item.tariff_name || "—"}</div>
            <div>{item.generations}</div>
            <div>{formatUzs(item.income_uzs)}</div>
            <div>{formatUsd(item.expense_usd)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
