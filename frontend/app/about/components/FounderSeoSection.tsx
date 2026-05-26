type Lang = "ru" | "uz" | "en"

type Props = {
  lang?: Lang
}

const texts = {
  ru: {
    title: "MarketCard AI — инновационная AI-платформа для продавцов маркетплейсов",
    text: "MarketCard AI объединяет генерацию карточек, SEO, аналитику, ABC-анализ, оценку карточек и unit-экономику в одной системе.",
    founder: "Основатель — Удалов Аристарх Александрович",
    missionTitle: "Миссия",
    missionText: "Заменить рутину предпринимателя искусственным интеллектом",
    toolsTitle: "Инструменты",
  },
  uz: {
    title: "MarketCard AI — AI platforma",
    text: "Barcha marketing vositalari bitta tizimda.",
    founder: "Asoschi — Udalov Aristarx",
    missionTitle: "Missiya",
    missionText: "AI orqali biznesni avtomatlashtirish",
    toolsTitle: "Vositalar",
  },
  en: {
    title: "MarketCard AI — AI platform",
    text: "All marketing tools in one system.",
    founder: "Founder — Aristarkh Udalov",
    missionTitle: "Mission",
    missionText: "Replace routine with AI",
    toolsTitle: "Tools",
  },
}

const toolTexts = {
  ru: [
    ["Генерация", "Карточки товаров"],
    ["SEO", "Описание и ключи"],
    ["Аналитика", "Анализ рынка"],
  ],
  uz: [
    ["Generator", "Mahsulot kartalari"],
    ["SEO", "Tavsif"],
    ["Tahlil", "Bozor analizi"],
  ],
  en: [
    ["Generator", "Product cards"],
    ["SEO", "Descriptions"],
    ["Analytics", "Market analysis"],
  ],
}

export const FounderSeoSection = ({ lang = "ru" }: Props) => {
  const t = texts[lang]
  return (
    <section style={sectionStyle}>
      <h2 style={titleStyle}>{t.title}</h2>
      <p style={textStyle}>{t.text}</p>
      <p style={textStyle}>{t.founder}</p>
    </section>
  )
}

export const ProductToolsSection = ({ lang = "ru" }: Props) => {
  const tools = toolTexts[lang]

  return (
    <section style={sectionStyle}>
      <h2 style={titleStyle}>Инструменты</h2>
      <div style={gridStyle}>
        {tools.map(([title, text]) => (
          <div key={title} style={cardStyle}>
            <h3 style={cardTitle}>{title}</h3>
            <p style={cardText}>{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const sectionStyle = {
  marginTop: "40px",
  padding: "40px",
  borderRadius: "20px",
  background: "#0b101d",
}

const titleStyle = {
  fontSize: "32px",
  color: "#fff",
}

const textStyle = {
  fontSize: "18px",
  color: "#cbd5e1",
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: "16px",
}

const cardStyle = {
  padding: "20px",
  background: "rgba(255,255,255,0.05)",
  borderRadius: "16px",
}

const cardTitle = {
  color: "#fff",
}

const cardText = {
  color: "#cbd5e1",
}
