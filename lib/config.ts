import { ENV } from './env'

export const APP_CONFIG = {
  baseUrl: ENV.APP_URL,
  siteName: 'Informed Voter',
  description: 'Access important dates and compare candidates side-by-side for state and local elections.',
  title: 'Informed Voter - Make Informed Voting Decisions'
} as const