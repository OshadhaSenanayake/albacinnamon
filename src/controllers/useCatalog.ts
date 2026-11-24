import { useMemo, useState } from 'react'
import { products as catalog, type ProductCategory } from '../models/product'

export const categories = ['All products', 'Sticks', 'Powder', 'Tea', 'Gift sets', 'Oil'] as const
export type CatalogCategory = 'All products' | ProductCategory
export type SortOrder = 'featured' | 'name'

export function useCatalog(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState<CatalogCategory>('All products')
  const [sort, setSort] = useState<SortOrder>('featured')

  const products = useMemo(() => {
    const search = query.trim().toLowerCase()
    const result = catalog.filter((product) =>
      (category === 'All products' || product.category === category) &&
      `${product.name} ${product.subtitle} ${product.description} ${product.category}`.toLowerCase().includes(search),
    )
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name))
    return result
  }, [query, category, sort])

  return { products, query, setQuery, category, setCategory, sort, setSort }
}
