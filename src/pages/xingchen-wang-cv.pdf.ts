import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import PDFDocument from 'pdfkit';
import sharp from 'sharp';
import { PRINCIPLES, SITE, SOCIAL, emailAddress } from '../consts';
import { CV } from '../lib/cv';

// A real PDF, generated at build time from the same content as the CV page —
// text stays selectable, links stay clickable, and nothing needs a browser.
// Laid out by hand to mirror the page: a label column on the left, content on
// the right, hairlines between sections. Standard Helvetica keeps it tiny.

const MARGIN = 50;
const LABEL_X = MARGIN;
const BODY_X = MARGIN + 128;
const ROW_TITLE_W = 108;
const COLORS = { ink: '#16181d', soft: '#4a4e57', faint: '#81858e', line: '#d9d6cf', accent: '#0f766e' };

export const GET: APIRoute = async () => {
  const avatar = await sharp(await readFile(join(process.cwd(), 'src/assets/bio-photo.jpg')))
    .resize(200, 200)
    .jpeg({ quality: 85 })
    .toBuffer();

  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
    info: { Title: `${SITE.name} — CV`, Author: SITE.name, Subject: 'Curriculum vitae' },
  });
  const chunks: Buffer[] = [];
  doc.on('data', (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));

  const pageW = doc.page.width;
  const bodyW = pageW - MARGIN - BODY_X;

  // ---- header --------------------------------------------------------
  const top = doc.y;
  doc.save().roundedRect(MARGIN, top, 56, 56, 12).clip().image(avatar, MARGIN, top, { width: 56, height: 56 }).restore();
  const textX = MARGIN + 56 + 16;
  doc.font('Helvetica-Bold').fontSize(24).fillColor(COLORS.ink).text(SITE.name, textX, top + 2, { lineBreak: false });
  doc.font('Helvetica').fontSize(10.5).fillColor(COLORS.soft).text('Image Algorithms R&D / Technical Project Leader', textX, top + 32, { lineBreak: false });
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.faint);
  const site = SITE.url.replace('https://', '');
  const li = SOCIAL.linkedin.replace('https://www.', '');
  const linkY = top + 70;
  const email = emailAddress();
  const parts = [
    { text: site, link: SITE.url },
    { text: li, link: SOCIAL.linkedin },
    { text: email, link: `mailto:${email}` },
  ];
  let x = MARGIN;
  parts.forEach((part, i) => {
    if (i > 0) {
      doc.text('·', x + 7, linkY, { lineBreak: false });
      x += 18;
    }
    doc.text(part.text, x, linkY, { link: part.link, lineBreak: false });
    x += doc.widthOfString(part.text);
  });

  let y = top + 98;
  const rule = () => {
    doc.moveTo(MARGIN, y).lineTo(pageW - MARGIN, y).lineWidth(0.6).strokeColor(COLORS.line).stroke();
    y += 16;
  };
  const label = (text: string) => {
    doc.font('Helvetica-Bold').fontSize(7).fillColor(COLORS.faint).text(text.toUpperCase(), LABEL_X, y + 3, {
      characterSpacing: 1.1,
      lineBreak: false,
    });
  };
  const ensure = (h: number) => {
    if (y + h > doc.page.height - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  // ---- summary -------------------------------------------------------
  rule();
  doc.font('Helvetica').fontSize(13);
  const nowH = doc.heightOfString(CV.now, { width: bodyW, lineGap: 2 });
  doc.font('Helvetica').fontSize(9.5);
  const beforeText = `BEFORE   ${CV.before}`;
  const beforeH = doc.heightOfString(beforeText, { width: bodyW, lineGap: 1.5 });
  ensure(nowH + beforeH + 40);
  label('Summary');
  doc.font('Helvetica').fontSize(13).fillColor(COLORS.ink).text(CV.now, BODY_X, y, { width: bodyW, lineGap: 2 });
  const beforeY = y + nowH + 10;
  doc.font('Helvetica-Bold').fontSize(6.5).fillColor(COLORS.faint).text('BEFORE', BODY_X, beforeY + 2, { characterSpacing: 0.8, lineBreak: false });
  doc.font('Helvetica').fontSize(9.5).fillColor(COLORS.soft).text(CV.before, BODY_X + 50, beforeY, { width: bodyW - 50, lineGap: 1.5 });
  y = beforeY + doc.heightOfString(CV.before, { width: bodyW - 50, lineGap: 1.5 }) + 18;

  // ---- label / value sections ---------------------------------------
  const section = (name: string, items: readonly { title: string; body: string; quiet?: boolean; href?: string }[]) => {
    rule();
    let first = true;
    for (const r of items) {
      const quiet = !!r.quiet;
      const size = quiet ? 8.8 : 9.5;
      doc.font(quiet ? 'Helvetica' : 'Helvetica-Bold').fontSize(size);
      const tH = doc.heightOfString(r.title, { width: ROW_TITLE_W });
      doc.font('Helvetica').fontSize(size);
      const bH = doc.heightOfString(r.body, { width: bodyW - ROW_TITLE_W - 14, lineGap: 1.5 });
      const h = Math.max(tH, bH);
      ensure(h + 12);
      if (first) {
        label(name);
        first = false;
      }
      doc.font(quiet ? 'Helvetica' : 'Helvetica-Bold').fontSize(size).fillColor(quiet ? COLORS.faint : COLORS.ink).text(r.title, BODY_X, y, { width: ROW_TITLE_W, link: r.href });
      doc.font('Helvetica').fontSize(size).fillColor(quiet ? COLORS.faint : COLORS.soft).text(r.body, BODY_X + ROW_TITLE_W + 14, y, { width: bodyW - ROW_TITLE_W - 14, lineGap: 1.5 });
      y += h + 11;
    }
    y += 6;
  };

  section('Skills', CV.skills);
  section('Open source', CV.openSource);
  section('Philosophies', PRINCIPLES.map((p) => ({ title: p.title, body: p.short })));
  section('Interests', CV.interests);

  doc.end();
  const pdf = await done;
  return new Response(new Uint8Array(pdf), {
    headers: { 'Content-Type': 'application/pdf' },
  });
};
