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

Scripts:

- `npm run dev` — servidor local
- `npm run build` / `npm start` — build e runtime de produção
- `npm run lint` — ESLint sem warnings
- `npm run typecheck` — TypeScript
- `npm test` — Vitest
- `npm run optimize:images` — recomprime JPEGs grandes em `public/images`

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
- **Proteção de Sessão Criptográfica:** HMAC-SHA256 e comparação em tempo constante (`crypto.timingSafeEqual`) validados por testes unitários automatizados em `src/lib/__tests__/session.test.ts`.
