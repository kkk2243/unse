// '내 정보' 저장: 이 기기의 브라우저(localStorage)에만 보관하고 서버로 보내지 않습니다.
import type { Birth } from './birth';

export interface Profile extends Birth {
  id: string;
  name: string;
  gender: 'M' | 'F';
}

const KEY = 'saju.profiles';
const CUR = 'saju.current';
const PENDING = 'saju.pending';
const MAX = 6;

function read<T>(storage: 'local' | 'session', key: string, fallback: T): T {
  try {
    const s = storage === 'local' ? localStorage : sessionStorage;
    const raw = s.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}
function write(storage: 'local' | 'session', key: string, value: unknown) {
  try {
    const s = storage === 'local' ? localStorage : sessionStorage;
    if (value == null) s.removeItem(key);
    else s.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function profiles(): Profile[] {
  const list = read<Profile[]>('local', KEY, []);
  return Array.isArray(list) ? list.filter((p) => p && p.y && p.m && p.d) : [];
}

export function currentProfile(): Profile | null {
  const list = profiles();
  const id = read<string | null>('local', CUR, null);
  return list.find((p) => p.id === id) ?? list[0] ?? null;
}

export function sameBirth(a: Omit<Profile, 'id'>, b: Omit<Profile, 'id'>) {
  return a.name === b.name && a.y === b.y && a.m === b.m && a.d === b.d && a.cal === b.cal && a.t === b.t && a.gender === b.gender;
}

export function saveProfile(p: Omit<Profile, 'id'> & { id?: string }, makeCurrent = true): Profile {
  const list = profiles();
  let saved = list.find((x) => (p.id && x.id === p.id) || sameBirth(x, p));
  if (saved) Object.assign(saved, p, { id: saved.id });
  else {
    saved = { ...p, id: p.id ?? Math.random().toString(36).slice(2, 10) } as Profile;
    list.unshift(saved);
  }
  write('local', KEY, list.slice(0, MAX));
  if (makeCurrent) write('local', CUR, saved.id);
  return saved;
}

export function setCurrent(id: string) {
  write('local', CUR, id);
}

export function removeProfile(id: string) {
  write(
    'local',
    KEY,
    profiles().filter((p) => p.id !== id),
  );
}

export function clearProfiles() {
  write('local', KEY, null);
  write('local', CUR, null);
}

// 분석 중 화면 → 결과 페이지로 넘길 입력값 (탭을 닫으면 사라짐)
export interface Pending {
  kind: string;
  a: Omit<Profile, 'id'>;
  b?: Omit<Profile, 'id'>;
  date?: string;
  year?: number;
  extra?: Record<string, string>;
}
export function setPending(p: Pending) {
  write('session', PENDING, p);
}
export function getPending(kind: string): Pending | null {
  const p = read<Pending | null>('session', PENDING, null);
  return p && p.kind === kind ? p : null;
}

export function birthLabel(p: Pick<Profile, 'y' | 'm' | 'd' | 'cal' | 'leap'>) {
  return `${p.y}.${String(p.m).padStart(2, '0')}.${String(p.d).padStart(2, '0')} ${p.cal === 'lunar' ? (p.leap ? '음(윤)' : '음') : '양'}`;
}

// 이름 + 조사 ('님' 붙임): 지민 → 지민님
export function honor(name: string) {
  return name ? `${name}님` : '나';
}
