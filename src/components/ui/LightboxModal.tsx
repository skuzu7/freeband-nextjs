'use client';

import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface LightboxItem {
  src: string;
  alt: string;
  caption?: string;
  category?: string;
  venue?: string;
  when?: string;
}

interface LightboxModalProps {
  items: LightboxItem[];
  currentIndex: number | null;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export function LightboxModal({
  items,
  currentIndex,
  onClose,
  onSelectIndex,
}: LightboxModalProps) {
  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < items.length;
  const currentItem = isOpen ? items[currentIndex] : null;

  const handlePrev = useCallback(() => {
    if (currentIndex === null) return;
    onSelectIndex((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, onSelectIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex === null) return;
    onSelectIndex((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, onSelectIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentItem) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Visualização de imagem em alta resolução"
      className="fixed inset-0 z-[300] flex flex-col items-center justify-between bg-void-950/95 p-4 md:p-8 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Header Controls */}
      <div className="flex w-full max-w-7xl items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-brand">
            Freeband Acervo Live
          </span>
          <span className="font-mono text-xs text-text-muted">
            {currentIndex + 1} / {items.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar visualização"
          className="inline-flex h-10 w-10 items-center justify-center border border-border bg-bg-raise/80 text-text transition-colors hover:border-brand hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Image Container */}
      <div className="relative my-auto flex h-[72vh] w-full max-w-6xl items-center justify-center">
        {/* Previous Button */}
        {items.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Foto anterior"
            className="absolute left-2 md:-left-6 z-10 inline-flex h-12 w-12 items-center justify-center border border-border bg-bg-high/90 text-text backdrop-blur transition-all hover:border-brand hover:text-brand hover:scale-105 focus:outline-none"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        <div className="relative h-full w-full max-w-5xl">
          <Image
            src={currentItem.src}
            alt={currentItem.alt}
            fill
            sizes="90vw"
            quality={95}
            priority
            className="object-contain"
          />
        </div>

        {/* Next Button */}
        {items.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Próxima foto"
            className="absolute right-2 md:-right-6 z-10 inline-flex h-12 w-12 items-center justify-center border border-border bg-bg-high/90 text-text backdrop-blur transition-all hover:border-brand hover:text-brand hover:scale-105 focus:outline-none"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="flex w-full max-w-5xl flex-col items-center justify-between gap-2 border-t border-border/60 pt-4 text-center md:flex-row md:text-left">
        <div>
          {currentItem.caption && (
            <p className="font-display text-base md:text-lg text-text font-medium">
              {currentItem.caption}
            </p>
          )}
          {currentItem.alt && (
            <p className="text-xs text-text-muted max-w-xl text-pretty">
              {currentItem.alt}
            </p>
          )}
        </div>

        {currentItem.when && (
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand">
            <span>Data / Edição:</span>
            <span className="text-text">{currentItem.when}</span>
          </div>
        )}
      </div>
    </div>
  );
}
