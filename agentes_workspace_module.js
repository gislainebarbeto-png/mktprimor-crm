// ═══════════════════════════════════════════════════════════════════════
// AGENTES WORKSPACE MODULE v2 — Marketing Primor CRM
// Supabase · Seletor de cliente · Calendário · Histórico completo
// ═══════════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  const SYS = {
    pedro:   `Você é Pedro — Estrategista de Conta e Head de Onboarding da Marketing Primor, agência de branding digital quiet luxury. No onboarding define persona, nicho, subnicho, posicionamento e arcos editoriais; cuida do contrato. Na gestão contínua é ponto de contato principal, faz briefing mensal para Chloe, diagnóstico de performance, apresenta resultados e identifica upsell. Responda em português, estratégico e orientado a resultados.`,
    chloe:   `Você é Chloe — Arquitetura da Informação e Planejamento de Conteúdo da Marketing Primor. Planeja 30 dias por cliente, cria copy, legendas, roteiros feed/carrossel/Reels com funil de vendas, briefing visual para Gabi. Usa diagnóstico do Pedro. Responda em português com criatividade e organização.`,
    gabi:    `Você é Gabi — Design Visual e Identidade de Marca da Marketing Primor. Cria posts, capas, moodboard, posicionamento visual. Domina hierarquia visual, cria de minimalista a dark/futurista. Recebe briefing da Chloe. Responda em português descrevendo conceitos visuais: paleta, tipografia, composição, referências.`,
    elvira:  `Você é Elvira — Analista Financeira da Marketing Primor. Controla receitas, despesas, lançamentos, fluxo de caixa, DRE, faturamento, lucro, ticket médio, custos fixos, impostos e margem de lucro. Responda em português com precisão. Organize dados em tabelas, calcule indicadores, sinalize riscos.`,
    barbeto: `Você é Barbeto — Gislaine Barbeto — Diretora e Gestora da Marketing Primor. Head de conteúdo e operações. Revisa tudo no dia seguinte ao produzido. Tem TDAH — prefere informações organizadas, diretas e acionáveis. Responda em português de forma estratégica e direta.`
  };

  const AGENTES = [
    { id:'pedro',   nome:'Pedro',   iniciais:'PE', tipo:'comercial', cargo:'Estrategista de Conta & Head de Onboarding',
      chips:['Onboarding','Briefing mensal','Resultados','Upsell'],
      abas:['onboarding','briefing','resultados','calendario','chat'],
      labels:{onboarding:'📋 Onboarding',briefing:'📄 Briefing',resultados:'📊 Resultados',calendario:'🗓 Calendário',chat:'💬 Chat IA'} },
    { id:'chloe',   nome:'Chloe',   iniciais:'CH', tipo:'content',   cargo:'Arquitetura da Informação & Conteúdo',
      chips:['Planejamento 30 dias','Copy & legendas','Roteiros Reels','Briefing Gabi'],
      abas:['planejamento','calendario','briefing_visual','chat'],
      labels:{planejamento:'📋 Planejamento',calendario:'🗓 Calendário',briefing_visual:'✏️ Briefing Visual',chat:'💬 Chat IA'} },
    { id:'gabi',    nome:'Gabi',    iniciais:'GA', tipo:'design',    cargo:'Design Visual & Identidade de Marca',
      chips:['Moodboard','Posts & carrossel','Identidade visual','Posicionamento'],
      abas:['moodboard','conceito','calendario','chat'],
      labels:{moodboard:'🎨 Moodboard',conceito:'✦ Conceito Visual',calendario:'🗓 Calendário',chat:'💬 Chat IA'} },
    { id:'elvira',  nome:'Elvira',  iniciais:'EL', tipo:'financial', cargo:'Analista Financeira',
      chips:['Dashboard','Lançamentos','DRE','Margem de lucro'],
      abas:['dashboard','lancamentos','dre','calendario','chat'],
      labels:{dashboard:'📊 Dashboard',lancamentos:'📝 Lançamentos',dre:'📈 DRE',calendario:'🗓 Calendário',chat:'💬 Chat IA'} },
    { id:'barbeto', nome:'Barbeto', iniciais:'GB', tipo:'director',  cargo:'Diretora & Gestora',
      chips:['Revisão diária','Aprovações','Atendimentos','Métricas'],
      abas:['revisao','aprovacoes','calendario','chat'],
      labels:{revisao:'✅ Revisão',aprovacoes:'◎ Aprovações',calendario:'🗓 Calendário',chat:'💬 Chat IA'} }
  ];

  let _ag=null,_aba=null,_cliente='',_data=_hoje();
  let _clientes=[],_fiscal={};
  let _chatHist={},_chatLoad=false;

  function _hoje(){return new Date().toISOString().slice(0,10);}
  function _fmtD(d){return d?new Date(d+'T12:00:00').toLocaleDateString('pt-BR'):'—';}
  function _R$(v){return 'R$\u00a0'+parseFloat(v||0).toLocaleString('pt-BR',{minimumFractionDigits:2});}
  function _now(){return new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});}
  function _v(id){const e=document.getElementById(id);return e?e.value.trim():'';}
  function _esc(t){return(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>').replace(/\n/g,'<br>');}
  function _flash(id,m){const e=document.getElementById(id);if(!e)return;e.textContent=m||'✓ Salvo';e.style.display='inline-block';setTimeout(()=>e.style.display='none',2200);}

  // SUPABASE
  async function _save(conteudo){
    try{const{error}=await db.from('agentes_trabalhos').upsert({agente_id:_ag.id,aba_id:_aba,client_email:_cliente,data:_data,conteudo},{onConflict:'agente_id,aba_id,client_email,data'});return!error;}catch{return false;}
  }
  async function _load(fb={}){
    try{const{data}=await db.from('agentes_trabalhos').select('conteudo').eq('agente_id',_ag.id).eq('aba_id',_aba).eq('client_email',_cliente).eq('data',_data).maybeSingle();return data?.conteudo||fb;}catch{return fb;}
  }
  async function _loadClientes(){
    try{const{data}=await db.from('clientes').select('email,nome').order('nome');_clientes=data||[];}catch{_clientes=[];}
  }
  async function _loadFiscal(email){
    if(!email){_fiscal={};return;}
    try{const{data}=await db.from('clientes_fiscal').select('*').eq('client_email',email).maybeSingle();_fiscal=data||{};}catch{_fiscal={};}
  }

  // Monta system prompt dinâmico com todos os dados do cliente no Supabase
  async function _buildSystemPrompt(agente_id, clienteEmail){
    const base=SYS[agente_id]||'';
    const hoje=new Date().toLocaleDateString('pt-BR');
    if(!clienteEmail)
      return base+`\n\nHoje é ${hoje}. Nenhum cliente selecionado — responda sobre a agência Marketing Primor em geral.`;

    const cliNome=_clientes.find(c=>c.email===clienteEmail)?.nome||clienteEmail;

    const [dossie,onb,brief,posts,demandas,metricas,conceito,plan,briefV,revis,lancs,perfil]=await Promise.all([
      // Dossiê completo do cliente (fonte primária — salvo na aba Dossiê)
      db.from('agentes_trabalhos').select('conteudo').eq('agente_id','dossie').eq('aba_id','perfil').eq('client_email',clienteEmail).eq('data','2099-12-31').maybeSingle().then(r=>r.data?.conteudo||{}).catch(()=>({})),
      // Onboarding Pedro (complementar)
      db.from('agentes_trabalhos').select('conteudo').eq('agente_id','pedro').eq('aba_id','onboarding').eq('client_email',clienteEmail).order('data',{ascending:false}).limit(1).maybeSingle().then(r=>r.data?.conteudo||{}).catch(()=>({})),
      // Briefing mensal Pedro → Chloe
      db.from('agentes_trabalhos').select('conteudo').eq('agente_id','pedro').eq('aba_id','briefing').eq('client_email',clienteEmail).order('data',{ascending:false}).limit(1).maybeSingle().then(r=>r.data?.conteudo||{}).catch(()=>({})),
      // Posts em produção
      db.from('posts').select('tema_titulo,status,data_post,tipo').eq('client_email',clienteEmail).in('status',['criacao','revisao','aprovado']).order('data_post',{ascending:false}).limit(8).then(r=>r.data||[]).catch(()=>[]),
      // Demandas abertas
      db.from('demandas').select('titulo,status,prazo,membro').neq('status','concluída').order('prazo',{ascending:true}).limit(5).then(r=>r.data||[]).catch(()=>[]),
      // Métricas dos últimos 3 meses
      db.from('metricas').select('mes,seguidores,alcance,impressoes,engajamento').eq('client_email',clienteEmail).order('mes',{ascending:false}).limit(3).then(r=>r.data||[]).catch(()=>[]),
      // Conceito visual Gabi (aba de trabalho)
      db.from('agentes_trabalhos').select('conteudo').eq('agente_id','gabi').eq('aba_id','conceito').eq('client_email',clienteEmail).order('data',{ascending:false}).limit(1).maybeSingle().then(r=>r.data?.conteudo||{}).catch(()=>({})),
      // Planejamento editorial Chloe
      db.from('agentes_trabalhos').select('conteudo').eq('agente_id','chloe').eq('aba_id','planejamento').eq('client_email',clienteEmail).order('data',{ascending:false}).limit(1).maybeSingle().then(r=>r.data?.conteudo||{}).catch(()=>({})),
      // Briefing visual Chloe → Gabi
      db.from('agentes_trabalhos').select('conteudo').eq('agente_id','chloe').eq('aba_id','briefing_visual').eq('client_email',clienteEmail).order('data',{ascending:false}).limit(1).maybeSingle().then(r=>r.data?.conteudo||{}).catch(()=>({})),
      // Revisões pendentes Barbeto
      db.from('barbeto_revisoes').select('agente,entrega,status').eq('status','pendente').order('created_at',{ascending:false}).limit(4).then(r=>r.data||[]).catch(()=>[]),
      // Lançamentos financeiros recentes
      db.from('elvira_lancamentos').select('data,tipo,descricao,valor').eq('client_email',clienteEmail).order('data',{ascending:false}).limit(5).then(r=>r.data||[]).catch(()=>[]),
      // Perfil básico (tabela clients)
      db.from('clients').select('nome,empresa,instagram').eq('email',clienteEmail).maybeSingle().then(r=>r.data||{}).catch(()=>({})),
    ]);

    // ── Cabeçalho ──────────────────────────────────────────────────────
    let ctx=`\n\n━━━ DOSSIÊ DO CLIENTE ━━━`;
    ctx+=`\nCliente: ${perfil.nome||cliNome}${perfil.empresa?` · ${perfil.empresa}`:''}`;
    const ig=dossie.instagram||perfil.instagram;
    if(ig) ctx+=` · @${ig}`;
    ctx+=`\nData de hoje: ${hoje}\n`;

    // ── Fiscal (da tabela clientes_fiscal via _fiscal) ──────────────
    if(_fiscal?.cnpj||_fiscal?.razao_social){
      ctx+=`\nDados fiscais: ${_fiscal.razao_social||''} · CNPJ ${_fiscal.cnpj||'N/A'}`;
      if(_fiscal.regime_tributario) ctx+=` · ${_fiscal.regime_tributario}`;
      if(_fiscal.valor_mensal) ctx+=` · R$${_fiscal.valor_mensal}/mês`;
      if(_fiscal.dia_vencimento) ctx+=` · venc. dia ${_fiscal.dia_vencimento}`;
      if(_fiscal.contrato_inicio) ctx+=` · contrato desde ${_fiscal.contrato_inicio}`;
    }

    // ── Dossiê principal (fonte primária) ──────────────────────────
    const nicho=dossie.nicho||onb.nicho;
    const persona=dossie.persona||onb.persona;
    const posicionamento=dossie.posicionamento||onb.posicionamento;

    if(nicho||persona||posicionamento){
      ctx+=`\n\nPerfil estratégico:`;
      if(nicho)         ctx+=`\n• Nicho: ${nicho}${(dossie.subnicho||onb.subnicho)?' · Sub: '+(dossie.subnicho||onb.subnicho):''}`;
      if(dossie.tom_voz)ctx+=`\n• Tom de voz: ${dossie.tom_voz}`;
      if(dossie.objetivo)ctx+=`\n• Objetivo: ${dossie.objetivo}`;
      if(persona)       ctx+=`\n• Persona: ${persona}`;
      if(posicionamento)ctx+=`\n• Posicionamento: ${posicionamento}`;
      if(dossie.diferenciais) ctx+=`\n• Diferenciais: ${dossie.diferenciais}`;
      if(dossie.concorrentes) ctx+=`\n• Concorrentes: ${dossie.concorrentes}`;
      const arcos=dossie.arcos||onb.arcos;
      if(arcos)         ctx+=`\n• Arcos editoriais: ${arcos}`;
    }

    // ── Redes sociais ──────────────────────────────────────────────
    const redes=[dossie.instagram&&`IG:@${dossie.instagram}`,dossie.tiktok&&`TT:@${dossie.tiktok}`,dossie.youtube&&`YT:${dossie.youtube}`,dossie.facebook&&`FB:${dossie.facebook}`,dossie.site&&`Site:${dossie.site}`].filter(Boolean);
    if(redes.length) ctx+=`\n• Redes: ${redes.join(' · ')}`;

    // ── Serviços contratados ───────────────────────────────────────
    if(dossie.servicos?.length){
      ctx+=`\n\nServiços contratados: ${dossie.servicos.join(', ')}`;
      if(dossie.qtd_posts) ctx+=`\n• ${dossie.qtd_posts} posts/mês`;
      if(dossie.plataformas) ctx+=` · ${dossie.plataformas}`;
    }

    // ── Identidade visual (dossie > gabi/conceito) ─────────────────
    const paleta=dossie.paleta||conceito.paleta;
    const fontes=dossie.fontes||conceito.fontes;
    const estetica=dossie.estetica||conceito.estetica;
    if(paleta||estetica){
      ctx+=`\n\nIdentidade visual:`;
      if(paleta)  ctx+=`\n• Paleta: ${paleta}`;
      if(fontes)  ctx+=`\n• Fontes: ${fontes}`;
      if(estetica)ctx+=`\n• Estética: ${estetica}`;
      const elem=dossie.elementos||conceito.elementos;
      if(elem)    ctx+=`\n• Elementos: ${elem}`;
      const nunca=dossie.nunca||conceito.nunca;
      if(nunca)   ctx+=`\n• ⚠ NUNCA: ${nunca}`;
    }

    // ── Briefing mensal Pedro ──────────────────────────────────────
    if(brief.foco||brief.bom){
      ctx+=`\n\nBriefing mensal (Pedro):`;
      if(brief.bom)      ctx+=`\n• Performou bem: ${brief.bom}`;
      if(brief.ruim)     ctx+=`\n• Não performou: ${brief.ruim}`;
      if(brief.foco)     ctx+=`\n• Foco do mês: ${brief.foco}`;
      if(brief.campanha) ctx+=`\n• Campanha: ${brief.campanha}`;
    }

    // ── Métricas recentes ──────────────────────────────────────────
    if(metricas.length){
      ctx+=`\n\nMétricas recentes:`;
      metricas.forEach(m=>ctx+=`\n• ${m.mes}: ${m.seguidores||'—'} seguidores · alcance ${m.alcance||'—'} · eng ${m.engajamento||'—'}%`);
    }

    // ── Posts em produção ──────────────────────────────────────────
    if(posts.length){
      ctx+=`\n\nPosts em produção (${posts.length}):`;
      posts.forEach(p=>ctx+=`\n• [${p.status}] ${p.tema_titulo||'sem título'} · ${p.tipo||''} · ${p.data_post||''}`);
    }

    // ── Planejamento Chloe ─────────────────────────────────────────
    if(plan.linha||plan.gancho){
      ctx+=`\n\nPlanejamento editorial (Chloe):`;
      if(plan.linha)  ctx+=`\n• Linha: ${plan.linha}`;
      if(plan.gancho) ctx+=`\n• Gancho: ${plan.gancho}`;
      if(plan.qtd_feed||plan.qtd_car||plan.qtd_reels)
        ctx+=`\n• Qtd: ${plan.qtd_feed||0} feed · ${plan.qtd_car||0} carrossel · ${plan.qtd_reels||0} reels`;
    }

    // ── Briefing visual Chloe → Gabi ───────────────────────────────
    if(briefV.titulo&&agente_id==='gabi'){
      ctx+=`\n\nBriefing visual mais recente:`;
      if(briefV.titulo)      ctx+=`\n• Post: ${briefV.titulo} · ${briefV.formato||''}`;
      if(briefV.tom)         ctx+=`\n• Tom: ${briefV.tom}`;
      if(briefV.elementos)   ctx+=`\n• Elementos: ${briefV.elementos}`;
      if(briefV.referencias) ctx+=`\n• Refs: ${briefV.referencias}`;
    }

    // ── Demandas abertas ───────────────────────────────────────────
    if(demandas.length){
      ctx+=`\n\nDemandas abertas:`;
      demandas.forEach(d=>ctx+=`\n• ${d.titulo} [${d.status}]${d.prazo?' · prazo '+d.prazo:''}${d.membro?' · '+d.membro:''}`);
    }

    // ── Revisões pendentes ─────────────────────────────────────────
    if(revis.length){
      ctx+=`\n\nRevisões pendentes (Barbeto):`;
      revis.forEach(r=>ctx+=`\n• ${r.agente}: ${(r.entrega||'').substring(0,80)}`);
    }

    // ── Lançamentos Elvira ─────────────────────────────────────────
    if(lancs.length&&agente_id==='elvira'){
      ctx+=`\n\nÚltimos lançamentos:`;
      lancs.forEach(l=>ctx+=`\n• ${l.data||''} · ${l.tipo} · ${l.descricao||''} · R$${l.valor||0}`);
    }

    if(dossie.obs_gerais) ctx+=`\n\nObs: ${dossie.obs_gerais}`;

    ctx+=`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    return base+ctx;
  }

  // CSS — tema escuro: preto + dourado (#ffd6ba/#68462f) | tema claro: bege + marrom (#8C7234/#2A1F0A)
  const CSS=`
    .aw2-lbl2{font-size:10px;font-weight:600;color:var(--text);letter-spacing:.14em;text-transform:uppercase;margin-bottom:16px;opacity:.7;}
    .aw2-grid{display:flex;flex-direction:column;gap:10px;}
    .aw2-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px 16px;cursor:pointer;transition:all .22s;position:relative;overflow:hidden;}
    .aw2-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:12px 0 0 12px;}
    .aw2-card.director::before{background:#C9A84C;}.aw2-card.content::before{background:#9B6B3A;}
    .aw2-card.design::before{background:#7A5230;}.aw2-card.financial::before{background:#4A5E3A;}.aw2-card.comercial::before{background:#6B8FA3;}
    .aw2-card:hover{border-color:var(--accent);box-shadow:var(--sh);transform:translateY(-1px);}
    .aw2-row{display:flex;align-items:center;gap:12px;}
    .aw2-av{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:600;flex-shrink:0;}
    .aw2-av.director{background:rgba(201,168,76,.15);color:#C9A84C;border:1px solid rgba(201,168,76,.3);}
    .aw2-av.content{background:rgba(155,107,58,.15);color:var(--text);border:1px solid rgba(155,107,58,.3);}
    .aw2-av.design{background:rgba(122,82,48,.15);color:var(--text);border:1px solid rgba(122,82,48,.3);}
    .aw2-av.financial{background:rgba(74,94,58,.15);color:var(--text);border:1px solid rgba(74,94,58,.3);}
    .aw2-av.comercial{background:rgba(107,143,163,.15);color:var(--text);border:1px solid rgba(107,143,163,.3);}
    .aw2-nm{font-size:15px;font-weight:500;color:var(--text);}.aw2-cg{font-size:10px;color:var(--muted);margin-top:2px;}
    .aw2-chips{margin-top:8px;padding-top:8px;border-top:1px solid var(--border);display:flex;flex-wrap:wrap;gap:5px;}
    .aw2-chip{font-size:10px;color:var(--muted);background:transparent;padding:2px 8px;border-radius:20px;border:1px solid var(--border);}
    .aw2-top{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
    .aw2-back{background:transparent;border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:12px;cursor:pointer;padding:6px 12px;transition:all .18s;}.aw2-back:hover{background:var(--beige);border-color:var(--accent);}
    .aw2-ctx{background:var(--surface);border:1px solid var(--accent);border-radius:10px;padding:12px 14px;margin-bottom:14px;display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end;}
    .aw2-cg2{display:flex;flex-direction:column;gap:3px;flex:1;min-width:130px;}
    .aw2-cl{font-size:9px;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;}
    .aw2-sel,.aw2-di{background:var(--bg);border:1px solid var(--border);border-radius:7px;padding:7px 10px;font-family:'Poppins',sans-serif;font-size:12px;color:var(--text);outline:none;width:100%;}.aw2-sel:focus,.aw2-di:focus{border-color:var(--accent);}
    .aw2-ftag{font-size:10px;border-radius:6px;padding:3px 8px;border:1px solid;}
    .aw2-ftag.ok{background:rgba(74,94,58,.15);color:#4aab2a;border-color:rgba(74,94,58,.4);}
    .aw2-ftag.warn{background:rgba(255,180,0,.08);color:#d4896a;border-color:rgba(212,137,106,.4);}
    .aw2-tabs{display:flex;gap:4px;overflow-x:auto;margin-bottom:14px;padding-bottom:2px;}
    .aw2-tab{flex-shrink:0;background:transparent;border:1px solid var(--border);border-radius:8px;padding:7px 12px;font-size:12px;color:var(--muted);cursor:pointer;transition:all .18s;white-space:nowrap;}
    .aw2-tab.active{background:var(--wine);color:#FAF8F2;border-color:var(--wine);}
    .aw2-tab:hover:not(.active){border-color:var(--accent);color:var(--text);}
    .aw2-form{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:12px;}
    .aw2-ft{font-size:13px;font-weight:500;color:var(--text);margin-bottom:12px;}
    .aw2-fg{margin-bottom:11px;}.aw2-fl{font-size:10px;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:3px;display:block;}
    .aw2-in,.aw2-s2,.aw2-ta{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:7px;padding:8px 11px;font-family:'Poppins',sans-serif;font-size:12px;color:var(--text);outline:none;transition:border-color .2s;}
    .aw2-in:focus,.aw2-s2:focus,.aw2-ta:focus{border-color:var(--accent);}
    .aw2-ta{resize:vertical;min-height:76px;line-height:1.6;}
    .aw2-r2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}.aw2-r3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;}
    .aw2-sr{display:flex;gap:8px;margin-top:14px;align-items:center;}
    .aw2-btn{background:var(--wine);color:#FAF8F2;border:none;border-radius:7px;padding:9px 18px;font-family:'Poppins',sans-serif;font-size:12px;cursor:pointer;transition:opacity .2s;}.aw2-btn:hover{opacity:.85;}
    .aw2-svd{font-size:11px;color:#4aab2a;padding:3px 10px;background:rgba(74,171,42,.1);border:1px solid rgba(74,171,42,.25);border-radius:6px;display:none;}
    .aw2-kpis{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;}
    .aw2-kpi{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px;}
    .aw2-kl{font-size:9px;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px;}
    .aw2-kv{font-size:21px;font-weight:500;color:var(--text);}.aw2-ks{font-size:10px;color:var(--muted);margin-top:2px;}
    .aw2-tbox{background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow-x:auto;margin-bottom:12px;}
    .aw2-tb{width:100%;border-collapse:collapse;font-size:12px;}
    .aw2-tb th{text-align:left;padding:8px 10px;font-size:9px;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid var(--border);}
    .aw2-tb td{padding:8px 10px;border-bottom:1px solid var(--border);color:var(--text);vertical-align:top;}.aw2-tb tr:last-child td{border-bottom:none;}
    .aw2-b{display:inline-block;padding:2px 7px;border-radius:20px;font-size:10px;}
    .aw2-b.receita{background:rgba(74,171,42,.12);color:#4aab2a;}.aw2-b.despesa{background:rgba(153,27,27,.12);color:#f87171;}
    .aw2-b.pendente{background:rgba(212,137,106,.12);color:#d4896a;}.aw2-b.aprovado{background:rgba(74,171,42,.12);color:#4aab2a;}.aw2-b.ajuste{background:rgba(153,27,27,.12);color:#f87171;}
    .aw2-b.concluído{background:rgba(74,171,42,.12);color:#4aab2a;}.aw2-b.feed{background:rgba(107,143,163,.15);color:#6B8FA3;}
    .aw2-b.carrossel{background:rgba(155,107,58,.12);color:var(--accent);}.aw2-b.reels{background:rgba(74,94,58,.12);color:#4A5E3A;}.aw2-b.tarefa{background:var(--border);color:var(--text);}.aw2-b.reunião{background:rgba(90,58,138,.12);color:#9B7FD4;}
    .aw2-del{background:none;border:none;color:var(--muted);cursor:pointer;font-size:13px;padding:0;}.aw2-del:hover{color:#f87171;}
    .aw2-ci-items{display:flex;flex-direction:column;gap:8px;}
    .aw2-ci-item{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:11px 13px;color:var(--text);}
    .aw2-ci-top{display:flex;align-items:center;gap:7px;margin-bottom:5px;}
    .aw2-refs{display:flex;flex-direction:column;gap:8px;margin-bottom:14px;}
    .aw2-ref{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:11px 13px;display:flex;align-items:flex-start;gap:10px;}
    .aw2-rtag{font-size:10px;color:#FAF8F2;padding:2px 7px;border-radius:20px;background:var(--wine);flex-shrink:0;}
    .aw2-rbody{flex:1;font-size:12px;color:var(--text);line-height:1.5;}
    .aw2-fi{background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:12px;margin-bottom:12px;}
    .aw2-fi-t{font-size:10px;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;}
    .aw2-fi-g{display:grid;grid-template-columns:1fr 1fr;gap:6px;}
    .aw2-fi-i{font-size:11px;color:var(--text);}.aw2-fi-i span{color:var(--muted);font-size:10px;display:block;}
    .aw2-chat{display:flex;flex-direction:column;height:440px;background:var(--bg);border:1px solid var(--border);border-radius:12px;overflow:hidden;}
    .aw2-cb{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;}
    .aw2-msg{max-width:84%;display:flex;flex-direction:column;gap:3px;}
    .aw2-msg.user{align-self:flex-end;align-items:flex-end;}.aw2-msg.agent{align-self:flex-start;}
    .aw2-bbl{padding:10px 14px;border-radius:12px;font-size:13px;line-height:1.7;word-break:break-word;color:var(--text);}
    .aw2-msg.user .aw2-bbl{background:var(--wine);color:#FAF8F2;border-radius:12px 12px 2px 12px;}
    .aw2-msg.agent .aw2-bbl{background:var(--surface);border:1px solid var(--border);border-radius:12px 12px 12px 2px;color:var(--text);}
    .aw2-mt{font-size:9px;color:var(--muted);}
    .aw2-typ{display:flex;gap:4px;padding:9px 13px;background:var(--surface);border:1px solid var(--border);border-radius:12px 12px 12px 2px;width:fit-content;}
    .aw2-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:awb .9s infinite;}
    .aw2-dot:nth-child(2){animation-delay:.2s;}.aw2-dot:nth-child(3){animation-delay:.4s;}
    @keyframes awb{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
    .aw2-cf{padding:9px;border-top:1px solid var(--border);display:flex;gap:7px;align-items:flex-end;background:var(--surface);}
    .aw2-ci2{flex:1;background:var(--bg);border:1px solid var(--border);border-radius:7px;padding:8px 11px;font-family:'Poppins',sans-serif;font-size:13px;color:var(--text);outline:none;resize:none;max-height:90px;overflow-y:auto;transition:border-color .2s;line-height:1.5;}.aw2-ci2:focus{border-color:var(--accent);}
    .aw2-cs{width:35px;height:35px;background:var(--wine);border:none;border-radius:7px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .2s;}.aw2-cs:hover{opacity:.85;}.aw2-cs:disabled{opacity:.3;cursor:not-allowed;}
    .aw2-key-box{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px 16px;margin-bottom:10px;}
    .aw2-key-title{font-size:12px;font-weight:500;color:var(--text);margin-bottom:8px;display:flex;align-items:center;gap:6px;}
    .aw2-key-in{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:7px;padding:8px 11px;font-family:'Poppins',sans-serif;font-size:12px;color:var(--text);outline:none;transition:border-color .2s;box-sizing:border-box;margin-bottom:8px;}.aw2-key-in:focus{border-color:var(--accent);}
    .aw2-key-btn{background:var(--wine);color:#FAF8F2;border:none;border-radius:7px;padding:7px 16px;font-family:'Poppins',sans-serif;font-size:12px;cursor:pointer;}
    .aw2-key-hint{font-size:10px;color:var(--muted);margin-top:6px;line-height:1.5;}
    .aw2-intro{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px;text-align:center;}
    .aw2-empty{text-align:center;color:var(--muted);padding:24px;font-size:12px;}
  `;
  function _css(){if(document.getElementById('aw2css'))return;const s=document.createElement('style');s.id='aw2css';s.textContent=CSS;document.head.appendChild(s);}

  function _ctx(){
    const opts=_clientes.map(c=>`<option value="${c.email}"${_cliente===c.email?' selected':''}>${c.nome||c.email}</option>`).join('');
    const tf=_fiscal?.cnpj,te=_cliente;
    return `<div class="aw2-ctx">
      <div class="aw2-cg2" style="flex:2"><div class="aw2-cl">Cliente</div>
        <select class="aw2-sel" onchange="_AW2.setCli(this.value)">
          <option value="">— Selecionar —</option>${opts}
        </select></div>
      <div class="aw2-cg2"><div class="aw2-cl">Data</div>
        <input type="date" class="aw2-di" value="${_data}" onchange="_AW2.setData(this.value)"></div>
      ${te&&tf?`<span class="aw2-ftag ok">✓ Fiscal</span>`:''}
      ${te&&!tf?`<span class="aw2-ftag warn">⚠ Sem fiscal</span>`:''}
    </div>`;
  }

  function _fiCard(){
    if(!_cliente||!_fiscal?.razao_social)return'';
    return `<div class="aw2-fi"><div class="aw2-fi-t">✦ ${_fiscal.razao_social||_fiscal.nome_fantasia}</div>
      <div class="aw2-fi-g">
        ${_fiscal.cnpj?`<div class="aw2-fi-i"><span>CNPJ</span>${_fiscal.cnpj}</div>`:''}
        ${_fiscal.regime_tributario?`<div class="aw2-fi-i"><span>Regime</span>${_fiscal.regime_tributario}</div>`:''}
        ${_fiscal.valor_mensal?`<div class="aw2-fi-i"><span>Mensalidade</span>${_R$(_fiscal.valor_mensal)}</div>`:''}
        ${_fiscal.dia_vencimento?`<div class="aw2-fi-i"><span>Vencimento</span>Dia ${_fiscal.dia_vencimento}</div>`:''}
        ${_fiscal.pix?`<div class="aw2-fi-i"><span>Pix</span>${_fiscal.pix}</div>`:''}
        ${_fiscal.responsavel?`<div class="aw2-fi-i"><span>Responsável</span>${_fiscal.responsavel}</div>`:''}
      </div></div>`;
  }

  function _hub(){
    document.getElementById('admin-main').innerHTML=`<div style="padding:20px 0">
      <div class="aw2-lbl2">Agentes IA · Marketing Primor</div>
      <div class="aw2-grid">${AGENTES.map(a=>`
        <div class="aw2-card ${a.tipo}" onclick="_AW2.open('${a.id}')">
          <div class="aw2-row">
            <div class="aw2-av ${a.tipo}">${a.iniciais}</div>
            <div style="flex:1"><div class="aw2-nm">${a.nome}</div><div class="aw2-cg">${a.cargo}</div></div>
            <div style="color:var(--copper);font-size:20px">›</div>
          </div>
          <div class="aw2-chips">${a.chips.map(c=>`<span class="aw2-chip">${c}</span>`).join('')}</div>
        </div>`).join('')}
      </div></div>`;
  }

  function _ws(){
    const ab=_aba||_ag.abas[0];
    const cliNomeWs=_cliente?(_clientes.find(c=>c.email===_cliente)?.nome||_cliente):'';
    document.getElementById('admin-main').innerHTML=`<div style="padding:20px 0">
      <div class="aw2-top">
        <button class="aw2-back" onclick="_AW2.goHub()">← Equipe</button>
        <div class="aw2-av ${_ag.tipo}" style="width:36px;height:36px;font-size:14px">${_ag.iniciais}</div>
        <div style="flex:1">
          <div style="font-size:16px;font-weight:500;color:var(--brown)">${_ag.nome}</div>
          <div style="font-size:10px;color:var(--muted)">${_ag.cargo}${cliNomeWs?` · <span style="color:var(--accent)">👤 ${cliNomeWs}</span>`:' · <span style="color:#d4896a">⚠ Selecione um cliente abaixo</span>'}</div>
        </div>
      </div>
      ${_ctx()}
      <div class="aw2-tabs">${_ag.abas.map(t=>`<div class="aw2-tab ${t===ab?'active':''}" onclick="_AW2.tab('${t}')">${_ag.labels[t]}</div>`).join('')}</div>
      <div id="aw2c"><div class="aw2-empty">Carregando...</div></div>
    </div>`;
    _aba=ab; _renderAba(ab);
  }

  async function _renderAba(id){
    _aba=id;
    document.querySelectorAll('.aw2-tab').forEach(t=>t.classList.toggle('active',t.textContent.trim()===_ag.labels[id]));
    const el=document.getElementById('aw2c');if(!el)return;
    el.innerHTML='<div class="aw2-empty">Carregando...</div>';
    let h='';
    switch(id){
      case'onboarding':    h=await _onboarding();break;
      case'briefing':      h=await _briefing();break;
      case'resultados':    h=await _resultados();break;
      case'planejamento':  h=await _planejamento();break;
      case'briefing_visual':h=await _briefVisual();break;
      case'moodboard':     h=await _moodboard();break;
      case'conceito':      h=await _conceito();break;
      case'dashboard':     h=await _dashboard();break;
      case'lancamentos':   h=await _lancamentos();break;
      case'dre':           h=await _dre();break;
      case'revisao':       h=await _revisao();break;
      case'aprovacoes':    h=await _aprovacoes();break;
      case'calendario':    h=await _calendario();break;
      case'chat':          h=_chat();el.innerHTML=h;_initChat();return;
    }
    el.innerHTML=h;
  }

  // PEDRO
  async function _onboarding(){
    const d=await _load({});
    return `${_fiCard()}<div class="aw2-form"><div class="aw2-ft">📋 Onboarding</div>
      <div class="aw2-r2">
        <div class="aw2-fg"><label class="aw2-fl">Contrato</label><select class="aw2-s2" id="on-c"><option ${d.contrato==='pendente'?'selected':''} value="pendente">pendente</option><option ${d.contrato==='assinado'?'selected':''} value="assinado">assinado</option><option ${d.contrato==='renovando'?'selected':''} value="renovando">renovando</option></select></div>
        <div class="aw2-fg"><label class="aw2-fl">Nicho</label><input class="aw2-in" id="on-n" value="${d.nicho||''}"></div>
      </div>
      <div class="aw2-fg"><label class="aw2-fl">Subnicho</label><input class="aw2-in" id="on-sn" value="${d.subnicho||''}"></div>
      <div class="aw2-fg"><label class="aw2-fl">Persona</label><textarea class="aw2-ta" id="on-p">${d.persona||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">Posicionamento</label><textarea class="aw2-ta" id="on-pos">${d.posicionamento||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">Arcos editoriais</label><textarea class="aw2-ta" style="min-height:100px" id="on-a">${d.arcos||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">Obs</label><textarea class="aw2-ta" id="on-o">${d.obs||''}</textarea></div>
      <div class="aw2-sr"><button class="aw2-btn" onclick="_AW2.saveOnboarding()">Salvar</button><span class="aw2-svd" id="on-s"></span></div>
    </div>`;
  }

  async function _briefing(){
    const d=await _load({});
    return `<div class="aw2-form"><div class="aw2-ft">📄 Briefing Mensal → Chloe</div>
      <div class="aw2-fg"><label class="aw2-fl">O que performou bem</label><textarea class="aw2-ta" id="br-b">${d.bom||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">O que não performou</label><textarea class="aw2-ta" id="br-r">${d.ruim||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">Foco do próximo mês</label><textarea class="aw2-ta" id="br-f">${d.foco||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">Campanha / data especial</label><input class="aw2-in" id="br-c" value="${d.campanha||''}"></div>
      <div class="aw2-fg"><label class="aw2-fl">Obs para Chloe</label><textarea class="aw2-ta" id="br-o">${d.obs||''}</textarea></div>
      <div class="aw2-sr"><button class="aw2-btn" onclick="_AW2.saveBriefing()">Salvar</button><span class="aw2-svd" id="br-s"></span></div>
    </div>`;
  }

  async function _resultados(){
    let rows=[];
    try{let q=db.from('agentes_trabalhos').select('data,conteudo,client_email').eq('agente_id','pedro').eq('aba_id','resultados').order('data',{ascending:false}).limit(60);if(_cliente)q=q.eq('client_email',_cliente);const{data}=await q;rows=(data||[]).map(r=>{const c=r.conteudo||{};const cli=_clientes.find(x=>x.email===r.client_email);return`<tr><td>${_fmtD(r.data)}</td><td>${cli?.nome||r.client_email||'—'}</td><td>${c.seguidores||'—'}</td><td>${c.alcance||'—'}</td><td>${c.engajamento||'—'}%</td><td>${c.crescimento||'—'}</td></tr>`;});}catch{}
    return `<div class="aw2-form" style="margin-bottom:12px"><div class="aw2-ft">📊 Novo Resultado</div>
      <div class="aw2-r2">
        <div class="aw2-fg"><label class="aw2-fl">Seguidores</label><input class="aw2-in" type="number" id="rs-s"></div>
        <div class="aw2-fg"><label class="aw2-fl">Alcance</label><input class="aw2-in" type="number" id="rs-a"></div>
      </div>
      <div class="aw2-r2">
        <div class="aw2-fg"><label class="aw2-fl">Engajamento (%)</label><input class="aw2-in" type="number" step="0.1" id="rs-e"></div>
        <div class="aw2-fg"><label class="aw2-fl">Crescimento</label><input class="aw2-in" id="rs-c" placeholder="+120 seguidores"></div>
      </div>
      <div class="aw2-sr"><button class="aw2-btn" onclick="_AW2.saveResultado()">Salvar</button><span class="aw2-svd" id="rs-sv"></span></div>
    </div>
    <div class="aw2-tbox"><table class="aw2-tb"><thead><tr><th>Data</th><th>Cliente</th><th>Seguidores</th><th>Alcance</th><th>Eng.</th><th>Crescimento</th></tr></thead>
    <tbody>${rows.join('')||'<tr><td colspan="6" class="aw2-empty">Sem resultados</td></tr>'}</tbody></table></div>`;
  }

  // CHLOE
  async function _planejamento(){
    const d=await _load({});
    return `<div class="aw2-form"><div class="aw2-ft">📋 Planejamento Editorial</div>
      <div class="aw2-fg"><label class="aw2-fl">Linha editorial (temas e pilares)</label><textarea class="aw2-ta" id="pl-l">${d.linha||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">Gancho central do mês</label><textarea class="aw2-ta" id="pl-g">${d.gancho||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">Datas e campanhas</label><input class="aw2-in" id="pl-d" value="${d.datas||''}"></div>
      <div class="aw2-r3">
        <div class="aw2-fg"><label class="aw2-fl">Qtd Feed</label><input class="aw2-in" type="number" id="pl-f" value="${d.qtd_feed||''}"></div>
        <div class="aw2-fg"><label class="aw2-fl">Qtd Carrossel</label><input class="aw2-in" type="number" id="pl-c" value="${d.qtd_car||''}"></div>
        <div class="aw2-fg"><label class="aw2-fl">Qtd Reels</label><input class="aw2-in" type="number" id="pl-r" value="${d.qtd_reels||''}"></div>
      </div>
      <div class="aw2-fg"><label class="aw2-fl">Inputs do Pedro</label><textarea class="aw2-ta" id="pl-o">${d.obs||''}</textarea></div>
      <div class="aw2-sr"><button class="aw2-btn" onclick="_AW2.savePlan()">Salvar</button><span class="aw2-svd" id="pl-s"></span></div>
    </div>`;
  }

  async function _briefVisual(){
    const d=await _load({});
    return `<div class="aw2-form"><div class="aw2-ft">✏️ Briefing Visual → Gabi</div>
      <div class="aw2-r2">
        <div class="aw2-fg"><label class="aw2-fl">Formato</label><select class="aw2-s2" id="bv-f"><option ${d.formato==='feed'?'selected':''} value="feed">Feed</option><option ${d.formato==='carrossel'?'selected':''} value="carrossel">Carrossel</option><option ${d.formato==='reels'?'selected':''} value="reels">Reels</option></select></div>
        <div class="aw2-fg"><label class="aw2-fl">Tom visual</label><input class="aw2-in" id="bv-t" placeholder="minimalista, dark..." value="${d.tom||''}"></div>
      </div>
      <div class="aw2-fg"><label class="aw2-fl">Pauta / título</label><input class="aw2-in" id="bv-ti" value="${d.titulo||''}"></div>
      <div class="aw2-fg"><label class="aw2-fl">Elementos obrigatórios</label><textarea class="aw2-ta" id="bv-e">${d.elementos||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">Referências</label><textarea class="aw2-ta" id="bv-r">${d.referencias||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">Texto no post</label><textarea class="aw2-ta" id="bv-tx">${d.texto||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">Obs para Gabi</label><textarea class="aw2-ta" id="bv-o">${d.obs||''}</textarea></div>
      <div class="aw2-sr"><button class="aw2-btn" onclick="_AW2.saveBriefV()">Salvar</button><span class="aw2-svd" id="bv-s"></span></div>
    </div>`;
  }

  // GABI
  async function _moodboard(){
    let refs=[];
    try{let q=db.from('gabi_moodboard').select('*').order('created_at',{ascending:false}).limit(80);if(_cliente)q=q.eq('client_email',_cliente);const{data}=await q;refs=data||[];}catch{}
    const TAGS=['Paleta','Tipografia','Composição','Foto','Ícone','Referência','Concorrente'];
    return `<div class="aw2-form" style="margin-bottom:12px"><div class="aw2-ft">🎨 Adicionar Referência</div>
      <div class="aw2-r2">
        <div class="aw2-fg"><label class="aw2-fl">Categoria</label><select class="aw2-s2" id="mb-t">${TAGS.map(t=>`<option>${t}</option>`).join('')}</select></div>
        <div class="aw2-fg"><label class="aw2-fl">Link</label><input class="aw2-in" id="mb-l" placeholder="https://..."></div>
      </div>
      <div class="aw2-fg"><label class="aw2-fl">Descrição / o que usar</label><textarea class="aw2-ta" id="mb-d"></textarea></div>
      <div class="aw2-sr"><button class="aw2-btn" onclick="_AW2.addRef()">+ Adicionar</button><span class="aw2-svd" id="mb-s"></span></div>
    </div>
    <div class="aw2-refs">${refs.map(r=>`
      <div class="aw2-ref"><span class="aw2-rtag">${r.tag||'Ref'}</span>
        <div class="aw2-rbody">${_esc(r.descricao)}${r.link?`<br><a href="${r.link}" target="_blank" style="color:var(--copper);font-size:11px">↗ abrir</a>`:''}</div>
        <button class="aw2-del" onclick="_AW2.delRef('${r.id}')">✕</button>
      </div>`).join('')||'<div class="aw2-empty">Moodboard vazio.</div>'}
    </div>`;
  }

  async function _conceito(){
    const d=await _load({});
    return `<div class="aw2-form"><div class="aw2-ft">✦ Conceito Visual</div>
      <div class="aw2-fg"><label class="aw2-fl">Paleta (hex)</label><input class="aw2-in" id="cv-p" placeholder="#F5EDE0, #5C2E14" value="${d.paleta||''}"></div>
      <div class="aw2-fg"><label class="aw2-fl">Fontes</label><input class="aw2-in" id="cv-f" placeholder="Cormorant + DM Sans" value="${d.fontes||''}"></div>
      <div class="aw2-fg"><label class="aw2-fl">Estética geral</label><textarea class="aw2-ta" id="cv-e">${d.estetica||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">Elementos recorrentes</label><textarea class="aw2-ta" id="cv-el">${d.elementos||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">NUNCA usar</label><textarea class="aw2-ta" id="cv-n">${d.nunca||''}</textarea></div>
      <div class="aw2-sr"><button class="aw2-btn" onclick="_AW2.saveConceito()">Salvar</button><span class="aw2-svd" id="cv-s"></span></div>
    </div>`;
  }

  // ELVIRA
  async function _dashboard(){
    let itens=[],cfg={aliquota:6,clientes_ativos:0};
    try{
      const now=new Date();const y=now.getFullYear();const m=String(now.getMonth()+1).padStart(2,'0');
      let q=db.from('elvira_lancamentos').select('*').gte('data',`${y}-${m}-01`).lte('data',`${y}-${m}-31`);
      if(_cliente)q=q.eq('client_email',_cliente);
      const{data}=await q;itens=data||[];
      const{data:c}=await db.from('agentes_trabalhos').select('conteudo').eq('agente_id','elvira').eq('aba_id','_cfg').eq('client_email',_cliente||'').maybeSingle().catch(()=>({data:null}));
      if(c?.conteudo)cfg=c.conteudo;
    }catch{}
    const rec=itens.filter(i=>i.tipo==='receita').reduce((s,i)=>s+parseFloat(i.valor||0),0);
    const dep=itens.filter(i=>i.tipo==='despesa').reduce((s,i)=>s+parseFloat(i.valor||0),0);
    const imp=rec*(cfg.aliquota/100);const lucro=rec-dep-imp;
    const margem=rec>0?((lucro/rec)*100).toFixed(1):0;
    const ticket=cfg.clientes_ativos>0?(rec/cfg.clientes_ativos).toFixed(2):0;
    return `<div class="aw2-kpis">
      <div class="aw2-kpi"><div class="aw2-kl">Faturamento</div><div class="aw2-kv">${_R$(rec)}</div><div class="aw2-ks">mês atual</div></div>
      <div class="aw2-kpi"><div class="aw2-kl">Lucro Líquido</div><div class="aw2-kv" style="color:${lucro>=0?'#3A5030':'#991B1B'}">${_R$(lucro)}</div><div class="aw2-ks">após impostos</div></div>
      <div class="aw2-kpi"><div class="aw2-kl">Margem</div><div class="aw2-kv">${margem}%</div></div>
      <div class="aw2-kpi"><div class="aw2-kl">Ticket Médio</div><div class="aw2-kv">${_R$(ticket)}</div>
        <div class="aw2-ks">Clientes: <input type="number" value="${cfg.clientes_ativos}" min="0" style="width:44px;border:1px solid var(--border);border-radius:4px;padding:1px 5px;font-size:11px;background:var(--beige)" onchange="_AW2.saveCfg('clientes_ativos',+this.value,${cfg.aliquota})"></div>
      </div>
    </div>
    <div class="aw2-tbox"><table class="aw2-tb"><thead><tr><th>Data</th><th>Descrição</th><th>Tipo</th><th>Valor</th></tr></thead>
    <tbody>${itens.slice(-8).reverse().map(i=>`<tr><td>${_fmtD(i.data)}</td><td>${_esc(i.descricao)}</td><td><span class="aw2-b ${i.tipo}">${i.tipo}</span></td><td style="font-weight:500;color:${i.tipo==='receita'?'#3A5030':'#991B1B'}">${i.tipo==='receita'?'+':'-'} ${_R$(i.valor)}</td></tr>`).join('')||'<tr><td colspan="4" class="aw2-empty">Sem lançamentos</td></tr>'}</tbody></table></div>`;
  }

  async function _lancamentos(){
    let itens=[];
    try{let q=db.from('elvira_lancamentos').select('*').order('data',{ascending:false}).limit(150);if(_cliente)q=q.eq('client_email',_cliente);const{data}=await q;itens=data||[];}catch{}
    return `<div class="aw2-form" style="margin-bottom:12px"><div class="aw2-ft">📝 Novo Lançamento</div>
      <div class="aw2-r2">
        <div class="aw2-fg"><label class="aw2-fl">Data</label><input class="aw2-in" type="date" id="lc-d" value="${_data}"></div>
        <div class="aw2-fg"><label class="aw2-fl">Tipo</label><select class="aw2-s2" id="lc-t"><option value="receita">receita</option><option value="despesa">despesa</option></select></div>
      </div>
      <div class="aw2-r2">
        <div class="aw2-fg"><label class="aw2-fl">Descrição</label><input class="aw2-in" id="lc-desc"></div>
        <div class="aw2-fg"><label class="aw2-fl">Categoria</label><select class="aw2-s2" id="lc-c"><option>Cliente</option><option>Salário</option><option>Software</option><option>Marketing</option><option>Imposto</option><option>Outros</option></select></div>
      </div>
      <div class="aw2-fg"><label class="aw2-fl">Valor (R$)</label><input class="aw2-in" type="number" step="0.01" id="lc-v"></div>
      <div class="aw2-sr"><button class="aw2-btn" onclick="_AW2.addLanc()">+ Registrar</button><span class="aw2-svd" id="lc-s"></span></div>
    </div>
    <div class="aw2-tbox"><table class="aw2-tb"><thead><tr><th>Data</th><th>Descrição</th><th>Cat.</th><th>Tipo</th><th>Valor</th><th></th></tr></thead>
    <tbody>${itens.map(i=>`<tr><td>${_fmtD(i.data)}</td><td>${_esc(i.descricao)}</td><td>${i.categoria||'—'}</td><td><span class="aw2-b ${i.tipo}">${i.tipo}</span></td><td style="font-weight:500;color:${i.tipo==='receita'?'#3A5030':'#991B1B'}">${i.tipo==='receita'?'+':'-'} ${_R$(i.valor)}</td><td><button class="aw2-del" onclick="_AW2.delLanc('${i.id}')">✕</button></td></tr>`).join('')||'<tr><td colspan="6" class="aw2-empty">Nenhum lançamento</td></tr>'}</tbody></table></div>`;
  }

  async function _dre(){
    let itens=[],cfg={aliquota:6};
    try{let q=db.from('elvira_lancamentos').select('tipo,valor');if(_cliente)q=q.eq('client_email',_cliente);const{data}=await q;itens=data||[];const{data:c}=await db.from('agentes_trabalhos').select('conteudo').eq('agente_id','elvira').eq('aba_id','_cfg').eq('client_email',_cliente||'').maybeSingle().catch(()=>({data:null}));if(c?.conteudo)cfg=c.conteudo;}catch{}
    const rec=itens.filter(i=>i.tipo==='receita').reduce((s,i)=>s+parseFloat(i.valor||0),0);
    const dep=itens.filter(i=>i.tipo==='despesa').reduce((s,i)=>s+parseFloat(i.valor||0),0);
    const lopOp=rec-dep;const imp=rec*(cfg.aliquota/100);const liq=lopOp-imp;const m=rec>0?((liq/rec)*100).toFixed(1):0;
    const row=(l,v,b,c)=>`<tr><td style="${b?'font-weight:500':''}">${l}</td><td style="text-align:right;${b?'font-weight:600':''}${c?`;color:${c}`:''}">${_R$(v)}</td></tr>`;
    return `<div class="aw2-form">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div class="aw2-ft" style="margin:0">📈 DRE — Demonstrativo de Resultado</div>
        <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--muted)">
          Alíquota: <input type="number" value="${cfg.aliquota}" min="0" max="100" step="0.1" style="width:46px;border:1px solid var(--border);border-radius:5px;padding:2px 6px;font-size:11px;background:var(--beige)" onchange="_AW2.saveCfg('aliquota',+this.value,${cfg.clientes_ativos||0})">%
        </div>
      </div>
      <table class="aw2-tb"><thead><tr><th>Descrição</th><th style="text-align:right">Valor</th></tr></thead><tbody>
        ${row('(+) Receita Bruta',rec,true)}
        ${row('(-) Despesas Operacionais',dep,false,'#991B1B')}
        ${row('(=) Lucro Operacional',lopOp,true,lopOp>=0?'#3A5030':'#991B1B')}
        ${row(`(-) Impostos (${cfg.aliquota}%)`,imp,false,'#991B1B')}
        ${row('(=) Lucro Líquido',liq,true,liq>=0?'#3A5030':'#991B1B')}
      </tbody></table>
      <div style="margin-top:12px;padding:10px;background:var(--beige);border-radius:8px;font-size:12px;color:var(--muted)">
        Margem de lucro: <strong style="color:var(--brown)">${m}%</strong>
      </div>
    </div>`;
  }

  // BARBETO
  async function _revisao(){
    let itens=[];
    try{const{data}=await db.from('barbeto_revisoes').select('*').gte('data',_data).order('created_at',{ascending:false}).limit(60);itens=data||[];}catch{}
    return `<div class="aw2-form" style="margin-bottom:12px"><div class="aw2-ft">✅ Registrar para revisão</div>
      <div class="aw2-r2">
        <div class="aw2-fg"><label class="aw2-fl">Agente</label><select class="aw2-s2" id="rv-a"><option>Chloe</option><option>Gabi</option><option>Pedro</option><option>Elvira</option></select></div>
        <div class="aw2-fg"><label class="aw2-fl">Data</label><input class="aw2-in" type="date" id="rv-d" value="${_data}"></div>
      </div>
      <div class="aw2-fg"><label class="aw2-fl">O que foi entregue</label><textarea class="aw2-ta" id="rv-e"></textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">Feedback da Barbeto</label><textarea class="aw2-ta" id="rv-f"></textarea></div>
      <div class="aw2-sr"><button class="aw2-btn" onclick="_AW2.addRevisao()">+ Adicionar</button><span class="aw2-svd" id="rv-s"></span></div>
    </div>
    <div class="aw2-tbox"><table class="aw2-tb"><thead><tr><th>Data</th><th>Agente</th><th>Entrega</th><th>Status</th></tr></thead>
    <tbody>${itens.map(r=>`<tr><td>${_fmtD(r.data)}</td><td>${r.agente}</td><td>${_esc((r.entrega||'').substring(0,60))}...</td>
      <td><select style="font-size:11px;border:1px solid var(--border);border-radius:5px;padding:2px 6px;background:var(--beige)" onchange="_AW2.updRev('${r.id}',this.value)">
        <option ${r.status==='pendente'?'selected':''} value="pendente">pendente</option>
        <option ${r.status==='aprovado'?'selected':''} value="aprovado">aprovado</option>
        <option ${r.status==='ajuste'?'selected':''} value="ajuste">ajuste</option>
      </select></td></tr>`).join('')||'<tr><td colspan="4" class="aw2-empty">Nenhuma entrega</td></tr>'}</tbody></table></div>`;
  }

  async function _aprovacoes(){
    let itens=[];
    try{const{data}=await db.from('barbeto_revisoes').select('*').order('data',{ascending:false}).limit(100);itens=data||[];}catch{}
    const p=itens.filter(i=>i.status==='pendente').length,a=itens.filter(i=>i.status==='aprovado').length,aj=itens.filter(i=>i.status==='ajuste').length;
    return `<div class="aw2-kpis" style="grid-template-columns:1fr 1fr 1fr">
      <div class="aw2-kpi"><div class="aw2-kl">Pendentes</div><div class="aw2-kv" style="color:#92400E">${p}</div></div>
      <div class="aw2-kpi"><div class="aw2-kl">Aprovados</div><div class="aw2-kv" style="color:#3A5030">${a}</div></div>
      <div class="aw2-kpi"><div class="aw2-kl">Ajuste</div><div class="aw2-kv" style="color:#991B1B">${aj}</div></div>
    </div>
    <div class="aw2-tbox"><table class="aw2-tb"><thead><tr><th>Data</th><th>Agente</th><th>Entrega</th><th>Status</th></tr></thead>
    <tbody>${itens.map(r=>`<tr><td>${_fmtD(r.data)}</td><td>${r.agente}</td><td>${_esc((r.entrega||'').substring(0,50))}...</td><td><span class="aw2-b ${r.status}">${r.status}</span></td></tr>`).join('')||'<tr><td colspan="4" class="aw2-empty">Sem registros</td></tr>'}</tbody></table></div>`;
  }

  // CALENDÁRIO (todos os agentes)
  async function _calendario(){
    let itens=[];
    try{let q=db.from('agentes_calendario').select('*').eq('agente_id',_ag.id).eq('data',_data).order('created_at');if(_cliente)q=q.eq('client_email',_cliente);const{data}=await q;itens=data||[];}catch{}
    const FMTS=['feed','carrossel','reels','tarefa','reunião'];
    const STS=['pendente','em andamento','concluído'];
    return `<div class="aw2-form" style="margin-bottom:12px"><div class="aw2-ft">🗓 Calendário — ${_fmtD(_data)}</div>
      <div class="aw2-r2">
        <div class="aw2-fg"><label class="aw2-fl">Tipo</label><select class="aw2-s2" id="cal-f">${FMTS.map(f=>`<option value="${f}">${f}</option>`).join('')}</select></div>
        <div class="aw2-fg"><label class="aw2-fl">Status</label><select class="aw2-s2" id="cal-st">${STS.map(s=>`<option value="${s}">${s}</option>`).join('')}</select></div>
      </div>
      <div class="aw2-fg"><label class="aw2-fl">Título / tarefa</label><input class="aw2-in" id="cal-ti"></div>
      <div class="aw2-fg"><label class="aw2-fl">Descrição</label><textarea class="aw2-ta" style="min-height:60px" id="cal-d"></textarea></div>
      <div class="aw2-sr"><button class="aw2-btn" onclick="_AW2.addCal()">+ Adicionar</button><span class="aw2-svd" id="cal-s"></span></div>
    </div>
    <div class="aw2-ci-items">${itens.map(i=>`
      <div class="aw2-ci-item">
        <div class="aw2-ci-top"><span class="aw2-b ${i.formato}">${i.formato}</span><span class="aw2-b ${i.status}">${i.status}</span><span style="flex:1"></span>
          <button class="aw2-del" onclick="_AW2.delCal('${i.id}')">✕</button></div>
        <div style="font-size:13px;font-weight:500;color:var(--brown)">${_esc(i.titulo)}</div>
        ${i.descricao?`<div style="font-size:12px;color:var(--muted);margin-top:3px">${_esc(i.descricao)}</div>`:''}
      </div>`).join('')||'<div class="aw2-empty">Nenhum item para este dia.</div>'}
    </div>`;
  }

  // CHAT
  function _chat(){
    const cliNome=_cliente?(_clientes.find(c=>c.email===_cliente)?.nome||_cliente):'';
    const savedKey=window.PRIMOR_CONFIG?.googleKey||window.GOOGLE_KEY||localStorage.getItem('primor_google_key')||'';
    const hasKey=!!savedKey;
    const keyPreview=hasKey?savedKey.substring(0,18)+'…':'';
    const keyBox=`<div class="aw2-key-box">
      <div class="aw2-key-title">🔑 Chave API Google Gemini${hasKey?` <span style="font-size:10px;color:#4aab2a;font-weight:400">✓ configurada</span>`:''}</div>
      ${hasKey?`<div style="font-size:11px;color:var(--muted);margin-bottom:6px;">${keyPreview}</div>`:''}
      <input class="aw2-key-in" id="aw2ki" type="password" placeholder="AIzaSy..." ${hasKey?'':'required'}>
      <button class="aw2-key-btn" onclick="_AW2.saveKey()">${hasKey?'Atualizar chave':'Salvar chave'}</button>
      <div class="aw2-key-hint">Obtenha em aistudio.google.com → Get API Key. Salva só neste navegador.</div>
    </div>`;
    const cliBox=!_cliente?`<div style="background:rgba(212,137,106,0.08);border:1px solid rgba(212,137,106,0.3);border-radius:10px;padding:12px 14px;margin-bottom:10px;">
      <div style="font-size:11px;color:#d4896a;font-weight:500;margin-bottom:8px;">👤 Selecione o cliente para eu ter contexto</div>
      <select class="aw2-sel" onchange="_AW2.setCli(this.value)" style="width:100%;">
        <option value="">— Selecionar cliente —</option>
        ${_clientes.map(c=>`<option value="${c.email}">${c.nome||c.email}</option>`).join('')}
      </select>
    </div>`:'';
    return `<div class="aw2-chat">
      <div class="aw2-cb" id="aw2msgs">
        ${keyBox}
        ${cliBox}
        <div class="aw2-intro">
          <strong style="font-size:14px;color:var(--text);display:block;margin-bottom:3px">✦ ${_ag.nome}</strong>
          <span style="font-size:12px;color:var(--muted)">${_ag.cargo}${cliNome?` · 👤 ${cliNome}`:''}</span><br>
          <span style="font-size:11px;color:var(--muted)">${hasKey?(cliNome?'Pronta para receber sua tarefa.':'Selecione um cliente acima para contexto completo.'):'Configure a chave acima para começar.'}</span>
        </div>
      </div>
      <div class="aw2-cf">
        <textarea class="aw2-ci2" id="aw2ci" rows="1" placeholder="Digite sua tarefa ou pergunta..."
          onkeydown="_AW2.chatKey(event)" oninput="_AW2.chatRes(this)"></textarea>
        <button class="aw2-cs" id="aw2cs" onclick="_AW2.chatSend()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#FAF8F2"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>`;
  }

  function _initChat(){
    if(!_chatHist[_ag.id])_chatHist[_ag.id]=[];
    const msgs=document.getElementById('aw2msgs');
    if(msgs&&_chatHist[_ag.id].length)_chatHist[_ag.id].forEach(m=>_addMsg(m.role,m.content));
    document.getElementById('aw2ci')?.focus();
  }

  function _addMsg(role,text){
    const el=document.getElementById('aw2msgs');if(!el)return;
    const d=document.createElement('div');d.className=`aw2-msg ${role==='user'?'user':'agent'}`;
    d.innerHTML=`<div class="aw2-bbl">${_esc(text)}</div><div class="aw2-mt">${_now()}</div>`;
    el.appendChild(d);el.scrollTop=el.scrollHeight;
  }

  // API PÚBLICA
  window._AW2={
    goHub(){_ag=null;_aba=null;_hub();},
    async open(id){_ag=AGENTES.find(a=>a.id===id);_aba=null;await _loadClientes();if(_cliente)await _loadFiscal(_cliente);_ws();},
    tab(id){_renderAba(id);},
    async setCli(email){_cliente=email;await _loadFiscal(email);_ws();},
    setData(d){_data=d||_hoje();_renderAba(_aba);},
    // Pedro
    async saveOnboarding(){const ok=await _save({contrato:_v('on-c'),nicho:_v('on-n'),subnicho:_v('on-sn'),persona:_v('on-p'),posicionamento:_v('on-pos'),arcos:_v('on-a'),obs:_v('on-o')});_flash('on-s',ok?'✓ Salvo':'⚠ Erro');},
    async saveBriefing(){const ok=await _save({bom:_v('br-b'),ruim:_v('br-r'),foco:_v('br-f'),campanha:_v('br-c'),obs:_v('br-o')});_flash('br-s',ok?'✓ Salvo':'⚠ Erro');},
    async saveResultado(){const ok=await _save({seguidores:_v('rs-s'),alcance:_v('rs-a'),engajamento:_v('rs-e'),crescimento:_v('rs-c')});_flash('rs-sv',ok?'✓ Salvo':'⚠ Erro');if(ok)_renderAba('resultados');},
    // Chloe
    async savePlan(){const ok=await _save({linha:_v('pl-l'),gancho:_v('pl-g'),datas:_v('pl-d'),qtd_feed:_v('pl-f'),qtd_car:_v('pl-c'),qtd_reels:_v('pl-r'),obs:_v('pl-o')});_flash('pl-s',ok?'✓ Salvo':'⚠ Erro');},
    async saveBriefV(){const ok=await _save({formato:_v('bv-f'),tom:_v('bv-t'),titulo:_v('bv-ti'),elementos:_v('bv-e'),referencias:_v('bv-r'),texto:_v('bv-tx'),obs:_v('bv-o')});_flash('bv-s',ok?'✓ Salvo':'⚠ Erro');},
    // Gabi
    async addRef(){try{await db.from('gabi_moodboard').insert({client_email:_cliente||'',tag:_v('mb-t'),link:_v('mb-l'),descricao:_v('mb-d')});_flash('mb-s','✓ Adicionado');_renderAba('moodboard');}catch{_flash('mb-s','⚠ Erro');}},
    async delRef(id){try{await db.from('gabi_moodboard').delete().eq('id',id);_renderAba('moodboard');}catch{}},
    async saveConceito(){const ok=await _save({paleta:_v('cv-p'),fontes:_v('cv-f'),estetica:_v('cv-e'),elementos:_v('cv-el'),nunca:_v('cv-n')});_flash('cv-s',ok?'✓ Salvo':'⚠ Erro');},
    // Elvira
    async addLanc(){try{await db.from('elvira_lancamentos').insert({client_email:_cliente||'',data:_v('lc-d'),tipo:_v('lc-t'),categoria:_v('lc-c'),descricao:_v('lc-desc'),valor:parseFloat(_v('lc-v'))||0});_flash('lc-s','✓ Registrado');_renderAba('lancamentos');}catch{_flash('lc-s','⚠ Erro');}},
    async delLanc(id){try{await db.from('elvira_lancamentos').delete().eq('id',id);_renderAba('lancamentos');}catch{}},
    async saveCfg(key,val){try{const{data:c}=await db.from('agentes_trabalhos').select('conteudo').eq('agente_id','elvira').eq('aba_id','_cfg').eq('client_email',_cliente||'').maybeSingle().catch(()=>({data:null}));const cfg=c?.conteudo||{aliquota:6,clientes_ativos:0};cfg[key]=val;await db.from('agentes_trabalhos').upsert({agente_id:'elvira',aba_id:'_cfg',client_email:_cliente||'',data:_data,conteudo:cfg},{onConflict:'agente_id,aba_id,client_email,data'});}catch{}},
    // Barbeto
    async addRevisao(){try{await db.from('barbeto_revisoes').insert({agente:_v('rv-a'),client_email:_cliente||'',data:_v('rv-d'),entrega:_v('rv-e'),feedback:_v('rv-f'),status:'pendente'});_flash('rv-s','✓ Adicionado');_renderAba('revisao');}catch{_flash('rv-s','⚠ Erro');}},
    async updRev(id,status){try{await db.from('barbeto_revisoes').update({status}).eq('id',id);}catch{}},
    // Calendário
    async addCal(){try{await db.from('agentes_calendario').insert({agente_id:_ag.id,client_email:_cliente||'',data:_data,formato:_v('cal-f'),titulo:_v('cal-ti'),descricao:_v('cal-d'),status:_v('cal-st')});_flash('cal-s','✓ Adicionado');_renderAba('calendario');}catch{_flash('cal-s','⚠ Erro');}},
    async delCal(id){try{await db.from('agentes_calendario').delete().eq('id',id);_renderAba('calendario');}catch{}},
    // Chat
    saveKey(){
      const k=(document.getElementById('aw2ki')?.value||'').trim();
      if(!k)return;
      localStorage.setItem('primor_google_key',k);
      window.GOOGLE_KEY=k;
      _renderAba('chat');
    },
    chatKey(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();this.chatSend();}},
    chatRes(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,90)+'px';},
    async chatSend(){
      const inp=document.getElementById('aw2ci');const text=inp?.value?.trim();
      if(!text||_chatLoad||!_ag)return;
      inp.value='';this.chatRes(inp);_chatLoad=true;document.getElementById('aw2cs').disabled=true;
      if(!_chatHist[_ag.id])_chatHist[_ag.id]=[];
      _addMsg('user',text);_chatHist[_ag.id].push({role:'user',content:text});
      const msgs=document.getElementById('aw2msgs');
      const td=document.createElement('div');td.id='aw2td';td.className='aw2-msg agent';
      td.innerHTML='<div class="aw2-typ"><div class="aw2-dot"></div><div class="aw2-dot"></div><div class="aw2-dot"></div></div>';
      msgs?.appendChild(td);if(msgs)msgs.scrollTop=msgs.scrollHeight;
      try{
        const key=window.PRIMOR_CONFIG?.googleKey||window.GOOGLE_KEY||localStorage.getItem('primor_google_key')||'';
        if(!key){
          document.getElementById('aw2td')?.remove();
          _addMsg('agent','⚠️ Chave Google Gemini não configurada. Obtenha em aistudio.google.com e configure no config.js.');
          _chatLoad=false;document.getElementById('aw2cs').disabled=false;return;
        }
        const systemPrompt=await _buildSystemPrompt(_ag.id,_cliente);
        const model='gemini-1.5-flash';
        const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            system_instruction:{parts:[{text:systemPrompt}]},
            contents:_chatHist[_ag.id].map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]}))
          })
        });
        const data=await res.json();
        document.getElementById('aw2td')?.remove();
        if(!res.ok){
          const errDetail=data.error?.message||`HTTP ${res.status}`;
          _addMsg('agent',`⚠️ Erro da API: ${errDetail}`);
          _chatLoad=false;document.getElementById('aw2cs').disabled=false;return;
        }
        const reply=data.candidates?.[0]?.content?.parts?.[0]?.text||'Erro ao processar.';
        _chatHist[_ag.id].push({role:'assistant',content:reply});_addMsg('agent',reply);
      }catch(e){
        document.getElementById('aw2td')?.remove();
        _addMsg('agent','⚠️ Erro de rede: '+e.message);
      }
      _chatLoad=false;document.getElementById('aw2cs').disabled=false;document.getElementById('aw2ci')?.focus();
    }
  };

  function inject(){
    if(typeof Admin==='undefined'||typeof db==='undefined'){setTimeout(inject,150);return;}
    _css();
    const savedKey=localStorage.getItem('primor_google_key');
    if(savedKey&&!window.GOOGLE_KEY)window.GOOGLE_KEY=savedKey;
    Admin.renderAgentes=async function(){await _loadClientes();_hub();};
  }
  inject();
})();
