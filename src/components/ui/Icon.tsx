// src/components/ui/Icon.tsx
// The site's few icons, drawn once: 24-unit box, 1.75 stroke, currentColor.
// Decorative by default — the control that holds one carries the name.
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

const PATHS = {
  close: <path d="M6 6l12 12M18 6L6 18" />,
  menu: <path d="M3 7h18M3 12h18M3 17h18" />,
  'chevron-left': <path d="M15 5l-7 7 7 7" />,
  'chevron-right': <path d="M9 5l7 7-7 7" />,
  'arrow-right': <path d="M4 12h15M13 6l6 6-6 6" />,
  play: <path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none" />,
  pause: <path d="M7 5v14M17 5v14" strokeWidth="3" />,
  volume: <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5zM15.5 9a4 4 0 010 6M18 6.5a7.5 7.5 0 010 11" />,
  mute: <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5zM16 9.5l5 5M21 9.5l-5 5" />,
  fullscreen: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  share: <path d="M12 15V4M8 8l4-4 4 4M5 12v7h14v-7" />,
  'zoom-in': <path d="M10.5 4a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM15.5 15.5L20 20M10.5 8v5M8 10.5h5" />,
  'zoom-out': <path d="M10.5 4a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM15.5 15.5L20 20M8 10.5h5" />,
  sliders: <path d="M4 7h16M4 17h16M9 4v6M15 14v6" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="1.5" />
      <path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
      <path d="M8 3v4M16 3v4M3.5 9.5h17" />
    </>
  ),
  whatsapp: (
    <path
      d="M12 2.5A9.5 9.5 0 0 0 3.8 16.7L2.5 21.5l4.9-1.3A9.5 9.5 0 1 0 12 2.5Zm0 1.8a7.7 7.7 0 1 1-3.9 14.3l-.3-.2-2.9.8.8-2.8-.2-.3A7.7 7.7 0 0 1 12 4.3Zm-3 3.9c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 3 4.7 4.1 2.3.9 2.8.7 3.3.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.2-.2-.5-.3l-1.8-.9c-.2-.1-.4-.1-.6.1l-.8 1c-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.5.3-.5c.1-.2 0-.3 0-.5L10 8.6c-.2-.4-.4-.4-.6-.4H9Z"
      fill="currentColor"
      stroke="none"
    />
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('size-6 shrink-0', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
