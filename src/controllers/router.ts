import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback)
  return () => window.removeEventListener('popstate', callback)
}

export function navigate(href: string) {
  const target = new URL(href, window.location.href)
  const current = window.location.pathname + window.location.search
  const next = target.pathname + target.search
  if (current === next && !target.hash) {
    if (target.href !== window.location.href) window.history.pushState(null, '', target)
    const focusSearch = target.pathname.replace(/\/$/, '') === '/products' && target.searchParams.has('search')
    if (focusSearch) document.getElementById('product-search')?.focus()
    else {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.getElementById('main-content')?.focus({ preventScroll: true })
    }
    return
  }
  if (current === next && target.hash) {
    document.getElementById(decodeURIComponent(target.hash.slice(1)))?.scrollIntoView({ behavior: 'smooth' })
    window.history.pushState(null, '', target)
    return
  }
  window.history.pushState(null, '', target)
  window.dispatchEvent(new PopStateEvent('popstate'))
  if (target.hash) {
    requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(target.hash.slice(1)))?.scrollIntoView({ behavior: 'smooth' })
    })
  }
}

export function useLocation() {
  return useSyncExternalStore(subscribe, () => window.location.pathname + window.location.search, () => '/')
}
