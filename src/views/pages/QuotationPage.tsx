import { useRef, useState, type FormEvent } from 'react'
import { products } from '../../models/product'
import { Link } from '../components/Link'

export function QuotationPage() {
  const selected = new URLSearchParams(window.location.search).get('product')
  const pending = useRef(false)
  const submission = useRef<{ body: string; key: string } | null>(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending.current) return
    const form = new FormData(event.currentTarget)
    const body = JSON.stringify({ productId: form.get('productId'), name: form.get('name'), email: form.get('email'), quantity: Number(form.get('quantity')), message: form.get('message') })
    if (submission.current?.body !== body) submission.current = { body, key: Array.from(crypto.getRandomValues(new Uint32Array(4))).join('-') }
    pending.current = true
    setSending(true)
    setError('')
    try {
      const response = await fetch('/api/quotations', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': submission.current.key }, body })
      const result = await response.json()
      if (response.status === 201 && (result.delivery === 'email' || result.delivery === 'demo')) {
        setReceipt(result.delivery === 'demo' ? 'Inquiry saved to the demo mailbox.' : 'Quotation request sent. Our team will reply to ' + form.get('email') + '.')
      } else { setError(typeof result?.error === 'string' ? result.error : 'Please try submitting your request again.') }
    } catch { setError('Your request could not be confirmed. Check your connection and try again.') }
    finally { pending.current = false; setSending(false) }
  }
  return (
    <section className="container quotation-page">
      <div className="page-intro"><h1>Request a quotation</h1>
        {!receipt && <p>Select your product and quantity, and tell us where to email your quotation.</p>}
      </div>
      {receipt ? <div className="form-success" role="status"><h2>{receipt}</h2><Link href="/products" className="text-link">Back to products</Link></div> :
        <form className="contact-form" onSubmit={submit} aria-busy={sending}>
          <fieldset disabled={sending} aria-label="Quotation details">
            <div className="form-field"><label htmlFor="quotation-product">Product</label>
              <select id="quotation-product" name="productId" defaultValue={products.some(p => p.id === selected) ? selected! : ''} required>
                <option value="" disabled>Select a product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.weight})</option>)}
              </select>
            </div>
            <div className="form-field"><label htmlFor="quotation-quantity">Quantity in packs</label><input id="quotation-quantity" name="quantity" type="number" min={1} max={1000000} step={1} defaultValue={1} required /></div>
            <div className="form-row">
              <div className="form-field"><label htmlFor="quotation-name">Your name</label><input id="quotation-name" name="name" autoComplete="name" maxLength={100} required /></div>
              <div className="form-field"><label htmlFor="quotation-email">Email address</label><input id="quotation-email" name="email" type="email" autoComplete="email" maxLength={254} required /></div>
            </div>
            <div className="form-field"><label htmlFor="quotation-message">Additional details (optional)</label><textarea id="quotation-message" name="message" maxLength={2000} placeholder="Company, delivery destination or preferred timing" /></div>
          </fieldset>
          {error && <p role="alert" className="field-error">{error}</p>}
          <button type="submit" className="button button-primary" disabled={sending}>{sending ? 'Sending…' : 'Send quotation request'}</button>
        </form>}
    </section>
  )
}
