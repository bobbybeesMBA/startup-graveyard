import { Camera } from './Camera';
import { Input } from './Input';
import { WorldBuilder } from './WorldBuilder';
import { TombstoneManager } from './TombstoneManager';
import { Minimap } from './Minimap';
import { ParticleSystem } from './ParticleSystem';
import type { StartupEntry } from './types';

export class Engine {
  private camera: Camera;
  private input: Input;
  private worldBuilder: WorldBuilder;
  private tombstoneManager: TombstoneManager;
  private minimap: Minimap;
  private particles: ParticleSystem;

  private worldEl: HTMLElement;
  private running = false;

  constructor(
    elements: {
      viewport: HTMLElement;
      world: HTMLElement;
      minimap: HTMLElement;
      mmViewport: HTMLElement;
    },
    entries: StartupEntry[],
    onTombstoneClick: (slug: string) => void,
  ) {
    this.worldEl = elements.world;
    this.camera = new Camera();
    this.input = new Input(this.camera, elements.viewport, elements.minimap);
    this.worldBuilder = new WorldBuilder(elements.world);
    this.tombstoneManager = new TombstoneManager(elements.world, entries, onTombstoneClick);
    this.minimap = new Minimap(elements.minimap, elements.mmViewport, this.camera);
    this.particles = new ParticleSystem(elements.viewport, this.camera);
  }

  init() {
    this.worldBuilder.build();
    this.tombstoneManager.place();
    this.minimap.placeDots(this.tombstoneManager.getPositions());
    this.camera.center();
  }

  start() {
    this.running = true;
    this.input.start();
    this.loop();
  }

  filterTombstones(query: string, sector: string, cause: string) {
    this.tombstoneManager.filter(query, sector, cause);
  }

  clearFilter() {
    this.tombstoneManager.clearFilter();
  }

  private loop = () => {
    if (!this.running) return;
    this.input.processKeys();
    this.camera.update();
    const z = this.camera.zoom;
    this.worldEl.style.transform = `scale(${z}) translate(${-this.camera.x}px, ${-this.camera.y}px)`;
    this.minimap.update();
    this.particles.update();
    requestAnimationFrame(this.loop);
  };
}
