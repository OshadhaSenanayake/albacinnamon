# Implementation and file changes

The original React + TypeScript + Vite starter has been replaced with an Alba Cinnamon sample storefront. The existing framework, TypeScript configuration, build tooling, and installed dependencies are retained. No new runtime or development dependencies were added, and `package-lock.json` was not changed.

## Resulting behavior

1. **Home** introduces the sample brand, presents four featured products, tells its illustrative story, and links to the collection and services.
2. **Services** explains retail, wholesale, and gifting options. Wholesale and gifting links carry an `interest` query parameter to preselect the contact form topic.
3. **Products** displays six typed sample products. Visitors can combine category filtering and text search, change sorting, view product details in a dialog, and add items to the bag.
4. **Contact** validates name, email, topic, and message, then displays a local enquiry preview. FAQs use native expandable `details` elements.
5. A shared layout provides the navigation, mobile menu, search shortcut, bag item count, footer, skip link, and add-to-bag notifications.
6. The bag supports quantity changes, removal, persisted contents, sample shipping calculations, and a clearly labeled demo checkout with a local receipt.

## Why this architecture

Classic server MVC places request handling in controllers and renders server templates as views. This application is a browser-rendered React SPA, so it uses the same separation of concerns through TypeScript models, React controller hooks/context, and view components.

```text
User action in a view
        |
        v
Controller hook/context updates state
        |
        v
Model applies data and cart rules
        |
        v
React renders the updated view
```

The views do not own pricing rules or storage parsing. The cart model is independent of React and can be tested without rendering the interface. React context shares one cart across pages, while page-specific search and contact state stay in focused hooks. A small History API controller handles this four-page application's routing without adding another package.

### Models: data and rules

| Added file | Responsibility and reason |
| --- | --- |
| `src/models/product.ts` | Defines `Product`, category and presentation types, the six illustrative products, and a shared USD formatter. Centralizing product data keeps cards, details, and cart prices consistent. |
| `src/models/cart.ts` | Defines persisted cart entries and rendered cart items; validates stored data; merges duplicate entries; rejects unknown products, missing fields, non-integer or non-positive stored quantities; caps quantities at 99; applies quantity changes without mutating the original array; calculates subtotal, shipping, total, and item count. Browser storage access is wrapped so unavailable storage or corrupt JSON cannot break shopping. |

### Controllers: state and interactions

| Added file | Responsibility and reason |
| --- | --- |
| `src/controllers/StoreController.tsx` | Provides shared cart state, initializes it from browser storage, persists updates, exposes add/update/remove/clear actions, manages bag visibility, and clears add-to-bag notifications after a short delay. |
| `src/controllers/storeContext.ts` | Defines the typed store contract and React context separately from the provider component. This keeps shared types explicit and supports React Fast Refresh's component export convention. |
| `src/controllers/useStore.ts` | Reads the store context and reports a clear developer error if used outside `StoreProvider`. Views use this hook instead of accessing context directly. |
| `src/controllers/useCatalog.ts` | Owns search text, selected category, and sorting. It derives matching products and accepts an initial URL search query. Exported categories and sort types keep controls consistent with the catalog. |
| `src/controllers/useContactForm.ts` | Owns enquiry values, errors, confirmation, and reset behavior. It reads the optional `interest` query parameter, trims input, validates a name and email, checks the selected topic, and requires a 20–2,000-character message. It focuses the first invalid input and creates only a local preview. |
| `src/controllers/router.ts` | Uses the browser History API and `useSyncExternalStore` for route changes and back/forward navigation. It also handles same-page anchor scrolling. |

### Views: shared components

| Added file | Responsibility and reason |
| --- | --- |
| `src/views/components/Layout.tsx` | Composes the shared announcement, header, active navigation, mobile menu, main region, footer, shopping bag, and accessible status notification. Its content slot lets all pages share one consistent shell. |
| `src/views/components/Brand.tsx` | Provides the Alba wordmark and reusable botanical SVG artwork, keeping branding consistent without an image or icon dependency. |
| `src/views/components/Icon.tsx` | Supplies the small SVG icons used by navigation, products, bag controls, and informational content. Decorative icons are hidden from assistive technology. |
| `src/views/components/Link.tsx` | Wraps ordinary anchors with internal SPA navigation while preserving external links, modified clicks, and normal browser link behavior. |
| `src/views/components/Modal.tsx` | Wraps the native `dialog` element for product details and the bag. Provides a close button, Escape dismissal, outside-click dismissal, background scroll locking, and focus restoration. The native modal handles focus containment. |
| `src/views/components/ProductVisual.tsx` | Renders original, code-based sample packaging using product type and color fields. This avoids implying that the demo has real product photography and gives cards and cart items a shared visual system. |
| `src/views/components/ProductCard.tsx` | Displays a product's packaging, badge, name, weight, description teaser, and price; opens a detail dialog and dispatches add-to-bag actions. It is reused on Home and Products. |
| `src/views/components/CartDrawer.tsx` | Displays the empty bag or product lines, quantity/removal controls, progress toward free shipping, totals, and demo checkout. Required name/email inputs precede a temporary demo receipt. Focus moves to the name input, confirmation heading, or bag heading as the checkout step changes. Clearing the cart is local; no order or payment request is made. |

