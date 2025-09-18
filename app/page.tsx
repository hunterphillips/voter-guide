'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import Image from 'next/image';
import CityTypeahead from '@/components/search/CityTypeahead';
import StateDropdown from '@/components/search/StateDropdown';
import FeaturedElections from '@/components/elections/FeaturedElections';
import ShareButton from '@/components/shared/ShareButton';

export default function Home() {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState<'city' | 'state'>('city');

  const handleCitySelect = (city: { slug: string }) => {
    router.push(`/c/${city.slug}`);
  };

  const handleStateSelect = (stateCode: string) => {
    router.push(`/s/${stateCode.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto text-center mb-20">
          <div className="mb-8">
            {/* <div className="inline-flex items-center px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full mb-6">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-blue-300 text-sm font-medium">
                Election Voter Guide
              </span>
            </div> */}

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Make Informed
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Voting Decisions
              </span>
            </h1>

            {/* Hero Image */}
            {/* <div className="mb-8">
              <Image
                src="/voter-guide-hero.png"
                alt="Voter Guide - Make Informed Voting Decisions"
                width={600}
                height={300}
                className="mx-auto rounded-lg shadow-2xl"
                priority
              />
            </div> */}

            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Access important dates and compare candidates side-by-side for
              state and local elections.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-12 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified Data Sources
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Nonpartisan
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                Up-to-Date Information
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              Find Your Elections
            </h2>

            <div className="mb-8">
              <div className="flex justify-center mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
                  <button
                    onClick={() => setSearchMode('city')}
                    className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      searchMode === 'city'
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Search by City
                  </button>
                  <button
                    onClick={() => setSearchMode('state')}
                    className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      searchMode === 'state'
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
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

            <div className="text-sm text-slate-400 text-center">
              <p>
                {searchMode === 'city'
                  ? 'Search for your city to see upcoming elections and candidate information'
                  : 'Select a state to see all upcoming elections in that state'}
              </p>
            </div>
          </div>
        </div>

        <FeaturedElections />

        {/* Footer with Social Sharing */}
        <footer className="mt-20 pt-12 border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Help Others Stay Informed
              </h3>
              <p className="text-slate-300 mb-4">
                Share this voter guide to help more people make informed
                decisions
              </p>
              <div className="flex justify-center">
                <ShareButton
                  url="https://informed-voter.com"
                  title="Informed Voter - Make Informed Voting Decisions"
                  description="Access important dates and compare candidates side-by-side for state and local elections."
                />
              </div>
            </div>

            <div className="text-sm text-slate-500 space-y-2">
              <p>&copy; 2025 Informed Voter. Built to strengthen democracy.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
