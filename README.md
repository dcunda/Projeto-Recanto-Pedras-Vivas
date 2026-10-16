# Site do Recanto Pedras Vivas

Página de apresentação (one-page) em **HTML, CSS e JavaScript puro**: sem banco de dados, sem build e sem dependências.
Para ver, é só abrir o `index.html` no navegador. Para publicar, é só subir a pasta inteira para a hospedagem.

## Estrutura

```
index.html              todo o conteúdo: textos, seções e links
css/style.css           visual (cores, fonte e medidas no começo do arquivo, em :root)
js/config.js            número do WhatsApp e mensagens prontas  ← comece por aqui
js/ceu.js               céu do topo, que muda conforme a hora em Viamão, e horário do pôr do sol
js/main.js              menu, barra flutuante, carrossel, WhatsApp, orçamento e galeria
fonts/                  fonte Onest (licença SIL OFL)
imgs/                   logo, fotos e imagem de compartilhamento
favicon.png             ícone da aba do navegador
apple-touch-icon.png    ícone quando salvam o site na tela inicial do celular
robots.txt              libera o site para o Google
```

## Seções

1. **Topo**: painel com a paisagem do campo (o céu acompanha a hora real em Viamão), título, botões e um cartão de vidro com o horário do pôr do sol de hoje.
2. **Por que o Recanto**: quatro cards (o do pôr do sol mostra o horário de hoje, calculado sozinho).
3. **Experiências**: carrossel com casamentos, festas, chá revelação, day use, retiros, empresas, ensaios, acampamentos e visitas. Cada card abre o WhatsApp com a mensagem daquela ocasião.
4. **O lugar**: galeria em mosaico com 7 fotos (abre em tela cheia).
5. **Como chegar**: Waze, Google Maps e mapa.
6. **Orçamento**: monta a mensagem (ocasião, data, pessoas, nome) e abre no WhatsApp.
7. **Visita**: painel escuro com a paisagem à noite e o botão para agendar visita.

## Antes de publicar

1. **WhatsApp**: em `js/config.js`, troque o número fictício `5551999999999` pelo número real (DDI + DDD + número, só dígitos).
2. **Fotos**: coloque os arquivos nas pastas, com os nomes da tabela abaixo.
3. **Endereço**: no `index.html`, seção "Como chegar", troque `Viamão – RS` pelo endereço completo (procure o comentário "Endereço completo").
4. **Domínio**: quando tiver, troque no `<head>` o `og:image` por um endereço completo (`https://seudominio.com.br/imgs/compartilhar.jpg`). É a imagem que aparece quando alguém manda o link no WhatsApp.

## Fotos

Enquanto a foto não existe, o espaço mostra um "céu" com a legenda da foto que vai ali.
**Quando o arquivo existe, a foto aparece sozinha**, sem mexer no código.
A foto é cortada automaticamente para caber no espaço (`object-fit: cover`), então não precisa recortar antes.

**Topo (opcional)**

| Arquivo | O que acontece |
|---|---|
| `imgs/topo.jpg` | Se existir, a foto substitui a ilustração do topo e o texto fica branco. Use uma foto larga (ex. 1920×1080). |

**Experiências** (cards do carrossel, formato 4:3)

| Arquivo | Card |
|---|---|
| `imgs/experiencias/casamento.jpg` | Casamentos |
| `imgs/experiencias/aniversario.jpg` | Aniversários e festas |
| `imgs/experiencias/cha-revelacao.jpg` | Chá revelação |
| `imgs/experiencias/day-use.jpg` | Day use |
| `imgs/experiencias/retiro.jpg` | Retiros |
| `imgs/experiencias/empresas.jpg` | Eventos de empresas |
| `imgs/experiencias/ensaios.jpg` | Ensaios fotográficos |
| `imgs/experiencias/acampamento.jpg` | Acampamentos |
| `imgs/experiencias/visita.jpg` | Visitas |

**O lugar** (galeria em mosaico)

| Arquivo | Espaço |
|---|---|
| `imgs/galeria/01.jpg` | grande: pôr do sol atrás da árvore |
| `imgs/galeria/02.jpg` | cavalos no campo |
| `imgs/galeria/03.jpg` | alta (retrato): cerimônia no campo |
| `imgs/galeria/04.jpg` | o lago |
| `imgs/galeria/05.jpg` | larga (paisagem): mesa posta ao ar livre |
| `imgs/galeria/06.jpg` | chá revelação |
| `imgs/galeria/07.jpg` | noite estrelada |

- Exporte com no máximo 1600 px no lado maior e qualidade ~80% (até uns 300 KB cada). WebP também funciona: aí troque o `.jpg` do `src` no `index.html`.
- Troque também o `alt` de cada foto por uma descrição do que aparece nela (ajuda no Google e para quem usa leitor de tela).
- Só use fotos de pessoas (casais, famílias, gestantes) com autorização delas.

O logo está em `imgs/logo.jpg` (original). O site usa `imgs/logo-circulo.webp`, uma versão redonda e leve gerada a partir dele.

## WhatsApp e orçamento

- Cada botão com `data-wa="chave"` abre o WhatsApp com a mensagem daquela ocasião. As chaves e os textos ficam em `js/config.js` (`ocasioes`).
- O formulário de orçamento monta a mensagem com ocasião, data, número de pessoas e nome. **Nada é enviado pelo site**: a pessoa revisa e envia no próprio WhatsApp. Os botões de ocasião seguem a ordem do `config.js`.
- Sem JavaScript, os links usam o link do WhatsApp Business que está no Instagram (`wa.me/message/CQV2EJGWG76MI1`).

## Céu do topo

O céu, o sol, a lua e as estrelas acompanham a hora real em Viamão, e o site calcula o horário do nascer e do pôr do sol de cada dia. É tudo feito no navegador, sem internet e sem API.
De dia o texto do topo fica escuro; no fim de tarde e à noite, branco.
Para ver outro horário, abra com `?hora=`: `index.html?hora=18:30`, `?hora=6:00`, `?hora=22:00`...

A paisagem (coxilhas, lago, árvores, cavalos e cerca) é um SVG dentro do `index.html`. As cores dela estão no `js/ceu.js` (paletas `TARDE` e `MANHA`). No computador, as camadas se mexem um pouco com o mouse.

## Cores e fonte

No começo do `css/style.css`, em `:root`:

- `--fundo` cinza esverdeado da página, `--painel` fundo das seções, `--card` branco
- `--tinta`, `--tinta-2`, `--tinta-3` textos
- `--escuro` botões escuros, `--brasa` laranja do logo (botão do WhatsApp)
- `--raio-painel`, `--raio-card` arredondamentos
- `--fonte` Onest

## Publicar

Serve qualquer hospedagem de site estático:

- **Hostinger, Locaweb, cPanel**: subir o conteúdo da pasta para `public_html` (gerenciador de arquivos ou FTP).
- **Netlify** ou **Vercel**: arrastar a pasta no painel.
- **GitHub Pages**: subir num repositório e ativar o Pages.

Para testar no computador: abrir o `index.html` direto ou usar a extensão Live Server do VS Code.

## Créditos

Fonte Onest (The Onest Project Authors), licença SIL Open Font License, arquivo em `fonts/`.
Ícones: Simple Icons (CC0) e Lucide (ISC).
