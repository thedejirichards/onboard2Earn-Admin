# AGENTS.md

## Commands
- `npm run dev` - Start Vite dev server (http://localhost:5173)
- `npm run build` - Production build to `dist/`
- `npm run typecheck` - Type-check with `tsc -b`

## Project Structure
- Onboard2Earn Admin: desktop admin console for staff-assisted customer onboarding
- Sibling project to `staffAssistAdmin` (the mobile field-staff app) — shares design system (Effra font, Access Bank brand colors, theme.css) and the Entra-style login flow logic, but this app targets desktop only
- `tsconfig.json` references `tsconfig.app.json` (src) and `tsconfig.node.json` (vite.config.ts)
- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- React Router v7, routes defined in `src/app/App.tsx`
- Pages in `src/app/pages/`: `LoginStartPage.tsx` → `LoginAccountPickerPage.tsx` → `LoginPasswordPage.tsx` → `DashboardPage.tsx` (placeholder)
- Layout: `src/app/components/DesktopAuthLayout.tsx` (split-screen: branded left panel + auth card on the right)

## Aliases
- `@` → `./src` (vite.config.ts, mirrored in tsconfig.app.json)

## Important
- Keep **both** React and Tailwind plugins in vite.config.ts - removing either breaks the build
- SVG/CSV files can be imported directly (`assetsInclude` in vite.config.ts)
- Entry point: `src/main.tsx` imports `src/styles/index.css` (loads Effra font, Tailwind)
- No backend auth wired yet — the login flow is UI-only and navigates straight to `/dashboard`
