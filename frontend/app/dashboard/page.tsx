"use client"

import "./dashboard-premium.css";
import "./effects/index.css";
import ABCFloatingAnalysis from "../components/ABCFloatingAnalysis"
import CardAuditPanel from "@/app/components/CardAuditPanel"
import ProductIntelligencePanel from "../components/ProductIntelligencePanel"
import SupportWidget from "../components/support-widget/SupportWidget"
import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { CSSProperties } from "react";
import DashboardOnboarding from "../components/DashboardOnboarding"

const buyAudit = async (pkg: string) => {
  try {
    const token = localStorage.getItem("access_token")
    if (!token) {
      alert("Вы не авторизованы")
      return
    }

    const res = await fetch(`/api/payments/create-audit-order?package=${encodeURIComponent(pkg)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()

    if (!data?.payme_url) {
      alert("Ошибка создания заказа")
      return
    }

    localStorage.setItem("marketcard_pending_tariff_purchase", "1")
        window.location.href = data.payme_url

  } catch (e) {
    console.error(e)
    alert("Ошибка оплаты")
  }
}
;
type Lang = "ru" | "uz" | "en"
type MarketplaceKey = "uzum" | "wildberries" | "ozon" | "yandex"
type TariffName = "Start" | "Business" | "Premium"
type DashboardPageKey =
  | "generator"
  | "video"
  | "economy"
  | "listing"
  | "ikpu"
  | "audit"
  | "intelligence"
  | "purchase"
  | "didox"
  | "deficit"
  | "instructions"
type LanguageMode = "ru" | "uz" | "both"

type ProfileResponse = {
  email: string
  full_name: string
  tariff_name: string | null
  tariff_active: boolean
  tariff_generations_total: number
  tariff_generations_used: number
  tariff_generations_left: number
  audit_credits: number
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

type ProductPhotoAnalysisResponse = {
  success?: boolean
  title?: string
  brand?: string
  category?: string
  characteristics?: string[]
  short_description?: string
  confidence?: number
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


function getTariffFeatureLines(tariff: TariffName, lang: Lang): string[] {
  if (lang === "ru") {
    if (tariff === "Start") return ["1 фото за 1 генерацию", "Пауза 3 минуты"]
    if (tariff === "Business") return ["1 или 3 фото за генерацию", "Пауза 3 минуты"]
    return ["1, 3 или 5 фото за генерацию", "Пауза 3 минуты"]
  }

  if (lang === "uz") {
    if (tariff === "Start") return ["1 generatsiya = 1 rasm", "3 daqiqa kutish"]
    if (tariff === "Business") return ["1 yoki 3 rasm", "3 daqiqa kutish"]
    return ["1, 3 yoki 5 rasm", "3 daqiqa kutish"]
  }

  if (tariff === "Start") return ["1 image per generation", "3 min delay"]
  if (tariff === "Business") return ["1 or 3 images", "3 min delay"]
  return ["1, 3 or 5 images", "3 min delay"]
}

function getTariffNote(lang: Lang): string {
  if (lang === "ru") return "Чем больше вариантов — тем быстрее расходуется лимит"
  if (lang === "uz") return "Ko‘p variant — tezroq limit tugaydi"
  return "More variants = faster limit usage"
}

function MarketplaceButton({
  label,
  selected,
  gradient,
  logoSrc,
  onClick,
}: {
  label: string
  selected: boolean
  gradient: string
  logoSrc?: string
  onClick: () => void
}) {
  return (
    <>
      
    <button
      className={selected ? "mc-marketplace-pill is-selected" : "mc-marketplace-pill"}
      data-marketplace={label.toLowerCase().replace(/\s+/g, "-")}
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
      <span className="mc-marketplace-pill-icon">
        {logoSrc ? (
          <img className="mc-marketplace-logo" src={logoSrc} alt={label} />
        ) : (
          label.charAt(0)
        )}
      </span>
      <span className="mc-marketplace-pill-label">{label}</span>
    </button>
    </>
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
  maxWidth: "100%",
  height: "56px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.14)",
  background: "#2a313b",
  color: "#f8fafc",
  padding: "0 18px",
  fontSize: "18px",
  fontWeight: 600,
  outline: "none",
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  cursor: "pointer",
  boxSizing: "border-box",
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
          overflow: "hidden",

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
        className="mc-payment-grid"
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
      style={{        width: "100%",
        borderRadius: "999px",
        background: "rgba(255,255,255,0.08)",      }}
    >
      <div
        style={{
          width: `${width}%`,          borderRadius: "999px",
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
  const [productCharacteristics, setProductCharacteristics] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [photoAnalyzing, setPhotoAnalyzing] = useState(false)
  const [photoAnalyzeError, setPhotoAnalyzeError] = useState("")
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
  const [sellingPrice, setSellingPrice] = useState("79000")
  const [adCostPercent, setAdCostPercent] = useState("8")
  const [returnRatePercent, setReturnRatePercent] = useState("5")
  const [returnCost, setReturnCost] = useState("4000")
  const [taxPercent, setTaxPercent] = useState("4")
  const [paymentFeePercent, setPaymentFeePercent] = useState("1.5")
  const [storagePerUnit, setStoragePerUnit] = useState("1200")
  const [monthlyFixedCosts, setMonthlyFixedCosts] = useState("500000")
  const [plannedUnits, setPlannedUnits] = useState("100")

  const [activePage, setActivePage] =
    useState<DashboardPageKey>("generator")

  const [languageMode, setLanguageMode] = useState<LanguageMode>("ru")
  const [variantCount, setVariantCount] = useState(5)
  const [generatedVariants, setGeneratedVariants] = useState<string[]>([])

  const [fixPrompt, setFixPrompt] = useState("")
  const [isFixingImage, setIsFixingImage] = useState(false)
  const [fixedImageUrl, setFixedImageUrl] = useState("")

  const [selectedFixIndex, setSelectedFixIndex] = useState(0)
  const [fixedImages, setFixedImages] = useState<Record<number, string>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [videoPrompt, setVideoPrompt] = useState("")
  const [videoStyle, setVideoStyle] = useState("cinematic")
  const [videoAspect, setVideoAspect] = useState("9:16")
  const [videoMarketplace, setVideoMarketplace] = useState<MarketplaceKey>("uzum")
  const [isVideoGenerating, setIsVideoGenerating] = useState(false)
  const [videoResultReady, setVideoResultReady] = useState(false)
  const [videoAssetUrl, setVideoAssetUrl] = useState("")
  const [videoAssetType, setVideoAssetType] = useState<"video" | "gif" | "">("")
  const [listingData, setlistingData] = useState<ListingResponse | null>(null)
  const [listingLang, setListingLang] = useState<"ru" | "uz">("ru")
  const [translatedListing, setTranslatedListing] = useState<any | null>(null)
  const [isTranslatingListing, setIsTranslatingListing] = useState(false)
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

  useEffect(() => {
    if (!userEmail) return

    const ping = () => {
      fetch(`https://marketcard.uz/api/system/ping?email=${encodeURIComponent(userEmail)}`, {
        method: "POST",
      }).catch(() => {})
    }

    ping()
    const interval = setInterval(ping, 30000)

    return () => clearInterval(interval)
  }, [userEmail])

  const searchIkpu = async () => {
    const query = ikpuQuery.trim()
    if (!query) return

    setIkpuLoading(true)

    try {
      const res = await fetch(`/api/ikpu/search?q=${encodeURIComponent(query)}&limit=12`)
      const data = await res.json()
      setIkpuResults(Array.isArray(data?.items) ? data.items : [])
    } catch (e) {
      console.log("IKPU error:", e)
      setIkpuResults([])
    } finally {
      setIkpuLoading(false)
    }
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

  const allowedVariantOptions = (() => {
    const tariff = profile?.tariff_name

    if (tariff === "Start") return [1]
    if (tariff === "Business") return [1, 3]
    if (tariff === "Premium") return [1, 3, 5]

    return [1]
  })()

  const formatCooldown = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }

  const showCooldownPopup = (seconds: number) => {
    let remaining = Math.max(0, Number(seconds || 0))

    const old = document.getElementById("mc-cooldown-overlay")
    if (old) old.remove()

    const overlay = document.createElement("div")
    overlay.id = "mc-cooldown-overlay"
    overlay.style.cssText = [
      "position:fixed",
      "inset:0",
      "background:rgba(0,0,0,0.55)",
      "display:flex",
      "align-items:center",
      "justify-content:center",
      "z-index:999999"
    ].join(";")

    const box = document.createElement("div")
    box.style.cssText = [
      "width:min(92vw,420px)",
      "background:#111827",
      "border:1px solid rgba(255,255,255,0.12)",
      "border-radius:20px",
      "padding:24px",
      "box-shadow:0 20px 60px rgba(0,0,0,0.35)",
      "color:white",
      "font-family:Arial,sans-serif",
      "text-align:center"
    ].join(";")

    const title = document.createElement("div")
    title.textContent = "Ограничение генерации"
    title.style.cssText = "font-size:24px;font-weight:900;margin-bottom:14px;"

    const textNode = document.createElement("div")
    textNode.style.cssText = "font-size:18px;line-height:1.5;margin-bottom:18px;opacity:0.95;"

    const closeBtn = document.createElement("button")
    closeBtn.textContent = "Понятно"
    closeBtn.style.cssText = [
      "padding:12px 18px",
      "border:none",
      "border-radius:12px",
      "background:linear-gradient(135deg,#06b6d4,#2563eb)",
      "color:white",
      "font-size:16px",
      "font-weight:800",
      "cursor:pointer"
    ].join(";")

    const render = () => {
      textNode.textContent = `Следующая генерация будет доступна через ${formatCooldown(remaining)}`
    }

    render()

    let timer: number | null = window.setInterval(() => {
      remaining -= 1
      if (remaining <= 0) {
        if (timer) window.clearInterval(timer)
        overlay.remove()
        localStorage.removeItem("generate_cooldown_until")
        return
      }
      render()
    }, 1000)

    closeBtn.onclick = () => {
      if (timer) window.clearInterval(timer)
      overlay.remove()
    }

    box.appendChild(title)
    box.appendChild(textNode)
    box.appendChild(closeBtn)
    overlay.appendChild(box)
    document.body.appendChild(overlay)
  }

  const loadProfile = async () => {
    try {
      setProfileLoading(true)
    const token = localStorage.getItem("access_token")

    const email = localStorage.getItem("user_email")

if (!token || !email) {
  setProfileLoading(false)
  setProfile(null)
  return
}

const res = await fetch(
`/api/auth/me?email=${encodeURIComponent(email)}`,
 {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

      if (!res.ok) {
  const errorData = await res.json().catch(() => null)

  if (res.status === 401 || errorData?.detail === "Profile access denied") {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user_email")
    setProfile(null)
    router.push("/login")
    return
  }

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
    const refreshProfile = () => {
      loadProfile()
    }

    window.addEventListener("marketcard:profile-refresh", refreshProfile)
    return () => window.removeEventListener("marketcard:profile-refresh", refreshProfile)
  }, [])

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
    if (!allowedVariantOptions.includes(variantCount)) {
      setVariantCount(allowedVariantOptions[0])
    }
  }, [profile?.tariff_name, variantCount])

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("")
      setPhotoAnalyzeError("")
      setPhotoAnalyzing(false)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  useEffect(() => {
    if (!selectedFile) return

    let cancelled = false

    const analyzePhoto = async () => {
      try {
        setPhotoAnalyzing(true)
        setPhotoAnalyzeError("")

        const formData = new FormData()
        formData.append("image", selectedFile)

        const res = await fetch("/api/analyze-product-photo", {
          method: "POST",
          body: formData,
        })
        const data: ProductPhotoAnalysisResponse | null = await res.json().catch(() => null)

        if (cancelled) return

        if (!res.ok || !data?.success) {
          throw new Error((data as any)?.detail || "Не удалось распознать фото")
        }

        if (data.title?.trim()) setProductTitle(data.title.trim())
        if (data.category?.trim()) setCategory(data.category.trim())
        if (data.brand?.trim()) {
          setBrand((current) => (current.trim() ? current : data.brand!.trim()))
        }

        const characteristics = Array.isArray(data.characteristics)
          ? data.characteristics.filter(Boolean)
          : []
        if (characteristics.length > 0) {
          setProductCharacteristics(characteristics.join("\n"))
        } else if (data.short_description?.trim()) {
          setProductCharacteristics(data.short_description.trim())
        }
      } catch (error) {
        if (!cancelled) {
          console.error("PHOTO ANALYZE ERROR:", error)
          setPhotoAnalyzeError("AI не смог распознать фото. Можно заполнить поля вручную.")
        }
      } finally {
        if (!cancelled) setPhotoAnalyzing(false)
      }
    }

    analyzePhoto()

    return () => {
      cancelled = true
    }
  }, [selectedFile])

  
  const translateListingToUz = async () => {
    if (!listingData) return

    if (translatedListing) {
      setListingLang("uz")
      return
    }

    try {
      setIsTranslatingListing(true)

      const response = await fetch("/api/translate/listing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: (listingData as any).title,
          short_description: (listingData as any).short_description,
          full_description: (listingData as any).full_description,
          characteristics: (listingData as any).characteristics || [],
        }),
      })

      const data = await response.json()
      setTranslatedListing(data)
      setListingLang("uz")
    } catch (e) {
      console.error("translate listing failed", e)
      alert("Не удалось перевести текст")
    } finally {
      setIsTranslatingListing(false)
    }
  }

const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user_email")
    router.push("/login")
  }

  const handleSwitchAccount = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user_email")
    router.push("/login")
  }

  const handleAccountDeleteRequest = () => {
    const confirmed = window.confirm(
      "Удаление аккаунта необратимо. Открыть поддержку, чтобы подтвердить удаление MarketCard AI аккаунта?"
    )

    if (!confirmed) return

    window.open(
      "https://t.me/marketcardai_support_bot",
      "_blank",
      "noopener,noreferrer"
    )
  }
