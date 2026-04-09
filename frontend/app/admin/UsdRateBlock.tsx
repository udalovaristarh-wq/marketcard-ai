"use client";

import { useEffect, useState } from "react";

type RateData = {
  rate: number | null;
  date: string | null;
  source?: string | null;
};

function formatRate(value: number | null) {
  if (!value) return "—";
  return new Intl.NumberFormat("ru-RU").format(Number(value)) + " сум";
}

export default function UsdRateBlock() {
  const [data, setData] = useState<RateData | null>(null);

  const load = () => {
    fetch("/api/admin/usd-rate", { cache: "no-store" })
      .then((res) => res.json())
      .then(setData);
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div
      style={{
        marginTop: 28,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        padding: 18,
        color: "white",
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>
        Курс USD / UZS
      </div>

      <div style={{ fontSize: 36, fontWeight: 900, marginBottom: 10 }}>
        {formatRate(data?.rate ?? null)}
      </div>

      <div style={{ color: "#cbd5e1", fontSize: 14 }}>
        Дата курса: {data?.date || "—"}
      </div>

      <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 6 }}>
        Источник: {data?.source || "CBU"}
      </div>
    </div>
  );
}
