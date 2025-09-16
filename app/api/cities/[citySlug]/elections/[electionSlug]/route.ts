import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ citySlug: string; electionSlug: string }> }
) {
  try {
    const { citySlug, electionSlug } = await params
    const city = await prisma.city.findUnique({
      where: { slug: citySlug, isActive: true },
      select: {
        id: true,
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

    const election = await prisma.election.findFirst({
      where: {
        cityId: city.id,
        slug: electionSlug,
        isActive: true,
      },
      include: {
        candidates: {
          include: {
            issuePositions: {
              include: {
                issue: true,
              },
            },
            endorsements: true,
          },
          orderBy: { displayOrder: 'asc' },
        },
      },
    })

    if (!election) {
      return NextResponse.json(
        { error: 'Election not found' },
        { status: 404 }
      )
    }

    const issues = await prisma.issue.findMany({
      orderBy: { displayOrder: 'asc' },
    })

    const formattedElection = {
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
    }

    const formattedIssues = issues.map(issue => ({
      id: issue.id,
      slug: issue.slug,
      name: issue.name,
      category: issue.category,
      displayOrder: issue.displayOrder,
    }))

    const formattedCandidates = election.candidates.map(candidate => {
      const issuePositionsMap = candidate.issuePositions.reduce((acc, position) => {
        acc[position.issue.slug] = {
          positionSummary: position.positionSummary,
          stance: position.stance.toLowerCase(),
          evidenceUrl: position.evidenceUrl,
        }
        return acc
      }, {} as Record<string, any>)

      return {
        id: candidate.id,
        fullName: candidate.fullName,
        party: candidate.party,
        ballotName: candidate.ballotName,
        incumbent: candidate.incumbent,
        websiteUrl: candidate.websiteUrl,
        photoUrl: candidate.photoUrl,
        residenceCity: candidate.residenceCity,
        occupation: candidate.occupation,
        summaryBio: candidate.summaryBio,
        displayOrder: candidate.displayOrder,
        issuePositions: issuePositionsMap,
        endorsements: candidate.endorsements.map(endorsement => ({
          endorserName: endorsement.endorserName,
          endorserType: endorsement.endorserType.toLowerCase(),
          quote: endorsement.quote,
          sourceUrl: endorsement.sourceUrl,
        })),
      }
    })

    const response = {
      city,
      election: formattedElection,
      issues: formattedIssues,
      candidates: formattedCandidates,
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Election detail API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}