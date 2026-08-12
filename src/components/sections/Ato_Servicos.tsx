// src/components/sections/Ato_Servicos.tsx
"use client";

import { motion } from 'framer-motion';
import { contact, pageCopy, servicePackages } from '@/data/content';
import { Check, Star, Crown } from 'lucide-react';
import { cn } from '@/lib/cn';

// Icons stay in the component (they're React components, not copy); the
// package data itself lives in src/data/content.ts.
const packageIcons: Record<string, typeof Crown> = {
  premium: Crown,
  classic: Star,
};

export function Ato_Servicos() {
  const copy = pageCopy.pacotes;

  return (
    <section id="pacotes" className="relative bg-void-950 py-24 sm:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklab,var(--color-gold),transparent_95%)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,color-mix(in_oklab,var(--color-gold-deep),transparent_97%)_0%,transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl sm:text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base font-semibold leading-7 text-gold uppercase tracking-widest"
          >
            {copy.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl font-display"
          >
            {copy.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-text-muted"
          >
            {copy.lead}
          </motion.p>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2 lg:gap-x-8">
          {servicePackages.map((pkg, pIdx) => {
            const Icon = packageIcons[pkg.id] ?? Star;
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + (pIdx * 0.2) }}
                className={cn(
                  "rounded-3xl p-8 ring-1 xl:p-10 transition-all duration-500 hover:-translate-y-2",
                  pkg.highlighted
                    ? "bg-white/5 ring-gold/50 glow-gold-soft relative overflow-hidden"
                    : "bg-white/5 ring-white/10 hover:ring-white/20"
                )}
              >
                {pkg.highlighted && (
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-gold/20 blur-3xl rounded-full" />
                )}

                <div className="flex items-center justify-between gap-x-4">
                  <h3 className={cn(
                    "text-lg font-semibold leading-8 tracking-widest",
                    pkg.highlighted ? "text-gold" : "text-white"
                  )}>
                    {pkg.name}
                  </h3>
                  {pkg.highlighted && (
                    <span className="rounded-full bg-gold/10 px-2.5 py-1 text-xs font-semibold leading-5 text-gold">
                      {copy.highlightBadge}
                    </span>
                  )}
                </div>

                <Icon className={cn(
                  "mt-4 h-8 w-8",
                  pkg.highlighted ? "text-gold" : "text-text-muted"
                )} />

                <p className="mt-4 text-sm leading-6 text-text-muted">
                  {pkg.description}
                </p>

                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-text-muted">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className={cn(
                        "h-6 w-5 flex-none",
                        pkg.highlighted ? "text-gold" : "text-text-low"
                      )} aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href={`${contact.whatsappLink}?text=${encodeURIComponent(`${copy.whatsappMessage} ${pkg.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all",
                    pkg.highlighted
                      ? "bg-gold text-white hover:bg-gold-deep shadow-sm hover:glow-gold"
                      : "bg-white/10 text-white hover:bg-white/20"
                  )}
                >
                  {copy.ctaLabel}
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
