// Light / dark toggle. The first paint is handled by the inline script in
// BaseLayout; this only wires the button and remembers the choice.
const KEY = 'xw-theme';

export function initTheme(): void {
  const root = document.documentElement;
  const btn = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (!btn) return;

  const sync = () => {
    btn!.setAttribute('aria-checked', root.getAttribute('data-theme') === 'dark' ? 'true' : 'false');
  };

  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage blocked — the choice just won't persist */
    }
    sync();
  });

  sync();
}
