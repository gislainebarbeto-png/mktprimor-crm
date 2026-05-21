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
      chips:['Onboarding','Diagnóstico','SWOT','Briefing mensal'],
      abas:['onboarding','diagnostico','concorrentes','swot','pilares','briefing','resultados','arquivos','calendario','chat'],
      labels:{onboarding:'📋 Onboarding',diagnostico:'📊 Diagnóstico',concorrentes:'🔍 Concorrentes',swot:'⚡ SWOT',pilares:'🎯 Pilares',briefing:'📄 Briefing Mensal',resultados:'📈 Resultados',arquivos:'📁 Arquivos',calendario:'🗓 Calendário',chat:'💬 Chat IA'} },
    { id:'chloe',   nome:'Chloe',   iniciais:'CH', tipo:'content',   cargo:'Arquitetura da Informação & Conteúdo',
      chips:['Planejamento 30 dias','Copy & legendas','Roteiros Reels','Briefing Gabi'],
      abas:['planejamento','copy','roteiros','calendario_posts','briefing_visual','arquivos','calendario','chat'],
      labels:{planejamento:'📋 Planejamento',copy:'✍️ Copy & Legendas',roteiros:'🎬 Roteiros Reels',calendario_posts:'📅 Calendário Posts',briefing_visual:'✏️ Briefing Visual',arquivos:'📁 Arquivos',calendario:'🗓 Calendário',chat:'💬 Chat IA'} },
    { id:'gabi',    nome:'Gabi',    iniciais:'GA', tipo:'design',    cargo:'Design Visual & Identidade de Marca',
      chips:['Moodboard','Conceito visual','Briefing designer','Revisão de posts'],
      abas:['moodboard','conceito','briefing_designer','posts_revisao','arquivos','calendario','chat'],
      labels:{moodboard:'🎨 Moodboard',conceito:'✦ Conceito Visual',briefing_designer:'📝 Briefing Designer',posts_revisao:'🖼 Posts p/ Revisão',arquivos:'📁 Arquivos',calendario:'🗓 Calendário',chat:'💬 Chat IA'} },
    { id:'elvira',  nome:'Elvira',  iniciais:'EL', tipo:'financial', cargo:'Analista Financeira',
      chips:['Dashboard','Lançamentos','DRE','Por cliente'],
      abas:['dashboard','lancamentos','dre','financeiro_cliente','arquivos','calendario','chat'],
      labels:{dashboard:'📊 Dashboard',lancamentos:'💰 Lançamentos',dre:'📈 DRE',financeiro_cliente:'👥 Por Cliente',arquivos:'📁 Arquivos',calendario:'🗓 Calendário',chat:'💬 Chat IA'} },
    { id:'barbeto', nome:'Barbeto', iniciais:'GB', tipo:'director',  cargo:'Diretora & Gestora',
      chips:['Aprovações','Checklist','Painel geral','Calendário'],
      abas:['aprovacoes','checklist','painel','arquivos','calendario','chat'],
      labels:{aprovacoes:'✅ Aprovações',checklist:'📋 Checklist',painel:'◎ Painel Geral',arquivos:'📁 Arquivos',calendario:'🗓 Calendário',chat:'💬 Chat IA'} }
  ];

  let _ag=null,_aba=null,_cliente='',_data=_hoje();
  let _clientes=[],_fiscal={};
  let _chatHist={},_chatLoad=false;
  let _arquivosDocs=[];
  let _dgFrom='',_dgTo='';

  function _histKey(){return 'primor_chat_'+(_ag?_ag.id:'x')+'__'+(_cliente||'geral');}
  function _histSaveLocal(){
    if(!_ag)return;
    try{localStorage.setItem(_histKey(),JSON.stringify((_chatHist[_ag.id]||[]).slice(-120)));}catch(e){}
  }
  function _histInsertMsg(role,content){
    if(!_ag)return;
    db.from('agentes_chat_historico').insert({agente_id:_ag.id,client_email:_cliente||'',role,content}).then(()=>{},()=>{});
  }
  function _histLoad(){
    if(!_ag)return;
    try{const raw=localStorage.getItem(_histKey());_chatHist[_ag.id]=raw?JSON.parse(raw):[];}catch(e){_chatHist[_ag.id]=[];}
  }
  async function _histLoadRemote(){
    if(!_ag)return;
    try{
      const{data}=await db.from('agentes_chat_historico').select('role,content').eq('agente_id',_ag.id).eq('client_email',_cliente||'').order('created_at',{ascending:true}).limit(120);
      if(data?.length){
        _chatHist[_ag.id]=data.map(r=>({role:r.role,content:r.content}));
        try{localStorage.setItem(_histKey(),JSON.stringify(_chatHist[_ag.id]));}catch(e){}
      }
    }catch(e){}
  }

  // NOTIFICAÇÕES
  function _notificar(destinatario,mensagem,tipo='info',ref_id=''){
    if(!destinatario||!mensagem)return;
    db.from('agentes_notificacoes').insert({destinatario,remetente:_ag?.id||'',client_email:_cliente||'',mensagem,tipo,ref_id,lido:false}).then(()=>{},()=>{});
  }
  async function _loadNotifCounts(){
    try{const{data}=await db.from('agentes_notificacoes').select('destinatario').eq('lido',false);const c={};(data||[]).forEach(r=>{c[r.destinatario]=(c[r.destinatario]||0)+1;});return c;}catch{return{};}
  }
  async function _loadNotifs(){
    if(!_ag)return[];
    try{const{data}=await db.from('agentes_notificacoes').select('*').eq('destinatario',_ag.id).eq('lido',false).order('created_at',{ascending:false}).limit(20);return data||[];}catch{return[];}
  }
  function _marcarLidas(){
    if(!_ag)return;
    db.from('agentes_notificacoes').update({lido:true}).eq('destinatario',_ag.id).eq('lido',false).then(()=>{},()=>{});
  }

  function _hoje(){return new Date().toISOString().slice(0,10);}
  function _fmtD(d){return d?new Date(d+'T12:00:00').toLocaleDateString('pt-BR'):'—';}
  function _R$(v){return 'R$\u00a0'+parseFloat(v||0).toLocaleString('pt-BR',{minimumFractionDigits:2});}
  function _now(){return new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});}
  function _v(id){const e=document.getElementById(id);return e?e.value.trim():'';}
  function _esc(t){return(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>').replace(/\n/g,'<br>');}
  function _flash(id,m){const e=document.getElementById(id);if(!e)return;e.textContent=m||'✓ Salvo';e.style.display='inline-block';setTimeout(()=>e.style.display='none',2200);}

  // Busca token do Instagram — tenta clients primeiro, depois instagram_tokens
  async function _getIGCreds(email){
    const{data:cli}=await db.from('clients').select('instagram_token,instagram_account_id').eq('email',email).maybeSingle();
    if(cli?.instagram_token&&cli?.instagram_account_id)
      return{tok:cli.instagram_token,aid:cli.instagram_account_id};
    const{data:tok}=await db.from('instagram_tokens').select('access_token,ig_user_id').eq('client_email',email).maybeSingle();
    if(tok?.access_token&&tok?.ig_user_id)
      return{tok:tok.access_token,aid:tok.ig_user_id};
    return null;
  }

  // Busca insights paginando automaticamente (Meta API retorna máx ~30 dias por página)
  // Lança erro com mensagem real da API se a primeira página falhar
  async function _insightsPaged(url){
    const totals={};
    let next=url;
    let guard=0;
    let firstPage=true;
    while(next&&guard++<50){
      const r=await fetch(next).then(r=>r.json());
      if(r.error){
        // Na primeira página: erro crítico — lança para o caller ver
        if(firstPage)throw new Error(`[Meta API ${r.error.code}] ${r.error.message}`);
        break; // páginas seguintes: para silenciosamente
      }
      firstPage=false;
      (r.data||[]).forEach(m=>{
        if(!totals[m.name])totals[m.name]=0;
        (m.values||[]).forEach(v=>{totals[m.name]+=(v.value||0);});
      });
      next=r.paging?.next||null;
    }
    return totals;
  }

  // SUPABASE
  async function _save(conteudo){
    try{const{error}=await db.from('agentes_trabalhos').upsert({agente_id:_ag.id,aba_id:_aba,client_email:_cliente,data:_data,conteudo},{onConflict:'agente_id,aba_id,client_email,data'});return!error;}catch{return false;}
  }
  async function _load(fb={}){
    try{const{data}=await db.from('agentes_trabalhos').select('conteudo').eq('agente_id',_ag.id).eq('aba_id',_aba).eq('client_email',_cliente).eq('data',_data).maybeSingle();return data?.conteudo||fb;}catch{return fb;}
  }
  async function _loadClientes(){
    try{const{data}=await db.from('clients').select('email,nome').order('nome');_clientes=data||[];}catch{_clientes=[];}
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
    .aw2-nbadge{position:absolute;top:-5px;right:-5px;background:#e53;color:#fff;border-radius:50%;min-width:18px;height:18px;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 4px;border:2px solid var(--bg);}
    .aw2-notif-panel{background:rgba(229,83,51,.07);border:1px solid rgba(229,83,51,.25);border-radius:10px;padding:10px 14px;margin-bottom:14px;}
    .aw2-notif-title{font-size:11px;font-weight:600;color:#e55333;margin-bottom:6px;}
    .aw2-notif-item{font-size:12px;color:var(--text);padding:5px 0;border-bottom:1px solid rgba(229,83,51,.1);display:flex;gap:8px;align-items:flex-start;}
    .aw2-notif-item:last-child{border-bottom:none;padding-bottom:0;}
    .aw2-aprov-card{background:var(--surface);border:1px solid var(--border);border-left:4px solid #e53;border-radius:10px;padding:14px 16px;margin-bottom:10px;}
    .aw2-aprov-card.ok{border-left-color:#3A5030;}
    .aw2-aprov-btns{display:flex;gap:8px;margin-top:10px;}
    .aw2-btn-ok{background:#3A5030;color:#fff;border:none;border-radius:6px;padding:6px 16px;font-size:12px;cursor:pointer;font-family:inherit;}
    .aw2-btn-nok{background:#991B1B;color:#fff;border:none;border-radius:6px;padding:6px 16px;font-size:12px;cursor:pointer;font-family:inherit;}
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
    .aw2-pdf-btn{display:flex;align-items:center;gap:6px;font-size:11px;padding:7px 14px;border-radius:8px;background:var(--wine);color:#FAF8F2;border:none;cursor:pointer;transition:opacity .18s;white-space:nowrap;}.aw2-pdf-btn:hover{opacity:.85;}
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
    .aw2-arq-sec{margin-bottom:20px;}.aw2-arq-sec-title{font-size:10px;font-weight:600;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;padding:8px 0;border-bottom:2px solid var(--border);margin-bottom:4px;}
    .aw2-arq-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-bottom:1px solid var(--border);transition:background .15s;}.aw2-arq-item:last-child{border-bottom:none;}.aw2-arq-item:hover{background:var(--beige);}
    .aw2-arq-nm{flex:1;font-size:12px;color:var(--text);}.aw2-arq-sub{font-size:10px;color:var(--muted);margin-left:6px;}
    .aw2-arq-btn{font-size:11px;padding:4px 10px;border:1px solid var(--border);border-radius:6px;background:none;cursor:pointer;color:var(--text);white-space:nowrap;transition:all .15s;}.aw2-arq-btn:hover{border-color:var(--accent);color:var(--accent);}
    .aw2-arq-wrap{background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:4px;}
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

  async function _hub(){
    let counts={};try{counts=await _loadNotifCounts();}catch{}
    document.getElementById('admin-main').innerHTML=`<div style="padding:20px 0">
      <div class="aw2-lbl2">Agentes IA · Marketing Primor</div>
      <div class="aw2-grid">${AGENTES.map(a=>`
        <div class="aw2-card ${a.tipo}" onclick="_AW2.open('${a.id}')">
          <div class="aw2-row">
            <div style="position:relative;flex-shrink:0">
              <div class="aw2-av ${a.tipo}">${a.iniciais}</div>
              ${counts[a.id]?`<span class="aw2-nbadge">${counts[a.id]}</span>`:''}
            </div>
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
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:14px;">
        <div class="aw2-tabs" style="margin-bottom:0;flex:1;">${_ag.abas.map(t=>`<div class="aw2-tab ${t===ab?'active':''}" onclick="_AW2.tab('${t}')">${_ag.labels[t]}</div>`).join('')}</div>
        ${_cliente?`<button class="aw2-pdf-btn" id="aw2-pdf-btn-main" onclick="_AW2.openPdfContextual()">📄 PDF de Aprovação</button>`:''}
      </div>
      <div id="aw2-notif-panel"></div>
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
      case'onboarding':        h=await _onboarding();break;
      case'diagnostico':       h=await _diagnostico();break;
      case'concorrentes':      h=await _concorrentes();break;
      case'swot':              h=await _swot();break;
      case'pilares':           h=await _pilares();break;
      case'briefing':          h=await _briefing();break;
      case'resultados':        h=await _resultados();break;
      case'planejamento':      h=await _planejamento();break;
      case'copy':              h=await _copy();break;
      case'roteiros':          h=await _roteiros();break;
      case'calendario_posts':  h=await _calendarioPosts();break;
      case'briefing_visual':   h=await _briefVisual();break;
      case'posts_chloe':       h=await _postsChloe();break;
      case'moodboard':         h=await _moodboard();break;
      case'conceito':          h=await _conceito();break;
      case'briefing_designer': h=await _briefingDesigner();break;
      case'posts_revisao':     h=await _entregas();break;
      case'entregas':          h=await _entregas();break;
      case'dashboard':         h=await _dashboard();break;
      case'lancamentos':       h=await _lancamentos();break;
      case'dre':               h=await _dre();break;
      case'financeiro_cliente':h=await _financeiroCliente();break;
      case'revisao':           h=await _revisao();break;
      case'aprovacoes':        h=await _aprovacoes();break;
      case'checklist':         h=await _checklist();break;
      case'painel':            h=await _painel();break;
      case'arquivos':          h=await _arquivosUnificados();break;
      case'calendario':        h=await _calendario();break;
      case'chat':              h=_chat();el.innerHTML=h;_initChat();return;
    }
    el.innerHTML=h;
    // Atualiza label do botão PDF conforme aba ativa
    const pdfBtn=document.getElementById('aw2-pdf-btn-main');
    if(pdfBtn){
      const labels={diagnostico:'📊 PDF de Métricas',briefing:'📄 PDF de Briefing',resultados:'📈 PDF de Resultados',onboarding:'📋 PDF de Onboarding'};
      pdfBtn.textContent=labels[id]||'📄 PDF de Aprovação';
    }
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
    try{
      let q=db.from('metricas_instagram').select('data,client_email,seguidores,alcance,impressoes,engajamento,publico_principal').order('data',{ascending:false}).limit(60);
      if(_cliente)q=q.eq('client_email',_cliente);
      const{data}=await q;
      rows=(data||[]).map(r=>{
        const cli=_clientes.find(x=>x.email===r.client_email);
        return`<tr><td>${_fmtD(r.data)}</td><td>${cli?.nome||r.client_email||'—'}</td><td>${(r.seguidores||0).toLocaleString('pt-BR')}</td><td>${(r.alcance||0).toLocaleString('pt-BR')}</td><td>${r.engajamento||'—'}%</td><td style="font-size:10px">${r.publico_principal||'—'}</td></tr>`;
      });
    }catch{}
    return `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <div class="aw2-ft" style="margin:0">📈 Histórico — Meta API</div>
      ${_cliente?`<button class="aw2-btn" onclick="_AW2.fetchMetaInsights()" style="font-size:11px;padding:6px 12px">🔄 Sincronizar</button>`:''}
    </div>
    <div class="aw2-tbox"><table class="aw2-tb"><thead><tr><th>Data</th><th>Cliente</th><th>Seguidores</th><th>Alcance</th><th>Eng.</th><th>Público</th></tr></thead>
    <tbody>${rows.join('')||'<tr><td colspan="6" class="aw2-empty">Sem dados ainda. Sincronize via aba Diagnóstico.</td></tr>'}</tbody></table></div>`;
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

  // CHLOE — Posts
  async function _postsChloe(){
    let posts=[];
    if(_cliente){
      try{const{data}=await db.from('posts').select('id,tema_titulo,tipo,data_post,status,legenda,hashtags,obs,obs_int').eq('client_email',_cliente).order('data_post',{ascending:false}).limit(40);posts=data||[];}catch(e){}
    }
    const TIPOS=['feed','carrossel','reels','stories','tiktok'];
    const STATUS=['criacao','revisao','aprovado','publicado'];
    const stLabel={criacao:'Em criação',revisao:'Em revisão',aprovado:'Aprovado',publicado:'Publicado'};
    const stColor={criacao:'#e67e22',revisao:'#2980b9',aprovado:'#27ae60',publicado:'#8e44ad'};
    const step=(n,lbl)=>`<div style="display:flex;align-items:center;gap:8px;margin:14px 0 6px"><span style="background:var(--brown);color:#fff;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0">${n}</span><label class="aw2-fl" style="margin:0;font-weight:600">${lbl}</label></div>`;
    return `<div id="ch-pw">
      <div class="aw2-form" style="margin-bottom:16px">
        <div class="aw2-ft">✦ Criar / Editar Post</div>
        <input type="hidden" id="ch-id">
        ${step(1,'Título')}
        <input class="aw2-in" id="ch-titulo" placeholder="Tema ou título do post">
        ${step(2,'Formato')}
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:4px">
          ${TIPOS.map(t=>`<button id="ch-fmt-${t}" onclick="_AW2.chFmt('${t}')" style="border:1px solid var(--border);background:none;border-radius:8px;padding:5px 14px;font-size:12px;cursor:pointer;color:var(--text);transition:all .15s">${t}</button>`).join('')}
        </div>
        <input type="hidden" id="ch-tipo" value="feed">
        ${step(3,'Conteúdo')}
        <textarea class="aw2-ta" id="ch-conteudo" placeholder="Roteiro, copy, texto do carrossel..." style="min-height:80px"></textarea>
        ${step(4,'Legenda')}
        <textarea class="aw2-ta" id="ch-legenda" placeholder="Legenda para o Instagram..." style="min-height:60px"></textarea>
        ${step(5,'Hashtags')}
        <textarea class="aw2-ta" id="ch-hashtags" placeholder="#hashtag1 #hashtag2..." style="min-height:44px"></textarea>
        <div style="display:flex;align-items:center;gap:8px;margin:14px 0 6px"><span style="font-size:15px">📅</span><label class="aw2-fl" style="margin:0;font-weight:600">Data & Horário</label></div>
        <div class="aw2-r2">
          <div class="aw2-fg"><label class="aw2-fl" style="font-size:10px">Data</label><input type="date" class="aw2-in" id="ch-data"></div>
          <div class="aw2-fg"><label class="aw2-fl" style="font-size:10px">Horário</label><input type="time" class="aw2-in" id="ch-horario"></div>
          <div class="aw2-fg"><label class="aw2-fl" style="font-size:10px">Status</label><select class="aw2-s2" id="ch-status">${STATUS.map(s=>`<option value="${s}">${stLabel[s]}</option>`).join('')}</select></div>
        </div>
        <div class="aw2-sr" style="margin-top:14px">
          <button class="aw2-btn" onclick="_AW2.saveChloePost()">💾 Salvar no Calendário</button>
          <button onclick="_AW2.clearChloeForm()" style="background:none;border:1px solid var(--border);border-radius:8px;padding:6px 14px;font-size:12px;cursor:pointer;color:var(--muted)">Limpar</button>
          <span class="aw2-svd" id="ch-sv"></span>
        </div>
      </div>
      <div class="aw2-form">
        <div class="aw2-ft">📋 Posts — ${_cliente?(_clientes.find(c=>c.email===_cliente)?.nome||_cliente):'selecione um cliente'}</div>
        ${!_cliente?'<div class="aw2-empty">Selecione um cliente para ver os posts.</div>':
          posts.length?`<div class="aw2-ci-items">${posts.map(p=>`
            <div class="aw2-ci-item" style="cursor:pointer" onclick="_AW2.editChloePost('${p.id}')">
              <div class="aw2-ci-top">
                <span style="font-size:10px;background:var(--surface);border:1px solid var(--border);border-radius:4px;padding:2px 7px">${p.tipo||'—'}</span>
                <span style="font-size:10px;color:${stColor[p.status]||'#666'};background:${stColor[p.status]||'#666'}18;border-radius:4px;padding:2px 7px">${stLabel[p.status]||p.status}</span>
                ${p.obs_int&&/^\d{2}:\d{2}$/.test(p.obs_int.trim())?`<span style="font-size:10px;color:var(--muted)">⏰ ${p.obs_int.trim()}</span>`:''}
                <span style="font-size:11px;color:var(--muted);flex:1;text-align:right">${p.data_post?new Date(p.data_post+'T12:00:00').toLocaleDateString('pt-BR'):''}</span>
              </div>
              <div style="font-size:13px;font-weight:500;color:var(--brown);margin-top:4px">${_esc(p.tema_titulo||'Sem título')}</div>
              ${p.legenda?`<div style="font-size:11px;color:var(--muted);margin-top:3px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${_esc(p.legenda)}</div>`:''}
            </div>`).join('')}</div>`
          :'<div class="aw2-empty">Nenhum post encontrado.</div>'
        }
      </div>
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

  // GABI — Entregas para aprovação da Barbeto + Agendamento no Instagram
  async function _entregas(){
    if(!_cliente)return`<div class="aw2-empty">Selecione um cliente para ver os posts.</div>`;
    let posts=[];
    try{const{data}=await db.from('posts').select('id,tema_titulo,tipo,status,ref_1,midia_urls,legenda,hashtags').eq('client_email',_cliente).in('status',['criacao','revisao','aprovado']).order('created_at',{ascending:false}).limit(60);posts=data||[];}catch{}
    const emCriacao=posts.filter(p=>p.status==='criacao');
    const emRevisao=posts.filter(p=>p.status==='revisao');
    const aprovados=posts.filter(p=>p.status==='aprovado');
    const temToken=_clientes.find(c=>c.email===_cliente);
    return `<div class="aw2-form" style="margin-bottom:14px">
      <div class="aw2-ft">📬 Submeter design para aprovação</div>
      <div class="aw2-fg"><label class="aw2-fl">Post</label>
        <select class="aw2-s2" id="et-post">
          <option value="">— Selecionar post —</option>
          ${emCriacao.map(p=>`<option value="${p.id}">${_esc(p.tema_titulo||'(sem título)')} · ${p.tipo}</option>`).join('')}
        </select>
      </div>
      <div class="aw2-fg"><label class="aw2-fl">Link do Canva</label><input class="aw2-in" id="et-url" placeholder="https://www.canva.com/design/..."></div>
      <div class="aw2-sr"><button class="aw2-btn" onclick="_AW2.submitEntrega()">📤 Enviar para Barbeto aprovar</button><span class="aw2-svd" id="et-s"></span></div>
    </div>
    <div class="aw2-ft" style="margin-bottom:8px">Aguardando revisão da Barbeto (${emRevisao.length})</div>
    ${emRevisao.length?emRevisao.map(p=>`<div class="aw2-ci-item" style="border-left:3px solid #d4896a">
      <div class="aw2-ci-top"><span class="aw2-b revisao">Aguardando Barbeto</span></div>
      <div style="font-size:13px;font-weight:500;color:var(--brown)">${_esc(p.tema_titulo||'(sem título)')} · ${p.tipo}</div>
      ${p.ref_1?`<a href="${p.ref_1}" target="_blank" style="font-size:11px;color:var(--accent);margin-top:4px;display:inline-block">🔗 Ver no Canva</a>`:'<span style="font-size:11px;color:var(--muted)">Sem link do Canva</span>'}
    </div>`).join(''):'<div class="aw2-empty">Nenhum post aguardando revisão.</div>'}
    ${aprovados.length?`<div class="aw2-ft" style="margin:14px 0 8px;display:flex;align-items:center;gap:8px">
      ✅ Aprovados — prontos para publicar (${aprovados.length})
      <span style="font-size:10px;color:var(--muted)">via Meta API</span>
    </div>
    ${aprovados.map(p=>{
      let imgUrl='';try{const arr=JSON.parse(p.midia_urls||'[]');imgUrl=Array.isArray(arr)?arr[0]:arr;}catch{imgUrl=p.midia_urls||'';}
      return`<div class="aw2-ci-item" style="border-left:3px solid #27ae60">
        <div class="aw2-ci-top"><span class="aw2-b aprovado">Aprovado</span><span style="flex:1"></span>${imgUrl?'<span style="font-size:10px;color:#3A5030">✓ Tem mídia</span>':'<span style="font-size:10px;color:var(--muted)">Sem mídia</span>'}</div>
        <div style="font-size:13px;font-weight:500;color:var(--brown);margin-bottom:8px">${_esc(p.tema_titulo||'(sem título)')} · ${p.tipo}</div>
        ${imgUrl?`<div style="display:flex;gap:8px;flex-wrap:wrap">
          <button onclick="_AW2.agendarModalIG('${p.id}')" class="aw2-btn" style="font-size:11px;padding:6px 14px">📅 Agendar no Instagram</button>
          <button onclick="_AW2.publicarIGAgora('${p.id}')" style="background:#27ae60;color:#fff;border:none;border-radius:7px;font-size:11px;padding:6px 14px;cursor:pointer;font-family:inherit">▶ Publicar agora</button>
        </div>`:`<div style="font-size:11px;color:var(--muted)">Adicione a mídia ao post para publicar via Instagram API</div>`}
      </div>`;
    }).join('')}`:''}`;
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
    let pendentes=[],aprovados=[];
    try{
      const{data:pd}=await db.from('posts').select('id,client_email,tema_titulo,tipo,ref_1,created_at').eq('status','revisao').order('created_at',{ascending:false});
      pendentes=pd||[];
      const{data:ap}=await db.from('posts').select('id,client_email,tema_titulo,tipo,ref_1,created_at').eq('status','aprovado').order('created_at',{ascending:false}).limit(10);
      aprovados=ap||[];
    }catch{}
    const cliMap={};_clientes.forEach(c=>{cliMap[c.email]=c.nome||c.email;});
    return `<div class="aw2-kpis" style="grid-template-columns:1fr 1fr">
      <div class="aw2-kpi"><div class="aw2-kl">Aguardando aprovação</div><div class="aw2-kv" style="color:#92400E">${pendentes.length}</div></div>
      <div class="aw2-kpi"><div class="aw2-kl">Aprovados (recentes)</div><div class="aw2-kv" style="color:#3A5030">${aprovados.length}</div></div>
    </div>
    <div class="aw2-ft" style="margin-bottom:10px">Aguardando sua aprovação</div>
    ${pendentes.length?pendentes.map(p=>`<div class="aw2-aprov-card">
      <div class="aw2-ci-top" style="margin-bottom:6px">
        <span class="aw2-b revisao">Revisão</span>
        <span style="flex:1"></span>
        <span style="font-size:11px;color:var(--muted)">${cliMap[p.client_email]||p.client_email}</span>
      </div>
      <div style="font-size:13px;font-weight:600;color:var(--brown);margin-bottom:4px">${_esc(p.tema_titulo||'(sem título)')} · ${p.tipo}</div>
      ${p.ref_1?`<a href="${p.ref_1}" target="_blank" style="font-size:12px;color:var(--accent);display:inline-block;margin-bottom:8px">🔗 Abrir no Canva</a>`:`<div style="font-size:11px;color:var(--muted);margin-bottom:8px">Sem link do Canva ainda</div>`}
      <div class="aw2-aprov-btns">
        <button class="aw2-btn-ok" onclick="_AW2.aprovarPost('${p.id}','${p.client_email}')">✓ Aprovar</button>
        <button class="aw2-btn-nok" onclick="_AW2.devolverPost('${p.id}','${p.client_email}')">↩ Devolver</button>
      </div>
    </div>`).join(''):`<div class="aw2-empty">Nenhum post aguardando aprovação.</div>`}
    ${aprovados.length?`<div class="aw2-ft" style="margin-top:16px;margin-bottom:10px">Aprovados recentemente</div>
    ${aprovados.map(p=>`<div class="aw2-aprov-card ok" style="opacity:.75">
      <div style="font-size:13px;font-weight:500;color:var(--brown)">${_esc(p.tema_titulo||'(sem título)')} · ${p.tipo}</div>
      <div style="font-size:11px;color:var(--muted)">${cliMap[p.client_email]||p.client_email}</div>
    </div>`).join('')}`:''}`;
  }

  // PEDRO — Diagnóstico
  async function _diagnostico(){
    const d=await _load({});
    const now=new Date();
    if(!_dgFrom)_dgFrom=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-01`;
    if(!_dgTo)_dgTo=now.toISOString().slice(0,10);

    let meta=null,topPosts=[],extras={};
    if(_cliente){
      try{
        const{data}=await db.from('metricas_instagram').select('*').eq('client_email',_cliente).order('data',{ascending:false}).limit(1).maybeSingle();
        meta=data;
        if(meta?.dados_completos){extras=meta.dados_completos;topPosts=extras.top_posts||[];}
      }catch{}
    }

    const fN=n=>(n||0).toLocaleString('pt-BR');
    const fD=s=>s?new Date(s.slice(0,10)+'T12:00:00').toLocaleDateString('pt-BR'):'—';
    const kpi=(icon,label,val,sub)=>`<div class="aw2-kpi" style="padding:10px 8px">
      <div class="aw2-kl" style="font-size:10px">${icon} ${label}</div>
      <div class="aw2-kv" style="font-size:16px;font-weight:700">${val}</div>
      ${sub?`<div style="font-size:9px;color:var(--muted);margin-top:1px">${sub}</div>`:''}
    </div>`;

    const kpisHtml=meta?`
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:6px">
        ${kpi('👥','Seguidores',fN(meta.seguidores),'total atual')}
        ${kpi('👁','Alcance',fN(meta.alcance),'contas únicas')}
        ${kpi('👀','Visualizações',fN(meta.impressoes),'views totais')}
        ${kpi('🔍','Visitas ao perfil',fN(meta.visitas_perfil),'no período')}
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">
        ${kpi('❤️','Engajamento',`${meta.engajamento||0}%`,'interações/alcance')}
        ${kpi('💬','Interações',fN(extras.interacoes||0),'likes+coments+saves')}
        ${kpi('🔖','Saves',fN(extras.saves_total||0),'no período')}
        ${kpi('🌐','Cliques no site',fN(extras.website_clicks||0),'no período')}
      </div>` : '';

    const postRow=p=>`<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--border);border-radius:9px;background:var(--surface)">
      ${p.thumbnail?`<img src="${p.thumbnail}" style="width:40px;height:40px;border-radius:6px;object-fit:cover;flex-shrink:0" onerror="this.style.display='none'">`
        :`<div style="width:40px;height:40px;border-radius:6px;background:var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:15px">${p.media_type==='VIDEO'?'🎬':'🖼'}</div>`}
      <div style="flex:1;min-width:0">
        <div style="font-size:11px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${_esc((p.caption||'').slice(0,70))||'<em style="color:var(--muted)">(sem legenda)</em>'}</div>
        <div style="font-size:10px;color:var(--muted);margin-top:2px">${fD(p.timestamp)}</div>
      </div>
      <div style="display:flex;gap:10px;flex-shrink:0;font-size:11px;color:var(--text)">
        <span title="Alcance">👁 <strong>${fN(p.reach)}</strong></span>
        <span title="Impressões">💫 <strong>${fN(p.impressions)}</strong></span>
        <span title="Likes">❤️ <strong>${fN(p.like_count)}</strong></span>
        <span title="Comentários">💬 <strong>${fN(p.comments_count)}</strong></span>
        <span title="Saves">🔖 <strong>${fN(p.saved)}</strong></span>
      </div>
      ${p.permalink?`<a href="${p.permalink}" target="_blank" style="font-size:10px;color:var(--accent);flex-shrink:0;text-decoration:none">↗</a>`:''}
    </div>`;

    const topPostsHtml=topPosts.length?`
      <div style="margin-top:14px">
        <div style="font-size:11px;font-weight:700;color:var(--brown);margin-bottom:8px">🏆 Top Posts por Alcance · ${extras.total_posts_period||0} posts no período</div>
        <div style="display:flex;flex-direction:column;gap:6px">${topPosts.map(postRow).join('')}</div>
      </div>`:'';

    const periodoLabel=extras.period_from?`${fD(extras.period_from)} → ${fD(extras.period_to)}`:'';
    const syncInfo=meta?`<span style="font-size:10px;color:var(--muted)">Sync ${fD(meta.data)}${periodoLabel?' · '+periodoLabel:''}</span>`:'';

    return `
    <div class="aw2-form" style="margin-bottom:12px">
      <div style="display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:${meta?'14px':'4px'}">
        <span style="font-size:12px;color:var(--text);font-weight:500">Período</span>
        <input type="date" id="dg-from" value="${_dgFrom}" onchange="_AW2.setDgDates()" style="border:1px solid var(--border);border-radius:7px;padding:5px 8px;font-size:12px;background:var(--surface);color:var(--text)">
        <span style="font-size:12px;color:var(--muted)">até</span>
        <input type="date" id="dg-to" value="${_dgTo}" onchange="_AW2.setDgDates()" style="border:1px solid var(--border);border-radius:7px;padding:5px 8px;font-size:12px;background:var(--surface);color:var(--text)">
        ${_cliente?`<button id="dg-meta-btn" class="aw2-btn" onclick="_AW2.fetchMetaInsights()" style="font-size:11px;padding:6px 14px">🔄 Sincronizar</button>`:''}
        ${syncInfo}
        <span class="aw2-svd" id="dg-sync-s"></span>
      </div>
      ${meta?`<div style="border-left:3px solid #4CAF50;padding-left:12px">${kpisHtml}</div>${topPostsHtml}`
        :_cliente?`<div style="font-size:12px;color:var(--muted);padding:10px 0">Selecione o período e clique em Sincronizar para buscar os dados do Instagram.</div>`
        :`<div style="font-size:12px;color:var(--muted);padding:8px 0">Selecione um cliente acima.</div>`}
    </div>

    <div class="aw2-form">
      <div class="aw2-ft" style="margin-bottom:14px">📝 Análise & Notas</div>
      <div class="aw2-r2">
        <div class="aw2-fg"><label class="aw2-fl">Pontos fortes</label><textarea class="aw2-ta" id="dg-pf">${d.pontos_fortes||''}</textarea></div>
        <div class="aw2-fg"><label class="aw2-fl">Pontos fracos</label><textarea class="aw2-ta" id="dg-pw">${d.pontos_fracos||''}</textarea></div>
      </div>
      <div class="aw2-fg"><label class="aw2-fl">Posicionamento atual</label><textarea class="aw2-ta" id="dg-pos">${d.posicionamento||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">Observações</label><textarea class="aw2-ta" id="dg-obs">${d.obs||''}</textarea></div>
      <div class="aw2-sr"><button class="aw2-btn" onclick="_AW2.saveDiagnostico()">Salvar notas</button><span class="aw2-svd" id="dg-s"></span></div>
    </div>`;
  }

  // PEDRO — Concorrentes
  async function _concorrentes(){
    const d=await _load({lista:[]});
    const lista=d.lista||[];
    while(lista.length<5)lista.push({ig:'',nicho:'',fortes:'',fracos:''});
    return `<div class="aw2-form"><div class="aw2-ft">🔍 Análise de Concorrentes</div>
      ${lista.slice(0,5).map((c,i)=>`
      <div style="border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:12px">
        <div style="font-size:12px;font-weight:600;color:var(--brown);margin-bottom:8px">Concorrente ${i+1}</div>
        <div class="aw2-r2">
          <div class="aw2-fg"><label class="aw2-fl">Instagram</label><input class="aw2-in" id="cc-${i}-ig" value="${_esc(c.ig||'')}"></div>
          <div class="aw2-fg"><label class="aw2-fl">Nicho/Segmento</label><input class="aw2-in" id="cc-${i}-nicho" value="${_esc(c.nicho||'')}"></div>
        </div>
        <div class="aw2-r2">
          <div class="aw2-fg"><label class="aw2-fl">Pontos fortes</label><textarea class="aw2-ta" id="cc-${i}-fortes">${_esc(c.fortes||'')}</textarea></div>
          <div class="aw2-fg"><label class="aw2-fl">Pontos fracos</label><textarea class="aw2-ta" id="cc-${i}-fracos">${_esc(c.fracos||'')}</textarea></div>
        </div>
      </div>`).join('')}
      <div class="aw2-sr"><button class="aw2-btn" onclick="_AW2.saveConcorrentes()">Salvar</button><span class="aw2-svd" id="cc-s"></span></div>
    </div>`;
  }

  // PEDRO — SWOT
  async function _swot(){
    const d=await _load({});
    return `<div class="aw2-form"><div class="aw2-ft">⚡ Análise SWOT</div>
      <div class="aw2-r2">
        <div class="aw2-fg"><label class="aw2-fl">💪 Forças (internas)</label><textarea class="aw2-ta" style="min-height:120px" id="sw-forcas">${d.forcas||''}</textarea></div>
        <div class="aw2-fg"><label class="aw2-fl">⚠ Fraquezas (internas)</label><textarea class="aw2-ta" style="min-height:120px" id="sw-fraquezas">${d.fraquezas||''}</textarea></div>
      </div>
      <div class="aw2-r2">
        <div class="aw2-fg"><label class="aw2-fl">🌟 Oportunidades (externas)</label><textarea class="aw2-ta" style="min-height:120px" id="sw-oportunidades">${d.oportunidades||''}</textarea></div>
        <div class="aw2-fg"><label class="aw2-fl">🚨 Ameaças (externas)</label><textarea class="aw2-ta" style="min-height:120px" id="sw-ameacas">${d.ameacas||''}</textarea></div>
      </div>
      <div class="aw2-sr"><button class="aw2-btn" onclick="_AW2.saveSwot()">Salvar</button><span class="aw2-svd" id="sw-s"></span></div>
    </div>`;
  }

  // PEDRO — Pilares de Conteúdo
  async function _pilares(){
    const d=await _load({pilares:[]});
    const pl=d.pilares||[];
    while(pl.length<5)pl.push({nome:'',percentual:'',descricao:'',formatos:''});
    return `<div class="aw2-form"><div class="aw2-ft">🎯 Pilares de Conteúdo</div>
      ${pl.slice(0,5).map((p,i)=>`
      <div style="border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:12px">
        <div style="font-size:12px;font-weight:600;color:var(--brown);margin-bottom:8px">Pilar ${i+1}</div>
        <div class="aw2-r2">
          <div class="aw2-fg"><label class="aw2-fl">Nome do pilar</label><input class="aw2-in" id="pl${i}-nm" value="${_esc(p.nome||'')}"></div>
          <div class="aw2-fg"><label class="aw2-fl">% do conteúdo</label><input class="aw2-in" type="number" id="pl${i}-pc" value="${p.percentual||''}"></div>
        </div>
        <div class="aw2-fg"><label class="aw2-fl">Descrição</label><textarea class="aw2-ta" id="pl${i}-ds">${_esc(p.descricao||'')}</textarea></div>
        <div class="aw2-fg"><label class="aw2-fl">Formatos ideais</label><input class="aw2-in" id="pl${i}-ft" placeholder="reels, carrossel..." value="${_esc(p.formatos||'')}"></div>
      </div>`).join('')}
      <div class="aw2-sr"><button class="aw2-btn" onclick="_AW2.savePilares()">Salvar</button><span class="aw2-svd" id="pil-s"></span></div>
    </div>`;
  }

  // CHLOE — Copy & Legendas
  async function _copy(){
    const d=await _load({});
    return `<div class="aw2-form"><div class="aw2-ft">✍️ Copy & Legendas</div>
      <div class="aw2-fg"><label class="aw2-fl">Tema / pauta</label><input class="aw2-in" id="cp-tema" value="${d.tema||''}"></div>
      <div class="aw2-fg"><label class="aw2-fl">Gancho de abertura</label><textarea class="aw2-ta" id="cp-gancho">${d.gancho||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">Corpo do texto</label><textarea class="aw2-ta" style="min-height:120px" id="cp-corpo">${d.corpo||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">CTA (chamada para ação)</label><textarea class="aw2-ta" id="cp-cta">${d.cta||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">Hashtags</label><textarea class="aw2-ta" id="cp-tags">${d.tags||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">Legenda final</label><textarea class="aw2-ta" style="min-height:80px" id="cp-final">${d.legenda_final||''}</textarea></div>
      <div class="aw2-sr"><button class="aw2-btn" onclick="_AW2.saveCopy()">Salvar</button><span class="aw2-svd" id="cp-s"></span></div>
    </div>`;
  }

  // CHLOE — Roteiros de Reels
  async function _roteiros(){
    const d=await _load({});
    return `<div class="aw2-form"><div class="aw2-ft">🎬 Roteiro de Reels</div>
      <div class="aw2-r2">
        <div class="aw2-fg"><label class="aw2-fl">Título do Reel</label><input class="aw2-in" id="rt-titulo" value="${d.titulo||''}"></div>
        <div class="aw2-fg"><label class="aw2-fl">Duração (seg)</label><input class="aw2-in" type="number" id="rt-dur" value="${d.duracao||''}"></div>
      </div>
      <div class="aw2-fg"><label class="aw2-fl">🪝 Gancho (primeiros 3s)</label><textarea class="aw2-ta" id="rt-gancho">${d.gancho||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">📝 Desenvolvimento</label><textarea class="aw2-ta" style="min-height:100px" id="rt-dev">${d.dev||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">🎯 CTA / encerramento</label><textarea class="aw2-ta" id="rt-cta">${d.cta||''}</textarea></div>
      <div class="aw2-r2">
        <div class="aw2-fg"><label class="aw2-fl">🎵 Áudio / trilha</label><input class="aw2-in" id="rt-audio" value="${d.audio||''}"></div>
        <div class="aw2-fg"><label class="aw2-fl">🔗 Referências</label><input class="aw2-in" id="rt-refs" value="${d.refs||''}"></div>
      </div>
      <div class="aw2-fg"><label class="aw2-fl">Legenda do post</label><textarea class="aw2-ta" id="rt-legenda">${d.legenda||''}</textarea></div>
      <div class="aw2-sr"><button class="aw2-btn" onclick="_AW2.saveRoteiro()">Salvar</button><span class="aw2-svd" id="rt-s"></span></div>
    </div>`;
  }

  // CHLOE — Calendário de Posts (leitura da tabela posts)
  async function _calendarioPosts(){
    if(!_cliente)return`<div class="aw2-empty">Selecione um cliente para ver o calendário.</div>`;
    const parts=_data.split('-');const y=parts[0];const m=parts[1];
    const ini=`${y}-${m}-01`;const fim=`${y}-${m}-31`;
    let posts=[];
    try{const{data}=await db.from('posts').select('id,tema_titulo,tipo,data_post,status,obs_int').eq('client_email',_cliente).gte('data_post',ini).lte('data_post',fim).order('data_post',{ascending:true});posts=data||[];}catch{}
    const stColor={criacao:'#e67e22',revisao:'#2980b9',aprovado:'#27ae60',publicado:'#8e44ad'};
    const stLabel={criacao:'Criação',revisao:'Revisão',aprovado:'Aprovado',publicado:'Publicado'};
    const cliNome=_clientes.find(c=>c.email===_cliente)?.nome||_cliente;
    return `<div class="aw2-form">
      <div class="aw2-ft">📅 Calendário de Posts — ${m}/${y}</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:12px">${posts.length} post${posts.length!==1?'s':''} para ${cliNome}</div>
      ${posts.length?posts.map(p=>`<div class="aw2-ci-item">
        <div class="aw2-ci-top">
          <span style="font-size:11px;font-weight:600;color:var(--brown)">${p.data_post?new Date(p.data_post+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}):''}</span>
          <span style="font-size:10px;background:var(--surface);border:1px solid var(--border);border-radius:4px;padding:2px 7px">${p.tipo||'—'}</span>
          <span style="font-size:10px;color:${stColor[p.status]||'#666'};background:${stColor[p.status]||'#666'}18;border-radius:4px;padding:2px 7px">${stLabel[p.status]||p.status}</span>
          ${p.obs_int&&/^\d{2}:\d{2}$/.test(p.obs_int.trim())?`<span style="font-size:10px;color:var(--muted)">⏰ ${p.obs_int.trim()}</span>`:''}
        </div>
        <div style="font-size:13px;font-weight:500;color:var(--brown);margin-top:4px">${_esc(p.tema_titulo||'(sem título)')}</div>
      </div>`).join(''):'<div class="aw2-empty">Nenhum post para este mês.</div>'}
    </div>`;
  }

  // GABI — Briefing Designer
  async function _briefingDesigner(){
    const d=await _load({});
    return `<div class="aw2-form"><div class="aw2-ft">📝 Briefing Designer</div>
      <div class="aw2-r2">
        <div class="aw2-fg"><label class="aw2-fl">Projeto</label><input class="aw2-in" id="bd-proj" value="${d.projeto||''}"></div>
        <div class="aw2-fg"><label class="aw2-fl">Formato</label><select class="aw2-s2" id="bd-fmt"><option ${d.formato==='feed'?'selected':''} value="feed">Feed</option><option ${d.formato==='carrossel'?'selected':''} value="carrossel">Carrossel</option><option ${d.formato==='reels'?'selected':''} value="reels">Reels</option><option ${d.formato==='stories'?'selected':''} value="stories">Stories</option></select></div>
      </div>
      <div class="aw2-r2">
        <div class="aw2-fg"><label class="aw2-fl">Dimensões</label><input class="aw2-in" id="bd-dim" placeholder="1080x1080" value="${d.dimensoes||''}"></div>
        <div class="aw2-fg"><label class="aw2-fl">Prazo de entrega</label><input class="aw2-in" type="date" id="bd-prazo" value="${d.prazo||''}"></div>
      </div>
      <div class="aw2-fg"><label class="aw2-fl">Referências visuais</label><textarea class="aw2-ta" id="bd-refs">${d.referencias||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">Elementos obrigatórios</label><textarea class="aw2-ta" id="bd-elem">${d.elementos||''}</textarea></div>
      <div class="aw2-r2">
        <div class="aw2-fg"><label class="aw2-fl">Paleta de cores</label><input class="aw2-in" id="bd-cores" placeholder="#FFF, #5C2E14" value="${d.cores||''}"></div>
        <div class="aw2-fg"><label class="aw2-fl">Feeling</label><input class="aw2-in" id="bd-feel" placeholder="elegante, minimalista..." value="${d.feeling||''}"></div>
      </div>
      <div class="aw2-fg"><label class="aw2-fl">Texto no post</label><textarea class="aw2-ta" id="bd-texto">${d.texto||''}</textarea></div>
      <div class="aw2-fg"><label class="aw2-fl">Observações</label><textarea class="aw2-ta" id="bd-obs">${d.obs||''}</textarea></div>
      <div class="aw2-sr"><button class="aw2-btn" onclick="_AW2.saveBriefingDesigner()">Salvar</button><span class="aw2-svd" id="bd-s"></span></div>
    </div>`;
  }

  // ELVIRA — Financeiro por Cliente
  async function _financeiroCliente(){
    let itens=[];
    try{let q=db.from('financeiro').select('*').order('vencimento',{ascending:false}).limit(100);if(_cliente)q=q.eq('client_email',_cliente);const{data}=await q;itens=data||[];}catch{}
    const stColor={pendente:'#e67e22',pago:'#27ae60',atrasado:'#e74c3c'};
    const total=itens.reduce((s,i)=>s+parseFloat(i.valor||0),0);
    const pago=itens.filter(i=>i.status==='pago').reduce((s,i)=>s+parseFloat(i.valor||0),0);
    const pend=itens.filter(i=>i.status!=='pago').reduce((s,i)=>s+parseFloat(i.valor||0),0);
    return `<div class="aw2-kpis" style="grid-template-columns:repeat(3,1fr)">
      <div class="aw2-kpi"><div class="aw2-kl">Total</div><div class="aw2-kv">${_R$(total)}</div></div>
      <div class="aw2-kpi"><div class="aw2-kl">Pago</div><div class="aw2-kv" style="color:#3A5030">${_R$(pago)}</div></div>
      <div class="aw2-kpi"><div class="aw2-kl">Pendente</div><div class="aw2-kv" style="color:#92400E">${_R$(pend)}</div></div>
    </div>
    <div class="aw2-tbox"><table class="aw2-tb"><thead><tr><th>Vencimento</th><th>Descrição</th><th>Valor</th><th>Status</th></tr></thead>
    <tbody>${itens.map(i=>`<tr><td>${_fmtD(i.vencimento)}</td><td>${_esc(i.descricao)}</td><td style="font-weight:500">${_R$(i.valor)}</td><td><span style="font-size:10px;color:${stColor[i.status]||'#666'};background:${stColor[i.status]||'#666'}18;border-radius:4px;padding:2px 7px">${i.status}</span></td></tr>`).join('')||'<tr><td colspan="4" class="aw2-empty">Nenhum lançamento</td></tr>'}</tbody></table></div>`;
  }

  // BARBETO — Checklist
  async function _checklist(){
    const d=await _load({itens:[]});
    const itens=d.itens||[];
    return `<div class="aw2-form"><div class="aw2-ft">📋 Checklist Diário</div>
      <div style="display:flex;gap:8px;margin-bottom:16px">
        <input class="aw2-in" id="ck-nova" placeholder="Nova tarefa..." style="flex:1">
        <button class="aw2-btn" onclick="_AW2.addChecklist()">+ Adicionar</button>
      </div>
      <div id="ck-list">
        ${itens.length?itens.map((it,i)=>`<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--border);border-radius:8px;margin-bottom:6px;background:${it.feito?'var(--surface)':'var(--bg)'}">
          <input type="checkbox" ${it.feito?'checked':''} onchange="_AW2.toggleChecklist(${i})" style="width:16px;height:16px;accent-color:var(--brown);cursor:pointer">
          <span style="flex:1;font-size:13px;color:var(--text);${it.feito?'text-decoration:line-through;opacity:.55':''}">${_esc(it.tarefa)}</span>
          <button class="aw2-del" onclick="_AW2.delChecklist(${i})">✕</button>
        </div>`).join(''):'<div class="aw2-empty">Nenhuma tarefa ainda.</div>'}
      </div>
      <span class="aw2-svd" id="ck-s"></span>
    </div>`;
  }

  // BARBETO — Painel Geral
  async function _painel(){
    let emRevisao=0,notifs=[],cliCount=0;
    try{
      const{count:r}=await db.from('posts').select('id',{count:'exact',head:true}).eq('status','revisao');
      emRevisao=r||0;
      const{data:n}=await db.from('agentes_notificacoes').select('mensagem,created_at,remetente').eq('destinatario','barbeto').order('created_at',{ascending:false}).limit(10);
      notifs=n||[];
      const{count:c}=await db.from('clients').select('id',{count:'exact',head:true});
      cliCount=c||0;
    }catch{}
    return `<div class="aw2-kpis" style="grid-template-columns:repeat(3,1fr)">
      <div class="aw2-kpi"><div class="aw2-kl">Posts p/ aprovar</div><div class="aw2-kv" style="color:${emRevisao>0?'#92400E':'#3A5030'}">${emRevisao}</div></div>
      <div class="aw2-kpi"><div class="aw2-kl">Clientes ativos</div><div class="aw2-kv">${cliCount}</div></div>
      <div class="aw2-kpi"><div class="aw2-kl">Notificações</div><div class="aw2-kv">${notifs.length}</div></div>
    </div>
    ${emRevisao>0?`<div style="margin-bottom:12px"><button class="aw2-btn" onclick="_AW2.tab('aprovacoes')" style="width:100%">Ver posts aguardando aprovação →</button></div>`:''}
    <div class="aw2-ft" style="margin-bottom:10px">Últimas atividades</div>
    ${notifs.length?notifs.map(n=>`<div style="padding:10px 12px;border:1px solid var(--border);border-radius:8px;margin-bottom:6px">
      <div style="font-size:12px;color:var(--text)">${_esc(n.mensagem)}</div>
      <div style="font-size:10px;color:var(--muted);margin-top:3px">${n.remetente||'sistema'} · ${n.created_at?new Date(n.created_at).toLocaleDateString('pt-BR'):''}</div>
    </div>`).join(''):'<div class="aw2-empty">Sem atividades recentes.</div>'}`;
  }

  // ARQUIVOS UNIFICADOS (todos os agentes)
  function _docContent(doc){
    const c=doc.conteudo||{};
    const dt=(l,v)=>v?`<div style="margin-bottom:10px"><div style="font-size:10px;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:2px">${l}</div><div style="font-size:13px;color:var(--text);line-height:1.6">${v}</div></div>`:'';
    switch(doc.tipo){
      case'onboarding':return[dt('Contrato',c.contrato),dt('Nicho',c.nicho+(c.subnicho?' · '+c.subnicho:'')),dt('Persona',c.persona),dt('Posicionamento',c.posicionamento),dt('Arcos editoriais',c.arcos),dt('Obs',c.obs)].filter(Boolean).join('');
      case'briefing':return[dt('✓ Performou bem',c.bom),dt('✗ Não performou',c.ruim),dt('Foco do mês',c.foco),dt('Campanha',c.campanha),dt('Obs',c.obs)].filter(Boolean).join('');
      case'concorrentes':{const lista=(c.lista||[]).filter(x=>x.ig);return lista.length?lista.map((x,i)=>`<div style="margin-bottom:12px;padding:10px;border:1px solid var(--border);border-radius:8px"><strong>Concorrente ${i+1}: @${_esc(x.ig)}</strong>${x.nicho?` <em>· ${_esc(x.nicho)}</em>`:''}${x.fortes?`<br><span style="font-size:12px">💪 ${_esc(x.fortes)}</span>`:''}${x.fracos?`<br><span style="font-size:12px">⚠ ${_esc(x.fracos)}</span>`:''}</div>`).join(''):'Sem concorrentes.';}
      case'swot':return`<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${[['💪 Forças',c.forcas],['⚠ Fraquezas',c.fraquezas],['🌟 Oportunidades',c.oportunidades],['🚨 Ameaças',c.ameacas]].map(([l,v])=>v?`<div style="padding:10px;border:1px solid var(--border);border-radius:8px"><strong style="font-size:11px">${l}</strong><br><span style="font-size:12px;color:var(--text)">${_esc(v)}</span></div>`:'').join('')}</div>`;
      case'pilares':{const pls=(c.pilares||[]).filter(p=>p.nome);return pls.length?pls.map(p=>`<div style="margin-bottom:10px;padding:10px;border:1px solid var(--border);border-radius:8px"><strong>${_esc(p.nome)}</strong>${p.percentual?` <em style="color:var(--muted)">${p.percentual}%</em>`:''}${p.descricao?`<br><span style="font-size:12px">${_esc(p.descricao)}</span>`:''}${p.formatos?`<br><span style="font-size:11px;color:var(--muted)">${_esc(p.formatos)}</span>`:''}</div>`).join(''):'Sem pilares.';}
      case'planejamento':return[dt('Linha editorial',c.linha),dt('Gancho central',c.gancho),dt('Datas e campanhas',c.datas),(c.qtd_feed||c.qtd_car||c.qtd_reels)?dt('Qtd',`${c.qtd_feed||0} feed · ${c.qtd_car||0} carrossel · ${c.qtd_reels||0} reels`):null,dt('Obs',c.obs)].filter(Boolean).join('');
      case'copy':return[dt('Tema',c.tema),dt('Gancho de abertura',c.gancho),dt('Corpo',c.corpo),dt('CTA',c.cta),dt('Hashtags',c.tags),dt('Legenda final',c.legenda_final)].filter(Boolean).join('');
      case'roteiro':return[dt('Título',c.titulo),dt('Duração',c.duracao?c.duracao+'s':null),dt('🪝 Gancho',c.gancho),dt('Desenvolvimento',c.dev),dt('CTA',c.cta),dt('Áudio',c.audio),dt('Legenda',c.legenda)].filter(Boolean).join('');
      case'conceito':return[dt('Paleta',c.paleta),dt('Fontes',c.fontes),dt('Estética',c.estetica),dt('Elementos',c.elementos),dt('⚠ NUNCA usar',c.nunca)].filter(Boolean).join('');
      case'moodboard':{const refs=Array.isArray(c)?c:[];return refs.length?refs.map(r=>`<div style="margin-bottom:8px;padding:8px;border:1px solid var(--border);border-radius:6px"><span style="background:var(--wine);color:#FAF8F2;font-size:10px;padding:2px 7px;border-radius:20px;margin-right:6px">${r.tag||'Ref'}</span>${_esc(r.descricao||'')}${r.link?` <a href="${r.link}" target="_blank" style="color:var(--accent);font-size:11px">↗ abrir</a>`:''}</div>`).join(''):'Moodboard vazio.';}
      case'metricas':return[dt('👥 Seguidores',(c.seguidores||0).toLocaleString('pt-BR')),dt('👁 Alcance',(c.alcance||0).toLocaleString('pt-BR')),dt('💫 Impressões',(c.impressoes||0).toLocaleString('pt-BR')),dt('❤️ Engajamento',c.engajamento+'%'),dt('🔍 Visitas perfil',(c.visitas_perfil||0).toLocaleString('pt-BR')),dt('👥 Público principal',c.publico_principal)].filter(Boolean).join('');
      default:return`<pre style="font-size:11px;white-space:pre-wrap;color:var(--text)">${JSON.stringify(c,null,2)}</pre>`;
    }
  }

  async function _arquivosUnificados(){
    if(!_cliente)return`<div class="aw2-empty">Selecione um cliente para ver os arquivos.</div>`;
    _arquivosDocs=[];
    const[onb,brief,conc,swot,pilares,plan,copy,rot,conceito,moodItems,arquivos,metaRows]=await Promise.all([
      db.from('agentes_trabalhos').select('conteudo,data').eq('agente_id','pedro').eq('aba_id','onboarding').eq('client_email',_cliente).order('data',{ascending:false}).limit(1).maybeSingle().then(r=>r.data).catch(()=>null),
      db.from('agentes_trabalhos').select('conteudo,data').eq('agente_id','pedro').eq('aba_id','briefing').eq('client_email',_cliente).order('data',{ascending:false}).limit(1).maybeSingle().then(r=>r.data).catch(()=>null),
      db.from('agentes_trabalhos').select('conteudo,data').eq('agente_id','pedro').eq('aba_id','concorrentes').eq('client_email',_cliente).order('data',{ascending:false}).limit(1).maybeSingle().then(r=>r.data).catch(()=>null),
      db.from('agentes_trabalhos').select('conteudo,data').eq('agente_id','pedro').eq('aba_id','swot').eq('client_email',_cliente).order('data',{ascending:false}).limit(1).maybeSingle().then(r=>r.data).catch(()=>null),
      db.from('agentes_trabalhos').select('conteudo,data').eq('agente_id','pedro').eq('aba_id','pilares').eq('client_email',_cliente).order('data',{ascending:false}).limit(1).maybeSingle().then(r=>r.data).catch(()=>null),
      db.from('agentes_trabalhos').select('conteudo,data').eq('agente_id','chloe').eq('aba_id','planejamento').eq('client_email',_cliente).order('data',{ascending:false}).limit(1).maybeSingle().then(r=>r.data).catch(()=>null),
      db.from('agentes_trabalhos').select('conteudo,data').eq('agente_id','chloe').eq('aba_id','copy').eq('client_email',_cliente).order('data',{ascending:false}).limit(1).maybeSingle().then(r=>r.data).catch(()=>null),
      db.from('agentes_trabalhos').select('conteudo,data').eq('agente_id','chloe').eq('aba_id','roteiros').eq('client_email',_cliente).order('data',{ascending:false}).limit(1).maybeSingle().then(r=>r.data).catch(()=>null),
      db.from('agentes_trabalhos').select('conteudo,data').eq('agente_id','gabi').eq('aba_id','conceito').eq('client_email',_cliente).order('data',{ascending:false}).limit(1).maybeSingle().then(r=>r.data).catch(()=>null),
      db.from('gabi_moodboard').select('*').eq('client_email',_cliente).order('created_at',{ascending:false}).limit(30).then(r=>r.data||[]).catch(()=>[]),
      db.from('arquivos_cliente').select('*').eq('client_email',_cliente).order('created_at',{ascending:false}).limit(50).then(r=>r.data||[]).catch(()=>[]),
      db.from('metricas_instagram').select('*').eq('client_email',_cliente).order('data',{ascending:false}).limit(6).then(r=>r.data||[]).catch(()=>[]),
    ]);
    const estrategia=[];
    if(onb?.conteudo){_arquivosDocs.push({tipo:'onboarding',titulo:'📋 Onboarding',data:onb.data,conteudo:onb.conteudo,agente:'Pedro'});estrategia.push(_arquivosDocs.length-1);}
    if(conc?.conteudo){_arquivosDocs.push({tipo:'concorrentes',titulo:'🔍 Concorrentes',data:conc.data,conteudo:conc.conteudo,agente:'Pedro'});estrategia.push(_arquivosDocs.length-1);}
    if(swot?.conteudo){_arquivosDocs.push({tipo:'swot',titulo:'⚡ SWOT',data:swot.data,conteudo:swot.conteudo,agente:'Pedro'});estrategia.push(_arquivosDocs.length-1);}
    if(pilares?.conteudo){_arquivosDocs.push({tipo:'pilares',titulo:'🎯 Pilares',data:pilares.data,conteudo:pilares.conteudo,agente:'Pedro'});estrategia.push(_arquivosDocs.length-1);}
    if(brief?.conteudo){_arquivosDocs.push({tipo:'briefing',titulo:'📄 Briefing Mensal',data:brief.data,conteudo:brief.conteudo,agente:'Pedro'});estrategia.push(_arquivosDocs.length-1);}
    const conteudoDocs=[];
    if(plan?.conteudo){_arquivosDocs.push({tipo:'planejamento',titulo:'📋 Planejamento Editorial',data:plan.data,conteudo:plan.conteudo,agente:'Chloe'});conteudoDocs.push(_arquivosDocs.length-1);}
    if(copy?.conteudo){_arquivosDocs.push({tipo:'copy',titulo:'✍️ Copy & Legendas',data:copy.data,conteudo:copy.conteudo,agente:'Chloe'});conteudoDocs.push(_arquivosDocs.length-1);}
    if(rot?.conteudo){_arquivosDocs.push({tipo:'roteiro',titulo:'🎬 Roteiro Reels',data:rot.data,conteudo:rot.conteudo,agente:'Chloe'});conteudoDocs.push(_arquivosDocs.length-1);}
    const design=[];
    if(conceito?.conteudo){_arquivosDocs.push({tipo:'conceito',titulo:'✦ Conceito Visual',data:conceito.data,conteudo:conceito.conteudo,agente:'Gabi'});design.push(_arquivosDocs.length-1);}
    if(moodItems.length){_arquivosDocs.push({tipo:'moodboard',titulo:`🎨 Moodboard (${moodItems.length})`,data:moodItems[0]?.created_at?.slice(0,10),conteudo:moodItems,agente:'Gabi'});design.push(_arquivosDocs.length-1);}
    const resultados=[];
    metaRows.forEach(m=>{_arquivosDocs.push({tipo:'metricas',titulo:`📊 Métricas — ${_fmtD(m.data)}`,data:m.data,conteudo:m,agente:'Meta API'});resultados.push(_arquivosDocs.length-1);});
    const manuais=[];
    arquivos.forEach(a=>{_arquivosDocs.push({tipo:'arquivo',titulo:a.nome||'Arquivo',data:a.created_at?.slice(0,10),conteudo:a,agente:a.uploader||'admin',url:a.url});manuais.push(_arquivosDocs.length-1);});
    const sec=(titulo,indices)=>`<div class="aw2-arq-sec"><div class="aw2-arq-sec-title">${titulo}</div>${indices.length
      ?`<div class="aw2-arq-wrap">${indices.map(idx=>{const doc=_arquivosDocs[idx];
          return`<div class="aw2-arq-item">
            <div class="aw2-arq-nm">${doc.titulo}<span class="aw2-arq-sub">${doc.agente} · ${_fmtD(doc.data)}</span></div>
            ${doc.tipo==='arquivo'
              ?`<button class="aw2-arq-btn" onclick="window.open('${(doc.url||'').replace(/'/g,"\\'")}','_blank')">↗ Ver</button>`
              :`<button class="aw2-arq-btn" onclick="_AW2.verDoc(${idx})">👁 Ver</button>
                <button class="aw2-arq-btn" onclick="_AW2.baixarDoc(${idx})">↓ PDF</button>`}
          </div>`;}).join('')}</div>`
      :`<div style="padding:10px 12px;font-size:12px;color:var(--muted)">Nenhum documento ainda.</div>`}</div>`;
    const cliNome=_clientes.find(c=>c.email===_cliente)?.nome||_cliente;
    const total=_arquivosDocs.length;
    return`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <div class="aw2-ft" style="margin:0">📁 Arquivos — ${cliNome}</div>
      <span style="font-size:11px;color:var(--muted)">${total} documento${total!==1?'s':''}</span>
    </div>
    ${sec('📐 ESTRATÉGIA',estrategia)}
    ${sec('✍️ CONTEÚDO',conteudoDocs)}
    ${sec('🎨 DESIGN',design)}
    ${sec('📊 RESULTADOS',resultados)}
    ${sec('📎 ARQUIVOS MANUAIS',manuais)}`;
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
    <div class="aw2-ci-items">${itens.map(i=>{
      const tiposPost=['feed','carrossel','reels','stories','tiktok'];
      const isPost=tiposPost.includes(i.formato);
      return`<div class="aw2-ci-item">
        <div class="aw2-ci-top"><span class="aw2-b ${i.formato}">${i.formato}</span><span class="aw2-b ${i.status}">${i.status}</span><span style="flex:1"></span>
          ${isPost&&_cliente?`<button onclick="_AW2.toPost('${i.id}')" style="background:var(--brown);color:#fff;border:none;border-radius:6px;padding:3px 9px;font-size:10px;cursor:pointer;margin-right:6px;">→ Posts</button>`:''}
          <button class="aw2-del" onclick="_AW2.delCal('${i.id}')">✕</button></div>
        <div style="font-size:13px;font-weight:500;color:var(--brown)">${_esc(i.titulo)}</div>
        ${i.descricao?`<div style="font-size:12px;color:var(--muted);margin-top:3px">${_esc(i.descricao)}</div>`:''}
      </div>`;}).join('')||'<div class="aw2-empty">Nenhum item para este dia.</div>'}
    </div>`;
  }

  // CHAT
  function _chat(){
    const cliNome=_cliente?(_clientes.find(c=>c.email===_cliente)?.nome||_cliente):'';
    const keyBox='';
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
          <span style="font-size:11px;color:var(--muted)">${cliNome?'Pronta para receber sua tarefa.':'Selecione um cliente acima para contexto completo.'}</span>
        </div>
      </div>
      <div class="aw2-cf">
        <textarea class="aw2-ci2" id="aw2ci" rows="1" placeholder="Digite sua tarefa ou pergunta..."
          onkeydown="_AW2.chatKey(event)" oninput="_AW2.chatRes(this)"></textarea>
        <button class="aw2-cs" id="aw2cs" onclick="_AW2.chatSend()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#FAF8F2"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
        </button>
        <button title="Limpar conversa" onclick="_AW2.clearChat()" style="background:none;border:none;cursor:pointer;padding:6px 8px;color:var(--muted);font-size:13px;border-radius:8px;transition:color .15s;" onmouseover="this.style.color='var(--brown)'" onmouseout="this.style.color='var(--muted)'">🗑</button>
      </div>
    </div>`;
  }

  async function _migrateLegacyChat(localMsgs){
    // Se o Supabase ainda não tem mensagens deste agente+cliente, migra tudo do localStorage
    try{
      const{count}=await db.from('agentes_chat_historico').select('id',{count:'exact',head:true}).eq('agente_id',_ag.id).eq('client_email',_cliente||'');
      if((count||0)===0&&localMsgs.length){
        const rows=localMsgs.map(m=>({agente_id:_ag.id,client_email:_cliente||'',role:m.role,content:m.content}));
        await db.from('agentes_chat_historico').insert(rows);
      }
    }catch(e){}
  }

  async function _initChat(){
    _histLoad();
    const localMsgs=_chatHist[_ag.id]||[];
    if(localMsgs.length){
      // Tem histórico local — migra para Supabase em background se necessário
      _migrateLegacyChat(localMsgs);
    }else{
      // Sem localStorage — busca direto do Supabase
      await _histLoadRemote();
    }
    if(!_chatHist[_ag.id])_chatHist[_ag.id]=[];
    const msgs=document.getElementById('aw2msgs');
    if(msgs&&_chatHist[_ag.id].length){
      const intro=msgs.querySelector('.aw2-intro');
      if(intro)intro.style.display='none';
      _chatHist[_ag.id].forEach(m=>_addMsg(m.role,m.content));
    }
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
    async open(id){
      _ag=AGENTES.find(a=>a.id===id);_aba=null;
      await _loadClientes();if(_cliente)await _loadFiscal(_cliente);
      _ws();
      const notifs=await _loadNotifs();
      if(notifs.length){
        const panel=document.getElementById('aw2-notif-panel');
        if(panel){
          panel.innerHTML=`<div class="aw2-notif-panel"><div class="aw2-notif-title">🔔 ${notifs.length} notificaç${notifs.length===1?'ão':'ões'}</div>${notifs.map(n=>`<div class="aw2-notif-item"><span>•</span><div><div>${_esc(n.mensagem)}</div>${n.client_email?`<div style="font-size:10px;color:var(--muted)">${n.client_email}</div>`:''}</div></div>`).join('')}</div>`;
          _marcarLidas();
        }
      }
    },
    tab(id){_renderAba(id);},
    async setCli(email){_cliente=email;await _loadFiscal(email);_ws();},
    setData(d){_data=d||_hoje();_renderAba(_aba);},
    // Pedro — Diagnóstico
    async saveDiagnostico(){const ok=await _save({pontos_fortes:_v('dg-pf'),pontos_fracos:_v('dg-pw'),posicionamento:_v('dg-pos'),obs:_v('dg-obs')});_flash('dg-s',ok?'✓ Salvo':'⚠ Erro');},
    // Pedro — Sincronização Meta API
    async fetchMetaInsights(){
      if(!_cliente){alert('Selecione um cliente primeiro.');return;}
      const btn=document.getElementById('dg-meta-btn');
      if(btn){btn.disabled=true;btn.textContent='⏳ Buscando...';}
      try{
        const igCreds=await _getIGCreds(_cliente);
        if(!igCreds){
          alert('Instagram não conectado para este cliente.\n\nVá em Clientes → aba Info → Conectar Instagram via OAuth.');
          return;
        }
        const{tok,aid}=igCreds;
        const BASE='https://graph.facebook.com/v19.0';
        const from=_dgFrom||new Date().toISOString().slice(0,8)+'01';
        const to=_dgTo||new Date().toISOString().slice(0,10);
        const since=Math.floor(new Date(from+'T00:00:00').getTime()/1000);
        const until=Math.floor(new Date(to+'T23:59:59').getTime()/1000);

        // 1. Perfil
        const profR=await fetch(`${BASE}/${aid}?fields=followers_count,media_count&access_token=${tok}`).then(r=>r.json());
        if(profR.error)throw new Error('Perfil: '+profR.error.message);
        const seguidores=profR.followers_count||0;

        // 2. Insights do período — API Meta v19+ (impressions removido; usar views)
        // Métricas principais — fatal se falhar
        let alcance=0,visualizacoes=0,interacoes=0,saves_conta=0,visitas_perfil=0,website_clicks=0;
        const mainTotals=await _insightsPaged(
          `${BASE}/${aid}/insights?metric=reach,views,total_interactions,saves&period=day&since=${since}&until=${until}&access_token=${tok}`
        );
        alcance=mainTotals.reach||0;
        visualizacoes=mainTotals.views||0;
        interacoes=mainTotals.total_interactions||0;
        saves_conta=mainTotals.saves||0;
        // Opcionais — falha silenciosa
        try{const t=await _insightsPaged(`${BASE}/${aid}/insights?metric=profile_views&period=day&since=${since}&until=${until}&access_token=${tok}`);visitas_perfil=t.profile_views||0;}catch{}
        try{const t=await _insightsPaged(`${BASE}/${aid}/insights?metric=website_clicks&period=day&since=${since}&until=${until}&access_token=${tok}`);website_clicks=t.website_clicks||0;}catch{}

        // 3. Todos os posts do período (até 50 mais recentes)
        const mediaR=await fetch(`${BASE}/${aid}/media?fields=id,caption,media_type,timestamp,permalink,like_count,comments_count,media_url,thumbnail_url&limit=50&access_token=${tok}`).then(r=>r.json());
        const allPosts=(!mediaR.error&&mediaR.data)||[];
        const fromMs=new Date(from+'T00:00:00').getTime();
        const toMs=new Date(to+'T23:59:59').getTime();
        const periodPosts=allPosts.filter(p=>{const t=new Date(p.timestamp).getTime();return t>=fromMs&&t<=toMs;});
        const forEng=periodPosts.length?periodPosts:allPosts.slice(0,20);

        // 4. Engajamento: usa total_interactions da API se disponível, senão calcula por posts
        let engajamento=0;
        if(interacoes>0&&alcance>0){
          engajamento=parseFloat(((interacoes/alcance)*100).toFixed(2));
        } else if(seguidores>0&&forEng.length>0){
          let totalEng=0;forEng.forEach(p=>{totalEng+=(p.like_count||0)+(p.comments_count||0);});
          engajamento=parseFloat(((totalEng/forEng.length/seguidores)*100).toFixed(2));
        }

        // 5. Top posts: busca insights individuais (reach, impressions, saved ainda válidos por media)
        const sorted=[...forEng].sort((a,b)=>((b.like_count||0)+(b.comments_count||0))-((a.like_count||0)+(a.comments_count||0)));
        const top7=sorted.slice(0,7);
        const insightsRes=await Promise.allSettled(
          top7.map(p=>fetch(`${BASE}/${p.id}/insights?metric=reach,impressions,saved&access_token=${tok}`).then(r=>r.json()))
        );
        const topPostsData=top7.map((p,i)=>{
          const ins=insightsRes[i].status==='fulfilled'?insightsRes[i].value:{};
          const im={};(ins.data||[]).forEach(d=>{im[d.name]=d.values?.[0]?.value||0;});
          return{id:p.id,caption:p.caption||'',media_type:p.media_type,timestamp:p.timestamp,permalink:p.permalink,thumbnail:p.thumbnail_url||p.media_url||'',like_count:p.like_count||0,comments_count:p.comments_count||0,reach:im.reach||0,impressions:im.impressions||0,saved:im.saved||0};
        });
        topPostsData.sort((a,b)=>b.reach-a.reach);

        // 6. Público demográfico — novo formato Meta API (engaged_audience_demographics)
        let publico_principal='';
        try{
          const audR=await fetch(`${BASE}/${aid}/insights?metric=engaged_audience_demographics&period=lifetime&timeframe=last_90_days&breakdown=gender&access_token=${tok}`).then(r=>r.json());
          if(!audR.error&&audR.data?.[0]?.total_value?.breakdowns?.[0]?.results){
            const rows=audR.data[0].total_value.breakdowns[0].results;
            const top=rows.sort((a,b)=>b.value-a.value)[0];
            if(top){const g=top.dimension_values?.[0];publico_principal=g==='F'?'Mulheres':g==='M'?'Homens':g||'—';}
          }
        }catch{}

        // 7. Salva
        const hoje=new Date().toISOString().slice(0,10);
        const{error:dbErr}=await db.from('metricas_instagram').upsert(
          {client_email:_cliente,data:hoje,seguidores,alcance,impressoes:visualizacoes,engajamento,visitas_perfil,publico_principal,
           dados_completos:{top_posts:topPostsData,website_clicks,saves_total:saves_conta,interacoes,period_from:from,period_to:to,total_posts_period:periodPosts.length}},
          {onConflict:'client_email,data'}
        );
        if(dbErr)throw new Error('Erro ao salvar: '+dbErr.message);

        _flash('dg-sync-s',`✓ ${(seguidores||0).toLocaleString('pt-BR')} seg · alcance ${(alcance||0).toLocaleString('pt-BR')} · ${topPostsData.length} top posts`);
        _renderAba(_aba);
      }catch(e){alert('Erro: '+e.message);}finally{if(btn){btn.disabled=false;btn.textContent='🔄 Sincronizar';}}
    },
    setDgDates(){
      _dgFrom=document.getElementById('dg-from')?.value||_dgFrom;
      _dgTo=document.getElementById('dg-to')?.value||_dgTo;
    },
    // Pedro — Concorrentes
    async saveConcorrentes(){
      const lista=Array.from({length:5},(_,i)=>({ig:_v('cc-'+i+'-ig'),nicho:_v('cc-'+i+'-nicho'),fortes:_v('cc-'+i+'-fortes'),fracos:_v('cc-'+i+'-fracos')}));
      const ok=await _save({lista});_flash('cc-s',ok?'✓ Salvo':'⚠ Erro');
    },
    // Pedro — SWOT
    async saveSwot(){const ok=await _save({forcas:_v('sw-forcas'),fraquezas:_v('sw-fraquezas'),oportunidades:_v('sw-oportunidades'),ameacas:_v('sw-ameacas')});_flash('sw-s',ok?'✓ Salvo':'⚠ Erro');},
    // Pedro — Pilares
    async savePilares(){
      const pilares=Array.from({length:5},(_,i)=>({nome:_v('pl'+i+'-nm'),percentual:_v('pl'+i+'-pc'),descricao:_v('pl'+i+'-ds'),formatos:_v('pl'+i+'-ft')}));
      const ok=await _save({pilares});_flash('pil-s',ok?'✓ Salvo':'⚠ Erro');
    },
    // Chloe — Copy
    async saveCopy(){const ok=await _save({tema:_v('cp-tema'),gancho:_v('cp-gancho'),corpo:_v('cp-corpo'),cta:_v('cp-cta'),tags:_v('cp-tags'),legenda_final:_v('cp-final')});_flash('cp-s',ok?'✓ Salvo':'⚠ Erro');},
    // Chloe — Roteiro
    async saveRoteiro(){const ok=await _save({titulo:_v('rt-titulo'),duracao:_v('rt-dur'),gancho:_v('rt-gancho'),dev:_v('rt-dev'),cta:_v('rt-cta'),audio:_v('rt-audio'),refs:_v('rt-refs'),legenda:_v('rt-legenda')});_flash('rt-s',ok?'✓ Salvo':'⚠ Erro');},
    // Gabi — Briefing Designer
    async saveBriefingDesigner(){
      const ok=await _save({projeto:_v('bd-proj'),formato:_v('bd-fmt'),dimensoes:_v('bd-dim'),prazo:_v('bd-prazo'),referencias:_v('bd-refs'),elementos:_v('bd-elem'),cores:_v('bd-cores'),feeling:_v('bd-feel'),texto:_v('bd-texto'),obs:_v('bd-obs')});
      _flash('bd-s',ok?'✓ Salvo':'⚠ Erro');
    },
    // Barbeto — Checklist
    async addChecklist(){
      const txt=_v('ck-nova');if(!txt.trim())return;
      const d=await _load({itens:[]});const itens=d.itens||[];
      itens.push({tarefa:txt.trim(),feito:false});
      const ok=await _save({itens});_flash('ck-s',ok?'✓ Adicionado':'⚠ Erro');
      if(ok)_renderAba('checklist');
    },
    async toggleChecklist(idx){
      const d=await _load({itens:[]});const itens=d.itens||[];
      if(itens[idx])itens[idx].feito=!itens[idx].feito;
      await _save({itens});_renderAba('checklist');
    },
    async delChecklist(idx){
      const d=await _load({itens:[]});const itens=(d.itens||[]).filter((_,i)=>i!==idx);
      await _save({itens});_renderAba('checklist');
    },
    // Pedro
    async saveOnboarding(){const ok=await _save({contrato:_v('on-c'),nicho:_v('on-n'),subnicho:_v('on-sn'),persona:_v('on-p'),posicionamento:_v('on-pos'),arcos:_v('on-a'),obs:_v('on-o')});_flash('on-s',ok?'✓ Salvo':'⚠ Erro');},
    async saveBriefing(){
      const ok=await _save({bom:_v('br-b'),ruim:_v('br-r'),foco:_v('br-f'),campanha:_v('br-c'),obs:_v('br-o')});
      _flash('br-s',ok?'✓ Salvo':'⚠ Erro');
      if(ok){const cliNome=_clientes.find(c=>c.email===_cliente)?.nome||_cliente||'cliente';_notificar('chloe',`Novo briefing do Pedro para ${cliNome}. Planejamento pode começar!`,'entrega');}
    },
    async saveResultado(){const ok=await _save({seguidores:_v('rs-s'),alcance:_v('rs-a'),engajamento:_v('rs-e'),crescimento:_v('rs-c')});_flash('rs-sv',ok?'✓ Salvo':'⚠ Erro');if(ok)_renderAba('resultados');},
    // Chloe
    async savePlan(){
      const ok=await _save({linha:_v('pl-l'),gancho:_v('pl-g'),datas:_v('pl-d'),qtd_feed:_v('pl-f'),qtd_car:_v('pl-c'),qtd_reels:_v('pl-r'),obs:_v('pl-o')});
      _flash('pl-s',ok?'✓ Salvo':'⚠ Erro');
      if(ok){const cliNome=_clientes.find(c=>c.email===_cliente)?.nome||_cliente||'cliente';_notificar('gabi',`Planejamento editorial da Chloe disponível para ${cliNome}. Briefing visual aguardando!`,'entrega');}
    },
    async saveBriefV(){
      const ok=await _save({formato:_v('bv-f'),tom:_v('bv-t'),titulo:_v('bv-ti'),elementos:_v('bv-e'),referencias:_v('bv-r'),texto:_v('bv-tx'),obs:_v('bv-o')});
      _flash('bv-s',ok?'✓ Salvo':'⚠ Erro');
      if(ok){const cliNome=_clientes.find(c=>c.email===_cliente)?.nome||_cliente||'cliente';_notificar('gabi',`Briefing visual da Chloe pronto para ${cliNome}. Pode começar os designs!`,'entrega');}
    },
    // Chloe — Posts
    chFmt(tipo){
      ['feed','carrossel','reels','stories','tiktok'].forEach(t=>{const b=document.getElementById('ch-fmt-'+t);if(b){b.style.background='none';b.style.borderColor='var(--border)';b.style.color='var(--text)';}});
      const a=document.getElementById('ch-fmt-'+tipo);if(a){a.style.background='var(--brown)';a.style.borderColor='var(--brown)';a.style.color='#fff';}
      const inp=document.getElementById('ch-tipo');if(inp)inp.value=tipo;
    },
    async saveChloePost(){
      const id=document.getElementById('ch-id')?.value||'';
      const titulo=_v('ch-titulo');
      const tipo=document.getElementById('ch-tipo')?.value||'feed';
      const conteudo=_v('ch-conteudo');
      const legenda=_v('ch-legenda');
      const hashtags=_v('ch-hashtags');
      const data_post=_v('ch-data')||null;
      const horario=_v('ch-horario')||null;
      const status=document.getElementById('ch-status')?.value||'criacao';
      if(!titulo&&!legenda){_flash('ch-sv','⚠ Preencha o título ou a legenda');return;}
      if(!_cliente){_flash('ch-sv','⚠ Selecione um cliente primeiro');return;}
      const payload={client_email:_cliente,tema_titulo:titulo,tipo,obs:conteudo,legenda,hashtags,data_post,obs_int:horario,status};
      try{
        if(id){
          const{error}=await db.from('posts').update(payload).eq('id',id);
          if(error)throw error;
          _flash('ch-sv','✓ Post atualizado!');
        }else{
          const{error}=await db.from('posts').insert(payload);
          if(error)throw error;
          _flash('ch-sv','✓ Post criado!');
          this.clearChloeForm();
        }
        _renderAba('posts_chloe');
      }catch(e){_flash('ch-sv','⚠ Erro: '+e.message);}
    },
    async editChloePost(id){
      try{
        const{data:p}=await db.from('posts').select('*').eq('id',id).single();
        if(!p)return;
        document.getElementById('ch-id').value=p.id;
        document.getElementById('ch-titulo').value=p.tema_titulo||'';
        document.getElementById('ch-conteudo').value=p.obs||'';
        document.getElementById('ch-legenda').value=p.legenda||'';
        document.getElementById('ch-hashtags').value=p.hashtags||'';
        document.getElementById('ch-data').value=p.data_post||'';
        document.getElementById('ch-horario').value=(p.obs_int&&/^\d{2}:\d{2}$/.test(p.obs_int.trim()))?p.obs_int.trim():'';
        document.getElementById('ch-status').value=p.status||'criacao';
        this.chFmt(p.tipo||'feed');
        document.getElementById('ch-pw')?.scrollIntoView({behavior:'smooth'});
        _flash('ch-sv','✎ Editando — clique em Salvar para confirmar');
      }catch(e){}
    },
    clearChloeForm(){
      ['ch-id','ch-titulo','ch-conteudo','ch-legenda','ch-hashtags','ch-data','ch-horario'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
      const s=document.getElementById('ch-status');if(s)s.value='criacao';
      this.chFmt('feed');
      _flash('ch-sv','');
    },
    // Gabi
    async addRef(){try{await db.from('gabi_moodboard').insert({client_email:_cliente||'',tag:_v('mb-t'),link:_v('mb-l'),descricao:_v('mb-d')});_flash('mb-s','✓ Adicionado');_renderAba('moodboard');}catch{_flash('mb-s','⚠ Erro');}},
    async delRef(id){try{await db.from('gabi_moodboard').delete().eq('id',id);_renderAba('moodboard');}catch{}},
    async saveConceito(){const ok=await _save({paleta:_v('cv-p'),fontes:_v('cv-f'),estetica:_v('cv-e'),elementos:_v('cv-el'),nunca:_v('cv-n')});_flash('cv-s',ok?'✓ Salvo':'⚠ Erro');},
    // Gabi — submeter design para aprovação da Barbeto
    async submitEntrega(){
      const postId=document.getElementById('et-post')?.value;
      const url=_v('et-url');
      if(!postId){_flash('et-s','⚠ Selecione um post');return;}
      if(!url){_flash('et-s','⚠ Adicione o link do Canva');return;}
      try{
        const{error}=await db.from('posts').update({ref_1:url,status:'revisao'}).eq('id',postId);
        if(error)throw error;
        const{data:post}=await db.from('posts').select('tema_titulo,client_email').eq('id',postId).single();
        const cliNome=_clientes.find(c=>c.email===post?.client_email)?.nome||post?.client_email||'cliente';
        _notificar('barbeto',`Design de "${post?.tema_titulo||'post'}" para ${cliNome} aguardando sua aprovação.`,'aprovacao',postId);
        _flash('et-s','✓ Enviado para a Barbeto!');
        _renderAba(_aba);
      }catch(e){_flash('et-s','⚠ Erro: '+e.message);}
    },
    // Barbeto — aprovar ou devolver post
    async aprovarPost(postId,clientEmail){
      try{
        const{data:post}=await db.from('posts').select('tema_titulo').eq('id',postId).single();
        await db.from('posts').update({status:'aprovado'}).eq('id',postId);
        const cliNome=_clientes.find(c=>c.email===clientEmail)?.nome||clientEmail;
        _notificar('gabi',`✓ "${post?.tema_titulo||'Post'}" aprovado pela Barbeto para ${cliNome}. Pode agendar!`,'aprovacao',postId);
        _renderAba('aprovacoes');
      }catch(e){alert('Erro ao aprovar: '+e.message);}
    },
    async devolverPost(postId,clientEmail){
      const feedback=prompt('Motivo da devolução (será salvo no post):');
      if(feedback===null)return;
      try{
        const{data:post}=await db.from('posts').select('tema_titulo').eq('id',postId).single();
        await db.from('posts').update({status:'criacao',obs_int:feedback||'Devolvido pela Barbeto para ajustes.'}).eq('id',postId);
        const cliNome=_clientes.find(c=>c.email===clientEmail)?.nome||clientEmail;
        _notificar('gabi',`↩ "${post?.tema_titulo||'Post'}" devolvido para ajuste — ${feedback||'sem motivo informado'}`,  'aprovacao',postId);
        _renderAba('aprovacoes');
      }catch(e){alert('Erro ao devolver: '+e.message);}
    },
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
    async toPost(id){
      try{
        const{data:item}=await db.from('agentes_calendario').select('*').eq('id',id).single();
        if(!item)return;
        const{error}=await db.from('posts').insert({
          client_email:item.client_email,
          tema_titulo:item.titulo||'',
          legenda:item.descricao||'',
          tipo:item.formato,
          data_post:item.data,
          status:'criacao'
        });
        if(error)throw error;
        _flash('cal-s','✓ Post criado!');
      }catch(e){_flash('cal-s','⚠ Erro: '+e.message);}
    },
    // Roteador de PDF por aba ativa
    openPdfContextual(){
      if(!_cliente)return;
      if(_aba==='diagnostico')this.gerarPdfMetricas();
      else this.openPdfModal();
    },
    // PDF de Métricas (aba Diagnóstico do Pedro)
    async gerarPdfMetricas(){
      if(!_cliente){alert('Selecione um cliente.');return;}
      const cliNome=_clientes.find(c=>c.email===_cliente)?.nome||_cliente;
      let meta=null;
      try{const{data}=await db.from('metricas_instagram').select('*').eq('client_email',_cliente).order('data',{ascending:false}).limit(1).maybeSingle();meta=data;}catch{}
      if(!meta){alert('Nenhuma sincronização ainda. Clique em Sincronizar primeiro.');return;}
      const extras=meta.dados_completos||{};
      const topPosts=extras.top_posts||[];
      const fN=n=>(n||0).toLocaleString('pt-BR');
      const fD=s=>s?new Date(s.slice(0,10)+'T12:00:00').toLocaleDateString('pt-BR'):'—';
      const periodo=extras.period_from?`${fD(extras.period_from)} a ${fD(extras.period_to)}`:`Sync ${fD(meta.data)}`;
      const kpiBox=(icon,label,val)=>`<div style="background:#FAF8F2;border:1px solid #E8DECE;border-radius:10px;padding:14px 10px;text-align:center;"><div style="font-size:18px;margin-bottom:4px;">${icon}</div><div style="font-size:10px;color:#9B6B3A;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">${label}</div><div style="font-size:20px;font-weight:700;color:#5C3D1E;">${val}</div></div>`;
      const postRow=p=>`<tr style="border-bottom:1px solid #E8DECE;">
        <td style="padding:10px 8px;font-size:11px;color:#333;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${(p.caption||'').slice(0,60)||'(sem legenda)'}</td>
        <td style="padding:10px 8px;font-size:11px;color:#666;text-align:center;">${fD(p.timestamp?.slice(0,10))}</td>
        <td style="padding:10px 8px;font-size:12px;font-weight:600;color:#5C3D1E;text-align:center;">${fN(p.reach)}</td>
        <td style="padding:10px 8px;font-size:12px;font-weight:600;color:#5C3D1E;text-align:center;">${fN(p.impressions)}</td>
        <td style="padding:10px 8px;font-size:11px;text-align:center;">${fN(p.like_count)}</td>
        <td style="padding:10px 8px;font-size:11px;text-align:center;">${fN(p.comments_count)}</td>
        <td style="padding:10px 8px;font-size:11px;text-align:center;">${fN(p.saved)}</td>
      </tr>`;
      const html=`<div style="font-family:Poppins,Arial,sans-serif;background:#fff;padding:48px;max-width:800px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid #E8DECE;">
          <img src="https://crm.gislainebarbeto.com.br/logo-texto.png.jpeg" crossorigin="anonymous" style="height:56px;object-fit:contain;display:block;margin:0 auto 12px;">
          <div style="font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:#9B6B3A;margin-bottom:8px;">Relatório de Métricas Instagram</div>
          <div style="font-size:22px;font-weight:300;color:#5C3D1E;margin-bottom:4px;">${cliNome}</div>
          <div style="font-size:13px;color:#7A5230;">${periodo}</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;">
          ${kpiBox('👥','Seguidores',fN(meta.seguidores))}
          ${kpiBox('👁','Alcance',fN(meta.alcance))}
          ${kpiBox('👀','Visualizações',fN(meta.impressoes))}
          ${kpiBox('🔍','Visitas ao perfil',fN(meta.visitas_perfil))}
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:32px;">
          ${kpiBox('❤️','Engajamento',`${meta.engajamento||0}%`)}
          ${kpiBox('💬','Interações',fN(extras.interacoes||0))}
          ${kpiBox('🔖','Saves',fN(extras.saves_total||0))}
          ${kpiBox('🌐','Cliques no site',fN(extras.website_clicks||0))}
        </div>
        ${topPosts.length?`
        <div style="margin-bottom:32px;">
          <div style="font-size:12px;font-weight:600;color:#5C3D1E;margin-bottom:12px;text-transform:uppercase;letter-spacing:.1em;">🏆 Top Posts por Alcance</div>
          <table style="width:100%;border-collapse:collapse;">
            <thead><tr style="background:#F5EFE7;">
              <th style="padding:8px;font-size:10px;color:#9B6B3A;text-align:left;font-weight:500;">Legenda</th>
              <th style="padding:8px;font-size:10px;color:#9B6B3A;text-align:center;font-weight:500;">Data</th>
              <th style="padding:8px;font-size:10px;color:#9B6B3A;text-align:center;font-weight:500;">Alcance</th>
              <th style="padding:8px;font-size:10px;color:#9B6B3A;text-align:center;font-weight:500;">Impressões</th>
              <th style="padding:8px;font-size:10px;color:#9B6B3A;text-align:center;font-weight:500;">Likes</th>
              <th style="padding:8px;font-size:10px;color:#9B6B3A;text-align:center;font-weight:500;">Coments</th>
              <th style="padding:8px;font-size:10px;color:#9B6B3A;text-align:center;font-weight:500;">Saves</th>
            </tr></thead>
            <tbody>${topPosts.map(postRow).join('')}</tbody>
          </table>
        </div>`:''}
        <div style="margin-top:24px;padding-top:16px;border-top:1px solid #E8DECE;display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:9px;color:#C8B89A;text-transform:uppercase;letter-spacing:.1em;">Agência Primor · Estratégia · Criatividade · Resultados</div>
          <div style="font-size:9px;color:#C8B89A;">Gerado em ${new Date().toLocaleDateString('pt-BR')}</div>
        </div>
      </div>`;
      if(typeof html2pdf==='undefined'){alert('Biblioteca html2pdf não carregada.');return;}
      const el=document.createElement('div');el.innerHTML=html;document.body.appendChild(el);
      await html2pdf().set({margin:[8,8],filename:`metricas-${cliNome.replace(/\s+/g,'-').toLowerCase()}-${new Date().toISOString().slice(0,10)}.pdf`,image:{type:'jpeg',quality:0.95},html2canvas:{scale:2,useCORS:true,logging:false},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}}).from(el).save();
      el.remove();
    },
    // PDF de Aprovação
    openPdfModal(){
      if(!_cliente)return;
      document.getElementById('aw2-pdf-modal')?.remove();
      const now=new Date();
      const meses=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
      const mOpts=meses.map((m,i)=>`<option value="${i+1}"${i===now.getMonth()?' selected':''}>${m}</option>`).join('');
      const aOpts=[2024,2025,2026,2027].map(y=>`<option value="${y}"${y===now.getFullYear()?' selected':''}>${y}</option>`).join('');
      const modal=document.createElement('div');
      modal.id='aw2-pdf-modal';
      modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;';
      modal.innerHTML=`<div style="background:var(--surface);border-radius:16px;padding:28px;width:320px;box-shadow:0 20px 60px rgba(0,0,0,.4);">
        <div style="font-size:15px;font-weight:500;color:var(--text);margin-bottom:4px;">📄 PDF de Aprovação</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:20px;">${_clientes.find(c=>c.email===_cliente)?.nome||_cliente}</div>
        <div style="display:flex;gap:10px;margin-bottom:20px;">
          <div style="flex:2;">
            <label style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:4px;">Mês</label>
            <select id="aw2-pdf-mes" style="width:100%;padding:8px 10px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:12px;">${mOpts}</select>
          </div>
          <div style="flex:1;">
            <label style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:4px;">Ano</label>
            <select id="aw2-pdf-ano" style="width:100%;padding:8px 10px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:12px;">${aOpts}</select>
          </div>
        </div>
        <div style="display:flex;gap:8px;">
          <button onclick="_AW2.gerarPdf()" style="flex:1;padding:10px;border-radius:9px;background:var(--wine);color:#FAF8F2;border:none;cursor:pointer;font-size:12px;font-weight:500;">Gerar PDF</button>
          <button onclick="document.getElementById('aw2-pdf-modal')?.remove()" style="padding:10px 14px;border-radius:9px;background:transparent;color:var(--muted);border:1px solid var(--border);cursor:pointer;font-size:12px;">Cancelar</button>
        </div>
      </div>`;
      document.body.appendChild(modal);
      modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
    },
    async gerarPdf(){
      const mes=parseInt(document.getElementById('aw2-pdf-mes')?.value||new Date().getMonth()+1);
      const ano=parseInt(document.getElementById('aw2-pdf-ano')?.value||new Date().getFullYear());
      document.getElementById('aw2-pdf-modal')?.remove();
      const cliNome=_clientes.find(c=>c.email===_cliente)?.nome||_cliente;
      const meses=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
      const mesNome=meses[mes-1];
      const ini=`${ano}-${String(mes).padStart(2,'0')}-01`;
      const fim=`${ano}-${String(mes).padStart(2,'0')}-31`;
      let posts=[];
      try{
        const{data}=await db.from('posts').select('*').eq('client_email',_cliente).gte('data_post',ini).lte('data_post',fim).order('data_post',{ascending:true});
        posts=data||[];
      }catch(e){alert('Erro ao buscar posts: '+e.message);return;}
      if(!posts.length){alert(`Nenhum post encontrado para ${mesNome}/${ano}.`);return;}

      const fmtData=d=>{if(!d)return'—';const[y,m,day]=d.split('-');return`${day}/${m}/${y}`;};
      const fmtTipo=t=>({feed:'Feed',carrossel:'Carrossel',reels:'Reels',stories:'Stories',tiktok:'TikTok'}[t]||t||'—');
      const fmtStatus=s=>{const map={criacao:{label:'Em criação',bg:'#FFF3E0',color:'#E65100'},revisao:{label:'Em revisão',bg:'#E3F2FD',color:'#1565C0'},aprovado:{label:'Aprovado',bg:'#E8F5E9',color:'#2E7D32'},publicado:{label:'Publicado',bg:'#F3E5F5',color:'#6A1B9A'}};return map[s]||{label:s||'—',bg:'#F5F5F5',color:'#666'};};

      const postsHtml=posts.map(p=>{
        const st=fmtStatus(p.status);
        return`<div style="background:#fff;border-radius:12px;border:1px solid #E8DECE;padding:20px;margin-bottom:16px;page-break-inside:avoid;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:6px;">
            <span style="font-size:11px;color:#9B6B3A;font-weight:500;">${fmtData(p.data_post)}</span>
            <span style="font-size:10px;background:#F5EFE7;color:#5C3D1E;padding:3px 10px;border-radius:20px;">${fmtTipo(p.tipo)}</span>
            <span style="font-size:10px;background:${st.bg};color:${st.color};padding:3px 10px;border-radius:20px;">${st.label}</span>
          </div>
          ${p.tema_titulo?`<div style="font-size:13px;font-weight:500;color:#5C3D1E;margin-bottom:8px;">${p.tema_titulo}</div>`:''}
          ${p.legenda?`<div style="font-size:12px;color:#333;line-height:1.65;margin-bottom:10px;">${p.legenda}</div>`:'<div style="font-size:12px;color:#aaa;margin-bottom:10px;">Sem legenda.</div>'}
          ${p.obs?`<div style="font-size:11px;color:#9B6B3A;padding:8px 10px;background:#FAF8F2;border-radius:6px;margin-bottom:10px;">📝 ${p.obs}</div>`:''}
          <div style="display:flex;gap:12px;margin-top:10px;padding-top:12px;border-top:1px solid #F0E8DB;">
            <div style="flex:1;border:1px dashed #C8B89A;border-radius:8px;padding:10px 14px;text-align:center;">
              <div style="font-size:9px;color:#9B6B3A;text-transform:uppercase;letter-spacing:.12em;margin-bottom:20px;">✓ Aprovado</div>
              <div style="height:1px;border-top:1px dashed #C8B89A;"></div>
              <div style="font-size:8px;color:#C8B89A;margin-top:4px;">Assinatura</div>
            </div>
            <div style="flex:1;border:1px dashed #C8B89A;border-radius:8px;padding:10px 14px;text-align:center;">
              <div style="font-size:9px;color:#9B6B3A;text-transform:uppercase;letter-spacing:.12em;margin-bottom:20px;">✎ Ajuste</div>
              <div style="height:1px;border-top:1px dashed #C8B89A;"></div>
              <div style="font-size:8px;color:#C8B89A;margin-top:4px;">Observação</div>
            </div>
          </div>
        </div>`;
      }).join('');

      const html=`<div style="font-family:Poppins,Arial,sans-serif;background:#FAF8F2;padding:48px;max-width:760px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:36px;padding-bottom:24px;border-bottom:2px solid #E8DECE;">
          <img src="https://crm.gislainebarbeto.com.br/logo-texto.png.jpeg" crossorigin="anonymous" style="height:64px;object-fit:contain;margin-bottom:12px;display:block;margin-left:auto;margin-right:auto;">
          <div style="font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:#9B6B3A;margin-bottom:10px;">Aprovação de Conteúdo</div>
          <div style="font-size:24px;font-weight:300;color:#5C3D1E;margin-bottom:4px;">${cliNome}</div>
          <div style="font-size:13px;color:#7A5230;">${mesNome} · ${ano}</div>
          <div style="font-size:11px;color:#9B6B3A;margin-top:8px;">${posts.length} post${posts.length!==1?'s':''} para aprovação</div>
        </div>
        ${postsHtml}
        <div style="margin-top:36px;padding-top:16px;border-top:1px solid #E8DECE;display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:9px;color:#C8B89A;letter-spacing:.1em;text-transform:uppercase;">Agência Primor · Estratégia · Criatividade · Resultados</div>
          <div style="font-size:9px;color:#C8B89A;">Gerado em ${new Date().toLocaleDateString('pt-BR')}</div>
        </div>
      </div>`;

      if(typeof html2pdf==='undefined'){alert('Biblioteca html2pdf não carregada. Verifique a conexão.');return;}
      const el=document.createElement('div');el.innerHTML=html;document.body.appendChild(el);
      await html2pdf().set({
        margin:[8,8],
        filename:`aprovacao-${cliNome.replace(/\s+/g,'-').toLowerCase()}-${mesNome.toLowerCase()}-${ano}.pdf`,
        image:{type:'jpeg',quality:0.95},
        html2canvas:{scale:2,useCORS:true,logging:false},
        jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}
      }).from(el).save();
      el.remove();
    },
    // Arquivos — Ver documento em modal
    verDoc(idx){
      const doc=_arquivosDocs[idx];if(!doc)return;
      const body=_docContent(doc);
      document.getElementById('aw2-doc-modal')?.remove();
      const modal=document.createElement('div');
      modal.id='aw2-doc-modal';
      modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';
      modal.innerHTML=`<div style="background:var(--surface);border-radius:14px;padding:24px;max-width:640px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.4);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <div><div style="font-size:15px;font-weight:500;color:var(--text)">${doc.titulo}</div>
            <div style="font-size:11px;color:var(--muted)">${doc.agente} · ${_fmtD(doc.data)}</div></div>
          <button onclick="document.getElementById('aw2-doc-modal')?.remove()" style="background:none;border:none;cursor:pointer;font-size:18px;color:var(--muted);padding:4px 8px">✕</button>
        </div>
        <div style="font-size:13px;line-height:1.6;color:var(--text)">${body}</div>
        ${doc.tipo!=='arquivo'&&doc.tipo!=='moodboard'?`<div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border);display:flex;justify-content:flex-end">
          <button class="aw2-btn" onclick="_AW2.baixarDoc(${idx});document.getElementById('aw2-doc-modal')?.remove()">↓ Gerar PDF</button>
        </div>`:''}
      </div>`;
      document.body.appendChild(modal);
      modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
    },
    // Arquivos — Gerar PDF do documento
    async baixarDoc(idx){
      const doc=_arquivosDocs[idx];if(!doc)return;
      if(doc.tipo==='arquivo'){window.open(doc.url||'','_blank');return;}
      if(typeof html2pdf==='undefined'){alert('Biblioteca html2pdf não carregada.');return;}
      const cliNome=_clientes.find(c=>c.email===_cliente)?.nome||_cliente||'cliente';
      const bodyHtml=_docContent(doc);
      const wrap=document.createElement('div');
      wrap.innerHTML=`<div style="font-family:Poppins,Arial,sans-serif;background:#FAF8F2;padding:40px;max-width:680px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:28px;padding-bottom:20px;border-bottom:2px solid #E8DECE;">
          <img src="https://crm.gislainebarbeto.com.br/logo-texto.png.jpeg" crossorigin="anonymous" style="height:52px;object-fit:contain;display:block;margin:0 auto 10px">
          <div style="font-size:9px;letter-spacing:.25em;text-transform:uppercase;color:#9B6B3A;margin-bottom:6px">Marketing Primor</div>
          <div style="font-size:18px;font-weight:300;color:#5C3D1E">${doc.titulo}</div>
          <div style="font-size:12px;color:#7A5230;margin-top:4px">${cliNome} · ${_fmtD(doc.data)}</div>
        </div>
        <div style="font-size:13px;line-height:1.7;color:#333">${bodyHtml}</div>
        <div style="margin-top:28px;padding-top:12px;border-top:1px solid #E8DECE;display:flex;justify-content:space-between;">
          <div style="font-size:9px;color:#C8B89A;letter-spacing:.1em;text-transform:uppercase">Agência Primor · Estratégia · Criatividade · Resultados</div>
          <div style="font-size:9px;color:#C8B89A">Gerado em ${new Date().toLocaleDateString('pt-BR')}</div>
        </div>
      </div>`;
      document.body.appendChild(wrap);
      await html2pdf().set({
        margin:[8,8],
        filename:`${doc.tipo}-${cliNome.replace(/\s+/g,'-').toLowerCase()}-${doc.data||_hoje()}.pdf`,
        image:{type:'jpeg',quality:0.95},
        html2canvas:{scale:2,useCORS:true,logging:false},
        jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}
      }).from(wrap).save();
      wrap.remove();
    },
    // Gabi — Modal de agendamento Instagram
    agendarModalIG(postId){
      document.getElementById('aw2-ig-modal')?.remove();
      const min=new Date(Date.now()+25*60000);
      const defDate=min.toISOString().slice(0,10);
      const defTime=min.toISOString().slice(11,16);
      const modal=document.createElement('div');
      modal.id='aw2-ig-modal';
      modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';
      modal.innerHTML=`<div style="background:var(--surface);border-radius:14px;padding:24px;width:320px;box-shadow:0 20px 60px rgba(0,0,0,.4);">
        <div style="font-size:15px;font-weight:500;color:var(--text);margin-bottom:4px">📅 Agendar no Instagram</div>
        <div style="font-size:11px;color:var(--muted);margin-bottom:20px">Mínimo 20 minutos a partir de agora</div>
        <div style="margin-bottom:14px">
          <label style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:4px">Data</label>
          <input type="date" id="ig-sched-date" value="${defDate}" min="${defDate}" style="width:100%;padding:8px 10px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:12px;box-sizing:border-box">
        </div>
        <div style="margin-bottom:20px">
          <label style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:4px">Horário</label>
          <input type="time" id="ig-sched-time" value="${defTime}" style="width:100%;padding:8px 10px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:12px;box-sizing:border-box">
        </div>
        <div id="ig-sched-err" style="font-size:11px;color:#f87171;margin-bottom:10px;display:none"></div>
        <div style="display:flex;gap:8px">
          <button onclick="_AW2.agendarIG('${postId}')" style="flex:1;padding:10px;border-radius:9px;background:var(--wine);color:#FAF8F2;border:none;cursor:pointer;font-size:12px;font-weight:500">Agendar</button>
          <button onclick="document.getElementById('aw2-ig-modal')?.remove()" style="padding:10px 14px;border-radius:9px;background:transparent;color:var(--muted);border:1px solid var(--border);cursor:pointer;font-size:12px">Cancelar</button>
        </div>
      </div>`;
      document.body.appendChild(modal);
      modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
    },
    async agendarIG(postId){
      const date=document.getElementById('ig-sched-date')?.value;
      const time=document.getElementById('ig-sched-time')?.value;
      const errEl=document.getElementById('ig-sched-err');
      if(!date||!time){if(errEl){errEl.textContent='Preencha data e hora.';errEl.style.display='block';}return;}
      const schedDt=new Date(`${date}T${time}:00`);
      if(schedDt.getTime()<Date.now()+20*60000){if(errEl){errEl.textContent='O agendamento deve ser pelo menos 20 minutos no futuro.';errEl.style.display='block';}return;}
      if(errEl)errEl.style.display='none';
      try{
        const igCreds=await _getIGCreds(_cliente);
        if(!igCreds){alert('Instagram não conectado para este cliente.');return;}
        const{data:post}=await db.from('posts').select('midia_urls,legenda,hashtags,tipo').eq('id',postId).single();
        if(!post?.midia_urls){alert('Este post não tem mídia cadastrada.');return;}
        let mediaUrl='';try{const arr=JSON.parse(post.midia_urls||'[]');mediaUrl=Array.isArray(arr)?arr[0]:arr;}catch{mediaUrl=post.midia_urls;}
        const caption=[(post.legenda||''),(post.hashtags||'')].filter(Boolean).join('\n\n');
        const{tok,aid}=igCreds;const BASE='https://graph.facebook.com/v19.0';
        const isVideo=['reels','video'].includes((post.tipo||'').toLowerCase());
        const containerBody={caption,scheduled_publish_time:Math.floor(schedDt.getTime()/1000),access_token:tok};
        if(isVideo){containerBody.media_type='REELS';containerBody.video_url=mediaUrl;}else{containerBody.image_url=mediaUrl;}
        const cRes=await fetch(`${BASE}/${aid}/media`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(containerBody)}).then(r=>r.json());
        if(cRes.error)throw new Error(cRes.error.message);
        const pRes=await fetch(`${BASE}/${aid}/media_publish`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({creation_id:cRes.id,access_token:tok})}).then(r=>r.json());
        if(pRes.error)throw new Error(pRes.error.message);
        await db.from('posts').update({status:'publicado',obs_int:`Agendado IG: ${date} ${time}`}).eq('id',postId);
        await db.from('automacoes').insert({post_id:postId,client_email:_cliente,tipo:'agendado',resultado:`IG media_id:${pRes.id} para ${date} ${time}`}).then(()=>{},()=>{});
        document.getElementById('aw2-ig-modal')?.remove();
        alert(`✓ Publicação agendada para ${date} às ${time}!`);
        _renderAba(_aba);
      }catch(e){if(errEl){errEl.textContent='Erro: '+e.message;errEl.style.display='block';}else alert('Erro: '+e.message);}
    },
    async publicarIGAgora(postId){
      if(!confirm('Publicar este post no Instagram agora?'))return;
      try{
        const igCreds=await _getIGCreds(_cliente);
        if(!igCreds){alert('Instagram não conectado para este cliente.');return;}
        const{data:post}=await db.from('posts').select('midia_urls,legenda,hashtags,tipo').eq('id',postId).single();
        if(!post?.midia_urls){alert('Este post não tem mídia cadastrada.');return;}
        let mediaUrl='';try{const arr=JSON.parse(post.midia_urls||'[]');mediaUrl=Array.isArray(arr)?arr[0]:arr;}catch{mediaUrl=post.midia_urls;}
        const caption=[(post.legenda||''),(post.hashtags||'')].filter(Boolean).join('\n\n');
        const{tok,aid}=igCreds;const BASE='https://graph.facebook.com/v19.0';
        const isVideo=['reels','video'].includes((post.tipo||'').toLowerCase());
        const containerBody={caption,access_token:tok};
        if(isVideo){containerBody.media_type='REELS';containerBody.video_url=mediaUrl;}else{containerBody.image_url=mediaUrl;}
        const cRes=await fetch(`${BASE}/${aid}/media`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(containerBody)}).then(r=>r.json());
        if(cRes.error)throw new Error(cRes.error.message);
        const pRes=await fetch(`${BASE}/${aid}/media_publish`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({creation_id:cRes.id,access_token:tok})}).then(r=>r.json());
        if(pRes.error)throw new Error(pRes.error.message);
        await db.from('posts').update({status:'publicado',obs_int:`Publicado IG: ${new Date().toLocaleDateString('pt-BR')}`}).eq('id',postId);
        await db.from('automacoes').insert({post_id:postId,client_email:_cliente,tipo:'publicado',resultado:`IG media_id:${pRes.id}`}).then(()=>{},()=>{});
        alert('✓ Post publicado no Instagram!');
        _renderAba(_aba);
      }catch(e){alert('Erro ao publicar: '+e.message);}
    },
    // Chat
    clearChat(){
      if(!_ag)return;
      if(!confirm('Limpar toda a conversa com '+_ag.nome+'?'))return;
      _chatHist[_ag.id]=[];
      try{localStorage.removeItem(_histKey());}catch(e){}
      db.from('agentes_chat_historico').delete().eq('agente_id',_ag.id).eq('client_email',_cliente||'').then(()=>{},()=>{});
      _renderAba('chat');
    },
    saveKey(){
      const k=(document.getElementById('aw2ki')?.value||'').trim();
      if(!k)return;
      localStorage.setItem('primor_anthropic_key',k);
      window.ANTHROPIC_KEY=k;
      _renderAba('chat');
    },
    chatKey(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();this.chatSend();}},
    chatRes(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,90)+'px';},
    async chatSend(){
      const inp=document.getElementById('aw2ci');const text=inp?.value?.trim();
      if(!text||_chatLoad||!_ag)return;
      inp.value='';this.chatRes(inp);_chatLoad=true;document.getElementById('aw2cs').disabled=true;
      try{
        if(!_chatHist[_ag.id])_chatHist[_ag.id]=[];
        _addMsg('user',text);_chatHist[_ag.id].push({role:'user',content:text});
        _histInsertMsg('user',text);_histSaveLocal();
        const msgs=document.getElementById('aw2msgs');
        const td=document.createElement('div');td.id='aw2td';td.className='aw2-msg agent';
        td.innerHTML='<div class="aw2-typ"><div class="aw2-dot"></div><div class="aw2-dot"></div><div class="aw2-dot"></div></div>';
        msgs?.appendChild(td);if(msgs)msgs.scrollTop=msgs.scrollHeight;
        const systemPrompt=await _buildSystemPrompt(_ag.id,_cliente);
        const res=await fetch('https://dloxddrdqsltuwdabwaq.supabase.co/functions/v1/anthropic-proxy',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({system:systemPrompt,messages:_chatHist[_ag.id]})
        });
        const data=await res.json();
        document.getElementById('aw2td')?.remove();
        if(!res.ok){
          const errDetail=data.error?.message||`HTTP ${res.status}`;
          _addMsg('agent',`⚠️ Erro da API: ${errDetail}`);
          return;
        }
        const reply=data.content?.[0]?.text||'Erro ao processar.';
        _chatHist[_ag.id].push({role:'assistant',content:reply});_addMsg('agent',reply);
        _histInsertMsg('assistant',reply);_histSaveLocal();
      }catch(e){
        document.getElementById('aw2td')?.remove();
        _addMsg('agent','⚠️ Erro: '+e.message);
      }finally{
        _chatLoad=false;document.getElementById('aw2cs').disabled=false;document.getElementById('aw2ci')?.focus();
      }
    }
  };

  function inject(){
    if(typeof Admin==='undefined'||typeof db==='undefined'){setTimeout(inject,150);return;}
    _css();
    const savedKey=localStorage.getItem('primor_anthropic_key');
    if(savedKey&&!window.ANTHROPIC_KEY)window.ANTHROPIC_KEY=savedKey;
    Admin.renderAgentes=async function(){await _loadClientes();_hub();};
  }
  inject();
})();
