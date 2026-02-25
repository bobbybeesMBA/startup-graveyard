export interface NurseryEntry {
  name: string;
  slug: string;
  tagline: string;
  mvp: string;
  became: string;
  pivotYear: number;
  sector: string;
  cribShape: CribShape;
  zone: Zone;
  motto: string;
}

export type CribShape = 'round' | 'sleigh' | 'canopy' | 'basket' | 'modern' | 'rocking' | 'moses';
export type Zone = 'recent' | 'classic' | 'ancient';
