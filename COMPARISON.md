# RAHA and ShopBoard Reference Comparison

## Structure

In RAHA, my pages are in `src/app/`. I keep each feature in its own folder under `src/features/`. For example, the cart files are in `src/features/cart/`, and the product files are in `src/features/products/`.

In the reference, the pages in `app/` get the data they need and render the components. The code for each feature is in `modules/`. For example, the products page shows the list, and the filtering logic is in the products module.

I want to keep RAHA’s folder structure because I organized it this way and know where to find the files for each feature.

## API client

In RAHA, my shared API client checks that the response is JSON and validates its data before the app uses it. If a request fails, it gives a general message with the status code.

The reference also has a shared API client. When a request fails, it tries to read the error message sent by the server.

I want to keep RAHA’s data validation and take the idea of reading the server’s error message in the shared client. That way, I can handle it in one place, and if I see the same error again, the message can help me recognize what happened.

## Types and schemas

### Cart types

I like having a separate file for cart types because it helps me understand what data the cart uses. When I want to change something or check for a mistake, I know where to look for the fields and their types.

The reference cart stores the product ID and quantity. In RAHA, I also store a `variantId` to keep track of the selected color. If I add the same product in two colors, I see two separate lines, and the subtotal includes both items.

I want to keep this approach because it fits my products and I understand how it works.

### Checkout email validation

Both projects use Zod to validate the email address. The reference uses one message, “Enter a valid email address.” In RAHA, I remove extra spaces and show a different message depending on what went wrong. If the field is empty, I ask for an email address. If the format is wrong, I show an example, `name@example.com`.

I want to keep RAHA’s approach because it tells me what I need to fix and gives me an example of what to type.

## State

In RAHA, I use React Context to share the cart and its actions between components. The reference uses Zustand to manage and share its cart state.

I want to keep Context in RAHA because I know where to find the cart code and understand how it works.

## Forms

I found both checkout forms easy to use from the start. RAHA asks for contact and address details for a demo order. The reference also asks for demo payment details, including a card expiry date. After submitting the reference form, I saw a separate success page with the order number and total. RAHA shows the confirmation on the checkout page and keeps the cart.

I want to keep RAHA’s checkout as it is for now. I added and adjusted the fields to work the way I wanted, and I feel comfortable using the form. I’m open to trying other approaches later if I find something I want to improve.

## Loading, error, and not found

When I tested an empty catalogue, RAHA showed “The catalogue is empty.” The reference showed “No products match” and offered a “Clear filters” button. I found the reference easier to understand because it gave me something to try next. I want to take the idea of giving users a clear next step when there are no products to show.

During the delay test, RAHA showed a loading message. In the reference, the product area looked empty to me while it was loading. I prefer RAHA’s message because it tells me the site is working and the products just need more time to load.

In RAHA, I saw a “Try again” button when the catalogue failed to load. In the reference, the server log confirmed the simulated 500 error, but I didn’t verify which retry option appeared on the page.

The reference’s 404 page links back to the product list. RAHA’s 404 page links back to the homepage. I prefer going back to the homepage because it gives me a familiar place to start. From there, I can see the available pages and choose where to go next without retracing my steps.

## UI kit and tokens

RAHA uses shared UI components and color tokens. Its dark mode follows the device setting. The reference has a dark mode toggle in the navigation bar. Its `DESIGN.md` also names brand colors such as `brand-pink` and `brand-lavender`.

I would take the idea of adding a toggle to RAHA because it feels easier and more convenient to change the theme directly on the website.

## Tooling

RAHA uses Oxlint to check the code, while the reference uses ESLint. Both projects use Prettier to check formatting and Husky with lint-staged to check staged files before a commit.

For now, I want to keep RAHA’s tools because I’m familiar with them and know how to run the checks.

## CLAUDE.md

In RAHA, I document rules based on what happened while working on the project. For example, before testing an API state, I check the API setting, the running server, and the URL I opened.

The reference explains where each kind of code belongs. For example, pages in `app/` get the data and render components, and the logic for each feature stays in its own module.

For now, I want to keep RAHA’s rules as they are. I want to work with this structure for a while to see how easy it is to find and update files. If I notice something that keeps making my work harder, I’ll update the rule based on that experience.

## What I did better

I think RAHA’s loading message is clearer. It tells me the site is working and the products need more time to load. If I saw a blank page, I might think the site was broken and leave.

I also think RAHA’s email error messages are more helpful. They tell users what went wrong and show an example of a valid email address when the format is incorrect. That makes it easier to fix the mistake and continue.

## Self-assessment

**Grade: Excellent**

I give myself this grade because I followed the steps, tried the reference project and its API states, and followed the cart code from the Add to cart button to the store. I compared both projects and explained my choices using things I actually noticed during testing. I could explain what worked better for me in RAHA and which ideas I would take from the reference, and why.
