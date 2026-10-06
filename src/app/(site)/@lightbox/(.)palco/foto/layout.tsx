// "/palco/foto/<id>" reached from inside the site: the photograph opens in the
// lightbox, over the page the visitor was on. A layout, so the dialog stays
// mounted while the photographs inside it change.
import { gallery } from '@/data/media/gallery';
import { LightboxDialog } from '@/components/media/lightbox/LightboxDialog';

export default function PalcoLightboxLayout({ children }: { children: React.ReactNode }) {
  const { labels } = gallery.palco;
  return (
    <LightboxDialog label={labels.title} keys={labels.keys}>
      {children}
    </LightboxDialog>
  );
}
