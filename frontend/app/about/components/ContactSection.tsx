type ContactSectionProps = {
  title: string
}

export const ContactSection = ({ title }: ContactSectionProps) => (
  <>
    <h2 style={{ marginTop: "10px", fontSize: "24px" }}>{title}</h2>
    <div style={{ display: "flex", gap: "20px", marginTop: "15px", marginBottom: "40px" }}>
      <a href="https://t.me/marketcardai_support_bot" target="_blank" rel="noreferrer" style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "65px", height: "65px", background: "rgba(255,255,255,0.05)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)" }}>
        <img src="/social/telegram.svg" alt="Telegram" style={{ width: "40px", height: "40px" }} />
      </a>
      <a href="https://www.instagram.com/marketcard.ai" target="_blank" rel="noreferrer" style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "65px", height: "65px", background: "rgba(255,255,255,0.05)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)" }}>
        <img src="/social/instagram.svg" alt="Instagram" style={{ width: "40px", height: "40px" }} />
      </a>
    </div>
  </>
);
