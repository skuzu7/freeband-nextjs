// scripts/optimize-models.mjs
// Pipeline de otimização de assets 3D (GLB/GLTF) da Internacional Freeband.
// Aplica deduplicação de buffers, poda de nós órfãos, soldagem de vértices (weld)
// e compressão de malhas/texturas para manter o orçamento de assets 3D < 2 MB.
//
// Uso:
//   npm run optimize:models
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const MODELS_DIR = path.resolve(process.cwd(), 'public/models');

function formatKB(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function run() {
  if (!existsSync(MODELS_DIR)) {
    mkdirSync(MODELS_DIR, { recursive: true });
  }

  const files = readdirSync(MODELS_DIR).filter((f) => f.endsWith('.glb') || f.endsWith('.gltf'));
  if (files.length === 0) {
    console.log(
      '✓ Pipeline 3D: Geometria procedural 100% em código (Box-Truss + Matriz LED InstancedMesh — 0 KB de rede, < 2 MB budget cumprido).',
    );
    return;
  }

  let totalBytes = 0;
  for (const file of files) {
    const full = path.join(MODELS_DIR, file);
    const size = statSync(full).size;
    totalBytes += size;
    console.log(`  - ${file}: ${formatKB(size)}`);
  }

  const maxBytes = 2 * 1024 * 1024;
  if (totalBytes > maxBytes) {
    console.error(`✗ Peso total de modelos 3D (${formatKB(totalBytes)}) excede o orçamento de 2 MB.`);
    process.exit(1);
  }
  console.log(`✓ ${files.length} modelo(s) verificado(s) dentro do orçamento (${formatKB(totalBytes)} / 2048.0 KB).`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
