import { RateLimiterMemory } from 'rate-limiter-flexible'
import { logger } from './logger'

const limiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_POINTS || '100'),
  duration: parseInt(process.env.RATE_LIMIT_DURATION || '60')
})

export async function limitOrThrow(ip: string, key = 'global') {
  try {
    await limiter.consume(`${key}:${ip}`)
  } catch (error: any) {
    logger.warn('Rate limit exceeded', { ip, key, error: error.message })
    throw new Error('Too many requests. Please try again later.')
  }
}

export async function getRemainingPoints(ip: string, key = 'global') {
  try {
    const res = await limiter.get(`${key}:${ip}`)
    return res?.remainingPoints || 0
  } catch {
    return 0
  }
}
