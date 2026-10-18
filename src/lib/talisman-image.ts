// 결과 부적을 9:16 (1080×1920) 이미지로 그립니다. 인스타 스토리, 휴대폰 배경에 맞는 비율.
import { sceneSvg, type Theme, type Mood } from '../art/characters';

export interface TalismanData {
  head: string;
  kicker?: string;
  name: string;
  big?: string;
  line?: string;
  keys?: string[];
  rows?: [string, string][];
  seal: string;
  foot: string;
  scene?: { chars: string[]; theme?: Theme; mood?: Mood };
}

const W = 1080;
const H = 1920;
const PAPER = '#f1cc45';
const INK = '#b3261a';
const TEXT = '#3b2810';
const SANS = '"Pretendard Variable", Pretendard, "Apple SD Gothic Neo", sans-serif';
const DISPLAY = '"Seal Hanja", "Hahmlet Variable", serif';

async function ensureFonts(d: TalismanData) {
  if (!('fonts' in document)) return;
  const all = [d.head, d.kicker, d.name, d.big, d.line, ...(d.keys ?? []), ...(d.rows ?? []).flat(), d.seal, d.foot].filter(Boolean).join('');
  const loads = [
    document.fonts.load(`800 100px "Hahmlet Variable"`, all),
    document.fonts.load(`700 100px "Seal Hanja"`, d.seal),
    document.fonts.load(`500 40px "Pretendard Variable"`, all),
    document.fonts.load(`700 40px "Pretendard Variable"`, all),
  ];
  await Promise.race([Promise.allSettled(loads), new Promise((r) => setTimeout(r, 2500))]);
}

async function loadSvg(svg: string): Promise<HTMLImageElement | null> {
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  try {
    await img.decode();
    return img;
  } catch {
    return null;
  }
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(/(\s+)/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const test = cur + w;
    if (ctx.measureText(test).width > maxW && cur.trim()) {
      lines.push(cur.trim());
      cur = w.trimStart();
      while (ctx.measureText(cur).width > maxW) {
        let i = cur.length;
        while (i > 1 && ctx.measureText(cur.slice(0, i)).width > maxW) i--;
        lines.push(cur.slice(0, i));
        cur = cur.slice(i);
      }
    } else {
      cur = test;
    }
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines;
}

function noisePattern(ctx: CanvasRenderingContext2D) {
  const c = document.createElement('canvas');
  c.width = c.height = 220;
  const x = c.getContext('2d')!;
  const img = x.createImageData(220, 220);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random();
    img.data[i] = 115;
    img.data[i + 1] = 72;
    img.data[i + 2] = 0;
    img.data[i + 3] = v > 0.5 ? Math.floor((v - 0.5) * 46) : 0;
  }
  x.putImageData(img, 0, 0);
  return ctx.createPattern(c, 'repeat')!;
}

function drawSeal(ctx: CanvasRenderingContext2D, text: string, cx: number, cy: number, s: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((-8 * Math.PI) / 180);
  ctx.fillStyle = PAPER;
  ctx.beginPath();
  ctx.roundRect(-s / 2 - 6, -s / 2 - 6, s + 12, s + 12, s * 0.16);
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.roundRect(-s / 2, -s / 2, s, s, s * 0.14);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.85)';
  ctx.lineWidth = s * 0.03;
  const ins = s * 0.07;
  ctx.beginPath();
  ctx.roundRect(-s / 2 + ins, -s / 2 + ins, s - ins * 2, s - ins * 2, s * 0.08);
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const chars = [...text];
  if (chars.length >= 4) {
    ctx.font = `800 ${s * 0.27}px "Hahmlet Variable", serif`;
    const q = s * 0.2;
    const pos = [
      [-q, -q],
      [q, -q],
      [-q, q],
      [q, q],
    ];
    chars.slice(0, 4).forEach((ch, i) => ctx.fillText(ch, pos[i][0], pos[i][1] + s * 0.01));
  } else if (chars.length >= 2) {
    ctx.font = `700 ${s * 0.36}px ${DISPLAY}`;
    const step = s * 0.38;
    const start = (-(chars.length - 1) * step) / 2;
    chars.forEach((ch, i) => ctx.fillText(ch, 0, start + i * step + s * 0.01));
  } else {
    ctx.font = `700 ${s * 0.56}px ${DISPLAY}`;
    ctx.fillText(text, 0, s * 0.02);
  }
  ctx.restore();
}

function corner(ctx: CanvasRenderingContext2D, x: number, y: number, flip: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flip * 2.4, 2.4);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(2, 14);
  ctx.lineTo(2, 2);
  ctx.lineTo(14, 2);
  ctx.moveTo(6, 10);
  ctx.quadraticCurveTo(6, 6, 10, 6);
  ctx.quadraticCurveTo(13, 6, 13, 9);
  ctx.quadraticCurveTo(13, 11, 11, 11);
  ctx.stroke();
  ctx.restore();
}

