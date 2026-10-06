'use client';

// The error boundary of the public pages. It sits inside the site shell, so
// the header and footer stay; only the page that failed is replaced by a way
// to try again and a way out.
import { useEffect } from 'react';
import { system } from '@/data/copy/system';
import { WhatsAppCta } from '@/components/site/WhatsAppCta';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { site } from '@/data/copy/site';

interface ErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function SiteError({ error, retry }: ErrorProps) {
  useEffect(() => {
    // The digest matches the entry in the server log.
    console.error(error);
  }, [error]);

  const copy = system.error;
  return (
    <Container className="flex min-h-[70svh] flex-col justify-center gap-10 py-24">
      <SectionHeader as="h1" size="page" id="error-title" label={copy.label} headline={copy.headline} lead={copy.lead} />
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => retry()}>{copy.retry}</Button>
        <Button variant="secondary" href="/">
          {copy.home}
        </Button>
        <WhatsAppCta>{site.nav.cta.label}</WhatsAppCta>
      </div>
    </Container>
  );
}
