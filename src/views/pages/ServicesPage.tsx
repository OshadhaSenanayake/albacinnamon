import { Link } from '../components/Link'

const services = [
  {
    number: '01',
    title: 'Retail & everyday rituals',
    description: 'A pinch in your morning coffee. A little warmth in your favourite bake. Discover cinnamon made for the moments you love.',
    features: ['Cinnamon sticks, powder & tea', 'Small packs for your pantry', 'Easy online ordering'],
    link: '/products',
    action: 'Find your everyday favourite',
    icon: 'leaf',
  },
  {
    number: '02',
    title: 'Wholesale & bulk',
    description: 'For cafés, kitchens, retailers, and makers who care about their ingredients. Let’s find the right cinnamon for your business.',
    features: ['Discuss grades & pack sizes', 'Plan your quantity & lead time', 'Request a tailored quotation'],
    link: '/contact?interest=wholesale',
    action: 'Talk wholesale with us',
    icon: 'box',
  },
  {
    number: '03',
    title: 'Thoughtful gifting',
    description: 'A small gesture, full of warmth. Explore a cinnamon collection for hosts, food lovers, and the people who make life sweeter.',
    features: ['Curated cinnamon collections', 'Personal & business enquiries', 'Discuss your occasion with us'],
    link: '/contact?interest=gifting',
    action: 'Make it a little more personal',
    icon: 'gift',
  },
] as const

function ServiceIcon({ name }: { name: (typeof services)[number]['icon'] }) {
  return (
    <svg width="36" height="36" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      {name === 'leaf' && <><path d="M26 5c-1 14-4 19-12 19C5 24 5 12 13 9c5-2 9-1 13-4Z" /><path d="M6 28 21 12M13 21l-1-6M16 18h6" /></>}
      {name === 'box' && <><path d="m4 10 12-6 12 6v14l-12 6-12-6V10Z" /><path d="m4 10 12 6 12-6M16 16v14M10 7l12 6v6" /></>}
      {name === 'gift' && <><path d="M4 14h24v-6H4v6ZM6 14v15h20V14M16 8v21" /><path d="M16 8C7 8 7 0 12 2c3 1 4 6 4 6Zm0 0c9 0 9-8 4-6-3 1-4 6-4 6Z" /></>}
    </svg>
  )
}

export function ServicesPage() {
  return (
    <>
      <section className="page-intro container">
        <span className="eyebrow">Grown with care. Shared with purpose.</span>
        <h1>A little cinnamon.<br /><em>A world of possibilities.</em></h1>
        <p>From your kitchen shelf to your next big idea, we’re here to bring a little more warmth to the way you cook, create, and give.</p>
      </section>

      <section className="services-grid container" aria-label="Our services">
        {services.map((service) => (
          <article className="service-panel" key={service.number}>
            <div className="service-panel-top"><span className="service-number">{service.number}</span><span className="service-icon"><ServiceIcon name={service.icon} /></span></div>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
            <ul className="service-features">{service.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            <Link href={service.link} className="text-link">{service.action} <span aria-hidden="true">↗</span></Link>
          </article>
        ))}
      </section>

      <section className="service-process container">
        <div><span className="eyebrow">Good things begin simply</span><h2>From a conversation<br />to your next chapter.</h2></div>
        <div className="process-step"><span>01 / Say hello</span><p>Tell us what you have in mind, your quantities, and your ideal timing.</p></div>
        <div className="process-step"><span>02 / Find your fit</span><p>We’ll help you explore the products and options that suit your plans.</p></div>
        <div className="process-step"><span>03 / Make it happen</span><p>Agree the details together before placing your order.</p></div>
      </section>

      <section className="inquiry-banner container">
        <div><span className="eyebrow">Something in mind?</span><h2>There’s always room<br />for a good conversation.</h2></div>
        <Link href="/contact" className="button button-primary">Let’s talk <span aria-hidden="true">↗</span></Link>
      </section>
    </>
  )
}
