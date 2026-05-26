"use client";

import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 p-[1px]">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-background">
                  <Image src="/logo.jpg" alt="MarketCard AI" width={38} height={38} className="h-full w-full object-cover" />
                </div>
              </div>
              <span className="text-lg font-semibold text-foreground">
                MarketCard <span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">AI-платформа для создания продающих карточек товаров на маркетплейсах.</p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Продукт</h4>
            <ul className="space-y-3">
              {["Генератор карточек", "SEO-аудит", "Pipeline", "API"].map((item) => (
                <li key={item}>
                  <Link href="/pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Маркетплейсы</h4>
            <ul className="space-y-3">
              {["Uzum", "Wildberries", "Ozon", "Yandex Market"].map((item) => (
                <li key={item}>
                  <Link href="/pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Компания</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  О нас
                </Link>
              </li>
              <li>
                <a href="https://t.me/marketcardai_support_bot" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Telegram
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/marketcard.ai" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://t.me/marketcardai_support_bot" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Поддержка
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">2026 MarketCard AI. Все права защищены.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
