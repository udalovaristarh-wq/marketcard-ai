"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

type PlanKey = "starter" | "business" | "premium"
type PaymentMethod = "click" | "payme" | null

type Lang = "ru" | "uz" | "en"

const dict = {
  ru: {
    title: "Тарифы MarketCard AI",
    subtitle:
      "Выберите подходящий тариф для генерации карточек товаров, инфографики и контента для маркетплейсов",
    back: "← Назад",
    choose: "Выбрать тариф",
    popular: "Популярный выбор",
    perMonth: "/ месяц",
    limits: "Лимиты",
    features: "Что входит",
    starter: "Старт",
    business: "Бизнес",
    premium: "Премиум",
    products100: "До 100 товаров",
    products500: "До 500 товаров",
    productsUnlimited: "Без лимита товаров",
    oneMarketplace: "1 маркетплейс",
    allMarketplaces: "Все маркетплейсы",
    basicTemplates: "Базовые шаблоны",
    excel: "Загрузка Excel",
    massGenerate: "Массовая генерация",
    seo: "SEO описание",
    aiCards: "AI генерация карточек",
    aiInfographics: "AI инфографика",
    api: "API интеграция",
    priority: "Приоритетная генерация",
    brandTemplates: "Брендовые шаблоны",
    updates: "Все будущие обновления",
    paymentTitle: "Оплата тарифа",
    paymentText: "Вы выбрали тариф",
    choosePayment: "Выберите способ оплаты",
    clickText: "Оплата через Click",
    paymeText: "Оплата через Payme",
    close: "Закрыть",
    proceed: "Перейти к оплате",
    lang: "Язык",
    note:
      "После успешной оплаты доступ к dashboard активируется автоматически.",
  },
  uz: {
    title: "MarketCard AI tariflari",
    subtitle:
      "Marketpleyslar uchun mahsulot kartalari, infografika va kontent yaratish uchun mos tarifni tanlang",
    back: "← Orqaga",
    choose: "Tarifni tanlash",
    popular: "Eng ommabop",
    perMonth: "/ oy",
    limits: "Limitlar",
    features: "Tarkibiga kiradi",
    starter: "Start",
    business: "Biznes",
    premium: "Premium",
    products100: "100 tagacha mahsulot",
    products500: "500 tagacha mahsulot",
    productsUnlimited: "Cheksiz mahsulot",
    oneMarketplace: "1 marketpleys",
    allMarketplaces: "Barcha marketpleyslar",
    basicTemplates: "Asosiy shablonlar",
    excel: "Excel yuklash",
    massGenerate: "Ommaviy generatsiya",
    seo: "SEO tavsifi",
    aiCards: "AI karta generatsiyasi",
    aiInfographics: "AI infografika",
    api: "API integratsiya",
    priority: "Ustuvor generatsiya",
    brandTemplates: "Brend shablonlari",
    updates: "Barcha kelajak yangilanishlari",
    paymentTitle: "Tarif uchun to‘lov",
    paymentText: "Siz tanlagan tarif",
    choosePayment: "To‘lov usulini tanlang",
    clickText: "Click orqali to‘lash",
    paymeText: "Payme orqali to‘lash",
    close: "Yopish",
    proceed: "To‘lovga o‘tish",
    lang: "Til",
    note:
      "Muvaffaqiyatli to‘lovdan so‘ng dashboardga kirish avtomatik faollashadi.",
  },
  en: {
    title: "MarketCard AI Pricing",
    subtitle:
      "Choose the right plan for generating product cards, infographics, and marketplace content",
    back: "← Back",
    choose: "Choose plan",
    popular: "Most popular",
    perMonth: "/ month",
    limits: "Limits",
    features: "What’s included",
    starter: "Starter",
    business: "Business",
    premium: "Premium",
    products100: "Up to 100 products",
    products500: "Up to 500 products",
    productsUnlimited: "Unlimited products",
    oneMarketplace: "1 marketplace",
    allMarketplaces: "All marketplaces",
    basicTemplates: "Basic templates",
    excel: "Excel upload",
    massGenerate: "Bulk generation",
    seo: "SEO description",
    aiCards: "AI card generation",
    aiInfographics: "AI infographics",
    api: "API integration",
    priority: "Priority generation",
    brandTemplates: "Brand templates",
    updates: "All future updates",paymentTitle: "Plan payment",
    paymentText: "You selected plan",
    choosePayment: "Choose payment method",
    clickText: "Pay with Click",
    paymeText: "Pay with Payme",
    close: "Close",
    proceed: "Proceed to payment",
    lang: "Language",
    note:
      "After successful payment, dashboard access will be activated automatically.",
  },
} as const

function LangButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 14px",
        borderRadius: "12px",
        border: active
          ? "1px solid rgba(96,165,250,0.9)"
          : "1px solid rgba(255,255,255,0.14)",
        background: active
          ? "rgba(96,165,250,0.18)"
          : "rgba(255,255,255,0.05)",
        color: "white",
        cursor: "pointer",
        fontWeight: 800,
        fontSize: "14px",
        transition: "all 0.18s ease",
        transform: active ? "scale(1.04)" : "scale(1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.06)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = active ? "scale(1.04)" : "scale(1)"
      }}
    >
      {children}
    </button>
  )
}

function PaymentButton({
  title,
  subtitle,
  color,
  logo,
  onClick,
}: {
  title: string
  subtitle: string
  color: string
  logo: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "18px",
        borderRadius: "18px",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.06)",
        color: "white",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        transition: "all 0.18s ease",
        boxShadow: "0 14px 32px rgba(0,0,0,0.18)",
        transform: "scale(1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)"
      }}
    >
      <div
        style={{
          width: "54px",
          height: "54px",
          borderRadius: "16px",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: "22px",
          color: "white",
          flexShrink: 0,
        }}
      >
        {logo}
      </div>

      <div style={{ textAlign: "left" }}>
        <div style={{ fontWeight: 900, fontSize: "18px" }}>{title}</div>
        <div style={{ color: "#cbd5e1", fontSize: "14px", marginTop: "4px" }}>
          {subtitle}
        </div>
      </div>
    </button>
  )
}

function PlanCard({
  title,
  price,
  period,
  features,
  accent,
  popular,
  onChoose,
  chooseText,
  popularText,
}: {
  title: string
  price: string
  period: string
  features: string[]
  accent: string
  popular?: boolean
  onChoose: () => void
  chooseText: string
  popularText: string
}) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: "28px",
        background: "rgba(255,255,255,0.06)",
        border: popular
          ? "1px solid rgba(255,255,255,0.22)"
          : "1px solid rgba(255,255,255,0.1)",
        boxShadow: popular
          ? "0 24px 60px rgba(0,0,0,0.34)"
          : "0 18px 44px rgba(0,0,0,0.24)",
        backdropFilter: "blur(18px)",
        padding: "28px",
        transform: popular ? "scale(1.03)" : "scale(1)",
        transition: "all 0.18s ease",
      }}
    >
      {popular && (
        <div
          style={{
            position: "absolute",
            top: "-14px",
            right: "18px",padding: "8px 14px",
            borderRadius: "999px",
            background: "linear-gradient(135deg,#22c55e,#16a34a)",
            color: "white",
            fontSize: "12px",
            fontWeight: 900,
            boxShadow: "0 10px 20px rgba(0,0,0,0.22)",
          }}
        >
          {popularText}
        </div>
      )}

      <div
        style={{
          width: "62px",
          height: "62px",
          borderRadius: "20px",
          background: accent,
          marginBottom: "18px",
          boxShadow: "0 16px 30px rgba(0,0,0,0.2)",
        }}
      />

      <div style={{ fontSize: "30px", fontWeight: 900, marginBottom: "14px" }}>
        {title}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <span style={{ fontSize: "42px", fontWeight: 900 }}>{price}</span>
        <span style={{ color: "#cbd5e1", fontWeight: 700, marginLeft: "8px" }}>
          {period}
        </span>
      </div>

      <div
        style={{
          height: "1px",
          background: "rgba(255,255,255,0.08)",
          marginBottom: "18px",
        }}
      />

      <div
        style={{
          display: "grid",
          gap: "12px",
          marginBottom: "26px",
        }}
      >
        {features.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "start",
              gap: "10px",
              color: "#e5e7eb",
              lineHeight: 1.5,
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            <span style={{ color: "#22c55e", fontWeight: 900 }}>✓</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onChoose}
        style={{
          width: "100%",
          padding: "16px 18px",
          borderRadius: "16px",
          border: "none",
          background: accent,
          color: "white",
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: 900,
          boxShadow: "0 14px 28px rgba(0,0,0,0.24)",
          transition: "all 0.18s ease",
          transform: "scale(1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.03)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)"
        }}
      >
        {chooseText}
      </button>
    </div>
  )
}

