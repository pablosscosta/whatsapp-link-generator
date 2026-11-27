# Vídeo de demonstração

Grava o app de verdade com o Playwright e dados fictícios: o número `(11) 90000-0000` e uma mensagem
inventada. Como tudo acontece no navegador, não há API para simular.

## O que a gravação mostra

Duas telas gravadas ao mesmo tempo, com os mesmos passos:

- **Desktop** (960×812): formulário e resultado lado a lado.
- **Celular** (375×812): o resultado aparece abaixo do formulário, e a página rola até ele.

Nas duas: digita o número e a mensagem, gera o link, mostra o resumo e o QR code e copia o link, com
a confirmação "Copiado!". O botão "Compartilhar" não aparece, porque o Chromium da gravação não tem a
Web Share API, e o app esconde o botão onde ela não existe.

## Como funciona

- O script sobe o Vite na porta 5190, para não brigar com um `npm run dev` que já esteja rodando.
- A permissão da área de transferência é liberada no navegador da gravação, para o "Copiar link" usar
  a cópia real.
- Tema escuro (`prefers-color-scheme: dark`) e idioma pt-BR.

## Regravar

Requisitos: Node 24, as dependências do app instaladas (`npm install` na raiz) e o `ffmpeg` no PATH.

```bash
cd docs/demo
npm install
npx playwright install chromium   # só na primeira vez (cerca de 170 MB)
npm run record
```

Saída em `docs/assets/`:

| Arquivo                                | Uso                                                         |
| -------------------------------------- | ----------------------------------------------------------- |
| `demo.mp4`, `demo.jpg`                 | as duas telas lado a lado (1358×812), para embutir em sites |
| `demo-desktop.mp4`, `demo-desktop.jpg` | vídeo e poster da tela do desktop                           |
| `demo-celular.mp4`, `demo-celular.jpg` | vídeo e poster da tela do celular                           |
| `demo.gif`                             | as duas telas lado a lado, para o README                    |

O Playwright fica só aqui, com `package.json` próprio: não entra nas dependências do app nem no CI.
