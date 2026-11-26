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
- `npm run optimize:models` — valida e audita modelos 3D (`.glb`/`.gltf` em `public/models`) contra o orçamento de `< 2 MB`
- `npm run smoke` — Puppeteer em todas as rotas, a 1440 e 390, contra `next start`: status, console, overflow, foto cortada, alvos de toque, página sem JavaScript, axe-core, visor de fotos, player, cartões de compartilhamento, rota protegida e PDF; precisa de um servidor no ar (`BASE_URL`, `ORCAMENTO_TOKEN`)
- `npm run smoke:motion` — o mesmo com `prefers-reduced-motion: reduce`: nada pode se mover, nenhum vídeo toca, a parede WebGL fica desligada
- `npm run perf` — orçamento de performance contra `next start` com a CPU 4× mais lenta: JS por rota, LCP, CLS, tarefas longas, canvases e mídia pedida sem interação (`PERF_TIMING=report` só relata os tempos)
- `npm run social -- <campanha>` (ou `--todas`) — renderiza os cartões de `scripts/social/campanhas/<campanha>.json`
- `node scripts/video/analyze.mjs` / `node scripts/video/encode.mjs` — análise dos masters e codificação dos clipes com som (os cortes ficam em `scripts/video/clips.mjs`)
- `node scripts/import-archive.mjs` — traz as fotos de papel do álbum da banda para `public/images`

Os três últimos leem e escrevem fora do repositório (masters, fotos recebidas e saídas ficam na pasta de trabalho que contém este projeto); sem ela, só o site, os testes e os smokes rodam.

O CI (`.github/workflows/ci.yml`) roda auditoria de dependências, testes, lint, typecheck, build, os dois smokes e o orçamento de performance em cada PR e push na `main`.

O guia de engenharia (rotas, tokens, parede de LED, regra das placas, vídeo, PDFs) é o [`CLAUDE.md`](CLAUDE.md).

## Arquitetura do Palco 3D, Shaders TSL/WebGL2 e Coreografia de Scroll

- **Estado Global (`src/stores/useStageStore.ts`)**: Store Zustand compartilhando progresso de scroll (`scrollProgress`), ato narrativo (`01-hero` a `05-contato`), época cromática ativa (`default`, `anos-50`, `anos-70`, `country`, `cabare`), tier de GPU (`1 | 2 | 3`) e nível de áudio RMS (`audioLevel`).
- **Shaders TSL & WebGL2 (`src/shaders/ledStageTSL.ts` & `src/lib/led/wall.ts`)**:
  - `src/shaders/ledStageTSL.ts` define as paletas por época (`ERA_STAGE_PALETTES`) e o material nodal `createLedStageTSLMaterial()` em **TSL (`three/tsl` + `three/webgpu`)** que compila para WGSL e GLSL.
  - `src/lib/led/wall.ts` executa o pipeline WebGL2 de alta velocidade para o pórtico côncavo de diodos LED 3D (`stageProject`), normais hemisféricas com especular *Blinn-Phong*, luz de borda *Fresnel* em vermelho acrílico (`#ee3524`) e 3 feixes volumétricos superiores.
- **Grafo de Cena 3D (`src/components/canvas/StageScene3D.ts`)**:
  - Monta o pórtico metálico **Box-Truss PBR** (com `RoomEnvironment`) e a matriz de módulos LED via `THREE.InstancedMesh`.
  - **Como ajustar a curva de câmera**: Edite os pontos de controle de `CAMERA_POSITION_SPLINE` e `CAMERA_TARGET_SPLINE` (`THREE.CatmullRomCurve3`) em `src/components/canvas/StageScene3D.ts`.
  - **Como ajustar parâmetros dos shaders e paletas**: Edite `ERA_STAGE_PALETTES` em `src/shaders/ledStageTSL.ts` ou os estados de scroll (`stageStateForScroll`) em `src/lib/led/wall.ts`.
  - **Como substituir/adicionar modelos 3D (`.glb`)**: Coloque arquivos `.glb` otimizados (compressão Meshopt/Draco e texturas KTX2) em `public/models/` e execute `npm run optimize:models` para validar o orçamento de `< 2 MB`.
- **Scroll Suave & Coreografia (`src/lib/animations/stageChoreography.ts`)**: Carregado sob demanda na primeira interação do usuário (`wheel`/`pointermove`/`touchstart`) para manter o bundle JS inicial abaixo de `680 KB` brutos (`< 200 KB` gzip), sincronizando **Lenis** + **GSAP ScrollTrigger** + **CustomEase** e microinterações magnéticas (`[data-magnetic]`).
- **Som Ambiente Opcional (`src/lib/audio/stageAmbience.ts`)**: Sintetizador procedural Web Audio API (desligado por padrão, acionado pelo botão `Som Ambiente` no console do Hero).

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
- **Laboratório de Pesquisa Defensiva:** os padrões acima (HMAC, validação server-side, testes de regressão) são estudados de forma isolada no [CSA-LAB](https://github.com/skuzu7/CSA-LAB) — 6 casos locais intencionalmente vulneráveis, com patches e testes de regressão documentados, incluindo falsificação de sessão (FINDING-004) e falha de lógica de negócio (FINDING-005).
