import { useState } from 'react'
import type { Product } from '../../models/product'
import { formatPrice } from '../../models/product'
import { useStore } from '../../controllers/useStore'
import { ProductVisual } from './ProductVisual'
import { Icon } from './Icon'
import { Modal } from './Modal'
export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useStore()
  const [detailsOpen, setDetailsOpen] = useState(false)
  return (
    <>
      <article className="product-card">
        <button className="product-image-button" onClick={() => setDetailsOpen(true)} aria-label={`View ${product.name}`}>
          <ProductVisual product={product} />
          {product.badge && (
            <span className="product-badge">{product.badge}</span>
          )}
          <span className="product-quick-view">A closer look <Icon name="plus" size={15} /></span>
        </button>
        <div className="product-card-info">
          <div>
            <p className="product-subtitle">{product.subtitle} <span>·</span> {product.weight}</p>
            <h3>
              <button onClick={() => setDetailsOpen(true)}>
                {product.name}
              </button>
            </h3>
            <span className="product-price">{formatPrice(product.price)}</span>
          </div>
          <button className="add-to-bag" onClick={() => addItem(product.id)} aria-label={`Add ${product.name} to bag`}>
            <Icon name="plus" size={21} />
          </button>
        </div>
      </article>
      {detailsOpen && (
        <Modal titleId={`product-${product.id}`} onClose={() => setDetailsOpen(false)} className="product-modal">
          <ProductVisual product={product} />
          <div className="product-detail">
            <span className="eyebrow">A LITTLE EVERYDAY GOODNESS</span>
            <h2 id={`product-${product.id}`}>
              {product.name}
            </h2>
            <p className="detail-weight">{product.weight} <span>·</span> {product.subtitle}</p>
            <p>{product.description}</p>
            <p className="detail-note"><Icon name="leaf" size={18} /> Thoughtfully chosen for your daily rituals.</p>
            <strong className="detail-price">{formatPrice(product.price)}</strong>
            <button className="button button-primary" onClick={() => { addItem(product.id); setDetailsOpen(false) }}>Add to bag <Icon name="bag" size={19} /></button>
            <small>Sample product and packaging. Prices in USD.</small>
          </div>
        </Modal>
      )}
    </>
  )
}
