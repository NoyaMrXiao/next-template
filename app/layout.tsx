import type { Metadata } from "next"
import { Noto_Sans_SC } from "next/font/google"
import "./globals.css"

// 组件导入
import { NavigationBar } from "@/components/ui/navigation-bar"
import { Toaster } from 'react-hot-toast'

// Context Providers
import { CartProvider } from "@/lib/cart-context"
import { FavoritesProvider } from "@/lib/favorites-context"
import { AuthProvider } from "@/lib/auth-context"

// 常量导入
import { APP_METADATA, TOAST_CONFIG } from "@/lib/constants"

// ===========================================
// 字体配置
// ===========================================

// const notoSansSC = Noto_Sans_SC({ 
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "700"],
//   display: "swap",
//   variable: "--font-noto-sans-sc"
// })

// ===========================================
// 元数据配置
// ===========================================

export const metadata: Metadata = {
  title: {
    default: APP_METADATA.TITLE,
    template: `%s | ${APP_METADATA.TITLE}`
  },
  description: APP_METADATA.DESCRIPTION,
  keywords: APP_METADATA.KEYWORDS,
  authors: [{ name: APP_METADATA.AUTHOR }],
  creator: APP_METADATA.AUTHOR,
  publisher: APP_METADATA.AUTHOR,
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://fragrance.com',
    title: APP_METADATA.TITLE,
    description: APP_METADATA.DESCRIPTION,
    siteName: APP_METADATA.TITLE,
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: APP_METADATA.TITLE,
    description: APP_METADATA.DESCRIPTION,
  },
  
  // 其他配置
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // 验证
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
  },
  
  // 其他元数据
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

// ===========================================
// 根布局组件
// ===========================================

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang={APP_METADATA.LANG}>
      <body className={`antialiased`}>
        {/* 应用提供者层级 */}
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              
              {/* 导航栏 */}
              <NavigationBar />
              
              {/* 主内容区域 */}
              <main className="min-h-screen">
                {children}
              </main>
              
              {/* 全局通知组件 */}
              <Toaster
                position={TOAST_CONFIG.POSITION}
                toastOptions={{
                  duration: TOAST_CONFIG.DURATION,
                  style: {
                    background: '#fff',
                    color: '#333',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    fontSize: '14px',
                    fontWeight: '500',
                  },
                  success: {
                    style: TOAST_CONFIG.STYLES.SUCCESS,
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#f0fdf4',
                    },
                  },
                  error: {
                    style: TOAST_CONFIG.STYLES.ERROR,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fef2f2',
                    },
                  },
                  loading: {
                    style: TOAST_CONFIG.STYLES.INFO,
                    iconTheme: {
                      primary: '#3b82f6',
                      secondary: '#eff6ff',
                    },
                  },
                }}
                containerStyle={{
                  top: 20,
                  right: 20,
                }}
              />
              
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}