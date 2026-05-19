import { auth } from '@/lib/auth'
import { SessionProvider } from 'next-auth/react'
import AppLayout from '@/layouts/AppLayout'

export default async function AppGroupLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      <AppLayout>{children}</AppLayout>
    </SessionProvider>
  )
}