export async function renderTalisman(d: TalismanData): Promise<HTMLCanvasElement> {
  await ensureFonts(d);
  const art = d.scene ? await loadSvg(sceneSvg({ ...d.scene, size: 640 })) : null;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = noisePattern(ctx);
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = INK;
  ctx.lineWidth = 9;
  ctx.strokeRect(56, 56, W - 112, H - 112);
  ctx.lineWidth = 3;
  ctx.strokeRect(80, 80, W - 160, H - 160);
  corner(ctx, 96, 96, 1);
  corner(ctx, W - 96, 96, -1);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const cx = W / 2;
  const maxW = 800;

  ctx.fillStyle = INK;
  ctx.font = `700 36px ${SANS}`;
  ctx.fillText(d.head, cx, 190);
  ctx.fillRect(140, 232, W - 280, 3);
  for (const x of [140, W - 140]) {
    ctx.save();
    ctx.translate(x, 233.5);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-9, -9, 18, 18);
    ctx.restore();
  }

  type Block = { h: number; draw: (y: number) => void };
  const blocks: Block[] = [];
  const artS = 600;
  blocks.push({
    h: artS + 10,
    draw: (y) => {
      if (art) ctx.drawImage(art, cx - artS / 2, y, artS, artS);
      drawSeal(ctx, d.seal, cx + artS / 2 - 40, y + artS - 70, 150);
    },
  });

  if (d.kicker) {
    blocks.push({
      h: 64,
      draw: (y) => {
        ctx.fillStyle = TEXT;
        ctx.globalAlpha = 0.82;
        ctx.font = `600 40px ${SANS}`;
        ctx.textAlign = 'center';
        ctx.fillText(d.kicker!, cx, y + 44);
        ctx.globalAlpha = 1;
      },
    });
  }

  let nameSize = 100;
  let nameLines: string[] = [];
  for (; nameSize >= 60; nameSize -= 6) {
    ctx.font = `800 ${nameSize}px ${DISPLAY}`;
    nameLines = wrap(ctx, d.name, maxW + 40);
    if (nameLines.length <= 2) break;
  }
  const nameLH = nameSize * 1.2;
  blocks.push({
    h: nameLines.length * nameLH + 14,
    draw: (y) => {
      ctx.fillStyle = INK;
      ctx.font = `800 ${nameSize}px ${DISPLAY}`;
      ctx.textAlign = 'center';
      nameLines.forEach((l, i) => ctx.fillText(l, cx, y + nameSize + i * nameLH));
    },
  });

  if (d.big) {
    blocks.push({
      h: 170,
      draw: (y) => {
        ctx.fillStyle = INK;
        ctx.font = `800 140px "Hahmlet Variable", serif`;
        ctx.textAlign = 'center';
        ctx.fillText(d.big!, cx, y + 145);
      },
    });
  }

  if (d.line) {
    ctx.font = `500 42px ${SANS}`;
    const lines = wrap(ctx, d.line, maxW).slice(0, 4);
    blocks.push({
      h: 20 + lines.length * 64,
      draw: (y) => {
        ctx.fillStyle = TEXT;
        ctx.font = `500 42px ${SANS}`;
        ctx.textAlign = 'center';
        lines.forEach((l, i) => ctx.fillText(l, cx, y + 20 + 44 + i * 64));
      },
    });
  }

  if (d.keys?.length) {
    ctx.font = `700 36px ${SANS}`;
    const padX = 22;
    const gap = 16;
    const boxH = 64;
    const widths = d.keys.map((k) => ctx.measureText(k).width + padX * 2);
    const rows: number[][] = [[]];
    let rw = 0;
    widths.forEach((w, i) => {
      if (rw + w > maxW && rows[rows.length - 1].length) {
        rows.push([]);
        rw = 0;
      }
      rows[rows.length - 1].push(i);
      rw += w + gap;
    });
    blocks.push({
      h: 34 + rows.length * (boxH + gap),
      draw: (y) => {
        rows.forEach((row, ri) => {
          const total = row.reduce((s, i) => s + widths[i], 0) + gap * (row.length - 1);
          let x = cx - total / 2;
          const by = y + 34 + ri * (boxH + gap);
          row.forEach((i) => {
            ctx.strokeStyle = INK;
            ctx.lineWidth = 3;
            ctx.strokeRect(x, by, widths[i], boxH);
            ctx.fillStyle = INK;
            ctx.font = `700 36px ${SANS}`;
            ctx.textAlign = 'center';
            ctx.fillText(d.keys![i], x + widths[i] / 2, by + 45);
            x += widths[i] + gap;
          });
        });
      },
    });
  }

  if (d.rows?.length) {
    const rowsShown = d.rows.slice(0, 4);
    blocks.push({
      h: 30 + rowsShown.length * 66,
      draw: (y) => {
        rowsShown.forEach(([k, v], i) => {
          const ry = y + 30 + i * 66 + 44;
          ctx.font = `600 36px ${SANS}`;
          ctx.fillStyle = INK;
          ctx.textAlign = 'right';
          ctx.fillText(k, cx - 24, ry);
          ctx.font = `700 38px ${SANS}`;
          ctx.fillStyle = TEXT;
          ctx.textAlign = 'left';
          ctx.fillText(v, cx + 24, ry);
        });
        ctx.textAlign = 'center';
      },
    });
  }

  const top = 262;
  const bottom = H - 200;
  let total = blocks.reduce((s, b) => s + b.h, 0);
  // 너무 길면 그림을 줄여서 맞춤
  if (total > bottom - top) {
    const over = total - (bottom - top);
    blocks[0].h -= over;
    const s2 = artS - over;
    blocks[0].draw = (y) => {
      if (art) ctx.drawImage(art, cx - s2 / 2, y, s2, s2);
      drawSeal(ctx, d.seal, cx + s2 / 2 - 34, y + s2 - 60, Math.max(100, 150 * (s2 / artS)));
    };
    total = bottom - top;
  }
  let y = top + Math.max(0, (bottom - top - total) / 2);
  for (const b of blocks) {
    b.draw(y);
    y += b.h;
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = INK;
  ctx.font = `700 34px ${SANS}`;
  ctx.fillText(d.foot, cx, H - 136);

  return canvas;
}
