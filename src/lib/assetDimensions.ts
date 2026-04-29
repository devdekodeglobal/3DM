// Auto-generated from scripts/measure-models.mjs
// Normalized footprint ratios (w × h) derived from GLB POSITION accessor bounds.
// The longest side = 1.0; the other side is the ratio.
// These drive the initial 2D canvas tile size when an asset is first placed.

export const ASSET_DIMENSIONS: Record<string, { w: number; h: number }> = {
  'bar_chair_1':   { w: 0.8858, h: 1.0000 },  // ~square
  'cabinet_1':     { w: 0.1963, h: 1.0000 },  // very narrow / tall — likely wall cabinet
  'ceramic_pot':   { w: 1.0000, h: 1.0000 },  // square
  'chair_1':       { w: 0.9917, h: 1.0000 },  // near-square
  'chair_2':       { w: 0.6500, h: 1.0000 },  // slightly rectangular
  'dustbin':       { w: 0.2421, h: 1.0000 },  // tall thin model — override to square footprint
  'plant':         { w: 1.0000, h: 0.9505 },  // near-square
  'round_table_1': { w: 1.0000, h: 1.0000 },  // circle → square footprint
  'sink_1':        { w: 1.0000, h: 0.6042 },  // wide rectangle
  'table1':        { w: 1.0000, h: 0.5455 },  // long rectangle (2:1)
  'table2':        { w: 1.0000, h: 0.9212 },  // near-square
  'office_tble_low_poly': { w: 1.0000, h: 0.9212 }, // alias
}

// Default spawn size in pixels (at 100px = 1m scale)
export const DEFAULT_ASSET_SIZE_PX = 80
