import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button, { variants } from '@/components/shared/Button'

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeDefined()
  })

  it('defaults to the primary variant class', () => {
    render(<Button>Save</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain(variants.primary.split(' ')[0])
  })

  it('applies the cancel variant class when specified', () => {
    render(<Button variant="cancel">Delete</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain(variants.cancel.split(' ')[0])
  })

  it('calls onClick when clicked', async () => {
    const handler = vi.fn()
    render(<Button onClick={handler}>Submit</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const handler = vi.fn()
    render(<Button disabled onClick={handler}>Submit</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handler).not.toHaveBeenCalled()
  })

  it('sets the disabled attribute when disabled prop is true', () => {
    render(<Button disabled>Save</Button>)
    const btn = screen.getByRole('button') as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })
})
