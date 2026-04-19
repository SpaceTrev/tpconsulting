# TPConsulting

Marketing site for TPConsulting — enterprise-grade automation for Mexican SMBs.

## Tech stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules + CSS custom properties (no Tailwind)
- **Fonts**: Space Grotesk · Public Sans · Inter · JetBrains Mono (via `next/font/google`)
- **Deployment**: Vercel

## Design tokens

Solarized-derived color palette with full light/dark mode. Tokens live in `src/app/globals.css`.

Primary color is a placeholder — Trev is choosing between:
- **Indigo** `#4338ca`
- **Copper** `#b45309`

Update `--primary` / `--primary-container` in both `:root` and `.dark` blocks once decided.

## Pages

| Route | File |
|---|---|
| `/` | `src/app/page.tsx` |
| `/servicios` | `src/app/servicios/page.tsx` |
| `/soluciones` | `src/app/soluciones/page.tsx` |
| `/diagnostico` | `src/app/diagnostico/page.tsx` |
| `/casos` | `src/app/casos/page.tsx` |
| `/nosotros` | `src/app/nosotros/page.tsx` |
| `/contacto` | `src/app/contacto/page.tsx` |
| `/blog` | `src/app/blog/page.tsx` |

## Components

Skeletons in `src/components/`:

- `Nav` — sticky header with links + ThemeToggle + CTA
- `Footer` — two-column link grid
- `WhatsAppButton` — fixed floating button
- `ThemeToggle` — localStorage-backed light/dark toggle
- `DiagnosticForm` — contact/lead capture form
- `PricingCard` — pricing tier card
- `SolutionCard` — solution category card
- `ServiceCard` — individual service listing

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Anti-flash theme

`layout.tsx` injects an inline script before hydration to apply the saved theme class immediately, preventing a flash of incorrect theme on load.
