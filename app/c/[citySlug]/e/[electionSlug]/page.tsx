'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import Link from 'next/link'
import KeyDatesBar from '@/components/elections/KeyDatesBar'
import CandidateComparisonTable from '@/components/candidates/CandidateComparisonTable'

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

export default function ElectionPage() {
  const params = useParams()
  const citySlug = params.citySlug as string
  const electionSlug = params.electionSlug as string

  const { data, error, isLoading } = useSWR(
    `/api/cities/${citySlug}/elections/${electionSlug}`,
    fetcher
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-white/20 rounded w-32 mb-4"></div>
            <div className="h-8 bg-white/20 rounded w-96 mb-2"></div>
            <div className="h-6 bg-white/20 rounded w-48 mb-8"></div>
            <div className="h-32 bg-white/10 rounded mb-8"></div>
            <div className="h-96 bg-white/10 rounded"></div>
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
            <h1 className="text-2xl font-bold text-white mb-4">Election Not Found</h1>
            <p className="text-slate-300 mb-6">We couldn't find this election.</p>
            <Link 
              href={`/c/${citySlug}`}
              className="inline-flex items-center px-6 py-3 border border-blue-500/20 text-sm font-medium rounded-lg text-white bg-blue-500/20 backdrop-blur-sm hover:bg-blue-500/30 transition-colors"
            >
              Back to City Elections
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { city, election, issues, candidates } = data

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Link 
              href="/"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Search
            </Link>
            <span className="text-slate-500">→</span>
            <Link 
              href={`/c/${citySlug}`}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {city.name}, {city.state}
            </Link>
            <span className="text-slate-500">→</span>
            <span className="text-slate-300">{election.title}</span>
          </div>
        </nav>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-white">{election.title}</h1>
            <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {formatElectionType(election.electionType)}
            </span>
          </div>
          
          <p className="text-lg text-slate-300 mb-4">{election.shortDescription}</p>
          
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <div>
              <span className="font-medium">Election Date:</span>
              <span className="ml-2 text-white font-medium">
                {formatDate(election.electionDate)}
              </span>
            </div>
          </div>
        </header>

        <KeyDatesBar 
          electionDate={election.electionDate}
          keyDates={election.keyDates}
        />

        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Candidate Comparison</h2>
            <p className="text-slate-300">
              Compare the candidates' positions on key issues important to voters.
            </p>
          </div>

          <CandidateComparisonTable 
            candidates={candidates}
            issues={issues}
          />
        </section>

        <div className="text-center mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-slate-400">
            Information is provided for educational purposes. Please verify candidate details and voting information with official sources.
          </p>
        </div>
      </div>
    </div>
  )
}