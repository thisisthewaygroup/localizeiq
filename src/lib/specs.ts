import type { OutputSpec } from './types'

export const OUTPUT_SPECS: OutputSpec[] = [
  // E-commerce
  {
    id: 'ec_pdp',
    name: 'Product Detail Page',
    category: 'ecommerce',
    width: 800,
    height: 800,
    aspectRatio: '1:1',
    description: 'Square format for e-commerce listings',
  },
  {
    id: 'ec_banner',
    name: 'Product Banner',
    category: 'ecommerce',
    width: 1200,
    height: 675,
    aspectRatio: '16:9',
    description: 'Wide banner for e-commerce homepages',
  },
  {
    id: 'ec_hero',
    name: 'Hero Banner',
    category: 'ecommerce',
    width: 1500,
    height: 500,
    aspectRatio: '3:1',
    description: 'Ultra-wide hero for category pages',
  },
  // OOH
  {
    id: 'ooh_billboard',
    name: 'Billboard',
    category: 'ooh',
    width: 2800,
    height: 1050,
    aspectRatio: '8:3',
    description: 'Standard outdoor billboard',
  },
  {
    id: 'ooh_bus',
    name: 'Bus Shelter',
    category: 'ooh',
    width: 1080,
    height: 1620,
    aspectRatio: '2:3',
    description: 'Portrait format for transit advertising',
  },
  {
    id: 'ooh_digital',
    name: 'Digital OOH',
    category: 'ooh',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: 'Full-screen digital outdoor display',
  },
  // Retail
  {
    id: 'retail_shelf',
    name: 'Shelf Talker',
    category: 'retail',
    width: 400,
    height: 600,
    aspectRatio: '2:3',
    description: 'Point-of-sale shelf label',
  },
  {
    id: 'retail_instore',
    name: 'In-Store Display',
    category: 'retail',
    width: 600,
    height: 900,
    aspectRatio: '2:3',
    description: 'Floor-standing retail display',
  },
  {
    id: 'retail_endcap',
    name: 'Endcap',
    category: 'retail',
    width: 500,
    height: 1000,
    aspectRatio: '1:2',
    description: 'End-of-aisle retail display',
  },
]

export const SPEC_CATEGORIES = {
  ecommerce: { label: 'E-Commerce', color: 'violet' },
  ooh: { label: 'Out-of-Home', color: 'blue' },
  retail: { label: 'Retail', color: 'emerald' },
}

export const getSpecById = (id: string) => OUTPUT_SPECS.find((s) => s.id === id)
