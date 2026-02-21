import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const tombstoneShapes = ['arch', 'tall', 'cross', 'wide', 'obelisk', 'slab', 'angel'] as const;
const zones = ['recent', 'classic', 'ancient'] as const;
const sectors = [
  'Logistics', 'Health AI', 'Construction', 'Food Tech', 'Real Estate',
  'Edtech', 'Media', 'Crypto', 'Fintech', 'Social', 'Transportation',
  'Energy', 'Hardware', 'E-Commerce', 'Gaming', 'Automotive',
  'Health Tech', 'Consumer Hardware', 'Retail Tech',
] as const;
const causes = [
  'Cash Burn', 'Over-expansion', 'Complexity', 'Pivot Addiction',
  'Governance', 'No Market Fit', 'Fraud', 'No Revenue', 'Overreach',
  'Regulation', 'Technology', 'Competition', 'Premature Scaling',
] as const;

const graveyard = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/graveyard' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    tagline: z.string(),
    founded: z.number(),
    died: z.number(),
    funding: z.string(),
    fundingBillions: z.number(),
    sector: z.enum(sectors),
    causeOfDeath: z.enum(causes),
    tombstoneShape: z.enum(tombstoneShapes),
    zone: z.enum(zones),
    epitaph: z.string(),
    causeShort: z.string(),
  }),
});

export const collections = { graveyard };
