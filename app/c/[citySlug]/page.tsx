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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">City Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn't find elections for this city.</p>
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
            {data.city.name}, {data.city.state}
          </h1>
          <p className="text-gray-600 mt-2">Upcoming elections in your area</p>
        </div>

        <ElectionList 
          citySlug={citySlug}
          elections={data.items}
        />
      </div>
    </div>
  )
}