export default function PricingPage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [lang, setLang] = useState<Lang>("ru")
  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null)
useEffect(() => {
  const token = localStorage.getItem("access_token")

  if (!token) {
    router.push("/login")
    return
  }

  setCheckingAuth(false)
}, [router])
  const t = dict[lang]

  const plans = useMemo(
    () => ({
      starter: {
        title: t.starter,
        price: "249 000 сум",
        accent: "linear-gradient(135deg,#22d3ee,#2563eb)",
        features: [
          t.products100,
          t.oneMarketplace,
          t.basicTemplates,
        ],
      },
      business: {
        title: t.business,
        price: "799 000 сум",
        accent: "linear-gradient(135deg,#22c55e,#16a34a)",
        features: [
          t.products500,
          t.allMarketplaces,
          t.excel,
          t.massGenerate,
          t.seo,
          t.aiCards,
        ],
      },
      premium: {
        title: t.premium,
        price: "1 900 000 сум",
        accent: "linear-gradient(135deg,#f59e0b,#ea580c)",
        features: [
          t.productsUnlimited,
          t.allMarketplaces,
          t.aiInfographics,
          t.massGenerate,
          t.api,
          t.priority,
          t.brandTemplates,
          t.updates,
        ],
      },
    }),
    [t]
  )

  const currentPlan = selectedPlan ? plans[selectedPlan] : null 
  if (checkingAuth) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#071226,#0b1730,#101827)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        fontSize: "28px",
        fontWeight: 800,
      }}
    >
      Проверка доступа...
    </main>
  )
}
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(59,130,246,0.24), transparent 28%), radial-gradient(circle at top right, rgba(34,197,94,0.18), transparent 24%), linear-gradient(135deg,#071226,#0b1730,#101827)",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "28px 24px 50px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: "34px",
          }}
        >
          <button
            onClick={() => router.push("/")}
            style={{
              padding: "12px 18px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              color: "white",
              cursor: "pointer",
              fontWeight: 800,
              fontSize: "15px",
            }}
          >
            {t.back}
          </button>

          <div style={{ display: "flex", gap: "8px" }}>
            <LangButton active={lang === "ru"} onClick={() => setLang("ru")}>
              RU
            </LangButton>
            <LangButton active={lang === "uz"} onClick={() => setLang("uz")}>
              UZ
            </LangButton>
            <LangButton active={lang === "en"} onClick={() => setLang("en")}>
              EN
            </LangButton>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginBottom: "34px",
          }}
        >
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 900,
              margin: "0 0 14px",
              lineHeight: 1.05,
            }}
          >
            {t.title}
          </h1>

          <p
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              color: "#cbd5e1",
              fontSize: "20px",
              lineHeight: 1.6,
              fontWeight: 700,
            }}
          >
            {t.subtitle}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "22px",
          }}
        >
          <PlanCard
            title={plans.starter.title}
            price={plans.starter.price}
            period={t.perMonth}
            features={plans.starter.features}
            accent={plans.starter.accent}
            chooseText={t.choose}
            popularText={t.popular}
            onChoose={() => {
              setSelectedPlan("starter")
              setSelectedPayment(null)
            }}
          />

          <PlanCard
            title={plans.business.title}
            price={plans.business.price}
            period={t.perMonth}
            features={plans.business.features}
            accent={plans.business.accent}
            chooseText={t.choose}
            popularText={t.popular}
            popular
            onChoose={() => {
              setSelectedPlan("business")
              setSelectedPayment(null)
            }}
          />

          <PlanCard
            title={plans.premium.title}
            price={plans.premium.price}
            period={t.perMonth}
            features={plans.premium.features}
            accent={plans.premium.accent}
            chooseText={t.choose}
            popularText={t.popular}
            onChoose={() => {
              setSelectedPlan("premium")
              setSelectedPayment(null)
            }}
          />
        </div>{selectedPlan && 'currentPlan' && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.58)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              zIndex: 50,
            }}
            onClick={() => {
              setSelectedPlan(null)
              setSelectedPayment(null)
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "700px",
                borderRadius: "30px",
                background: "linear-gradient(180deg,#0f172a,#111827)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.38)",
                padding: "28px",
                color: "white",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "14px",
                  alignItems: "start",
                  marginBottom: "18px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "34px",
                      fontWeight: 900,
                      marginBottom: "8px",
                    }}
                  >
                    {t.paymentTitle}
                  </div>

                  <div
                    style={{
                      color: "#cbd5e1",
                      fontSize: "17px",
                      lineHeight: 1.6,
                      fontWeight: 700,
                    }}
                  >
                    {t.paymentText}: <b style={{ color: "white" }}>{'currentPlan.title'}</b>
                    {" · "}
                    <b style={{ color: "white" }}>{'currentPlan.price'}</b>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlan(null)
                    setSelectedPayment(null)
                  }}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.05)",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 800,
                  }}
                >
                  {t.close}
                </button>
              </div>

              <div
                style={{
                  marginBottom: "16px",
                  color: "#e5e7eb",
                  fontWeight: 800,
                  fontSize: "18px",
                }}
              >
                {t.choosePayment}
              </div>

              <div
                style={{
                  display: "grid",
                  gap: "14px",
                  marginBottom: "18px",
                }}
              >
                <PaymentButton
                  title="Click"
                  subtitle={t.clickText}
                  color="linear-gradient(135deg,#22d3ee,#2563eb)"
                  logo="C"
                  onClick={() => setSelectedPayment("click")}
                />

                <PaymentButton
                  title="Payme"
                  subtitle={t.paymeText}
                  color="linear-gradient(135deg,#22c55e,#16a34a)"
                  logo="P"
                  onClick={() => setSelectedPayment("payme")}
                />
              </div>

              <div
                style={{
                  borderRadius: "18px",padding: "18px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#cbd5e1",
                  lineHeight: 1.6,
                  fontWeight: 700,
                  marginBottom: "18px",
                }}
              >
                {t.note}
              </div>

              <button
                onClick={() => {
                  if (!selectedPayment) {
                    alert(t.choosePayment)
                    return
                  }

                  alert(
                    selectedPayment === "click"
                      ? "Дальше подключим официальный checkout Click"
                      : "Дальше подключим официальный checkout Payme"
                  )
                }}
                style={{
                  width: "100%",
                  padding: "18px",
                  borderRadius: "18px",
                  border: "none",
                  background: currentPlan?.accent,
                  color: "white",
                  cursor: "pointer",
                  fontSize: "20px",
                  fontWeight: 900,
                  boxShadow: "0 16px 30px rgba(0,0,0,0.24)",
                }}
              >
                {t.proceed}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}