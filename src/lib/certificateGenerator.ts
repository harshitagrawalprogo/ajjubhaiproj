import type { Member } from './supabase';
import { TIER_COLORS } from './membershipDb';

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + ' ';
    if (ctx.measureText(test).width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, y);
      line = words[i] + ' ';
      y += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, y);
}

// ─────────────────────────────────────────────────────────────
//  MEMBERSHIP CERTIFICATE  (1122 × 794 px – A4 landscape @96dpi)
// ─────────────────────────────────────────────────────────────
export async function generateCertificate(member: Member): Promise<string> {
  const W = 1122, H = 794;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  const tierColor = TIER_COLORS[member.membership_tier] || '#c9a84c';
  const navy = '#0d1b3e';
  const gold = '#c9a84c';

  // ── Background ──────────────────────────────────────────────
  // Cream-white base
  ctx.fillStyle = '#fdfaf5';
  ctx.fillRect(0, 0, W, H);

  // Decorative side bands
  const leftGrad = ctx.createLinearGradient(0, 0, 60, 0);
  leftGrad.addColorStop(0, navy);
  leftGrad.addColorStop(1, '#1a3060');
  ctx.fillStyle = leftGrad;
  ctx.fillRect(0, 0, 54, H);

  const rightGrad = ctx.createLinearGradient(W - 54, 0, W, 0);
  rightGrad.addColorStop(0, '#1a3060');
  rightGrad.addColorStop(1, navy);
  ctx.fillStyle = rightGrad;
  ctx.fillRect(W - 54, 0, 54, H);

  // Gold accent stripes inside bands
  ctx.fillStyle = gold;
  ctx.fillRect(50, 0, 4, H);
  ctx.fillRect(W - 54, 0, 4, H);

  // Top/bottom bars
  ctx.fillStyle = navy;
  ctx.fillRect(54, 0, W - 108, 55);
  ctx.fillRect(54, H - 55, W - 108, 55);

  // Gold line under top bar
  ctx.fillStyle = gold;
  ctx.fillRect(54, 55, W - 108, 3);
  ctx.fillRect(54, H - 58, W - 108, 3);

  // Subtle background watermark circle
  const wGrad = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, 340);
  wGrad.addColorStop(0, 'rgba(201,168,76,0.06)');
  wGrad.addColorStop(1, 'rgba(201,168,76,0)');
  ctx.fillStyle = wGrad;
  ctx.fillRect(0, 0, W, H);

  // ── Logo ────────────────────────────────────────────────────
  try {
    const logo = await loadImage('/logo.png');
    ctx.save();
    ctx.beginPath();
    ctx.arc(W / 2, 110, 46, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(logo, W / 2 - 46, 64, 92, 92);
    ctx.restore();
    // Ring around logo
    ctx.strokeStyle = gold;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(W / 2, 110, 47, 0, Math.PI * 2);
    ctx.stroke();
  } catch { /* logo failed to load */ }

  // ── Header text ─────────────────────────────────────────────
  ctx.fillStyle = navy;
  ctx.font = 'bold 13px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '3px';
  ctx.fillText('LIS ACADEMY', W / 2, 30);
  ctx.font = '10px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('A PROFESSIONAL PUBLIC CHARITABLE TRUST', W / 2, 43);
  ctx.letterSpacing = '0px';

  // ── "MEMBERSHIP CERTIFICATE" title ──────────────────────────
  ctx.fillStyle = navy;
  ctx.font = 'bold 11px "Inter", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('CERTIFICATE OF MEMBERSHIP', W / 2, 178);
  ctx.letterSpacing = '0px';

  // Decorative divider
  const divW = 260;
  const divX = W / 2;
  ctx.strokeStyle = gold;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(divX - divW / 2, 186);
  ctx.lineTo(divX + divW / 2, 186);
  ctx.stroke();
  // Diamond
  ctx.save();
  ctx.translate(divX, 186);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = gold;
  ctx.fillRect(-4, -4, 8, 8);
  ctx.restore();

  // ── Membership tier badge ────────────────────────────────────
  const tierLabel = member.membership_tier.charAt(0).toUpperCase() + member.membership_tier.slice(1) + ' Member';
  ctx.fillStyle = tierColor;
  const badgeW = 180;
  roundRect(ctx, W / 2 - badgeW / 2, 196, badgeW, 26, 13);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 10px "Inter", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText(tierLabel.toUpperCase(), W / 2, 212);
  ctx.letterSpacing = '0px';

  // ── Main text ───────────────────────────────────────────────
  ctx.fillStyle = '#555';
  ctx.font = '14px "Inter", sans-serif';
  ctx.fillText('This is to certify that', W / 2, 258);

  // Member name
  ctx.fillStyle = navy;
  ctx.font = 'bold 34px "Playfair Display", Georgia, serif';
  ctx.fillText(member.name, W / 2, 305);

  // Gold underline
  const nameW = ctx.measureText(member.name).width;
  const lineLeft = W / 2 - Math.min(nameW / 2, 260);
  const lineRight = W / 2 + Math.min(nameW / 2, 260);
  ctx.strokeStyle = gold;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(lineLeft, 312);
  ctx.lineTo(lineRight, 312);
  ctx.stroke();

  // Designation + institution
  ctx.fillStyle = '#666';
  ctx.font = '13px "Inter", sans-serif';
  const pos = [member.designation, member.institution].filter(Boolean).join(' — ');
  ctx.fillText(pos, W / 2, 334);

  // Body text
  ctx.fillStyle = '#555';
  ctx.font = '13px "Inter", sans-serif';
  const bodyY = 364;
  wrapText(
    ctx,
    'has been duly enrolled as a member of the LIS Academy — a Professional Public Charitable Trust committed to advancing the Library & Information Science profession through education, technology, and research.',
    W / 2, bodyY, 720, 20
  );

  // ── Membership ID ────────────────────────────────────────────
  ctx.fillStyle = '#f5f0e8';
  roundRect(ctx, W / 2 - 140, 436, 280, 44, 8);
  ctx.fill();
  ctx.strokeStyle = gold;
  ctx.lineWidth = 1;
  roundRect(ctx, W / 2 - 140, 436, 280, 44, 8);
  ctx.stroke();
  ctx.fillStyle = '#888';
  ctx.font = '10px "Inter", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('MEMBERSHIP ID', W / 2, 452);
  ctx.letterSpacing = '0px';
  ctx.fillStyle = navy;
  ctx.font = 'bold 16px "Inter", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText(member.membership_id, W / 2, 470);
  ctx.letterSpacing = '0px';

  // ── Valid from ───────────────────────────────────────────────
  const joinDate = new Date(member.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.fillStyle = '#888';
  ctx.font = '12px "Inter", sans-serif';
  ctx.fillText(`Issued on: ${new Date(member.issue_date || member.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, W / 2, 502);

  // ── Signature section ────────────────────────────────────────
  const sigY = 610;
  // Left: Chairman
  ctx.strokeStyle = navy;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(160, sigY);
  ctx.lineTo(360, sigY);
  ctx.stroke();
  ctx.fillStyle = navy;
  ctx.font = 'bold 12px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Chairman', 260, sigY + 18);
  ctx.fillStyle = '#888';
  ctx.font = '11px "Inter", sans-serif';
  ctx.fillText('LIS Academy', 260, sigY + 33);

  // Right: Secretary
  ctx.strokeStyle = navy;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(762, sigY);
  ctx.lineTo(962, sigY);
  ctx.stroke();
  ctx.fillStyle = navy;
  ctx.font = 'bold 12px "Inter", sans-serif';
  ctx.fillText('Secretary', 862, sigY + 18);
  ctx.fillStyle = '#888';
  ctx.font = '11px "Inter", sans-serif';
  ctx.fillText('LIS Academy', 862, sigY + 33);

  // ── Official seal placeholder ────────────────────────────────
  ctx.strokeStyle = gold;
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(W / 2, sigY - 10, 42, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(201,168,76,0.08)';
  ctx.beginPath();
  ctx.arc(W / 2, sigY - 10, 42, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = gold;
  ctx.font = 'bold 9px "Inter", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('OFFICIAL', W / 2, sigY - 14);
  ctx.fillText('SEAL', W / 2, sigY);
  ctx.letterSpacing = '0px';

  // ── Footer bar text ──────────────────────────────────────────
  ctx.fillStyle = '#fff';
  ctx.font = '10px "Inter", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('info@lisacademy.org  |  080-35006965  |  www.lisacademy.org', W / 2, H - 20);
  ctx.letterSpacing = '0px';

  return canvas.toDataURL('image/png');
}

// ─────────────────────────────────────────────────────────────
//  MEMBERSHIP ID CARD  (638 × 402 px – CR80 credit card)
// ─────────────────────────────────────────────────────────────
export async function generateIdCard(member: Member): Promise<{ front: string; back: string }> {
  const W = 638, H = 402;
  const tierColor = TIER_COLORS[member.membership_tier] || '#c9a84c';

  // ── FRONT ───────────────────────────────────────────────────
  const front = document.createElement('canvas');
  front.width = W;
  front.height = H;
  const fc = front.getContext('2d')!;

  // Background gradient
  const bg = fc.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0d1b3e');
  bg.addColorStop(0.6, '#1a3060');
  bg.addColorStop(1, '#112244');
  fc.fillStyle = bg;
  fc.fillRect(0, 0, W, H);

  // Decorative circle accent (top-right)
  fc.strokeStyle = 'rgba(201,168,76,0.25)';
  fc.lineWidth = 40;
  fc.beginPath();
  fc.arc(W + 30, -30, 200, 0, Math.PI * 2);
  fc.stroke();

  // Thin gold stripe at top
  fc.fillStyle = '#c9a84c';
  fc.fillRect(0, 0, W, 5);

  // Tier color stripe at bottom
  fc.fillStyle = tierColor;
  fc.fillRect(0, H - 5, W, 5);

  // ── Logo (left side) ────────────────────────────────────────
  try {
    const logo = await loadImage('/logo.png');
    fc.save();
    fc.beginPath();
    fc.arc(74, 80, 44, 0, Math.PI * 2);
    fc.closePath();
    fc.clip();
    fc.drawImage(logo, 30, 36, 88, 88);
    fc.restore();
    fc.strokeStyle = '#c9a84c';
    fc.lineWidth = 2;
    fc.beginPath();
    fc.arc(74, 80, 45, 0, Math.PI * 2);
    fc.stroke();
  } catch { /* skip */ }

  // Academy name
  fc.fillStyle = '#ffffff';
  fc.textAlign = 'left';
  fc.font = 'bold 22px "Inter", sans-serif';
  fc.fillText('LIS ACADEMY', 138, 68);
  fc.font = '10px "Inter", sans-serif';
  fc.fillStyle = '#c9a84c';
  fc.letterSpacing = '2px';
  fc.fillText('LEARN | INSPIRE | SERVE', 139, 86);
  fc.letterSpacing = '0px';

  // Divider line
  fc.strokeStyle = 'rgba(201,168,76,0.4)';
  fc.lineWidth = 1;
  fc.beginPath();
  fc.moveTo(30, 142);
  fc.lineTo(W - 30, 142);
  fc.stroke();

  // Member photo (right side placeholder)
  const photoX = W - 130, photoY = 155, photoSize = 110;
  fc.fillStyle = 'rgba(255,255,255,0.08)';
  roundRect(fc, photoX, photoY, photoSize, photoSize, 8);
  fc.fill();
  fc.strokeStyle = 'rgba(201,168,76,0.5)';
  fc.lineWidth = 1.5;
  roundRect(fc, photoX, photoY, photoSize, photoSize, 8);
  fc.stroke();
  const memberPhoto = member.photo_data_url || member.photo_url;
  if (memberPhoto) {
    try {
      const photo = await loadImage(memberPhoto);
      fc.save();
      roundRect(fc, photoX, photoY, photoSize, photoSize, 8);
      fc.clip();
      fc.drawImage(photo, photoX, photoY, photoSize, photoSize);
      fc.restore();
    } catch { /* skip */ }
  } else {
    fc.fillStyle = 'rgba(255,255,255,0.3)';
    fc.font = '11px "Inter", sans-serif';
    fc.textAlign = 'center';
    fc.fillText('PHOTO', photoX + photoSize / 2, photoY + photoSize / 2 + 4);
    fc.textAlign = 'left';
  }

  // Member information
  const infoX = 30;
  let infoY = 170;

  fc.fillStyle = 'rgba(201,168,76,0.7)';
  fc.font = '9px "Inter", sans-serif';
  fc.letterSpacing = '2px';
  fc.fillText('MEMBER NAME', infoX, infoY);
  fc.letterSpacing = '0px';
  infoY += 18;
  fc.fillStyle = '#ffffff';
  fc.font = 'bold 20px "Inter", sans-serif';
  fc.fillText(member.name, infoX, infoY);
  infoY += 24;

  fc.fillStyle = 'rgba(201,168,76,0.7)';
  fc.font = '9px "Inter", sans-serif';
  fc.letterSpacing = '2px';
  fc.fillText('DESIGNATION', infoX, infoY);
  fc.letterSpacing = '0px';
  infoY += 16;
  fc.fillStyle = 'rgba(255,255,255,0.8)';
  fc.font = '13px "Inter", sans-serif';
  const designation = member.designation || '—';
  fc.fillText(designation.length > 28 ? designation.slice(0, 28) + '…' : designation, infoX, infoY);
  infoY += 22;

  fc.fillStyle = 'rgba(201,168,76,0.7)';
  fc.font = '9px "Inter", sans-serif';
  fc.letterSpacing = '2px';
  fc.fillText('INSTITUTION', infoX, infoY);
  fc.letterSpacing = '0px';
  infoY += 16;
  fc.fillStyle = 'rgba(255,255,255,0.8)';
  fc.font = '12px "Inter", sans-serif';
  const inst = member.institution || '—';
  fc.fillText(inst.length > 34 ? inst.slice(0, 34) + '…' : inst, infoX, infoY);

  // Membership ID band
  fc.fillStyle = tierColor + '33';
  roundRect(fc, 30, 308, W - 60, 42, 6);
  fc.fill();
  fc.strokeStyle = tierColor + '88';
  fc.lineWidth = 1;
  roundRect(fc, 30, 308, W - 60, 42, 6);
  fc.stroke();

  fc.fillStyle = 'rgba(255,255,255,0.5)';
  fc.font = '9px "Inter", sans-serif';
  fc.textAlign = 'left';
  fc.letterSpacing = '2px';
  fc.fillText('MEMBERSHIP ID', 44, 324);
  fc.letterSpacing = '0px';
  fc.fillStyle = '#ffffff';
  fc.font = 'bold 17px "Inter", sans-serif';
  fc.letterSpacing = '2px';
  fc.fillText(member.membership_id, 44, 342);
  fc.letterSpacing = '0px';

  // Tier badge (right of ID band)
  fc.fillStyle = tierColor;
  const tierLabel = member.membership_tier.charAt(0).toUpperCase() + member.membership_tier.slice(1);
  const badgeW2 = 110;
  roundRect(fc, W - 30 - badgeW2, 315, badgeW2, 28, 14);
  fc.fill();
  fc.fillStyle = '#fff';
  fc.font = 'bold 10px "Inter", sans-serif';
  fc.textAlign = 'center';
  fc.letterSpacing = '1px';
  fc.fillText(tierLabel.toUpperCase() + ' MEMBER', W - 30 - badgeW2 / 2, 333);
  fc.letterSpacing = '0px';

  // Footer
  fc.fillStyle = 'rgba(255,255,255,0.35)';
  fc.font = '9px "Inter", sans-serif';
  fc.textAlign = 'center';
  fc.fillText('info@lisacademy.org  |  080-35006965', W / 2, H - 14);

  // ── BACK ────────────────────────────────────────────────────
  const back = document.createElement('canvas');
  back.width = W;
  back.height = H;
  const bc = back.getContext('2d')!;

  // Background
  const bg2 = bc.createLinearGradient(0, 0, W, H);
  bg2.addColorStop(0, '#0a1428');
  bg2.addColorStop(1, '#0d1b3e');
  bc.fillStyle = bg2;
  bc.fillRect(0, 0, W, H);

  // Gold stripes
  bc.fillStyle = '#c9a84c';
  bc.fillRect(0, 0, W, 5);
  bc.fillStyle = tierColor;
  bc.fillRect(0, H - 5, W, 5);

  // Watermark logo
  try {
    const logo2 = await loadImage('/logo.png');
    bc.globalAlpha = 0.05;
    bc.drawImage(logo2, W / 2 - 120, H / 2 - 120, 240, 240);
    bc.globalAlpha = 1;
  } catch { /* skip */ }

  // Magnetic stripe bar
  bc.fillStyle = '#111';
  bc.fillRect(0, 45, W, 48);

  // Signature strip
  bc.fillStyle = '#fff';
  roundRect(bc, 30, 122, W - 200, 38, 4);
  bc.fill();
  bc.fillStyle = '#ccc';
  bc.font = '9px "Inter", sans-serif';
  bc.textAlign = 'left';
  bc.fillText('SIGNATURE', 40, 145);

  // Terms
  bc.fillStyle = 'rgba(255,255,255,0.5)';
  bc.font = '10px "Inter", sans-serif';
  bc.textAlign = 'center';
  const terms = [
    'This card is the property of LIS Academy and must be returned on demand.',
    'If found, please return to: 7/29, Vijayalakshmi Complex, 1st Main Road,',
    'Gokul, Bengaluru – 560054',
    '',
    'Contact: info@lisacademy.org | 080-35006965',
  ];
  let ty = 200;
  terms.forEach(line => {
    bc.fillText(line, W / 2, ty);
    ty += 18;
  });

  // Social handles
  bc.fillStyle = 'rgba(201,168,76,0.6)';
  bc.font = '10px "Inter", sans-serif';
  bc.fillText('www.lisacademy.org', W / 2, H - 30);
  bc.fillStyle = 'rgba(255,255,255,0.3)';
  bc.font = '9px "Inter", sans-serif';
  bc.fillText(member.membership_id + '  ·  Valid from ' + new Date(member.created_at).getFullYear(), W / 2, H - 14);

  return {
    front: front.toDataURL('image/png'),
    back: back.toDataURL('image/png'),
  };
}

// ─────────────────────────────────────────────────────────────
//  Print helper
// ─────────────────────────────────────────────────────────────
export function printImage(dataUrl: string, title = 'LIS Academy') {
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(`
    <html><head><title>${title}</title>
    <style>
      body { margin:0; background:#fff; display:flex; justify-content:center; align-items:center; min-height:100vh; }
      img { max-width:100%; height:auto; }
      @media print { body { margin:0; } img { width:100%; } }
    </style></head>
    <body><img src="${dataUrl}" onload="window.print();window.close()"/></body></html>
  `);
  win.document.close();
}

// ─────────────────────────────────────────────────────────────
//  Utility – rounded rect (Canvas API helper)
// ─────────────────────────────────────────────────────────────
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}


