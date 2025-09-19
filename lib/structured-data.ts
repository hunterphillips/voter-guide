import type { Election, City, Candidate } from '@prisma/client'
import { APP_CONFIG } from './config'

type ElectionWithRelations = Election & {
  city: City
  candidates: Candidate[]
}

export function generateElectionStructuredData(election: ElectionWithRelations) {
  const baseUrl = APP_CONFIG.baseUrl
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: election.title,
    description: election.shortDescription,
    startDate: election.electionDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: `${election.city.name}, ${election.city.state}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: election.city.name,
        addressRegion: election.city.state,
        addressCountry: 'US'
      }
    },
    organizer: {
      '@type': 'Organization',
      name: `${election.city.name} Election Office`,
      url: `${baseUrl}/c/${election.city.slug}`
    },
    url: `${baseUrl}/c/${election.city.slug}/e/${election.slug}`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    ...(election.registrationDeadline && {
      potentialAction: {
        '@type': 'RegisterAction',
        name: 'Register to Vote',
        target: `${baseUrl}/c/${election.city.slug}/e/${election.slug}`,
        deadline: election.registrationDeadline
      }
    })
  }
}

export function generateCandidateStructuredData(candidate: Candidate, election: ElectionWithRelations) {
  const baseUrl = APP_CONFIG.baseUrl
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: candidate.fullName,
    ...(candidate.summaryBio && { description: candidate.summaryBio }),
    ...(candidate.websiteUrl && { url: candidate.websiteUrl }),
    ...(candidate.photoUrl && { image: candidate.photoUrl }),
    ...(candidate.occupation && { jobTitle: candidate.occupation }),
    ...(candidate.residenceCity && {
      homeLocation: {
        '@type': 'Place',
        name: candidate.residenceCity
      }
    }),
    memberOf: candidate.party === 'R' ? 'Republican Party' : 
              candidate.party === 'D' ? 'Democratic Party' : 
              candidate.party === 'I' ? 'Independent' : 'Other',
    seeks: {
      '@type': 'Role',
      name: election.title,
      inEvent: {
        '@type': 'Event',
        name: election.title,
        startDate: election.electionDate,
        location: {
          '@type': 'Place',
          name: `${election.city.name}, ${election.city.state}`
        }
      }
    },
    mainEntityOfPage: `${baseUrl}/c/${election.city.slug}/e/${election.slug}`
  }
}

export function generateCityStructuredData(city: City, elections: Election[]) {
  const baseUrl = APP_CONFIG.baseUrl
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: `${city.name}, ${city.state}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: city.state,
      addressCountry: 'US'
    },
    url: `${baseUrl}/c/${city.slug}`,
    ...(city.lat && city.lng && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: city.lat,
        longitude: city.lng
      }
    }),
    ...(elections.length > 0 && {
      event: elections.map(election => ({
        '@type': 'Event',
        name: election.title,
        startDate: election.electionDate,
        url: `${baseUrl}/c/${city.slug}/e/${election.slug}`
      }))
    })
  }
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}