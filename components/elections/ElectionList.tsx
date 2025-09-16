'use client'

import Link from 'next/link'

interface Election {
  slug: string
  title: string
  shortDescription: string
  electionDate: string
  electionType: string
  keyDates: {
    registrationDeadline: string | null
    earlyVotingStart: string | null
    earlyVotingEnd: string | null
    absenteeDeadline: string | null
  }
}

interface ElectionListProps {
  citySlug: string
  elections: Election[]
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatElectionType(type: string): string {
  return type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
}

function isUpcoming(dateString: string): boolean {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date >= today
}

export default function ElectionList({ citySlug, elections }: ElectionListProps) {
  if (elections.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming elections</h3>
        <p className="text-gray-600">Check back later for new elections in your area.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {elections.map((election) => (
        <div
          key={election.slug}
          className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    <Link
                      href={`/c/${citySlug}/e/${election.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {election.title}
                    </Link>
                  </h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    isUpcoming(election.electionDate)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {formatElectionType(election.electionType)}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{election.shortDescription}</p>
                
                <div className="text-sm text-gray-500 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Election Date:</span>
                    <span className="text-gray-900 font-medium">{formatDate(election.electionDate)}</span>
                  </div>
                  
                  {election.keyDates.registrationDeadline && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Registration Deadline:</span>
                      <span>{formatDate(election.keyDates.registrationDeadline)}</span>
                    </div>
                  )}
                  
                  {election.keyDates.earlyVotingStart && election.keyDates.earlyVotingEnd && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Early Voting:</span>
                      <span>
                        {formatDate(election.keyDates.earlyVotingStart)} - {formatDate(election.keyDates.earlyVotingEnd)}
                      </span>
                    </div>
                  )}
                  
                  {election.keyDates.absenteeDeadline && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Absentee Deadline:</span>
                      <span>{formatDate(election.keyDates.absenteeDeadline)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <Link
                href={`/c/${citySlug}/e/${election.slug}`}
                className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                View Candidates
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}