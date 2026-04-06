"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { CSSProperties } from "react";
type Lang = "ru" | "uz" | "en"
type MarketplaceKey = "uzum" | "wildberries" | "ozon" | "yandex"
type TariffName = "Start" | "Business" | "Premium"
type DashboardPageKey = "generator" | "economy" | "listing" | "ikpu"
type LanguageMode = "ru" | "uz" | "both"

type ProfileResponse = {
  email: string
  full_name: string
  tariff_name: string | null
  tariff_active: boolean
  tariff_generations_total: number
  tariff_generations_used: number
  tariff_generations_left: number
}

type ProductResponse = {
  id: number
  user_id: number
  title: string
  brand?: string | null
  category: string
  marketplace: string
  description?: string | null
  seo_title?: string | null
  seo_description?: string | null
  image_url?: string | null
  status: string
}

type AiGenerateResponse = {
  success: boolean
  variants: string[]
}

type ListingSlide = {
  type: string
  headline: string
  subheadline?: string
  bullets?: string[]
}

type ListingAIData = {
  product_title?: string
  seo_title?: string
  short_description?: string
  full_description?: string
  characteristics?: string[]
  keywords?: string[]
  slides?: ListingSlide[]
}

type ListingResponse = {
  marketplace?: string
  category_type?: string
  ai?: boolean
  data?: ListingAIData

  title?: string
  seo_title?: string
  short_description?: string
  full_description?: string
  characteristics?: string[] | Record<string, string>
  keywords?: string[]
  lengths?: {
  title?: number
  short_description?: number
  full_description?: number
}

limits?: {
  title_max?: number
  short_max?: number
  full_max?: number
}
}

const dict = {
  ru: {
    pageTitle: "Личный кабинет",
    pageSubtitle: "Создать карточку товара",
    account: "Личный кабинет",
    email: "Электронная почта",
    tariff: "Тариф",
    tariffStatus: "Статус подписки",
    active: "Активна",
    inactive: "Не активна",
    generationsLeft: "Осталось генераций",
    generationsUsed: "Использовано",
    logout: "Выйти",
    chooseTariff: "Выберите тариф",
    uploadPhoto: "Загрузить фото товара",
    dragPhoto: "Перетащите фото сюда или нажмите для выбора",
    selectedFile: "Выбран файл",
    noFile: "Файл не выбран",
    titleLabel: "Название товара",
    brandLabel: "Бренд",
    categoryLabel: "Категория",
    titlePlaceholder: "Например: Насос ГУР Cobalt",
    brandPlaceholder: "Например: BRAVE",
    categoryPlaceholder: "Например: Автозапчасти",
    chooseMarketplace: "Выберите маркетплейс",
    format: "Формат",
    ratio: "Соотношение",
    aiGenerate: "AI генерация",
    generating: "Генерация...",
    downloadPng: "Скачать PNG",
    preview: "Предпросмотр",
    previewEmpty: "Загрузите фото и заполните данные товара.",
    fillRequired: "Заполните название товара, бренд, категорию и выберите фото",
    noTariff: "Тариф не выбран",
    tariffActivated: "Тариф успешно активирован",
    close: "Закрыть",
    activateTariff: "Продолжить",
    startDesc: "Для старта",
    businessDesc: "Для активной работы",
    premiumDesc: "Для команды и больших объёмов",
    success: "Карточки успешно созданы",
    createFirst: "Сначала создайте карточку",
    imageReady: "PNG готов",
    paymentTitle: "Способ оплаты",
    payButton: "Оплатить",
    choosePayment: "Выберите способ оплаты",
    activateFirst: "Сначала активируйте тариф",
    serverError: "Ошибка соединения с сервером",
    createError: "Ошибка создания товара",
    renderError: "Ошибка AI генерации",
    generationError: "Ошибка генерации карточек",
    listingTitle: "SEO / Описание товара",
    listingEmpty: "Пока нет сгенерированного SEO текста.",
    listingHint: "Сначала создай карточку товара в разделе генератора.",
    listingButton: "SEO / Описание",
    unitTitle: "Юнит-экономика",
    unitSubtitle: "Калькулятор прибыльной цены для маркетплейсов",
    purchaseUsd: "Закупка товара ($)",
    usdRate: "Курс доллара",
    commissionPercent: "Комиссия маркетплейса (%)",
    fulfillmentLogistics: "Логистика маркетплейса",
    localLogistics: "Внутренняя логистика",
    marketing: "Маркетинг / реклама",
    packaging: "Упаковка",
    otherCosts: "Прочие расходы",
    desiredProfit: "Желаемая чистая прибыль",
    competitorPrice: "Средняя цена конкурентов",
    totalCost: "Полная себестоимость",
    breakEvenPrice: "Цена без убытка",aggressivePrice: "Быстрые продажи",
    optimalPrice: "Оптимум",
    premiumPrice: "Премиум",
    aggressiveHint: "Максимум конверсии, ниже маржа",
    optimalHint: "Лучший баланс прибыли и продаж",
    premiumHint: "Выше маржа, ниже поток",
    expectedNetProfit: "Чистая прибыль",
    recommendation: "Рекомендация",
    recommendationText:
      "Если заходишь в новую нишу — используй «Быстрые продажи». Если уже есть отзывы и нормальная карточка — ставь «Оптимум». «Премиум» тестируй только когда бренд и визуал реально сильнее конкурентов.",
    sum: "сум",
    belowMarket: "Ниже рынка",
    inMarket: "В рынке",
    aboveMarket: "Выше рынка",
    marketPosition: "Позиция относительно рынка",
    margin: "Маржа",
    netMarginPercent: "Чистая маржа",
    roi: "ROI",
    scenarioProfitability: "Рентабельность сценария",
    targetPriceMap: "Карта цен",
    marketBenchmark: "Рыночный ориентир",
    competitorHint: "Используется для оценки конкурентности цены",
    noBenchmark: "Без ориентира",
    demandHigh: "Высокий поток",
    demandMedium: "Средний поток",
    demandLow: "Низкий поток",
    dashboardHint:
      "Ниже ты видишь не просто цену, а рабочую стратегию по выходу в рынок.",
    sidebarGenerator: "Генератор карточек",
    sidebarEconomy: "Юнит-экономика",
    languageMode: "Язык инфографики",
    onlyRu: "Только RU",
    onlyUz: "Только UZ",
    ruUz: "RU + UZ",
    variantCount: "Количество вариантов",
    variantsTitle: "Сгенерированные варианты",
    openPng: "Открыть PNG",
    noVariantsYet: "Тут появятся варианты карточек",
    aiPremiumTitle: "AI-генератор карточек",
    aiPremiumHint:
      "Загрузите фото товара, выберите язык и маркетплейс — система автоматически создаст несколько вариантов продающей инфографики.",
  },
  uz: {
    pageTitle: "Shaxsiy kabinet",
    pageSubtitle: "Mahsulot kartasini yaratish",
    account: "Shaxsiy kabinet",
    email: "Elektron pochta",
    tariff: "Tarif",
    tariffStatus: "Obuna holati",
    active: "Faol",
    inactive: "Faol emas",
    generationsLeft: "Qolgan generatsiyalar",
    generationsUsed: "Ishlatilgan",
    logout: "Chiqish",
    chooseTariff: "Tarifni tanlang",
    uploadPhoto: "Mahsulot rasmini yuklash",
    dragPhoto: "Rasmni shu yerga tashlang yoki tanlash uchun bosing",
    selectedFile: "Tanlangan fayl",
    noFile: "Fayl tanlanmagan",
    titleLabel: "Mahsulot nomi",
    brandLabel: "Brend",
    categoryLabel: "Kategoriya",
    titlePlaceholder: "Masalan: Cobalt rul nasosi",
    brandPlaceholder: "Masalan: BRAVE",
    categoryPlaceholder: "Masalan: Avto ehtiyot qismlar",
    chooseMarketplace: "Marketpleysni tanlang",
    format: "Format",
    ratio: "Nisbat",
    aiGenerate: "AI generatsiya",
    generating: "Generatsiya...",
    downloadPng: "PNG yuklab olish",
    preview: "Ko‘rib chiqish",
    previewEmpty: "Rasm yuklang va mahsulot ma’lumotlarini kiriting.",
    fillRequired: "Mahsulot nomi, brend, kategoriya kiriting va rasm tanlang",
    noTariff: "Tarif tanlanmagan",
    tariffActivated: "Tarif muvaffaqiyatli faollashtirildi",
    close: "Yopish",
    activateTariff: "Davom etish",
    startDesc: "Boshlash uchun",
    businessDesc: "Faol ish uchun",
    premiumDesc: "Jamoa va katta hajm uchun",
    success: "Kartochkalar muvaffaqiyatli yaratildi",
    createFirst: "Avval karta yarating",
    imageReady: "PNG tayyor",
    paymentTitle: "To‘lov usuli",
    payButton: "To‘lash",
    choosePayment: "To‘lov usulini tanlang",
    activateFirst: "Avval tarifni faollashtiring",
    serverError: "Server bilan ulanishda xatolik",
    createError: "Mahsulot yaratishda xatolik",
    renderError: "AI generatsiya xatosi",
    generationError: "Kartalar generatsiyasida xatolik",
    listingTitle: "SEO / Tavsif",
    listingEmpty: "Hali SEO matn yaratilmagan.",listingHint: "Avval generator bo‘limida kartani yarating.",
    listingButton: "SEO / Tavsif",
    unitTitle: "Yunit iqtisodiyoti",
    unitSubtitle: "Marketpleys uchun foydali narx kalkulyatori",
    purchaseUsd: "Mahsulot xaridi ($)",
    usdRate: "Dollar kursi",
    commissionPercent: "Marketpleys komissiyasi (%)",
    fulfillmentLogistics: "Marketpleys logistikasi",
    localLogistics: "Ichki logistika",
    marketing: "Marketing / reklama",
    packaging: "Qadoqlash",
    otherCosts: "Boshqa xarajatlar",
    desiredProfit: "Kerakli sof foyda",
    competitorPrice: "Raqobatchilar o‘rtacha narxi",
    totalCost: "To‘liq tannarx",
    breakEvenPrice: "Zararsiz narx",
    aggressivePrice: "Tez savdo",
    optimalPrice: "Optimal",
    premiumPrice: "Premium",
    aggressiveHint: "Ko‘proq mijoz, pastroq marja",
    optimalHint: "Foyda va talab balansi",
    premiumHint: "Yuqori marja, pastroq oqim",
    expectedNetProfit: "Sof foyda",
    recommendation: "Tavsiya",
    recommendationText:
      "Yangi bozorga kirishda «Tez savdo»ni ishlating. Barqaror sotuv uchun «Optimal»ni tanlang. Brend kuchli va vizual yaxshi bo‘lsa — «Premium»ni sinab ko‘ring.",
    sum: "so‘m",
    belowMarket: "Bozordan past",
    inMarket: "Bozor ichida",
    aboveMarket: "Bozordan yuqori",
    marketPosition: "Bozorga nisbatan holat",
    margin: "Marja",
    netMarginPercent: "Sof marja",
    roi: "ROI",
    scenarioProfitability: "Ssenariy rentabelligi",
    targetPriceMap: "Narx xaritasi",
    marketBenchmark: "Bozor orientiri",
    competitorHint: "Narx raqobatbardoshligini baholash uchun",
    noBenchmark: "Orientirsiz",
    demandHigh: "Yuqori oqim",
    demandMedium: "O‘rta oqim",
    demandLow: "Past oqim",
    dashboardHint:
      "Bu yerda faqat narx emas, balki bozorga chiqish strategiyasi ham ko‘rsatiladi.",
    sidebarGenerator: "Kartalar generatori",
    sidebarEconomy: "Yunit iqtisodiyoti",
    languageMode: "Infografika tili",
    onlyRu: "Faqat RU",
    onlyUz: "Faqat UZ",
    ruUz: "RU + UZ",
    variantCount: "Variantlar soni",
    variantsTitle: "Yaratilgan variantlar",
    openPng: "PNG ochish",
    noVariantsYet: "Bu yerda variantlar paydo bo‘ladi",
    aiPremiumTitle: "AI kartochka generatori",
    aiPremiumHint:
      "Generator backendga marketpleys, til va variantlar sonini yuboradi. Yakuniy dizayn sifati render_engine.py ga bog‘liq.",
  },
  en: {
    pageTitle: "Personal account",
    pageSubtitle: "Create product card",
    account: "Personal account",
    email: "Email",
    tariff: "Tariff",
    tariffStatus: "Subscription status",
    active: "Active",
    inactive: "Inactive",
    generationsLeft: "Generations left",
    generationsUsed: "Used",
    logout: "Logout",
    chooseTariff: "Choose tariff",
    uploadPhoto: "Upload product photo",
    dragPhoto: "Drag and drop a photo here or click to select",
    selectedFile: "Selected file",
    noFile: "No file selected",
    titleLabel: "Product title",
    brandLabel: "Brand",
    categoryLabel: "Category",
    titlePlaceholder: "Example: Cobalt power steering pump",
    brandPlaceholder: "Example: BRAVE",
    categoryPlaceholder: "Example: Auto parts",
    chooseMarketplace: "Choose marketplace",
    format: "Format",
    ratio: "Ratio",
    aiGenerate: "AI generation",
    generating: "Generating...",
    downloadPng: "Download PNG",
    preview: "Preview",
    previewEmpty: "Upload a photo and fill in product data.",
    fillRequired: "Fill in title, brand, category and choose a photo",
    noTariff: "No tariff selected",
    tariffActivated: "Tariff activated successfully",
    close: "Close",
    activateTariff: "Continue",
    startDesc: "For getting started",
    businessDesc: "For active work",
    premiumDesc: "For teams and high volume",
    success: "Cards created successfully",
    createFirst: "Create a card first",
    imageReady: "PNG ready",
    paymentTitle: "Payment method",
    payButton: "Pay",
    choosePayment: "Choose payment method",
    activateFirst: "Activate a tariff first",
    serverError: "Server connection error",
    createError: "Error creating product",
    renderError: "AI render error",
    generationError: "Card generation error",
    listingButton: "SEO / Description",
listingTitle: "SEO / Product description",
listingEmpty: "SEO text has not been generated yet.",
listingHint: "First create a product card in the generator section.",
    unitTitle: "Unit economics",
    unitSubtitle: "Marketplace profitable price calculator",
    purchaseUsd: "Purchase cost ($)",
    usdRate: "USD exchange rate",
    commissionPercent: "Marketplace commission (%)",
    fulfillmentLogistics: "Marketplace logistics",
    localLogistics: "Internal logistics",
    marketing: "Marketing / ads",
    packaging: "Packaging",
    otherCosts: "Other costs",
    desiredProfit: "Desired net profit",
    competitorPrice: "Average competitor price",
    totalCost: "Total cost",
    breakEvenPrice: "Break-even price",
    aggressivePrice: "Fast sales",
    optimalPrice: "Optimal",
    premiumPrice: "Premium",
    aggressiveHint: "Maximum conversion, lower margin",
    optimalHint: "Best balance of margin and sales",
    premiumHint: "Higher margin, lower traffic",
    expectedNetProfit: "Net profit",
    recommendation: "Recommendation",
    recommendationText:
      "Use 'Fast sales' to enter a new niche aggressively. Use 'Optimal' for steady mode. Test 'Premium' only when branding and visual quality are stronger than competitors.",
    sum: "UZS",
    belowMarket: "Below market",
    inMarket: "In market",
    aboveMarket: "Above market",
    marketPosition: "Market position",
    margin: "Margin",
    netMarginPercent: "Net margin",
    roi: "ROI",
    scenarioProfitability: "Scenario profitability",
    targetPriceMap: "Price map",
    marketBenchmark: "Market benchmark",
    competitorHint: "Used to assess competitiveness of the price",
    noBenchmark: "No benchmark",
    demandHigh: "High demand",
    demandMedium: "Medium demand",
    demandLow: "Low demand",
    dashboardHint: "This block shows not just a price, but a market-entry strategy.",
    sidebarGenerator: "Card generator",
    sidebarEconomy: "Unit economics",
    languageMode: "Infographic language",
    onlyRu: "RU only",
    onlyUz: "UZ only",
    ruUz: "RU + UZ",
    variantCount: "Variant count",
    variantsTitle: "Generated variants",openPng: "Open PNG",
    noVariantsYet: "Generated variants will appear here",
    aiPremiumTitle: "AI card generator",
    aiPremiumHint:
      "The generator sends marketplace, language mode and variant count to the backend. Final design quality depends on render_engine.py.",
  }
} as const

