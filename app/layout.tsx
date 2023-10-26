import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Chat Pop-Up",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>
        {children}
      </body>
    </html>
  )
}
