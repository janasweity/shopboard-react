import type { Product } from '../../modules/products/products.types.ts'
import { homeHero } from '../../data/page-imagery.ts'
import { heroSlides } from '../../data/hero-slides.ts'
import type { AddHandler } from '../cart/cart-store.ts'
import RegistrationSection from '../forms/RegistrationSection.tsx'
import Hero from './Hero.tsx'
import FeaturedProducts from './FeaturedProducts.tsx'
import RoomSlider from './RoomSlider.tsx'

interface Props {
  readonly products: readonly Product[]
  onAdd: AddHandler
}

export default function HomePage({ products, onAdd }: Props) {
  return (
    <>
      <Hero image={homeHero.image} alt={homeHero.alt} />
      <FeaturedProducts products={products} onAdd={onAdd} />
      <RoomSlider slides={heroSlides} />
      <RegistrationSection />
    </>
  )
}
