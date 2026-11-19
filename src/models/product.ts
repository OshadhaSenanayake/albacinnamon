export type ProductCategory = 'Sticks' | 'Powder' | 'Tea' | 'Gift sets' | 'Oil'

export interface Product {
  id: string
  name: string
  subtitle: string
  category: ProductCategory
  price: number
  weight: string
  imageUrl?: string
  badge?: string
  tone: 'sand' | 'sage' | 'clay' | 'cream'
  packageType: 'pouch' | 'jar' | 'box' | 'bottle'
  description: string
}

// Illustrative catalog and USD prices for the sample storefront.
export const products: Product[] = [
  {
    id: 'cinnamon-sticks',
    name: 'Ceylon Cinnamon Sticks',
    subtitle: 'Delicate, sweet & wonderfully aromatic',
    category: 'Sticks',
    price: 12.5,
    weight: '100g',
    imageUrl: new URL('../../designs/product-images/ceylon-cinnamon-100g-compact-pouch-seal.png', import.meta.url).href,
    badge: 'BESTSELLER',
    tone: 'sand',
    packageType: 'pouch',
    description: 'Fine cinnamon quills for slow infusions, warming drinks, and your favorite family recipes.',
  },
  {
    id: 'cinnamon-baking-blend',
    name: 'Cinnamon Baking Blend',
    subtitle: 'Your next favorite pantry staple',
    category: 'Powder',
    price: 11,
    weight: '150g',
    tone: 'sand',
    packageType: 'jar',
    description: 'A warming cinnamon blend for cakes, biscuits, and weekend baking.',
  },
  {
    id: 'cinnamon-tea',
    name: 'Cinnamon Herbal Tea',
    subtitle: 'Slow down. Sip something lovely.',
    category: 'Tea',
    price: 14,
    weight: '20 sachets',
    badge: 'A DAILY RITUAL',
    tone: 'sage',
    packageType: 'box',
    description: 'A comforting cinnamon infusion to make a quiet moment of your day. Serve warm or over ice.',
  },
  {
    id: 'cinnamon-gift-set',
    name: 'Cinnamon Gift Collection',
    subtitle: 'A thoughtful taste of the island',
    category: 'Gift sets',
    price: 32,
    weight: '4 essentials',
    badge: 'MADE TO GIVE',
    tone: 'cream',
    packageType: 'box',
    description: 'Four cinnamon-inspired pantry essentials, gathered in a keepsake box for someone special.',
  },
  {
    id: 'alba-cinnamon-quills',
    name: 'Alba Cinnamon Quills',
    subtitle: 'Fine quills for exceptional moments',
    category: 'Sticks',
    price: 18,
    weight: '100g',
    tone: 'sage',
    packageType: 'pouch',
    description: 'Slender cinnamon quills with a beautifully delicate aroma for fragrant desserts and infusions.',
  },
  {
    id: 'cinnamon-oil',
    name: 'Ceylon Cinnamon Oil',
    subtitle: 'Warm, spicy aroma',
    category: 'Oil',
    price: 9.5,
    weight: '50 ml',
    tone: 'clay',
    packageType: 'bottle',
    description: 'The distinctive scent of Ceylon cinnamon in a 50 ml bottle.',
  },
]

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}
