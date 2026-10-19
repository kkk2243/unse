// 궁합 초대장: 내 이름과 생년월일을 링크에 담아 보내면, 받은 사람은 자기 정보만 넣고 바로 궁합을 봐요.
// 서버에 저장하지 않고 링크 자체에 담습니다. (보낸 사람이 직접 선택했을 때만 만들어져요)
import type { Profile } from './profile';

type P = Omit<Profile, 'id'>;
const KEY = 'saju-yeonguwon';

function xor(bytes: Uint8Array) {
  return bytes.map((b, i) => b ^ KEY.charCodeAt(i % KEY.length));
}

export function encodeInvite(p: P) {
  const json = JSON.stringify([p.name.slice(0, 10), p.gender, p.y, p.m, p.d, p.cal === 'lunar' ? 1 : 0, p.leap ? 1 : 0, p.t]);
  const bytes = xor(new TextEncoder().encode(json));
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeInvite(code: string): P | null {
  try {
    const bin = atob(code.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = xor(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
    const [name, gender, y, m, d, lunar, leap, t] = JSON.parse(new TextDecoder().decode(bytes));
    if (typeof name !== 'string' || !(y > 1900 && y < 2100) || !(m >= 1 && m <= 12) || !(d >= 1 && d <= 31)) return null;
    return { name: name.slice(0, 10), gender: gender === 'M' ? 'M' : 'F', y, m, d, cal: lunar ? 'lunar' : 'solar', leap: !!leap, t: Number.isInteger(t) && t >= -1 && t < 12 ? t : -1 };
  } catch {
    return null;
  }
}

export const inviteUrl = (p: P) => `${location.origin}/gunghap/?invite=${encodeInvite(p)}`;
