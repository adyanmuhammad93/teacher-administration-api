import { describe, expect, it } from 'vitest'
import { mentionedEmails, registerBody, teacherQuery } from '@/lib/validation'

describe('validation', () => {
  it('normalizes and deduplicates registration input', () => {
    expect(registerBody({ teacher: ' Teacher@Example.com ', students: ['A@x.com', 'a@x.com'] })).toEqual({ teacher: 'teacher@example.com', students: ['a@x.com'] })
  })
  it('requires teachers', () => {
    expect(() => teacherQuery([])).toThrow('At least one teacher')
  })
  it('extracts unique email mentions', () => {
    expect(mentionedEmails('Hi @A@x.com and @a@x.com')).toEqual(['a@x.com'])
  })
})
