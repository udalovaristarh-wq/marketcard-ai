"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const API_BASE = "http://localhost:8000";

  const validatePassword = (value: string) => {
    const hasMinLength = value.length >= 8
    const hasUppercase = /[A-ZА-Я]/.test(value)
    const hasLowercase = /[a-zа-я]/.test(value)
    const hasDigit = /\d/.test(value)

    return hasMinLength && hasUppercase && hasLowercase && hasDigit
  }

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Заполните обязательные поля")
      return
    }

    if (!validatePassword(password)) {
      alert(
        "Пароль должен содержать минимум 8 символов, заглавные и строчные буквы, а также цифры"
      )
      return
    }

    try {
      setLoading(true)

       const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: name,
          email,
          password,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        let message = "Ошибка регистрации"

        if (typeof data?.detail === "string") {
          message = data.detail
        } else if (Array.isArray(data?.detail)) {
          message = data.detail
            .map((item: any) => item?.msg || JSON.stringify(item))
            .join("\n")
        } else if (data?.detail) {
          message = JSON.stringify(data.detail, null, 2)
        } else if (data) {
          message = JSON.stringify(data, null, 2)
        }

        alert(message)
        return
      }

      alert("Регистрация прошла успешно. Теперь войдите в аккаунт.")
      router.push("/login")
    } catch (error) {
      console.error("REGISTER ERROR:", error)
      alert("Ошибка соединения с сервером")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(59,130,246,0.24), transparent 28%), radial-gradient(circle at bottom right, rgba(34,197,94,0.18), transparent 24%), linear-gradient(135deg,#071226,#0b1730,#101827)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          borderRadius: "28px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
          backdropFilter: "blur(18px)",
          padding: "32px",
        }}
      >
        <button
          onClick={() => router.push("/")}
          style={{
            marginBottom: "20px",
            padding: "10px 14px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
            cursor: "pointer",
            fontWeight: 800,
          }}
        >
          ← Назад
        </button>

        <h1
          style={{
            fontSize: "38px",
            fontWeight: 900,
            margin: "0 0 10px",
          }}
        >
          Регистрация
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            fontSize: "17px",
            lineHeight: 1.6,
            marginBottom: "24px",
            fontWeight: 700,
          }}
        >
          Создайте аккаунт, чтобы выбрать тариф и активировать доступ к сервису.
        </p><div style={{ display: "grid", gap: "16px" }}>
          <input
            type="text"
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: "120px" }}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "rgba(255,255,255,0.08)",
                color: "white",
                borderRadius: "10px",
                padding: "8px 12px",
                cursor: "pointer",
                fontWeight: 800,
              }}
            >
              {showPassword ? "Скрыть" : "Показать"}
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: "14px",
            color: "#cbd5e1",
            fontSize: "14px",
            lineHeight: 1.5,
          }}
        >
          Пароль: минимум 8 символов, заглавные и строчные буквы, цифры.
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            marginTop: "24px",
            width: "100%",
            padding: "18px",
            borderRadius: "16px",
            border: "none",
            background: "linear-gradient(135deg,#22c55e,#16a34a)",
            color: "white",
            cursor: loading ? "default" : "pointer",
            fontSize: "20px",
            fontWeight: 900,
            boxShadow: "0 16px 30px rgba(0,0,0,0.24)",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </button>

        <div
          style={{
            marginTop: "18px",
            textAlign: "center",
            color: "#cbd5e1",
            fontWeight: 700,
          }}
        >
          Уже есть аккаунт?{" "}
          <span
            onClick={() => router.push("/login")}
            style={{
              color: "#60a5fa",
              cursor: "pointer",
              fontWeight: 900,
            }}
          >
            Войти
          </span>
        </div>
      </div>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "16px 18px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
}