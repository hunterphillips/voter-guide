import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { searchRateLimit, getClientIP, createRateLimitResponse } from '@/lib/ratelimit'
import { validateSearchQuery, generateSearchVariations, getQueryParam, handleValidationError } from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(request)
    const { success } = await searchRateLimit.limit(ip)
    
    if (!success) {
      return createRateLimitResponse()
    }
    // Input validation
    const q = getQueryParam(request, 'q')
    const state = getQueryParam(request, 'state')

    if (!q) {
      return NextResponse.json({ items: [], total: 0 })
    }

    const normalizedQuery = validateSearchQuery(q)
    const searchVariations = generateSearchVariations(normalizedQuery)

    // Validate state if provided
    if (state && (state.length !== 2 || !/^[A-Za-z]{2}$/.test(state))) {
      return NextResponse.json(
        { error: 'Invalid state format' },
        { status: 400 }
      )
    }

    const whereClause: any = {
      isActive: true,
      OR: searchVariations.map(variation => ({
        name: {
          contains: variation,
          mode: 'insensitive',
        }
      })),
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
    // Handle validation errors
    try {
      return handleValidationError(error)
    } catch {
      console.error('Cities API error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}