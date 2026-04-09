"use client"

import TariffStatsBlock from "./TariffStatsBlock";
import ArpuStatsBlock from "./ArpuStatsBlock";
import TopUsersBlock from "./TopUsersBlock";

import FinanceBlock from "./FinanceBlock";

import { useEffect, useMemo, useState } from "react";

type User = {
  id: number;
  email: string;
  full_name: string | null;
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

  tariff_generations_total?: number
  tariff_generations_used?: number
  tariff_generations_left?: number
};

type UserErrorItem = {
  id: number;
  user_id: number;
  error_type: string;
  error_message: string;
  error_trace?: string | null;
  solution?: string | null;
  suggested_fix?: string | null;
  translated_message?: string | null;
  is_resolved: boolean;
  created_at?: string | null;
};

export default function AdminPage() {
  const cardStyle = {
    background: "#1e293b",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  };

  const smallStatStyle = {
    background: "#0f172a",
    padding: "16px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  };

  const [checkingPassword, setCheckingPassword] = useState(false);

  const verifyPassword = async () => {
    try {
      setCheckingPassword(true);
      setError("");
      setIsVerified(true);
    } finally {
      setCheckingPassword(false);
    }
  };

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [error, setError] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userErrors, setUserErrors] = useState<UserErrorItem[]>([]);
  const [errorsOpen, setErrorsOpen] = useState(false);
  const [errorsLoading, setErrorsLoading] = useState(false);
  const [errorsMessage, setErrorsMessage] = useState("");
  const [resolvingErrorId, setResolvingErrorId] = useState<number | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [search, setSearch] = useState("")
const [showAnalytics, setShowAnalytics] = useState(false)
const [systemLoad, setSystemLoad] = useState(35);
const [onlineCount, setOnlineCount] = useState(0);
const [onlineWindowMinutes, setOnlineWindowMinutes] = useState(5);


  const filteredUsers = users.filter((u) =>
    u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const formatDate = (value?: string | null) => {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Нет access_token");
        setUsers([]);
        return;
      }

      const res = await fetch("https://marketcard.uz/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.detail || "Ошибка загрузки пользователей");
      }

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (err: any) {
      console.error("loadUsers error:", err);
      setError(err?.message || "Ошибка загрузки пользователей");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  if (!isVerified) return;

  fetchAdminStats();
  fetchSystemLoad();
  fetchOnlineCount();

  const adminInterval = setInterval(fetchAdminStats, 10000);
  const systemInterval = setInterval(fetchSystemLoad, 5000);
  const onlineInterval = setInterval(fetchOnlineCount, 5000);

  return () => {
    clearInterval(adminInterval);
    clearInterval(systemInterval);
    clearInterval(onlineInterval);
  };
}, [isVerified]);
useEffect(() => {
    loadUsers();
  }, []);

  
  
  const fetchSystemLoad = async () => {
    try {
      const res = await fetch("https://marketcard.uz/api/system/stats");
      const data = await res.json().catch(() => null);
      if (!res.ok) return;

      setSystemLoad(Number(data?.load_percent ?? 0));
    } catch (err) {
      console.error("fetchSystemLoad error:", err);
    }
  };



const fetchOnlineCount = async () => {
  try {
    const res = await fetch("https://marketcard.uz/api/system/online-count");
    const data = await res.json().catch(() => null);
    if (!res.ok) return;

    setOnlineCount(Number(data?.online ?? 0));
    setOnlineWindowMinutes(Number(data?.window_minutes ?? 5));
  } catch (err) {
    console.error("fetchOnlineCount error:", err);
  }
};

const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const res = await fetch("https://marketcard.uz/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) return;

      setAdminStats(data);
      setSystemLoad(Number(data?.system?.load_percent ?? 0));
    } catch (err) {
      console.error("fetchAdminStats error:", err);
    }
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
      "5",
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

  const openUserErrors = async (user: User) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Нет токена. Сначала войди в аккаунт.");
      return;
    }

    try {
      setSelectedUser(user);
      setErrorsOpen(true);
      setErrorsLoading(true);
      setErrorsMessage("");
      setUserErrors([]);

      const res = await fetch(
        `https://marketcard.uz/api/admin/errors/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.detail || "Ошибка загрузки ошибок пользователя");
      }

      if (Array.isArray(data)) {
        setUserErrors(data);
      } else {
        setUserErrors([]);
      }
    } catch (err: any) {
      setErrorsMessage(err?.message || "Ошибка");
    } finally {
      setErrorsLoading(false);
    }
  };

  const closeUserErrors = () => {
    setErrorsOpen(false);
    setSelectedUser(null);
    setUserErrors([]);
    setErrorsMessage("");
  };

  const resolveError = async (errorId: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Нет токена. Сначала войди в аккаунт.");
      return;
    }

    try {
      setResolvingErrorId(errorId);

      const res = await fetch(
        `https://marketcard.uz/api/admin/errors/${errorId}/resolve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.detail || "Ошибка отметки решения");
      }

      setUserErrors((prev) =>
        prev.map((item) =>
          item.id === errorId ? { ...item, is_resolved: true } : item,
        ),
      );
    } catch (err: any) {
      setErrorsMessage(err?.message || "Ошибка");
    } finally {
      setResolvingErrorId(null);
    }
  };

  if (!isVerified) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top left, rgba(34,197,94,0.18), transparent 25%), radial-gradient(circle at top right, rgba(6,182,212,0.18), transparent 25%), linear-gradient(135deg, #06111d 0%, #0b1220 45%, #111827 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "38px 38px",
            opacity: 0.45,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            width: "100%",
            maxWidth: "560px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "22px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "26px",
                boxShadow: "0 20px 45px rgba(6,182,212,0.25)",
              }}
            >
              A
            </div>

            <div>
              <div
                style={{
                  fontSize: "14px",
                  opacity: 0.72,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                MarketCard AI
              </div>
              <div style={{ fontSize: "32px", fontWeight: 900 }}>
                Центр управления системой
              </div>
            </div>
          </div>

          <div
            style={{
              ...cardStyle,
              padding: "30px",
            }}
          >
            <div
              style={{
                fontSize: "38px",
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: "10px",
              }}
            >
              Защищённый вход
            </div>

            <div
              style={{
                fontSize: "15px",
                lineHeight: 1.7,
                opacity: 0.78,
                marginBottom: "24px",
              }}
            >
              Доступ к управлению пользователями, блокировками и контролю
              платформы.
            </div>

            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Введите пароль администратора"
              style={{
                width: "100%",
                height: "60px",
                borderRadius: "18px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.08)",
                color: "white",
                fontSize: "16px",
                outline: "none",
                padding: "0 18px",
                boxSizing: "border-box",
                marginBottom: "16px",
              }}
            />

            <button
              onClick={verifyPassword}
              disabled={checkingPassword}
              style={{
                width: "100%",
                height: "60px",
                borderRadius: "18px",
                border: "none",
                background: checkingPassword
                  ? "linear-gradient(135deg, #475569, #334155)"
                  : "linear-gradient(135deg, #22c55e, #06b6d4)",
                color: "white",
                fontSize: "17px",
                fontWeight: 900,
                cursor: checkingPassword ? "not-allowed" : "pointer",
                boxShadow: "0 22px 50px rgba(6,182,212,0.28)",
              }}
            >
              {checkingPassword ? "Проверка..." : "Войти"}
            </button>

            {error && (
              <div
                style={{
                  marginTop: "18px",
                  padding: "14px 16px",
                  borderRadius: "16px",
                  background: "rgba(239,68,68,0.14)",
                  border: "1px solid rgba(239,68,68,0.35)",
                  color: "#fecaca",
                  fontWeight: 700,
                }}
              >
                {error}
              </div>
            )}
          </div>
        </div>
  
      {isVerified && (<div style={{ marginTop: "40px", textAlign: "center" }}>
        <button
          onClick={() => setShowAnalytics((prev) => !prev)}
          style={{
            padding: "14px 28px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #00f5a0, #00d9f5)",
            color: "#001f2f",
            fontWeight: 700,
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(0,255,200,0.2)",
          }}
        >
          {showAnalytics ? "Скрыть аналитику" : "Показать аналитику"}
        </button>
      </div>)}

      {isVerified && showAnalytics && (
        <div
          style={{
            marginTop: "40px",
            padding: "30px",
            borderRadius: "20px",
            background: "linear-gradient(145deg, #0f2027, #203a43, #2c5364)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
            Аналитика и мониторинг

<div style={{
  marginBottom: "20px",
  padding: "20px",
  borderRadius: "16px",
  background: "linear-gradient(135deg,#064e3b,#0f172a)",
  border: "1px solid rgba(34,197,94,0.3)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
}}>
  <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
    <div style={{
      width:"12px",
      height:"12px",
      borderRadius:"50%",
      background:"#22c55e",
      boxShadow:"0 0 10px #22c55e"
    }}/>
    <div>
      <div style={{fontSize:"12px",opacity:0.7}}>Сейчас онлайн</div>
      <div style={{fontSize:"26px",fontWeight:900}}>
        {onlineCount}
      </div>
    </div>
  </div>

  <div style={{fontSize:"12px",opacity:0.7}}>
    {onlineWindowMinutes} мин
  </div>
</div>


          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            <div style={smallStatStyle}>
              <div style={{ opacity: 0.7 }}>Всего пользователей</div>
              <div style={{ fontSize: "28px", fontWeight: 800 }}>
                {adminStats?.users?.total ?? users.length}
              </div>
            </div>

            <div style={smallStatStyle}>
              <div style={{ opacity: 0.7 }}>Всего генераций</div>
              <div style={{ fontSize: "28px", fontWeight: 800 }}>
                {adminStats?.generations?.total ?? users.reduce((sum, u) => sum + Number(u.tariff_generations_total ?? u.generations_total ?? 0), 0)}
              </div>
            </div>

            <div style={smallStatStyle}>
              <div style={{ opacity: 0.7 }}>Использовано</div>
              <div style={{ fontSize: "28px", fontWeight: 800 }}>
                {adminStats?.generations?.used ?? users.reduce((sum, u) => sum + Number(u.tariff_generations_used ?? u.generations_used ?? 0), 0)}
              </div>
            </div>

            <div style={smallStatStyle}>
              <div style={{ opacity: 0.7 }}>Без тарифа</div>
              <div style={{ fontSize: "28px", fontWeight: 800 }}>
                {adminStats?.users?.without_tariff ?? users.filter((u) => !u.tariff_name).length}
              </div>
            </div>
          </div>

          <div style={{ marginTop: "30px" }}>
            <div style={{ marginBottom: "10px" }}>Нагрузка системы</div>

            <div
              style={{
                width: "100%",
                height: "20px",
                borderRadius: "10px",
                background: "#111",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: systemLoad + "%",
                  height: "100%",
                  background:
                    systemLoad < 50
                      ? "linear-gradient(90deg, #00ff99, #00cc66)"
                      : systemLoad < 75
                      ? "linear-gradient(90deg, #ffaa00, #ff8800)"
                      : "linear-gradient(90deg, #ff3c3c, #cc0000)",
                  transition: "0.5s",
                }}
              />
            </div>

            <div style={{ marginTop: "8px", opacity: 0.7 }}>
              {systemLoad}% загрузка
            </div>
          </div>
        </div>
      )}

  </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(34,197,94,0.12), transparent 20%), radial-gradient(circle at top right, rgba(6,182,212,0.13), transparent 22%), linear-gradient(135deg, #06111d 0%, #0b1220 40%, #111827 100%)",
        color: "white",
        padding: "28px 20px 40px",
      }}
    >
      <div style={{ maxWidth: "1480px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "18px",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "14px",
                opacity: 0.72,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              MarketCard AI
            </div>
            <h1
              style={{
                margin: "6px 0 0",
                fontSize: "42px",
                fontWeight: 900,
                lineHeight: 1.05,
              }}
            >
              Админ-панель
            </h1>
          </div>

          <div
            style={{
              ...cardStyle,
              padding: "14px 18px",
              minWidth: "280px",
            }}
          >
            <div
              style={{ fontSize: "13px", opacity: 0.72, marginBottom: "8px" }}
            >
              Быстрый поиск
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ID, email, имя, тариф..."
              style={{
                width: "100%",
                height: "48px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.08)",
                color: "white",
                padding: "0 14px",
                boxSizing: "border-box",
                outline: "none",
                fontSize: "15px",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div style={smallStatStyle}>
            <div
              style={{ fontSize: "13px", opacity: 0.72, marginBottom: "10px" }}
            >
              Всего пользователей
            </div>
            <div style={{ fontSize: "36px", fontWeight: 900 }}>
              {adminStats?.users?.total ?? users.length}
            </div>
          </div>

          <div style={smallStatStyle}>
            <div
              style={{ fontSize: "13px", opacity: 0.72, marginBottom: "10px" }}
            >
              Активных тарифов
            </div>
            <div
              style={{ fontSize: "36px", fontWeight: 900, color: "#86efac" }}
            >
              {users.filter((u) => u.tariff_active).length}
            </div>
          </div>

          <div style={smallStatStyle}>
            <div
              style={{ fontSize: "13px", opacity: 0.72, marginBottom: "10px" }}
            >
              Всего генераций
            </div>
            <div
              style={{ fontSize: "36px", fontWeight: 900, color: "#67e8f9" }}
            >
              {users.reduce((sum, user) => sum + Number(user.tariff_generations_total ?? user.generations_total ?? 0), 0)}
            </div>
          </div>

          <div style={smallStatStyle}>
            <div
              style={{ fontSize: "13px", opacity: 0.72, marginBottom: "10px" }}
            >
              Использовано генераций
            </div>
            <div
              style={{ fontSize: "36px", fontWeight: 900, color: "#facc15" }}
            >
              {users.reduce(
                (sum, u) =>
                  sum +
                  ((u.tariff_generations_used ?? u.generations_used ?? 0) || 0),
                0,
              )}
            </div>
          </div>

          <div style={smallStatStyle}>
            <div
              style={{ fontSize: "13px", opacity: 0.72, marginBottom: "10px" }}
            >
              Забанено
            </div>
            <div
              style={{ fontSize: "36px", fontWeight: 900, color: "#fca5a5" }}
            >
              {users.filter((u) => u.is_banned).length}
            </div>
          </div>
        </div>
        {loading && (
          <div
            style={{
              ...cardStyle,
              padding: "20px",
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
              borderRadius: "16px",
              background: "rgba(255,80,80,0.12)",
              border: "1px solid rgba(255,80,80,0.35)",
              marginBottom: "20px",
              fontWeight: 700,
              color: "#fecaca",
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && filteredUsers.length === 0 && (
          <div
            style={{
              ...cardStyle,
              padding: "24px",
            }}
          >
            Пользователи не найдены
          </div>
        )}

        {!loading && !error && filteredUsers.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: "18px",
            }}
          >
            {filteredUsers.map((user) => {
              const isLoadingAction = actionLoadingId === user.id;

              return (
                <div
                  key={user.id}
                  style={{
                    ...cardStyle,
                    padding: "22px",
                    position: "relative",
                    overflow: "hidden",
                    border: user.is_banned
                      ? "1px solid rgba(239,68,68,0.35)"
                      : "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: user.is_banned
                        ? "linear-gradient(90deg, #ef4444, #f97316)"
                        : user.tariff_active
                          ? "linear-gradient(90deg, #22c55e, #06b6d4)"
                          : "linear-gradient(90deg, #64748b, #334155)",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "14px",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          opacity: 0.68,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          marginBottom: "8px",
                        }}
                      >
                        Пользователь #{user.id}
                      </div>

                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: 900,
                          marginBottom: "8px",
                        }}
                      >
                        {user.full_name || "Без имени"}
                      </div>

                      <div
                        style={{
                          fontSize: "15px",
                          opacity: 0.86,
                          wordBreak: "break-word",
                        }}
                      >
                        {user.email}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        alignItems: "flex-end",
                      }}
                    >
                      {user.is_banned ? (
                        <button
                          onClick={() => unbanUser(user.id)}
                          disabled={isLoadingAction}
                          style={{
                            background:
                              "linear-gradient(135deg, #22c55e, #16a34a)",
                            color: "white",
                            border: "none",
                            padding: "10px 14px",
                            borderRadius: "12px",
                            cursor: isLoadingAction ? "not-allowed" : "pointer",
                            fontWeight: 800,
                            minWidth: "120px",
                          }}
                        >
                          {isLoadingAction ? "..." : "Разбанить"}
                        </button>
                      ) : (
                        <button
                          onClick={() => banUser(user.id)}
                          disabled={isLoadingAction || user.is_admin}
                          style={{
                            background: user.is_admin
                              ? "linear-gradient(135deg, #475569, #334155)"
                              : "linear-gradient(135deg, #ef4444, #b91c1c)",
                            color: "white",
                            border: "none",
                            padding: "10px 14px",
                            borderRadius: "12px",
                            cursor:
                              user.is_admin || isLoadingAction
                                ? "not-allowed"
                                : "pointer",
                            fontWeight: 800,
                            minWidth: "120px",
                          }}
                        >
                          {isLoadingAction
                            ? "..."
                            : user.is_admin
                              ? "Админ"
                              : "Забанить"}
                        </button>
                      )}

                      <button
                        onClick={() => openUserErrors(user)}
                        style={{
                          background:
                            "linear-gradient(135deg, #60a5fa, #2563eb)",
                          color: "white",
                          border: "none",
                          padding: "10px 14px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: 700,
                          boxShadow: "0 10px 24px rgba(37,99,235,0.35)",
                        }}
                      >
                        Ошибки
                      </button>

                      <div
                        style={{
                          padding: "8px 12px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: 800,
                          background: user.tariff_active
                            ? "rgba(34,197,94,0.15)"
                            : "rgba(148,163,184,0.15)",
                          color: user.tariff_active ? "#86efac" : "#cbd5e1",
                          border: user.tariff_active
                            ? "1px solid rgba(34,197,94,0.25)"
                            : "1px solid rgba(148,163,184,0.20)",
                        }}
                      >
                        {user.tariff_active
                          ? "Активный клиент"
                          : "Без активного тарифа"}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        padding: "14px",
                        borderRadius: "16px",
                        background: "rgba(255,255,255,0.05)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          opacity: 0.65,
                          marginBottom: "6px",
                        }}
                      >
                        Тариф
                      </div>
                      <div style={{ fontSize: "17px", fontWeight: 800 }}>
                        {user.tariff_name || "Нет"}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "14px",
                        borderRadius: "16px",
                        background: "rgba(255,255,255,0.05)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          opacity: 0.65,
                          marginBottom: "6px",
                        }}
                      >
                        Статус
                      </div>
                      <div style={{ fontSize: "17px", fontWeight: 800 }}>
                        {user.is_banned ? "Забанен" : "Нормальный"}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "14px",
                        borderRadius: "16px",
                        background: "rgba(255,255,255,0.05)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          opacity: 0.65,
                          marginBottom: "6px",
                        }}
                      >
                        Генераций всего
                      </div>
                      <div style={{ fontSize: "17px", fontWeight: 800 }}>
                        {user.tariff_generations_total ??
                          user.generations_total ??
                          0}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "14px",
                        borderRadius: "16px",
                        background: "rgba(255,255,255,0.05)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          opacity: 0.65,
                          marginBottom: "6px",
                        }}
                      >
                        Использовано
                      </div>
                      <div style={{ fontSize: "17px", fontWeight: 800 }}>
                        {user.tariff_generations_used ??
                          user.generations_used ??
                          0}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "14px",
                        borderRadius: "16px",
                        background: "rgba(255,255,255,0.05)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          opacity: 0.65,
                          marginBottom: "6px",
                        }}
                      >
                        Осталось
                      </div>
                      <div style={{ fontSize: "17px", fontWeight: 800 }}>
                        {user.tariff_generations_left ??
                          user.generations_left ??
                          0}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "14px",
                        borderRadius: "16px",
                        background: "rgba(255,255,255,0.05)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          opacity: 0.65,
                          marginBottom: "6px",
                        }}
                      >
                        Роль
                      </div>
                      <div style={{ fontSize: "17px", fontWeight: 800 }}>
                        {user.is_admin ? "Администратор" : "Пользователь"}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "16px",
                      padding: "14px",
                      borderRadius: "16px",
                      background: "rgba(255,255,255,0.04)",
                      fontSize: "14px",
                      opacity: 0.85,
                      lineHeight: 1.7,
                    }}
                  >
                    <div>Причина бана: {user.ban_reason || "—"}</div>
                    <div>Дата регистрации: {formatDate(user.created_at)}</div>
                    <div>Последний вход: {formatDate(user.last_login)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {errorsOpen && (
        <div
          onClick={closeUserErrors}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "90%",
              maxWidth: "900px",
              maxHeight: "80vh",
              overflowY: "auto",
              background: "#0f172a",
              borderRadius: "20px",
              padding: "20px",
              color: "white",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 900,
                marginBottom: "16px",
              }}
            >
              Ошибки пользователя
            </h2>

            {errorsLoading && <div>Загрузка...</div>}

            {errorsMessage && (
              <div style={{ color: "red", marginBottom: "10px" }}>
                {errorsMessage}
              </div>
            )}

            {!errorsLoading && userErrors.length === 0 && <div>Ошибок нет</div>}

            {userErrors.map((err) => (
              <div
                key={err.id}
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "12px",
                  marginBottom: "12px",
                }}
              >
                <div style={{ fontWeight: 800 }}>{err.error_type}</div>

                <div style={{ marginTop: "6px" }}>{err.error_message}</div>

                <div style={{ marginTop: "6px", color: "#93c5fd" }}>
                  {err.translated_message}
                </div>

                <div style={{ marginTop: "6px", color: "#86efac" }}>
                  {err.suggested_fix}
                </div>

                {!err.is_resolved && (
                  <button
                    onClick={() => resolveError(err.id)}
                    style={{
                      marginTop: "10px",
                      background: "#22c55e",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Решено
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={closeUserErrors}
              style={{
                marginTop: "10px",
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <button
          onClick={() => setShowAnalytics((prev) => !prev)}
          style={{
            padding: "14px 28px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #00f5a0, #00d9f5)",
            color: "#001f2f",
            fontWeight: 700,
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(0,255,200,0.2)",
          }}
        >
          {showAnalytics ? "Скрыть аналитику" : "Показать аналитику"}
        </button>
      </div>

      {showAnalytics && (
        <div
          style={{
            marginTop: "40px",
            padding: "30px",
            borderRadius: "20px",
            background: "linear-gradient(145deg, #0f2027, #203a43, #2c5364)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
            Аналитика и мониторинг
          </h2>

<div style={{
  marginBottom: "20px",
  padding: "20px",
  borderRadius: "16px",
  background: "linear-gradient(135deg,#064e3b,#0f172a)",
  border: "1px solid rgba(34,197,94,0.3)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
}}>
  <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
    <div style={{
      width:"12px",
      height:"12px",
      borderRadius:"50%",
      background:"#22c55e",
      boxShadow:"0 0 10px #22c55e"
    }}/>
    <div>
      <div style={{fontSize:"12px",opacity:0.7}}>Сейчас онлайн</div>
      <div style={{fontSize:"26px",fontWeight:900}}>{onlineCount}</div>
    </div>
  </div>
  <div style={{fontSize:"12px",opacity:0.7}}>
    {onlineWindowMinutes} мин
  </div>
</div>


          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            <div style={smallStatStyle}>
              <div style={{ opacity: 0.7 }}>Всего пользователей</div>
              <div style={{ fontSize: "28px", fontWeight: 800 }}>
                {adminStats?.users?.total ?? users.length}
              </div>
            </div>

            <div style={smallStatStyle}>
              <div style={{ opacity: 0.7 }}>Всего генераций</div>
              <div style={{ fontSize: "28px", fontWeight: 800 }}>
                {adminStats?.generations?.total ?? users.reduce((sum, u) => sum + Number(u.tariff_generations_total ?? u.generations_total ?? 0), 0)}
              </div>
            </div>

            <div style={smallStatStyle}>
              <div style={{ opacity: 0.7 }}>Использовано</div>
              <div style={{ fontSize: "28px", fontWeight: 800 }}>
                {adminStats?.generations?.used ?? users.reduce((sum, u) => sum + Number(u.tariff_generations_used ?? u.generations_used ?? 0), 0)}
              </div>
            </div>

            <div style={smallStatStyle}>
              <div style={{ opacity: 0.7 }}>Без тарифа</div>
              <div style={{ fontSize: "28px", fontWeight: 800 }}>
                {adminStats?.users?.without_tariff ?? users.filter((u) => !u.tariff_name).length}
              </div>
            </div>
          </div>

          <div style={{ marginTop: "30px" }}>
            <div style={{ marginBottom: "10px" }}>Нагрузка системы</div>

            <div
              style={{
                width: "100%",
                height: "20px",
                borderRadius: "10px",
                background: "#111",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: systemLoad + "%",
                  height: "100%",
                  background:
                    systemLoad < 50
                      ? "linear-gradient(90deg, #00ff99, #00cc66)"
                      : systemLoad < 75
                      ? "linear-gradient(90deg, #ffaa00, #ff8800)"
                      : "linear-gradient(90deg, #ff3c3c, #cc0000)",
                  transition: "0.5s",
                }}
              />
            </div>

            <div style={{ marginTop: "8px", opacity: 0.7 }}>
              {systemLoad}% загрузка
            </div>
          </div>

        <FinanceBlock />

        <TariffStatsBlock />

        <ArpuStatsBlock />\n\n        <TopUsersBlock />
        </div>
      )}

  </main>
  );
}