import { Settings, Trash2, Layers } from 'lucide-react'
import { WALL_MATERIALS, getWallMaterialProps } from '../../lib/materials'
import ColorPickerPanel from './ColorPickerPanel'

interface PropertiesProps {
  selectedElement: any
  onUpdate: (id: string, newProps: any) => void
  onDelete: () => void
  onEditElevation?: () => void
  onViewElevation?: () => void
  boothConfig?: any
  onBoothConfigUpdate?: (updates: any) => void
  onEditRoof?: () => void
}

const FLOOR_MATERIALS = [
  { id: 'hardwood', label: 'Hardwood', color: '#7a4f2e', desc: 'Warm oak planks' },
  { id: 'marble', label: 'Marble', color: '#d8d0c8', desc: 'Polished white veined' },
  { id: 'tile', label: 'Tile', color: '#b0a898', desc: 'Classic square tile' },
  { id: 'carpet', label: 'Carpet', color: '#2e4050', desc: 'Soft dark carpet' },
  { id: 'concrete', label: 'Concrete', color: '#898989', desc: 'Industrial grey' },
  { id: 'custom_color', label: 'Custom Color', color: '#ffffff', desc: 'Pick your own color' },
]



const WALL_MATERIALS_LIST = [
  ...WALL_MATERIALS.map((m: any) => ({ value: m.id, label: m.label })),
  { value: 'custom_color', label: 'Custom Color' }
];