### Views: pages

| Added file | Responsibility and reason |
| --- | --- |
| `src/views/pages/HomePage.tsx` | Replaces the starter landing experience with a split hero, local cinnamon imagery, brand values, featured products, story section, and collection calls to action. |
| `src/views/pages/ServicesPage.tsx` | Adds the requested Services route with retail, wholesale, gifting, and enquiry process content. The service-specific enquiry links populate the correct contact topic. |
| `src/views/pages/ProductsPage.tsx` | Adds the requested Products route with category controls, search, sorting, live result counts, product cards, an empty-results recovery action, and sample shipping information. The header search shortcut opens this page with the search field focused. |
| `src/views/pages/ContactPage.tsx` | Adds the requested Contact route with illustrative contact information, labeled inputs, field-level errors linked to inputs, a local submission preview, and shipping/product/wholesale FAQs. |

## Existing files modified

| File | What changed and why |
| --- | --- |
| `src/App.tsx` | Removed the Vite/React logos, counter, and starter links. Now wraps the application in `StoreProvider`, selects the page for `/`, `/services`, `/products`, and `/contact`, updates document titles, handles route focus/scroll behavior, and renders an unknown-route recovery screen. |
| `src/App.css` | Replaced starter demo styles with the storefront's layouts and component styles: header/footer, hero imagery, products and packaging, service panels, contact form, dialogs, bag, checkout, and notifications. Responsive rules adapt the interface to smaller screens. |
| `src/index.css` | Replaced the starter's global light/dark demo rules with the brand's global typography, green/cream design tokens, sizing/reset rules, visible keyboard focus, and reduced-motion handling. |
| `index.html` | Replaced the starter document title and metadata with Alba Cinnamon branding, a page description, and theme styling metadata. The existing React root and module entry remain. |
| `public/favicon.svg` | Replaced the starter favicon at the same path with Alba branding, so the browser tab matches the storefront. |
| `package.json` | Added `typecheck` (`tsc -b --pretty false`) and `test` (`node --experimental-strip-types --test tests/*.test.ts`) scripts. Existing dev/build/lint/preview commands and dependency versions remain. |
| `README.md` | Replaced generic Vite instructions with application-specific setup, routes, architecture, demo limitations, hosting requirements, and a link to this full change explanation. |
| `.gitignore` | Added `.tmp/` so temporary browser verification scripts, screenshots, and browser profile data remain local and are not shipped as application source. |

`src/main.tsx` remains the React entry point and keeps Strict Mode. The Vite, ESLint, and TypeScript configuration files remain in place; the implementation uses their existing behavior.

`docs/IMPLEMENTATION.md` is a new file: it records the architecture, the reason for each source change and starter removal, the demo boundaries, and the verification and deployment instructions requested with this implementation.

## Static assets added

| Added file | Responsibility and origin |
| --- | --- |
| `public/images/cinnamon-hero.png` | Original generated cinnamon artwork for the Home hero, approximately 2.5 MB. This is illustrative, photo-style imagery, not a photograph of real inventory. |
| `public/images/cinnamon-story.png` | Original generated cinnamon artwork for the Home story section, approximately 2.9 MB. This is illustrative, photo-style imagery, not a photograph of real inventory. |
| `docs/ASSETS.md` | Records the origin and full generation prompts for these two assets. |

The images were created with the built-in image generation tool. No outside image attribution is needed. Product packaging is separately illustrated in React/CSS. No font files are bundled or fetched: serif and sans-serif text use the available system fallbacks, including Georgia and Segoe UI, when the preferred named fonts are not installed.

## Starter files removed

| Removed file | Reason |
| --- | --- |
| `src/assets/hero.png` | Used only by the original Vite starter's central illustration. The storefront has its own cinnamon hero image. |
| `src/assets/react.svg` | Used only for the original React starter logo. No storefront component imports it. |
| `src/assets/vite.svg` | Used only for the original Vite starter logo and documentation link. No storefront component imports it. |
| `public/icons.svg` | The original starter documentation/social icon sprite is no longer referenced. `Icon.tsx` provides the storefront's required icons. |

