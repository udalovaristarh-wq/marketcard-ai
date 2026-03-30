"use client"

import { useMemo, useState } from "react"

type MarketplaceKey = "uzum" | "wildberries" | "ozon" | "yandex"
type LanguageMode = "ru" | "uz" | "ru_uz"
type StyleMode = "premium" | "tech" | "clean" | "sale"

type GenerateResponse = {
  success: boolean
  language_mode: LanguageMode
  style_mode: StyleMode
  variants_count: number
  variants: string[]
}

export default function AiCardGenerator() {

  const [title, setTitle] = useState("")
  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState("")
  const [marketplace, setMarketplace] = useState<MarketplaceKey>("uzum")
  const [languageMode, setLanguageMode] = useState<LanguageMode>("ru")
  const [styleMode, setStyleMode] = useState<StyleMode>("premium")
  const [variantsCount, setVariantsCount] = useState(3)
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerateResponse | null>(null)
  const [error, setError] = useState("")

  const previewUrl = useMemo(() => {
    if (!image) return ""
    return URL.createObjectURL(image)
  }, [image])

  const handleGenerate = async () => {

    if (!title || !brand || !category || !image) {
      setError("Заполни все поля и выбери изображение")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    const formData = new FormData()

    formData.append("title", title)
    formData.append("brand", brand)
    formData.append("category", category)
    formData.append("marketplace", marketplace)
    formData.append("language_mode", languageMode)
    formData.append("style_mode", styleMode)
    formData.append("variants_count", String(variantsCount))
    formData.append("image", image)

    try {

      const res = await fetch("http://127.0.0.1:8000/ai/generate", {
        method: "POST",
        body: formData
      })

      const data = await res.json()

      if (!res.ok) {
        setError("Ошибка генерации")
        setLoading(false)
        return
      }

      setResult(data)

    } catch (e) {
      setError("Ошибка подключения к серверу")
    }

    setLoading(false)
  }

  return (

    <div style={{marginTop:40}}>

      <h2 style={{color:"white",fontSize:28,fontWeight:900}}>
        AI генератор инфографики
      </h2>

      <div style={{display:"grid",gap:14,marginTop:20}}>

        <input
          placeholder="Название товара"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Бренд"
          value={brand}
          onChange={(e)=>setBrand(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Категория"
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
          style={inputStyle}
        />

        <select
          value={marketplace}
          onChange={(e)=>setMarketplace(e.target.value as MarketplaceKey)}
          style={inputStyle}
        >
          <option value="uzum">Uzum</option>
          <option value="wildberries">Wildberries</option>
          <option value="ozon">Ozon</option>
          <option value="yandex">Yandex</option>
        </select>

        <select
          value={languageMode}
          onChange={(e)=>setLanguageMode(e.target.value as LanguageMode)}
          style={inputStyle}
        >
          <option value="ru">Русский</option>
          <option value="uz">O'zbekcha</option>
          <option value="ru_uz">Русский + O'zbekcha</option>
        </select>

        <select
          value={styleMode}
          onChange={(e)=>setStyleMode(e.target.value as StyleMode)}
          style={inputStyle}
        >
          <option value="premium">Premium</option>
          <option value="tech">Tech</option>
          <option value="clean">Clean</option>
          <option value="sale">Sale</option>
        </select><select
          value={variantsCount}
          onChange={(e)=>setVariantsCount(Number(e.target.value))}
          style={inputStyle}
        >
          <option value={3}>3 варианта</option>
          <option value={5}>5 вариантов</option>
          <option value={10}>10 вариантов</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e)=>setImage(e.target.files?.[0] || null)}
          style={{color:"white"}}
        />

        {previewUrl && (
          <img
            src={previewUrl}
            style={{maxWidth:300,borderRadius:10}}
          />
        )}

        {error && (
          <div style={{color:"red"}}>
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            padding:18,
            borderRadius:12,
            border:"none",
            background:"#06b6d4",
            color:"white",
            cursor: loading ? "default" : "pointer",
            fontSize:18,
            fontWeight:700
          }}
        >
          {loading ? "Генерация..." : "Сгенерировать AI инфографику"}
        </button>

      </div>

      {result && (

        <div style={{marginTop:40}}>

          <h3 style={{color:"white"}}>
            Сгенерированные варианты
          </h3>

          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
            gap:20,
            marginTop:20
          }}>

            {result.variants.map((url,i)=>(
              <div key={i}>

                <img
                  src={url}
                  style={{width:"100%",borderRadius:12}}
                />

                <a
                  href={url}
                  target="_blank"
                  style={{color:"white"}}
                >
                  Открыть PNG
                </a>

              </div>
            ))}

          </div>

        </div>

      )}

    </div>

  )
}

const inputStyle = {
  padding:12,
  borderRadius:10,
  border:"1px solid #444",
  background:"#111",
  color:"white"
}