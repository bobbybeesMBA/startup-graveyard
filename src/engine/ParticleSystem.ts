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
  type: 'firefly' | 'dust';
}

export class ParticleSystem {
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
    // Fireflies
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: Math.random() * WORLD_W,
        y: Math.random() * WORLD_H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2,
        size: 1.5 + Math.random() * 2,
        alpha: Math.random() * 0.4,
        alphaDir: (Math.random() - 0.5) * 0.01,
        color: `rgba(180,200,120,`,
        type: 'firefly',
      });
    }

    // Dust motes
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: Math.random() * WORLD_W,
        y: Math.random() * WORLD_H,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.05 - Math.random() * 0.1,
        size: 0.8 + Math.random() * 1.2,
        alpha: Math.random() * 0.15,
        alphaDir: (Math.random() - 0.5) * 0.003,
        color: `rgba(180,175,155,`,
        type: 'dust',
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
      if (p.type === 'firefly') {
        if (p.alpha > 0.5) p.alphaDir = -Math.abs(p.alphaDir);
        if (p.alpha < 0.02) p.alphaDir = Math.abs(p.alphaDir);
      } else {
        if (p.alpha > 0.2) p.alphaDir = -Math.abs(p.alphaDir);
        if (p.alpha < 0.02) p.alphaDir = Math.abs(p.alphaDir);
      }

      // Firefly drift
      if (p.type === 'firefly') {
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;
        p.vx = Math.max(-0.5, Math.min(0.5, p.vx));
        p.vy = Math.max(-0.4, Math.min(0.4, p.vy));
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

      // Firefly glow
      if (p.type === 'firefly' && p.alpha > 0.15) {
        ctx.beginPath();
        ctx.arc(sx, sy, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (p.alpha * 0.15).toFixed(3) + ')';
        ctx.fill();
      }
    }
  }
}
