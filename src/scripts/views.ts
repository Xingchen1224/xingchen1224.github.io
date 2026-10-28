// Footer view counter: reads the public GoatCounter site total and reveals it.
// Stays hidden if the request fails (counts not made public, offline, blocked).
export function initViews(): void {
  const el = document.querySelector<HTMLElement>('[data-views]');
  const code = el?.dataset.views;
  if (!el || !code) return;

  fetch(`https://${code}.goatcounter.com/counter/TOTAL.json`)
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((d: { count?: string }) => {
      if (!d.count) return;
      el.textContent = `${d.count} views`;
      el.hidden = false;
    })
    .catch(() => {});
}
