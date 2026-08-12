/*
  starfield.js — fond étoilé ambiant.
  Indépendant du reste : peut être coupé/remplacé sans toucher au routage.
*/
(function () {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let stars = [];
  let shootingStar = null;
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth * window.devicePixelRatio;
    height = canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    seedStars();
  }

  function seedStars() {
    const count = Math.floor((window.innerWidth * window.innerHeight) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: (Math.random() * 1.3 + 0.3) * window.devicePixelRatio,
      baseAlpha: Math.random() * 0.5 + 0.25,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005,
    }));
  }

  function maybeSpawnShootingStar() {
    if (shootingStar || reduceMotion) return;
    if (Math.random() < 0.0025) {
      const startX = Math.random() * width * 0.6;
      shootingStar = {
        x: startX,
        y: Math.random() * height * 0.3,
        vx: 7 * window.devicePixelRatio,
        vy: 3.2 * window.devicePixelRatio,
        life: 1,
      };
    }
  }

  function drawShootingStar() {
    if (!shootingStar) return;
    const s = shootingStar;
    ctx.save();
    ctx.strokeStyle = `rgba(142, 193, 255, ${s.life})`;
    ctx.lineWidth = 1.4 * window.devicePixelRatio;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.vx * 6, s.y - s.vy * 6);
    ctx.stroke();
    ctx.restore();
    s.x += s.vx;
    s.y += s.vy;
    s.life -= 0.02;
    if (s.life <= 0 || s.x > width || s.y > height) shootingStar = null;
  }

  let t = 0;
  function frame() {
    ctx.clearRect(0, 0, width, height);
    for (const s of stars) {
      const twinkle = reduceMotion ? 0 : Math.sin(t * s.speed * 10 + s.phase) * 0.25;
      ctx.beginPath();
      ctx.fillStyle = `rgba(244, 245, 248, ${Math.max(0, s.baseAlpha + twinkle)})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!reduceMotion) {
      maybeSpawnShootingStar();
      drawShootingStar();
      t += 1;
      requestAnimationFrame(frame);
    }
  }

  window.addEventListener('resize', resize);
  resize();
  frame();
})();
