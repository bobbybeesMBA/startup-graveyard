import { WORLD_W, WORLD_H } from './constants';
import { Camera } from './Camera';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  alphaDir: number;
  color: string;
  type: 'butterfly' | 'sparkle';
}

export class NurseryParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private camera: Camera;

  constructor(viewport: HTMLElement, camera: Camera) {
    this.camera = camera;
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:50;';
    viewport.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.spawnParticles();
  }

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private spawnParticles() {
    const butterflyColors = [
      'rgba(244,160,184,',  // pink
      'rgba(160,200,244,',  // blue
      'rgba(244,220,160,',  // yellow
    ];

    // Butterflies
    for (let i = 0; i < 35; i++) {
      this.particles.push({
        x: Math.random() * WORLD_W,
        y: Math.random() * WORLD_H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3,
        size: 2 + Math.random() * 2.5,
        alpha: Math.random() * 0.5,
        alphaDir: (Math.random() - 0.5) * 0.012,
        color: butterflyColors[Math.floor(Math.random() * butterflyColors.length)],
        type: 'butterfly',
      });
    }

    // Sparkles
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: Math.random() * WORLD_W,
        y: Math.random() * WORLD_H,
        vx: (Math.random() - 0.5) * 0.1,
        vy: -0.05 - Math.random() * 0.08,
        size: 0.8 + Math.random() * 1.2,
        alpha: Math.random() * 0.3,
        alphaDir: (Math.random() - 0.5) * 0.005,
        color: 'rgba(255,220,180,',
        type: 'sparkle',
      });
    }
  }

  update() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);

    for (const p of this.particles) {
      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < 0) p.x = WORLD_W;
      if (p.x > WORLD_W) p.x = 0;
      if (p.y < 0) p.y = WORLD_H;
      if (p.y > WORLD_H) p.y = 0;

      // Pulse alpha
      p.alpha += p.alphaDir;
      if (p.type === 'butterfly') {
        if (p.alpha > 0.6) p.alphaDir = -Math.abs(p.alphaDir);
        if (p.alpha < 0.05) p.alphaDir = Math.abs(p.alphaDir);
      } else {
        if (p.alpha > 0.35) p.alphaDir = -Math.abs(p.alphaDir);
        if (p.alpha < 0.03) p.alphaDir = Math.abs(p.alphaDir);
      }

      // Butterfly drift
      if (p.type === 'butterfly') {
        p.vx += (Math.random() - 0.5) * 0.025;
        p.vy += (Math.random() - 0.5) * 0.025;
        p.vx = Math.max(-0.6, Math.min(0.6, p.vx));
        p.vy = Math.max(-0.5, Math.min(0.5, p.vy));
      }

      // Screen-space position
      const sx = p.x - this.camera.x;
      const sy = p.y - this.camera.y;

      // Skip offscreen
      if (sx < -10 || sx > w + 10 || sy < -10 || sy > h + 10) continue;

      ctx.beginPath();
      ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha.toFixed(3) + ')';
      ctx.fill();

      // Butterfly glow
      if (p.type === 'butterfly' && p.alpha > 0.2) {
        ctx.beginPath();
        ctx.arc(sx, sy, p.size * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (p.alpha * 0.12).toFixed(3) + ')';
        ctx.fill();
      }
    }
  }
}
