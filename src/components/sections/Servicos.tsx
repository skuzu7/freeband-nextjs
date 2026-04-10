import { SectionTitle } from "@/components/ui/SectionTitle";
import { services, serviceIncludes } from "@/data/content";

export default function Servicos() {
  return (
    <section
      id="servicos"
      className="section-padding"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Nossos Serviços</SectionTitle>

        {/* 5 cards: 3+2 on large screens */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group p-8 transition-all duration-300"
              style={{
                background: "var(--color-bg-card)",
                border: "1px solid var(--color-border)",
                borderBottom: "3px solid var(--color-gold)",
              }}
            >
              <div
                className="text-4xl mb-4"
                style={{ color: "var(--color-gold)" }}
              >
                {service.icon}
              </div>
              <h3
                className="text-xl font-bold uppercase tracking-widest mb-3"
                style={{ color: "var(--color-white)" }}
              >
                {service.title}
              </h3>
              <p style={{ color: "var(--color-text-2)", lineHeight: 1.7 }}>
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Includes checklist */}
        <div className="mt-16">
          <h3
            className="text-2xl font-bold mb-8 text-center uppercase tracking-widest"
            style={{ color: "var(--color-gold)" }}
          >
            Incluso em todos os eventos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {serviceIncludes.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span
                  className="text-xl mt-0.5 flex-shrink-0"
                  style={{ color: "var(--color-gold)" }}
                >
                  ✓
                </span>
                <span style={{ color: "var(--color-white)", lineHeight: 1.6 }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
