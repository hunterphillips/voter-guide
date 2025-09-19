export const APP_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://informedvoter.vote',
  siteName: 'Informed Voter',
  description: 'Access important dates and compare candidates side-by-side for state and local elections.',
  title: 'Informed Voter - Make Informed Voting Decisions'
} as const