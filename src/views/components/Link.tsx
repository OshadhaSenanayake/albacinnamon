import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { navigate } from '../../controllers/router'

export function Link({ href = '/', onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)
    if (
      event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
      event.shiftKey || event.altKey || props.target || props.download
    ) return
    const target = new URL(href, window.location.href)
    if (target.origin !== window.location.origin) return
    event.preventDefault()
    navigate(href)
  }
  return <a {...props} href={href} onClick={handleClick} />
}
