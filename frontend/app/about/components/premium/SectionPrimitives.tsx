"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import styles from "./premium-about.module.css";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionShell({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`${styles.sectionShell} ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  text,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  text: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal
      className={
        align === "center"
          ? "mx-auto mb-12 max-w-3xl text-center"
          : "mb-12 max-w-3xl"
      }
    >
      <div className={styles.eyebrow}>{eyebrow}</div>
      <h2 className="mt-4 text-balance text-4xl font-semibold tracking-normal text-white md:text-6xl">
        {title}
      </h2>
      <p className="mt-5 text-pretty text-base leading-8 text-slate-300 md:text-lg">
        {text}
      </p>
    </Reveal>
  );
}

export function PremiumButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -2, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className={
        variant === "primary"
          ? styles.primaryButton
          : styles.secondaryButton
      }
    >
      {children}
    </motion.a>
  );
}

export function GlassPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${styles.glassPanel} ${className}`}>{children}</div>;
}
