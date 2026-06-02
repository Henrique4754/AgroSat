// AgroSat — gerador de protótipo estático (build-time only).
// Saída: agrosat_telas.html  → 100% estático, importável no html.to.design (Figma).
import { writeFileSync } from "node:fs";

/* ---------- NDVI field (SVG cells) ---------- */
// Escala de cor NDVI: vermelho (estresse) → âmbar → verde (saudável)
const STOPS = [
  [0.0, [127, 29, 29]],   // #7F1D1D
  [0.18, [248, 113, 113]], // #F87171
  [0.34, [245, 158, 11]],  // #F59E0B
  [0.5, [251, 191, 36]],   // #FBBF24
  [0.66, [163, 230, 53]],  // #A3E635
  [0.82, [74, 222, 128]],  // #4ADE80
  [1.0, [21, 128, 61]],    // #15803D
];
function ndviColor(v) {
  v = Math.max(0, Math.min(1, v));
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [a, ca] = STOPS[i];
    const [b, cb] = STOPS[i + 1];
    if (v >= a && v <= b) {
      const t = (v - a) / (b - a);
      const c = ca.map((x, k) => Math.round(x + (cb[k] - x) * t));
      return `rgb(${c[0]},${c[1]},${c[2]})`;
    }
  }
  return "rgb(21,128,61)";
}

// Geometria do mapa
const MAP_W = 720, MAP_H = 432, CELL = 30;
const cols = Math.floor(MAP_W / CELL);
const rows = Math.floor(MAP_H / CELL);

// Polígono do talhão (coords no espaço do mapa) — forma orgânica
const POLY = [
  [70, 60], [430, 30], [650, 120], [690, 300],
  [520, 400], [230, 410], [40, 280], [60, 140],
];
function inPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    const hit = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (hit) inside = !inside;
  }
  return inside;
}

// Campo NDVI: base saudável + ondulação + foco de estresse (justifica alerta de praga)
function field(cx, cy) {
  const nx = cx / MAP_W, ny = cy / MAP_H;
  let v = 0.74
    + 0.12 * Math.sin(nx * 6.1 + 0.5)
    + 0.10 * Math.cos(ny * 5.3 + 1.2)
    + 0.06 * Math.sin((nx + ny) * 9.0);
  // foco de praga (canto superior-direito)
  const d1 = Math.hypot(cx - 560, cy - 130) / 130;
  v -= 0.62 * Math.exp(-d1 * d1);
  // segundo foco leve (irrigação/estresse hídrico inferior-esquerda)
  const d2 = Math.hypot(cx - 180, cy - 330) / 150;
  v -= 0.30 * Math.exp(-d2 * d2);
  return Math.max(0.02, Math.min(0.98, v));
}

let cells = "";
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const x = c * CELL, y = r * CELL;
    const cx = x + CELL / 2, cy = y + CELL / 2;
    if (!inPoly(cx, cy, POLY)) continue;
    const v = field(cx, cy);
    const col = ndviColor(v);
    cells += `<rect x="${x + 1}" y="${y + 1}" width="${CELL - 2}" height="${CELL - 2}" rx="3" fill="${col}" opacity="0.92"/>\n`;
  }
}
const polyPts = POLY.map((p) => p.join(",")).join(" ");

// linhas de grade coordenada
let grid = "";
for (let x = 0; x <= MAP_W; x += CELL * 2) grid += `<line x1="${x}" y1="0" x2="${x}" y2="${MAP_H}" stroke="#30363D" stroke-width="0.5" opacity="0.4"/>`;
for (let y = 0; y <= MAP_H; y += CELL * 2) grid += `<line x1="0" y1="${y}" x2="${MAP_W}" y2="${y}" stroke="#30363D" stroke-width="0.5" opacity="0.4"/>`;

