import type { Metadata } from "next"
import { Noto_Sans_SC } from "next/font/google"
import "./globals.css"
import { NavigationBar } from "@/components/ui/navigation-bar"
import { CartProvider } from "@/lib/cart-context"
import { FavoritesProvider } from "@/lib/favorites-context"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from 'react-hot-toast'

// const notoSansSC = Noto_Sans_SC({ 
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "700"],
//   display: "swap",
// })

export const metadata: Metadata = {
  title: "香氛商城 - 探索香氛的奇妙世界",
  description: "发现独特的香氛体验，让生活充满芬芳",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body 
      // className={notoSansSC.className}
      >
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <NavigationBar />
              <main>{children}</main>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#fff',
                    color: '#333',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                  },
                  success: {
                    style: {
                      border: '1px solid #10b981',
                      background: '#f0fdf4',
                      color: '#065f46',
                    },
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#f0fdf4',
                    },
                  },
                  error: {
                    style: {
                      border: '1px solid #ef4444',
                      background: '#fef2f2',
                      color: '#991b1b',
                    },
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fef2f2',
                    },
                  },
                }}
              />
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}