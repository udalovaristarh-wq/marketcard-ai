"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "@/components/icons";

const navLinks = [
  { href: "#how-it-works", label: "Как работает" },
  { href: "#features", label: "Возможности" },
  { href: "#examples", label: "Примеры" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#pricing", label: "Тарифы" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 py-4 sm:px-4"
    >
      <nav className="mx-auto max-w-7xl">
        <div className="glass-strong rounded-2xl px-4 py-3 shadow-[0_20px_90px_rgba(0,0,0,0.28)] sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="group flex min-w-0 items-center gap-3">
              <span className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black">
                <Image
                  src="/logo.jpg"
                  alt="MarketCard AI"
                  fill
                  sizes="44px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  priority
                />
              </span>
              <span className="hidden text-lg font-bold tracking-tight text-white sm:block">
                MarketCard <span className="gradient-text">AI</span>
              </span>
            </Link>

            <div className="hidden items-center gap-7 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/[0.58] transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-white/[0.68] transition hover:bg-white/5 hover:text-white"
              >
                Войти
              </Link>
              <Link
                href="/register"
                className="premium-reflection rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-black shadow-[0_0_36px_rgba(56,189,248,0.35)] transition hover:scale-[1.02]"
              >
                Попробовать бесплатно
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((value) => !value)}
              className="rounded-xl p-2 text-white transition hover:bg-white/10 md:hidden"
              aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {mobileMenuOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="overflow-hidden md:hidden"
            >
              <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm text-white/[0.68] transition hover:bg-white/5 hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
                <Link
                  href="/register"
                  className="mt-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-4 py-3 text-center text-sm font-semibold text-black"
                >
                  Попробовать бесплатно
                </Link>
              </div>
            </motion.div>
          ) : null}
        </div>
      </nav>
    </motion.header>
  );
}
