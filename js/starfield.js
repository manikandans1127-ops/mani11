/**
 * Starfield & Cosmic Particle Engine
 * High-performance 60fps HTML5 Canvas background with twinkling stars,
 * shooting stars with trails, and interactive stardust.
 */

class CosmicStarfield {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.stars = [];
    this.shootingStars = [];
    this.dustParticles = [];
    
    this.starCount = window.innerWidth < 768 ? 120 : 250;
    this.cursor = { x: -100, y: -100, isMoving: false };
    this.cursorTimer = null;
    
    this.colors = [
      'rgba(255, 255, 255, ',
      'rgba(254, 205, 211, ', // Pink-200
      'rgba(253, 164, 175, ', // Pink-300
      'rgba(254, 240, 138, '  // Gold-200
    ];

    this.init();
  }

  init() {
    this.resize();
    this.createStars();
    this.bindEvents();
    this.loop();
    this.scheduleShootingStar();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createStars() {
    this.stars = [];
    for (let i = 0; i < this.starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.6 + 0.4,
        colorBase: this.colors[Math.floor(Math.random() * this.colors.length)],
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createStars();
    });

    // Touch & Mouse Movement Interactive Dust
    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      this.cursor.x = clientX;
      this.cursor.y = clientY;
      
      // Spawn stardust
      if (Math.random() > 0.6) {
        this.dustParticles.push({
          x: clientX + (Math.random() * 10 - 5),
          y: clientY + (Math.random() * 10 - 5),
          radius: Math.random() * 2 + 1,
          alpha: 0.9,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          decay: Math.random() * 0.03 + 0.015,
          color: Math.random() > 0.5 ? '#fda4af' : '#ffffff'
        });
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });
  }

  scheduleShootingStar() {
    const nextInterval = Math.random() * 6000 + 4000; // Every 4-10s
    setTimeout(() => {
      this.spawnShootingStar();
      this.scheduleShootingStar();
    }, nextInterval);
  }

  spawnShootingStar() {
    const startX = Math.random() * (this.width * 0.8) + this.width * 0.1;
    const startY = Math.random() * (this.height * 0.3);
    const length = Math.random() * 80 + 100;
    const speed = Math.random() * 7 + 10;
    const angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1); // ~45 deg

    this.shootingStars.push({
      x: startX,
      y: startY,
      length: length,
      speed: speed,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      alpha: 1,
      decay: 0.015
    });
  }

  loop() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Twinkling Stars
    for (let star of this.stars) {
      star.alpha += star.twinkleSpeed * star.twinkleDir;
      if (star.alpha >= 0.95) {
        star.alpha = 0.95;
        star.twinkleDir = -1;
      } else if (star.alpha <= 0.2) {
        star.alpha = 0.2;
        star.twinkleDir = 1;
      }

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `${star.colorBase}${star.alpha})`;
      this.ctx.shadowBlur = star.radius > 1.2 ? 6 : 0;
      this.ctx.shadowColor = '#f43f5e';
      this.ctx.fill();
    }
    this.ctx.shadowBlur = 0;

    // 2. Draw Interactive Dust Particles
    for (let i = this.dustParticles.length - 1; i >= 0; i--) {
      let p = this.dustParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.dustParticles.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fill();
      this.ctx.globalAlpha = 1.0;
    }

    // 3. Draw Shooting Stars with Fading Tails
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      let s = this.shootingStars[i];
      s.x += s.dx;
      s.y += s.dy;
      s.alpha -= s.decay;

      if (s.alpha <= 0 || s.x > this.width + 100 || s.y > this.height + 100) {
        this.shootingStars.splice(i, 1);
        continue;
      }

      const tailX = s.x - (s.dx / s.speed) * s.length;
      const tailY = s.y - (s.dy / s.speed) * s.length;

      const grad = this.ctx.createLinearGradient(s.x, s.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${s.alpha})`);
      grad.addColorStop(0.3, `rgba(253, 164, 175, ${s.alpha * 0.8})`);
      grad.addColorStop(1, `rgba(244, 63, 94, 0)`);

      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y);
      this.ctx.lineTo(tailX, tailY);
      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Head Sparkle
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      this.ctx.fill();
    }

    requestAnimationFrame(() => this.loop());
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.starfield = new CosmicStarfield('cosmic-canvas');
});
