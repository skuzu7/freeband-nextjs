# Internacional Freeband

[![CI & Security Checks](https://github.com/skuzu7/freeband-nextjs/actions/workflows/ci.yml/badge.svg)](https://github.com/skuzu7/freeband-nextjs/actions/workflows/ci.yml)
[![Security Policy](https://img.shields.io/badge/Security-Policy_Active-blue.svg)](SECURITY.md)
[![Threat Model](https://img.shields.io/badge/Threat_Model-STRIDE_Documented-success.svg)](docs/THREAT_MODEL.md)

Site institucional e gerador interno de propostas da [Internacional Freeband](https://freeband.com.br) (Jaú/Trabiju, desde 1969).

- Landing pública em `/`
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
- `npm run typecheck` — TypeScript
- `npm test` / `npm run test:watch` — Vitest
- `npm run tokens` — **obrigatório** depois de editar `src/design/tokens.ts`; regenera `src/app/tokens.css` (um teste falha se estiver desatualizado)
- `npm run blur` — **obrigatório** depois de adicionar ou reencodar qualquer imagem; regenera `src/data/blur.ts` (um teste falha sem a entrada)
- `npm run optimize:images` — recomprime JPEGs grandes em `public/images` (e pede o `npm run blur` em seguida)
- `npm run smoke` — Puppeteer em todas as rotas, a 1440 e 390: falha em erro de console, overflow horizontal ou foto cortada; precisa de um servidor no ar (`BASE_URL`, `ORCAMENTO_TOKEN`)
- `npm run smoke:motion` — o mesmo com `prefers-reduced-motion: reduce`: nada pode se mover

O CI (`.github/workflows/ci.yml`) roda auditoria de dependências, testes, lint, typecheck, build e os dois smokes em cada PR e push na `main`.

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
