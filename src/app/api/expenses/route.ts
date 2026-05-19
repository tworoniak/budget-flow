import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/apiAuth'

function serializeExpense(e: {
  id: string; title: string; amount: number; category: string
  notes: string | null; recurring: boolean; createdAt: Date
  tags: { tag: { name: string } }[]
}) {
  return {
    id: e.id,
    title: e.title,
    amount: e.amount,
    category: e.category,
    notes: e.notes ?? undefined,
    recurring: e.recurring,
    createdAt: e.createdAt.toISOString().split('T')[0],
    tags: e.tags.map((t) => t.tag.name),
  }
}

export async function GET() {
  const result = await requireUserId()
  if (result instanceof NextResponse) return result
  const { userId } = result

  const expenses = await prisma.expense.findMany({
    where: { userId },
    include: { tags: { include: { tag: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(expenses.map(serializeExpense))
}

export async function POST(req: Request) {
  const result = await requireUserId()
  if (result instanceof NextResponse) return result
  const { userId } = result

  const body = await req.json()
  const { id, title, amount, category, notes, recurring, createdAt, tags } = body

  const expense = await prisma.expense.create({
    data: {
      id,
      title,
      amount,
      category,
      notes: notes ?? null,
      recurring: recurring ?? false,
      createdAt: new Date(createdAt),
      userId,
      tags: tags?.length
        ? {
            create: await upsertTags(userId, tags),
          }
        : undefined,
    },
    include: { tags: { include: { tag: true } } },
  })

  return NextResponse.json(serializeExpense(expense), { status: 201 })
}

async function upsertTags(userId: string, tagNames: string[]) {
  return Promise.all(
    tagNames.map(async (name) => {
      const tag = await prisma.tag.upsert({
        where: { userId_name: { userId, name } },
        update: {},
        create: { name, userId },
      })
      return { tagId: tag.id }
    })
  )
}
