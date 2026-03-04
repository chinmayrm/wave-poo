import { useEffect, useRef, useCallback } from "react";

interface VaporTextEffectProps {
  text: string;
  fontSize?: number;
  duration?: number;
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

export function VaporTextEffect({
  text,
  fontSize = 100,
  duration = 3200,
  onComplete,
}: VaporTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | undefined>(undefined);
  const doneRef = useRef(false);

  const initAndAnimate = useCallback(() => {
    if (doneRef.current) return; // don't re-run after completion

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Render text offscreen to sample pixels
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#fff";
    ctx.font = `800 ${fontSize}px "Segoe UI", Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, w / 2, h / 2);

    const imgData = ctx.getImageData(0, 0, w * dpr, h * dpr);
    const data = imgData.data;

    // Build particles from white pixels
    const colors = ["#a78bfa", "#818cf8", "#38bdf8", "#e879f9", "#f0abfc", "#67e8f9"];
    const particles: Particle[] = [];
    const step = 3;

    for (let py = 0; py < h * dpr; py += step) {
      for (let px = 0; px < w * dpr; px += step) {
        const i = (py * w * dpr + px) * 4;
        if (data[i] > 128) {
          particles.push({
            x: px / dpr,
            y: py / dpr,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -(Math.random() * 2.5 + 0.5),
            alpha: 1,
            size: 1.5 + Math.random() * 1.5,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }
      }
    }

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);

    const start = performance.now();

    const render = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);

      // Fade trail
      ctx.fillStyle = `rgba(0,0,0,${t < 0.15 ? 0 : 0.12})`;
      ctx.fillRect(0, 0, w, h);

      // First 15% — hold text solidly, then dissolve
      if (t < 0.15) {
        // Draw particles in place
        for (const p of particles) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.globalAlpha = 1;
      } else {
        const dissolve = (t - 0.15) / 0.85;
        let alive = 0;

        for (const p of particles) {
          p.x += p.vx * dissolve * 3;
          p.y += p.vy * dissolve * 3;
          p.vy -= 0.015 * dissolve;
          p.vx += Math.sin(p.y * 0.008 + elapsed * 0.002) * 0.08 * dissolve;
          p.alpha = Math.max(0, 1 - dissolve * 1.3);

          if (p.alpha > 0.005) {
            alive++;
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * (1 - dissolve * 0.5), 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;

        if (alive === 0 || t >= 1) {
          // Paint solid black so nothing flashes
          ctx.globalAlpha = 1;
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, w, h);
          doneRef.current = true;
          onComplete?.();
          return;
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
  }, [text, fontSize, duration, onComplete]);

  useEffect(() => {
    initAndAnimate();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [initAndAnimate]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "block",
        background: "#000",
      }}
    />
  );
}

export default VaporTextEffect;
