import type { Member } from './supabase';
import type { LifeCertificateEditorState } from './membershipTypes';
import { TIER_COLORS } from './membershipDb';
import { fetchDocumentTemplates, type DocumentTemplate } from './documentTemplates';
import { buildApiUrl } from './api';

export const LIFE_CERTIFICATE_TEMPLATE_VERSION = 4;
const LIFE_CERTIFICATE_DRAFT_TEMPLATE_URL = '/membership/rawwithoutsign.png';
const LIFE_CERTIFICATE_TEMPLATE_URL = '/membership/life-membership-certificate-final.png';

export const DEFAULT_LIFE_CERTIFICATE_EDITOR_STATE: LifeCertificateEditorState = {
  nameX: 1167,
  nameY: 799,
  nameFontSize: 53,
  detailX: 1167,
  detailY: 849,
  detailFontSize: 50,
  photoX: 333,
  photoY: 999,
  photoRadius: 175,
};

let _cachedTemplateImage: HTMLImageElement | null = null;
const _templateImageCache = new Map<string, HTMLImageElement>();

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

function drawableImageUrl(src: string) {
  if (!src || src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('/')) {
    return src;
  }

  try {
    const url = new URL(src, window.location.href);
    if (url.origin === window.location.origin) return src;
    return buildApiUrl(`/api/image-proxy?url=${encodeURIComponent(url.toString())}`);
  } catch {
    return src;
  }
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

function getNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function getString(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function formatIssueDate(member: Member) {
  return new Date(member.issue_date || member.approved_at || member.created_at).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

async function getTemplate(key: string): Promise<DocumentTemplate | undefined> {
  const templates = await fetchDocumentTemplates();
  return templates.find((template) => template.key === key && template.template_url);
}

function getMembershipNumberText(member: Member) {
  return String(member.membership_number || member.membership_id.replace('LISA/', '')).trim();
}

export function normalizeLifeCertificateEditorState(
  state?: Partial<LifeCertificateEditorState> | null,
): LifeCertificateEditorState {
  return {
    nameX: typeof state?.nameX === 'number' ? state.nameX : DEFAULT_LIFE_CERTIFICATE_EDITOR_STATE.nameX,
    nameY: typeof state?.nameY === 'number' ? state.nameY : DEFAULT_LIFE_CERTIFICATE_EDITOR_STATE.nameY,
    nameFontSize: typeof state?.nameFontSize === 'number' ? state.nameFontSize : DEFAULT_LIFE_CERTIFICATE_EDITOR_STATE.nameFontSize,
    detailX: typeof state?.detailX === 'number' ? state.detailX : DEFAULT_LIFE_CERTIFICATE_EDITOR_STATE.detailX,
    detailY: typeof state?.detailY === 'number' ? state.detailY : DEFAULT_LIFE_CERTIFICATE_EDITOR_STATE.detailY,
    detailFontSize: typeof state?.detailFontSize === 'number' ? state.detailFontSize : DEFAULT_LIFE_CERTIFICATE_EDITOR_STATE.detailFontSize,
    photoX: typeof state?.photoX === 'number' ? state.photoX : DEFAULT_LIFE_CERTIFICATE_EDITOR_STATE.photoX,
    photoY: typeof state?.photoY === 'number' ? state.photoY : DEFAULT_LIFE_CERTIFICATE_EDITOR_STATE.photoY,
    photoRadius: typeof state?.photoRadius === 'number' ? state.photoRadius : DEFAULT_LIFE_CERTIFICATE_EDITOR_STATE.photoRadius,
  };
}

function createCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontFamily: string,
  fontWeight: string,
  maxWidth: number,
  startSize: number,
  minSize: number
) {
  let size = startSize;
  while (size > minSize) {
    ctx.font = `${fontWeight} ${size}px ${fontFamily}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  return size;
}

function splitTextIntoLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
      continue;
    }

    if (current) lines.push(current);
    current = word;

    if (lines.length === maxLines - 1) break;
  }

  if (current) lines.push(current);

  if (lines.length > maxLines) {
    lines.length = maxLines;
  }

  const consumed = lines.join(' ').split(/\s+/).filter(Boolean).length;
  if (consumed < words.length && lines.length > 0) {
    let last = lines[lines.length - 1];
    while (last.length > 1 && ctx.measureText(`${last}...`).width > maxWidth) {
      last = last.slice(0, -1).trimEnd();
    }
    lines[lines.length - 1] = `${last}...`;
  }

  return lines;
}

function drawCenteredTextBlock(
  ctx: CanvasRenderingContext2D,
  text: string,
  options: {
    x: number;
    y: number;
    maxWidth: number;
    lineHeight: number;
    maxLines: number;
    fontFamily: string;
    fontWeight: string;
    startSize: number;
    minSize: number;
    color: string;
  }
) {
  let size = options.startSize;
  let lines: string[] = [];

  while (size >= options.minSize) {
    ctx.font = `${options.fontWeight} ${size}px ${options.fontFamily}`;
    lines = splitTextIntoLines(ctx, text, options.maxWidth, options.maxLines);
    if (lines.length <= options.maxLines) break;
    size -= 2;
  }

  ctx.font = `${options.fontWeight} ${size}px ${options.fontFamily}`;
  ctx.fillStyle = options.color;
  ctx.textAlign = 'center';
  const totalHeight = (lines.length - 1) * options.lineHeight;
  let lineY = options.y - totalHeight / 2;
  for (const line of lines) {
    ctx.fillText(line, options.x, lineY);
    lineY += options.lineHeight;
  }
}

async function generateLifeMembershipCertificate(member: Member): Promise<string> {
  // Use cached template to avoid re-fetching 2MB image on every call.
  if (!_cachedTemplateImage) {
    _cachedTemplateImage = await loadImage(LIFE_CERTIFICATE_TEMPLATE_URL);
  }
  const background = _cachedTemplateImage;
  // Canvas is exactly 2000 × 1414 px
  const W = background.width;   // 2000
  const H = background.height;  // 1414
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(background, 0, 0, W, H);

  // ── Positions scaled from the reference HTML (canvas 1200×850 → 2000×1414)
  // Scale X = 2000/1200 = 1.6667  |  Scale Y = 1414/850 = 1.6635
  //
  // REF POS (1200×850)           SCALED (2000×1414)
  //  name        700, 480    →    1167, 799
  //  detail      700, 510    →    1167, 849
  //  membershipNo 915, 605   →    1525, 1007
  //  issuedOnVal  750, 700   →    1250, 1165
  //  photo        x=95,y=495,r=105 → cx=333,cy=999,r=175

  ctx.textAlign = 'center';

  // ── Member name ──────────────────────────────────────────────────────
  // ref: font 'bold 32px Georgia, serif' scaled → 53px
  const rawName = member.name.trim().toUpperCase();
  const name = rawName.length > 32 ? rawName.slice(0, 31) + '…' : rawName;
  ctx.fillStyle = '#1e2a8a';
  const nameSize = fitFont(ctx, name, 'Georgia, serif', 'bold', 880, 53, 32);
  ctx.font = `bold ${nameSize}px Georgia, serif`;
  ctx.fillText(name, 1167, 799);

  // ── Designation / institution ─────────────────────────────────────────
  // ref: font '30px Georgia, serif' scaled → 50px
  // Build detail: prefer custom_detail, fallback to designation + institution
  const rawDetail = member.custom_detail?.trim() ||
    [member.designation, member.institution].filter(Boolean).join(', ');
  const detail = rawDetail.length > 60 ? rawDetail.slice(0, 59) + '…' : rawDetail;

  if (detail) {
    drawCenteredTextBlock(ctx, detail, {
      x: 1167,
      y: 849,
      maxWidth: 890,
      lineHeight: 52,
      maxLines: 2,
      fontFamily: 'Georgia, serif',
      fontWeight: '600',
      startSize: 50,
      minSize: 28,
      color: '#2d2d2d',
    });
  }

  // ── Membership number ─────────────────────────────────────────────────
  // Template already prints "Membership No. LISA/" — draw ONLY the digits.
  // ref: font 'bold 38px Georgia, serif' @ x=915 (center) scaled → 63px @ x=1525
  // We use textAlign='center' and position at 1525 so the number centres after "LISA/"
  const membershipNumber = getMembershipNumberText(member);
  ctx.fillStyle = '#1e2a8a';
  const memSize = fitFont(ctx, membershipNumber, 'Georgia, serif', 'bold', 300, 63, 38);
  ctx.font = `bold ${memSize}px Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.fillText(membershipNumber, 1525, 1007);

  // ── Issue date ────────────────────────────────────────────────────────
  // ref: font 'italic 24px Georgia, serif' @ (750,700) scaled → 40px @ (1250,1165)
  const issueDate = formatIssueDate(member);
  ctx.fillStyle = '#111111';
  ctx.font = 'italic bold 40px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(issueDate, 1250, 1165);

  // ── Member photo ──────────────────────────────────────────────────────
  // ref: photo x=95, y=495, r=105  →  cx=333, cy=999, r=175
  const memberPhoto = member.photo_data_url || member.photo_url;
  if (memberPhoto) {
    try {
      const image = await loadImage(drawableImageUrl(memberPhoto));
      const cx = 333, cy = 999, r = 175;
      const size = Math.min(image.width, image.height);
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(
        image,
        (image.width - size) / 2, (image.height - size) / 2, size, size,
        cx - r, cy - r, r * 2, r * 2
      );
      ctx.restore();
    } catch { /* skip if photo fails to load */ }
  }

  // Output JPEG at 87% quality — ~10x smaller than PNG, visually identical for certificates.
  return canvas.toDataURL('image/jpeg', 0.87);
}

async function getTemplateImage(src: string): Promise<HTMLImageElement> {
  const cached = _templateImageCache.get(src);
  if (cached) return cached;
  const loaded = await loadImage(src);
  _templateImageCache.set(src, loaded);
  return loaded;
}

async function generateConfiguredLifeCertificate(
  member: Member,
  templateUrl: string,
  editorState?: Partial<LifeCertificateEditorState> | null,
  includeMembershipNumber = true,
): Promise<string> {
  const state = normalizeLifeCertificateEditorState(editorState || member.certificate_editor_state);
  const background = await getTemplateImage(templateUrl);
  const canvas = createCanvas(background.width, background.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(background, 0, 0, background.width, background.height);
  ctx.textAlign = 'center';

  const rawName = member.name.trim().toUpperCase();
  const name = rawName.length > 32 ? `${rawName.slice(0, 31)}...` : rawName;
  ctx.fillStyle = '#1e2a8a';
  const nameSize = fitFont(ctx, name, 'Georgia, serif', 'bold', 880, state.nameFontSize, 32);
  ctx.font = `bold ${nameSize}px Georgia, serif`;
  ctx.fillText(name, state.nameX, state.nameY);

  const rawDetail = member.custom_detail?.trim() || [member.designation, member.institution].filter(Boolean).join(', ');
  const detail = rawDetail.length > 60 ? `${rawDetail.slice(0, 59)}...` : rawDetail;
  if (detail) {
    drawCenteredTextBlock(ctx, detail, {
      x: state.detailX,
      y: state.detailY,
      maxWidth: 890,
      lineHeight: 52,
      maxLines: 2,
      fontFamily: 'Georgia, serif',
      fontWeight: '600',
      startSize: state.detailFontSize,
      minSize: 28,
      color: '#2d2d2d',
    });
  }

  if (includeMembershipNumber) {
    const membershipNumber = getMembershipNumberText(member);
    ctx.fillStyle = '#1e2a8a';
    const membershipSize = fitFont(ctx, membershipNumber, 'Georgia, serif', 'bold', 300, 63, 38);
    ctx.font = `bold ${membershipSize}px Georgia, serif`;
    ctx.fillText(membershipNumber, 1525, 1007);
  }

  ctx.fillStyle = '#111111';
  ctx.font = 'italic bold 40px Georgia, serif';
  ctx.fillText(formatIssueDate(member), 1250, 1165);

  const memberPhoto = member.photo_data_url || member.photo_url;
  if (memberPhoto) {
    try {
      const image = await loadImage(drawableImageUrl(memberPhoto));
      const size = Math.min(image.width, image.height);
      const radius = state.photoRadius;
      ctx.save();
      ctx.beginPath();
      ctx.arc(state.photoX, state.photoY, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(
        image,
        (image.width - size) / 2,
        (image.height - size) / 2,
        size,
        size,
        state.photoX - radius,
        state.photoY - radius,
        radius * 2,
        radius * 2,
      );
      ctx.restore();
    } catch {
      // Keep certificate generation usable even if the member photo cannot be drawn.
    }
  }

  return canvas.toDataURL('image/jpeg', 0.87);
}

export async function generateLifeCertificateDraft(
  member: Member,
  editorState?: Partial<LifeCertificateEditorState> | null,
): Promise<string> {
  return generateConfiguredLifeCertificate(
    member,
    LIFE_CERTIFICATE_DRAFT_TEMPLATE_URL,
    editorState,
    false,
  );
}

async function generateCertificateFromTemplate(member: Member, template: DocumentTemplate): Promise<string> {
  const map = template.field_map || {};
  const W = getNumber(map.width, 1200);
  const H = getNumber(map.height, 850);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  const bg = await loadImage(drawableImageUrl(template.template_url));
  ctx.drawImage(bg, 0, 0, W, H);

  const name = map.name && typeof map.name === 'object' ? map.name as Record<string, unknown> : {};
  const detail = map.detail && typeof map.detail === 'object' ? map.detail as Record<string, unknown> : {};
  const membership = map.membership && typeof map.membership === 'object' ? map.membership as Record<string, unknown> : {};
  const date = map.date && typeof map.date === 'object' ? map.date as Record<string, unknown> : {};
  const photo = map.photo && typeof map.photo === 'object' ? map.photo as Record<string, unknown> : {};

  ctx.textAlign = 'center';
  ctx.fillStyle = getString(name.color, '#000000');
  ctx.font = getString(name.font, 'bold 32px Georgia, serif');
  ctx.fillText(member.name.toUpperCase(), getNumber(name.x, 700), getNumber(name.y, 480));

  ctx.fillStyle = getString(detail.color, '#000000');
  ctx.font = getString(detail.font, '30px Georgia, serif');
  ctx.fillText(member.custom_detail || `${member.designation}, ${member.institution}`, getNumber(detail.x, 700), getNumber(detail.y, 510));

  ctx.fillStyle = getString(membership.color, '#000000');
  ctx.font = getString(membership.font, 'bold 38px Georgia, serif');
  ctx.fillText(String(member.membership_number || member.membership_id.replace('LISA/', '')), getNumber(membership.x, 915), getNumber(membership.y, 605));

  ctx.fillStyle = getString(date.color, '#000000');
  ctx.font = getString(date.font, 'italic 24px Georgia, serif');
  ctx.fillText(formatIssueDate(member), getNumber(date.x, 750), getNumber(date.y, 700));

  const memberPhoto = member.photo_data_url || member.photo_url;
  if (memberPhoto) {
    const img = await loadImage(drawableImageUrl(memberPhoto));
    const x = getNumber(photo.x, 95);
    const y = getNumber(photo.y, 495);
    const w = getNumber(photo.w, 210);
    const h = getNumber(photo.h, 210);
    const r = getNumber(photo.r, Math.min(w, h) / 2);
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, r, 0, Math.PI * 2);
    ctx.clip();
    const sz = Math.min(img.width, img.height);
    ctx.drawImage(img, (img.width - sz) / 2, (img.height - sz) / 2, sz, sz, x, y, w, h);
    ctx.restore();
  }

  return canvas.toDataURL('image/png');
}

async function generateIdSideFromTemplate(member: Member, template: DocumentTemplate, fallbackSize: { width: number; height: number }) {
  const map = template.field_map || {};
  const W = getNumber(map.width, fallbackSize.width);
  const H = getNumber(map.height, fallbackSize.height);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  const bg = await loadImage(drawableImageUrl(template.template_url));
  ctx.drawImage(bg, 0, 0, W, H);

  const draw = (key: string, text: string, fallback: { x: number; y: number; font: string; color: string; align?: CanvasTextAlign }) => {
    const spec = map[key] && typeof map[key] === 'object' ? map[key] as Record<string, unknown> : {};
    ctx.textAlign = getString(spec.align, fallback.align || 'left') as CanvasTextAlign;
    ctx.fillStyle = getString(spec.color, fallback.color);
    ctx.font = getString(spec.font, fallback.font);
    ctx.fillText(text, getNumber(spec.x, fallback.x), getNumber(spec.y, fallback.y));
  };

  draw('name', member.name.toUpperCase(), { x: 30, y: 188, font: 'bold 20px Inter, sans-serif', color: '#ffffff' });
  draw('designation', member.designation || '-', { x: 30, y: 226, font: '13px Inter, sans-serif', color: '#ffffff' });
  draw('institution', member.institution || '-', { x: 30, y: 264, font: '12px Inter, sans-serif', color: '#ffffff' });
  draw('membership', member.membership_id, { x: 44, y: 342, font: 'bold 17px Inter, sans-serif', color: '#ffffff' });
  draw('issueDate', formatIssueDate(member), { x: W / 2, y: H - 14, font: '9px Inter, sans-serif', color: '#ffffff', align: 'center' });

  const photo = map.photo && typeof map.photo === 'object' ? map.photo as Record<string, unknown> : {};
  const memberPhoto = member.photo_data_url || member.photo_url;
  if (memberPhoto) {
    const img = await loadImage(drawableImageUrl(memberPhoto));
    const x = getNumber(photo.x, W - 130);
    const y = getNumber(photo.y, 155);
    const w = getNumber(photo.w, 110);
    const h = getNumber(photo.h, 110);
    ctx.save();
    roundRect(ctx, x, y, w, h, getNumber(photo.r, 8));
    ctx.clip();
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();
  }

  return canvas.toDataURL('image/png');
}

// ─────────────────────────────────────────────────────────────
//  MEMBERSHIP CERTIFICATE  (1122 × 794 px – A4 landscape @96dpi)
// ─────────────────────────────────────────────────────────────
export async function generateCertificate(
  member: Member,
  options?: { editorState?: Partial<LifeCertificateEditorState> | null },
): Promise<string> {
  if (member.membership_tier === 'life') {
    return generateConfiguredLifeCertificate(
      member,
      LIFE_CERTIFICATE_TEMPLATE_URL,
      options?.editorState,
      true,
    );
  }

  const template = await getTemplate('certificate');
  if (template) {
    try {
      return await generateCertificateFromTemplate(member, template);
    } catch {
      // Fall back to the built-in certificate when the external template cannot be drawn.
    }
  }

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
  const [frontTemplate, backTemplate] = await Promise.all([getTemplate('id_front'), getTemplate('id_back')]);
  if (frontTemplate || backTemplate) {
    try {
      const [frontUrl, backUrl] = await Promise.all([
        frontTemplate ? generateIdSideFromTemplate(member, frontTemplate, { width: 638, height: 402 }) : Promise.resolve(''),
        backTemplate ? generateIdSideFromTemplate(member, backTemplate, { width: 638, height: 402 }) : Promise.resolve(''),
      ]);
      if (frontUrl && backUrl) return { front: frontUrl, back: backUrl };
    } catch {
      // Fall back to the built-in ID card design when an external template is unavailable.
    }
  }

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
      const photo = await loadImage(drawableImageUrl(memberPhoto));
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


