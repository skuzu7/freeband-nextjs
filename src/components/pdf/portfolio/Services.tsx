// src/components/pdf/portfolio/Services.tsx
// Page 6. The two packages side by side, the formats, what is included, and
// two photographs of the rig mounted.
import { Text, View } from '@react-pdf/renderer';
import { portfolio } from '@/data/copy/portfolio';
import { includedFeatures, servicePackages, services } from '@/data/packages';
import { PlateRowPdf } from '../motifs';
import { pdfColors, pdfStyles } from '../theme';
import { PdfPage } from './chrome';
import { pdfPhotos } from './images';

const c = portfolio.pdf.services;

function Bullet({ text, small = false }: { text: string; small?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-start' }}>
      <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: pdfColors.led, marginTop: small ? 3.5 : 4.5 }} />
      <Text style={{ fontSize: small ? 8 : 9, color: small ? pdfColors.inkMuted : pdfColors.ink, flex: 1 }}>{text}</Text>
    </View>
  );
}

export function Services() {
  return (
    <PdfPage n={6} label={c.title} title={c.headline} lead={c.lead}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {servicePackages.map((pkg) => (
          <View
            key={pkg.id}
            style={{
              ...pdfStyles.card,
              flex: 1,
              padding: 14,
              borderColor: pkg.highlighted ? pdfColors.led : pdfColors.line,
              borderWidth: pkg.highlighted ? 1.25 : 0.75,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={pdfStyles.label}>{pkg.name}</Text>
              {pkg.highlighted && <Text style={{ ...pdfStyles.caption, color: pdfColors.led }}>{c.highlightBadge}</Text>}
            </View>
            <Text style={{ ...pdfStyles.body, marginTop: 6, marginBottom: 10 }}>{pkg.description}</Text>
            <View style={{ gap: 4 }}>
              {pkg.features.map((f) => (
                <Bullet key={f} text={f} />
              ))}
            </View>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 14, flexDirection: 'row', gap: 24 }}>
        <View style={{ width: 200 }}>
          <Text style={pdfStyles.label}>{c.formatsLabel}</Text>
          <View style={{ marginTop: 8, gap: 6 }}>
            {services.map((s) => (
              <View key={s.title}>
                <Text style={{ fontSize: 10, fontWeight: 600, color: pdfColors.ink }}>{s.title}</Text>
                <Text style={{ fontSize: 8, color: pdfColors.inkMuted }}>{s.description}</Text>
              </View>
            ))}
          </View>
          {/* The rig, mounted — under the formats, where the column has room. */}
          <View style={{ marginTop: 16 }}>
            <Text style={{ ...pdfStyles.label, marginBottom: 6 }}>{c.rigLabel}</Text>
            <PlateRowPdf frames={[pdfPhotos.estruturaBoate, pdfPhotos.estruturaLuz]} width={200} />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={pdfStyles.label}>{c.includedLabel}</Text>
          <View style={{ marginTop: 8, gap: 7 }}>
            {includedFeatures.map((group) => (
              <View key={group.title}>
                <Text style={{ fontSize: 9, fontWeight: 600, color: pdfColors.ink }}>
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
