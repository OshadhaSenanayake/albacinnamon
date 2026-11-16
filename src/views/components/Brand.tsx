import { Link } from './Link'
export function Botanical({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M39 94c5-30-5-55 3-86M42 61C16 57 15 37 17 31c20 1 27 14 25 30ZM42 44c24-3 27-19 23-27-17 2-23 13-23 27ZM41 78C18 77 10 64 12 55c19-1 28 12 29 23ZM42 26C26 21 26 9 30 4c12 4 13 11 12 22Z" />
      <path d="m17 31 25 30m23-44L42 44M12 55l29 23M30 4l12 22" />
    </svg>
  )
}
export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`brand ${light ? 'brand-light' : ''}`} aria-label="Alba Cinnamon home">
      <Botanical />
      <span>ALBA<span className="brand-subtitle">CINNAMON</span></span>
    </Link>
  )
}
