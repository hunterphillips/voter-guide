// Environment variable validation and configuration
function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name]
  
  if (!value && !defaultValue) {
    // Only throw in server environment
    if (typeof window === 'undefined') {
      throw new Error(`Missing required environment variable: ${name}`)
    }
    return defaultValue || ''
  }
  
  return value || defaultValue!
}

function getBooleanEnvVar(name: string, defaultValue: boolean = false): boolean {
  const value = process.env[name]
  
  if (!value) return defaultValue
  
  return value.toLowerCase() === 'true'
}


// Environment configuration
export const ENV = {
  // Node environment
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  
  // Database configuration (server-side only)
  DATABASE_URL: typeof window === 'undefined' ? getEnvVar('DATABASE_URL') : '',
  DATABASE_SSL: getBooleanEnvVar('DATABASE_SSL', true), // Default to SSL in production
  
  // Application configuration
  APP_URL: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  ENABLE_GEO: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_GEO', false),
  
  // Logging configuration
  LOG_LEVEL: getEnvVar('LOG_LEVEL', 'info'),
  
  // Security configuration
  RATE_LIMIT_ENABLED: getBooleanEnvVar('RATE_LIMIT_ENABLED', true),
} as const

// Validate critical environment variables on startup (server-side only)
export function validateEnvironment(): void {
  // Only validate on server side
  if (typeof window !== 'undefined') {
    return
  }
  
  const requiredVars = ['DATABASE_URL']
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`)
    }
  }
  
  // Validate database URL format
  if (ENV.DATABASE_URL && (!ENV.DATABASE_URL.startsWith('postgres') && !ENV.DATABASE_URL.startsWith('postgresql'))) {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection string')
  }
  
  // Production-specific validations
  if (ENV.IS_PRODUCTION) {
    if (ENV.APP_URL.includes('localhost')) {
      console.warn('Warning: APP_URL appears to be set to localhost in production')
    }
    
    if (ENV.DATABASE_URL && !ENV.DATABASE_URL.includes('sslmode=require')) {
      console.warn('Warning: Database SSL is not required in production')
    }
  }
}

// Redact sensitive information for logging
export function getRedactedEnv(): Record<string, any> {
  return {
    NODE_ENV: ENV.NODE_ENV,
    IS_PRODUCTION: ENV.IS_PRODUCTION,
    DATABASE_SSL: ENV.DATABASE_SSL,
    APP_URL: ENV.APP_URL,
    ENABLE_GEO: ENV.ENABLE_GEO,
    LOG_LEVEL: ENV.LOG_LEVEL,
    RATE_LIMIT_ENABLED: ENV.RATE_LIMIT_ENABLED,
    DATABASE_URL: ENV.DATABASE_URL ? '[REDACTED]' : 'NOT_SET',
  }
}