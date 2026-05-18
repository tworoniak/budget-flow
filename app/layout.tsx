import type { Metadata } from 'next'
import AppLayout from '@/layouts/AppLayout'
import '@/styles/main.scss'

export const metadata: Metadata = {
  title: 'BudgetFlow',
  description: 'Intelligent personal finance dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  )
}
