import { aboutCraft, aboutMaterials } from '../../data/page-imagery.ts'
import ContactForm from './ContactForm.tsx'
import {
  entranceDelay,
  useEntranceMotion,
} from '../entrance/entrance-motion.ts'

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
        className="about-story"
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
        />
        <div>
          <h2 id="about-title">A little more feeling at home.</h2>
          <p>
            We believe a home should feel lived in, loved, and completely yours.
            Our concept collection brings together comfortable furniture, warm
            lighting, useful storage, and small everyday details.
          </p>
          <p>
            Scandinavian simplicity is our starting point. Natural textures,
            quiet colours, warm wood, and tactile fabrics create room for
            everyday life. Browse the catalogue, check dimensions and materials,
            and leave room to move. What you do with it is up to you.
          </p>
          <p>
            This is an online demonstration store, with no physical shop, real
            accounts, payments, or order fulfilment.
          </p>
        </div>
      </section>
      <section
        className="contact-section page-section"
        aria-labelledby="contact-title"
      >
        <div>
          <p className="eyebrow">LET'S START A CONVERSATION</p>
          <h2 id="contact-title">About your next idea.</h2>
          <p>
            This contact form is a local demo. Use made-up details. No message
            is sent, and nothing you enter is stored.
          </p>
          <section id="returns" aria-labelledby="returns-title">
            <h3 id="returns-title">Returns &amp; support</h3>
            <p>
              No purchases are processed in this demo, so there are no
              deliveries or returns to arrange. You can change or remove local
              cart items at any time.
            </p>
          </section>
          <figure className="contact-detail-image">
            <img
              src={aboutCraft.image}
              alt={aboutCraft.alt}
              width={1400}
              height={1000}
              loading="lazy"
              decoding="async"
            />
            <figcaption>CRAFT STUDY / CONCEPT PHOTOGRAPHY</figcaption>
          </figure>
        </div>
        <ContactForm />
      </section>
    </>
  )
}
