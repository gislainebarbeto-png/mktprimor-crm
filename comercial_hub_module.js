// ════════════════════════════════════════════════════════════════════════
// COMERCIAL HUB — Marketing Primor CRM
// Funil completo: Captação · Qualificação · Abordagem · Proposta ·
//                 Onboarding · Pós-venda · Follow-up
// ════════════════════════════════════════════════════════════════════════
//
// SIDEBAR — adicionar no menu admin (já incluído no index.html atualizado)
// TAB    — já incluído no Admin.tab() do index.html atualizado
// ════════════════════════════════════════════════════════════════════════

(function () {
  function init() {
    if (typeof Admin === 'undefined') { setTimeout(init, 100); return; }

    if (!document.getElementById('com-hub-style')) {
      const s = document.createElement('style');
      s.id = 'com-hub-style';
      s.textContent = `
        .com-shell{display:grid;grid-template-columns:190px 1fr;min-height:600px;}
        .com-nav{border-right:1px solid var(--border);}
        .com-nav-item{padding:11px 14px;cursor:pointer;font-size:12px;color:var(--muted);border-bottom:1px solid var(--border);transition:all .15s;display:flex;align-items:center;gap:8px;line-height:1.3;}
        .com-nav-item:hover{background:var(--beige);color:var(--brown);}
        .com-nav-item.on{background:var(--beige);color:var(--brown);border-left:2px solid var(--copper);}
        .com-content{padding:24px 28px;}
        .com-title{font-family:'Cormorant Garamond',serif;font-size:26px;font-style:italic;color:var(--brown);margin-bottom:4px;}
        .com-sub{font-size:12px;color:var(--muted);margin-bottom:18px;line-height:1.6;}
        .com-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;}
        .com-tab{font-size:11px;padding:5px 12px;border-radius:20px;border:1px solid var(--border);color:var(--muted);cursor:pointer;transition:all .15s;background:transparent;font-family:Poppins,sans-serif;}
        .com-tab.on{background:var(--brown);color:#F5F5F5;border-color:var(--brown);}
        .com-block{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:15px 18px;margin-bottom:10px;}
        .com-lbl{font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--copper);margin-bottom:8px;}
        .com-msg{background:var(--beige);border-radius:10px;padding:12px 14px;font-size:12px;color:var(--text);line-height:1.75;white-space:pre-wrap;margin-top:8px;border:1px solid var(--border);}
        .com-tip{font-size:12px;color:var(--muted);line-height:1.65;padding-top:10px;border-top:1px solid var(--border);margin-top:10px;}
        .com-tip strong{color:var(--text);font-weight:500;}
        .com-ck{list-style:none;display:flex;flex-direction:column;gap:8px;}
        .com-ck li{display:flex;gap:10px;align-items:flex-start;font-size:13px;color:var(--text);line-height:1.55;}
        .com-ck li::before{content:'';width:16px;height:16px;border:1px solid var(--border);border-radius:4px;flex-shrink:0;margin-top:1px;}
        .com-flags{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;}
        .com-fg{font-size:11px;padding:3px 10px;border-radius:20px;}
        .com-fg-g{background:#E8F5E9;color:#2E7D32;border:1px solid #A5D6A7;}
        .com-fg-r{background:#FFEBEE;color:#C62828;border:1px solid #EF9A9A;}
        .com-fg-y{background:#FFF3E0;color:#E65100;border:1px solid #FFCC80;}
        .com-verdict{border-radius:12px;padding:14px 16px;margin-top:8px;}
        .com-vok{background:#E8F5E9;border:1px solid #A5D6A7;}
        .com-vno{background:#FFEBEE;border:1px solid #EF9A9A;}
        .com-tl-row{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid var(--border);align-items:flex-start;}
        .com-tl-row:last-child{border-bottom:none;}
        .com-tl-day{font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);min-width:48px;}
        .com-funil-card{display:flex;align-items:center;gap:14px;padding:15px 18px;background:var(--surface);border:1px solid var(--border);border-radius:12px;cursor:pointer;transition:all .2s;margin-bottom:8px;}
        .com-funil-card:hover{border-color:var(--copper);transform:translateX(4px);box-shadow:var(--sh);}
        .com-funil-num{font-family:'Cormorant Garamond',serif;font-size:26px;color:var(--border);line-height:1;min-width:30px;}
        .com-dd{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;}
        .com-do{background:#E8F5E9;border:1px solid #A5D6A7;border-radius:10px;padding:10px 12px;}
        .com-dont{background:#FFEBEE;border:1px solid #EF9A9A;border-radius:10px;padding:10px 12px;}
        .com-do-l{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#2E7D32;margin-bottom:5px;}
        .com-dont-l{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#C62828;margin-bottom:5px;}
        .com-sl{list-style:none;display:flex;flex-direction:column;gap:4px;font-size:11px;color:var(--text);line-height:1.5;}
        .com-day-btns{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:16px;}
        .com-day-btn{width:36px;height:36px;border-radius:50%;border:1px solid var(--border);font-size:11px;color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;background:transparent;font-family:Poppins,sans-serif;}
        .com-day-btn.on{background:var(--brown);color:#F5F5F5;border-color:var(--brown);}
        html.dark .com-fg-g{background:rgba(46,125,50,.15)!important;color:#81C784!important;border-color:rgba(46,125,50,.3)!important;}
        html.dark .com-fg-r{background:rgba(198,40,40,.15)!important;color:#EF9A9A!important;border-color:rgba(198,40,40,.3)!important;}
        html.dark .com-fg-y{background:rgba(230,81,0,.15)!important;color:#FFB74D!important;border-color:rgba(230,81,0,.3)!important;}
        html.dark .com-vok{background:rgba(46,125,50,.12)!important;border-color:rgba(46,125,50,.3)!important;}
        html.dark .com-vno{background:rgba(198,40,40,.12)!important;border-color:rgba(198,40,40,.3)!important;}
        html.dark .com-do{background:rgba(46,125,50,.12)!important;border-color:rgba(46,125,50,.3)!important;}
        html.dark .com-dont{background:rgba(198,40,40,.12)!important;border-color:rgba(198,40,40,.3)!important;}
        html.dark .com-do-l{color:#81C784!important;}
        html.dark .com-dont-l{color:#EF9A9A!important;}
        @media(max-width:860px){
          .com-shell{grid-template-columns:1fr;}
          .com-nav{border-right:none;border-bottom:1px solid var(--border);display:flex;flex-wrap:wrap;padding:6px;}
          .com-nav-item{border-bottom:none;border-radius:8px;padding:7px 10px;font-size:11px;}
          .com-nav-item.on{border-left:none;border:1px solid var(--copper);}
          .com-content{padding:16px;}
          .com-dd{grid-template-columns:1fr;}
        }
      `;
      document.head.appendChild(s);
    }

    Admin._comSec = 'funil';
    Admin._comSub = {};

    // ── HELPERS ────────────────────────────────────────────────────────
    Admin._comGo = function(sec) {
      Admin._comSec = sec;
      document.querySelectorAll('.com-nav-item').forEach(el => el.classList.remove('on'));
      document.getElementById('com-nav-' + sec)?.classList.add('on');
      const el = document.getElementById('com-content'); if (!el) return;
      const fn = {
        funil: () => Admin._comFunil(),
        captacao: () => Admin._comCaptacao(Admin._comSub.captacao || 'dm'),
        qualificacao: () => Admin._comQual(),
        abordagem: () => Admin._comAbord(Admin._comSub.abordagem || 'dm'),
        proposta: () => Admin._comProposta(),
        onboarding: () => Admin._comOnb(Admin._comSub.onboarding ?? 0),
        posvenda: () => Admin._comPV(Admin._comSub.posvenda || 'ciclo'),
        followup: () => Admin._comFU(Admin._comSub.followup || 'pensando'),
      };
      el.innerHTML = fn[sec] ? fn[sec]() : '';
    };

    Admin._comTab = function(sec, sub) {
      Admin._comSub[sec] = sub; Admin._comGo(sec);
    };

    Admin._comDayNav = function(day) {
      Admin._comSub.onboarding = day;
      const el = document.getElementById('com-content');
      if (el) el.innerHTML = Admin._comOnb(day);
    };

    // ── TABS HTML ──────────────────────────────────────────────────────
    Admin._tabs = function(sec, list, cur) {
      return `<div class="com-tabs">${list.map(([k,l]) => `<span class="com-tab ${k===cur?'on':''}" onclick="Admin._comTab('${sec}','${k}')">${l}</span>`).join('')}</div>`;
    };

    // ── RENDER PRINCIPAL ───────────────────────────────────────────────
    Admin.renderComercial = async function() {
      const main = document.getElementById('admin-main'); if (!main) return;
      const nav = [
        ['funil','◈','Funil comercial'],
        ['captacao','◉','Captação'],
        ['qualificacao','✓','Qualificação'],
        ['abordagem','◷','Abordagem'],
        ['proposta','▤','Proposta'],
        ['onboarding','▦','Onboarding'],
        ['posvenda','◎','Pós-venda'],
        ['followup','↗','Follow-up'],
      ];
      main.innerHTML = `
        <div style="margin-bottom:20px;">
          <h2 class="section-title" style="margin:0 0 3px;">Comercial</h2>
          <div style="font-size:12px;color:var(--muted);">Funil completo da Primor — captação ao pós-venda</div>
        </div>
        <div class="com-shell">
          <div class="com-nav">
            ${nav.map(([k,i,l]) => `<div class="com-nav-item ${k===Admin._comSec?'on':''}" id="com-nav-${k}" onclick="Admin._comGo('${k}')"><span style="font-size:13px;">${i}</span><span>${l}</span></div>`).join('')}
          </div>
          <div class="com-content" id="com-content"></div>
        </div>`;
      Admin._comGo(Admin._comSec || 'funil');
    };

    // ════════════════════════════════════════════════════════════════════
    // 1. FUNIL
    // ════════════════════════════════════════════════════════════════════
    Admin._comFunil = function() {
      const stages = [
        ['captacao','01','Captação','Instagram · WhatsApp · Indicação · Bio'],
        ['qualificacao','02','Qualificação','7 perguntas · filtro de cliente ideal'],
        ['abordagem','03','Abordagem e fechamento','DM · WhatsApp · diagnóstico · objeções'],
        ['proposta','04','Proposta e contrato','Template editável · validade · fechamento'],
        ['onboarding','05','Onboarding (7 dias)','Pedro assume · persona · briefing pra Chloe'],
        ['posvenda','06','Pós-venda e retenção','Ciclo mensal · saúde · upsell · renovação'],
        ['followup','07','Follow-up de leads frios','Sequências por cenário · timing · regras'],
      ];
      return `
        <div class="com-title">Funil comercial</div>
        <div class="com-sub">Clique em qualquer etapa para acessar os scripts completos.</div>
        ${stages.map(([sec,n,t,s]) => `
          <div class="com-funil-card" onclick="Admin._comGo('${sec}')">
            <div class="com-funil-num">${n}</div>
            <div style="flex:1;">
              <div style="font-size:14px;color:var(--brown);margin-bottom:2px;">${t}</div>
              <div style="font-size:11px;color:var(--muted);">${s}</div>
            </div>
            <span style="color:var(--copper);font-size:15px;">→</span>
          </div>`).join('')}`;
    };

    // ════════════════════════════════════════════════════════════════════
    // 2. CAPTAÇÃO
    // ════════════════════════════════════════════════════════════════════
    Admin._comCaptacao = function(sub) {
      const tabs = Admin._tabs('captacao',[['dm','DM Instagram'],['whatsapp','WhatsApp'],['indicacoes','Indicações'],['bio','Bio e gatilhos']],sub);
      const c = {
        dm: `
          <div class="com-block"><div class="com-lbl">Tática 1 — quem reage ao seu story</div>
            <div style="font-size:13px;color:var(--text);margin-bottom:8px;">Lead mais quente que existe — a maioria das agências deixa passar.</div>
            <div class="com-msg">Oi, [nome]! Que bom que isso fez sentido pra você ✦\n\nMe conta — você trabalha com o quê? Fico curiosa de entender o seu negócio.</div>
            <div class="com-tip"><strong>Regra:</strong> toda reação de story de fundadora ou empreendedora vira conversa. Só iniciar — sem vender.</div></div>
          <div class="com-block"><div class="com-lbl">Tática 2 — de comentário para DM</div>
            <div class="com-msg">Que bom que ressoou! Me conta mais sobre o seu negócio — tenho curiosidade ✦</div>
            <div class="com-tip">Não manda preço no comentário. Só abre com curiosidade genuína.</div></div>
          <div class="com-block"><div class="com-lbl">Tática 3 — abordagem proativa</div>
            <div class="com-msg">Oi, [nome]! Passei no seu perfil e adorei o que você faz com [nicho específico].\n\nTenho curiosidade — como está sendo a sua presença digital hoje? Você está satisfeita com o que o conteúdo está comunicando sobre a sua marca?</div>
            <div class="com-tip"><strong>Nunca mande DM genérico.</strong> Mencione algo real que você viu. DM personalizado tem taxa de resposta 4x maior.</div></div>
          <div class="com-block"><div class="com-lbl">CTAs que geram DM espontâneo</div>
            <div class="com-dd">
              <div class="com-do"><div class="com-do-l">Funciona</div><ul class="com-sl"><li>"Me chama no DM se fez sentido"</li><li>"Comenta aqui se você se identifica"</li><li>"Qual dessas é a sua situação?"</li><li>Carrossel que termina com pergunta</li><li>Reels que mostra resultado de cliente</li></ul></div>
              <div class="com-dont"><div class="com-dont-l">Evite</div><ul class="com-sl"><li>"Link na bio para contratar"</li><li>"Clique para saber o preço"</li><li>"Vagas abertas — agende agora"</li><li>CTA de venda direta no feed</li></ul></div>
            </div></div>`,
        whatsapp: `
          <div class="com-block"><div class="com-lbl">Status — vitrine mais subestimada</div>
            <div style="font-size:13px;color:var(--text);margin-bottom:8px;">Visto por quem já tem o número da Primor. É o canal mais quente porque já existe relação.</div>
            <div class="com-tip"><strong>Postar:</strong> bastidores de projeto, resultado concluído, reflexão sobre branding, vaga aberta.<br><strong>Não postar:</strong> promoção com desconto, preço, "últimas vagas" todo mês.</div></div>
          <div class="com-block"><div class="com-lbl">Lista de transmissão — broadcast mensal</div>
            <div class="com-msg">Oi! Encerramos mais um mês aqui na Primor ✦\n\nUma coisa que observei: marcas com posicionamento claro convertem muito mais com o mesmo volume de conteúdo. Não é sobre postar mais — é sobre postar certo.\n\nSe isso fez sentido pro seu momento, me chama pra conversar.</div>
            <div class="com-tip"><strong>Frequência:</strong> uma vez por mês, no máximo. Lista que manda toda semana vira spam.</div></div>
          <div class="com-block"><div class="com-lbl">Link na bio → abre conversa no WhatsApp</div>
            <div class="com-msg">Mensagem pré-preenchida sugerida:\n\n"Oi, Gi! Vi o seu perfil e quero saber mais sobre a Marketing Primor ✦"</div>
            <div class="com-tip">Quem clica já está predisposta a conversar. Não precisa de CTA agressivo.</div></div>`,
        indicacoes: `
          <div class="com-block"><div class="com-lbl">Quando e como pedir</div>
            <div style="font-size:13px;color:var(--text);margin-bottom:8px;">Nunca no início. O melhor momento é quando o cliente acabou de ter um resultado concreto.</div>
            <div class="com-msg">Oi, [nome]! Que bom ver esse resultado acontecendo ✦\n\nVocê conhece alguém que está na mesma situação que você estava antes — querendo uma presença digital mais consistente?\n\nSe indicar e a pessoa fechar, tenho um mimo especial pra você. Só fala o nome e eu tomo conta do restante.</div>
            <div class="com-tip"><strong>Torne fácil indicar.</strong> "Só me manda o nome e eu cuido" funciona muito mais do que pedir que ela apresente sozinha.</div></div>
          <div class="com-block"><div class="com-lbl">Os 3 momentos certos para pedir</div>
            <div class="com-tip"><strong>Mês 1:</strong> "Você me contou que tinha uma amiga passando por isso — ela conseguiu avançar?"<br><br><strong>Mês 3 (renovação):</strong> "Já que estamos renovando — você conhece alguém que eu poderia ajudar como ajudei você?"<br><br><strong>Pós-resultado expressivo:</strong> "Esse resultado foi lindo. Quem mais na sua rede merece ter isso?"</div></div>
          <div class="com-block"><div class="com-lbl">Parceiros estratégicos</div>
            <div class="com-dd">
              <div class="com-do"><div class="com-do-l">Parceiros ideais</div><ul class="com-sl"><li>Coaches e mentoras de negócio</li><li>Fotógrafas de marca pessoal</li><li>Web designers e devs</li><li>Contadoras de MEIs e PJs</li><li>Consultoras de moda e imagem</li></ul></div>
              <div class="com-dont"><div class="com-dont-l">Evite</div><ul class="com-sl"><li>Outras agências de conteúdo</li><li>Gestores de tráfego concorrentes</li><li>Quem não cuida da própria marca</li></ul></div>
            </div>
            <div class="com-msg" style="margin-top:10px;">Oi, [nome]! Acompanho o seu trabalho e admiro como você cuida das suas clientes.\n\nPercebo que atendemos públicos parecidos. Faz sentido a gente trocar indicações? Quando eu tiver uma cliente que precisar do que você faz, te chamo — e vice-versa ✦</div></div>`,
        bio: `
          <div class="com-block"><div class="com-lbl">Bio que atrai e já qualifica</div>
            <div style="font-size:13px;color:var(--text);margin-bottom:8px;">A bio não explica o que você faz — faz o cliente ideal se reconhecer e o errado se afastar.</div>
            <div class="com-dd">
              <div class="com-do"><div class="com-do-l">Funciona</div><ul class="com-sl"><li>Fala direto com o cliente ideal</li><li>Usa "atendimento seletivo"</li><li>CTA que abre conversa</li><li>Resultado ou transformação clara</li></ul></div>
              <div class="com-dont"><div class="com-dont-l">Evite</div><ul class="com-sl"><li>"Agência de marketing digital"</li><li>Lista de serviços genérica</li><li>"Orçamento pelo link"</li><li>Sem personalidade ou ponto de vista</li></ul></div>
            </div></div>
          <div class="com-block"><div class="com-lbl">Frases que atraem o perfil Primor</div>
            <div class="com-tip">"Branding não é estética — é estratégia."<br>"Não criamos conteúdo. Construímos presença."<br>"Pra quem quer ser lembrado pelo certo, não pelo volume."<br>"Atendimento seletivo — porque o projeto merece atenção total."<br><br><strong>Afastam o perfil errado:</strong> volume de posts, seguidores rápidos, "viralize", "15 reels por semana".</div></div>
          <div class="com-block"><div class="com-lbl">Destaques essenciais</div>
            <div class="com-tip"><strong>Portfólio</strong> — resultados visuais de clientes<br><strong>Processo</strong> — como funciona trabalhar com a Primor<br><strong>Clientes</strong> — depoimentos reais, prints de mensagens<br><strong>Sobre</strong> — quem é a Gi, a história da Primor<br><strong>Vagas</strong> — quando tem e quando não tem abertura</div></div>`,
      };
      return `<div class="com-title">Captação de leads</div><div class="com-sub">Táticas por canal — Instagram, WhatsApp, indicações e posicionamento de bio.</div>${tabs}${c[sub]||''}`;
    };

    // ════════════════════════════════════════════════════════════════════
    // 3. QUALIFICAÇÃO
    // ════════════════════════════════════════════════════════════════════
    Admin._comQual = function() {
      const qs = [
        {n:'01',fase:'Fase 1 — Contexto',q:'Me conta um pouco sobre você e o seu negócio — o que você faz e pra quem?',note:'Deixa a pessoa falar. Negócio real, clareza do que vende, fala com segurança.',g:['Fundador com negócio ativo','Clareza sobre o público'],r:['Ainda em ideia','Sem nicho definido']},
        {n:'02',fase:'',q:'Você já investe em marketing ou branding hoje? Como está sendo isso?',note:'Revela maturidade. Quem já investiu e teve experiência ruim está pronto para valorizar a Primor.',g:['Já investiu antes','Insatisfeita com resultado atual'],r:['Nunca investiu e quer testar','Quer fazer sozinha mas precisa de ajuda']},
        {n:'03',fase:'Fase 2 — Dor e objetivo',q:'O que está te incomodando agora na sua presença digital? O que você sente que falta?',note:'Dor real e urgente fecha. Dor vaga some.',g:['Perco clientes por causa da imagem','Minha marca não me representa','Não tenho consistência'],r:['Tô bem, só quero melhorar','Amigos disseram que precisava']},
        {n:'04',fase:'',q:'Qual seria o resultado ideal pra você em 3 meses trabalhando juntas?',note:'Filtra expectativas irreais. Posicionamento e percepção = nível certo.',g:['Marca com identidade sólida','Conteúdo que posiciona','Presença que converte clientes ideais'],r:['Viralizar','X seguidores em X dias']},
        {n:'05',fase:'Fase 3 — Decisão e budget',q:'Além de você, tem mais alguém envolvido nessa decisão?',note:'Fale com quem decide. Se tem outra pessoa, ela precisa estar na reunião de proposta.',g:['Decisão é minha','Sócio já sabe e apoia'],r:['Precisa consultar o marido','Depende de aprovação da empresa']},
        {n:'06',fase:'',q:'Você já tem uma ideia de quanto quer investir por mês nessa parceria?',note:'Não revele seu preço antes. Deixa ela falar primeiro.',g:['Ticket compatível com Primor','"Depende do que inclui"'],r:['Quer o mais barato possível','Valor muito abaixo do mínimo']},
        {n:'07',fase:'Fase 4 — Timing',q:'Quando você imagina começar? Tem alguma data importante chegando?',note:'Urgência real fecha mais rápido. Protege também seu planejamento de onboarding.',g:['Quer começar esse mês','Tem lançamento ou evento próximo'],r:['"Quando você tiver vaga"','"Talvez no ano que vem"']},
      ];
      return `
        <div class="com-title">Script de qualificação</div>
        <div class="com-sub">7 perguntas em 4 fases para identificar o cliente ideal da Primor.</div>
        ${qs.map(p => `
          <div class="com-block">
            ${p.fase ? `<div class="com-lbl">${p.fase}</div>` : ''}
            <div style="font-size:10px;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px;">Pergunta ${p.n}</div>
            <div style="font-size:15px;color:var(--text);margin-bottom:8px;line-height:1.5;">"${p.q}"</div>
            <div style="font-size:12px;color:var(--muted);margin-bottom:10px;line-height:1.65;">${p.note}</div>
            <div class="com-flags">
              ${p.g.map(x=>`<span class="com-fg com-fg-g">${x}</span>`).join('')}
              ${p.r.map(x=>`<span class="com-fg com-fg-r">${x}</span>`).join('')}
            </div>
          </div>`).join('')}
        <div class="com-verdict com-vok">
          <div style="font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:#2E7D32;margin-bottom:6px;">Cliente ideal — avança para proposta</div>
          <div style="font-size:13px;color:#2E7D32;line-height:1.65;">Negócio ativo, dor real e urgente, já investiu antes, decide sozinha, tem budget compatível, quer começar em breve.</div>
        </div>
        <div class="com-verdict com-vno" style="margin-top:8px;">
          <div style="font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:#C62828;margin-bottom:6px;">Não é o momento — nurture ou dispensa</div>
          <div style="font-size:13px;color:#C62828;line-height:1.65;">Negócio inicial, sem budget, depende de terceiros para decidir, ou quer resultado incompatível com o posicionamento da Primor.</div>
        </div>`;
    };

    // ════════════════════════════════════════════════════════════════════
    // 4. ABORDAGEM
    // ════════════════════════════════════════════════════════════════════
    Admin._comAbord = function(sub) {
      const tabs = Admin._tabs('abordagem',[['dm','DM Instagram'],['whatsapp','WhatsApp'],['diagnostico','Reunião'],['apresentar','Proposta'],['objecoes','Objeções']],sub);
      const c = {
        dm: `
          <div class="com-block"><div class="com-lbl">Quando o lead te manda DM primeiro</div>
            <div class="com-msg">Oi, [nome]! Que bom ter você por aqui ✦\n\nMe conta — o que te trouxe até a Primor?</div>
            <div class="com-tip">Deixa ela falar. Curiosidade genuína fecha mais do que pitch.</div></div>
          <div class="com-block"><div class="com-lbl">Quando ela segue e você quer abordar</div>
            <div class="com-msg">Oi, [nome]! Vi que você nos seguiu e fui dar uma olhada no seu perfil — adorei o que você faz com [nicho dela].\n\nTenho curiosidade: como está sendo a sua presença digital hoje?</div>
            <div class="com-tip"><strong>Nunca mande DM genérico.</strong> Mencione algo real que você viu no perfil.</div></div>
          <div class="com-block"><div class="com-lbl">Quando ela pede preço logo de cara</div>
            <div class="com-msg">Os valores variam bastante de acordo com o projeto — a Primor trabalha de forma personalizada, então preciso entender um pouco mais da sua situação antes de te passar qualquer número.\n\nPosso te fazer algumas perguntas rápidas?</div>
            <div class="com-tip">Nunca manda tabela de preços no DM. Quem recebe preço sem contexto sempre acha caro.</div></div>`,
        whatsapp: `
          <div class="com-block"><div class="com-lbl">Pedindo o número no DM</div>
            <div class="com-msg">Adorei entender um pouco mais do seu momento!\n\nVamos continuar por WhatsApp? Fica mais fácil pra gente conversar direitinho. Me manda o seu número ou me chama lá: [seu número]</div></div>
          <div class="com-block"><div class="com-lbl">Primeira mensagem no WhatsApp</div>
            <div class="com-msg">Oi, [nome]! Sou a Gi, da Marketing Primor ✦\n\nContinuando nossa conversa — você mencionou que [repete a dor que ela disse no DM]. Quero entender melhor isso pra ver se faz sentido a gente trabalhar juntas.\n\nPosso te fazer mais algumas perguntas?</div>
            <div class="com-tip"><strong>Sempre retome o contexto.</strong> Lembrar do que ela disse cria conexão imediata.</div></div>
          <div class="com-block"><div class="com-lbl">Propondo a reunião de diagnóstico</div>
            <div class="com-msg">Olha, pelo que você me contou, acho que vale muito a gente conversar melhor — tenho algumas ideias que podem fazer sentido pro seu momento.\n\nQue tal uma conversa de 30 minutos essa semana? Sem compromisso, só pra eu entender mais fundo e você entender como a Primor trabalha.\n\nQuarta ou quinta te atende?</div>
            <div class="com-tip">Ofereça duas opções de dia — não "qual dia você prefere". Duas opções aceleram a decisão.</div></div>`,
        diagnostico: `
          <div class="com-block"><div class="com-lbl">Abertura — 30 a 45 minutos</div>
            <div class="com-msg">Que bom ter você aqui! Antes de falar sobre a Primor, quero entender melhor a sua situação — assim consigo ver se realmente faz sentido e de que forma a gente pode trabalhar juntas.\n\nPode me contar um pouco mais sobre [negócio dela]?</div></div>
          <div class="com-block"><div class="com-lbl">Perguntas de aprofundamento</div>
            <div class="com-msg">"O que você sente que a sua marca não está comunicando hoje?"\n\n"Quando você pensa no cliente que você quer atrair — como ele é? Ele te encontra hoje?"\n\n"O que aconteceria no seu negócio se a sua presença digital estivesse exatamente como você imagina?"</div>
            <div class="com-tip">A última pergunta é a mais poderosa. Conecta o projeto ao resultado real — não é sobre conteúdo, é sobre o negócio dela crescer.</div></div>
          <div class="com-block"><div class="com-lbl">Transição para a proposta</div>
            <div class="com-msg">Pelo que você me contou, consigo ver muito bem o que precisa ser feito — e é exatamente o tipo de projeto que a Primor faz muito bem.\n\nVou preparar uma proposta personalizada. Você prefere receber por e-mail ou WhatsApp? E qual o melhor momento pra gente conversar sobre ela — amanhã ou depois?</div>
            <div class="com-tip"><strong>Nunca manda a proposta sem agendar a conversa.</strong> Proposta sem reunião de apresentação é proposta sem fechamento.</div></div>`,
        apresentar: `
          <div class="com-block"><div class="com-lbl">Abertura da reunião de proposta</div>
            <div class="com-msg">Antes de te mostrar o que preparei, deixa eu recapitular o que você me contou — quero ter certeza que não perdi nada.\n\nVocê disse que [problema 1], que [problema 2], e que o grande objetivo é [objetivo dela]. Está certo?</div>
            <div class="com-tip">Recapitular a dor antes do preço é o que cria valor. Ela vai sentir que a proposta foi feita pra ela — porque foi.</div></div>
          <div class="com-block"><div class="com-lbl">Apresentando o investimento</div>
            <div class="com-msg">Para tudo isso que você precisa — [resumo do escopo] — o investimento mensal é de R$ [valor].\n\nIsso inclui [principais entregas]. E a gente começa em [data de onboarding].</div>
            <div class="com-tip">Fale o preço com naturalidade, sem hesitar. Hesitação comunica insegurança.<br><strong>Depois que você diz o valor — pare de falar.</strong> A primeira pessoa que falar depois do preço perde a negociação.</div></div>
          <div class="com-block"><div class="com-lbl">Fechando</div>
            <div class="com-msg">Faz sentido pra você?\n\nSe sim, a gente pode confirmar [data] como início — eu preparo o contrato ainda essa semana.</div></div>`,
        objecoes: `
          <div class="com-block"><div class="com-lbl">Objeção 1 — "Vou pensar e te retorno."</div>
            <div class="com-msg">Com certeza! O que você ainda precisa avaliar pra tomar essa decisão? Tem alguma dúvida que eu não respondi bem?</div>
            <div class="com-tip">Nunca aceite "vou pensar" como resposta final. Pergunte o que está travando.</div></div>
          <div class="com-block"><div class="com-lbl">Objeção 2 — "Está caro."</div>
            <div class="com-msg">Entendo. Me ajuda a entender — caro em relação a quê? Você comparou com outras agências, ou o valor em si está acima do que você esperava investir?</div>
            <div class="com-tip">Nunca justifique o preço sem entender o que gerou a objeção. "Caro em relação a outra agência" e "caro pra meu momento financeiro" têm respostas completamente diferentes.</div></div>
          <div class="com-block"><div class="com-lbl">Objeção 3 — "Preciso falar com meu marido/sócio."</div>
            <div class="com-msg">Claro! O que eu precisaria apresentar pra ele pra ajudar nessa conversa? Posso preparar um resumo, ou prefere que a gente marque uma conversa rápida com os dois juntos?</div>
            <div class="com-tip">Ofereça uma reunião com todos os decisores — é a forma mais rápida de fechar.</div></div>
          <div class="com-block"><div class="com-lbl">Objeção 4 — "Agora não é o momento."</div>
            <div class="com-msg">Entendo totalmente. Quando você imagina que seria o momento certo? Pergunto porque a minha agenda tem uma janela abrindo só em [mês] — e quero ter você em mente pra essa vaga.</div>
            <div class="com-tip">Cria urgência real com escassez real. A Primor tem atendimento seletivo — use com naturalidade, nunca como pressão falsa.</div></div>`,
      };
      return `<div class="com-title">Abordagem e fechamento</div><div class="com-sub">Scripts para cada fase — do primeiro DM ao fechamento.</div>${tabs}${c[sub]||''}`;
    };

    // ════════════════════════════════════════════════════════════════════
    // 5. PROPOSTA
    // ════════════════════════════════════════════════════════════════════
    Admin._comProposta = function() {
      return `
        <div class="com-title">Template de proposta</div>
        <div class="com-sub">Proposta com identidade visual da Primor — editável direto no navegador, imprimir como PDF.</div>
        <div class="com-block" style="text-align:center;padding:28px;">
          <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-style:italic;color:var(--brown);margin-bottom:8px;">proposta-primor.html</div>
          <div style="font-size:13px;color:var(--muted);margin-bottom:18px;line-height:1.7;">Arquivo com Cormorant Garamond + Poppins e paleta Primor.<br>Abra no Chrome, edite os campos e salve como PDF via Cmd+P.</div>
          <a href="proposta-primor.html" target="_blank" style="display:inline-block;padding:11px 24px;background:linear-gradient(135deg,var(--brown),var(--brown2));color:#F5F5F5;border-radius:10px;font-size:12px;text-decoration:none;letter-spacing:.08em;text-transform:uppercase;">Abrir template →</a>
        </div>
        <div class="com-block">
          <div class="com-lbl">Estrutura das 5 seções</div>
          ${[['01','Diagnóstico','Situação atual, objetivo, desafio e oportunidade — personalizado'],['02','Solução proposta','O que a Primor entrega — em linguagem estratégica, não técnica'],['03','Serviços e entregas','Estratégia · planejamento · design · gestão — com entregáveis'],['04','Investimento','Valor · contrato mínimo · pagamento · setup'],['05','Próximos passos','Aprovação → contrato → pagamento → onboarding → produção']].map(([n,t,d])=>`
            <div class="com-tl-row">
              <div class="com-tl-day">${n}</div>
              <div><div style="font-size:13px;color:var(--brown);margin-bottom:2px;">${t}</div><div style="font-size:12px;color:var(--muted);line-height:1.6;">${d}</div></div>
            </div>`).join('')}
        </div>
        <div class="com-block">
          <div class="com-lbl">Regras de ouro</div>
          <div class="com-tip">
            <strong>Nunca enviar sem reunião de apresentação agendada.</strong> Proposta enviada sem reunião quase nunca fecha.<br><br>
            <strong>Recapitule a dor antes do preço.</strong> O cliente precisa se sentir visto antes de ver o valor.<br><br>
            <strong>Validade de 7 dias.</strong> Cria urgência real e protege contra lead que fica meses pensando.<br><br>
            <strong>Após falar o preço — silêncio.</strong> A primeira pessoa que falar depois do preço perde a negociação.
          </div>
        </div>`;
    };

    // ════════════════════════════════════════════════════════════════════
    // 6. ONBOARDING
    // ════════════════════════════════════════════════════════════════════
    Admin._comOnb = function(day) {
      const days = [
        {tag:'Dia 1 · Pedro',title:'Boas-vindas e ativação',sub:'Primeira impressão — precisa ser impecável.',items:['Envia mensagem de boas-vindas personalizada no WhatsApp','Confirma recebimento do contrato assinado','Confirma o pagamento do primeiro mês','Envia link do formulário de onboarding','Agenda a Reunião de Imersão (Dia 3 ou 4)'],msg:'Oi, [nome]! ✦ Que alegria ter você na Primor.\n\nA partir de agora, eu sou o seu ponto de contato direto — qualquer dúvida, ideia ou informação, é comigo mesmo.\n\nMandei um formulário curto pro seu e-mail. Leva uns 15 minutos.\n\nJá separei duas datas para a nossa reunião de imersão:\n→ [Opção A]\n→ [Opção B]\n\nQual funciona melhor?',tip:'Tom: quente, organizado, confiante. O cliente precisa sentir que está em boas mãos desde a primeira mensagem.'},
        {tag:'Dia 2 · Cliente',title:'Formulário de onboarding',sub:'O cliente preenche. Pedro monitora e tira dúvidas.',items:['Nome completo da marca e do fundador','O que vende, pra quem vende, como vende','Principais concorrentes que admira','3 marcas de referência visual','5 adjetivos da marca ideal','O que definitivamente NÃO quer comunicar','Principais objeções que ouve dos clientes','Acesso ao Instagram (login ou conexão)'],msg:'',tip:'Se o cliente não preencher no Dia 2: "Você consegue abrir o formulário? Se tiver qualquer dúvida, me chama que eu te ajudo a responder."'},
        {tag:'Dia 3 · Pedro',title:'Preparação para a imersão',sub:'Pedro estuda tudo antes de entrar na reunião. Nada de improvisar.',items:['Lê o formulário inteiro pelo menos 2 vezes','Analisa o perfil atual do Instagram: feed, stories, bio, destaques','Analisa os 3 concorrentes que o cliente citou','Pesquisa referências visuais das marcas admiradas','Prepara hipóteses iniciais de posicionamento','Prepara perguntas de aprofundamento para a reunião','Registra tudo no CRM — Brand Core do cliente'],msg:'"Se a sua marca fosse uma pessoa, como ela seria?"\n"Qual é o cliente que você NÃO quer atrair?"\n"Quando um cliente chega até você, o que ele já tentou antes?"\n"Em 12 meses, o que precisa ter mudado na sua percepção de mercado?"',tip:'Perguntas de aprofundamento — use na Reunião de Imersão.'},
        {tag:'Dia 4 · Pedro + Cliente',title:'Reunião de imersão',sub:'60–90 minutos. A reunião mais importante do projeto.',items:['Abertura: recapitula o formulário — confirma ou corrige','Bloco 1 (20 min): negócio, cliente ideal, transformação que entrega','Bloco 2 (20 min): posicionamento, diferencial, o que é inegociável','Bloco 3 (20 min): conteúdo, tom de voz, o que ressoa e o que não','Bloco 4 (15 min): metas, métricas de sucesso, expectativas','Fechamento: próximos passos e prazo de entrega do planejamento'],msg:'',tip:'Pedro anota tudo. Essa reunião é o alicerce de tudo que Chloe e Gabi vão produzir.'},
        {tag:'Dia 5 · Pedro',title:'Construção da base estratégica',sub:'Pedro transforma tudo que ouviu em documentação estruturada no CRM.',items:['Persona completa: perfil, dores, desejos, gatilhos, objeções','Nicho e subnicho com linguagem do mercado','Posicionamento: frase + o que a marca NÃO é','Tom de voz: 5 características + exemplos de como falar e não falar','Primeiros arcos editoriais: 4 a 6 narrativas','Pilares de conteúdo alinhados aos arcos'],msg:'',tip:''},
        {tag:'Dia 6 · Pedro → Chloe',title:'Briefing para Chloe',sub:'Pedro passa o dossiê completo. Chloe começa o planejamento.',items:['Acesso ao Brand Core do cliente no CRM','Resumo executivo: o "espírito" do cliente','Indicação dos 2–3 concorrentes principais para Chloe estudar','Referências de conteúdo que o cliente aprova e não aprova','Data de aprovação do planejamento (deadline de Chloe)','Peculiaridades do cliente: horários, preferências, sensibilidades'],msg:'Oi, [nome]! Terminei de estruturar tudo que a gente discutiu ✦\n\nJá passei o dossiê completo da sua marca para a Chloe, que vai cuidar de todo o planejamento de conteúdo. Até [data] você recebe o primeiro calendário editorial para aprovar.\n\nQualquer dúvida até lá, é só me chamar.',tip:''},
        {tag:'Dia 7 · Encerramento',title:'Onboarding concluído',sub:'Pedro fecha o ciclo. A operação está em movimento.',items:['Brand Core 100% preenchido no CRM','Persona, nicho, posicionamento e arcos validados','Briefing entregue para Chloe','Cliente informado sobre próximos passos e datas','Acesso ao Instagram configurado','Reunião mensal de alinhamento já agendada no calendário','Relatório de onboarding registrado no CRM'],msg:'',tip:'A partir daqui: Chloe entrega o planejamento do primeiro mês em até 7 dias → Pedro apresenta ao cliente → Gabi produz → Barbeto revisa → publicação.'},
      ];
      const d = days[day];
      const btnsHtml = `<div class="com-day-btns">${days.map((_,i)=>`<div class="com-day-btn ${i===day?'on':''}" onclick="Admin._comDayNav(${i})">D${i+1}</div>`).join('')}</div>`;
      return `
        <div class="com-title">Onboarding — 7 dias</div>
        <div class="com-sub">O que Pedro faz nos primeiros 7 dias após o fechamento.</div>
        ${btnsHtml}
        <div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--copper);margin-bottom:6px;">${d.tag}</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--brown);margin-bottom:4px;">${d.title}</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:14px;">${d.sub}</div>
        <div class="com-block"><ul class="com-ck">${d.items.map(it=>`<li>${it}</li>`).join('')}</ul></div>
        ${d.msg?`<div class="com-block"><div class="com-lbl">Mensagem</div><div class="com-msg">${d.msg}</div></div>`:''}
        ${d.tip?`<div class="com-block"><div class="com-tip"><strong>Nota:</strong> ${d.tip}</div></div>`:''}
        <div style="display:flex;gap:8px;margin-top:12px;">
          ${day>0?`<button onclick="Admin._comDayNav(${day-1})" style="flex:1;padding:10px;border-radius:9px;border:1px solid var(--border);background:transparent;color:var(--muted);font-size:12px;cursor:pointer;font-family:Poppins,sans-serif;">← Dia ${day}</button>`:'<span style="flex:1"></span>'}
          ${day<6?`<button onclick="Admin._comDayNav(${day+1})" style="flex:1;padding:10px;border-radius:9px;background:linear-gradient(135deg,var(--brown),var(--brown2));color:#F5F5F5;font-size:12px;border:none;cursor:pointer;font-family:Poppins,sans-serif;">Dia ${day+2} →</button>`:''}
        </div>`;
    };

    // ════════════════════════════════════════════════════════════════════
    // 7. PÓS-VENDA
    // ════════════════════════════════════════════════════════════════════
    Admin._comPV = function(sub) {
      const tabs = Admin._tabs('posvenda',[['ciclo','Ciclo mensal'],['saude','Saúde'],['upsell','Upsell'],['renovacao','Renovação'],['churn','Churn']],sub);
      const c = {
        ciclo: `
          <div class="com-block"><div class="com-lbl">Semana 1 — planejamento do mês seguinte</div>
            <div style="font-size:13px;color:var(--text);line-height:1.65;margin-bottom:6px;">Chloe entrega o calendário 30 dias à frente. Pedro apresenta ao cliente e coleta aprovação.</div>
            <div style="font-size:11px;color:var(--muted);">Chloe → Pedro → Cliente</div></div>
          <div class="com-block"><div class="com-lbl">Semana 2 — produção em andamento</div>
            <div style="font-size:13px;color:var(--text);line-height:1.65;margin-bottom:6px;">Gabi produz. Barbeto revisa no dia seguinte ao que foi entregue. Pedro monitora prazos e é o canal do cliente.</div>
            <div style="font-size:11px;color:var(--muted);">Gabi → Barbeto revisa → publicação</div></div>
          <div class="com-block"><div class="com-lbl">Semana 3 — publicação + check-in</div>
            <div class="com-msg">Pedro envia ao cliente:\n\n"Como está indo? Tem algum assunto novo que surgiu esse mês que a gente deveria incluir no conteúdo?"</div>
            <div class="com-tip">Não é cobrança — é manutenção do relacionamento. Cliente que sente atenção não cancela.</div></div>
          <div class="com-block"><div class="com-lbl">Semana 4 — relatório + reunião mensal (30 min)</div>
            <div style="font-size:13px;color:var(--text);line-height:1.65;margin-bottom:8px;">Pedro apresenta alcance, engajamento, crescimento, top posts. Coleta feedback. Orienta o que muda no mês seguinte.</div>
            <div class="com-tip"><strong>Estrutura:</strong> abre com números + contexto → 3 melhores posts e porquê → o que não funcionou → "tem alguma mudança no negócio?" → preview do mês seguinte.<br><br><strong>Regra:</strong> reunião mensal é retenção disfarçada de relatório.</div></div>`,
        saude: `
          <div class="com-block"><div class="com-lbl">Cliente saudável — sinais verdes</div>
            <div class="com-flags">${['Responde rápido','Aprova sem muito ajuste','Engaja com o conteúdo','Aparece na reunião mensal','Indica a agência','Faz perguntas sobre o negócio dele'].map(s=>`<span class="com-fg com-fg-g">${s}</span>`).join('')}</div></div>
          <div class="com-block"><div class="com-lbl">Atenção — sinais amarelos</div>
            <div class="com-flags">${['Demora pra aprovar','Pede muitos ajustes seguidos','Responde só "ok"','Para de interagir com posts','Menciona concorrentes'].map(s=>`<span class="com-fg com-fg-y">${s}</span>`).join('')}</div>
            <div class="com-tip"><strong>Quando aparecer sinal amarelo:</strong> Pedro agenda conversa extra com pauta real — "Quero entender como você está vendo os resultados e se tem algo que podemos ajustar."</div></div>
          <div class="com-block"><div class="com-lbl">Perigo — sinais vermelhos</div>
            <div class="com-flags">${['Não aparece na reunião','Fala em pausar','Compara com outras agências','Atraso no pagamento','Muda de tom nas mensagens'].map(s=>`<span class="com-fg com-fg-r">${s}</span>`).join('')}</div>
            <div class="com-msg" style="margin-top:10px;">Oi, [nome]! Percebi que não conseguimos nos falar esse mês como de costume — quero garantir que você está satisfeita com o trabalho.\n\nPosso te chamar amanhã pra uma conversa de 15 minutinhos?</div>
            <div class="com-tip"><strong>Nunca espere o cliente pedir o cancelamento.</strong> Ao primeiro sinal vermelho, Pedro age. Barbeto é informada imediatamente.</div></div>`,
        upsell: `
          ${[['A partir do mês 2','Identidade visual completa','Oi, [nome]! O conteúdo está performando bem — mas sinto que a identidade visual pode ir além do que temos hoje.\n\nQueria conversar sobre criar uma identidade visual completa pra sua marca. Posso te apresentar o que incluiria?'],['A partir do mês 3','Expansão de redes','Os resultados do Instagram estão crescendo consistentemente ✦ Você já pensou em expandir a presença para o [LinkedIn / Pinterest / TikTok]?\n\nCom a base que construímos, seria muito natural levar isso pra outra rede.'],['A partir do mês 3','Tráfego pago','Você já tem uma base sólida — conteúdo com identidade, consistência e engajamento real. Esse é o momento em que tráfego pago faz sentido.\n\nInvestir em anúncio agora seria amplificar algo que já funciona — não jogar dinheiro em algo que ainda está sendo testado.'],['Qualquer momento','Indicação com benefício','Você conhece alguma empreendedora que está na mesma situação que você estava antes?\n\nSe indicar e a pessoa fechar, tenho um mês de bônus pra te oferecer.']].map(([w,t,m])=>`
            <div class="com-block">
              <div style="font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:4px;">${w}</div>
              <div style="font-size:14px;color:var(--brown);margin-bottom:8px;">${t}</div>
              <div class="com-msg">${m}</div>
            </div>`).join('')}`,
        renovacao: `
          <div class="com-block"><div class="com-lbl">Mês 2 — primeira menção</div>
            <div class="com-msg">Na reunião mensal, Pedro fecha com:\n\n"Já chegamos no mês 2 — o projeto está indo muito bem. Vou te apresentar um resumo do que construímos até aqui e o que planejamos pra fechar o trimestre com força."</div>
            <div class="com-tip">Não fala em contrato. Só planta a sensação de continuidade e de que há um plano.</div></div>
          <div class="com-block"><div class="com-lbl">Mês 3 · Semana 2 — apresentação de renovação</div>
            <ul class="com-ck">
              <li>Pedro prepara resumo visual dos 3 meses: resultados, entregas, evolução</li>
              <li>Apresenta o que vem no próximo trimestre como continuação natural</li>
              <li>Propõe renovação com 2 semanas de antecedência do vencimento</li>
              <li>Se cabível, oferece condição especial por renovação antecipada</li>
            </ul></div>
          <div class="com-block"><div class="com-lbl">Mensagem de renovação</div>
            <div class="com-msg">Oi, [nome]! Chegamos no final do nosso primeiro trimestre juntas ✦\n\nOlhando os números: [X seguidores conquistados], [alcance médio de X], [X posts com consistência].\n\nPra mim faz todo sentido a gente continuar — e já tenho algumas ideias do que podemos intensificar no próximo trimestre. Posso te apresentar o plano?</div>
            <div class="com-tip"><strong>Regra:</strong> nunca manda mensagem de renovação sem dados. Números + resultado concreto = renovação natural.</div></div>`,
        churn: `
          <div class="com-block"><div class="com-lbl">Antes de aceitar o cancelamento</div>
            <ul class="com-ck">
              <li>Pedro agenda conversa de 20 min — não para salvar, mas para entender</li>
              <li>Pergunta o motivo real sem defender a agência</li>
              <li>Se for problema financeiro: propõe pausa de 30 dias ou redução de escopo</li>
              <li>Se for insatisfação: pergunta o que precisaria mudar</li>
              <li>Barbeto é informada antes de qualquer resposta ao cliente</li>
            </ul></div>
          <div class="com-block"><div class="com-lbl">Quando o cancelamento é inevitável</div>
            <div class="com-msg">Entendo totalmente, [nome]. Agradeço muito pela confiança nesses meses — foi um prazer trabalhar na sua marca.\n\nVou te enviar o relatório final com tudo que construímos juntas e as senhas de acesso que ficam com você.\n\nSe um dia quiser retomar, estarei aqui.</div>
            <div class="com-tip"><strong>Regra de ouro do churn:</strong> cliente que saiu bem voltou. Cliente que saiu mal vira detrator. A saída é tão importante quanto a entrada.</div></div>
          <div class="com-block"><div class="com-lbl">Offboarding — checklist</div>
            <ul class="com-ck">
              <li>Entrega das senhas, acessos e arquivos do cliente</li>
              <li>Relatório final: resultados do período completo</li>
              <li>Pasta com todos os posts e peças criadas</li>
              <li>Mensagem de encerramento calorosa</li>
              <li>Anotação no CRM: motivo do churn + possibilidade de retorno</li>
              <li>Follow-up em 60 dias: "Oi, [nome]! Como você está?"</li>
            </ul></div>`,
      };
      return `<div class="com-title">Pós-venda e retenção</div><div class="com-sub">Como manter o cliente satisfeito, crescer a conta e evitar o churn.</div>${tabs}${c[sub]||''}`;
    };

    // ════════════════════════════════════════════════════════════════════
    // 8. FOLLOW-UP
    // ════════════════════════════════════════════════════════════════════
    Admin._comFU = function(sub) {
      const tabs = Admin._tabs('followup',[['pensando','"Vou pensar"'],['sumiu','Sumiu'],['orcamento','Orçamento'],['momento','Momento errado'],['regras','Regras gerais']],sub);
      const row = (dia, title, canal, msg, tip) => `
        <div class="com-tl-row">
          <div class="com-tl-day">${dia}</div>
          <div style="flex:1;">
            <div style="font-size:13px;color:var(--text);margin-bottom:2px;">${title}</div>
            <div style="font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:8px;">${canal}</div>
            ${msg?`<div class="com-msg">${msg}</div>`:''}
            ${tip?`<div class="com-tip">${tip}</div>`:''}
          </div>
        </div>`;
      const c = {
        pensando: `
          <div style="margin-bottom:10px;"><span class="com-fg com-fg-g">5 touchpoints · 21 dias</span></div>
          <div class="com-block"><div class="com-tl">
            ${row('Dia 1','Logo após a reunião de proposta','WhatsApp','Oi, [nome]! Foi um prazer conversar hoje ✦\n\nFico à disposição pra qualquer dúvida. A proposta tem validade de 7 dias — se quiser ajustar algum detalhe antes de decidir, é só falar.','Não pressione. Não cobra resposta — só deixa a porta aberta e lembra sutilmente da validade.')}
            ${row('Dia 3','Valor agregado — sem falar de proposta','WhatsApp','Oi, [nome]! Estava pensando na nossa conversa e lembrei de um perfil que trabalha no mesmo nicho que você — olha como eles estão posicionando o conteúdo: [link]\n\nIsso é exatamente o tipo de direção que imagino pra sua marca ✦','Entrega valor antes de cobrar decisão.')}
            ${row('Dia 7','Check-in — vencimento da proposta','WhatsApp','Oi, [nome]! A proposta vence hoje — queria saber se você conseguiu avaliar ou se ficou alguma dúvida.\n\nSem pressão — se precisar de mais tempo, pode falar.','Mencione o vencimento com naturalidade. Urgência real, sem drama.')}
            ${row('Dia 14','Reabertura leve','WhatsApp','Oi, [nome]! Como você está?\n\nTenho uma vaga abrindo no próximo mês e pensei em você. Se quiser retomar a conversa, ainda consigo segurar a condição que apresentei ✦','Escassez real. Só use se for verdade — a Primor tem atendimento seletivo.')}
            ${row('Dia 21','Última mensagem — fecha o ciclo','WhatsApp','Oi, [nome]! Última mensagem da minha parte — não quero ficar enchendo sua caixa.\n\nSe um dia o momento certo chegar, estarei aqui. E se quiser indicar alguém, adoraria conhecer ✦\n\nBoa sorte com tudo!','<strong>Sair com elegância é uma estratégia.</strong> Essa mensagem frequentemente gera resposta — e às vezes fecha.')}
          </div></div>`,
        sumiu: `
          <div style="margin-bottom:10px;"><span class="com-fg com-fg-r">Lead sumiu após proposta ou reunião</span> <span class="com-fg com-fg-g">3 tentativas máximo</span></div>
          <div class="com-block"><div class="com-tl">
            ${row('Dia 2','Primeira tentativa — sem cobrar','WhatsApp','Oi, [nome]! Tudo bem por aí?\n\nFico à disposição se quiser conversar mais sobre a proposta. Sem pressa ✦','Curta, sem pressão. Só abre a porta.')}
            ${row('Dia 7','Segunda tentativa — canal diferente','DM Instagram','Oi, [nome]! Tentei te chamar no WhatsApp — não sei se chegou. Só queria saber se ficou alguma dúvida sobre a proposta ✦','<strong>Muda o canal.</strong> Às vezes o WhatsApp foi silenciado. DM no Instagram aparece diferente.')}
            ${row('Dia 21','Terceira e última — breakup message','WhatsApp','Oi, [nome]! Não quero mais incomodar — vou encerrar o contato por aqui.\n\nSe em algum momento quiser retomar, estarei à disposição. Torço pelo seu sucesso de verdade ✦','<strong>A breakup message funciona.</strong> Dizer que vai parar frequentemente faz a pessoa responder.')}
          </div></div>`,
        orcamento: `
          <div style="margin-bottom:10px;"><span class="com-fg com-fg-g">Maior potencial de retorno em 60–90 dias</span></div>
          <div class="com-block"><div class="com-tl">
            ${row('Dia 1','Aceita o momento — sem insistir','WhatsApp','Entendo totalmente, [nome] — momento financeiro é uma realidade.\n\nFico à disposição pra quando o momento certo chegar. Posso te colocar na lista de prioridade quando abrir uma vaga? ✦','Não tente negociar preço agora. Ofereça prioridade futura — cria vínculo sem desvalorizar o serviço.')}
            ${row('Dia 30','Nurture — entrega valor sem vender','WhatsApp','Oi, [nome]! Estava pensando em você — vi esse conteúdo e achei que fazia sentido pro seu nicho: [referência]\n\nSó quis compartilhar ✦','<strong>Uma mensagem por mês de valor real</strong> — não de venda. Quando o budget abrir, a Primor é a primeira que vem à mente.')}
            ${row('Dia 60','Reativação','WhatsApp','Oi, [nome]! Como está indo o negócio?\n\nTem uma vaga abrindo no próximo mês e pensei em você em primeiro lugar. Se o momento estiver melhor, adoraria retomar nossa conversa ✦','')}
          </div></div>`,
        momento: `
          <div style="margin-bottom:10px;"><span class="com-fg com-fg-g">Ciclo de 90 dias</span></div>
          <div class="com-block"><div class="com-tl">
            ${row('Dia 1','Aceita e ancora a volta','WhatsApp','Faz todo sentido, [nome] — cada fase do negócio tem o timing certo.\n\nVocê mencionou [o motivo dela]. Quando você imagina que esse momento vai mudar? Pergunto porque quero reservar uma vaga pra você ✦','<strong>Ancora uma data.</strong> "Quando você imagina que muda?" faz ela pensar concretamente.')}
            ${row('Dia 45','Check-in do processo','WhatsApp','Oi, [nome]! Como está indo [a transição / o lançamento / o projeto que ela mencionou]?\n\nTorço pra estar correndo bem por aí ✦','Pergunta sobre o motivo que ela deu — mostra que você ouviu de verdade.')}
            ${row('Dia 90','Reativação — timing certo','WhatsApp','Oi, [nome]! Faz uns 3 meses desde que conversamos — passou rápido!\n\nComo está o [negócio dela]? Se o momento estiver mais tranquilo, tenho uma janela abrindo e você é prioridade ✦','')}
          </div></div>`,
        regras: `
          ${[['Máximo de 5 tentativas por lead','Depois de 5 contatos sem resposta, o lead vai para nurture passivo — uma mensagem por mês, sem expectativa. Insistir além disso queima a relação.'],['Nunca repita a mesma mensagem','Cada touchpoint precisa ter um ângulo diferente: valor, novidade, referência, escassez, encerramento. Mensagem repetida é spam.'],['Muda de canal quando não responde','WhatsApp → DM Instagram → E-mail. Pessoas silenciam aplicativos, não pessoas.'],['Nunca pergunte "o que você decidiu?"','Essa pergunta pressiona e envergonha. Use sempre perguntas abertas que abrem conversa — não que cobram decisão.'],['Horários que funcionam','Terça a quinta, entre 9h–11h ou 15h–17h. Evite segunda de manhã, sexta à tarde e após 20h.'],['Registra tudo no CRM','Cada touchpoint no Follow-up do CRM com data, canal e resposta. Lead que some e volta vai esperar que você lembre — e você vai lembrar.']].map(([t,d])=>`
            <div class="com-block">
              <div style="font-size:14px;color:var(--brown);margin-bottom:6px;">${t}</div>
              <div style="font-size:13px;color:var(--muted);line-height:1.7;">${d}</div>
            </div>`).join('')}`,
      };
      return `<div class="com-title">Follow-up de leads frios</div><div class="com-sub">Sequências por cenário — timing exato e mensagens prontas.</div>${tabs}${c[sub]||''}`;
    };

    console.log('✅ Comercial Hub — Marketing Primor — carregado.');
  }

  document.addEventListener('DOMContentLoaded', init);
  if (document.readyState !== 'loading') init();
})();
