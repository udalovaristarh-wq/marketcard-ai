export const HeroSection = () => (
  <div style={{ padding: "40px", background: "linear-gradient(135deg, #0b101d 0%, #1a202c 100%)", borderRadius: "24px", border: "1px solid #3b82f6", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
    <h2 style={{ fontSize: "36px", marginBottom: "20px", color: "#ffffff" }}>MarketCard AI — будущее e-commerce</h2>
    <p style={{ fontSize: "18px", lineHeight: "1.6", color: "#cbd5e0", marginBottom: "30px" }}>
      Добро пожаловать в новую эру автоматизации ритейла. MarketCard AI — это уникальная интеллектуальная экосистема, разработанная для тех, кто не согласен на меньшее, чем лидерство на маркетплейсах. Мы превращаем ваш товар в высококонверсионный актив.
    </p>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
      <div style={{ padding: "20px", background: "#1a1f2e", borderRadius: "12px" }}>
        <h4 style={{ color: "#3b82f6" }}>🚀 Генерация за 1 клик</h4>
        <p style={{ fontSize: "14px", color: "#a0aec0" }}>Создание серий карточек и описаний с помощью ИИ.</p>
      </div>
      <div style={{ padding: "20px", background: "#1a1f2e", borderRadius: "12px" }}>
        <h4 style={{ color: "#3b82f6" }}>📊 Unit-экономика</h4>
        <p style={{ fontSize: "14px", color: "#a0aec0" }}>Автоматизация расчетов и аналитика эффективности.</p>
      </div>
    </div>
    <div style={{ borderTop: "1px solid #2d3748", paddingTop: "20px" }}>
      <p style={{ fontWeight: "bold", color: "#ffffff" }}>Основатель: Удалов Аристарх Александрович</p>
      <p style={{ fontSize: "14px", color: "#718096" }}>© MarketCard AI, Узбекистан, г. Ташкент</p>
    </div>
  </div>
)
