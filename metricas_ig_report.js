// Relatório de Métricas Instagram — usado no portal da cliente e no PDF (admin)
// Mesmo visual da aba Pedro → Diagnóstico. Lê metricas_instagram com dados_completos.versao === 2
(function(){
  const fN=n=>(n||0).toLocaleString('pt-BR');
  const fP=n=>(n||0).toLocaleString('pt-BR',{maximumFractionDigits:1})+'%';
  const fD=s=>s?new Date(String(s).slice(0,10)+'T12:00:00').toLocaleDateString('pt-BR'):'—';
  const esc=t=>String(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const corta=(t,n)=>{t=t.trim();if(t.length<=n)return t;const c=t.slice(0,n);const i=c.lastIndexOf(' ');return (i>n*0.6?c.slice(0,i):c).replace(/[\s.,;:!?·-]+$/,'')+'…';};
  const leg=(p,n)=>esc(corta((p.caption||'').split('\n')[0],n||60))||'<em>(sem legenda)</em>';
  const tipo=p=>p.produto==='REELS'?'🎬 Reels':p.media_type==='CAROUSEL_ALBUM'?'🗂 Carrossel':p.media_type==='VIDEO'?'🎬 Vídeo':'🖼 Foto';

  // Paleta: usa as cores do tema atual do CRM se ele for claro; senão, a paleta da marca
  function paleta(){
    const P={wine:'#5B1A22',text:'#2B2118',muted:'#7A6E62',line:'#E8DECE',bg:'#FBF9F4',card:'#FFFFFF',font:"'Poppins',Arial,sans-serif"};
    try{
      const cs=getComputedStyle(document.documentElement),v=k=>cs.getPropertyValue(k).trim();
      const bg=v('--bg')||'#fff';
      const m=bg.match(/^#([0-9a-f]{6})$/i);
      const claro=!m||(parseInt(m[1].slice(0,2),16)*299+parseInt(m[1].slice(2,4),16)*587+parseInt(m[1].slice(4,6),16)*114)/1000>150;
      if(claro){
        const btn=document.querySelector('.aw2-btn');
        const wine=btn?getComputedStyle(btn).backgroundColor:(v('--wine')||'');
        if(wine&&!/rgba?\(0, 0, 0, 0\)|transparent/.test(wine))P.wine=wine;
        if(v('--border'))P.line=v('--border');
        if(v('--muted'))P.muted=v('--muted');
        if(v('--surface'))P.card=v('--surface');
        if(m)P.bg=bg;
      }
      P.font=getComputedStyle(document.body).fontFamily||P.font;
    }catch{}
    return P;
  }

  function html(meta,opts){
    opts=opts||{};
    const C=opts.paleta||paleta();
    const x=meta.dados_completos||{};
    const posts=[...(x.top_posts||[])];
    const saldo=(x.novos_seg||0)-(x.deixaram_seg||0);
    const pctFora=meta.alcance>0?Math.round((x.alcance_nao_seguidores||0)/meta.alcance*100):0;
    const periodo=x.period_from?`${fD(x.period_from)} → ${fD(x.period_to)}`:fD(meta.data);
    const card=`background:${C.card};border:1px solid ${C.line};border-radius:10px`;
    const tit=t=>`<div style="font-size:12px;font-weight:600;color:${C.wine};margin:0 0 10px">${t}</div>`;
    const nota=t=>`<div style="font-size:9.5px;color:${C.muted};line-height:1.5;margin-top:6px">${t}</div>`;
    const kpi=(icon,label,val,sub)=>`<div style="${card};padding:11px 12px;break-inside:avoid">
      <div style="font-size:9.5px;color:${C.muted};text-transform:uppercase;letter-spacing:.09em">${icon} ${label}</div>
      <div style="font-size:21px;font-weight:600;color:${C.text};margin-top:3px;line-height:1.15">${val}</div>
      ${sub?`<div style="font-size:9.5px;color:${C.muted};margin-top:3px;line-height:1.35">${sub}</div>`:''}</div>`;

    const head=`<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding-bottom:14px;margin-bottom:14px;border-bottom:2px solid ${C.line}">
      <div>
        <div style="font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:${C.muted}">Relatório de Métricas Instagram</div>
        ${opts.nome?`<div style="font-size:22px;font-weight:500;color:${C.wine};margin-top:2px">${esc(opts.nome)}</div>`:''}
        <div style="font-size:12px;color:${C.muted};margin-top:2px">Período: ${periodo}</div>
      </div>
      ${opts.print?`<img src="https://crm.marketingprimor.com.br/logo-texto.png.jpeg" style="height:44px;object-fit:contain">`:''}
    </div>`;

    const kpis=`<div style="border-left:3px solid #4CAF50;padding-left:10px">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:8px" class="mig-grid">
        ${kpi('👥','Seguidores',fN(meta.seguidores),`+${fN(x.novos_seg)} / -${fN(x.deixaram_seg)} no período (saldo ${saldo>=0?'+':''}${saldo})`)}
        ${kpi('👁','Alcance',fN(meta.alcance),`pessoas únicas · ${pctFora}% não seguidores${x.periodo_longo?' · aprox.':''}`)}
        ${kpi('👀','Visualizações',fN(meta.impressoes),'vezes que o conteúdo foi exibido')}
        ${kpi('🔍','Visitas ao perfil',fN(meta.visitas_perfil),'no período')}
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px" class="mig-grid">
        ${kpi('❤️','Engajamento real',fP(x.eng_real),`${fN(x.contas_engajadas)} de ${fN(meta.alcance)} pessoas interagiram`)}
        ${kpi('📊','Taxa média por post',fP(x.eng_posts),`interações ÷ alcance · ${fP(x.eng_seguidores)} por seguidor`)}
        ${kpi('💬','Interações',fN(x.interacoes),`${fN(x.likes)} ❤ · ${fN(x.comments)} 💬 · ${fN(x.saves_total)} 🔖 · ${fN(x.shares)} ↗`)}
        ${kpi('🌐','Cliques no site',fN(x.website_clicks),'link da bio')}
      </div></div>`;

    // Seguidores e formatos
    const comFollow=posts.filter(p=>(p.follows||0)>0).sort((a,b)=>b.follows-a.follows);
    const semAtrib=Math.max(0,(x.novos_seg||0)-(x.seg_posts||0));
    const fmtNome={REEL:'Reels',CAROUSEL_CONTAINER:'Carrossel',POST:'Post (foto)',STORY:'Stories',AD:'Anúncios',IGTV:'Vídeo'};
    const af=Object.entries(x.alcance_formato||{}).sort((a,b)=>b[1]-a[1]);
    const afMax=af.length?af[0][1]:1;
    const dias=x.seg_por_dia||[];const dMax=Math.max(1,...dias.map(d=>d.v));
    const blocos=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px" class="mig-grid2">
      <div style="${card};padding:12px 14px;break-inside:avoid">
        ${tit('🧲 De onde vieram os seguidores')}
        ${comFollow.length?comFollow.map(p=>`<div style="display:flex;justify-content:space-between;gap:8px;font-size:11px;padding:3px 0;color:${C.text}"><span>${leg(p,45)} · ${fD(p.timestamp)}</span><strong>+${p.follows}</strong></div>`).join('')
          :`<div style="font-size:11px;color:${C.text}">Nenhum post de feed gerou seguidor diretamente.</div>`}
        <div style="display:flex;justify-content:space-between;font-size:11px;padding:3px 0;color:${C.text}"><span>Reels, Stories, busca e perfil</span><strong>+${semAtrib}</strong></div>
        ${nota('A Meta só informa seguidores por post para fotos e carrosséis. Os de Reels e Stories aparecem juntos na última linha.')}
        ${dias.length?`<div style="font-size:9.5px;color:${C.muted};margin-top:10px">Novos seguidores por dia</div>
        <div style="display:flex;align-items:flex-end;gap:2px;height:44px;margin-top:4px">${dias.map(d=>`<div style="flex:1;background:${d.v?C.wine:C.line};height:${Math.max(3,Math.round(d.v/dMax*44))}px;border-radius:2px"></div>`).join('')}</div>
        <div style="display:flex;justify-content:space-between;font-size:8.5px;color:${C.muted};margin-top:3px"><span>${fD(dias[0].d)}</span><span>${fD(dias[dias.length-1].d)}</span></div>`:''}
      </div>
      <div style="${card};padding:12px 14px;break-inside:avoid">
        ${tit('📡 Alcance por formato')}
        ${af.map(([k,v])=>`<div style="font-size:11px;margin-bottom:8px;color:${C.text}"><div style="display:flex;justify-content:space-between"><span>${fmtNome[k]||k}</span><strong>${fN(v)}</strong></div><div style="height:6px;background:${C.line};border-radius:3px;margin-top:3px"><div style="height:6px;width:${(v/afMax*100).toFixed(0)}%;background:${C.wine};border-radius:3px"></div></div></div>`).join('')||nota('Sem dados de formato.')}
        <div style="font-size:10px;color:${C.muted};margin-top:6px">Seguidores alcançados: <strong>${fN(x.alcance_seguidores)}</strong> · Não seguidores: <strong>${fN(x.alcance_nao_seguidores)}</strong></div>
      </div></div>`;

    // Turbinar
    const turb=posts.filter(p=>p.turbinar).sort((a,b)=>(b.score||0)-(a.score||0));
    const turbHtml=opts.semTurbinar?'':`<div style="margin-top:12px;border:1px solid #FDE68A;background:#FFFBEB;border-radius:10px;padding:12px 14px;break-inside:avoid">
      <div style="font-size:12px;font-weight:600;color:#92400E;margin-bottom:6px">💰 Posts com potencial para turbinar</div>
      ${turb.length?turb.map((p,i)=>`<div style="font-size:11px;padding:3px 0;color:#78350F">${i+1}. <strong>${leg(p)}</strong> · ${fD(p.timestamp)}<br><span style="color:#92400E">${esc((p.motivos||[]).join(' · '))||'acima da média no conjunto das métricas'}</span></div>`).join('')
        :`<div style="font-size:11px;color:#92400E">Nenhum post ficou claramente acima da média neste período.</div>`}
      <div style="font-size:9.5px;color:#A16207;margin-top:6px">Critério: salvamentos+compartilhamentos e engajamento por alcance (peso maior), alcance e alcance fora da base, comparados com a média dos posts do período.</div>
    </div>`;

    // Saiu da bolha
    const bolha=posts.filter(p=>p.saiu_bolha).sort((a,b)=>b.reach-a.reach);
    const s=meta.seguidores||0;
    const bolhaHtml=`<div style="margin-top:12px;border:1px solid #BFDBFE;background:#EFF6FF;border-radius:10px;padding:12px 14px;break-inside:avoid">
      <div style="font-size:12px;font-weight:600;color:#1E40AF;margin-bottom:6px">🚀 O que é "Saiu da bolha"</div>
      <div style="font-size:11px;color:#1E3A8A;line-height:1.6">O post foi mostrado para muita gente que <strong>não segue</strong> o perfil. Com ${fN(s)} seguidores, se um post alcança ${fN(Math.round(s*3.5))} pessoas, pelo menos ${fN(Math.round(s*2.5))} delas não seguem: o Instagram levou o conteúdo para pessoas novas (Explorar, aba Reels, busca ou compartilhamentos). É assim que o perfil cresce.
      O selo aparece quando o alcance do post é pelo menos 1,5× o número de seguidores. A coluna <strong>Fora base</strong> mostra a parte mínima do alcance que com certeza veio de quem não segue.</div>
      <div style="font-size:11px;color:#1E3A8A;margin-top:6px">${bolha.length?`<strong>Saíram da bolha neste período:</strong> ${bolha.map(p=>`${leg(p,38)} (${p.fora_base_pct}% fora da base)`).join(' · ')}`:'Neste período nenhum post saiu da bolha: o conteúdo ficou entre quem já segue.'}</div>
    </div>`;

    // Tabela de posts
    const sorts={data:(a,b)=>new Date(b.timestamp)-new Date(a.timestamp),reach:(a,b)=>b.reach-a.reach,eng:(a,b)=>b.eng-a.eng,score:(a,b)=>(b.score||0)-(a.score||0),follows:(a,b)=>(b.follows||0)-(a.follows||0)};
    const lista=posts.sort(sorts[opts.sort]||sorts.reach);
    const th=`padding:8px 5px;font-size:9px;color:${C.muted};font-weight:600;text-transform:uppercase;letter-spacing:.04em;text-align:center;white-space:nowrap`;
    const td=`padding:7px 5px;font-size:11px;text-align:center;white-space:nowrap;color:${C.text}`;
    const selo=(bg,cor,t)=>`<span style="font-size:9px;background:${bg};color:${cor};border-radius:10px;padding:2px 7px;font-weight:600;margin-right:3px;white-space:nowrap">${t}</span>`;
    const linha=p=>`<tr style="border-top:1px solid ${C.line};break-inside:avoid">
      <td style="padding:7px 6px">
        <div style="display:flex;align-items:center;gap:8px">
          ${p.thumbnail?`<img src="${esc(p.thumbnail)}" style="width:40px;height:40px;border-radius:6px;object-fit:cover;flex-shrink:0;background:${C.line}" onerror="this.style.visibility='hidden'">`:`<div style="width:40px;height:40px;border-radius:6px;background:${C.line};flex-shrink:0"></div>`}
          <div style="min-width:0">
            <div style="font-size:11px;color:${C.text};line-height:1.3">${leg(p,55)}</div>
            <div style="font-size:9.5px;color:${C.muted};margin-top:2px">${fD(p.timestamp)} · ${tipo(p)}${p.avg_watch?` · ${String(p.avg_watch).replace('.',',')}s assistidos`:''}</div>
            ${(p.turbinar&&!opts.semTurbinar)||p.saiu_bolha?`<div style="margin-top:4px">${p.turbinar&&!opts.semTurbinar?selo('#FEF3C7','#92400E','💰 Turbinar'):''}${p.saiu_bolha?selo('#DBEAFE','#1E40AF','🚀 Saiu da bolha'):''}</div>`:''}
          </div>
        </div>
      </td>
      <td style="${td}"><strong>${fN(p.reach)}</strong></td><td style="${td}">${fN(p.views)}</td><td style="${td}">${fN(p.like_count)}</td><td style="${td}">${fN(p.comments_count)}</td><td style="${td}">${fN(p.saved)}</td><td style="${td}">${fN(p.shares)}</td>
      <td style="${td}">${p.follows==null?'—':fN(p.follows)}</td><td style="${td}"><strong>${fP(p.eng)}</strong></td><td style="${td}">${p.reach?p.fora_base_pct+'%':'—'}</td>
    </tr>`;
    const tabela=`<div style="margin-top:16px">
      <div style="font-size:12px;font-weight:600;color:${C.wine};margin-bottom:8px">📋 Todos os posts do período · ${posts.length} posts</div>
      <div style="${card};overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead><tr><th style="${th};text-align:left">Post</th><th style="${th}">Alcance</th><th style="${th}">Views</th><th style="${th}">❤</th><th style="${th}">💬</th><th style="${th}">🔖</th><th style="${th}">↗</th><th style="${th}">+Seg</th><th style="${th}">Eng.</th><th style="${th}">Fora base</th></tr></thead>
          <tbody>${lista.map(linha).join('')}</tbody>
        </table>
      </div>
      ${nota('❤ curtidas · 💬 comentários · 🔖 salvamentos · ↗ compartilhamentos · +Seg seguidores ganhos com o post ("—" = a Meta não informa para Reels) · Eng. = interações ÷ alcance do post')}
    </div>`;

    const glossario=`<div style="margin-top:16px;padding-top:10px;border-top:1px solid ${C.line};font-size:10px;color:${C.muted};line-height:1.7;break-inside:avoid">
      <strong style="color:${C.wine}">Como ler:</strong> <strong>Alcance</strong> = pessoas diferentes que viram. <strong>Visualizações</strong> = quantas vezes apareceu (a mesma pessoa pode ver várias vezes). <strong>Engajamento real</strong> = das pessoas alcançadas, quantas interagiram de verdade (cada pessoa conta uma vez). <strong>Salvamentos e compartilhamentos</strong> são os sinais que o Instagram mais valoriza para mostrar o post a mais gente.</div>`;

    return `<div class="mig-rep" style="font-family:${C.font};color:${C.text};background:${C.bg};${opts.print?'padding:4px':`border:1px solid ${C.line};border-radius:14px;padding:16px`}">
      <style>@media (max-width:640px){.mig-rep .mig-grid{grid-template-columns:1fr 1fr!important}.mig-rep .mig-grid2{grid-template-columns:1fr!important}}</style>
      ${head}${kpis}${blocos}${turbHtml}${bolhaHtml}${tabela}${glossario}
      ${opts.print?`<div style="margin-top:14px;display:flex;justify-content:space-between;font-size:8.5px;color:${C.muted};text-transform:uppercase;letter-spacing:.1em"><span>Agência Primor · Estratégia · Criatividade · Resultados</span><span>Gerado em ${new Date().toLocaleDateString('pt-BR')}</span></div>`:''}
    </div>`;
  }

  // Janela de impressão (Salvar como PDF): copia as fontes do CRM e espera imagens carregarem
  function imprimir(meta,opts){
    opts=Object.assign({},opts,{print:true,paleta:paleta()});
    const win=window.open('','_blank','width=1100,height=850');
    if(!win){alert('O navegador bloqueou a janela do PDF. Permita pop-ups para crm.marketingprimor.com.br e tente de novo.');return;}
    const fontes=[...document.querySelectorAll('link[rel="stylesheet"][href*="fonts"]')].map(l=>`<link rel="stylesheet" href="${l.href}">`).join('');
    const nome=esc(opts.nome||'Instagram');
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Métricas Instagram — ${nome}</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">${fontes}
      <style>
        @page{size:A4 landscape;margin:9mm}
        *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
        body{margin:0;background:${opts.paleta.bg}}
        .wrap{max-width:1080px;margin:0 auto;padding:16px}
        thead{display:table-header-group}
        tr,img{break-inside:avoid;page-break-inside:avoid}
        .bar{position:sticky;top:0;z-index:2;background:${opts.paleta.wine};color:#fff;padding:10px 16px;font:500 13px Poppins,Arial;display:flex;justify-content:space-between;align-items:center;gap:10px}
        .bar button{background:#fff;color:${opts.paleta.wine};border:0;border-radius:8px;padding:7px 14px;font:600 12px Poppins,Arial;cursor:pointer}
        @media print{.bar{display:none}.wrap{padding:0;max-width:none}}
      </style></head><body>
      <div class="bar"><span>Na janela de impressão, escolha <b>Salvar como PDF</b> e marque <b>Gráficos de plano de fundo</b></span><button onclick="window.print()">🖨 Imprimir / Salvar PDF</button></div>
      <div class="wrap">${html(meta,opts)}</div></body></html>`);
    win.document.close();
    let feito=false;
    const go=()=>{if(feito)return;feito=true;setTimeout(()=>{try{win.focus();win.print();}catch{}},300);};
    const imgs=[...win.document.images];
    Promise.all(imgs.map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r;})))
      .then(()=>(win.document.fonts?.ready||Promise.resolve())).then(go);
    setTimeout(go,4000);
  }

  window.MetricasIGReport={html,imprimir,isV2:m=>m?.dados_completos?.versao===2};
})();
