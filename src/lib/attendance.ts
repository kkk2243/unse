import { store, todayKST } from './ui';

// 오늘의 운세 출석 체크. 이 기기의 브라우저에만 저장됩니다.
const KEY = 'saju.attendance';

function shift(ymd: string, days: number) {
  const [y, m, d] = ymd.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return t.toISOString().slice(0, 10);
}

export function attendanceDays(): string[] {
  const days = store.get<string[]>(KEY, []);
  return Array.isArray(days) ? days : [];
}

export function markToday() {
  const today = todayKST();
  const days = attendanceDays();
  if (!days.includes(today)) {
    days.push(today);
    days.sort();
    // 최근 400일만 보관
    store.set(KEY, days.slice(-400));
    return true;
  }
  return false;
}

export function streak(): number {
  const set = new Set(attendanceDays());
  let d = todayKST();
  if (!set.has(d)) d = shift(d, -1); // 오늘 아직 안 봤으면 어제까지의 연속 기록
  let n = 0;
  while (set.has(d)) {
    n++;
    d = shift(d, -1);
  }
  return n;
}

export function checkedToday() {
  return attendanceDays().includes(todayKST());
}

const LABELS = ['월', '화', '수', '목', '금', '토', '일'];

export function thisWeek() {
  const today = todayKST();
  const [y, m, d] = today.split('-').map(Number);
  const dow = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7; // 월=0
  const set = new Set(attendanceDays());
  return LABELS.map((label, i) => {
    const date = shift(today, i - dow);
    return { label, date, done: set.has(date), isToday: date === today, future: date > today };
  });
}

export function totalDays() {
  return attendanceDays().length;
}
