import Image from "next/image";
import { bandInfo } from "@/data/content";
import { images } from "@/data/images";

export function Hero() {
  return (
    <section
      style={{
        position: "relative",
        height: "100vh",
        minHeight: "600px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        src={images.festa55}
        alt="Internacional Freeband ao vivo"
        fill
        style={{ objectFit: "cover", objectPosition: "center top" }}
        priority
        quality={90}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(13,13,13,0.2) 0%, rgba(13,13,13,0.6) 60%, rgba(13,13,13,1) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "0 1.5rem",
          maxWidth: "900px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            border: "1px solid var(--color-gold)",
            color: "var(--color-gold)",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "0.4rem 1.2rem",
            marginBottom: "2rem",
          }}
        >
          Desde 1969
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            lineHeight: 1.05,
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              color: "var(--color-white)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Internacional
          </span>
          <span
            style={{
              display: "block",
              fontSize: "clamp(3rem, 10vw, 6.5rem)",
              color: "var(--color-gold)",
              letterSpacing: "0.03em",
              textTransform: "uppercase",
            }}
          >
            Freeband
          </span>
        </h1>

        <p
          style={{
            color: "var(--color-text-2)",
            fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "2.5rem",
          }}
        >
          {bandInfo.tagline}
        </p>

        <a
          href="#contato"
          style={{
            display: "inline-block",
            backgroundColor: "var(--color-gold)",
            color: "#0D0D0D",
            padding: "1rem 2.5rem",
            fontWeight: 700,
            fontSize: "0.875rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          Agendar Show
        </a>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          color: "var(--color-gold)",
          fontSize: "1.5rem",
          animation: "bounce 2s infinite",
        }}
      >
        ↓
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </section>
  );
}
