/**
 * Geeta Bhawan Mandir — Sacred 3D Background Engine
 * Lightweight, high-performance pure Canvas 3D perspective projection.
 * Zero external libraries (Zero Three.js bloat).
 * Features:
 *  1. Floating 3D Sacred Light Sparks / Tejas Embers with depth-scaling & glow.
 *  2. 3D Tumbling Pushpanjali Golden Petals with 3D rotation matrices.
 *  3. Interactive 3D Perspective Tilt on mouse move / scroll.
 * Respects prefers-reduced-motion and pauses when tab is hidden.
 */

export function init3DBackground() {
  const canvas = document.getElementById('bg-sacred-3d-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Check prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let centerX = width / 2;
  let centerY = height / 2;
  const fov = 420;

  // Mouse tilt variables (smooth lerped)
  let targetTiltX = 0;
  let targetTiltY = 0;
  let tiltX = 0;
  let tiltY = 0;

  function onResize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centerX = width / 2;
    centerY = height / 2;
  }
  window.addEventListener('resize', onResize, { passive: true });

  window.addEventListener('mousemove', (e) => {
    targetTiltX = ((e.clientX / width) - 0.5) * 0.4;
    targetTiltY = ((e.clientY / height) - 0.5) * 0.4;
  }, { passive: true });

  // 1. Sacred 3D Light Embers (Tejas)
  const isMobile = width < 768;
  const emberCount = isMobile ? 22 : 45;
  const embers = [];

  for (let i = 0; i < emberCount; i++) {
    embers.push({
      x: (Math.random() - 0.5) * width * 1.4,
      y: (Math.random() - 0.5) * height * 1.5,
      z: Math.random() * 800 - 200,
      radius: Math.random() * 2.2 + 1.2,
      speedY: Math.random() * 0.4 + 0.2,
      swaySpeed: Math.random() * 0.02 + 0.01,
      swayOffset: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.4 + 0.2,
      color: Math.random() > 0.4 ? 'rgba(234, 179, 8,' : 'rgba(249, 115, 22,'
    });
  }

  // 2. 3D Tumbling Sacred Golden Flower Petals (Pushpanjali)
  const petalCount = isMobile ? 8 : 16;
  const petals = [];

  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: (Math.random() - 0.5) * width * 1.2,
      y: (Math.random() - 0.5) * height * 1.6,
      z: Math.random() * 700 - 150,
      size: Math.random() * 8 + 8,
      speedY: Math.random() * 0.5 + 0.3,
      speedX: (Math.random() - 0.5) * 0.3,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotZ: Math.random() * Math.PI * 2,
      rotSpeedX: (Math.random() - 0.5) * 0.02,
      rotSpeedY: (Math.random() - 0.5) * 0.025,
      rotSpeedZ: (Math.random() - 0.5) * 0.015,
      color: Math.random() > 0.35 
        ? { r: 245, g: 158, b: 11, a: 0.38 } // Golden Marigold
        : { r: 220, g: 38, b: 38, a: 0.28 }  // Sacred Rose Sindoor
    });
  }

  // 3. 3D Sacred Geometric Rings (Rotating Cosmic Mandala Wireframe in 3D space)
  const ringCount = 3;
  let mandalaAngle = 0;

  let animFrameId = null;
  let isTabActive = true;

  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
    if (isTabActive && !animFrameId) {
      loop();
    }
  });

  function render3DProjectedPoint(x, y, z) {
    // Apply 3D tilt rotation
    const cosY = Math.cos(tiltX);
    const sinY = Math.sin(tiltX);
    const cosX = Math.cos(tiltY);
    const sinX = Math.sin(tiltY);

    // Rotate Y
    let x1 = x * cosY - z * sinY;
    let z1 = z * cosY + x * sinY;

    // Rotate X
    let y1 = y * cosX - z1 * sinX;
    let z2 = z1 * cosX + y * sinX;

    const scale = fov / (fov + z2);
    if (scale <= 0) return null;

    return {
      x: centerX + x1 * scale,
      y: centerY + y1 * scale,
      scale: scale,
      depth: z2
    };
  }

  function loop() {
    if (!isTabActive) {
      animFrameId = null;
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // Smooth tilt lerp
    tiltX += (targetTiltX - tiltX) * 0.05;
    tiltY += (targetTiltY - tiltY) * 0.05;

    mandalaAngle += 0.003;

    // A. Draw 3D Sacred Concentric Geometric Wireframe
    ctx.save();
    for (let r = 0; r < ringCount; r++) {
      const radius = 180 + r * 110;
      const ringZ = Math.sin(mandalaAngle + r * 1.2) * 80;
      const segments = 16;
      ctx.beginPath();

      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2 + (r % 2 === 0 ? mandalaAngle : -mandalaAngle * 0.8);
        const px = Math.cos(theta) * radius;
        const py = Math.sin(theta) * radius * 0.65; // Inclined perspective plane
        const pt = render3DProjectedPoint(px, py, ringZ);

        if (pt) {
          if (s === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
      }

      ctx.strokeStyle = `rgba(234, 179, 8, ${0.05 + r * 0.02})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw subtle luminous nodes at 8 cardinal & ordinal points of the sacred ring
      for (let s = 0; s < 8; s++) {
        const theta = (s / 8) * Math.PI * 2 + (r % 2 === 0 ? mandalaAngle : -mandalaAngle * 0.8);
        const px = Math.cos(theta) * radius;
        const py = Math.sin(theta) * radius * 0.65;
        const pt = render3DProjectedPoint(px, py, ringZ);
        if (pt && pt.scale > 0) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, Math.max(1, 2.5 * pt.scale), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(254, 240, 138, ${0.15 + r * 0.05})`;
          ctx.fill();
        }
      }
    }
    ctx.restore();

    // B. Draw 3D Sacred Embers
    for (let i = 0; i < embers.length; i++) {
      const e = embers[i];

      e.y -= e.speedY;
      e.swayOffset += e.swaySpeed;
      const currentX = e.x + Math.sin(e.swayOffset) * 20;

      // Wrap around bounds
      if (e.y < -height * 0.8) {
        e.y = height * 0.8;
        e.x = (Math.random() - 0.5) * width * 1.3;
      }

      const pt = render3DProjectedPoint(currentX, e.y, e.z);
      if (pt && pt.scale > 0) {
        const drawRadius = Math.max(0.8, e.radius * pt.scale);
        const alpha = Math.min(0.65, e.opacity * pt.scale);

        // Soft radial glow
        const glow = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, drawRadius * 3);
        glow.addColorStop(0, `${e.color} ${alpha})`);
        glow.addColorStop(0.5, `${e.color} ${alpha * 0.4})`);
        glow.addColorStop(1, `${e.color} 0)`);

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, drawRadius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Bright center spark
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, drawRadius * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // C. Draw 3D Tumbling Petals (Pushpanjali)
    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];

      p.y += p.speedY;
      p.x += p.speedX;
      p.rotX += p.rotSpeedX;
      p.rotY += p.rotSpeedY;
      p.rotZ += p.rotSpeedZ;

      if (p.y > height * 0.85) {
        p.y = -height * 0.85;
        p.x = (Math.random() - 0.5) * width * 1.2;
      }

      const pt = render3DProjectedPoint(p.x, p.y, p.z);
      if (pt && pt.scale > 0) {
        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(p.rotZ);

        // 3D perspective foreshortening based on rotX / rotY
        const scaleX = Math.cos(p.rotY) * pt.scale;
        const scaleY = Math.sin(p.rotX) * pt.scale;
        ctx.scale(scaleX, scaleY);

        const sz = p.size;
        ctx.beginPath();
        // Sacred petal curved path
        ctx.moveTo(0, -sz);
        ctx.bezierCurveTo(sz * 0.7, -sz * 0.5, sz * 0.7, sz * 0.5, 0, sz);
        ctx.bezierCurveTo(-sz * 0.7, sz * 0.5, -sz * 0.7, -sz * 0.5, 0, -sz);

        const col = p.color;
        const alpha = Math.max(0.05, col.a * pt.scale);
        ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${alpha})`;
        ctx.fill();

        // Subtle petal vein highlight
        ctx.strokeStyle = `rgba(254, 240, 138, ${alpha * 0.5})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        ctx.restore();
      }
    }

    animFrameId = requestAnimationFrame(loop);
  }

  loop();
}
