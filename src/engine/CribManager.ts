import { WORLD_W, WORLD_H, TOMBSTONE_MARGIN, TOMBSTONE_MIN_DIST, TOMBSTONE_PLACEMENT_ATTEMPTS } from './constants';
import type { NurseryEntry } from './nursery-types';
import type { Position } from './types';

export class CribManager {
  private world: HTMLElement;
  private entries: NurseryEntry[];
  private positions: Position[] = [];
  private cribElements: HTMLElement[] = [];
  private onCribClick: (slug: string) => void;
  private visited: Set<string>;

  constructor(world: HTMLElement, entries: NurseryEntry[], onClick: (slug: string) => void) {
    this.world = world;
    this.entries = entries;
    this.onCribClick = onClick;
    this.visited = new Set(JSON.parse(localStorage.getItem('sn_visited') || '[]'));
  }

  place() {
    this.positions = this.generatePositions(this.entries.length);
    this.entries.forEach((entry, i) => {
      const pos = this.positions[i];
      const el = document.createElement('div');
      el.className = `crib crib-${entry.cribShape}`;
      el.style.left = pos.x + 'px';
      el.style.top = pos.y + 'px';
      el.style.zIndex = String(Math.floor(pos.y));
      el.dataset.slug = entry.slug;
      el.dataset.sector = entry.sector;
      el.dataset.name = entry.name.toLowerCase();
      el.style.transition = 'opacity 0.4s ease, transform 0.2s ease';
      el.innerHTML = `
        <div class="crib-label">${entry.sector} · ${entry.became}</div>
        <div class="crib-glow"></div>
        <div class="crib-shadow"></div>
        <div class="crib-body">
          <div class="c-mvp">${entry.mvp.length > 40 ? entry.mvp.slice(0, 37) + '...' : entry.mvp}</div>
          <div class="c-name">${entry.name}</div>
          <div class="c-year">Pivoted ${entry.pivotYear}</div>
          <div class="c-became">${entry.became.length > 35 ? entry.became.slice(0, 32) + '...' : entry.became}</div>
        </div>
        <div class="crib-blanket"></div>
      `;
      if (this.visited.has(entry.slug)) {
        el.classList.add('visited');
      }
      el.addEventListener('click', () => {
        this.markVisited(entry.slug, el);
        this.onCribClick(entry.slug);
      });
      this.world.appendChild(el);
      this.cribElements.push(el);
    });
  }

  getPositions(): Position[] {
    return this.positions;
  }

  filter(query: string, sector: string) {
    const q = query.toLowerCase();
    this.cribElements.forEach((el) => {
      const nameMatch = !q || el.dataset.name!.includes(q);
      const sectorMatch = !sector || el.dataset.sector === sector;
      const visible = nameMatch && sectorMatch;
      el.style.opacity = visible ? '1' : '0.15';
      el.style.pointerEvents = visible ? 'auto' : 'none';
    });
  }

  clearFilter() {
    this.cribElements.forEach((el) => {
      el.style.opacity = '1';
      el.style.pointerEvents = 'auto';
    });
  }

  private markVisited(slug: string, el: HTMLElement) {
    if (this.visited.has(slug)) return;
    this.visited.add(slug);
    el.classList.add('visited');
    localStorage.setItem('sn_visited', JSON.stringify([...this.visited]));
  }

  private generatePositions(count: number): Position[] {
    const positions: Position[] = [];
    for (let i = 0; i < count; i++) {
      let attempts = 0;
      let x: number, y: number;
      do {
        x = TOMBSTONE_MARGIN + Math.random() * (WORLD_W - TOMBSTONE_MARGIN * 2);
        y = TOMBSTONE_MARGIN + Math.random() * (WORLD_H - TOMBSTONE_MARGIN * 2);
        attempts++;
      } while (
        attempts < TOMBSTONE_PLACEMENT_ATTEMPTS &&
        positions.some((p) => Math.hypot(p.x - x, p.y - y) < TOMBSTONE_MIN_DIST)
      );
      positions.push({ x, y });
    }
    return positions;
  }
}