const mapSvg = `
<svg viewBox="0 0 ${MAP_W} ${MAP_H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Mapa NDVI do talhão">
  <defs>
    <clipPath id="talhao"><polygon points="${polyPts}"/></clipPath>
  </defs>
  <rect x="0" y="0" width="${MAP_W}" height="${MAP_H}" fill="#0A0E14"/>
  ${grid}
  <g clip-path="url(#talhao)">
    ${cells}
  </g>
  <polygon points="${polyPts}" fill="none" stroke="#4ADE80" stroke-width="2" stroke-dasharray="2 4" opacity="0.9"/>
  <circle cx="560" cy="130" r="46" fill="none" stroke="#F87171" stroke-width="1.5" stroke-dasharray="3 3"/>
  <circle cx="560" cy="130" r="4" fill="#F87171"/>
  <text x="560" y="100" fill="#F87171" font-family="JetBrains Mono, monospace" font-size="11" text-anchor="middle">FOCO · ANOMALIA</text>
</svg>`;

/* ---------- mini sparkline (série NDVI 30d) ---------- */
const series = [0.62, 0.64, 0.66, 0.69, 0.71, 0.73, 0.76, 0.78, 0.79, 0.8, 0.81, 0.79, 0.77, 0.74, 0.71, 0.68, 0.66];
const SP_W = 280, SP_H = 70;
const spPts = series
  .map((v, i) => `${(i / (series.length - 1)) * SP_W},${SP_H - ((v - 0.55) / 0.35) * SP_H}`)
  .join(" ");
const sparkline = `<svg viewBox="0 0 ${SP_W} ${SP_H}" width="100%" height="70" preserveAspectRatio="none">
  <polyline points="${spPts}" fill="none" stroke="#4ADE80" stroke-width="2" stroke-linejoin="round"/>
  <polyline points="0,${SP_H} ${spPts} ${SP_W},${SP_H}" fill="#4ADE8022" stroke="none"/>
</svg>`;

/* ---------- ícones SVG (stroke, viram vetor editável) ---------- */
const ic = {
  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
  alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l9 16H3z"/><path d="M12 10v4"/><circle cx="12" cy="17" r="0.6" fill="currentColor"/></svg>`,
  drop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></svg>`,
  bot: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 7V3"/><circle cx="9" cy="13" r="1.2" fill="currentColor"/><circle cx="15" cy="13" r="1.2" fill="currentColor"/></svg>`,
  sat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="6" height="6" rx="1" transform="rotate(45 12 12)"/><path d="M5 5l3 3M16 16l3 3M5 19l3-3M19 5l-3 3"/></svg>`,
  leaf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20s1-9 9-13c5-2 7 0 7 0s2 9-6 13c-5 2.5-10 0-10 0z"/><path d="M9 15s2-3 6-5"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-6.3 7-12a7 7 0 0 0-14 0c0 5.7 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/></svg>`,
  send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12l16-8-6 16-3-6z"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>`,
};

/* ---------- componentes reutilizáveis ---------- */
const railIcon = (svg, label, active = false) =>
  `<div class="rail-item${active ? " active" : ""}"><span class="rail-ico">${svg}</span><span class="rail-lbl">${label}</span></div>`;

const rail = (activeKey) => `
<aside class="rail">
  <div class="brand"><span class="brand-mark">${ic.sat}</span><span class="brand-name">Agro<b>Sat</b></span></div>
  <nav class="rail-nav">
    ${railIcon(ic.grid, "Mapa", activeKey === "map")}
    ${railIcon(ic.alert, "Alertas", activeKey === "alert")}
    ${railIcon(ic.drop, "Irrigação", false)}
    ${railIcon(ic.calendar, "Colheita", false)}
    ${railIcon(ic.bot, "AgroBot", activeKey === "bot")}
  </nav>
  <div class="rail-foot">
    <div class="rail-status"><span class="dot live"></span>SENTINEL-2<br><b>online</b></div>
  </div>
</aside>`;

const topbar = (title, sub) => `
<header class="topbar">
  <div class="tb-left">
    <div class="tb-prop">${ic.pin}<div><span class="tb-eyebrow">PROPRIEDADE</span><b>Fazenda Santa Helena · GO</b></div></div>
    <div class="tb-div"></div>
    <div class="tb-page"><span class="tb-eyebrow">${sub}</span><h1>${title}</h1></div>
  </div>
  <div class="tb-right">
    <div class="tb-meta"><span>ÚLT. PASSAGEM</span><b>01.JUN 09:42</b></div>
    <div class="tb-meta"><span>NUVEM</span><b>4%</b></div>
    <div class="tb-avatar">HB</div>
  </div>
</header>`;

