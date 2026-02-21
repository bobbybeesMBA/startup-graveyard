import { WORLD_W, WORLD_H } from './constants';

export class WorldBuilder {
  private world: HTMLElement;

  constructor(world: HTMLElement) {
    this.world = world;
  }

  build() {
    this.world.style.width = WORLD_W + 'px';
    this.world.style.height = WORLD_H + 'px';

    this.buildGround();
    this.buildGrassPatches();
    this.buildDirtPaths();
    this.buildFogWisps();
    this.buildTrees();
    this.buildBushes();
    this.buildRocks();
    this.buildLanterns();
    this.buildFences();
  }

  private buildGround() {
    const bg = document.createElement('div');
    bg.style.cssText = 'position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%, #161a0e, #0e1008 60%, #0a0c06);';
    this.world.appendChild(bg);
  }

  private buildGrassPatches() {
    for (let i = 0; i < 80; i++) {
      const g = document.createElement('div');
      g.className = 'grass-patch';
      const s = 20 + Math.random() * 60;
      const r = 30 + Math.random() * 20;
      const gr = 40 + Math.random() * 20;
      const b = 15 + Math.random() * 15;
      const a = 0.15 + Math.random() * 0.15;
      g.style.cssText = `left:${Math.random() * WORLD_W}px;top:${Math.random() * WORLD_H}px;width:${s}px;height:${s * 0.6}px;background:radial-gradient(ellipse, rgba(${r},${gr},${b},${a}), transparent 70%);`;
      this.world.appendChild(g);
    }
  }

  private buildDirtPaths() {
    const paths = [
      { x: 0, y: WORLD_H / 2 - 20, w: WORLD_W, h: 40 },
      { x: WORLD_W / 2 - 20, y: 200, w: 40, h: WORLD_H - 400 },
      { x: WORLD_W * 0.25 - 15, y: 400, w: 30, h: 800 },
      { x: WORLD_W * 0.75 - 15, y: 600, w: 30, h: 800 },
    ];
    for (const p of paths) {
      const d = document.createElement('div');
      d.className = 'dirt-path';
      d.style.cssText = `left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px;border-radius:4px;`;
      this.world.appendChild(d);
    }
  }

  private buildFogWisps() {
    for (let i = 0; i < 12; i++) {
      const f = document.createElement('div');
      f.className = 'fog-wisp';
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
      t.className = 'deco deco-tree';
      t.style.left = tx + 'px';
      t.style.top = ty + 'px';
      t.style.zIndex = String(Math.floor(ty + 80));
      const sz = 0.7 + Math.random() * 0.6;
      t.style.transform = `scale(${sz})`;
      t.innerHTML = '<div class="tree-top"></div><div class="tree-trunk"></div><div class="tree-shadow"></div>';
      this.world.appendChild(t);
    }
  }

  private buildBushes() {
    for (let i = 0; i < 30; i++) {
      const b = document.createElement('div');
      b.className = 'deco deco-bush';
      b.style.left = Math.random() * WORLD_W + 'px';
      b.style.top = Math.random() * WORLD_H + 'px';
      const sz = 0.6 + Math.random() * 0.8;
      b.style.transform = `scale(${sz})`;
      this.world.appendChild(b);
    }
  }

  private buildRocks() {
    for (let i = 0; i < 25; i++) {
      const r = document.createElement('div');
      r.className = 'deco deco-rock';
      r.style.left = Math.random() * WORLD_W + 'px';
      r.style.top = Math.random() * WORLD_H + 'px';
      const sz = 0.5 + Math.random() * 1.2;
      r.style.transform = `scale(${sz}) rotate(${Math.random() * 60 - 30}deg)`;
      this.world.appendChild(r);
    }
  }

  private buildLanterns() {
    const positions: [number, number][] = [
      [450, 450], [1100, 800], [1800, 400], [2300, 1100],
      [700, 1500], [2000, 1800], [1400, 1400],
    ];
    for (const [lx, ly] of positions) {
      const l = document.createElement('div');
      l.className = 'deco deco-lantern';
      l.style.left = lx + 'px';
      l.style.top = ly + 'px';
      l.style.zIndex = String(Math.floor(ly + 40));
      l.innerHTML = '<div class="lantern-glow"></div><div class="lantern-pole"></div>';
      this.world.appendChild(l);
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
      el.className = f.horiz ? 'deco-fence-h' : 'deco-fence-v';
      el.style.left = f.x + 'px';
      el.style.top = f.y + 'px';
      if (f.horiz) el.style.width = f.size + 'px';
      else el.style.height = f.size + 'px';
      this.world.appendChild(el);
    }
  }
}
