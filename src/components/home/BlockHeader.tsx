// src/components/home/BlockHeader.tsx
// The heading every home block opens with: a dotted label, the headline
// resolving out of the LED matrix, and the lead paragraph under it. Shared by
// Caminhao, Blocos and Prova so the three stay the same markup.
import { LedText } from '@/components/brand/LedText';
import { Label } from '@/components/ui/Label';

type Props = {
  id: string;
  label: string;
  headline: string;
  lead: string;
};

export function BlockHeader({ id, label, headline, lead }: Props) {
  return (
    <header className="max-w-[60ch]">
      <Label dot>{label}</Label>
      <div className="mt-4">
        <LedText id={id} text={headline} className="text-4xl font-semibold tracking-display text-ink" />
      </div>
      <p className="rise mt-5 text-lg text-ink-muted">{lead}</p>
    </header>
  );
}