const stat = (label, value, unit, tone = "", delta = "") => `
<div class="stat ${tone}">
  <span class="stat-lbl">${label}</span>
  <div class="stat-val"><b>${value}</b><span class="stat-unit">${unit}</span></div>
  ${delta ? `<span class="stat-delta ${tone}">${delta}</span>` : ""}
</div>`;

/* ===================== TELA 1 — DASHBOARD / MAPA NDVI ===================== */
const screen1 = `
<section class="frame" id="tela-dashboard">
  ${rail("map")}
  <main class="content">
    ${topbar("Mapa do Talhão — NDVI", "MONITORAMENTO")}
    <div class="dash-grid">
      <div class="card map-card">
        <div class="card-head">
          <div><span class="eyebrow">${ic.leaf} TALHÃO 04 · SOJA</span><h2>Índice de Vegetação NDVI</h2></div>
          <div class="seg">
            <button class="seg-btn active">NDVI</button><button class="seg-btn">Umidade</button><button class="seg-btn">Térmico</button>
          </div>
        </div>
        <div class="map-wrap">${mapSvg}</div>
        <div class="legend">
          <span class="legend-title">SAÚDE DA VEGETAÇÃO</span>
          <div class="legend-bar"></div>
          <div class="legend-scale"><span>0.0 estresse</span><span>0.5</span><span>1.0 vigor</span></div>
        </div>
      </div>

      <div class="side-col">
        <div class="card">
          <span class="eyebrow">LEITURA ATUAL</span>
          <div class="stat-row">
            ${stat("NDVI médio", "0.66", "idx", "good", "▾ 0.08 vs. 7d")}
            ${stat("Área estresse", "12.4", "%", "warn", "▴ 4.1%")}
          </div>
          <div class="stat-row">
            ${stat("NDVI mín.", "0.21", "idx", "bad")}
            ${stat("NDVI máx.", "0.84", "idx", "good")}
          </div>
        </div>
        <div class="card">
          <div class="card-head tight"><span class="eyebrow">SÉRIE 30 DIAS</span><span class="mono-tag">−10% no ciclo</span></div>
          ${sparkline}
          <div class="series-foot"><span>02.MAI</span><span>01.JUN</span></div>
        </div>
        <div class="card alert-mini">
          <span class="ico-pill bad">${ic.alert}</span>
          <div><b>Anomalia detectada</b><p>Queda atípica de NDVI no setor NE. Possível foco de praga.</p></div>
          <span class="risk bad">ALTO</span>
        </div>
      </div>
    </div>
  </main>
</section>`;

/* ===================== TELA 2 — PAINEL DE ALERTAS ===================== */
const alertRow = (icon, tone, tipo, titulo, desc, talhao, quando, risco) => `
<article class="alert-card ${tone}">
  <span class="ico-pill ${tone}">${icon}</span>
  <div class="alert-body">
    <div class="alert-top"><span class="alert-tipo ${tone}">${tipo}</span><span class="risk ${tone}">${risco}</span></div>
    <h3>${titulo}</h3>
    <p>${desc}</p>
    <div class="alert-meta"><span>${ic.pin}${talhao}</span><span>${quando}</span></div>
  </div>
  <button class="ghost-btn">Ver →</button>
</article>`;

