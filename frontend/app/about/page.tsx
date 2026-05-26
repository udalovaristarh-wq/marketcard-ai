import type { Metadata } from "next";
import PremiumAboutPage from "./components/premium/PremiumAboutPage";

export const metadata: Metadata = {
  title: "MarketCard AI — Premium AI cards for marketplaces",
  description:
    "MarketCard AI превращает одно фото товара в продающие карточки, SEO, аудит и visual assets для Uzum, Wildberries, Ozon и Yandex Market.",
};

export default function AboutPage() {
  return <PremiumAboutPage />;
}
