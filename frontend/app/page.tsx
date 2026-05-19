"use client"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

const examples = [
  "/works/work1.jpg",
  "/works/work2.jpg",
  "/works/work3.jpg",
  "/works/work4.jpg",
  "/works/top1.jpg",
  "/works/top2.jpg",
]

const marketplaces = [
  { name: "Uzum", logo: "/marketplaces-premium/uzum.png", className: "uzumLogo" },
  { name: "Wildberries", logo: "/marketplaces-premium/wildberries.png", className: "wbLogo" },
  { name: "Ozon", logo: "/marketplaces-premium/ozon.png", className: "ozonLogo" },
  { name: "Yandex Market", logo: "/marketplaces-premium/yandex.png", className: "yandexLogo" },
]



const showcaseBlocks = [
  [
    "/showcase/wb/1.webp",
    "/showcase/wb/2.webp",
    "/showcase/wb/3.webp",
    "/showcase/wb/4.webp",
    "/showcase/wb/5.webp",
  ],
  [
    "/showcase/wb/6.webp",
    "/showcase/wb/7.webp",
    "/showcase/wb/8.webp",
    "/showcase/wb/9.webp",
    "/showcase/wb/10.webp",
  ],
  [
    "/showcase/wb/13.webp",
    "/showcase/wb/14.webp",
    "/showcase/wb/15.webp",
    "/showcase/wb/16.webp",
    "/showcase/wb/1.webp",
  ],
  [
    "/showcase/wb/2.webp",
    "/showcase/wb/4.webp",
    "/showcase/wb/6.webp",
    "/showcase/wb/8.webp",
    "/showcase/wb/10.webp",
  ],
  [
    "/showcase/wb/3.webp",
    "/showcase/wb/5.webp",
    "/showcase/wb/7.webp",
    "/showcase/wb/9.webp",
    "/showcase/wb/13.webp",
  ],
  [
    "/showcase/wb/14.webp",
    "/showcase/wb/15.webp",
    "/showcase/wb/16.webp",
    "/showcase/wb/1.webp",
    "/showcase/wb/2.webp",
  ]
]


const features = [
  "AI карточки товара",
  "SEO описание",
  "Аналитика маркетплейсов",
  "ABC-анализ товара и ниши",
  "Оценка карточки товара",
  "Интеграция с Soliq / ИКПУ",
  "DIDOX и документы",
  "Поиск товаров для закупа",
  "Анализ конкурентов",
  "Поиск дефицита товара",
  "Анализ избытка товара",
  "AI Video Generator",
]

