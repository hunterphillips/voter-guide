import { NextRequest } from 'next/server'

// Slug validation patterns
const CITY_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*-[a-z]{2}$/
const ELECTION_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const STATE_CODE_PATTERN = /^[a-z]{2}$/

// Input length limits
const MAX_SEARCH_QUERY_LENGTH = 100
const MAX_SLUG_LENGTH = 100

export interface ValidationError {
  field: string
  message: string
}

export class ValidationException extends Error {
  constructor(public errors: ValidationError[]) {
    super('Validation failed')
    this.name = 'ValidationException'
  }
}

export function validateCitySlug(slug: string): void {
  if (!slug || typeof slug !== 'string') {
    throw new ValidationException([{ field: 'citySlug', message: 'City slug is required' }])
  }
  
  if (slug.length > MAX_SLUG_LENGTH) {
    throw new ValidationException([{ field: 'citySlug', message: 'City slug too long' }])
  }
  
  if (!CITY_SLUG_PATTERN.test(slug)) {
    throw new ValidationException([{ field: 'citySlug', message: 'Invalid city slug format' }])
  }
}

export function validateElectionSlug(slug: string): void {
  if (!slug || typeof slug !== 'string') {
    throw new ValidationException([{ field: 'electionSlug', message: 'Election slug is required' }])
  }
  
  if (slug.length > MAX_SLUG_LENGTH) {
    throw new ValidationException([{ field: 'electionSlug', message: 'Election slug too long' }])
  }
  
  if (!ELECTION_SLUG_PATTERN.test(slug)) {
    throw new ValidationException([{ field: 'electionSlug', message: 'Invalid election slug format' }])
  }
}

export function validateStateCode(code: string): void {
  if (!code || typeof code !== 'string') {
    throw new ValidationException([{ field: 'stateCode', message: 'State code is required' }])
  }
  
  if (!STATE_CODE_PATTERN.test(code)) {
    throw new ValidationException([{ field: 'stateCode', message: 'Invalid state code format' }])
  }
}

export function validateSearchQuery(query: string): string {
  if (!query || typeof query !== 'string') {
    throw new ValidationException([{ field: 'q', message: 'Search query is required' }])
  }
  
  if (query.length > MAX_SEARCH_QUERY_LENGTH) {
    throw new ValidationException([{ field: 'q', message: 'Search query too long' }])
  }
  
  // Normalize and sanitize the search query
  const normalized = query
    .trim()
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .replace(/[^\w\s\-'.]/g, '') // Allow letters, numbers, spaces, hyphens, periods, apostrophes
    .substring(0, MAX_SEARCH_QUERY_LENGTH)
  
  if (normalized.length < 2) {
    throw new ValidationException([{ field: 'q', message: 'Search query must be at least 2 characters' }])
  }
  
  return normalized
}

export function generateSearchVariations(query: string): string[] {
  const variations = [query]
  
  // Handle common abbreviations and variations
  const abbreviations: Record<string, string[]> = {
    'dc': ['D.C.', 'Washington'],
    'd.c.': ['DC', 'Washington'],
    'nyc': ['New York City', 'New York'],
    'ny': ['New York'],
    'la': ['Los Angeles'],
    'sf': ['San Francisco'],
    'chi': ['Chicago'],
    'philly': ['Philadelphia'],
    'vegas': ['Las Vegas'],
    'st': ['Saint'],
    'saint': ['St'],
    'ft': ['Fort'],
    'fort': ['Ft'],
    'mt': ['Mount'],
    'mount': ['Mt']
  }
  
  const lowerQuery = query.toLowerCase()
  
  // Add abbreviation variations
  if (abbreviations[lowerQuery]) {
    variations.push(...abbreviations[lowerQuery])
  }
  
  // Handle "St." / "Saint" variations for any city
  if (lowerQuery.startsWith('st ') || lowerQuery.startsWith('st.')) {
    const cityPart = query.substring(query.indexOf(' ') + 1)
    variations.push(`Saint ${cityPart}`)
  } else if (lowerQuery.startsWith('saint ')) {
    const cityPart = query.substring(6)
    variations.push(`St. ${cityPart}`)
    variations.push(`St ${cityPart}`)
  }
  
  // Handle "Fort" / "Ft" variations
  if (lowerQuery.startsWith('ft ') || lowerQuery.startsWith('ft.')) {
    const cityPart = query.substring(query.indexOf(' ') + 1)
    variations.push(`Fort ${cityPart}`)
  } else if (lowerQuery.startsWith('fort ')) {
    const cityPart = query.substring(5)
    variations.push(`Ft. ${cityPart}`)
    variations.push(`Ft ${cityPart}`)
  }
  
  // Remove duplicates and empty strings
  return [...new Set(variations.filter(v => v.length >= 2))]
}

export function getQueryParam(request: NextRequest, param: string): string | null {
  const { searchParams } = new URL(request.url)
  return searchParams.get(param)
}

export function handleValidationError(error: unknown): Response {
  if (error instanceof ValidationException) {
    return Response.json(
      { 
        error: 'Validation failed',
        details: error.errors
      },
      { status: 400 }
    )
  }
  
  // Re-throw if not a validation error
  throw error
}