// "/arquivo/cartaz/<id>" reached from inside the site: the photograph opens in the
// lightbox, over the page the visitor was on. A layout, so the dialog stays
// mounted while the photographs inside it change.
import { gallery } from '@/data/media/gallery';
import { LightboxDialog } from '@/components/media/lightbox/LightboxDialog';

export default function ArquivoLightboxLayout({ children }: { children: React.ReactNode }) {
  const { labels } = gallery.arquivo;
  return (
    <LightboxDialog label={labels.title} keys={labels.keys}>
      {children}
    </LightboxDialog>
  );
}