export default function Home() {
  const router = useRouter()
  const [pricingOpen, setPricingOpen] = useState(false)
  const [lang, setLang] = useState<"ru" | "uz" | "en">("ru")
  const [demoOpen, setDemoOpen] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [demoImage, setDemoImage] = useState("")
  const [demoMarketplace, setDemoMarketplace] = useState("uzum")
  const [demoTitle, setDemoTitle] = useState("")
  const [demoBrand, setDemoBrand] = useState("")
  const [demoCategory, setDemoCategory] = useState("")
  const [demoProgress, setDemoProgress] = useState(0)
  
const [demoStage, setDemoStage] = useState("Ожидание фото")
const [showcaseIndex, setShowcaseIndex] = useState(0)



  useEffect(() => {
    const interval = setInterval(() => {
      setShowcaseIndex((prev) => (prev + 1) % 5)
    }, 2200)

    return () => clearInterval(interval)
  }, [])


  return (
    <main className="mcPage">
      <div className="mcBg">
        <div className="orb orbA" />
        <div className="orb orbB" />
        <div className="orb orbC" />
        <div className="gridBg" />
      </div>

      <header className="nav">
        <div className="brand">
          <img src="/logo.jpg" alt="MarketCard AI" />
          <div>
            <strong>MarketCard AI</strong>
            <span>AI marketplace studio</span>
          </div>
        </div>

        <nav>
          <a href="#how">Как работает</a>
          <a href="#features">Возможности</a>
          <button className="navLinkBtn" onClick={() => setPricingOpen(true)}>Тарифы</button>
        </nav>

        <div className="navActions">
          <div className="langSwitch">
            {(["ru", "uz", "en"] as const).map((l) => (
              <button
                key={l}
                className={lang === l ? "activeLang" : ""}
                onClick={() => setLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <button className="ghostBtn" onClick={() => router.push("/login")}>
            Войти
          </button>

          <button className="primaryBtn" onClick={() => setDemoOpen(true)}>
            Попробовать бесплатно
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="heroLeft">
          <div className="eyebrow">
            <span className="pulseDot" />
            AI-платформа для продавцов маркетплейсов
          </div>

          <h1>
            Продающие карточки
            <br />
            за минуты, не за дни
          </h1>

          <p className="heroText">
            Дизайнер делает карточки несколько дней и берёт $5–20 за одно фото.
            MarketCard AI создаёт карточку примерно от $1: инфографика, SEO,
            аналитика, оценка карточки, ABC-анализ и инструменты для продавцов
            маркетплейсов в одном кабинете.
          </p>

          <div className="heroActions">
            <button className="heroPrimary" onClick={() => setDemoOpen(true)}>
              Попробовать бесплатно — 1 генерация
            </button>
            <button className="heroSecondary" onClick={() => router.push("/login")}>
              Войти в кабинет
            </button>
          </div>

          <div className="statsRow">
            <div>
              <strong>Минуты</strong>
              <span>вместо ожидания дизайнера несколько дней</span>
            </div>
            <div>
              <strong>4</strong>
              <span>маркетплейса</span>
            </div>
            <div>
              <strong>$1</strong>
              <span>ориентир стоимости против $5–20 за фото у дизайнера</span>
            </div>
          </div>
        </div>

        <div className="heroRight">
          <div className="generatorCard">
            <div className="generatorTop">
              <div>
                <span>MarketCard Studio</span>
                <strong>Product card generation</strong>
              </div>
              <div className="statusPill">LIVE</div>
            </div>

            <div className="mainPreview">
              <img src="/works/work1.jpg" alt="AI product card" />
            </div>

            <div className="miniGrid">
              {examples.slice(1, 5).map((src) => (
                <div className="miniCard" key={src}>
                  <img src={src} alt="Example card" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="marketplaceStrip">
        {marketplaces.map((m) => (
          <div className="marketItem" key={m.name}>
            <div className="marketLogoBox">
              <img className={m.className} src={m.logo} alt={m.name} />
            </div>
            <span>{m.name}</span>
          </div>
        ))}
      </section>

      <section className="howSection" id="how">
        <div className="sectionHead">
          <span>WORKFLOW</span>
          <h2>Как работает платформа</h2>
          <p>
            Полный AI-процесс генерации карточек товара для маркетплейсов.
          </p>
        </div>

        <div className="stepsGrid">
          <div className="stepCard">
            <div className="stepNumber">01</div>
            <h3>Загрузи товар</h3>
            <p>
              Добавь фотографию товара, бренд, категорию и название.
            </p>
          </div>

          <div className="stepCard">
            <div className="stepNumber">02</div>
            <h3>Выбери маркетплейс</h3>
            <p>
              AI автоматически подстроит размеры и структуру карточки.
            </p>
          </div>

          <div className="stepCard">
            <div className="stepNumber">03</div>
            <h3>Получи результат</h3>
            <p>
              Готовая инфографика, SEO, аналитика и дополнительные слайды.
            </p>
          </div>
        </div>
      </section>


      <section className="compareSection">
        <div className="sectionHead">
          <span>WHY MARKETCARD AI</span>
          <h2>Зачем переплачивать дизайнеру?</h2>
          <p>
            Продавцу важно не ждать красивые макеты неделями, а быстро тестировать
            товары, карточки, ниши и цены. MarketCard AI помогает запускать продажи быстрее.
          </p>
        </div>

        <div className="compareGrid">
          <div className="compareCard weak">
            <span>Обычный дизайнер</span>
            <h3>$5–20 за одно фото</h3>
            <ul>
              <li>Ожидание 1–3 дня</li>
              <li>Каждая правка отдельно</li>
              <li>Нет SEO и аналитики</li>
              <li>Нет анализа конкурентов</li>
              <li>Нет проверки ниши</li>
            </ul>
          </div>

          <div className="compareCard strong">
            <span>MarketCard AI</span>
            <h3>Карточка примерно от $1</h3>
            <ul>
              <li>Генерация за минуты</li>
              <li>Карточка + SEO + описание</li>
              <li>ABC-анализ товара и ниши</li>
              <li>Оценка карточки товара</li>
              <li>Анализ конкурентов и дефицита</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="featureSection" id="features">
        <div className="sectionHead">
          <span>AI ECOSYSTEM</span>
          <h2>Возможности MarketCard AI</h2>
        </div>

        <div className="featureGrid">
          {features.map((f) => (
            <div className="featureCard" key={f}>
              <div className="featureGlow" />
              <strong>{f}</strong>
              <p>
                Premium AI инструменты для профессиональной работы с
                маркетплейсами.
              </p>
            </div>
          ))}
        </div>
      </section>


      <section className="platformSection">
        <div className="platformBox">
          <div className="sectionHead">
            <span>SELLER ECOSYSTEM</span>
            <h2>Не просто генератор карточек. Полная система для продавца.</h2>
            <p>
              MarketCard AI помогает не только сделать красивую карточку,
              но и понять товар, нишу, конкурентов, документы и потенциал продаж.
            </p>
          </div>

          <div className="platformGrid">
            <div><b>Аналитика маркетплейсов</b><span>Смотри конкуренцию, цены и спрос.</span></div>
            <div><b>ABC-анализ</b><span>Понимай, стоит ли заходить в товар или нишу.</span></div>
            <div><b>Оценка карточки</b><span>AI показывает слабые места твоей карточки.</span></div>
            <div><b>Soliq / ИКПУ</b><span>Быстрый переход к кодам и данным товара.</span></div>
            <div><b>DIDOX / документы</b><span>Удобная работа с документами продавца.</span></div>
            <div><b>Поиск закупа</b><span>Ищи товары, дефицит и новые возможности.</span></div>
          </div>
        </div>
      </section>

      <section className="showcaseSection">
        <div className="sectionHead">
          <span>SHOWCASE</span>
          <h2>Примеры AI-карточек</h2>
          <p>
            Карточки, созданные системой MarketCard AI для маркетплейсов.
          </p>
        </div>

        <div className="premiumShowcaseGrid">
          {showcaseBlocks.map((block, blockIndex) => (
            <div className="premiumShowcaseCard" key={blockIndex}>
              <img
                src={block[(showcaseIndex + blockIndex) % block.length]}
                alt={`Marketplace example ${blockIndex + 1}`}
              />

              <div className="premiumShowcaseOverlay">
                <span>Marketplace card</span>
                <strong>Пример карточки товара</strong>
              </div>
            </div>
          ))}
        </div>
      </section>


      <section className="proofSection">
        <div className="proofTop">
          <div>
            <span>TRUST</span>
            <h2>Продавцы выбирают скорость</h2>
          </div>

          <div className="proofStats">
            <div><b>5 000+</b><small>пользователей платформы</small></div>
            <div><b>4</b><small>маркетплейса в системе</small></div>
            <div><b>1</b><small>бесплатная генерация для старта</small></div>
          </div>
        </div>

        <div className="reviewGrid">
          <div className="reviewCard">
            <p>
              “Раньше ждал дизайнера по 2 дня. Сейчас быстро тестирую карточки
              и сразу понимаю, какой визуал лучше работает.”
            </p>
            <strong>Азиз</strong>
            <span>Продавец автотоваров, Uzum</span>
          </div>

          <div className="reviewCard">
            <p>
              “Для новых товаров удобно: фото, описание, SEO и анализ ниши в одном месте.
              Не надо искать отдельно дизайнера и аналитика.”
            </p>
            <strong>Мадина</strong>
            <span>Продавец товаров для дома</span>
          </div>

          <div className="reviewCard">
            <p>
              “Главное — можно быстро проверять идеи. Если товар не заходит,
              не трачу лишние деньги на дорогой дизайн.”
            </p>
            <strong>Дилшод</strong>
            <span>Продавец электроники</span>
          </div>
        </div>
      </section>

      <section className="ctaSection">
        <div className="ctaBox">
          <div className="ctaGlow" />

          <span>START NOW</span>

          <h2>
            Создай первую AI-карточку
            <br />
            прямо сейчас
          </h2>

          <p>
            Загрузи фото товара и получи готовую продающую инфографику.
          </p>

          <div className="ctaActions">
            <button
              className="heroPrimary"
              onClick={() => router.push("/register")}
            >
              Попробовать бесплатно
            </button>

            <button
              className="heroSecondary"
              onClick={() => setPricingOpen(true)}
            >
              Смотреть тарифы
            </button>
          </div>
        </div>
      </section>

      
      
      {demoOpen && (
        <div className="demoModal" onClick={() => setDemoOpen(false)}>
          <div className="demoBox" onClick={(e) => e.stopPropagation()}>
            <button className="demoClose" onClick={() => setDemoOpen(false)}>×</button>

            <div className="demoShine" />

            <div className="demoHeader">
              <div className="demoBadge">
                FREE AI DEMO • 1 GENERATION
              </div>

              <h2>
                Попробуй MarketCard AI бесплатно
              </h2>

              <p>
                Загрузи фото товара — AI создаст демо-карточку с водяным знаком.
                Полная версия без водяного знака доступна после регистрации.
              </p>
            </div>

            <div className="demoContent">
              <div className="demoForm">

                <div className="demoField">
                  <span>Название товара</span>

                  <input
                    value={demoTitle}
                    onChange={(e) => setDemoTitle(e.target.value)}
                    placeholder="Например: Насос ГУР Cobalt"
                  />
                </div>

                <div className="demoField">
                  <span>Бренд</span>

                  <input
                    value={demoBrand}
                    onChange={(e) => setDemoBrand(e.target.value)}
                    placeholder="Например: BRAVE"
                  />
                </div>

                <div className="demoField">
                  <span>Категория</span>

                  <input
                    value={demoCategory}
                    onChange={(e) => setDemoCategory(e.target.value)}
                    placeholder="Например: Автозапчасти"
                  />
                </div>

                <div className="demoField">
                  <span>Маркетплейс</span>

                  <select
                    value={demoMarketplace}
                    onChange={(e) => setDemoMarketplace(e.target.value)}
                  >
                    <option value="uzum">Uzum 1080×1440</option>
                    <option value="wildberries">Wildberries 900×1200</option>
                    <option value="ozon">Ozon 1200×1600</option>
                    <option value="yandex">Yandex Market 1000×1000</option>
                  </select>
                </div>
                <label className="demoUpload">
                  <b>Загрузить фото</b>

                  <small>JPG / PNG / WEBP</small>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]

                      if (!file) return

                      try {
                        setDemoLoading(true)
                        setDemoImage("")
                        setDemoProgress(5)
                        setDemoStage("AI определяет товар по фото")

                        const analyzeFd = new FormData()
                        analyzeFd.append("image", file)

                        try {
                          const analyzeRes = await fetch("/api/analyze-product-photo", {
                            method: "POST",
                            body: analyzeFd,
                          })

                          const analyzeData = await analyzeRes.json()

                          if (analyzeRes.ok && analyzeData?.success) {
                            if (analyzeData.title) setDemoTitle(analyzeData.title)
                            if (analyzeData.brand) setDemoBrand(analyzeData.brand)
                            if (analyzeData.category) setDemoCategory(analyzeData.category)
                          }
                        } catch (analyzeErr) {
                          console.warn("photo analyze skipped", analyzeErr)
                        }

                        setDemoProgress(14)
                        setDemoStage("Загружаем фото товара")

                        const fd = new FormData()

                        fd.append("image", file)
                        fd.append("marketplace", demoMarketplace)
                        fd.append("language_mode", "ru")
                        fd.append("product_title", demoTitle || "Демо товар")
                        fd.append("brand", demoBrand || "Brand")
                        fd.append("category", demoCategory || "Товар")

                        setDemoProgress(28)
                        setDemoStage("AI анализирует товар")

                        const progressTimer = setInterval(() => {
                          setDemoProgress((prev) => {
                            if (prev < 88) return prev + 7
                            return prev
                          })
                        }, 1200)

                        const res = await fetch("/api/demo-generate", {
                          method: "POST",
                          body: fd,
                        })

                        clearInterval(progressTimer)
                        setDemoProgress(94)
                        setDemoStage("Финализируем карточку")

                        const data = await res.json()

                        if (!res.ok || !data?.success) {
                          alert(data?.detail || "Ошибка демо-генерации")
                          return
                        }

                        setDemoImage(data.demo_image_url)
                        setDemoProgress(100)
                        setDemoStage("Готово")

                      } catch (err) {
                        console.error(err)
                        alert("Ошибка демо-генерации")

                      } finally {
                        setDemoLoading(false)
                      }
                    }}
                  />
                </label>
              </div>

              <div className="demoPreview">
                {demoLoading ? (
                  <div className="demoLoading aidProgressBox">
                    <div className="magicStars">
                      <span>✦</span>
                      <span>✧</span>
                      <span>✦</span>
                    </div>

                    <strong>{demoStage}</strong>

                    <div className="progressShell">
                      <div
                        className="progressFill"
                        style={{ width: `${demoProgress}%` }}
                      />
                    </div>

                    <span>{demoProgress}%</span>
                  </div>

                ) : demoImage ? (

                  <img
                    src={
                      demoImage.startsWith("/generated_cards")
                        ? `/api${demoImage}`
                        : demoImage
                    }
                    alt="Demo MarketCard AI"
                  />

                ) : (

                  <div className="demoEmpty">
                    <div>✨</div>

                    <strong>
                      Здесь появится демо-карточка
                    </strong>

                    <span>
                      Загрузи фото товара, чтобы увидеть результат
                    </span>
                  </div>

                )}
              </div>
            </div>

            {demoImage && (
              <button
                className="demoRegister"
                onClick={() => router.push("/register")}
              >
                Получить полную версию без водяного знака
              </button>
            )}
          </div>
        </div>
      )}


      {pricingOpen && (
        <div className="pricingModal" onClick={() => setPricingOpen(false)}>
          <div className="pricingBox" onClick={(e) => e.stopPropagation()}>
            <button className="modalClose" onClick={() => setPricingOpen(false)}>×</button>

            <div className="pricingHeader">
              <div className="pricingBadge">1 генерация бесплатно</div>
              <h2>Выбери тариф и начни продавать быстрее</h2>
              <p>
                Дизайнер берёт $5–20 за одно фото и делает несколько дней.
                MarketCard AI создаёт карточки, SEO и аналитику за минуты.
              </p>
            </div>

            <div className="tariffGrid">
              <div className="tariffCard">
                <div className="tariffTop">
                  <span>START</span>
                  <b>Для теста</b>
                </div>
                <h3>249 000 сум</h3>
                <p>20 генераций. Подходит, чтобы попробовать AI-карточки и протестировать первые товары.</p>
                <ul>
                  <li>AI карточки товара</li>
                  <li>SEO описание</li>
                  <li>Форматы Uzum / WB / Ozon</li>
                  <li>1 бесплатная генерация</li>
                </ul>
                <button onClick={() => router.push("/register")}>Начать бесплатно</button>
              </div>

              <div className="tariffCard popular">
                <div className="popularBadge">Лучший выбор</div>
                <div className="tariffTop">
                  <span>BUSINESS</span>
                  <b>Для продаж</b>
                </div>
                <h3>799 000 сум</h3>
                <p>60 генераций для активных продавцов, которые хотят быстро запускать товары.</p>
                <ul>
                  <li>AI карточки + дополнительные слайды</li>
                  <li>Product Intelligence</li>
                  <li>ABC-анализ товара и ниши</li>
                  <li>Анализ конкурентов</li>
                </ul>
                <button onClick={() => router.push("/register")}>Выбрать Business</button>
              </div>

              <div className="tariffCard">
                <div className="tariffTop">
                  <span>PREMIUM</span>
                  <b>Для команды</b>
                </div>
                <h3>1 900 000 сум</h3>
                <p>200 генераций для больших объёмов, команд и системной работы с маркетплейсами.</p>
                <ul>
                  <li>Много товаров и ниш</li>
                  <li>Оценка карточек</li>
                  <li>Дефицит / избыток товара</li>
                  <li>AI Video Generator</li>
                </ul>
                <button onClick={() => router.push("/register")}>Масштабировать</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footerBrand">
          <img src="/logo.jpg" alt="MarketCard AI" />
          <div>
            <strong>MarketCard AI</strong>
            <span>AI marketplace platform</span>
          </div>
        </div>

        <div className="footerLinks">
          <a href="/about">About</a>
          <a href="/pricing">Pricing</a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
        </div>
      </footer>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .mcPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at top left, rgba(124,58,237,0.25), transparent 28%),
            radial-gradient(circle at bottom right, rgba(6,182,212,0.18), transparent 30%),
            #05060a;
          color: white;
          font-family: Inter, Arial, sans-serif;
        }

        .mcBg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(120px);
          opacity: 0.55;
        }

        .orbA {
          width: 420px;
          height: 420px;
          background: #7c3aed;
          top: -120px;
          left: -100px;
        }

        .orbB {
          width: 380px;
          height: 380px;
          background: #06b6d4;
          right: -120px;
          top: 120px;
        }

        .orbC {
          width: 320px;
          height: 320px;
          background: #2563eb;
          left: 40%;
          bottom: -120px;
        }

        .gridBg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(circle at center, black, transparent 85%);
        }

        .nav {
          position: sticky;
          top: 0;
          z-index: 50;
          max-width: 1280px;
          margin: 0 auto;
          padding: 20px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          backdrop-filter: blur(18px);
          background: rgba(5,6,10,0.55);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .brand img {
          width: 54px;
          height: 54px;
          border-radius: 18px;
          object-fit: cover;
          box-shadow: 0 0 30px rgba(124,58,237,0.45);
        }

        .brand strong {
          display: block;
          font-size: 18px;
        }

        .brand span {
          display: block;
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          margin-top: 2px;
        }

        nav {
          display: flex;
          gap: 28px;
        }

        nav a {
          color: rgba(255,255,255,0.72);
          text-decoration: none;
          transition: 0.25s;
        }

        nav a:hover {
          color: white;
        }

        .navActions {
          display: flex;
          gap: 12px;
        }

        button {
          border: 0;
          cursor: pointer;
          transition: 0.25s;
        }

        .ghostBtn {
          padding: 12px 18px;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          color: white;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .primaryBtn,
        .heroPrimary {
          padding: 12px 22px;
          border-radius: 999px;
          color: white;
          font-weight: 700;
          background: linear-gradient(135deg,#7c3aed,#06b6d4);
          box-shadow: 0 12px 40px rgba(124,58,237,0.4);
        }

        .primaryBtn:hover,
        .heroPrimary:hover {
          transform: translateY(-2px);
        }

        .hero {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          margin: 0 auto;
          padding: 90px 28px 40px;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 54px;
          align-items: center;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          border-radius: 999px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.75);
          font-size: 13px;
          margin-bottom: 28px;
        }

        .pulseDot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 20px #22c55e;
        }

        h1 {
          margin: 0;
          font-size: clamp(58px, 8vw, 108px);
          line-height: 0.92;
          letter-spacing: -0.07em;
          max-width: 760px;
        }

        .heroText {
          margin-top: 28px;
          max-width: 680px;
          color: rgba(255,255,255,0.72);
          font-size: 20px;
          line-height: 1.7;
        }

        .heroActions {
          display: flex;
          gap: 16px;
          margin-top: 38px;
          flex-wrap: wrap;
        }

        .heroSecondary {
          padding: 14px 24px;
          border-radius: 999px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          font-weight: 600;
        }

        .statsRow {
          display: flex;
          gap: 18px;
          margin-top: 42px;
          flex-wrap: wrap;
        }

        .statsRow div {
          min-width: 180px;
          padding: 18px;
          border-radius: 24px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
        }

        .statsRow strong {
          display: block;
          font-size: 28px;
          margin-bottom: 8px;
        }

        .statsRow span {
          color: rgba(255,255,255,0.62);
          font-size: 14px;
        }

        .generatorCard {
          position: relative;
          padding: 20px;
          border-radius: 36px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.12),
            rgba(255,255,255,0.04)
          );
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(30px);
          box-shadow:
            0 40px 120px rgba(0,0,0,0.55),
            inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .generatorTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .generatorTop span {
          display: block;
          color: rgba(255,255,255,0.55);
          font-size: 13px;
        }

        .generatorTop strong {
          display: block;
          margin-top: 4px;
          font-size: 18px;
        }

        .statusPill {
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(34,197,94,0.15);
          color: #4ade80;
          border: 1px solid rgba(34,197,94,0.3);
          font-size: 12px;
          font-weight: 700;
        }

        .mainPreview {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
          aspect-ratio: 3/4;
          background: #111827;
        }

        .mainPreview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .miniGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 14px;
        }

        .miniCard {
          border-radius: 22px;
          overflow: hidden;
          aspect-ratio: 1/1;
          background: #111827;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .miniCard img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .marketplaceStrip,
        .howSection,
        .featureSection,
        .showcaseSection,
        .ctaSection,
        .footer {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          margin: 0 auto;
          padding: 90px 28px;
        }


        .sectionHead {
          margin-bottom: 44px;
        }

        .sectionHead span {
          display: inline-block;
          color: #22d3ee;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.12em;
          margin-bottom: 16px;
        }

        h2 {
          margin: 0;
          font-size: clamp(42px, 6vw, 72px);
          line-height: 0.95;
          letter-spacing: -0.06em;
        }

        .sectionHead p {
          margin-top: 18px;
          max-width: 720px;
          color: rgba(255,255,255,0.66);
          font-size: 18px;
          line-height: 1.7;
        }

        .stepsGrid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 22px;
        }

        .stepCard {
          position: relative;
          padding: 34px;
          border-radius: 34px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          overflow: hidden;
        }

        .stepNumber {
          font-size: 72px;
          font-weight: 900;
          color: rgba(255,255,255,0.08);
          margin-bottom: 18px;
        }

        .stepCard h3 {
          margin: 0 0 16px;
          font-size: 28px;
        }

        .stepCard p {
          margin: 0;
          color: rgba(255,255,255,0.66);
          line-height: 1.7;
        }

        .featureGrid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 22px;
        }

        .featureCard {
          position: relative;
          padding: 32px;
          border-radius: 32px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          overflow: hidden;
        }

        .featureGlow {
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 999px;
          background: rgba(124,58,237,0.24);
          filter: blur(60px);
          top: -80px;
          right: -80px;
        }

        .featureCard strong {
          position: relative;
          display: block;
          font-size: 24px;
          margin-bottom: 14px;
        }

        .featureCard p {
          position: relative;
          color: rgba(255,255,255,0.66);
          line-height: 1.7;
        }

        .showcaseGrid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 22px;
        }

        .showcaseCard {
          position: relative;
          overflow: hidden;
          border-radius: 34px;
          background: #111827;
          border: 1px solid rgba(255,255,255,0.08);
          aspect-ratio: 3/4;
          box-shadow: 0 30px 80px rgba(0,0,0,0.45);
        }

        .showcaseCard img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .showcaseCard:hover img {
          transform: scale(1.05);
        }

        .showcaseOverlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 22px;
          background:
            linear-gradient(
              to top,
              rgba(0,0,0,0.75),
              rgba(0,0,0,0.05)
            );
        }

        .showcaseBadge {
          align-self: flex-start;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(14px);
          font-size: 12px;
          font-weight: 700;
        }

        .showcaseBottom strong {
          display: block;
          font-size: 22px;
        }

        .showcaseBottom span {
          display: block;
          margin-top: 6px;
          color: rgba(255,255,255,0.72);
        }

        .ctaBox {
          position: relative;
          overflow: hidden;
          padding: 80px 40px;
          border-radius: 42px;
          text-align: center;
          background:
            linear-gradient(
              135deg,
              rgba(124,58,237,0.22),
              rgba(6,182,212,0.18)
            );
          border: 1px solid rgba(255,255,255,0.08);
        }

        .ctaGlow {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 999px;
          background: rgba(124,58,237,0.28);
          filter: blur(120px);
          top: -180px;
          right: -120px;
        }

        .ctaBox span {
          position: relative;
          display: inline-block;
          color: #22d3ee;
          letter-spacing: 0.14em;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .ctaBox h2 {
          position: relative;
          max-width: 860px;
          margin: 0 auto;
        }

        .ctaBox p {
          position: relative;
          max-width: 680px;
          margin: 24px auto 0;
          color: rgba(255,255,255,0.72);
          font-size: 18px;
          line-height: 1.7;
        }

        .ctaActions {
          position: relative;
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 36px;
        }

        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          padding-top: 40px;
          padding-bottom: 60px;
        }

        .footerBrand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .footerBrand img {
          width: 56px;
          height: 56px;
          border-radius: 18px;
          object-fit: cover;
        }

        .footerBrand strong {
          display: block;
          font-size: 18px;
        }

        .footerBrand span {
          display: block;
          margin-top: 4px;
          color: rgba(255,255,255,0.58);
          font-size: 13px;
        }

        .footerLinks {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }

        .footerLinks a {
          color: rgba(255,255,255,0.68);
          text-decoration: none;
        }

        .footerLinks a:hover {
          color: white;
        }


        .compareSection {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          margin: 0 auto;
          padding: 90px 28px;
        }

        .compareGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .compareCard {
          border-radius: 36px;
          padding: 36px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
        }

        .compareCard span {
          display: inline-block;
          margin-bottom: 18px;
          color: rgba(255,255,255,0.65);
          font-weight: 700;
        }

        .compareCard h3 {
          font-size: 38px;
          line-height: 1;
          margin: 0 0 26px;
          letter-spacing: -0.04em;
        }

        .compareCard ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 14px;
        }

        .compareCard li {
          color: rgba(255,255,255,0.75);
          line-height: 1.5;
        }

        .compareCard li::before {
          content: "✓";
          margin-right: 10px;
          color: #22d3ee;
        }

        .compareCard.strong {
          background:
            radial-gradient(circle at top right, rgba(34,211,238,0.22), transparent 35%),
            linear-gradient(135deg, rgba(124,58,237,0.18), rgba(255,255,255,0.05));
          box-shadow: 0 30px 90px rgba(124,58,237,0.25);
        }

        .compareCard.weak {
          opacity: 0.82;
        }


        .platformSection {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          margin: 0 auto;
          padding: 90px 28px;
        }

        .platformBox {
          border-radius: 42px;
          padding: 44px;
          background:
            radial-gradient(circle at 20% 20%, rgba(124,58,237,0.22), transparent 32%),
            radial-gradient(circle at 80% 20%, rgba(6,182,212,0.18), transparent 30%),
            rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(24px);
        }

        .platformGrid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 18px;
        }

        .platformGrid div {
          padding: 26px;
          border-radius: 28px;
          background: rgba(0,0,0,0.24);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .platformGrid b {
          display: block;
          font-size: 20px;
          margin-bottom: 10px;
        }

        .platformGrid span {
          display: block;
          color: rgba(255,255,255,0.66);
          line-height: 1.6;
        }


        .proofSection {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          margin: 0 auto;
          padding: 90px 28px;
        }

        .proofTop {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 28px;
          align-items: end;
          margin-bottom: 32px;
        }

        .proofTop span {
          display: inline-block;
          color: #22d3ee;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.12em;
          margin-bottom: 16px;
        }

        .proofStats {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 16px;
        }

        .proofStats div {
          padding: 24px;
          border-radius: 28px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .proofStats b {
          display: block;
          font-size: 32px;
          margin-bottom: 8px;
        }

        .proofStats small {
          color: rgba(255,255,255,0.62);
          line-height: 1.5;
        }

        .reviewGrid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 20px;
        }

        .reviewCard {
          padding: 28px;
          border-radius: 30px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .reviewCard p {
          margin: 0 0 24px;
          color: rgba(255,255,255,0.78);
          line-height: 1.7;
        }

        .reviewCard strong {
          display: block;
          font-size: 18px;
          margin-bottom: 6px;
        }

        .reviewCard span {
          color: rgba(255,255,255,0.55);
          font-size: 14px;
        }


        .navLinkBtn {
          background: transparent;
          color: rgba(255,255,255,0.72);
          font-size: 16px;
          padding: 0;
        }

        .pricingModal {
          position: fixed;
          inset: 0;
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(0,0,0,0.78);
          backdrop-filter: blur(22px);
        }

        .pricingBox {
          position: relative;
          width: min(1180px, 100%);
          max-height: 92vh;
          overflow: auto;
          padding: 46px;
          border-radius: 44px;
          background:
            radial-gradient(circle at 15% 0%, rgba(124,58,237,0.35), transparent 32%),
            radial-gradient(circle at 85% 10%, rgba(6,182,212,0.24), transparent 34%),
            linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.035)),
            #070812;
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 50px 160px rgba(0,0,0,0.75);
        }

        .modalClose {
          position: absolute;
          top: 22px;
          right: 22px;
          width: 48px;
          height: 48px;
          border-radius: 999px;
          background: rgba(255,255,255,0.09);
          color: white;
          font-size: 30px;
          border: 1px solid rgba(255,255,255,0.12);
        }

        .pricingHeader {
          text-align: center;
          max-width: 820px;
          margin: 0 auto 38px;
        }

        .pricingBadge {
          display: inline-flex;
          padding: 10px 16px;
          border-radius: 999px;
          background: linear-gradient(135deg,#7c3aed,#06b6d4);
          font-size: 13px;
          font-weight: 900;
          margin-bottom: 18px;
          box-shadow: 0 18px 50px rgba(124,58,237,0.38);
        }

        .pricingHeader h2 {
          font-size: clamp(38px, 5vw, 68px);
          line-height: 0.95;
          margin: 0;
          letter-spacing: -0.06em;
        }

        .pricingHeader p {
          margin: 22px auto 0;
          color: rgba(255,255,255,0.68);
          font-size: 18px;
          line-height: 1.65;
        }


        .tariffGrid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 22px;
        }

        .tariffCard {
          position: relative;
          padding: 30px;
          border-radius: 34px;
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .tariffCard.popular {
          transform: translateY(-10px);
          background:
            radial-gradient(circle at top right, rgba(34,211,238,0.28), transparent 38%),
            linear-gradient(180deg, rgba(124,58,237,0.20), rgba(255,255,255,0.06));
          border-color: rgba(34,211,238,0.35);
          box-shadow: 0 35px 100px rgba(6,182,212,0.22);
        }

        .popularBadge {
          position: absolute;
          top: 18px;
          right: 18px;
          padding: 8px 12px;
          border-radius: 999px;
          background: linear-gradient(135deg,#06b6d4,#7c3aed);
          font-size: 11px;
          font-weight: 900;
        }

        .tariffTop span {
          display: block;
          color: #22d3ee;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.14em;
          margin-bottom: 8px;
        }

        .tariffTop b {
          color: rgba(255,255,255,0.58);
          font-size: 14px;
        }

        .tariffCard h3 {
          margin: 24px 0 16px;
          font-size: 36px;
          letter-spacing: -0.05em;
        }

        .tariffCard p {
          color: rgba(255,255,255,0.68);
          line-height: 1.65;
          min-height: 82px;
        }

        .tariffCard ul {
          list-style: none;
          padding: 0;
          margin: 24px 0 0;
          display: grid;
          gap: 12px;
        }

        .tariffCard li {
          color: rgba(255,255,255,0.78);
          line-height: 1.45;
        }

        .tariffCard li::before {
          content: "✓";
          color: #22d3ee;
          margin-right: 10px;
          font-weight: 900;
        }

        .tariffCard button {
          width: 100%;
          margin-top: 28px;
          padding: 16px 18px;
          border-radius: 999px;
          color: white;
          font-weight: 900;
          background: linear-gradient(135deg,#7c3aed,#06b6d4);
          box-shadow: 0 18px 55px rgba(124,58,237,0.35);
        }

        .tariffCard button:hover {
          transform: translateY(-2px);
        }


        .autoShowcase {
          position: relative;
          overflow: hidden;
          width: 100%;
          padding: 8px 0 18px;
          mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
        }

        .autoTrack {
          display: flex;
          gap: 22px;
          width: max-content;
          animation: showcaseScroll 38s linear infinite;
        }

        .autoShowcase:hover .autoTrack {
          animation-play-state: paused;
        }

        .autoTrack .showcaseCard {
          width: 320px;
          flex: 0 0 320px;
        }

        @keyframes showcaseScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }


        .langSwitch {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .langSwitch button {
          width: 38px;
          height: 34px;
          border-radius: 999px;
          background: transparent;
          color: rgba(255,255,255,0.58);
          font-size: 12px;
          font-weight: 900;
        }

        .langSwitch button.activeLang {
          background: linear-gradient(135deg,#7c3aed,#06b6d4);
          color: white;
          box-shadow: 0 10px 30px rgba(124,58,237,0.35);
        }


        .demoModal {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background:
            radial-gradient(circle at 20% 10%, rgba(124,58,237,0.22), transparent 35%),
            rgba(0,0,0,0.84);
          backdrop-filter: blur(26px);
        }

        .demoBox {
          position: relative;
          width: min(1040px, 100%);
          max-height: 92vh;
          overflow: auto;
          padding: 38px;
          border-radius: 42px;
          background:
            radial-gradient(circle at 10% 0%, rgba(124,58,237,0.34), transparent 32%),
            radial-gradient(circle at 92% 12%, rgba(6,182,212,0.26), transparent 34%),
            linear-gradient(180deg, rgba(255,255,255,0.095), rgba(255,255,255,0.035)),
            #070812;
          border: 1px solid rgba(255,255,255,0.13);
          box-shadow: 0 55px 170px rgba(0,0,0,0.82);
        }

        .demoShine {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.08) 22%, transparent 45%);
          opacity: 0.55;
        }

        .demoClose {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 3;
          width: 46px;
          height: 46px;
          border-radius: 999px;
          background: rgba(255,255,255,0.09);
          color: white;
          font-size: 28px;
          border: 1px solid rgba(255,255,255,0.13);
        }

        .demoHeader {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 820px;
          margin: 0 auto 30px;
        }

        .demoBadge {
          display: inline-flex;
          padding: 11px 16px;
          border-radius: 999px;
          background: linear-gradient(135deg,#7c3aed,#06b6d4);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.12em;
          margin-bottom: 18px;
          box-shadow: 0 18px 55px rgba(124,58,237,0.42);
        }

        .demoHeader h2 {
          margin: 0;
          font-size: clamp(38px, 5vw, 66px);
          line-height: 0.95;
          letter-spacing: -0.06em;
        }

        .demoHeader p {
          margin: 20px auto 0;
          color: rgba(255,255,255,0.69);
          line-height: 1.7;
          font-size: 17px;
        }

        .demoContent {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 22px;
          align-items: stretch;
        }

        .demoForm {
          display: grid;
          gap: 12px;
        }

        .demoField span {
          display: block;
          color: rgba(255,255,255,0.58);
          font-size: 13px;
          font-weight: 800;
          margin: 0 0 7px 4px;
        }


        .demoField input,
        .demoField select {
          width: 100%;
          padding: 15px 16px;
          border-radius: 18px;
          background: rgba(255,255,255,0.065);
          color: white;
          border: 1px solid rgba(255,255,255,0.13);
          outline: none;
        }

        .demoUpload {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 116px;
          padding: 20px;
          border-radius: 24px;
          cursor: pointer;
          text-align: center;
          background:
            radial-gradient(circle at top, rgba(34,211,238,0.20), transparent 45%),
            linear-gradient(135deg, rgba(124,58,237,0.30), rgba(6,182,212,0.16));
          border: 1px dashed rgba(34,211,238,0.55);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .demoUpload b {
          font-size: 18px;
        }

        .demoUpload small {
          color: rgba(255,255,255,0.58);
          margin-top: 7px;
        }

        .demoUpload input {
          display: none;
        }

        .demoPreview {
          min-height: 480px;
          border-radius: 30px;
          background:
            radial-gradient(circle at center, rgba(124,58,237,0.15), transparent 48%),
            rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .demoPreview img {
          max-width: 100%;
          max-height: 72vh;
          display: block;
          object-fit: contain;
        }

        .demoLoading,
        .demoEmpty {
          text-align: center;
          color: rgba(255,255,255,0.72);
          display: grid;
          gap: 10px;
          place-items: center;
          padding: 24px;
        }

        .demoEmpty div {
          font-size: 42px;
        }

        .demoLoading strong,
        .demoEmpty strong {
          font-size: 20px;
          color: white;
        }

        .demoLoading span,
        .demoEmpty span {
          color: rgba(255,255,255,0.58);
        }

        .demoSpinner {
          width: 42px;
          height: 42px;
          border-radius: 999px;
          border: 3px solid rgba(255,255,255,0.12);
          border-top-color: #22d3ee;
          animation: demoSpin 0.9s linear infinite;
        }

        @keyframes demoSpin {
          to {
            transform: rotate(360deg);
          }
        }

        .demoRegister {
          position: relative;
          z-index: 2;
          width: 100%;
          margin-top: 22px;
          padding: 17px 20px;
          border-radius: 999px;
          color: white;
          font-weight: 950;
          background: linear-gradient(135deg,#7c3aed,#06b6d4);
          box-shadow: 0 20px 60px rgba(124,58,237,0.38);
        }

        @media (max-width: 900px) {
          .demoContent {
            grid-template-columns: 1fr;
          }

          .demoPreview {
            min-height: 340px;
          }
        }


        .aidProgressBox {
          width: min(360px, 90%);
        }

        .magicStars {
          position: relative;
          width: 92px;
          height: 92px;
          margin-bottom: 8px;
        }

        .magicStars span {
          position: absolute;
          font-size: 34px;
          color: #ffffff;
          filter: drop-shadow(0 0 18px rgba(34,211,238,0.8));
          animation: starFloat 2.4s ease-in-out infinite;
        }

        .magicStars span:nth-child(1) {
          left: 30px;
          top: 4px;
          font-size: 42px;
        }

        .magicStars span:nth-child(2) {
          left: 5px;
          top: 44px;
          animation-delay: 0.35s;
        }

        .magicStars span:nth-child(3) {
          right: 4px;
          top: 50px;
          animation-delay: 0.7s;
        }

        @keyframes starFloat {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 0.55;
          }
          50% {
            transform: translateY(-12px) rotate(14deg) scale(1.18);
            opacity: 1;
          }
          100% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 0.55;
          }
        }

        .progressShell {
          width: 100%;
          height: 10px;
          margin: 12px 0 2px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .progressFill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg,#7c3aed,#06b6d4,#22c55e);
          box-shadow: 0 0 28px rgba(34,211,238,0.65);
          transition: width 0.45s ease;
        }


        .demoUpload {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .demoUpload::before {
          content: "";
          position: absolute;
          inset: -2px;
          background: linear-gradient(120deg,#7c3aed,#06b6d4,#22c55e,#7c3aed);
          background-size: 300% 300%;
          animation: uploadGlowMove 4s linear infinite;
          opacity: 0.65;
          z-index: -2;
        }

        .demoUpload::after {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: 23px;
          background: rgba(7,8,18,0.72);
          z-index: -1;
        }

        @keyframes uploadGlowMove {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 300% 50%;
          }
        }

        .demoField select {
          appearance: none;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.035)),
            #111827;
          color: white;
        }

        .demoField select option {
          background: #111827;
          color: white;
        }


        .marketplaceStrip {
          display: grid;
          grid-template-columns: repeat(4, minmax(180px, 1fr));
          gap: 18px;
          padding-top: 30px;
        }

        .marketItem {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 16px;
          min-height: 92px;
          padding: 18px 22px;
          border-radius: 28px;
          background:
            radial-gradient(circle at top left, rgba(255,255,255,0.13), transparent 36%),
            linear-gradient(135deg, rgba(255,255,255,0.075), rgba(255,255,255,0.035));
          border: 1px solid rgba(255,255,255,0.11);
          backdrop-filter: blur(18px);
          box-shadow:
            0 24px 80px rgba(0,0,0,0.28),
            inset 0 1px 0 rgba(255,255,255,0.08);
          transition: 0.28s ease;
        }

        .marketItem::before {
          content: "";
          position: absolute;
          inset: -1px;
          background: linear-gradient(120deg, transparent, rgba(34,211,238,0.16), transparent);
          opacity: 0;
          transition: 0.28s ease;
        }

        .marketItem:hover {
          transform: translateY(-4px);
          border-color: rgba(34,211,238,0.28);
          box-shadow:
            0 28px 100px rgba(6,182,212,0.18),
            inset 0 1px 0 rgba(255,255,255,0.12);
        }

        .marketItem:hover::before {
          opacity: 1;
        }

        .marketLogoBox {
          position: relative;
          z-index: 2;
          width: 58px;
          height: 58px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .marketLogoBox img {
          display: block;
          object-fit: contain;
          filter: drop-shadow(0 8px 18px rgba(0,0,0,0.28));
        }

        .uzumLogo {
          width: 46px;
          height: 46px;
        }

        .wbLogo {
          width: 42px;
          height: 42px;
          border-radius: 12px;
        }

        .ozonLogo {
          width: 44px;
          height: 44px;
          border-radius: 12px;
        }

        .yandexLogo {
          width: 48px;
          height: 32px;
        }

        .marketItem span {
          position: relative;
          z-index: 2;
          font-size: 18px;
          font-weight: 900;
          color: rgba(255,255,255,0.92);
          white-space: nowrap;
        }


        .marketItem {
          position: relative;
          overflow: hidden;
          min-height: 118px;
          justify-content: flex-start;
          padding: 26px 30px;
          background:
            radial-gradient(circle at 18% 50%, rgba(255,255,255,0.12), transparent 34%),
            linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.035));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 25px 80px rgba(0,0,0,0.26);
        }

        .marketItem::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.08), transparent);
          transform: translateX(-120%);
          transition: 0.6s;
        }

        .marketItem:hover::after {
          transform: translateX(120%);
        }

        .marketItem img {
          width: 84px;
          height: 84px;
          object-fit: contain;
          border-radius: 24px;
          background: transparent;
          padding: 0;
          box-shadow: none;
          filter:
            drop-shadow(0 10px 24px rgba(0,0,0,0.45))
            brightness(1.08);
          transition: transform .25s ease;
        }

        .marketItem:hover img {
          transform: scale(1.08);
        }

        .marketItem span {
          font-size: 24px;
          font-weight: 950;
          letter-spacing: -0.03em;
        }


        .premiumShowcaseGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .premiumShowcaseCard {
          position: relative;
          overflow: hidden;
          border-radius: 34px;
          aspect-ratio: 3/4;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 30px 90px rgba(0,0,0,0.42);
        }

        .premiumShowcaseCard img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: opacity 0.35s ease, transform 0.45s ease;
        }

        .premiumShowcaseCard:hover img {
          transform: scale(1.04);
        }

        .premiumShowcaseOverlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px;
          background: linear-gradient(to top, rgba(0,0,0,0.72), transparent 55%);
        }

        .premiumShowcaseOverlay span {
          width: max-content;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.14);
          backdrop-filter: blur(12px);
          font-size: 12px;
          font-weight: 900;
        }

        .premiumShowcaseOverlay strong {
          font-size: 22px;
          line-height: 1.15;
        }

        @media (max-width: 1100px) {
          .hero {
            grid-template-columns: 1fr;
            gap: 48px;
            padding-top: 70px;
          }

          .marketplaceStrip,
          .stepsGrid,
          .featureGrid,
          .showcaseGrid,
          .compareGrid,
          .platformGrid,
          .proofTop,
          .proofStats,
          .reviewGrid {
            grid-template-columns: 1fr 1fr;
          }

          .footer {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 720px) {
          .nav {
            flex-direction: column;
            gap: 18px;
            padding: 18px;
          }

          nav {
            flex-wrap: wrap;
            justify-content: center;
            gap: 18px;
          }

          .marketplaceStrip,
          .stepsGrid,
          .featureGrid,
          .showcaseGrid,
          .compareGrid,
          .platformGrid,
          .proofTop,
          .proofStats,
          .reviewGrid {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: 54px;
          }

          h2 {
            font-size: 42px;
          }

          .heroText,
          .sectionHead p,
          .ctaBox p {
            font-size: 16px;
          }

          .statsRow {
            flex-direction: column;
          }

          .ctaBox {
            padding: 60px 24px;
          }

          .footerLinks {
            gap: 18px;
          }
        }

        @media (max-width: 520px) {
          .hero,
          .marketplaceStrip,
          .howSection,
          .featureSection,
          .showcaseSection,
          .ctaSection,
          .footer {
            padding-left: 18px;
            padding-right: 18px;
          }

          h1 {
            font-size: 42px;
          }

          .generatorCard {
            padding: 14px;
            border-radius: 28px;
          }

          .mainPreview {
            border-radius: 22px;
          }

          .miniCard {
            border-radius: 18px;
          }

          .ctaBox {
            border-radius: 28px;
          }
        }

        @media (max-width: 720px) {
          .pricingModal {
            align-items: flex-start;
            padding: 12px;
            overflow-y: auto;
          }

          .pricingBox {
            width: 100%;
            max-height: none;
            padding: 26px 16px;
            border-radius: 28px;
            overflow-x: hidden;
          }

          .modalClose {
            top: 14px;
            right: 14px;
            width: 42px;
            height: 42px;
            font-size: 26px;
          }

          .pricingHeader {
            padding-top: 42px;
            margin-bottom: 24px;
          }

          .pricingHeader h2 {
            font-size: 38px;
            line-height: 1;
            letter-spacing: -0.05em;
          }

          .pricingHeader p {
            font-size: 16px;
            line-height: 1.55;
          }

          .tariffGrid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .tariffCard,
          .tariffCard.popular {
            transform: none;
            width: 100%;
            padding: 24px;
            border-radius: 28px;
          }

          .tariffCard h3 {
            font-size: 36px;
            line-height: 1.05;
          }

          .tariffCard p {
            min-height: auto;
            font-size: 16px;
          }

          .popularBadge {
            position: static;
            width: max-content;
            margin-bottom: 14px;
          }

          .premiumShowcaseGrid {
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }

          .premiumShowcaseCard {
            border-radius: 22px;
          }

          .premiumShowcaseOverlay {
            padding: 12px;
          }

          .premiumShowcaseOverlay span {
            font-size: 10px;
            padding: 6px 8px;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .premiumShowcaseOverlay strong {
            font-size: 14px;
            line-height: 1.15;
          }

          .showcaseSection .sectionHead h2 {
            font-size: 42px;
            line-height: 1;
          }

          .showcaseSection .sectionHead p {
            font-size: 16px;
            line-height: 1.55;
          }
        }

        @media (max-width: 430px) {
          .premiumShowcaseGrid {
            grid-template-columns: 1fr 1fr;
          }

          .premiumShowcaseOverlay strong {
            font-size: 13px;
          }

          .pricingHeader h2 {
            font-size: 34px;
          }

          .tariffCard h3 {
            font-size: 32px;
          }
        }

      `}</style>
    </main>
  )
}
