import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q')
    const state = searchParams.get('state')

    if (!q || q.trim().length < 2) {
      return NextResponse.json({ items: [], total: 0 })
    }

    const whereClause: any = {
      isActive: true,
      name: {
        contains: q.trim(),
        mode: 'insensitive',
      },
    }

    if (state) {
      whereClause.state = state.toUpperCase()
    }

    const cities = await prisma.city.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        state: true,
        slug: true,
      },
      orderBy: [
        { name: 'asc' },
        { state: 'asc' },
      ],
      take: 10,
    })

    const response = {
      items: cities,
      total: cities.length,
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Cities API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}