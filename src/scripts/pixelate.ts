// Portrait "develop" effect: the photo resolves from coarse pixels to full
// resolution, the way a progressive image decodes. Purely decorative — the real
// <img> is always underneath, so nothing is lost if this never runs.
const STEPS = [5, 9, 15, 26, 44, 80]; // sampling resolution per frame
const FRAME_MS = 130;

export function initPixelate(): void {
  const fig = document.querySelector<HTMLElement>('[data-pixelate]');
  const img = fig?.querySelector<HTMLImageElement>('img');
  if (!fig || !img) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'hero__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  fig.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const sample = document.createElement('canvas');
  const sctx = sample.getContext('2d')!;
  let running = false;

  async function run() {
    if (running || !ctx) return;
    running = true;
    try {
      await img!.decode();
    } catch {
      /* decode can reject for already-decoded images; drawing still works */
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = Math.round(img!.clientWidth * dpr);
    canvas.width = canvas.height = size;
    canvas.style.opacity = '1';

    for (const s of STEPS) {
      sample.width = sample.height = s;
      sctx.drawImage(img!, 0, 0, s, s);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(sample, 0, 0, s, s, 0, 0, size, size);
      await new Promise((r) => setTimeout(r, FRAME_MS));
    }
    canvas.style.opacity = '0';
    running = false;
  }

  run();
  fig.addEventListener('pointerenter', run);
}
