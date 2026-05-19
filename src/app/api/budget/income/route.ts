import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/apiAuth'

export async function PUT(req: Request) {
  const result = await requireUserId()
  if (result instanceof NextResponse) return result
  const { userId } = result

  const { income } = await req.json()
  if (typeof income !== 'number') {
    return NextResponse.json({ error: 'income must be a number' }, { status: 400 })
  }

  await prisma.userSettings.upsert({
    where: { userId },
    update: { income },
    create: { userId, income },
  })

  return NextResponse.json({ income })
}
