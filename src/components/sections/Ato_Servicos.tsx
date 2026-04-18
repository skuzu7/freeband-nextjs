// src/components/sections/Ato_Servicos.tsx
"use client";

import { motion } from 'framer-motion';
import { contact } from '@/data/content';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { cn } from '@/utils/cn';

const packages = [
  {
    id: 'premium',
    name: 'PACOTE PREMIUM',
    description: 'A experiência completa e definitiva para eventos inesquecíveis.',
    icon: Crown,
    highlighted: true,
    features: [
      'Som Completo (PA compatível com local e público)',
      'Banda Freeband',
      'DJ Buru + Estrutura de DJ',
      'Painel de Led 3x2 P3 com efeitos 3D',
      'Pista de Led 15m² (ex. 3x5)',
      'Estrutura de Boate (Box truss 4x3)',
      '04 Moving Head com canhões de luz e efeitos',
      'Máquinas de fumaça + Máquina de Sparkles (02 un.)',
      'Letreiro NEON 15 Anos / Parabéns',
    ]
  },
  {
    id: 'standard',
    name: 'PACOTE CLASSIC',
    description: 'Alta performance com um setup elegante e eficiente.',
    icon: Star,
    highlighted: false,
    features: [
      'Som Completo (PA compatível)',
      'Banda Freeband ou DJ Buru',
      'Iluminação Básica (LEDs)',
      'Estrutura de Boate Padrão',
      'Máquina de fumaça',
    ]
  }
];

export function Ato_Servicos() {
  return (
    <section id="servicos" className="relative bg-void-950 py-24 sm:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(197,158,87,0.05)_0%,rgba(0,0,0,0)_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,0,0,0.03)_0%,rgba(0,0,0,0)_50%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl sm:text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base font-semibold leading-7 text-[#C59E57] uppercase tracking-widest"
          >
            Orçamentos
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl font-display"
          >
            Serviços Premium
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-gray-300"
          >
            Escolha o formato ideal para transformar sua noite em um verdadeiro espetáculo.
          </motion.p>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2 lg:gap-x-8">
          {packages.map((pkg, pIdx) => {
            const Icon = pkg.icon;
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
                    ? "bg-white/5 ring-[#C59E57]/50 shadow-[0_0_50px_rgba(197,158,87,0.1)] relative overflow-hidden"
                    : "bg-white/5 ring-white/10 hover:ring-white/20"
                )}
              >
                {pkg.highlighted && (
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[#C59E57]/20 blur-3xl rounded-full" />
                )}

                <div className="flex items-center justify-between gap-x-4">
                  <h3 className={cn(
                    "text-lg font-semibold leading-8 tracking-widest",
                    pkg.highlighted ? "text-[#C59E57]" : "text-white"
                  )}>
                    {pkg.name}
                  </h3>
                  {pkg.highlighted && (
                    <span className="rounded-full bg-[#C59E57]/10 px-2.5 py-1 text-xs font-semibold leading-5 text-[#C59E57]">
                      Mais popular
                    </span>
                  )}
                </div>

                <Icon className={cn(
                  "mt-4 h-8 w-8",
                  pkg.highlighted ? "text-[#C59E57]" : "text-gray-400"
                )} />

                <p className="mt-4 text-sm leading-6 text-gray-300">
                  {pkg.description}
                </p>

                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className={cn(
                        "h-6 w-5 flex-none",
                        pkg.highlighted ? "text-[#C59E57]" : "text-gray-500"
                      )} aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href={`${contact.whatsappLink}?text=Olá! Gostaria de saber mais sobre o ${pkg.name}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all",
                    pkg.highlighted
                      ? "bg-[#C59E57] text-white hover:bg-[#b08b47] shadow-sm hover:shadow-[#C59E57]/50"
                      : "bg-white/10 text-white hover:bg-white/20"
                  )}
                >
                  Consultar Valores
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