export default function Properties({
  selectedElement, onUpdate, onDelete, onEditElevation, onViewElevation,
  boothConfig, onBoothConfigUpdate, onEditRoof
}: PropertiesProps) {

  const handleMaterialChange = (material: string) => {
    const props = getWallMaterialProps(material);
    onUpdate(selectedElement.id, props)
  }

  const floorType = boothConfig?.floorType || 'hardwood'

  return (
    <aside className="w-72 h-full border-l border-[var(--line)] bg-[var(--surface-strong)] flex flex-col overflow-hidden">
      <div className="p-4 border-b border-[var(--line)] flex justify-between items-center bg-[var(--header-bg)]">
        <h3 className="font-bold text-[var(--sea-ink)] flex items-center gap-2">
          <Settings className="h-5 w-5 text-[var(--lagoon-deep)]" />
          Properties
        </h3>
        {selectedElement && (
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-white hover:bg-red-500 p-1.5 rounded-lg transition"
            title="Delete (Backspace)"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        {selectedElement ? (
          <div>
            <div className="space-y-4">

              {/* Type / ID display */}
              <div>
                <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
                  Type / ID
                </label>
                <div className="w-full bg-[var(--sand)] border-transparent border rounded-lg px-3 py-2 text-[10px] font-mono text-[var(--sea-ink)] select-all">
                  {selectedElement.type.toUpperCase()} / {selectedElement.id.slice(0, 8)}
                </div>
              </div>

              {/* Transform properties */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="pos-x" className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
                    Pos X (m)
                  </label>
                  <input
                    id="pos-x" name="pos-x"
                    type="number" step="0.05"
                    value={((selectedElement.x || 0) / 100).toFixed(2)}
                    onChange={(e) => onUpdate(selectedElement.id, { x: parseFloat(e.target.value) * 100 || 0 })}
                    className="w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="pos-y" className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
                    Pos Y (m)
                  </label>
                  <input
                    id="pos-y" name="pos-y"
                    type="number" step="0.05"
                    value={((selectedElement.y || 0) / 100).toFixed(2)}
                    onChange={(e) => onUpdate(selectedElement.id, { y: parseFloat(e.target.value) * 100 || 0 })}
                    className="w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
                    Dimensions (Meters)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <label htmlFor="dim-w" className="text-[10px] text-[var(--sea-ink-soft)] font-bold">W</label>
                      <input
                        id="dim-w" name="dim-w"
                        type="number" step="0.05"
                        value={((selectedElement.width || 0) / 100).toFixed(2)}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          onUpdate(selectedElement.id, { 
                            width: val * 100,
                            ...(['pillar', 'caged-wall', 'caged-panel', 'panel'].includes(selectedElement.type) ? { realWidth: val } : {})
                          });
                        }}
                        disabled={selectedElement.type === 'asset'}
                        className={`w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-2 py-1.5 text-xs outline-none ${selectedElement.type === 'asset' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label htmlFor="dim-h" className="text-[10px] text-[var(--sea-ink-soft)] font-bold">H</label>
                      <input
                        id="dim-h" name="dim-h"
                        type="number" step="0.05"
                        value={((selectedElement.height || 0) / 100).toFixed(2)}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          onUpdate(selectedElement.id, { 
                            height: val * 100,
                            ...(['pillar', 'caged-wall', 'caged-panel', 'panel'].includes(selectedElement.type) ? { realDepth: val } : {})
                          });
                        }}
                        disabled={selectedElement.type === 'asset'}
                        className={`w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-2 py-1.5 text-xs outline-none ${selectedElement.type === 'asset' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <label htmlFor="rot" className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
                    Rotation (Deg)
                  </label>
                  <input
                    id="rot" name="rot"
                    type="number"
                    value={Math.round(selectedElement.rotation) || 0}
                    onChange={(e) => onUpdate(selectedElement.id, { rotation: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-3 py-2 text-sm outline-none mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => onUpdate(selectedElement.id, { rotation: (selectedElement.rotation || 0) - 90 })}
                      className="flex-1 bg-[var(--surface-strong)] hover:bg-[var(--chip-bg)] border border-[var(--line)] rounded-lg py-1.5 text-xs font-bold text-[var(--sea-ink)] transition"
                    >
                      -90° (Left)
                    </button>
                    <button
                      onClick={() => onUpdate(selectedElement.id, { rotation: (selectedElement.rotation || 0) + 90 })}
                      className="flex-1 bg-[var(--surface-strong)] hover:bg-[var(--chip-bg)] border border-[var(--line)] rounded-lg py-1.5 text-xs font-bold text-[var(--sea-ink)] transition"
                    >
                      +90° (Right)
                    </button>
                  </div>
                </div>

                <div className="col-span-2 border-t border-[var(--line)] pt-4 mt-2">
                  <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-3">
                    Elevation &amp; Vertical Scale
                  </label>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="y-offset" className="text-[10px] text-[var(--sea-ink-soft)] font-bold">HEIGHT FROM FLOOR (m)</label>
                        <span className="text-[10px] font-mono text-[var(--lagoon-deep)]">{(selectedElement.yOffset || 0).toFixed(2)}m</span>
                      </div>
                      <input
                        id="y-offset" name="y-offset"
                        type="range" min="0" max="4" step="0.05"
                        value={selectedElement.yOffset || 0}
                        onChange={(e) => onUpdate(selectedElement.id, { yOffset: parseFloat(e.target.value) })}
                        className="w-full accent-[var(--lagoon-deep)] h-1.5 rounded-full appearance-none bg-[var(--sand)]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="v-scale" className="text-[10px] text-[var(--sea-ink-soft)] font-bold">
                          {selectedElement.type === 'wall' ? 'WALL HEIGHT (m)' : ['pillar', 'caged-wall', 'caged-panel', 'panel'].includes(selectedElement.type) ? 'HEIGHT (m)' : 'VERTICAL SCALE (x)'}
                        </label>
                        <span className="text-[10px] font-mono text-[var(--lagoon-deep)]">
                          {selectedElement.type === 'wall' 
                            ? `${(2.5 * (selectedElement.verticalScale || 1)).toFixed(1)}m` 
                            : ['pillar', 'caged-wall', 'caged-panel', 'panel'].includes(selectedElement.type)
                            ? `${(selectedElement.realHeight || 2.5).toFixed(1)}m`
                            : `${(selectedElement.verticalScale || 1).toFixed(2)}x`}
                        </span>
                      </div>
                      <input
                        id="v-scale" name="v-scale"
                        type="range" 
                        min={selectedElement.type === 'wall' || ['pillar', 'caged-wall', 'caged-panel', 'panel'].includes(selectedElement.type) ? "0.5" : "0.05"} 
                        max={selectedElement.type === 'wall' || ['pillar', 'caged-wall', 'caged-panel', 'panel'].includes(selectedElement.type) ? "10" : "5"} 
                        step={selectedElement.type === 'wall' || ['pillar', 'caged-wall', 'caged-panel', 'panel'].includes(selectedElement.type) ? "0.1" : "0.05"}
                        value={selectedElement.type === 'wall' 
                          ? (2.5 * (selectedElement.verticalScale || 1))
                          : ['pillar', 'caged-wall', 'caged-panel', 'panel'].includes(selectedElement.type)
                          ? (selectedElement.realHeight || 2.5)
                          : (selectedElement.verticalScale || 1)}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          
                          if (['pillar', 'caged-wall', 'caged-panel', 'panel'].includes(selectedElement.type)) {
                            onUpdate(selectedElement.id, { realHeight: val });
                            return;
                          }

                          const newScale = selectedElement.type === 'wall' ? val / 2.5 : val;
                          const oldScale = selectedElement.verticalScale || 1;
                          if (newScale === oldScale) return;
                          
                          const heightDiffMeters = (newScale - oldScale) * 2.5;
                          const heightDiffPixels = heightDiffMeters * 100;
                          
                          let updatedWallElements = selectedElement.wallElements;
                          if (updatedWallElements && updatedWallElements.length > 0) {
                            updatedWallElements = updatedWallElements.map((wel: any) => ({
                              ...wel,
                              y: wel.y + heightDiffPixels
                            }));
                          }
                          
                          onUpdate(selectedElement.id, {
                            verticalScale: newScale,
                            ...(updatedWallElements ? { wallElements: updatedWallElements } : {})
                          });
                        }}
                        disabled={selectedElement.type === 'asset'}
                        className={`w-full accent-[var(--lagoon-deep)] h-1.5 rounded-full appearance-none bg-[var(--sand)] ${selectedElement.type === 'asset' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3D Model Facing Correction */}
              {selectedElement.type === 'asset' && (
                <div className="pt-2 border-t border-[var(--line)]">
                  <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-2">
                    3D Model Facing Offset
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0, 90, 180, 270].map((angle) => {
                      const active = (selectedElement.facingOffset || 0) === angle;
                      return (
                        <button
                          key={angle}
                          onClick={() => onUpdate(selectedElement.id, { facingOffset: angle })}
                          className={`py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                            active 
                              ? 'bg-[var(--brand)] text-white border-[var(--brand)] shadow-sm' 
                              : 'bg-[var(--sand)] text-[var(--sea-ink)] border-[var(--line)] hover:bg-[var(--chip-bg)]'
                          }`}
                        >
                          {angle}°
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-[var(--sea-ink-soft)] mt-1.5 leading-tight">
                    Adjust if your custom 3D model was exported facing sideways or backwards.
                  </p>
                </div>
              )}

              {/* Asset Details */}
              {selectedElement.type === 'asset' && selectedElement.details && (
                <div className="mt-6 pt-4 border-t border-[var(--line)]">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--sea-ink-soft)] mb-3">
                    Technical Specifications
                  </p>
                  <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/40 space-y-2">
                    {selectedElement.details.split(';').map((detail: string, idx: number) => {
                      const [label, value] = detail.split(':').map(s => s.trim());
                      if (!value) return <p key={idx} className="text-[11px] text-[var(--sea-ink)] leading-relaxed">{detail}</p>;
                      return (
                        <div key={idx} className="flex justify-between items-start gap-2">
                          <span className="text-[10px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-tight">{label}</span>
                          <span className="text-[10px] font-medium text-[var(--sea-ink)] text-right">{value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Wall-specific controls */}
              {selectedElement.type === 'wall' && (
                <div className="space-y-4 mt-4">
                  <button
                    onClick={onEditElevation}
                    className="w-full bg-[var(--brand)] text-white py-2 rounded-lg font-bold hover:bg-[var(--brand-h)] transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    Edit Wall Elevation
                  </button>

                  <button
                    onClick={onViewElevation}
                    className="w-full bg-[var(--sand)] text-[var(--sea-ink)] border border-[var(--line)] py-2 rounded-lg font-bold hover:border-[var(--lagoon)] hover:text-[var(--lagoon-deep)] transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    View Technical Elevation
                  </button>

                  <div>
                    <label htmlFor="wall-thickness" className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
                      Wall Thickness (cm)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        id="wall-thickness" name="wall-thickness"
                        type="range" min="2" max="50" step="1"
                        value={selectedElement.thickness || 10}
                        onChange={(e) => onUpdate(selectedElement.id, { thickness: parseInt(e.target.value) })}
                        className="flex-1 accent-[var(--lagoon-deep)]"
                      />
                      <span className="text-xs font-mono font-bold text-[var(--sea-ink)] w-8 text-right">
                        {selectedElement.thickness || 10}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-2">
                      Wall Material
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {WALL_MATERIALS_LIST.map((m: any) => (
                        <button
                          key={m.value}
                          onClick={() => {
                            if (m.value === 'custom_color') {
                              onUpdate(selectedElement.id, { material: 'custom_color', color: selectedElement.color || '#f0f0f0' });
                            } else {
                              handleMaterialChange(m.value);
                            }
                          }}
                          className={`px-3 py-2 rounded-lg text-xs font-bold border transition ${(selectedElement.material || 'Solid Wall') === m.value
                              ? 'border-[var(--lagoon)] bg-[var(--lagoon-soft)] text-[var(--lagoon-deep)]'
                              : 'border-[var(--line)] bg-[var(--sand)] text-[var(--sea-ink)] hover:border-[var(--lagoon)]'
                            }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                    {selectedElement.material === 'custom_color' && (
                      <ColorPickerPanel
                        initialColor={selectedElement.color || '#f0f0f0'}
                        onChange={(c) => onUpdate(selectedElement.id, { color: c })}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Pillar-specific controls */}
              {selectedElement.type === 'pillar' && (
                <div className="space-y-4 mt-4 pt-4 border-t border-[var(--line)]">
                  <div>
                    <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-2">
                      Profile Shape
                    </label>
                    <select
                      value={selectedElement.profile || 'square'}
                      onChange={(e) => onUpdate(selectedElement.id, { profile: e.target.value })}
                      className="w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-3 py-2 text-sm outline-none font-bold"
                    >
                      <option value="square">Square / Box</option>
                      <option value="round">Round / Cylinder</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-2">
                      Material Color
                    </label>
                    <ColorPickerPanel
                      initialColor={selectedElement.fill || '#aaaaaa'}
                      onChange={(c) => onUpdate(selectedElement.id, { fill: c })}
                    />
                    <div className="mt-2 p-3 bg-[var(--sand)] rounded-lg border border-dashed border-[var(--line)] text-center">
                      <p className="text-[10px] font-bold text-[var(--sea-ink-soft)]">Texture Upload (Coming Soon)</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Caged Wall controls */}
              {['caged-wall', 'caged-panel'].includes(selectedElement.type) && (
                <div className="space-y-4 mt-4 pt-4 border-t border-[var(--line)]">
                  <div>
                    <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-2">
                      Orientation
                    </label>
                    <select
                      value={selectedElement.orientation || 'horizontal'}
                      onChange={(e) => onUpdate(selectedElement.id, { orientation: e.target.value })}
                      className="w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-3 py-2 text-sm outline-none font-bold"
                    >
                      <option value="horizontal">Horizontal Plates</option>
                      <option value="vertical">Vertical Plates</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
                      Number of Plates
                    </label>
                    <input
                      type="number" min="1" max="50" step="1"
                      value={selectedElement.platesCount || 5}
                      onChange={(e) => onUpdate(selectedElement.id, { platesCount: parseInt(e.target.value) })}
                      className="w-full bg-[var(--sand)] border border-[var(--line)] rounded-lg px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
                      Plate Thickness (m)
                    </label>
                    <input
                      type="number" min="0.01" max="1" step="0.01"
                      value={selectedElement.plateThickness || 0.05}
                      onChange={(e) => onUpdate(selectedElement.id, { plateThickness: parseFloat(e.target.value) })}
                      className="w-full bg-[var(--sand)] border border-[var(--line)] rounded-lg px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
                      Gap Between Plates (m)
                    </label>
                    <input
                      type="number" min="0.01" max="2" step="0.05"
                      value={selectedElement.plateGap || 0.2}
                      onChange={(e) => onUpdate(selectedElement.id, { plateGap: parseFloat(e.target.value) })}
                      className="w-full bg-[var(--sand)] border border-[var(--line)] rounded-lg px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-2">
                      Material Color
                    </label>
                    <ColorPickerPanel
                      initialColor={selectedElement.fill || '#444444'}
                      onChange={(c) => onUpdate(selectedElement.id, { fill: c })}
                    />
                    <div className="mt-2 p-3 bg-[var(--sand)] rounded-lg border border-dashed border-[var(--line)] text-center">
                      <p className="text-[10px] font-bold text-[var(--sea-ink-soft)]">Texture Upload (Coming Soon)</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Panel controls */}
              {selectedElement.type === 'panel' && (
                <div className="space-y-4 mt-4 pt-4 border-t border-[var(--line)]">
                  <div>
                    <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-2">
                      Panel Style
                    </label>
                    <select
                      value={selectedElement.style || 'flat'}
                      onChange={(e) => onUpdate(selectedElement.id, { style: e.target.value })}
                      className="w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-3 py-2 text-sm outline-none font-bold"
                    >
                      <option value="flat">Flat / Solid</option>
                      <option value="corrugated">Corrugated Metal</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-2">
                      Material Color
                    </label>
                    <ColorPickerPanel
                      initialColor={selectedElement.fill || '#0055ff'}
                      onChange={(c) => onUpdate(selectedElement.id, { fill: c })}
                    />
                    <div className="mt-2 p-3 bg-[var(--sand)] rounded-lg border border-dashed border-[var(--line)] text-center">
                      <p className="text-[10px] font-bold text-[var(--sea-ink-soft)]">Texture Upload (Coming Soon)</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 3D Logo-specific controls */}
              {selectedElement.type === '3d_logo' && (
                <div className="space-y-4 mt-4 pt-4 border-t border-[var(--line)]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--sea-ink-soft)]">
                    3D Logo Settings
                  </p>
                  <div>
                    <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-2">Upload Logo (SVG/PNG/JPG)</label>
                    {selectedElement.svgData && (
                      <div className="relative group rounded-lg overflow-hidden border border-[var(--line)] h-20 bg-black/5 mb-2 flex items-center justify-center">
                        {selectedElement.svgData.startsWith('data:') ? (
                          <img src={selectedElement.svgData} className="max-w-full max-h-full object-contain p-2" />
                        ) : (
                          <div dangerouslySetInnerHTML={{ __html: selectedElement.svgData }} className="w-full h-full p-2 [&>svg]:w-full [&>svg]:h-full" />
                        )}
                        <button onClick={() => onUpdate(selectedElement.id, { svgData: null })} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">Remove</button>
                      </div>
                    )}
                    <label htmlFor="svg-upload" className="cursor-pointer w-full py-2 rounded-lg bg-[var(--sand)] border border-[var(--line)] text-[10px] font-bold text-[var(--sea-ink)] text-center hover:bg-[var(--chip-bg)] hover:border-[var(--lagoon)] transition block">
                      {selectedElement.svgData ? 'Replace Logo' : '+ Upload Logo'}
                      <input id="svg-upload" type="file" accept=".svg,.png,.jpg,.jpeg" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (re) => {
                            const data = re.target?.result as string;
                            if (file.type === 'image/svg+xml') {
                              onUpdate(selectedElement.id, {
                                svgData: data,
                                width: 150,
                                height: 150
                              });
                            } else {
                              const img = new Image();
                              img.onload = () => {
                                const canvas = document.createElement('canvas');
                                const MAX_SIZE = 800;
                                let width = img.width;
                                let height = img.height;
                                
                                if (width > height) {
                                  if (width > MAX_SIZE) {
                                    height *= MAX_SIZE / width;
                                    width = MAX_SIZE;
                                  }
                                } else {
                                  if (height > MAX_SIZE) {
                                    width *= MAX_SIZE / height;
                                    height = MAX_SIZE;
                                  }
                                }
                                
                                canvas.width = width;
                                canvas.height = height;
                                const ctx = canvas.getContext('2d');
                                if (ctx) {
                                  ctx.drawImage(img, 0, 0, width, height);
                                  const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                                  const aspect = width / height;
                                  onUpdate(selectedElement.id, {
                                    svgData: dataUrl,
                                    width: 150,
                                    height: 150 / aspect
                                  });
                                }
                              };
                              img.src = data;
                            }
                          };
                          if (file.type === 'image/svg+xml') {
                            reader.readAsText(file);
                          } else {
                            reader.readAsDataURL(file);
                          }
                        }
                      }} />
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] text-[var(--sea-ink-soft)] font-bold">WIDTH (cm)</label>
                        <span className="text-[10px] font-mono text-[var(--lagoon-deep)]">{Math.round(selectedElement.width || 100)}</span>
                      </div>
                      <input
                        type="range" min="10" max="1000" step="5"
                        value={selectedElement.width || 100}
                        onChange={(e) => onUpdate(selectedElement.id, { width: parseFloat(e.target.value) })}
                        className="w-full accent-[var(--lagoon-deep)] h-1.5 rounded-full appearance-none bg-[var(--sand)]"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] text-[var(--sea-ink-soft)] font-bold">HEIGHT (cm)</label>
                        <span className="text-[10px] font-mono text-[var(--lagoon-deep)]">{Math.round(selectedElement.height || 100)}</span>
                      </div>
                      <input
                        type="range" min="10" max="1000" step="5"
                        value={selectedElement.height || 100}
                        onChange={(e) => onUpdate(selectedElement.id, { height: parseFloat(e.target.value) })}
                        className="w-full accent-[var(--lagoon-deep)] h-1.5 rounded-full appearance-none bg-[var(--sand)]"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] text-[var(--sea-ink-soft)] font-bold uppercase">Logo Thickness (cm)</label>
                      <span className="text-[10px] font-mono text-[var(--lagoon-deep)]">{selectedElement.depth || 5}cm</span>
                    </div>
                    <input type="range" min="1" max="30" step="1" value={selectedElement.depth || 5} onChange={(e) => onUpdate(selectedElement.id, { depth: parseInt(e.target.value) })} className="w-full accent-[var(--lagoon-deep)] h-1.5 rounded-full appearance-none bg-[var(--sand)]" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-2">Logo Style & Material</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[{ id: 'matte', label: 'Matte' }, { id: 'chrome', label: 'Chrome' }, { id: 'glowing', label: 'Glowing' }, { id: 'glass', label: 'Glass' }].map(style => (
                        <button key={style.id} onClick={() => onUpdate(selectedElement.id, { logoStyle: style.id })} className={`px-3 py-2 rounded-lg text-[10px] font-bold border transition-all ${selectedElement.logoStyle === style.id ? 'border-[var(--lagoon)] bg-[var(--lagoon-soft)] text-[var(--lagoon-deep)] shadow-sm' : 'border-[var(--line)] bg-[var(--sand)] text-[var(--sea-ink)] hover:border-[var(--lagoon)]'}`}>{style.label.toUpperCase()}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-2">Base Color</label>
                    <div className="flex flex-wrap gap-2">
                      {['#ffffff', '#000000', '#fbbf24', '#f87171', '#60a5fa', '#4ade80', '#a78bfa'].map(c => (
                        <button key={c} onClick={() => onUpdate(selectedElement.id, { logoColor: c })} className="w-7 h-7 rounded-lg border-2 transition-all hover:scale-110" style={{ backgroundColor: c, borderColor: selectedElement.logoColor === c ? '#0d7a75' : 'transparent', outline: selectedElement.logoColor === c ? '2px solid #0d7a75' : 'none', outlineOffset: '1px' }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── Booth Materials Panel (shown when nothing selected) ── */
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="h-4 w-4 text-[var(--lagoon-deep)]" />
              <span className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider">Booth Materials</span>
            </div>

            {/* Floor Material */}
            <div>
              <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-3">
                Floor Surface
              </label>
              <div className="space-y-2">
                {FLOOR_MATERIALS.map(mat => (
                  <button
                    key={mat.id}
                    onClick={() => onBoothConfigUpdate?.({ floorType: mat.id, floorColor: boothConfig?.floorColor || '#ffffff' })}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${floorType === mat.id
                        ? 'border-[var(--lagoon)] bg-[var(--lagoon-soft)]'
                        : 'border-[var(--line)] bg-[var(--sand)] hover:border-[var(--lagoon)]'
                      }`}
                  >
                    {/* Color swatch */}
                    <div className="w-8 h-8 rounded bg-cover bg-center border border-black/10 shrink-0" style={{ backgroundColor: mat.id === 'custom_color' ? (boothConfig?.floorColor || mat.color) : mat.color }} />
                    <div className="text-left">
                      <div className={`text-xs font-bold ${floorType === mat.id ? 'text-[var(--lagoon-deep)]' : 'text-[var(--sea-ink)]'}`}>
                        {mat.label}
                      </div>
                      <div className="text-[10px] text-[var(--sea-ink-soft)]">{mat.desc}</div>
                    </div>
                    {floorType === mat.id && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-[var(--lagoon)]" />
                    )}
                  </button>
                ))}
              </div>
              {floorType === 'custom_color' && (
                <ColorPickerPanel
                  initialColor={boothConfig?.floorColor || '#ffffff'}
                  onChange={(c) => onBoothConfigUpdate?.({ floorColor: c })}
                />
              )}
            </div>

            {/* Roof & Ceiling Section */}
            <div className="pt-4 border-t border-[var(--line)] space-y-3">
              <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block">
                Ceiling & Roofing
              </label>

              <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--line)] bg-[var(--sand)]">
                <span className="text-xs font-bold text-[var(--sea-ink)]">Include Roof / Ceiling</span>
                <input
                  type="checkbox"
                  checked={boothConfig?.roof?.enabled ?? false}
                  onChange={(e) => {
                    const roof = boothConfig?.roof || {};
                    onBoothConfigUpdate?.({
                      roof: {
                        ...roof,
                        enabled: e.target.checked
                      }
                    });
                  }}
                  className="rounded border-gray-300 text-[var(--brand)] focus:ring-[var(--brand)] h-4 w-4"
                />
              </div>

              {(boothConfig?.roof?.enabled) && (
                <button
                  onClick={onEditRoof}
                  className="w-full bg-[var(--lagoon-soft)] border border-[var(--lagoon)] hover:bg-[var(--lagoon)] hover:text-white text-[var(--lagoon-deep)] font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                >
                  Configure Roof & Lights
                </button>
              )}
            </div>

            <div className="text-center text-[10px] text-[var(--sea-ink-soft)] pt-2 border-t border-[var(--line)]">
              Select an element to edit its properties
            </div>
          </div>
        )}

        {/* 
        <div className="pt-4 border-t border-[var(--line)]">
          <h4 className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider flex items-center gap-2 mb-3">
            <Code className="h-4 w-4" />
            JSON Preview
          </h4>
          <pre className="bg-[#1e1e1e] text-[#b8efe5] p-3 rounded-xl text-[10px] overflow-x-auto shadow-inner leading-relaxed max-h-48">
            {JSON.stringify(selectedElement || { status: 'idle', workspace: 'ready' }, null, 2)}
          </pre>
        </div>
        */}
      </div>
    </aside>
  )
}
