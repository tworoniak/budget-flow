import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/apiAuth'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireUserId()
  if (result instanceof NextResponse) return result
  const { userId } = result
  const { id } = await params

  const existing = await prisma.incomeEntry.findFirst({ where: { id, userId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { title, amount, date, notes, sourceId } = await req.json()

  const updated = await prisma.incomeEntry.update({
    where: { id },
    data: {
      title,
      amount,
      date: new Date(date),
      notes: notes || null,
      sourceId: sourceId || null,
    },
  })

  return NextResponse.json({
    id: updated.id,
    title: updated.title,
    amount: updated.amount,
    date: updated.date.toISOString().split('T')[0],
    notes: updated.notes ?? undefined,
    sourceId: updated.sourceId ?? undefined,
  })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireUserId()
  if (result instanceof NextResponse) return result
  const { userId } = result
  const { id } = await params

  const existing = await prisma.incomeEntry.findFirst({ where: { id, userId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.incomeEntry.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}
