/**
 * Custom Cursor System
 */
export function initCustomCursor() {
  const cursor = document.getElementById("cursor");
  if (!cursor) return;

  // Check if device supports hover
  const hasHover = window.matchMedia("(hover: hover)").matches;
  if (!hasHover) {
    cursor.style.display = "none";
    return;
  }

  let cursorTimeout;
  let mouseX = 0,
    mouseY = 0;
  let cursorX = 0,
    cursorY = 0;

  // Smooth cursor movement using requestAnimationFrame
  function updateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;

    cursorX += dx * 0.15;
    cursorY += dy * 0.15;

    cursor.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px)`;

    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
      requestAnimationFrame(updateCursor);
    }
  }

  // Mouse move handler
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    cursor.classList.add("visible");

    clearTimeout(cursorTimeout);
    cursorTimeout = setTimeout(() => {
      cursor.classList.remove("visible");
    }, 2000);

    if (!cursor.classList.contains("hover")) {
      requestAnimationFrame(updateCursor);
    }
  });

  // Hover effects
  const hoverables = document.querySelectorAll("a, button, .breath");
  hoverables.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("hover");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("hover");
    });
  });
}

/**
 * Background Particle Animation
 */
export function initBackgroundAnimation() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Performance check - disable on slow devices
  if (shouldDisableAnimation()) {
    canvas.style.display = "none";
    return;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = [
    "rgba(148, 163, 184, 0.2)",
    "rgba(148, 163, 184, 0.3)",
    "rgba(148, 163, 184, 0.2)",
    "rgba(148, 163, 184, 0.3)",
  ];

  // Utility functions
  const setAlpha = (color, alpha) =>
    color.replace(/[\d.]+(?=\))/, alpha.toFixed(2));

  const getNumParticles = () => {
    const w = window.innerWidth;
    if (w < 480) return 15;
    if (w < 640) return 25;
    if (w < 1024) return 50;
    return 80;
  };

  const updateMaxDistance = () => {
    const w = window.innerWidth;
    if (w < 480) return 80;
    if (w < 640) return 120;
    return 180;
  };

  function shouldDisableAnimation() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (w < 400) return true;
    if (w < 480 && h < 600) return true;
    if ("ontouchstart" in window && w < 768) return false; // Keep enabled but reduced
    return false;
  }

  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;

      const isMobile = window.innerWidth < 640;
      this.size = isMobile ? Math.random() * 2 + 1 : Math.random() * 4 + 2;

      const speedMultiplier = isMobile ? 0.5 : 1;
      this.speedX = (Math.random() * 0.3 - 0.15) * speedMultiplier;
      this.speedY = (Math.random() * 0.3 - 0.15) * speedMultiplier;

      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      const isMobile = window.innerWidth < 640;
      const speedLimit = isMobile ? 0.25 : 0.5;

      this.speedX = Math.max(-speedLimit, Math.min(speedLimit, this.speedX));
      this.speedY = Math.max(-speedLimit, Math.min(speedLimit, this.speedY));

      // Wrap around edges
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Initialize particles
  function populateParticles() {
    particles.length = 0;
    const numParticles = getNumParticles();
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }
  }

  populateParticles();
  let maxDistance = updateMaxDistance();

  let lastFrameTime = 0;
  const targetFPS = window.innerWidth < 640 ? 30 : 60;
  const frameInterval = 1000 / targetFPS;

  function animate(currentTime) {
    if (currentTime - lastFrameTime < frameInterval) {
      requestAnimationFrame(animate);
      return;
    }
    lastFrameTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const opacity = (1 - dist / maxDistance) * 0.45;
          const gradient = ctx.createLinearGradient(
            particles[i].x,
            particles[i].y,
            particles[j].x,
            particles[j].y,
          );
          gradient.addColorStop(0, setAlpha(particles[i].color, opacity));
          gradient.addColorStop(1, setAlpha(particles[j].color, opacity));

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = window.innerWidth < 640 ? 1 : 1.2;
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // Debounced resize handler
  let resizeTimeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      if (shouldDisableAnimation()) {
        canvas.style.display = "none";
        return;
      }

      canvas.style.display = "block";
      maxDistance = updateMaxDistance();
      populateParticles();
    }, 150);
  };

  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", () => {
    setTimeout(handleResize, 100);
  });
}