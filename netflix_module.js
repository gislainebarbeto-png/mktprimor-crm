// ───────────────────────────────────────────────────────────────────────
// NETFLIX MODULE — Agência Primor CRM
// Grid visual estilo Netflix · Sem sidebar · Upload de capa
// ───────────────────────────────────────────────────────────────────────
(function(){
  'use strict';

  const STORAGE_KEY  = 'primor_module_covers';
  const BUCKET       = 'posts-media';
  const COVER_FOLDER = 'module-covers';

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
  ];

  // ── SEÇÕES ADMIN ─────────────────────────────────────────────────────
  const ADMIN_SECTIONS = [
    { title:'Visão Geral',       ids:['inicio'] },
    { title:'Conteúdo',          ids:['posts','automacoes','comece'] },
    { title:'Clientes & Gestão', ids:['clientes','financeiro','arquivos','info'] },
    { title:'Equipe',            ids:['demandas','tarefas','solicitacoes','chat','relatorio'] },
    { title:'Estratégia & IA',   ids:['lab','comercial','agentes'] },
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

    /* ── BOTÃO HOME FLUTUANTE ── */
    #nf-admin-back {
      position:fixed;bottom:24px;left:24px;z-index:1000;
      display:none;align-items:center;gap:8px;
      background:#1A1A1A;border:1px solid rgba(255,255,255,0.12);
      color:#F2F0F2;font-size:12px;font-weight:500;
      padding:10px 18px;border-radius:30px;cursor:pointer;
      box-shadow:0 4px 20px rgba(0,0,0,0.6);transition:all .2s;
    }
    #nf-admin-back:hover { background:#2a2a2a;border-color:rgba(255,255,255,0.25);transform:translateY(-2px); }

    /* ── NETFLIX GRID ── */
    .nf-home { padding:0;animation:nfIn .4s ease; }
    @keyframes nfIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }

    .nf-hero {
      background:linear-gradient(135deg,#111 0%,#1a1a2a 60%,#111 100%);
      padding:32px 28px 24px;margin-bottom:24px;
      border-radius:0 0 20px 20px;position:relative;overflow:hidden;
    }
    .nf-hero::before {
      content:'';position:absolute;inset:0;
      background:radial-gradient(ellipse at 70% 50%,rgba(212,86,122,0.12),transparent 60%);
    }
    .nf-hero-title { font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:400;color:#FAF8F2;position:relative;margin-bottom:4px; }
    .nf-hero-sub   { font-size:11px;color:rgba(250,248,242,0.45);letter-spacing:.12em;text-transform:uppercase;position:relative; }

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

    .nf-card-bg { position:absolute;inset:0;background-size:cover;background-position:center;transition:transform .4s; }
    .nf-card:hover .nf-card-bg { transform:scale(1.07); }
    .nf-card-overlay { position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.18) 55%,transparent 100%); }

    .nf-card-body   { position:absolute;bottom:0;left:0;right:0;padding:12px 12px 14px; }
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
      position:absolute;top:8px;left:8px;
      background:rgba(0,0,0,0.65);backdrop-filter:blur(4px);
      border:1px solid rgba(255,255,255,0.15);color:#fff;
      font-size:10px;padding:4px 8px;border-radius:8px;
      cursor:pointer;opacity:0;transition:opacity .2s;
      display:flex;align-items:center;gap:4px;
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

  // ── COVER STORAGE ────────────────────────────────────────────────────
  function getCovers(){ try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch{return{}} }
  function saveCover(id,url){ const c=getCovers();c[id]=url;localStorage.setItem(STORAGE_KEY,JSON.stringify(c)); }
  function removeCover(id){ const c=getCovers();delete c[id];localStorage.setItem(STORAGE_KEY,JSON.stringify(c)); }

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
    const editBtn=isAdmin
      ?`<div class="nf-card-edit" onclick="event.stopPropagation();NFModule._openEdit('${mod.id}','admin')">✎ Capa</div>`:'';
    const badgeHtml=badge?`<div class="nf-card-badge">${badge}</div>`:'';
    const clickFn=isAdmin
      ?`Admin.tab('${mod.id}');NFModule._hideGrid('admin')`
      :`Client.clientTab('${mod.id}');NFModule._hideGrid('client')`;
    return `<div class="nf-card" onclick="${clickFn}">
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

  // ── RENDER ADMIN GRID ────────────────────────────────────────────────
  async function renderAdminGrid(){
    const el=document.getElementById('admin-main');
    if(!el)return;
    hideAdminBack();

    let badges={};
    try{
      const[dm,ch]=await Promise.all([
        db.from('demandas').select('status').not('status','in','("concluida","concluído","done")'),
        db.from('mensagens').select('id').eq('de','client').eq('lida',false)
      ]);
      if((dm.data||[]).length)badges['demandas']=(dm.data).length;
      if((ch.data||[]).length)badges['chat']=(ch.data).length;
    }catch(e){}

    el.innerHTML=`<div class="nf-home">
      <div class="nf-hero">
        <div class="nf-hero-title">Painel Agência Primor</div>
        <div class="nf-hero-sub">Selecione um módulo para começar</div>
      </div>
      ${ADMIN_SECTIONS.map(sec=>{
        const mods=ADMIN_MODULES.filter(m=>sec.ids.includes(m.id));
        return mods.length?`<div class="nf-section">
          <div class="nf-section-title">${sec.title}</div>
          <div class="nf-grid">${mods.map(m=>renderCard(m,true,badges[m.id])).join('')}</div>
        </div>`:'';
      }).join('')}
    </div>`;
  }

  // ── RENDER CLIENT GRID ───────────────────────────────────────────────
  async function renderClientGrid(){
    const wrap=document.getElementById('nf-client-home');
    if(!wrap)return;

    let badges={};
    try{
      const[sol,ch]=await Promise.all([
        db.from('solicitacoes').select('status').eq('status','pendente'),
        db.from('mensagens').select('id').eq('de','admin').eq('lida',false)
      ]);
      if((sol.data||[]).length)badges['solicitacoes']=(sol.data).length;
      if((ch.data||[]).length)badges['chat']=(ch.data).length;
    }catch(e){}

    const sections=[
      {title:'Conteúdo',      ids:['posts','brand','ideias']},
      {title:'Relacionamento',ids:['chat','solicitacoes']},
      {title:'Recursos',      ids:['arquivos','info','financeiro','tarefas']},
      {title:'Boas-vindas',   ids:['comece']},
    ];

    wrap.innerHTML=`<div class="nf-home">
      <div class="nf-hero">
        <div class="nf-hero-title">Seu portal</div>
        <div class="nf-hero-sub">O que vamos ver hoje?</div>
      </div>
      ${sections.map(sec=>{
        const mods=CLIENT_MODULES.filter(m=>sec.ids.includes(m.id));
        return mods.length?`<div class="nf-section">
          <div class="nf-section-title">${sec.title}</div>
          <div class="nf-grid">${mods.map(m=>renderCard(m,false,badges[m.id])).join('')}</div>
        </div>`:'';
      }).join('')}
    </div>`;
    wrap.classList.remove('hidden');
  }

  // ── BOTÃO HOME FLUTUANTE ─────────────────────────────────────────────
  function ensureAdminBack(){
    if(document.getElementById('nf-admin-back'))return;
    const btn=document.createElement('div');
    btn.id='nf-admin-back';btn.innerHTML='⊟ Home';
    btn.onclick=()=>{Admin.loader&&Admin.loader(true);renderAdminGrid().then(()=>Admin.loader&&Admin.loader(false));};
    document.body.appendChild(btn);
  }
  function showAdminBack(){ensureAdminBack();document.getElementById('nf-admin-back').style.display='inline-flex';}
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
      // Intercepta tab() para mostrar botão Home
      const orig=Admin.tab.bind(Admin);
      Admin.tab=async function(name,...args){ showAdminBack(); return orig(name,...args); };
      // Intercepta App.route para abrir o grid em vez da última aba salva
      if(typeof App!=='undefined' && App.route && !App._nfRoutePatched){
        App._nfRoutePatched=true;
        const origRoute=App.route.bind(App);
        App.route=async function(...args){
          const result=await origRoute(...args);
          setTimeout(()=>{
            const el=document.getElementById('admin-main');
            const visible=document.getElementById('admin-view')&&!document.getElementById('admin-view').classList.contains('hidden');
            if(el&&visible) renderAdminGrid();
          },200);
          return result;
        };
      }
    }
    // Fallback: abre grid se admin-main estiver vazio ou com placeholder
    setTimeout(()=>{
      const el=document.getElementById('admin-main');
      const visible=document.getElementById('admin-view')&&!document.getElementById('admin-view').classList.contains('hidden');
      if(el&&visible) renderAdminGrid();
    },750);
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
    refresh(){renderAdminGrid();renderClientGrid();}
  };

  if(document.readyState!=='loading')init();
  else document.addEventListener('DOMContentLoaded',init);
  setTimeout(init,600);
})();
