import { WORLD_W, WORLD_H, MINIMAP_SIZE } from './constants';
import { Camera } from './Camera';
import type { Position } from './types';

export class Minimap {
  private container: HTMLElement;
  private viewportIndicator: HTMLElement;
  private camera: Camera;

  constructor(container: HTMLElement, viewportIndicator: HTMLElement, camera: Camera) {
    this.container = container;
    this.viewportIndicator = viewportIndicator;
    this.camera = camera;
  }

  placeDots(positions: Position[]) {
    for (const pos of positions) {
      const dot = document.createElement('div');
      dot.className = 'mm-dot';
      dot.style.left = (pos.x / WORLD_W * MINIMAP_SIZE) + 'px';
      dot.style.top = (pos.y / WORLD_H * MINIMAP_SIZE) + 'px';
      this.container.appendChild(dot);
    }
  }

  update() {
    const mmW = window.innerWidth / WORLD_W * MINIMAP_SIZE;
    const mmH = window.innerHeight / WORLD_H * MINIMAP_SIZE;
    this.viewportIndicator.style.width = mmW + 'px';
    this.viewportIndicator.style.height = mmH + 'px';
    this.viewportIndicator.style.left = (this.camera.x / WORLD_W * MINIMAP_SIZE) + 'px';
    this.viewportIndicator.style.top = (this.camera.y / WORLD_H * MINIMAP_SIZE) + 'px';
  }
}
