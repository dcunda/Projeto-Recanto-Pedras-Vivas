/*
 * Recanto Pedras Vivas — comportamento do site
 * 1. Links do WhatsApp com mensagem pronta (atributo data-wa no HTML)
 * 2. Cabeçalho (vira barra flutuante ao rolar) e menu do celular
 * 3. Carrossel de experiências
 * 4. Formulário de orçamento: monta a mensagem e abre no WhatsApp
 * 5. Fotos: mostra a foto quando o arquivo existe; galeria ampliada
 * 6. Botão flutuante do WhatsApp e ano do rodapé
 */
(function () {
  'use strict';

  var cfg = window.RECANTO || {};
  var ocasioes = cfg.ocasioes || {};
  var numero = String(cfg.whatsapp || '').replace(/\D/g, '');

  /* 1. WhatsApp ------------------------------------------------------------ */
  function linkWhatsApp(texto) {
    if (!numero) return cfg.whatsappLink || 'https://wa.me/';
    return 'https://wa.me/' + numero + (texto ? '?text=' + encodeURIComponent(texto) : '');
  }

  function primeiraLinha(chave) {
    var o = ocasioes[chave] || ocasioes.geral || { pedido: 'mais informações' };
    return (cfg.saudacao || 'Olá!') + ' e gostaria de ' + o.pedido + '.';
  }

  function formatarNumero(n) {
    var m = /^55(\d{2})(\d{4,5})(\d{4})$/.exec(n);
    return m ? '(' + m[1] + ') ' + m[2] + '-' + m[3] : n;
  }

  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = linkWhatsApp(primeiraLinha(a.getAttribute('data-wa')));
    a.target = '_blank';
    a.rel = 'noopener';
  });

  document.querySelectorAll('[data-wa-numero]').forEach(function (el) {
    el.textContent = numero ? formatarNumero(numero) : 'WhatsApp';
  });

  if (/^55\d{2}9{8,9}$/.test(numero)) {
    console.warn('[Recanto] O número do WhatsApp em js/config.js ainda é o fictício. Troque pelo número real antes de publicar.');
  }

  /* 2. Cabeçalho e menu ---------------------------------------------------- */
  var topo = document.querySelector('[data-topo]');
  var hero = document.querySelector('.hero');
  var botaoMenu = document.querySelector('.menu-botao');
  var menu = document.getElementById('menu');

  function atualizarTopo() {
    if (!topo) return;
    var limite = hero ? hero.offsetHeight * 0.55 : 120;
    var flutuar = window.scrollY > limite;
    if (flutuar !== topo.classList.contains('flutuante')) {
      topo.classList.toggle('flutuante', flutuar);
      abrirMenu(false);
    }
  }
  window.addEventListener('scroll', atualizarTopo, { passive: true });
  window.addEventListener('resize', atualizarTopo);
  atualizarTopo();

  function abrirMenu(abrir) {
    if (!topo || !botaoMenu) return;
    topo.classList.toggle('aberto', abrir);
    botaoMenu.setAttribute('aria-expanded', String(abrir));
    botaoMenu.querySelector('.sr').textContent = abrir ? 'Fechar menu' : 'Abrir menu';
  }

  if (botaoMenu && menu) {
    botaoMenu.addEventListener('click', function () {
      var abrir = !topo.classList.contains('aberto');
      abrirMenu(abrir);
      if (abrir) {
        var primeiro = menu.querySelector('a');
        if (primeiro) primeiro.focus();
      }
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) abrirMenu(false);
    });
    document.addEventListener('click', function (e) {
      if (topo.classList.contains('aberto') && !topo.contains(e.target)) abrirMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && topo.classList.contains('aberto')) {
        abrirMenu(false);
        botaoMenu.focus();
      }
    });
  }

  /* 3. Carrossel ----------------------------------------------------------- */
  var carrossel = document.querySelector('[data-carrossel]');
  var anterior = document.querySelector('[data-carrossel-anterior]');
  var proximo = document.querySelector('[data-carrossel-proximo]');

  if (carrossel && anterior && proximo) {
    var passoCarrossel = function () {
      var item = carrossel.querySelector('li');
      var gap = parseFloat(getComputedStyle(carrossel).columnGap) || 0;
      return item ? item.getBoundingClientRect().width + gap : carrossel.clientWidth;
    };
    var atualizarSetas = function () {
      var max = carrossel.scrollWidth - carrossel.clientWidth - 2;
      anterior.disabled = carrossel.scrollLeft <= 2;
      proximo.disabled = carrossel.scrollLeft >= max;
    };
    anterior.addEventListener('click', function () {
      carrossel.scrollBy({ left: -passoCarrossel(), behavior: 'smooth' });
    });
    proximo.addEventListener('click', function () {
      carrossel.scrollBy({ left: passoCarrossel(), behavior: 'smooth' });
    });
    carrossel.addEventListener('scroll', atualizarSetas, { passive: true });
    window.addEventListener('resize', atualizarSetas);
    atualizarSetas();
  }

  /* 4. Orçamento ----------------------------------------------------------- */
  var form = document.querySelector('[data-orcamento]');
  if (form) {
    var chips = form.querySelector('[data-chips]');
    var previa = form.querySelector('[data-previa]');
    var primeiro = true;

    Object.keys(ocasioes).forEach(function (chave) {
      var o = ocasioes[chave];
      if (o.formulario === false) return;
      var label = document.createElement('label');
      label.className = 'chip';
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'ocasiao';
      input.value = chave;
      input.checked = primeiro;
      primeiro = false;
      var span = document.createElement('span');
      span.textContent = o.nome;
      label.appendChild(input);
      label.appendChild(span);
      chips.appendChild(label);
    });

    var campoData = form.elements.data;
    if (campoData) {
      var hoje = new Date();
      hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
      campoData.min = hoje.toISOString().slice(0, 10);
    }

    var montarMensagem = function () {
      var f = form.elements;
      var marcada = form.querySelector('input[name="ocasiao"]:checked');
      var linhas = [primeiraLinha(marcada ? marcada.value : 'geral')];
      if (f.data && f.data.value) {
        var p = f.data.value.split('-');
        linhas.push('Data: ' + p[2] + '/' + p[1] + '/' + p[0]);
      }
      if (f.pessoas && f.pessoas.value) linhas.push('Pessoas: cerca de ' + f.pessoas.value);
      if (f.nome && f.nome.value.trim()) linhas.push('Meu nome é ' + f.nome.value.trim() + '.');
      if (f.detalhes && f.detalhes.value.trim()) linhas.push('', f.detalhes.value.trim());
      return linhas.join('\n');
    };

    var atualizarMensagem = function () {
      previa.textContent = montarMensagem();
    };

    form.addEventListener('input', atualizarMensagem);
    form.addEventListener('change', atualizarMensagem);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var url = linkWhatsApp(montarMensagem());
      // abre o WhatsApp em outra aba; se o navegador bloquear, abre nesta mesma
      var janela = window.open(url, '_blank');
      if (janela) janela.opener = null;
      else window.location.href = url;
    });
    atualizarMensagem();
  }

  /* 5. Fotos e galeria ----------------------------------------------------- */
  var dialogo = document.querySelector('[data-lightbox]');
  var galeria = document.querySelector('[data-galeria]');
  var atual = 0;

  function fotosDaGaleria() {
    return galeria ? Array.prototype.slice.call(galeria.querySelectorAll('.foto.com-foto')) : [];
  }

  function mostrar(indice) {
    var lista = fotosDaGaleria();
    if (!lista.length || !dialogo) return;
    atual = (indice + lista.length) % lista.length;
    var origem = lista[atual].querySelector('img');
    var img = dialogo.querySelector('img');
    img.src = origem.currentSrc || origem.src;
    img.alt = origem.alt;
    dialogo.querySelector('figcaption').textContent = origem.alt;
    var varias = lista.length > 1;
    dialogo.querySelector('.lightbox-anterior').hidden = !varias;
    dialogo.querySelector('.lightbox-proxima').hidden = !varias;
  }

  function abrirFoto(fig) {
    if (!dialogo || typeof dialogo.showModal !== 'function') return;
    mostrar(fotosDaGaleria().indexOf(fig));
    dialogo.showModal();
  }

  function prepararFoto(fig) {
    var img = fig.querySelector('img');
    if (!img) return;
    var ok = function () {
      fig.classList.remove('sem-foto');
      fig.classList.add('com-foto');
      if (galeria && galeria.contains(fig) && !fig.querySelector('.foto-abrir')) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'foto-abrir';
        b.setAttribute('aria-label', 'Ampliar foto: ' + (img.alt || fig.getAttribute('data-legenda') || ''));
        b.addEventListener('click', function () { abrirFoto(fig); });
        fig.appendChild(b);
      }
    };
    var falhou = function () { fig.classList.add('sem-foto'); };
    if (img.complete) {
      if (img.naturalWidth) ok(); else falhou();
    } else {
      img.addEventListener('load', ok);
      img.addEventListener('error', falhou);
    }
  }

  document.querySelectorAll('.foto').forEach(prepararFoto);

  if (dialogo) {
    dialogo.querySelector('.lightbox-fechar').addEventListener('click', function () { dialogo.close(); });
    dialogo.querySelector('.lightbox-anterior').addEventListener('click', function () { mostrar(atual - 1); });
    dialogo.querySelector('.lightbox-proxima').addEventListener('click', function () { mostrar(atual + 1); });
    dialogo.addEventListener('click', function (e) {
      if (e.target === dialogo || e.target.classList.contains('lightbox-figura')) dialogo.close();
    });
    dialogo.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') mostrar(atual - 1);
      if (e.key === 'ArrowRight') mostrar(atual + 1);
    });
    var inicioX = null;
    dialogo.addEventListener('touchstart', function (e) { inicioX = e.touches[0].clientX; }, { passive: true });
    dialogo.addEventListener('touchend', function (e) {
      if (inicioX === null) return;
      var dx = e.changedTouches[0].clientX - inicioX;
      if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
      inicioX = null;
    });
  }

  /* 6. Botão flutuante e ano ----------------------------------------------- */
  var flutuante = document.querySelector('.wa-flutuante');
  if (flutuante && 'IntersectionObserver' in window) {
    var visiveis = new Set();
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) visiveis.add(en.target); else visiveis.delete(en.target);
      });
      flutuante.classList.toggle('escondido', visiveis.size > 0);
    }, { threshold: 0.12 });
    [hero, document.getElementById('orcamento'), document.querySelector('.rodape')].forEach(function (el) {
      if (el) observador.observe(el);
    });
  } else if (flutuante) {
    flutuante.classList.remove('escondido');
  }

  document.querySelectorAll('[data-ano]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
