import Image from "next/image";
import { timeline } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Historia() {
  return (
    <Section id="historia" variant="ink-raise" className="overflow-hidden">
      <Container>
        <div className="reveal flex max-w-3xl flex-col gap-6">
          <Eyebrow number="02">Palco</Eyebrow>
          <h2
            className="font-display -tracking-[0.02em] text-balance"
            style={{ fontSize: "var(--text-5xl)", lineHeight: 0.92 }}
          >
            Cinquenta e seis anos <br className="hidden md:block" />
            em <span className="serif-italic text-brand">cinco atos</span>.
          </h2>
          <p className="max-w-[54ch] text-text-muted" style={{ fontSize: "var(--text-base)" }}>
            Deslize para percorrer o palco. Cada ato é um capítulo ao vivo da
            banda — de Jaú a Trabiju, de Lulu a Jimmy Cliff.
          </p>
        </div>
      </Container>

      {/* Full-bleed horizontal runway */}
      <div
        className="h-snap reveal mt-[clamp(3rem,5vi,5rem)] pb-12"
        style={{ paddingInline: "clamp(1.25rem, 4vw, 3.5rem)" }}
      >
        {timeline.map((item, i) => {
          const ato = String(i + 1).padStart(2, "0");
          return (
            <article
              key={i}
              className="group relative flex h-full flex-col gap-6"
            >
              <div className="flex items-baseline justify-between border-t border-border pt-4">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-brand">
                  Ato {ato}
                </span>
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-text-muted">
                  {item.year}
                </span>
              </div>

              <span
                className="font-display font-semibold -tracking-[0.04em] text-text"
                style={{ fontSize: "var(--text-7xl)", lineHeight: 0.82 }}
              >
                {item.year}
              </span>

              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 640px, 82vw"
                  quality={90}
                  className="object-cover saturate-[0.15] contrast-[1.1] transition-[filter,transform] duration-[1200ms] ease-[var(--ease-stage)] group-hover:saturate-100 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-border" />
              </div>

              <h3
                className="font-display -tracking-[0.02em] text-text text-balance"
                style={{ fontSize: "var(--text-2xl)", lineHeight: 1 }}
              >
                {item.title}
              </h3>

              <p
                className="max-w-[42ch] text-text-muted text-pretty"
                style={{ fontSize: "var(--text-base)", lineHeight: 1.65 }}
              >
                {item.description}
              </p>
            </article>
          );
        })}
      </div>

      <Container>
        <div className="mt-6 flex items-center gap-4 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-muted">
          <span aria-hidden className="inline-block h-px w-10 bg-brand" />
          <span>Arraste para o lado</span>
        </div>
      </Container>
    </Section>
  );
}
