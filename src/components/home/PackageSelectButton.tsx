'use client';

// src/components/home/PackageSelectButton.tsx
// Connects a commercial package card in Caminhao directly to the 3-step
// BriefingBuilder in #contato, pre-selecting the corresponding stage structure.
import { useBriefingStore } from '@/stores/useBriefingStore';
import { Button } from '@/components/ui/Button';

interface PackageSelectButtonProps {
  packageId: string;
  highlighted?: boolean;
  label?: string;
}

export function PackageSelectButton({
  packageId,
  highlighted = false,
  label = 'Selecionar no briefing',
}: PackageSelectButtonProps) {
  const selectPackageFromCatalog = useBriefingStore((state) => state.selectPackageFromCatalog);

  const handleSelect = () => {
    selectPackageFromCatalog(packageId);
    const target = document.getElementById('contato');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Button
      variant={highlighted ? 'primary' : 'secondary'}
      onClick={handleSelect}
      className="w-full sm:w-auto"
    >
      {label}
    </Button>
  );
}
