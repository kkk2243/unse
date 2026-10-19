// 숨겨져 있던 광고 자리가 화면에 보일 때 한 번만 광고를 요청합니다.
export function fillAds(root: ParentNode) {
  const w = window as unknown as { adsbygoogle?: unknown[] };
  root.querySelectorAll<HTMLElement>('ins.adsbygoogle[data-lazy]').forEach((ins) => {
    if (ins.dataset.requested) return;
    ins.dataset.requested = '1';
    try {
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {}
  });
}
