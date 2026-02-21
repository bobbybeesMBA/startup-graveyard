import { Camera } from './Camera';
import { KEYBOARD_SPEED, WHEEL_MULTIPLIER, WORLD_W, WORLD_H, PINCH_ZOOM_SPEED, WHEEL_ZOOM_SPEED } from './constants';

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
  private lastPinchDist = 0;
  private isPinching = false;

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
        this.dragCamX + (this.dragStartX - e.clientX) / this.camera.zoom,
        this.dragCamY + (this.dragStartY - e.clientY) / this.camera.zoom,
      );
    });

    document.addEventListener('mouseup', () => {
      this.dragging = false;
      this.viewport.classList.remove('dragging');
    });
  }

  private getTouchDist(e: TouchEvent): number {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.hypot(dx, dy);
  }

  private bindTouch() {
    this.viewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        // Pinch start
        this.isPinching = true;
        this.lastPinchDist = this.getTouchDist(e);
      } else if (e.touches.length === 1 && !this.isPinching) {
        // Single-finger drag
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.touchCamX = this.camera.targetX;
        this.touchCamY = this.camera.targetY;
      }
    }, { passive: true });

    this.viewport.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && this.isPinching) {
        // Pinch zoom
        const dist = this.getTouchDist(e);
        const delta = (dist - this.lastPinchDist) * PINCH_ZOOM_SPEED;
        this.camera.adjustZoom(delta);
        this.lastPinchDist = dist;
        e.preventDefault();
      } else if (e.touches.length === 1 && !this.isPinching) {
        // Single-finger pan
        this.camera.setTarget(
          this.touchCamX + (this.touchStartX - e.touches[0].clientX) / this.camera.zoom,
          this.touchCamY + (this.touchStartY - e.touches[0].clientY) / this.camera.zoom,
        );
      }
    }, { passive: false });

    this.viewport.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) {
        this.isPinching = false;
      }
      // Reset single-finger tracking when going from multi to single touch
      if (e.touches.length === 1) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.touchCamX = this.camera.targetX;
        this.touchCamY = this.camera.targetY;
      }
    }, { passive: true });
  }

  private bindWheel() {
    this.viewport.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey) {
        // Ctrl+scroll = zoom
        this.camera.adjustZoom(-e.deltaY * WHEEL_ZOOM_SPEED);
        e.preventDefault();
      } else {
        // Regular scroll = pan
        this.camera.moveTarget(
          e.deltaX * WHEEL_MULTIPLIER / this.camera.zoom,
          e.deltaY * WHEEL_MULTIPLIER / this.camera.zoom,
        );
        e.preventDefault();
      }
    }, { passive: false });
  }

  private bindMinimap() {
    this.minimap.addEventListener('click', (e) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      this.camera.setTarget(
        px * WORLD_W - window.innerWidth / (2 * this.camera.zoom),
        py * WORLD_H - window.innerHeight / (2 * this.camera.zoom),
      );
    });
  }
}
