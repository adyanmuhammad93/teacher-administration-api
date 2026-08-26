import { suspendStudent } from '@/lib/teacher-service'
import { errorResponse, studentBody } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    await suspendStudent(studentBody(await request.json()).student)
    return new Response(null, { status: 204 })
  } catch (error) { return errorResponse(error) }
}
