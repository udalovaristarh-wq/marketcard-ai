"use client"

import { useEffect, useState } from "react"

type Lang = "ru" | "uz" | "en"

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
    const initialLangTimer = window.setTimeout(() => setLang(initial), 0)

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

    return () => window.clearTimeout(initialLangTimer)
  }, [])

  useEffect(() => {
    window.localStorage.setItem("marketcard_lang", lang)
    document.documentElement.lang = lang
    document.cookie = `googtrans=/ru/${lang};path=/`
    document.cookie = `googtrans=/ru/${lang};domain=${window.location.hostname};path=/`
    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo")
    if (combo) {
      combo.value = lang
      combo.dispatchEvent(new Event("change"))
    }
    window.dispatchEvent(new CustomEvent("marketcard:language-change", { detail: { lang } }))
  }, [lang])

  const chooseLang = (nextLang: Lang) => {
    setLang(nextLang)
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
