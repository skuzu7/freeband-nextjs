import { SectionTitle } from "@/components/ui/SectionTitle";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { services, serviceIncludes } from "@/data/content";

export function Servicos() {
  return (
    <Section id="servicos" className="bg-bg">
      <Container>
        <SectionTitle eyebrow="O que fazemos">Nossos Serviços</SectionTitle>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="group relative border border-border border-b-4 border-b-gold bg-bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_12px_32px_-16px_rgba(201,168,76,0.4)]"
            >
              <div className="mb-5 text-4xl text-gold" aria-hidden="true">
                {service.icon}
              </div>
              <h3 className="mb-3 font-display text-xl font-bold uppercase tracking-widest text-white">
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-2 md:text-base">
                {service.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-20">
          <h3 className="text-center font-display text-2xl font-bold uppercase tracking-[0.2em] text-gold md:text-3xl">
            Incluso em todos os eventos
          </h3>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
            {serviceIncludes.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 border border-border bg-bg-card/60 p-4"
              >
                <span
                  className="mt-0.5 flex-shrink-0 text-xl text-gold"
                  aria-hidden="true"
                >
                  &#10003;
                </span>
                <span className="text-sm leading-relaxed text-white md:text-base">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