const screen2 = `
<section class="frame" id="tela-alertas">
  ${rail("alert")}
  <main class="content">
    ${topbar("Central de Alertas", "NOTIFICAÇÕES")}
    <div class="alert-grid">
      <div class="alert-list">
        <div class="filters">
          <button class="chip active">Todos · 7</button>
          <button class="chip bad">Praga · 2</button>
          <button class="chip warn">Irrigação · 3</button>
          <button class="chip info">Clima · 1</button>
          <button class="chip good">Colheita · 1</button>
        </div>
        ${alertRow(ic.alert, "bad", "PRAGA", "Foco de anomalia no Talhão 04", "Queda de NDVI de 0.74 → 0.21 em 6 dias no setor nordeste. Padrão compatível com infestação inicial.", "Talhão 04 · Soja", "há 2h", "ALTO")}
        ${alertRow(ic.drop, "warn", "IRRIGAÇÃO", "Estresse hídrico no Talhão 02", "Umidade do solo em 28%. Sem previsão de chuva nos próximos 4 dias.", "Talhão 02 · Milho", "há 5h", "MÉDIO")}
        ${alertRow(ic.calendar, "good", "COLHEITA", "Janela ideal aproximando", "Maturação em 91%. Janela seca entre 06 e 09.JUN — condição ótima para colher.", "Talhão 01 · Soja", "há 8h", "INFO")}
        ${alertRow(ic.sat, "info", "CLIMA", "Risco de geada leve", "CPTEC projeta mínima de 3°C para 04.JUN. Monitorar cultura sensível.", "Fazenda · GO", "ontem", "BAIXO")}
        ${alertRow(ic.drop, "warn", "IRRIGAÇÃO", "Excesso de água no Talhão 05", "Solo saturado após 32mm de chuva. Suspender irrigação programada.", "Talhão 05 · Café", "ontem", "MÉDIO")}
      </div>

      <aside class="alert-detail">
        <span class="eyebrow bad">${ic.alert} ALERTA SELECIONADO</span>
        <h2>Foco de praga — Talhão 04</h2>
        <div class="detail-stat">
          ${stat("Risco", "ALTO", "", "bad")}
          ${stat("Área afetada", "12.4", "%", "warn")}
          ${stat("Detecção", "−6", "dias", "good")}
        </div>
        <div class="reco">
          <span class="eyebrow good">${ic.leaf} RECOMENDAÇÃO</span>
          <p><b>Inspeção em campo no setor NE em até 48h.</b> Confirmar presença de lagarta. Considerar controle localizado para evitar alastramento.</p>
        </div>
        <div class="notify">
          <span class="dot live"></span>
          <div><b>Enviado via WhatsApp</b><span class="mono-tag">01.JUN 09:44 · entregue</span></div>
        </div>
        <div class="detail-actions">
          <button class="solid-btn">Marcar como resolvido</button>
          <button class="ghost-btn wide">Abrir no mapa</button>
        </div>
      </aside>
    </div>
  </main>
</section>`;

/* ===================== TELA 3 — AGROBOT ===================== */
const msgUser = (t) => `<div class="msg user"><div class="bubble">${t}</div><span class="msg-av">HB</span></div>`;
const msgBot = (t) => `<div class="msg bot"><span class="msg-av bot-av">${ic.bot}</span><div class="bubble">${t}</div></div>`;

