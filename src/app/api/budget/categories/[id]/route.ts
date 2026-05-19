import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/apiAuth'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireUserId()
  if (result instanceof NextResponse) return result
  const { userId } = result
  const { id } = await params

  const existing = await prisma.budgetCategory.findFirst({ where: { id, userId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { name, limit } = await req.json()

  const updated = await prisma.budgetCategory.update({
    where: { id },
    data: { name, limit },
  })

  return NextResponse.json({ id: updated.id, name: updated.name, limit: updated.limit })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireUserId()
  if (result instanceof NextResponse) return result
  const { userId } = result
  const { id } = await params

  const existing = await prisma.budgetCategory.findFirst({ where: { id, userId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.budgetCategory.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}
