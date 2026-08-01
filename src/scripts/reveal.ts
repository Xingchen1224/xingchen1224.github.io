// Scroll-reveal: fade + rise content as it enters the viewport.
export function initReveal(): void {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = Array.from(
    document.querySelectorAll<HTMLElement>('[data-reveal]')
  );
  if (!targets.length) return;

  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  targets.forEach((el, i) => {
    el.classList.add('xw-reveal');
    el.style.transitionDelay = Math.min(i % 6, 5) * 60 + 'ms';
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  targets.forEach((el) => io.observe(el));
}
