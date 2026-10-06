// src/components/pdf/portfolio/Services.tsx
// Page 6, on paper. The two packages side by side — the one most asked for is
// the lit one, a night panel; the other stays on paper — then the formats,
// what is included, and a photograph of the rig mounted.
import { Text, View } from '@react-pdf/renderer';
import { portfolio } from '@/data/copy/portfolio';
import { includedFeatures, servicePackages, services, type ServicePackage } from '@/data/packages';
import { DotLinePdf, PhotoPdf } from '../motifs';
import { CONTENT_WIDTH, pdfTones, pdfType } from '../theme';
import { Bullet, PdfPage } from './chrome';
import { pdfPhotos } from './images';

const c = portfolio.pdf.services;
const paper = pdfTones.paper;
const type = pdfType.paper;

const PACKAGE_GAP = 10;
const PACKAGE_PAD = 16;
const PACKAGE_WIDTH = (CONTENT_WIDTH - PACKAGE_GAP * (servicePackages.length - 1)) / servicePackages.length;
const SIDE_WIDTH = 200;

function Package({ pkg }: { pkg: ServicePackage }) {
  const tone = pkg.highlighted ? 'night' : 'paper';
  const t = pdfTones[tone];
  const kind = pdfType[tone];
  return (
    <View
      style={{
        width: PACKAGE_WIDTH,
        padding: PACKAGE_PAD,
        backgroundColor: pkg.highlighted ? t.surface : t.raise,
        borderWidth: 0.75,
        borderColor: pkg.highlighted ? t.surface : t.line,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={kind.label}>{pkg.name}</Text>
        {pkg.highlighted && <Text style={{ ...kind.caption, color: t.ink }}>{c.highlightBadge}</Text>}
      </View>
      <View style={{ marginTop: 8 }}>
        <DotLinePdf width={PACKAGE_WIDTH - PACKAGE_PAD * 2} color={pkg.highlighted ? t.led : t.ledDim} />
      </View>
      <Text style={{ ...kind.body, marginTop: 9, marginBottom: 10 }}>{pkg.description}</Text>
      <View style={{ gap: 4 }}>
        {pkg.features.map((f) => (
          <Bullet key={f} text={f} tone={tone} />
        ))}
      </View>
    </View>
  );
}

export function Services() {
  return (
    <PdfPage n={6} label={c.title} title={c.headline} lead={c.lead}>
      <View style={{ flexDirection: 'row', gap: PACKAGE_GAP }}>
        {servicePackages.map((pkg) => (
          <Package key={pkg.id} pkg={pkg} />
        ))}
      </View>

      <View style={{ marginTop: 20, flexDirection: 'row', gap: 24 }}>
        <View style={{ width: SIDE_WIDTH }}>
          <Text style={type.label}>{c.formatsLabel}</Text>
          <View style={{ marginTop: 8, gap: 7 }}>
            {services.map((s) => (
              <View key={s.title}>
                <Text style={{ fontSize: 10, fontWeight: 600, color: paper.ink }}>{s.title}</Text>
                <Text style={{ fontSize: 8, lineHeight: 1.4, color: paper.inkMuted }}>{s.description}</Text>
              </View>
            ))}
          </View>
          {/* The rig, mounted — under the formats, where the column has room. */}
          <View style={{ marginTop: 18 }}>
            <Text style={{ ...type.label, marginBottom: 7 }}>{c.rigLabel}</Text>
            <PhotoPdf frame={pdfPhotos.estruturaBoate} width={SIDE_WIDTH} />
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={type.label}>{c.includedLabel}</Text>
          <View style={{ marginTop: 8, gap: 8 }}>
            {includedFeatures.map((group) => (
              <View key={group.title}>
                <Text style={{ fontSize: 9.5, fontWeight: 600, color: paper.ink }}>
                  {group.title}
                  {'optional' in group && group.optional ? ` · ${c.optionalNote}` : ''}
                </Text>
                <View style={{ marginTop: 2, gap: 1.5 }}>
                  {group.items.map((item) => (
                    <Bullet key={item} text={item} small />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </PdfPage>
  );
}
