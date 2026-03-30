"use client"

type SidebarProps = {
  activeSection: "generator" | "economy" | "listing"
  setActiveSection: (section: "generator" | "economy" | "listing") => void
  listingReady?: boolean
}

export default function Sidebar({
  activeSection,
  setActiveSection,
  listingReady = false,
}: SidebarProps) {
  const itemStyle = (active: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "18px 20px",
    borderRadius: "20px",
    border: active ? "1px solid rgba(34,211,238,0.7)" : "1px solid rgba(255,255,255,0.18)",
    background: active ? "linear-gradient(135deg, #22d3ee, #3b82f6)" : "rgba(255,255,255,0.08)",
    color: "white",
    fontSize: "28px",
    fontWeight: 700,
    cursor: "pointer",
    textAlign: "left",
    boxShadow: active ? "0 10px 30px rgba(34,211,238,0.25)" : "none",
    position: "relative",
  })

  const badgeStyle: React.CSSProperties = {
    position: "absolute",
    top: 10,
    right: 12,
    minWidth: 26,
    height: 26,
    padding: "0 8px",
    borderRadius: 999,
    background: "#ef4444",
    color: "white",
    fontSize: 16,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 18px rgba(239,68,68,0.35)",
  }

  return (
    <aside
      style={{
        width: 330,
        minWidth: 330,
        padding: 24,
        borderRight: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: 54,
          fontWeight: 900,
          lineHeight: 1.05,
          marginBottom: 36,
          textShadow: "0 4px 18px rgba(255,255,255,0.18)",
        }}
      >
        MarketCard
        <br />
        AI
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <button
          type="button"
          style={itemStyle(activeSection === "generator")}
          onClick={() => setActiveSection("generator")}
        >
          Генератор карточек
        </button>

        <button
          type="button"
          style={itemStyle(activeSection === "economy")}
          onClick={() => setActiveSection("economy")}
        >
          Юнит-экономика
        </button>

        <button
          type="button"
          style={itemStyle(activeSection === "listing")}
          onClick={() => setActiveSection("listing")}
        >
          SEO / Описание
          {listingReady && <span style={badgeStyle}>1</span>}
        </button>
      </div>
    </aside>
  )
}