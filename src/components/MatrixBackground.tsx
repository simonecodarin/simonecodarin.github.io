import { useEffect, useRef } from "react";

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let isPaused = document.hidden;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    if (!isMobile) window.addEventListener("mousemove", handleMouseMove);

    const handleMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };
    window.addEventListener("mouseout", handleMouseLeave);

    const handleVisibilityChange = () => {
      isPaused = document.hidden;
      if (!isPaused) draw();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const particlesCount = Math.floor((width * height) / (isMobile ? 20000 : 15000));
    const CONNECTION_DISTANCE = isMobile ? 85 : 120;
    const MOUSE_RADIUS = isMobile ? 100 : 150;

    const particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 1.5 + 1,
      });
    }

    const getBgColor = () => {
      const val = getComputedStyle(document.documentElement)
        .getPropertyValue("--background")
        .trim();
      return val ? `hsl(${val})` : (document.body.classList.contains("dark") ? "hsl(220, 20%, 6%)" : "hsl(210, 40%, 96%)");
    };

    const draw = () => {
      if (isPaused) return;

      ctx.clearRect(0, 0, width, height);

      const isDarkMode = document.documentElement.classList.contains("dark") || document.body.classList.contains("dark");
      const bgColor = getBgColor();
      const particleColor = isDarkMode ? "hsla(150, 70%, 55%, 0.6)" : "hsla(150, 60%, 35%, 0.4)";
      const lineColorBase = isDarkMode ? "150, 70%, 55%" : "150, 60%, 35%";
      const highlightHue = isDarkMode ? "150, 90%, 70%" : "150, 90%, 45%";

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const distToMouse = Math.hypot(p.x - mx, p.y - my);
        const isNearMouse = distToMouse < MOUSE_RADIUS;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isNearMouse ? `hsla(${highlightHue}, 0.9)` : particleColor;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONNECTION_DISTANCE) {
            const dist2ToMouse = Math.hypot(p2.x - mx, p2.y - my);
            const lineNearMouse = distToMouse < MOUSE_RADIUS || dist2ToMouse < MOUSE_RADIUS;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);

            if (lineNearMouse) {
              const closestDist = Math.min(distToMouse, dist2ToMouse);
              const proximityFactor = 1 - closestDist / MOUSE_RADIUS;
              const alpha = (1 - distance / CONNECTION_DISTANCE) * 0.5 + proximityFactor * 0.5;
              ctx.strokeStyle = `hsla(${highlightHue}, ${Math.min(alpha, 0.9)})`;
              ctx.lineWidth = 1.2;
            } else {
              const alpha = (1 - distance / CONNECTION_DISTANCE) * (isDarkMode ? 0.25 : 0.2);
              ctx.strokeStyle = `hsla(${lineColorBase}, ${alpha})`;
              ctx.lineWidth = 0.8;
            }

            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    if (!prefersReducedMotion) {
      draw();
    } else {
      ctx.fillStyle = getBgColor();
      ctx.fillRect(0, 0, width, height);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-colors duration-300"
    />
  );
};

export default MatrixBackground;