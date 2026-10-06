# Internacional Freeband

[![CI & Security Checks](https://github.com/skuzu7/freeband-nextjs/actions/workflows/ci.yml/badge.svg)](https://github.com/skuzu7/freeband-nextjs/actions/workflows/ci.yml)
[![Security Policy](https://img.shields.io/badge/Security-Policy_Active-blue.svg)](SECURITY.md)
[![Threat Model](https://img.shields.io/badge/Threat_Model-STRIDE_Documented-success.svg)](docs/THREAT_MODEL.md)

Site institucional e gerador interno de propostas da [Internacional Freeband](https://freeband.com.br) (Jaú/Trabiju, desde 1969).

- Site público: `/`, `/palco`, `/arquivo`, `/historia`
- Cada fotografia tem endereço próprio (`/palco/foto/<id>`, `/arquivo/cartaz/<id>`, `/historia/foto/<id>`); dentro do site ela abre num visor sobre a página
- Portfólio em PDF em `/portfolio`
- Login de produção em `/admin`
- Gerador de orçamento em `/orcamento` (protegido por sessão)

## Desenvolvimento

```bash
npm install
cp .env.example .env.local
npm run dev
```

Requer Node 22.18 ou mais novo (o gerador de tokens importa TypeScript nativamente).

Scripts:

- `npm run dev` — servidor local
- `npm run build` / `npm start` — build e runtime de produção
- `npm run lint` — ESLint sem warnings
- `npm run typecheck` — TypeScript; depois de criar ou remover uma rota, `npx next typegen` atualiza os tipos gerados
- `npm test` / `npm run test:watch` — Vitest
- `npm run tokens` — **obrigatório** depois de editar `src/design/tokens.ts`; regenera `src/styles/tokens.css` (um teste falha se estiver desatualizado)
- `npm run blur` — **obrigatório** depois de adicionar ou reencodar qualquer imagem ou pôster de vídeo; regenera `src/data/blur.ts` (um teste falha sem a entrada)
- `npm run optimize:images` — recomprime JPEGs grandes em `public/images` (e pede o `npm run blur` em seguida)
- `npm run smoke` — Puppeteer em todas as rotas, a 1440 e 390, contra `next start`: status, console, overflow, foto cortada, alvos de toque, página sem JavaScript, axe-core, visor de fotos, player, cartões de compartilhamento, rota protegida e PDF; precisa de um servidor no ar (`BASE_URL`, `ORCAMENTO_TOKEN`)
- `npm run smoke:motion` — o mesmo com `prefers-reduced-motion: reduce`: nada pode se mover, nenhum vídeo toca, a parede WebGL fica desligada
- `npm run perf` — orçamento de performance contra `next start` com a CPU 4× mais lenta: JS por rota, LCP, CLS, tarefas longas, canvases e mídia pedida sem interação (`PERF_TIMING=report` só relata os tempos)
- `npm run social -- <campanha>` (ou `--todas`) — renderiza os cartões de `scripts/social/campanhas/<campanha>.json`
- `node scripts/video/analyze.mjs` / `node scripts/video/encode.mjs` — análise dos masters e codificação dos clipes com som (os cortes ficam em `scripts/video/clips.mjs`)
- `node scripts/import-archive.mjs` — traz as fotos de papel do álbum da banda para `public/images`

Os três últimos leem e escrevem fora do repositório (masters, fotos recebidas e saídas ficam na pasta de trabalho que contém este projeto); sem ela, só o site, os testes e os smokes rodam.

O CI (`.github/workflows/ci.yml`) roda auditoria de dependências, testes, lint, typecheck, build, os dois smokes e o orçamento de performance em cada PR e push na `main`.

O guia de engenharia (rotas, tokens, parede de LED, regra das placas, vídeo, PDFs) é o [`CLAUDE.md`](CLAUDE.md).

## Variáveis de ambiente

Ver `.env.example`. As três são obrigatórias na área protegida:

- `ORCAMENTO_TOKEN` — token legado `/orcamento/<token>`, trocado por cookie
- `ADMIN_PASSWORD` — senha do `/admin`
- `SESSION_SECRET` — chave HMAC do cookie `freeband_admin`

## Deploy

O repositório publica automaticamente no Vercel a partir de `main`.

URL atual: https://freeband-nextjs.vercel.app

No painel do Vercel, as três variáveis acima precisam existir no ambiente de produção.

## Segurança e Engenharia Defensiva

- **Revisão de Segurança Documentada:** Veja [`SECURITY_REVIEW.md`](SECURITY_REVIEW.md) para a análise detalhada de autenticação e mitigação de vulnerabilidades lógicas.
- **Modelagem de Ameaças (STRIDE):** Consulte [`docs/THREAT_MODEL.md`](docs/THREAT_MODEL.md) para a matriz de riscos e defesas arquiteturais.
- **Proteção de Sessão Criptográfica:** cookie `__Host-freeband_admin` assinado com HMAC-SHA256 via Web Crypto (o mesmo código roda no proxy Edge e nas server actions), comparação em tempo constante sobre digests de tamanho fixo, limite de tentativas no login e no link legado, e a página `/orcamento` conferindo a sessão além do proxy — tudo coberto por `src/lib/__tests__/session.test.ts`, `proxy.test.ts` e `rateLimit.test.ts`.
- **Laboratório de Pesquisa Defensiva:** os padrões acima (HMAC, validação server-side, testes de regressão) são estudados de forma isolada no [CSA-LAB](https://github.com/skuzu7/CSA-LAB) — 5 findings documentados com patches e suítes verdes, incluindo falsificação de sessão (FINDING-004) e falha de lógica de negócio (FINDING-005).
