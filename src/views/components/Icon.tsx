import type { CSSProperties, ReactNode } from 'react'
export type IconName = 'arrow' | 'arrow-up' | 'bag' | 'search' | 'leaf' | 'sun' | 'box' | 'globe' | 'close' | 'menu' | 'plus' | 'minus' | 'check' | 'chevron' | 'mail' | 'pin' | 'heart' | 'truck' | 'spark' | 'trash'
export function Icon({ name, size = 22, className, style }: { name: IconName; size?: number; className?: string; style?: CSSProperties }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M4 12h16M14 6l6 6-6 6" />,
    'arrow-up': <path d="M6 18 18 6M6 6h12v12" />,
    bag: <>
      <path d="m5 7-1 14h16L19 7H5Z" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" />
    </>,
    search: <>
      <circle cx="10.7" cy="10.7" r="6.7" />
      <path d="m16 16 4.5 4.5" />
    </>,
    leaf: <>
      <path d="M20 3C9 2 3 7 5 14s13 6 15-11Z" />
      <path d="M3 21 15 9M9 15v-5M9 15h5" />
    </>,
    sun: <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" />
    </>,
    box: <path d="m3 7 9-5 9 5v10l-9 5-9-5V7Zm0 0 9 5 9-5M12 12v10M7.5 4.5l9 5V14" />,
    globe: <>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3 12h18" />
    </>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    plus: <path d="M5 12h14M12 5v14" />,
    minus: <path d="M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m8 4 8 8-8 8" />,
    mail: <>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m3 6 9 7 9-7" />
    </>,
    pin: <>
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>,
    heart: <path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1s-1 7 8 14c9-7 11-11 8-14Z" />,
    truck: <>
      <path d="M3 5h11v12H3V5Zm11 4h4l3 4v4h-7" />
      <circle cx="6.5" cy="18" r="2" />
      <circle cx="17.5" cy="18" r="2" />
    </>,
    spark: <path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z" />,
    trash: <path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7" />,
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.45"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >{paths[name]}</svg>
  )
}
