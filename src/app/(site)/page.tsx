// "/" — the home in five blocks.
import type { Metadata } from 'next';
import { bandInfo } from '@/data/band';
import { Fold } from '@/components/home/Fold';
import { Caminhao } from '@/components/home/Caminhao';
import { Blocos } from '@/components/home/Blocos';
import { Prova } from '@/components/home/Prova';
import { Data } from '@/components/home/Data';
import { LegacyAnchors } from '@/components/site/LegacyAnchors';
import { RouteTransition } from '@/components/site/RouteTransition';
import { homeSocialMetadata } from '@/lib/seo/metadata';

// Title and description come from the root layout. The card is restated here
// with the home's own address: the layout's copy carries no URL, because
// every route that sets no card of its own inherits it.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
  ...homeSocialMetadata('/'),
};

export default function Home() {
  return (
    <RouteTransition>
      <LegacyAnchors />
      <Fold yearsActive={bandInfo.yearsActive} />
      <Caminhao />
      <Blocos />
      <Prova />
      <Data />
    </RouteTransition>
  );
}
