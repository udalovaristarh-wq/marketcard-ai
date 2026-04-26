"use client";

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function ResetPasswordInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const API_BASE = "/api"

  const handleResetPassword = async () => {
    if (!token) {
      alert("Токен сброса не найден")
      return
    }

    if (!newPassword || !confirmPassword) {
      alert("Заполните оба поля")
      return
    }

    if (newPassword !== confirmPassword) {
      alert("Пароли не совпадают")
      return
    }

    if (newPassword.length < 6) {
      alert("Пароль должен быть не короче 6 символов")
      return
    }

    try {
      setLoading(true)

      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          new_password: newPassword,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        let message = "Ошибка сброса пароля"
        if (typeof data?.detail === "string") {
          message = data.detail
        } else if (data) {
          message = JSON.stringify(data, null, 2)
        }
        alert(message)
        return
      }

      alert("Пароль успешно обновлён")
      router.push("/login")
    } catch (error) {
      console.error(error)
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
          onClick={() => router.push("/login")}
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
          Новый пароль
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
          Введите новый пароль для вашего аккаунта.
        </p>

        <div style={{ display: "grid", gap: "16px" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Новый пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={inputStyle}
          /><input
            type={showPassword ? "text" : "password"}
            placeholder="Повторите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              border: "none",
              background: "rgba(255,255,255,0.08)",
              color: "white",
              borderRadius: "10px",
              padding: "12px 14px",
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            {showPassword ? "Скрыть пароль" : "Показать пароль"}
          </button>
        </div>

        <button
          onClick={handleResetPassword}
          disabled={loading}
          style={{
            marginTop: "24px",
            width: "100%",
            padding: "18px",
            borderRadius: "16px",
            border: "none",
            background: "linear-gradient(135deg,#2563eb,#06b6d4)",
            color: "white",
            cursor: loading ? "default" : "pointer",
            fontSize: "20px",
            fontWeight: 900,
            boxShadow: "0 16px 30px rgba(0,0,0,0.24)",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Сохранение..." : "Сохранить новый пароль"}
        </button>
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