const searchIkpuAuto = async (query: string) => {
  if (!query.trim()) {
    setIkpuResults([])
    return
  }

  setIkpuLoading(true)

  try {
    const productPayload =
      productTitle.trim() || category.trim() || brand.trim()
        ? {
            title: productTitle.trim() || query,
            brand: brand.trim(),
            category: category.trim(),
            description: `${query} ${productCharacteristics}`.trim(),
          }
        : null

    const res = productPayload
      ? await fetch("/api/ikpu/suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productPayload),
        })
      : await fetch(`/api/ikpu/search?q=${encodeURIComponent(query)}&limit=8`)
    const data = await res.json().catch(() => null)

    if (!res.ok || !data?.success) {
      setIkpuResults([])
      return
    }

    setIkpuResults(Array.isArray(data.items) ? data.items.slice(0, 8) : [])
  } catch (e) {
    console.log("IKPU AUTO ERROR:", e)
    setIkpuResults([])
  } finally {
    setIkpuLoading(false)
  }
}
  const handleActivateTariff = async () => {
  console.log("ACTIVATE 1 START", { userEmail, selectedTariff })
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
        `/api/payments/create-order?email=${encodeURIComponent(emailToUse)}&tariff_name=${encodeURIComponent(selectedTariff)}&provider=${encodeURIComponent(selectedPayment || "unknown")}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      )

    console.log("ACTIVATE 5 AFTER FETCH", res.status)
    console.log("GEN 3 STATUS", res.status)
      const data = await res.json().catch(() => null)

      if (selectedPayment === "payme" && data?.payme_url) {
        localStorage.setItem("marketcard_pending_tariff_purchase", "1")
        window.location.href = data.payme_url
        return
      }

      if (selectedPayment === "click" && data?.click_url) {
        window.location.href = data.click_url
        return
      }
      if (selectedPayment === "click") {
        alert("Click ссылка не получена")
        return
      }

      if (selectedPayment === "visa") {
        alert("Visa пока недоступна. Выберите Payme или Click.")
        return
      }

    console.log("ACTIVATE 6 RESPONSE DATA", data)

      if (!res.ok) {
        alert(data?.detail || t.serverError)
        return
      }

      setShowTariffModal(false)
      alert(t.tariffActivated)

      await loadProfile()
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
  const cooldownUntil = Number(localStorage.getItem("generate_cooldown_until") || "0")
  const now = Date.now()

  if (cooldownUntil > now) {
    const remaining = Math.ceil((cooldownUntil - now) / 1000)
    showCooldownPopup(remaining)
    return
  }

  console.log("GEN 0 PROFILE", profile)
    const ikpuSearchText = `${productTitle} ${category} ${productCharacteristics}`.trim()
setIkpuQuery(ikpuSearchText)

const ikpuPromise = searchIkpuAuto(ikpuSearchText)
    setIsGenerating(true)
  try {
    setCreating(true)
    setPngReady(false)
    setGeneratedVariants([])
    setlistingData(null)
    setListingReady(false)

    const formData = new FormData()
    if (!profile?.email) {
      console.log("GEN STOP: NO EMAIL", profile)
      alert("Email пользователя не найден")
      return
    }

    formData.append("email", profile?.email)
    formData.append("product_title", productTitle)
    formData.append("brand", brand)
    formData.append("category", category)
    formData.append("marketplace", selectedMarketplace)
    formData.append("language_mode", languageMode)
    formData.append("variant_count", String(variantCount))
    formData.append("extra_features", productCharacteristics)

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

    if (data?.cooldown_seconds) {
      localStorage.setItem(
        "generate_cooldown_until",
        String(Date.now() + Number(data.cooldown_seconds) * 1000)
      )
    }

    // ✅ SEO / ОПИСАНИЕ
    const listingPayload = data.listing || data
    if (listingPayload) {
      setlistingData(listingPayload)
      setListingReady(true)
    }
    if (profile?.email) {
      await loadProfile()
    }
    await ikpuPromise
    const generationIkpuItems = Array.isArray(data?.ikpu?.items) ? data.ikpu.items : []
    if (generationIkpuItems.length > 0) {
      setIkpuResults(generationIkpuItems.slice(0, 8))
    } else if (data?.ikpu?.best) {
      setIkpuResults([data.ikpu.best])
    }
  } catch (err) {
    console.log("GEN ERROR", err)
    console.error(err)
    alert("Ошибка")
  } finally {
  setCreating(false)
  setIsGenerating(false)
}
}

  
  const handleFixGeneratedImage = async () => {
    try {
      if (!generatedVariants || generatedVariants.length === 0) {
        alert("Сначала сгенерируйте изображение")
        return
      }

      if (!fixPrompt.trim()) {
        alert("Напишите, что нужно исправить")
        return
      }

      const selectedImage =
        fixedImages[selectedFixIndex] || generatedVariants[selectedFixIndex]

      if (!selectedImage) {
        alert("Не выбрано изображение для исправления")
        return
      }

      setIsFixingImage(true)

      const imageUrl = selectedImage.replace("https://marketcard.uz", "")

      const res = await fetch("https://marketcard.uz/api/fix-generated-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: imageUrl,
          fix_prompt: fixPrompt,
          email: profile?.email ?? userEmail ?? "",
        }),
      })

      const data = await res.json()

      if (!res.ok || !data?.success) {
        alert(JSON.stringify(data))
        return
      }

      const finalUrl = `https://marketcard.uz${data.fixed_image_url}`

      setFixedImageUrl(finalUrl)
      setFixedImages((prev) => ({
        ...prev,
        [selectedFixIndex]: finalUrl,
      }))
      setFixPrompt("")
      await loadProfile()
      alert("Исправленная версия готова")
    } catch (e) {
      console.error(e)
      alert("Ошибка исправления")
    } finally {
      setIsFixingImage(false)
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
    const sellingPriceNum = toNumber(sellingPrice)
    const adCostPercentNum = toNumber(adCostPercent)
    const returnRateNum = toNumber(returnRatePercent)
    const returnCostNum = toNumber(returnCost)
    const taxPercentNum = toNumber(taxPercent)
    const paymentFeePercentNum = toNumber(paymentFeePercent)
    const storageNum = toNumber(storagePerUnit)
    const monthlyFixedNum = toNumber(monthlyFixedCosts)
    const plannedUnitsNum = Math.max(1, toNumber(plannedUnits))

    const purchaseCostUzs = purchaseUsdNum * usdRateNum
    const totalCost =
      purchaseCostUzs +
      fulfillmentNum +
      localNum +
      marketingNum +
      packagingNum +
      otherNum +
      storageNum

    const variableRate = (commissionNum + adCostPercentNum + taxPercentNum + paymentFeePercentNum) / 100
    const commissionFactor = 1 - variableRate
    const safeFactor = commissionFactor > 0 ? commissionFactor : 0.01
    const returnReserve = (purchaseCostUzs + returnCostNum) * (returnRateNum / 100)
    const fixedPerUnit = monthlyFixedNum / plannedUnitsNum
    const trueUnitCost = totalCost + returnReserve + fixedPerUnit

    const breakEven = roundMoney(trueUnitCost / safeFactor)
    const aggressive = roundMoney((trueUnitCost + desiredProfitNum * 0.55) / safeFactor)
    const optimal = roundMoney((trueUnitCost + desiredProfitNum) / safeFactor)
    const premium = roundMoney((trueUnitCost + desiredProfitNum * 1.8) / safeFactor)

    const profitAtPrice = (price: number) => price * safeFactor - trueUnitCost
    const marginAtPrice = (price: number) =>
      price > 0 ? (profitAtPrice(price) / price) * 100 : 0
    const roiAtPrice = (price: number) =>
      trueUnitCost > 0 ? (profitAtPrice(price) / trueUnitCost) * 100 : 0
    const contributionProfit = roundMoney(profitAtPrice(sellingPriceNum))
    const contributionMargin = marginAtPrice(sellingPriceNum)
    const roi = roiAtPrice(sellingPriceNum)
    const breakEvenUnits =
      contributionProfit > 0 ? Math.ceil(monthlyFixedNum / contributionProfit) : 0
    const breakEvenRevenue = breakEvenUnits * sellingPriceNum
    const maxAcos =
      sellingPriceNum > 0
        ? Math.max(0, ((sellingPriceNum - trueUnitCost + sellingPriceNum * (adCostPercentNum / 100)) / sellingPriceNum) * 100)
        : 0
    const profitPlan = contributionProfit * plannedUnitsNum
    const safetyGap = sellingPriceNum - breakEven

    return {
      competitorNum,
      purchaseCostUzs,
      totalCost,
      trueUnitCost,
      returnReserve,
      fixedPerUnit,
      variableRate,
      breakEven,
      sellingPriceNum,
      contributionProfit,
      contributionMargin,
      roi,
      breakEvenUnits,
      breakEvenRevenue,
      maxAcos,
      profitPlan,
      safetyGap,
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
    sellingPrice,
    adCostPercent,
    returnRatePercent,
    returnCost,
    taxPercent,
    paymentFeePercent,
    storagePerUnit,
    monthlyFixedCosts,
    plannedUnits,
  ])

  
  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    root.classList.add("dashboard-cursor-glow")
    root.classList.add("mc-dashboard-no-page-scroll")
    body.classList.add("mc-dashboard-no-page-scroll")

    const handleMove = (e: MouseEvent) => {
      const main = document.querySelector("main")
      if (!main) return

      const rect = main.getBoundingClientRect()
      root.style.setProperty("--mc-x", (e.clientX - rect.left) + "px")
      root.style.setProperty("--mc-y", (e.clientY - rect.top) + "px")
      root.style.setProperty("--mc-opacity", "1")
    }

    const handleLeave = () => {
      root.style.setProperty("--mc-opacity", "0")
    }

    window.addEventListener("mousemove", handleMove)
    window.addEventListener("mouseout", handleLeave)

    return () => {
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mouseout", handleLeave)
      root.classList.remove("dashboard-cursor-glow")
      root.classList.remove("mc-dashboard-no-page-scroll")
      body.classList.remove("mc-dashboard-no-page-scroll")
      root.style.removeProperty("--mc-x")
      root.style.removeProperty("--mc-y")
      root.style.removeProperty("--mc-opacity")
    }
  }, [])

  const dashboardName =
    profile?.full_name?.trim() ||
    (userEmail ? userEmail.split("@")[0] : "продавец")
  const dashboardInitial = (dashboardName || "M").charAt(0).toUpperCase()
  const dashboardTotal = Math.max(profile?.tariff_generations_total ?? 0, 0)
  const dashboardUsed = Math.max(profile?.tariff_generations_used ?? 0, 0)
  const dashboardLeft = Math.max(profile?.tariff_generations_left ?? 0, 0)
  const dashboardProgress =
    dashboardTotal > 0 ? Math.min(100, Math.round((dashboardUsed / dashboardTotal) * 100)) : 0

  const dashboardStats = [
    {
      label: "Карточек создано",
      value: profileLoading ? "..." : String(dashboardUsed),
      detail: `${dashboardLeft} генераций осталось`,
      tone: "cyan",
    },
    {
      label: "Лимит тарифа",
      value: profileLoading ? "..." : String(dashboardTotal),
      detail: profile?.tariff_name || "Тариф не выбран",
      tone: "violet",
    },
    {
      label: "AI варианты",
      value: String(generatedVariants.length),
      detail: generatedVariants.length > 0 ? "готовы к просмотру" : "после генерации появятся здесь",
      tone: "emerald",
    },
    {
      label: "Аудиты карточек",
      value: String(profile?.audit_credits ?? 0),
      detail: "для проверки инфографики",
      tone: "pink",
    },
    {
      label: "AI видео",
      value: videoResultReady ? "1" : "0",
      detail: "короткие промо-ролики товара",
      tone: "amber",
    },
  ]

  const dashboardTips = [
    {
      title: "Быстрый старт",
      text: "Загружайте чистое фото товара и сразу выбирайте площадку: Uzum, Wildberries или Ozon.",
      accent: "cyan",
    },
    {
      title: "Pro логика",
      text: "Добавьте бренд, категорию и 2-3 преимущества товара, чтобы AI точнее собрал инфографику.",
      accent: "violet",
    },
    {
      title: "SEO и аудит",
      text: "После генерации проверьте карточку через аудит и соберите описание для маркетплейса.",
      accent: "emerald",
    },
  ]

  const closeDashboardMenu = () => {
    if (isMobile) setIsMobileMenuOpen(false)
  }

  const selectDashboardPage = (page: DashboardPageKey) => {
    setActivePage(page)
    closeDashboardMenu()
  }

  const handleVideoGenerate = async () => {
    if (!selectedFile) {
      alert("Сначала загрузите фото товара для AI-видео.")
      return
    }

    const scenario =
      videoPrompt.trim() ||
      "Красивый 360° оборот товара, премиальная подсветка, динамичные переходы, крупные преимущества и финальный оффер для маркетплейса."

    setIsVideoGenerating(true)
    setVideoResultReady(false)
    setVideoAssetUrl("")
    setVideoAssetType("")

    if (!videoPrompt.trim()) {
      setVideoPrompt(scenario)
    }

    try {
      const formData = new FormData()
      formData.append("product_title", productTitle || selectedFile.name || "MarketCard product")
      formData.append("marketplace", videoMarketplace)
      formData.append("scenario", scenario)
      formData.append("style", videoStyle)
      formData.append("image", selectedFile)

      const token = localStorage.getItem("access_token")
      const res = await fetch("/api/video/generate", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      })
      const data = await res.json().catch(() => null)

      if (!res.ok || !data?.success) {
        throw new Error(data?.detail || "Не удалось создать видео")
      }

      const assetUrl =
        typeof data.video_url === "string" && data.video_url.startsWith("/generated_videos")
          ? `/api${data.video_url}`
          : data.video_url

      setVideoAssetUrl(assetUrl || "")
      setVideoAssetType(data.asset_type === "gif" ? "gif" : "video")
      setVideoResultReady(true)
    } catch (error) {
      console.error("VIDEO GENERATE ERROR", error)
      alert(error instanceof Error ? error.message : "Ошибка генерации видео")
    } finally {
      setIsVideoGenerating(false)
    }
  }

  const videoMarketplaces = [
    {
      key: "uzum" as const,
      label: "UZUM",
      format: "9:16",
      caption: "Stories / Reels",
      logo: "/marketplaces-premium/uzum.png",
    },
    {
      key: "wildberries" as const,
      label: "Wildberries",
      format: "9:16",
      caption: "vertical promo",
      logo: "/marketplaces-premium/wildberries.png",
    },
    {
      key: "ozon" as const,
      label: "OZON",
      format: "1:1",
      caption: "square feed",
      logo: "/marketplaces-premium/ozon.png",
    },
    {
      key: "yandex" as const,
      label: "Yandex Market",
      format: "16:9",
      caption: "wide showcase",
      logo: "/marketplaces-premium/yandex.png",
    },
  ]

  const activeVideoMarketplace =
    videoMarketplaces.find((item) => item.key === videoMarketplace) ||
    videoMarketplaces[0]

  const videoStyles = [
    { key: "cinematic", label: "Cinematic" },
    { key: "luxury", label: "Luxury" },
    { key: "dynamic", label: "Dynamic" },
    { key: "studio", label: "Studio" },
  ]

  const videoPipeline = [
    {
      title: "Browser preview",
      text: "Мгновенный render brief в кабинете",
      url: "https://www.canva.com/ai-video-generator/",
    },
    {
      title: "Free AI queue",
      text: "Быстрый переход к open image-to-video сервисам",
      url: "https://huggingface.co/spaces?search=image%20to%20video",
    },
    {
      title: "MP export",
      text: "Форматы Uzum, WB, Ozon, Yandex",
      url: "https://www.capcut.com/tools/ai-video-generator",
    },
  ]

  const openSourcingLinks = () => {
    const sites = [
      ["1688", "https://www.1688.com", "Китайский оптовый маркетплейс"],
      ["Alibaba", "https://www.alibaba.com", "Международные поставщики"],
      ["Taobao", "https://world.taobao.com", "Товары и тренды Китая"],
      ["Made-in-China", "https://www.made-in-china.com", "Фабрики и производство"],
      ["Global Sources", "https://www.globalsources.com", "B2B поставщики"],
      ["DHgate", "https://www.dhgate.com", "Мелкий опт"],
      ["Курс юаня", "https://www.google.com/search?q=курс+юаня+к+суму", "CNY к UZS"],
    ]

    const modal = document.createElement("div")
    modal.className = "mc-dashboard-native-modal"
    modal.innerHTML = `
      <div class="mc-dashboard-native-modal-card">
        <div class="mc-dashboard-native-modal-kicker">MarketCard AI sourcing</div>
        <h2>Поиск и закуп товара</h2>
        <p>Быстрый переход к поставщикам, фабрикам и площадкам для запуска товаров.</p>
        <div class="mc-dashboard-native-modal-grid">
          ${sites
            .map(
              ([name, url, description]) => `
                <button type="button" data-url="${url}">
                  <strong>${name}</strong>
                  <span>${description}</span>
                </button>
              `
            )
            .join("")}
        </div>
        <button class="mc-dashboard-native-modal-close" type="button">Закрыть</button>
      </div>
    `

    modal.querySelectorAll<HTMLButtonElement>("[data-url]").forEach((button) => {
      button.addEventListener("click", () => {
        const url = button.dataset.url
        if (url) window.open(url, "_blank")
      })
    })

    modal.querySelector(".mc-dashboard-native-modal-close")?.addEventListener("click", () => {
      modal.remove()
    })

    modal.addEventListener("click", (event) => {
      if (event.target === modal) modal.remove()
    })

    document.body.appendChild(modal)
  }

  const openDeficitProducts = async () => {
    const niche = window.prompt("Введите нишу для анализа дефицита товаров на Uzum")
    if (!niche?.trim()) return

    try {
      const token = localStorage.getItem("access_token")
      const res = await fetch("/api/deficit-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          query: niche.trim(),
          limit: 100,
          marketplace: "uzum",
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || "Ошибка анализа")

      const fileUrl = data.download_url?.startsWith("/")
        ? data.download_url
        : `/api${data.download_url || ""}`
      window.open(fileUrl, "_blank")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Ошибка анализа")
    }
  }

  const openDeficitProductsAllMarketplaces = async () => {
    const niche = window.prompt("Введите нишу для анализа дефицита товаров")
    if (!niche?.trim()) return

    const marketplace =
      window.prompt("Маркетплейс: uzum, wildberries, ozon, yandex", "uzum") || "uzum"

    try {
      const token = localStorage.getItem("access_token")
      const res = await fetch("/api/deficit-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          query: niche.trim(),
          limit: 100,
          marketplace,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || "Ошибка анализа")

      const fileUrl = data.download_url?.startsWith("/")
        ? `/api${data.download_url}`
        : data.download_url
      if (fileUrl) window.open(fileUrl, "_blank")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Ошибка анализа")
    }
  }

  const mainDashboardNav = [
    { key: "generator" as const, label: "Создать карточку", meta: "AI", icon: "AI", onClick: () => selectDashboardPage("generator") },
    { key: "video" as const, label: "AI видео", meta: "NEW", icon: "VI", onClick: () => selectDashboardPage("video") },
    { key: "listing" as const, label: "SEO и описание", meta: listingReady ? "1" : "", icon: "SE", onClick: () => selectDashboardPage("listing") },
    { key: "economy" as const, label: "Экономика товара", meta: "", icon: "EC", onClick: () => selectDashboardPage("economy") },
    { key: "audit" as const, label: "Оценка карточки", meta: String(profile?.audit_credits ?? 0), icon: "AU", onClick: () => selectDashboardPage("audit") },
    { key: "intelligence" as const, label: "Аналитика товара", meta: "", icon: "BI", onClick: () => selectDashboardPage("intelligence") },
  ]

  const toolDashboardNav = [
    { label: "ABC анализ", meta: "URL", icon: "AB", onClick: () => window.dispatchEvent(new Event("marketcard:open-abc")) },
    { label: "ИКПУ", meta: "TASNIF", icon: "IK", onClick: () => window.open("https://tasnif.soliq.uz", "_blank") },
    { label: "Закуп товара", meta: "B2B", icon: "BZ", onClick: openSourcingLinks },
    { label: "DIDOX / ЭДО", meta: "DOC", icon: "DX", onClick: () => window.open("https://didox.uz", "_blank") },
    { label: "Дефицит Uzum", meta: "XLS", icon: "DF", onClick: openDeficitProducts },
  ]

  const premiumToolDashboardNav = [
    { label: "ABC анализ", meta: "URL", icon: "AB", onClick: () => window.dispatchEvent(new Event("marketcard:open-abc")) },
    { label: "ИКПУ", meta: ikpuResults.length ? String(ikpuResults.length) : "AUTO", icon: "IK", onClick: () => selectDashboardPage("ikpu") },
    { label: "Закуп товара", meta: "B2B", icon: "BZ", onClick: () => selectDashboardPage("purchase") },
    { label: "DIDOX / ЭДО", meta: "DOC", icon: "DX", onClick: () => selectDashboardPage("didox") },
    { label: "Дефицит товаров", meta: "4 MP", icon: "DF", onClick: () => selectDashboardPage("deficit") },
    { label: "Инструкции", meta: "LIVE", icon: "IN", onClick: () => selectDashboardPage("instructions") },
  ]

  const dashboardSectionMeta: Record<DashboardPageKey, { title: string; subtitle: string; badge: string }> = {
    generator: {
      title: "AI генератор карточек",
      subtitle: "Создавайте премиальную инфографику для маркетплейсов из одного фото товара.",
      badge: "Image studio",
    },
    video: {
      title: "AI видео генератор",
      subtitle: "Собирайте короткие промо-ролики и motion-preview товара в едином стиле MarketCard AI.",
      badge: "Video studio",
    },
    listing: {
      title: "SEO и описание",
      subtitle: "Готовьте название, описание, свойства и локализацию карточки под площадку.",
      badge: "Marketplace copy",
    },
    economy: {
      title: "Экономика товара",
      subtitle: "Считайте цену, маржу, ROI и сценарии запуска без таблиц и хаоса.",
      badge: "Profit cockpit",
    },
    audit: {
      title: "Оценка карточки",
      subtitle: "Проверяйте инфографику, визуальную логику и готовность к продажам.",
      badge: "Card audit",
    },
    intelligence: {
      title: "Аналитика товара",
      subtitle: "Смотрите сигналы продукта, гипотезы, конкурентов и потенциал ниши.",
      badge: "Product intelligence",
    },
    ikpu: {
      title: "ИКПУ",
      subtitle: "Автоподбор кода через Soliq parser, локальный кеш и ранжирование по товару.",
      badge: "Soliq parser",
    },
    purchase: {
      title: "Закуп товара",
      subtitle: "Площадки Китая, фабрики, карго Узбекистана и быстрые ссылки для закупа.",
      badge: "Sourcing hub",
    },
    didox: {
      title: "DIDOX / ЭДО",
      subtitle: "Подготовка к интеграции документов, счетов и электронного документооборота.",
      badge: "Documents",
    },
    deficit: {
      title: "Дефицит товаров",
      subtitle: "Сигналы дефицита по Uzum, Wildberries, Ozon и Yandex Market.",
      badge: "Market gaps",
    },
    instructions: {
      title: "Инструкции маркетплейсов",
      subtitle: "Живой центр правил и чеклистов по требованиям площадок.",
      badge: "Live rules",
    },
  }

  const platformMapItems = [
    {
      key: "generator" as const,
      title: "AI карточки",
      text: "Фото товара, маркетплейс, язык и варианты инфографики в одном studio-flow.",
      metric: `${dashboardLeft}/${dashboardTotal || 0}`,
      tone: "cyan",
      onClick: () => selectDashboardPage("generator"),
      active: activePage === "generator",
    },
    {
      key: "video" as const,
      title: "AI видео",
      text: "Motion brief, формат ролика и preview для будущей video generation.",
      metric: videoResultReady ? "ready" : "new",
      tone: "pink",
      onClick: () => selectDashboardPage("video"),
      active: activePage === "video",
    },
    {
      key: "listing" as const,
      title: "SEO карточки",
      text: "Название, описание, свойства и локализация под площадки.",
      metric: listingReady ? "done" : "copy",
      tone: "violet",
      onClick: () => selectDashboardPage("listing"),
      active: activePage === "listing",
    },
    {
      key: "economy" as const,
      title: "Экономика",
      text: "Маржа, ROI, точка безубыточности и сценарии цены.",
      metric: "ROI",
      tone: "emerald",
      onClick: () => selectDashboardPage("economy"),
      active: activePage === "economy",
    },
    {
      key: "audit" as const,
      title: "Аудит",
      text: "Проверка карточки перед запуском и визуальная диагностика.",
      metric: String(profile?.audit_credits ?? 0),
      tone: "amber",
      onClick: () => selectDashboardPage("audit"),
      active: activePage === "audit",
    },
    {
      key: "intelligence" as const,
      title: "Аналитика",
      text: "Сигналы товара, конкуренты, спрос и продуктовые гипотезы.",
      metric: "BI",
      tone: "blue",
      onClick: () => selectDashboardPage("intelligence"),
      active: activePage === "intelligence",
    },
  ]

