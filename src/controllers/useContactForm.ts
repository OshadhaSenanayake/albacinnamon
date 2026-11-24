import { useRef, useState } from 'react'
import type { FormEvent } from 'react'

import { isContactInterest, type ContactInterest } from '../models/contact'

export interface ContactValues {
  name: string
  email: string
  interest: ContactInterest
  message: string
}

type ContactErrors = Partial<Record<keyof ContactValues, string>>

function initialValues(): ContactValues {
  const requestedInterest = new URLSearchParams(window.location.search).get('interest')
  const interest = isContactInterest(requestedInterest) ? requestedInterest : 'general'

  return { name: '', email: '', interest, message: '' }
}

export function useContactForm() {
  const [values, setValues] = useState<ContactValues>(initialValues)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [step, setStep] = useState<'edit' | 'review' | 'sent'>('edit')
  const [sending, setSending] = useState(false)
  const [deliveryError, setDeliveryError] = useState('')
  const inFlight = useRef(false)
  const request = useRef<{ body: string; key: string } | null>(null)

  function updateField<Field extends keyof ContactValues>(field: Field, value: ContactValues[Field]) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function preview(event: FormEvent<HTMLFormElement>) {
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
    if (!isContactInterest(cleaned.interest)) nextErrors.interest = 'Please choose a topic.'
    if (cleaned.message.length < 20) nextErrors.message = 'Please add a little detail (at least 20 characters).'
    if (cleaned.message.length > 2000) nextErrors.message = 'Please keep your message under 2,000 characters.'

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = Object.keys(nextErrors)[0]
      event.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    setValues(cleaned)
    setDeliveryError('')
    setStep('review')
  }

  async function sendInquiry() {
    if (step !== 'review' || inFlight.current) return
    const body = JSON.stringify(values)
    if (request.current?.body !== body) {
      request.current = { body, key: Array.from(crypto.getRandomValues(new Uint32Array(4))).join('-') }
    }
    inFlight.current = true
    setSending(true)
    setDeliveryError('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': request.current.key },
        body,
      })
      const result = await response.json()
      if (response.status === 201 && (result?.delivery === 'email' || result?.delivery === 'demo')) {
        setStep('sent')
      } else {
        setDeliveryError(typeof result?.error === 'string' ? result.error : 'We could not confirm your submission. Please try again.')
      }
    } catch {
      setDeliveryError('We could not confirm your submission. Check your connection and try again.')
    } finally {
      inFlight.current = false
      setSending(false)
    }
  }

  function resetForm() {
    setValues(initialValues())
    setErrors({})
    request.current = null
    setDeliveryError('')
    setStep('edit')
  }

  return { values, errors, step, sending, deliveryError, updateField, preview, edit: () => setStep('edit'), sendInquiry, resetForm }
}
