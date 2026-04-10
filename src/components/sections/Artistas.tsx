import { SectionTitle } from "@/components/ui/SectionTitle";
import { artists } from "@/data/content";

export default function Artistas() {
  const half = Math.ceil(artists.length / 2);
  const col1 = artists.slice(0, half);
  const col2 = artists.slice(half);

  return (
    <section
      id="artistas"
      className="section-padding"
      style={{ background: "var(--color-bg-2)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Já tocamos ao lado de</SectionTitle>

        <div className="flex gap-0 mt-12">
          {/* Column 1 */}
          <div className="flex-1 flex flex-col gap-4">
            {col1.map((artist) => (
              <div key={artist} className="flex items-center gap-3">
                <span style={{ color: "var(--color-gold)", fontWeight: 700 }}>
                  ❯
                </span>
                <span
                  className="text-lg"
                  style={{ color: "var(--color-white)" }}
                >
                  {artist}
                </span>
              </div>
            ))}
          </div>

          {/* Gold divider */}
          <div
            style={{
              width: "1px",
              background: "var(--color-gold)",
              margin: "0 2rem",
              opacity: 0.4,
            }}
          />

          {/* Column 2 */}
          <div className="flex-1 flex flex-col gap-4">
            {col2.map((artist) => (
              <div key={artist} className="flex items-center gap-3">
                <span style={{ color: "var(--color-gold)", fontWeight: 700 }}>
                  ❯
                </span>
                <span
                  className="text-lg"
                  style={{ color: "var(--color-white)" }}
                >
                  {artist}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
