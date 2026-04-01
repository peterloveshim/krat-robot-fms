"use client";

import { useEffect, useRef, type JSX } from "react";

type RobotConfig = {
  worldX: number;
  startZ: number;
  speed: number;
  pingOffset: number;
};

const ROBOTS: RobotConfig[] = [
  { worldX: -0.30, startZ: 0.3, speed: 0.38, pingOffset: 0.0 },
  { worldX:  0.42, startZ: 2.2, speed: 0.24, pingOffset: 1.6 },
  { worldX: -0.06, startZ: 4.9, speed: 0.52, pingOffset: 0.9 },
];

const ROBOT_MIN_Z  = 1.0;
const ROBOT_MAX_Z  = 9.5;
const VERT_LINES   = 14;
const HORIZ_LINES  = 22;
const SCROLL_SPEED = 0.35;
const PULSE_PERIOD = 4.5;
const VP_Y_RATIO   = 0.36;

export function AnimatedBackground(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let startTime: number | null = null;

    function resize(): void {
      if (!canvas) return;
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function draw(timestamp: number): void {
      if (!canvas || !ctx) return;
      if (startTime === null) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      const W = canvas.width;
      const H = canvas.height;
      if (W === 0 || H === 0) { rafId = requestAnimationFrame(draw); return; }

      const vpX      = W / 2;
      const vpY      = H * VP_Y_RATIO;
      const gridSpan = W * 0.85; // 바닥에서의 격자 반폭

      // ── 배경 ─────────────────────────────────────────────
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      // ── 소실점 주변 청색 미광 ────────────────────────────
      const horizGlow = ctx.createRadialGradient(vpX, vpY, 0, vpX, vpY, H * 0.55);
      horizGlow.addColorStop(0, "rgba(30,90,220,0.18)");
      horizGlow.addColorStop(0.5, "rgba(20,50,160,0.06)");
      horizGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = horizGlow;
      ctx.fillRect(0, 0, W, H);

      // ── 수직 격자선 ──────────────────────────────────────
      for (let i = 0; i <= VERT_LINES; i++) {
        const t    = i / VERT_LINES;
        const botX = vpX - gridSpan + t * gridSpan * 2;

        // 중앙 2개는 청색 액센트
        const isAccent = i === 5 || i === 9;
        // 중앙에 가까울수록 약간 밝게
        const distFromCenter = Math.abs(t - 0.5) * 2; // 0(중앙)~1(끝)
        const lineAlpha = 0.18 - distFromCenter * 0.08;

        ctx.strokeStyle = isAccent
          ? "rgba(70,160,255,0.45)"
          : `rgba(255,255,255,${lineAlpha.toFixed(3)})`;
        ctx.lineWidth = isAccent ? 0.8 : 0.6;

        ctx.beginPath();
        ctx.moveTo(vpX, vpY);
        ctx.lineTo(botX, H);
        ctx.stroke();
      }

      // ── 수평 격자선 (원근 스크롤) ────────────────────────
      const scrollT = (elapsed * SCROLL_SPEED) % 1;

      for (let n = 1; n <= HORIZ_LINES; n++) {
        const relZ = n - scrollT;
        if (relZ <= 0.05) continue;

        const screenY = vpY + (H - vpY) / relZ;
        if (screenY > H + 2 || screenY < vpY) continue;

        const nearness = (screenY - vpY) / (H - vpY);
        // 가까울수록(바닥) 밝게, 지수적으로
        const alpha = nearness * nearness * 0.35 + nearness * 0.04;
        ctx.strokeStyle = `rgba(255,255,255,${Math.min(0.4, alpha).toFixed(3)})`;
        ctx.lineWidth = 0.6;

        const x1 = vpX - gridSpan * nearness;
        const x2 = vpX + gridSpan * nearness;
        ctx.beginPath();
        ctx.moveTo(x1, screenY);
        ctx.lineTo(x2, screenY);
        ctx.stroke();
      }

      // ── 스캔 펄스 ─────────────────────────────────────────
      const pulsePhase = (elapsed % PULSE_PERIOD) / PULSE_PERIOD;
      if (pulsePhase < 0.30) {
        const progress  = pulsePhase / 0.30;
        const pulseY    = vpY + (H - vpY) * progress;
        const peakAlpha = Math.sin(progress * Math.PI) * 0.22;

        // 펄스 주선
        const grad = ctx.createLinearGradient(0, 0, W, 0);
        grad.addColorStop(0,    "rgba(255,255,255,0)");
        grad.addColorStop(0.15, `rgba(80,160,255,${(peakAlpha * 0.5).toFixed(3)})`);
        grad.addColorStop(0.5,  `rgba(140,200,255,${peakAlpha.toFixed(3)})`);
        grad.addColorStop(0.85, `rgba(80,160,255,${(peakAlpha * 0.5).toFixed(3)})`);
        grad.addColorStop(1,    "rgba(255,255,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, pulseY);
        ctx.lineTo(W, pulseY);
        ctx.stroke();

        // 펄스 글로우 (두꺼운 선)
        const glowGrad = ctx.createLinearGradient(0, 0, W, 0);
        glowGrad.addColorStop(0,   "rgba(0,0,0,0)");
        glowGrad.addColorStop(0.3, `rgba(60,130,255,${(peakAlpha * 0.15).toFixed(3)})`);
        glowGrad.addColorStop(0.5, `rgba(100,170,255,${(peakAlpha * 0.2).toFixed(3)})`);
        glowGrad.addColorStop(0.7, `rgba(60,130,255,${(peakAlpha * 0.15).toFixed(3)})`);
        glowGrad.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.strokeStyle = glowGrad;
        ctx.lineWidth   = 12;
        ctx.beginPath();
        ctx.moveTo(0, pulseY);
        ctx.lineTo(W, pulseY);
        ctx.stroke();
      }

      // ── 로봇 점 ──────────────────────────────────────────
      const zRange = ROBOT_MAX_Z - ROBOT_MIN_Z;

      for (let i = 0; i < ROBOTS.length; i++) {
        const cfg    = ROBOTS[i];
        const worldZ = ROBOT_MIN_Z + ((cfg.startZ + cfg.speed * elapsed) % zRange);
        const worldX = cfg.worldX + Math.sin(elapsed * 0.35 + i * 1.9) * 0.04;

        const screenX      = vpX + (worldX * W * 0.44) / worldZ;
        const screenYRobot = vpY + (H - vpY) / worldZ;

        if (screenYRobot < vpY + 5 || screenYRobot > H + 10) continue;
        if (screenX < -30 || screenX > W + 30) continue;

        const dotRadius = Math.max(1.5, 5.0 / Math.sqrt(worldZ));
        const dotAlpha  = Math.min(0.95, 2.0 / worldZ);

        // 핑 링
        const pingAge = (elapsed + cfg.pingOffset) % 2.8;
        if (pingAge < 1.2) {
          const ringProg  = pingAge / 1.2;
          const ringR     = dotRadius + ringProg * (18 / worldZ);
          const ringAlpha = (1 - ringProg) * 0.5;
          ctx.beginPath();
          ctx.arc(screenX, screenYRobot, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(180,220,255,${ringAlpha.toFixed(3)})`;
          ctx.lineWidth   = 1.0;
          ctx.stroke();
        }

        // 외곽 글로우
        const glowR = dotRadius * 3.5;
        const glowGrad = ctx.createRadialGradient(
          screenX, screenYRobot, 0,
          screenX, screenYRobot, glowR,
        );
        glowGrad.addColorStop(0, `rgba(180,220,255,${(dotAlpha * 0.4).toFixed(3)})`);
        glowGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(screenX, screenYRobot, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // 도트 본체
        ctx.beginPath();
        ctx.arc(screenX, screenYRobot, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${dotAlpha.toFixed(3)})`;
        ctx.fill();
      }

      // ── 주변부 비네팅 (중앙 카드 주변을 어둡게) ───────────
      const vignette = ctx.createRadialGradient(
        vpX, H * 0.52, H * 0.22,
        vpX, H * 0.52, H * 0.78,
      );
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, W, H);

      rafId = requestAnimationFrame(draw);
    }

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block"
      aria-hidden="true"
    />
  );
}
