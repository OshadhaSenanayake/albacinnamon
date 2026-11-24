import { useEffect, useRef } from 'react'
import { categories, useCatalog } from '../../controllers/useCatalog'
import type { SortOrder } from '../../controllers/useCatalog'
import { ProductCard } from '../components/ProductCard'
import { Icon } from '../components/Icon'

export function ProductsPage() {
  const params = new URLSearchParams(window.location.search)
  const { products, query, setQuery, category, setCategory, sort, setSort } = useCatalog(params.get('q') || '')
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('search')) input.current?.focus()
  }, [])

  return (
    <>
      <section className="page-intro container">
        <span className="eyebrow">FROM OUR ROOTS TO YOUR RITUALS</span>
        <h1>A collection of little comforts.</h1>
        <p>For the morning cup, the slow Sunday bake, and everything in between.<br />Find your own way to bring a little Ceylon warmth home.</p>
      </section>
      <section className="catalog-section container" aria-label="Shop cinnamon products">
        <div className="catalog-tools">
          <div className="category-tabs" aria-label="Filter by product type">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? 'category-tab active' : 'category-tab'}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="catalog-search">
            <Icon name="search" size={18} />
            <input
              id="product-search"
              ref={input}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find your little comfort…"
              aria-label="Search products"
            />
          </label>
        </div>
        <div className="catalog-meta">
          <p aria-live="polite">
            {products.length} {products.length === 1 ? 'little comfort' : 'little comforts'} to discover
          </p>
          <label className="catalog-sort">
            Sort by
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOrder)}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="name">Name: A to Z</option>
            </select>
          </label>
        </div>
        {products.length > 0 ? (
          <div className="product-grid catalog-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        ) : (
          <div className="empty-state">
            <Icon name="search" size={35} />
            <h2>No little comforts found.</h2>
            <p>Try another search or explore the full collection.</p>
            <button
              className="button button-primary"
              onClick={() => { setQuery(''); setCategory('All products') }}
            >
              Show all products <Icon name="arrow" size={18} />
            </button>
          </div>
        )}
      </section>
    </>
  )
}
