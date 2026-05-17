// ───────────────────────────────────────────────────────────────────────
// THEME MODULE — Marketing Primor CRM
// Tema Escuro: Preto + Cinza + Vinho + Rosa
// Tema Claro:  Sidebar Petra + Vinho + Rosa + Bege
// ───────────────────────────────────────────────────────────────────────
(function(){
  'use strict';

  // ── PALETAS ──────────────────────────────────────────────────────────
  const DARK=`
    html.dark{
      --bg:#0D0D0D;
      --surface:#1A1A1A;
      --beige:#242424;
      --brown:#F5D5DF;
      --brown2:#F0A8BC;
      --copper:#D4567A;
      --text:#F2F0F2;
      --muted:#888888;
      --border:rgba(212,86,122,0.14);
      --r:12px;
      --sh:0 4px 24px rgba(0,0,0,0.4);
      --sh2:0 12px 48px rgba(0,0,0,0.6);
      --wine:#7A1A2A;
      --rose:#D4567A;
      --rose-light:#F0A8BC;
      --sidebar-bg:#111111;
      --sidebar-text:#F2F0F2;
      --sidebar-muted:#666666;
      --sidebar-active:rgba(212,86,122,0.18);
      --sidebar-active-text:#F0A8BC;
      --logo-filter:brightness(1.1);
      --accent:#D4567A;
      --accent2:#7A1A2A;
    }
    html.dark input,html.dark textarea,html.dark select{
      color:var(--text)!important;background:var(--beige)!important;border-color:var(--border)!important;
    }
    html.dark input::placeholder,html.dark textarea::placeholder{color:var(--muted)!important;}
    html.dark .nav-item{color:var(--sidebar-muted)!important;}
    html.dark .nav-item:hover{background:rgba(212,86,122,0.08)!important;color:var(--rose-light)!important;}
    html.dark .nav-item.active{background:var(--sidebar-active)!important;color:var(--sidebar-active-text)!important;}
    html.dark #admin-sidebar,html.dark aside{background:var(--sidebar-bg)!important;}
    html.dark .client-tab.active{background:var(--wine)!important;color:#fff!important;}
    html.dark .client-tab:hover{color:var(--rose-light)!important;}
    html.dark .status-badge,.aw2-btn,.fsc-btn{background:var(--rose)!important;}
    html.dark ::-webkit-scrollbar-thumb{background:var(--wine)!important;}
  `;

  const LIGHT=`
    html:not(.dark){
      --wine:#7A1A2A;
      --rose:#D4567A;
      --rose-light:#F0A8BC;
      --sidebar-bg:#1C0E0A;
      --sidebar-text:#FAF8F2;
      --sidebar-muted:rgba(250,248,242,0.5);
      --sidebar-active:rgba(212,86,122,0.22);
      --sidebar-active-text:#F0A8BC;
      --accent:#7A1A2A;
      --accent2:#D4567A;
      --copper:#7A1A2A;
      --brown:#5C2010;
      --brown2:#7A3020;
    }
    html:not(.dark) .nav-item{color:var(--sidebar-muted)!important;}
    html:not(.dark) .nav-item:hover{background:rgba(212,86,122,0.12)!important;color:var(--rose-light)!important;}
    html:not(.dark) .nav-item.active{background:var(--sidebar-active)!important;color:var(--rose-light)!important;font-weight:500!important;}
    html:not(.dark) .nav-item .ni{color:inherit!important;}
    html:not(.dark) #admin-sidebar,html:not(.dark) aside{background:var(--sidebar-bg)!important;}
    html:not(.dark) .aw2-btn,.fsc-btn{background:var(--wine)!important;}
    html:not(.dark) ::-webkit-scrollbar-thumb{background:var(--rose)!important;}
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
