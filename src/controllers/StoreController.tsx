import { useEffect, useState, type ReactNode } from 'react'
import { calculateCartTotals, changeCartQuantity, getCartItems, MAX_QUANTITY, readCart, saveCart } from '../models/cart'
import { products } from '../models/product'
import { StoreContext } from './storeContext'

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState(readCart)
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    saveCart(cart)
  }, [cart])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 3500)
    return () => window.clearTimeout(timer)
  }, [toast])

  const items = getCartItems(cart)
  const totals = calculateCartTotals(items)

  function addItem(productId: string) {
    const product = products.find((item) => item.id === productId)
    if (!product) return
    const quantity = cart.find((entry) => entry.productId === productId)?.quantity ?? 0
    if (quantity >= MAX_QUANTITY) {
      setToast(`You can add up to ${MAX_QUANTITY} of each item.`)
      return
    }
    setCart((current) => changeCartQuantity(current, productId, (current.find((entry) => entry.productId === productId)?.quantity ?? 0) + 1))
    setToast(`${product.name} added to your bag`)
  }

  function setQuantity(productId: string, quantity: number) {
    setCart((current) => changeCartQuantity(current, productId, quantity))
  }

  return (
    <StoreContext.Provider value={{
      items,
      ...totals,
      addItem,
      setQuantity,
      removeItem: (productId) => setQuantity(productId, 0),
      clearCart: () => setCart([]),
      cartOpen,
      setCartOpen,
      toast,
      dismissToast: () => setToast(''),
    }}>
      {children}
    </StoreContext.Provider>
  )
}
