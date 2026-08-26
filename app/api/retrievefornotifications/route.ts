import { notificationRecipients } from '@/lib/teacher-service'
import { errorResponse, mentionedEmails, notificationBody } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const { teacher, notification } = notificationBody(await request.json())
    const recipients = await notificationRecipients(teacher, mentionedEmails(notification))
    return Response.json({ recipients })
  } catch (error) { return errorResponse(error) }
}
