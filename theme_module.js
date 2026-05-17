// ───────────────────────────────────────────────────────────────────────
// THEME MODULE — Marketing Primor CRM
// Tema Escuro: Preto + #68462f → #ffd6ba
// Tema Claro:  Bege + Dourado (#8C7234)
// ───────────────────────────────────────────────────────────────────────
(function(){
  'use strict';

  const DARK=`
    html.dark{
      --bg:#000000;
      --surface:#140a05;
      --beige:#1e1008;
      --brown:#ffd6ba;
      --brown2:rgba(255,214,186,0.75);
      --copper:#ffd6ba;
      --text:#ffd6ba;
      --muted:rgba(255,214,186,0.45);
      --border:rgba(255,214,186,0.15);
      --r:12px;
      --sh:0 4px 24px rgba(0,0,0,0.6);
      --sh2:0 12px 48px rgba(0,0,0,0.8);
      --wine:#68462f;
      --rose:#d4896a;
      --rose-light:#ffd6ba;
      --sidebar-bg:#000000;
      --sidebar-text:#ffd6ba;
      --sidebar-muted:rgba(255,214,186,0.4);
      --sidebar-active:rgba(104,70,47,0.35);
      --sidebar-active-text:#ffd6ba;
      --logo-filter:brightness(1.1);
      --accent:#d4896a;
      --accent2:#68462f;
    }
    html.dark body{background:#000000!important;}
    html.dark #admin-view,html.dark #client-view{background:#000000!important;}
    html.dark .admin-main,html.dark .client-main{background:#000000!important;}
    html.dark .login-box{background:#140a05!important;border:1px solid rgba(255,214,186,0.2)!important;}
    html.dark .app-header{background:#000000!important;border-bottom:1px solid rgba(255,214,186,0.1)!important;}
    html.dark input,html.dark textarea,html.dark select{
      color:#ffd6ba!important;
      background:linear-gradient(135deg,rgba(104,70,47,0.5),rgba(255,214,186,0.04))!important;
      border-color:rgba(255,214,186,0.2)!important;
    }
    html.dark input::placeholder,html.dark textarea::placeholder{color:rgba(255,214,186,0.3)!important;}
    html.dark .nav-item{color:rgba(255,214,186,0.4)!important;}
    html.dark .nav-item:hover{background:rgba(104,70,47,0.3)!important;color:#ffd6ba!important;}
    html.dark .nav-item.active{background:rgba(104,70,47,0.35)!important;color:#ffd6ba!important;}
    html.dark #admin-sidebar,html.dark aside{background:#000000!important;}
    html.dark .client-tab.active{background:rgba(104,70,47,0.35)!important;color:#ffd6ba!important;}
    html.dark .client-tab:hover{color:#ffd6ba!important;}
    html.dark .status-badge,.aw2-btn,.fsc-btn{background:#68462f!important;}
    html.dark ::-webkit-scrollbar-thumb{background:#68462f!important;}
    html.dark .table-wrap{background:#140a05!important;border-color:rgba(255,214,186,0.12)!important;}
    html.dark .modal-box,html.dark [class*="modal-box"]{
      background:#140a05!important;border-color:rgba(255,214,186,0.2)!important;
    }
    html.dark .btn,html.dark button[class*="btn"],html.dark .save-btn,html.dark .primary-btn{
      background:#68462f!important;color:#ffd6ba!important;border-color:#68462f!important;
    }
    html.dark .btn:hover,html.dark button[class*="btn"]:hover{background:#d4896a!important;}
    html.dark h1,html.dark h2,html.dark h3,html.dark h4{color:#ffd6ba!important;}
    html.dark ::-webkit-scrollbar-track{background:transparent;}
  `;

  const LIGHT=`
    html:not(.dark){
      --bg:#F5EFE0;
      --surface:#FFFFFF;
      --beige:#EDE5D0;
      --brown:#8C7234;
      --brown2:#A08040;
      --copper:#8C7234;
      --text:#2A1F0A;
      --muted:#9A8055;
      --border:rgba(140,114,52,0.22);
      --r:12px;
      --sh:0 4px 20px rgba(0,0,0,0.08);
      --sh2:0 12px 40px rgba(0,0,0,0.12);
      --wine:#8C7234;
      --rose:#C4A352;
      --rose-light:#D4B870;
      --sidebar-bg:#EDE5D0;
      --sidebar-text:#2A1F0A;
      --sidebar-muted:rgba(42,31,10,0.5);
      --sidebar-active:rgba(140,114,52,0.18);
      --sidebar-active-text:#8C7234;
      --accent:#8C7234;
      --accent2:#C4A352;
    }
    html:not(.dark) body{background:#F5EFE0!important;}
    html:not(.dark) .nav-item{color:var(--sidebar-muted)!important;}
    html:not(.dark) .nav-item:hover{background:rgba(140,114,52,0.1)!important;color:#8C7234!important;}
    html:not(.dark) .nav-item.active{background:var(--sidebar-active)!important;color:var(--sidebar-active-text)!important;font-weight:500!important;}
    html:not(.dark) .nav-item .ni{color:inherit!important;}
    html:not(.dark) #admin-sidebar,html:not(.dark) aside{background:var(--sidebar-bg)!important;}
    html:not(.dark) .aw2-btn,.fsc-btn{background:#8C7234!important;color:#fff!important;}
    html:not(.dark) ::-webkit-scrollbar-thumb{background:#C4A352!important;}
    html:not(.dark) .app-header{background:#F5EFE0!important;border-bottom:1px solid rgba(140,114,52,0.18)!important;}
    html:not(.dark) .login-box{background:#FFFFFF!important;border:1px solid rgba(140,114,52,0.2)!important;}
    html:not(.dark) input,html:not(.dark) textarea,html:not(.dark) select{
      background:#FBF7EE!important;border-color:rgba(140,114,52,0.25)!important;color:#2A1F0A!important;
    }
    html:not(.dark) .btn,html:not(.dark) button[class*="btn"],html:not(.dark) .save-btn{
      background:#8C7234!important;color:#fff!important;
    }
    html:not(.dark) .btn:hover{background:#C4A352!important;}
  `;

  const COMMON=`
    ::-webkit-scrollbar{width:5px;height:5px;}
    ::-webkit-scrollbar-track{background:transparent;}
    ::-webkit-scrollbar-thumb{border-radius:10px;}
    .theme-toggle{display:flex;align-items:center;gap:6px;background:var(--beige);border:1px solid var(--border);border-radius:20px;padding:5px 12px;cursor:pointer;font-size:11px;color:var(--muted);transition:all .25s;user-select:none;flex-shrink:0;}
    .theme-toggle:hover{border-color:var(--rose,var(--copper));color:var(--text);}
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
      .k-col{min-width:200px;}
      .kanban{padding-bottom:24px;}
    }
    @media(max-width:480px){
      [class*="modal"]{border-radius:10px!important;}
      .cb-post{width:95px!important;}
    }
  `;

  function inject(){
    if(document.getElementById('theme-css'))return;
    const s=document.createElement('style');
    s.id='theme-css';s.textContent=DARK+LIGHT+COMMON;
    document.head.appendChild(s);
  }

  function addToggle(){
    const topbar=document.querySelector('#admin-topbar,[id*="topbar"],[class*="topbar"],.topbar')
      ||document.querySelector('header')||document.querySelector('#admin-view > div:first-child');
    if(!topbar||document.getElementById('theme-toggle-btn'))return;
    const isDark=document.documentElement.classList.contains('dark');
    const btn=document.createElement('div');
    btn.id='theme-toggle-btn';btn.className='theme-toggle';
    btn.innerHTML=`<span class="tt-icon">${isDark?'☀️':'🌙'}</span><span class="tt-label">${isDark?'Claro':'Escuro'}</span>`;
    btn.onclick=toggleTheme;
    const target=topbar.querySelector('.flex-end,.actions,[class*="right"],[class*="user"]')||topbar;
    target.style.display='flex';target.style.alignItems='center';target.style.gap='8px';
    target.appendChild(btn);
  }

  function toggleTheme(){
    const html=document.documentElement;
    const going=!html.classList.contains('dark');
    html.classList.toggle('dark',going);
    localStorage.setItem('primor_theme',going?'dark':'light');
    const btn=document.getElementById('theme-toggle-btn');
    if(btn){btn.querySelector('.tt-icon').textContent=going?'☀️':'🌙';btn.querySelector('.tt-label').textContent=going?'Claro':'Escuro';}
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
    const stored=localStorage.getItem('primor_theme');
    const prefersDark=window.matchMedia('(prefers-color-scheme:dark)').matches;
    const useDark=stored?stored==='dark':prefersDark;
    if(useDark){document.documentElement.classList.add('dark');swapLogo(true);}
    else{document.documentElement.classList.remove('dark');swapLogo(false);}
  }

  function init(){
    if(typeof Admin==='undefined'){setTimeout(init,150);return;}
    inject();applyStored();
    setTimeout(addToggle,800);
    setTimeout(()=>{if(!document.getElementById('theme-toggle-btn'))addToggle();},1800);
  }

  inject();applyStored();
  document.addEventListener('DOMContentLoaded',init);
  if(document.readyState!=='loading')init();
})();
