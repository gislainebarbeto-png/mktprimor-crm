// ───────────────────────────────────────────────────────────────────────
// THEME MODULE — Marketing Primor CRM
// Tema Escuro: Preto + Dourado Frio (#C4A352)
// Tema Claro:  Bege + Dourado (#8C7234)
// ───────────────────────────────────────────────────────────────────────
(function(){
  'use strict';

  const DARK=`
    html.dark{
      --bg:#000000;
      --surface:#0A0A08;
      --beige:#111108;
      --brown:#C4A352;
      --brown2:#D4B870;
      --copper:#C4A352;
      --text:#EDE8D8;
      --muted:rgba(196,163,82,0.5);
      --border:rgba(196,163,82,0.15);
      --r:12px;
      --sh:0 4px 24px rgba(0,0,0,0.6);
      --sh2:0 12px 48px rgba(0,0,0,0.8);
      --wine:#8C7234;
      --rose:#C4A352;
      --rose-light:#D4B870;
      --sidebar-bg:#000000;
      --sidebar-text:#C4A352;
      --sidebar-muted:rgba(196,163,82,0.45);
      --sidebar-active:rgba(196,163,82,0.14);
      --sidebar-active-text:#D4B870;
      --logo-filter:brightness(1.1);
      --accent:#C4A352;
      --accent2:#8C7234;
    }
    html.dark body{background:#000000!important;}
    html.dark #admin-view,html.dark #client-view{background:#000000!important;}
    html.dark .admin-main,html.dark .client-main{background:#000000!important;}
    html.dark .login-box{background:#0A0A08!important;border:1px solid rgba(196,163,82,0.2)!important;}
    html.dark .app-header{background:#000000!important;border-bottom:1px solid rgba(196,163,82,0.12)!important;}
    html.dark input,html.dark textarea,html.dark select{
      color:var(--text)!important;background:#111108!important;border-color:rgba(196,163,82,0.2)!important;
    }
    html.dark input::placeholder,html.dark textarea::placeholder{color:rgba(196,163,82,0.35)!important;}
    html.dark .nav-item{color:var(--sidebar-muted)!important;}
    html.dark .nav-item:hover{background:rgba(196,163,82,0.08)!important;color:#D4B870!important;}
    html.dark .nav-item.active{background:var(--sidebar-active)!important;color:var(--sidebar-active-text)!important;}
    html.dark #admin-sidebar,html.dark aside{background:var(--sidebar-bg)!important;}
    html.dark .client-tab.active{background:rgba(196,163,82,0.18)!important;color:#D4B870!important;}
    html.dark .client-tab:hover{color:#D4B870!important;}
    html.dark .status-badge,.aw2-btn,.fsc-btn{background:#8C7234!important;}
    html.dark ::-webkit-scrollbar-thumb{background:#8C7234!important;}
    html.dark .table-wrap,html.dark .dh-kpi,html.dark .dh-chart-box,html.dark .dh-list-box{
      background:#000000!important;border-color:rgba(196,163,82,0.15)!important;
    }
    html.dark .modal-box,html.dark .modal,html.dark [class*="modal"]{
      background:#0A0A08!important;border-color:rgba(196,163,82,0.2)!important;
    }
    html.dark .btn,html.dark button[class*="btn"],html.dark .save-btn,html.dark .primary-btn{
      background:#8C7234!important;color:#EDE8D8!important;border-color:#8C7234!important;
    }
    html.dark .btn:hover,html.dark button[class*="btn"]:hover{background:#C4A352!important;}
    html.dark h1,html.dark h2,html.dark h3,html.dark h4{color:#C4A352!important;}
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
    html:not(.dark) .btn,html:not(.dark) button[class*="btn"],html:not(.dark) .save-btn,html:not(.dark) .primary-btn{
      background:#8C7234!important;color:#fff!important;
    }
    html:not(.dark) .btn:hover{background:#C4A352!important;}
    html:not(.dark) .modal-box,html:not(.dark) .modal{background:#FFFFFF!important;}
    html:not(.dark) h1,html:not(.dark) h2,html:not(.dark) h3,html:not(.dark) h4{color:#8C7234!important;}
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
    html.dark [data-logo-dark]{display:block!important;}
    html:not(.dark) [data-logo-dark]{display:none!important;}
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
    btn.id='theme-toggle-btn';
    btn.className='theme-toggle';
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
    if(btn){
      btn.querySelector('.tt-icon').textContent=going?'☀️':'🌙';
      btn.querySelector('.tt-label').textContent=going?'Claro':'Escuro';
    }
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
    inject();
    applyStored();
    setTimeout(addToggle,800);
    setTimeout(()=>{if(!document.getElementById('theme-toggle-btn'))addToggle();},1800);
  }

  inject();
  applyStored();
  document.addEventListener('DOMContentLoaded',init);
  if(document.readyState!=='loading')init();
})();
