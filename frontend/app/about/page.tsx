import type { Metadata } from "next";
import AboutLanding from "./components/v0/AboutLanding";

export const metadata: Metadata = {
  title: "MarketCard AI — Премиальные AI-карточки для маркетплейсов",
  description:
    "Превращаем одно фото в продающую карточку для Uzum, Wildberries, Ozon и Yandex Market. AI-генерация за 35-40 секунд.",
};

export default function AboutPage() {
  return <AboutLanding />;
}
