import Image from "next/image";
import { release } from "@/data/content";
import { images } from "@/data/images";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function Sobre() {
  return (
    <section
      id="sobre"
      className="section-padding"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <SectionTitle>Quem Somos</SectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
            marginBottom: "3rem",
          }}
          className="sobre-grid"
        >
          <div>
            {release.full.split("\n\n").map((para, i) => (
              <p
                key={i}
                style={{
                  color: "var(--color-text-2)",
                  fontSize: "1.05rem",
                  lineHeight: 1.8,
                  marginBottom: "1.2rem",
                  textAlign: "justify",
                }}
              >
                {para}
              </p>
            ))}
          </div>

          <div style={{ position: "relative", minHeight: "350px" }}>
            <Image
              src={images.anos70}
              alt="Freeband anos 70"
              fill
              style={{
                objectFit: "cover",
                filter: "grayscale(100%) contrast(1.1)",
                border: "2px solid var(--color-gold)",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1px",
            backgroundColor: "var(--color-border)",
            border: "1px solid var(--color-border)",
          }}
          className="stats-grid"
        >
          {release.highlights.map((h, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "var(--color-bg-card)",
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
                  fontWeight: 700,
                  color: "var(--color-gold)",
                  lineHeight: 1,
                  marginBottom: "0.5rem",
                }}
              >
                {h.value}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-2)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontWeight: 600,
                }}
              >
                {h.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .sobre-grid { grid-template-columns: 60% 38% !important; }
          .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
