'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import Link from 'next/link'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

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

export default function StatePage() {
  const params = useParams()
  const stateCode = params.stateCode as string

  const { data, error, isLoading } = useSWR(
    `/api/states/${stateCode}/elections`,
    fetcher
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">State Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn't find elections for this state.</p>
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Search
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const elections = data.items || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="mb-4">
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Search
            </Link>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900">
            {data.state.name}
          </h1>
          <p className="text-gray-600 mt-2">
            {elections.length === 0 
              ? 'No upcoming elections found' 
              : `${elections.length} upcoming election${elections.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>

        {elections.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming elections</h3>
            <p className="text-gray-600">Check back later for new elections in {data.state.name}.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {elections.map((election: any) => (
              <div
                key={`${election.city.slug}-${election.slug}`}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          <Link
                            href={`/c/${election.city.slug}/e/${election.slug}`}
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
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex px-2 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                          {election.city.name}, {election.city.state}
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
                      href={`/c/${election.city.slug}/e/${election.slug}`}
                      className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      View Candidates
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}