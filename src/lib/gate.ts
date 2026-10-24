import { charSvg } from '../art/characters';
import { fillAds } from './ads';
import { track } from './ui';

const TIPS = [
  '사주는 태어난 해, 달, 날, 시를 네 기둥으로 세우고 기둥마다 두 글자씩, 모두 여덟 글자로 나타내요.',
  '사주에서 \'나\'를 뜻하는 글자는 태어난 날의 천간, 일간이에요. 큰 나무, 태양, 바다처럼 자연에 빗대어 풀어요.',
  '대운은 10년마다 바뀌는 큰 운의 흐름이에요. 같은 사주라도 대운에 따라 시기마다 분위기가 달라져요.',
  '2027년은 정미년이에요. 따뜻한 불(丁)이 흙(未)을 데우는 해라 배려와 차분한 실속이 중요하다고 봐요.',
  '삼재는 12년마다 3년씩 돌아오는 조심할 시기예요. 겁내기보다 큰 결정을 한 번 더 따져 보라는 뜻이에요.',
  '궁합에서는 두 사람의 배우자 자리, 일지끼리 합을 이루는지 부딪히는지를 중요하게 봐요.',
  '오행은 나무, 불, 흙, 쇠, 물의 다섯 기운이에요. 서로 돕기도 하고 누르기도 하며 균형을 이뤄요.',
];

export interface GateOptions {
  name: string; // '지민님의 '
  label: string; // '2027년 신년운세를 풀이하고 있어요'
  doneLabel?: string;
  steps?: string[];
  href?: string; // 결과 페이지로 이동
  onDone?: () => void; // 같은 페이지에서 결과 보여주기
  chars?: string[];
  ms?: number;
  test?: string;
}

let timer: number | undefined;

export function openGate(o: GateOptions) {
  const gate = document.getElementById('gate');
  if (!gate) {
    if (o.href) location.href = o.href;
    else o.onDone?.();
    return;
  }
  const $ = <T extends HTMLElement>(s: string) => gate.querySelector<T>(s)!;
  const bar = $('[data-gate-bar]');
  const pct = $('[data-gate-pct]');
  const step = $('[data-gate-step]');
  const go = $<HTMLAnchorElement>('[data-gate-go]');
  $('[data-gate-name]').textContent = o.name;
  $('[data-gate-label]').textContent = o.label;
  $('[data-gate-tip]').textContent = TIPS[Math.floor(Math.random() * TIPS.length)];
  const chars = o.chars ?? ['rabbit', 'tiger', 'monkey'];
  gate.querySelectorAll<HTMLElement>('[data-orbit]').forEach((el, i) => (el.innerHTML = charSvg(chars[i % chars.length], 'happy')));
  const steps = o.steps ?? ['사주 여덟 글자를 세우는 중', '오행의 균형을 살피는 중', '운의 흐름을 읽는 중', '풀이를 정리하는 중'];
  go.hidden = true;
  bar.style.width = '0%';
  pct.textContent = '0%';
  step.textContent = steps[0];
  gate.hidden = false;
  document.documentElement.style.overflow = 'hidden';
  fillAds(gate);
  track('gate_open', { test: o.test ?? '' });

  const total = o.ms ?? (matchMedia('(prefers-reduced-motion: reduce)').matches ? 1200 : 4200);
  const t0 = performance.now();
  window.clearInterval(timer);
  timer = window.setInterval(() => {
    const r = Math.min(1, (performance.now() - t0) / total);
    // 앞쪽은 빠르게, 뒤쪽은 천천히
    const eased = 1 - Math.pow(1 - r, 1.7);
    const v = Math.round(eased * 100);
    bar.style.width = `${v}%`;
    pct.textContent = `${v}%`;
    step.textContent = steps[Math.min(steps.length - 1, Math.floor(eased * steps.length))];
    if (r >= 1) {
      window.clearInterval(timer);
      step.textContent = '풀이가 끝났어요';
      $('[data-gate-label]').textContent = o.doneLabel ?? '풀이가 끝났어요';
      if (o.href) {
        go.href = o.href;
        go.onclick = null;
      } else {
        go.removeAttribute('href');
        go.setAttribute('role', 'button');
        go.onclick = (e) => {
          e.preventDefault();
          closeGate();
          o.onDone?.();
        };
      }
      go.hidden = false;
      go.focus();
    }
  }, 80);

  const close = () => {
    window.clearInterval(timer);
    closeGate();
  };
  $('[data-gate-close]').onclick = close;
}

export function closeGate() {
  const gate = document.getElementById('gate');
  if (gate) gate.hidden = true;
  document.documentElement.style.overflow = '';
}

// 결과 페이지에서 뒤로 왔을 때 분석 화면이 남아 있지 않도록
window.addEventListener('pageshow', (e) => {
  if (e.persisted) closeGate();
});
