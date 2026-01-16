class HeroFarms extends HTMLElement {
  constructor() {
    super();
    this.slides = [];
    this.current = 0;
    this.timer = null;
    this.startTime = null;
    this.raf = null;
  }

  connectedCallback() {
    this.slides = [...this.querySelectorAll('[data-hero-slide]')];
    this.nextBtn = this.querySelector('[data-hero-next]');
    this.thumbImg = this.querySelector('[data-hero-thumb-image]');
    this.currentEl = this.querySelector('[data-hero-current]');
    this.totalEl = this.querySelector('[data-hero-total]');
    this.progressEl = this.querySelector('[data-hero-progress]');

    this.delay = Number(this.dataset.autoplay || 5000);

    this.totalEl.textContent = this.format(this.slides.length);
    this.updateThumbnail();
    this.bind();
    this.startAutoplay();
  }

  bind() {
    this.nextBtn.addEventListener('click', () => {
      this.next();
      this.startAutoplay();
    });
  }

  /* =====================
     AUTOPLAY + PROGRESS
     ===================== */
  startAutoplay() {
    cancelAnimationFrame(this.raf);
    this.startTime = performance.now();
    this.progressEl.style.transform = 'scaleX(0)';

    const tick = (now) => {
      const elapsed = now - this.startTime;
      const progress = Math.min(elapsed / this.delay, 1);

      this.progressEl.style.transform = `scaleX(${progress})`;

      if (progress < 1) {
        this.raf = requestAnimationFrame(tick);
      } else {
        this.next();
        this.startAutoplay();
      }
    };

    this.raf = requestAnimationFrame(tick);
  }

  /* =====================
     SLIDE CHANGE
     ===================== */
  next() {
    this.slides[this.current].classList.remove('is-active');

    this.current = (this.current + 1) % this.slides.length;

    this.slides[this.current].classList.add('is-active');
    this.currentEl.textContent = this.format(this.current + 1);

    this.updateThumbnail();
  }

  updateThumbnail() {
    const nextIndex = (this.current + 1) % this.slides.length;
    const nextSlide = this.slides[nextIndex];
    const nextImage = nextSlide.dataset.image;

    if (this.thumbImg && nextImage) {
      this.thumbImg.src = nextImage;
    }
  }

  format(num) {
    return num < 10 ? `0${num}` : num;
  }
}

customElements.define('hero-farms', HeroFarms);
