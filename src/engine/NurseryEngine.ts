import { Camera } from './Camera';
import { Input } from './Input';
import { NurseryWorldBuilder } from './NurseryWorldBuilder';
import { CribManager } from './CribManager';
import { Minimap } from './Minimap';
import { NurseryParticleSystem } from './NurseryParticleSystem';
import type { NurseryEntry } from './nursery-types';

export class NurseryEngine {
  private camera: Camera;
  private input: Input;
  private worldBuilder: NurseryWorldBuilder;
  private cribManager: CribManager;
  private minimap: Minimap;
  private particles: NurseryParticleSystem;

  private worldEl: HTMLElement;
  private running = false;

  constructor(
    elements: {
      viewport: HTMLElement;
      world: HTMLElement;
      minimap: HTMLElement;
      mmViewport: HTMLElement;
    },
    entries: NurseryEntry[],
    onCribClick: (slug: string) => void,
  ) {
    this.worldEl = elements.world;
    this.camera = new Camera();
    this.input = new Input(this.camera, elements.viewport, elements.minimap);
    this.worldBuilder = new NurseryWorldBuilder(elements.world);
    this.cribManager = new CribManager(elements.world, entries, onCribClick);
    this.minimap = new Minimap(elements.minimap, elements.mmViewport, this.camera);
    this.particles = new NurseryParticleSystem(elements.viewport, this.camera);
  }

  init() {
    this.worldBuilder.build();
    this.cribManager.place();
    this.minimap.placeDots(this.cribManager.getPositions());
    this.camera.center();
  }

  start() {
    this.running = true;
    this.input.start();
    this.loop();
  }

  filterCribs(query: string, sector: string) {
    this.cribManager.filter(query, sector);
  }

  clearFilter() {
    this.cribManager.clearFilter();
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
