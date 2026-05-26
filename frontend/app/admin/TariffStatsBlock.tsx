"use client"

import { useEffect, useState } from "react"

export default function TariffStatsBlock() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch("/api/admin/tariff-stats")
      .then(res => res.json())
      .then(setData)
  }, [])

  if (!data) return <div>Загрузка...</div>

  return (
    <div style={{marginTop: 30}}>
      <h2>📊 Тарифы</h2>

      {Object.entries(data).map(([name, val]: any) => (
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
