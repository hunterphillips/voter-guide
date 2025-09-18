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
      <div className="text-center py-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
        <h3 className="text-lg font-medium text-white mb-2">No upcoming elections</h3>
        <p className="text-slate-300">Check back later for new elections in your area.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {elections.map((election) => (
        <div
          key={election.slug}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-2xl hover:bg-white/10 transition-all"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-white">
                    <Link
                      href={`/c/${citySlug}/e/${election.slug}`}
                      className="hover:text-blue-400 transition-colors"
                    >
                      {election.title}
                    </Link>
                  </h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    isUpcoming(election.electionDate)
                      ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                      : 'bg-slate-500/20 text-slate-300 border border-slate-400/30'
                  }`}>
                    {formatElectionType(election.electionType)}
                  </span>
                </div>
                <p className="text-slate-300 mb-4">{election.shortDescription}</p>
                
                <div className="text-sm text-slate-400 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Election Date:</span>
                    <span className="text-white font-medium">{formatDate(election.electionDate)}</span>
                  </div>
                  
                  {election.keyDates.registrationDeadline && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Registration Deadline:</span>
                      <span className="text-slate-300">{formatDate(election.keyDates.registrationDeadline)}</span>
                    </div>
                  )}
                  
                  {election.keyDates.earlyVotingStart && election.keyDates.earlyVotingEnd && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Early Voting:</span>
                      <span className="text-slate-300">
                        {formatDate(election.keyDates.earlyVotingStart)} - {formatDate(election.keyDates.earlyVotingEnd)}
                      </span>
                    </div>
                  )}
                  
                  {election.keyDates.absenteeDeadline && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Absentee Deadline:</span>
                      <span className="text-slate-300">{formatDate(election.keyDates.absenteeDeadline)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <Link
                href={`/c/${citySlug}/e/${election.slug}`}
                className="ml-6 inline-flex items-center px-4 py-2 border border-blue-500/20 text-sm font-medium rounded-lg text-white bg-blue-500/20 backdrop-blur-sm hover:bg-blue-500/30 transition-colors"
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