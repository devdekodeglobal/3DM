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
        className="relative w-full max-w-[520px] overflow-hidden rounded-3xl border border-[var(--border)] dark:border-white/15 bg-[var(--bg-card)] dark:bg-[#16181d] backdrop-blur-2xl p-8 sm:p-9 shadow-2xl transition-all text-[var(--fg)] dark:text-white"
        style={{
          boxShadow: '0 20px 50px 0 rgba(0, 0, 0, 0.45)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow Orb background */}
        <div className="absolute -top-20 -left-20 -z-10 h-56 w-56 rounded-full bg-[var(--brand)] opacity-15 dark:opacity-25 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onCancel}
          className="absolute top-5 right-5 p-2 rounded-full text-[var(--fg-soft)] dark:text-white/80 hover:text-[var(--fg)] dark:hover:text-white hover:bg-[var(--bg-subtle)] dark:hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col mb-5 mt-1">
          <div className="bg-[var(--sand)] dark:bg-white/10 w-fit p-3.5 rounded-2xl mb-4 ring-1 ring-[var(--border)] dark:ring-white/10">
            <PlusCircle className="w-7 h-7 text-[var(--brand)]" />
          </div>
          <h2 className="text-2xl font-bold font-[Outfit] text-[var(--fg)] dark:text-white tracking-tight">{title}</h2>
          {message && (
            <p className="text-[var(--fg-soft)] dark:text-white/85 text-base mt-2.5 leading-relaxed font-medium">
              {message}
            </p>
          )}
        </div>
        
        {/* Input */}
        <div className="mt-5">
          <input
            autoFocus
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[var(--surface-light)] dark:bg-white/5 border border-[var(--border)] dark:border-white/15 rounded-xl px-4 py-3.5 text-[var(--fg)] dark:text-white placeholder-[var(--fg-dim)] dark:placeholder-white/35 outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 transition-all text-base"
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
        <div className="flex gap-3.5 mt-7">
          {showCancelButton && (
            <button
              onClick={onCancel}
              className="flex-1 py-3.5 px-4 rounded-xl border border-[var(--border)] dark:border-white/20 bg-[var(--bg-subtle)]/70 dark:bg-white/5 text-base font-semibold text-[var(--fg)] dark:text-white hover:bg-[var(--border)] dark:hover:bg-white/10 transition cursor-pointer shadow-xs"
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
            className="w-full py-3.5 px-5 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] active:bg-[#3730a3] text-white text-base font-bold transition shadow-[0_4px_16px_rgba(79,70,229,0.35)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="text-white font-bold">{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
