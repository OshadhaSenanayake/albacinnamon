import { createContext, type Dispatch, type SetStateAction } from 'react'
import type { CartItem } from '../models/cart'

export interface StoreState {
  items: CartItem[]
  itemCount: number
  subtotal: number
  shipping: number
  total: number
  addItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  cartOpen: boolean
  setCartOpen: Dispatch<SetStateAction<boolean>>
  toast: string
  dismissToast: () => void
}

export const StoreContext = createContext<StoreState | null>(null)
