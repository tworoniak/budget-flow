import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/apiAuth'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireUserId()
  if (result instanceof NextResponse) return result
  const { userId } = result
  const { id } = await params

  const existing = await prisma.incomeSource.findFirst({ where: { id, userId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { name, type, cadence, amount, nextDate, isActive } = await req.json()

  const updated = await prisma.incomeSource.update({
    where: { id },
    data: {
      name,
      type,
      cadence,
      amount,
      nextDate: nextDate ? new Date(nextDate) : null,
      isActive,
    },
  })

  return NextResponse.json({
    id: updated.id,
    name: updated.name,
    type: updated.type,
    cadence: updated.cadence,
    amount: updated.amount,
    nextDate: updated.nextDate ? updated.nextDate.toISOString().split('T')[0] : undefined,
    isActive: updated.isActive,
  })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireUserId()
  if (result instanceof NextResponse) return result
  const { userId } = result
  const { id } = await params

  const existing = await prisma.incomeSource.findFirst({ where: { id, userId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.incomeSource.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}
