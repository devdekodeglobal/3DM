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
  showCancelButton?: boolean
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
  showCancelButton = false,
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
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => {
        e.stopPropagation()
        onCancel()
      }}
    >
      {/* Modal Card with adaptive light/dark styling */}
      <div 
        className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border)] dark:border-white/10 bg-[var(--bg-card)] dark:bg-[#16181d] backdrop-blur-xl p-6 shadow-2xl transition-all text-[var(--fg)] dark:text-white"
        style={{
          boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.35)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow Orb background */}
        <div className="absolute -top-24 -left-24 -z-10 h-48 w-48 rounded-full bg-[var(--brand)] opacity-10 dark:opacity-20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[var(--fg-dim)] dark:text-white/50 hover:text-[var(--fg)] dark:hover:text-white hover:bg-[var(--bg-subtle)] dark:hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col mb-4 mt-2">
          <div className="bg-[var(--sand)] dark:bg-white/5 w-fit p-3 rounded-xl mb-4 ring-1 ring-[var(--border)] dark:ring-white/10">
            <PlusCircle className="w-6 h-6 text-[var(--brand)]" />
          </div>
          <h2 className="text-xl font-bold font-[Outfit] text-[var(--fg)] dark:text-white">{title}</h2>
          {message && (
            <p className="text-[var(--fg-soft)] dark:text-white/70 text-sm mt-2 leading-relaxed">
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
            className="w-full bg-[var(--surface-light)] dark:bg-white/5 border border-[var(--border)] dark:border-white/10 rounded-xl px-4 py-3 text-[var(--fg)] dark:text-white placeholder-[var(--fg-dim)] dark:placeholder-white/30 outline-none focus:border-[var(--brand)] transition-colors text-sm"
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
        <div className="flex gap-3 mt-6">
          {showCancelButton && (
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl border border-[var(--border)] dark:border-white/20 bg-[var(--bg-subtle)]/50 dark:bg-white/5 text-sm font-semibold text-[var(--fg)] dark:text-white hover:bg-[var(--border)] dark:hover:bg-white/10 transition cursor-pointer"
            >
              {cancelText}
            </button>
          )}
          <button
            disabled={!value.trim()}
            onClick={() => {
              if (value.trim()) {
                onConfirm(value.trim())
                onCancel()
              }
            }}
            className="w-full py-3 px-4 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] active:bg-[#3730a3] text-white text-sm font-bold transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="text-white font-bold">{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
