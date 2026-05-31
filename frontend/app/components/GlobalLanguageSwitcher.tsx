"use client"

import { useEffect, useState } from "react"

type Lang = "ru" | "uz" | "en"

declare global {
  interface Window {
    google?: any
    googleTranslateElementInit?: () => void
  }
}

const labels: Record<Lang, string> = {
  ru: "RU",
  uz: "UZ",
  en: "EN",
}

export default function GlobalLanguageSwitcher() {
  const [lang, setLang] = useState<Lang>("ru")

  useEffect(() => {
    const saved = window.localStorage.getItem("marketcard_lang") as Lang | null
    const initial = saved && ["ru", "uz", "en"].includes(saved) ? saved : "ru"
    setLang(initial)
    document.documentElement.lang = initial

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "ru",
          includedLanguages: "ru,uz,en",
          autoDisplay: false,
        },
        "google_translate_element"
      )
    }

    if (!document.querySelector('script[data-marketcard-google-translate="1"]')) {
      const script = document.createElement("script")
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      script.async = true
      script.dataset.marketcardGoogleTranslate = "1"
      document.body.appendChild(script)
    }
  }, [])

  const chooseLang = (nextLang: Lang) => {
    setLang(nextLang)
    window.localStorage.setItem("marketcard_lang", nextLang)
    document.documentElement.lang = nextLang
    document.cookie = `googtrans=/ru/${nextLang};path=/`
    document.cookie = `googtrans=/ru/${nextLang};domain=${window.location.hostname};path=/`
    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo")
    if (combo) {
      combo.value = nextLang
      combo.dispatchEvent(new Event("change"))
    }
    window.dispatchEvent(new CustomEvent("marketcard:language-change", { detail: { lang: nextLang } }))
  }

  return (
    <div className="mc-global-lang-switcher" aria-label="Language selector">
      <div id="google_translate_element" className="mc-google-translate-hidden" />
      {(["ru", "uz", "en"] as Lang[]).map((item) => (
        <button
          key={item}
          type="button"
          className={lang === item ? "is-active" : ""}
          onClick={() => chooseLang(item)}
        >
          {labels[item]}
        </button>
      ))}
    </div>
  )
}
