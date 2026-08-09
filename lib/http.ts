export function ok<T>(data: T, init: ResponseInit = {}) {
  return Response.json({ success: true, data }, { status: 200, ...init })
}

export function created<T>(data: T, init: ResponseInit = {}) {
  return Response.json({ success: true, data }, { status: 201, ...init })
}

export function badRequest(error: unknown, status = 400) {
  const message = error instanceof Error ? error.message : String(error)
  return Response.json({ success: false, error: message }, { status })
}

export function unauthorized(message = 'Unauthorized') {
  return Response.json({ success: false, error: message }, { status: 401 })
}

export function forbidden(message = 'Forbidden') {
  return Response.json({ success: false, error: message }, { status: 403 })
}

export function notFound(message = 'Not found') {
  return Response.json({ success: false, error: message }, { status: 404 })
}

export function serverError(error: unknown, status = 500) {
  const message = error instanceof Error ? error.message : 'Internal server error'
  return Response.json({ success: false, error: message }, { status })
}
