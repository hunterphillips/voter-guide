import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { apiRateLimit, getClientIP, createRateLimitResponse } from '@/lib/ratelimit'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ citySlug: string }> }
) {
  try {
    // Rate limiting
    const ip = getClientIP(request)
    const { success } = await apiRateLimit.limit(ip)
    
    if (!success) {
      return createRateLimitResponse()
    }
    const { citySlug } = await params
    const searchParams = request.nextUrl.searchParams
    const includePast = searchParams.get('includePast') === 'true'
    
    const city = await prisma.city.findUnique({
      where: { slug: citySlug, isActive: true },
      select: {
        name: true,
        state: true,
        slug: true,
      },
    })

    if (!city) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      )
    }

    const today = new Date()
    const whereClause: any = {
      city: { slug: citySlug },
      isActive: true,
    }

    if (!includePast) {
      whereClause.electionDate = {
        gte: today,
      }
    }

    const elections = await prisma.election.findMany({
      where: whereClause,
      select: {
        slug: true,
        title: true,
        shortDescription: true,
        electionDate: true,
        electionType: true,
        registrationDeadline: true,
        earlyVotingStart: true,
        earlyVotingEnd: true,
        absenteeDeadline: true,
      },
      orderBy: { electionDate: 'asc' },
    })

    const formattedElections = elections.map(election => ({
      slug: election.slug,
      title: election.title,
      shortDescription: election.shortDescription,
      electionDate: election.electionDate.toISOString().split('T')[0],
      electionType: election.electionType.toLowerCase().replace('_', ''),
      keyDates: {
        registrationDeadline: election.registrationDeadline?.toISOString().split('T')[0] || null,
        earlyVotingStart: election.earlyVotingStart?.toISOString().split('T')[0] || null,
        earlyVotingEnd: election.earlyVotingEnd?.toISOString().split('T')[0] || null,
        absenteeDeadline: election.absenteeDeadline?.toISOString().split('T')[0] || null,
      },
    }))

    const response = {
      city,
      items: formattedElections,
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Elections API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}