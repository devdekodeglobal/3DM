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
        className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border)] dark:border-white/10 bg-[var(--bg-card)] dark:bg-[#16181d] backdrop-blur-xl p-6 shadow-2xl transition-all text-[var(--fg)] dark:text-white"
        style={{
          boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.35)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow Orb background */}
        <div className="absolute -top-24 -left-24 -z-10 h-48 w-48 rounded-full bg-amber-500 opacity-10 dark:opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 -z-10 h-48 w-48 rounded-full bg-red-500 opacity-10 dark:opacity-20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[var(--fg-dim)] dark:text-white/50 hover:text-[var(--fg)] dark:hover:text-white hover:bg-[var(--bg-subtle)] dark:hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6 mt-2">
          <div className="bg-amber-500/10 dark:bg-white/5 p-3 rounded-full mb-4 ring-1 ring-amber-500/20 dark:ring-white/10">
            <AlertTriangle className="w-8 h-8 text-amber-500 dark:text-amber-400" />
          </div>
          <h2 className="text-xl font-bold font-[Outfit] text-[var(--fg)] dark:text-white">{title}</h2>
          <p className="text-[var(--fg-soft)] dark:text-white/70 text-sm mt-2 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-[var(--border)] dark:border-white/20 bg-[var(--bg-subtle)]/50 dark:bg-white/5 text-sm font-semibold text-[var(--fg)] dark:text-white hover:bg-[var(--border)] dark:hover:bg-white/10 transition cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onCancel()
            }}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 text-black text-sm font-bold hover:bg-amber-400 transition shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
