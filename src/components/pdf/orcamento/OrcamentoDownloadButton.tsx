'use client';

// src/components/pdf/orcamento/OrcamentoDownloadButton.tsx
// Placeholder until phase 6 wires @react-pdf/renderer in. Same path, same
// named export and props, so the dynamic import in Preview does not change
// when the real button lands.
import { orcamento } from '@/data/copy/orcamento';
import type { OrcamentoData } from '@/types/orcamento';
import { Button } from '@/components/ui/Button';

interface OrcamentoDownloadButtonProps {
  data: OrcamentoData;
}

export function OrcamentoDownloadButton({ data }: OrcamentoDownloadButtonProps) {
  return (
    <Button disabled title={orcamento.preview.fileName(data.contratante)}>
      {orcamento.preview.download}
    </Button>
  );
}
