export const interestLabels = {
  general: 'Just saying hello',
  wholesale: 'Wholesale & bulk orders',
  gifting: 'Gifting & special occasions',
  order: 'A question about an order',
} as const

export type ContactInterest = keyof typeof interestLabels

export function isContactInterest(value: unknown): value is ContactInterest {
  return typeof value === 'string' && Object.hasOwn(interestLabels, value)
}
