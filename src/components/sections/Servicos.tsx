import { services, includedFeatures } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Servicos() {
  return (
    <Section id="servicos" variant="ink" className="overflow-hidden">
      <Container>
        <div className="reveal flex flex-col gap-6 md:max-w-3xl">
          <Eyebrow number="05">Eventos</Eyebrow>
          <h2
            className="font-display -tracking-[0.02em] text-balance"
            style={{ fontSize: "var(--text-5xl)", lineHeight: 0.92 }}
          >
            Atendemos com <span className="serif-italic text-brand">excelência</span>.
          </h2>
          <p className="max-w-[54ch] text-text-muted" style={{ fontSize: "var(--text-base)" }}>
            Casamentos, formaturas e eventos corporativos premium — três
            formatos com o mesmo rigor de palco. Arraste para conhecer cada um.
          </p>
        </div>
      </Container>

      <div
        className="h-snap mt-[clamp(3rem,5vi,5rem)] pb-10"
        style={{
          paddingInline: "clamp(1.25rem, 4vw, 3.5rem)",
          gridAutoColumns: "min(82vw, 440px)",
        }}
      >
        {services.map((service, i) => (
          <article
            key={service.title}
            className="group relative flex h-full flex-col justify-between gap-10 border border-border bg-bg-raise p-[clamp(1.5rem,2.5vi,2.5rem)] transition-colors duration-500 hover:border-brand"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--color-red-500)_14%,transparent),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />

            <div className="flex items-start justify-between">
              <span className="font-mono text-[0.72rem] uppercase tracking-[0.3em] text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                aria-hidden
                className="font-display text-brand"
                style={{ fontSize: "var(--text-4xl)", lineHeight: 1 }}
              >
                {service.icon}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <h3
                className="font-display -tracking-[0.02em] text-text text-balance"
                style={{ fontSize: "var(--text-3xl)", lineHeight: 0.95 }}
              >
                {service.title}
              </h3>
              <p
                className="text-text-muted text-pretty"
                style={{ fontSize: "var(--text-base)", lineHeight: 1.65 }}
              >
                {service.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      <Container>
        <div className="mt-[clamp(4rem,6vi,6rem)] grid gap-10 border-t border-border pt-[clamp(3rem,5vi,5rem)] lg:grid-cols-[minmax(0,1fr)_1.6fr] lg:gap-16">
          <div className="reveal flex flex-col gap-6">
            <Eyebrow>O que está incluso</Eyebrow>
            <h3
              className="font-display -tracking-[0.02em] text-balance"
              style={{ fontSize: "var(--text-4xl)", lineHeight: 0.95 }}
            >
              <span className="serif-italic text-brand">Full premium</span>,{" "}
              tudo nosso.
            </h3>
            <p className="max-w-[48ch] text-text-muted" style={{ fontSize: "var(--text-base)" }}>
              Som, luz, logística, DJ pós-show e backup — investimos em
              tecnologia sem terceirizar o padrão.
            </p>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2">
            {includedFeatures.map((feature, i) => (
              <li
                key={feature.title}
                className="reveal flex flex-col gap-4 border border-border bg-bg-raise p-6 transition-colors hover:border-brand"
                style={{ ["--i" as string]: i }}
              >
                <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
                  <h4 className="font-display text-text -tracking-[0.01em] text-balance" style={{ fontSize: "var(--text-lg)", lineHeight: 1.15 }}>
                    {feature.title}
                  </h4>
                  {feature.optional ? (
                    <span className="font-mono text-[0.58rem] uppercase tracking-[0.3em] text-brand">
                      opcional
                    </span>
                  ) : (
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>
                <ul className="flex flex-col gap-2">
                  {feature.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-[0.45em] inline-block h-1 w-1 shrink-0 rotate-45 bg-brand"
                      />
                      <span className="font-sans text-[0.85rem] text-text-muted leading-[1.55]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
