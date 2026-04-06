"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  email: string;
  full_name?: string | null;
  tariff_name: string | null;
  tariff_active?: boolean;
  generations_total: number;
  generations_used: number;
  generations_left: number;
  is_admin?: boolean;
  is_banned?: boolean;
  ban_reason?: string | null;
  created_at?: string | null;
  last_login?: string | null;
};

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

const loadUsers = async () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    setError("Нет токена. Сначала войди в аккаунт.");
    setLoading(false);
    return;
  }

  const res = await fetch("https://marketcard.uz/api/admin/users", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.detail || "Ошибка загрузки пользователей");
  }

  if (!Array.isArray(data)) {
    throw new Error("Сервер вернул не список пользователей");
  }

  setUsers(data);
};

const banUser = async (userId: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    setError("Нет токена. Сначала войди в аккаунт.");
    return;
  }

  const reasonOptions = [
  "Спам",
  "Злоупотребление генерацией",
  "Попытка взлома",
  "Оскорбления / токсичность",
  "Нарушение правил сервиса",
  "Мошенничество",
  "Другое",
];

const reasonText = window.prompt(
  "Причина бана:\n1 - Спам\n2 - Злоупотребление генерацией\n3 - Попытка взлома\n4 - Оскорбления / токсичность\n5 - Нарушение правил сервиса\n6 - Мошенничество\n7 - Другое",
  "5"
);

if (reasonText === null) return;

let reason = "Нарушение правил сервиса";

if (reasonText.trim() === "1") reason = reasonOptions[0];
else if (reasonText.trim() === "2") reason = reasonOptions[1];
else if (reasonText.trim() === "3") reason = reasonOptions[2];
else if (reasonText.trim() === "4") reason = reasonOptions[3];
else if (reasonText.trim() === "5") reason = reasonOptions[4];
else if (reasonText.trim() === "6") reason = reasonOptions[5];
else if (reasonText.trim() === "7") {
  const customReason = window.prompt("Введи свою причину бана:", "Другое");
  if (customReason === null) return;
  reason = customReason.trim() || "Другое";
}

  try {
    setActionLoadingId(userId);
    setError("");

    const res = await fetch("https://marketcard.uz/api/admin/ban-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userId,
        reason,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.detail || "Ошибка бана");
    }

    await loadUsers();
  } catch (err: any) {
    setError(err?.message || "Ошибка");
  } finally {
    setActionLoadingId(null);
  }
};

const unbanUser = async (userId: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    setError("Нет токена. Сначала войди в аккаунт.");
    return;
  }

  try {
    setActionLoadingId(userId);
    setError("");

    const res = await fetch("https://marketcard.uz/api/admin/unban-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.detail || "Ошибка разбана");
    }

    await loadUsers();
  } catch (err: any) {
    setError(err?.message || "Ошибка");
  } finally {
    setActionLoadingId(null);
  }
};
const verifyPassword = async () => {
  try {
    setCheckingPassword(true);

    const token = localStorage.getItem("access_token");

    const res = await fetch("https://marketcard.uz/api/admin/verify-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        password: adminPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Ошибка проверки пароля");
    }

    setIsVerified(true);
  } catch (err: any) {
    setError(err.message || "Ошибка");
  } finally {
    setCheckingPassword(false);
  }
};

  useEffect(() => {
    if (!isVerified) {
      setLoading(false);
      return;
    }

    if (!isVerified) {
  setLoading(false);
  return;
}

setLoading(true);

loadUsers()
  .catch((err: any) => {
    setError(err?.message || "Ошибка");
    setUsers([]);
  })
  .finally(() => {
    setLoading(false);
  });
  }, [isVerified]);

if (!isVerified) {
  return (
    <main style={{ minHeight: "100vh", background: "#0b1220", color: "white", padding: "40px 20px" }}>
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "20px" }}>
          Введите пароль администратора
        </h1>

        <input
          type="password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          placeholder="Пароль"
        />

        <button onClick={verifyPassword}>
          Войти
        </button>

        {error && <div>{error}</div>}
      </div>
    </main>
  );
}


  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b1220",
        color: "white",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "36px", fontWeight: 900, marginBottom: "20px" }}>
          Админ-панель
        </h1>

        {loading && (
          <div
            style={{
              padding: "18px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.06)",
              marginBottom: "20px",
            }}
          >
            Загрузка пользователей...
          </div>
        )}

        {!loading && error && (
          <div
            style={{
              padding: "18px",
              borderRadius: "14px",
              background: "rgba(255,80,80,0.12)",
              border: "1px solid rgba(255,80,80,0.35)",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && (
          <div style={{ display: "grid", gap: "12px" }}>
            {users.length === 0 ? (
              <div
                style={{
                  padding: "18px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                Пользователей нет
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.05)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div>
  <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
  <div style={{ fontWeight: 700 }}>ID: {user.id}</div>

  {user.is_banned ? (
    <button
      onClick={() => unbanUser(user.id)}
      disabled={actionLoadingId === user.id}
      style={{
        background: "#1f9d55",
        color: "white",
        border: "none",
        padding: "10px 14px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: 700,
      }}
    >
      {actionLoadingId === user.id ? "..." : "Разбанить"}
    </button>
  ) : (
    <button
      onClick={() => banUser(user.id)}
      disabled={actionLoadingId === user.id || user.is_admin}
      style={{
        background: user.is_admin ? "#666" : "#c0392b",
        color: "white",
        border: "none",
        padding: "10px 14px",
        borderRadius: "10px",
        cursor: user.is_admin ? "not-allowed" : "pointer",
        fontWeight: 700,
      }}
    >
      {actionLoadingId === user.id ? "..." : user.is_admin ? "Админ" : "Забанить"}
    </button>
  )}
</div>

  <div style={{ fontSize: "14px", opacity: 0.75 }}>
    Имя: {user.full_name || "—"}
  </div>

  <div style={{ fontSize: "14px", opacity: 0.75 }}>
    Тариф: {user.tariff_name || "Нет"}
  </div>

  <div style={{ fontSize: "14px", opacity: 0.75 }}>
    Активен: {user.tariff_active ? "Да" : "Нет"}
  </div>

  <div style={{ fontSize: "14px", opacity: 0.75 }}>
    Генераций всего: {user.generations_total}
  </div>

  <div style={{ fontSize: "14px", opacity: 0.75 }}>
    Использовано: {user.generations_used}
  </div>

  <div style={{ fontSize: "14px", opacity: 0.75 }}>
    Осталось: {user.generations_left}
  </div>

  <div style={{ fontSize: "14px", opacity: 0.75 }}>
    Забанен: {user.is_banned ? "Да" : "Нет"}
  </div>

  <div style={{ fontSize: "14px", opacity: 0.75 }}>
    Причина бана: {user.ban_reason || "—"}
  </div>

  <div style={{ fontSize: "14px", opacity: 0.75 }}>
    Дата регистрации: {user.created_at ? new Date(user.created_at).toLocaleString() : "—"}
  </div>

  <div style={{ fontSize: "14px", opacity: 0.75 }}>
    Последний вход: {user.last_login ? new Date(user.last_login).toLocaleString() : "—"}
  </div>
</div>

<div style={{ fontWeight: 700 }}>
  ID: {user.id}
</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
