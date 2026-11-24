# Alba Cinnamon

A React and TypeScript company site with Home, Services, Products, Contact, and a product quotation form.

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

## Requesting prices

Select a product on Home or Products and choose **Inquire prices**. The quotation form opens with the product selected and collects pack quantity, customer name, reply email, and optional details. The general Contact form remains a local preview.

## Delivery and deployment

By default, submitted quotations go to a private local demo mailbox addressed to `quotations@example.com`. To deliver inquiries to the company inbox, configure the recipient and verified sender on the server. See [quotation delivery setup](docs/QUOTATIONS.md).

Use `npm run build` followed by `npm start` to run the website and its email endpoint together. A static frontend deployment must also connect the quotation API. The [original implementation notes](docs/IMPLEMENTATION.md) describe the earlier sample checkout.