const screen3 = `
<section class="frame" id="tela-agrobot">
  ${rail("bot")}
  <main class="content">
    ${topbar("AgroBot — Assistente", "IA · LINGUAGEM NATURAL")}
    <div class="bot-grid">
      <div class="card chat-card">
        <div class="chat-head">
          <span class="bot-orb">${ic.bot}</span>
          <div><b>AgroBot</b><span class="mono-tag"><span class="dot live"></span>contexto: Talhão 04 · Soja</span></div>
        </div>
        <div class="chat-stream">
          ${msgBot("Olá, Henrique 👋 Detectei uma anomalia no <b>Talhão 04</b> hoje. Quer que eu explique?")}
          ${msgUser("Minha plantação está com risco de praga?")}
          ${msgBot("Sim. O NDVI do setor nordeste caiu de <b>0.74 para 0.21</b> em 6 dias — queda atípica. Risco classificado como <b style='color:#F87171'>ALTO</b>. Recomendo inspeção em campo nas próximas 48h.")}
          ${msgUser("E quando devo colher a soja?")}
          ${msgBot("A maturação está em <b>91%</b>. A melhor janela é entre <b>06 e 09 de junho</b> — período seco, sem risco de chuva. Depois disso entra frente úmida no dia 10.")}
          ${msgUser("Preciso irrigar hoje?")}
          ${msgBot("No Talhão 04, não. Umidade do solo em <b>61%</b> e chuva de 12mm prevista para amanhã. <b style='color:#4ADE80'>Aguarde.</b>")}
        </div>
        <div class="chat-input">
          <input type="text" placeholder="Pergunte sobre sua lavoura…" />
          <button class="send-btn">${ic.send}</button>
        </div>
      </div>

      <aside class="bot-side">
        <div class="card">
          <span class="eyebrow">${ic.bot} SUGESTÕES</span>
          <button class="suggest">Como interpretar o mapa NDVI?</button>
          <button class="suggest">Qual o melhor adubo para soja?</button>
          <button class="suggest">Previsão de chuva esta semana</button>
          <button class="suggest">Resumo dos alertas de hoje</button>
        </div>
        <div class="card bot-info">
          <span class="eyebrow good">${ic.leaf} COMO FUNCIONA</span>
          <p>O AgroBot cruza dados de satélite, clima e NDVI do seu talhão. <b>90% das respostas vêm de algoritmos determinísticos</b>; a IA só traduz para linguagem simples — custo baixo.</p>
          <div class="src-row"><span class="src">Sentinel-2</span><span class="src">NASA POWER</span><span class="src">CPTEC</span></div>
        </div>
      </aside>
    </div>
  </main>
</section>`;

