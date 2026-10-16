/*
 * Configurações do site — Recanto Pedras Vivas
 * ---------------------------------------------
 * Tudo o que muda com frequência fica aqui: número do WhatsApp e textos das mensagens.
 * Os links que usam essas mensagens estão no index.html com o atributo data-wa="chave".
 */
window.RECANTO = {
  // Número do WhatsApp: DDI + DDD + número, só dígitos. Ex.: '5551987654321'
  // ATENÇÃO: número FICTÍCIO. Troque pelo número real do Recanto antes de publicar.
  whatsapp: '5551999999999',

  // Link do WhatsApp Business que está no Instagram (abre a conversa, mas sem mensagem pronta).
  // É usado automaticamente se você deixar "whatsapp" vazio: whatsapp: ''
  whatsappLink: 'https://wa.me/message/CQV2EJGWG76MI1',

  // Coordenadas do Recanto (tiradas do link do Waze no Instagram).
  // O céu do topo do site usa isso para calcular onde está o sol agora.
  coordenadas: { lat: -30.05681, lng: -50.94457 },

  // Começo de todas as mensagens.
  saudacao: 'Olá! Vim pelo site do Recanto Pedras Vivas',

  // Uma entrada por ocasião. A ordem aqui é a ordem dos botões no formulário de orçamento.
  //   nome:       como aparece no botão do formulário
  //   pedido:     o que vai na mensagem ("Olá! Vim pelo site ... e gostaria de <pedido>.")
  //   formulario: false = não aparece no formulário (só é usada por algum link do site)
  ocasioes: {
    casamento:   { nome: 'Casamento',            pedido: 'um orçamento para casamento' },
    aniversario: { nome: 'Aniversário ou festa', pedido: 'um orçamento para aniversário ou festa' },
    cha:         { nome: 'Chá revelação',        pedido: 'um orçamento para chá revelação' },
    retiro:      { nome: 'Retiro',               pedido: 'um orçamento para retiro' },
    empresa:     { nome: 'Evento de empresa',    pedido: 'um orçamento para evento de empresa' },
    acampamento: { nome: 'Acampamento',          pedido: 'um orçamento para acampamento' },
    dayuse:      { nome: 'Day use',              pedido: 'saber valores e datas do day use' },
    ensaio:      { nome: 'Ensaio fotográfico',   pedido: 'saber sobre ensaios fotográficos no Recanto' },
    visita:      { nome: 'Visitar o espaço',     pedido: 'agendar uma visita para conhecer o espaço' },
    geral:       { nome: 'Outro assunto',        pedido: 'mais informações' },
    caminho:     { nome: 'Como chegar',          pedido: 'saber como chegar ao Recanto', formulario: false }
  }
};
