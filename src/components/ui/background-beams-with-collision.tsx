import { useEffect, useRef } from "react";

interface BeamsBgProps {
  children?: React.ReactNode;
}

interface Beam {
  x: number;
  y: number;
  len: number;
  angle: number;
  speed: number;
  width: number;
  hue: number;
  opacity: number;
}

export function BackgroundBeamsWithCollision({ children }: BeamsBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    const fit = () => {
      const { width: w, height: h } = wrap.getBoundingClientRect();
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    window.addEventListener("resize", fit);

    const makeBeam = (): Beam => {
      const { width: w, height: h } = wrap.getBoundingClientRect();
      const top = Math.random() > 0.5;
      return {
        x: Math.random() * w,
        y: top ? -80 : h + 80,
        len: 80 + Math.random() * 180,
        angle: top
          ? Math.PI / 2 + (Math.random() - 0.5) * 0.6
          : -Math.PI / 2 + (Math.random() - 0.5) * 0.6,
        speed: 0.8 + Math.random() * 1.8,
        width: 1 + Math.random() * 2,
        hue: 220 + Math.random() * 80,
        opacity: 0.15 + Math.random() * 0.25,
      };
    };

    const beams: Beam[] = Array.from({ length: 24 }, makeBeam);

    const draw = () => {
      const { width: w, height: h } = wrap.getBoundingClientRect();
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < beams.length; i++) {
        const b = beams[i];
        b.x += Math.cos(b.angle) * b.speed;
        b.y += Math.sin(b.angle) * b.speed;

        if (b.y > h + 200 || b.y < -200 || b.x < -150 || b.x > w + 150) {
          beams[i] = makeBeam();
          continue;
        }

        const ex = b.x - Math.cos(b.angle) * b.len;
        const ey = b.y - Math.sin(b.angle) * b.len;

        const grad = ctx.createLinearGradient(b.x, b.y, ex, ey);
        grad.addColorStop(0, `hsla(${b.hue},80%,70%,${b.opacity})`);
        grad.addColorStop(1, `hsla(${b.hue},80%,50%,0)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = b.width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", fit);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#050508",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
      {/* subtle radial overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 60%), " +
            "radial-gradient(ellipse at 80% 100%, rgba(34,211,238,0.06) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 10, width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
}

export default BackgroundBeamsWithCollision;
