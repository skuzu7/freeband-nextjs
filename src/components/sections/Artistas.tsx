import { artists } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

function Row({
  reverse = false,
  speed = 50,
  style,
}: {
  reverse?: boolean;
  speed?: number;
  style?: "plain" | "italic" | "outline";
}) {
  const doubled = [...artists, ...artists];
  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <div
        className="flex shrink-0 whitespace-nowrap"
        style={{
          animation: `${
            reverse ? "marquee-x-reverse" : "marquee-x"
          } ${speed}s linear infinite`,
        }}
      >
        {doubled.map((artist, i) => (
          <span
            key={`${artist}-${i}`}
            className={`mx-[clamp(1rem,3vi,3rem)] inline-flex items-center gap-[clamp(1rem,3vi,3rem)] ${
              style === "italic"
                ? "serif-italic text-text"
                : style === "outline"
                  ? "font-display font-semibold text-transparent"
                  : "font-display font-semibold text-text"
            }`}
            style={{
              fontSize:
                style === "italic"
                  ? "var(--text-4xl)"
                  : style === "outline"
                    ? "var(--text-5xl)"
                    : "var(--text-5xl)",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              WebkitTextStroke:
                style === "outline"
                  ? "1px color-mix(in oklch, var(--color-text) 40%, transparent)"
                  : undefined,
            }}
          >
            {artist}
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rotate-45 bg-brand"
            />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Artistas() {
  return (
    <Section
      id="artistas"
      variant="ink-raise"
      className="overflow-hidden border-y border-border"
    >
      <Container>
        <div className="reveal flex flex-col gap-6 md:max-w-3xl">
          <Eyebrow number="04">Legado</Eyebrow>
          <h2
            className="font-display -tracking-[0.02em] text-balance"
            style={{ fontSize: "var(--text-5xl)", lineHeight: 0.92 }}
          >
            Já dividimos o palco <br className="hidden md:block" />
            com <span className="serif-italic text-brand">estes nomes</span>.
          </h2>
        </div>
      </Container>

      <div className="relative mt-[clamp(3rem,6vi,5rem)] flex flex-col gap-[clamp(0.75rem,1.5vi,1.5rem)] py-6">
        <Row speed={50} style="plain" />
        <Row reverse speed={70} style="italic" />
        <Row speed={60} style="outline" />

        {/* Gradient fade masks */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[clamp(4rem,15vi,14rem)] bg-gradient-to-r from-bg-raise to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[clamp(4rem,15vi,14rem)] bg-gradient-to-l from-bg-raise to-transparent"
        />
      </div>
    </Section>
  );
}
