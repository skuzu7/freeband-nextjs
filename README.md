# Internacional Freeband

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
