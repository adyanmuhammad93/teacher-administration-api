export class ValidationError extends Error {
  status = 400
}

export class NotFoundError extends Error {
  status = 404
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function email(value: unknown, field = 'email'): string {
  if (typeof value !== 'string' || !EMAIL_RE.test(value.trim())) {
    throw new ValidationError(`${field} must be a valid email address`)
  }
  return value.trim().toLowerCase()
}

export function registerBody(body: unknown) {
  if (!body || typeof body !== 'object') throw new ValidationError('Request body must be JSON')
  const input = body as { teacher?: unknown; students?: unknown }
  const teacher = email(input.teacher, 'teacher')
  if (!Array.isArray(input.students) || input.students.length === 0) {
    throw new ValidationError('students must be a non-empty array')
  }
  const students = [...new Set(input.students.map((student) => email(student, 'student')))]
  return { teacher, students }
}

export function studentBody(body: unknown) {
  if (!body || typeof body !== 'object') throw new ValidationError('Request body must be JSON')
  return { student: email((body as { student?: unknown }).student, 'student') }
}

export function notificationBody(body: unknown) {
  if (!body || typeof body !== 'object') throw new ValidationError('Request body must be JSON')
  const input = body as { teacher?: unknown; notification?: unknown }
  if (typeof input.notification !== 'string') throw new ValidationError('notification must be a string')
  return { teacher: email(input.teacher, 'teacher'), notification: input.notification }
}

export function teacherQuery(values: string[]) {
  if (!values.length) throw new ValidationError('At least one teacher query parameter is required')
  return [...new Set(values.map((value) => email(value, 'teacher')))]
}

export function errorResponse(error: unknown) {
  const status = error instanceof ValidationError || error instanceof NotFoundError ? error.status : 500
  const message = error instanceof Error ? error.message : 'Internal server error'
  return Response.json({ message }, { status })
}

export function mentionedEmails(text: string) {
  return [...new Set(text.match(/@[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)?.map((match) => match.slice(1).toLowerCase()) ?? [])]
}
