// "/" — the home in five blocks.
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
      <Fold />
      <Caminhao />
      <Blocos />
      <Prova />
      <Data />
    </>
  );
}
