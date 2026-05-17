// ───────────────────────────────────────────────────────────────────────
// NETFLIX MODULE — Agência Primor CRM
// Grid visual estilo Netflix para Admin e Portal do Cliente
// ───────────────────────────────────────────────────────────────────────
(function(){
  'use strict';

  const STORAGE_KEY = 'primor_module_covers';

  // ── MÓDULOS ADMIN ────────────────────────────────────────────────────
  const ADMIN_MODULES = [
    {
      id:'posts', icon:'▦', label:'Posts',
      desc:'Calendário e gestão de conteúdo',
      gradient:'linear-gradient(145deg,#1a0830 0%,#4a1060 60%,#8B2FC9 100%)'
    },
    {
      id:'clientes', icon:'◎', label:'Clientes',
      desc:'Contas e portais dos clientes',
      gradient:'linear-gradient(145deg,#0a1628 0%,#1a3a6a 60%,#2E6FD4 100%)'
    },
    {
      id:'financeiro', icon:'◈', label:'Financeiro',
      desc:'Cobranças, vencimentos e status',
      gradient:'linear-gradient(145deg,#0d1f0d 0%,#1a4a1a 60%,#2E8B57 100%)'
    },
    {
      id:'demandas', icon:'⊞', label:'Demandas',
      desc:'Briefings e demandas da equipe',
      gradient:'linear-gradient(145deg,#1f0d0d 0%,#5a1a1a 60%,#C0392B 100%)'
    },
    {
      id:'tarefas', icon:'✓', label:'Tarefas',
      desc:'Projetos e kanban da equipe',
      gradient:'linear-gradient(145deg,#0d1a1f 0%,#1a4a5a 60%,#1A8FA0 100%)'
    },
    {
      id:'arquivos', icon:'▤', label:'Arquivos',
      desc:'Arquivos e links por cliente',
      gradient:'linear-gradient(145deg,#1a1408 0%,#4a3a10 60%,#B8860B 100%)'
    },
    {
      id:'automacoes', icon:'✵', label:'Automações',
      desc:'Posts agendados para automação',
      gradient:'linear-gradient(145deg,#0d0d1f 0%,#1a1a5a 60%,#4040C0 100%)'
    },
    {
      id:'comece', icon:'✦', label:'Comece Aqui',
      desc:'Onboarding e boas-vindas',
      gradient:'linear-gradient(145deg,#1f1408 0%,#5a3a10 60%,#D4567A 100%)'
    },
    {
      id:'lab', icon:'⊙', label:'Ideias',
      desc:'Banco de ideias e brainstorm',
      gradient:'linear-gradient(145deg,#0d1a0d 0%,#2a4a10 60%,#6B8E23 100%)'
    },
    {
      id:'info', icon:'≡', label:'Informações',
      desc:'Documentos e informações',
      gradient:'linear-gradient(145deg,#1a0d18 0%,#4a1a45 60%,#8B3A8B 100%)'
    },
    {
      id:'solicitacoes', icon:'◫', label:'Solicitações',
      desc:'Pedidos e ajustes dos clientes',
      gradient:'linear-gradient(145deg,#1a1008 0%,#4a2a08 60%,#D4567A 100%)'
    },
    {
      id:'chat', icon:'◷', label:'Chat',
      desc:'Mensagens com os clientes',
      gradient:'linear-gradient(145deg,#081a1a 0%,#104040 60%,#1A8FA0 100%)'
    },
    {
      id:'relatorio', icon:'📝', label:'Diário',
      desc:'Relatório diário da equipe',
      gradient:'linear-gradient(145deg,#1a1218 0%,#3a2040 60%,#7A1A2A 100%)'
    },
  ];

  // ── MÓDULOS CLIENTE ──────────────────────────────────────────────────
  const CLIENT_MODULES = [
    {
      id:'posts', icon:'▦', label:'Posts',
      desc:'Seus conteúdos e aprovações',
      gradient:'linear-gradient(145deg,#1a0830 0%,#4a1060 60%,#8B2FC9 100%)'
    },
    {
      id:'comece', icon:'✦', label:'Início',
      desc:'Boas-vindas e onboarding',
      gradient:'linear-gradient(145deg,#1f1408 0%,#5a3a10 60%,#D4567A 100%)'
    },
    {
      id:'arquivos', icon:'▤', label:'Arquivos',
      desc:'Arquivos e links compartilhados',
      gradient:'linear-gradient(145deg,#1a1408 0%,#4a3a10 60%,#B8860B 100%)'
    },
    {
      id:'ideias', icon:'⊙', label:'Ideias',
      desc:'Banco de ideias da sua marca',
      gradient:'linear-gradient(145deg,#0d1a0d 0%,#2a4a10 60%,#6B8E23 100%)'
    },
    {
      id:'info', icon:'≡', label:'Informações',
      desc:'Documentos e informações',
      gradient:'linear-gradient(145deg,#1a0d18 0%,#4a1a45 60%,#8B3A8B 100%)'
    },
    {
      id:'solicitacoes', icon:'◫', label:'Solicitações',
      desc:'Abra pedidos e ajustes',
      gradient:'linear-gradient(145deg,#1a1008 0%,#4a2a08 60%,#D4567A 100%)'
    },
    {
      id:'tarefas', icon:'✓', label:'Tarefas',
      desc:'Projetos em andamento',
      gradient:'linear-gradient(145deg,#0d1a1f 0%,#1a4a5a 60%,#1A8FA0 100%)'
    },
    {
      id:'chat', icon:'◷', label:'Chat',
      desc:'Fale com a equipe',
      gradient:'linear-gradient(145deg,#081a1a 0%,#104040 60%,#1A8FA0 100%)'
    },
    {
      id:'brand', icon:'✦', label:'Brand Core',
      desc:'Identidade e estratégia da marca',
      gradient:'linear-gradient(145deg,#1a0810 0%,#4a1028 60%,#7A1A2A 100%)'
    },
    {
      id:'financeiro', icon:'◈', label:'Financeiro',
      desc:'Cobranças e pagamentos',
      gradient:'linear-gradient(145deg,#0d1f0d 0%,#1a4a1a 60%,#2E8B57 100%)'
    },
  ];

  // ── CSS ──────────────────────────────────────────────────────────────
  const CSS = `
    /* NETFLIX GRID HOME */
    .nf-home{padding:0;animation:nfIn .4s ease;}
    @keyframes nfIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}

    .nf-hero{
      background:linear-gradient(135deg,#1c0e09 0%,#3a1020 60%,#1c0e09 100%);
      padding:32px 28px 24px;
      margin-bottom:24px;
      border-radius:0 0 20px 20px;
      position:relative;
      overflow:hidden;
    }
    .nf-hero::before{
      content:'';position:absolute;inset:0;
      background:radial-gradient(ellipse at 70% 50%,rgba(212,86,122,0.15),transparent 60%);
    }
    .nf-hero-title{
      font-family:'Cormorant Garamond',serif;
      font-size:28px;font-weight:400;color:#FAF8F2;
      position:relative;margin-bottom:4px;
    }
    .nf-hero-sub{font-size:11px;color:rgba(250,248,242,0.5);letter-spacing:.12em;text-transform:uppercase;position:relative;}

    .nf-section{margin-bottom:28px;padding:0 20px;}
    .nf-section-title{
      font-size:10px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
      color:var(--muted);margin-bottom:14px;display:flex;align-items:center;gap:10px;
    }
    .nf-section-title::after{content:'';flex:1;height:1px;background:var(--border);}

    .nf-grid{
      display:grid;
      grid-template-columns:repeat(auto-fill,minmax(150px,1fr));
      gap:12px;
    }

    /* CARD */
    .nf-card{
      border-radius:14px;overflow:hidden;cursor:pointer;
      position:relative;aspect-ratio:3/4;
      transition:transform .25s,box-shadow .25s;
      box-shadow:0 4px 16px rgba(0,0,0,0.3);
    }
    .nf-card:hover{transform:translateY(-6px) scale(1.02);box-shadow:0 12px 32px rgba(0,0,0,0.5);}
    .nf-card:active{transform:scale(0.97);}

    .nf-card-bg{
      position:absolute;inset:0;
      background-size:cover;background-position:center;
      transition:transform .4s;
    }
    .nf-card:hover .nf-card-bg{transform:scale(1.06);}

    .nf-card-overlay{
      position:absolute;inset:0;
      background:linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.2) 50%,transparent 100%);
    }

    .nf-card-body{
      position:absolute;bottom:0;left:0;right:0;
      padding:12px 12px 14px;
    }
    .nf-card-icon{font-size:22px;margin-bottom:6px;display:block;opacity:0.9;}
    .nf-card-label{
      font-size:13px;font-weight:500;color:#fff;
      display:block;line-height:1.2;margin-bottom:3px;
    }
    .nf-card-desc{font-size:9.5px;color:rgba(255,255,255,0.55);line-height:1.4;display:block;}

    .nf-card-badge{
      position:absolute;top:10px;right:10px;
      background:#C62828;color:#fff;
      font-size:9px;font-weight:600;padding:3px 7px;border-radius:20px;
      animation:fadeIn .3s;
    }

    /* EDIT COVER BUTTON */
    .nf-card-edit{
      position:absolute;top:8px;left:8px;
      background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);
      border:1px solid rgba(255,255,255,0.15);
      color:#fff;font-size:10px;padding:4px 8px;border-radius:8px;
      cursor:pointer;opacity:0;transition:opacity .2s;
      display:flex;align-items:center;gap:4px;
    }
    .nf-card:hover .nf-card-edit{opacity:1;}

    /* BACK BUTTON */
    .nf-back-btn{
      display:inline-flex;align-items:center;gap:6px;
      background:var(--surface);border:1px solid var(--border);
      color:var(--text);font-size:11px;padding:7px 14px;border-radius:20px;
      cursor:pointer;margin:16px 20px 0;transition:all .2s;
    }
    .nf-back-btn:hover{background:var(--beige);border-color:var(--brown);}

    /* MODAL DE CAPA */
    .nf-cover-modal{
      position:fixed;inset:0;z-index:9999;
      background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);
      display:flex;align-items:center;justify-content:center;
      animation:fadeIn .2s;
    }
    .nf-cover-box{
      background:var(--surface);border:1px solid var(--border);
      border-radius:16px;padding:28px;width:100%;max-width:420px;
      box-shadow:0 24px 64px rgba(0,0,0,0.5);
    }
    .nf-cover-box h3{font-size:15px;color:var(--brown);margin-bottom:16px;font-weight:500;}
    .nf-cover-box input{
      width:100%;padding:10px 14px;border-radius:9px;
      border:1px solid var(--border);background:var(--bg);
      color:var(--text);font-size:12px;margin-bottom:12px;box-sizing:border-box;
    }
    .nf-cover-preview{
      width:100%;height:140px;border-radius:10px;overflow:hidden;margin-bottom:16px;
      background:var(--beige);display:flex;align-items:center;justify-content:center;
      color:var(--muted);font-size:12px;
    }
    .nf-cover-preview img{width:100%;height:100%;object-fit:cover;}
    .nf-cover-btns{display:flex;gap:8px;}
    .nf-cover-save{flex:1;padding:10px;border-radius:9px;background:var(--brown,#7A1A2A);color:#fff;border:none;cursor:pointer;font-size:12px;font-weight:500;}
    .nf-cover-remove{padding:10px 14px;border-radius:9px;background:var(--beige);color:var(--muted);border:1px solid var(--border);cursor:pointer;font-size:12px;}
    .nf-cover-cancel{padding:10px 14px;border-radius:9px;background:transparent;color:var(--muted);border:1px solid var(--border);cursor:pointer;font-size:12px;}

    /* Responsive */
    @media(max-width:600px){
      .nf-grid{grid-template-columns:repeat(2,1fr);gap:10px;}
      .nf-hero{padding:24px 18px 20px;border-radius:0 0 16px 16px;}
      .nf-section{padding:0 14px;}
    }
    @media(min-width:900px){
      .nf-grid{grid-template-columns:repeat(auto-fill,minmax(170px,1fr));}
    }
  `;

  // ── COVER STORAGE (localStorage) ────────────────────────────────────
  function getCovers(){
    try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');}catch{return{};}
  }
  function saveCover(id, url){
    const c=getCovers(); c[id]=url;
    localStorage.setItem(STORAGE_KEY,JSON.stringify(c));
  }
  function removeCover(id){
    const c=getCovers(); delete c[id];
    localStorage.setItem(STORAGE_KEY,JSON.stringify(c));
  }

  // ── MODAL DE CAPA ────────────────────────────────────────────────────
  function openCoverModal(module, onSave){
    const covers=getCovers();
    const current=covers[module.id]||'';

    const modal=document.createElement('div');
    modal.className='nf-cover-modal';
    modal.id='nf-cover-modal';
    modal.innerHTML=`
      <div class="nf-cover-box">
        <h3>Capa: ${module.label}</h3>
        <input type="text" id="nf-cover-url" placeholder="Cole a URL da imagem..." value="${current}">
        <div class="nf-cover-preview" id="nf-cover-prev">
          ${current?`<img src="${current}" onerror="this.parentElement.innerHTML='URL inválida'">`:' Prévia aparece aqui'}
        </div>
        <div class="nf-cover-btns">
          <button class="nf-cover-save" onclick="NFModule._saveCover('${module.id}')">Salvar</button>
          <button class="nf-cover-remove" onclick="NFModule._removeCover('${module.id}')">Remover</button>
          <button class="nf-cover-cancel" onclick="NFModule._closeModal()">Cancelar</button>
        </div>
      </div>`;

    document.body.appendChild(modal);
    modal.addEventListener('click',e=>{if(e.target===modal)NFModule._closeModal();});

    const inp=document.getElementById('nf-cover-url');
    inp.addEventListener('input',()=>{
      const url=inp.value.trim();
      const prev=document.getElementById('nf-cover-prev');
      if(url){prev.innerHTML=`<img src="${url}" onerror="this.parentElement.innerHTML='URL inválida'">`;}
      else{prev.innerHTML='Prévia aparece aqui';}
    });

    window._nfOnSave=onSave;
    window._nfCurrentModule=module.id;
  }

  // ── RENDER CARD ──────────────────────────────────────────────────────
  function renderCard(mod, isAdmin, badge){
    const covers=getCovers();
    const cover=covers[mod.id];
    const bgStyle=cover
      ?`background-image:url('${cover}');background-size:cover;background-position:center;`
      :`${mod.gradient};`;

    const editBtn=isAdmin
      ?`<div class="nf-card-edit" onclick="event.stopPropagation();NFModule._openEdit('${mod.id}','${isAdmin?'admin':'client'}')">✎ Capa</div>`
      :'';

    const badgeHtml=badge
      ?`<div class="nf-card-badge">${badge}</div>`:'';

    const clickFn=isAdmin
      ?`Admin.tab('${mod.id}');NFModule._hideGrid('admin')`
      :isAdmin===false
        ?`Client.clientTab('${mod.id}');NFModule._hideGrid('client')`
        :`Admin.tab('${mod.id}');NFModule._hideGrid('admin')`;

    return `<div class="nf-card" onclick="${clickFn}">
      <div class="nf-card-bg" style="${bgStyle}"></div>
      <div class="nf-card-overlay"></div>
      ${editBtn}
      ${badgeHtml}
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

    // Busca badges (pendentes)
    let badges={};
    try{
      const[dm,ch]=await Promise.all([
        db.from('demandas').select('status').not('status','in','("concluida","concluído","done")'),
        db.from('mensagens').select('id').eq('de','client').eq('lida',false)
      ]);
      const pend=(dm.data||[]).length;
      const msg=(ch.data||[]).length;
      if(pend>0)badges['demandas']=pend;
      if(msg>0)badges['chat']=msg;
    }catch(e){}

    // Seções
    const sections=[
      {title:'Conteúdo',ids:['posts','automacoes','comece']},
      {title:'Clientes & Gestão',ids:['clientes','financeiro','arquivos','info']},
      {title:'Equipe',ids:['demandas','tarefas','solicitacoes','chat','relatorio']},
      {title:'Estratégia',ids:['lab']},
    ];

    el.innerHTML=`<div class="nf-home">
      <div class="nf-hero">
        <div class="nf-hero-title">Painel Agência Primor</div>
        <div class="nf-hero-sub">Selecione um módulo para começar</div>
      </div>
      ${sections.map(sec=>{
        const mods=ADMIN_MODULES.filter(m=>sec.ids.includes(m.id));
        if(!mods.length)return'';
        return`<div class="nf-section">
          <div class="nf-section-title">${sec.title}</div>
          <div class="nf-grid">
            ${mods.map(m=>renderCard(m,true,badges[m.id])).join('')}
          </div>
        </div>`;
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
      const s=(sol.data||[]).length;
      const m=(ch.data||[]).length;
      if(s>0)badges['solicitacoes']=s;
      if(m>0)badges['chat']=m;
    }catch(e){}

    const sections=[
      {title:'Conteúdo',ids:['posts','brand','ideias']},
      {title:'Relacionamento',ids:['chat','solicitacoes']},
      {title:'Recursos',ids:['arquivos','info','financeiro','tarefas']},
      {title:'Boas-vindas',ids:['comece']},
    ];

    wrap.innerHTML=`<div class="nf-home">
      <div class="nf-hero">
        <div class="nf-hero-title">Seu portal</div>
        <div class="nf-hero-sub">O que vamos ver hoje?</div>
      </div>
      ${sections.map(sec=>{
        const mods=CLIENT_MODULES.filter(m=>sec.ids.includes(m.id));
        if(!mods.length)return'';
        return`<div class="nf-section">
          <div class="nf-section-title">${sec.title}</div>
          <div class="nf-grid">
            ${mods.map(m=>renderCard(m,false,badges[m.id])).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>`;
    wrap.classList.remove('hidden');
  }

  // ── SHOW / HIDE GRID ─────────────────────────────────────────────────
  function showAdminGrid(){
    // Desativa todos os nav-items
    document.querySelectorAll('.nav-item').forEach(el=>el.classList.remove('active'));
    document.getElementById('nav-nf-home')?.classList.add('active');
    renderAdminGrid();
  }

  function _hideGrid(type){
    if(type==='client'){
      const home=document.getElementById('nf-client-home');
      if(home)home.classList.add('hidden');
      const main=document.querySelector('.client-main');
      if(main)main.style.display='';
      const header=document.querySelector('.client-header-row');
      if(header)header.style.display='';
      // Botão voltar
      if(!document.getElementById('nf-back-btn-client')){
        const btn=document.createElement('div');
        btn.id='nf-back-btn-client';
        btn.className='nf-back-btn';
        btn.innerHTML='← Voltar ao início';
        btn.onclick=()=>showClientGrid();
        const main2=document.querySelector('.client-main');
        if(main2)main2.insertBefore(btn,main2.firstChild);
      } else {
        document.getElementById('nf-back-btn-client').style.display='inline-flex';
      }
    }
  }

  function showClientGrid(){
    const home=document.getElementById('nf-client-home');
    const main=document.querySelector('.client-main');
    const header=document.querySelector('.client-header-row');
    const backBtn=document.getElementById('nf-back-btn-client');
    if(home){home.classList.remove('hidden');renderClientGrid();}
    if(main)main.style.display='none';
    if(header)header.style.display='none';
    if(backBtn)backBtn.style.display='none';
    // Remove active de todas as abas
    document.querySelectorAll('.client-tab').forEach(t=>t.classList.remove('active'));
  }

  // ── EDIT COVER ───────────────────────────────────────────────────────
  function _openEdit(id, type){
    const mods=type==='admin'?ADMIN_MODULES:CLIENT_MODULES;
    const mod=mods.find(m=>m.id===id);
    if(!mod)return;
    openCoverModal(mod, ()=>{
      if(type==='admin')renderAdminGrid();
      else renderClientGrid();
    });
  }

  // ── INJEÇÃO ADMIN ────────────────────────────────────────────────────
  function injectAdmin(){
    if(typeof Admin==='undefined'||typeof db==='undefined'){
      setTimeout(injectAdmin,200);return;
    }

    // Nav item "Home" no topo do sidebar
    const sidebar=document.getElementById('admin-sidebar');
    if(sidebar&&!document.getElementById('nav-nf-home')){
      const item=document.createElement('div');
      item.className='nav-item active';
      item.id='nav-nf-home';
      item.title='Home';
      item.innerHTML='<span class="ni">⊟</span><span class="nl">Home</span>';
      item.onclick=()=>{
        document.querySelectorAll('.nav-item').forEach(el=>el.classList.remove('active'));
        item.classList.add('active');
        if(typeof Admin!=='undefined'){
          Admin.loader&&Admin.loader(true);
          renderAdminGrid().then(()=>Admin.loader&&Admin.loader(false));
        }
      };
      const firstItem=sidebar.querySelector('.nav-item');
      if(firstItem)sidebar.insertBefore(item,firstItem);
      else sidebar.appendChild(item);
    }

    // Patch Admin.tab para desativar nav-nf-home quando vai para outra aba
    if(!Admin._nfPatched){
      Admin._nfPatched=true;
      const orig=Admin.tab.bind(Admin);
      Admin.tab=async function(name,...args){
        document.getElementById('nav-nf-home')?.classList.remove('active');
        return orig(name,...args);
      };
    }

    // Mostra grid na abertura
    setTimeout(()=>{
      const adminMain=document.getElementById('admin-main');
      if(adminMain&&(!adminMain.innerHTML||adminMain.innerHTML.trim()==='<!-- conteúdo injetado aqui -->'||adminMain.innerHTML.trim()===''))
        renderAdminGrid();
    },400);
  }

  // ── INJEÇÃO CLIENTE ──────────────────────────────────────────────────
  function injectClient(){
    if(typeof Client==='undefined'){setTimeout(injectClient,200);return;}

    // Cria div do home grid antes do client-main
    const clientMain=document.querySelector('.client-main');
    if(!clientMain||document.getElementById('nf-client-home'))return;

    const homeDiv=document.createElement('div');
    homeDiv.id='nf-client-home';
    homeDiv.className='hidden';
    clientMain.parentNode.insertBefore(homeDiv,clientMain);

    // Patch Client.load para mostrar grid
    if(!Client._nfPatched){
      Client._nfPatched=true;
      const origLoad=Client.load.bind(Client);
      Client.load=async function(...args){
        await origLoad(...args);
        // Após carregar, mostra o grid
        setTimeout(()=>showClientGrid(),300);
      };
    }

    // Patch Client.clientTab para esconder grid
    if(!Client._nfTabPatched){
      Client._nfTabPatched=true;
      const origTab=Client.clientTab.bind(Client);
      Client.clientTab=function(name,...args){
        _hideGrid('client');
        return origTab(name,...args);
      };
    }
  }

  // ── INIT ─────────────────────────────────────────────────────────────
  function init(){
    // CSS
    if(!document.getElementById('nf-css')){
      const s=document.createElement('style');
      s.id='nf-css';s.textContent=CSS;
      document.head.appendChild(s);
    }
    injectAdmin();
    injectClient();
  }

  // ── API PÚBLICA ──────────────────────────────────────────────────────
  window.NFModule={
    _openEdit,
    _hideGrid,
    _saveCover(id){
      const url=document.getElementById('nf-cover-url')?.value.trim();
      if(url){saveCover(id,url);}
      NFModule._closeModal();
      if(window._nfOnSave)window._nfOnSave();
    },
    _removeCover(id){
      removeCover(id);
      NFModule._closeModal();
      if(window._nfOnSave)window._nfOnSave();
    },
    _closeModal(){
      document.getElementById('nf-cover-modal')?.remove();
    },
    refresh(){
      renderAdminGrid();
      renderClientGrid();
    }
  };

  // Aguarda DOM
  if(document.readyState!=='loading')init();
  else document.addEventListener('DOMContentLoaded',init);
  setTimeout(init,600);
})();
