import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { apiRateLimit, getClientIP, createRateLimitResponse } from '@/lib/ratelimit'
import { validateStateCode, handleValidationError } from '@/lib/validation'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ stateCode: string }> }
) {
  try {
    // Rate limiting
    const ip = getClientIP(request)
    const { success } = await apiRateLimit.limit(ip)
    
    if (!success) {
      return createRateLimitResponse()
    }
    const { stateCode } = await params
    
    // Validate state code parameter
    validateStateCode(stateCode)
    
    const searchParams = request.nextUrl.searchParams
    const includePast = searchParams.get('includePast') === 'true'

    const today = new Date()
    const whereClause: any = {
      city: { 
        state: stateCode.toUpperCase(),
        isActive: true 
      },
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
        city: {
          select: {
            name: true,
            state: true,
            slug: true,
          }
        }
      },
      orderBy: [
        { electionDate: 'asc' },
        { city: { name: 'asc' } }
      ],
    })

    const formattedElections = elections.map(election => ({
      slug: election.slug,
      title: election.title,
      shortDescription: election.shortDescription,
      electionDate: election.electionDate.toISOString().split('T')[0],
      electionType: election.electionType.toLowerCase().replace('_', ''),
      city: election.city,
      keyDates: {
        registrationDeadline: election.registrationDeadline?.toISOString().split('T')[0] || null,
        earlyVotingStart: election.earlyVotingStart?.toISOString().split('T')[0] || null,
        earlyVotingEnd: election.earlyVotingEnd?.toISOString().split('T')[0] || null,
        absenteeDeadline: election.absenteeDeadline?.toISOString().split('T')[0] || null,
      },
    }))

    const response = {
      state: {
        code: stateCode.toUpperCase(),
        name: getStateName(stateCode.toUpperCase())
      },
      items: formattedElections,
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
      console.error('State elections API error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

function getStateName(stateCode: string): string {
  const stateNames: Record<string, string> = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
    'DC': 'District of Columbia'
  }
  
  return stateNames[stateCode] || stateCode
}