if (!authChecked) return null 
  return (
    <>
      <main
        className="mc-dashboard-shell"
        data-page={activePage}
        style={{
          columnGap: isMobile ? "0" : "28px",
    minHeight: "100vh",
          background:
            "linear-gradient(135deg, #020617 0%, #020617 40%, #0a0f2c 100%)",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
      <DashboardOnboarding />
      <div className="mc-dashboard-ambient" aria-hidden="true">
        <span className="mc-dashboard-ambient-one" />
        <span className="mc-dashboard-ambient-two" />
        <span className="mc-dashboard-ambient-grid" />
      </div>
<div
  className="mc-dashboard-layout"
  style={{
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "320px minmax(0, 1fr)", 
    position: "relative",
    minHeight: "auto",
        overflow: "hidden",
        overflowY: "hidden",
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
      className="mc-dashboard-mobile-toggle"
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
  className="mc-dashboard-sidebar mc-dashboard-sidebar-v2"
  style={{
    display: isMobile ? (isMobileMenuOpen ? "flex" : "none") : "flex",
    position: isMobile ? "fixed" : "relative",
    top: isMobile ? "0" : undefined,
    left: isMobile ? "0" : undefined,
    zIndex: isMobile ? 9998 : undefined,
    width: isMobile ? "300px" : "320px",
    minWidth: isMobile ? "300px" : "320px",
  }}
>
  <div className="mc-dashboard-brand">
    <div className="mc-dashboard-brand-mark">
      <img src="/logo.jpg" alt="MarketCard AI" />
    </div>
    <div>
      <strong>MarketCard</strong>
      <span>AI</span>
    </div>
  </div>

  <nav className="mc-dashboard-nav" aria-label="Главные разделы">
    <div className="mc-dashboard-nav-label">Основное</div>
    {mainDashboardNav.map((item) => (
      <button
        key={item.key}
        type="button"
        onClick={item.onClick}
        className={activePage === item.key ? "mc-dashboard-nav-item is-active" : "mc-dashboard-nav-item"}
      >
        <span className="mc-dashboard-nav-dot">{item.icon}</span>
        <span>{item.label}</span>
        {item.meta && <b>{item.meta}</b>}
      </button>
    ))}
  </nav>

  <nav className="mc-dashboard-nav mc-dashboard-nav-tools" aria-label="Инструменты">
    <div className="mc-dashboard-nav-label">Инструменты</div>
    {premiumToolDashboardNav.map((item) => (
      <button
        key={item.label}
        type="button"
        onClick={() => {
          item.onClick()
          closeDashboardMenu()
        }}
        className="mc-dashboard-nav-item"
      >
        <span className="mc-dashboard-nav-dot">{item.icon}</span>
        <span>{item.label}</span>
        <b>{item.meta}</b>
      </button>
    ))}
  </nav>

  <div className="mc-dashboard-sidebar-spacer" />

  <div className="mc-dashboard-credit-card">
    <div className="mc-dashboard-credit-card-top">
      <span>Кредиты</span>
      <strong>{dashboardLeft}/{dashboardTotal || 0}</strong>
    </div>
    <div className="mc-dashboard-credit-bar">
      <span style={{ width: `${Math.max(4, 100 - dashboardProgress)}%` }} />
    </div>
    <button type="button" onClick={() => setShowTariffModal(true)}>
      Пополнить тариф
    </button>
  </div>

  <div className="mc-dashboard-sidebar-bottom">
    <button type="button" onClick={() => setShowTariffModal(true)}>Тарифы</button>
    <button type="button" onClick={() => window.open("https://t.me/marketcardai_support_bot", "_blank")}>Поддержка</button>
    <button type="button" onClick={handleLogout}>Выйти</button>
  </div>
</aside>

 <aside
  className="mc-dashboard-sidebar mc-dashboard-sidebar-legacy"
  style={{
    display: isMobile ? (isMobileMenuOpen ? "block" : "none") : "block",
    position: isMobile ? "fixed" : "relative",
    top: isMobile ? "0" : undefined,
    left: isMobile ? "0" : undefined,
    zIndex: isMobile ? 9998 : undefined,
    width: isMobile ? "280px" : "320px",
    minWidth: isMobile ? "280px" : "320px",    borderRight: "1px solid rgba(255,255,255,0.08)",
    background: isMobile ? "rgba(8,15,35,0.96)" : "transparent",
    backdropFilter: isMobile ? "blur(14px)" : undefined,
    boxShadow: isMobile ? "0 0 30px rgba(0,0,0,0.35)" : undefined,
  }}
>
            <div
              style={{
                color: "white",
                fontSize: "44px",
                fontWeight: 900,
                lineHeight: 1,
                marginBottom: "28px",
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
                      minWidth: "22px",                      padding: "0 6px",
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
<div
          onClick={() => setActivePage("audit")}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)" }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)" }}
          style={{
            padding: "18px 22px",
            borderRadius: "20px",
            background: activePage === "audit" ? "linear-gradient(135deg,#22c55e,#06b6d4)" : "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.14)",
            color: "#fff",
            fontWeight: 900,
            cursor: "pointer",
            marginTop: "14px",
            boxShadow: activePage === "audit" ? "0 0 24px rgba(34,197,94,0.35)" : "none",
            transition: "all 0.18s ease",
          transform: "scale(1)",
            
          }}
        >
          Оценка карточки
        </div>

<div
  onClick={() => setActivePage("intelligence")}
  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)" }}
  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)" }}
  style={{
  cursor: "pointer",
  marginTop: "10px",
  padding: "14px",
  borderRadius: "14px",
  background: activePage === "intelligence"
    ? "linear-gradient(135deg,#22c55e,#06b6d4)"
    : "rgba(255,255,255,0.06)",
}}>
  📊 Аналитика товара
</div>
              <div
                onClick={() => window.dispatchEvent(new Event("marketcard:open-abc"))}
                onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.045)"
          e.currentTarget.style.boxShadow = "0 20px 48px rgba(56,189,248,0.34)"
          e.currentTarget.style.filter = "brightness(1.08)"
        }}

        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 12px 35px rgba(6,182,212,0.35)";
        }}
        style={{
                  padding: "16px 18px",
                  borderRadius: "18px",
                  background: "linear-gradient(135deg,#6366f1,#a855f7)",
                  color: "white",
                  fontWeight: 900,
                  cursor: "pointer",
                  marginTop: "12px",
                  textAlign: "center",
                  boxShadow: "0 18px 45px rgba(99,102,241,0.28)",
                  transition: "all 0.18s ease",
          transform: "scale(1)",
              }}
              >
                🚀 ABC анализ по ссылке
              </div>
      <div
        onClick={() => {
          const sites = [
            ["1688", "https://www.1688.com", "Китайский оптовый маркетплейс"],
            ["Alibaba", "https://www.alibaba.com", "Международные поставщики"],
            ["Taobao", "https://world.taobao.com", "Товары и тренды Китая"],
            ["Made-in-China", "https://www.made-in-china.com", "Фабрики и производство"],
            ["Global Sources", "https://www.globalsources.com", "B2B поставщики"],
            ["DHgate", "https://www.dhgate.com", "Мелкий опт"],
            ["Курс юаня", "https://www.google.com/search?q=курс+юаня+к+суму", "CNY → UZS"]
          ];

          const modal = document.createElement("div");
          modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:999999;display:flex;align-items:center;justify-content:center;";

          const box = document.createElement("div");
          box.style.cssText = "width:min(900px,94vw);max-height:88vh;overflow:auto;border-radius:30px;padding:28px;background:linear-gradient(135deg,#0f172a,#111827);border:1px solid rgba(255,255,255,.16);box-shadow:0 30px 90px rgba(0,0,0,.65);color:white;font-family:system-ui;";

          const title = document.createElement("div");
          title.textContent = "🌏 Поиск и закуп товара";
          title.style.cssText = "font-size:30px;font-weight:900;margin-bottom:8px;";

          const subtitle = document.createElement("div");
          subtitle.textContent = "Бесплатный раздел: площадки Китая, поставщики и быстрый переход.";
          subtitle.style.cssText = "font-size:16px;color:rgba(255,255,255,.72);margin-bottom:22px;";

          const grid = document.createElement("div");
          grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;";

          sites.forEach((item) => {
            const card = document.createElement("button");
            card.type = "button";
            card.onclick = () => window.open(item[1], "_blank");
            card.style.cssText = "border:1px solid rgba(255,255,255,.14);border-radius:20px;padding:18px;background:linear-gradient(135deg,rgba(56,189,248,.22),rgba(37,99,235,.22));color:white;text-align:left;cursor:pointer;box-shadow:0 12px 30px rgba(0,0,0,.25);transition:all .18s ease;transform:scale(1);";
            card.onmouseenter = () => {
              card.style.transform = "scale(1.045)";
              card.style.boxShadow = "0 20px 44px rgba(56,189,248,.32)";
              card.style.border = "1px solid rgba(255,255,255,.28)";
            };
            card.onmouseleave = () => {
              card.style.transform = "scale(1)";
              card.style.boxShadow = "0 12px 30px rgba(0,0,0,.25)";
              card.style.border = "1px solid rgba(255,255,255,.14)";
            };
            card.textContent = item[0] + " — " + item[2];
            grid.appendChild(card);
          });

          const close = document.createElement("button");
          close.textContent = "Закрыть";
          close.onclick = () => modal.remove();
          close.style.cssText = "width:100%;margin-top:22px;padding:16px;border:0;border-radius:18px;background:rgba(255,255,255,.1);color:white;font-weight:900;cursor:pointer;";

          box.appendChild(title);
          box.appendChild(subtitle);
          box.appendChild(grid);
          box.appendChild(close);
          modal.appendChild(box);
          document.body.appendChild(modal);
        }}
        style={{
          padding: "16px 18px",
          borderRadius: "18px",
          background: "linear-gradient(135deg,#06b6d4,#2563eb)",
          color: "white",
          fontWeight: 900,
          cursor: "pointer",
          marginTop: "12px",
          textAlign: "center",
          boxShadow: "0 12px 35px rgba(6,182,212,0.35)",
          transition: "all 0.18s ease",
          transform: "scale(1)"
        }}
      >
        🌏 Поиск и закуп товара
      </div>



      <div
        onClick={() => window.open("https://didox.uz", "_blank")}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.03)"
          e.currentTarget.style.boxShadow = "0 18px 45px rgba(15,23,42,0.45)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)"
          e.currentTarget.style.boxShadow = "0 12px 35px rgba(15,23,42,0.35)"
        }}
        style={{
          padding: "16px 18px",
          borderRadius: "18px",
          background: "linear-gradient(135deg,#0f172a,#1e293b)",
          color: "white",
          fontWeight: 900,
          cursor: "pointer",
          marginTop: "12px",
          textAlign: "center",
          boxShadow: "0 12px 35px rgba(15,23,42,0.35)",
          transition: "all 0.18s ease",
          transform: "scale(1)",
        }}
      >
        📄 DIDOX / ЭДО
      </div>

      <div
        onClick={async () => {
          const formResult = await new Promise<{ niche: string; limit: number; marketplace: string } | null>((resolve) => {
            const modal = document.createElement("div");
            modal.style.position = "fixed";
            modal.style.inset = "0";
            modal.style.background = "rgba(0,0,0,0.68)";
            modal.style.zIndex = "99999";
            modal.style.display = "flex";
            modal.style.alignItems = "center";
            modal.style.justifyContent = "center";
            modal.innerHTML = ` 
              <div style="width:min(540px,92vw);border-radius:28px;padding:28px;background:linear-gradient(135deg,#0f172a,#111827);border:1px solid rgba(255,255,255,.18);box-shadow:0 30px 90px rgba(0,0,0,.6);color:white;font-family:system-ui">
                <div style="font-size:36px;margin-bottom:10px">📦</div>
                <div style="font-size:26px;font-weight:900;margin-bottom:8px">Дефицит товаров Uzum</div>
                <div style="font-size:15px;color:rgba(255,255,255,.72);line-height:1.5;margin-bottom:20px">Введите нишу. Анализ автоматически спишет 20 аудитов и соберёт максимум доступных товаров.</div>
                <input id="deficitNicheInput" placeholder="Например: наушники, коврики, зарядки" style="width:100%;box-sizing:border-box;border:1px solid rgba(255,255,255,.16);outline:none;border-radius:16px;padding:15px 16px;background:rgba(255,255,255,.08);color:white;font-size:16px;margin-bottom:16px" />
                <select id="deficitMarketplaceInput" style="width:100%;box-sizing:border-box;border:1px solid rgba(255,255,255,.16);outline:none;border-radius:16px;padding:15px 16px;background:#0f172a;color:white;font-size:16px;margin-bottom:16px">
                  <option value="uzum">Uzum</option>
                  <option value="wildberries">Wildberries</option>
                  <option value="ozon">Ozon</option>
                  <option value="yandex">Yandex Market</option>
                </select>
                
                <div style="display:flex;gap:12px;flex-wrap:wrap">
                  <button id="startDeficitAnalysis" style="flex:1;min-width:220px;border:0;border-radius:18px;padding:16px 18px;background:linear-gradient(135deg,#f59e0b,#d97706);color:white;font-weight:900;cursor:pointer;font-size:16px">🚀 Начать анализ</button>
                  <button id="closeDeficitForm" style="border:1px solid rgba(255,255,255,.16);border-radius:18px;padding:16px 18px;background:rgba(255,255,255,.08);color:white;font-weight:800;cursor:pointer;font-size:16px">Отмена</button>
                </div>
              </div>`;
            

            document.body.appendChild(modal);

            modal.querySelector("#closeDeficitForm")?.addEventListener("click", () => {
              modal.remove();
              resolve(null);
            });

            modal.querySelector("#startDeficitAnalysis")?.addEventListener("click", () => {
              const input = modal.querySelector("#deficitNicheInput") as HTMLInputElement | null;
              const marketplaceInput = modal.querySelector("#deficitMarketplaceInput") as HTMLSelectElement | null;
              const niche = (input?.value || "").trim();
              const marketplace = marketplaceInput?.value || "uzum";
              const limit = 100;

              if (!niche) {
                alert("Введите нишу или категорию");
                return;
              }

              const box = modal.firstElementChild as HTMLElement | null;
              if (box) {
                box.innerHTML = `
                  <div style="width:64px;height:64px;border-radius:999px;border:6px solid rgba(255,255,255,.18);border-top-color:#f59e0b;margin:0 auto 16px;animation:marketcardSpin 0.85s linear infinite"></div>
                  <style>
                    @keyframes marketcardSpin {
                      from { transform: rotate(0deg); }
                      to { transform: rotate(360deg); }
                    }
                  </style>
                  <div style="font-size:26px;font-weight:900;margin-bottom:10px">Подождите</div>
                  <div style="font-size:16px;color:rgba(255,255,255,.76);line-height:1.6">
                    Собираем данные с выбранного маркетплейса и формируем Excel-отчёт.<br/>
                    Это может занять немного времени.
                  </div>`;
                
              }
              resolve({ niche, limit, marketplace });
            });
          });

          if (!formResult) return;

          const token = localStorage.getItem("access_token");

          fetch("/api/deficit-products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ query: formResult.niche, limit: formResult.limit, marketplace: formResult.marketplace })
          })
            .then(async (r) => {
              const data = await r.json();
              if (!r.ok) throw new Error(data.detail || "Ошибка анализа");

              const fileUrl = data.download_url?.startsWith("/")
                ? data.download_url
                : `/api${data.download_url}`;

              document.querySelectorAll("div").forEach((el) => {
                if (el.textContent?.includes("Собираем данные с Uzum")) el.remove();
              });

              const doneModal = document.createElement("div");
              doneModal.style.position = "fixed";
              doneModal.style.inset = "0";
              doneModal.style.background = "rgba(0,0,0,0.68)";
              doneModal.style.zIndex = "99999";
              doneModal.style.display = "flex";
              doneModal.style.alignItems = "center";
              doneModal.style.justifyContent = "center";

              doneModal.innerHTML = ` 
                <div style="width:min(540px,92vw);border-radius:28px;padding:28px;background:linear-gradient(135deg,#0f172a,#111827);border:1px solid rgba(255,255,255,.18);box-shadow:0 30px 90px rgba(0,0,0,.6);color:white;font-family:system-ui">
                  <div style="font-size:38px;margin-bottom:10px">📊</div>
                  <div style="font-size:26px;font-weight:900;margin-bottom:8px">Excel-отчёт готов</div>
                  <div style="font-size:16px;line-height:1.6;color:rgba(255,255,255,.76);margin-bottom:22px">
                    Найдено товаров: <b style="color:white">${data.rows_found}</b><br/>
                    Осталось аудитов: <b style="color:#22c55e">${data.audit_credits_left}</b>
                  </div>

                  <div style="display:flex;gap:12px;flex-wrap:wrap">
                    <button id="downloadDeficitExcel" style="flex:1;min-width:220px;border:0;border-radius:18px;padding:16px 18px;background:linear-gradient(135deg,#22c55e,#16a34a);color:white;font-weight:900;cursor:pointer;font-size:16px">
                      📥 Скачать Excel
                    </button>

                    <button id="closeDeficitDone" style="border:1px solid rgba(255,255,255,.16);border-radius:18px;padding:16px 18px;background:rgba(255,255,255,.08);color:white;font-weight:800;cursor:pointer;font-size:16px">
                      Закрыть
                    </button>
                  </div>
                </div>`;
              

              document.body.appendChild(doneModal);

              doneModal.querySelector("#downloadDeficitExcel")?.addEventListener("click", () => {
                window.open(fileUrl, "_blank");
              });

              doneModal.querySelector("#closeDeficitDone")?.addEventListener("click", () => {
                doneModal.remove();
              });
            })
            .catch((e) => alert(e.message));
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.045)"
          e.currentTarget.style.boxShadow = "0 20px 48px rgba(56,189,248,0.34)"
          e.currentTarget.style.filter = "brightness(1.08)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)"
          e.currentTarget.style.boxShadow = "0 12px 35px rgba(15,23,42,0.35)"
          e.currentTarget.style.filter = "brightness(1)"
        }}
        style={{
          padding: "16px 18px",
          borderRadius: "18px",
          background: "linear-gradient(135deg,#f59e0b,#d97706)",
          color: "white",
          fontWeight: 900,
          cursor: "pointer",
          marginTop: "12px",
          textAlign: "center",
          boxShadow: "0 12px 35px rgba(245,158,11,0.35)",
          transition: "all 0.18s ease",
          transform: "scale(1)",
        }}
      >
        📦 Дефицит товаров (Uzum)
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
  className="mc-dashboard-content"
  style={{
    padding: "24px",
    paddingBottom: "24px",
    overflowX: "hidden",
    overflowY: "hidden",
    overflow: "visible",
    height: "auto",
    maxHeight: "none",
  }}
