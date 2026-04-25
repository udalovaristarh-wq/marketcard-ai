"use client"
import { usePathname } from "next/navigation"
import SupportWidgetGate from "./components/support-widget/SupportWidgetGate"
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <html lang="ru">
      
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "MarketCard AI",
              url: "https://marketcard.uz",
              logo: "https://marketcard.uz/logo.jpg",
              sameAs: [
                "https://www.instagram.com/marketcard.ai",
                "https://t.me/marketcardai_support_bot"
              ]
            }),
          }}
        />

      <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#0b0f1a" }}>
        {children}
        {pathname !== "/about" && <SupportWidgetGate />}
      </body>
    </html>
  )
}
