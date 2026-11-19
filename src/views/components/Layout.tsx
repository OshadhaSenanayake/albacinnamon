import { useState } from 'react'
import type { ReactNode } from 'react'
import { useStore } from '../../controllers/useStore'
import { Brand, Botanical } from './Brand'
import { Link } from './Link'
import { Icon } from './Icon'
import { CartDrawer } from './CartDrawer'

const navigation = [{ href: '/', label: 'Home' }, { href: '/services', label: 'Services' }, { href: '/products', label: 'Products' }, { href: '/contact', label: 'Contact' }]

export function Layout({ children, path }: { children: ReactNode; path: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { cartOpen, setCartOpen, toast, dismissToast } = useStore()
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="announcement">
        <div className="container">
          <span>A little warmth, delivered.</span>
          <span className="announcement-origin"><span /> ROOTED IN DOWN SOUTH OF SRI LANKA</span>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <nav className={`main-navigation ${menuOpen ? 'is-open' : ''}`} id="main-navigation" aria-label="Main navigation">
            {navigation.map(item => (
              <Link
                href={item.href}
                key={item.href}
                onClick={() => setMenuOpen(false)}
                className={path === item.href ? 'nav-link active' : 'nav-link'}
                aria-current={path === item.href ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link
              href="/products?search"
              className="icon-button header-search"
              aria-label="Search the collection"
              onClick={() => setMenuOpen(false)}
            >
              <Icon name="search" size={21} />
            </Link>
            <button
              className="icon-button menu-toggle"
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              aria-controls="main-navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>{children}</main>
      <footer className="site-footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <Brand light />
            <p>A little warmth.<br />A deeper connection.</p>
            <span className="footer-origin"><Icon name="leaf" size={16} /> Rooted in Sri Lanka. Shared with love.</span>
          </div>
          <div className="footer-links">
            <span className="eyebrow">EXPLORE ALBA</span>
            {navigation.map(item => (
              <Link href={item.href} key={item.href}>{item.label}</Link>
            ))}
          </div>
          <div className="footer-links">
            <span className="eyebrow">A LITTLE GOODNESS</span>
            <Link href="/products?q=sticks">Cinnamon sticks</Link>
            <Link href="/products?q=oil">Ceylon Cinnamon Oil</Link>
            <Link href="/products?q=tea">Cinnamon tea</Link>
            <Link href="/products?q=gift">Thoughtful gifts</Link>
          </div>
          <div className="footer-invitation">
            <Botanical />
            <span className="eyebrow">GOOD THINGS START WITH HELLO</span>
            <p>Let’s make something<br />beautiful together.</p>
            <Link href="/contact" className="text-link">Get in touch <Icon name="arrow-up" size={16} /></Link>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Alba Cinnamon</span>
          <span>Sample storefront · Products and prices are illustrative · No real orders or payments</span>
          <span>Good by nature.</span>
        </div>
      </footer>
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
      <div className={`toast ${toast ? 'is-visible' : ''}`} role="status" aria-live="polite">
        {toast && (
          <>
            <span className="toast-check">
              <Icon name="check" size={17} />
            </span>
            <span>{toast}</span>
            <button className="text-link" onClick={() => { dismissToast(); setCartOpen(true) }}>View bag</button>
            <button className="icon-button" aria-label="Dismiss notification" onClick={dismissToast}>
              <Icon name="close" size={17} />
            </button>
          </>
        )}
      </div>
    </>
  )
}
