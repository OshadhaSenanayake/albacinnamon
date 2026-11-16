import { products } from '../../models/product'
import { Link } from '../components/Link'
import { Icon } from '../components/Icon'
import { Botanical } from '../components/Brand'
import { ProductCard } from '../components/ProductCard'
const values = [
  { icon: 'globe' as const, title: 'A sense of place', text: 'Inspired by the island of Ceylon' },
  { icon: 'leaf' as const, title: 'Close to nature', text: 'Simple ingredients, full of character' },
  { icon: 'sun' as const, title: 'Made for your rituals', text: 'A little goodness, every day' },
  { icon: 'box' as const, title: 'A thoughtful touch', text: 'From our collection to your kitchen' },
]
export function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-line" /> FROM THE HEART OF SRI LANKA</span>
          <h1>Goodness,<br />rooted in<br /><em>Ceylon.</em></h1>
          <p>A little spice. A deeper connection.<br />Discover the warmth of Ceylon cinnamon,<br className="desktop-break" /> made for life’s simple, beautiful moments.</p>
          <div className="hero-actions">
            <Link href="/products" className="button button-primary">Shop the collection <Icon name="arrow" size={19} /></Link>
            <Link href="/#our-story" className="text-link">Our story <Icon name="arrow-up" size={16} /></Link>
          </div>
          <div className="hero-footnote">
            <Icon name="leaf" size={17} />
            <span>Good by nature. Beautifully simple.</span>
          </div>
        </div>
        <div className="hero-photo">
          <img
            src="/images/cinnamon-hero.png"
            alt="Warm cinnamon quills, with their naturally curled bark and rich texture"
            fetchPriority="high"
          />
          <div className="hero-photo-shade" />
          <span className="hero-image-caption">AN EVERYDAY SPICE.<br />AN EXTRAORDINARY ORIGIN.</span>
          <div className="origin-seal">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <defs>
                <path id="seal-circle" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
              </defs>
              <text>
                <textPath href="#seal-circle" startOffset="0%">ROOTED IN CEYLON · MADE FOR EVERY DAY · </textPath>
              </text>
            </svg>
            <Botanical />
          </div>
          <span className="hero-photo-index">01 <span>/</span> THE ORIGINAL SPICE</span>
        </div>
      </section>
      <section className="values-strip" aria-label="The Alba approach">
        <div className="container values-grid">
          {values.map(value => (
            <div className="value-item" key={value.title}>
              <Icon name={value.icon} size={30} />
              <div>
                <h2>
                  {value.title}
                </h2>
                <p>{value.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="collection-section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE EVERYDAY ESSENTIALS</span>
            <h2>Small rituals. Richer days.</h2>
          </div>
          <Link href="/products" className="text-link">Explore the collection <Icon name="arrow" size={18} /></Link>
        </div>
        <div className="product-grid">{products.slice(0, 4).map(product => <ProductCard key={product.id} product={product} />)}</div>
      </section>
      <section className="story-section container" id="our-story">
        <div className="story-photo">
          <img src="/images/cinnamon-story.png" alt="A clay bowl of cinnamon powder with delicate quills on natural linen" loading="lazy" />
          <span className="story-photo-label">A SMALL SPICE. A BEAUTIFUL STORY.</span>
        </div>
        <div className="story-copy">
          <span className="eyebrow">OUR ROOTS RUN DEEP</span>
          <h2>From a special place.<br />For your everyday.</h2>
          <p>Our idea is simple: the things we reach for every day should have a story worth sharing.</p>
          <p>Our sample collection celebrates Ceylon cinnamon and the warmth it brings to a kitchen. A spoonful in your morning oats. A quill in a slowly simmering pot. A thoughtful gift, just because.</p>
          <Link href="/services" className="text-link">Discover the Alba approach <Icon name="arrow" size={18} /></Link>
          <Botanical className="story-botanical" />
        </div>
      </section>
      <section className="ritual-banner">
        <div className="container">
          <span className="eyebrow">MAKE ROOM FOR THE LITTLE THINGS</span>
          <h2>A little warmth goes a long way.</h2>
          <p>Find your next everyday essential, or share a little goodness with someone.</p>
          <Link href="/products" className="button button-primary">Find your favorite <Icon name="arrow" size={18} /></Link>
        </div>
      </section>
    </>
  )
}
