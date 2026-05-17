// ════════════════════════════════════════════════════════════════════════
// RELATÓRIO DIÁRIO DA EQUIPE — Marketing Primor CRM
// Versão 1.0 · Integra ao Admin object existente no index.html
// ════════════════════════════════════════════════════════════════════════
//
// COMO INTEGRAR:
// 1. Execute o SQL do arquivo supabase_migration.sql no seu Supabase
// 2. Cole este arquivo como <script src="relatorio_equipe_module.js"></script>
//    ANTES de </body> no seu index.html
// 3. Adicione o item de navegação no sidebar (ver comentário SIDEBAR abaixo)
// 4. Adicione o case no Admin.tab() (ver comentário TAB abaixo)
//
// SIDEBAR — adicionar no menu admin junto com os outros nav-items:
// <div class="nav-item" onclick="Admin.tab('relatorio')" id="nav-relatorio">
//   <span class="ni">📝</span><span class="nl">Diário</span>
// </div>
//
// TAB — adicionar no Admin.tab() no bloco if/else if:
// else if (t === 'relatorio') { this._setNavActive('nav-relatorio'); await this.renderRelatorioEquipe(); }
// ════════════════════════════════════════════════════════════════════════

(function() {
  // Aguarda o Admin object estar pronto
  function injectModule() {
    if (typeof Admin === 'undefined' || typeof db === 'undefined') {
      setTimeout(injectModule, 100);
      return;
    }

    const AGENTES = [
      { key: 'barbeto', nome: 'Barbeto', icon: '👑', desc: 'Direção e Operações',    cor: '#9B6B3A', bg: 'rgba(155,107,58,0.08)' },
      { key: 'chloe',   nome: 'Chloe',   icon: '📋', desc: 'Arquitetura da Informação', cor: '#7c3aed', bg: '#f3e8ff' },
      { key: 'gabi',    nome: 'Gabi',     icon: '🎨', desc: 'Design Visual',          cor: '#d4762a', bg: '#fdf1e7' },
      { key: 'pedro',   nome: 'Pedro',    icon: '📊', desc: 'Estrategista de Conta',  cor: '#1db855', bg: '#e9f9ee' },
      { key: 'elvira',  nome: 'Elvira',   icon: '💰', desc: 'Financeiro',             cor: '#2563eb', bg: '#eff6ff' }
    ];

    const META_OPTS = [
      { val: 'atingida',     label: '✓ Meta atingida', cor: '#2E7D32', bg: '#E8F5E9' },
      { val: 'parcial',      label: '~ Parcialmente',   cor: '#E65100', bg: '#FFF3E0' },
      { val: 'nao_atingida', label: '✗ Não atingida',   cor: '#C62828', bg: '#FFEBEE' }
    ];

    const fmtDate = (d) => {
      try {
        return new Date(d + 'T12:00').toLocaleDateString('pt-BR', {
          weekday: 'long', day: 'numeric', month: 'long'
        });
      } catch { return d; }
    };

    const getOntem = () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d.toISOString().slice(0, 10);
    };

    const getHoje = () => new Date().toISOString().slice(0, 10);

    // ── CARD DE REVISÃO (ontem → Barbeto lê hoje) ──────────────────────
    function cardRevisao(rel) {
      const ag = AGENTES.find(a => a.key === rel.agente) || { nome: rel.agente, icon: '👤', cor: '#666', bg: '#f5f5f5' };
      const meta = META_OPTS.find(m => m.val === rel.meta_dia);
      return `
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px 20px;margin-bottom:10px;box-shadow:var(--sh);transition:box-shadow .2s;"
          onmouseenter="this.style.boxShadow='var(--sh2)'" onmouseleave="this.style.boxShadow='var(--sh)'">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
            <div style="width:38px;height:38px;border-radius:10px;background:${ag.bg};display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">${ag.icon}</div>
            <div style="flex:1;">
              <div style="font-family:'Cormorant Garamond',serif;font-size:16px;font-style:italic;color:var(--brown);">${ag.nome}</div>
              <div style="font-size:10px;color:var(--muted);">${ag.desc}</div>
            </div>
            ${meta ? `<span style="font-size:10px;padding:3px 10px;border-radius:20px;background:${meta.bg};color:${meta.cor};white-space:nowrap;border:1px solid ${meta.cor}30;">${meta.label}</span>` : ''}
          </div>
          <div style="display:grid;gap:10px;">
            <div>
              <div style="font-size:9px;color:var(--copper);letter-spacing:.12em;text-transform:uppercase;margin-bottom:4px;">Entregou</div>
              <div style="font-size:13px;color:var(--text);line-height:1.7;white-space:pre-wrap;">${rel.entregue || '—'}</div>
            </div>
            ${rel.bloqueio ? `
              <div style="padding:10px 13px;background:rgba(214,118,42,0.07);border-left:2px solid #d4762a;border-radius:0 8px 8px 0;">
                <div style="font-size:9px;color:#d4762a;letter-spacing:.12em;text-transform:uppercase;margin-bottom:3px;">⚠ Bloqueio</div>
                <div style="font-size:12px;color:var(--text);line-height:1.65;white-space:pre-wrap;">${rel.bloqueio}</div>
              </div>` : ''}
            <div>
              <div style="font-size:9px;color:var(--copper);letter-spacing:.12em;text-transform:uppercase;margin-bottom:4px;">Prioridade de hoje</div>
              <div style="font-size:13px;color:var(--brown);line-height:1.65;font-style:italic;">${rel.prioridade_amanha || '—'}</div>
            </div>
          </div>
        </div>`;
    }

    // ── CHIP DE STATUS DO AGENTE ────────────────────────────────────────
    function chipAgente(ag, jaEnviou) {
      return `
        <div style="display:flex;align-items:center;gap:6px;padding:5px 10px;border-radius:20px;
          background:${jaEnviou ? ag.bg : 'var(--beige)'};
          border:1px solid ${jaEnviou ? ag.cor + '44' : 'var(--border)'};
          font-size:11px;color:${jaEnviou ? ag.cor : 'var(--muted)'};">
          <span>${ag.icon}</span>
          <span>${ag.nome}</span>
          ${jaEnviou ? '<span style="font-size:10px;">✓</span>' : '<span style="opacity:.5;">·</span>'}
        </div>`;
    }

    // ── RENDER PRINCIPAL ────────────────────────────────────────────────
    Admin.renderRelatorioEquipe = async function() {
      const main = document.getElementById('admin-main');
      if (!main) return;
      main.innerHTML = '<p style="color:var(--muted);text-align:center;padding:60px;font-style:italic;font-family:Cormorant Garamond,serif;font-size:18px;">Carregando relatórios ✦</p>';

      const hoje = getHoje();
      const ontem = getOntem();

      const [r1, r2] = await Promise.all([
        db.from('relatorios_diarios').select('*').eq('data', ontem).order('created_at', { ascending: true }),
        db.from('relatorios_diarios').select('*').eq('data', hoje).order('created_at', { ascending: true })
      ]);

      const relOntem = r1.data || [];
      const relHoje  = r2.data || [];

      const jaEnviouHoje = (key) => relHoje.some(r => r.agente === key);
      const pendentes = AGENTES.filter(a => !jaEnviouHoje(a.key));
      const concluidos = AGENTES.filter(a => jaEnviouHoje(a.key));

      // Injetar estilos do módulo
      if (!document.getElementById('rel-eq-style')) {
        const s = document.createElement('style');
        s.id = 'rel-eq-style';
        s.textContent = `
          .rel-ag-btn { transition: all .15s; border: 1px solid var(--border); background: var(--beige); color: var(--brown); }
          .rel-ag-btn:hover { border-color: var(--copper); color: var(--copper); }
          .rel-ag-btn.sel { background: var(--brown) !important; color: #F5F5F5 !important; border-color: var(--brown) !important; }
          .rel-meta-btn { transition: all .15s; border: 1px solid var(--border); background: var(--beige); color: var(--muted); }
          .rel-meta-btn:hover { opacity: .85; }
          .rel-meta-btn.sel { opacity: 1; }
          .rel-textarea {
            width: 100%; padding: 12px 14px; border: 1px solid var(--border);
            border-radius: 10px; font-size: 13px; background: var(--bg);
            resize: vertical; line-height: 1.65; font-family: Poppins, sans-serif;
            font-weight: 300; color: var(--text); box-sizing: border-box;
            transition: border-color .15s;
          }
          .rel-textarea:focus { outline: none; border-color: var(--copper); }
          @media (max-width: 860px) {
            #rel-main-grid { grid-template-columns: 1fr !important; }
          }
        `;
        document.head.appendChild(s);
      }

      main.innerHTML = `
        <!-- HEADER -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
          <div>
            <h2 class="section-title" style="margin:0 0 4px;">Relatório da Equipe</h2>
            <div style="font-size:12px;color:var(--muted);">Registro diário · revisão no dia seguinte por Barbeto</div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
            ${AGENTES.map(a => chipAgente(a, jaEnviouHoje(a.key))).join('')}
          </div>
        </div>

        <!-- GRID PRINCIPAL -->
        <div id="rel-main-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start;">

          <!-- COLUNA ESQUERDA: FORMULÁRIO -->
          <div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:21px;font-style:italic;color:var(--brown);margin-bottom:16px;">
              Registrar — ${fmtDate(hoje)}
            </div>

            <div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:24px;box-shadow:var(--sh);">
              
              <!-- Agente -->
              <div style="margin-bottom:18px;">
                <div style="font-size:10px;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px;">Agente</div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  ${AGENTES.map(a => `
                    <button class="rel-ag-btn" data-key="${a.key}"
                      onclick="(function(btn){document.querySelectorAll('.rel-ag-btn').forEach(b=>b.classList.remove('sel'));btn.classList.add('sel');document.getElementById('rel-agente-val').value='${a.key}';})(this)"
                      style="display:flex;align-items:center;gap:5px;padding:6px 13px;border-radius:20px;font-size:12px;cursor:pointer;font-family:Poppins,sans-serif;">
                      ${a.icon} ${a.nome}
                    </button>`).join('')}
                </div>
                <input type="hidden" id="rel-agente-val" value=""/>
              </div>

              <!-- Entregou -->
              <div style="margin-bottom:14px;">
                <div style="font-size:10px;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px;">O que foi entregue hoje</div>
                <textarea id="rel-entregue" class="rel-textarea" rows="4"
                  placeholder="Descreva tudo concluído: posts criados, briefings enviados, designs finalizados, reuniões realizadas..."></textarea>
              </div>

              <!-- Bloqueio -->
              <div style="margin-bottom:14px;">
                <div style="font-size:10px;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px;">Bloqueio (se houver)</div>
                <textarea id="rel-bloqueio" class="rel-textarea" rows="2"
                  placeholder="Algo que impediu o avanço? Deixe em branco se tudo fluiu."></textarea>
              </div>

              <!-- Prioridade amanhã -->
              <div style="margin-bottom:20px;">
                <div style="font-size:10px;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px;">Prioridade de amanhã</div>
                <textarea id="rel-prioridade" class="rel-textarea" rows="2"
                  placeholder="Qual é a tarefa mais importante de amanhã?"></textarea>
              </div>

              <!-- Meta do dia -->
              <div style="margin-bottom:22px;">
                <div style="font-size:10px;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px;">Meta do dia</div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  ${META_OPTS.map(m => `
                    <button class="rel-meta-btn"
                      onclick="(function(btn){document.querySelectorAll('.rel-meta-btn').forEach(b=>{b.classList.remove('sel');b.style.cssText='';});btn.classList.add('sel');btn.style.background='${m.bg}';btn.style.color='${m.cor}';btn.style.borderColor='${m.cor}50';document.getElementById('rel-meta-val').value='${m.val}';})(this)"
                      style="padding:7px 16px;border-radius:20px;font-size:12px;cursor:pointer;font-family:Poppins,sans-serif;">
                      ${m.label}
                    </button>`).join('')}
                </div>
                <input type="hidden" id="rel-meta-val" value=""/>
              </div>

              <div id="rel-err" style="display:none;font-size:12px;color:#C62828;padding:8px 12px;background:#FFEBEE;border-radius:8px;margin-bottom:12px;"></div>

              <button onclick="Admin.salvarRelatorio()"
                style="width:100%;padding:13px;border-radius:10px;background:linear-gradient(135deg,var(--brown),var(--brown2));color:#F5F5F5;font-size:12px;font-family:Poppins,sans-serif;letter-spacing:.08em;text-transform:uppercase;border:none;cursor:pointer;transition:opacity .2s;"
                onmouseenter="this.style.opacity='.88'" onmouseleave="this.style.opacity='1'">
                Registrar dia →
              </button>
            </div>

            <!-- Quem já enviou hoje -->
            ${concluidos.length ? `
              <div style="margin-top:16px;padding:14px 16px;background:var(--surface);border:1px solid var(--border);border-radius:12px;">
                <div style="font-size:10px;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px;">Já registraram hoje</div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  ${concluidos.map(a => `
                    <span style="display:flex;align-items:center;gap:5px;font-size:12px;color:${a.cor};background:${a.bg};padding:4px 11px;border-radius:20px;border:1px solid ${a.cor}30;">
                      ${a.icon} ${a.nome} ✓
                    </span>`).join('')}
                </div>
              </div>` : ''}

            ${pendentes.length ? `
              <div style="margin-top:10px;padding:12px 16px;background:rgba(201,162,39,.06);border:1px solid rgba(201,162,39,.2);border-radius:12px;">
                <div style="font-size:10px;color:var(--copper);letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px;">Pendentes hoje</div>
                <div style="font-size:12px;color:var(--text);">${pendentes.map(a => `${a.icon} ${a.nome}`).join(' · ')}</div>
              </div>` : `
              <div style="margin-top:10px;padding:12px 16px;background:#E8F5E9;border:1px solid #A5D6A7;border-radius:12px;">
                <div style="font-size:13px;color:#2E7D32;">✓ Toda a equipe registrou hoje</div>
              </div>`}
          </div>

          <!-- COLUNA DIREITA: REVISÃO DE BARBETO -->
          <div>
            <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:6px;">
              <div style="font-family:'Cormorant Garamond',serif;font-size:21px;font-style:italic;color:var(--brown);">
                👑 Revisão de Barbeto
              </div>
              <span style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;">${fmtDate(ontem)}</span>
            </div>

            ${relOntem.length === 0
              ? `<div style="text-align:center;padding:60px 20px;background:var(--surface);border:1px solid var(--border);border-radius:16px;">
                   <div style="font-size:36px;margin-bottom:12px;">📭</div>
                   <div style="font-family:'Cormorant Garamond',serif;font-size:18px;font-style:italic;color:var(--muted);">Nenhum relatório de ontem ✦</div>
                 </div>`
              : relOntem.map(r => cardRevisao(r)).join('')
            }

            ${relOntem.length > 0 && relOntem.length < AGENTES.length ? `
              <div style="margin-top:10px;padding:12px 16px;background:rgba(244,67,54,0.05);border:1px solid rgba(244,67,54,0.2);border-radius:10px;font-size:12px;color:var(--text);">
                ⚠ <strong>${AGENTES.filter(a => !relOntem.some(r => r.agente === a.key)).map(a => a.nome).join(', ')}</strong>
                não registrou${AGENTES.filter(a => !relOntem.some(r => r.agente === a.key)).length > 1 ? 'ram' : ''} ontem.
              </div>` : ''}
          </div>
        </div>

        <!-- HISTÓRICO -->
        <div style="margin-top:32px;padding-top:24px;border-top:1px solid var(--border);">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
            <div style="font-family:'Cormorant Garamond',serif;font-size:19px;font-style:italic;color:var(--brown);">Histórico</div>
            <button onclick="Admin.carregarHistoricoRelatorio()"
              style="padding:7px 16px;border-radius:9px;border:1px solid var(--border);background:transparent;color:var(--muted);font-size:12px;font-family:Poppins,sans-serif;cursor:pointer;">
              Ver últimos 30 dias ↓
            </button>
          </div>
          <div id="rel-historico"></div>
        </div>
      `;
    };

    // ── SALVAR RELATÓRIO ────────────────────────────────────────────────
    Admin.salvarRelatorio = async function() {
      const agente = document.getElementById('rel-agente-val')?.value;
      const entregue = document.getElementById('rel-entregue')?.value.trim();
      const bloqueio = document.getElementById('rel-bloqueio')?.value.trim() || null;
      const prioridade_amanha = document.getElementById('rel-prioridade')?.value.trim();
      const meta_dia = document.getElementById('rel-meta-val')?.value || null;
      const errEl = document.getElementById('rel-err');

      if (!agente)           { errEl.style.display='block'; errEl.textContent='Selecione o agente.'; return; }
      if (!entregue)         { errEl.style.display='block'; errEl.textContent='Descreva o que foi entregue hoje.'; return; }
      if (!prioridade_amanha){ errEl.style.display='block'; errEl.textContent='Defina a prioridade de amanhã.'; return; }
      errEl.style.display = 'none';

      this.loader(true);
      try {
        const { error } = await db.from('relatorios_diarios').insert([{
          data: getHoje(),
          agente,
          entregue,
          bloqueio,
          prioridade_amanha,
          meta_dia
        }]);
        if (error) throw error;

        // Dispara webhook Make se configurado
        const webhookUrl = window._relatorioWebhook || null;
        if (webhookUrl) {
          try {
            await fetch(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ agente, entregue, bloqueio, prioridade_amanha, meta_dia, data: getHoje() })
            });
          } catch (we) { console.warn('Webhook Make falhou:', we); }
        }

        await this.renderRelatorioEquipe();
      } catch(e) {
        errEl.style.display = 'block';
        errEl.textContent = 'Erro ao salvar: ' + e.message;
      } finally {
        this.loader(false);
      }
    };

    // ── HISTÓRICO COMPLETO ──────────────────────────────────────────────
    Admin.carregarHistoricoRelatorio = async function() {
      const el = document.getElementById('rel-historico');
      if (!el) return;
      el.innerHTML = '<p style="color:var(--muted);text-align:center;padding:24px;font-style:italic;">Carregando...</p>';

      const { data } = await db
        .from('relatorios_diarios')
        .select('*')
        .order('data', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(150);

      const rows = data || [];
      if (!rows.length) {
        el.innerHTML = '<p style="color:var(--muted);text-align:center;font-style:italic;padding:24px;">Nenhum registro ainda ✦</p>';
        return;
      }

      const metaInfo = {
        atingida:     { cor:'#2E7D32', label:'✓' },
        parcial:      { cor:'#E65100', label:'~' },
        nao_atingida: { cor:'#C62828', label:'✗' }
      };
      const agMap = Object.fromEntries(AGENTES.map(a => [a.key, a]));

      // Agrupar por data
      const byDate = {};
      rows.forEach(r => {
        if (!byDate[r.data]) byDate[r.data] = [];
        byDate[r.data].push(r);
      });

      el.innerHTML = Object.entries(byDate).map(([date, rels]) => `
        <div style="margin-bottom:24px;">
          <div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.12em;
            padding-bottom:8px;border-bottom:1px solid var(--border);margin-bottom:10px;
            display:flex;align-items:center;justify-content:space-between;">
            <span>${fmtDate(date)}</span>
            <span style="font-size:10px;">${rels.length}/${AGENTES.length} registros</span>
          </div>
          <div style="display:grid;gap:6px;">
            ${rels.map(r => {
              const ag = agMap[r.agente] || { nome: r.agente, icon: '👤', cor: '#666', bg: '#f5f5f5' };
              const m = r.meta_dia ? metaInfo[r.meta_dia] : null;
              return `
                <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;
                  padding:12px 15px;display:grid;grid-template-columns:140px 1fr auto;gap:12px;align-items:start;">
                  <div style="display:flex;align-items:center;gap:7px;">
                    <span style="font-size:16px;">${ag.icon}</span>
                    <span style="font-size:13px;font-weight:500;color:var(--brown);">${ag.nome}</span>
                  </div>
                  <div>
                    <div style="font-size:12px;color:var(--text);line-height:1.65;white-space:pre-wrap;">${r.entregue || '—'}</div>
                    ${r.bloqueio ? `<div style="color:#d4762a;margin-top:5px;font-size:11px;padding:5px 8px;background:rgba(214,118,42,0.07);border-radius:6px;">⚠ ${r.bloqueio}</div>` : ''}
                    ${r.prioridade_amanha ? `<div style="color:var(--copper);margin-top:4px;font-size:11px;font-style:italic;">→ ${r.prioridade_amanha}</div>` : ''}
                  </div>
                  ${m ? `<span style="font-size:14px;color:${m.cor};font-weight:600;flex-shrink:0;">${m.label}</span>` : '<span></span>'}
                </div>`;
            }).join('')}
          </div>
        </div>`).join('');
    };

    console.log('✅ Módulo Relatório da Equipe — Marketing Primor — carregado com sucesso.');
  }

  document.addEventListener('DOMContentLoaded', injectModule);
  // Fallback: se o DOM já carregou
  if (document.readyState !== 'loading') injectModule();
})();

// ════════════════════════════════════════════════════════════════════════
// CONFIGURAÇÃO MAKE WEBHOOK (opcional)
// Para enviar notificação ao Barbeto no dia seguinte via Make:
// Adicione antes da tag </body>:
//   <script> window._relatorioWebhook = 'https://hook.make.com/SEU_WEBHOOK'; </script>
// ════════════════════════════════════════════════════════════════════════
