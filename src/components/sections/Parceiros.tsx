import { partners } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Parceiros() {
  // Double the list so the marquee can scroll infinitely.
  const doubled = [...partners, ...partners];

  return (
    <Section id="parceiros" variant="ink" className="overflow-hidden border-t border-border">
      <Container>
        <div className="reveal flex flex-col items-center gap-4 text-center">
          <Eyebrow number="06">Parceiros</Eyebrow>
          <h3
            className="font-display -tracking-[0.02em] text-balance"
            style={{ fontSize: "var(--text-3xl)", lineHeight: 0.95 }}
          >
            Clubes, prefeituras e grandes eventos{" "}
            <span className="serif-italic text-brand">desde sempre</span>.
          </h3>
        </div>
      </Container>

      <div className="relative mt-[clamp(2.5rem,5vi,4rem)] overflow-hidden">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "marquee-x 55s linear infinite" }}
        >
          {doubled.map((p, i) => (
            <span
              key={`${p}-${i}`}
              className="group mx-[clamp(1.5rem,4vi,4rem)] inline-flex items-center gap-[clamp(1.5rem,4vi,4rem)] whitespace-nowrap font-mono text-[clamp(0.9rem,1rem+0.4vi,1.15rem)] uppercase tracking-[0.3em] text-text-muted transition-colors hover:text-text"
            >
              {p}
              <span
                aria-hidden
                className="inline-block h-1 w-1 rotate-45 bg-brand/60"
              />
            </span>
          ))}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[clamp(4rem,10vi,10rem)] bg-gradient-to-r from-bg to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[clamp(4rem,10vi,10rem)] bg-gradient-to-l from-bg to-transparent"
        />
      </div>
    </Section>
  );
}