const marketplaceFormats: Record<
  MarketplaceKey,
  {
    label: string
    width: number
    height: number
    ratio: string
    gradient: string
  }
> = {
  uzum: {
    label: "Uzum",
    width: 1080,
    height: 1440,
    ratio: "3:4",
    gradient: "linear-gradient(135deg, #8b5cf6, #c084fc)",
  },
  wildberries: {
    label: "Wildberries",
    width: 900,
    height: 1200,
    ratio: "3:4",
    gradient: "linear-gradient(135deg, #9333ea, #ec4899)",
  },
  ozon: {
    label: "Ozon",
    width: 1200,
    height: 1600,
    ratio: "3:4",
    gradient: "linear-gradient(135deg, #0ea5e9, #2563eb)",
  },
  yandex: {
    label: "Yandex Market",
    width: 1000,
    height: 1000,
    ratio: "1:1",
    gradient: "linear-gradient(135deg, #f59e0b, #f97316)",
  },
}

const tariffs: Record<
  TariffName,
  {
    price: string
    generations: number
    gradient: string
    descKey: "startDesc" | "businessDesc" | "premiumDesc"
  }> = {
  Start: {
    price: "249 000 сум",
    generations: 20,
    gradient: "linear-gradient(135deg,#22c55e,#16a34a)",
    descKey: "startDesc",
  },
  Business: {
    price: "799 000 сум",
    generations: 60,
    gradient: "linear-gradient(135deg,#06b6d4,#2563eb)",
    descKey: "businessDesc",
  },
  Premium: {
    price: "1 900 000 сум",
    generations: 200,
    gradient: "linear-gradient(135deg,#f59e0b,#f97316)",
    descKey: "premiumDesc",
  },
}

