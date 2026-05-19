import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/apiAuth'

export async function GET() {
  const result = await requireUserId()
  if (result instanceof NextResponse) return result
  const { userId } = result

  const sources = await prisma.incomeSource.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(sources.map((s) => ({
    id: s.id,
    name: s.name,
    type: s.type,
    cadence: s.cadence,
    amount: s.amount,
    nextDate: s.nextDate ? s.nextDate.toISOString().split('T')[0] : undefined,
    isActive: s.isActive,
  })))
}

export async function POST(req: Request) {
  const result = await requireUserId()
  if (result instanceof NextResponse) return result
  const { userId } = result

  const { name, type, cadence, amount, nextDate, isActive } = await req.json()

  const source = await prisma.incomeSource.create({
    data: {
      name,
      type,
      cadence,
      amount,
      nextDate: nextDate ? new Date(nextDate) : null,
      isActive: isActive ?? true,
      userId,
    },
  })

  return NextResponse.json({
    id: source.id,
    name: source.name,
    type: source.type,
    cadence: source.cadence,
    amount: source.amount,
    nextDate: source.nextDate ? source.nextDate.toISOString().split('T')[0] : undefined,
    isActive: source.isActive,
  }, { status: 201 })
}
