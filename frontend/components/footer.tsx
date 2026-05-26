"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "@/components/icons";

const footerLinks = {
  product: [
    { label: "Возможности", href: "#features" },
    { label: "Примеры", href: "#examples" },
    { label: "Тарифы", href: "#pricing" },
    { label: "О нас", href: "/about" },
  ],
  marketplaces: [
    { label: "Uzum", href: "#" },
    { label: "Wildberries", href: "#" },
    { label: "Ozon", href: "#" },
    { label: "Yandex Market", href: "#" },
  ],
  legal: [
    { label: "Политика конфиденциальности", href: "/privacy" },
    { label: "Условия использования", href: "/terms" },
    { label: "Оферта", href: "/offer" },
  ],
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 px-4 pb-8 pt-16 sm:px-6">
      <div className="absolute inset-0 bg-gradient-to-t from-black/[0.44] to-transparent" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Link href="/" className="mb-5 flex items-center gap-3">
              <span className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-black">
                <Image src="/logo.jpg" alt="MarketCard AI" fill sizes="48px" className="object-cover" />
              </span>
              <span className="text-xl font-black text-white">
                MarketCard <span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-7 text-white/[0.56]">
              AI-сервис для создания продающих карточек товаров для маркетплейсов Узбекистана и СНГ.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="mailto:hello@marketcard.uz"
                className="flex items-center gap-2 text-sm text-white/[0.52] transition hover:text-white"
              >
                <Mail className="h-4 w-4" />
                hello@marketcard.uz
              </a>
              <a
                href="https://t.me/marketcardai_support_bot"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-white/[0.52] transition hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Telegram support
              </a>
              <span className="flex items-center gap-2 text-sm text-white/[0.52]">
                <MapPin className="h-4 w-4" />
                Ташкент, Узбекистан
              </span>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://t.me/marketcardai_support_bot"
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] transition hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-white/[0.08]"
                aria-label="Telegram MarketCard AI"
              >
                <Image src="/social/telegram.svg" alt="" width={22} height={22} />
              </a>
              <a
                href="https://www.instagram.com/marketcard.ai"
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] transition hover:-translate-y-0.5 hover:border-fuchsia-300/35 hover:bg-white/[0.08]"
                aria-label="Instagram MarketCard AI"
              >
                <Image src="/social/instagram.svg" alt="" width={22} height={22} />
              </a>
            </div>
          </motion.div>

          <FooterColumn title="Продукт" links={footerLinks.product} delay={0.1} />
          <FooterColumn title="Маркетплейсы" links={footerLinks.marketplaces} delay={0.2} />
          <FooterColumn title="Правовая информация" links={footerLinks.legal} delay={0.3} />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/[0.42]">© 2026 MarketCard AI • Все права защищены</p>
          <p className="text-xs text-white/[0.36]">Сделано в Узбекистане для продавцов, которые запускают быстрее.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  delay,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <h4 className="mb-4 font-bold text-white">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-sm text-white/50 transition hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