>
  <header className="mc-dashboard-topbar">
    <label className="mc-dashboard-topbar-search">
      <span>Поиск</span>
      <input type="text" placeholder="Поиск карточек, шаблонов, аудитов..." readOnly />
    </label>

    <div className="mc-dashboard-topbar-actions">
      <button
        type="button"
        className="mc-dashboard-topbar-primary"
        onClick={() => selectDashboardPage("generator")}
      >
        Новая карточка
      </button>
      <button
        type="button"
        className="mc-dashboard-topbar-icon"
        onClick={() => setShowLangMenu((prev) => !prev)}
      >
        {lang.toUpperCase()}
      </button>
      <button type="button" className="mc-dashboard-topbar-user" onClick={() => setShowTariffModal(true)}>
        <span>{dashboardInitial}</span>
        <div>
          <strong>{dashboardName}</strong>
          <small>{profile?.tariff_name || "без тарифа"}</small>
        </div>
      </button>
    </div>

    {showLangMenu && (
      <div className="mc-dashboard-lang-menu">
        {(["ru", "uz", "en"] as Lang[]).map((item: Lang) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setLang(item)
              setShowLangMenu(false)
            }}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </div>
    )}
  </header>

  {false && (
  <div
    style={{
      maxWidth: "1100px",
      padding: "0",
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
      Поиск ИКПУ        <div onClick={() => setActivePage("audit")} style={{cursor:"pointer",marginTop:"10px"}}>Оценка карточки</div>

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
    className="mc-dashboard-container"
    style={{
      maxWidth: "1360px",
      margin: "0 auto",
      padding: "28px",
    }}
  >
    <div className="mc-dashboard-command mc-seller-cabinet">
      <div className="mc-dashboard-command-copy mc-seller-identity">
        <div className="mc-seller-avatar">{dashboardInitial}</div>
        <div className="mc-seller-meta">
          <div className="mc-dashboard-kicker">MarketCard AI seller cabinet</div>
          <h1>Личный кабинет продавца</h1>
          <p>
            {dashboardName}, управляйте генерациями, тарифом, аудитами, AI-видео и экспортами для маркетплейсов в одном premium workspace.
          </p>
        </div>
      </div>

      <div className="mc-seller-cabinet-panel">
        <div className="mc-seller-metrics">
          <div>
            <span>Email</span>
            <strong>{accountEmailLabel}</strong>
          </div>
          <div>
            <span>Тариф</span>
            <strong>{profile?.tariff_name || "Start"}</strong>
          </div>
          <div>
            <span>Генерации</span>
            <strong>{dashboardLeft}/{dashboardTotal || 0}</strong>
          </div>
          <div>
            <span>Аудиты</span>
            <strong>{profile?.audit_credits ?? 0}</strong>
          </div>
        </div>

        <div className="mc-seller-actions">
          <button type="button" onClick={() => setShowTariffModal(true)}>
            Тарифы
          </button>
          <button type="button" onClick={handleSwitchAccount}>
            Сменить аккаунт
          </button>
          <button type="button" onClick={handleLogout}>
            Выйти
          </button>
          <button type="button" className="is-danger" onClick={handleAccountDeleteRequest}>
            Удалить аккаунт
          </button>
        </div>
      </div>
    </div>

    <div className="mc-dashboard-stats-grid">
      {dashboardStats.map((stat) => (
        <div key={stat.label} className={`mc-dashboard-stat-card mc-dashboard-stat-${stat.tone}`}>
          <div className="mc-dashboard-stat-top">
            <span>{stat.label}</span>
            <i />
          </div>
          <strong>{stat.value}</strong>
          <p>{stat.detail}</p>
        </div>
      ))}
    </div>

    <div className="mc-dashboard-quick-title">Быстрый старт</div>

    <div className="mc-dashboard-platform-map mc-dashboard-platform-map-primary" aria-label="Карта платформы">
      {platformMapItems.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={item.onClick}
          className={item.active ? `mc-dashboard-platform-card is-active tone-${item.tone}` : `mc-dashboard-platform-card tone-${item.tone}`}
        >
          <span>{item.metric}</span>
          <strong>{item.title}</strong>
          <small>{item.text}</small>
        </button>
      ))}
    </div>

    <div className="mc-dashboard-quick-tips">
      {dashboardTips.map((tip) => (
        <button
          key={tip.title}
          className={`mc-dashboard-tip-card mc-dashboard-tip-${tip.accent}`}
          type="button"
          onClick={() => setActivePage(tip.title === "SEO и аудит" ? "audit" : "generator")}
        >
          <span>{tip.title}</span>
          <p>{tip.text}</p>
        </button>
      ))}
    </div>

    <div className="mc-dashboard-credits-strip">
      <div>
        <span>Использование тарифа</span>
        <strong>{dashboardProgress}%</strong>
      </div>
      <div className="mc-dashboard-progress">
        <span style={{ width: `${dashboardProgress}%` }} />
      </div>
    </div>

    <div
      className="mc-dashboard-legacy-card"
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
                width: "48px",                borderRadius: "16px",
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
                  boxShadow: "0 20px 40px rgba(0,0,0,0.35)",                  zIndex: 1000,
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
        style={{          fontSize: "14px",
          color: "#fbbf24",
          fontWeight: 800,
        }}
      >
        ⚠️ {getTariffNote(lang)}
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
                  <div style={{ marginTop: "6px", color: "#22c55e", fontWeight: 800 }}>
                    Оценок карточек: {profile?.audit_credits ?? 0}
                  </div>
                  <div style={{ marginTop: "12px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button onClick={() => buyAudit("audit10")} style={{ padding: "10px 16px", borderRadius: "12px", background: "#22c55e", color: "#fff", border: "none", fontWeight: 900, cursor: "pointer" }}>
                      Купить 10 аудитов
                    </button>
                    <button onClick={() => buyAudit("audit30")} style={{ padding: "10px 16px", borderRadius: "12px", background: "#06b6d4", color: "#fff", border: "none", fontWeight: 900, cursor: "pointer" }}>
                      Купить 30 аудитов
                    </button>
                  </div>
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

    <div className="mc-dashboard-platform-map mc-dashboard-platform-map-secondary" aria-label="Карта платформы">
      {platformMapItems.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={item.onClick}
          className={item.active ? `mc-dashboard-platform-card is-active tone-${item.tone}` : `mc-dashboard-platform-card tone-${item.tone}`}
        >
          <span>{item.metric}</span>
          <strong>{item.title}</strong>
          <small>{item.text}</small>
        </button>
      ))}
    </div>

    <div className="mc-dashboard-workspace" data-page={activePage}>
    <div className="mc-dashboard-section-hero" data-section={activePage}>
      <div>
        <span>{dashboardSectionMeta[activePage].badge}</span>
        <h2>{dashboardSectionMeta[activePage].title}</h2>
        <p>{dashboardSectionMeta[activePage].subtitle}</p>
      </div>
      <div className="mc-dashboard-section-orbit" aria-hidden="true">
        <i />
        <b />
      </div>
    </div>

    {activePage === "video" && (
      <div className="mc-video-generator-v2">
        <div className="mc-video-v2-head">
          <div className="mc-video-v2-brand">
            <div className="mc-video-v2-icon">VI</div>
            <div>
              <h1>AI VIDEO</h1>
              <p>Генератор промо-роликов под 4 маркетплейса</p>
            </div>
          </div>
          <div className="mc-video-online-badge">
            <i />
            МОДЕЛЬ ОНЛАЙН
          </div>
        </div>

        <div className="mc-video-v2-grid">
          <div className="mc-video-v2-column">
            <section className="mc-video-v2-panel">
              <label className="mc-video-v2-label">Фото товара</label>
              <label
                className={previewUrl ? "mc-video-upload-zone has-image" : "mc-video-upload-zone"}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const file = e.dataTransfer.files?.[0] ?? null
                  if (file && file.type.startsWith("image/")) {
                    setSelectedFile(file)
                  }
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null
                    setSelectedFile(file)
                  }}
                />

                {previewUrl ? (
                  <img src={previewUrl} alt="Фото товара для видео" />
                ) : (
                  <div className="mc-video-upload-empty">
                    <span className="mc-video-upload-mark">UP</span>
                    <strong>Загрузите фото товара</strong>
                    <small>PNG, JPG, WEBP до 10MB</small>
                  </div>
                )}
              </label>
              <p className="mc-video-v2-help">
                ИИ использует фото как hero-object и собирает motion brief под выбранную площадку.
              </p>
            </section>

            <section className="mc-video-v2-panel">
              <div className="mc-video-section-row">
                <label className="mc-video-v2-label">Сценарий ролика</label>
                <button
                  type="button"
                  onClick={() =>
                    setVideoPrompt(
                      "Красивый 360° оборот товара, премиальная подсветка, динамичные переходы, крупные преимущества и финальный оффер для маркетплейса."
                    )
                  }
                >
                  AI подсказка
                </button>
              </div>
              <textarea
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                placeholder="Покажите товар с разных ракурсов, добавьте свечение, динамичные переходы и финальный оффер..."
                className="mc-video-scenario"
              />
            </section>

            <section className="mc-video-v2-panel">
              <label className="mc-video-v2-label">Стиль</label>
              <div className="mc-video-style-grid">
                {videoStyles.map((style) => (
                  <button
                    key={style.key}
                    type="button"
                    className={videoStyle === style.key ? "mc-video-style-btn is-active" : "mc-video-style-btn"}
                    onClick={() => setVideoStyle(style.key)}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="mc-video-v2-panel mc-video-free-panel">
              <div className="mc-video-section-row">
                <label className="mc-video-v2-label">Free video pipeline</label>
                <span>готово к API</span>
              </div>
              <div className="mc-video-provider-grid">
                {videoPipeline.map((item) => (
                  <div className="mc-video-provider-card" key={item.title}>
                    <strong>{item.title}</strong>
                    <small>{item.text}</small>
                    <button type="button" onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}>
                      Открыть сервис
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="mc-video-v2-preview-panel">
            <div className="mc-video-preview-top">
              <h3>Превью видео</h3>
              <div className="mc-video-selected-platform">
                <img src={activeVideoMarketplace.logo} alt={activeVideoMarketplace.label} />
                <span>{activeVideoMarketplace.label}</span>
              </div>
            </div>

            <div className={`mc-video-live-frame mc-video-live-${videoAspect.replace(":", "-")}`}>
              {previewUrl && (
                <div
                  className="mc-video-bg"
                  style={{ backgroundImage: `url(${previewUrl})` }}
                />
              )}

              <div className="mc-video-preview-product">
                {videoAssetUrl && videoAssetType === "video" ? (
                  <video src={videoAssetUrl} autoPlay loop muted playsInline controls />
                ) : videoAssetUrl ? (
                  <img src={videoAssetUrl} alt="Готовый AI video motion preview" />
                ) : previewUrl ? (
                  <img src={previewUrl} alt="Видео preview товара" />
                ) : (
                  <span>MC</span>
                )}
                <strong>{productTitle || "Premium product"}</strong>
                <small>{activeVideoMarketplace.caption}</small>
              </div>

              <div className="mc-video-frame-gradient" />
              <div className="mc-video-frame-track">
                <i />
                <i />
                <i />
              </div>

              {isVideoGenerating && (
                <div className="mc-video-render-state is-processing">
                  <span />
                  ГЕНЕРАЦИЯ...
                </div>
              )}
              {videoResultReady && (
                <div className="mc-video-render-state is-ready">
                  Видео поставлено в очередь
                </div>
              )}
            </div>

            <div className="mc-video-market-panel">
              <label className="mc-video-v2-label">Маркетплейс</label>
              <div className="mc-video-market-grid">
                {videoMarketplaces.map((market) => (
                  <button
                    key={market.key}
                    type="button"
                    className={videoMarketplace === market.key ? "mc-video-market-card is-active" : "mc-video-market-card"}
                    onClick={() => {
                      setVideoMarketplace(market.key)
                      setVideoAspect(market.format)
                    }}
                  >
                    <img className="mc-video-market-logo" src={market.logo} alt={market.label} />
                    <strong>{market.label}</strong>
                    <small>{market.format}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="mc-video-generate-footer">
              <button
                type="button"
                className="mc-video-v2-generate"
                onClick={handleVideoGenerate}
                disabled={isVideoGenerating}
              >
                <span>{isVideoGenerating ? "..." : "AI"}</span>
                {isVideoGenerating ? "СОЗДАЁМ ВИДЕО..." : "СОЗДАТЬ ВИДЕО ПО ФОТО"}
              </button>
              <p>~25 сек • 4K brief • адаптивно под Uzum, Wildberries, Ozon и Yandex Market</p>
            </div>
          </section>
        </div>
      </div>
    )}

    {activePage === "generator" && (
      <>
        <div className="mc-create-card-layout">
          <section className="mc-create-card-panel mc-create-card-controls">
            <div className="mc-create-kicker">AI CARD GENERATOR</div>
            <h2>Создать карточку товара</h2>
            <p className="mc-create-lead">
              Загрузи фото, добавь данные товара и выбери маркетплейс. MarketCard AI соберет премиальную карточку в стиле платформы.
            </p>

            <label
              className={selectedFile ? "mc-upload-dropzone has-file" : "mc-upload-dropzone"}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const file = e.dataTransfer.files?.[0] ?? null
                if (file && file.type.startsWith("image/")) {
                  setSelectedFile(file)
                }
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  setSelectedFile(file)
                }}
              />

              {previewUrl ? (
                <div className="mc-upload-preview-wrap">
                  <img src={previewUrl} alt="Preview" />
                  <div>
                    <strong>{selectedFile?.name || "Фото товара загружено"}</strong>
                    <span>Нажми или перетащи новое фото для замены</span>
                  </div>
                </div>
              ) : (
                <div className="mc-upload-empty-state">
                  <span className="mc-upload-icon">+</span>
                  <strong>Загрузить фото товара</strong>
                  <small>Перетащите фото сюда или нажмите для выбора файла</small>
                  <em>PNG, JPG, WEBP до 10 МБ</em>
                </div>
              )}
            </label>

            <div className={photoAnalyzing ? "mc-photo-ai-status is-loading" : "mc-photo-ai-status"}>
              <span>AI</span>
              <div>
                <strong>
                  {photoAnalyzing
                    ? "Распознаю товар по фото..."
                    : photoAnalyzeError
                      ? "Фото можно заполнить вручную"
                      : selectedFile
                        ? "Название и характеристики заполняются автоматически"
                        : "Загрузите фото, и AI сам определит товар"}
                </strong>
                <small>
                  {photoAnalyzeError || "Вам останется проверить результат и вписать бренд товара."}
                </small>
              </div>
            </div>

            <div className="mc-create-field mc-create-field-wide">
              <label>{t.titleLabel}</label>
              <input
                type="text"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder={t.titlePlaceholder}
              />
            </div>

            <div className="mc-create-two-fields">
              <div className="mc-create-field">
                <label>{t.brandLabel}</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="BRAVE"
                />
              </div>

              <div className="mc-create-field">
                <label>{t.categoryLabel}</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Автозапчасти"
                />
              </div>
            </div>

            <div className="mc-create-field mc-create-field-wide mc-create-characteristics-field">
              <label>Характеристики</label>
              <textarea
                value={productCharacteristics}
                onChange={(e) => setProductCharacteristics(e.target.value)}
                placeholder="AI заполнит: назначение, тип товара, визуальные преимущества, комплектацию..."
              />
            </div>

            <div className="mc-create-marketplaces">
              <span className="mc-create-section-label">Маркетплейс</span>
              <div className="mc-create-market-grid">
                {[
                  { key: "uzum" as const, logo: "/marketplaces-premium/uzum.png", note: "3:4 карточка" },
                  { key: "wildberries" as const, logo: "/marketplaces-premium/wildberries.png", note: "WB-ready" },
                  { key: "ozon" as const, logo: "/marketplaces-premium/ozon.png", note: "Ozon feed" },
                  { key: "yandex" as const, logo: "/marketplaces-premium/yandex.png", note: "1:1 витрина" },
                ].map((market) => (
                  <div className="mc-market-tile-wrap" key={market.key}>
                    <MarketplaceButton
                      label={marketplaceFormats[market.key].label}
                      selected={selectedMarketplace === market.key}
                      gradient={marketplaceFormats[market.key].gradient}
                      logoSrc={market.logo}
                      onClick={() => setSelectedMarketplace(market.key)}
                    />
                    <small>{market.note}</small>
                  </div>
                ))}
              </div>
            </div>

            <div className="mc-create-options-grid">
              <div className="mc-create-option-box">
                <span>Язык</span>
                <div className="mc-create-chip-row">
                  <button type="button" className={languageMode === "ru" ? "mc-create-chip is-active" : "mc-create-chip"} onClick={() => setLanguageMode("ru")}>
                    RU
                  </button>
                  <button type="button" className={languageMode === "uz" ? "mc-create-chip is-active" : "mc-create-chip"} onClick={() => setLanguageMode("uz")}>
                    UZ
                  </button>
                  <button type="button" className={languageMode === "both" ? "mc-create-chip is-active" : "mc-create-chip"} onClick={() => setLanguageMode("both")}>
                    RU + UZ
                  </button>
                </div>
              </div>

              <div className="mc-create-option-box">
                <span>Варианты</span>
                <select value={variantCount} onChange={(e) => setVariantCount(Number(e.target.value))}>
                  <option value={1}>1</option>
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                </select>
              </div>

              <div className="mc-create-option-box mc-create-format-box">
                <span>Формат</span>
                <strong>
                  {currentFormat.width} x {currentFormat.height}
                </strong>
                <small>{currentFormat.label} • {currentFormat.ratio}</small>
              </div>
            </div>

            <button
              type="button"
              className="mc-create-generate-button"
              onClick={handleGenerate}
              disabled={creating}
            >
              <span>AI</span>
              {creating ? "ГЕНЕРАЦИЯ..." : "СГЕНЕРИРОВАТЬ"}
            </button>

            <div className="mc-create-support-row">
              <button type="button" onClick={handleDownloadPng} disabled={!pngReady}>
                Скачать PNG
              </button>
              <a href="https://t.me/marketcardai_support_bot" target="_blank" rel="noreferrer">
                Поддержка Telegram
              </a>
              {pngReady && <span>PNG готов</span>}
            </div>
          </section>

          <section className="mc-create-card-panel mc-create-results-panel-v2">
            <div className="mc-create-results-head">
              <div>
                <span>RESULTS</span>
                <h2>Готовые варианты</h2>
              </div>
              <small>{generatedVariants.length || 0} создано</small>
            </div>

            {(ikpuLoading || ikpuResults.length > 0) && (
              <div className="mc-create-ikpu-strip">
                <div className="mc-create-ikpu-orb">IK</div>
                <div className="mc-create-ikpu-main">
                  <span>IKPU / SOLIQ</span>
                  <strong>
                    {ikpuLoading
                      ? "Ищем правильный код..."
                      : ikpuResults[0]?.code || "Код нужно уточнить"}
                  </strong>
                  <p>
                    {ikpuLoading
                      ? "Система автоматически сверяет товар с классификатором Soliq."
                      : ikpuResults[0]?.name || "Откройте раздел ИКПУ для дополнительного поиска."}
                  </p>
                </div>
                <button type="button" onClick={() => selectDashboardPage("ikpu")}>
                  Проверить
                </button>
              </div>
            )}

            {isGenerating ? (
              <div className="mc-create-results-stage is-loading">
                <div className="mc-spin-loader" />
                <strong>Идет генерация карточек</strong>
                <span>Среднее время ожидания: 3-5 минут, зависит от количества изображений.</span>
              </div>
            ) : generatedVariants.length === 0 ? (
              <div className="mc-create-results-stage">
                <div className="mc-result-ghost-grid">
                  <i />
                  <i />
                </div>
                <strong>Здесь появятся готовые карточки</strong>
                <span>После генерации варианты будут показаны в виде премиальных карточек с быстрым доступом к PNG.</span>
              </div>
            ) : (
              <div className="mc-create-results-grid">
                {generatedVariants.map((url: string, index: number) => {
                  const imageSrc = url.startsWith("/generated_cards") ? `/api${url}` : url

                  return (
                    <article className="mc-create-result-card" key={`${url}-${index}`}>
                      <img src={imageSrc} alt={`variant-${index + 1}`} />
                      <div>
                        <p>{productTitle || "Карточка товара"}</p>
                        <span>{brand || "Brand"} • {category || currentFormat.label}</span>
                        <div>
                          <em>{index === 0 ? "Бестселлер" : "Премиум"}</em>
                          <a href={imageSrc} target="_blank" rel="noreferrer">
                            Открыть PNG
                          </a>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        </div>

        <section className="mc-create-card-panel mc-create-correction-panel">
          <div className="mc-correction-title">
            <span>EDIT</span>
            <h2>Исправить изображение</h2>
          </div>

          <div className="mc-correction-grid-v2">
            <div className="mc-correction-controls">
              <p>Напишите, что нужно изменить:</p>

              <div className="mc-correction-variant-row">
                {generatedVariants.length > 0 ? (
                  generatedVariants.map((_, index) => (
                    <button
                      type="button"
                      key={index}
                      className={selectedFixIndex === index ? "is-active" : ""}
                      onClick={() => setSelectedFixIndex(index)}
                    >
                      Фото {index + 1}
                    </button>
                  ))
                ) : (
                  <span>Сначала сгенерируйте карточку</span>
                )}
              </div>

              <textarea
                className="fix-prompt-textarea"
                value={fixPrompt}
                onChange={(e) => setFixPrompt(e.target.value)}
                placeholder="Например: Сделай фон светлее, добавь тень под товар, измени текст на 'Скидка 30%'"
              />

              <div className="mc-correction-actions">
                <button type="button" onClick={handleFixGeneratedImage} disabled={isFixingImage || generatedVariants.length === 0}>
                  {isFixingImage ? "Исправление..." : "Применить исправление"}
                </button>

                {fixedImages[selectedFixIndex] ? (
                  <a href={fixedImages[selectedFixIndex]} download={`fixed_image_${selectedFixIndex + 1}.png`} target="_blank" rel="noreferrer">
                    Скачать PNG
                  </a>
                ) : null}
              </div>
            </div>

            <div className="mc-correction-preview-v2">
              {isFixingImage ? (
                <div className="mc-create-results-stage is-loading">
                  <div className="mc-spin-loader" />
                  <strong>Исправляем изображение</strong>
                  <span>AI применяет правки к выбранному варианту.</span>
                </div>
              ) : (fixedImages[selectedFixIndex] || generatedVariants[selectedFixIndex]) ? (
                <img
                  src={fixedImages[selectedFixIndex] || generatedVariants[selectedFixIndex]}
                  alt="Предпросмотр изображения"
                />
              ) : (
                <div className="mc-correction-empty">
                  <strong>Здесь появится исправленная версия</strong>
                  <span>Выберите вариант и опишите правку.</span>
                </div>
              )}
            </div>
          </div>
        </section>
      </>
    )}

    {false && activePage === "generator" && (
      <div
        className="mc-generator-studio-grid"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "440px 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div
          className="mc-generator-control-panel"
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

          <div className="mc-create-card-form" style={{ display: "grid", gap: "18px" }}>
            <div className="mc-generator-upload-field">
              <div className="mc-generator-field-caption">{t.uploadPhoto}</div>
              <label
                className="mc-generator-upload-zone"
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
                      ? `${t.selectedFile}: ${selectedFile?.name || ""}`
                      : t.noFile}
                  </div>
                </div>
              </label>
            </div>

            <div className="mc-generator-live-preview">
              <div
                style={{
                  width: "100%",                  borderRadius: "18px",
                  border: "1px dashed rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.04)",                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      width: "100%",                      objectFit: "contain",
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

            <div className="mc-generator-floating-field mc-generator-title-field">
              <label>{t.titleLabel}</label>
              <input
                type="text"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder={t.titlePlaceholder}
                style={inputStyle}
              />
            </div>

            <div className="mc-generator-two-col">
              <div className="mc-generator-floating-field">
                <label>{t.brandLabel}</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder={t.brandPlaceholder}
                  style={inputStyle}
                />
              </div>

              <div className="mc-generator-floating-field">
                <label>{t.categoryLabel}</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder={t.categoryPlaceholder}
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="mc-marketplace-selector">
              <div className="mc-generator-field-caption">{t.chooseMarketplace}</div>
              <div className="mc-marketplace-logo-grid" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <MarketplaceButton
                  label={marketplaceFormats.uzum.label}
                  selected={selectedMarketplace === "uzum"}
                  gradient={marketplaceFormats.uzum.gradient}
                  logoSrc="/marketplaces-premium/uzum.png"
                  onClick={() => setSelectedMarketplace("uzum")}
                />
                <MarketplaceButton
                  label={marketplaceFormats.wildberries.label}
                  selected={selectedMarketplace === "wildberries"}
                  gradient={marketplaceFormats.wildberries.gradient}
                  logoSrc="/marketplaces-premium/wildberries.png"
                  onClick={() => setSelectedMarketplace("wildberries")}
                />
                <MarketplaceButton
                  label={marketplaceFormats.ozon.label}
                  selected={selectedMarketplace === "ozon"}
                  gradient={marketplaceFormats.ozon.gradient}
                  logoSrc="/marketplaces-premium/ozon.png"
                  onClick={() => setSelectedMarketplace("ozon")}
                />
                <MarketplaceButton
                  label={marketplaceFormats.yandex.label}
                  selected={selectedMarketplace === "yandex"}
                  gradient={marketplaceFormats.yandex.gradient}
                  logoSrc="/marketplaces-premium/yandex.png"
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
                className="mc-generate-hero-button"
                onClick={handleGenerate}
                disabled={creating}
                style={primaryButtonStyle(creating)}
              >
                {creating ? t.generating : t.aiGenerate}
              </button>

              <button
                className="mc-download-soft-button"
                onClick={handleDownloadPng}
                disabled={!pngReady}
                style={secondaryButtonStyle(!pngReady)}
              >
                {t.downloadPng}
              </button>
            <a
  className="mc-telegram-soft-button"
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
          className="mc-generator-results-panel"
          style={{
            display: "grid",
            gap: "20px",
          }}
        >
          <div
            className="mc-results-shell"
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
      border: "1px dashed rgba(34,211,238,0.35)",
      background: "radial-gradient(circle at center, rgba(34,211,238,0.16), rgba(255,255,255,0.03) 55%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#ffffff",
      textAlign: "center",
      padding: "26px",
      flexDirection: "column",
      gap: "14px",
    }}
  >
    
    <div
      className="mc-spin-loader"
      style={{
        width: "46px",
        height: "46px",
        border: "4px solid rgba(34,211,238,0.25)",
        borderTop: "4px solid #22d3ee",
        borderRadius: "50%",
        
        boxShadow: "0 0 28px rgba(34,211,238,0.35)",
      }}
    />
    <div style={{ fontSize: "22px", fontWeight: 900 }}>
      Идёт генерация карточек
    </div>
    <div style={{ fontSize: "16px", fontWeight: 700, color: "rgba(255,255,255,0.78)", maxWidth: "520px" }}>
      Пожалуйста, подождите. Среднее время ожидания: 3–5 минут, зависит от количества изображений.
    </div>
  </div>
) : generatedVariants.length === 0 ? (
              <div
                className="mc-results-empty"
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
                className="mc-results-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "18px",
                }}
              >
                {generatedVariants.map((url: string, index: number) => (
                  <div
                    className="mc-generated-card-preview"
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


      {false && activePage === "generator" && (
<div
        className="mc-fix-lab"
        style={{
          marginTop: "24px",
          marginBottom: "0",
          marginLeft: "0",
          width: "100%",
          padding: "20px",
          borderRadius: "24px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 18px 45px rgba(0,0,0,0.28)",
          backdropFilter: "blur(12px)",
          boxSizing: "border-box",        }}
      >
        <div
          style={{
                      fontSize: "26px",
            fontWeight: 900,
            marginBottom: "18px",
          }}
        >
          Исправление изображения
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "14px",
          }}
        >
          {generatedVariants.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedFixIndex(index)}
              style={{
                border: "none",
                borderRadius: "12px",
                padding: "10px 14px",
                background:
                  selectedFixIndex === index
                    ? "linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)"
                    : "rgba(255,255,255,0.08)",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "14px",
                cursor: "pointer",
                boxShadow:
                  selectedFixIndex === index
                    ? "0 10px 24px rgba(34,211,238,0.22)"
                    : "none",
              }}
            >
              Фото {index + 1}
            </button>
          ))}
        </div>

        <div
          style={{
            minHeight: "320px",
            borderRadius: "20px",
            border: "1px dashed rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.03)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "18px",
            color: "rgba(255,255,255,0.72)",
            fontSize: "22px",
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          {isFixingImage ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "14px",
                color: "#ffffff",
                textAlign: "center",
                padding: "24px",
              }}
            >
              <div
                className="mc-spin-loader"
                style={{
                  width: "46px",
                  height: "46px",
                  border: "4px solid rgba(34,211,238,0.25)",
                  borderTop: "4px solid #22d3ee",
                  borderRadius: "50%",
                  boxShadow: "0 0 28px rgba(34,211,238,0.35)",
                }}
              />
              <div style={{ fontSize: "22px", fontWeight: 900 }}>
                Идёт исправление изображения
              </div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "rgba(255,255,255,0.78)", maxWidth: "520px" }}>
                Пожалуйста, подождите. Среднее время ожидания исправления: около 2 минут.
              </div>
            </div>
          ) : (fixedImages[selectedFixIndex] || generatedVariants[selectedFixIndex]) ? (
            <img
              src={fixedImages[selectedFixIndex] || generatedVariants[selectedFixIndex]}
              alt="Предпросмотр изображения"
              style={{
                width: "auto",
                height: "auto",
                maxWidth: "90%",
                maxHeight: "520px",
                objectFit: "contain",
                borderRadius: "14px",
                display: "block",
                boxShadow: "0 18px 45px rgba(0,0,0,0.28)",
              }}
            />
          ) : (
            <span>Тут появится исправленная версия</span>
          )}
        </div>

        <div
          style={{
            marginTop: "16px",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 260px",
            gap: "12px",
            alignItems: "stretch",
          }}
        >
          <textarea className="fix-prompt-textarea"
            value={fixPrompt}
            onChange={(e) => setFixPrompt(e.target.value)}
            placeholder="Напишите, что нужно изменить"
            style={{
                  resize: "none",
                  overflow: "hidden",
                  overflowY: "hidden",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  boxSizing: "border-box",
                                                  minHeight: "74px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.05)",
              color: "#ffffff",
              padding: "14px 16px",
                            outline: "none",
              fontSize: "15px",
            }}
          />

          <button
            onClick={handleFixGeneratedImage}
            disabled={isFixingImage}
            style={{
              border: "none",
              borderRadius: "16px",
              background: isFixingImage
                ? "rgba(34,211,238,0.45)"
                : "linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)",
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "18px",
              cursor: isFixingImage ? "not-allowed" : "pointer",
              boxShadow: "0 10px 24px rgba(34,211,238,0.22)",
              opacity: isFixingImage ? 0.7 : 1,
              padding: "0 20px",
            }}
          >
            {isFixingImage ? "Исправление..." : "Исправить ошибки генерации"}
          </button>

          {fixedImages[selectedFixIndex] ? (
            <a
              href={fixedImages[selectedFixIndex]}
              download={`fixed_image_${selectedFixIndex + 1}.png`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #facc15 0%, #eab308 100%)",
                color: "#ffffff",
                fontWeight: 900,
                fontSize: "18px",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.14)",
                padding: "0 20px",
              }}
            >
              Скачать PNG
            </a>
          ) : null}
        </div>
      </div>

    
)}



{activePage === "listing" && (
  <div className="mc-listing-suite" style={{ maxWidth: "1180px", padding: "28px", borderRadius: "24px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", boxShadow: "0 18px 45px rgba(0,0,0,0.28)", backdropFilter: "blur(14px)" }}>
    <div style={{ fontSize: "34px", fontWeight: 900, marginBottom: "18px" }}>
      SEO / Описание товара

<div style={{ display: "flex", gap: "10px", marginTop: "10px", marginBottom: "20px" }}>
  <button
    onClick={() => setListingLang("ru")}
    style={{
      padding: "8px 16px",
      borderRadius: "999px",
      background: listingLang === "ru" ? "#22c55e" : "#1e293b",
      color: "#fff",
      fontWeight: 700,
      border: "none",
      cursor: "pointer"
    }}
  >
    RU
  </button>

  <button
    onClick={translateListingToUz}
    style={{
      padding: "8px 16px",
      borderRadius: "999px",
      background: listingLang === "uz" ? "#22c55e" : "#1e293b",
      color: "#fff",
      fontWeight: 700,
      border: "none",
      cursor: "pointer"
    }}
  >
    UZ
  </button>
</div>

    </div>

    {!listingData ? (
      <div style={{ fontSize: "20px", color: "#cbd5e1" }}>
        {t.listingEmpty}<br />{t.listingHint}
      </div>
    ) : (() => {
      const textValue = (v: any) => {
        if (v === null || v === undefined) return "—"
        if (typeof v === "string") return v
        if (typeof v === "number") return String(v)
        if (Array.isArray(v)) return v.join(", ")
        return JSON.stringify(v)
      }

      let d: any = listingData
if (listingLang === "uz" && translatedListing) {
  d = {
    ...listingData,
    ...translatedListing
  }
}

      let title = "—"
      if (d.title) title = d.title

      let shortDesc = "—"
      if (d.short_description) shortDesc = d.short_description

      let fullDesc = "—"
      if (d.full_description) fullDesc = d.full_description

      let features: any[] = []
      if (Array.isArray(d.characteristics) && d.characteristics.length > 0) {
        features = d.characteristics
      }

      return (
        <div style={{ display: "grid", gap: "18px" }}>
          {[
            { label: "Название", limit: 90, value: title },
            { label: "Краткое описание", limit: 390, value: shortDesc },
            { label: "Полное описание", limit: 5000, value: fullDesc },
          ].map((field: any) => (
            <div key={field.label} style={{ padding: "16px", borderRadius: "18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}>
              <div style={{ fontSize: "14px", color: "#67e8f9", fontWeight: 900, marginBottom: "8px" }}>
                {field.label} ({String(textValue(field.value)).length}/{field.limit})
              </div>
              <div style={{ padding: "12px", borderRadius: "14px", background: "rgba(15,23,42,0.55)", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
                {textValue(field.value)}
              </div>
            </div>
          ))}

          <div style={{ padding: "16px", borderRadius: "18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <div style={{ fontSize: "16px", color: "#67e8f9", fontWeight: 900, marginBottom: "10px" }}>
              Свойства товара — 5 полей
            </div>
            {[0,1,2,3,4].map((i) => (
              <div key={i} style={{ marginBottom: "8px", padding: "10px", borderRadius: "12px", background: "rgba(15,23,42,0.55)" }}>
                {i + 1}. {features[i] ? (typeof features[i] === "string" ? features[i] : `${features[i]?.key || "—"}: ${features[i]?.value || "—"}`) : "—"}
              </div>
            ))}
          </div>
        </div>
      )
    })()}
  

</div>
)}

{activePage === "ikpu" && (
  <div className="mc-tool-suite">
    <div className="mc-tool-hero">
      <span>SOLIQ / TASNIF</span>
      <h2>Автоподбор ИКПУ</h2>
      <p>
        Введите название товара или используйте данные последней генерации. Backend ищет в локальном кеше,
        затем дергает Soliq parser, сохраняет найденные коды и ранжирует варианты.
      </p>
    </div>

    <div className="mc-tool-search">
      <input
        value={ikpuQuery}
        onChange={(event) => setIkpuQuery(event.target.value)}
        placeholder="Например: насос ГУР Cobalt, беспроводные наушники, аромат для дома"
      />
      <button type="button" onClick={searchIkpu} disabled={ikpuLoading}>
        {ikpuLoading ? "Поиск..." : "Найти ИКПУ"}
      </button>
      <button
        type="button"
        onClick={() => {
          const query = `${productTitle} ${brand} ${category}`.trim()
          setIkpuQuery(query)
          void searchIkpuAuto(query)
        }}
      >
        Подобрать по карточке
      </button>
    </div>

    <div className="mc-ikpu-results">
      {ikpuResults.length ? (
        ikpuResults.map((item: any, index: number) => (
          <div className="mc-ikpu-row" key={`${item.code || index}-${index}`}>
            <div>
              <span>#{index + 1} / {item.source || "parser"}</span>
              <strong>{item.code || "Код не найден"}</strong>
              <p>{item.name}</p>
            </div>
            <button type="button" onClick={() => navigator.clipboard.writeText(item.code || "")}>
              Скопировать
            </button>
          </div>
        ))
      ) : (
        <div className="mc-tool-empty">
          <strong>ИКПУ появится здесь</strong>
          <p>После генерации карточки раздел подсветится и покажет подходящие коды автоматически.</p>
        </div>
      )}
    </div>
  </div>
)}

{activePage === "purchase" && (
  <div className="mc-tool-suite">
    <div className="mc-tool-hero">
      <span>SOURCING</span>
      <h2>Закуп товара</h2>
      <p>Площадки для закупа, фабрики, карго и быстрый расчет входной цены. Сюда позже подключаются API поставщиков и карго.</p>
    </div>
    <div className="mc-tool-grid">
      {[
        ["1688", "Китайский опт и фабрики", "https://www.1688.com", "CN"],
        ["Alibaba", "Международные поставщики", "https://www.alibaba.com", "AL"],
        ["Taobao", "Тренды и розничный Китай", "https://world.taobao.com", "TB"],
        ["Made-in-China", "Фабрики и производство", "https://www.made-in-china.com", "MC"],
        ["Global Sources", "B2B поставщики", "https://www.globalsources.com", "GS"],
        ["DHgate", "Мелкий опт", "https://www.dhgate.com", "DH"],
      ].map(([title, text, url, logo]) => (
        <button className="mc-tool-card" key={title} type="button" onClick={() => window.open(url, "_blank", "noopener,noreferrer")}>
          <span className="mc-market-logo-badge">{logo}</span>
          <strong>{title}</strong>
          <p>{text}</p>
        </button>
      ))}
    </div>
    <div className="mc-tool-actions">
      <button type="button" onClick={openSourcingLinks}>Открыть все источники</button>
      <button type="button" onClick={() => selectDashboardPage("economy")}>Посчитать входную цену</button>
    </div>
  </div>
)}

{activePage === "didox" && (
  <div className="mc-tool-suite">
    <div className="mc-tool-hero">
      <span>DIDOX / ЭДО</span>
      <h2>Документы продавца</h2>
      <p>Раздел готов под API DIDOX: счета, акты, накладные, статусы подписи и привязка документов к товарам.</p>
    </div>
    <div className="mc-tool-grid">
      {[
        ["Счета", "Создание и контроль счетов по заказам", "Готово к API"],
        ["Акты", "Шаблоны актов и статусы подписания", "DIDOX"],
        ["Накладные", "Документы поставок и закупа", "ЭДО"],
        ["Проверка", "Контроль ИНН, компании и статуса", "KYC"],
      ].map(([title, text, tag]) => (
        <div className="mc-tool-card" key={title}>
          <span className="mc-market-logo-badge">{tag.slice(0, 2)}</span>
          <strong>{title}</strong>
          <p>{text}</p>
          <small>{tag}</small>
        </div>
      ))}
    </div>
    <div className="mc-tool-actions">
      <button type="button" onClick={() => window.open("https://didox.uz", "_blank", "noopener,noreferrer")}>Открыть DIDOX</button>
      <button type="button" onClick={() => alert("Добавьте DIDOX_CLIENT_ID и DIDOX_CLIENT_SECRET в backend/.env")}>Проверить API ключи</button>
    </div>
  </div>
)}

{activePage === "deficit" && (
  <div className="mc-tool-suite">
    <div className="mc-tool-hero">
      <span>4 MARKETPLACES</span>
      <h2>Дефицит товаров</h2>
      <p>Поиск ниш, где спрос есть, а карточки слабые или товаров мало. Поддержка Uzum, Wildberries, Ozon и Yandex Market.</p>
    </div>
    <div className="mc-tool-grid">
      {[
        ["Uzum", "Локальный спрос и дефицит категорий", "UZ"],
        ["Wildberries", "Слабые карточки и высокий спрос", "WB"],
        ["Ozon", "Пробелы ассортимента и цены", "OZ"],
        ["Yandex Market", "Категории и товарные разрывы", "YA"],
      ].map(([title, text, logo]) => (
        <div className="mc-tool-card" key={title}>
          <span className="mc-market-logo-badge">{logo}</span>
          <strong>{title}</strong>
          <p>{text}</p>
          <small><i className="mc-status-dot" /> parser ready</small>
        </div>
      ))}
    </div>
    <div className="mc-tool-actions">
      <button type="button" onClick={openDeficitProductsAllMarketplaces}>Собрать дефицит по 4 площадкам</button>
      <button type="button" onClick={openDeficitProducts}>Быстрый Uzum отчет</button>
    </div>
  </div>
)}

{activePage === "instructions" && (
  <div className="mc-tool-suite">
    <div className="mc-tool-hero">
      <span>LIVE RULES</span>
      <h2>Инструкции маркетплейсов</h2>
      <p>Центр правил для продавцов: требования к изображениям, SEO, запрещенные слова, документы и форматы.</p>
    </div>
    <div className="mc-tool-grid">
      {[
        ["Uzum", "Фото, характеристики, ИКПУ и локальные требования", "UZ"],
        ["Wildberries", "Инфографика, SEO, размеры и контент-риск", "WB"],
        ["Ozon", "Медиа, описание, rich-content и модерация", "OZ"],
        ["Yandex Market", "Фиды, изображения, документы и категории", "YA"],
      ].map(([title, text, logo]) => (
        <div className="mc-tool-card" key={title}>
          <span className="mc-market-logo-badge">{logo}</span>
          <strong>{title}</strong>
          <p>{text}</p>
          <small>обновление через parser/cron</small>
        </div>
      ))}
    </div>
  </div>
)}

{activePage === "audit" && (
  <>
  <CardAuditPanel />
  
</>

)}


{activePage === "intelligence" && (
  <ProductIntelligencePanel />
)}

{activePage === "economy" && (
      <div className="mc-economy-command">
        <div className="mc-economy-hero">
          <div>
            <span className="mc-economy-kicker">Profit cockpit</span>
            <h2>Юнит-экономика продавца</h2>
            <p>
              Считай реальную прибыль после закупки, комиссий, рекламы, налогов,
              логистики, возвратов и фиксированных расходов. Не валовая маржа,
              а честный contribution margin.
            </p>
          </div>
          <div className={unit.contributionProfit > 0 ? "mc-economy-health is-good" : "mc-economy-health is-risk"}>
            <span>{unit.contributionProfit > 0 ? "PROFIT" : "RISK"}</span>
            <strong>{formatMoney(unit.contributionProfit, lang)} сум</strong>
            <small>прибыль с 1 продажи</small>
          </div>
        </div>

        <div className="mc-economy-metrics">
          {[
            ["Цена продажи", `${formatMoney(unit.sellingPriceNum, lang)} сум`, "текущая цена"],
            ["Чистая маржа", `${unit.contributionMargin.toFixed(1)}%`, "после всех переменных расходов"],
            ["ROI", `${unit.roi.toFixed(1)}%`, "прибыль / true cost"],
            ["Break-even", `${formatMoney(unit.breakEven, lang)} сум`, "минимальная цена"],
            ["Max ACOS", `${unit.maxAcos.toFixed(1)}%`, "порог рекламы"],
            ["План прибыли", `${formatMoney(unit.profitPlan, lang)} сум`, `${plannedUnits} шт.`],
          ].map(([label, value, note]) => (
            <div className="mc-economy-metric" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <small>{note}</small>
            </div>
          ))}
        </div>

        <div className="mc-economy-grid">
          <div className="mc-economy-panel">
            <div className="mc-economy-panel-head">
              <span>01</span>
              <div>
                <h3>Вводные по товару</h3>
                <p>Закупка, курс, логистика, упаковка и склад.</p>
              </div>
            </div>
            <div className="mc-economy-input-grid">
              {[
                ["Закупка, $", purchaseUsd, setPurchaseUsd],
                ["Курс USD", usdRate, setUsdRate],
                ["Логистика МП", fulfillmentLogistics, setFulfillmentLogistics],
                ["Локальная логистика", localLogistics, setLocalLogistics],
                ["Упаковка", packaging, setPackaging],
                ["Хранение / шт.", storagePerUnit, setStoragePerUnit],
                ["Прочие расходы", otherCosts, setOtherCosts],
                ["План продаж, шт.", plannedUnits, setPlannedUnits],
              ].map(([label, value, setter]) => (
                <label className="mc-economy-field" key={String(label)}>
                  <span>{String(label)}</span>
                  <input value={String(value)} onChange={(event) => (setter as (value: string) => void)(event.target.value)} />
                </label>
              ))}
            </div>
          </div>

          <div className="mc-economy-panel">
            <div className="mc-economy-panel-head">
              <span>02</span>
              <div>
                <h3>Маркетплейс и риск</h3>
                <p>Комиссии, реклама, возвраты, налоги и платежи.</p>
              </div>
            </div>
            <div className="mc-economy-input-grid">
              {[
                ["Цена продажи", sellingPrice, setSellingPrice],
                ["Цена конкурентов", competitorPrice, setCompetitorPrice],
                ["Комиссия МП, %", commissionPercent, setCommissionPercent],
                ["Реклама / ACOS, %", adCostPercent, setAdCostPercent],
                ["Налог, %", taxPercent, setTaxPercent],
                ["Эквайринг, %", paymentFeePercent, setPaymentFeePercent],
                ["Возвраты, %", returnRatePercent, setReturnRatePercent],
                ["Стоимость возврата", returnCost, setReturnCost],
                ["Фикс. расходы / мес", monthlyFixedCosts, setMonthlyFixedCosts],
                ["Желаемая прибыль / шт.", desiredProfit, setDesiredProfit],
              ].map(([label, value, setter]) => (
                <label className="mc-economy-field" key={String(label)}>
                  <span>{String(label)}</span>
                  <input value={String(value)} onChange={(event) => (setter as (value: string) => void)(event.target.value)} />
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mc-economy-breakdown">
          <div className="mc-economy-panel">
            <div className="mc-economy-panel-head">
              <span>03</span>
              <div>
                <h3>Структура себестоимости</h3>
                <p>True cost на одну продажу.</p>
              </div>
            </div>
            {[
              ["Закупка в сумах", unit.purchaseCostUzs],
              ["Операционные расходы", unit.totalCost - unit.purchaseCostUzs],
              ["Резерв на возвраты", unit.returnReserve],
              ["Фиксированные на 1 шт.", unit.fixedPerUnit],
              ["Итого true cost", unit.trueUnitCost],
            ].map(([label, value]) => (
              <SummaryLine key={String(label)} label={String(label)} value={`${formatMoney(Number(value), lang)} сум`} />
            ))}
          </div>

          <div className="mc-economy-panel">
            <div className="mc-economy-panel-head">
              <span>04</span>
              <div>
                <h3>Сценарии цены</h3>
                <p>Быстро выбери стратегию запуска.</p>
              </div>
            </div>
            <div className="mc-economy-scenarios">
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
          </div>
        </div>

        <div className="mc-economy-advice">
          <div>
            <strong>Рекомендация MarketCard AI</strong>
            <p>
              {unit.safetyGap >= 0
                ? `Цена выше break-even на ${formatMoney(unit.safetyGap, lang)} сум. Можно тестировать рекламу до ACOS ${unit.maxAcos.toFixed(1)}%.`
                : `Цена ниже break-even на ${formatMoney(Math.abs(unit.safetyGap), lang)} сум. Подними цену, снизь комиссию/логистику или уменьши рекламный ACOS.`}
            </p>
          </div>
          <div>
            <strong>Break-even объем</strong>
            <p>
              {unit.breakEvenUnits > 0
                ? `${unit.breakEvenUnits} продаж, оборот ${formatMoney(unit.breakEvenRevenue, lang)} сум для покрытия фиксированных расходов.`
                : "При текущей цене contribution margin отрицательная, точка безубыточности недостижима."}
            </p>
          </div>
        </div>
      </div>
    )}
    </div>
  </div>
</section>
</div>
  <ABCFloatingAnalysis />
</main>

{showTariffModal && (
  <div
    className="mc-modal-shell mc-tariff-modal-shell"
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
      className="mc-modal-card mc-tariff-modal-card"
      style={{
        width: "100%",
        maxWidth: isMobile ? "94vw" : "1040px",
        maxHeight: isMobile ? "88vh" : "none",
        overflowY: isMobile ? "auto" : "visible",
        borderRadius: isMobile ? "20px" : "28px",
        background: "#0f172a",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
        padding: isMobile ? "16px" : "28px",
        color: "white",
      }}
    >
      <div
        className="mc-modal-head"
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: isMobile ? "24px" : "34px", fontWeight: 900 }}>
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
        className="mc-tariff-grid"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
          gap: isMobile ? "12px" : "18px",
        }}
      >
        {(Object.keys(tariffs) as TariffName[]).map((tariff) => {
          const item = tariffs[tariff]
          const isSelected = selectedTariff === tariff

          return (
            <button
              className={isSelected ? "mc-tariff-card is-selected" : "mc-tariff-card"}
              key={tariff}
              onClick={() => setSelectedTariff(tariff)}
              style={{
                textAlign: "left",
                padding: isMobile ? "16px" : "24px",
                borderRadius: isMobile ? "18px" : "22px",
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
                  fontSize: isMobile ? "25px" : "34px",
                  fontWeight: 900,
                  marginBottom: "10px",
                }}
              >
                {tariff}
              </div>

              <div
                style={{
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: 800,
                  marginBottom: "10px",
                }}
              >
                {item.price}
              </div>

              <div style={{ fontSize: isMobile ? "15px" : "17px", marginBottom: "8px" }}>
                {item.generations} генераций
              <div style={{ marginTop: "10px", display: "grid", gap: "6px" }}>
                {getTariffFeatureLines(tariff, lang).map((line) => (
                  <div key={line} style={{ fontSize: "14px", fontWeight: 700 }}>
                    • {line}
                  </div>
                ))}
              </div>
              </div>

              <div style={{ fontSize: isMobile ? "14px" : "15px", opacity: 0.95 }}>
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
          justifyContent: isMobile ? "stretch" : "flex-end",
        }}
      >
        <button
          className="mc-modal-primary"
          onClick={() => {
            setShowTariffModal(false)
            setShowPaymentModal(true)
          }}
          disabled={activatingTariff}
          style={{
            width: isMobile ? "100%" : "auto",
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
    className="mc-modal-shell mc-payment-modal-shell"
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
      className="mc-modal-card mc-payment-modal-card"
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
          className={selectedPayment === "payme" ? "mc-payment-card is-selected" : "mc-payment-card"}
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
  className={selectedPayment === "visa" ? "mc-payment-card is-selected" : "mc-payment-card"}
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
          className={selectedPayment === "click" ? "mc-payment-card is-selected" : "mc-payment-card"}
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
          className="mc-modal-primary"
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

  <SupportWidget />

  </>
)}

