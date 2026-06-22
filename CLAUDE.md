# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marketing Primor CRM — a client-side-only SPA for a marketing agency. No build step, no package manager, no server. All logic runs in the browser via vanilla JavaScript with Supabase as the backend.

**Deployed at:** crm.gislainebarbeto.com.br via Hostinger  
**Auto-deploy:** Push para `main` no GitHub → GitHub Actions faz deploy via FTP para Hostinger automaticamente.

## Running Locally

Open `index.html` directly in a browser (or serve with any static file server). No compilation needed.

```bash
python3 -m http.server 8080
# or
npx serve .
```

## Deployment (Auto)

Deploy é **automático via GitHub Actions** ao fazer push para `main`.

Fluxo completo após qualquer alteração de código:
```bash
git add index.html formulario.html  # (ou outros arquivos alterados)
git commit -m "descrição da mudança"
git push origin main
# GitHub Actions (.github/workflows/deploy.yml) dispara e envia os arquivos via FTP para Hostinger
```

> **IMPORTANTE:** Após cada tarefa concluída, Claude deve commitar e fazer push automaticamente sem precisar que o usuário peça. Incluir sempre `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>` no commit.

O workflow usa os secrets do repositório GitHub:
- `FTP_SERVER` — IP do servidor Hostinger
- `FTP_USERNAME` — usuário FTP
- `FTP_PASSWORD` — senha FTP

> **⚠️ CRÍTICO — server-dir do FTP:** O `server-dir` no workflow DEVE ser `crm/` e nunca `public_html/crm/` ou `domains/.../public_html/crm/`. O FTP do Hostinger já cai dentro de `public_html/`, então qualquer prefixo extra cria uma pasta duplicada. A estrutura correta no servidor é `public_html/crm/` e o caminho relativo ao root FTP é apenas `crm/`.

## Architecture

Arquivos HTML auto-contidos (CSS e JS inline):

| File | Audience | Purpose |
|------|----------|---------|
| `index.html` | Admin + Clients | CRM admin e portal do cliente (mesmo arquivo, roteamento por role) |
| `formulario.html` | Public | Formulário de captação de leads (multi-step) |
| `manual-cliente.html` | Clients | Manual/onboarding do cliente |

**Session routing em `index.html`:**
- Verifica sessão Supabase no load
- `gislainebarbeto@gmail.com` → Painel admin
- Qualquer outro usuário autenticado → Portal do cliente (filtrado por email)
- Não autenticado → Tela de login

## Admin Tabs (Painel Admin)

| Tab | Função render | Descrição |
|-----|--------------|-----------|
| Formulários | `renderFormularios()` | Leads crus vindos do formulário público |
| Leads | `renderLeads()` | Pipeline de leads qualificados (kanban por stage) |
| Follow-up | `renderFollowup()` | Tarefas/lembretes de contato |
| Posts | `renderPosts()` | Gestão de conteúdo (calendário + lista) |
| Clientes | `renderClientes()` | Contas de clientes + portal config |
| Financeiro | `renderFinanceiro()` | Cobranças por cliente (vencimento, valor, status) |
| Arquivos | `renderArquivos()` | Arquivos e links por cliente |
| Automações | `renderAutomacoes()` | Posts agendados para automação |
| Métricas | `renderMetricas()` | KPIs mensais por cliente (seguidores, alcance, etc.) |
| Comece | `renderComece()` | Seção de onboarding/boas-vindas do portal cliente |
| Lab | `renderLab()` | Banco de ideias (brainstorm) |
| Info | `renderInfoAdmin()` | Informações/documentos por cliente |
| Solicitações | `renderSolicitacoesAdmin()` | Pedidos/ajustes solicitados pelo cliente |
| Tarefas | `renderTarefas()` | Projetos e tarefas da equipe interna |
| Demandas | `renderDemandas()` | Demandas da equipe (briefings internos) |
| Chat | (inline) | Chat em tempo real admin ↔ cliente |

## Client Portal Tabs

| Tab | Descrição |
|-----|-----------|
| Posts | Posts do cliente agrupados por status; ações de aprovação/rejeição |
| Métricas | Gráficos de desempenho (seguidores, alcance, engajamento) |
| Arquivos | Arquivos e links compartilhados pelo admin |
| Ideias | Banco de ideias e brainstorm |
| Informações | Documentos e informações do cliente |
| Solicitações | Abertura de solicitações/ajustes |
| Tarefas | Projetos e tarefas visíveis ao cliente |
| Chat | Chat com a equipe admin |

## Supabase Schema

Projeto: `dloxddrdqsltuwdabwaq.supabase.co`

**`formularios`** — leads brutos do formulário público  
`id, nome, marca, servico, whatsapp, email, instagram, segmento, desafio, investimento, lido, virou_lead, created_at`

