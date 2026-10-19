// Relatório de Métricas Instagram — usado no portal da cliente e no PDF (admin)
// Lê o registro de metricas_instagram com dados_completos.versao === 2 (gerado pelo Sincronizar do Pedro)
(function(){
  const C={brown:'#5C3D1E',gold:'#9B6B3A',beige:'#FAF8F2',line:'#E8DECE',muted:'#8A7A66',text:'#2B2118'};
  const fN=n=>(n||0).toLocaleString('pt-BR');
  const fP=n=>(n||0).toLocaleString('pt-BR',{maximumFractionDigits:1})+'%';
  const fD=s=>s?new Date(String(s).slice(0,10)+'T12:00:00').toLocaleDateString('pt-BR'):'—';
  const esc=t=>String(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const leg=p=>esc((p.caption||'').split('\n')[0].slice(0,70))||'<em style="color:'+C.muted+'">(sem legenda)</em>';
  const tipo=p=>p.produto==='REELS'?'Reels':p.media_type==='CAROUSEL_ALBUM'?'Carrossel':p.media_type==='VIDEO'?'Vídeo':'Foto';

  const box=(label,val,sub)=>`<div style="background:${C.beige};border:1px solid ${C.line};border-radius:12px;padding:14px 12px;break-inside:avoid">
    <div style="font-size:9px;color:${C.gold};text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px">${label}</div>
    <div style="font-size:22px;font-weight:700;color:${C.brown};line-height:1.1">${val}</div>
    ${sub?`<div style="font-size:10px;color:${C.muted};margin-top:4px;line-height:1.35">${sub}</div>`:''}</div>`;
  const titulo=t=>`<div style="font-size:11px;font-weight:700;color:${C.brown};text-transform:uppercase;letter-spacing:.1em;margin:26px 0 10px">${t}</div>`;
  const nota=t=>`<div style="font-size:10px;color:${C.muted};line-height:1.5;margin-top:6px">${t}</div>`;

  function html(meta,opts){
    opts=opts||{};
    const x=meta.dados_completos||{};
    const posts=[...(x.top_posts||[])];
    const grid=`display:grid;grid-template-columns:repeat(${opts.print?4:2},1fr);gap:10px`;
    const saldo=(x.novos_seg||0)-(x.deixaram_seg||0);
    const pctFora=meta.alcance>0?Math.round((x.alcance_nao_seguidores||0)/meta.alcance*100):0;
    const periodo=x.period_from?`${fD(x.period_from)} a ${fD(x.period_to)}`:fD(meta.data);

    const head=`<div style="text-align:center;padding-bottom:18px;margin-bottom:6px;border-bottom:2px solid ${C.line}">
      ${opts.print?`<img src="https://crm.marketingprimor.com.br/logo-texto.png.jpeg" style="height:48px;object-fit:contain;display:block;margin:0 auto 10px">`:''}
      <div style="font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:${C.gold};margin-bottom:6px">Relatório de Métricas Instagram</div>
      ${opts.nome?`<div style="font-size:22px;font-weight:300;color:${C.brown}">${esc(opts.nome)}</div>`:''}
      <div style="font-size:13px;color:${C.gold};margin-top:2px">${periodo}</div></div>`;

    const kpis=`${titulo('Visão geral')}
      <div style="${grid}">
        ${box('Seguidores',fN(meta.seguidores),`+${fN(x.novos_seg)} novos · −${fN(x.deixaram_seg)} saíram · saldo ${saldo>=0?'+':''}${saldo}`)}
        ${box('Alcance',fN(meta.alcance),`pessoas diferentes que viram o conteúdo · ${pctFora}% não seguem o perfil`)}
        ${box('Visualizações',fN(meta.impressoes),'vezes que o conteúdo apareceu na tela')}
        ${box('Visitas ao perfil',fN(meta.visitas_perfil),'pessoas que abriram o perfil')}
        ${box('Engajamento real',fP(x.eng_real),`${fN(x.contas_engajadas)} de ${fN(meta.alcance)} pessoas alcançadas interagiram`)}
        ${box('Engajamento por post',fP(x.eng_posts),'interações ÷ alcance, média dos posts')}
        ${box('Interações',fN(x.interacoes),`${fN(x.likes)} curtidas · ${fN(x.comments)} comentários · ${fN(x.saves_total)} salvamentos · ${fN(x.shares)} compartilhamentos`)}
        ${box('Cliques no link',fN(x.website_clicks),'link da bio')}
      </div>
      ${x.periodo_longo?nota('* Período com mais de 30 dias: o alcance é aproximado, porque a Meta só calcula pessoas únicas em janelas de até 30 dias.'):''}`;

    // Seguidores e formatos
    const comFollow=posts.filter(p=>(p.follows||0)>0).sort((a,b)=>b.follows-a.follows);
    const semAtrib=Math.max(0,(x.novos_seg||0)-(x.seg_posts||0));
    const fmtNome={REEL:'Reels',CAROUSEL_CONTAINER:'Carrossel',POST:'Foto',STORY:'Stories',AD:'Anúncios',IGTV:'Vídeo'};
    const af=Object.entries(x.alcance_formato||{}).sort((a,b)=>b[1]-a[1]);
    const afMax=af.length?af[0][1]:1;
    const seg=`<div style="display:grid;grid-template-columns:${opts.print?'1fr 1fr':'1fr'};gap:12px;margin-top:4px">
      <div style="border:1px solid ${C.line};border-radius:12px;padding:14px;break-inside:avoid">
        <div style="font-size:12px;font-weight:600;color:${C.brown};margin-bottom:8px">🧲 De onde vieram os novos seguidores</div>
        ${comFollow.map(p=>`<div style="display:flex;justify-content:space-between;gap:8px;font-size:11px;padding:4px 0;border-bottom:1px dashed ${C.line}"><span>${leg(p)} · ${fD(p.timestamp)}</span><strong style="color:${C.brown}">+${p.follows}</strong></div>`).join('')}
        <div style="display:flex;justify-content:space-between;font-size:11px;padding:4px 0"><span>${comFollow.length?'Reels, Stories, busca e perfil':'Reels, Stories, busca e perfil (nenhum post de feed trouxe seguidor direto)'}</span><strong style="color:${C.brown}">+${semAtrib}</strong></div>
        ${nota('A Meta só informa seguidores por post em fotos e carrosséis. Os que vieram de Reels e Stories aparecem juntos na última linha.')}
      </div>
      <div style="border:1px solid ${C.line};border-radius:12px;padding:14px;break-inside:avoid">
        <div style="font-size:12px;font-weight:600;color:${C.brown};margin-bottom:8px">📡 Alcance por formato</div>
        ${af.map(([k,v])=>`<div style="font-size:11px;margin-bottom:7px"><div style="display:flex;justify-content:space-between"><span>${fmtNome[k]||k}</span><strong>${fN(v)}</strong></div><div style="height:6px;background:${C.line};border-radius:3px;margin-top:3px"><div style="height:6px;width:${(v/afMax*100).toFixed(0)}%;background:${C.gold};border-radius:3px"></div></div></div>`).join('')||nota('Sem dados de formato.')}
        ${nota(`Seguidoras alcançadas: <strong>${fN(x.alcance_seguidores)}</strong> · Não seguidoras: <strong>${fN(x.alcance_nao_seguidores)}</strong>`)}
      </div></div>`;

    // Saiu da bolha
    const bolha=posts.filter(p=>p.saiu_bolha).sort((a,b)=>b.reach-a.reach);
    const bolhaHtml=`<div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;padding:14px 16px;break-inside:avoid">
      <div style="font-size:12px;font-weight:700;color:#1E40AF;margin-bottom:6px">🚀 O que é "Saiu da bolha"</div>
      <div style="font-size:11px;color:#1E3A8A;line-height:1.6">É quando o post foi mostrado para muita gente que <strong>não segue</strong> o perfil. Com ${fN(meta.seguidores)} seguidores, se um post alcança ${fN(Math.round((meta.seguidores||0)*3.5))} pessoas, pelo menos ${fN(Math.round((meta.seguidores||0)*2.5))} delas não seguem você: o Instagram levou esse conteúdo para pessoas novas (pelo Explorar, aba Reels, busca ou compartilhamentos). É assim que o perfil cresce.<br>
      O selo aparece quando o alcance do post é pelo menos 1,5× o número de seguidores. A coluna <strong>"Fora da base"</strong> mostra a parte mínima do alcance que com certeza veio de quem não segue.</div>
      ${bolha.length?`<div style="font-size:11px;color:#1E3A8A;margin-top:8px"><strong>Posts que saíram da bolha neste período:</strong> ${bolha.map(p=>`${leg(p).slice(0,40)} (${fD(p.timestamp)}, ${p.fora_base_pct}% fora da base)`).join(' · ')}</div>`
        :`<div style="font-size:11px;color:#1E3A8A;margin-top:8px">Neste período nenhum post saiu da bolha: o conteúdo ficou concentrado em quem já segue.</div>`}
      ${nota('A Meta não informa por API se foi especificamente o Explorar; o selo garante que o post foi distribuído para fora da base de seguidores.')}
    </div>`;

    // Turbinar
    const turb=posts.filter(p=>p.turbinar).sort((a,b)=>(b.score||0)-(a.score||0));
    const turbHtml=opts.semTurbinar?'':`<div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:14px 16px;margin-top:12px;break-inside:avoid">
      <div style="font-size:12px;font-weight:700;color:#92400E;margin-bottom:6px">💰 Posts com potencial para turbinar</div>
      ${turb.length?turb.map((p,i)=>`<div style="font-size:11px;color:#78350F;padding:3px 0"><strong>${i+1}. ${leg(p)}</strong> · ${fD(p.timestamp)}<br><span style="color:#92400E">${esc((p.motivos||[]).join(' · '))||'acima da média no conjunto das métricas'}</span></div>`).join('')
        :`<div style="font-size:11px;color:#92400E">Nenhum post ficou claramente acima da média neste período.</div>`}
      ${nota('Critério: salvamentos + compartilhamentos e engajamento por alcance (peso maior), alcance e alcance fora da base, comparados à média dos posts do período.')}
    </div>`;

    // Tabela de posts
    const ord=[...posts].sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp));
    const th=`padding:7px 5px;font-size:9px;color:${C.gold};font-weight:600;text-transform:uppercase;letter-spacing:.04em;text-align:center;background:#F5EFE7`;
    const td=`padding:7px 5px;font-size:11px;text-align:center;white-space:nowrap;color:${C.text}`;
    const selo=p=>`${p.turbinar&&!opts.semTurbinar?`<span style="font-size:9px;background:#FEF3C7;color:#92400E;border-radius:10px;padding:1px 6px;margin-right:3px">💰 Turbinar</span>`:''}${p.saiu_bolha?`<span style="font-size:9px;background:#DBEAFE;color:#1E40AF;border-radius:10px;padding:1px 6px">🚀 Saiu da bolha</span>`:''}`;
    const tabela=`<div style="overflow-x:auto;border:1px solid ${C.line};border-radius:12px">
      <table style="width:100%;border-collapse:collapse">
        <thead><tr><th style="${th};text-align:left">Post</th><th style="${th}">Alcance</th><th style="${th}">Views</th><th style="${th}">Curt.</th><th style="${th}">Com.</th><th style="${th}">Salv.</th><th style="${th}">Comp.</th><th style="${th}">+Seg</th><th style="${th}">Eng.</th><th style="${th}">Fora da base</th></tr></thead>
        <tbody>${ord.map(p=>`<tr style="border-top:1px solid ${C.line};break-inside:avoid">
          <td style="padding:7px 6px;font-size:11px;color:${C.text};min-width:${opts.print?'0':'200px'}">
            <div style="font-weight:500;line-height:1.3">${leg(p)}</div>
            <div style="font-size:9px;color:${C.muted};margin-top:2px">${fD(p.timestamp)} · ${tipo(p)}${p.avg_watch?` · ${String(p.avg_watch).replace('.',',')}s assistidos em média`:''}</div>
            ${(p.saiu_bolha||p.turbinar)?`<div style="margin-top:3px">${selo(p)}</div>`:''}
          </td>
          <td style="${td}"><strong>${fN(p.reach)}</strong></td><td style="${td}">${fN(p.views)}</td><td style="${td}">${fN(p.like_count)}</td><td style="${td}">${fN(p.comments_count)}</td><td style="${td}">${fN(p.saved)}</td><td style="${td}">${fN(p.shares)}</td>
          <td style="${td}">${p.follows==null?'—':fN(p.follows)}</td><td style="${td}"><strong>${fP(p.eng)}</strong></td><td style="${td}">${p.reach?p.fora_base_pct+'%':'—'}</td>
        </tr>`).join('')}</tbody>
      </table></div>
      ${nota('Eng. = (curtidas + comentários + salvamentos + compartilhamentos) ÷ alcance do post. "—" em +Seg: a Meta não informa seguidores para Reels.')}`;

    const glossario=`<div style="border-top:1px solid ${C.line};margin-top:22px;padding-top:12px;font-size:10px;color:${C.muted};line-height:1.7;break-inside:avoid">
      <strong style="color:${C.brown}">Como ler:</strong>
      <strong>Alcance</strong> = pessoas diferentes que viram. <strong>Visualizações</strong> = quantas vezes apareceu (a mesma pessoa pode ver várias vezes).
      <strong>Engajamento real</strong> = das pessoas alcançadas, quantas interagiram de verdade (cada pessoa conta uma vez).
      <strong>Salvamentos e compartilhamentos</strong> são os sinais que o Instagram mais valoriza para mostrar o post a mais gente.</div>`;

    return `<div style="font-family:Poppins,Arial,sans-serif;color:${C.text};background:#fff;${opts.print?'':`border:1px solid ${C.line};border-radius:16px;padding:20px 16px;`}">
      ${head}${kpis}
      ${titulo('Seguidores e formatos')}${seg}
      ${titulo('Distribuição e oportunidades')}${bolhaHtml}${turbHtml}
      ${titulo(`Todos os posts do período (${posts.length})`)}${tabela}
      ${glossario}
      ${opts.print?`<div style="margin-top:18px;padding-top:10px;border-top:1px solid ${C.line};display:flex;justify-content:space-between;font-size:9px;color:#C8B89A;text-transform:uppercase;letter-spacing:.1em"><span>Agência Primor · Estratégia · Criatividade · Resultados</span><span>Gerado em ${new Date().toLocaleDateString('pt-BR')}</span></div>`:''}
    </div>`;
  }

  // Abre janela de impressão (Salvar como PDF) — espera imagens carregarem antes de imprimir
  function imprimir(meta,opts){
    opts=Object.assign({},opts,{print:true});
    const win=window.open('','_blank','width=1000,height=800');
    if(!win){alert('O navegador bloqueou a janela do PDF. Permita pop-ups para crm.marketingprimor.com.br e tente de novo.');return;}
    const nome=(opts.nome||'metricas').replace(/[^\wÀ-ú -]/g,'');
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Métricas Instagram — ${nome}</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        @page{size:A4;margin:12mm}
        *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
        body{margin:0;background:#fff}
        .wrap{max-width:820px;margin:0 auto;padding:20px}
        thead{display:table-header-group}
        tr,img{break-inside:avoid;page-break-inside:avoid}
        .bar{position:sticky;top:0;background:#5C3D1E;color:#fff;padding:10px 16px;font:500 13px Poppins,Arial;display:flex;justify-content:space-between;align-items:center;gap:10px}
        .bar button{background:#fff;color:#5C3D1E;border:0;border-radius:8px;padding:7px 14px;font:600 12px Poppins,Arial;cursor:pointer}
        @media print{.bar{display:none}.wrap{padding:0;max-width:none}}
      </style></head><body>
      <div class="bar"><span>Na janela de impressão, escolha <b>Salvar como PDF</b></span><button onclick="window.print()">🖨 Imprimir / Salvar PDF</button></div>
      <div class="wrap">${html(meta,opts)}</div></body></html>`);
    win.document.close();
    const go=()=>{try{win.focus();win.print();}catch{}};
    const imgs=[...win.document.images];
    let feito=false;const fim=()=>{if(!feito){feito=true;setTimeout(go,300);}};
    Promise.all(imgs.map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r;}))).then(()=>{(win.document.fonts?.ready||Promise.resolve()).then(fim);});
    setTimeout(fim,3000);
  }

  window.MetricasIGReport={html,imprimir,isV2:m=>m?.dados_completos?.versao===2};
})();
