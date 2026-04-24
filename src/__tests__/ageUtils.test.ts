import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { calculateAge } from '@/lib/person/ageUtils'

describe('calculateAge', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns correct age when birthday has already passed this year', () => {
    vi.setSystemTime(new Date('2026-04-24'))
    const dob = new Date('1990-01-15')
    expect(calculateAge(dob)).toBe(36)
  })

  it('returns correct age when birthday is today', () => {
    vi.setSystemTime(new Date('2026-04-24'))
    const dob = new Date('2000-04-24')
    expect(calculateAge(dob)).toBe(26)
  })

  it('subtracts one year when birthday has not yet passed this year', () => {
    vi.setSystemTime(new Date('2026-04-24'))
    const dob = new Date('1990-12-31')
    expect(calculateAge(dob)).toBe(35)
  })

  it('handles a person born on Feb 29 (leap year) — non-leap current year', () => {
    vi.setSystemTime(new Date('2026-02-28'))
    const dob = new Date('2000-02-29')
    expect(calculateAge(dob)).toBe(25)
  })

  it('handles a person born on Feb 29 after their birthday month in a non-leap year', () => {
    vi.setSystemTime(new Date('2026-03-01'))
    const dob = new Date('2000-02-29')
    expect(calculateAge(dob)).toBe(26)
  })

  it('returns 0 for someone born earlier this same year', () => {
    vi.setSystemTime(new Date('2026-04-24'))
    const dob = new Date('2026-01-01')
    expect(calculateAge(dob)).toBe(0)
  })

  it('accepts a date string (via Date constructor coercion)', () => {
    vi.setSystemTime(new Date('2026-04-24'))
    const dob = new Date('1985-04-24')
    expect(calculateAge(dob)).toBe(41)
  })
})
