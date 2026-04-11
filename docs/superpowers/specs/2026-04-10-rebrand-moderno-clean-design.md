# Design Spec: Moderno & Clean Rebrand (Internacional Freeband)

## 1. Visão Geral e Objetivo
O objetivo deste redesign é transformar a identidade visual do site da Internacional Freeband de um visual escuro, pesado e com contrastes ruins (ex: textos dourados ilegíveis sobre fundos dourados) para um estilo "Moderno & Clean".
A nova estética focará em minimalismo contemporâneo: fundos claros (`#FAFAFA` ou similares), melhoria drástica de legibilidade utilizando tons de cinza chumbo para textos e a remoção completa de tipografias com serifa (Playfair), migrando para a família Inter (sans-serif) para um ar "Ultra Moderno".

## 2. Direção Visual Escolhida
*   **Hero Section:** **Tela Cheia "Frosted Glass"**. O vídeo continuará em `cover` total, porém a camada sobreposta (`overlay`) será clara (vidro fosco/translúcido ou gradiente claro) e não preta. Textos e elementos do hero serão em cinza chumbo (`slate-900`) muito nítido.
*   **Navegação (NavBar):** **Oculta no Início, Branca ao Rolar**. A barra de navegação principal (menu) ficará oculta ou totalmente transparente quando o usuário estiver no topo (Hero), valorizando o impacto visual inicial, e deslizará para a tela com fundo branco ou `backdrop-blur` ao fazer scroll.
*   **Tipografia e Botões:** **Ultra Moderno (Sem Serifas)**. Todos os textos usarão a família sem serifa (Inter). Os botões (ex: "Agendar Show") deixarão de ser retângulos rígidos com alto contraste dourado e passarão a ser contemporâneos (arredondados, suaves, cores ou bordas discretas, ou com preenchimento forte chumbo/preto com texto claro para as chamadas à ação). O dourado (#C9A84C) será usado de forma minimalista apenas em detalhes cruciais ou hovers sutis.

## 3. Alterações de Código (Escopo)
*   **`src/app/globals.css`**: Alteração drástica da paleta de cores. Remoção de `--color-bg: #0a0a0a`. Implementação de `--color-bg-light: #FAFAFA`, `--color-text-main: #0f172a` (slate-900), etc.
*   **`src/app/layout.tsx`**: Remoção da fonte Playfair e substituição total pela fonte Inter para `font-display` e `font-sans`.
*   **`src/components/layout/NavBar.tsx`**: Alteração do estado de scroll para inicializar transparente/oculta e transicionar para fundo branco, texto chumbo.
*   **`src/components/sections/Hero.tsx`**: Alteração do `overlay` sobre o vídeo de preto translúcido para branco/vidro fosco. Atualização das classes Tailwind de tipografia e botões de chamada à ação.
*   **Outras seções (Galeria, Sobre, História, Artistas, Serviços, Parceiros, Contato)**: Reestilização de cores de fundo, cor de texto e padronização da tipografia sem-serifa. Eliminação dos containers escuros pesados.

## 4. Sucesso da Implementação
O site não deve mais apresentar "bugs" ou problemas de contraste (como o botão ilegível na versão anterior). A responsividade deve ser impecável em todos os dispositivos, e a sensação gerada ao abrir o site deve ser clara, premium, moderna e limpa.

---
**Status:** Aprovado pelo usuário para implementação.
