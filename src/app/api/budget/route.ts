import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/apiAuth'

export async function GET() {
  const result = await requireUserId()
  if (result instanceof NextResponse) return result
  const { userId } = result

  const [settings, categories] = await Promise.all([
    prisma.userSettings.findUnique({ where: { userId } }),
    prisma.budgetCategory.findMany({ where: { userId }, orderBy: { name: 'asc' } }),
  ])

  return NextResponse.json({
    income: settings?.income ?? 0,
    categories: categories.map((c) => ({ id: c.id, name: c.name, limit: c.limit })),
  })
}
