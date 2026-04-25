type Lang = "ru" | "uz" | "en"

const data = {
  ru: {
    company: "MarketCard AI — это AI-платформа для продавцов маркетплейсов, которая помогает создавать карточки товаров, SEO-описания, аналитику, ABC-анализ, оценку карточек и расчёт unit-экономики в одной системе.",
    founder: "Основатель и генеральный директор — Удалов Аристарх Александрович. Проект развивается на стыке искусственного интеллекта, информационной безопасности, IT-бизнеса, SaaS и e-commerce.",
    mission: "Наша цель — заменить рутинные задачи дизайнера, маркетолога, SEO-специалиста и аналитика одним понятным AI-инструментом для предпринимателей.",
    team: "Команда MarketCard AI создаёт продукт для тех, кто хочет быстрее запускать товары, улучшать карточки, анализировать конкурентов и принимать решения на основе данных.",
    tools: "Инструменты платформы помогают продавцам экономить время, снижать ошибки, улучшать визуал карточек и повышать эффективность продаж.",
  },
  uz: {
    company: "MarketCard AI — marketpleys sotuvchilari uchun AI platforma. U mahsulot kartalari, SEO tavsiflar, tahlil, ABC tahlil va unit-iqtisodiyotni bitta tizimda birlashtiradi.",
    founder: "Asoschi va bosh direktor — Udalov Aristarx Aleksandrovich. Loyiha AI, axborot xavfsizligi, IT-biznes, SaaS va e-commerce yo‘nalishida rivojlanmoqda.",
    mission: "Maqsadimiz — dizayner, marketolog, SEO mutaxassisi va tahlilchi ishlarini bitta AI vosita orqali avtomatlashtirish.",
    team: "MarketCard AI jamoasi mahsulotlarni tezroq ishga tushirish, kartalarni yaxshilash va raqobatchilarni tahlil qilish uchun platforma yaratadi.",
    tools: "Platforma vositalari sotuvchilarga vaqtni tejash, xatolarni kamaytirish va savdo samaradorligini oshirishga yordam beradi.",
  },
  en: {
    company: "MarketCard AI is an AI platform for marketplace sellers. It combines product card generation, SEO descriptions, analytics, ABC analysis, card scoring and unit economics in one system.",
    founder: "Founder and CEO — Aristarkh Aleksandrovich Udalov. The project is developed at the intersection of AI, information security, IT business, SaaS and e-commerce.",
    mission: "Our goal is to replace routine work of designers, marketers, SEO specialists and analysts with one clear AI tool for entrepreneurs.",
    team: "The MarketCard AI team builds a product for sellers who want to launch products faster, improve cards, analyze competitors and make data-based decisions.",
    tools: "The platform helps sellers save time, reduce mistakes, improve product visuals and increase sales efficiency.",
  },
}

export default function AboutSeoBlocks({ lang = "ru" }: { lang?: Lang }) {
  const t = data[lang]

  return (
    <section style={{ display: "grid", gap: "28px", marginTop: "50px" }}>
      <Block title="О компании MarketCard AI" text={t.company} />
      <Block title="Основатель и CEO" text={t.founder} />
      <Block title="Миссия продукта" text={t.mission} />
      <Block title="Команда и разработка" text={t.team} />
      <Block title="Польза для продавцов" text={t.tools} />
    </section>
  )
}

function Block({ title, text }: { title: string; text: string }) {
  return (
    <div style={{
      padding: "42px",
      borderRadius: "30px",
      background: "linear-gradient(180deg, rgba(15,23,42,0.96), rgba(2,6,23,0.98))",
      border: "1px solid rgba(34,211,238,0.28)",
      boxShadow: "0 28px 80px rgba(0,0,0,0.42)",
      color: "white",
    }}>
      <h2 style={{ margin: "0 0 18px", fontSize: "34px", fontWeight: 950 }}>{title}</h2>
      <p style={{ margin: 0, fontSize: "19px", lineHeight: 1.75, color: "#cbd5e1" }}>{text}</p>
    </div>
  )
}
