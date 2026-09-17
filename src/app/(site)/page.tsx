// "/" — the home in five blocks.
import { yearsActive } from '@/data/band';
import { Fold } from '@/components/home/Fold';
import { Caminhao } from '@/components/home/Caminhao';
import { Blocos } from '@/components/home/Blocos';
import { Prova } from '@/components/home/Prova';
import { Data } from '@/components/home/Data';
import { LegacyAnchors } from '@/components/site/LegacyAnchors';

export default function Home() {
  return (
    <>
      <LegacyAnchors />
      <Fold yearsActive={yearsActive()} />
      <Caminhao />
      <Blocos />
      <Prova />
      <Data />
    </>
  );
}
