import SupportWidget from "./components/support-widget/SupportWidget";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
          background: "#0b0f1a",
        }}
      >
        {children}
        <SupportWidget />

        <footer
          style={{
            width: "100%",
            background: "#08101d",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "20px 0",
            textAlign: "center",
            fontSize: "14px",
            color: "rgba(255,255,255,0.6)",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "18px",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/privacy"
              style={{
                color: "rgba(255,255,255,0.6)",
                textDecoration: "none",
              }}
            >
              Privacy
            </a>

            <a
              href="/terms"
              style={{
                color: "rgba(255,255,255,0.6)",
                textDecoration: "none",
              }}
            >
              Terms
            </a>
          </div>

          <div
            style={{
              marginTop: "10px",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            © 2026 MarketCard AI
          </div>
        </footer>
      </body>
    </html>
  );
}
