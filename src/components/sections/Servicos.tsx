"use client";

import { SectionTitle } from "@/components/ui/SectionTitle";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { services, serviceIncludes } from "@/data/content";

export function Servicos() {
  return (
    <Section id="servicos" className="bg-bg">
      <Container>
        <SectionTitle eyebrow="Excelência">Nossos Serviços</SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="glass p-8 group hover:border-gold/30 transition-all duration-500"
            >
              <div className="text-4xl mb-6 text-gold group-hover:scale-110 transition-transform origin-left">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-4">
                {service.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Feature List */}
        <div className="mt-24 py-16 border-t border-white/5">
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1">
              <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4">
                Infraestrutura <br />
                <span className="text-gold">Full Premium</span>
              </h3>
              <p className="text-text-muted text-sm">
                Investimos constantemente em tecnologia para oferecer o melhor padrão sonoro e visual do mercado.
              </p>
            </div>

            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              {serviceIncludes.map((item) => (
                <div key={item} className="flex items-center gap-4 p-4 border border-white/5 bg-white/[0.02]">
                  <span className="h-6 w-6 rounded-full border border-gold/40 flex items-center justify-center text-gold text-[0.6rem]">
                    ✓
                  </span>
                  <span className="text-xs uppercase tracking-widest text-text-muted font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
