import React, { useState, useEffect } from 'react';
import { RAL_COLORS, findClosestRAL, applyDarknessToHex } from '../../lib/ralColors';

interface ColorPickerPanelProps {
  initialColor: string; // Hex color
  onChange: (color: string) => void;
}

export default function ColorPickerPanel({ initialColor, onChange }: ColorPickerPanelProps) {
  const [baseColor, setBaseColor] = useState(initialColor || '#ffffff');
  const [darkness, setDarkness] = useState(1); // 1 = full brightness, 0 = black
  const [ralCode, setRalCode] = useState(() => findClosestRAL(initialColor || '#ffffff'));
  const [hexInput, setHexInput] = useState(initialColor || '#ffffff');

  // When baseColor or darkness changes, calculate final color and call onChange
  useEffect(() => {
    const finalHex = applyDarknessToHex(baseColor, darkness);
    setHexInput(finalHex);
    setRalCode(findClosestRAL(finalHex));
    onChange(finalHex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseColor, darkness]);

  const handleRalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRalCode(val);
    if (RAL_COLORS[val]) {
      setBaseColor(RAL_COLORS[val]);
      setDarkness(1); // reset darkness when picking a fresh RAL
    }
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('#')) val = '#' + val;
    setHexInput(val);
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      setBaseColor(val);
      setDarkness(1); // reset darkness
    }
  };

  return (
    <div className="bg-[var(--chip-bg)] border border-[var(--line)] rounded-xl p-3 space-y-4 mt-2">
      {/* Visual Color Picker */}
      <div className="flex items-center gap-3">
        <label className="text-[10px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider w-16">
          Color
        </label>
        <div className="relative w-full h-8 rounded-lg overflow-hidden border border-[var(--line)]">
          <input
            type="color"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            className="absolute -top-2 -left-2 w-[150%] h-[150%] cursor-pointer"
          />
        </div>
      </div>

      {/* Darkness Slider */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-[10px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider">
            Brightness
          </label>
          <span className="text-[10px] font-mono text-[var(--lagoon-deep)]">
            {Math.round(darkness * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={darkness}
          onChange={(e) => setDarkness(parseFloat(e.target.value))}
          className="w-full accent-[var(--lagoon-deep)] h-1.5 rounded-full appearance-none bg-[var(--sand)]"
        />
      </div>

      {/* Inputs for Hex and RAL */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
            HEX Code
          </label>
          <input
            type="text"
            value={hexInput}
            onChange={handleHexChange}
            maxLength={7}
            className="w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-2 py-1.5 text-xs outline-none font-mono text-[var(--sea-ink)]"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
            RAL Code
          </label>
          <div className="relative">
            <span className="absolute left-2 top-1.5 text-[10px] font-bold text-[var(--sea-ink-soft)]">RAL</span>
            <input
              type="text"
              value={ralCode}
              onChange={handleRalChange}
              maxLength={4}
              className="w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg pl-8 pr-2 py-1.5 text-xs outline-none font-mono text-[var(--sea-ink)]"
              placeholder="9010"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
