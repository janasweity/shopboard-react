'use client'

import { aboutCraft, aboutMaterials } from '../../data/page-imagery.ts'
import ContactForm from './ContactForm.tsx'
import { cardVariants } from '../../components/ui/card-variants.ts'
import { cn } from '../../lib/utils.ts'
import {
  entranceDelay,
  useEntranceMotion,
} from '../entrance/entrance-motion.ts'

const storyTextClass = 'mb-5.25 text-muted'
const contactTextClass = 'text-sm leading-body text-muted'

export default function AboutPage() {
  const titleMotion = useEntranceMotion('copy', entranceDelay.copy)
  return (
    <>
      <section className="page-intro">
        <p className="eyebrow">HELLO, WE'RE RAHA.</p>
        <h1 className={titleMotion.className} style={titleMotion.style}>
          Thoughtful design.
          <br />
          Everyday possibilities.
        </h1>
        <p>
          An independent concept store for people making a place of their own.
        </p>
      </section>
      <section
        className="mt-8 mb-16 grid items-center gap-6 md:grid-cols-story md:gap-10"
        id="store-information"
        aria-labelledby="about-title"
      >
        <img
          src={aboutMaterials.image}
          alt={aboutMaterials.alt}
          width={1400}
          height={1000}
          fetchPriority="high"
          decoding="async"
          className="aspect-6/5 w-full rounded-feature object-cover"
        />
        <div>
          <h2 id="about-title" className="my-4">
            A little more feeling at home.
          </h2>
          <p className={storyTextClass}>
            We believe a home should feel lived in, loved, and completely yours.
            Our concept collection brings together comfortable furniture, warm
            lighting, useful storage, and small everyday details.
          </p>
          <p className={storyTextClass}>
            Scandinavian simplicity is our starting point. Natural textures,
            quiet colours, warm wood, and tactile fabrics create room for
            everyday life. Browse the catalogue, check dimensions and materials,
            and leave room to move. What you do with it is up to you.
          </p>
          <p className={storyTextClass}>
            This is an online demonstration store, with no physical shop, real
            accounts, payments, or order fulfilment.
          </p>
        </div>
      </section>
      <section
        className={cn(
          cardVariants({ padding: 'lg' }),
          'grid gap-8 md:grid-cols-2 xl:gap-16',
        )}
        aria-labelledby="contact-title"
      >
        <div>
          <p className="eyebrow">LET'S START A CONVERSATION</p>
          <h2 id="contact-title" className="mt-3.25 mb-4">
            About your next idea.
          </h2>
          <p className={contactTextClass}>
            This contact form is a local demo. Use made-up details. No message
            is sent, and nothing you enter is stored.
          </p>
          <section id="returns" aria-labelledby="returns-title">
            <h3 id="returns-title" className="mt-6 mb-2.5">
              Returns &amp; support
            </h3>
            <p className={contactTextClass}>
              No purchases are processed in this demo, so there are no
              deliveries or returns to arrange. You can change or remove local
              cart items at any time.
            </p>
          </section>
          <figure>
            <img
              src={aboutCraft.image}
              alt={aboutCraft.alt}
              width={1400}
              height={1000}
              loading="lazy"
              decoding="async"
              className="w-full rounded-panel"
            />
            <figcaption className="mt-2.75 text-figcaption tracking-widest">
              CRAFT STUDY / CONCEPT PHOTOGRAPHY
            </figcaption>
          </figure>
        </div>
        <ContactForm />
      </section>
    </>
  )
}