**`leads`** — leads qualificados  
`id, nome, empresa, segmento, servico, whatsapp, email, instagram, stage, origem, obs, created_at`  
`stage`: `novo | contato | proposta | fechado | perdido`

**`followups`** — follow-ups e lembretes  
`id, cliente, tipo, tarefa, msg, urgencia, feito, created_at`  
`tipo`: `whatsapp | email | ligação | reunião | instagram`  
`urgencia`: `atrasado | hoje | semana`

**`posts`** — conteúdo de redes sociais  
`id, client_email, tema_titulo, legenda, hashtags, tipo, data_post, obs, obs_int, img_url, midia_urls, capa_url, status, ref_1, ref_2, ref_3, created_at`  
`status`: `criacao | revisao | aprovado | publicado`

**`clients`** — contas de clientes  
`id, nome, empresa, instagram, email, access_code, foto_url, capa_url, capa_posicao, capa_cor, created_at`

**`financeiro`** — cobranças por cliente  
`id, client_email, descricao, valor, vencimento, status, created_at`  
`status`: `pendente | pago | atrasado`

**`arquivos_cliente`** — arquivos e links  
`id, client_email, nome, url, uploader, created_at`  
Uso especial: `client_email = '__comece__'` → seção Comece (onboarding)

**`metricas`** — KPIs mensais  
`id, client_email, mes, seguidores, alcance, impressoes, engajamento, cliques, created_at`

**`informacoes_cliente`** — informações/documentos  
`id, client_email, titulo, conteudo, tipo, created_at`

**`solicitacoes`** — pedidos do cliente  
`id, client_email, titulo, descricao, prazo, status, created_at`

**`automacoes`** — posts agendados para automação  
`id, post_id, client_email, tipo, resultado, created_at`

**`tarefas`** — tarefas internas  
`id, projeto_id, titulo, status, prazo, client_email, descricao, checklist, etiquetas, membro, anexo_url, capa_url, created_at`

**`projetos`** — projetos internos  
`id, titulo, client_email, status, capa_url, capa_posicao, cor, created_at`

**`demandas`** — demandas da equipe (briefings)  
`id, titulo, descricao, status, prazo, horario, etiquetas, cliente, membro, links, anexo_url, created_at`

**`mensagens`** — chat admin ↔ cliente  
`id, client_email, de, texto, lida, created_at`  
`de`: `admin | client`

**Storage buckets:**
- `posts-media` — mídias de posts (imagens/vídeos)
- Pasta `demandas/` — anexos de demandas
- Pasta `tarefas/` — capas e anexos de tarefas
- Pasta `clientes/` — fotos e capas de clientes

## Key Patterns

**Supabase client** inicializado uma vez no topo de cada arquivo:
```js
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
const db = supabase  // alias usado no index.html
```

**Objeto App** (`index.html`) — singleton com todos os métodos do admin e cliente:
```js
const App = { async init(), async login(), async route(), async tab(), ... }
```

**Tab switching** — `Admin.tab(name)` renderiza o conteúdo correto chamando `render*()`.

**Rich Text Editor** — campos de escrita (descrição de posts, demandas, tarefas, obs) usam um rich editor com menu de barra `/` (slash menu) para formatação inline.

**Dark Mode** — tema escuro glass aesthetic com fundo preto puro (`#000000`), glass sidebar, e variáveis CSS para adaptação. Toggle via botão de lua/sol.

**Capa de cliente** — cada cliente pode ter foto de perfil, capa (imagem ou gradiente de cor), e posicionamento da capa.

**Posts** — modal multi-tab: Tema → Conteúdo → Mídia → Legenda. Suporta múltiplas mídias, prévia de Instagram, publicação direta via API.

**Demandas** — briefings internos com título, descrição (rich text), etiquetas, prazo+horário, cliente, membro responsável, links e múltiplos anexos.

**Tarefas/Projetos** — projetos com kanban de tarefas (checklist, etiquetas, prazo, capa, membro, cliente).

**Client credentials** — geradas na aba Clientes (email + `access_code`) e enviadas ao cliente para login no portal.

## Design Tokens

CSS custom properties em `:root`:
- `--beige`, `--brown`, `--accent`, `--bg`, `--text`, `--muted`, `--border`
- Dark mode sobrescreve as variáveis em `html.dark { ... }`
- Fontes: Poppins (UI), Cormorant Garamond (display/headings) via Google Fonts CDN

## CLAUDE.md Auto-Update

Este arquivo deve ser atualizado sempre que novas features, tabelas, ou padrões relevantes forem adicionados ao projeto.
## Módulos protegidos
Nunca remover ou sobrescrever:
- relatorio_equipe_module.js
- A linha <script src="relatorio_equipe_module.js"></script> no index.html
- O nav-item id="nav-relatorio" no sidebar
- O case 'relatorio' no Admin.tab()