The now-empty `src/assets/` directory is also removed. Removing these files leaves no application imports pointing to the old starter assets. No dependency, lockfile, or configuration files were removed.

## Tests and checks

`tests/cart.test.ts` was added using Node's built-in test runner and assertion module. No test framework dependency is required. Its eight tests cover:

1. Rejecting malformed saved entries, unknown/missing product IDs, missing quantities, negative values, fractional quantities, NaN, Infinity, and string quantities.
2. Merging duplicate saved products and applying the maximum quantity.
3. Immutable add/update/remove behavior and ignoring invalid quantity updates.
4. Omitting products that are no longer present in the catalog.
5. Applying $4.95 shipping below the free-shipping threshold.
6. Free shipping at a $50 subtotal and no charge for an empty cart.
7. Graceful operation when browser storage is unavailable.
8. Ignoring corrupt saved JSON, normalizing restored entries, and saving/loading a valid cart.

All eight tests passed with `npm.cmd test`. Type checking passed with `npm.cmd run typecheck`, and the production build passed with `npm.cmd run build`.

Headless Chrome checks passed against the local Vite application at desktop (1440px) and mobile (390px) widths. These verified all four routes returning HTTP 200, Home imagery loading, category filtering, search and empty-results reset, ascending price sorting, product details and Escape dismissal, cart persistence after reload, quantity changes, the $50 free-shipping boundary, demo checkout and cart clearing, wholesale enquiry links, contact validation and first-invalid focus, enquiry preview/reset, search shortcut focus, the unknown-route screen, and mobile menu opening/closing. All four mobile pages had no horizontal overflow, and no JavaScript exceptions were observed. Desktop Home/bag and mobile Home/Contact screenshots were inspected. The temporary automation script, browser profile, and screenshots are in the ignored `.tmp/` directory; no browser automation dependency was added.

For browser verification, inspect all four routes, direct URL reloads and back/forward navigation; the mobile menu; product search, category, sorting, empty results, and detail dialogs; bag quantity/removal, reload persistence, and the $50 shipping boundary; invalid and valid demo checkout; invalid and valid contact previews and service-topic links; and keyboard focus/Escape behavior in dialogs.

## Storage, prices, and demo limits

- The browser storage key is **`alba-cinnamon-cart-v1`**. It contains product IDs and quantities, not customer contact or payment details.
- Each product quantity is capped at **99**. Corrupt/invalid storage is safely discarded or normalized. If storage fails, shopping continues for the current page session.
- Prices use **USD**. Shipping is **$4.95** for a non-empty bag below a **$50** product subtotal, and **$0** at or above that subtotal. No taxes or destination-specific delivery rules are calculated.
- The checkout asks only for a name and email for its temporary preview. It creates no server record, sends no email, charges nothing, and fulfills nothing.
- Contact details use an illustrative `.example` address. The contact form keeps values only in React memory and explicitly presents a preview rather than claiming a message was sent.
- Products, prices, branding, packaging, and sales copy are sample content. Replace them with verified business information before operating a real storefront.

## Running and extending the application

Use Node **22.18 or newer** for the documented commands; Node 24 was used during development. The installed Vite package's own engine declaration is `^20.19.0 || >=22.12.0`, but the project recommends the newer baseline for direct TypeScript test execution.

```powershell
npm.cmd ci
npm.cmd run dev
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

`npm.cmd` is useful on Windows hosts where PowerShell blocks `npm.ps1`; it does not require changing the system execution policy. The existing optional `npm.cmd run lint` script is retained.

To host the build, serve `dist/` and configure **SPA history fallback to `index.html`** for page routes. A plain static host without that fallback will return 404 on direct requests to `/products`, `/services`, or `/contact`, even though navigation from the homepage may work.

To extend the catalog, edit `src/models/product.ts`. To change currency or shipping policy, update the formatter and cart rules together, update displayed policy copy, and adjust the tests. Reusable visuals belong in `views/components`; new pages belong in `views/pages` with a route registered in `App.tsx`.

A real commerce integration should add a service/API layer between controllers and a backend. That layer is deliberately **not present** in this sample. The backend must own trusted catalog prices, stock checks, shipping/tax calculations, order records, and payment state. Add real enquiry delivery and a payment provider only after the appropriate server endpoints exist; do not claim success based solely on a client-side confirmation.
