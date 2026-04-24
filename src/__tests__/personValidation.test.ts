import { describe, it, expect } from 'vitest'
import { personApiSchema, personFormSchema } from '@/lib/validations/person'

const validApiPayload = {
  firstName: 'Somchai',
  lastName: 'Rakdee',
  dateOfBirth: '1990-06-15',
  address: '123 Sukhumvit Rd, Bangkok',
}

const validFormPayload = {
  firstName: 'Somchai',
  lastName: 'Rakdee',
  dateOfBirth: new Date('1990-06-15'),
  address: '123 Sukhumvit Rd, Bangkok',
}

describe('personApiSchema', () => {
  it('accepts a valid payload and coerces dateOfBirth to Date', () => {
    const result = personApiSchema.safeParse(validApiPayload)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.dateOfBirth).toBeInstanceOf(Date)
    }
  })

  it('rejects an empty firstName', () => {
    const result = personApiSchema.safeParse({ ...validApiPayload, firstName: '' })
    expect(result.success).toBe(false)
  })

  it('rejects firstName longer than 50 characters', () => {
    const result = personApiSchema.safeParse({ ...validApiPayload, firstName: 'A'.repeat(51) })
    expect(result.success).toBe(false)
  })

  it('rejects firstName with digits', () => {
    const result = personApiSchema.safeParse({ ...validApiPayload, firstName: 'John123' })
    expect(result.success).toBe(false)
  })

  it('accepts Thai characters in name fields', () => {
    const result = personApiSchema.safeParse({ ...validApiPayload, firstName: 'สมชาย', lastName: 'รักดี' })
    expect(result.success).toBe(true)
  })

  it('rejects a future dateOfBirth', () => {
    const result = personApiSchema.safeParse({ ...validApiPayload, dateOfBirth: '2099-01-01' })
    expect(result.success).toBe(false)
  })

  it('rejects an empty address', () => {
    const result = personApiSchema.safeParse({ ...validApiPayload, address: '' })
    expect(result.success).toBe(false)
  })

  it('accepts a short address (1+ characters)', () => {
    const result = personApiSchema.safeParse({ ...validApiPayload, address: 'BKK' })
    expect(result.success).toBe(true)
  })

  it('rejects address longer than 200 characters', () => {
    const result = personApiSchema.safeParse({ ...validApiPayload, address: 'A'.repeat(201) })
    expect(result.success).toBe(false)
  })

  it('trims whitespace from address', () => {
    const result = personApiSchema.safeParse({ ...validApiPayload, address: '  123 Sukhumvit Rd  ' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.address).toBe('123 Sukhumvit Rd')
    }
  })
})

describe('personFormSchema', () => {
  it('accepts a valid payload with Date object', () => {
    const result = personFormSchema.safeParse(validFormPayload)
    expect(result.success).toBe(true)
  })

  it('rejects a future date', () => {
    const future = new Date()
    future.setFullYear(future.getFullYear() + 1)
    const result = personFormSchema.safeParse({ ...validFormPayload, dateOfBirth: future })
    expect(result.success).toBe(false)
  })

  it('rejects a non-Date value for dateOfBirth', () => {
    const result = personFormSchema.safeParse({ ...validFormPayload, dateOfBirth: '1990-06-15' })
    expect(result.success).toBe(false)
  })
})
