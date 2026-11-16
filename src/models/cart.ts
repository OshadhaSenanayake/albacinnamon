import { products, type Product } from './product.ts'

export interface CartEntry {
  productId: string
  quantity: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export const CART_STORAGE_KEY = 'alba-cinnamon-cart-v1'
export const MAX_QUANTITY = 99
export const FREE_SHIPPING_THRESHOLD = 50
export const STANDARD_SHIPPING = 4.95

export function normalizeCart(value: unknown): CartEntry[] {
  if (!Array.isArray(value)) return []

  const entries = new Map<string, number>()
  for (const entry of value) {
    if (
      typeof entry !== 'object' || entry === null ||
      !('productId' in entry) || !('quantity' in entry) ||
      typeof entry.productId !== 'string' || typeof entry.quantity !== 'number' ||
      !Number.isInteger(entry.quantity) || entry.quantity <= 0 ||
      !products.some((product) => product.id === entry.productId)
    ) continue

    entries.set(entry.productId, Math.min(MAX_QUANTITY, (entries.get(entry.productId) ?? 0) + entry.quantity))
  }

  return Array.from(entries, ([productId, quantity]) => ({ productId, quantity }))
}

export function readCart(): CartEntry[] {
  try {
    return normalizeCart(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]'))
  } catch {
    return []
  }
}

export function saveCart(cart: CartEntry[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch {
    // Shopping still works in memory when browser storage is unavailable.
  }
}

export function changeCartQuantity(cart: CartEntry[], productId: string, quantity: number): CartEntry[] {
  if (!products.some((product) => product.id === productId) || !Number.isFinite(quantity)) return cart
  const nextQuantity = Math.max(0, Math.min(MAX_QUANTITY, Math.floor(quantity)))
  const existing = cart.find((entry) => entry.productId === productId)
  if (nextQuantity === 0) return cart.filter((entry) => entry.productId !== productId)
  if (!existing) return [...cart, { productId, quantity: nextQuantity }]
  return cart.map((entry) => entry.productId === productId ? { ...entry, quantity: nextQuantity } : entry)
}

export function getCartItems(cart: CartEntry[]): CartItem[] {
  return cart.flatMap((entry) => {
    const product = products.find((item) => item.id === entry.productId)
    return product ? [{ product, quantity: entry.quantity }] : []
  })
}

export function calculateCartTotals(items: CartItem[]) {
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)
  const subtotal = Math.round(items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) * 100) / 100
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING
  return { itemCount, subtotal, shipping, total: Math.round((subtotal + shipping) * 100) / 100 }
}
