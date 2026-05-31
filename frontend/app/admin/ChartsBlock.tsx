"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from "recharts";

type PointAmount = {
  date: string;
  amount: number;
};

type PointCount = {
  date: string;
  count: number;
};

type GrowthData = {
  registrations: PointCount[];
  activations: PointCount[];
  income: PointAmount[];
  expense: PointAmount[];
};

function formatUzs(value: number) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(value || 0)) + " сум";
}

function formatUsd(value: number) {
  return "$" + Number(value || 0).toFixed(4);
}

function blockStyle() {
  return {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 18,
  } as const;
}

export default function ChartsBlock() {
  const [data, setData] = useState<GrowthData | null>(null);

  useEffect(() => {
    authFetch("/api/admin/growth-timeseries", { cache: "no-store" })
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <div style={{ marginTop: 28, color: "white" }}>
        Загрузка графиков...
      </div>
    );
  }
  const incomeSeries = (data.income || []).map((x) => ({
    date: x.date,
    amount: Number(x.amount || 0),
  }));

  const expenseSeries = (data.expense || []).map((x) => ({
    date: x.date,
    amount: Number(x.amount || 0),
  }));

  const growthMap = new Map<
    string,
    { date: string; registrations: number; activations: number }
  >();

  for (const item of data.registrations || []) {
    growthMap.set(item.date, {
      date: item.date,
      registrations: Number(item.count || 0),
      activations: 0,
    });
  }

  for (const item of data.activations || []) {
    const prev = growthMap.get(item.date) || {
      date: item.date,
      registrations: 0,
      activations: 0,
    };
    prev.activations = Number(item.count || 0);
    growthMap.set(item.date, prev);
  }

  const growthSeries = Array.from(growthMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ fontSize: 30, fontWeight: 900, color: "white", marginBottom: 18 }}>
        Графики
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 18 }}>
        <div style={blockStyle()}>
          <div style={{ color: "white", fontSize: 18, fontWeight: 800, marginBottom: 14 }}>
            Доход по дням
          </div>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={incomeSeries}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip formatter={(value) => formatUzs(Number(value || 0))} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#22c55e"
                  strokeWidth={4}
                  dot={{ r: 4 }}
                  name="Доход"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={blockStyle()}>
          <div style={{ color: "white", fontSize: 18, fontWeight: 800, marginBottom: 14 }}>
            Расход по дням
          </div>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={expenseSeries}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip formatter={(value) => formatUsd(Number(value || 0))} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#38bdf8"
                  strokeWidth={4}
                  dot={{ r: 4 }}
                  name="Расход"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={blockStyle()}>
          <div style={{ color: "white", fontSize: 18, fontWeight: 800, marginBottom: 14 }}>
            Регистрации и активации
          </div>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={growthSeries}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip />
                <Legend />
                <Bar dataKey="registrations" fill="#a855f7" name="Регистрации" radius={[8, 8, 0, 0]} />
                <Bar dataKey="activations" fill="#f59e0b" name="Активации" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
