import { useState } from 'react'
import type { Product } from '../../models/product'
import { Link } from './Link'
import { ProductVisual } from './ProductVisual'
import { Icon } from './Icon'
import { Modal } from './Modal'
export function ProductCard({ product }: { product: Product }) {
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
          </div>
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
            <Link className="button button-primary" href={`/quotation?product=${encodeURIComponent(product.id)}`}>
              Inquire prices <Icon name="arrow" size={19} />
            </Link>
          </div>
        </Modal>
      )}
    </>
  )
}
