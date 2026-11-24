# Product quotations

Open a product and select **Inquire prices**. The form carries over the product and pack size and collects the quantity, name, reply email, and optional details.

## Try the demo

Run `npm run dev` and submit the form. The server writes a separate email addressed to `quotations@example.com` in `.alba-cinnamon/quotation-inbox/` under the operating-system user's home directory. Open the .eml file with a mail client or text editor. Set `QUOTATION_INBOX_DIR` to change this private directory. Keep it outside public web directories.

## Enable a real inbox

Copy `.env.example` to `.env` or set the variables on the host. Set `QUOTATION_MODE=email`, `QUOTATION_TO` to the business inbox, `QUOTATION_FROM` to a verified Resend sender, and `RESEND_API_KEY` to its sending key. Restart the server. The customer email is used as Reply-To. The form confirms submission after the provider accepts the email. [Resend delivery API](https://resend.com/docs/api-reference/emails/send-email)

Use Node.js 22.18 or later. Run `npm run build` and `npm start` from the project directory. Deploy the server, src/models/product.ts and dist together. The Node server serves both the website and POST /api/quotations. Set PORT and HOST as needed. A static-only frontend must forward that API route to the Node backend. Vite development and preview also include this endpoint.
