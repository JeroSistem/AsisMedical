import { badRequest, ok } from '@/lib/http'

const DB_DISABLED_MESSAGE =
  'La base de datos ha sido deshabilitada. Esta API estará disponible cuando se configure una nueva capa de persistencia.'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') ?? ''
    const page = Number(searchParams.get('page') ?? '1')
    const pageSize = Number(searchParams.get('pageSize') ?? '10')
    const skip = (page - 1) * pageSize

    const where = q
      ? {
          OR: [
            { paciente: { contains: q } },
            { numeroAnexo: { contains: q } },
            { docNumero: { contains: q } },
          ],
        }
      : {}

    console.warn('GET /api/facturacion/anexo-inconsistencia sin capa de base de datos', { q, page, pageSize })
    return ok({ items: [], total: 0, page, pageSize, warning: DB_DISABLED_MESSAGE })
  } catch (e) {
    return serverError(e)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body || !body.paciente || !body.fechaReporte) return badRequest('Datos incompletos')
    console.warn('POST /api/facturacion/anexo-inconsistencia sin capa de base de datos', { body })
    return badRequest(DB_DISABLED_MESSAGE, 503)
  } catch (e) {
    return serverError(e)
  }
}

