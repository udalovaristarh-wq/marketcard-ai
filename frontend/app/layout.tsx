"use client"
import { usePathname } from "next/navigation"
import SupportWidgetGate from "./components/support-widget/SupportWidgetGate"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <html lang="ru">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#0b0f1a" }}>
        {children}
        {pathname !== "/about" && <SupportWidgetGate />}
      </body>
    </html>
  )
}
