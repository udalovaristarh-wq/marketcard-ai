import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarketCard AI — Премиальные AI-карточки для маркетплейсов",
  description:
    "Превращаем одно фото в продающую карточку для Uzum, Wildberries, Ozon и Yandex Market. AI-генерация за 25 секунд.",
  keywords: [
    "маркетплейс",
    "карточки товаров",
    "AI",
    "искусственный интеллект",
    "Uzum",
    "Wildberries",
    "Ozon",
  ],
  authors: [{ name: "MarketCard AI" }],
  openGraph: {
    title: "MarketCard AI — Премиальные AI-карточки для маркетплейсов",
    description: "Превращаем одно фото в продающую карточку за 25 секунд",
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
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark bg-background">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
