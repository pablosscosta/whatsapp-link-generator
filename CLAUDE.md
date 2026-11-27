# WhatsApp Link Generator

## Objetivo

Gera um link `wa.me` e um QR code que abrem o WhatsApp do cliente já com o número de destino e uma
mensagem pronta. Nasceu de um caso real: numa loja com um único WhatsApp para toda a equipe, o cliente
que vem pela divulgação de um atendente precisa chegar identificado ("quero ser atendido pela Ana").
Projeto de portfólio: destaque para um produto que começa simples e evolui só quando há necessidade
real (ADR 0001).

Na interface, o título é **"Gerador de link para WhatsApp"**: o "para" deixa claro que é uma ferramenta
compatível, não um produto da Meta. Não usar o logo do WhatsApp.

## Etapas

1. **MVP (atual):** site estático, sem backend. Número + mensagem → link `wa.me` + QR code (PNG/SVG).
   Nada é salvo.
2. **Contas:** Django + DRF, links curtos editáveis (`/r/<slug>`) e contagem de cliques.
3. **Equipe:** loja com vários atendentes, um link por atendente e painel do gerente.

Não antecipar as etapas 2 e 3 no código do MVP (nada de camada de API "para depois").

## Stack (MVP)

- React + TypeScript (strict) + Vite, nas versões estáveis atuais.
- Node 24 (`.nvmrc`, criado junto com o scaffold).
- Vitest + Testing Library; ESLint + Prettier.
- Uma única dependência de produção além do React: `qrcode` (gera SVG e PNG).
- CI e deploy: GitHub Actions → GitHub Pages.

## Comandos

- Dev: `npm run dev` (http://localhost:5173/whatsapp-link-generator/)
- Testes: `npm test` (uma vez: `npm test -- --run`)
- Lint/format: `npm run lint`, `npm run format`
- Build: `npm run build` (o `base` do Vite é `/whatsapp-link-generator/`, por causa do GitHub Pages)
- Formatação no CI: `npm run format:check`

## Convenções

- Interface em pt-BR; código, nomes e branches em inglês.
- A montagem do link (`wa.me/<número>?text=<mensagem codificada>`) e a validação do número ficam em
  funções puras, separadas dos componentes, com testes unitários próprios.
- Testes de componente testam o que o usuário vê e faz, não detalhes de implementação.
- Número de telefone: formato brasileiro, normalizado para só dígitos com DDI 55.
- Privacidade: nenhum analytics, cookie ou envio de dados para terceiros no MVP.
- Demo, testes e screenshots só com dados fictícios (números do tipo `11 90000-0000`).

## Hospedagem

- **MVP:** GitHub Pages, publicado por workflow do GitHub Actions. Limites (conferidos em 2026-11-26):
  site de até 1 GB, banda flexível de 100 GB/mês, deploy expira em 10 min. Sem custo nem créditos.
- **Não usar o Netlify** neste projeto: os 300 créditos do plano Free são divididos com o site do
  portfólio, e acabar com eles tira todos os sites do ar.
- **Etapa 2 (planejado):** Koyeb (instância Free em Washington) + Neon Postgres (AWS us-east), com o
  Django servindo o build do React no mesmo domínio. Medir o cold start antes de construir (ADR 0001).
- Preços e limites mudam: conferir as páginas oficiais antes de citar números.

## Git

- Commits, títulos e descrições de PR em **português** (Conventional Commits: `feat: adiciona ...`).
- Branches em inglês (`feat/<nome>`, `fix/<nome>`, `chore/<nome>`); nunca direto na `main`.
- Sem linhas de coautoria do Claude em commits e PRs.

## Docs

- `docs/adr/`: decisões; criar um ADR novo para cada decisão relevante.
- README no padrão da skill `/readme`; atualizar ao concluir uma etapa.
