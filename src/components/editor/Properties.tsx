import { Settings, Code, Trash2, Layers } from 'lucide-react'

interface PropertiesProps {
  selectedElement: any
  onUpdate: (id: string, newProps: any) => void
  onDelete: () => void
  onEditElevation?: () => void
  boothConfig?: any
  onBoothConfigUpdate?: (updates: any) => void
}

const FLOOR_MATERIALS = [
  { id: 'hardwood', label: 'Hardwood', color: '#7a4f2e', desc: 'Warm oak planks' },
  { id: 'marble',   label: 'Marble',   color: '#d8d0c8', desc: 'Polished white veined' },
  { id: 'tile',     label: 'Tile',     color: '#b0a898', desc: 'Classic square tile' },
  { id: 'carpet',   label: 'Carpet',   color: '#2e4050', desc: 'Soft dark carpet' },
  { id: 'concrete', label: 'Concrete', color: '#898989', desc: 'Industrial grey' },
]

const WALL_MATERIALS_LIST = [
  { value: 'Solid Wall', label: 'Solid Wall' },
  { value: 'Wood',       label: 'Wood Panel' },
  { value: 'Brick',      label: 'Brick' },
  { value: 'Glass Wall', label: 'Glass' },
]

export default function Properties({
  selectedElement, onUpdate, onDelete, onEditElevation,
  boothConfig, onBoothConfigUpdate
}: PropertiesProps) {
  
  const handleMaterialChange = (material: string) => {
    let fill = '#333333', opacity = 1
    if (material === 'Glass Wall') { fill = 'lightblue'; opacity = 0.5 }
    else if (material === 'Wood')  { fill = '#8B4513' }
    else if (material === 'Brick') { fill = '#9a4a30' }
    onUpdate(selectedElement.id, { material, fill, opacity })
  }

  const floorType = boothConfig?.floorType || 'hardwood'

  return (
    <aside className="w-80 border-l border-[var(--line)] bg-[var(--surface-strong)] flex flex-col">
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
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
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
                  <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
                    Pos X (m)
                  </label>
                  <input 
                    type="number" step="0.05"
                    value={((selectedElement.x || 0) / 100).toFixed(2)} 
                    onChange={(e) => onUpdate(selectedElement.id, { x: parseFloat(e.target.value) * 100 || 0 })}
                    className="w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-3 py-2 text-sm outline-none" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
                    Pos Y (m)
                  </label>
                  <input 
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
                      <span className="text-[10px] text-[var(--sea-ink-soft)] font-bold">W</span>
                      <input 
                        type="number" step="0.05"
                        value={((selectedElement.width || 0) / 100).toFixed(2)} 
                        onChange={(e) => onUpdate(selectedElement.id, { width: parseFloat(e.target.value) * 100 || 0 })}
                        className="w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-2 py-1.5 text-xs outline-none" 
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[var(--sea-ink-soft)] font-bold">H</span>
                      <input 
                        type="number" step="0.05"
                        value={((selectedElement.height || 0) / 100).toFixed(2)} 
                        onChange={(e) => onUpdate(selectedElement.id, { height: parseFloat(e.target.value) * 100 || 0 })}
                        className="w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-2 py-1.5 text-xs outline-none" 
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
                    Rotation (Deg)
                  </label>
                  <input 
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
              </div>

              {/* Wall-specific controls */}
              {selectedElement.type === 'wall' && (
                 <div className="space-y-4 mt-4">
                    <button 
                      onClick={onEditElevation}
                      className="w-full bg-[var(--brand)] text-white py-2 rounded-lg font-bold hover:bg-[var(--brand-h)] transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      Edit Wall Elevation
                    </button>
                   
                   <div>
                     <label className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
                       Wall Thickness (cm)
                     </label>
                     <div className="flex items-center gap-3">
                       <input 
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
                       {WALL_MATERIALS_LIST.map(m => (
                         <button
                           key={m.value}
                           onClick={() => handleMaterialChange(m.value)}
                           className={`px-3 py-2 rounded-lg text-xs font-bold border transition ${
                             (selectedElement.material || 'Solid Wall') === m.value
                               ? 'border-[var(--lagoon)] bg-[var(--lagoon-soft)] text-[var(--lagoon-deep)]'
                               : 'border-[var(--line)] bg-[var(--sand)] text-[var(--sea-ink)] hover:border-[var(--lagoon)]'
                           }`}
                         >
                           {m.label}
                         </button>
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
                    onClick={() => onBoothConfigUpdate?.({ floorType: mat.id })}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                      floorType === mat.id
                        ? 'border-[var(--lagoon)] bg-[var(--lagoon-soft)]'
                        : 'border-[var(--line)] bg-[var(--sand)] hover:border-[var(--lagoon)]'
                    }`}
                  >
                    {/* Color swatch */}
                    <div
                      className="w-8 h-8 rounded-lg shrink-0 border border-[rgba(0,0,0,0.1)]"
                      style={{ backgroundColor: mat.color }}
                    />
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
            </div>

            <div className="text-center text-[10px] text-[var(--sea-ink-soft)] pt-2 border-t border-[var(--line)]">
              Select an element to edit its properties
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-[var(--line)]">
          <h4 className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider flex items-center gap-2 mb-3">
            <Code className="h-4 w-4" />
            JSON Preview
          </h4>
          <pre className="bg-[#1e1e1e] text-[#b8efe5] p-3 rounded-xl text-[10px] overflow-x-auto shadow-inner leading-relaxed max-h-48">
            {JSON.stringify(selectedElement || { status: 'idle', workspace: 'ready' }, null, 2)}
          </pre>
        </div>
      </div>
    </aside>
  )
}
