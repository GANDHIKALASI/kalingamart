import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { AdminProvider } from "@/hooks/use-admin"
import { CartNotification } from "@/components/cart-notification"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KalingaMart - Food Delivery",
  description: "Delicious food delivered to your doorstep",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AdminProvider>
          <AuthProvider>
            {children}
            <CartNotification />
          </AuthProvider>
        </AdminProvider>
      </body>
    </html>
  )
}
