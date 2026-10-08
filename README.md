# Opalsign — Warehouse Commerce PWA

Vanilla HTML/CSS/JavaScript PWA starter using the uploaded mobile storefront screenshot as its design reference.

## Included in this starter
- Responsive orange/white storefront and mobile bottom navigation
- Product categories, search, product details and cart
- Staff sign-in with remembered demo identity, role-aware dashboards and personal notification inboxes
- Admin-provisioned staff accounts, direct or team-wide in-app messages, and driver assignment alerts
- Separate Supabase-authenticated admin page for local catalogue and banner management
- Local demo admin operations for orders, staff, delivery drivers, branches and support contacts
- Admin operations overview with purchased-unit totals, workforce categories, and delivered alerts
- Separate open-order, delivered-alert and dispatch views with individual order details
- Driver delivery portal with browser geolocation and an OpenStreetMap tracking map
- Multiple storefront banners that become a slider, with short MP4/WebM video support
- Paystack Inline test checkout using a public key
- Guest checkout demo with local order references and pending-payment status
- Demo order tracking
- Quote request UI
- PWA manifest, service worker and offline fallback
- Supabase migration starter and security implementation notes

## Run locally
Use VS Code Live Server or any static HTTP server. Do not open `index.html` using `file://`, because service workers require HTTP/HTTPS.

## Operations demonstration
Sign in to the staff portal with the local demo credentials below. In Staff, an administrator can create accounts for warehouse, sales, customer support and delivery staff, and send an in-app message to one staff member or the whole team. Staff use their assigned username and temporary password to sign in at `admin.html`; drivers use `driver.html`. Each person has a private inbox. New orders notify the administrator, warehouse and sales staff; quote requests notify the administrator, sales and customer support; dispatching an order notifies only the assigned driver, and later order status changes notify that driver. Staff can mark inbox messages as read; the active sign-in is remembered in that browser tab. The Overview summarizes orders, purchased item units, active deliveries, delivered orders, workforce by role, top purchased products and delivery alerts. Administrators can review open orders, dispatch deliveries, and manage branches, products and banners. Allow browser location access for drivers to share their position on the customer order-tracking map. Add support phone, email or WhatsApp details in the Branches section for the storefront Support button.

This is intentionally a **same-browser demonstration**, not a multi-user deployment: staff accounts, orders, branches, banners, support settings, inbox notifications and GPS updates use browser-local storage and are not shared with other devices or browser profiles. Staff password hashes are stored in browser storage, but client-side login is not secure enough for real credentials or customer data. In-app and optional browser desktop notifications only work in this browser; the system does not send email, SMS or remote push. A production rollout needs deployed authentication, database access policies, server-side order/payment APIs, a notification provider and authorized location-sharing rules.

The driver and customer maps use Leaflet with OpenStreetMap tiles and require an internet connection. Driver tracking also requires a secure browser context (HTTPS or localhost) and the driver's permission to use location.

To smoke-test Paystack in its test environment, add an item to the cart and use the `Success` test option shown by Paystack Checkout. A completed browser checkout stores the transaction reference on the demo order; its payment status intentionally remains awaiting trusted verification. Never treat a frontend callback as proof of payment or use this flow for live payments until server-side initialization and verification are deployed.

## Configure authentication and test payments
The checkout uses Paystack Inline from `js/payment.js`. `js/config.js` is set to the supplied Paystack **test public key**; replace it with your own `pk_test_...` key before testing payments. Set both `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in that file to enable Supabase administrator sign-in. Never put a Paystack secret key or Supabase service-role key in browser code.

### Local demo administrator login
With both Supabase settings empty, open `admin.html` and use:

- Username: `demo-admin`
- Password: `OpalsignDemo2026!`

This intentionally client-side demo login is only for a local demonstration. Its credentials are visible in the browser and only grant access to demo data stored in that browser. The administrator creates individual staff accounts in the Staff tab; open staff self-sign-up is disabled so each account receives its role from the administrator. Staff accounts and their notification inboxes are local to this demo browser. Demo login is disabled automatically when Supabase is configured; then the portal requires a Supabase user with the server-assigned admin role below.

### Create the first administrator login
1. In the Supabase project, open **Authentication → Users** and invite `opalsignadmin@gmail.com`. Use Supabase's invite email to set the password; do not put a password in source code or send it in chat.
2. After the user accepts the invite, open the Supabase **SQL Editor** and run this query as the project owner to grant the administrator role:

   ```sql
   update auth.users
   set raw_app_meta_data =
     coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = 'opalsignadmin@gmail.com';
   ```

   Confirm the query reports one updated row. If it reports zero, accept the invite first and check the email address.
3. Set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in `js/config.js` using the values from the Supabase project's API settings.
4. Open `admin.html` and sign in with `opalsignadmin@gmail.com` and the password set from the invite email.

The role must be in Supabase `app_metadata`, not editable user metadata. The portal validates the role with Supabase Auth; the frontend login gate is not a substitute for server-side authorization or database RLS.

## Important production gaps
This generated starter is a front-end prototype. Paystack Inline opens a real test checkout, but a browser callback is **not** payment verification. Orders stay pending; production must initialize and verify transactions server-side (including signed webhooks) before marking orders paid. It does not create real Supabase staff accounts, store orders in PostgreSQL, send SMS/email, collect GPS positions, or operate pickup station OTP verification. Those require the Supabase project, reviewed migrations, Edge Functions, provider credentials, and end-to-end security testing.

The admin catalogue and banners are saved to IndexedDB in the current browser only, and uploaded banner videos are limited to 20 MB and 30 seconds. This is useful for local demo/testing but does not publish changes to other users or devices. Supabase role-gated database policies and shared image/video storage are still required to protect and publish real business data.

## Recommended next implementation milestones
1. Replace browser-only catalogue/banner persistence with role-protected product/media APIs and RLS.
2. Apply and test database migrations and provision admin roles server-side.
3. Implement Paystack server-side initialization, webhook handling and transaction verification.
4. Implement driver GPS, Google Maps and station receipt/OTP workflows.
5. Configure Cloudflare WAF/rate limits and production deployment.
