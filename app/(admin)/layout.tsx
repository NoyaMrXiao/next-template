import type { Metadata } from 'next'
import { AdminNavigation } from '@/components/admin/admin-navigation'

export const metadata: Metadata = {
  title: '管理后台',
  description: '商品管理后台',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />

      <main className="pt-16">
        {/* <Test>

        </Test> */}
        {children}
      </main>
    </div>
  )
} 