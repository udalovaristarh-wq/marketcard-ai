type HeaderSectionProps = {
  title: string
  subtitle: string
  cta: string
  onCtaClick: () => void
  onBack: () => void
}

export const HeaderSection = ({ title, subtitle, cta, onCtaClick, onBack }: HeaderSectionProps) => (
  <>
    <button onClick={onBack} style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer", marginBottom: "20px" }}>← Назад</button>
    <h1 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "15px" }}>{title}</h1>
    <p style={{ fontSize: "18px", opacity: 0.9, marginBottom: "30px" }}>{subtitle}</p>
    <button onClick={onCtaClick} style={{ padding: "15px 30px", borderRadius: "12px", background: "#3b82f6", color: "white", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginBottom: "40px" }}>{cta}</button>
  </>
);
