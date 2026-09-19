import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => {
        e.stopPropagation()
        onCancel()
      }}
    >
      {/* Modal Card with light/dark adaptive design */}
      <div 
        className="relative w-full max-w-[520px] overflow-hidden rounded-3xl border border-[var(--border)] dark:border-white/15 bg-[var(--bg-card)] dark:bg-[#16181d] backdrop-blur-2xl p-8 sm:p-9 shadow-2xl transition-all text-[var(--fg)] dark:text-white"
        style={{
          boxShadow: '0 20px 50px 0 rgba(0, 0, 0, 0.45)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow Orb background */}
        <div className="absolute -top-20 -left-20 -z-10 h-56 w-56 rounded-full bg-amber-500 opacity-15 dark:opacity-25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 -z-10 h-56 w-56 rounded-full bg-red-500 opacity-15 dark:opacity-25 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onCancel}
          className="absolute top-5 right-5 p-2 rounded-full text-[var(--fg-soft)] dark:text-white/80 hover:text-[var(--fg)] dark:hover:text-white hover:bg-[var(--bg-subtle)] dark:hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6 mt-1">
          <div className="bg-amber-500/15 dark:bg-amber-500/20 p-4 rounded-2xl mb-5 ring-1 ring-amber-500/30 shadow-sm">
            <AlertTriangle className="w-10 h-10 text-amber-500 dark:text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold font-[Outfit] text-[var(--fg)] dark:text-white tracking-tight">{title}</h2>
          <p className="text-[var(--fg-soft)] dark:text-white/85 text-base mt-3 leading-relaxed font-medium px-2">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3.5 mt-8">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 px-4 rounded-xl border border-[var(--border)] dark:border-white/20 bg-[var(--bg-subtle)]/70 dark:bg-white/5 text-base font-semibold text-[var(--fg)] dark:text-white hover:bg-[var(--border)] dark:hover:bg-white/10 transition cursor-pointer shadow-xs"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onCancel()
            }}
            className="flex-1 py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-base font-bold transition shadow-[0_4px_16px_rgba(245,158,11,0.35)] cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
