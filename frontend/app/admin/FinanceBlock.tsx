"use client";

import React, { useEffect, useState } from "react";

type FinanceSummary = {
  total_income_uzs: number;
  total_expense_usd: number;
  total_generations: number;
  profit_note?: string;
};

type FinanceTimeseriesPoint = {
  date: string;
  amount: number;
};

type FinanceTimeseries = {
  income: FinanceTimeseriesPoint[];
  expense: FinanceTimeseriesPoint[];
};

function formatUzs(value: number) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(value || 0)) + " сум";
}

function formatUsd(value: number) {
  return "$" + Number(value || 0).toFixed(4);
}

function formatUsdShort(value: number) {
  return "$" + Number(value || 0).toFixed(2);
}

function cardStyle(background: string): React.CSSProperties {
  return {
    borderRadius: 20,
    padding: "18px",
    background,
    color: "white",
    boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
    border: "1px solid rgba(255,255,255,0.08)",
  };
}

export default function FinanceBlock() {
  const [realUsdRate, setRealUsdRate] = useState<number>(0);

  useEffect(() => {
    fetch("/api/admin/usd-rate", { cache: "no-store" })
      .then((res) => res.json())
      .then((d) => setRealUsdRate(Number(d?.rate || 0)))
      .catch(() => setRealUsdRate(0));
  }, []);

  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [timeseries, setTimeseries] = useState<FinanceTimeseries | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const [summaryRes, timeseriesRes] = await Promise.all([
          fetch("https://marketcard.uz/api/admin/finance-summary", { cache: "no-store" }),
          fetch("https://marketcard.uz/api/admin/finance-timeseries", { cache: "no-store" }),
        ]);

        if (!summaryRes.ok) throw new Error("Не удалось получить finance-summary");
        if (!timeseriesRes.ok) throw new Error("Не удалось получить finance-timeseries");

        const summaryData = await summaryRes.json();
        const timeseriesData = await timeseriesRes.json();

        if (!cancelled) {
          setSummary(summaryData);
          setTimeseries(timeseriesData);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Ошибка загрузки финансов");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div style={{
        marginTop: 24,
        borderRadius: 24,
        padding: 20,
        background: "rgba(255,255,255,0.04)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        Загружаю финансовую аналитику...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        marginTop: 24,
        borderRadius: 24,
        padding: 20,
        background: "rgba(127,29,29,0.35)",
        color: "#fecaca",
        border: "1px solid rgba(248,113,113,0.25)",
        fontWeight: 700,
      }}>
        {error}
      </div>
    );
  }

  const totalIncomeUzs = Number(summary?.total_income_uzs || 0);
  const totalExpenseUsd = Number(summary?.total_expense_usd || 0);
  const totalGenerations = Number(summary?.total_generations || 0);

  const usdRate = realUsdRate || 0;
  const approxIncomeUsd = totalIncomeUzs / usdRate;
  const approxProfitUsd = approxIncomeUsd - totalExpenseUsd;
  const avgCostPerGeneration =
    totalGenerations > 0 ? totalExpenseUsd / totalGenerations : 0;

  const incomePoints = timeseries?.income || [];
  const expensePoints = timeseries?.expense || [];

  return (
    <div style={{ marginTop: 28 }}>
      <div style={{
        fontSize: 34,
        fontWeight: 900,
        color: "white",
        marginBottom: 18,
      }}>
        Финансы и юнит-экономика
      </div>
[09.04.2026 22:14] Удалов Аристарх Александрович: <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 16,
        marginBottom: 18,
      }}>
        <div style={cardStyle("linear-gradient(135deg, #16a34a, #22c55e)")}>
          <div style={{ fontSize: 13, opacity: 0.85, fontWeight: 700, marginBottom: 8 }}>ОБЩИЙ ДОХОД</div>
          <div style={{ fontSize: 30, fontWeight: 900 }}>{formatUzs(totalIncomeUzs)}</div>
        </div>

        <div style={cardStyle("linear-gradient(135deg, #2563eb, #06b6d4)")}>
          <div style={{ fontSize: 13, opacity: 0.85, fontWeight: 700, marginBottom: 8 }}>ОБЩИЙ РАСХОД</div>
          <div style={{ fontSize: 30, fontWeight: 900 }}>{formatUsd(totalExpenseUsd)}</div>
        </div>

        <div style={cardStyle("linear-gradient(135deg, #7c3aed, #a855f7)")}>
          <div style={{ fontSize: 13, opacity: 0.85, fontWeight: 700, marginBottom: 8 }}>ВСЕГО ГЕНЕРАЦИЙ</div>
          <div style={{ fontSize: 30, fontWeight: 900 }}>{totalGenerations}</div>
        </div>

        <div style={cardStyle("linear-gradient(135deg, #f59e0b, #ef4444)")}>
          <div style={{ fontSize: 13, opacity: 0.85, fontWeight: 700, marginBottom: 8 }}>ПРИБЫЛЬ</div>
          <div style={{ fontSize: 30, fontWeight: 900 }}>{formatUsdShort(approxProfitUsd)}</div>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 16,
        marginBottom: 18,
      }}>
        <div style={cardStyle("rgba(255,255,255,0.04)")}>
          <div style={{ color: "#9aa3b6", fontSize: 13, marginBottom: 8, fontWeight: 700 }}>Доход в USD (примерно)</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "white" }}>{formatUsdShort(approxIncomeUsd)}</div>
        </div>

        <div style={cardStyle("rgba(255,255,255,0.04)")}>
          <div style={{ color: "#9aa3b6", fontSize: 13, marginBottom: 8, fontWeight: 700 }}>Средняя себестоимость 1 генерации</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "white" }}>{formatUsd(avgCostPerGeneration)}</div>
        </div>

        <div style={cardStyle("rgba(255,255,255,0.04)")}>
          <div style={{ color: "#9aa3b6", fontSize: 13, marginBottom: 8, fontWeight: 700 }}>Курс для расчёта прибыли</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "white" }}>{usdRate} UZS</div>
        </div>

        <div style={cardStyle("rgba(255,255,255,0.04)")}>
          <div style={{ color: "#9aa3b6", fontSize: 13, marginBottom: 8, fontWeight: 700 }}>Примечание</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "white" }}>UZS vs USD</div>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
      }}>
        <div style={cardStyle("rgba(255,255,255,0.04)")}>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>Доход по дням</div>
          {incomePoints.length === 0 ? (
            <div style={{ color: "#aab2c5" }}>Нет данных</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {incomePoints.map((item, index) => (
                <div key={index} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 12,
                  padding: "10px 12px",
                }}>
                  <span>{item.date}</span>
                  <span style={{ fontWeight: 800 }}>{formatUzs(item.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={cardStyle("rgba(255,255,255,0.04)")}>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>Расход по дням</div>
[09.04.2026 22:14] Удалов Аристарх Александрович: {expensePoints.length === 0 ? (
            <div style={{ color: "#aab2c5" }}>Нет данных</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {expensePoints.map((item, index) => (
                <div key={index} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 12,
                  padding: "10px 12px",
                }}>
                  <span>{item.date}</span>
                  <span style={{ fontWeight: 800 }}>{formatUsd(item.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
