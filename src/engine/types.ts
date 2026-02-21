export interface StartupEntry {
  name: string;
  slug: string;
  tagline: string;
  founded: number;
  died: number;
  funding: string;
  fundingBillions: number;
  sector: string;
  causeOfDeath: string;
  tombstoneShape: TombstoneShape;
  zone: Zone;
  epitaph: string;
  causeShort: string;
}

export type TombstoneShape = 'arch' | 'tall' | 'cross' | 'wide' | 'obelisk' | 'slab' | 'angel';
export type Zone = 'recent' | 'classic' | 'ancient';

export interface Position {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
