import { NextResponse } from 'next/server'

/** Health check liviano para Render (sin DB). */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'asismedical-web',
    time: new Date().toISOString(),
  })
}
