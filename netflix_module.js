// ───────────────────────────────────────────────────────────────────────
// NETFLIX MODULE — Agência Primor CRM
// Grid visual estilo Netflix · Sem sidebar · Upload de capa
// ───────────────────────────────────────────────────────────────────────
(function(){
  'use strict';

  const STORAGE_KEY  = 'primor_module_covers';
  const BUCKET       = 'posts-media';
  const COVER_FOLDER = 'module-covers';
  const CUSTOM_KEY   = 'primor_custom_cards';
  const CUSTOM_PATH  = 'module-covers/custom_cards.json';
  const ORDER_KEY    = 'primor_card_order';
  const ORDER_PATH   = 'module-covers/card_order.json';
  let _customCards   = [];
  let _savedOrder    = {};

  // ── TODOS OS MÓDULOS (lateral + dashboard) ───────────────────────────
  const ADMIN_MODULES = [
    { id:'inicio',       icon:'⬡',  label:'Dashboard',     desc:'KPIs, gráficos e visão geral',          gradient:'linear-gradient(145deg,#1a0820,#3a1050,#7A1A2A)' },
    { id:'posts',        icon:'▦',  label:'Posts',         desc:'Calendário e gestão de conteúdo',       gradient:'linear-gradient(145deg,#1a0830,#4a1060,#8B2FC9)' },
    { id:'clientes',     icon:'◎',  label:'Clientes',      desc:'Contas e portais dos clientes',          gradient:'linear-gradient(145deg,#0a1628,#1a3a6a,#2E6FD4)' },
    { id:'financeiro',   icon:'◈',  label:'Financeiro',    desc:'Cobranças, vencimentos e status',        gradient:'linear-gradient(145deg,#0d1f0d,#1a4a1a,#2E8B57)' },
    { id:'arquivos',     icon:'▤',  label:'Arquivos',      desc:'Arquivos e links por cliente',           gradient:'linear-gradient(145deg,#1a1408,#4a3a10,#B8860B)' },
    { id:'automacoes',   icon:'✵',  label:'Automações',    desc:'Posts agendados para automação',         gradient:'linear-gradient(145deg,#0d0d1f,#1a1a5a,#4040C0)' },
    { id:'comece',       icon:'✦',  label:'Comece Aqui',   desc:'Onboarding e boas-vindas',               gradient:'linear-gradient(145deg,#1f1408,#5a3a10,#D4567A)' },
    { id:'lab',          icon:'⊙',  label:'Ideias',        desc:'Banco de ideias e brainstorm',           gradient:'linear-gradient(145deg,#0d1a0d,#2a4a10,#6B8E23)' },
    { id:'info',         icon:'≡',  label:'Informações',   desc:'Documentos e informações',               gradient:'linear-gradient(145deg,#1a0d18,#4a1a45,#8B3A8B)' },
    { id:'solicitacoes', icon:'◫',  label:'Solicitações',  desc:'Pedidos e ajustes dos clientes',         gradient:'linear-gradient(145deg,#1a1008,#4a2a08,#D4567A)' },
    { id:'demandas',     icon:'⊞',  label:'Demandas',      desc:'Briefings e demandas da equipe',         gradient:'linear-gradient(145deg,#1f0d0d,#5a1a1a,#C0392B)' },
    { id:'chat',         icon:'◷',  label:'Chat',          desc:'Mensagens com os clientes',              gradient:'linear-gradient(145deg,#081a1a,#104040,#1A8FA0)' },
    { id:'relatorio',    icon:'📝', label:'Diário',        desc:'Relatório diário da equipe',             gradient:'linear-gradient(145deg,#1a1218,#3a2040,#7A1A2A)' },
    { id:'comercial',    icon:'◈',  label:'Comercial',     desc:'Pipeline e gestão comercial',            gradient:'linear-gradient(145deg,#0f1a0a,#2a4a14,#4A7C30)' },
    { id:'agentes',      icon:'✦',  label:'Agentes IA',    desc:'Automações e agentes inteligentes',      gradient:'linear-gradient(145deg,#0a0a1f,#1a1040,#6030C0)' },
    { id:'tarefas',      icon:'✓',  label:'Tarefas',       desc:'Projetos e kanban da equipe',            gradient:'linear-gradient(145deg,#0d1a1f,#1a4a5a,#1A8FA0)' },
    { id:'brand',        icon:'✦',  label:'Brand Core',    desc:'Identidade e posicionamento da marca',   gradient:'linear-gradient(145deg,#0a1628,#1a3a6a,#2E6FD4)' },
  ];

  // ── SEÇÕES ADMIN ─────────────────────────────────────────────────────
  const ADMIN_SECTIONS = [
    { title:'Visão Geral',       ids:['inicio','posts','relatorio','agentes','comercial'] },
    { title:'Clientes & Gestão', ids:['clientes','financeiro','arquivos','info','brand'] },
    { title:'Equipe',            ids:['demandas','tarefas','solicitacoes','chat'] },
    { title:'Conteúdo & Mais',   ids:['automacoes','comece','lab'] },
  ];

  // ── MÓDULOS DO PORTAL CLIENTE ─────────────────────────────────────────
  const CLIENT_MODULES = [
    { id:'posts',        icon:'▦',  label:'Posts',         desc:'Seu conteúdo e aprovações',            gradient:'linear-gradient(145deg,#1a0830,#4a1060,#8B2FC9)' },
    { id:'brand',        icon:'✦',  label:'Brand Core',    desc:'Identidade e posicionamento da marca',  gradient:'linear-gradient(145deg,#0a1628,#1a3a6a,#2E6FD4)' },
    { id:'ideias',       icon:'⊙',  label:'Ideias',        desc:'Banco de ideias e brainstorm',          gradient:'linear-gradient(145deg,#0d1a0d,#2a4a10,#6B8E23)' },
    { id:'chat',         icon:'◷',  label:'Chat',          desc:'Mensagens com a equipe',                gradient:'linear-gradient(145deg,#081a1a,#104040,#1A8FA0)' },
    { id:'solicitacoes', icon:'◫',  label:'Solicitações',  desc:'Seus pedidos e ajustes',                gradient:'linear-gradient(145deg,#1a1008,#4a2a08,#D4567A)' },
    { id:'arquivos',     icon:'▤',  label:'Arquivos',      desc:'Arquivos e links compartilhados',       gradient:'linear-gradient(145deg,#1a1408,#4a3a10,#B8860B)' },
    { id:'info',         icon:'≡',  label:'Informações',   desc:'Documentos e informações',              gradient:'linear-gradient(145deg,#1a0d18,#4a1a45,#8B3A8B)' },
    { id:'financeiro',   icon:'◈',  label:'Financeiro',    desc:'Cobranças e histórico',                 gradient:'linear-gradient(145deg,#0d1f0d,#1a4a1a,#2E8B57)' },
    { id:'tarefas',      icon:'✓',  label:'Tarefas',       desc:'Projetos e tarefas em andamento',       gradient:'linear-gradient(145deg,#0d1a1f,#1a4a5a,#1A8FA0)' },
    { id:'comece',       icon:'🌱', label:'Início',        desc:'Onboarding e boas-vindas',              gradient:'linear-gradient(145deg,#1f1408,#5a3a10,#D4567A)' },
    { id:'onboarding',   icon:'🌿', label:'Onboarding',    desc:'Guia de materiais e início',            gradient:'linear-gradient(145deg,#0d1f0d,#2a4a1a,#4A8C30)' },
  ];

  // ── CSS ──────────────────────────────────────────────────────────────
  const CSS = `
    /* ── REMOVE SIDEBAR COMPLETAMENTE ── */
    #admin-sidebar,
    #admin-hamburger,
    .sidebar-toggle-btn { display:none !important; }
    .admin-body { overflow:hidden; }
    .admin-main { width:100% !important; padding:0 !important; }

    /* ── FUNDO CINZA ESCURO NO DARK MODE ── */
    html.dark body,
    html.dark #admin-view,
    html.dark #client-view { background:#0D0D0D !important; }
    html.dark .admin-main,
    html.dark .client-main { background:#0D0D0D !important; }

    /* ── BOTÃO VOLTAR NO HEADER ── */
    #nf-admin-back {
      display:none;align-items:center;gap:7px;
      background:rgba(255,214,186,0.1);
      border:1px solid rgba(255,214,186,0.28);
      color:#ffd6ba;font-size:13px;font-weight:500;
      padding:8px 16px;border-radius:20px;cursor:pointer;
      transition:all .2s;white-space:nowrap;flex-shrink:0;
      margin-right:10px;
    }
    #nf-admin-back:hover { background:rgba(255,214,186,0.18);border-color:rgba(255,214,186,0.5); }
    #nf-admin-back .nf-back-arrow { font-size:16px;line-height:1; }
    html:not(.dark) #nf-admin-back { background:rgba(140,114,52,0.1);border-color:rgba(140,114,52,0.3);color:#8C7234; }
    html:not(.dark) #nf-admin-back:hover { background:rgba(140,114,52,0.18); }

    /* ── MOBILE RESPONSIVO ── */
    @media(max-width:768px){
      .admin-main,.client-main{padding:0!important;}
      .table-wrap{overflow-x:auto!important;-webkit-overflow-scrolling:touch;}
      table{min-width:500px;}
      .modal-box,[class*="modal-box"]{width:calc(100vw - 24px)!important;max-width:100%!important;max-height:90vh!important;overflow-y:auto!important;margin:12px!important;}
      .kanban{padding-bottom:20px!important;}
      .k-col{min-width:220px!important;}
      .dh-kpis,.dh-charts,.dh-bottom{grid-template-columns:1fr!important;}
      .nf-hero{padding:24px 16px 20px!important;margin:0 12px 20px!important;}
      .nf-hero-title{font-size:22px!important;}
      .nf-section{padding:0 12px!important;}
      .nf-grid{grid-template-columns:repeat(2,1fr)!important;gap:10px!important;}
      #nf-admin-back{font-size:12px!important;padding:7px 12px!important;}
      .app-header{padding:0 12px!important;}
      .header-logo img{height:40px!important;}
      .header-logo span{display:none!important;}
      .header-right{gap:8px!important;}
      .header-user{display:none!important;}
      .btn-out{padding:6px 10px!important;font-size:11px!important;}
      .detail-panel{width:100%!important;position:fixed!important;inset:0!important;z-index:800!important;}
    }
    @media(max-width:420px){
      .nf-grid{grid-template-columns:repeat(2,1fr)!important;}
      .nf-card-label{font-size:11px!important;}
    }

    /* ── NETFLIX GRID ── */
    .nf-home { padding:0;animation:nfIn .4s ease; }
    @keyframes nfIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }

    .nf-hero {
      background:#000000;
      border:1px solid rgba(255,214,186,0.3);
      box-shadow:0 0 0 1px rgba(104,70,47,0.12), inset 0 0 60px rgba(0,0,0,0.9);
      padding:36px 32px 28px;margin:0 20px 28px;
      border-radius:16px;position:relative;overflow:hidden;
    }
    .nf-hero::before {
      content:'';position:absolute;inset:0;
      background:radial-gradient(ellipse at 50% 100%,rgba(104,70,47,0.2),transparent 65%);
      pointer-events:none;
    }
    .nf-hero::after {
      content:'';position:absolute;top:0;left:10%;right:10%;height:1px;
      background:linear-gradient(90deg,transparent,rgba(255,214,186,0.4),transparent);
      pointer-events:none;
    }
    .nf-hero-title { font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:400;color:#ffd6ba;position:relative;margin-bottom:6px;letter-spacing:.02em; }
    .nf-hero-sub   { font-size:10px;color:rgba(255,214,186,0.45);letter-spacing:.2em;text-transform:uppercase;position:relative; }

    .nf-section { margin-bottom:28px;padding:0 20px; }
    .nf-section-title {
      font-size:10px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
      color:var(--muted);margin-bottom:14px;display:flex;align-items:center;gap:10px;
    }
    .nf-section-title::after { content:'';flex:1;height:1px;background:var(--border); }

    .nf-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:12px; }

    /* CARD */
    .nf-card {
      border-radius:14px;overflow:hidden;cursor:pointer;
      position:relative;aspect-ratio:3/4;
      transition:transform .25s,box-shadow .25s;
      box-shadow:0 4px 16px rgba(0,0,0,0.35);
    }
    .nf-card:hover { transform:translateY(-6px) scale(1.02);box-shadow:0 14px 36px rgba(0,0,0,0.55); }
    .nf-card:active { transform:scale(0.97); }

    .nf-card-bg { position:absolute;inset:0;background-size:cover;background-position:center;transition:transform .4s;pointer-events:none; }
    .nf-card:hover .nf-card-bg { transform:scale(1.07); }
    .nf-card-overlay { position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.18) 55%,transparent 100%);pointer-events:none; }

    .nf-card-body   { position:absolute;bottom:0;left:0;right:0;padding:12px 12px 14px;pointer-events:none; }
    .nf-card-icon   { font-size:22px;margin-bottom:5px;display:block;opacity:0.9; }
    .nf-card-label  { font-size:13px;font-weight:500;color:#fff;display:block;line-height:1.2;margin-bottom:3px; }
    .nf-card-desc   { font-size:9px;color:rgba(255,255,255,0.5);line-height:1.4;display:block; }

    .nf-card-badge {
      position:absolute;top:10px;right:10px;
      background:#C62828;color:#fff;font-size:9px;font-weight:600;
      padding:3px 7px;border-radius:20px;
    }

    /* BOTÃO EDITAR CAPA */
    .nf-card-edit {
      position:absolute;top:8px;left:8px;z-index:10;
      background:rgba(0,0,0,0.65);backdrop-filter:blur(4px);
      border:1px solid rgba(255,255,255,0.15);color:#fff;
      font-size:10px;padding:6px 10px;border-radius:8px;
      cursor:pointer;opacity:0.55;transition:opacity .2s;
      display:flex;align-items:center;gap:4px;
      min-height:30px;min-width:52px;
      -webkit-tap-highlight-color:transparent;
    }
    .nf-card:hover .nf-card-edit { opacity:1; }

    /* BOTÃO VOLTAR (cliente) */
    .nf-back-btn {
      display:inline-flex;align-items:center;gap:6px;
      background:var(--surface);border:1px solid var(--border);
      color:var(--text);font-size:11px;padding:7px 14px;border-radius:20px;
      cursor:pointer;margin:16px 20px 0;transition:all .2s;
    }
    .nf-back-btn:hover { background:var(--beige);border-color:var(--brown); }

    /* ── MODAL DE CAPA ── */
    .nf-cover-modal {
      position:fixed;inset:0;z-index:9999;
      background:rgba(0,0,0,0.8);backdrop-filter:blur(6px);
      display:flex;align-items:center;justify-content:center;
      animation:fadeIn .2s;padding:16px;
    }
    .nf-cover-box {
      background:var(--surface);border:1px solid var(--border);
      border-radius:16px;padding:28px;width:100%;max-width:440px;
      box-shadow:0 24px 64px rgba(0,0,0,0.6);
    }
    .nf-cover-box h3 { font-size:15px;color:var(--brown);margin-bottom:18px;font-weight:500; }

    .nf-drop-zone {
      border:2px dashed var(--border);border-radius:12px;
      padding:28px 16px;text-align:center;cursor:pointer;
      transition:all .2s;margin-bottom:14px;position:relative;
    }
    .nf-drop-zone:hover,.nf-drop-zone.drag-over { border-color:#D4567A;background:rgba(212,86,122,0.06); }
    .nf-drop-zone input[type=file] { position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%; }
    .nf-drop-icon  { font-size:28px;margin-bottom:8px; }
    .nf-drop-text  { font-size:12px;color:var(--muted); }
    .nf-drop-text strong { color:var(--text);font-weight:500; }

    .nf-or { text-align:center;font-size:11px;color:var(--muted);margin:0 0 12px;position:relative; }
    .nf-or::before,.nf-or::after { content:'';position:absolute;top:50%;width:42%;height:1px;background:var(--border); }
    .nf-or::before { left:0; } .nf-or::after { right:0; }

    .nf-cover-url-input {
      width:100%;padding:10px 14px;border-radius:9px;
      border:1px solid var(--border);background:var(--bg);
      color:var(--text);font-size:12px;margin-bottom:14px;box-sizing:border-box;
    }
    .nf-cover-preview {
      width:100%;height:130px;border-radius:10px;overflow:hidden;margin-bottom:16px;
      background:var(--beige);display:flex;align-items:center;justify-content:center;
      color:var(--muted);font-size:12px;position:relative;
    }
    .nf-cover-preview img { width:100%;height:100%;object-fit:cover; }
    .nf-upload-progress {
      position:absolute;inset:0;background:rgba(0,0,0,0.65);
      display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;
      color:#fff;font-size:12px;
    }
    .nf-progress-bar  { width:70%;height:4px;background:rgba(255,255,255,0.2);border-radius:4px;overflow:hidden; }
    .nf-progress-fill { height:100%;background:#D4567A;border-radius:4px;transition:width .3s; }

    .nf-cover-btns { display:flex;gap:8px;flex-wrap:wrap; }
    .nf-cover-save   { flex:1;min-width:80px;padding:10px;border-radius:9px;background:#7A1A2A;color:#fff;border:none;cursor:pointer;font-size:12px;font-weight:500; }
    .nf-cover-save:disabled { opacity:.5;cursor:not-allowed; }
    .nf-cover-remove { padding:10px 14px;border-radius:9px;background:var(--beige);color:var(--muted);border:1px solid var(--border);cursor:pointer;font-size:12px; }
    .nf-cover-cancel { padding:10px 14px;border-radius:9px;background:transparent;color:var(--muted);border:1px solid var(--border);cursor:pointer;font-size:12px; }

    /* ── DRAG & DROP ── */
    .nf-card.nf-dragging{opacity:.3;transform:scale(0.93)!important;box-shadow:none!important;}
    .nf-card.nf-drag-over{outline:2px solid rgba(255,214,186,0.7);outline-offset:3px;}
    html:not(.dark) .nf-card.nf-drag-over{outline-color:rgba(140,114,52,0.7);}

    /* ── NOVO CARD ── */
    .nf-new-card{border:2px dashed rgba(255,214,186,0.22)!important;background:transparent!important;}
    .nf-new-card .nf-card-bg{background:#080808!important;}
    html:not(.dark) .nf-new-card .nf-card-bg{background:#ede8dc!important;}
    html:not(.dark) .nf-new-card{border-color:rgba(140,114,52,0.28)!important;}
    .nf-new-card .nf-card-icon{font-size:30px;opacity:.35;}
    .nf-new-card .nf-card-label{opacity:.45;}
    .nf-new-card:hover{border-color:rgba(255,214,186,0.55)!important;}
    html:not(.dark) .nf-new-card:hover{border-color:rgba(140,114,52,0.55)!important;}

    /* ── MODAL CARD CUSTOMIZADO ── */
    .nf-custom-box{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:28px;width:100%;max-width:520px;box-shadow:0 24px 64px rgba(0,0,0,0.6);max-height:88vh;overflow-y:auto;}
    .nf-custom-box h3{font-size:15px;color:var(--brown);margin-bottom:18px;font-weight:500;}
    .nfc-row{display:flex;gap:8px;}
    .nfc-input{width:100%;padding:9px 12px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:12px;margin-bottom:10px;box-sizing:border-box;font-family:inherit;resize:vertical;}
    .nfc-input:focus{outline:none;border-color:var(--brown);}
    .nfc-stitle{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin:10px 0 8px;}
    .nfc-check-row,.nfc-link-row{display:flex;align-items:center;gap:6px;margin-bottom:6px;}
    .nfc-check-row input[type=checkbox]{flex-shrink:0;}
    .nfc-flex{flex:1;margin-bottom:0!important;}
    .nfc-del{background:none;border:none;color:var(--muted);cursor:pointer;font-size:14px;padding:4px;flex-shrink:0;}
    .nfc-del:hover{color:#C62828;}
    .nfc-add{background:none;border:1px dashed var(--border);border-radius:7px;color:var(--muted);font-size:11px;padding:6px 14px;cursor:pointer;width:100%;margin-bottom:12px;}
    .nfc-add:hover{border-color:var(--brown);color:var(--text);}
    .nfc-tog{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--muted);margin-top:4px;cursor:pointer;}

    /* ── CUSTOM CARD VIEW ── */
    .ncv-header{min-height:200px;background:linear-gradient(145deg,#1a0a05,#3a1810);background-size:cover;background-position:center;position:relative;overflow:hidden;}
    .ncv-header-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.18) 100%);display:flex;flex-direction:column;justify-content:flex-end;padding:24px 28px;}
    .ncv-top-acts{position:absolute;top:14px;right:14px;display:flex;gap:7px;}
    .ncv-btn{padding:6px 13px;border-radius:8px;border:1px solid rgba(255,255,255,0.18);background:rgba(0,0,0,0.45);color:#fff;font-size:11px;cursor:pointer;backdrop-filter:blur(4px);}
    .ncv-btn:hover{background:rgba(0,0,0,0.7);}
    .ncv-danger:hover{border-color:#C62828;color:#ff6b6b;}
    .ncv-icon{font-size:26px;margin-bottom:4px;}
    .ncv-title{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:400;color:#ffd6ba;margin:0 0 4px;}
    html:not(.dark) .ncv-title{color:#fff;}
    .ncv-sub{font-size:11px;color:rgba(255,214,186,0.55);margin-bottom:6px;}
    .ncv-meta{display:flex;gap:14px;font-size:11px;color:rgba(255,214,186,0.45);}
    .ncv-body{padding:24px 28px;}
    .ncv-sec{margin-bottom:22px;}
    .ncv-sec-title{font-size:10px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:var(--muted);margin-bottom:10px;display:flex;align-items:center;gap:8px;}
    .ncv-sec-title::after{content:'';flex:1;height:1px;background:var(--border);}
    .ncv-notes{font-size:13px;color:var(--text);line-height:1.7;white-space:pre-wrap;}
    .ncv-chk{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);cursor:pointer;font-size:13px;color:var(--text);}
    .ncv-chk.done span{text-decoration:line-through;color:var(--muted);}
    .ncv-chk input{accent-color:var(--brown);cursor:pointer;}
    .ncv-link{display:flex;align-items:center;gap:8px;padding:9px 13px;border-radius:9px;background:var(--beige);border:1px solid var(--border);color:var(--text);text-decoration:none;font-size:12px;margin-bottom:8px;transition:all .2s;}
    .ncv-link:hover{border-color:var(--brown);color:var(--brown);}

    /* Responsive */
    @media(max-width:600px){
      .nf-grid { grid-template-columns:repeat(2,1fr);gap:10px; }
      .nf-hero  { padding:24px 18px 20px;border-radius:0 0 16px 16px; }
      .nf-section { padding:0 14px; }
      #nf-admin-back { bottom:16px;left:16px;font-size:11px;padding:9px 14px; }
    }
    @media(min-width:900px){
      .nf-grid { grid-template-columns:repeat(auto-fill,minmax(165px,1fr)); }
    }
    @media(min-width:1200px){
      .nf-grid { grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); }
    }
  `;

  // ── COVER STORAGE (localStorage + Supabase sync) ─────────────────────
  const INDEX_PATH = 'module-covers/index.json';

  function getCovers(){ try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch{return{}} }

  async function persistIndex(covers){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(covers));
    try{
      const blob = new Blob([JSON.stringify(covers)],{type:'application/json'});
      await db.storage.from(BUCKET).upload(INDEX_PATH, blob, {upsert:true, contentType:'application/json'});
    }catch(e){ /* silently ignore — localStorage already saved */ }
  }

  function saveCover(id,url){ const c=getCovers();c[id]=url;persistIndex(c); }
  function removeCover(id){ const c=getCovers();delete c[id];persistIndex(c); }

  async function loadRemoteCovers(){
    try{
      const {data,error}=await db.storage.from(BUCKET).download(INDEX_PATH);
      if(error||!data)return;
      const text=await data.text();
      const remote=JSON.parse(text);
      const local=getCovers();
      const merged={...local,...remote};
      localStorage.setItem(STORAGE_KEY,JSON.stringify(merged));
    }catch(e){}
  }

  // ── CUSTOM CARDS STORAGE ─────────────────────────────────────────────
  async function loadCustomCards(){
    try{
      const{data,error}=await db.storage.from(BUCKET).download(CUSTOM_PATH);
      if(!error&&data){_customCards=JSON.parse(await data.text());localStorage.setItem(CUSTOM_KEY,JSON.stringify(_customCards));return;}
    }catch(e){}
    try{_customCards=JSON.parse(localStorage.getItem(CUSTOM_KEY)||'[]');}catch(e){_customCards=[];}
  }
  async function persistCustomCards(){
    localStorage.setItem(CUSTOM_KEY,JSON.stringify(_customCards));
    try{const blob=new Blob([JSON.stringify(_customCards)],{type:'application/json'});await db.storage.from(BUCKET).upload(CUSTOM_PATH,blob,{upsert:true,contentType:'application/json'});}catch(e){}
  }

  // ── CARD ORDER STORAGE ───────────────────────────────────────────────
  async function loadOrder(){
    try{
      const{data,error}=await db.storage.from(BUCKET).download(ORDER_PATH);
      if(!error&&data){_savedOrder=JSON.parse(await data.text());localStorage.setItem(ORDER_KEY,JSON.stringify(_savedOrder));return;}
    }catch(e){}
    try{_savedOrder=JSON.parse(localStorage.getItem(ORDER_KEY)||'{}');}catch(e){_savedOrder={};}
  }
  async function persistOrder(){
    localStorage.setItem(ORDER_KEY,JSON.stringify(_savedOrder));
    try{const blob=new Blob([JSON.stringify(_savedOrder)],{type:'application/json'});await db.storage.from(BUCKET).upload(ORDER_PATH,blob,{upsert:true,contentType:'application/json'});}catch(e){}
  }
  function applySavedOrder(sections,type){
    const order=_savedOrder[type];if(!order)return sections;
    return sections.map(sec=>{
      const saved=order[sec.title];if(!saved)return sec;
      const reordered=saved.filter(id=>sec.ids.includes(id));
      const newIds=sec.ids.filter(id=>!saved.includes(id));
      return{...sec,ids:[...reordered,...newIds]};
    });
  }

  // ── DRAG & DROP ──────────────────────────────────────────────────────
  function enableDragDrop(container,type){
    let dragSrc=null;
    container.querySelectorAll('.nf-card:not(.nf-new-card)').forEach(card=>{
      card.setAttribute('draggable','true');
      card.addEventListener('dragstart',e=>{dragSrc=card;card.classList.add('nf-dragging');e.dataTransfer.effectAllowed='move';});
      card.addEventListener('dragend',()=>{dragSrc=null;container.querySelectorAll('.nf-card').forEach(c=>c.classList.remove('nf-dragging','nf-drag-over'));});
      card.addEventListener('dragover',e=>{e.preventDefault();if(card!==dragSrc)card.classList.add('nf-drag-over');});
      card.addEventListener('dragleave',()=>card.classList.remove('nf-drag-over'));
      card.addEventListener('drop',e=>{
        e.preventDefault();e.stopPropagation();
        card.classList.remove('nf-drag-over');
        if(!dragSrc||dragSrc===card)return;
        const sg=dragSrc.closest('.nf-grid');const tg=card.closest('.nf-grid');
        if(!sg||!tg)return;
        if(sg===tg){
          const cards=[...sg.children];const si=cards.indexOf(dragSrc);const ti=cards.indexOf(card);
          if(si<ti)sg.insertBefore(dragSrc,card.nextSibling);else sg.insertBefore(dragSrc,card);
        }else{tg.insertBefore(dragSrc,card);}
        saveGridOrder(container,type);
      });
    });
  }
  function saveGridOrder(container,type){
    const order={};
    container.querySelectorAll('.nf-section').forEach(sec=>{
      const title=sec.querySelector('.nf-section-title')?.childNodes[0]?.textContent?.trim();
      if(title)order[title]=[...sec.querySelectorAll('.nf-card')].map(c=>c.dataset.id).filter(Boolean);
    });
    _savedOrder[type]=order;persistOrder();
  }

  // ── CUSTOM CARD VIEW ─────────────────────────────────────────────────
  function renderCustomModuleView(cardId){
    const card=_customCards.find(c=>c.id===cardId);
    if(!card)return;
    const el=document.getElementById('admin-main');if(!el)return;
    const cover=getCovers()[cardId]||card.cover||'';
    el.innerHTML=`<div>
      <div class="ncv-header" ${cover?`style="background-image:url('${cover}')"`:''}><div class="ncv-header-overlay">
        <div class="ncv-top-acts">
          <button class="ncv-btn" onclick="NFModule._editCustomCard('${cardId}')">✏ Editar</button>
          <button class="ncv-btn ncv-danger" onclick="NFModule._deleteCustomCard('${cardId}')">✕ Excluir</button>
        </div>
        <div class="ncv-icon">${card.icon||'✦'}</div>
        <h1 class="ncv-title">${card.label}</h1>
        ${card.desc?`<div class="ncv-sub">${card.desc}</div>`:''}
        <div class="ncv-meta">${card.client?`<span>👤 ${card.client}</span>`:''}${card.prazo?`<span>📅 ${new Date(card.prazo+'T12:00').toLocaleDateString('pt-BR')}</span>`:''}</div>
      </div></div>
      <div class="ncv-body">
        ${card.notes?`<div class="ncv-sec"><div class="ncv-sec-title">Anotações</div><div class="ncv-notes">${card.notes.replace(/</g,'&lt;').replace(/\n/g,'<br>')}</div></div>`:''}
        ${(card.checklist||[]).length?`<div class="ncv-sec"><div class="ncv-sec-title">Checklist</div>${card.checklist.map((it,i)=>`<label class="ncv-chk${it.done?' done':''}"><input type="checkbox"${it.done?' checked':''} onchange="NFModule._toggleCheck('${cardId}',${i},this.checked)"><span>${it.text}</span></label>`).join('')}</div>`:''}
        ${(card.links||[]).length?`<div class="ncv-sec"><div class="ncv-sec-title">Links</div>${card.links.map(lk=>`<a href="${lk.url}" target="_blank" class="ncv-link">🔗 ${lk.label||lk.url}</a>`).join('')}</div>`:''}
      </div>
    </div>`;
  }

  // ── MODAL CARD CUSTOMIZADO ────────────────────────────────────────────
  function openCustomCardModal(existing,isAdmin,onSave){
    const card=existing||{id:'custom_'+Date.now()+'_'+Math.random().toString(36).substr(2,4),label:'',icon:'✦',desc:'',cover:'',notes:'',checklist:[],links:[],client:'',prazo:'',isAdmin};
    document.getElementById('nf-custom-modal')?.remove();
    const m=document.createElement('div');m.id='nf-custom-modal';m.className='nf-cover-modal';
    m.innerHTML=`<div class="nf-custom-box">
      <h3>${existing?'Editar Card':'Novo Card Personalizado'}</h3>
      <div class="nfc-row" style="margin-bottom:0">
        <input class="nfc-input" id="nfc-icon" value="${card.icon}" placeholder="🔥" style="width:58px;flex-shrink:0;text-align:center;font-size:18px">
        <input class="nfc-input" id="nfc-label" value="${card.label}" placeholder="Nome do card *" style="flex:1">
      </div>
      <input class="nfc-input" id="nfc-desc" value="${card.desc}" placeholder="Descrição curta">
      <input class="nfc-input" id="nfc-cover" value="${card.cover}" placeholder="URL da capa (ou use ✎ Capa no card depois)">
      <textarea class="nfc-input" id="nfc-notes" rows="3" placeholder="Anotações, observações...">${card.notes||''}</textarea>

      <div class="nfc-stitle">Checklist</div>
      <div id="nfc-checklist">${(card.checklist||[]).map((it,i)=>`<div class="nfc-check-row"><input type="checkbox"${it.done?' checked':''}><input class="nfc-input nfc-flex" value="${it.text}" placeholder="Item..." data-ci="${i}"><button class="nfc-del" onclick="this.closest('.nfc-check-row').remove()">✕</button></div>`).join('')}</div>
      <button class="nfc-add" onclick="NFModule._addCheck()">+ Adicionar item</button>

      <div class="nfc-stitle">Links & Arquivos</div>
      <div id="nfc-links">${(card.links||[]).map((lk,i)=>`<div class="nfc-link-row"><input class="nfc-input nfc-flex" value="${lk.label}" placeholder="Nome" data-ll="${i}"><input class="nfc-input nfc-flex" value="${lk.url}" placeholder="URL / Link" data-lu="${i}"><button class="nfc-del" onclick="this.closest('.nfc-link-row').remove()">✕</button></div>`).join('')}</div>
      <button class="nfc-add" onclick="NFModule._addLink()">+ Adicionar link</button>

      <div class="nfc-row" style="margin-bottom:0">
        <input class="nfc-input" id="nfc-client" value="${card.client||''}" placeholder="Email ou nome do cliente" style="flex:1">
        <input class="nfc-input" type="date" id="nfc-prazo" value="${card.prazo||''}" style="width:145px;flex-shrink:0">
      </div>
      <label class="nfc-tog"><input type="checkbox" id="nfc-is-admin"${isAdmin?' checked':''}> Painel admin (desmarcado = portal cliente)</label>

      <div class="nf-cover-btns" style="margin-top:18px">
        <button class="nf-cover-save" onclick="NFModule._saveCustomCard('${card.id}')">Salvar</button>
        ${existing?`<button class="nf-cover-remove" onclick="NFModule._deleteCustomCard('${existing.id}')">Excluir</button>`:''}
        <button class="nf-cover-cancel" onclick="document.getElementById('nf-custom-modal').remove()">Cancelar</button>
      </div>
    </div>`;
    document.body.appendChild(m);
    m.addEventListener('click',e=>{if(e.target===m)m.remove();});
    window._nfCustomCard=card;window._nfCustomOnSave=onSave;
  }

  // ── UPLOAD SUPABASE STORAGE ──────────────────────────────────────────
  async function uploadCover(file, moduleId){
    const ext  = file.name.split('.').pop().toLowerCase()||'jpg';
    const path = `${COVER_FOLDER}/${moduleId}_${Date.now()}.${ext}`;
    const { error } = await db.storage.from(BUCKET).upload(path, file, { upsert:true, contentType:file.type });
    if(error) throw error;
    const { data } = db.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  // ── MODAL DE CAPA ────────────────────────────────────────────────────
  function openCoverModal(mod, onSave){
    const current = getCovers()[mod.id]||'';
    const modal = document.createElement('div');
    modal.className='nf-cover-modal'; modal.id='nf-cover-modal';
    modal.innerHTML=`
      <div class="nf-cover-box">
        <h3>Capa — ${mod.label}</h3>
        <div class="nf-drop-zone" id="nf-drop-zone">
          <input type="file" id="nf-file-input" accept="image/*">
          <div class="nf-drop-icon">🖼️</div>
          <div class="nf-drop-text"><strong>Clique ou arraste</strong> uma imagem aqui</div>
          <div class="nf-drop-text" style="font-size:10px;margin-top:4px;opacity:.6">JPG · PNG · WEBP · até 5MB</div>
        </div>
        <div class="nf-or">ou cole uma URL</div>
        <input type="text" id="nf-cover-url" class="nf-cover-url-input" placeholder="https://..." value="${current}">
        <div class="nf-cover-preview" id="nf-cover-prev">
          ${current?`<img src="${current}" onerror="this.parentElement.innerHTML='Imagem inválida'">`:' Prévia aqui'}
        </div>
        <div class="nf-cover-btns">
          <button class="nf-cover-save" id="nf-save-btn" onclick="NFModule._saveCover('${mod.id}')">Salvar</button>
          <button class="nf-cover-remove" onclick="NFModule._removeCover('${mod.id}')">Remover</button>
          <button class="nf-cover-cancel" onclick="NFModule._closeModal()">Cancelar</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click',e=>{if(e.target===modal)NFModule._closeModal();});

    const dz=document.getElementById('nf-drop-zone');
    dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('drag-over');});
    dz.addEventListener('dragleave',()=>dz.classList.remove('drag-over'));
    dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('drag-over');const f=e.dataTransfer.files[0];if(f)handleFile(f,mod.id);});
    document.getElementById('nf-file-input').addEventListener('change',e=>{const f=e.target.files[0];if(f)handleFile(f,mod.id);});
    document.getElementById('nf-cover-url').addEventListener('input',e=>{
      const url=e.target.value.trim();
      const prev=document.getElementById('nf-cover-prev');
      prev.innerHTML=url?`<img src="${url}" onerror="this.parentElement.innerHTML='Inválida'">`:' Prévia aqui';
    });
    window._nfOnSave=onSave; window._nfCurrentModule=mod.id;
  }

  async function handleFile(file,moduleId){
    if(file.size>5*1024*1024){alert('Máximo 5MB.');return;}
    const prev=document.getElementById('nf-cover-prev');
    const saveBtn=document.getElementById('nf-save-btn');
    const reader=new FileReader();
    reader.onload=e=>{
      prev.innerHTML=`<img src="${e.target.result}"><div class="nf-upload-progress" id="nf-upload-prog"><div>⏳ Enviando...</div><div class="nf-progress-bar"><div class="nf-progress-fill" id="nf-prog-fill" style="width:10%"></div></div></div>`;
    };
    reader.readAsDataURL(file);
    saveBtn.disabled=true;
    try{
      let pct=10;
      const timer=setInterval(()=>{pct=Math.min(pct+15,85);const f=document.getElementById('nf-prog-fill');if(f)f.style.width=pct+'%';},300);
      const url=await uploadCover(file,moduleId);
      clearInterval(timer);
      document.getElementById('nf-upload-prog')?.remove();
      document.getElementById('nf-cover-url').value=url;
      saveCover(moduleId,url);
      saveBtn.disabled=false;
      NFModule._closeModal();
      if(window._nfOnSave)window._nfOnSave();
    }catch(err){
      document.getElementById('nf-upload-prog')?.remove();
      saveBtn.disabled=false;
      alert('Erro no upload: '+(err.message||err));
    }
  }

  // ── RENDER CARD ──────────────────────────────────────────────────────
  function renderCard(mod, isAdmin, badge){
    const cover=getCovers()[mod.id];
    const bgStyle=cover
      ?`background-image:url('${cover}');background-size:cover;background-position:center;`
      :`${mod.gradient};`;
    const editBtn=`<div class="nf-card-edit" data-edit="${mod.id}">✎ Capa</div>`;
    const badgeHtml=badge?`<div class="nf-card-badge">${badge}</div>`:'';
    return `<div class="nf-card" data-id="${mod.id}" data-admin="${isAdmin}">
      <div class="nf-card-bg" style="${bgStyle}"></div>
      <div class="nf-card-overlay"></div>
      ${editBtn}${badgeHtml}
      <div class="nf-card-body">
        <span class="nf-card-icon">${mod.icon}</span>
        <span class="nf-card-label">${mod.label}</span>
        <span class="nf-card-desc">${mod.desc}</span>
      </div>
    </div>`;
  }

  // ── ATTACH CARD LISTENERS ────────────────────────────────────────────
  function attachCardListeners(container){
    container.querySelectorAll('.nf-card').forEach(card=>{
      card.addEventListener('click', e=>{
        if(e.target.closest('[data-edit]')){
          const isAdminCard=card.dataset.admin==='true';
          _openEdit(e.target.closest('[data-edit]').dataset.edit, isAdminCard?'admin':'client');
          return;
        }
        if(card.dataset.new){
          const isAdminCard=card.dataset.admin==='true';
          openCustomCardModal(null,isAdminCard,()=>isAdminCard?renderAdminGrid():renderClientGrid());
          return;
        }
        const id=card.dataset.id;
        const isAdmin=card.dataset.admin==='true';
        if(id&&id.startsWith('custom_')){
          renderCustomModuleView(id);_hideGrid(isAdmin?'admin':'client');return;
        }
        if(isAdmin){ Admin.tab(id); _hideGrid('admin'); }
        else { Client.clientTab(id); _hideGrid('client'); }
      });
    });
  }

  // ── RENDER ADMIN GRID ────────────────────────────────────────────────
  async function renderAdminGrid(){
    const el=document.getElementById('admin-main');
    if(!el)return;
    hideAdminBack();
    try{history.replaceState({crm:'grid'},'');}catch(e){}
    await Promise.all([loadRemoteCovers(),loadCustomCards(),loadOrder()]);

    let badges={};
    try{
      const[dm,ch]=await Promise.all([
        db.from('demandas').select('status').not('status','in','("concluida","concluído","done")'),
        db.from('mensagens').select('id').eq('de','client').eq('lida',false)
      ]);
      if((dm.data||[]).length)badges['demandas']=(dm.data).length;
      if((ch.data||[]).length)badges['chat']=(ch.data).length;
    }catch(e){}

    const orderedSections=applySavedOrder(ADMIN_SECTIONS,'admin');
    const customAdmin=_customCards.filter(c=>c.isAdmin!==false);
    const newCardHtml=`<div class="nf-card nf-new-card" data-new="1" data-admin="true"><div class="nf-card-bg"></div><div class="nf-card-overlay"></div><div class="nf-card-body" style="text-align:center;padding-bottom:20px"><span class="nf-card-icon">+</span><span class="nf-card-label">Novo Card</span><span class="nf-card-desc">Criar módulo personalizado</span></div></div>`;

    el.innerHTML=`<div class="nf-home">
      <div class="nf-hero">
        <div class="nf-hero-title">Painel Agência Primor</div>
        <div class="nf-hero-sub">Selecione um módulo para começar · Arraste para reordenar</div>
      </div>
      ${orderedSections.map(sec=>{
        const mods=ADMIN_MODULES.filter(m=>sec.ids.includes(m.id));
        if(!mods.length)return'';
        const ordered=sec.ids.map(id=>mods.find(m=>m.id===id)).filter(Boolean);
        return`<div class="nf-section"><div class="nf-section-title">${sec.title}</div><div class="nf-grid">${ordered.map(m=>renderCard(m,true,badges[m.id])).join('')}</div></div>`;
      }).join('')}
      <div class="nf-section"><div class="nf-section-title">Personalizados</div><div class="nf-grid">${customAdmin.map(c=>renderCard({id:c.id,icon:c.icon||'✦',label:c.label,desc:c.desc||'',gradient:'linear-gradient(145deg,#1a1008,#3a2010,#8B5E3C)'},true)).join('')}${newCardHtml}</div></div>
    </div>`;
    attachCardListeners(el);
    enableDragDrop(el,'admin');
  }

  // ── RENDER CLIENT GRID ───────────────────────────────────────────────
  async function renderClientGrid(){
    const wrap=document.getElementById('nf-client-home');
    if(!wrap)return;
    await Promise.all([loadRemoteCovers(),loadCustomCards(),loadOrder()]);

    let badges={};
    try{
      const[sol,ch]=await Promise.all([
        db.from('solicitacoes').select('status').eq('status','pendente'),
        db.from('mensagens').select('id').eq('de','admin').eq('lida',false)
      ]);
      if((sol.data||[]).length)badges['solicitacoes']=(sol.data).length;
      if((ch.data||[]).length)badges['chat']=(ch.data).length;
    }catch(e){}

    const clientSections=applySavedOrder([
      {title:'Para começar',  ids:['comece','onboarding','brand','posts','chat','solicitacoes']},
      {title:'Recursos',      ids:['arquivos','info','financeiro','tarefas','ideias']},
    ],'client');

    const customClient=_customCards.filter(c=>c.isAdmin===false);
    const newCardHtml=`<div class="nf-card nf-new-card" data-new="1" data-admin="false"><div class="nf-card-bg"></div><div class="nf-card-overlay"></div><div class="nf-card-body" style="text-align:center;padding-bottom:20px"><span class="nf-card-icon">+</span><span class="nf-card-label">Novo Card</span><span class="nf-card-desc">Criar módulo personalizado</span></div></div>`;

    wrap.innerHTML=`<div class="nf-home">
      <div class="nf-hero">
        <div class="nf-hero-title">Seu portal</div>
        <div class="nf-hero-sub">O que vamos ver hoje? · Arraste para reordenar</div>
      </div>
      ${clientSections.map(sec=>{
        const mods=CLIENT_MODULES.filter(m=>sec.ids.includes(m.id));
        if(!mods.length)return'';
        const ordered=sec.ids.map(id=>mods.find(m=>m.id===id)).filter(Boolean);
        return`<div class="nf-section"><div class="nf-section-title">${sec.title}</div><div class="nf-grid">${ordered.map(m=>renderCard(m,false,badges[m.id])).join('')}</div></div>`;
      }).join('')}
      <div class="nf-section"><div class="nf-section-title">Personalizados</div><div class="nf-grid">${customClient.map(c=>renderCard({id:c.id,icon:c.icon||'✦',label:c.label,desc:c.desc||'',gradient:'linear-gradient(145deg,#1a1008,#3a2010,#8B5E3C)'},false)).join('')}${newCardHtml}</div></div>
    </div>`;
    wrap.classList.remove('hidden');
    attachCardListeners(wrap);
    enableDragDrop(wrap,'client');
  }

  // ── BOTÃO HOME FLUTUANTE ─────────────────────────────────────────────
  function ensureAdminBack(){
    if(document.getElementById('nf-admin-back'))return;
    const btn=document.createElement('button');
    btn.id='nf-admin-back';
    btn.innerHTML='<span class="nf-back-arrow">←</span> Voltar';
    btn.onclick=()=>{Admin.loader&&Admin.loader(true);renderAdminGrid().then(()=>Admin.loader&&Admin.loader(false));};
    // Inject before header-right inside app-header
    const headerRight=document.querySelector('#admin-view .header-right');
    if(headerRight) headerRight.prepend(btn);
    else document.body.appendChild(btn);
  }
  function showAdminBack(){ensureAdminBack();const b=document.getElementById('nf-admin-back');if(b)b.style.display='inline-flex';}
  function hideAdminBack(){const b=document.getElementById('nf-admin-back');if(b)b.style.display='none';}

  // ── SHOW / HIDE ──────────────────────────────────────────────────────
  function _hideGrid(type){
    if(type==='admin'){
      showAdminBack();
    } else {
      document.getElementById('nf-client-home')?.classList.add('hidden');
      const main=document.querySelector('.client-main');
      const hdr=document.querySelector('.client-header-row');
      if(main)main.style.display='';
      if(hdr)hdr.style.display='';
      const ex=document.getElementById('nf-back-btn-client');
      if(!ex){
        const btn=document.createElement('div');
        btn.id='nf-back-btn-client';btn.className='nf-back-btn';
        btn.innerHTML='← Voltar ao início';btn.onclick=()=>showClientGrid();
        document.querySelector('.client-main')?.prepend(btn);
      } else ex.style.display='inline-flex';
    }
  }

  function showClientGrid(){
    renderClientGrid();
    const main=document.querySelector('.client-main');
    const hdr=document.querySelector('.client-header-row');
    const back=document.getElementById('nf-back-btn-client');
    if(main)main.style.display='none';
    if(hdr)hdr.style.display='none';
    if(back)back.style.display='none';
    document.querySelectorAll('.client-tab').forEach(t=>t.classList.remove('active'));
  }

  // ── EDIT COVER ───────────────────────────────────────────────────────
  function _openEdit(id,type){
    const mods=type==='admin'?ADMIN_MODULES:CLIENT_MODULES;
    const mod=mods.find(m=>m.id===id);
    if(!mod)return;
    openCoverModal(mod,()=>type==='admin'?renderAdminGrid():renderClientGrid());
  }

  // ── INJEÇÃO ADMIN ────────────────────────────────────────────────────
  function injectAdmin(){
    if(typeof Admin==='undefined'||typeof db==='undefined'){setTimeout(injectAdmin,200);return;}
    if(!Admin._nfPatched){
      Admin._nfPatched=true;
      const orig=Admin.tab.bind(Admin);
      Admin.tab=async function(name,...args){
        try{history.pushState({crm:'tab',tab:name},'');}catch(e){}
        showAdminBack();
        return orig(name,...args);
      };
      // Browser back/forward dentro do SPA
      if(!window._nfPopstate){
        window._nfPopstate=true;
        window.addEventListener('popstate',function(e){
          const adminVisible=document.getElementById('admin-view')&&!document.getElementById('admin-view').classList.contains('hidden');
          if(!adminVisible)return;
          if(!e.state||e.state.crm==='grid'){
            renderAdminGrid();
          } else if(e.state.crm==='tab'){
            // já está no tab certo, só garante botão visível
            showAdminBack();
          }
        });
      }
    }
    // Logo admin clicável → grid
    const logoEl=document.getElementById('admin-header-logo');
    if(logoEl&&!logoEl._nfClick){
      logoEl._nfClick=true;
      logoEl.style.cursor='pointer';
      logoEl.addEventListener('click',()=>renderAdminGrid());
    }
    // index.html já chama NFModule.refresh() no login — isso é só fallback
    window.NFModule.refresh=function(){
      const el=document.getElementById('admin-main');
      const visible=document.getElementById('admin-view')&&!document.getElementById('admin-view').classList.contains('hidden');
      if(el&&visible) renderAdminGrid();
      renderClientGrid();
    };
  }

  // ── INJEÇÃO CLIENTE ──────────────────────────────────────────────────
  function injectClient(){
    if(typeof Client==='undefined'){setTimeout(injectClient,200);return;}
    if(!document.getElementById('nf-client-home')){
      const div=document.createElement('div');
      div.id='nf-client-home';div.className='hidden';
      document.querySelector('.client-main')?.parentNode.insertBefore(div,document.querySelector('.client-main'));
    }
    if(!Client._nfPatched){
      Client._nfPatched=true;
      const origLoad=Client.load.bind(Client);
      Client.load=async function(...args){await origLoad(...args);setTimeout(()=>showClientGrid(),300);};
    }
    if(!Client._nfTabPatched){
      Client._nfTabPatched=true;
      const origTab=Client.clientTab.bind(Client);
      Client.clientTab=function(name,...args){_hideGrid('client');return origTab(name,...args);};
    }
  }

  // ── INIT ─────────────────────────────────────────────────────────────
  function init(){
    if(!document.getElementById('nf-css')){
      const s=document.createElement('style');s.id='nf-css';s.textContent=CSS;document.head.appendChild(s);
    }
    injectAdmin();
    injectClient();
  }

  // ── API PÚBLICA ──────────────────────────────────────────────────────
  window.NFModule={
    _openEdit,_hideGrid,
    _saveCover(id){
      const url=document.getElementById('nf-cover-url')?.value.trim();
      if(url)saveCover(id,url);
      NFModule._closeModal();
      if(window._nfOnSave)window._nfOnSave();
    },
    _removeCover(id){removeCover(id);NFModule._closeModal();if(window._nfOnSave)window._nfOnSave();},
    _closeModal(){document.getElementById('nf-cover-modal')?.remove();},
    refresh(){renderAdminGrid();renderClientGrid();},

    // ── Custom Cards ─────────────────────────────────────────────────
    _addCheck(){
      const box=document.getElementById('nfc-checklist');if(!box)return;
      const div=document.createElement('div');div.className='nfc-check-row';
      div.innerHTML='<input type="checkbox"><input class="nfc-input nfc-flex" placeholder="Item..."><button class="nfc-del" onclick="this.closest(\'.nfc-check-row\').remove()">✕</button>';
      box.appendChild(div);div.querySelector('input.nfc-flex').focus();
    },
    _addLink(){
      const box=document.getElementById('nfc-links');if(!box)return;
      const div=document.createElement('div');div.className='nfc-link-row';
      div.innerHTML='<input class="nfc-input nfc-flex" placeholder="Nome"><input class="nfc-input nfc-flex" placeholder="URL / Link"><button class="nfc-del" onclick="this.closest(\'.nfc-link-row\').remove()">✕</button>';
      box.appendChild(div);div.querySelector('input').focus();
    },
    _saveCustomCard(id){
      const label=document.getElementById('nfc-label')?.value.trim();
      if(!label){alert('Digite um nome para o card.');return;}
      const checklist=[...document.querySelectorAll('#nfc-checklist .nfc-check-row')].map(row=>({
        text:row.querySelector('input.nfc-flex')?.value.trim()||'',
        done:row.querySelector('input[type=checkbox]')?.checked||false
      })).filter(it=>it.text);
      const links=[...document.querySelectorAll('#nfc-links .nfc-link-row')].map(row=>{
        const inputs=row.querySelectorAll('input.nfc-flex');
        return{label:inputs[0]?.value.trim()||'',url:inputs[1]?.value.trim()||''};
      }).filter(lk=>lk.url);
      const isAdmin=document.getElementById('nfc-is-admin')?.checked!==false;
      const card={
        ...(window._nfCustomCard||{}),id,label,
        icon:document.getElementById('nfc-icon')?.value.trim()||'✦',
        desc:document.getElementById('nfc-desc')?.value.trim()||'',
        cover:document.getElementById('nfc-cover')?.value.trim()||'',
        notes:document.getElementById('nfc-notes')?.value||'',
        checklist,links,
        client:document.getElementById('nfc-client')?.value.trim()||'',
        prazo:document.getElementById('nfc-prazo')?.value||'',
        isAdmin
      };
      const idx=_customCards.findIndex(c=>c.id===id);
      if(idx>=0)_customCards[idx]=card;else _customCards.push(card);
      if(card.cover)saveCover(id,card.cover);
      persistCustomCards();
      document.getElementById('nf-custom-modal')?.remove();
      if(window._nfCustomOnSave)window._nfCustomOnSave();
      else{isAdmin?renderAdminGrid():renderClientGrid();}
    },
    _editCustomCard(id){
      const card=_customCards.find(c=>c.id===id);if(!card)return;
      openCustomCardModal(card,card.isAdmin!==false,()=>card.isAdmin!==false?renderAdminGrid():renderClientGrid());
    },
    _deleteCustomCard(id){
      if(!confirm('Excluir este card?'))return;
      const card=_customCards.find(c=>c.id===id);
      _customCards=_customCards.filter(c=>c.id!==id);
      removeCover(id);
      persistCustomCards();
      document.getElementById('nf-custom-modal')?.remove();
      card&&card.isAdmin!==false?renderAdminGrid():renderClientGrid();
    },
    _toggleCheck(cardId,idx,done){
      const card=_customCards.find(c=>c.id===cardId);
      if(card&&card.checklist[idx]!==undefined){card.checklist[idx].done=done;persistCustomCards();}
      // update label class
      const label=document.querySelectorAll('.ncv-chk')[idx];
      if(label)label.classList.toggle('done',done);
    },
  };

  if(document.readyState!=='loading')init();
  else document.addEventListener('DOMContentLoaded',init);
  setTimeout(init,600);
})();
