// ───────────────────────────────────────────────────────────────────────
// DASHBOARD HOME MODULE — Marketing Primor CRM
// KPIs · Gráficos SVG · Demandas · Posts · Calendário mini
// ───────────────────────────────────────────────────────────────────────
(function(){
  'use strict';

  // ── CSS ──────────────────────────────────────────────────────────────
  /* Paleta dourado frio */
  const G1='#ffd6ba', G2='#d4896a', G3='#68462f', GB='rgba(255,214,186,0.18)', GBG='rgba(104,70,47,0.15)';

  const CSS=`
    .dh-wrap{padding:20px 0;animation:dhIn .35s ease;}
    @keyframes dhIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

    /* HEADER */
    .dh-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:22px;flex-wrap:wrap;gap:10px;}
    .dh-title{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:400;color:#ffd6ba;letter-spacing:.02em;}
    .dh-subtitle{font-size:11px;color:rgba(255,214,186,0.5);margin-top:2px;letter-spacing:.08em;text-transform:uppercase;}
    .dh-date{font-size:11px;color:#ffd6ba;background:#000;border:1px solid rgba(196,163,82,0.28);border-radius:8px;padding:6px 12px;}

    /* KPIs */
    .dh-kpis{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:16px;}
    .dh-kpi{background:linear-gradient(135deg,rgba(104,70,47,0.25),rgba(0,0,0,0.9));border:1px solid rgba(255,214,186,0.18);border-radius:12px;padding:14px 16px;position:relative;overflow:hidden;transition:border-color .2s,box-shadow .2s;}
    .dh-kpi:hover{border-color:rgba(255,214,186,0.45);box-shadow:0 0 20px rgba(104,70,47,0.2);}
    .dh-kpi-accent{position:absolute;top:0;left:0;right:0;height:2px;border-radius:12px 12px 0 0;}
    .dh-kpi-icon{font-size:18px;margin-bottom:6px;opacity:0.7;}
    .dh-kpi-val{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:500;color:#ffd6ba;line-height:1;}
    .dh-kpi-lbl{font-size:9px;color:rgba(255,214,186,0.5);letter-spacing:.1em;text-transform:uppercase;margin-top:4px;}
    .dh-kpi-delta{font-size:10px;margin-top:7px;display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:10px;}
    .dh-kpi-delta.up{background:rgba(104,70,47,0.3);color:#ffd6ba;}
    .dh-kpi-delta.neu{background:rgba(104,70,47,0.15);color:rgba(255,214,186,0.5);}

    /* CHARTS ROW */
    .dh-charts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;}
    .dh-chart-box{background:linear-gradient(135deg,rgba(104,70,47,0.2),rgba(0,0,0,0.9));border:1px solid rgba(255,214,186,0.15);border-radius:12px;padding:14px;}
    .dh-chart-title{font-size:10px;font-weight:500;color:rgba(255,214,186,0.5);letter-spacing:.1em;text-transform:uppercase;margin-bottom:12px;}
    .dh-donut-wrap{display:flex;align-items:center;gap:14px;}
    .dh-legend{display:flex;flex-direction:column;gap:6px;flex:1;}
    .dh-leg-item{display:flex;align-items:center;gap:7px;font-size:11px;color:#ffd6ba;}
    .dh-leg-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
    .dh-leg-pct{margin-left:auto;color:rgba(255,214,186,0.5);font-size:10px;}
    .dh-bar-wrap{width:100%;}

    /* BOTTOM GRID */
    .dh-bottom{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
    .dh-list-box{background:linear-gradient(135deg,rgba(104,70,47,0.2),rgba(0,0,0,0.9));border:1px solid rgba(255,214,186,0.15);border-radius:12px;padding:14px;}
    .dh-list-title{font-size:10px;font-weight:500;color:rgba(255,214,186,0.5);letter-spacing:.1em;text-transform:uppercase;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;}
    .dh-list-title a{font-size:10px;color:#ffd6ba;cursor:pointer;font-weight:400;text-decoration:none;opacity:0.7;}
    .dh-list-title a:hover{opacity:1;}
    .dh-list-item{display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,214,186,0.1);}
    .dh-list-item:last-child{border-bottom:none;}
    .dh-list-icon{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;}
    .dh-list-body{flex:1;min-width:0;}
    .dh-list-name{font-size:12px;font-weight:500;color:#ffd6ba;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .dh-list-meta{font-size:10px;color:rgba(255,214,186,0.45);margin-top:2px;}
    .dh-badge{display:inline-block;padding:2px 7px;border-radius:20px;font-size:9px;font-weight:500;letter-spacing:.04em;}
    .dh-b-pend{background:rgba(104,70,47,0.3);color:#D4B870;}
    .dh-b-prod{background:rgba(140,114,52,0.15);color:#ffd6ba;}
    .dh-b-aprov{background:rgba(255,214,186,0.15);color:#D4B870;}
    .dh-b-rev{background:rgba(104,70,47,0.15);color:rgba(255,214,186,0.6);}

    /* MINI CALENDAR */
    .dh-cal{font-size:11px;}
    .dh-cal-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
    .dh-cal-month{font-size:12px;font-weight:500;color:#ffd6ba;}
    .dh-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center;}
    .dh-cal-dow{font-size:9px;color:rgba(255,214,186,0.4);padding:2px 0;letter-spacing:.06em;}
    .dh-cal-day{padding:4px 2px;border-radius:6px;color:rgba(196,163,82,0.7);cursor:default;font-size:11px;line-height:1.4;}
    .dh-cal-day.today{background:rgba(255,214,186,0.2);border:1px solid rgba(196,163,82,0.5);color:#C4A352!important;font-weight:600;}
    .dh-cal-day.other{color:rgba(255,214,186,0.2);}
    .dh-empty{text-align:center;color:rgba(255,214,186,0.4);padding:20px;font-size:12px;}

    /* LOADING SKELETON */
    .dh-skel{background:linear-gradient(90deg,#140a05 25%,#2d1508 50%,#140a05 75%);background-size:200% 100%;animation:skelAnim 1.5s infinite;border-radius:8px;height:14px;margin:4px 0;}
    @keyframes skelAnim{0%{background-position:200% 0}100%{background-position:-200% 0}}

    @media(max-width:600px){
      .dh-kpis,.dh-charts,.dh-bottom{grid-template-columns:1fr;}
    }
  `;

  // ── GRÁFICOS SVG ──────────────────────────────────────────────────────

  function donut(data,size=110){
    const total=data.reduce((s,d)=>s+d.value,0)||1;
    const r=42,cx=55,cy=55,sw=16;
    const circ=2*Math.PI*r;
    let offset=0;
    const segs=data.map(d=>{
      const pct=d.value/total;
      const dash=pct*circ;
      const s=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${d.color}" stroke-width="${sw}" stroke-dasharray="${dash.toFixed(2)} ${(circ-dash).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" transform="rotate(-90 ${cx} ${cy})" stroke-linecap="round"/>`;
      offset+=dash;
      return s;
    });
    return `<svg viewBox="0 0 110 110" width="${size}" height="${size}" style="flex-shrink:0">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(104,70,47,0.3)" stroke-width="${sw}"/>
      ${segs.join('')}
      <text x="${cx}" y="${cy-4}" text-anchor="middle" font-size="18" font-weight="600" fill="#ffd6ba" font-family="Cormorant Garamond,serif">${total}</text>
      <text x="${cx}" y="${cy+12}" text-anchor="middle" font-size="8" fill="rgba(255,214,186,0.45)" letter-spacing="0.05em" font-family="Poppins,sans-serif">TOTAL</text>
    </svg>`;
  }

  function bars(data,h=90){
    if(!data.length)return'';
    const max=Math.max(...data.map(d=>d.v),1);
    const W=280,PAD=4,n=data.length;
    const bw=(W-(n-1)*PAD)/n;
    const WINE='#68462f',ROSE='#d4896a',ROSELT='rgba(255,214,186,0.4)';
    const colors=[WINE,ROSE,ROSELT,WINE,ROSE,ROSELT,WINE,ROSE,ROSELT,WINE,ROSE,ROSELT];
    const rects=data.map((d,i)=>{
      const bh=Math.max((d.v/max)*(h-24),2);
      const x=i*(bw+PAD),y=h-24-bh;
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="3" fill="${colors[i%3]}"/>
              <text x="${(x+bw/2).toFixed(1)}" y="${(h-6).toFixed(1)}" text-anchor="middle" font-size="8" fill="rgba(255,214,186,0.45)" font-family="Poppins,sans-serif">${d.l}</text>
              ${d.v>0?`<text x="${(x+bw/2).toFixed(1)}" y="${(y-3).toFixed(1)}" text-anchor="middle" font-size="8" fill="#ffd6ba" font-family="Poppins,sans-serif">${d.v}</text>`:''}`;
    });
    return `<svg viewBox="0 0 ${W} ${h}" width="100%" height="${h}" preserveAspectRatio="none">${rects.join('')}</svg>`;
  }

  // ── MINI CALENDAR ────────────────────────────────────────────────────
  function miniCal(){
    const now=new Date();
    const y=now.getFullYear(),m=now.getMonth();
    const today=now.getDate();
    const MESES=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const first=new Date(y,m,1).getDay();
    const days=new Date(y,m+1,0).getDate();
    const prevDays=new Date(y,m,0).getDate();
    let cells='';
    const DOWS=['D','S','T','Q','Q','S','S'];
    const dow=DOWS.map(d=>`<div class="dh-cal-dow">${d}</div>`).join('');
    for(let i=first-1;i>=0;i--)cells+=`<div class="dh-cal-day other">${prevDays-i}</div>`;
    for(let d=1;d<=days;d++)cells+=`<div class="dh-cal-day${d===today?' today':''}">${d}</div>`;
    const total=first+days;const rem=7-(total%7);
    if(rem<7)for(let i=1;i<=rem;i++)cells+=`<div class="dh-cal-day other">${i}</div>`;
    return `<div class="dh-cal">
      <div class="dh-cal-header"><span class="dh-cal-month">${MESES[m]} ${y}</span></div>
      <div class="dh-cal-grid">${dow}${cells}</div>
    </div>`;
  }

  // ── RENDER ───────────────────────────────────────────────────────────
  async function render(){
    const el=document.getElementById('admin-main');
    if(!el)return;

    const hoje=new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});
    el.innerHTML=`<div class="dh-wrap">
      <div class="dh-header">
        <div><div class="dh-title">Dashboard</div><div class="dh-subtitle">Visão geral da Agência Primor</div></div>
        <div class="dh-date">📅 ${hoje.charAt(0).toUpperCase()+hoje.slice(1)}</div>
      </div>
      <div class="dh-kpis" id="dh-kpis">
        ${[1,2,3,4].map(()=>`<div class="dh-kpi"><div class="dh-skel" style="width:40%"></div><div class="dh-skel" style="width:60%;height:28px;margin:8px 0 4px"></div><div class="dh-skel" style="width:70%"></div></div>`).join('')}
      </div>
      <div class="dh-charts" id="dh-charts">
        <div class="dh-chart-box"><div class="dh-chart-title">Posts por Status</div><div class="dh-skel" style="height:100px"></div></div>
        <div class="dh-chart-box"><div class="dh-chart-title">Atividade Mensal</div><div class="dh-skel" style="height:100px"></div></div>
      </div>
      <div class="dh-bottom" id="dh-bottom">
        <div class="dh-list-box"><div class="dh-skel" style="height:200px"></div></div>
        <div class="dh-list-box"><div class="dh-skel" style="height:200px"></div></div>
      </div>
    </div>`;

    let posts=[],demandas=[],clientes=[],lancamentos=[];
    try{
      const[p,d,c,l]=await Promise.all([
        db.from('posts').select('status,data_post,client_email').order('data_post',{ascending:false}).limit(200),
        db.from('demandas').select('id,titulo,status,created_at,client_email').order('created_at',{ascending:false}).limit(50),
        db.from('clientes').select('email,nome').limit(200),
        db.from('elvira_lancamentos').select('tipo,valor,data').limit(500)
      ]);
      posts=p.data||[];demandas=d.data||[];clientes=c.data||[];lancamentos=l.data||[];
    }catch(e){console.warn('Dashboard: erro ao carregar dados',e);}

    const now=new Date();const y=now.getFullYear();const m=String(now.getMonth()+1).padStart(2,'0');
    const mesIni=`${y}-${m}-01`;

    const pCriacao=posts.filter(p=>p.status==='criacao'||p.status==='criação').length;
    const pDesign=posts.filter(p=>p.status==='design').length;
    const pRevisao=posts.filter(p=>p.status==='revisao'||p.status==='revisão').length;
    const pAprov=posts.filter(p=>p.status==='aprovado').length;
    const pPub=posts.filter(p=>p.status==='publicado').length;
    const totalPosts=posts.length;

    const dPend=demandas.filter(d=>d.status==='pendente'||d.status==='aberta'||d.status==='open').length;
    const totalClientes=clientes.length;
    const recMes=lancamentos.filter(l=>l.tipo==='receita'&&l.data>=mesIni).reduce((s,l)=>s+parseFloat(l.valor||0),0);

    const meses=[];
    for(let i=5;i>=0;i--){
      const d=new Date(y,now.getMonth()-i,1);
      const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const lbl=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][d.getMonth()];
      const count=posts.filter(p=>p.data_post&&p.data_post.startsWith(k)).length
        +demandas.filter(dm=>dm.created_at&&dm.created_at.startsWith(k)).length;
      meses.push({l:lbl,v:count});
    }

    const WINE='#68462f',ROSE='#d4896a',ROSELT='rgba(255,214,186,0.35)';

    document.getElementById('dh-kpis').innerHTML=`
      <div class="dh-kpi">
        <div class="dh-kpi-accent" style="background:linear-gradient(90deg,${WINE},${ROSE})"></div>
        <div class="dh-kpi-icon">▦</div>
        <div class="dh-kpi-val">${totalPosts}</div>
        <div class="dh-kpi-lbl">Posts Total</div>
        <div class="dh-kpi-delta neu">↗ ${pPub} publicados</div>
      </div>
      <div class="dh-kpi">
        <div class="dh-kpi-accent" style="background:linear-gradient(90deg,${ROSE},${ROSELT})"></div>
        <div class="dh-kpi-icon">⊞</div>
        <div class="dh-kpi-val">${demandas.length}</div>
        <div class="dh-kpi-lbl">Demandas</div>
        <div class="dh-kpi-delta ${dPend>0?'neu':'up'}">${dPend>0?`⚠ ${dPend} pendentes`:'✓ Em dia'}</div>
      </div>
      <div class="dh-kpi">
        <div class="dh-kpi-accent" style="background:linear-gradient(90deg,${ROSELT},${WINE})"></div>
        <div class="dh-kpi-icon">◎</div>
        <div class="dh-kpi-val">${totalClientes}</div>
        <div class="dh-kpi-lbl">Clientes Ativos</div>
        <div class="dh-kpi-delta up">✦ Atendimento seletivo</div>
      </div>
      <div class="dh-kpi">
        <div class="dh-kpi-accent" style="background:linear-gradient(90deg,${WINE},${ROSELT})"></div>
        <div class="dh-kpi-icon">◈</div>
        <div class="dh-kpi-val">R$${recMes>999?`${(recMes/1000).toFixed(1)}k`:recMes.toFixed(0)}</div>
        <div class="dh-kpi-lbl">Receita do Mês</div>
        <div class="dh-kpi-delta up">↑ Faturamento</div>
      </div>`;

    const postData=[
      {label:'Criação',value:pCriacao,color:'#ffd6ba'},
      {label:'Design',value:pDesign,color:'#d4896a'},
      {label:'Revisão',value:pRevisao,color:'#68462f'},
      {label:'Aprovado',value:pAprov,color:'rgba(255,214,186,0.35)'},
      {label:'Publicado',value:pPub,color:'rgba(255,214,186,0.2)'},
    ].filter(d=>d.value>0);

    const totalDonut=postData.reduce((s,d)=>s+d.value,0)||1;
    const leg=postData.map(d=>`
      <div class="dh-leg-item">
        <div class="dh-leg-dot" style="background:${d.color}"></div>
        <span>${d.label}</span>
        <span class="dh-leg-pct">${Math.round(d.value/totalDonut*100)}%</span>
      </div>`).join('');

    document.getElementById('dh-charts').innerHTML=`
      <div class="dh-chart-box">
        <div class="dh-chart-title">Posts por Status</div>
        <div class="dh-donut-wrap">
          ${postData.length?donut(postData):'<div class="dh-empty" style="padding:20px">Sem posts</div>'}
          <div class="dh-legend">${leg}</div>
        </div>
      </div>
      <div class="dh-chart-box">
        <div class="dh-chart-title">Atividade — Últimos 6 Meses</div>
        <div class="dh-bar-wrap">${bars(meses)}</div>
        <div style="margin-top:8px;display:flex;gap:12px;font-size:10px;color:var(--muted)">
          <div><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:#C4A352;margin-right:4px;"></span><span style="color:rgba(255,214,186,0.5);font-size:10px">Posts + Demandas</span></div>
        </div>
      </div>`;

    const demPend=demandas.filter(d=>d.status!=='concluida'&&d.status!=='concluído'&&d.status!=='done').slice(0,5);
    const postRecentes=posts.slice(0,5);

    const statusBadge=s=>{
      const map={
        'pendente':'dh-b-pend','aberta':'dh-b-pend','open':'dh-b-pend',
        'em andamento':'dh-b-prod','producao':'dh-b-prod','in_progress':'dh-b-prod',
        'criacao':'dh-b-prod','criação':'dh-b-prod','design':'dh-b-prod',
        'revisao':'dh-b-rev','revisão':'dh-b-rev',
        'aprovado':'dh-b-aprov','publicado':'dh-b-aprov',
        'concluida':'dh-b-aprov','concluído':'dh-b-aprov'
      };
      return`<span class="dh-badge ${map[s]||'dh-b-pend'}">${s||'—'}</span>`;
    };

    const cliName=email=>clientes.find(c=>c.email===email)?.nome||email||'—';
    const relDate=iso=>{
      if(!iso)return'—';
      const d=new Date(iso);const now=new Date();
      const diff=Math.floor((now-d)/(1000*60*60*24));
      if(diff===0)return'hoje';if(diff===1)return'ontem';if(diff<7)return`${diff}d atrás`;
      return d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'});
    };

    const demList=demPend.length
      ?demPend.map(d=>`
        <div class="dh-list-item">
          <div class="dh-list-icon" style="background:${WINE}22">⊞</div>
          <div class="dh-list-body">
            <div class="dh-list-name">${d.titulo||'Sem título'}</div>
            <div class="dh-list-meta">${cliName(d.client_email)} · ${relDate(d.created_at)}</div>
          </div>
          ${statusBadge(d.status)}
        </div>`).join('')
      :`<div class="dh-empty">✓ Nenhuma demanda pendente</div>`;

    const postList=postRecentes.length
      ?postRecentes.map(p=>`
        <div class="dh-list-item">
          <div class="dh-list-icon" style="background:${ROSE}22">▦</div>
          <div class="dh-list-body">
            <div class="dh-list-name">${cliName(p.client_email)}</div>
            <div class="dh-list-meta">${p.data_post?new Date(p.data_post+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}):'—'}</div>
          </div>
          ${statusBadge(p.status)}
        </div>`).join('')
      :`<div class="dh-empty">Nenhum post cadastrado</div>`;

    document.getElementById('dh-bottom').innerHTML=`
      <div class="dh-list-box">
        <div class="dh-list-title">
          Demandas Pendentes
          <a onclick="Admin.tab('demandas')">Ver todas →</a>
        </div>
        ${demList}
      </div>
      <div class="dh-list-box">
        <div class="dh-list-title">
          Posts Recentes
          <a onclick="Admin.tab('posts')">Ver todos →</a>
        </div>
        ${postList}
        <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border)">
          ${miniCal()}
        </div>
      </div>`;
  }

  // ── INJEÇÃO ──────────────────────────────────────────────────────────
  function inject(){
    if(typeof Admin==='undefined'||typeof db==='undefined'){setTimeout(inject,150);return;}
    if(Admin._dashPatched)return;
    Admin._dashPatched=true;

    if(!document.getElementById('dh-css')){
      const s=document.createElement('style');s.id='dh-css';s.textContent=CSS;document.head.appendChild(s);
    }

    const sidebar=document.getElementById('admin-sidebar')||document.querySelector('[class*="sidebar"],[id*="sidebar"]');
    if(sidebar&&!document.getElementById('nav-inicio')){
      const navItem=document.createElement('div');
      navItem.className='nav-item';navItem.id='nav-inicio';navItem.title='Início';
      navItem.innerHTML='<span class="ni">⬡</span><span class="nl">Dashboard</span>';
      navItem.onclick=()=>Admin.tab('inicio');
      const firstNav=sidebar.querySelector('.nav-item');
      if(firstNav)sidebar.insertBefore(navItem,firstNav);
      else sidebar.appendChild(navItem);
    }

    Admin.renderDashboard=render;

    const origTab=Admin.tab.bind(Admin);
    Admin.tab=async function(name,...args){
      document.getElementById('nav-inicio')?.classList.toggle('active',name==='inicio');
      if(name==='inicio'){
        document.querySelectorAll('.nav-item:not(#nav-inicio)').forEach(el=>el.classList.remove('active'));
        this.loader(true);
        try{await render();}catch(e){console.error('Dashboard error:',e);}
        this.loader(false);
        return;
      }
      document.getElementById('nav-inicio')?.classList.remove('active');
      return origTab(name,...args);
    };

    // Abertura controlada pelo netflix_module (grid de cards)
  }

  if(document.readyState!=='loading')inject();
  else document.addEventListener('DOMContentLoaded',inject);
  setTimeout(inject,500);
})();
