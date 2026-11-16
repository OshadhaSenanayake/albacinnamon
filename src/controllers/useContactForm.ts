import { useState } from 'react'
import type { FormEvent } from 'react'

const interests = ['general', 'wholesale', 'gifting', 'order'] as const

export type ContactInterest = (typeof interests)[number]

export interface ContactValues {
  name: string
  email: string
  interest: ContactInterest
  message: string
}

type ContactErrors = Partial<Record<keyof ContactValues, string>>

function initialValues(): ContactValues {
  const requestedInterest = new URLSearchParams(window.location.search).get('interest')
  const interest = interests.find((value) => value === requestedInterest) ?? 'general'

  return { name: '', email: '', interest, message: '' }
}

export function useContactForm() {
  const [values, setValues] = useState<ContactValues>(initialValues)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [submitted, setSubmitted] = useState<ContactValues | null>(null)

  function updateField<Field extends keyof ContactValues>(field: Field, value: ContactValues[Field]) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleaned = {
      name: values.name.trim(),
      email: values.email.trim(),
      interest: values.interest,
      message: values.message.trim(),
    }
    const nextErrors: ContactErrors = {}

    if (cleaned.name.length < 2) nextErrors.name = 'Please enter your name (at least 2 characters).'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)) {
      nextErrors.email = 'Please enter a valid email address.'
    }
    if (!interests.includes(cleaned.interest)) nextErrors.interest = 'Please choose a topic.'
    if (cleaned.message.length < 20) nextErrors.message = 'Please add a little detail (at least 20 characters).'
    if (cleaned.message.length > 2000) nextErrors.message = 'Please keep your message under 2,000 characters.'

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = Object.keys(nextErrors)[0]
      event.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    setSubmitted(cleaned)
  }

  function resetForm() {
    setValues(initialValues())
    setErrors({})
    setSubmitted(null)
  }

  return { values, errors, submitted, updateField, handleSubmit, resetForm }
}
