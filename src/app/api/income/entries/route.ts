import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/apiAuth'

export async function GET() {
  const result = await requireUserId()
  if (result instanceof NextResponse) return result
  const { userId } = result

  const entries = await prisma.incomeEntry.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  })

  return NextResponse.json(entries.map((e) => ({
    id: e.id,
    title: e.title,
    amount: e.amount,
    date: e.date.toISOString().split('T')[0],
    notes: e.notes ?? undefined,
    sourceId: e.sourceId ?? undefined,
  })))
}

export async function POST(req: Request) {
  const result = await requireUserId()
  if (result instanceof NextResponse) return result
  const { userId } = result

  const { id, title, amount, date, notes, sourceId } = await req.json()

  const entry = await prisma.incomeEntry.create({
    data: {
      id,
      title,
      amount,
      date: new Date(date),
      notes: notes || null,
      sourceId: sourceId || null,
      userId,
    },
  })

  return NextResponse.json({
    id: entry.id,
    title: entry.title,
    amount: entry.amount,
    date: entry.date.toISOString().split('T')[0],
    notes: entry.notes ?? undefined,
    sourceId: entry.sourceId ?? undefined,
  }, { status: 201 })
}
