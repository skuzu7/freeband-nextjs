'use client';

// src/components/site/LegacyAnchors.tsx
// The old site was one page with anchors (#palco, #arquivo, #historia…). Links
// already printed or shared keep working: a hash the new home does not have is
// mapped to the page that took over, without a round-trip to the server.
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const LEGACY: Record<string, string> = {
  '#palco': '/palco',
  '#video': '/palco#show',
  '#arquivo': '/arquivo',
  '#historia': '/historia',
  '#pacotes': '/#caminhao',
  '#hero': '/',
};

export function LegacyAnchors() {
  const router = useRouter();
  useEffect(() => {
    const target = LEGACY[window.location.hash];
    if (target) router.replace(target);
  }, [router]);
  return null;
}
