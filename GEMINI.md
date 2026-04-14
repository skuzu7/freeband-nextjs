@AGENTS.md

# Stack — leia antes de escrever qualquer codigo

| Dependencia         | Versao | Nota                                                           |
| ------------------- | ------ | -------------------------------------------------------------- |
| Next.js             | 16.2.3 | APIs mudaram drasticamente. NAO use conhecimento de Next 14/15 |
| React               | 19.2.4 | Server Components por padrao. `use()` hook, nova API de forms  |
| Tailwind CSS        | 4.x    | Config via CSS (`@theme`), nao mais `tailwind.config.js`       |
| @react-pdf/renderer | 4.x    | Componentes PDF customizados em `src/components/pdf/`          |

## Regra critica: Next.js 16

**Voce NAO conhece esta versao.** Antes de escrever qualquer codigo Next.js:

1. Leia os docs em `node_modules/next/dist/docs/` — esta e a unica fonte de verdade
2. Para routing/pages: `node_modules/next/dist/docs/01-app/`
3. Para API reference: `node_modules/next/dist/docs/01-app/03-api-reference/`
4. NAO assuma que APIs de versoes anteriores ainda existem

## Estrutura do projeto

```
src/
  app/                          # App Router (Next.js 16)
    layout.tsx                  # Root layout
    page.tsx                    # Home page
    portfolio/page.tsx          # Portfolio page
    orcamento/[token]/page.tsx  # Orcamento dinamico
  components/
    layout/                     # NavBar, Footer
    sections/                   # Hero, Ato I-V (secoes da pagina)
    ui/                         # Componentes reutilizaveis
    orcamento/                  # Formulario e preview de orcamento
    pdf/                        # Geracao de PDF (portfolio + orcamento)
```

## Tailwind v4

- Configuracao via CSS, NAO via `tailwind.config.js`
- Usar `@theme` e `@layer` no CSS
- Classes utilitarias podem ter mudado — verificar antes de usar

## Padrao de componentes

- Componentes React funcionais com TypeScript
- Server Components por padrao (sem "use client" a menos que necessario)
- Client Components marcados com `"use client"` no topo do arquivo

## Idioma

- Responder em portugues (PT-BR)
- Codigo (variaveis, funcoes, componentes) em ingles
- Conteudo visivel ao usuario em portugues
