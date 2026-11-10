/* Vàng Bạc — motion layer. Vanilla JS, progressive enhancement. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, {passive:true});

  if (reduce) return;
  document.body.classList.add('vb-motion-ready');
  const selectors = [
    '.section-tag','.section-title-row','.problem','.outcomes-title','.outcome',
    '.roadmap-path-item','.session-row','.roadmap-proof','.vb-demo-rail>a',
    '.evidence-video','.vb-calendar-switcher','.vb-evidence-end','.vb50-head',
    '.vb50-book-wrap','.vb50-ebook-copy','.vb50-stats','.vb50-preview',
    '.vb50-podcast-copy','.vb50-audio','.vb50-episodes li','.video-layout',
    '.faq-lead','.faq-questions details','.register-card','.footer-main'
  ];
  const nodes = document.querySelectorAll(selectors.join(','));
  nodes.forEach((node, index) => {
    node.setAttribute('data-reveal', node.matches('.problem,.outcome,.session-row') ? 'scale' : 'up');
    node.style.setProperty('--reveal-delay', (index % 4) * 65 + 'ms');
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.12, rootMargin:'0px 0px -45px 0px'});
    nodes.forEach(node => observer.observe(node));
  } else {
    nodes.forEach(node => node.classList.add('is-visible'));
  }

  const glow = document.createElement('div');
  glow.className = 'vb-cursor-glow';
  glow.setAttribute('aria-hidden','true');
  document.body.appendChild(glow);
  let raf = 0;
  window.addEventListener('pointermove', event => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--mx', event.clientX + 'px');
      document.documentElement.style.setProperty('--my', event.clientY + 'px');
      raf = 0;
    });
  }, {passive:true});
})();
