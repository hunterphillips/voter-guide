// Simple in-memory rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function createRateLimit(maxRequests: number, windowMs: number) {
  return {
    async limit(ip: string) {
      const now = Date.now()
      const key = ip
      const existing = rateLimitStore.get(key)
      
      if (!existing || now > existing.resetTime) {
        rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
        return { success: true }
      }
      
      if (existing.count >= maxRequests) {
        return { success: false }
      }
      
      existing.count++
      return { success: true }
    }
  }
}

// Rate limiter for search endpoints (stricter)
export const searchRateLimit = createRateLimit(30, 60000) // 30 requests per minute

// Rate limiter for general API endpoints
export const apiRateLimit = createRateLimit(60, 60000) // 60 requests per minute

// Helper function to get client IP
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const real = request.headers.get('x-real-ip')
  const cloudflare = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (real) {
    return real.trim()
  }
  if (cloudflare) {
    return cloudflare.trim()
  }
  
  return 'unknown'
}

// Rate limit response helper
export function createRateLimitResponse() {
  return new Response(JSON.stringify({ 
    error: 'Too many requests. Please try again later.' 
  }), {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'Retry-After': '60',
    },
  })
}