let toastTimer: number | undefined;

export function toast(msg: string) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('show'), 2200);
}

export function track(name: string, params: Record<string, string | number> = {}) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  try {
    w.gtag?.('event', name, params);
  } catch {}
}

export const store = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

// 오늘 날짜 (한국 시간 기준) YYYY-MM-DD
export function todayKST(d = new Date()) {
  const k = new Date(d.getTime() + (9 * 60 + d.getTimezoneOffset()) * 60000);
  const y = k.getFullYear();
  const m = String(k.getMonth() + 1).padStart(2, '0');
  const day = String(k.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
