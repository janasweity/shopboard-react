import type { Product } from '../../modules/products/products.types.ts'
import { homeHero } from '../../data/page-imagery.ts'
import { heroSlides } from '../../data/hero-slides.ts'
import Hero from './Hero.tsx'
import FeaturedProducts from './FeaturedProducts.tsx'
import RoomSlider from './RoomSlider.tsx'

interface Props {
  readonly products: readonly Product[]
}

export default function HomePage({ products }: Props) {
  return (
    <>
      <Hero image={homeHero.image} alt={homeHero.alt} />
      <FeaturedProducts products={products} />
      <RoomSlider slides={heroSlides} />
      <section
        className="registration-section"
        id="registration"
        aria-labelledby="registration-title"
      >
        <div className="registration-copy">
          <p className="eyebrow">THERE'S ROOM FOR YOU HERE</p>
          <h2 id="registration-title">
            Make yourself
            <br />
            at home.
          </h2>
          <p id="demo-description">
            Try our registration demo. No account is created, and your details
            are never sent or stored. Please use made-up details.
          </p>
        </div>
        <div className="registration-preview">
          <p>The registration demo will be available soon.</p>
          <p>
            For now, explore our considered pieces and find a little
            inspiration.
          </p>
        </div>
      </section>
    </>
  )
}
