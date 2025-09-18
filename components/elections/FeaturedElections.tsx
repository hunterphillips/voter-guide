'use client'

import useSWR from 'swr'
import Link from 'next/link'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default function FeaturedElections() {
  const { data, error, isLoading } = useSWR('/api/elections/featured', fetcher)

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-semibold text-white text-center mb-8">
          Featured Elections
        </h2>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
          <div className="divide-y divide-white/10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !data?.items?.length) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto mt-16">
      <h2 className="text-2xl font-semibold text-white text-center mb-8">
        Featured Elections
      </h2>
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden shadow-2xl">
        <div className="divide-y divide-white/10">
          {data.items.map((election: any, index: number) => (
            <Link
              key={election.slug}
              href={`/c/${election.city.slug}/e/${election.slug}`}
              className="block p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 text-blue-300 rounded-full flex items-center justify-center text-xs font-semibold border border-blue-400/30">
                  {election.city.state}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate">
                    {election.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-slate-300">
                      {election.city.name}, {election.city.state}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-sm text-slate-300">
                      {formatDate(election.electionDate)}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}