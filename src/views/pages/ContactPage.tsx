import { useEffect, useRef } from 'react'
import { useContactForm } from '../../controllers/useContactForm'
import type { ContactInterest } from '../../controllers/useContactForm'
import { Link } from '../components/Link'

const interestLabels: Record<ContactInterest, string> = {
  general: 'Just saying hello',
  wholesale: 'Wholesale & bulk orders',
  gifting: 'Gifting & special occasions',
  order: 'A question about an order',
}

export function ContactPage() {
  const { values, errors, submitted, updateField, handleSubmit, resetForm } = useContactForm()
  const previousSubmission = useRef(submitted)
  const successPreview = useRef<HTMLDivElement>(null)
  const nameInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (previousSubmission.current === submitted) return
    previousSubmission.current = submitted

    if (submitted) successPreview.current?.focus()
    else nameInput.current?.focus()
  }, [submitted])

  return (
    <>
      <section className="page-intro container">
        <span className="eyebrow">A little hello goes a long way</span>
        <h1>Let’s start<br /><em>a conversation.</em></h1>
        <p>Curious about our cinnamon, planning a thoughtful gift, or looking to work together? You’re in the right place.</p>
      </section>

      <section className="contact-grid container">
        <div className="contact-details">
          <span className="eyebrow">We’d love to hear from you</span>
          <h2>A good conversation<br />is the start of<br />something good.</h2>
          <p>Tell us a little about yourself and what you’re looking for. Start with the form to create a preview of your enquiry.</p>
          <div className="contact-item"><span>Our roots</span><p>Sri Lanka, the home of Ceylon cinnamon.</p></div>
          <div className="contact-item"><span>Sample contact</span><p>hello@albacinnamon.example</p><small>Illustrative address for this demo.</small></div>
          <div className="contact-item"><span>Good things to know</span><p>This is a sample storefront. The form creates a local preview and does not send or store your enquiry.</p></div>
        </div>

        {submitted ? (
          <div className="form-success" ref={successPreview} role="status" aria-live="polite" tabIndex={-1}>
            <span className="eyebrow">A little preview</span>
            <h2>Your enquiry is ready, {submitted.name.split(' ')[0]}.</h2>
            <p>This is a demo confirmation. Your message has not been sent or saved.</p>
            <dl className="enquiry-preview">
              <div><dt>From</dt><dd>{submitted.name}<br />{submitted.email}</dd></div>
              <div><dt>About</dt><dd>{interestLabels[submitted.interest]}</dd></div>
              <div><dt>Your message</dt><dd>{submitted.message}</dd></div>
            </dl>
            <button type="button" className="button button-primary" onClick={resetForm}>Start another enquiry <span aria-hidden="true">↗</span></button>
          </div>
        ) : (
          <form className="contact-form" noValidate onSubmit={handleSubmit}>
            <h2>Send a little warmth our way.</h2>
            <p>Fields marked with * are required.</p>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="contact-name">Your name *</label>
                <input id="contact-name" ref={nameInput} name="name" type="text" autoComplete="name" required maxLength={100} placeholder="Your full name" value={values.name} onChange={(event) => updateField('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
                {errors.name && <span className="field-error" id="name-error">{errors.name}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="contact-email">Email address *</label>
                <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" value={values.email} onChange={(event) => updateField('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />
                {errors.email && <span className="field-error" id="email-error">{errors.email}</span>}
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="contact-interest">What’s on your mind? *</label>
              <select id="contact-interest" name="interest" required value={values.interest} onChange={(event) => updateField('interest', event.target.value as ContactInterest)} aria-invalid={Boolean(errors.interest)} aria-describedby={errors.interest ? 'interest-error' : undefined}>
                {Object.entries(interestLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              {errors.interest && <span className="field-error" id="interest-error">{errors.interest}</span>}
            </div>
            <div className="form-field">
              <label htmlFor="contact-message">Your message *</label>
              <textarea id="contact-message" name="message" required minLength={20} maxLength={2000} rows={6} placeholder="Tell us a little about what you have in mind…" value={values.message} onChange={(event) => updateField('message', event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : 'message-hint'} />
              {errors.message ? <span className="field-error" id="message-error">{errors.message}</span> : <small id="message-hint">20–2,000 characters. Please avoid sensitive personal information.</small>}
            </div>
            <button className="button button-primary" type="submit">Preview enquiry <span aria-hidden="true">↗</span></button>
            <p className="form-note">A sample form, made for exploring. Nothing is sent to a server.</p>
          </form>
        )}
      </section>

      <section className="faq-section container">
        <div><span className="eyebrow">A little clarity</span><h2>A few things<br />you might be wondering.</h2></div>
        <div className="faq-list">
          <details><summary>How does shipping work?</summary><p>In this sample store, shipping is $4.95 USD, or free when your product subtotal reaches $50. No physical orders are fulfilled.</p></details>
          <details><summary>Which cinnamon format should I choose?</summary><p>Our sample collection includes cinnamon in quills, ground powder, and tea. Each format brings a different touch to your kitchen. Explore our <Link href="/products">sample Ceylon cinnamon collection</Link> to find your favourite format.</p></details>
          <details><summary>Can I enquire about a wholesale order?</summary><p>Of course. Choose “Wholesale & bulk orders” above and include your preferred products, approximate quantities, and timing in your enquiry preview.</p></details>
        </div>
      </section>
    </>
  )
}
