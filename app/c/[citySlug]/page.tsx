'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import Link from 'next/link'
import ElectionList from '@/components/elections/ElectionList'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function CityPage() {
  const params = useParams()
  const citySlug = params.citySlug as string

  const { data, error, isLoading } = useSWR(
    `/api/cities/${citySlug}/elections`,
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
            <h1 className="text-2xl font-bold text-white mb-4">City Not Found</h1>
            <p className="text-slate-300 mb-6">We couldn't find elections for this city.</p>
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

  return (
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
            {data.city.name}, {data.city.state}
          </h1>
          <p className="text-slate-300">Upcoming elections in your area</p>
        </div>

        <ElectionList 
          citySlug={citySlug}
          elections={data.items}
        />
      </div>
    </div>
  )
}