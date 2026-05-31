import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import GlobalLanguageSwitcher from "./components/GlobalLanguageSwitcher";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarketCard AI - Создавай продающие карточки за 30 секунд",
  description:
    "ИИ-сервис для создания инфографики и продающих карточек для Wildberries, Ozon, Uzum и Yandex Market. Премиум качество за секунды.",
  keywords: [
    "маркетплейс",
    "карточки товаров",
    "AI",
    "искусственный интеллект",
    "Uzum",
    "Wildberries",
    "Ozon",
    "Yandex Market",
  ],
  authors: [{ name: "MarketCard AI" }],
  openGraph: {
    title: "MarketCard AI - Создавай продающие карточки за 30 секунд",
    description:
      "AI-платформа для премиальной инфографики и запуска товаров на маркетплейсах.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru" className="dark bg-background">
      <body className="min-h-screen font-sans antialiased">
        {children}
        <GlobalLanguageSwitcher />
      </body>
    </html>
  );
}
