import { logger } from './logger'

type WindowState = {
  count: number
  resetAt: number
}

/** Limitador en memoria (sin deps externas) para no romper el build de Next. */
class MemoryRateLimiter {
  private readonly hits = new Map<string, WindowState>()

  constructor(
    private readonly points: number,
    private readonly durationSec: number
  ) {}

  async consume(key: string): Promise<void> {
    const now = Date.now()
    const windowMs = this.durationSec * 1000
    const current = this.hits.get(key)

    if (!current || current.resetAt <= now) {
      this.hits.set(key, { count: 1, resetAt: now + windowMs })
      return
    }

    if (current.count >= this.points) {
      const error = new Error('Rate limit exceeded') as Error & { msBeforeNext?: number }
      error.msBeforeNext = current.resetAt - now
      throw error
    }

    current.count += 1
  }

  async get(key: string): Promise<{ remainingPoints: number } | null> {
    const now = Date.now()
    const current = this.hits.get(key)
    if (!current || current.resetAt <= now) {
      return { remainingPoints: this.points }
    }
    return { remainingPoints: Math.max(0, this.points - current.count) }
  }
}

const limiter = new MemoryRateLimiter(
  parseInt(process.env.RATE_LIMIT_POINTS || '100', 10),
  parseInt(process.env.RATE_LIMIT_DURATION || '60', 10)
)

export async function limitOrThrow(ip: string, key = 'global') {
  try {
    await limiter.consume(`${key}:${ip}`)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'unknown'
    logger.warn('Rate limit exceeded', { ip, key, error: message })
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
