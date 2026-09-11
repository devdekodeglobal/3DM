import React, { useState, useEffect } from 'react'
import { PlusCircle, X } from 'lucide-react'

interface PromptModalProps {
  isOpen: boolean
  title: string
  message?: string
  placeholder?: string
  initialValue?: string
  confirmText?: string
  cancelText?: string
  onConfirm: (value: string) => void
  onCancel: () => void
}

export const PromptModal: React.FC<PromptModalProps> = ({
  isOpen,
  title,
  message,
  placeholder = '',
  initialValue = '',
  confirmText = 'Create',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue)
    }
  }, [isOpen, initialValue])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Card with premium glassmorphism */}
      <div 
        className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 shadow-2xl transition-all text-white"
        style={{
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        }}
      >
        {/* Glow Orb background */}
        <div className="absolute -top-24 -left-24 -z-10 h-48 w-48 rounded-full bg-[var(--brand)] opacity-20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col mb-4 mt-2">
          <div className="bg-white/5 w-fit p-3 rounded-xl mb-4 ring-1 ring-white/10">
            <PlusCircle className="w-6 h-6 text-[var(--brand)]" />
          </div>
          <h2 className="text-xl font-bold">{title}</h2>
          {message && (
            <p className="text-white/70 text-sm mt-2">
              {message}
            </p>
          )}
        </div>
        
        {/* Input */}
        <div className="mt-4">
          <input
            autoFocus
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-[var(--brand)] transition-colors"
            onKeyDown={e => {
              if (e.key === 'Enter' && value.trim()) {
                onConfirm(value.trim())
                onCancel()
              }
              if (e.key === 'Escape') onCancel()
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-white/20 bg-white/5 text-sm font-semibold hover:bg-white/10 transition"
          >
            {cancelText}
          </button>
          <button
            disabled={!value.trim()}
            onClick={() => {
              if (value.trim()) {
                onConfirm(value.trim())
                onCancel()
              }
            }}
            className="flex-1 py-2.5 rounded-xl bg-[var(--brand)] text-white text-sm font-semibold hover:brightness-110 transition shadow-[0_0_15px_rgba(79,70,229,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
