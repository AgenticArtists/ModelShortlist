# ModelShortlist website

The public landing page for [modelshortlist.com](https://modelshortlist.com).

This is intentionally isolated from the root npm/MCP package. The website can evolve without adding Next.js or frontend dependencies to ModelShortlist users.

## Local development

```bash
cd website
npm install
npm run dev
```

Production validation:

```bash
npm run check
npm run build
```

## Vercel

Create or import a Vercel project from `AgenticArtists/ModelShortlist` and set:

- **Root Directory:** `website`
- **Framework Preset:** Next.js (auto-detected)
- **Build Command:** `npm run build` (default)
- **Install Command:** `npm install` (default)
- **Environment variables:** none

Then add `modelshortlist.com` as the production domain. Configure the registrar DNS records exactly as Vercel requests. `www.modelshortlist.com` can be added as a redirect alias if desired.

The website does not receive or store ModelShortlist API keys. API keys belong only in the local MCP configuration.

## Design system

The site intentionally follows the sibling design language used by AgenticArtists:

- Sora headings, Inter body text, Geist Mono technical labels
- dark-first blue/cyan/violet/pink brand spectrum
- editorial spacing and restrained gradient surfaces
- evidence-oriented cards instead of marketing-heavy decoration
- visible focus states, skip navigation, reduced-motion support, semantic HTML

The landing page is deliberately smaller than AgenticArtists.com: one static marketing surface, no account system, no hosted model-selection backend, and no application database.