/* ===================== CSS ===================== */
const css = `
:root{
  --bg:#0D1117; --surface:#161B22; --surface2:#1C2128; --surface3:#21262D;
  --border:#30363D; --border2:#3D444D;
  --green:#4ADE80; --amber:#F59E0B; --red:#F87171; --info:#60A5FA;
  --text:#E6EDF3; --muted:#8B949E; --dim:#6E7681;
  --disp:'Syne',sans-serif; --mono:'JetBrains Mono',monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
body{background:#06080C;color:var(--text);font-family:var(--mono);-webkit-font-smoothing:antialiased;padding:48px;display:flex;flex-direction:column;gap:64px;align-items:center}
.frame-label{font-family:var(--mono);color:var(--dim);font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:10px}
.frame-label::before{content:"";width:24px;height:1px;background:var(--green)}

/* shell */
.frame{width:1440px;height:900px;background:var(--bg);border:1px solid var(--border);border-radius:18px;overflow:hidden;display:flex;box-shadow:0 40px 120px -40px #000}

/* rail */
.rail{width:96px;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;align-items:center;padding:24px 0;gap:34px;flex-shrink:0}
.brand{display:flex;flex-direction:column;align-items:center;gap:8px}
.brand-mark{width:44px;height:44px;border-radius:13px;background:linear-gradient(145deg,#16331f,#0d1f14);border:1px solid #234a30;display:flex;align-items:center;justify-content:center;color:var(--green)}
.brand-mark svg{width:24px;height:24px}
.brand-name{font-family:var(--disp);font-size:13px;font-weight:700;letter-spacing:.5px;color:var(--muted)}
.brand-name b{color:var(--text);font-weight:800}
.rail-nav{display:flex;flex-direction:column;gap:8px;width:100%;align-items:center;flex:1}
.rail-item{width:64px;padding:10px 0;border-radius:14px;display:flex;flex-direction:column;align-items:center;gap:6px;color:var(--dim);cursor:pointer;border:1px solid transparent}
.rail-item svg{width:22px;height:22px}
.rail-lbl{font-size:9px;letter-spacing:.5px;text-transform:uppercase}
.rail-item.active{background:var(--surface3);border-color:var(--border2);color:var(--green)}
.rail-item:hover{color:var(--text)}
.rail-foot{margin-top:auto}
.rail-status{font-size:9px;color:var(--dim);text-align:center;line-height:1.5;letter-spacing:.5px}
.rail-status b{color:var(--green)}
.dot{width:7px;height:7px;border-radius:50%;background:var(--green);display:inline-block;margin-right:5px}
.dot.live{box-shadow:0 0 0 3px #4ade8033}

/* topbar */
.content{flex:1;display:flex;flex-direction:column;min-width:0}
.topbar{height:84px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 32px;flex-shrink:0}
.tb-left{display:flex;align-items:center;gap:24px}
.tb-prop{display:flex;align-items:center;gap:10px;color:var(--green)}
.tb-prop svg{width:20px;height:20px}
.tb-prop b{display:block;color:var(--text);font-size:14px;font-family:var(--disp);font-weight:700}
.tb-eyebrow{font-size:9px;letter-spacing:2px;color:var(--dim);text-transform:uppercase}
.tb-div{width:1px;height:36px;background:var(--border)}
.tb-page h1{font-family:var(--disp);font-size:20px;font-weight:800;letter-spacing:-.3px}
.tb-right{display:flex;align-items:center;gap:24px}
.tb-meta{text-align:right}
.tb-meta span{display:block;font-size:9px;letter-spacing:1.5px;color:var(--dim)}
.tb-meta b{font-size:13px;color:var(--text)}
.tb-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(145deg,#234a30,#16331f);border:1px solid var(--green);display:flex;align-items:center;justify-content:center;font-family:var(--disp);font-weight:700;font-size:13px;color:var(--green)}

/* cards */
.card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:20px}
.eyebrow{font-size:10px;letter-spacing:2px;color:var(--muted);text-transform:uppercase;display:flex;align-items:center;gap:7px;font-weight:500}
.eyebrow svg{width:14px;height:14px;color:var(--green)}
.eyebrow.bad{color:var(--red)}.eyebrow.bad svg{color:var(--red)}
.eyebrow.good svg{color:var(--green)}
.card-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px}
.card-head.tight{margin-bottom:12px;align-items:center}
.card-head h2{font-family:var(--disp);font-size:17px;font-weight:700;margin-top:8px}

/* dashboard grid */
.dash-grid{flex:1;display:grid;grid-template-columns:1fr 360px;gap:20px;padding:24px 32px;min-height:0}
.map-card{display:flex;flex-direction:column}
.map-wrap{flex:1;background:#0A0E14;border:1px solid var(--border);border-radius:12px;overflow:hidden;display:flex}
.seg{display:flex;background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:3px}
.seg-btn{background:none;border:none;color:var(--dim);font-family:var(--mono);font-size:11px;padding:6px 12px;border-radius:7px;cursor:pointer;letter-spacing:.5px}
.seg-btn.active{background:var(--surface3);color:var(--green)}
.legend{margin-top:16px}
.legend-title{font-size:9px;letter-spacing:2px;color:var(--dim)}
.legend-bar{height:8px;border-radius:5px;margin:8px 0 6px;background:linear-gradient(90deg,#7F1D1D,#F87171,#F59E0B,#FBBF24,#A3E635,#4ADE80,#15803D)}
.legend-scale{display:flex;justify-content:space-between;font-size:10px;color:var(--muted)}

.side-col{display:flex;flex-direction:column;gap:20px;min-height:0}
.stat-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}
.stat{background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:14px}
.stat-lbl{font-size:10px;color:var(--muted);letter-spacing:.5px}
.stat-val{display:flex;align-items:baseline;gap:5px;margin-top:6px}
.stat-val b{font-family:var(--disp);font-size:26px;font-weight:800;letter-spacing:-.5px}
.stat-unit{font-size:11px;color:var(--dim)}
.stat-delta{font-size:10px;margin-top:6px;display:inline-block}
.stat.good .stat-val b{color:var(--green)} .stat.good .stat-delta{color:var(--green)}
.stat.warn .stat-val b{color:var(--amber)} .stat.warn .stat-delta{color:var(--amber)}
.stat.bad .stat-val b{color:var(--red)} .stat.bad .stat-delta{color:var(--red)}
.mono-tag{font-size:10px;color:var(--muted);letter-spacing:.5px;display:flex;align-items:center}
.series-foot{display:flex;justify-content:space-between;font-size:10px;color:var(--dim);margin-top:6px}
.alert-mini{display:flex;align-items:center;gap:14px}
.alert-mini b{font-family:var(--disp);font-size:13px}
.alert-mini p{font-size:11px;color:var(--muted);margin-top:3px;line-height:1.4}
.ico-pill{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ico-pill svg{width:20px;height:20px}
.ico-pill.bad{background:#f8717119;color:var(--red);border:1px solid #f8717140}
.ico-pill.warn{background:#f59e0b19;color:var(--amber);border:1px solid #f59e0b40}
.ico-pill.good{background:#4ade8019;color:var(--green);border:1px solid #4ade8040}
.ico-pill.info{background:#60a5fa19;color:var(--info);border:1px solid #60a5fa40}
.risk{font-size:10px;font-weight:700;letter-spacing:1px;padding:4px 10px;border-radius:20px;font-family:var(--disp)}
.risk.bad{background:#f8717119;color:var(--red)} .risk.warn{background:#f59e0b19;color:var(--amber)}
.risk.good{background:#4ade8019;color:var(--green)} .risk.info{background:#60a5fa19;color:var(--info)}

/* alertas */
.alert-grid{flex:1;display:grid;grid-template-columns:1fr 380px;gap:20px;padding:24px 32px;min-height:0}
.alert-list{display:flex;flex-direction:column;gap:14px;overflow:hidden}
.filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:4px}
.chip{background:var(--surface);border:1px solid var(--border);color:var(--muted);font-family:var(--mono);font-size:11px;padding:7px 14px;border-radius:20px;cursor:pointer;letter-spacing:.3px}
.chip.active{background:var(--surface3);color:var(--text);border-color:var(--border2)}
.chip.bad{color:var(--red)}.chip.warn{color:var(--amber)}.chip.info{color:var(--info)}.chip.good{color:var(--green)}
.alert-card{background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--border);border-radius:14px;padding:18px;display:flex;gap:16px;align-items:flex-start}
.alert-card.bad{border-left-color:var(--red)}.alert-card.warn{border-left-color:var(--amber)}
.alert-card.good{border-left-color:var(--green)}.alert-card.info{border-left-color:var(--info)}
.alert-body{flex:1}
.alert-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.alert-tipo{font-size:10px;letter-spacing:2px;font-weight:700;font-family:var(--disp)}
.alert-tipo.bad{color:var(--red)}.alert-tipo.warn{color:var(--amber)}.alert-tipo.good{color:var(--green)}.alert-tipo.info{color:var(--info)}
.alert-body h3{font-family:var(--disp);font-size:15px;font-weight:700;margin-bottom:5px}
.alert-body p{font-size:12px;color:var(--muted);line-height:1.5}
.alert-meta{display:flex;gap:18px;margin-top:10px;font-size:11px;color:var(--dim)}
.alert-meta span{display:flex;align-items:center;gap:5px}
.alert-meta svg{width:13px;height:13px}
.ghost-btn{background:none;border:1px solid var(--border2);color:var(--text);font-family:var(--mono);font-size:11px;padding:8px 14px;border-radius:9px;cursor:pointer;white-space:nowrap;align-self:center}
.ghost-btn:hover{border-color:var(--green);color:var(--green)}
.ghost-btn.wide{width:100%}

.alert-detail{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:24px;display:flex;flex-direction:column;gap:18px}
.alert-detail h2{font-family:var(--disp);font-size:20px;font-weight:800;letter-spacing:-.3px}
.detail-stat{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.detail-stat .stat{padding:12px}
.detail-stat .stat-val b{font-size:20px}
.reco{background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:16px}
.reco p{font-size:13px;color:var(--text);line-height:1.6;margin-top:10px}
.reco p b{color:var(--green)}
.notify{display:flex;align-items:center;gap:12px;background:#4ade800d;border:1px solid #4ade8033;border-radius:12px;padding:14px}
.notify b{font-size:13px;font-family:var(--disp);display:block}
.notify .mono-tag{margin-top:3px}
.detail-actions{margin-top:auto;display:flex;flex-direction:column;gap:10px}
.solid-btn{background:var(--green);color:#06210f;border:none;font-family:var(--disp);font-weight:700;font-size:13px;padding:13px;border-radius:11px;cursor:pointer}
.solid-btn:hover{background:#6ee79b}

/* agrobot */
.bot-grid{flex:1;display:grid;grid-template-columns:1fr 340px;gap:20px;padding:24px 32px;min-height:0}
.chat-card{display:flex;flex-direction:column;padding:0;overflow:hidden}
.chat-head{display:flex;align-items:center;gap:12px;padding:18px 22px;border-bottom:1px solid var(--border)}
.bot-orb{width:42px;height:42px;border-radius:13px;background:linear-gradient(145deg,#16331f,#0d1f14);border:1px solid #234a30;color:var(--green);display:flex;align-items:center;justify-content:center}
.bot-orb svg{width:24px;height:24px}
.chat-head b{font-family:var(--disp);font-size:15px;font-weight:700;display:block}
.chat-stream{flex:1;padding:24px 22px;display:flex;flex-direction:column;gap:18px;overflow:hidden;background:radial-gradient(circle at 30% 0%,#161b2280,transparent 70%)}
.msg{display:flex;gap:10px;max-width:78%;align-items:flex-end}
.msg.bot{align-self:flex-start}
.msg.user{align-self:flex-end;flex-direction:row-reverse}
.bubble{padding:13px 16px;border-radius:16px;font-size:13px;line-height:1.55}
.msg.bot .bubble{background:var(--surface3);border:1px solid var(--border);border-bottom-left-radius:4px;color:var(--text)}
.msg.user .bubble{background:linear-gradient(145deg,#1d3a27,#16331f);border:1px solid #234a30;border-bottom-right-radius:4px;color:#dffbe8}
.msg-av{width:30px;height:30px;border-radius:9px;background:var(--surface3);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:11px;font-family:var(--disp);font-weight:700;color:var(--muted);flex-shrink:0}
.bot-av{background:linear-gradient(145deg,#16331f,#0d1f14);border-color:#234a30;color:var(--green)}
.bot-av svg{width:18px;height:18px}
.chat-input{display:flex;gap:10px;padding:16px 22px;border-top:1px solid var(--border)}
.chat-input input{flex:1;background:var(--bg);border:1px solid var(--border);border-radius:11px;padding:13px 16px;color:var(--text);font-family:var(--mono);font-size:13px;outline:none}
.chat-input input::placeholder{color:var(--dim)}
.send-btn{width:46px;background:var(--green);border:none;border-radius:11px;color:#06210f;cursor:pointer;display:flex;align-items:center;justify-content:center}
.send-btn svg{width:20px;height:20px}
.bot-side{display:flex;flex-direction:column;gap:20px}
.suggest{display:block;width:100%;text-align:left;background:var(--bg);border:1px solid var(--border);color:var(--text);font-family:var(--mono);font-size:12px;padding:12px 14px;border-radius:10px;cursor:pointer;margin-top:10px;line-height:1.4}
.suggest:hover{border-color:var(--green);color:var(--green)}
.bot-info p{font-size:12px;color:var(--muted);line-height:1.6;margin-top:12px}
.bot-info p b{color:var(--text)}
.src-row{display:flex;gap:8px;margin-top:14px}
.src{font-size:10px;color:var(--dim);background:var(--bg);border:1px solid var(--border);border-radius:7px;padding:5px 9px;letter-spacing:.5px}
`;

/* ===================== HTML ===================== */
const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=1440"/>
<title>AgroSat — Protótipo de Telas</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet"/>
<style>${css}</style>
</head>
<body>
  <div><div class="frame-label">Tela 01 · Dashboard / Mapa NDVI</div>${screen1}</div>
  <div><div class="frame-label">Tela 02 · Central de Alertas</div>${screen2}</div>
  <div><div class="frame-label">Tela 03 · AgroBot</div>${screen3}</div>
</body>
</html>`;

writeFileSync("agrosat_telas.html", html);
console.log("OK → agrosat_telas.html (" + (html.length / 1024).toFixed(1) + " KB)");
