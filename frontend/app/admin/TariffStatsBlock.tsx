"use client"

import { useEffect, useState } from "react"
import { authFetch } from "@/lib/auth"

type TariffStat = {
  users: number
  revenue: number
}

export default function TariffStatsBlock() {
  const [data, setData] = useState<Record<string, TariffStat> | null>(null)

  useEffect(() => {
    authFetch("/api/admin/tariff-stats")
      .then(res => res.json())
      .then(setData)
  }, [])

  if (!data) return <div>Загрузка...</div>

  return (
    <div style={{marginTop: 30}}>
      <h2>📊 Тарифы</h2>

      {Object.entries(data).map(([name, val]) => (
        <div key={name} style={{
          border: "1px solid #333",
          padding: 15,
          marginTop: 10,
          borderRadius: 10
        }}>
          <h3>{name}</h3>
          <p>Пользователи: {val.users}</p>
          <p>Доход: {val.revenue.toLocaleString()} сум</p>
        </div>
      ))}
    </div>
  )
}
