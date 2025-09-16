'use client'

import { useState, useEffect, useCallback } from 'react'
import useSWR from 'swr'

interface City {
  id: string
  name: string
  state: string
  slug: string
}

interface CityTypeaheadProps {
  onCitySelect: (city: City) => void
  placeholder?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function CityTypeahead({ onCitySelect, placeholder = "Search for your city..." }: CityTypeaheadProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const { data, error, isLoading } = useSWR(
    query.length >= 2 ? `/api/cities?q=${encodeURIComponent(query)}` : null,
    fetcher,
    {
      dedupingInterval: 300,
      revalidateOnFocus: false,
    }
  )

  const cities = data?.items || []

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(value.length >= 2)
    setSelectedIndex(-1)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || cities.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => prev < cities.length - 1 ? prev + 1 : 0)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : cities.length - 1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleCitySelect(cities[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }, [isOpen, cities, selectedIndex])

  const handleCitySelect = useCallback((city: City) => {
    setQuery(`${city.name}, ${city.state}`)
    setIsOpen(false)
    setSelectedIndex(-1)
    onCitySelect(city)
  }, [onCitySelect])

  useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen(false)
      setSelectedIndex(-1)
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 text-lg text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-500"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />
        {isLoading && query.length >= 2 && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {error && (
            <div className="px-4 py-3 text-red-600">
              Error loading cities. Please try again.
            </div>
          )}
          
          {!error && cities.length === 0 && !isLoading && query.length >= 2 && (
            <div className="px-4 py-3 text-gray-500">
              No cities found for "{query}"
            </div>
          )}
          
          {!error && cities.length > 0 && (
            <ul role="listbox" className="py-1">
              {cities.map((city: City, index: number) => (
                <li
                  key={city.id}
                  role="option"
                  aria-selected={index === selectedIndex}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    index === selectedIndex ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                  }`}
                  onClick={() => handleCitySelect(city)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="font-medium">{city.name}</div>
                  <div className="text-sm text-gray-500">{city.state}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}