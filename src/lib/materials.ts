export const WALL_MATERIALS = [
  { id: 'White Paint', label: 'White Paint', fill: '#f0f0f0', opacity: 1 },
  { id: 'Wood',        label: 'Wood Panel', fill: '#8B4513', opacity: 1 },
  { id: 'Brick',       label: 'Brick',      fill: '#9a4a30', opacity: 1 },
  { id: 'Marble',      label: 'Marble',     fill: '#d8d0c8', opacity: 1 },
  { id: 'Concrete',    label: 'Concrete',   fill: '#898989', opacity: 1 },
  { id: 'Glass Wall',  label: 'Glass',      fill: 'lightblue', opacity: 0.5 },
  { id: 'Solid Wall',  label: 'Solid Wall', fill: '#333333', opacity: 1 },
];

export function getWallMaterialProps(materialId: string) {
  const mat = WALL_MATERIALS.find(m => m.id === materialId) || WALL_MATERIALS[WALL_MATERIALS.length - 1];
  return {
    material: mat.id,
    fill: mat.fill,
    opacity: mat.opacity
  };
}
