import type { Metadata } from "next";
import PremiumAboutPage from "./components/premium/PremiumAboutPage";

export const metadata: Metadata = {
  title: "О нас — MarketCard AI",
  description:
    "MarketCard AI — AI-платформа для продавцов Uzum, Wildberries, Ozon и Yandex Market. Генерация карточек, SEO и аудит за минуты.",
  openGraph: {
    title: "О нас — MarketCard AI",
    description:
      "Превращаем одно фото товара в продающую карточку для маркетплейсов.",
  },
};

export default function AboutPage() {
  return <PremiumAboutPage />;
}
