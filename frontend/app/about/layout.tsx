import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "О нас — MarketCard AI",
  description:
    "MarketCard AI — AI-платформа для продавцов Uzum, Wildberries, Ozon и Yandex Market.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
