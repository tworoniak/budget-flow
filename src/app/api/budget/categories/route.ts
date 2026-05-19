import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/apiAuth'

export async function POST(req: Request) {
  const result = await requireUserId()
  if (result instanceof NextResponse) return result
  const { userId } = result

  const { id, name, limit } = await req.json()

  const existing = await prisma.budgetCategory.findFirst({ where: { userId, name } })
  if (existing) {
    return NextResponse.json({ error: 'A category with this name already exists' }, { status: 409 })
  }

  const category = await prisma.budgetCategory.create({
    data: { id, name, limit, userId },
  })

  return NextResponse.json({ id: category.id, name: category.name, limit: category.limit }, { status: 201 })
}
