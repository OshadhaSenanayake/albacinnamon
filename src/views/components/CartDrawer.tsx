import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useStore } from '../../controllers/useStore'
import { formatPrice } from '../../models/product'
import { Modal } from './Modal'
import { Icon } from './Icon'
import { ProductVisual } from './ProductVisual'
import { Link } from './Link'

export function CartDrawer({ onClose }: { onClose: () => void }) {
  const { items, itemCount, subtotal, shipping, total, setQuantity, removeItem, clearCart } = useStore()
  const [step, setStep] = useState<'bag' | 'checkout' | 'complete'>('bag')
  const [receipt, setReceipt] = useState({ name: '', email: '', total: 0, reference: '' })
  const previousStep = useRef(step)
  const bagHeading = useRef<HTMLHeadingElement>(null)
  const customerName = useRef<HTMLInputElement>(null)
  const confirmationHeading = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (previousStep.current === step) return
    previousStep.current = step

    if (step === 'checkout') customerName.current?.focus()
    else if (step === 'complete') confirmationHeading.current?.focus()
    else bagHeading.current?.focus()
  }, [step])

  function completeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const nameInput = form.elements.namedItem('customerName') as HTMLInputElement
    if (!nameInput.value.trim()) {
      nameInput.setCustomValidity('Please enter your name.')
      nameInput.reportValidity()
      return
    }
    const data = new FormData(form)
    setReceipt({ name: nameInput.value.trim(), email: String(data.get('email')).trim(), total, reference: `ALBA-DEMO-${Date.now().toString(36).toUpperCase()}` })
    clearCart()
    setStep('complete')
  }

  return (
    <Modal titleId="bag-title" onClose={onClose} className="cart-drawer">
      <div className="cart-heading">
        <span className="eyebrow">A LITTLE GOODNESS, ALL YOURS</span>
        <h2 id="bag-title" ref={bagHeading} tabIndex={-1}>
          {step === 'bag' ? 'Your little collection.' : step === 'checkout' ? 'One last little step.' : 'A little warmth, on paper.'}
        </h2>
        {step === 'bag' && <p>{itemCount} {itemCount === 1 ? 'item' : 'items'} in your bag</p>}
      </div>
      {step === 'complete' ? (
        <div className="order-complete">
          <span className="order-check">
            <Icon name="check" size={32} />
          </span>
          <h3 ref={confirmationHeading} tabIndex={-1}>Thank you, {receipt.name.split(' ')[0]}.</h3>
          <p>Your demo order is complete. No payment was taken, no email was sent, and no products will be shipped.</p>
          <dl className="receipt">
            <div>
              <dt>Demo reference</dt>
              <dd>{receipt.reference}</dd>
            </div>
            <div>
              <dt>Email entered</dt>
              <dd>{receipt.email}</dd>
            </div>
            <div>
              <dt>Sample total</dt>
              <dd>{formatPrice(receipt.total)}</dd>
            </div>
          </dl>
          <Link href="/products" onClick={onClose} className="button button-primary">Keep exploring <Icon name="arrow" size={18} /></Link>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state cart-empty">
          <Icon name="bag" size={45} />
          <h3>A little room for something good.</h3>
          <p>Your bag is waiting for its first little comfort.</p>
          <Link href="/products" onClick={onClose} className="button button-primary">Explore the collection <Icon name="arrow" size={18} /></Link>
        </div>
      ) : (
        <>
          {step === 'bag' ? (
            <>
              <div className="shipping-note">
                <Icon name="truck" size={20} />
                <span>{subtotal >= 50 ? 'A lovely bonus: your shipping is on us.' : <>You’re {formatPrice(50 - subtotal)} away from free shipping.</>}</span>
                <div className="shipping-progress">
                  <span style={{ width: `${Math.min(subtotal / 50 * 100, 100)}%` }} />
                </div>
              </div>
              <div className="cart-items">
                {items.map(({ product, quantity }) => (
                  <article className="cart-item" key={product.id}>
                    <div className="cart-item-image">
                      <ProductVisual product={product} />
                    </div>
                    <div className="cart-item-content">
                      <h3>
                        {product.name}
                      </h3>
                      <p>{product.weight} <span>·</span> {formatPrice(product.price)}</p>
                      <div className="cart-item-bottom">
                        <div className="quantity-control">
                          <button onClick={() => setQuantity(product.id, quantity - 1)} aria-label={`Decrease ${product.name} quantity`}>
                            <Icon name="minus" size={14} />
                          </button>
                          <span aria-label={`Quantity ${quantity}`}>{quantity}</span>
                          <button
                            onClick={() => setQuantity(product.id, quantity + 1)}
                            disabled={quantity >= 99}
                            aria-label={`Increase ${product.name} quantity`}
                          >
                            <Icon name="plus" size={14} />
                          </button>
                        </div>
                        <strong>{formatPrice(product.price * quantity)}</strong>
                        <button
                          className="icon-button remove-item"
                          aria-label={`Remove ${product.name}`}
                          onClick={() => removeItem(product.id)}
                        >
                          <Icon name="trash" size={17} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : <button className="text-link back-to-bag" onClick={() => setStep('bag')}><Icon name="arrow" size={16} style={{ transform: 'rotate(180deg)' }} /> Back to your bag</button>}
          <div className="cart-totals">
            <div>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div>
              <span>Shipping</span>
              <span>{shipping === 0 ? 'On us' : formatPrice(shipping)}</span>
            </div>
            <div className="cart-total">
              <span>Total <small>USD</small></span>
              <strong>{formatPrice(total)}</strong>
            </div>
          </div>
          {step === 'bag' ? (
            <div className="cart-checkout">
              <button className="button button-primary" onClick={() => setStep('checkout')}>Review demo order <Icon name="arrow" size={18} /></button>
              <p>Just a little preview. No real orders or payments.</p>
              <button className="text-link" onClick={onClose}>Continue exploring</button>
            </div>
          ) : (
            <form className="checkout-form" onSubmit={completeOrder}>
              <div className="form-field">
                <label htmlFor="customer-name">Your name *</label>
                <input
                  name="customerName"
                  ref={customerName}
                  id="customer-name"
                  required
                  maxLength={100}
                  autoComplete="name"
                  placeholder="Your full name"
                  onInput={event => event.currentTarget.setCustomValidity('')}
                />
              </div>
              <div className="form-field">
                <label htmlFor="customer-email">Email address *</label>
                <input
                  type="email"
                  name="email"
                  id="customer-email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </div>
              <div className="demo-order-note">
                <Icon name="leaf" size={19} />
                <p>This is a sample checkout. Your details stay in this window. No order is placed and no payment details are needed.</p>
              </div>
              <button className="button button-primary" type="submit">Complete demo order <Icon name="check" size={18} /></button>
            </form>
          )}
        </>
      )}
    </Modal>
  )
}
