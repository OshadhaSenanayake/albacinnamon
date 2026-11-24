import { useEffect, useRef } from 'react'
import { useContactForm } from '../../controllers/useContactForm'
import { interestLabels, type ContactInterest } from '../../models/contact'
import { Link } from '../components/Link'

export function ContactPage() {
  const { values, errors, step, sending, deliveryError, updateField, preview, edit, sendInquiry, resetForm } = useContactForm()
  const previousStep = useRef(step)
  const stepHeading = useRef<HTMLHeadingElement>(null)
  const nameInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (previousStep.current !== step) {
      previousStep.current = step
      if (step === 'edit') nameInput.current?.focus()
      else stepHeading.current?.focus()
    }
  }, [step])

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
          <p>Tell us what you have in mind. You can review your inquiry before sending it to our team.</p>
          <div className="contact-item"><span>Our roots</span><p>Down south of Sri Lanka, the home of Ceylon cinnamon.</p></div>
          <div className="contact-item"><span>Get in touch through</span><p><a href="mailto:hello@albacinnamon.com">hello@albacinnamon.com</a></p></div>
          <div className="contact-item"><span>From our island to your home</span><p>You’re one click away from the delicate sweetness and warm aroma of fine Ceylon cinnamon. <Link href="/products">Explore our collection.</Link></p></div>
        </div>

        {step === 'sent' ? (
          <div className="form-success">
            <h2 ref={stepHeading} tabIndex={-1}>Inquiry submitted successfully</h2>
            <p>Thank you, {values.name}. You’ve given us <strong>{values.email}</strong> as your reply address.</p>
            <div className="inquiry-actions"><button type="button" className="button button-primary" onClick={resetForm}>Submit another inquiry</button></div>
          </div>
        ) : step === 'review' ? (
          <div className="form-success" aria-busy={sending}>
            <h2 ref={stepHeading} tabIndex={-1}>Review your inquiry</h2>
            <p>Check your details, then send your message.</p>
            <dl className="enquiry-preview">
              <div><dt>From</dt><dd>{values.name}<br />{values.email}</dd></div>
              <div><dt>About</dt><dd>{interestLabels[values.interest]}</dd></div>
              <div><dt>Your message</dt><dd>{values.message}</dd></div>
            </dl>
            {deliveryError && <p className="field-error" role="alert">{deliveryError}</p>}
            <div className="inquiry-actions">
              <button type="button" className="button button-primary" disabled={sending} onClick={sendInquiry}>{sending ? 'Sending…' : 'Submit inquiry'}</button>
              <button type="button" className="text-link" disabled={sending} onClick={edit}>Edit inquiry</button>
            </div>
          </div>
        ) : (
          <form className="contact-form" noValidate onSubmit={preview}>
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
            <button className="button button-primary" type="submit">Preview inquiry <span aria-hidden="true">↗</span></button>
          </form>
        )}
      </section>

      <section className="faq-section container">
        <div><span className="eyebrow">A little clarity</span><h2>A few things<br />you might be wondering.</h2></div>
        <div className="faq-list">
          <details><summary>How can I get pricing and delivery details?</summary><p><Link href="/quotation">Request a quotation</Link> with your product, quantity, and delivery destination.</p></details>
          <details><summary>Which cinnamon format should I choose?</summary><p>Tuck a quill into a pot of simmering apples, fold the baking blend into biscuit dough, or steep a cinnamon tea bag for a quiet afternoon cup. For fragrance, try our <Link href="/products?q=oil">Ceylon Cinnamon Oil</Link> in a diffuser to fill your room with a warm, gently spiced aroma.</p></details>
          <details><summary>Can I enquire about a wholesale order?</summary><p>Yes. Choose “Wholesale &amp; bulk orders” above and tell us which products you need, the quantities, and your preferred delivery date.</p></details>
        </div>
      </section>
    </>
  )
}
