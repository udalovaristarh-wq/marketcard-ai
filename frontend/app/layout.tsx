export const metadata = {
  title: "MarketCard AI",
  description: "AI генератор карточек товаров"
}

import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>

      <body>{children}</body>
    </html>
  )
}
