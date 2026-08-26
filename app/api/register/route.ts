import { registerStudents } from '@/lib/teacher-service'
import { errorResponse, registerBody } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const { teacher, students } = registerBody(await request.json())
    await registerStudents(teacher, students)
    return new Response(null, { status: 204 })
  } catch (error) { return errorResponse(error) }
}
