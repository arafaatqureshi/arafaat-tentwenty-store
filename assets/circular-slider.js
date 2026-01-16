class CircularSliderComponent extends HTMLElement {
  constructor() {
    super();
    this.items = Array.from(this.querySelectorAll('.circular-slider__item'));
    this.total = this.items.length;
    this.activeIndex = 0;
    this.startX = 0;
    this.isDragging = false;
    this.init();
  }

  init() {
    this.update();

    this.addEventListener('mousedown', (e) => this.dragStart(e));
    this.addEventListener('touchstart', (e) => this.dragStart(e), { passive: true });
    window.addEventListener('mousemove', (e) => this.dragMove(e));
    window.addEventListener('touchmove', (e) => this.dragMove(e));
    window.addEventListener('mouseup', () => this.dragEnd());
    window.addEventListener('touchend', () => this.dragEnd());
  }

  dragStart(e) {
    if (!e.target.closest('.is-active')) return;
    this.isDragging = true;
    this.startX = this.getPosX(e);
    this.style.cursor = 'grabbing';
  }

  dragMove(e) {
    if (!this.isDragging) return;
    const currentX = this.getPosX(e);
    const diff = currentX - this.startX;
    const activeSlide = this.items[this.activeIndex];
    activeSlide.style.transform = `translate(calc(-50% + ${diff * 0.2}px), -50%) scale(1.02)`;

    if (Math.abs(diff) > 120) {
      this.rotate(diff > 0 ? -1 : 1);
      this.dragEnd();
    }
  }

  dragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.style.cursor = 'grab';
    this.update();
  }

  getPosX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  rotate(direction) {
    this.activeIndex = (this.activeIndex + direction + this.total) % this.total;
    this.update();
  }

update() {
  const prev = (this.activeIndex - 1 + this.total) % this.total;
  const next = (this.activeIndex + 1) % this.total;

  this.items.forEach((item, index) => {
    item.style.transform = ''; 
    item.style.opacity = '';
    
    item.classList.remove('is-active', 'is-prev', 'is-next');

    if (index === this.activeIndex) {
      item.classList.add('is-active');
    } else if (index === prev) {
      item.classList.add('is-prev');
    } else if (index === next) {
      item.classList.add('is-next');
    }
  });
}
}

customElements.define('circular-slider-component', CircularSliderComponent);