function MarketplaceButton({
  label,
  selected,
  gradient,
  onClick,
}: {
  label: string
  selected: boolean
  gradient: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        minWidth: "150px",
        minHeight: "72px",
        padding: "14px 18px",
        borderRadius: "18px",
        border: selected
          ? "2px solid rgba(255,255,255,0.95)"
          : "1px solid rgba(255,255,255,0.12)",
        background: selected ? gradient : "rgba(255,255,255,0.05)",
        color: "white",
        cursor: "pointer",
        fontWeight: 900,
        fontSize: "18px",
        boxShadow: selected
          ? "0 16px 34px rgba(0,0,0,0.28)"
          : "0 10px 24px rgba(0,0,0,0.18)",
      }}
    >
      {label}
    </button>
  )
}

function toNumber(value: string): number {
  const normalized = value.replace(",", ".").replace(/[^\d.]/g, "")
  const num = Number(normalized)
  return Number.isFinite(num) ? num : 0
}

function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.ceil(value / 1000) * 1000
}

function formatMoney(value: number, lang: Lang): string {
  try {
    return new Intl.NumberFormat(
      lang === "uz" ? "uz-UZ" : lang === "en" ? "en-US" : "ru-RU"
    ).format(Math.round(value))
  } catch {
    return String(Math.round(value))
  }
}

function getMarketStatus(
  price: number,
  competitor: number
): "below" | "in" | "above" | "none" {
  if (!competitor || competitor <= 0) return "none"
  const diffPercent = ((price - competitor) / competitor) * 100
  if (diffPercent <= -5) return "below"
  if (diffPercent >= 8) return "above"
  return "in"
}

function getStatusText(
  status: "below" | "in" | "above" | "none",
  t: typeof dict.ru
) {
  if (status === "below") return t.belowMarket
  if (status === "above") return t.aboveMarket
  if (status === "in") return t.inMarket
  return t.noBenchmark
}

function getStatusColor(status: "below" | "in" | "above" | "none") {
  if (status === "below") return "linear-gradient(135deg,#22c55e,#16a34a)"
  if (status === "above") return "linear-gradient(135deg,#f97316,#ef4444)"
  if (status === "in") return "linear-gradient(135deg,#06b6d4,#2563eb)"
  return "linear-gradient(135deg,#64748b,#475569)"
}

const labelStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 700,
  marginBottom: "6px",
  color: "#cbd5e1",
}

const inputStyle: CSSProperties = {
  width: "100%",
  height: "56px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.14)",
  background: "#2a313b",
  color: "#ffffff",
  padding: "0 48px 0 16px",
  fontSize: "18px",
  fontWeight: 600,
  outline: "none",
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  cursor: "pointer",
};

const smallPillButton = (active: boolean): React.CSSProperties => ({
  padding: "8px 14px",
  borderRadius: "999px",
  border: active
    ? "1px solid #22c55e"
    : "1px solid rgba(255,255,255,0.15)",
  background: active
    ? "linear-gradient(135deg,#22c55e,#16a34a)"
    : "rgba(255,255,255,0.05)",
  color: "white",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
})

const primaryButtonStyle = (disabled: boolean): React.CSSProperties => ({
  padding: "18px 22px",
  borderRadius: "18px",
  border: "none",
  background: "linear-gradient(135deg,#06b6d4,#2563eb)",
  color: "white",
  cursor: disabled ? "default" : "pointer",
  fontSize: "18px",
  fontWeight: 900,
  boxShadow: "0 16px 30px rgba(0,0,0,0.24)",
  opacity: disabled ? 0.7 : 1,
})
const secondaryButtonStyle = (disabled: boolean): React.CSSProperties => ({
  padding: "18px 22px",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: disabled
    ? "rgba(255,255,255,0.06)"
    : "linear-gradient(135deg,#22c55e,#16a34a)",
  color: "white",
  cursor: disabled ? "default" : "pointer",
  fontSize: "18px",
  fontWeight: 900,
  boxShadow: "0 16px 30px rgba(0,0,0,0.24)",
  opacity: disabled ? 0.7 : 1,
})

const modalSmallButton: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
}

function SummaryLine({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: "16px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <div>
        <div style={{ fontSize: "14px", color: "#cbd5e1", fontWeight: 700 }}>
          {label}
        </div>
        {hint ? (
          <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
            {hint}
          </div>
        ) : null}
      </div>
      <div style={{ fontSize: "18px", color: "white", fontWeight: 900 }}>
        {value}
      </div>
    </div>
  )
}

