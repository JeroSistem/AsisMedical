import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
  formatters: {
    level: (label) => ({ level: label }),
    log: (object) => object
  }
})

// Convenience methods
export const log = {
  info: (msg: string, data?: any) => logger.info(data, msg),
  warn: (msg: string, data?: any) => logger.warn(data, msg),
  error: (msg: string, error?: any) => logger.error(error, msg),
  debug: (msg: string, data?: any) => logger.debug(data, msg)
}
