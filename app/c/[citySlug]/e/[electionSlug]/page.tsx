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
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-96 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="h-32 bg-gray-200 rounded mb-8"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Election Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn't find this election.</p>
            <Link 
              href={`/c/${citySlug}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Search
            </Link>
            <span className="text-gray-400">→</span>
            <Link 
              href={`/c/${citySlug}`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {city.name}, {city.state}
            </Link>
            <span className="text-gray-400">→</span>
            <span className="text-gray-600">{election.title}</span>
          </div>
        </nav>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{election.title}</h1>
            <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
              {formatElectionType(election.electionType)}
            </span>
          </div>
          
          <p className="text-lg text-gray-600 mb-4">{election.shortDescription}</p>
          
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div>
              <span className="font-medium">Election Date:</span>
              <span className="ml-2 text-gray-900 font-medium">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Candidate Comparison</h2>
            <p className="text-gray-600">
              Compare the candidates' positions on key issues important to voters.
            </p>
          </div>

          <CandidateComparisonTable 
            candidates={candidates}
            issues={issues}
          />
        </section>

        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Information is provided for educational purposes. Please verify candidate details and voting information with official sources.
          </p>
        </div>
      </div>
    </div>
  )
}