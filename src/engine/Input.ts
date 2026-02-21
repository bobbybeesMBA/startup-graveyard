import { Camera } from './Camera';
import { KEYBOARD_SPEED, WHEEL_MULTIPLIER, WORLD_W, WORLD_H, MINIMAP_SIZE } from './constants';

export class Input {
  private keys: Record<string, boolean> = {};
  private dragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private dragCamX = 0;
  private dragCamY = 0;
  private touchStartX = 0;
  private touchStartY = 0;
  private touchCamX = 0;
  private touchCamY = 0;

  private camera: Camera;
  private viewport: HTMLElement;
  private minimap: HTMLElement;
  private active = false;

  constructor(camera: Camera, viewport: HTMLElement, minimap: HTMLElement) {
    this.camera = camera;
    this.viewport = viewport;
    this.minimap = minimap;
  }

  start() {
    this.active = true;
    this.bindKeyboard();
    this.bindMouse();
    this.bindTouch();
    this.bindWheel();
    this.bindMinimap();
  }

  processKeys() {
    if (!this.active) return;
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) this.camera.moveTarget(-KEYBOARD_SPEED, 0);
    if (this.keys['ArrowRight'] || this.keys['KeyD']) this.camera.moveTarget(KEYBOARD_SPEED, 0);
    if (this.keys['ArrowUp'] || this.keys['KeyW']) this.camera.moveTarget(0, -KEYBOARD_SPEED);
    if (this.keys['ArrowDown'] || this.keys['KeyS']) this.camera.moveTarget(0, KEYBOARD_SPEED);
  }

  private bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
      }
    });
    document.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  private bindMouse() {
    this.viewport.addEventListener('mousedown', (e) => {
      if ((e.target as HTMLElement).closest('.grave')) return;
      this.dragging = true;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.dragCamX = this.camera.targetX;
      this.dragCamY = this.camera.targetY;
      this.viewport.classList.add('dragging');
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.dragging) return;
      this.camera.setTarget(
        this.dragCamX + (this.dragStartX - e.clientX),
        this.dragCamY + (this.dragStartY - e.clientY),
      );
    });

    document.addEventListener('mouseup', () => {
      this.dragging = false;
      this.viewport.classList.remove('dragging');
    });
  }

  private bindTouch() {
    this.viewport.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.touchCamX = this.camera.targetX;
      this.touchCamY = this.camera.targetY;
    }, { passive: true });

    this.viewport.addEventListener('touchmove', (e) => {
      this.camera.setTarget(
        this.touchCamX + (this.touchStartX - e.touches[0].clientX),
        this.touchCamY + (this.touchStartY - e.touches[0].clientY),
      );
    }, { passive: true });
  }

  private bindWheel() {
    this.viewport.addEventListener('wheel', (e) => {
      this.camera.moveTarget(e.deltaX * WHEEL_MULTIPLIER, e.deltaY * WHEEL_MULTIPLIER);
      e.preventDefault();
    }, { passive: false });
  }

  private bindMinimap() {
    this.minimap.addEventListener('click', (e) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      this.camera.setTarget(
        px * WORLD_W - window.innerWidth / 2,
        py * WORLD_H - window.innerHeight / 2,
      );
    });
  }
}
