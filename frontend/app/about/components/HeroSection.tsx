export const HeroSection = () => (
  <section
    style={{
      marginTop: "50px",
      padding: "56px",
      borderRadius: "36px",
      background:
        "radial-gradient(circle at 15% 0%, rgba(34,211,238,0.22), transparent 34%), radial-gradient(circle at 85% 15%, rgba(168,85,247,0.18), transparent 32%), linear-gradient(180deg, rgba(15,23,42,0.92), rgba(2,6,23,0.96))",
      border: "1px solid rgba(34,211,238,0.42)",
      boxShadow:
        "0 0 0 1px rgba(255,255,255,0.06), 0 28px 90px rgba(0,0,0,0.55), inset 0 0 80px rgba(34,211,238,0.08)",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: "18px",
        borderRadius: "28px",
        border: "1px solid rgba(255,255,255,0.08)",
        pointerEvents: "none",
      }}
    />

    <div style={{ position: "relative", zIndex: 2 }}>
      <div
        style={{
          display: "inline-flex",
          padding: "10px 16px",
          borderRadius: "999px",
          background: "rgba(34,211,238,0.12)",
          border: "1px solid rgba(34,211,238,0.35)",
          color: "#67e8f9",
          fontWeight: 900,
          marginBottom: "24px",
        }}
      >
        AI · Marketplace · Automation · SaaS
      </div>

      <h2
        style={{
          fontSize: "46px",
          lineHeight: 1.12,
          margin: "0 0 22px",
          color: "#ffffff",
          fontWeight: 950,
          letterSpacing: "-1px",
        }}
      >
        MarketCard AI — интеллектуальная система для роста продавцов
      </h2>

      <p
        style={{
          fontSize: "20px",
          lineHeight: 1.7,
          color: "#dbeafe",
          maxWidth: "940px",
          marginBottom: "30px",
          fontWeight: 650,
        }}
      >
        MarketCard AI помогает предпринимателям и продавцам маркетплейсов превращать обычное фото товара
        в готовый коммерческий инструмент: продающую карточку, SEO-описание, аналитику, стратегию входа
        в нишу и расчёт прибыльности.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "16px",
          marginTop: "28px",
        }}
      >
        <HeroCard title="🚀 Генерация карточек" text="AI создаёт визуальный контент и инфографику для маркетплейсов." />
        <HeroCard title="📊 Аналитика товара" text="Система анализирует конкурентов, цену, спрос и насыщенность ниши." />
        <HeroCard title="🧠 ABC-анализ" text="Помогает понять, стоит ли заходить в товар и какую стратегию выбрать." />
        <HeroCard title="💰 Unit-экономика" text="Считает себестоимость, расходы, комиссии и потенциальную прибыль." />
      </div>

      <div
        style={{
          marginTop: "34px",
          paddingTop: "24px",
          borderTop: "1px solid rgba(255,255,255,0.12)",
          color: "#cbd5e1",
          fontSize: "17px",
          lineHeight: 1.7,
        }}
      >
        <b style={{ color: "#ffffff" }}>Основатель и генеральный директор:</b> Удалов Аристарх Александрович
        <br />
        <b style={{ color: "#ffffff" }}>Компания:</b> MarketCard AI · Ташкент, Узбекистан
      </div>
    </div>
  </section>
)

function HeroCard({ title, text }: { title: string; text: string }) {
  return (
    <div
      style={{
        padding: "22px",
        borderRadius: "22px",
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      <h3 style={{ margin: "0 0 10px", color: "#ffffff", fontSize: "19px", fontWeight: 950 }}>
        {title}
      </h3>
      <p style={{ margin: 0, color: "#cbd5e1", fontSize: "16px", lineHeight: 1.6 }}>
        {text}
      </p>
    </div>
  )
}
