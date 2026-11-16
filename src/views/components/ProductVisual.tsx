import type { Product } from '../../models/product'
import { Botanical } from './Brand'

export function ProductVisual({ product }: { product: Product }) {
  const shortName = product.category === 'Sticks' ? 'Ceylon Cinnamon'
    : product.category === 'Powder' ? 'Ground Cinnamon'
      : product.category === 'Tea' ? 'Cinnamon Tea'
        : 'The Cinnamon Collection'
  return (
    <div
      className={`product-visual tone-${product.tone}`}
      aria-label={`Illustrated Alba ${product.name} packaging`}
      role="img"
    >
      <div className={`package package-${product.packageType}`}>
        <div className="package-seal" />
        <div className="package-label">
          <span className="package-brand">ALBA</span>
          <span className="package-brand-small">CINNAMON</span>
          <span className="package-rule" />
          <Botanical className="package-botanical" />
          <span className="package-title">{shortName}</span>
          <span className="package-origin">A LITTLE WARMTH FROM CEYLON</span>
          <span className="package-weight">{product.weight}</span>
        </div>
        <div className="package-base" />
      </div>
      <div className="cinnamon-sticks">
        <i />
        <i />
        <i />
      </div>
      <span className="visual-leaf visual-leaf-one" />
      <span className="visual-leaf visual-leaf-two" />
    </div>
  )
}
