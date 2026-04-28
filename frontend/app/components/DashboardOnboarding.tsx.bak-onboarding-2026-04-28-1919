"use client"

import { useEffect, useState } from "react"

const steps = [
  {
    title: "Генератор карточек",
    text: "Здесь создаются AI-карточки товара. Загрузи фото, укажи название, категорию, маркетплейс и нажми генерацию.",
    arrow: "← Нажми «Генератор карточек» в левом меню",
  },
  {
    title: "Юнит-экономика",
    text: "Здесь считаются себестоимость, комиссии, логистика, расходы, прибыль, ROI и рекомендуемая цена товара.",
    arrow: "← Нажми «Юнит-экономика»",
  },
  {
    title: "SEO / описание",
    text: "Здесь появятся SEO-тексты, описания, характеристики и контент для карточки товара после генерации.",
    arrow: "← Нажми «SEO / Описание»",
  },
  {
    title: "Аналитика товара",
    text: "Аналитика показывает конкуренцию, цены, спрос, продавцов, среднюю цену и рекомендации по входу в нишу.",
    arrow: "← Нажми «Аналитика товара»",
  },
  {
    title: "ABC анализ по ссылке",
    text: "Вставь ссылку на товар с маркетплейса. Система оценит нишу, класс товара, риски и стратегию запуска.",
    arrow: "← Нажми «ABC анализ по ссылке»",
  },
  {
    title: "Аудиты",
    text: "Аудиты — это отдельные проверки. Они тратятся на аналитику товара, ABC-анализ и оценку карточек.",
    arrow: "Справа в личном кабинете видно, сколько аудитов осталось",
  },
  {
    title: "Тарифы и оплата",
    text: "Тариф даёт лимит генераций. Аудиты можно докупить отдельно. Сейчас оплата временно принимается только через Payme.",
    arrow: "Нажимай «Выберите тариф» или покупку аудитов",
  },
]

export default function DashboardOnboarding() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [showPaymeBanner, setShowPaymeBanner] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem("marketcard_dashboard_tour_seen")
    const paymeBannerClosed = localStorage.getItem("marketcard_payme_banner_closed")

    if (!seen) setOpen(true)
    if (!paymeBannerClosed) setShowPaymeBanner(true)
  }, [])

  const close = () => {
    localStorage.setItem("marketcard_dashboard_tour_seen", "1")
    setOpen(false)
  }

  const item = steps[step]

  return (
    <>
      {showPaymeBanner && (
        <div
          style={{
            position: "fixed",
            top: "14px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9996,
            padding: "12px 48px 12px 18px",
            borderRadius: "16px",
            background: "linear-gradient(135deg,#f59e0b,#f97316)",
            color: "white",
            fontWeight: 900,
            boxShadow: "0 18px 45px rgba(249,115,22,0.35)",
            border: "1px solid rgba(255,255,255,0.25)",
            textAlign: "center",
            maxWidth: "92vw",
          }}
        >
          ⚠️ Оплата временно принимается только через Payme по техническим причинам

          <button
            onClick={() => {
              localStorage.setItem("marketcard_payme_banner_closed", "1")
              setShowPaymeBanner(false)
            }}
            style={{
              position: "absolute",
              top: "50%",
              right: "12px",
              transform: "translateY(-50%)",
              width: "26px",
              height: "26px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.35)",
              background: "rgba(255,255,255,0.16)",
              color: "white",
              cursor: "pointer",
              fontWeight: 950,
              lineHeight: "22px",
            }}
            aria-label="Закрыть уведомление"
          >
            ×
          </button>
        </div>
      )}

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "560px",
              borderRadius: "28px",
              background: "linear-gradient(180deg,#0f172a,#020617)",
              border: "1px solid rgba(34,211,238,0.35)",
              boxShadow: "0 30px 90px rgba(0,0,0,0.55)",
              padding: "28px",
              color: "white",
            }}
          >
            <div style={{ color: "#22d3ee", fontWeight: 900, marginBottom: "10px" }}>
              Шаг {step + 1} из {steps.length}
            </div>

            <h2 style={{ margin: "0 0 12px", fontSize: "32px", fontWeight: 950 }}>
              {item.title}
            </h2>

            <p style={{ margin: 0, color: "#cbd5e1", fontSize: "17px", lineHeight: 1.65 }}>
              {item.text}
            </p>

            <div
              style={{
                marginTop: "18px",
                padding: "14px 16px",
                borderRadius: "16px",
                background: "rgba(34,211,238,0.10)",
                border: "1px solid rgba(34,211,238,0.30)",
                color: "#a5f3fc",
                fontWeight: 900,
              }}
            >
              {item.arrow}
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                onClick={close}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.08)",
                  color: "white",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Пропустить
              </button>

              <button
                onClick={() => {
                  if (step < steps.length - 1) setStep(step + 1)
                  else close()
                }}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: "14px",
                  border: "none",
                  background: "linear-gradient(135deg,#22c55e,#06b6d4)",
                  color: "white",
                  fontWeight: 950,
                  cursor: "pointer",
                  boxShadow: "0 18px 45px rgba(34,197,94,0.28)",
                }}
              >
                {step === steps.length - 1 ? "Начать работу" : "Далее →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
