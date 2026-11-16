# Alba Cinnamon

A responsive React + TypeScript sample storefront for cinnamon products, built in the existing Vite application. It includes Home, Services, Products, and Contact pages, an illustrated product catalog, a persistent shopping bag, and a local demo checkout.

## Run locally

Use Node.js **22.18 or newer**. The installed Vite package declares `^20.19.0 || >=22.12.0`; this project recommends the newer baseline because its tests also run TypeScript directly with Node's type stripping. Development was performed with Node 24.

From this project directory in Windows PowerShell:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open the local URL printed by Vite. `npm.cmd` avoids PowerShell's restriction on executing `npm.ps1`. In a shell that supports the regular `npm` command, either form is suitable.

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

`build` produces `dist/`. `preview` serves that production build locally. The original optional lint command remains available as `npm.cmd run lint`.

## Pages and interactions

| Page | Route | What it provides |
| --- | --- | --- |
| Home | `/` | Brand introduction, featured products, story, and links into the collection. |
| Services | `/services` | Retail, wholesale, and gifting information; enquiry links preselect the relevant contact topic. |
| Products | `/products` | Six sample products, category filtering, text search, sorting, product detail dialogs, and add-to-bag controls. |
| Contact | `/contact` | Validated enquiry form, local confirmation preview, and expandable FAQs. |

The shared header, footer, mobile navigation, bag, and notifications work across pages. Browser back/forward navigation and direct page URLs are supported. Unknown routes display a page-not-found message.

## Source organization

```text
src/
  models/       Product data, cart validation, quantities, and totals
  controllers/  React hooks, shared state, routing, and form behavior
  views/
    components/ Shared interface components
    pages/      Home, Services, Products, and Contact pages
  App.tsx       Route-to-page composition and page titles
  App.css       Application and responsive styles
  index.css     Global styles and design tokens
  main.tsx      Existing React entry point
public/         Static branding and generated illustrative imagery
tests/          Cart behavior tests using Node's built-in test runner
docs/           Detailed implementation and file-change explanation
```

This uses **MVC-inspired separation** adapted to React: models own data and business rules, controller hooks/context own interactions, and views render the interface. It does not introduce a server-side MVC framework or an unnecessary state/routing dependency.

## Demo boundaries

- Products, packaging, prices, brand copy, and contact details are illustrative.
- Hero and story images are original generated, photo-style illustrations, not photographs of real inventory. No fonts are bundled; typography uses system fallbacks.
- Prices are in USD. Sample shipping is $4.95 below a $50 product subtotal and free at $50 or more; an empty bag has no shipping charge.
- The bag persists only in the current browser under `alba-cinnamon-cart-v1`. Quantities are capped at 99 per product. Invalid stored data is ignored; the bag still works in memory if storage is unavailable.
- Checkout creates a temporary confirmation and clears the bag. No payment is taken, no email is sent, and no order is created or shipped.
- The contact form validates and previews an enquiry in memory. It does not submit it to a server or save it to browser storage.
- No backend, authentication, payment gateway, inventory service, tax calculation, or actual delivery integration is included.

## Hosting

Build with `npm.cmd run build` and serve `dist/` as a static site. Configure the host to return **`index.html` for application routes** such as `/products` and `/contact`; the application uses the browser History API. Preserve normal static asset serving. Vite's development and preview servers already provide SPA fallback behavior.

For a production store, add an API/service layer for catalog data, inventory, enquiries, and orders. Calculate and validate prices on the server and use a payment provider's hosted checkout. Keep that integration outside the view components.

See [the complete implementation notes](docs/IMPLEMENTATION.md) for the purpose of every added or modified source file, the starter files removed, and verification details.
