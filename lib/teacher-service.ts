import { db } from './db'
import { NotFoundError } from './validation'

export async function registerStudents(teacher: string, students: string[]) {
  await db.$transaction(async (transaction) => {
    const teacherRecord = await transaction.teacher.upsert({
      where: { email: teacher },
      update: {},
      create: { email: teacher },
    })

    for (const email of students) {
      const studentRecord = await transaction.student.upsert({
        where: { email },
        update: {},
        create: { email },
      })

      await transaction.teacherStudent.upsert({
        where: { teacherId_studentId: { teacherId: teacherRecord.id, studentId: studentRecord.id } },
        update: {},
        create: { teacherId: teacherRecord.id, studentId: studentRecord.id },
      })
    }
  })
}

export async function commonStudents(teachers: string[]) {
  const teacherRecords = await db.teacher.findMany({
    where: { email: { in: teachers } },
    select: { id: true },
  })
  if (teacherRecords.length !== teachers.length) return []

  const relations = await db.teacherStudent.findMany({
    where: { teacherId: { in: teacherRecords.map(({ id }) => id) } },
    select: { studentId: true },
  })
  const studentIds = [...relations.reduce((counts, { studentId }) => {
    counts.set(studentId, (counts.get(studentId) ?? 0) + 1)
    return counts
  }, new Map<number, number>())]
    .filter(([, count]) => count === teachers.length)
    .map(([studentId]) => studentId)

  return db.student.findMany({
    where: { id: { in: studentIds } },
    select: { email: true },
    orderBy: { email: 'asc' },
  })
}

export async function suspendStudent(student: string) {
  const result = await db.student.updateMany({
    where: { email: student },
    data: { suspended: true },
  })
  if (!result.count) throw new NotFoundError('Student not found')
}

export async function notificationRecipients(teacher: string, mentions: string[]) {
  const students = await db.student.findMany({
    where: {
      suspended: false,
      OR: [
        { email: { in: mentions } },
        { teacherStudents: { some: { teacher: { email: teacher } } } },
      ],
    },
    select: { email: true },
    orderBy: { email: 'asc' },
  })
  return students.map(({ email }) => email)
}
