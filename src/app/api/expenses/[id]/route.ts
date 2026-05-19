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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireUserId()
  if (result instanceof NextResponse) return result
  const { userId } = result
  const { id } = await params

  const existing = await prisma.expense.findFirst({ where: { id, userId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const { title, amount, category, notes, recurring, createdAt, tags } = body

  // Replace tags: delete existing links, upsert new tag records, create new links
  await prisma.expenseTag.deleteMany({ where: { expenseId: id } })

  const tagConnects = tags?.length
    ? await Promise.all(
        (tags as string[]).map(async (name) => {
          const tag = await prisma.tag.upsert({
            where: { userId_name: { userId, name } },
            update: {},
            create: { name, userId },
          })
          return { tagId: tag.id }
        })
      )
    : []

  const updated = await prisma.expense.update({
    where: { id },
    data: {
      title,
      amount,
      category,
      notes: notes ?? null,
      recurring: recurring ?? false,
      createdAt: new Date(createdAt),
      tags: tagConnects.length ? { create: tagConnects } : undefined,
    },
    include: { tags: { include: { tag: true } } },
  })

  return NextResponse.json(serializeExpense(updated))
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireUserId()
  if (result instanceof NextResponse) return result
  const { userId } = result
  const { id } = await params

  const existing = await prisma.expense.findFirst({ where: { id, userId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.expense.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}
