import Image from "next/image";
import { timeline } from "@/data/content";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function Historia() {
  return (
    <section
      id="historia"
      className="section-padding"
      style={{ backgroundColor: "var(--color-bg-2)" }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <SectionTitle>Nossa História</SectionTitle>

        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: "15px",
              top: "20px",
              bottom: "20px",
              width: "2px",
              backgroundColor: "var(--color-border)",
            }}
          />

          {timeline.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "2rem",
                marginBottom: index < timeline.length - 1 ? "2.5rem" : 0,
                position: "relative",
              }}
            >
              <div style={{ flexShrink: 0, paddingTop: "4px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "var(--color-gold)",
                    position: "relative",
                    zIndex: 1,
                  }}
                />
              </div>

              <div
                style={{
                  flex: 1,
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "1rem",
                }}
                className="timeline-item-inner"
              >
                <div>
                  <div
                    style={{
                      display: "inline-block",
                      backgroundColor: "var(--color-gold)",
                      color: "#0D0D0D",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      padding: "0.25rem 0.75rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {item.year}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "var(--color-white)",
                      textTransform: "uppercase",
                      marginBottom: "0.5rem",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--color-text-2)",
                      fontSize: "0.95rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.description}
                  </p>
                </div>

                <div style={{ position: "relative", height: "180px" }}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{
                      objectFit: "cover",
                      border: "2px solid var(--color-gold)",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .timeline-item-inner { grid-template-columns: 55% 40% !important; align-items: start; }
        }
      `}</style>
    </section>
  );
}
