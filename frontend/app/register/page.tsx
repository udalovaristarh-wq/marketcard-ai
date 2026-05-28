"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { ArrowLeft, Check, Eye, EyeOff, Lock, Mail, Sparkles, User } from "@/components/icons";

const marketplaces = [
  { name: "Uzum", color: "from-emerald-300 to-teal-500", icon: "U" },
  { name: "Wildberries", color: "from-purple-400 to-pink-500", icon: "W" },
  { name: "Ozon", color: "from-blue-400 to-cyan-500", icon: "O" },
  { name: "Яндекс Маркет", color: "from-amber-300 to-orange-500", icon: "Я" },
];

const benefits = [
  "5 карточек бесплатно",
  "Без водяного знака",
  "SEO-оптимизация текстов",
  "Все маркетплейсы",
];

type ApiErrorItem = {
  msg?: string;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: { client_id: string; callback: (response: { credential?: string }) => void }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_BASE = "/api";
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || typeof window === "undefined") return;
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, [GOOGLE_CLIENT_ID]);

  const finishAuth = (token: string, emailLabel: string) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("user_email", emailLabel);
    router.push("/dashboard");
  };

  const handleGoogleRegister = async () => {
    if (!agreed) {
      alert("Для регистрации нужно принять условия оферты.");
      return;
    }
    if (!GOOGLE_CLIENT_ID) {
      alert("Google регистрация не настроена. Добавьте NEXT_PUBLIC_GOOGLE_CLIENT_ID и GOOGLE_CLIENT_ID.");
      return;
    }

    const runPrompt = () => {
      window.google?.accounts?.id?.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          if (!response.credential) {
            alert("Google не вернул токен регистрации");
            return;
          }
          const res = await fetch(`${API_BASE}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_token: response.credential, offer_accepted: agreed }),
          });
          const data = await res.json().catch(() => null);
          if (!res.ok || !data?.access_token) {
            alert(typeof data?.detail === "string" ? data.detail : "Ошибка Google регистрации");
            return;
          }
          finishAuth(data.access_token, "google-user");
        },
      });
      window.google?.accounts?.id?.prompt();
    };

    if (window.google?.accounts?.id) {
      runPrompt();
      return;
    }

    setTimeout(runPrompt, 700);
  };

  const validatePassword = (value: string) => {
    const hasMinLength = value.length >= 8;
    const hasUppercase = /[A-ZА-ЯЁ]/.test(value);
    const hasLowercase = /[a-zа-яё]/.test(value);
    const hasDigit = /\d/.test(value);

    return hasMinLength && hasUppercase && hasLowercase && hasDigit;
  };

  const passwordStrength = () => {
    if (password.length === 0) {
      return { width: "0%", bar: "bg-white/10", text: "", textClass: "text-white/[0.46]" };
    }
    if (!validatePassword(password) && password.length < 6) {
      return { width: "33%", bar: "bg-red-400", text: "Слабый", textClass: "text-red-300" };
    }
    if (!validatePassword(password)) {
      return { width: "66%", bar: "bg-amber-400", text: "Средний", textClass: "text-amber-300" };
    }
    return { width: "100%", bar: "bg-emerald-400", text: "Надёжный", textClass: "text-emerald-300" };
  };

  const strength = passwordStrength();

  const handleRegister = async () => {
    if (!name || !password || (authMethod === "email" ? !email : !phone)) {
      alert(authMethod === "email" ? "Заполните имя, email и пароль" : "Заполните имя, телефон и пароль");
      return;
    }

    if (!validatePassword(password)) {
      alert("Пароль должен содержать минимум 8 символов, заглавные и строчные буквы, а также цифры");
      return;
    }

    if (!agreed) {
      alert("Для регистрации нужно принять условия оферты и правила использования сервиса");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/auth/${authMethod === "phone" ? "phone/register" : "register"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          authMethod === "phone"
            ? {
                full_name: name,
                phone,
                password,
                offer_accepted: agreed,
              }
            : {
                full_name: name,
                email,
                password,
                offer_accepted: agreed,
                offer_accept_lang: "ru",
              }
        ),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        let message = "Ошибка регистрации";

        if (typeof data?.detail === "string") {
          message = data.detail;
        } else if (Array.isArray(data?.detail)) {
          message = data.detail
            .map((item: ApiErrorItem) => item?.msg || JSON.stringify(item))
            .join("\n");
        } else if (data?.detail) {
          message = JSON.stringify(data.detail, null, 2);
        } else if (data) {
          message = JSON.stringify(data, null, 2);
        }

        alert(message);
        return;
      }

      if (data?.access_token) {
        finishAuth(data.access_token, authMethod === "phone" ? phone : email);
        return;
      }

      alert("Регистрация прошла успешно. Теперь войдите в аккаунт.");
      router.push("/login");
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      alert("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleRegister();
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8 text-white sm:px-6">
      <AuthBackground />
      <div className="fixed inset-0 z-50 pointer-events-none noise-overlay" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <motion.aside
            initial={{ opacity: 0, x: -44 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <BrandLogo />
            <h1 className="mt-8 text-5xl font-black leading-tight tracking-tight">
              Присоединяйся к <span className="gradient-text">3,500+</span>
              <br />
              продавцам, которые
              <br />
              уже растут с нами
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/[0.62]">
              Создай аккаунт и получи 5 бесплатных карточек для любого маркетплейса.
              Начни продавать больше уже сегодня.
            </p>

            <div className="mt-8 space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.32 + index * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-300/[0.14] text-cyan-200">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="font-semibold text-white">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-9">
              <p className="mb-4 text-sm text-white/[0.48]">Работаем с маркетплейсами:</p>
              <MarketplacePills />
            </div>
          </motion.aside>

          <motion.section
            initial={{ opacity: 0, x: 44 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="premium-reflection relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.065] p-6 shadow-[0_0_90px_rgba(168,85,247,0.14)] backdrop-blur-2xl sm:p-8 lg:p-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-fuchsia-300/12"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full border border-cyan-300/12"
              />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute right-6 top-6"
              >
                <Sparkles className="h-6 w-6 text-cyan-200/40" />
              </motion.div>

              <div className="mb-8 lg:hidden">
                <BrandLogo compact />
              </div>

              <Link
                href="/"
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/[0.54] transition hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                На главную
              </Link>

              <div className="mb-8">
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-300/[0.08] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  Free AI Starter
                </p>
                <h2 className="text-3xl font-black tracking-tight lg:text-4xl">Регистрация</h2>
                <p className="mt-2 text-white/[0.54]">Создай аккаунт и получи 5 бесплатных карточек.</p>
              </div>

              <form className="space-y-5" onSubmit={onSubmit}>
                <AuthSwitch value={authMethod} onChange={setAuthMethod} />

                <AuthInput
                  label="Имя"
                  icon={<User className="h-5 w-5" />}
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={setName}
                />

                {authMethod === "email" ? (
                  <AuthInput
                    label="Email"
                    icon={<Mail className="h-5 w-5" />}
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={setEmail}
                  />
                ) : (
                  <AuthInput
                    label="Телефон"
                    icon={<span className="text-sm font-black">+998</span>}
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={setPhone}
                  />
                )}

                <AuthInput
                  label="Пароль"
                  icon={<Lock className="h-5 w-5" />}
                  type={showPassword ? "text" : "password"}
                  placeholder="Минимум 8 символов"
                  value={password}
                  onChange={setPassword}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/[0.46] transition hover:text-white"
                      aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  }
                />

                {password.length > 0 ? (
                  <div className="space-y-1.5">
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: strength.width }}
                        className={`h-full rounded-full ${strength.bar}`}
                      />
                    </div>
                    <p className="text-xs text-white/[0.48]">
                      Надёжность: <span className={strength.textClass}>{strength.text}</span>
                    </p>
                  </div>
                ) : null}

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/[0.58] transition hover:bg-white/[0.06]">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(event) => setAgreed(event.target.checked)}
                    className="mt-1 h-4 w-4 accent-cyan-300"
                  />
                  <span>
                    Я принимаю{" "}
                    <Link href="/terms" className="font-semibold text-cyan-200 transition hover:text-white">
                      условия использования
                    </Link>{" "}
                    и{" "}
                    <Link href="/privacy" className="font-semibold text-cyan-200 transition hover:text-white">
                      политику конфиденциальности
                    </Link>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!agreed || loading}
                  className="premium-reflection inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-500 text-lg font-black text-black shadow-[0_0_38px_rgba(56,189,248,0.35)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? "Регистрация..." : "Создать аккаунт"}
                  <Sparkles className="h-5 w-5" />
                </button>
              </form>

              <Divider />
              <SocialButtons onGoogle={handleGoogleRegister} />

              <p className="text-center text-white/[0.56]">
                Уже есть аккаунт?{" "}
                <Link href="/login" className="font-bold text-cyan-200 transition hover:text-white">
                  Войти
                </Link>
              </p>
            </div>

            <div className="mt-8 lg:hidden">
              <p className="mb-4 text-center text-sm text-white/[0.48]">Работаем с маркетплейсами:</p>
              <MarketplacePills compact />
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}

function AuthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <video className="absolute inset-0 h-full w-full object-cover opacity-[0.18]" src="/register-bg.mp4" autoPlay loop muted playsInline />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-black" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute -right-32 top-1/3 h-[500px] w-[500px] rounded-full bg-fuchsia-500/20 blur-[120px]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute -left-32 bottom-1/4 h-[600px] w-[600px] rounded-full bg-cyan-400/20 blur-[120px]"
      />
    </div>
  );
}

function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <span className={`${compact ? "h-10 w-10" : "h-12 w-12"} relative overflow-hidden rounded-2xl border border-white/10 bg-black`}>
        <Image src="/logo.jpg" alt="MarketCard AI" fill sizes={compact ? "40px" : "48px"} className="object-cover" />
      </span>
      <span className={`${compact ? "text-lg" : "text-2xl"} font-black text-white`}>
        MarketCard <span className="gradient-text">AI</span>
      </span>
    </Link>
  );
}

function MarketplacePills({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex flex-wrap ${compact ? "justify-center gap-2" : "gap-3"}`}>
      {marketplaces.map((mp, index) => (
        <motion.div
          key={mp.name}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48 + index * 0.08 }}
          className={`glass-strong flex items-center gap-2 rounded-xl ${compact ? "px-3 py-2" : "px-4 py-3"} transition hover:scale-105`}
        >
          <span className={`${compact ? "h-6 w-6" : "h-8 w-8"} flex items-center justify-center rounded-lg bg-gradient-to-br ${mp.color} text-xs font-black text-white`}>
            {mp.icon}
          </span>
          <span className={`${compact ? "text-xs" : "text-sm"} font-semibold text-white`}>{mp.name}</span>
        </motion.div>
      ))}
    </div>
  );
}

