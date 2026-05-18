// ═══════════════════════════════════════════════════════════════════════
// DOSSIE DO CLIENTE — Marketing Primor CRM v3
// Dados fiscais + perfil estratégico + identidade visual + serviços
// Salva em clientes_fiscal (fiscal) e agentes_trabalhos (perfil)
// ═══════════════════════════════════════════════════════════════════════
(function(){
  'use strict';

  const DOSSIE_DATE = '2099-12-31'; // chave permanente no agentes_trabalhos

  const CSS=`
    .fsc-form{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px;margin-bottom:14px;}
    .fsc-sec{font-size:10px;font-weight:600;color:var(--brown);letter-spacing:.14em;text-transform:uppercase;
             margin:18px 0 12px;padding-top:18px;border-top:1px solid var(--border);display:flex;align-items:center;gap:7px;}
    .fsc-sec:first-of-type{margin-top:0;padding-top:0;border-top:none;}
    .fsc-sec-icon{font-size:14px;}
    .fsc-fg{margin-bottom:10px;}
    .fsc-fl{font-size:10px;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:3px;display:block;}
    .fsc-in,.fsc-sel,.fsc-ta{width:100%;background:var(--beige);border:1px solid var(--border);border-radius:7px;
             padding:8px 11px;font-family:'Poppins',sans-serif;font-size:12px;color:var(--text);outline:none;transition:border-color .2s;box-sizing:border-box;}
    .fsc-in:focus,.fsc-sel:focus,.fsc-ta:focus{border-color:var(--copper);}
    .fsc-ta{resize:vertical;min-height:72px;line-height:1.6;}
    .fsc-r2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
    .fsc-r3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;}
    .fsc-r4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;}
    .fsc-sr{display:flex;gap:8px;margin-top:16px;align-items:center;flex-wrap:wrap;}
    .fsc-btn{background:var(--brown);color:#FAF8F2;border:none;border-radius:7px;padding:9px 20px;
             font-family:'Poppins',sans-serif;font-size:12px;cursor:pointer;transition:opacity .2s;}.fsc-btn:hover{opacity:.85;}
    .fsc-svd{font-size:11px;color:#3A5030;padding:3px 10px;background:#EAF0E6;border-radius:6px;display:none;}
    .fsc-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;}
    .fsc-chip{display:flex;align-items:center;gap:5px;padding:4px 10px;border:1px solid var(--border);
              border-radius:20px;font-size:11px;cursor:pointer;background:var(--beige);color:var(--muted);transition:all .18s;}
    .fsc-chip.on{background:var(--brown);color:#FAF8F2;border-color:var(--brown);}
    .fsc-chip:hover{border-color:var(--copper);}
    .fsc-badge{font-size:10px;padding:2px 8px;border-radius:12px;background:var(--beige);border:1px solid var(--border);color:var(--muted);}
    .fsc-badge.ok{background:#EAF0E6;color:#3A5030;border-color:#C8D8BC;}
    .fsc-badge.warn{background:#FEF9EC;color:#92400E;border-color:#F9D28C;}
  `;

  function _css(){if(document.getElementById('fsc-css'))return;const s=document.createElement('style');s.id='fsc-css';s.textContent=CSS;document.head.appendChild(s);}
  function _v(id){const e=document.getElementById(id);return e?e.value.trim():'';}
  function _set(id,val){const e=document.getElementById(id);if(e)e.value=val||'';}
  function _flash(id,msg){const e=document.getElementById(id);if(!e)return;e.textContent=msg;e.style.display='inline-block';setTimeout(()=>e.style.display='none',2800);}

  const SERVICOS_LISTA = [
    'Gestão de Instagram','Gestão de TikTok','Gestão de Facebook','Gestão de LinkedIn',
    'Tráfego Pago Meta Ads','Tráfego Pago Google Ads','Branding & Identidade Visual',
    'Produção de Reels','Produção de Fotos','Criação de Copy','Consultoria Estratégica',
    'Email Marketing','Relatório Mensal'
  ];

  function _chips(selected=[]){
    return SERVICOS_LISTA.map(s=>`<div class="fsc-chip${selected.includes(s)?' on':''}" onclick="this.classList.toggle('on')" data-srv="${s}">${s}</div>`).join('');
  }
  function _getServicos(){
    return [...document.querySelectorAll('.fsc-chip.on')].map(c=>c.dataset.srv);
  }

  function _form(f={}, p={}, email=''){
    const srv = p.servicos||[];
    return `<div class="fsc-form">

      <!-- ── IDENTIFICAÇÃO ── -->
      <div class="fsc-sec"><span class="fsc-sec-icon">🏢</span>Identificação Legal</div>
      <div class="fsc-r2">
        <div class="fsc-fg"><label class="fsc-fl">Razão Social</label><input class="fsc-in" id="fs-rs" value="${f.razao_social||''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">Nome Fantasia</label><input class="fsc-in" id="fs-nf" value="${f.nome_fantasia||''}"></div>
      </div>
      <div class="fsc-r3">
        <div class="fsc-fg"><label class="fsc-fl">CNPJ</label><input class="fsc-in" id="fs-cnpj" placeholder="00.000.000/0001-00" value="${f.cnpj||''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">CPF (se PF)</label><input class="fsc-in" id="fs-cpf" placeholder="000.000.000-00" value="${f.cpf||''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">Regime Tributário</label>
          <select class="fsc-sel" id="fs-reg">
            <option ${f.regime_tributario==='Simples Nacional'?'selected':''}>Simples Nacional</option>
            <option ${f.regime_tributario==='MEI'?'selected':''}>MEI</option>
            <option ${f.regime_tributario==='Lucro Presumido'?'selected':''}>Lucro Presumido</option>
            <option ${f.regime_tributario==='Lucro Real'?'selected':''}>Lucro Real</option>
            <option ${f.regime_tributario==='Pessoa Física'?'selected':''}>Pessoa Física</option>
          </select>
        </div>
      </div>
      <div class="fsc-r2">
        <div class="fsc-fg"><label class="fsc-fl">Insc. Estadual</label><input class="fsc-in" id="fs-ie" value="${f.ie||''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">Insc. Municipal</label><input class="fsc-in" id="fs-im" value="${f.im||''}"></div>
      </div>

      <!-- ── ENDEREÇO ── -->
      <div class="fsc-sec"><span class="fsc-sec-icon">📍</span>Endereço</div>
      <div class="fsc-r2">
        <div class="fsc-fg"><label class="fsc-fl">Logradouro</label><input class="fsc-in" id="fs-end" value="${f.endereco||''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">Número / Complemento</label><input class="fsc-in" id="fs-num" value="${f.numero||''}${f.complemento?' - '+f.complemento:''}"></div>
      </div>
      <div class="fsc-r3">
        <div class="fsc-fg"><label class="fsc-fl">Bairro</label><input class="fsc-in" id="fs-bairro" value="${f.bairro||''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">Cidade</label><input class="fsc-in" id="fs-cidade" value="${f.cidade||''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">Estado / CEP</label><input class="fsc-in" id="fs-estado" placeholder="SP · 00000-000" value="${f.estado||''}${f.cep?' · '+f.cep:''}"></div>
      </div>

      <!-- ── CONTATO ── -->
      <div class="fsc-sec"><span class="fsc-sec-icon">👤</span>Contato</div>
      <div class="fsc-r3">
        <div class="fsc-fg"><label class="fsc-fl">Responsável</label><input class="fsc-in" id="fs-resp" value="${f.responsavel||''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">WhatsApp / Telefone</label><input class="fsc-in" id="fs-tel" value="${f.telefone||''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">E-mail fiscal</label><input class="fsc-in" type="email" id="fs-ef" value="${f.email_fiscal||''}"></div>
      </div>

      <!-- ── REDES SOCIAIS ── -->
      <div class="fsc-sec"><span class="fsc-sec-icon">📱</span>Redes Sociais & Presença Digital</div>
      <div class="fsc-r3">
        <div class="fsc-fg"><label class="fsc-fl">Instagram</label><input class="fsc-in" id="fs-ig" placeholder="@usuario" value="${p.instagram||f.instagram||''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">TikTok</label><input class="fsc-in" id="fs-tt" placeholder="@usuario" value="${p.tiktok||''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">Facebook</label><input class="fsc-in" id="fs-fb" placeholder="Página ou URL" value="${p.facebook||''}"></div>
      </div>
      <div class="fsc-r3">
        <div class="fsc-fg"><label class="fsc-fl">YouTube</label><input class="fsc-in" id="fs-yt" placeholder="Canal ou URL" value="${p.youtube||''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">LinkedIn</label><input class="fsc-in" id="fs-li" placeholder="Perfil ou URL" value="${p.linkedin||''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">Site / URL</label><input class="fsc-in" id="fs-site" placeholder="https://..." value="${p.site||''}"></div>
      </div>

      <!-- ── DADOS BANCÁRIOS ── -->
      <div class="fsc-sec"><span class="fsc-sec-icon">🏦</span>Dados Bancários</div>
      <div class="fsc-r3">
        <div class="fsc-fg"><label class="fsc-fl">Banco</label><input class="fsc-in" id="fs-banco" value="${f.banco||''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">Agência / Conta</label><input class="fsc-in" id="fs-ag" placeholder="0000 / 00000-0" value="${f.agencia||''}${f.conta?' / '+f.conta:''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">Pix</label><input class="fsc-in" id="fs-pix" value="${f.pix||''}"></div>
      </div>

      <!-- ── CONTRATO & FINANCEIRO ── -->
      <div class="fsc-sec"><span class="fsc-sec-icon">📄</span>Contrato & Financeiro</div>
      <div class="fsc-r4">
        <div class="fsc-fg"><label class="fsc-fl">Início do contrato</label><input class="fsc-in" type="date" id="fs-ci" value="${f.contrato_inicio||''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">Fim do contrato</label><input class="fsc-in" type="date" id="fs-cf" value="${f.contrato_fim||''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">Valor mensal (R$)</label><input class="fsc-in" type="number" step="0.01" id="fs-val" value="${f.valor_mensal||''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">Dia de vencimento</label><input class="fsc-in" type="number" min="1" max="31" id="fs-dia" value="${f.dia_vencimento||5}"></div>
      </div>

      <!-- ── SERVIÇOS CONTRATADOS ── -->
      <div class="fsc-sec"><span class="fsc-sec-icon">✦</span>Serviços Contratados</div>
      <div class="fsc-chips" id="fsc-srv-chips">${_chips(srv)}</div>
      <div class="fsc-r2" style="margin-top:10px;">
        <div class="fsc-fg"><label class="fsc-fl">Qtd posts/mês</label><input class="fsc-in" type="number" id="fs-qposts" value="${p.qtd_posts||''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">Plataformas principais</label><input class="fsc-in" id="fs-plats" placeholder="Instagram, TikTok..." value="${p.plataformas||''}"></div>
      </div>

      <!-- ── BRIEFING DE MARCA ── -->
      <div class="fsc-sec"><span class="fsc-sec-icon">🎯</span>Briefing & Estratégia de Marca</div>
      <div class="fsc-r3">
        <div class="fsc-fg"><label class="fsc-fl">Nicho</label><input class="fsc-in" id="fs-nicho" placeholder="ex: moda feminina" value="${p.nicho||''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">Subnicho</label><input class="fsc-in" id="fs-subnicho" placeholder="ex: plus size" value="${p.subnicho||''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">Tom de voz</label><input class="fsc-in" id="fs-tom" placeholder="ex: sofisticado e direto" value="${p.tom_voz||''}"></div>
      </div>
      <div class="fsc-fg"><label class="fsc-fl">Público-alvo / Persona</label><textarea class="fsc-ta" id="fs-persona">${p.persona||''}</textarea></div>
      <div class="fsc-fg"><label class="fsc-fl">Posicionamento da marca</label><textarea class="fsc-ta" id="fs-posicionamento">${p.posicionamento||''}</textarea></div>
      <div class="fsc-fg"><label class="fsc-fl">Diferenciais / Proposta de valor</label><textarea class="fsc-ta" id="fs-diferenciais">${p.diferenciais||''}</textarea></div>
      <div class="fsc-r2">
        <div class="fsc-fg"><label class="fsc-fl">Objetivo principal</label>
          <select class="fsc-sel" id="fs-obj">
            <option value="" ${!p.objetivo?'selected':''}>— selecionar —</option>
            <option ${p.objetivo==='crescimento'?'selected':''} value="crescimento">Crescimento de seguidores</option>
            <option ${p.objetivo==='conversao'?'selected':''} value="conversao">Conversão / Vendas</option>
            <option ${p.objetivo==='autoridade'?'selected':''} value="autoridade">Autoridade & Branding</option>
            <option ${p.objetivo==='engajamento'?'selected':''} value="engajamento">Engajamento</option>
            <option ${p.objetivo==='awareness'?'selected':''} value="awareness">Awareness / Alcance</option>
          </select>
        </div>
        <div class="fsc-fg"><label class="fsc-fl">Principais concorrentes</label><input class="fsc-in" id="fs-conc" placeholder="ex: @marca1, @marca2" value="${p.concorrentes||''}"></div>
      </div>
      <div class="fsc-fg"><label class="fsc-fl">Arcos editoriais / Narrativas da marca</label><textarea class="fsc-ta" style="min-height:88px" id="fs-arcos">${p.arcos||''}</textarea></div>

      <!-- ── IDENTIDADE VISUAL ── -->
      <div class="fsc-sec"><span class="fsc-sec-icon">🎨</span>Identidade Visual</div>
      <div class="fsc-r2">
        <div class="fsc-fg"><label class="fsc-fl">Paleta de cores (hex)</label><input class="fsc-in" id="fs-paleta" placeholder="#F5EDE0, #8C7234, #2A1F0A" value="${p.paleta||''}"></div>
        <div class="fsc-fg"><label class="fsc-fl">Fontes (display + corpo)</label><input class="fsc-in" id="fs-fontes" placeholder="Cormorant Garamond + Poppins" value="${p.fontes||''}"></div>
      </div>
      <div class="fsc-fg"><label class="fsc-fl">Estética geral</label><textarea class="fsc-ta" id="fs-estetica" placeholder="ex: quiet luxury, minimalista, editorial dark...">${p.estetica||''}</textarea></div>
      <div class="fsc-fg"><label class="fsc-fl">Elementos visuais recorrentes</label><textarea class="fsc-ta" id="fs-elementos">${p.elementos||''}</textarea></div>
      <div class="fsc-fg"><label class="fsc-fl">⚠ NUNCA usar (proibições visuais)</label><textarea class="fsc-ta" id="fs-nunca" style="border-color:rgba(180,60,60,.25)">${p.nunca||''}</textarea></div>

      <!-- ── OBSERVAÇÕES GERAIS ── -->
      <div class="fsc-sec"><span class="fsc-sec-icon">📝</span>Observações Gerais</div>
      <div class="fsc-fg"><textarea class="fsc-ta" style="min-height:88px" id="fs-obs" placeholder="Notas importantes, histórico, contexto adicional...">${f.observacoes||p.obs_gerais||''}</textarea></div>

      <div class="fsc-sr">
        <button class="fsc-btn" onclick="_FSC.save('${email}')">💾 Salvar Dossiê Completo</button>
        <span class="fsc-svd" id="fsc-saved"></span>
      </div>
    </div>`;
  }

  function _arquivosListHtml(arqs,email){
    if(!arqs||!arqs.length)return'<p style="color:var(--muted);text-align:center;padding:24px 0;font-size:12px;font-style:italic;">Nenhum arquivo ainda</p>';
    return`<div style="display:flex;flex-direction:column;gap:7px;">${arqs.map(a=>`<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border:1px solid var(--border);border-radius:10px;background:var(--surface);">
      <span style="font-size:18px;">📄</span>
      <div style="flex:1;min-width:0;">
        <div style="font-size:12px;font-weight:500;color:var(--text);">${a.nome}</div>
        <div style="font-size:11px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${a.url}</div>
      </div>
      <a href="${a.url}" target="_blank" style="font-size:11px;color:var(--copper);text-decoration:none;padding:4px 10px;border:1px solid rgba(201,162,39,.3);border-radius:7px;white-space:nowrap;">↗ Abrir</a>
      <button onclick="_FSC.delArquivo(${a.id},'${email}')" style="background:none;border:none;cursor:pointer;color:var(--muted);font-size:14px;padding:4px;" title="Remover">✕</button>
    </div>`).join('')}</div>`;
  }

  function _arquivosHtml(arqs,email){
    return`<div class="fsc-form">
      <div class="fsc-sec"><span class="fsc-sec-icon">📁</span>Arquivos do Cliente</div>
      <div style="display:flex;gap:8px;margin-bottom:12px;">
        <input id="fsc-arq-nome" placeholder="Nome do arquivo" class="fsc-in" style="flex:1;"/>
        <input id="fsc-arq-url" placeholder="https://..." class="fsc-in" style="flex:2;"/>
        <button class="fsc-btn" onclick="_FSC.addArquivo('${email}')">+ Adicionar</button>
      </div>
      <div id="fsc-arq-list">${_arquivosListHtml(arqs,email)}</div>
    </div>`;
  }

  // API PÚBLICA
  window._FSC={
    async render(email){
      const el=document.getElementById('fsc-container');if(!el)return;
      el.innerHTML='<div style="color:var(--muted);padding:24px;text-align:center;font-size:12px;">Carregando dossiê...</div>';
      let f={}, p={}, arqs=[];
      try{
        const[r1,r2,r3]=await Promise.all([
          db.from('clientes_fiscal').select('*').eq('client_email',email).maybeSingle(),
          db.from('agentes_trabalhos').select('conteudo').eq('agente_id','dossie').eq('aba_id','perfil').eq('client_email',email).eq('data',DOSSIE_DATE).maybeSingle(),
          db.from('arquivos_cliente').select('*').eq('client_email',email).order('created_at',{ascending:false})
        ]);
        f=r1.data||{};p=r2.data?.conteudo||{};
        arqs=(r3.data||[]).filter(a=>a.nome!=='__metricool__');
      }catch{}
      el.innerHTML=_form(f,p,email)+_arquivosHtml(arqs,email);
    },

    async addArquivo(email){
      const nome=document.getElementById('fsc-arq-nome')?.value.trim();
      const url=document.getElementById('fsc-arq-url')?.value.trim();
      if(!nome||!url){alert('Preencha nome e URL');return;}
      await db.from('arquivos_cliente').insert([{client_email:email,nome,url}]);
      const {data}=await db.from('arquivos_cliente').select('*').eq('client_email',email).order('created_at',{ascending:false});
      const list=document.getElementById('fsc-arq-list');
      if(list)list.innerHTML=_arquivosListHtml((data||[]).filter(a=>a.nome!=='__metricool__'),email);
      const ni=document.getElementById('fsc-arq-nome'),ui=document.getElementById('fsc-arq-url');
      if(ni)ni.value='';if(ui)ui.value='';
    },

    async delArquivo(id,email){
      await db.from('arquivos_cliente').delete().eq('id',id);
      const {data}=await db.from('arquivos_cliente').select('*').eq('client_email',email).order('created_at',{ascending:false});
      const list=document.getElementById('fsc-arq-list');
      if(list)list.innerHTML=_arquivosListHtml((data||[]).filter(a=>a.nome!=='__metricool__'),email);
    },

    async save(email){
      if(!email){_flash('fsc-saved','⚠ Sem cliente selecionado');return;}
      const fiscal={
        client_email:email,
        razao_social:_v('fs-rs'), nome_fantasia:_v('fs-nf'),
        cnpj:_v('fs-cnpj'), cpf:_v('fs-cpf'), ie:_v('fs-ie'), im:_v('fs-im'),
        regime_tributario:_v('fs-reg'),
        endereco:_v('fs-end'), numero:_v('fs-num'),
        bairro:_v('fs-bairro'), cidade:_v('fs-cidade'), estado:_v('fs-estado'),
        responsavel:_v('fs-resp'), telefone:_v('fs-tel'), email_fiscal:_v('fs-ef'),
        banco:_v('fs-banco'), agencia:_v('fs-ag'), pix:_v('fs-pix'),
        contrato_inicio:_v('fs-ci')||null, contrato_fim:_v('fs-cf')||null,
        valor_mensal:parseFloat(_v('fs-val'))||null, dia_vencimento:parseInt(_v('fs-dia'))||5,
        observacoes:_v('fs-obs')
      };
      const perfil={
        instagram:_v('fs-ig'), tiktok:_v('fs-tt'), facebook:_v('fs-fb'),
        youtube:_v('fs-yt'), linkedin:_v('fs-li'), site:_v('fs-site'),
        qtd_posts:_v('fs-qposts'), plataformas:_v('fs-plats'),
        nicho:_v('fs-nicho'), subnicho:_v('fs-subnicho'), tom_voz:_v('fs-tom'),
        persona:_v('fs-persona'), posicionamento:_v('fs-posicionamento'),
        diferenciais:_v('fs-diferenciais'), objetivo:_v('fs-obj'),
        concorrentes:_v('fs-conc'), arcos:_v('fs-arcos'),
        paleta:_v('fs-paleta'), fontes:_v('fs-fontes'), estetica:_v('fs-estetica'),
        elementos:_v('fs-elementos'), nunca:_v('fs-nunca'),
        servicos:_getServicos(), obs_gerais:_v('fs-obs')
      };
      try{
        const[e1,e2]=await Promise.all([
          db.from('clientes_fiscal').upsert(fiscal,{onConflict:'client_email'}),
          db.from('agentes_trabalhos').upsert({agente_id:'dossie',aba_id:'perfil',client_email:email,data:DOSSIE_DATE,conteudo:perfil},{onConflict:'agente_id,aba_id,client_email,data'})
        ]);
        _flash('fsc-saved',(e1.error||e2.error)?'⚠ Erro ao salvar':'✓ Dossiê salvo — agentes atualizados automaticamente');
      }catch{_flash('fsc-saved','⚠ Erro de conexão');}
    }
  };

  // INJEÇÃO NA FICHA DO CLIENTE (Admin panel)
  // Não patcha Admin._cliTab — evita interferir no Brand Core e demais abas.
  // O botão Dossiê tem seu próprio onclick completo.
  function _openDossie(){
    ['feed','posts','chat','info','brand','dossie'].forEach(t=>{
      const el=document.getElementById('clitab-'+t);if(!el)return;
      el.style.borderBottomColor=t==='dossie'?'var(--copper)':'transparent';
      el.style.color=t==='dossie'?'var(--copper)':(t==='brand'?'var(--brown)':'var(--muted)');
    });
    const content=document.getElementById('cli-tab-content');
    if(content){
      content.innerHTML='<div id="fsc-container"></div>';
      _FSC.render(Admin._cliClienteData?.email||'');
    }
  }

  function inject(){
    if(typeof Admin==='undefined'||typeof db==='undefined'){setTimeout(inject,200);return;}
    _css();

    const _origOpen=Admin.openCliente.bind(Admin);
    Admin.openCliente=async function(id){
      await _origOpen(id);
      setTimeout(()=>{
        const tabBar=document.getElementById('cli-tabs');
        if(tabBar&&!document.getElementById('clitab-dossie')){
          const btn=document.createElement('button');
          btn.id='clitab-dossie';
          btn.textContent='📋 Dossiê';
          btn.style.cssText='padding:9px 16px;font-size:12px;border:none;background:none;cursor:pointer;border-bottom:2px solid transparent;color:var(--muted);transition:all .15s;font-family:Poppins,sans-serif;white-space:nowrap;';
          btn.onclick=_openDossie;
          tabBar.appendChild(btn);
        }
      },100);
    };
  }
  inject();
})();
