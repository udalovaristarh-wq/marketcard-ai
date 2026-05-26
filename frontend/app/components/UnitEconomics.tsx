"use client"

export default function UnitEconomics() {
  return (
    <div
      style={{
        padding: "28px",
        borderRadius: "24px",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 18px 45px rgba(0,0,0,0.28)",
        backdropFilter: "blur(14px)",
      }}
    >
      <div
        style={{
          fontSize: "36px",
          fontWeight: 900,
          marginBottom: "18px",
          color: "white",
        }}
      >
        Юнит-экономика
      </div>

      <div
        style={{
          fontSize: "16px",
          color: "#cbd5e1",
          marginBottom: "22px",
        }}
      >
        Отдельный экран для расчёта прибыльной цены товара.
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        <input type="number" placeholder="Закупка товара ($)" style={inputStyle} />
        <input type="number" placeholder="Курс доллара" style={inputStyle} />
        <input type="number" placeholder="Комиссия маркетплейса (%)" style={inputStyle} />
        <input type="number" placeholder="Логистика маркетплейса" style={inputStyle} />
        <input type="number" placeholder="Внутренняя логистика" style={inputStyle} />
        <input type="number" placeholder="Маркетинг / реклама" style={inputStyle} />
        <input type="number" placeholder="Упаковка" style={inputStyle} />
        <input type="number" placeholder="Прочие расходы" style={inputStyle} />
        <input type="number" placeholder="Желаемая чистая прибыль" style={inputStyle} />
        <input type="number" placeholder="Средняя цена конкурентов" style={inputStyle} />
      </div>

      <button
        style={{
          marginTop: "20px",
          padding: "18px 22px",
          borderRadius: "18px",
          border: "none",
          background: "linear-gradient(135deg,#22c55e,#16a34a)",
          color: "white",
          cursor: "pointer",
          fontSize: "20px",
          fontWeight: 900,
          boxShadow: "0 16px 30px rgba(0,0,0,0.24)",
        }}
      >
        Рассчитать
      </button>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "16px 18px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
}