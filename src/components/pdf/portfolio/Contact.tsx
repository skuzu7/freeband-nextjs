// src/components/pdf/portfolio/Contact.tsx
// Page 7, on night: the back cover. The production's number is on the panel,
// in the dot matrix, across the page; the one red thing is the action — the
// WhatsApp link — so the wall at the foot spells the name in dots alone, with
// no acrylic to compete with it. The cover hangs its wall from the top of the
// page; this one rises from the bottom.
import { Link, Text, View } from '@react-pdf/renderer';
import { bandInfo, release } from '@/data/band';
import { contact } from '@/data/contact';
import { portfolio } from '@/data/copy/portfolio';
import { LedWallPdf, wallPitch, wallSize } from '../LedWallPdf';
import { DotLinePdf, LedNumberPdf, ledNumberWidth } from '../motifs';
import { A4, CONTENT_WIDTH, pdfTones, pdfType } from '../theme';
import type { WallPad } from '../wall';
import { PdfPage } from './chrome';

const c = portfolio.pdf.contact;
const t = pdfTones.night;
const type = pdfType.night;

// The matrix has digits and blanks: "(16) 99773-2749" is shown as its groups.
const phoneDigits = contact.phone.match(/\d+/g)?.join(' ') ?? '';
// Set to the width of the page's column: one cell is whatever that leaves.
const PHONE_HEIGHT = (CONTENT_WIDTH * 7) / ledNumberWidth(phoneDigits, 7);

/** Bottom edge of the wall, from the bottom of the page: clear of the footer. */
const WALL_BOTTOM = 70;
const side = Math.ceil(A4.margin / wallPitch(CONTENT_WIDTH));
const PAD: WallPad = { left: side, right: side, top: 16, bottom: 7 };
const FADE = { top: 12, bottom: 5 };
const wall = wallSize(CONTENT_WIDTH, PAD);

interface LinkedFactProps {
  label: string;
  value: string;
  href?: string;
}

function LinkedFact({ label, value, href }: LinkedFactProps) {
  const valueStyle = { marginTop: 3, fontSize: 11, color: t.ink, textDecoration: 'none' } as const;
  return (
    <View style={{ width: CONTENT_WIDTH / 2, marginBottom: 14 }}>
      <Text style={type.labelMuted}>{label}</Text>
      {href ? (
        <Link src={href} style={valueStyle}>
          {value}
        </Link>
      ) : (
        <Text style={valueStyle}>{value}</Text>
      )}
    </View>
  );
}

export function Contact() {
  return (
    <PdfPage n={7} label={c.title} title={c.headline} lead={c.lead} tone="night">
      <Text style={type.labelMuted}>{c.whatsappLabel}</Text>
      <View style={{ marginTop: 12 }}>
        <LedNumberPdf value={phoneDigits} height={PHONE_HEIGHT} color={t.led} dimColor={t.ledDim} />
      </View>

      <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', gap: 18 }}>
        {/* The primary action, and the only red on the page. */}
        <Link src={contact.whatsappQuoteLink} style={{ textDecoration: 'none' }}>
          <View style={{ backgroundColor: t.red, paddingVertical: 11, paddingHorizontal: 18 }}>
            <Text style={{ fontSize: 11, fontWeight: 600, color: t.onRed }}>{c.whatsappCta} →</Text>
          </View>
        </Link>
        <Text style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2, lineHeight: 1.2, color: t.ink }}>{contact.phone}</Text>
      </View>

      <View style={{ marginTop: 26 }}>
        <DotLinePdf width={CONTENT_WIDTH} color={t.ledDim} />
      </View>
      <View style={{ marginTop: 18, flexDirection: 'row', flexWrap: 'wrap' }}>
        <LinkedFact label={c.emailLabel} value={contact.email} href={`mailto:${contact.email}`} />
        <LinkedFact label={c.instagramLabel} value={contact.instagram} href={contact.instagramUrl} />
        <LinkedFact label={c.siteLabel} value={contact.website} href={contact.siteUrl} />
        <LinkedFact label={c.addressLabel} value={contact.addressFull} />
        <LinkedFact label={c.cnpjLabel} value={bandInfo.cnpj} />
      </View>

      <View style={{ position: 'absolute', left: A4.margin, right: A4.margin, bottom: WALL_BOTTOM + wall.height + 14 }}>
        <Text style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.3, lineHeight: 1.25, color: t.ink }}>{release.slogan}</Text>
        <Text style={{ ...type.caption, marginTop: 7 }}>
          {release.sloganFootnote} · {release.values.join(' · ')}
        </Text>
      </View>
      <View style={{ position: 'absolute', left: A4.margin - wall.markLeft, bottom: WALL_BOTTOM }}>
        <LedWallPdf width={CONTENT_WIDTH} pad={PAD} fade={FADE} acrylic={false} />
      </View>
    </PdfPage>
  );
}
