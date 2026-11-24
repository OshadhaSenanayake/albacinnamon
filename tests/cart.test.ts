import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateCartTotals, changeCartQuantity, getCartItems, MAX_QUANTITY, normalizeCart, readCart, saveCart } from '../src/models/cart.ts'

test('stored carts reject unknown products, malformed entries, and non-integer quantities', () => {
  assert.deepEqual(normalizeCart(null), [])
  assert.deepEqual(normalizeCart({ productId: 'cinnamon-sticks', quantity: 1 }), [])
  assert.deepEqual(normalizeCart([
    null,
    { productId: 'missing-product', quantity: 1 },
    { productId: 'cinnamon-sticks', quantity: -1 },
    { productId: 'cinnamon-sticks', quantity: Number.NaN },
    { productId: 'cinnamon-sticks', quantity: Number.POSITIVE_INFINITY },
    { quantity: 1 },
    { productId: 'cinnamon-sticks' },
    { productId: 'cinnamon-sticks', quantity: 1.5 },
    { productId: 'cinnamon-sticks', quantity: '2' },
    { productId: 'cinnamon-oil', quantity: 2 },
  ]), [{ productId: 'cinnamon-oil', quantity: 2 }])
})

test('stored duplicates merge and quantities stay within the purchase limit', () => {
  assert.deepEqual(normalizeCart([
    { productId: 'cinnamon-sticks', quantity: 2 },
    { productId: 'cinnamon-sticks', quantity: 3 },
    { productId: 'cinnamon-oil', quantity: 1000 },
  ]), [
    { productId: 'cinnamon-sticks', quantity: 5 },
    { productId: 'cinnamon-oil', quantity: MAX_QUANTITY },
  ])
})

test('quantity changes add, update, remove, and preserve the original cart', () => {
  const original = [{ productId: 'cinnamon-sticks', quantity: 1 }]
  const changed = changeCartQuantity(original, 'cinnamon-sticks', 3)
  assert.equal(original[0].quantity, 1)
  assert.equal(changed[0].quantity, 3)
  assert.deepEqual(changeCartQuantity(changed, 'cinnamon-sticks', 0), [])
  assert.deepEqual(changeCartQuantity(changed, 'cinnamon-sticks', -2), [])
  assert.equal(changeCartQuantity([], 'cinnamon-sticks', 1000)[0].quantity, MAX_QUANTITY)
  assert.deepEqual(changeCartQuantity([], 'missing-product', 1), [])
  assert.deepEqual(changeCartQuantity(original, 'cinnamon-sticks', Number.NaN), original)
  assert.deepEqual(changeCartQuantity(original, 'cinnamon-sticks', Number.POSITIVE_INFINITY), original)
})

test('missing catalog products are omitted from rendered cart items', () => {
  const items = getCartItems([
    { productId: 'missing-product', quantity: 5 },
    { productId: 'cinnamon-sticks', quantity: 1 },
  ])
  assert.equal(items.length, 1)
  assert.equal(items[0].product.id, 'cinnamon-sticks')
})

test('totals include standard shipping below the free shipping threshold', () => {
  const items = getCartItems([{ productId: 'cinnamon-sticks', quantity: 1 }])
  assert.deepEqual(calculateCartTotals(items), {
    itemCount: 1, subtotal: 12.5, shipping: 4.95, total: 17.45,
  })
})

test('shipping is free at the threshold and the empty cart costs nothing', () => {
  const items = getCartItems([{ productId: 'cinnamon-sticks', quantity: 4 }])
  assert.deepEqual(calculateCartTotals(items), {
    itemCount: 4, subtotal: 50, shipping: 0, total: 50,
  })
  assert.deepEqual(calculateCartTotals([]), { itemCount: 0, subtotal: 0, shipping: 0, total: 0 })
})

test('unavailable browser storage falls back to an empty cart without throwing', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() { throw new Error('Storage unavailable') },
  })
  try {
    assert.deepEqual(readCart(), [])
    assert.doesNotThrow(() => saveCart([{ productId: 'cinnamon-sticks', quantity: 1 }]))
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor)
    else Reflect.deleteProperty(globalThis, 'localStorage')
  }
})

test('corrupted stored JSON is ignored and valid stored carts are normalized', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  let storedValue = '{invalid-json'
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: () => storedValue,
      setItem: (_key: string, value: string) => { storedValue = value },
    },
  })
  try {
    assert.deepEqual(readCart(), [])
    storedValue = JSON.stringify([
      { productId: 'missing-product', quantity: 1 },
      { productId: 'cinnamon-sticks', quantity: -1 },
      { productId: 'cinnamon-oil', quantity: 3 },
    ])
    assert.deepEqual(readCart(), [{ productId: 'cinnamon-oil', quantity: 3 }])
    saveCart([{ productId: 'cinnamon-sticks', quantity: 2 }])
    assert.deepEqual(readCart(), [{ productId: 'cinnamon-sticks', quantity: 2 }])
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor)
    else Reflect.deleteProperty(globalThis, 'localStorage')
  }
})
