'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import Link from 'next/link'
import Head from 'next/head'
import { APP_CONFIG } from '@/lib/config'

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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-64 mb-4"></div>
            <div className="h-6 bg-white/20 rounded w-32 mb-8"></div>
            <div className="space-y-6">
              <div className="h-32 bg-white/10 rounded"></div>
              <div className="h-32 bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-white mb-4">State Not Found</h1>
            <p className="text-slate-300 mb-6">We couldn't find elections for this state.</p>
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 border border-blue-500/20 text-sm font-medium rounded-lg text-white bg-blue-500/20 backdrop-blur-sm hover:bg-blue-500/30 transition-colors"
            >
              Back to Search
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const elections = data.items || []

  // Enhanced SEO metadata
  const electionCount = elections.length
  const currentYear = new Date().getFullYear()
  const seoTitle = `${data.state.name} Elections ${currentYear} - Complete Voting Guide | Informed Voter`
  const seoDescription = `Find all ${electionCount} upcoming election${electionCount !== 1 ? 's' : ''} in ${data.state.name}. Complete voting guide with candidate information, election dates, and voting locations across the state.`

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={`${APP_CONFIG.baseUrl}/s/${stateCode}`} />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="mb-4">
            <Link 
              href="/"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              ← Back to Search
            </Link>
          </nav>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            {data.state.name}
          </h1>
          <p className="text-slate-300">
            {elections.length === 0 
              ? 'No upcoming elections found' 
              : `${elections.length} upcoming election${elections.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>

        {elections.length === 0 ? (
          <div className="text-center py-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
            <h3 className="text-lg font-medium text-white mb-2">No upcoming elections</h3>
            <p className="text-slate-300">Check back later for new elections in {data.state.name}.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {elections.map((election: any) => (
              <div
                key={`${election.city.slug}-${election.slug}`}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-2xl hover:bg-white/10 transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">
                          <Link
                            href={`/c/${election.city.slug}/e/${election.slug}`}
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
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex px-2 py-1 text-sm font-medium rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                          {election.city.name}, {election.city.state}
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
                      href={`/c/${election.city.slug}/e/${election.slug}`}
                      className="ml-6 inline-flex items-center px-4 py-2 border border-blue-500/20 text-sm font-medium rounded-lg text-white bg-blue-500/20 backdrop-blur-sm hover:bg-blue-500/30 transition-colors"
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
    </>
  )
}