function AuthInput({
  label,
  icon,
  type,
  placeholder,
  value,
  onChange,
  rightElement,
}: {
  label: string;
  icon: ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  rightElement?: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-white/[0.78]">{label}</span>
      <span className="relative block">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/[0.42]">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-14 w-full rounded-2xl border border-white/12 bg-black/30 py-4 pl-12 pr-12 text-base font-semibold text-white outline-none transition placeholder:text-white/[0.32] focus:border-cyan-300/60 focus:bg-black/40 focus:ring-4 focus:ring-cyan-300/10"
        />
        {rightElement}
      </span>
    </label>
  );
}

function AuthSwitch({
  value,
  onChange,
}: {
  value: "email" | "phone";
  onChange: (value: "email" | "phone") => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/25 p-1">
      {[
        ["email", "Email"],
        ["phone", "Телефон"],
      ].map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key as "email" | "phone")}
          className={`h-11 rounded-xl text-sm font-black transition ${
            value === key
              ? "bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-black shadow-[0_0_24px_rgba(56,189,248,0.24)]"
              : "text-white/55 hover:bg-white/[0.06] hover:text-white"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Divider() {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/10" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-[#151626] px-4 text-sm text-white/[0.46]">или</span>
      </div>
    </div>
  );
}

function SocialButtons({ onGoogle }: { onGoogle: () => void }) {
  return (
    <div className="mb-8 grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={onGoogle}
        className="flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-bold text-white transition hover:bg-white/[0.08]"
      >
        <GoogleIcon />
        Google
      </button>
      <a
        href="https://t.me/marketcardai_support_bot"
        target="_blank"
        rel="noreferrer"
        className="flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-bold text-white transition hover:bg-white/[0.08]"
      >
        <TelegramIcon />
        Telegram
      </a>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}
