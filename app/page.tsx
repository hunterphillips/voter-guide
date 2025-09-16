'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CityTypeahead from '@/components/search/CityTypeahead'
import StateDropdown from '@/components/search/StateDropdown'

export default function Home() {
  const router = useRouter()
  const [searchMode, setSearchMode] = useState<'city' | 'state'>('city')

  const handleCitySelect = (city: { slug: string }) => {
    router.push(`/c/${city.slug}`)
  }

  const handleStateSelect = (stateCode: string) => {
    router.push(`/s/${stateCode.toLowerCase()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Voter Guide
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Find upcoming elections and compare candidates in your area
          </p>
          
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                <button
                  onClick={() => setSearchMode('city')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    searchMode === 'city'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Search by City
                </button>
                <button
                  onClick={() => setSearchMode('state')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    searchMode === 'state'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Browse by State
                </button>
              </div>
            </div>
            
            <div className="flex justify-center">
              {searchMode === 'city' ? (
                <CityTypeahead 
                  onCitySelect={handleCitySelect}
                  placeholder="Enter your city name..."
                />
              ) : (
                <div className="relative">
                  <StateDropdown onStateSelect={handleStateSelect} />
                </div>
              )}
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>
              {searchMode === 'city' 
                ? 'Search for your city to see upcoming elections and candidate information'
                : 'Select a state to browse all upcoming elections in that state'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
