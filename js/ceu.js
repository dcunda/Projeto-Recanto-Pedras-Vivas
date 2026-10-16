/*
 * Céu do topo
 * -----------
 * Pinta o céu com as cores de agora em Viamão. Calcula a posição do sol pela data/hora e pelas
 * coordenadas do Recanto (js/config.js) e, a partir da altura do sol, escolhe as cores do céu,
 * dos morros e do lago, a posição do sol, a lua e as estrelas. Também calcula o horário do
 * nascer e do pôr do sol de hoje (cartão de vidro do topo e card "Pôr do sol de cenário").
 *
 * A cena "olha" para o oeste, para o pôr do sol: à tarde o sol desce até o horizonte;
 * de manhã ele fica atrás de quem olha.
 *
 * Céu claro (dia) = texto escuro. Céu escuro (fim de tarde e noite) = texto branco.
 * O modo fica em <html data-ceu="claro|escuro"> e o CSS faz o resto.
 *
 * Para ver outro horário: abra index.html?hora=18:45 (ou ?hora=7, ?hora=22:30 ...)
 */
(function () {
  'use strict';

  var hero = document.querySelector('[data-ceu]');
  if (!hero) return;

  var cfg = window.RECANTO || {};
  var coord = cfg.coordenadas || {};
  var LAT = typeof coord.lat === 'number' ? coord.lat : -30.05681;
  var LNG = typeof coord.lng === 'number' ? coord.lng : -50.94457;
  var RAD = Math.PI / 180;
  var FUSO = 'America/Sao_Paulo';
  var raiz = document.documentElement;

  /* ------------------------------------------------------------------ paletas
   * Cada parada vale para uma altura do sol (graus); entre duas paradas as cores se misturam.
   * "TARDE" vale depois do meio-dia solar e "MANHA" antes.
   */
  var CORES = ['topo', 'meio', 'horizonte', 'nuvem', 'lago', 'm1', 'm2', 'm3', 'm4', 'arvore'];
  var NUMEROS = ['estrelas', 'nuvemOpacidade', 'veu', 'luz'];

  function parada(alt, c, n) {
    var p = { alt: alt };
    CORES.forEach(function (k, i) { p[k] = c[i]; });
    NUMEROS.forEach(function (k, i) { p[k] = n[i]; });
    return p;
  }

  //                         topo       meio       horizonte  nuvem      lago       m1         m2         m3         m4         arvore       estrelas nuvem véu  luz
  var NOITE = parada(-18, ['#0b1431', '#16234b', '#25355f', '#2a3561', '#1c2b53', '#1e2944', '#172036', '#111829', '#0c1220', '#080c16'], [1, 0.35, 0, 0.25]);
  var DIA = parada(25, ['#9ec3e5', '#cfe1ee', '#eef2ee', '#ffffff', '#8fb4cf', '#b9cbbb', '#8fb08a', '#6a9564', '#4d7748', '#2e4c2e'], [0, 0.95, 0, 1]);
  var DIA_ALTO = parada(60, ['#95bee4', '#c8dff0', '#eef4f4', '#ffffff', '#85b0d2', '#b5c9b8', '#89ad85', '#62905e', '#477243', '#2b4a2b'], [0, 0.95, 0, 1]);

  var TARDE = [
    parada(-90, ['#0b1431', '#16234b', '#25355f', '#2a3561', '#1c2b53', '#1e2944', '#172036', '#111829', '#0c1220', '#080c16'], [1, 0.35, 0, 0.25]),
    NOITE,
    parada(-10, ['#121d46', '#2c3876', '#5e5088', '#3b3f6c', '#3a3e74', '#2c314f', '#202642', '#181d33', '#111627', '#0b0f1b'], [0.6, 0.5, 0, 0.3]),
    parada(-4, ['#2a3b6e', '#7a6190', '#e3916f', '#c07a8a', '#b67e8a', '#5f4d5e', '#42384a', '#2d2837', '#1e1b27', '#13111a'], [0.12, 0.85, 0.3, 0.45]),
    parada(0, ['#3f5789', '#b0817a', '#f6b46f', '#f4ab86', '#e8a47a', '#8f7468', '#625149', '#403633', '#2b2423', '#1a1514'], [0, 0.9, 0.44, 0.7]),
    parada(4, ['#7d9bc6', '#e2b498', '#f8d08f', '#fbdcc0', '#ddb991', '#a99a85', '#7d7f5f', '#576841', '#3d4e2f', '#26331f'], [0, 0.9, 0, 0.9]),
    parada(10, ['#92b3d8', '#d8d7cf', '#f4dfb6', '#fff6ea', '#a9c0cc', '#aebba5', '#7f9b6f', '#5d824f', '#43633a', '#2a4227'], [0, 0.92, 0, 1]),
    DIA,
    DIA_ALTO,
    parada(90, ['#95bee4', '#c8dff0', '#eef4f4', '#ffffff', '#85b0d2', '#b5c9b8', '#89ad85', '#62905e', '#477243', '#2b4a2b'], [0, 0.95, 0, 1])
  ];

  // De manhã, olhando para o oeste, não há brilho laranja: aparece a faixa rosada sobre o azul.
  var MANHA = [
    TARDE[0],
    NOITE,
    parada(-10, ['#131f48', '#2d3871', '#4c4c82', '#3a3f6c', '#363b70', '#282e4d', '#1e243f', '#161b30', '#0f1424', '#0a0e1a'], [0.55, 0.5, 0, 0.3]),
    parada(-4, ['#2f4479', '#8c7da8', '#dca5ac', '#cfa0b0', '#ad93aa', '#625a73', '#463f55', '#302c3e', '#201d2b', '#14121c'], [0.1, 0.8, 0.3, 0.45]),
    parada(0, ['#4d699e', '#9d8db2', '#f2cbbb', '#f6d6cc', '#cbb8c5', '#898693', '#626664', '#444a40', '#2e332b', '#1b1f19'], [0, 0.85, 0.44, 0.7]),
    parada(4, ['#84a2cc', '#b9c3dc', '#f5ddcd', '#fdeee6', '#bfc8d4', '#a6aea6', '#7b8e71', '#56704b', '#3b5434', '#24351f'], [0, 0.9, 0, 0.9]),
    parada(10, ['#94b6da', '#c3d4e6', '#e9ecea', '#ffffff', '#a3bccc', '#b2c1b2', '#839e76', '#5f824f', '#43603a', '#293f25'], [0, 0.92, 0, 1]),
    DIA,
    DIA_ALTO,
    TARDE[TARDE.length - 1]
  ];

  // Cores do sol conforme a altura: miolo (disco) e brilho (halo em volta).
  var SOL = [
    { alt: -6, miolo: '#ffb070', brilho: '#ff7a3d' },
    { alt: 0, miolo: '#ffdc8f', brilho: '#ff9147' },
    { alt: 5, miolo: '#ffeab4', brilho: '#ffb45e' },
    { alt: 15, miolo: '#fff6de', brilho: '#ffdc9a' },
    { alt: 40, miolo: '#fffdf6', brilho: '#fff1cc' },
    { alt: 90, miolo: '#fffdf6', brilho: '#fff1cc' }
  ];

  /* ------------------------------------------------------------------ cores */
  function hexParaRgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgbParaHex(rgb) {
    return '#' + rgb.map(function (v) {
      var s = Math.round(Math.max(0, Math.min(255, v))).toString(16);
      return s.length === 1 ? '0' + s : s;
    }).join('');
  }
  function misturar(a, b, t) {
    var x = hexParaRgb(a), y = hexParaRgb(b);
    return rgbParaHex([0, 1, 2].map(function (i) { return x[i] + (y[i] - x[i]) * t; }));
  }
  function luminancia(hex) {
    var c = hexParaRgb(hex).map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function entre(lista, alt) {
    if (alt <= lista[0].alt) return { a: lista[0], b: lista[0], t: 0 };
    for (var i = 0; i < lista.length - 1; i++) {
      var a = lista[i], b = lista[i + 1];
      if (alt >= a.alt && alt <= b.alt) {
        return { a: a, b: b, t: b.alt === a.alt ? 0 : (alt - a.alt) / (b.alt - a.alt) };
      }
    }
    var ult = lista[lista.length - 1];
    return { a: ult, b: ult, t: 0 };
  }
  function paleta(alt, manha) {
    var p = entre(manha ? MANHA : TARDE, alt);
    var out = {};
    CORES.forEach(function (k) { out[k] = misturar(p.a[k], p.b[k], p.t); });
    NUMEROS.forEach(function (k) { out[k] = p.a[k] + (p.b[k] - p.a[k]) * p.t; });
    var s = entre(SOL, alt);
    out.solMiolo = misturar(s.a.miolo, s.b.miolo, s.t);
    out.sol = misturar(s.a.brilho, s.b.brilho, s.t);
    return out;
  }

  /* ------------------------------------------------------------------ astronomia
   * Posição aproximada do sol (algoritmo do U.S. Naval Observatory, erro < 1°).
   */
  function posicaoDoSol(data) {
    var d = data.getTime() / 86400000 + 2440587.5 - 2451545.0; // dias desde J2000
    var g = (357.529 + 0.98560028 * d) % 360;
    var q = (280.459 + 0.98564736 * d) % 360;
    var L = q + 1.915 * Math.sin(g * RAD) + 0.020 * Math.sin(2 * g * RAD);
    var e = 23.439 - 0.00000036 * d;
    var ra = Math.atan2(Math.cos(e * RAD) * Math.sin(L * RAD), Math.cos(L * RAD)) / RAD;
    var dec = Math.asin(Math.sin(e * RAD) * Math.sin(L * RAD)) / RAD;
    var gmst = (280.46061837 + 360.98564736629 * d) % 360;
    var H = ((gmst + LNG - ra) % 360 + 540) % 360 - 180; // ângulo horário, -180..180
    var alt = Math.asin(Math.sin(LAT * RAD) * Math.sin(dec * RAD) + Math.cos(LAT * RAD) * Math.cos(dec * RAD) * Math.cos(H * RAD)) / RAD;
    var az = Math.atan2(-Math.sin(H * RAD), Math.tan(dec * RAD) * Math.cos(LAT * RAD) - Math.sin(LAT * RAD) * Math.cos(H * RAD)) / RAD;
    return { alt: alt, az: (az + 360) % 360, manha: H < 0 };
  }

  // Nascer e pôr do sol do dia (em Viamão) que contém "data".
  function horariosDoSol(data) {
    var local = new Date(data.getTime() - 3 * 3600000);
    var meiaNoite = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), 3, 0);
    var ALVO = -0.833; // borda de cima do sol encostando no horizonte, com refração
    function acima(t) { return posicaoDoSol(new Date(t)).alt - ALVO; }
    function refinar(a, b) {
      for (var i = 0; i < 14; i++) {
        var m = (a + b) / 2;
        if ((acima(a) < 0) === (acima(m) < 0)) a = m; else b = m;
      }
      return new Date((a + b) / 2);
    }
    var passo = 10 * 60000, nascer = null, por = null, antes = acima(meiaNoite);
    for (var t = meiaNoite + passo; t <= meiaNoite + 86400000; t += passo) {
      var agora = acima(t);
      if (antes < 0 && agora >= 0 && !nascer) nascer = refinar(t - passo, t);
      if (antes >= 0 && agora < 0 && !por) por = refinar(t - passo, t);
      antes = agora;
    }
    return { nascer: nascer, por: por };
  }

  // Fase da lua: 0 = nova, 0.5 = cheia. Referência: lua nova de 6/jan/2000 18:14 UTC.
  function faseDaLua(data) {
    var sinodico = 29.530588853;
    var dias = (data.getTime() - Date.UTC(2000, 0, 6, 18, 14)) / 86400000;
    var fase = (dias % sinodico) / sinodico;
    return fase < 0 ? fase + 1 : fase;
  }

  // Parte iluminada da lua (no hemisfério sul a lua crescente fica iluminada à esquerda).
  function caminhoDaLua(fase, r) {
    var rx = Math.abs(Math.cos(2 * Math.PI * fase)) * r;
    var crescendo = fase < 0.5;
    var fina = Math.abs(fase - 0.5) > 0.25; // menos da metade iluminada
    var borda = crescendo ? 0 : 1;
    var terminador = crescendo ? (fina ? 1 : 0) : (fina ? 0 : 1);
    return 'M0 ' + (-r) +
      ' A' + r + ' ' + r + ' 0 0 ' + borda + ' 0 ' + r +
      ' A' + rx.toFixed(2) + ' ' + r + ' 0 0 ' + terminador + ' 0 ' + (-r) + 'Z';
  }

  /* ------------------------------------------------------------------ hora */
  function dataDeTeste() {
    var p = new URLSearchParams(location.search).get('hora');
    if (!p) return null;
    var m = /^(\d{1,2})(?:[:h](\d{2}))?$/.exec(p.trim());
    if (!m) return null;
    var h = Math.min(23, parseInt(m[1], 10)), min = Math.min(59, parseInt(m[2] || '0', 10));
    var local = new Date(Date.now() - 3 * 3600000); // "hoje" em Viamão (UTC-3, sem horário de verão)
    return new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), h + 3, min));
  }

  var formatoHora;
  try {
    formatoHora = new Intl.DateTimeFormat('pt-BR', { timeZone: FUSO, hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    formatoHora = null;
  }
  function horaTexto(data) {
    if (!data) return '--h--';
    var s = formatoHora ? formatoHora.format(data) : data.toTimeString().slice(0, 5);
    return s.replace(':', 'h');
  }

  /* ------------------------------------------------------------------ elementos */
  var elTexto = hero.querySelector('.hero-conteudo');
  var elWidget = hero.querySelector('.widget-sol');
  var elPaisagem = hero.querySelector('.paisagem');
  // (elementos de outras seções são buscados na hora, porque este script roda antes delas existirem)
  function todos(seletor) { return Array.prototype.slice.call(document.querySelectorAll(seletor)); }
  var TOPO_DO_MORRO = 356; // y do ponto mais alto do morro do fundo, no viewBox 1600x600
  var dataFixa = dataDeTeste();

  // Estrelas: posições sorteadas, sempre iguais (gerador com semente).
  function gerarEstrelas(svg) {
    if (!svg || svg.childNodes.length) return;
    var semente = 20260915;
    function aleatorio() {
      semente |= 0; semente = (semente + 0x6D2B79F5) | 0;
      var t = Math.imul(semente ^ (semente >>> 15), 1 | semente);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    var ns = 'http://www.w3.org/2000/svg';
    var frag = document.createDocumentFragment();
    for (var i = 0; i < 140; i++) {
      var c = document.createElementNS(ns, 'circle');
      var brilhante = aleatorio() > 0.93;
      c.setAttribute('cx', (aleatorio() * 1600).toFixed(1));
      c.setAttribute('cy', (Math.pow(aleatorio(), 1.4) * 620).toFixed(1));
      c.setAttribute('r', (brilhante ? 1.6 + aleatorio() * 0.8 : 0.5 + aleatorio() * 0.9).toFixed(2));
      c.setAttribute('opacity', (0.35 + aleatorio() * 0.65).toFixed(2));
      frag.appendChild(c);
    }
    svg.appendChild(frag);
  }

  var ultimo = null;

  function aplicar(data) {
    var sol = posicaoDoSol(data);
    var p = paleta(sol.alt, sol.manha);
    var s = hero.style;

    CORES.forEach(function (k) { s.setProperty('--c-' + k, p[k]); });
    s.setProperty('--c-sol', p.sol);
    s.setProperty('--c-sol-miolo', p.solMiolo);
    s.setProperty('--estrelas', p.estrelas.toFixed(2));
    s.setProperty('--nuvem-opacidade', p.nuvemOpacidade.toFixed(2));
    s.setProperty('--veu', p.veu.toFixed(2));
    s.setProperty('--luz-morros', p.luz.toFixed(2));

    // texto escuro em céu claro, texto branco em céu escuro (ou quando há foto no topo)
    var claro = luminancia(misturar(p.topo, p.meio, 0.35)) > 0.2;
    raiz.setAttribute('data-ceu', claro && !hero.classList.contains('com-foto') ? 'claro' : 'escuro');

    // brilho no horizonte perto do pôr/nascer do sol (o disco do sol só aparece à tarde)
    var perto = Math.max(0, 1 - Math.abs(sol.alt - 1) / 9);
    s.setProperty('--brilho-horizonte', (sol.manha ? perto * 0.35 : perto).toFixed(2));
    var solVisivel = !sol.manha && sol.alt > -2.5;
    var luzManha = sol.manha && sol.alt > -6 ? Math.min(1, (sol.alt + 6) / 16) * (sol.alt > 30 ? 0.5 : 0.8) : 0;
    s.setProperty('--sol-opacidade', solVisivel ? '1' : '0');
    s.setProperty('--luz-manha', luzManha.toFixed(2));

    // solzinho do cartão de vidro
    s.setProperty('--mini-sol-y', (62 - Math.max(-10, Math.min(60, sol.alt)) * 0.75).toFixed(1) + '%');

    if (p.estrelas > 0.01) gerarEstrelas(hero.querySelector('.estrelas'));
    todos('[data-estrelas]').forEach(gerarEstrelas);

    // lua (só quando já escureceu e não é lua nova); o painel de visita mostra sempre
    var fase = faseDaLua(data);
    var iluminada = (1 - Math.cos(2 * Math.PI * fase)) / 2;
    var luaOpacidade = sol.alt < -4 && iluminada > 0.04 ? Math.min(1, (-4 - sol.alt) / 5) : 0;
    s.setProperty('--lua-opacidade', luaOpacidade.toFixed(2));
    var caminho = caminhoDaLua(iluminada > 0.04 ? fase : 0.12, 40);
    todos('.lua-luz').forEach(function (el) { el.setAttribute('d', caminho); });

    // horários do sol
    var horarios = horariosDoSol(data);
    var amanha = horariosDoSol(new Date(data.getTime() + 86400000));
    todos('[data-por-do-sol]').forEach(function (el) { el.textContent = horaTexto(horarios.por); });
    var elTituloSol = document.querySelector('[data-sol-titulo]');
    var elTextoSol = document.querySelector('[data-sol-texto]');
    if (elTituloSol) {
      if (horarios.nascer && data < horarios.nascer) elTituloSol.textContent = 'O sol nasce hoje às ' + horaTexto(horarios.nascer);
      else if (horarios.por && data < horarios.por) elTituloSol.textContent = 'Pôr do sol hoje às ' + horaTexto(horarios.por);
      else elTituloSol.textContent = 'O sol nasce amanhã às ' + horaTexto(amanha.nascer);
    }
    if (elTextoSol) {
      elTextoSol.textContent = dataFixa
        ? 'Simulação das ' + horaTexto(data) + ' em Viamão.'
        : 'São ' + horaTexto(data) + ' em Viamão. O céu do topo segue a hora real.';
    }

    ultimo = { sol: sol };
    posicionar();
  }

  /* ------------------------------------------------------------------ posições */
  function caixa(el, r, tipo) {
    if (!el) return null;
    var f = el.getBoundingClientRect();
    if (!f.width) return null;
    return { esq: f.left - r.left, dir: f.right - r.left, topo: f.top - r.top, base: f.bottom - r.top, tipo: tipo };
  }

  // Posição do sol e da lua em pixels, sem ficar atrás do texto nem do cartão de vidro.
  function posicionar() {
    if (!ultimo) return;
    var r = hero.getBoundingClientRect();
    if (!r.width) return;
    var largura = r.width, altura = r.height;

    // linha do horizonte pela geometria do SVG (não depende da animação de entrada)
    var horizonte = altura * 0.72;
    if (elPaisagem) {
      var pr = elPaisagem.getBoundingClientRect();
      if (pr.width && pr.height) {
        var escala = Math.max(pr.width / 1600, pr.height / 600);
        horizonte = altura - (600 - TOPO_DO_MORRO) * escala + 12;
      }
    }
    hero.style.setProperty('--hz', ((horizonte / altura) * 100).toFixed(2) + '%');

    // área ocupada pelo texto (título, parágrafo e botões)
    var texto = null;
    if (elTexto) {
      Array.prototype.forEach.call(elTexto.children, function (filho) {
        var c = caixa(filho, r, 'texto');
        if (!c) return;
        if (filho.tagName === 'H1' || filho.tagName === 'P') {
          var faixa = document.createRange();
          faixa.selectNodeContents(filho);
          var t = faixa.getBoundingClientRect();
          if (t.width) c.dir = Math.min(c.dir, t.right - r.left);
        } else if (filho.children.length) {
          c.dir = c.esq;
          Array.prototype.forEach.call(filho.children, function (b) {
            c.dir = Math.max(c.dir, b.getBoundingClientRect().right - r.left);
          });
        }
        if (!texto) texto = c;
        else {
          texto.esq = Math.min(texto.esq, c.esq);
          texto.dir = Math.max(texto.dir, c.dir);
          texto.topo = Math.min(texto.topo, c.topo);
          texto.base = Math.max(texto.base, c.base);
        }
      });
    }
    var obstaculos = [texto, caixa(elWidget, r, 'cartao')].filter(Boolean);

    var topo = 140;          // abaixo do cabeçalho
    var linha = horizonte - 16; // o sol "espia" por cima dos morros quando está no horizonte

    function lugar(fx, fe) {
      var p = { x: largura * fx, y: linha - fe * (linha - topo) };
      obstaculos.forEach(function (o) {
        var dentro = p.x > o.esq - 60 && p.x < o.dir + 60 && p.y > o.topo - 56 && p.y < o.base + 50;
        if (!dentro) return;
        if (o.dir + 110 < largura - 70) p.x = o.dir + 110;      // cabe à direita
        else if (o.tipo === 'texto') p.y = Math.min(linha - 20, o.base + 56); // embaixo do texto
        else p.y = o.topo - 58;                                   // em cima do cartão
      });
      return p;
    }

    var sol = ultimo.sol;
    // olhando para o oeste: sul à esquerda (az 180), oeste no meio (270), norte à direita (360)
    var fx = Math.max(0.06, Math.min(0.94, 0.5 + ((sol.az - 270) / 90) * 0.5));
    var fe = Math.max(-0.12, Math.min(1, sol.alt / 62));
    var ps = lugar(fx, fe);
    hero.style.setProperty('--sol-x', ps.x.toFixed(1) + 'px');
    hero.style.setProperty('--sol-y', ps.y.toFixed(1) + 'px');

    var pl = lugar(0.8, 0.62);
    hero.style.setProperty('--lua-x', pl.x.toFixed(1) + 'px');
    hero.style.setProperty('--lua-y', pl.y.toFixed(1) + 'px');
  }

  /* ------------------------------------------------------------------ profundidade com o mouse */
  var ponteiroFino = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var semMovimento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (ponteiroFino && !semMovimento) {
    var pedido = null, px = 0, py = 0;
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width - 0.5) * 2;
      py = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (pedido) return;
      pedido = requestAnimationFrame(function () {
        pedido = null;
        hero.style.setProperty('--px', px.toFixed(3));
        hero.style.setProperty('--py', py.toFixed(3));
      });
    });
    hero.addEventListener('pointerleave', function () {
      hero.style.setProperty('--px', '0');
      hero.style.setProperty('--py', '0');
    });
  }

  /* ------------------------------------------------------------------ começar */
  aplicar(dataFixa || new Date());
  // de novo quando a página termina de carregar (painel de visita, card do pôr do sol...)
  document.addEventListener('DOMContentLoaded', function () { aplicar(dataFixa || new Date()); });

  if (!dataFixa) {
    setInterval(function () { aplicar(new Date()); }, 60000);
  }

  var espera;
  window.addEventListener('resize', function () {
    clearTimeout(espera);
    espera = setTimeout(posicionar, 120);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(posicionar);
  window.addEventListener('load', posicionar);
})();
