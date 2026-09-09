# unbley

Unbley is an online platform where businesses that want to get a custom website dedicated to their business come to build, launch, and scale.

## Benefits
- **Custom genuine domain**
- **Backend workers monitoring 24/7**
- **Fast and highly responsive**
- **Secured payment methods** partnered with Paystack & Flutterwave
- **AI integration coming soon**

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Read-only Store Owner Spreadsheet

The endpoint `/api/store-owners` exposes a token-protected, read-only export of every column in `brand_profiles`, including banking fields. It never exposes passwords, session tokens, the Supabase service key, or other authentication credentials, and it has no write operation.

### Setup

1. Add `STORE_OWNERS_EXPORT_TOKEN` to Vercel as a long random secret. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only; never add either value to a `VITE_` variable.
2. Deploy the project and copy `scripts/store-owners-google-sheets.gs` into the Google Sheet's Apps Script editor.
3. Replace `STORE_OWNERS_EXPORT_URL` with your deployed URL and `STORE_OWNERS_EXPORT_TOKEN` with the same Vercel secret.
4. Run `refreshStoreOwners` once and approve the Google authorization prompt.
5. Run `createDailyStoreOwnerRefresh` once if the sheet should refresh daily.

The script discovers all returned columns dynamically, so new `brand_profiles` columns are included on the next refresh. It only writes the fetched snapshot into the spreadsheet itself. Editing spreadsheet cells does not update Supabase.

## Admin Store Owners Directory

Admins can open `/admin/store-owners` from the admin sidebar to view every `brand_profiles` column, search across all owner details, refresh live changes, and download the current results as CSV. The page does not edit profiles.

Before using the page, run `src/db/admin_migration.sql` in the Supabase SQL Editor. Its admin-only read policy allows an admin to view all store owner profiles while regular users can still view only their own profile.

## Store Domains

Run `src/db/store_domains_migration.sql` in Supabase SQL Editor. It adds a stable generated domain such as `brand-name-a1b2c3d4.unbley.com` and a `custom_domain` field to each store profile. The Edit page shows the generated URL and lets the owner save a custom domain.

For generated domains to resolve publicly, configure a wildcard domain for the deployment: add `*.unbley.com` to the Vercel project and create the corresponding wildcard DNS record at the domain provider. For a custom domain, the owner must add that domain to the Vercel project and point its DNS records to Vercel. Once DNS is active, Unbley resolves the hostname to the matching store automatically.
