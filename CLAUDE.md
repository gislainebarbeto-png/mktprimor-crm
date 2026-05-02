# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marketing Primor CRM — a client-side-only SPA for a marketing agency. No build step, no package manager, no server. All logic runs in the browser via vanilla JavaScript with Supabase as the backend.

**Deployed at:** crm.gislainebarbeto.com.br via Netlify (auto-deploy on `git push`)

## Running Locally

Open `index.html` directly in a browser (or serve with any static file server). No compilation needed.

```bash
# Quick local server if needed
python3 -m http.server 8080
# or
npx serve .
```

## Deployment

```bash
git add .
git commit -m "descrição da mudança"
git push  # triggers Netlify auto-deploy
```

## Architecture

Three HTML files, each self-contained with all CSS and JS inline:

| File | Audience | Purpose |
|------|----------|---------|
| `index.html` | Admin + Clients | Main CRM (admin) and client portal (same file, role-based routing) |
| `formulario.html` | Public | Lead capture form (multi-step) |

**Session routing in `index.html`:**
- On load, checks Supabase auth session
- `gislainebarbeto@gmail.com` → Admin panel
- Any other authenticated user → Client portal (scoped to their email)
- Unauthenticated → Login screen

## Supabase Schema

All data lives in Supabase (`dloxddrdqsltuwdabwaq.supabase.co`). Tables:

**`formularios`** — raw leads from the public form  
`id, nome, marca, servico, whatsapp, email, instagram, segmento, desafio, investimento, lido, virou_lead, created_at`

**`leads`** — qualified leads managed by admin  
`id, nome, empresa, segmento, servico, whatsapp, email, instagram, stage, origem, obs, created_at`  
`stage` values: `novo | contato | proposta | fechado | perdido`

**`followups`** — tasks/reminders  
`id, cliente, tipo, tarefa, msg, urgencia, feito, created_at`  
`tipo`: `whatsapp | email | ligação | reunião | instagram`  
`urgencia`: `atrasado | hoje | semana`

**`posts`** — social media content  
`id, client_email, legenda, hashtags, tipo, data_post, obs, obs_int, img_url, status, created_at`  
`status`: `criacao | revisao | aprovado | publicado`

**`clients`** — client accounts  
`id, nome, empresa, instagram, email, access_code, created_at`

**Storage bucket:** `posts-media` — images uploaded for posts

## Key Patterns

**Supabase client** is initialized once at the top of each file:
```js
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
```

**Admin tabs** in `index.html`: Formulários, Leads, Follow-up, Posts, Clientes — each rendered by a dedicated `render*()` function called on tab switch.

**Client portal** renders posts filtered by `client_email = session.user.email`, grouped by status, with approve/reject actions on `revisao`-status posts.

**Image uploads** (Posts tab) go to Supabase Storage `posts-media` bucket and store the public URL in `posts.img_url`.

**Client credentials** are auto-generated in the Clientes tab (email + `access_code`) and sent to clients to log into the portal.

## Design Tokens

CSS custom properties defined in `:root` of each file:
- `--beige`, `--brown`, `--accent` — brand color palette
- Fonts: Poppins (UI), Cormorant Garamond (display/headings) via Google Fonts CDN
