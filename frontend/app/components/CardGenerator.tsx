"use client"

export default function CardGenerator() {
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
        Генератор карточек
      </div>

      <div
        style={{
          fontSize: "16px",
          color: "#cbd5e1",
          marginBottom: "22px",
        }}
      >
        Здесь будет красивый экран генерации карточек товаров.
      </div>

      <div style={{ display: "grid", gap: "16px" }}>
        <label style={labelStyle}>Загрузить фото товара</label>
        <input type="file" style={inputStyle} />

        <label style={labelStyle}>Название товара</label>
        <input type="text" placeholder="Например: Насос ГУР Cobalt" style={inputStyle} />

        <label style={labelStyle}>Бренд</label>
        <input type="text" placeholder="Например: BRAVE" style={inputStyle} />

        <label style={labelStyle}>Категория</label>
        <input type="text" placeholder="Например: Автозапчасти" style={inputStyle} />

        <button style={buttonStyle}>
          AI генерация
        </button>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: "15px",
  color: "#e5e7eb",
  fontWeight: 800,
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

const buttonStyle: React.CSSProperties = {
  marginTop: "8px",
  padding: "18px 22px",
  borderRadius: "18px",
  border: "none",
  background: "linear-gradient(135deg,#0ea5e9,#06b6d4)",
  color: "white",
  cursor: "pointer",
  fontSize: "20px",
  fontWeight: 900,
  boxShadow: "0 16px 30px rgba(0,0,0,0.24)",
}