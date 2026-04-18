// src/components/sections/Hero.tsx
"use client";

import { motion } from 'framer-motion';
import { bandInfo, contact, pageCopy } from '@/data/content';
import { StageBeams } from '@/components/ui/StageBeams';
import Image from 'next/image';

export function Hero() {
  const copy = pageCopy.hero;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
  };

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-void-950"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-30 h-full w-full bg-black">
        <Image
          src="/images/banda-freeband.jpg"
          alt="Banda Freeband"
          fill
          priority
          className="object-cover opacity-20 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,158,87,0.1)_0%,rgba(0,0,0,0)_70%)]" />
      </div>

      {/* Stage beams — activated! */}
      <StageBeams />

      {/* Modern Vignette & Scanlines */}
      <div aria-hidden className="absolute inset-0 z-[5] pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
      <div aria-hidden className="scanlines absolute inset-0 z-[5] pointer-events-none mix-blend-overlay opacity-30" />

      {/* Top Left Branding (Logo) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute top-24 left-4 sm:left-12 z-20 w-24 sm:w-32 brightness-200 contrast-125 saturate-0"
      >
        <Image
          src="/images/dj-buru-logo.png"
          alt="DJ Buru"
          width={150}
          height={60}
          className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        />
      </motion.div>

      {/* Center Hero Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4 pt-20"
      >
        <motion.div variants={itemVariants} className="mb-8 inline-flex items-center gap-3 border border-white/20 bg-black/40 backdrop-blur-md px-5 py-2 rounded-full shadow-[0_0_20px_rgba(197,158,87,0.15)]">
          <span className="h-2 w-2 rounded-full bg-[#C59E57] animate-pulse" />
          <span className="font-sans text-xs font-bold tracking-[0.25em] text-[#C59E57] uppercase">
            A Experiência Definitiva
          </span>
          <span className="h-2 w-2 rounded-full bg-[#C59E57] animate-pulse" />
        </motion.div>

        <motion.h1 variants={itemVariants} className="flex flex-col items-center leading-[0.85] select-none">
          <span className="font-display text-[clamp(3rem,8vw,6rem)] font-bold text-white drop-shadow-2xl mix-blend-screen">
            FREEBAND
          </span>
          <span className="font-display text-[clamp(1.5rem,4vw,3rem)] font-light tracking-[0.2em] text-[#C59E57] mt-2">
            & DJ BURU
          </span>
        </motion.h1>

        <motion.p variants={itemVariants} className="mt-8 font-sans text-[clamp(0.9rem,1.5vw,1.1rem)] font-medium tracking-wide text-gray-300 max-w-2xl text-balance leading-relaxed drop-shadow-md">
          Transforme seu evento em um espetáculo inesquecível.
          Tecnologia de ponta, repertório explosivo e uma performance que desafia os limites do entretenimento premium.
        </motion.p>

        <motion.div variants={itemVariants} className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row w-full sm:w-auto">
          <a
            href={contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-md bg-gradient-to-r from-[#C59E57] to-[#8b6f3d] px-8 py-4 font-sans text-sm font-bold tracking-widest text-white shadow-[0_0_30px_rgba(197,158,87,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(197,158,87,0.5)] w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.2),transparent)] -skew-x-12 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              SOLICITAR ORÇAMENTO
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </a>

          <a
            href="#servicos"
            className="group px-8 py-4 font-sans text-sm font-bold tracking-widest text-white border border-white/30 rounded-md backdrop-blur-sm transition-all hover:bg-white/10 w-full sm:w-auto"
          >
            VER PACOTES
          </a>
        </motion.div>

      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="h-10 w-6 rounded-full border border-white/20 flex justify-center p-1"
        >
          <div className="h-2 w-1.5 bg-[#C59E57] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
