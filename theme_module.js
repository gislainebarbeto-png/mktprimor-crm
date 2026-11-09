// ───────────────────────────────────────────────────────────────────────
// THEME MODULE — Marketing Primor CRM
// Identidade visual do site marketingprimor.com.br
//   Paleta: creme #f5f0ea · vinho #390d10 / #63121a · caramelo #c99f77 · rosé #e3a3ab
//   Fontes: Anton (títulos) · Silvex Editorial (itálico de destaque)
//           abeatbyKai (texto) · Give You Glory (script / manuscrito)
// Tema Claro:  Creme + Vinho   |   Tema Escuro: Vinho profundo + Creme/Caramelo
// ───────────────────────────────────────────────────────────────────────
(function(){
  'use strict';

  // Fontes da biblioteca do site copiadas para /fonts (mesma origem, evita bloqueio CORS)
  const F = 'fonts/';
  const GF = 'https://fonts.gstatic.com/s/';
  const ANTON = `url(${GF}anton/v27/1Ptgg87LROyAm3Kz-C8.woff2) format('woff2'),url(${GF}anton/v27/1Ptgg87LROyAm3K9-C8QSw.woff2) format('woff2')`;
  const GLORY = `url(${GF}giveyouglory/v17/8QIQdiHOgt3vv4LR7ahjw9-XYf10DYc.woff2) format('woff2'),url(${GF}giveyouglory/v17/8QIQdiHOgt3vv4LR7ahjw9-XYf16DYdz6g.woff2) format('woff2')`;
  const KAI = `url(${F}abeatbyKaiRegular.otf) format('opentype')`;
  const SILVEX = `url(${F}SilvexEditorial-Thin.otf) format('opentype')`;
  const SILVEX_I = `url(${F}SilvexEditorial-ThinItalic.otf) format('opentype')`;

  // Os nomes antigos (Poppins, Montserrat, Great Vibes, Cormorant) viram "apelidos"
  // das fontes da marca — assim todos os estilos inline dos módulos já herdam a identidade nova.
  const face=(fam,src,style)=>`@font-face{font-family:"${fam}";src:${src};font-weight:100 900;font-style:${style||'normal'};font-display:swap;}`;
  const FONTS = [
    face('Anton',ANTON), face('Give You Glory',GLORY),
    face('abeatbyKai',KAI), face('Silvex Editorial',SILVEX), face('Silvex Editorial',SILVEX_I,'italic'),
    face('Poppins',KAI), face('Poppins',KAI,'italic'),
    face('Montserrat',ANTON),
    face('Great Vibes',GLORY),
    face('Cormorant Garamond',SILVEX), face('Cormorant Garamond',SILVEX_I,'italic'),
  ].join('\n');

  const TYPE=`
    :root{
      --f-display:"Anton",Impact,sans-serif;
      --f-serif:"Silvex Editorial",Georgia,serif;
      --f-text:"abeatbyKai",system-ui,sans-serif;
      --f-script:"Give You Glory",cursive;
    }
    body,button,input,textarea,select{font-family:var(--f-text)!important;font-weight:400!important;letter-spacing:.01em;}
    h1,h2,h3,
    [style*="Cormorant Garamond"]:not([style*="italic"]),
    [style*="Montserrat"]{
      font-family:var(--f-display)!important;font-weight:400!important;
      letter-spacing:.02em!important;text-transform:uppercase;
    }
    h1 em,h2 em,h3 em,h1 i,h2 i,h3 i,.pm-accent{
      font-family:var(--f-serif)!important;font-style:italic!important;
      text-transform:none!important;letter-spacing:0!important;color:var(--rose)!important;
    }
    [style*="Great Vibes"],[style*="Cormorant Garamond"][style*="italic"],
    .welcome-banner h3,.gi-msg-text,.ajuste-box h3,.stars-box h3,.cb-name,.idea-titulo,
    .cal-title,.cpa-title,.cb-empty,.cb-post-ph,.client-avatar,.k-img-ph,.post-side-empty,
    .cp-ph,.col-av,.cb-av,#loader p{
      font-family:var(--f-script)!important;font-weight:400!important;font-style:normal!important;
      text-transform:none!important;letter-spacing:.01em!important;
    }
    code,pre,[style*="monospace"]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace!important;}
  `;

  const LIGHT=`
    html:not(.dark){
      --bg:#f5f0ea;
      --surface:#fffdf9;
      --beige:#efe5d9;
      --brown:#63121a;
      --brown2:#390d10;
      --copper:#c99f77;
      --text:#390d10;
      --muted:#8d6d5a;
      --border:rgba(57,13,16,0.14);
      --r:14px;
      --sh:0 4px 20px rgba(57,13,16,0.07);
      --sh2:0 14px 44px rgba(57,13,16,0.14);
      --wine:#63121a;
      --rose:#b86a7b;
      --rose-light:#f3d3d8;
      --sidebar-bg:#390d10;
      --sidebar-text:#f5f0ea;
      --sidebar-muted:rgba(245,240,234,0.55);
      --sidebar-active:rgba(201,159,119,0.18);
      --sidebar-active-text:#e2be9b;
      --accent:#63121a;
      --accent2:#c99f77;
    }
    html:not(.dark) body,html:not(.dark) #admin-view,html:not(.dark) .admin-main,html:not(.dark) .client-main{background:#f5f0ea!important;}
    html:not(.dark) #client-view{--brown:#390d10;--brown2:#63121a;--copper:#c99f77;}
    html:not(.dark) .nav-item{color:var(--sidebar-muted)!important;}
    html:not(.dark) .nav-item .ni{color:inherit!important;}
    html:not(.dark) .nav-item:hover{background:rgba(245,240,234,0.08)!important;color:#f5f0ea!important;}
    html:not(.dark) .nav-item.active{background:var(--sidebar-active)!important;color:var(--sidebar-active-text)!important;box-shadow:inset 2px 0 0 #c99f77;}
    html:not(.dark) #admin-sidebar,html:not(.dark) aside{background:var(--sidebar-bg)!important;color:var(--sidebar-text)!important;border-color:rgba(201,159,119,0.2)!important;}
    html:not(.dark) #admin-sidebar h1,html:not(.dark) #admin-sidebar h2,html:not(.dark) #admin-sidebar h3,
    html:not(.dark) aside h1,html:not(.dark) aside h2,html:not(.dark) aside h3{color:#f5f0ea!important;}
    html:not(.dark) .app-header{background:rgba(245,240,234,0.92)!important;backdrop-filter:blur(8px);border-bottom:1px solid rgba(57,13,16,0.1)!important;}
    html:not(.dark) .login-box{background:#fffdf9!important;border:1px solid rgba(201,159,119,0.35)!important;}
    html:not(.dark) .table-wrap,html:not(.dark) .modal-box,html:not(.dark) [class*="modal-box"]{background:#fffdf9!important;border-color:rgba(57,13,16,0.12)!important;}
    html:not(.dark) input,html:not(.dark) textarea,html:not(.dark) select{
      background:#fbf7f1!important;border-color:rgba(57,13,16,0.16)!important;color:#390d10!important;
    }
    html:not(.dark) input:focus,html:not(.dark) textarea:focus,html:not(.dark) select:focus{border-color:#c99f77!important;box-shadow:0 0 0 3px rgba(201,159,119,0.18)!important;}
    html:not(.dark) input::placeholder,html:not(.dark) textarea::placeholder{color:rgba(57,13,16,0.35)!important;}
    html:not(.dark) .btn,html:not(.dark) button[class*="btn"],html:not(.dark) .save-btn,html:not(.dark) .primary-btn,
    html:not(.dark) .aw2-btn,html:not(.dark) .fsc-btn{
      background:#63121a!important;color:#f5f0ea!important;border-color:#63121a!important;
    }
    html:not(.dark) .btn:hover,html:not(.dark) button[class*="btn"]:hover,html:not(.dark) .save-btn:hover{background:#390d10!important;}
    html:not(.dark) h1,html:not(.dark) h2,html:not(.dark) h3{color:#390d10;}
    html:not(.dark) ::-webkit-scrollbar-thumb{background:#c99f77!important;}
    html:not(.dark) #loader{background:rgba(245,240,234,.9)!important;}
    html:not(.dark) #loader p{color:#63121a!important;}
  `;

  const DARK=`
    html.dark{
      --bg:#1c0a0c;
      --surface:#2a0f12;
      --beige:#34151a;
      --brown:#e2be9b;
      --brown2:#c99f77;
      --copper:#c99f77;
      --text:#f5f0ea;
      --muted:rgba(245,240,234,0.55);
      --border:rgba(201,159,119,0.18);
      --r:14px;
      --sh:0 4px 24px rgba(0,0,0,0.5);
      --sh2:0 14px 48px rgba(0,0,0,0.65);
      --wine:#63121a;
      --rose:#e3a3ab;
      --rose-light:#f3d3d8;
      --sidebar-bg:#140607;
      --sidebar-text:#f5f0ea;
      --sidebar-muted:rgba(245,240,234,0.45);
      --sidebar-active:rgba(201,159,119,0.16);
      --sidebar-active-text:#e2be9b;
      --logo-filter:brightness(1.1);
      --accent:#c99f77;
      --accent2:#63121a;
    }
    html.dark body,html.dark #admin-view,html.dark #client-view,html.dark .admin-main,html.dark .client-main{background:#1c0a0c!important;}
    html.dark #client-view{--brown:#e2be9b;--brown2:#c99f77;--copper:#c99f77;}
    html.dark .login-box{background:#2a0f12!important;border:1px solid rgba(201,159,119,0.25)!important;}
    html.dark .app-header{background:rgba(28,10,12,0.92)!important;backdrop-filter:blur(8px);border-bottom:1px solid rgba(201,159,119,0.12)!important;}
    html.dark input,html.dark textarea,html.dark select{
      color:#f5f0ea!important;background:rgba(245,240,234,0.04)!important;border-color:rgba(201,159,119,0.22)!important;
    }
    html.dark input:focus,html.dark textarea:focus,html.dark select:focus{border-color:#c99f77!important;box-shadow:0 0 0 3px rgba(201,159,119,0.15)!important;}
    html.dark input::placeholder,html.dark textarea::placeholder{color:rgba(245,240,234,0.3)!important;}
    html.dark .nav-item{color:var(--sidebar-muted)!important;}
    html.dark .nav-item:hover{background:rgba(201,159,119,0.1)!important;color:#f5f0ea!important;}
    html.dark .nav-item.active{background:var(--sidebar-active)!important;color:var(--sidebar-active-text)!important;box-shadow:inset 2px 0 0 #c99f77;}
    html.dark #admin-sidebar,html.dark aside{background:var(--sidebar-bg)!important;border-color:rgba(201,159,119,0.14)!important;}
    html.dark .client-tab.active{background:rgba(201,159,119,0.16)!important;color:#e2be9b!important;}
    html.dark .client-tab:hover{color:#f5f0ea!important;}
    html.dark .table-wrap,html.dark .modal-box,html.dark [class*="modal-box"]{background:#2a0f12!important;border-color:rgba(201,159,119,0.18)!important;}
    html.dark .btn,html.dark button[class*="btn"],html.dark .save-btn,html.dark .primary-btn,
    html.dark .status-badge,html.dark .aw2-btn,html.dark .fsc-btn{
      background:#c99f77!important;color:#390d10!important;border-color:#c99f77!important;
    }
    html.dark .btn:hover,html.dark button[class*="btn"]:hover,html.dark .save-btn:hover{background:#e2be9b!important;}
    html.dark h1,html.dark h2,html.dark h3,html.dark h4{color:#f5f0ea!important;}
    html.dark ::-webkit-scrollbar-thumb{background:#63121a!important;}
    html.dark #loader{background:rgba(28,10,12,.9)!important;}
    html.dark #loader p{color:#e2be9b!important;}
  `;

  const COMMON=`
    ::-webkit-scrollbar{width:5px;height:5px;}
    ::-webkit-scrollbar-track{background:transparent;}
    ::-webkit-scrollbar-thumb{border-radius:10px;}
    ::selection{background:#e3a3ab;color:#390d10;}

    /* ── Calendário: dias rosa da marca, publicados vinho ── */
    html body .cal-cell.cal-cell{background:#f3d3d8!important;border-color:#e3a3ab!important;}
    html body .cal-cell.cal-cell.outro-mes{background:#f3d3d8!important;}
    html body .cal-cell.cal-cell.today{background:#e3a3ab!important;border-color:#b86a7b!important;}
    html body .cal-cell.cal-cell .cal-day-num{color:#63121a!important;}
    html body .pchip.pchip-st-publicado,html body .pchip.pchip-st-publicado.pchip-st-publicado{background:#390d10!important;border-color:#390d10!important;}
    html body .pchip.pchip-st-publicado .pchip-titulo,html body .pchip.pchip-st-publicado .pchip-tema,html body .pchip.pchip-st-publicado *:not(img){color:#f5f0ea!important;}
    html body .pchip.pchip-st-publicado .pchip-tipo{color:#e3a3ab!important;}

    /* ── Cabeçalho e rodapé vinho #390d10, letras brancas, ícones rosa ── */
    html body div.app-header.app-header,html.dark body div.app-header.app-header,html body footer,html.dark body footer{background:#390d10!important;background-image:none!important;border-color:rgba(255,255,255,.08)!important;backdrop-filter:none!important;}
    html body div.app-header.app-header,html body div.app-header.app-header .header-user,html body footer,html body footer *{color:#ffffff!important;}
    html body div.app-header.app-header .theme-btn,html body div.app-header.app-header #header-chat-btn{color:#e3a3ab!important;background:rgba(227,163,171,.12)!important;}
    html body div.app-header.app-header .theme-btn svg{stroke:#e3a3ab!important;}
    html body div.app-header.app-header .btn-out{background:transparent!important;color:#fff!important;border:1px solid rgba(255,255,255,.45)!important;}
    html body div.app-header.app-header .btn-out:hover{background:rgba(255,255,255,.12)!important;}
    html body div.app-header.app-header .theme-toggle{background:rgba(227,163,171,.12)!important;border-color:rgba(227,163,171,.4)!important;color:#e3a3ab!important;}
    html body div.app-header.app-header .theme-toggle *{color:#e3a3ab!important;}

    /* ── Cards: sem película preta sobre a cor escolhida ── */
    .nf-card-overlay{background:transparent!important;}
    .nf-has-cover .nf-card-overlay{background:linear-gradient(to top,rgba(0,0,0,.35),rgba(0,0,0,0) 60%)!important;}
    .nf-card-label{text-shadow:0 1px 6px rgba(0,0,0,.35)!important;}

    /* ── LOGIN no estilo do site: fundo vinho + grid de câmera ── */
    #login-view{
      background-color:#390d10!important;
      background-image:
        linear-gradient(to right,transparent calc(33.33% - .5px),rgba(245,240,234,.12) calc(33.33% - .5px),rgba(245,240,234,.12) calc(33.33% + .5px),transparent calc(33.33% + .5px),transparent calc(66.66% - .5px),rgba(245,240,234,.12) calc(66.66% - .5px),rgba(245,240,234,.12) calc(66.66% + .5px),transparent calc(66.66% + .5px)),
        linear-gradient(to bottom,transparent calc(33.33% - .5px),rgba(245,240,234,.12) calc(33.33% - .5px),rgba(245,240,234,.12) calc(33.33% + .5px),transparent calc(33.33% + .5px),transparent calc(66.66% - .5px),rgba(245,240,234,.12) calc(66.66% - .5px),rgba(245,240,234,.12) calc(66.66% + .5px),transparent calc(66.66% + .5px))!important;
    }
    .login-box{position:relative;border-radius:18px!important;}
    .login-logo img.pm-seal{max-width:104px!important;width:104px;height:auto;filter:drop-shadow(0 6px 14px rgba(57,13,16,.25));}
    .login-box h1{font-size:34px!important;line-height:1.02!important;color:var(--text)!important;font-style:normal!important;}
    .login-box h1 .pm-script{display:block;font-family:var(--f-script)!important;text-transform:none;color:#c99f77;font-size:24px;letter-spacing:0;margin-bottom:6px;transform:rotate(-3deg);}
    .login-box>p{letter-spacing:.22em!important;color:var(--muted)!important;}

    .theme-toggle{display:flex;align-items:center;gap:6px;background:var(--beige);border:1px solid var(--border);border-radius:20px;padding:5px 12px;cursor:pointer;font-size:11px;color:var(--muted);transition:all .25s;user-select:none;flex-shrink:0;}
    .theme-toggle:hover{border-color:var(--copper);color:var(--text);}
    .theme-toggle .tt-icon{font-size:14px;line-height:1;transition:transform .3s;}
    .theme-toggle:hover .tt-icon{transform:rotate(20deg);}
    html.dark .logo-light{display:none!important;}
    html:not(.dark) .logo-dark{display:none!important;}

    /* ── RESPONSIVO MOBILE GERAL ── */
    @media(max-width:768px){
      .admin-main{padding:16px!important;}
      .table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;}
      .table-wrap table{min-width:480px;}
      .section-header{flex-wrap:wrap;gap:8px;}
      [class*="modal"]{width:calc(100vw - 20px)!important;max-height:88vh!important;overflow-y:auto!important;margin:10px auto!important;border-radius:14px!important;}
      .ig-inline{position:static!important;margin-top:16px;}
      .client-board{margin-bottom:14px;}
      .cb-posts-row{gap:8px!important;}
      .cb-post{width:110px!important;}
      h1,h2{font-size:1.2em!important;}
      .login-box h1{font-size:28px!important;}
      .k-col{min-width:200px;}
      .kanban{padding-bottom:24px;}
    }
    @media(max-width:480px){
      [class*="modal"]{border-radius:10px!important;}
      .cb-post{width:95px!important;}
    }
  `;

  // Remove folhas do Google Fonts com as fontes antigas (para os apelidos acima valerem)
  const OLD_FONTS=/Poppins|Montserrat|Great\+Vibes|Cormorant/;
  function dropOldFontLinks(root){
    (root||document).querySelectorAll('link[href*="fonts.googleapis.com"]').forEach(l=>{
      if(OLD_FONTS.test(l.getAttribute('href')||''))l.remove();
    });
  }

  function inject(){
    try{document.querySelectorAll('link[rel="icon"],link[rel="apple-touch-icon"],link[rel="shortcut icon"]').forEach(l=>l.href='https://marketingprimor.com.br/wp-content/uploads/2026/09/Captura-de-Tela-2026-09-10-as-15.04.27.png');}catch(e){}
    dropOldFontLinks();
    if(document.getElementById('theme-css'))return;
    const s=document.createElement('style');
    s.id='theme-css';s.textContent=FONTS+TYPE+LIGHT+DARK+COMMON;
    (document.head||document.documentElement).appendChild(s);
    try{
      new MutationObserver(ms=>{ms.forEach(m=>m.addedNodes.forEach(n=>{
        if(n.nodeType===1&&n.tagName==='LINK'&&OLD_FONTS.test(n.getAttribute('href')||'')&&/fonts\.googleapis/.test(n.getAttribute('href')))n.remove();
      }));}).observe(document.head,{childList:true});
    }catch(e){}
  }

  function brandLogin(){
    const img=document.querySelector('.login-logo img');
    if(img&&!img.classList.contains('pm-seal')){
      img.src='https://marketingprimor.com.br/wp-content/uploads/2026/09/selo-primor-favicon-300x300.png';
      img.alt='Marketing Primor';img.classList.add('pm-seal');img.removeAttribute('style');
    }
    const h=document.querySelector('.login-box h1');
    if(h&&!h.querySelector('.pm-script')){
      h.innerHTML='<span class="pm-script">bem-vinda de volta</span>Portal <em>Primor</em>';
    }
  }

  function addToggle(){
    const topbar=document.querySelector('#admin-topbar,[id*="topbar"],[class*="topbar"],.topbar')
      ||document.querySelector('header')||document.querySelector('#admin-view > div:first-child');
    if(!topbar||document.getElementById('theme-toggle-btn'))return;
    const isDark=document.documentElement.classList.contains('dark');
    const btn=document.createElement('div');
    btn.id='theme-toggle-btn';btn.className='theme-toggle';
    btn.innerHTML=`<span class="tt-icon">${isDark?'☀️':'🌙'}</span><span class="tt-label">${isDark?'Creme':'Vinho'}</span>`;
    btn.onclick=toggleTheme;
    const target=topbar.querySelector('.flex-end,.actions,[class*="right"],[class*="user"]')||topbar;
    target.style.display='flex';target.style.alignItems='center';target.style.gap='8px';
    target.appendChild(btn);
  }

  function toggleTheme(){
    const html=document.documentElement;
    const going=!html.classList.contains('dark');
    html.classList.toggle('dark',going);
    try{localStorage.setItem('primor_theme',going?'dark':'light');}catch(e){}
    const btn=document.getElementById('theme-toggle-btn');
    if(btn){btn.querySelector('.tt-icon').textContent=going?'☀️':'🌙';btn.querySelector('.tt-label').textContent=going?'Creme':'Vinho';}
    swapLogo(going);
  }

  function swapLogo(dark){
    const imgs=document.querySelectorAll('img[src*="Logo"],img[src*="logo"]');
    imgs.forEach(img=>{
      if(dark&&img.src.includes('Logo.png'))img.src=img.src.replace('Logo.png','logo-icone-escuro.png');
      else if(!dark&&img.src.includes('logo-icone-escuro.png'))img.src=img.src.replace('logo-icone-escuro.png','Logo.png');
    });
  }

  function applyStored(){
    let stored=null;try{stored=localStorage.getItem('primor_theme');}catch(e){}
    const prefersDark=window.matchMedia('(prefers-color-scheme:dark)').matches;
    const useDark=stored?stored==='dark':prefersDark;
    document.documentElement.classList.toggle('dark',useDark);
    swapLogo(useDark);
  }


  // ── CAMPO HEX: colar o código inteiro (#63121a) em qualquer seletor de cor ──
  function enhanceColor(inp){
    if(inp.dataset.pmHex)return; inp.dataset.pmHex='1';
    const t=document.createElement('input');
    t.type='text';t.className='pm-hex';t.value=inp.value;t.spellcheck=false;t.placeholder='#000000';
    t.style.cssText='width:100%;margin-top:6px;padding:6px 8px;border-radius:8px;border:1px solid var(--border);font:12px ui-monospace,Menlo,monospace;text-align:center;box-sizing:border-box;';
    const apply=()=>{let v=t.value.trim().replace(/^#?/,'#');
      if(/^#[0-9a-f]{3}$/i.test(v))v='#'+v.slice(1).split('').map(c=>c+c).join('');
      if(/^#[0-9a-f]{6}$/i.test(v)){inp.value=v.toLowerCase();inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true}));t.style.borderColor='';}
      else t.style.borderColor='#c62828';};
    t.addEventListener('input',apply);t.addEventListener('paste',()=>setTimeout(apply,0));
    t.addEventListener('click',()=>t.select());
    inp.addEventListener('input',()=>{if(document.activeElement!==t)t.value=inp.value;});
    inp.insertAdjacentElement('afterend',t);
  }
  function scanColors(){document.querySelectorAll('input[type="color"]:not([data-pm-hex])').forEach(enhanceColor);}
  try{new MutationObserver(scanColors).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}

  // ── MODO APRESENTAÇÃO: posts fictícios no calendário (não grava nada no banco) ──
  const DEMO_EMAIL='demo@cafeaurora.com.br', DEMO_NOME='Café Aurora (demo)';
  const U=id=>`https://images.unsplash.com/photo-${id}?w=600&q=70`;
  const IMGS=['1495474472287-4d71bcdd2085','1509042239860-f550ce710b93','1511920170033-f8396924c348','1442512595331-e89e73853f31','1501339847302-ac426a4a7cbb','1554118811-1e0d58224f24','1497935586351-b67a49e012bf','1461023058943-07fcbe16d735'];
  const DEMO_ROWS=[
    [2,'publicado','Carrossel','Por que nosso café é torrado toda semana','Frescor não é detalhe, é o que muda o sabor da sua xícara. ☕'],
    [4,'publicado','Reels','Bastidores da torra','Do grão verde à xícara em 30 segundos.'],
    [7,'publicado','Post','Promoção de aniversário','3 anos de Aurora! Hoje o segundo café é por nossa conta.'],
    [9,'aprovado','Carrossel','5 formas de preparar em casa','Prensa francesa, V60, moka... salva esse post para testar no fim de semana.'],
    [11,'aprovado','Reels','Latte art passo a passo','O coração perfeito existe — e a gente te ensina.'],
    [14,'design','Post','Lançamento: bolo de fubá com goiabada','Receita da vó, agora no nosso balcão.'],
    [16,'revisao','Carrossel','Guia de grãos brasileiros','Cerrado, Sul de Minas, Mogiana: qual combina com você?'],
    [18,'revisao','Reels','Um dia na Aurora','Das 7h ao último espresso: vem ver como é nossa rotina.'],
    [21,'criacao','Post','Depoimento de cliente','"Virou meu escritório favorito." — Mariana, cliente desde 2024'],
    [23,'criacao','Carrossel','Café e produtividade','Quantas xícaras por dia? A ciência responde.'],
    [25,'criacao','Reels','Trend: POV barista','POV: você pediu "o de sempre" e a barista já sabia.'],
    [28,'criacao','Post','Agenda do mês que vem','Degustação guiada todo sábado. Vagas limitadas!']
  ];
  function demoOn(){return false;} // modo apresentação (Café Aurora) desligado em 09/11/2026
  function demoPosts(){
    const A=(typeof Admin!=='undefined'?Admin:null), mo=(A&&A._postsMonth)||{y:new Date().getFullYear(),m:new Date().getMonth()};
    const hoje=new Date();hoje.setHours(0,0,0,0);
    const FUT=['aprovado','design','revisao','aprovado','criacao'];
    const out=[];let k=0;
    [-1,0,1].forEach(off=>{const y=new Date(mo.y,mo.m+off,1).getFullYear(), m=new Date(mo.y,mo.m+off,1).getMonth(), last=new Date(y,m+1,0).getDate();
      for(let d=1;d<=last;d++){const r=DEMO_ROWS[k%DEMO_ROWS.length], dt=new Date(y,m,d);
        const ds=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
        const st=dt<hoje?'publicado':FUT[k%FUT.length], img=U(IMGS[k%IMGS.length]);
        out.push({id:-(k+1),_demo:true,client_email:DEMO_EMAIL,cliente_nome:DEMO_NOME,data_post:ds,status:st,tipo:r[2],
          tema_titulo:r[3],legenda:r[4],rede_social:'Instagram',img_url:img,capa_url:img,
          created_at:ds+'T10:00:00',status_abas:{tema:'aprovado',conteudo:'aprovado',midia:'aprovado',legenda:'aprovado'}});k++;}});
    return out;
  }
  function demoToast(msg){let t=document.getElementById('pm-toast');if(!t){t=document.createElement('div');t.id='pm-toast';
    t.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#390d10;color:#f5f0ea;padding:10px 18px;border-radius:12px;font-size:13px;z-index:99999;box-shadow:0 8px 30px rgba(0,0,0,.3);transition:opacity .3s';document.body.appendChild(t);}
    t.textContent=msg;t.style.opacity='1';clearTimeout(t._h);t._h=setTimeout(()=>t.style.opacity='0',2600);}
  function demoDetail(p){
    const ov=document.createElement('div');
    ov.style.cssText='position:fixed;inset:0;background:rgba(28,10,12,.55);z-index:9998;display:flex;align-items:center;justify-content:center;padding:16px;';
    ov.innerHTML=`<div style="background:var(--surface);color:var(--text);border-radius:18px;max-width:420px;width:100%;overflow:hidden;box-shadow:var(--sh2)">
      <img src="${p.img_url}" style="width:100%;height:240px;object-fit:cover;display:block">
      <div style="padding:18px 20px">
        <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)">${p.cliente_nome} · ${p.tipo} · ${p.data_post.split('-').reverse().join('/')}</div>
        <h3 style="margin:8px 0 6px;font-size:22px">${p.tema_titulo}</h3>
        <p style="font-size:14px;line-height:1.55;margin:0 0 14px">${p.legenda}</p>
        <button class="btn" style="padding:9px 16px;border-radius:10px;border:none;cursor:pointer">Fechar</button>
      </div></div>`;
    ov.addEventListener('click',e=>{if(e.target===ov||e.target.tagName==='BUTTON')ov.remove();});
    document.body.appendChild(ov);
  }
  function demoButton(){
    const h=[...document.querySelectorAll('#admin-main h2.section-title')].find(x=>/^\s*Posts\s*$/i.test(x.textContent));
    if(!h||h.parentElement.querySelector('#pm-demo-btn'))return;
    const b=document.createElement('button');b.id='pm-demo-btn';
    const on=demoOn();
    b.textContent=on?'✦ Apresentação ligada':'✦ Modo apresentação';
    b.title='Mostra posts fictícios de um cliente exemplo (nada é salvo no banco)';
    b.style.cssText=`padding:6px 12px;border-radius:9px;font-size:11px;cursor:pointer;border:1px solid ${on?'#c99f77':'var(--border)'};background:${on?'#c99f77':'transparent'};color:${on?'#390d10':'var(--muted)'};margin-left:10px;`;
    b.onclick=()=>{try{localStorage.setItem('primor_demo',demoOn()?'0':'1');}catch(e){}(typeof Admin!=='undefined'?Admin:null)._renderPostsView();};
    h.style.display='inline-block';h.insertAdjacentElement('afterend',b);
  }
  function hookDemo(){
    const A=(typeof Admin!=='undefined'?Admin:null); if(!A||A._pmDemoHooked||typeof A._renderPostsView!=='function')return;
    A._pmDemoHooked=true;
    const rv=A._renderPostsView;
    A._renderPostsView=function(){
      const real=(this.posts||[]).filter(p=>!p._demo), cl=(this._clientList||[]).filter(c=>c.email!==DEMO_EMAIL);
      if(demoOn()){this.posts=real.concat(demoPosts());this._clientList=cl.concat([{email:DEMO_EMAIL,nome:DEMO_NOME}]);}
      else{this.posts=real;this._clientList=cl;}
      const r=rv.apply(this,arguments); setTimeout(demoButton,0); return r;
    };
    const guard=(name,fn)=>{const o=A[name];if(typeof o!=='function')return;A[name]=function(id){if(Number(id)<0)return fn(id);return o.apply(this,arguments);};};
    const find=id=>(A.posts||[]).find(p=>p.id===Number(id));
    guard('viewPostDetail',id=>{const p=find(id);if(p)demoDetail(p);});
    ['publicarNoInstagram','abrirModalPost','editarPost','excluirPost','mudarStatus'].forEach(n=>guard(n,()=>demoToast('Post de demonstração — apenas para apresentação.')));
  }

  function init(){
    brandLogin();scanColors();
    if(typeof Admin==='undefined'){setTimeout(init,150);return;}
    inject();applyStored();
    setTimeout(addToggle,800);
    setTimeout(()=>{if(!document.getElementById('theme-toggle-btn'))addToggle();},1800);
  }

  inject();applyStored();
  document.addEventListener('DOMContentLoaded',init);
  if(document.readyState!=='loading')init();
})();
