// "/portfolio" — editorial overview of the official 7-page portfolio PDF,
// featuring a visual stage preview, structured contents summary, direct PDF
// download, and fast path to the 30s Briefing.
import type { Metadata } from 'next';
import { bandInfo, bandLineup } from '@/data/band';
import { portfolio } from '@/data/copy/portfolio';
import { images } from '@/data/media/paths';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Photo } from '@/components/media/Photo';
import { PageHeader } from '@/components/site/PageHeader';
import { PortfolioDownload } from '@/components/pdf/portfolio/PortfolioDownload';
import { socialMetadata } from '@/lib/seo/metadata';
import { breadcrumbs } from '@/lib/seo/jsonld';
import { site } from '@/data/copy/site';
import { JsonLd } from '@/components/site/JsonLd';
import { RouteTransition } from '@/components/site/RouteTransition';

export const metadata: Metadata = {
  title: portfolio.seo.title,
  description: portfolio.seo.description,
  alternates: { canonical: '/portfolio' },
  ...socialMetadata({ ...portfolio.seo, path: '/portfolio' }),
};

const trail = breadcrumbs([
  { name: site.nav.homeLink, path: '/' },
  { name: portfolio.seo.title, path: '/portfolio' },
]);

const PORTFOLIO_CHAPTERS = [
  { num: '01', title: 'Capa & Identidade', note: `Apresentação oficial da ${bandInfo.name} · desde ${bandInfo.founded}` },
  { num: '02', title: `Formação ao Vivo (${bandLineup.total} integrantes)`, note: 'Músicos, cantores, bailarinos e valores de palco' },
  { num: '03', title: 'Linha do Tempo', note: 'Mais de cinco décadas de estrada a partir de Jaú/SP' },
  { num: '04', title: 'Palcos & Parceiros', note: 'Artistas consagrados, clubes tradicionais e prefeituras' },
  { num: '05', title: 'Galeria de Atos & Blocos', note: 'Fotografias reais de espetáculos, figurinos e pista' },
  { num: '06', title: 'Estrutura Própria & Pacotes', note: 'Pacote Premium, Pacote Classic, som, luz, LED e DJ' },
  { num: '07', title: 'Logística & Contato Direto', note: 'Dados fiscais, WhatsApp da produção e envio de proposta' },
] as const;

export default function PortfolioPage() {
  return (
    <RouteTransition>
      <JsonLd data={trail} />
      <PageHeader id="portfolio-title" label={portfolio.label} headline={portfolio.headline} lead={portfolio.lead}>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <PortfolioDownload />
          <Button variant="secondary" size="lg" href="/#contato" className="w-full sm:w-auto">
            Montar briefing em 30s
          </Button>
        </div>
      </PageHeader>

      <Container className="pb-[var(--section-gap)]">
        <div className="grid gap-10 border-t border-line pt-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex items-baseline justify-between gap-3">
              <Label>O que vai no material</Label>
              <span className="text-xs tabular-nums text-ink-low">7 páginas · Formato A4</span>
            </div>
            <ol className="divide-y divide-line border-y border-line">
              {PORTFOLIO_CHAPTERS.map((chapter) => (
                <li key={chapter.num} className="grid grid-cols-[2.25rem_1fr] gap-3 py-3.5">
                  <span className="label-caps pt-0.5 tabular-nums text-led-text">{chapter.num}</span>
                  <div>
                    <p className="text-sm font-semibold text-ink sm:text-base">{chapter.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-muted sm:text-sm">{chapter.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <figure className="m-0 flex flex-col border border-line bg-surface-raise/80">
            <Photo
              photo={{
                src: images.nauticoPalcoLuzes,
                alt: 'Palco completo da Internacional Freeband iluminado com painel de LED durante baile no Clube Náutico',
                aspect: '1600/1067',
              }}
              sizes="(min-width: 1024px) 42vw, 100vw"
              preload
              quality={90}
            />
            <figcaption className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 text-xs text-ink-muted">
              <span>Material pronto para diretoria, comissões e prefeituras</span>
              <span className="shrink-0 tabular-nums text-ink-low">PDF</span>
            </figcaption>
          </figure>
        </div>
      </Container>
    </RouteTransition>
  );
}
