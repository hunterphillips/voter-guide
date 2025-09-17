import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const elections = await prisma.election.findMany({
      where: {
        isActive: true,
        electionDate: {
          gte: today,
        },
      },
      include: {
        city: {
          select: {
            name: true,
            state: true,
            slug: true,
          },
        },
      },
      orderBy: {
        significanceRank: 'asc',
      },
      take: 5,
    })

    const formattedElections = elections.map(election => ({
      slug: election.slug,
      title: election.title,
      shortDescription: election.shortDescription,
      electionDate: election.electionDate.toISOString().split('T')[0],
      city: election.city,
      significanceRank: election.significanceRank,
    }))

    return NextResponse.json({
      items: formattedElections,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Featured elections API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}