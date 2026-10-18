// 공유 미리보기 이미지(1200×630)를 빌드할 때 만듭니다. 카카오톡, 페이스북, X 미리보기에 쓰여요.
import fs from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { sceneSvg, type Theme, type Mood } from '../art/characters';

const W = 1200;
const H = 630;
const PAPER = '#f1cc45';
const INK = '#b3261a';
const TEXT = '#3b2810';

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: unknown[]): Node => ({
  type,
  props: { style: { display: 'flex', boxSizing: 'border-box', ...style }, children: children.length === 1 ? children[0] : children },
});

let fontsCache: { name: string; data: Buffer; weight: 500 | 700 | 800; style: 'normal' }[] | null = null;
async function fonts() {
  if (fontsCache) return fontsCache;
  const dir = path.join(process.cwd(), 'src/assets/og-fonts');
  const read = (f: string) => fs.readFile(path.join(dir, f));
  fontsCache = [
    { name: 'Hahmlet', data: await read('Hahmlet-ExtraBold.ttf'), weight: 800, style: 'normal' },
    { name: 'Pretendard', data: await read('Pretendard-Bold.otf'), weight: 700, style: 'normal' },
    { name: 'Pretendard', data: await read('Pretendard-Medium.otf'), weight: 500, style: 'normal' },
    { name: 'SealHanja', data: await read('SealHanja.otf'), weight: 700, style: 'normal' },
  ];
  return fontsCache;
}

function seal(text: string, size: number): Node {
  const chars = [...text];
  let inner: Node;
  if (chars.length >= 4) {
    inner = h(
      'div',
      { flexWrap: 'wrap', width: size * 0.62, justifyContent: 'center', fontFamily: 'Hahmlet', fontWeight: 800, fontSize: size * 0.27, lineHeight: 1.1, color: '#fff' },
      ...chars.slice(0, 4).map((c) => h('div', { width: size * 0.31, justifyContent: 'center' }, c)),
    );
  } else if (chars.length >= 2) {
    inner = h(
      'div',
      { flexDirection: 'column', alignItems: 'center', fontFamily: 'SealHanja, Hahmlet', fontWeight: 700, fontSize: size * 0.34, lineHeight: 1.1, color: '#fff' },
      ...chars.map((c) => h('div', {}, c)),
    );
  } else {
    inner = h('div', { fontFamily: 'SealHanja, Hahmlet', fontWeight: 700, fontSize: size * 0.56, color: '#fff', lineHeight: 1 }, text);
  }
  return h(
    'div',
    {
      width: size,
      height: size,
      background: INK,
      border: `6px solid ${PAPER}`,
      borderRadius: size * 0.16,
      alignItems: 'center',
      justifyContent: 'center',
      transform: 'rotate(-8deg)',
      position: 'absolute',
      right: -4,
      bottom: 6,
    },
    h('div', {
      position: 'absolute',
      top: size * 0.06,
      left: size * 0.06,
      right: size * 0.06,
      bottom: size * 0.06,
      border: `${Math.max(2, size * 0.025)}px solid rgba(255,255,255,.85)`,
      borderRadius: size * 0.08,
    }),
    inner,
  );
}

function scenePng(scene: { chars: string[]; theme?: Theme; mood?: Mood }) {
  const svg = sceneSvg({ ...scene, size: 820 });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 820 } }).render().asPng();
  return `data:image/png;base64,${Buffer.from(png).toString('base64')}`;
}

export interface OgSpec {
  head: string;
  kicker?: string;
  name: string;
  line?: string;
  seal: string;
  cta?: string;
  scene: { chars: string[]; theme?: Theme; mood?: Mood };
}

export async function renderOg(spec: OgSpec): Promise<Buffer> {
  const nameSize = spec.name.length > 14 ? 60 : spec.name.length > 9 ? 72 : 88;
  const line = spec.line && spec.line.length > 60 ? spec.line.slice(0, 58) + '…' : spec.line;
  const art = 410;
  const tree = h(
    'div',
    { width: W, height: H, background: PAPER, padding: 26, fontFamily: 'Pretendard', wordBreak: 'keep-all' },
    h(
      'div',
      { width: W - 52, height: H - 52, border: `7px solid ${INK}`, padding: 7 },
      h(
        'div',
        { width: W - 80, height: H - 80, border: `2px solid ${INK}`, padding: '34px 30px 34px 50px', alignItems: 'center', justifyContent: 'space-between' },
        h(
          'div',
          { flexDirection: 'column', width: 620, height: H - 80 - 68, justifyContent: 'space-between' },
          h(
            'div',
            { flexDirection: 'column' },
            h('div', { fontSize: 29, fontWeight: 700, color: INK }, spec.head),
            spec.kicker ? h('div', { marginTop: 24, fontSize: 34, fontWeight: 500, color: TEXT }, spec.kicker) : h('div', { marginTop: 14 }, ''),
            h('div', { marginTop: 6, fontFamily: 'Hahmlet', fontWeight: 800, fontSize: nameSize, lineHeight: 1.15, color: INK, letterSpacing: -2 }, spec.name),
            line ? h('div', { marginTop: 14, fontSize: 30, fontWeight: 500, lineHeight: 1.45, color: TEXT }, line) : h('div', {}, ''),
          ),
          h('div', { alignSelf: 'flex-start', background: '#1f2033', color: '#fff', fontSize: 29, fontWeight: 700, padding: '13px 28px', borderRadius: 16 }, spec.cta ?? '나도 해보기'),
        ),
        h(
          'div',
          { position: 'relative', width: art, height: art },
          { type: 'img', props: { src: scenePng(spec.scene), width: art, height: art, style: { width: art, height: art } } },
          seal(spec.seal, 132),
        ),
      ),
    ),
  );
  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], { width: W, height: H, fonts: await fonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
}
