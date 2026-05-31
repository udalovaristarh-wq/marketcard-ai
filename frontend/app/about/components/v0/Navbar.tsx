"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "./icons";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 right-0 left-0 z-50 px-4 py-4"
    >
      <nav className="mx-auto max-w-6xl">
        <div className="glass flex items-center justify-between rounded-2xl px-6 py-3">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 p-[1px] transition-all duration-300 group-hover:glow-cyan">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-background">
                <Image src="/logo.jpg" alt="MarketCard AI" width={38} height={38} className="h-full w-full object-cover" priority />
              </div>
            </div>
            <span className="hidden text-lg font-semibold text-foreground sm:block">
              MarketCard <span className="text-primary">AI</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="#before-after" className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground">
              До/После
            </Link>
            <Link href="#stats" className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground">
              Результаты
            </Link>
            <Link href="#pipeline" className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground">
              Pipeline
            </Link>
          </div>

          <div className="hidden md:block">
            <Link
              href="/login"
              className="relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:opacity-90 hover:glow-cyan"
            >
              Войти
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-foreground md:hidden" aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass mt-2 rounded-2xl p-4 md:hidden">
            <div className="flex flex-col gap-4">
              <Link href="#before-after" className="text-sm text-muted-foreground transition-colors hover:text-foreground" onClick={() => setIsOpen(false)}>
                До/После
              </Link>
              <Link href="#stats" className="text-sm text-muted-foreground transition-colors hover:text-foreground" onClick={() => setIsOpen(false)}>
                Результаты
              </Link>
              <Link href="#pipeline" className="text-sm text-muted-foreground transition-colors hover:text-foreground" onClick={() => setIsOpen(false)}>
                Pipeline
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 px-5 py-2.5 text-sm font-medium text-white">
                Войти
              </Link>
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
}
