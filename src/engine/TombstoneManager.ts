import { WORLD_W, WORLD_H, TOMBSTONE_MARGIN, TOMBSTONE_MIN_DIST, TOMBSTONE_PLACEMENT_ATTEMPTS } from './constants';
import type { StartupEntry, Position } from './types';

export class TombstoneManager {
  private world: HTMLElement;
  private entries: StartupEntry[];
  private positions: Position[] = [];
  private graveElements: HTMLElement[] = [];
  private onTombstoneClick: (slug: string) => void;

  constructor(world: HTMLElement, entries: StartupEntry[], onClick: (slug: string) => void) {
    this.world = world;
    this.entries = entries;
    this.onTombstoneClick = onClick;
  }

  place() {
    this.positions = this.generatePositions(this.entries.length);
    this.entries.forEach((entry, i) => {
      const pos = this.positions[i];
      const el = document.createElement('div');
      el.className = `grave grave-${entry.tombstoneShape}`;
      el.style.left = pos.x + 'px';
      el.style.top = pos.y + 'px';
      el.style.zIndex = String(Math.floor(pos.y));
      el.dataset.slug = entry.slug;
      el.dataset.sector = entry.sector;
      el.dataset.cause = entry.causeOfDeath;
      el.dataset.name = entry.name.toLowerCase();
      el.style.transition = 'opacity 0.4s ease, transform 0.2s ease';
      el.innerHTML = `
        <div class="grave-label">${entry.funding} · ${entry.sector} · ${entry.causeOfDeath}</div>
        <div class="grave-glow"></div>
        <div class="grave-shadow"></div>
        <div class="grave-stone">
          <div class="g-rip">R.I.P.</div>
          <div class="g-name">${entry.name}</div>
          <div class="g-years">${entry.founded}\u2013${entry.died}</div>
          <div class="g-funding">${entry.funding}</div>
        </div>
        <div class="grave-dirt"></div>
      `;
      el.addEventListener('click', () => this.onTombstoneClick(entry.slug));
      this.world.appendChild(el);
      this.graveElements.push(el);
    });
  }

  getPositions(): Position[] {
    return this.positions;
  }

  filter(query: string, sector: string, cause: string) {
    const q = query.toLowerCase();
    this.graveElements.forEach((el) => {
      const nameMatch = !q || el.dataset.name!.includes(q);
      const sectorMatch = !sector || el.dataset.sector === sector;
      const causeMatch = !cause || el.dataset.cause === cause;
      const visible = nameMatch && sectorMatch && causeMatch;
      el.style.opacity = visible ? '1' : '0.15';
      el.style.pointerEvents = visible ? 'auto' : 'none';
    });
  }

  clearFilter() {
    this.graveElements.forEach((el) => {
      el.style.opacity = '1';
      el.style.pointerEvents = 'auto';
    });
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
