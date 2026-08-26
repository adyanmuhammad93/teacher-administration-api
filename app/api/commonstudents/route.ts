import { commonStudents } from '@/lib/teacher-service'
import { errorResponse, teacherQuery } from '@/lib/validation'

export async function GET(request: Request) {
  try {
    const teachers = teacherQuery(new URL(request.url).searchParams.getAll('teacher'))
    const rows = await commonStudents(teachers)
    return Response.json({ students: rows.map((row) => row.email) })
  } catch (error) { return errorResponse(error) }
}
