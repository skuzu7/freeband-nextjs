import Image from "next/image";
import { release, bandInfo } from "@/data/content";
import { images } from "@/data/images";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Sobre() {
  const paragraphs = release.full.split("\n\n");
  const years = bandInfo.yearsActive;

  return (
    <Section id="sobre" variant="ink" className="overflow-hidden">
      <Container>
        <div className="grid gap-16 lg:grid-cols-[auto_minmax(0,1fr)]">
          {/* Oversized number, bleeds left */}
          <div className="reveal relative -ml-[clamp(1rem,6vw,4rem)] flex items-start">
            <span
              aria-hidden
              className="block font-display font-semibold leading-[0.75] -tracking-[0.06em] text-brand"
              style={{ fontSize: "clamp(10rem, 22vi, 22rem)" }}
            >
              {years}
            </span>
            <span
              className="ml-4 mt-6 font-mono text-[0.72rem] uppercase tracking-[0.3em] text-text-muted"
              style={{ writingMode: "vertical-rl" }}
            >
              anos no palco
            </span>
          </div>

          <div className="reveal flex flex-col gap-10" style={{ ["--i" as string]: 1 }}>
            <Eyebrow number="01">Manifesto</Eyebrow>
            <h2
              className="font-display -tracking-[0.02em] text-balance"
              style={{ fontSize: "var(--text-5xl)", lineHeight: 0.94 }}
            >
              Desde{" "}
              <span className="serif-italic text-brand">1969</span>, a gente
              faz o palco <span className="serif-italic">vibrar</span>.
            </h2>

            <div
              className="flex flex-col gap-6 text-text-muted"
              style={{ fontSize: "var(--text-base)", lineHeight: 1.7 }}
            >
              {paragraphs.map((para, i) => (
                <p key={i} className="text-pretty max-w-[58ch]">
                  {para}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-4">
              {release.values.map((v) => (
                <span
                  key={v}
                  className="inline-flex items-center gap-2 border border-border-strong px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.3em] text-text"
                >
                  <span aria-hidden className="inline-block h-1 w-1 rotate-45 bg-brand" />
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Photo + stats */}
        <div className="mt-[clamp(4rem,8vi,7rem)] grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div className="reveal relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src={images.anos70}
              alt="A banda Internacional Freeband no início dos anos 70"
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              quality={90}
              className="object-cover saturate-[0.5] contrast-[1.05] transition-[filter,transform] duration-[1200ms] ease-[var(--ease-stage)] hover:saturate-100 hover:scale-[1.02]"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-border" />
            <div className="absolute bottom-4 left-4 bg-bg/80 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-text backdrop-blur">
              Arquivo — Jaú/SP · 1970s
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-x-8 gap-y-10">
            {release.highlights.map((h, i) => (
              <li
                key={h.label}
                className="reveal flex flex-col gap-2 border-t border-border pt-6"
                style={{ ["--i" as string]: i }}
              >
                <span
                  className="font-display font-semibold -tracking-[0.03em] text-text"
                  style={{ fontSize: "var(--text-4xl)", lineHeight: 0.9 }}
                >
                  {h.value}
                </span>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-muted">
                  {h.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
