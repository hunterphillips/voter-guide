import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'
import { APP_CONFIG } from '@/lib/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = APP_CONFIG.baseUrl
  
  // Static pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  try {
    // Get all active cities
    const cities = await prisma.city.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    })

    // Add city pages
    cities.forEach(city => {
      routes.push({
        url: `${baseUrl}/c/${city.slug}`,
        lastModified: city.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })

    // Get all active elections with their cities
    const elections = await prisma.election.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
        city: {
          select: { slug: true }
        }
      },
    })

    // Add election pages
    elections.forEach(election => {
      routes.push({
        url: `${baseUrl}/c/${election.city.slug}/e/${election.slug}`,
        lastModified: election.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.9,
      })
    })

    // Get all unique states from cities
    const states = await prisma.city.findMany({
      where: { isActive: true },
      select: { state: true },
      distinct: ['state'],
    })

    // Add state pages
    states.forEach(state => {
      routes.push({
        url: `${baseUrl}/s/${state.state.toLowerCase()}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    })

  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static routes if database query fails
  }

  return routes
}