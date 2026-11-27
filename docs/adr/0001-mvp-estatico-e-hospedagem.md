# 0001 — MVP estático no GitHub Pages, com backend só quando houver necessidade

- **Status:** aceito
- **Data:** 2026-11-26

## Contexto

O problema real: uma loja usa um único WhatsApp para toda a equipe. O cliente que chega pela divulgação
de um atendente não tem como indicar com quem quer falar, e o atendente pode perder a comissão.

O WhatsApp já oferece o link `wa.me/<número>?text=<mensagem>`, que abre a conversa com o texto
preenchido. Gerar esse link e um QR code não exige servidor. Contar cliques, editar a mensagem sem trocar
o QR e ter contas e equipes exigem.

O link vai ser usado de verdade, e quem escaneia o QR não pode esperar o servidor acordar. Os planos
gratuitos foram comparados em 2026-11-26, nas páginas oficiais:

| Opção              | O que pesou                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------- |
| Render             | Dorme após 15 min e leva cerca de 1 min para acordar; Postgres gratuito expira em 30 dias |
| Fly.io             | Sempre ligado dentro de US$ 5/mês, mas exige cartão e cobra o excedente                   |
| Koyeb              | 1 instância gratuita sem cartão; dorme após 1 h e acorda em 1 a 5 s (número da doc geral) |
| Railway            | US$ 1/mês e sem domínio próprio no plano gratuito                                         |
| Vercel             | Não roda Django/Rails como servidor; termos de uso comercial não confirmados              |
| Netlify            | Créditos divididos com o site do portfólio; se acabarem, todos os sites saem do ar        |
| Cloudflare Workers | Sem cold start, mas obriga o backend em JS/TS                                             |
| Neon               | Postgres gratuito permanente, 1 GB, volta do repouso em centenas de ms                    |
| Supabase           | Projeto gratuito pausa após 1 semana sem uso                                              |
| GitHub Pages       | Estático, sem cold start, sem custo; não serve para hospedar um negócio online            |

## Decisão

- **MVP sem backend:** React + TypeScript + Vite, publicado no **GitHub Pages** pelo GitHub Actions. O
  link e o QR code são gerados no navegador e nada é salvo.
- **Backend só na etapa de contas**, quando contar cliques virar necessidade: Django + DRF no **Koyeb**
  (Washington) com **Neon** Postgres na AWS us-east, para ficar perto da aplicação. O Django passa a
  servir o build do React no mesmo domínio, com autenticação por sessão e CSRF.
- Antes de construir a etapa de contas, publicar um Django mínimo no Koyeb e medir o tempo para acordar
  após 1 h parado. Se for inaceitável, revisar este ADR.

## Consequências

- O MVP vai ao ar sem custo, sem cartão e sem cold start, e sem superfície para abuso, porque não guarda
  dados.
- A loja pode usar o MVP imediatamente.
- Os QR codes do MVP apontam direto para o `wa.me`: continuam funcionando depois, mas não contam
  cliques. Na etapa de contas, é preciso divulgar QR codes novos, apontando para o link curto.
- A migração muda a hospedagem (Pages → Koyeb) e a forma de servir o frontend. Isso é aceito para não
  manter infraestrutura antes de ela ser necessária.
- Django em vez de Rails na etapa 2: sobe mais rápido e usa menos memória na instância de 0,1 vCPU, o
  que reduz o cold start, e diversifica o portfólio (o Jukebox Hub já usa Rails).
- Descartados: começar com backend (custo e cold start sem necessidade comprovada), página estática com
  analytics de terceiros para contar cliques (a mensagem continua fixa e os dados ficam fora do
  produto) e Netlify (créditos divididos com o portfólio).
