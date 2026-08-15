'use client';

import React, { useEffect, useCallback, useState, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/cn';

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handlePrev = useCallback(() => {
    if (currentIndex === null || items.length === 0) return;
    onSelectIndex((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, onSelectIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex === null || items.length === 0) return;
    onSelectIndex((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, onSelectIndex]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Keyboard navigation + focus trap. Focus moves to the dialog on open,
  // cycles inside it on Tab, and returns to the opener on close.
  useEffect(() => {
    if (!isOpen) return;

    const opener = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key.toLowerCase() === 'f') toggleFullscreen();
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !dialogRef.current.contains(active))) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      opener?.focus?.();
    };
  }, [isOpen, onClose, handlePrev, handleNext, toggleFullscreen]);

  // Keep active thumbnail in view
  useEffect(() => {
    if (currentIndex !== null && thumbnailsRef.current) {
      const activeEl = thumbnailsRef.current.children[currentIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentIndex]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!isOpen || !currentItem) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Visualização de imagem em alta resolução"
      className="fixed inset-0 z-[300] flex flex-col justify-between bg-void-950/96 p-3 md:p-6 backdrop-blur-xl transition-all duration-300 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Header Controls */}
      <div className="flex w-full max-w-7xl mx-auto items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-[0.66rem] uppercase tracking-[0.28em] text-text-muted">
            O acervo <span className="text-brand">· Internacional Freeband</span>
          </span>
          <span className="font-mono text-xs tabular-nums text-text-muted" aria-live="polite">
            {String(currentIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center border border-border bg-bg-raise/80 text-text-muted transition-colors hover:border-brand hover:text-brand"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar visualização"
            className="inline-flex h-9 w-9 items-center justify-center border border-border bg-bg-raise/80 text-text transition-colors hover:border-brand hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Image View */}
      <div
        className="relative my-auto flex h-[58vh] md:h-[65vh] w-full max-w-6xl mx-auto items-center justify-center select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous Button */}
        {items.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Foto anterior"
            className="absolute left-1 md:-left-5 z-10 inline-flex h-11 w-11 items-center justify-center border border-border bg-bg-high/90 text-text backdrop-blur transition-all hover:border-brand hover:text-brand hover:scale-105 focus:outline-none cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        <div className="relative h-full w-full max-w-5xl">
          <Image
            src={currentItem.src}
            alt={currentItem.alt}
            fill
            sizes="(min-width: 1280px) 1152px, 95vw"
            quality={95}
            priority
            className="object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          />
        </div>

        {/* Next Button */}
        {items.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Próxima foto"
            className="absolute right-1 md:-right-5 z-10 inline-flex h-11 w-11 items-center justify-center border border-border bg-bg-high/90 text-text backdrop-blur transition-all hover:border-brand hover:text-brand hover:scale-105 focus:outline-none cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Bottom Info & Thumbnail Strip */}
      <div className="flex w-full max-w-6xl mx-auto flex-col gap-3 border-t border-border/60 pt-3">
        <div className="flex flex-col items-center justify-between gap-2 text-center md:flex-row md:text-left">
          <div>
            {currentItem.caption && (
              <p className="font-display text-base md:text-lg text-text font-medium">
                {currentItem.caption}
              </p>
            )}
            {currentItem.alt && (
              <p className="text-xs text-text-muted max-w-2xl text-pretty line-clamp-1 md:line-clamp-none">
                {currentItem.alt}
              </p>
            )}
          </div>

          {currentItem.when && (
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand shrink-0">
              <span>Data / Edição:</span>
              <span className="text-text">{currentItem.when}</span>
            </div>
          )}
        </div>

        {/* Thumbnail Navigation Strip */}
        {items.length > 1 && (
          <div
            ref={thumbnailsRef}
            className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none max-w-full justify-start md:justify-center"
          >
            {items.map((item, idx) => (
              <button
                key={`${item.src}-${idx}`}
                type="button"
                onClick={() => onSelectIndex(idx)}
                aria-label={`Ver foto ${idx + 1}: ${item.caption || item.alt}`}
                className={cn(
                  'relative h-12 w-16 shrink-0 overflow-hidden border transition-all cursor-pointer',
                  idx === currentIndex
                    ? 'border-brand ring-1 ring-brand scale-105 opacity-100 glow-gold-soft'
                    : 'border-border/60 opacity-50 hover:opacity-90 hover:border-brand/50',
                )}
              >
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
