class HeroFarms extends HTMLElement {
  constructor() {
    super();
    this.current = 0;
    this.isAnimating = false;
  }

  connectedCallback() {
    this.slides = [...this.querySelectorAll('[data-hero-slide]')];
    this.nextBtn = this.querySelector('[data-hero-next]');
    this.thumbImg = this.querySelector('[data-hero-thumb-image]');
    this.progressEl = this.querySelector('[data-hero-progress]');
    this.duration = Number(this.dataset.autoplay) || 5000;

    const totalEl = this.querySelector('[data-hero-total]');
    if (totalEl) totalEl.textContent = this.slides.length.toString().padStart(2, '0');

    this.init();
  }

  init() {
    this.updateUI();
    this.startAutoplay();
    this.nextBtn?.addEventListener('click', () => !this.isAnimating && this.goToNext());
  }

  goToNext() {
    const prev = this.current;
    this.current = (this.current + 1) % this.slides.length;
    this.runTransition(prev, this.current);
  }

  runTransition(oldIdx, newIdx) {
    this.isAnimating = true;
    const container = this.querySelector('.hero-farms__slides');
    const oldImgUrl = this.slides[oldIdx].dataset.image;
    const overlay = document.createElement('div');
    overlay.className = 'hero-split-layer';
    overlay.style.backgroundImage = `url(${oldImgUrl})`;
    container.appendChild(overlay);
    this.slides[oldIdx].classList.remove('is-active');
    this.slides[newIdx].classList.add('is-active');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add('is-animating');
      });
    });

    setTimeout(() => {
      overlay.remove();
      this.isAnimating = false;
      this.updateUI();
      this.startAutoplay();
    }, 1300);
  }

  updateUI() {
    const curEl = this.querySelector('[data-hero-current]');
    if (curEl) curEl.textContent = (this.current + 1).toString().padStart(2, '0');
    
    const nextIdx = (this.current + 1) % this.slides.length;
    if (this.thumbImg) this.thumbImg.src = this.slides[nextIdx].dataset.image;
  }

  startAutoplay() {
    if (this.progressRAF) cancelAnimationFrame(this.progressRAF);
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / this.duration, 1);
      if (this.progressEl) this.progressEl.style.strokeDashoffset = 1 - progress;

      if (progress < 1) {
        this.progressRAF = requestAnimationFrame(tick);
      } else {
        this.goToNext();
      }
    };
    this.progressRAF = requestAnimationFrame(tick);
  }
}

customElements.define('hero-farms', HeroFarms);