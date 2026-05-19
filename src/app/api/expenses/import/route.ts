import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/apiAuth'

export async function POST(req: Request) {
  const result = await requireUserId()
  if (result instanceof NextResponse) return result
  const { userId } = result

  const incoming: Array<{
    id: string; title: string; amount: number; category: string
    notes?: string; recurring?: boolean; createdAt: string; tags?: string[]
  }> = await req.json()

  if (!Array.isArray(incoming) || incoming.length === 0) {
    return NextResponse.json({ created: 0 })
  }

  // Dedup: find which IDs already exist for this user
  const existing = await prisma.expense.findMany({
    where: { userId, id: { in: incoming.map((e) => e.id) } },
    select: { id: true },
  })
  const existingIds = new Set(existing.map((e) => e.id))
  const newExpenses = incoming.filter((e) => !existingIds.has(e.id))

  for (const e of newExpenses) {
    const tagConnects = e.tags?.length
      ? await Promise.all(
          e.tags.map(async (name) => {
            const tag = await prisma.tag.upsert({
              where: { userId_name: { userId, name } },
              update: {},
              create: { name, userId },
            })
            return { tagId: tag.id }
          })
        )
      : []

    await prisma.expense.create({
      data: {
        id: e.id,
        title: e.title,
        amount: e.amount,
        category: e.category,
        notes: e.notes ?? null,
        recurring: e.recurring ?? false,
        createdAt: new Date(e.createdAt),
        userId,
        tags: tagConnects.length ? { create: tagConnects } : undefined,
      },
    })
  }

  return NextResponse.json({ created: newExpenses.length })
}
