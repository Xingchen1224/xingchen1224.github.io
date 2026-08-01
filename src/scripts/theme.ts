// Theme (light/dark) + accent picker controller.
const STORE = { theme: 'xw-theme', accent: 'xw-accent' };

function get(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function set(key: string, val: string): void {
  try {
    localStorage.setItem(key, val);
  } catch {
    /* ignore */
  }
}

export function initTheme(): void {
  const root = document.documentElement;
  const wrap = document.querySelector<HTMLElement>('[data-settings]');
  if (!wrap) return;

  const state = {
    theme: get(STORE.theme, root.getAttribute('data-theme') || 'dark'),
    accent: get(STORE.accent, root.getAttribute('data-accent') || 'cyan'),
  };

  const applyTheme = (t: string) => root.setAttribute('data-theme', t);
  const applyAccent = (a: string) => root.setAttribute('data-accent', a);
  applyTheme(state.theme);
  applyAccent(state.accent);

  const btn = wrap.querySelector<HTMLButtonElement>('.xw-settings__btn');
  btn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = wrap.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target as Node)) {
      wrap.classList.remove('open');
      btn?.setAttribute('aria-expanded', 'false');
    }
  });

  function sync() {
    wrap!.querySelectorAll<HTMLButtonElement>('[data-role="theme"] button').forEach((b) => {
      b.setAttribute('aria-pressed', b.dataset.val === state.theme ? 'true' : 'false');
    });
    wrap!.querySelectorAll<HTMLButtonElement>('[data-role="accent"] button').forEach((b) => {
      b.setAttribute('aria-pressed', b.dataset.val === state.accent ? 'true' : 'false');
    });
  }

  wrap.querySelector('[data-role="theme"]')?.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
    if (!b?.dataset.val) return;
    state.theme = b.dataset.val;
    set(STORE.theme, state.theme);
    applyTheme(state.theme);
    sync();
  });
  wrap.querySelector('[data-role="accent"]')?.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
    if (!b?.dataset.val) return;
    state.accent = b.dataset.val;
    set(STORE.accent, state.accent);
    applyAccent(state.accent);
    sync();
  });

  sync();
}
