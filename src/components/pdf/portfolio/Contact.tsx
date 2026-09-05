// src/components/pdf/portfolio/Contact.tsx
// Page 7. Every way to reach the production; the WhatsApp line is a live link.
import { Link, Text, View } from '@react-pdf/renderer';
import { bandInfo, release } from '@/data/band';
import { contact } from '@/data/contact';
import { portfolio } from '@/data/copy/portfolio';
import { CONTENT_WIDTH, pdfColors, pdfStyles } from '../theme';
import { WordmarkPdf } from '../WordmarkPdf';
import { Fact, PdfPage } from './chrome';

const c = portfolio.pdf.contact;

export function Contact() {
  return (
    <PdfPage n={7} label={c.title} title={c.headline} lead={c.lead}>
      <View style={{ ...pdfStyles.card, padding: 20, marginTop: 6 }}>
        <Text style={pdfStyles.labelMuted}>{c.whatsappLabel}</Text>
        <Text style={{ marginTop: 4, fontSize: 26, fontWeight: 600, letterSpacing: -0.5, color: pdfColors.ink }}>{contact.phone}</Text>
        <Link src={contact.whatsappQuoteLink} style={{ marginTop: 6, fontSize: 9.5, color: pdfColors.led, textDecoration: 'none' }}>
          {c.whatsappCta} →
        </Link>
      </View>

      <View style={{ marginTop: 18, flexDirection: 'row', flexWrap: 'wrap', gap: 18 }}>
        <View style={{ width: 240 }}>
          <Fact label={c.emailLabel} value={contact.email} />
        </View>
        <View style={{ width: 240 }}>
          <Fact label={c.instagramLabel} value={contact.instagram} />
        </View>
        <View style={{ width: 240 }}>
          <Fact label={c.siteLabel} value={contact.website} />
        </View>
        <View style={{ width: 240 }}>
          <Fact label={c.addressLabel} value={contact.addressFull} />
        </View>
        <View style={{ width: 240 }}>
          <Fact label={c.cnpjLabel} value={bandInfo.cnpj} />
        </View>
      </View>

      <View style={{ position: 'absolute', left: 40, right: 40, bottom: 90 }}>
        <WordmarkPdf width={CONTENT_WIDTH * 0.5} />
        <Text style={{ marginTop: 14, fontSize: 13, fontWeight: 600, letterSpacing: -0.2, color: pdfColors.ink }}>{release.slogan}</Text>
        <Text style={{ ...pdfStyles.caption, marginTop: 6 }}>
          {release.sloganFootnote} · {release.values.join(' · ')}
        </Text>
      </View>
    </PdfPage>
  );
}
