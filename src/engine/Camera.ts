import { WORLD_W, WORLD_H, CAMERA_LERP, MIN_ZOOM, MAX_ZOOM, ZOOM_LERP } from './constants';

export class Camera {
  x = 0;
  y = 0;
  targetX = 0;
  targetY = 0;
  zoom = 1;
  targetZoom = 1;

  private worldW: number;
  private worldH: number;

  constructor(worldW = WORLD_W, worldH = WORLD_H) {
    this.worldW = worldW;
    this.worldH = worldH;
  }

  center() {
    this.targetX = this.worldW / 2 - window.innerWidth / 2;
    this.targetY = this.worldH / 2 - window.innerHeight / 2;
    this.x = this.targetX;
    this.y = this.targetY;
  }

  moveTarget(dx: number, dy: number) {
    this.targetX += dx;
    this.targetY += dy;
  }

  setTarget(x: number, y: number) {
    this.targetX = x;
    this.targetY = y;
  }

  setZoom(z: number) {
    this.targetZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z));
  }

  adjustZoom(delta: number) {
    this.setZoom(this.targetZoom + delta);
  }

  clamp() {
    const vw = window.innerWidth / this.zoom;
    const vh = window.innerHeight / this.zoom;
    const maxX = Math.max(0, this.worldW - vw);
    const maxY = Math.max(0, this.worldH - vh);
    this.targetX = Math.max(0, Math.min(this.targetX, maxX));
    this.targetY = Math.max(0, Math.min(this.targetY, maxY));
  }

  update() {
    this.clamp();
    this.x += (this.targetX - this.x) * CAMERA_LERP;
    this.y += (this.targetY - this.y) * CAMERA_LERP;
    this.zoom += (this.targetZoom - this.zoom) * ZOOM_LERP;
  }
}