function CardTextBlock({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div
      style={{
        padding: "18px",
        borderRadius: "18px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div style={{ fontSize: "18px", opacity: 0.7, marginBottom: "8px" }}>
        {title}
      </div>
      <div
        style={{
          fontSize: "18px",
          lineHeight: 1.7,
          color: "white",
          whiteSpace: "pre-wrap",
        }}
      >
        {text}
      </div>
    </div>
  )
}

function ProgressBar({
  value,
  gradient,
}: {
  value: number
  gradient: string
}) {
  const width = Math.max(4, Math.min(100, value))
  return (
    <div
      style={{
        height: "10px",
        width: "100%",
        borderRadius: "999px",
        background: "rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${width}%`,
          height: "100%",
          borderRadius: "999px",
          background: gradient,
        }}
      />
    </div>
  )
}

function ScenarioCard({
  title,
  hint,
  demand,
  price,
  profit,
  gradient,
  profitLabel,
  marginPercent,
  roiPercent,
  statusText,
  statusGradient,
  marginLabel,
  roiLabel,
}: {
  title: string
  hint: string
  demand: string
  price: string
  profit: string
  gradient: string
  profitLabel: string
  marginPercent: number
  roiPercent: number
  statusText: string
  statusGradient: string
  marginLabel: string
  roiLabel: string
}) {
  return (
    <div
      style={{
        borderRadius: "20px",
        padding: "18px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 12px 24px rgba(0,0,0,0.16)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
          alignItems: "flex-start",
          flexWrap: "wrap",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "8px 12px",
            borderRadius: "999px",
            background: gradient,
            fontWeight: 900,
            fontSize: "13px",
          }}
        >
          {title}
        </div><div
          style={{
            display: "inline-block",
            padding: "8px 12px",
            borderRadius: "999px",
            background: statusGradient,
            fontWeight: 900,
            fontSize: "12px",
            color: "#fff",
          }}
        >
          {statusText}
        </div>
      </div>

      <div
        style={{
          fontSize: "30px",
          fontWeight: 900,
          lineHeight: 1,
          marginBottom: "8px",
        }}
      >
        {price}
      </div>

      <div
        style={{
          color: "#cbd5e1",
          fontSize: "14px",
          fontWeight: 700,
          marginBottom: "8px",
        }}
      >
        {hint}
      </div>

      <div
        style={{
          display: "inline-block",
          padding: "6px 10px",
          borderRadius: "999px",
          background: "rgba(255,255,255,0.07)",
          color: "#e2e8f0",
          fontSize: "12px",
          fontWeight: 800,
          marginBottom: "14px",
        }}
      >
        {demand}
      </div>

      <div
        style={{
          display: "grid",
          gap: "12px",
        }}
      >
        <SummaryLine label={profitLabel} value={profit} />
        <SummaryLine label={marginLabel} value={`${marginPercent.toFixed(1)}%`} />
        <SummaryLine label={roiLabel} value={`${roiPercent.toFixed(1)}%`} />
        <ProgressBar value={marginPercent} gradient={gradient} />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()

  const [lang, setLang] = useState<Lang>("ru")
  const [showLangMenu, setShowLangMenu] = useState(false)

  const [authChecked, setAuthChecked] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)

  const [selectedMarketplace, setSelectedMarketplace] =
    useState<MarketplaceKey>("uzum")
  const [productTitle, setProductTitle] = useState("")
  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [ikpuQuery, setIkpuQuery] = useState("")
  const [ikpuResults, setIkpuResults] = useState<any[]>([])
  const [ikpuLoading, setIkpuLoading] = useState(false)

  const [creating, setCreating] = useState(false)
  const [showTariffModal, setShowTariffModal] = useState(false)
  const [selectedTariff, setSelectedTariff] = useState<TariffName>("Business")
  const [activatingTariff, setActivatingTariff] = useState(false)

  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPayment, setSelectedPayment] =
    useState<"payme" | "click" | "visa" | null>(null)

  const [createdProduct, setCreatedProduct] = useState<ProductResponse | null>(null)
  const [pngReady, setPngReady] = useState(false)

  const [purchaseUsd, setPurchaseUsd] = useState("1")
  const [usdRate, setUsdRate] = useState("12700")
  const [commissionPercent, setCommissionPercent] = useState("18")
  const [fulfillmentLogistics, setFulfillmentLogistics] = useState("8000")
  const [localLogistics, setLocalLogistics] = useState("5000")
  const [marketing, setMarketing] = useState("7000")
  const [packaging, setPackaging] = useState("3000")
  const [otherCosts, setOtherCosts] = useState("2000")
  const [desiredProfit, setDesiredProfit] = useState("10000")
  const [competitorPrice, setCompetitorPrice] = useState("0")

  const [activePage, setActivePage] =
    useState<DashboardPageKey>("generator")

  const [languageMode, setLanguageMode] = useState<LanguageMode>("ru")
  const [variantCount, setVariantCount] = useState(5)
  const [generatedVariants, setGeneratedVariants] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [listingData, setListingData] = useState<ListingResponse | null>(null)
  const [listingReady, setListingReady] = useState(false)
  const listingView =
  (listingData as any)?.ru ||
  (listingData as any)?.uz ||
  (listingData as any)?.en ||
  null
useEffect(() => {
  const checkMobile = () => {
    const mobile = window.innerWidth <= 900
    setIsMobile(mobile)
  }

  checkMobile()
  window.addEventListener("resize", checkMobile)
  return () => window.removeEventListener("resize", checkMobile)
}, [])
  const searchIkpu = async () => {
  if (!ikpuQuery) return

  setIkpuLoading(true)

  try {
    console.log("ACTIVATE 4 BEFORE FETCH")
    const res = await fetch(
      `https://tasnif.soliq.uz/api/cl-api/classifier/search?search=${encodeURIComponent(ikpuQuery)}`
    )

    console.log("GEN 3 STATUS", res.status)
    const data = await res.json()

    let items: any[] = []

    if (Array.isArray(data)) {
      items = data
    } else if (data?.data) {
      items = data.data
    }

    setIkpuResults(items.slice(0, 10))
  } catch (e) {
    console.log("IKPU error:", e)
    setIkpuResults([])
  }

  setIkpuLoading(false)
}

const listingCharacteristics = listingView?.characteristics
  ? Array.isArray(listingView.characteristics)
    ? listingView.characteristics
    : Object.entries(listingView.characteristics).map(
        ([key, value]) => `${key}: ${value}`
      )
  : []

const listingKeywords = Array.isArray(listingView?.keywords)
  ? listingView.keywords
  : []
  const t = dict[lang]
  const currentFormat = marketplaceFormats[selectedMarketplace]

  const loadProfile = async () => {
    try {
      setProfileLoading(true)
    const token = localStorage.getItem("access_token")

if (!token) {
  setProfileLoading(false)
  setProfile(null)
  return
}

const res = await fetch("https://marketcard.uz/api/auth/me", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

      if (!res.ok) {
  const errorData = await res.json().catch(() => null)

  if (res.status === 403) {
    const message = errorData?.detail || "Ваш аккаунт заблокирован"

    document.body.innerHTML = ` 
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0b1220;color:white;font-family:Arial,sans-serif;padding:24px;">
        <div style="max-width:560px;width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:32px;text-align:center;">
          <div style="font-size:42px;font-weight:800;margin-bottom:16px;">Аккаунт заблокирован</div>
          <div style="font-size:18px;opacity:0.9;line-height:1.5;">
            ${message}
          </div>
        </div>
      </div>
    `

    throw new Error(message)
  }

  setProfile(null)
  return
}

      const data: ProfileResponse = await res.json()
      setProfile(data)
    } catch (error) {
      console.error("Profile load error:", error)
      setProfile(null)
    } finally {
      setProfileLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    const savedEmail = localStorage.getItem("user_email")

    if (!token || !savedEmail) {
      router.push("/login")
      return
    }

    setUserEmail(savedEmail)
    setAuthChecked(true)
    loadProfile()
  }, [router])

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("")
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user_email")
    router.push("/login")
  }
  const searchIkpuAuto = async (query: string) => {
  if (!query.trim()) {
    setIkpuResults([])
    return
  }

  setIkpuLoading(true)

  try {
    console.log("ACTIVATE 4 BEFORE FETCH")
 // const res = await fetch(`/api/ikpu/search?q=${encodeURIComponent(query)}`)
 // const data = await res.json()
    setIkpuResults([])
  } catch (e) {
    console.log("IKPU AUTO ERROR:", e)
    setIkpuResults([])
  } finally {
    setIkpuLoading(false)
  }
}
  const handleActivateTariff = async () => {
  console.log("ACTIVATE 1 START", { userEmail, selectedTariff })
    const ikpuSearchText = `${productTitle} ${category}`.trim()
setIkpuQuery(ikpuSearchText)

const ikpuPromise = Promise.resolve()
  const emailToUse = userEmail || profile?.email
  if (!emailToUse) {
    console.log("ACTIVATE STOP: no email at all")
    return
  }


    try {
    console.log("ACTIVATE 3 BEFORE SET LOADING")
      setActivatingTariff(true)

    console.log("ACTIVATE 4 BEFORE FETCH")
      const res = await fetch(
        `https://marketcard.uz/api/auth/activate-tariff?email=${encodeURIComponent(emailToUse)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            
            tariff_name: selectedTariff,
          }),
        }
      )

    console.log("ACTIVATE 5 AFTER FETCH", res.status)
    console.log("GEN 3 STATUS", res.status)
      const data = await res.json().catch(() => null)
    console.log("ACTIVATE 6 RESPONSE DATA", data)

      if (!res.ok) {
        alert(data?.detail || t.serverError)
        return
      }

      await loadProfile()
      setShowTariffModal(false)
      alert(t.tariffActivated)
    } catch (error) {
      console.error("Tariff activation error:", error)
      alert(t.serverError)
    } finally {
    console.log("ACTIVATE 8 FINALLY")
      setActivatingTariff(false)
    }
  }

  const handleConfirmPayment = async () => {
    if (!selectedPayment) {
      alert(t.choosePayment)
      return
    }

    await handleActivateTariff()
    setShowPaymentModal(false)
    setSelectedPayment(null)
  }

    const handleGenerate = async () => {
  console.log("GEN 0 PROFILE", profile)
    const ikpuSearchText = `${productTitle} ${category}`.trim()
setIkpuQuery(ikpuSearchText)

const ikpuPromise = Promise.resolve()
    setIsGenerating(true)
  try {
    setCreating(true)
    setPngReady(false)
    setGeneratedVariants([])
    setListingData(null)
    setListingReady(false)

    const formData = new FormData()
    if (!profile?.email) {
      console.log("GEN STOP: NO EMAIL", profile)
      alert("Email пользователя не найден")
      return
    }

    formData.append("email", profile?.email || "")
    formData.append("product_title", productTitle)
    formData.append("brand", brand)
    formData.append("category", category)
    formData.append("marketplace", selectedMarketplace)
    formData.append("language_mode", languageMode)
    formData.append("variant_count", String(variantCount))

    if (selectedFile) {
      formData.append("image", selectedFile)
    }

    
    console.log("GEN 2 BEFORE FETCH")
    const res = await fetch("https://marketcard.uz/api/full-generate", {
      method: "POST",
      body: formData,
    })

    console.log("GEN 3 STATUS", res.status)
    const data = await res.json()
    console.log("FULL GENERATE STATUS:", res.status)
    console.log("FULL GENERATE DATA:", data)
    if (!res.ok || !data?.success) {
  console.log("FULL GENERATE ERROR:", data)
  alert(JSON.stringify(data))
  return
} 
  

    // ✅ КАРТИНКИ
    const images = (data.slides || [])
      .filter((s: any) => s.image_url)
      .map((s: any) => `https://marketcard.uz${s.image_url}`)

    setGeneratedVariants(images)
    setPngReady(images.length > 0)

    // ✅ SEO / ОПИСАНИЕ
    if (data.listing) {
      setListingData(data.listing)
      setListingReady(true)
    }
    if (profile?.email) {
  await loadProfile()
}
  await ikpuPromise
  } catch (err) {
    console.log("GEN ERROR", err)
    console.error(err)
    alert("Ошибка")
  } finally {
  setCreating(false)
  setIsGenerating(false)
}
}

  const handleDownloadPng = async () => {
    try {
  if (!generatedVariants || generatedVariants.length === 0) {
    alert("Сначала сгенерируйте карточки")
    return
  }

  for (let i = 0; i < generatedVariants.length; i++) {
    const imageUrl = generatedVariants[i]
    const fixedImageUrl =
    typeof imageUrl === "string" && imageUrl.startsWith("/generated_cards")
    ? `/api${imageUrl}`
    : imageUrl

    const response = await fetch(fixedImageUrl)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `card_${i + 1}.png`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    window.URL.revokeObjectURL(url)

    await new Promise((r) => setTimeout(r, 200))
  }

} catch (e) {
  console.error(e)
  alert("Ошибка скачивания")
}

    if (!createdProduct?.id) {
      alert(t.createFirst)
      return
    }

    const url = `https://marketcard.uz/products/${createdProduct.id}/download-image?marketplace_mode=${selectedMarketplace}`
    window.open(url, "_blank")
  }

  const accountEmailLabel = useMemo(() => userEmail || "-", [userEmail])

  const unit = useMemo(() => {
    const purchaseUsdNum = toNumber(purchaseUsd)
    const usdRateNum = toNumber(usdRate)
    const commissionNum = toNumber(commissionPercent)
    const fulfillmentNum = toNumber(fulfillmentLogistics)
    const localNum = toNumber(localLogistics)
    const marketingNum = toNumber(marketing)
    const packagingNum = toNumber(packaging)
    const otherNum = toNumber(otherCosts)
    const desiredProfitNum = toNumber(desiredProfit)
    const competitorNum = toNumber(competitorPrice)

    const purchaseCostUzs = purchaseUsdNum * usdRateNum
    const totalCost =
      purchaseCostUzs +
      fulfillmentNum +
      localNum +
      marketingNum +
      packagingNum +
      otherNum

    const commissionFactor = 1 - commissionNum / 100
    const safeFactor = commissionFactor > 0 ? commissionFactor : 0.01

    const breakEven = roundMoney(totalCost / safeFactor)
    const aggressive = roundMoney((totalCost + desiredProfitNum * 0.55) / safeFactor)
    const optimal = roundMoney((totalCost + desiredProfitNum) / safeFactor)
    const premium = roundMoney((totalCost + desiredProfitNum * 1.8) / safeFactor)

    const profitAtPrice = (price: number) => price * safeFactor - totalCost
    const marginAtPrice = (price: number) =>
      price > 0 ? (profitAtPrice(price) / price) * 100 : 0
    const roiAtPrice = (price: number) =>
      totalCost > 0 ? (profitAtPrice(price) / totalCost) * 100 : 0

    return {
      competitorNum,
      purchaseCostUzs,
      totalCost,
      breakEven,
      aggressive,
      optimal,
      premium,
      aggressiveProfit: roundMoney(profitAtPrice(aggressive)),
      optimalProfit: roundMoney(profitAtPrice(optimal)),
      premiumProfit: roundMoney(profitAtPrice(premium)),
      aggressiveMargin: Math.max(0, marginAtPrice(aggressive)),
      optimalMargin: Math.max(0, marginAtPrice(optimal)),
      premiumMargin: Math.max(0, marginAtPrice(premium)),
      aggressiveROI: Math.max(0, roiAtPrice(aggressive)),
      optimalROI: Math.max(0, roiAtPrice(optimal)),
      premiumROI: Math.max(0, roiAtPrice(premium)),
      aggressiveStatus: getMarketStatus(aggressive, competitorNum),
      optimalStatus: getMarketStatus(optimal, competitorNum),
      premiumStatus: getMarketStatus(premium, competitorNum),
    }
  }, [
    purchaseUsd,
    usdRate,
    commissionPercent,
    fulfillmentLogistics,
    localLogistics,
    marketing,
    packaging,
    otherCosts,
    desiredProfit,
    competitorPrice,
  ])

  if (!authChecked) return null 
  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top left, rgba(59,130,246,0.20), transparent 24%), radial-gradient(circle at bottom right, rgba(34,197,94,0.16), transparent 24%), linear-gradient(135deg,#0b1020,#111827,#172033)",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
<div
  style={{
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "260px 1fr", 
    position: "relative",
    minHeight: "100vh",
  }}
>
{isMobile && (
  <div
    style={{
      position: "fixed",
      top: "12px",
      left: "12px",
      zIndex: 9999,
    }}
  >
    <button
      onClick={() => setIsMobileMenuOpen((prev) => !prev)}
      style={{
        background: "#0ea5e9",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: "18px",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      ☰
    </button>
  </div>
)}

 <aside
  style={{
    display: isMobile ? (isMobileMenuOpen ? "block" : "none") : "block",
    position: isMobile ? "fixed" : "relative",
    top: isMobile ? "0" : undefined,
    left: isMobile ? "0" : undefined,
    zIndex: isMobile ? 9998 : undefined,
    width: isMobile ? "280px" : "320px",
    minWidth: isMobile ? "280px" : "320px",
    height: isMobile ? "100vh" : "auto",
    overflowY: isMobile ? "auto" : "visible",
    padding: "24px",
    borderRight: "1px solid rgba(255,255,255,0.08)",
    background: isMobile ? "rgba(8,15,35,0.96)" : "transparent",
    backdropFilter: isMobile ? "blur(14px)" : undefined,
    boxShadow: isMobile ? "0 0 30px rgba(0,0,0,0.35)" : undefined,
  }}
>
            <div
              style={{
                color: "white",
                fontSize: "56px",
                fontWeight: 900,
                lineHeight: 1.05,
                marginBottom: "36px",
                textShadow: "0 4px 18px rgba(255,255,255,0.18)",
              }}
            >
              MarketCard AI
            </div>

            <div style={{ display: "grid", gap: "12px" }}>
              <button
                onClick={() => {
                  setActivePage("generator")
                  if (isMobile) setIsMobileMenuOpen(false)
                }}
                style={{
                  padding: "16px",
                  borderRadius: "16px",
                  background:
                    activePage === "generator"
                      ? "linear-gradient(135deg,#0ea5e9,#2563eb)"
                      : "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "white",
                  fontWeight: 800,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {t.sidebarGenerator}
              </button>

              <button
                onClick={() => {
                  setActivePage("economy")
                  if (isMobile) setIsMobileMenuOpen(false)
                }}
                style={{
                  padding: "16px",
                  borderRadius: "16px",
                  background:
                    activePage === "economy"
                      ? "linear-gradient(135deg,#22c55e,#16a34a)"
                      : "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "white",
                  fontWeight: 800,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {t.sidebarEconomy}
              </button>

              <button
                onClick={() => {
                  setActivePage("listing")
                  if (isMobile) setIsMobileMenuOpen(false)
                }}
                style={{
                  padding: "16px",
                  borderRadius: "16px",
                  background:
                    activePage === "listing"
                      ? "linear-gradient(135deg,#8b5cf6,#2563eb)"
                      : "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "white",
                  fontWeight: 800,
                  cursor: "pointer",
                  textAlign: "left",
                  position: "relative",
                }}
              >
                {t.listingButton}
                {listingReady && (
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      minWidth: "22px",
                      height: "22px",
                      padding: "0 6px",
                      borderRadius: "999px",
                      background: "#ef4444",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 900,
                    }}
                  >
                    1
                  </span>
                )}
              </button>
              <button
  onClick={() => window.open("https://tasnif.soliq.uz", "_blank")}
  style={{
    padding: "16px",
    borderRadius: "16px",
    background:
      activePage === "ikpu"
        ? "linear-gradient(135deg,#f59e0b,#f97316)"
        : "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
    textAlign: "left",
  }}
>
  ИКПУ
</button>
            </div>
</aside>
 {isMobile && isMobileMenuOpen && (
  <div
    onClick={() => setIsMobileMenuOpen(false)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.45)",
      zIndex: 9997,
    }}
  />
)}
        <section
  style={{
    padding: "24px",
    overflowX: "hidden",
  }}
>
  {false && (
  <div
    style={{
      maxWidth: "1100px",
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
        fontSize: "34px",
        fontWeight: 900,
        marginBottom: "18px",
      }}
    >
      Поиск ИКПУ
    </div>

    <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
      <input
        value={ikpuQuery}
        onChange={(e) => setIkpuQuery(e.target.value)}
        placeholder="Например: наушники"
        style={{
          flex: 1,
          padding: "14px",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.05)",
          color: "white",
        }}
      />

      <button
        onClick={searchIkpu}
        style={{
          padding: "14px 20px",
          borderRadius: "14px",
          border: "none",
          background: "linear-gradient(135deg,#06b6d4,#2563eb)",
          color: "white",
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        Найти
      </button>
    </div>

    {ikpuLoading && (
      <div style={{ marginBottom: "12px", color: "#94a3b8" }}>
        Поиск...
      </div>
    )}

    <div style={{ display: "grid", gap: "10px" }}>
      {ikpuResults.map((item: any, i: number) => (
        <div
          key={i}
          style={{
            padding: "12px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontWeight: 900 }}>{item.code}</div>
            <div style={{ fontSize: "13px", opacity: 0.7 }}>
              {item.name}
            </div>
          </div>

          <button
            onClick={() => navigator.clipboard.writeText(item.code)}
            style={{
              background: "#22c55e",
              border: "none",
              padding: "8px 12px",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
            }}
          >
            копировать
          </button>
        </div>
      ))}
    </div>
  </div>
)}
  <div
    style={{
      maxWidth: "1480px",
      margin: "0 auto",
      padding: "28px",
    }}
  >
    <div
      style={{
        padding: "28px",
        borderRadius: "24px",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 18px 45px rgba(0,0,0,0.28)",
        marginBottom: "24px",
        backdropFilter: "blur(14px)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "18px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "16px",
                background: "linear-gradient(135deg,#22c55e,#06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "20px",
              }}
            >
              M
            </div>
            <div style={{ fontSize: "34px", fontWeight: 900 }}>
              {t.pageTitle}
            </div>
          </div>

          <div
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "#e5e7eb",
            }}
          >
            {activePage === "generator"
              ? t.aiPremiumTitle
              : activePage === "listing"
              ? t.listingTitle
              : t.unitTitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            alignItems: "flex-end",
          }}
        >
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowLangMenu((prev) => !prev)}
              style={{
                padding: "12px 16px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                color: "white",
                cursor: "pointer",
                fontWeight: 900,
                fontSize: "14px",
                minWidth: "74px",
              }}
            >
              {lang.toUpperCase()}
            </button>

            {showLangMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "52px",
                  right: 0,
                  minWidth: "100px",
                  borderRadius: "14px",
                  background: "#111827",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
                  overflow: "hidden",
                  zIndex: 1000,
                }}
              >
                {(["ru", "uz", "en"] as Lang[]).map((item: Lang) => (
                  <button
                    key={item}
                    onClick={() => {
                      setLang(item)
                      setShowLangMenu(false)
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      border: "none",
                      background:
                        item === lang ? "rgba(59,130,246,0.2)" : "transparent",
                      color: "white",
                      cursor: "pointer",
                      textAlign: "left",
                      fontWeight: 800,
                    }}
                  >
                    {item.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div><button
            onClick={handleLogout}
            style={{
              padding: "12px 18px",
              borderRadius: "14px",
              border: "none",
              background: "linear-gradient(135deg,#ef4444,#dc2626)",
              color: "white",
              cursor: "pointer",
              fontWeight: 900,
              fontSize: "14px",
            }}
          >
            {t.logout}
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: "22px",
          padding: "18px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            color: "#94a3b8",
            marginBottom: "10px",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {t.account}
        </div>

        <div
          style={{
            fontSize: "16px",
            color: "#ffffff",
            fontWeight: 800,
            marginBottom: "10px",
            wordBreak: "break-word",
          }}
        >
          {t.email}: {accountEmailLabel}
        </div>

        <div
          style={{
            fontSize: "14px",
            color: "#cbd5e1",
            marginBottom: "8px",
          }}
        >
          {t.tariff}: <b>{profile?.tariff_name || t.noTariff}</b>
        </div>

        <div
          style={{
            fontSize: "14px",
            color: "#cbd5e1",
            marginBottom: "8px",
          }}
        >
          {t.tariffStatus}:{" "}
          <b>{profile?.tariff_active ? t.active : t.inactive}</b>
        </div>

        <div
          style={{
            fontSize: "14px",
            color: "#cbd5e1",
            marginBottom: "8px",
          }}
        >
          {t.generationsLeft}:{" "}
          <b>
            {profileLoading
              ? "..."
              : `${profile?.tariff_generations_left ?? 0} / ${profile?.tariff_generations_total ?? 0}`}
          </b>
        </div>

        <div
          style={{
            fontSize: "14px",
            color: "#cbd5e1",
            marginBottom: "14px",
          }}
        >
          {t.generationsUsed}: <b>{profile?.tariff_generations_used ?? 0}</b>
        </div>

        <button
          onClick={() => setShowTariffModal(true)}
          style={{
            padding: "12px 18px",
            borderRadius: "14px",
            border: "none",
            background: "linear-gradient(135deg,#22c55e,#16a34a)",
            color: "white",
            cursor: "pointer",
            fontWeight: 900,
            fontSize: "14px",
          }}
        >
          {t.chooseTariff}
        </button>
      </div>
    </div>

    {activePage === "generator" && (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "440px 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
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
              fontSize: "34px",
              fontWeight: 900,
              marginBottom: "10px",
            }}
          >
            {t.pageSubtitle}
          </div>

          <div
            style={{
              fontSize: "14px",
              color: "#a5b4fc",
              marginBottom: "18px",
              fontWeight: 700,
            }}
          >
            {t.aiPremiumHint}
          </div>

          <div style={{ display: "grid", gap: "18px" }}>
            <div>
              <div style={labelStyle}>{t.uploadPhoto}</div><label
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const file = e.dataTransfer.files?.[0] ?? null
                  if (file && file.type.startsWith("image/")) {
                    setSelectedFile(file)
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "170px",
                  borderRadius: "20px",
                  border: "1px dashed rgba(255,255,255,0.20)",
                  background: "rgba(255,255,255,0.04)",
                  cursor: "pointer",
                  textAlign: "center",
                  padding: "18px",
                  color: "#e2e8f0",
                  fontWeight: 700,
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null
                    setSelectedFile(file)
                  }}
                />

                <div>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: 900,
                      marginBottom: "10px",
                    }}
                  >
                    {t.uploadPhoto}
                  </div>

                  <div
                    style={{
                      color: "#cbd5e1",
                      fontSize: "15px",
                      marginBottom: "10px",
                    }}
                  >
                    {t.dragPhoto}
                  </div>

                  <div
                    style={{
                      color: "#94a3b8",
                      fontSize: "14px",
                    }}
                  >
                    {selectedFile
                      ? `${t.selectedFile}: ${selectedFile.name}`
                      : t.noFile}
                  </div>
                </div>
              </label>
            </div>

            <div>
              <div
                style={{
                  width: "100%",
                  height: "210px",
                  borderRadius: "18px",
                  border: "1px dashed rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.04)",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      color: "#94a3b8",
                      fontSize: "16px",
                      fontWeight: 700,
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    {t.previewEmpty}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div style={labelStyle}>{t.titleLabel}</div>
              <input
                type="text"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder={t.titlePlaceholder}
                style={inputStyle}
              />
            </div><div>
              <div style={labelStyle}>{t.brandLabel}</div>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder={t.brandPlaceholder}
                style={inputStyle}
              />
            </div>

            <div>
              <div style={labelStyle}>{t.categoryLabel}</div>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={t.categoryPlaceholder}
                style={inputStyle}
              />
            </div>

            <div>
              <div style={labelStyle}>{t.chooseMarketplace}</div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <MarketplaceButton
                  label={marketplaceFormats.uzum.label}
                  selected={selectedMarketplace === "uzum"}
                  gradient={marketplaceFormats.uzum.gradient}
                  onClick={() => setSelectedMarketplace("uzum")}
                />
                <MarketplaceButton
                  label={marketplaceFormats.wildberries.label}
                  selected={selectedMarketplace === "wildberries"}
                  gradient={marketplaceFormats.wildberries.gradient}
                  onClick={() => setSelectedMarketplace("wildberries")}
                />
                <MarketplaceButton
                  label={marketplaceFormats.ozon.label}
                  selected={selectedMarketplace === "ozon"}
                  gradient={marketplaceFormats.ozon.gradient}
                  onClick={() => setSelectedMarketplace("ozon")}
                />
                <MarketplaceButton
                  label={marketplaceFormats.yandex.label}
                  selected={selectedMarketplace === "yandex"}
                  gradient={marketplaceFormats.yandex.gradient}
                  onClick={() => setSelectedMarketplace("yandex")}
                />
              </div>
            </div>

            <div>
              <div style={labelStyle}>{t.languageMode}</div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                  onClick={() => setLanguageMode("ru")}
                  style={smallPillButton(languageMode === "ru")}
                >
                  {t.onlyRu}
                </button>
                <button
                  onClick={() => setLanguageMode("uz")}
                  style={smallPillButton(languageMode === "uz")}
                >
                  {t.onlyUz}
                </button>
                <button
                  onClick={() => setLanguageMode("both")}
                  style={smallPillButton(languageMode === "both")}
                >
                  {t.ruUz}
                </button>
              </div>
            </div>

            <div>
              <div style={labelStyle}>{t.variantCount}</div>
              <select
                value={variantCount}
                onChange={(e) => setVariantCount(Number(e.target.value))}
                style={inputStyle}
              >
                <option value={1} style={{ background: "#2a313b", color: "#fff" }}>1</option>
<option value={3} style={{ background: "#2a313b", color: "#fff" }}>3</option>
<option value={5} style={{ background: "#2a313b", color: "#fff" }}>5</option>
              </select>
            </div>

            <div
              style={{
                display: "inline-block",
                padding: "16px 18px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#e2e8f0",
                width: "fit-content",
              }}
            >
              <div
              style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  marginBottom: "6px",
                }}
              >
                {t.format}
              </div>
              <div style={{ fontSize: "20px", fontWeight: 900 }}>
                {currentFormat.label} — {currentFormat.width} ×{" "}
                {currentFormat.height}
              </div>
              <div
                style={{
                  fontSize: "15px",
                  color: "#cbd5e1",
                  marginTop: "4px",
                }}
              >
                {t.ratio}: {currentFormat.ratio}
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={handleGenerate}
                disabled={creating}
                style={primaryButtonStyle(creating)}
              >
                {creating ? t.generating : t.aiGenerate}
              </button>

              <button
                onClick={handleDownloadPng}
                disabled={!pngReady}
                style={secondaryButtonStyle(!pngReady)}
              >
                {t.downloadPng}
              </button>
            <a
  href="https://t.me/marketcardai_support_bot"
  target="_blank"
  rel="noreferrer"
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 20px",
    borderRadius: "16px",
    textDecoration: "none",
    color: "white",
    fontWeight: 800,
    fontSize: "16px",
    background: "linear-gradient(135deg, #229ED9, #1d8ecf)",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: "0 10px 30px rgba(34,158,217,0.22)",
    cursor: "pointer"
  }}
>
  <span>
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M21.5 4.5L18.4 19.2C18.17 20.25 17.57 20.5 16.69 20.01L11.94 16.51L9.65 18.72C9.4 18.97 9.19 19.18 8.7 19.18L9.04 14.34L17.85 6.38C18.23 6.04 17.77 5.85 17.26 6.18L6.37 13.03L1.68 11.56C0.66 11.24 0.64 10.54 1.89 10.05L20.25 2.97C21.1 2.66 21.84 3.16 21.5 4.5Z"
        fill="currentColor"
      />
    </svg>
  </span>

  <span>Поддержка в Telegram</span>
</a>
            </div>


            {pngReady && (
              <div
                style={{
                  fontSize: "14px",
                  color: "#86efac",
                  fontWeight: 800,
                }}
              >
                {t.imageReady}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "20px",
          }}
        >
          <div
            style={{
              padding: "20px",
              borderRadius: "24px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "0 18px 45px rgba(0,0,0,0.28)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              style={{
                fontSize: "26px",
                fontWeight: 900,
                marginBottom: "18px",
              }}
            >
              {t.variantsTitle}
            </div>

            {isGenerating ? (
  <div
    style={{
      minHeight: "320px",
      borderRadius: "20px",
      border: "1px dashed rgba(255,255,255,0.18)",
      background: "rgba(255,255,255,0.03)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#ffffff",
      fontSize: "18px",
      fontWeight: 700,
      textAlign: "center",
      padding: "20px",
      flexDirection: "column",
      gap: "14px",
    }}
  >
    <div
      style={{
        width: "22px",
        height: "22px",
        border: "3px solid rgba(34,211,238,0.35)",
        borderTop: "3px solid #22d3ee",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
    <div>Идёт генерация карточек, пожалуйста подождите...</div>
  </div>
) : generatedVariants.length === 0 ? (
              <div
                style={{
                  minHeight: "320px",
                  borderRadius: "20px",
                  border: "1px dashed rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.03)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                  fontSize: "18px",
                  fontWeight: 700,
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                {t.noVariantsYet}
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "18px",
                }}
              >
                {generatedVariants.map((url: string, index: number) => (
                  <div
                    key={`${url}-${index}`}
                    style={{
                      padding: "14px",
                      borderRadius: "18px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 900,
                        marginBottom: "10px",
                      }}
                    >
                      {"Вариант " + (index + 1)}
                    </div><img
                      src={url.startsWith("/generated_cards") ? `/api${url}` : url}
                      alt={`variant-${index + 1}`}
                      style={{
                        width: "100%",
                        borderRadius: "14px",
                        display: "block",
                        marginBottom: "10px",
                      }}
                    />

                    <a
                      href={url.startsWith("/generated_cards") ? `/api${url}` : url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: "#67e8f9",
                        fontWeight: 800,
                        textDecoration: "none",
                      }}
                    >
                      {t.openPng}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )}

    {activePage === "listing" && (
      <div
        style={{
          maxWidth: "1100px",
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
            fontSize: "34px",
            fontWeight: 900,
            marginBottom: "18px",
          }}
        >
          {t.listingTitle}
        </div>
  )
        {listingData && (
  <div style={{ marginTop: "20px" }}>
    
    {/* TITLE */}
    <div style={{ marginBottom: "20px" }}>
      <div style={{ fontSize: "14px", opacity: 0.6 }}>
        Название ({listingData.lengths?.title} / {listingData.limits?.title_max})
      </div>

      <div
        style={{
          marginTop: "6px",
          padding: "12px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {listingData.title}
      </div>
    </div>

    {/* SHORT */}
    <div style={{ marginBottom: "20px" }}>
      <div style={{ fontSize: "14px", opacity: 0.6 }}>
        Краткое описание ({listingData.lengths?.short_description} / {listingData.limits?.short_max})
      </div>

      <div
        style={{
          marginTop: "6px",
          padding: "12px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {listingData.short_description}
      </div>
    </div>

    {/* FULL */}
    <div style={{ marginBottom: "20px" }}>
      <div style={{ fontSize: "14px", opacity: 0.6 }}>
        Полное описание ({listingData.lengths?.full_description} / {listingData.limits?.full_max})
      </div>

      <div
        style={{
          marginTop: "6px",
          padding: "12px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          lineHeight: "1.5",
        }}
      >
        {listingData.full_description}
      </div>
    </div>

    {/* CHARACTERISTICS */}
    <div style={{ marginBottom: "20px" }}>
      <div style={{ fontSize: "14px", opacity: 0.6 }}>
        Характеристики
      </div>

      <div
        style={{
          marginTop: "6px",
          padding: "12px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {Array.isArray(listingData.characteristics) ? (
  listingData.characteristics.map((item: any, i: number) => (
    <div key={i} style={{ marginBottom: "6px" }}>
      {typeof item === "string" ? (
        item
      ) : (
        <>
          <b>{item.key}:</b> {item.value}
        </>
      )}
    </div>
  ))
) : listingData.characteristics && typeof listingData.characteristics === "object" ? (
  Object.entries(listingData.characteristics).map(([key, value], i) => (
    <div key={i} style={{ marginBottom: "6px" }}>
      <b>{key}:</b> {String(value)}
    </div>
  ))
) : null}
      </div>
    </div>

  </div>
)}
        {!listingData ? (
          <div
            style={{
              fontSize: "20px",
              color: "#cbd5e1",
              lineHeight: 1.6,
            }}
          >
            {t.listingEmpty}
            <br />
            {t.listingHint}
          </div>
        ) : (
        <div style={{ display: "grid", gap: "18px" }}>
            <SummaryLine label="Название" value={listingView?.title ?? "—"} />
            <SummaryLine
              label="SEO title"
              value={listingView?.seo_title ?? "—"}
            />

            <CardTextBlock
              title="Короткое описание"
              text={listingView?.short_description ?? "—"}
            />

            <CardTextBlock
              title="Полное описание"
              text={listingView?.full_description ?? "—"}
            />

            <div
              style={{
                padding: "18px",
                borderRadius: "18px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{ fontSize: "18px", opacity: 0.7, marginBottom: "8px" }}
              >
                Характеристики
              </div>

              {listingCharacteristics.length > 0 ? (
                <div style={{ display: "grid", gap: "10px" }}>
                  {listingCharacteristics.map(
                    (item: string, index: number) => (
                      <div
                        key={index}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "12px",
                          background: "rgba(255,255,255,0.04)",
                          fontSize: "18px",
                        }}
                      >
                        • {item}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div style={{ fontSize: "18px" }}>—</div>
              )}
            </div>

            <div
              style={{
                padding: "18px",
                borderRadius: "18px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{ fontSize: "18px", opacity: 0.7, marginBottom: "8px" }}
              >
                Ключевые слова
              </div>{listingKeywords.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {listingKeywords.map((item: string, index: number) => (
                    <span
                      key={index}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "999px",
                        background: "rgba(34,211,238,0.18)",
                        border: "1px solid rgba(34,211,238,0.35)",
                        fontSize: "18px",
                        fontWeight: 700,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: "18px" }}>—</div>
              )}
            </div>

            <div
              style={{
                padding: "18px",
                borderRadius: "18px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{ fontSize: "18px", opacity: 0.7, marginBottom: "12px" }}
              >
                Слайды для инфографики
              </div>{Array.isArray(listingData.data?.slides) &&
              listingData.data.slides.length > 0 ? (
                <div style={{ display: "grid", gap: "14px" }}>
                  {listingData.data.slides.map((slide: any, index: number) => (
                    <div
                      key={index}
                      style={{
                        padding: "16px",
                        borderRadius: "16px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#67e8f9",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          marginBottom: "8px",
                        }}
                      >
                        {slide.type}
                      </div>

                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: 900,
                          marginBottom: "8px",
                        }}
                      >
                        {slide.headline}
                      </div>

                      {slide.subheadline ? (
                        <div
                          style={{
                            fontSize: "16px",
                            color: "#cbd5e1",
                            marginBottom: "10px",
                          }}
                        >
                          {slide.subheadline}
                        </div>
                      ) : null}

                      {Array.isArray(slide.bullets) &&
                      slide.bullets.length > 0 ? (
                        <div style={{ display: "grid", gap: "8px" }}>
                          {slide.bullets.map(
                            (bullet: string, bulletIndex: number) => (
                              <div
                                key={bulletIndex}
                                style={{
                                  fontSize: "16px",
                                  color: "white",
                                  padding: "8px 12px",
                                  borderRadius: "12px",
                                  background: "rgba(255,255,255,0.03)",
                                }}
                              >• {bullet}
                              </div>
                            )
                          )}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: "18px" }}>—</div>
              )}
            </div>
          </div>
        )}
      </div>
    )}

    {activePage === "economy" && (
      <div
        style={{
          maxWidth: "980px",
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
            fontSize: "34px",
            fontWeight: 900,
            marginBottom: "6px",
          }}
        >
          {t.unitTitle}
        </div>

        <div
          style={{
            fontSize: "15px",
            color: "#cbd5e1",
            marginBottom: "18px",
            fontWeight: 700,
          }}
        >
          {t.unitSubtitle}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          <div>
            <div style={labelStyle}>{t.purchaseUsd}</div>
            <input
              value={purchaseUsd}
              onChange={(e) => setPurchaseUsd(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <div style={labelStyle}>{t.usdRate}</div>
            <input
              value={usdRate}
              onChange={(e) => setUsdRate(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <div style={labelStyle}>{t.commissionPercent}</div>
            <input
              value={commissionPercent}
              onChange={(e) => setCommissionPercent(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <div style={labelStyle}>{t.fulfillmentLogistics}</div>
            <input
              value={fulfillmentLogistics}
              onChange={(e) => setFulfillmentLogistics(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <div style={labelStyle}>{t.localLogistics}</div>
            <input
              value={localLogistics}
              onChange={(e) => setLocalLogistics(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <div style={labelStyle}>{t.marketing}</div>
            <input
              value={marketing}
              onChange={(e) => setMarketing(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <div style={labelStyle}>{t.packaging}</div>
            <input
              value={packaging}
              onChange={(e) => setPackaging(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <div style={labelStyle}>{t.otherCosts}</div>
            <input
              value={otherCosts}
              onChange={(e) => setOtherCosts(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <div style={labelStyle}>{t.desiredProfit}</div>
            <input
              value={desiredProfit}
              onChange={(e) => setDesiredProfit(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <div style={labelStyle}>{t.competitorPrice}</div>
            <input
              value={competitorPrice}
              onChange={(e) => setCompetitorPrice(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div><div
          style={{
            marginTop: "18px",
            display: "grid",
            gap: "12px",
          }}
        >
          <SummaryLine
            label={t.totalCost}
            value={`${formatMoney(unit.totalCost, lang)} ${t.sum}`}
          />
          <SummaryLine
            label={t.breakEvenPrice}
            value={`${formatMoney(unit.breakEven, lang)} ${t.sum}`}
          />
          <SummaryLine
            label={t.marketBenchmark}
            value={
              unit.competitorNum > 0
                ? `${formatMoney(unit.competitorNum, lang)} ${t.sum}`
                : t.noBenchmark
            }
            hint={t.competitorHint}
          />
        </div>

        <div
          style={{
            marginTop: "18px",
            display: "grid",
            gap: "12px",
          }}
        >
          <ScenarioCard
            title={t.aggressivePrice}
            hint={t.aggressiveHint}
            demand={t.demandHigh}
            price={`${formatMoney(unit.aggressive, lang)} ${t.sum}`}
            profit={`${formatMoney(unit.aggressiveProfit, lang)} ${t.sum}`}
            gradient="linear-gradient(135deg,#22c55e,#16a34a)"
            profitLabel={t.expectedNetProfit}
            marginPercent={unit.aggressiveMargin}
            roiPercent={unit.aggressiveROI}
            statusText={getStatusText(unit.aggressiveStatus, dict.ru)}
            statusGradient={getStatusColor(unit.aggressiveStatus)}
            marginLabel={t.netMarginPercent}
            roiLabel={t.roi}
          />

          <ScenarioCard
            title={t.optimalPrice}
            hint={t.optimalHint}
            demand={t.demandMedium}
            price={`${formatMoney(unit.optimal, lang)} ${t.sum}`}
            profit={`${formatMoney(unit.optimalProfit, lang)} ${t.sum}`}
            gradient="linear-gradient(135deg,#06b6d4,#2563eb)"
            profitLabel={t.expectedNetProfit}
            marginPercent={unit.optimalMargin}
            roiPercent={unit.optimalROI}
            statusText={getStatusText(unit.optimalStatus, dict.ru)}
            statusGradient={getStatusColor(unit.optimalStatus)}
            marginLabel={t.netMarginPercent}
            roiLabel={t.roi}
          />

          <ScenarioCard
            title={t.premiumPrice}
            hint={t.premiumHint}
            demand={t.demandLow}
            price={`${formatMoney(unit.premium, lang)} ${t.sum}`}
            profit={`${formatMoney(unit.premiumProfit, lang)} ${t.sum}`}
            gradient="linear-gradient(135deg,#f59e0b,#f97316)"
            profitLabel={t.expectedNetProfit}
            marginPercent={unit.premiumMargin}
            roiPercent={unit.premiumROI}
            statusText={getStatusText(unit.premiumStatus, dict.ru)}
            statusGradient={getStatusColor(unit.premiumStatus)}
            marginLabel={t.netMarginPercent}
            roiLabel={t.roi}
          />
        </div>

        <div
          style={{
            marginTop: "18px",
            padding: "16px",
            borderRadius: "18px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              fontWeight: 900,
              fontSize: "15px",
              marginBottom: "8px",
            }}
          >
            {t.recommendation}
          </div>
          <div
            style={{
              color: "#cbd5e1",
              fontSize: "14px",
              lineHeight: 1.6,
            }}
          >
            {t.recommendationText}
          </div>
        </div>
      </div>
    )}
  </div>
</section>
</div>
</main>

{showTariffModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.65)",display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "1040px",
        borderRadius: "28px",
        background: "#0f172a",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
        padding: "28px",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: "34px", fontWeight: 900 }}>
          {t.chooseTariff}
        </div>

        <button
          onClick={() => setShowTariffModal(false)}
          style={modalSmallButton}
        >
          {t.close}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "18px",
        }}
      >
        {(Object.keys(tariffs) as TariffName[]).map((tariff) => {
          const item = tariffs[tariff]
          const isSelected = selectedTariff === tariff

          return (
            <button
              key={tariff}
              onClick={() => setSelectedTariff(tariff)}
              style={{
                textAlign: "left",
                padding: "24px",
                borderRadius: "22px",
                border: isSelected
                  ? "2px solid rgba(255,255,255,0.95)"
                  : "1px solid rgba(255,255,255,0.12)",
                background: item.gradient,
                color: "white",
                cursor: "pointer",
                boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
                transform: isSelected ? "translateY(-2px)" : "none",
                transition: "0.2s ease",
              }}
            >
              <div
                style={{
                  fontSize: "34px",
                  fontWeight: 900,
                  marginBottom: "10px",
                }}
              >
                {tariff}
              </div>

              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  marginBottom: "10px",
                }}
              >
                {item.price}
              </div>

              <div style={{ fontSize: "17px", marginBottom: "8px" }}>
                {item.generations} генераций
              </div>

              <div style={{ fontSize: "15px", opacity: 0.95 }}>
                {t[item.descKey]}
              </div>
            </button>
          )
        })}
      </div>

      <div
        style={{
          marginTop: "22px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={() => {
            setShowTariffModal(false)
            setShowPaymentModal(true)
          }}
          disabled={activatingTariff}
          style={{
            padding: "16px 22px",
            borderRadius: "16px",
            border: "none",
            background: "linear-gradient(135deg,#22c55e,#16a34a)",
            color: "white",
            cursor: activatingTariff ? "default" : "pointer",
            fontSize: "18px",
            fontWeight: 900,
            opacity: activatingTariff ? 0.7 : 1,
          }}
        >
          {activatingTariff ? "..." : t.activateTariff}
        </button>
      </div>
    </div>
  </div>
)}

{showPaymentModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.65)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",zIndex: 10000,
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "760px",
        borderRadius: "28px",
        background: "#0f172a",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
        padding: "28px",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "22px",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: "32px", fontWeight: 900 }}>
          {t.paymentTitle}
        </div>

        <button
          onClick={() => {
            setShowPaymentModal(false)
            setSelectedPayment(null)
          }}
          style={modalSmallButton}
        >
          {t.close}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "18px",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={() => setSelectedPayment("payme")}
          style={{
            padding: "22px",
            borderRadius: "22px",
            border:
              selectedPayment === "payme"
                ? "2px solid rgba(255,255,255,0.95)"
                : "1px solid rgba(255,255,255,0.12)",
            background:
              selectedPayment === "payme"
                ? "rgba(255,255,255,0.12)"
                : "rgba(255,255,255,0.05)",
            cursor: "pointer",
          }}
        >
          <img
            src="/payme.png"
            alt="Payme"
            style={{
              maxWidth: "250px",
              maxHeight: "100px",
              objectFit: "contain",
            }}
          />
        </button>
        
        <button
  onClick={() => setSelectedPayment("visa")}
  style={{
    padding: "22px",
    borderRadius: "22px",
    border:
      selectedPayment === "visa"
        ? "2px solid rgba(255,255,255,0.95)"
        : "1px solid rgba(255,255,255,0.12)",
    background:
      selectedPayment === "visa"
        ? "rgba(255,255,255,0.12)"
        : "rgba(255,255,255,0.05)",
    cursor: "pointer",
  }}
>
  <div
    style={{
      fontSize: "38px",
      fontWeight: 900,
      color: "white",
      textAlign: "center",
    }}
  >
    VISA
  </div>
</button>

        <button
          onClick={() => setSelectedPayment("click")}
          style={{
            padding: "22px",
            borderRadius: "22px",
            border:
              selectedPayment === "click"
                ? "2px solid rgba(255,255,255,0.95)"
                : "1px solid rgba(255,255,255,0.12)",
            background:
              selectedPayment === "click"
                ? "rgba(255,255,255,0.12)"
                : "rgba(255,255,255,0.05)",
            cursor: "pointer",
          }}
        >
          <img
            src="/click.png"
            alt="Click"
            style={{
              maxWidth: "250px",
              maxHeight: "100px",
              objectFit: "contain",
            }}
          />
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleConfirmPayment}
          style={{
            padding: "16px 24px",
            borderRadius: "16px",
            border: "none",
            background: "linear-gradient(135deg,#22c55e,#16a34a)",
            color: "white",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: 900,
          }}
        >
          {t.payButton}
        </button>
      </div>
    </div>
  </div>
)}
<style jsx>{`
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`}</style>
  </>
)}
