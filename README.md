# WhatsApp Link Generator

Gerador de link e QR code que abrem o WhatsApp do cliente com o número certo e uma mensagem pronta,
para que quem vem pela divulgação de um atendente chegue identificado.

[![CI](https://github.com/pablosscosta/whatsapp-link-generator/actions/workflows/ci.yml/badge.svg)](https://github.com/pablosscosta/whatsapp-link-generator/actions/workflows/ci.yml)
[![Licença: MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-blue.svg)](LICENSE)
![React 19](https://img.shields.io/badge/React-19-149eca)
![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-3178c6)

## Demonstração

**https://pablosscosta.github.io/whatsapp-link-generator/**

<!-- TODO(Pablo): GIF em docs/assets/ com dados fictícios. -->

## O problema

Numa loja em que toda a equipe usa o mesmo WhatsApp, o cliente que viu a promoção no status de um
atendente manda mensagem para o número geral, e nada garante que vai ser atendido por quem o trouxe. O
atendente pode perder a comissão.

## Funcionalidades

- Número de destino em qualquer formato comum (`(11) 90000-0000`, `+55 11 90000-0000`), com validação
  de DDD e do tamanho de celular e fixo.
- Mensagem pronta opcional, de até 500 caracteres, com acentos, emojis e quebras de linha.
- Resumo legível do resultado: o número formatado (`+55 (11) 90000-0000`) e a mensagem num balão,
  para conferir antes de divulgar.
- QR code exibido na tela e para baixar em PNG (1024 px) ou SVG.
- Botões para copiar o link (o botão confirma com "Copiado!") e abrir no WhatsApp. Se a cópia
  automática falhar, o link aparece num campo para copiar à mão.
- **Compartilhar** no celular: abre o menu de compartilhamento do aparelho com a imagem do QR code e o
  link, pronto para o status do WhatsApp. O botão só aparece onde o navegador oferece esse recurso.
- No celular, a página rola até o resultado e o foco vai para ele (leitores de tela o anunciam). No
  desktop, formulário e resultado ficam lado a lado.
- Ao editar o formulário, o resultado anterior some, para não divulgar um link desatualizado.

O link e o QR code **não expiram** e não dependem deste site: o QR code guarda o próprio link
`wa.me`, então continua funcionando mesmo se o site sair do ar. Em compensação, não dá para editá-los
depois de divulgados; para mudar o número ou a mensagem, é preciso gerar um novo.

Nada é salvo: tudo acontece no navegador.

## Tecnologias

- **React + TypeScript (strict) + Vite**: SPA estática, sem servidor, com tipagem rígida.
- **[`qrcode`](https://www.npmjs.com/package/qrcode)**: a única dependência de produção além do React.
  Gera SVG e PNG a partir do mesmo texto, que são exatamente os dois downloads; codificar QR na mão
  seria reinventar algo complexo.
- **Vitest + Testing Library**: testes do comportamento do usuário.
- **ESLint + Prettier**: lint e formatação.
- **GitHub Actions + GitHub Pages**: CI e hospedagem gratuitos, sem cold start.

## Arquitetura

```mermaid
flowchart LR
  A[Atendente] -->|número + mensagem| B[SPA React<br/>GitHub Pages]
  B -->|gera| C[Link wa.me + QR code]
  C -->|compartilha no status| D[Cliente]
  D -->|abre| E[WhatsApp com mensagem pronta]
```

O MVP não tem backend: o link `wa.me` é montado no navegador a partir do número e da mensagem. Um
backend (Django + Koyeb + Neon) só entra quando houver necessidade de contar cliques e editar links já
divulgados ([ADR 0001](docs/adr/0001-mvp-estatico-e-hospedagem.md)).

## Como rodar localmente

Pré-requisito: Node 24 (`.nvmrc`). Não há variáveis de ambiente.

```bash
npm install
npm run dev     # http://localhost:5173/whatsapp-link-generator/
```

Outros comandos: `npm run lint`, `npm run format`, `npm run build` e `npm run preview`.

## Testes

```bash
npm test            # modo watch
npm test -- --run   # uma vez, como no CI
```

- **Regras (`src/lib/`)**: normalização, validação e formatação do número (formatos, DDI, DDD,
  celular e fixo), montagem do link (acentos, emojis, quebras de linha e caracteres reservados),
  geração do QR code em SVG e PNG e conversão do PNG em arquivo.
- **Interface (`src/App.test.tsx`)**: o fluxo do usuário com Testing Library — resumo e QR code,
  erros de validação, copiar (confirmação, volta do botão e falha), downloads, compartilhar (com
  imagem, só link, cancelado, falha e navegador sem suporte), foco e rolagem até o resultado.

O CI roda lint, verificação de formatação, testes e build em todo PR.

## Decisões e aprendizados

- **Começar sem backend:** o problema principal se resolve no navegador; infraestrutura só entra com
  necessidade comprovada ([ADR 0001](docs/adr/0001-mvp-estatico-e-hospedagem.md)).
- **Hospedagem escolhida pelo caminho crítico:** quem escaneia o QR não pode esperar um servidor
  acordar, o que descartou planos gratuitos com cold start longo. O Netlify ficou de fora de propósito:
  o plano gratuito divide créditos com o site do portfólio.
- **Compartilhar sem dependência:** a [Web Share API](https://developer.mozilla.org/docs/Web/API/Navigator/share)
  do navegador manda a imagem e o link direto para o WhatsApp. Fechar o menu sem escolher não é tratado
  como erro, e o botão some onde o recurso não existe, em vez de falhar.
- **Regras em funções puras:** validação do número e montagem do link ficam fora dos componentes, com
  testes unitários rápidos; os componentes só cuidam da interface.
- **Erros visíveis, nunca engolidos:** falhas ao copiar, compartilhar ou gerar o QR code aparecem para
  o usuário com uma alternativa (copiar o link à mão, copiar em vez de compartilhar).

## Próximos passos

- **Contas:** links curtos editáveis (`/r/<slug>`) e contagem de cliques, com Django + DRF.
- **Equipe:** loja com vários atendentes, um link por atendente e painel do gerente.
- Recuperação de senha por e-mail, personalização do QR code e cliques por origem.

## Autor

**Pablo Costa**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-pablosilva013-0A66C2)](https://www.linkedin.com/in/pablosilva013)
[![GitHub](https://img.shields.io/badge/GitHub-pablosscosta-181717?logo=github&logoColor=white)](https://github.com/pablosscosta)
[![Portfólio](https://img.shields.io/badge/Portf%C3%B3lio-portfolio--pablosscosta-0f766e)](https://portfolio-pablosscosta.netlify.app/)
