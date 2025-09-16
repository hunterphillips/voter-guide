import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const nashville = await prisma.city.upsert({
    where: { slug: 'nashville-tn' },
    update: {},
    create: {
      name: 'Nashville',
      state: 'TN',
      county: 'Davidson',
      lat: 36.1627,
      lng: -86.7816,
      slug: 'nashville-tn',
      isActive: true,
    },
  })

  const election = await prisma.election.upsert({
    where: {
      cityId_slug: {
        cityId: nashville.id,
        slug: 'us-house-tn-7-2025-special-primary'
      }
    },
    update: {},
    create: {
      cityId: nashville.id,
      title: 'U.S. House TN-7 Special Primary',
      shortDescription: 'Fills the vacant U.S. House seat for Tennessee\'s 7th Congressional District',
      electionDate: new Date('2025-10-07'),
      electionType: 'SPECIAL_PRIMARY',
      registrationDeadline: new Date('2025-09-08'),
      earlyVotingStart: new Date('2025-09-17'),
      earlyVotingEnd: new Date('2025-10-02'),
      absenteeDeadline: new Date('2025-09-27'),
      slug: 'us-house-tn-7-2025-special-primary',
      isActive: true,
    },
  })

  const issues = await Promise.all([
    prisma.issue.upsert({
      where: { slug: 'economy-taxes' },
      update: {},
      create: {
        slug: 'economy-taxes',
        name: 'Economy & Taxes',
        category: 'economy',
        displayOrder: 1,
      },
    }),
    prisma.issue.upsert({
      where: { slug: 'healthcare' },
      update: {},
      create: {
        slug: 'healthcare',
        name: 'Healthcare',
        category: 'healthcare',
        displayOrder: 2,
      },
    }),
    prisma.issue.upsert({
      where: { slug: 'education' },
      update: {},
      create: {
        slug: 'education',
        name: 'Education',
        category: 'education',
        displayOrder: 3,
      },
    }),
    prisma.issue.upsert({
      where: { slug: 'reproductive-rights' },
      update: {},
      create: {
        slug: 'reproductive-rights',
        name: 'Reproductive Rights',
        category: 'social',
        displayOrder: 4,
      },
    }),
    prisma.issue.upsert({
      where: { slug: 'public-safety-veterans' },
      update: {},
      create: {
        slug: 'public-safety-veterans',
        name: 'Public Safety & Veterans',
        category: 'public-safety',
        displayOrder: 5,
      },
    }),
    prisma.issue.upsert({
      where: { slug: 'immigration-border' },
      update: {},
      create: {
        slug: 'immigration-border',
        name: 'Immigration & Border',
        category: 'immigration',
        displayOrder: 6,
      },
    }),
  ])

  const candidates = await Promise.all([
    prisma.candidate.create({
      data: {
        electionId: election.id,
        fullName: 'John Smith',
        party: 'R',
        ballotName: 'John Smith',
        incumbent: false,
        websiteUrl: 'https://johnsmith.com',
        residenceCity: 'Nashville',
        occupation: 'Business Owner',
        summaryBio: 'Local business owner and community leader with 15 years experience in small business management.',
        displayOrder: 1,
      },
    }),
    prisma.candidate.create({
      data: {
        electionId: election.id,
        fullName: 'Sarah Johnson',
        party: 'D',
        ballotName: 'Sarah Johnson',
        incumbent: false,
        websiteUrl: 'https://sarahjohnson.com',
        residenceCity: 'Nashville',
        occupation: 'Former City Council Member',
        summaryBio: 'Former Nashville City Council member with focus on economic development and healthcare access.',
        displayOrder: 2,
      },
    }),
    prisma.candidate.create({
      data: {
        electionId: election.id,
        fullName: 'Michael Davis',
        party: 'I',
        ballotName: 'Michael Davis',
        incumbent: false,
        residenceCity: 'Brentwood',
        occupation: 'Teacher',
        summaryBio: 'High school teacher and education advocate running on a platform of government reform.',
        displayOrder: 3,
      },
    }),
  ])

  console.log({ nashville, election, issues, candidates })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })