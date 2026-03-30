"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [forgotMode, setForgotMode] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)

  const API_BASE = "http://localhost:8000"

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Заполните email и пароль")
      return
    }

    try {
      setLoading(true)

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        let message = "Ошибка входа"
        if (typeof data?.detail === "string") {
          message = data.detail
        } else if (data) {
          message = JSON.stringify(data, null, 2)
        }
        alert(message)
        return
      }

      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("user_email", email)
      router.push("/dashboard")
    } catch (error) {
      console.error(error)
      alert("Ошибка соединения с сервером")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      alert("Введите email")
      return
    }

    try {
      setForgotLoading(true)

      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: forgotEmail,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        let message = "Ошибка отправки письма"
        if (typeof data?.detail === "string") {
          message = data.detail
        } else if (data) {
          message = JSON.stringify(data, null, 2)
        }
        alert(message)
        return
      }

      alert("Если такая почта существует, письмо для сброса пароля отправлено")
      setForgotMode(false)
      setForgotEmail("")
    } catch (error) {
      console.error(error)
      alert("Ошибка соединения с сервером")
    } finally {
      setForgotLoading(false)
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
        </button><h1
          style={{
            fontSize: "38px",
            fontWeight: 900,
            margin: "0 0 10px",
          }}
        >
          {forgotMode ? "Сброс пароля" : "Вход"}
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
          {forgotMode
            ? "Введите email, и мы отправим письмо для сброса пароля."
            : "Войдите в аккаунт, чтобы пользоваться сервисом."}
        </p>

        {!forgotMode ? (
          <>
            <div style={{ display: "grid", gap: "16px" }}>
              <input
                type="email"
                placeholder="Электронная почта"
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
                textAlign: "right",
              }}
            >
              <span
                onClick={() => {
                  setForgotMode(true)
                  setForgotEmail(email)
                }}
                style={{
                  color: "#60a5fa",
                  cursor: "pointer",
                  fontWeight: 800,
                  fontSize: "14px",
                }}
              >
                Забыли пароль?
              </span>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                marginTop: "24px",
                width: "100%",
                padding: "18px",
                borderRadius: "16px",
                border: "none",
                background: "linear-gradient(135deg,#f59e0b,#ea580c)",
                color: "white",
                cursor: loading ? "default" : "pointer",
                fontSize: "20px",
                fontWeight: 900,
                boxShadow: "0 16px 30px rgba(0,0,0,0.24)",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Вход..." : "Войти"}
            </button>

            <div
              style={{
                marginTop: "18px",
                textAlign: "center",
                color: "#cbd5e1",
                fontWeight: 700,
              }}
            >
              Нет аккаунта?{" "}
              <span
                onClick={() => router.push("/register")}
                style={{
                  color: "#60a5fa",
                  cursor: "pointer",
                  fontWeight: 900,
                }}>
                Зарегистрироваться
              </span>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "grid", gap: "16px" }}>
              <input
                type="email"
                placeholder="Электронная почта"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                style={inputStyle}
              />
            </div>

            <button
              onClick={handleForgotPassword}
              disabled={forgotLoading}
              style={{
                marginTop: "24px",
                width: "100%",
                padding: "18px",
                borderRadius: "16px",
                border: "none",
                background: "linear-gradient(135deg,#2563eb,#06b6d4)",
                color: "white",
                cursor: forgotLoading ? "default" : "pointer",
                fontSize: "20px",
                fontWeight: 900,
                boxShadow: "0 16px 30px rgba(0,0,0,0.24)",
                opacity: forgotLoading ? 0.7 : 1,
              }}
            >
              {forgotLoading ? "Отправка..." : "Отправить письмо"}
            </button>

            <div
              style={{
                marginTop: "18px",
                textAlign: "center",
                color: "#cbd5e1",
                fontWeight: 700,
              }}
            >
              <span
                onClick={() => setForgotMode(false)}
                style={{
                  color: "#60a5fa",
                  cursor: "pointer",
                  fontWeight: 900,
                }}
              >
                ← Вернуться ко входу
              </span>
            </div>
          </>
        )}
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