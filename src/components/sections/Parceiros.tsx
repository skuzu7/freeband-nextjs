import { SectionTitle } from "@/components/ui/SectionTitle";
import { partners } from "@/data/content";

export default function Parceiros() {
  return (
    <section
      id="parceiros"
      className="section-padding"
      style={{ background: "var(--color-bg-2)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Nossos Parceiros</SectionTitle>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {partners.map((partner, i) => (
            <div key={partner} className="flex items-center gap-4">
              <span
                className="text-lg font-medium tracking-wide text-center"
                style={{ color: "var(--color-white)" }}
              >
                {partner}
              </span>
              {i < partners.length - 1 && (
                <span
                  className="text-2xl font-thin"
                  style={{ color: "var(--color-gold)" }}
                >
                  |
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
