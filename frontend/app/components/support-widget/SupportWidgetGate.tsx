"use client";

import { usePathname } from "next/navigation";
import SupportWidget from "./SupportWidget";

export default function SupportWidgetGate() {
  const pathname = usePathname();

  // ❌ скрываем только на внешних страницах
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  // ✅ внутри сайта показываем
  return <SupportWidget />;
}
