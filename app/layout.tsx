import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Today I Hate - Bugün Nefret Ettiğim Şeyler",
  description: "Günlük nefret listesi ve duygusal boşalım platformu",
  keywords: ["günlük", "blog", "nefret", "duygular", "yazı"],
  authors: [{ name: "Deniz" }],
  openGraph: {
    title: "Today I Hate",
    description: "Bugün nefret ettiğim şeyler",
    url: "https://todayihate.site",
    siteName: "Today I Hate",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Today I Hate",
    description: "Bugün nefret ettiğim şeyler",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
