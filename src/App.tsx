import { useEffect } from 'react'
import { QuotationPage } from './views/pages/QuotationPage'
import { useLocation } from './controllers/router'
import { Layout } from './views/components/Layout'
import { HomePage } from './views/pages/HomePage'
import { ProductsPage } from './views/pages/ProductsPage'
import { ServicesPage } from './views/pages/ServicesPage'
import { ContactPage } from './views/pages/ContactPage'
import { Link } from './views/components/Link'
import './App.css'

const titles: Record<string, string> = {
  '/': 'Alba Cinnamon',
  '/products': 'The collection',
  '/services': 'Our services',
  '/quotation': 'Request a quotation',
  '/contact': 'Get in touch',
}

export default function App() {
  const location = useLocation()
  const path = location.split('?')[0].replace(/\/$/, '') || '/'
  useEffect(() => {
    document.title = path === '/' ? titles[path] : `${titles[path] || 'Page not found'} | Alba Cinnamon`
    const focusSearch = path === '/products' && new URLSearchParams(window.location.search).has('search')
    if (!window.location.hash && !focusSearch) window.scrollTo({ top: 0, behavior: 'instant' })
    const focusTarget = focusSearch
      ? document.getElementById('product-search')
      : document.getElementById('main-content')
    focusTarget?.focus({ preventScroll: !focusSearch })
  }, [location, path])
  return (
    <Layout path={path}>
      {path === '/' ? <HomePage />
        : path === '/products' ? <ProductsPage key={location} />
        : path === '/services' ? <ServicesPage />
        : path === '/quotation' ? <QuotationPage key={location} />
        : path === '/contact' ? <ContactPage key={location} />
        : (
          <section className="container not-found">
            <span className="eyebrow">A LITTLE OFF THE BEATEN PATH</span>
            <h1>This page hasn’t taken root.</h1>
            <p>Let’s get you back to something good.</p>
            <Link href="/" className="button button-primary">Back to home</Link>
          </section>
        )}
    </Layout>
  )
}
