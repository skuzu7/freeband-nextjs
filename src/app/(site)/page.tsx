// "/" — the home in five blocks.
import { Fold } from '@/components/home/Fold';
import { Caminhao } from '@/components/home/Caminhao';
import { Blocos } from '@/components/home/Blocos';
import { Prova } from '@/components/home/Prova';
import { Data } from '@/components/home/Data';

export default function Home() {
  return (
    <>
      <Fold />
      <Caminhao />
      <Blocos />
      <Prova />
      <Data />
    </>
  );
}
