import { WORLD_W, WORLD_H } from './constants';

export class NurseryWorldBuilder {
  private world: HTMLElement;

  constructor(world: HTMLElement) {
    this.world = world;
  }

  build() {
    this.world.style.width = WORLD_W + 'px';
    this.world.style.height = WORLD_H + 'px';

    this.buildGround();
    this.buildFlowerPatches();
    this.buildPaths();
    this.buildClouds();
    this.buildTrees();
    this.buildBushes();
    this.buildToyBlocks();
    this.buildStars();
    this.buildFences();
  }

  private buildGround() {
    const bg = document.createElement('div');
    bg.style.cssText = 'position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%, #fdf6f8, #f8f0f4 60%, #f4eaee);';
    this.world.appendChild(bg);
  }

  private buildFlowerPatches() {
    for (let i = 0; i < 80; i++) {
      const g = document.createElement('div');
      g.className = 'n-flower-patch';
      const s = 20 + Math.random() * 60;
      const colors = [
        [244, 160, 184], // pink
        [160, 200, 244], // blue
        [200, 232, 200], // green
        [244, 220, 160], // yellow
      ];
      const c = colors[Math.floor(Math.random() * colors.length)];
      const a = 0.15 + Math.random() * 0.15;
      g.style.cssText = `left:${Math.random() * WORLD_W}px;top:${Math.random() * WORLD_H}px;width:${s}px;height:${s * 0.6}px;background:radial-gradient(ellipse, rgba(${c[0]},${c[1]},${c[2]},${a}), transparent 70%);`;
      this.world.appendChild(g);
    }
  }

  private buildPaths() {
    const paths = [
      { x: 0, y: WORLD_H / 2 - 20, w: WORLD_W, h: 40 },
      { x: WORLD_W / 2 - 20, y: 200, w: 40, h: WORLD_H - 400 },
      { x: WORLD_W * 0.25 - 15, y: 400, w: 30, h: 800 },
      { x: WORLD_W * 0.75 - 15, y: 600, w: 30, h: 800 },
    ];
    for (const p of paths) {
      const d = document.createElement('div');
      d.className = 'n-path';
      d.style.cssText = `left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px;border-radius:4px;`;
      this.world.appendChild(d);
    }
  }

  private buildClouds() {
    for (let i = 0; i < 12; i++) {
      const f = document.createElement('div');
      f.className = 'n-cloud';
      const s = 100 + Math.random() * 200;
      f.style.cssText = `left:${Math.random() * WORLD_W}px;top:${Math.random() * WORLD_H}px;width:${s}px;height:${s * 0.5}px;animation-delay:${-Math.random() * 20}s;animation-duration:${15 + Math.random() * 15}s;`;
      this.world.appendChild(f);
    }
  }

  private buildTrees() {
    const positions: [number, number][] = [
      [100, 100], [200, 500], [500, 150], [900, 300], [1200, 100], [1600, 600],
      [2000, 200], [2400, 500], [2700, 150], [800, 1800], [1500, 2000],
      [2200, 1900], [400, 1200], [2600, 1300], [150, 1600], [2800, 800],
      [1800, 1500], [1000, 1000], [2500, 2100], [700, 700],
    ];
    for (const [tx, ty] of positions) {
      const t = document.createElement('div');
      t.className = 'n-deco n-deco-tree';
      t.style.left = tx + 'px';
      t.style.top = ty + 'px';
      t.style.zIndex = String(Math.floor(ty + 80));
      const sz = 0.7 + Math.random() * 0.6;
      t.style.transform = `scale(${sz})`;
      t.innerHTML = '<div class="n-tree-top"></div><div class="n-tree-trunk"></div><div class="n-tree-shadow"></div>';
      this.world.appendChild(t);
    }
  }

  private buildBushes() {
    for (let i = 0; i < 30; i++) {
      const b = document.createElement('div');
      b.className = 'n-deco n-deco-bush';
      b.style.left = Math.random() * WORLD_W + 'px';
      b.style.top = Math.random() * WORLD_H + 'px';
      const sz = 0.6 + Math.random() * 0.8;
      b.style.transform = `scale(${sz})`;
      this.world.appendChild(b);
    }
  }

  private buildToyBlocks() {
    for (let i = 0; i < 20; i++) {
      const r = document.createElement('div');
      r.className = 'n-deco n-deco-block';
      r.style.left = Math.random() * WORLD_W + 'px';
      r.style.top = Math.random() * WORLD_H + 'px';
      const sz = 0.5 + Math.random() * 1.0;
      const colors = ['#f4a0b8', '#a0c8f4', '#f4d488', '#a8d8a8'];
      const c = colors[Math.floor(Math.random() * colors.length)];
      r.style.transform = `scale(${sz}) rotate(${Math.random() * 30 - 15}deg)`;
      r.style.setProperty('--block-color', c);
      this.world.appendChild(r);
    }
  }

  private buildStars() {
    for (let i = 0; i < 15; i++) {
      const s = document.createElement('div');
      s.className = 'n-deco n-deco-star';
      s.style.left = Math.random() * WORLD_W + 'px';
      s.style.top = Math.random() * WORLD_H + 'px';
      const sz = 0.4 + Math.random() * 0.6;
      s.style.transform = `scale(${sz})`;
      s.style.animationDelay = `${-Math.random() * 3}s`;
      this.world.appendChild(s);
    }
  }

  private buildFences() {
    const fences: { x: number; y: number; horiz: boolean; size: number }[] = [
      { x: 100, y: 300, horiz: true, size: 400 },
      { x: 2500, y: 300, horiz: true, size: 400 },
      { x: 100, y: 300, horiz: false, size: 500 },
      { x: 2900, y: 300, horiz: false, size: 500 },
    ];
    for (const f of fences) {
      const el = document.createElement('div');
      el.className = f.horiz ? 'n-fence-h' : 'n-fence-v';
      el.style.left = f.x + 'px';
      el.style.top = f.y + 'px';
      if (f.horiz) el.style.width = f.size + 'px';
      else el.style.height = f.size + 'px';
      this.world.appendChild(el);
    }
  }
}
