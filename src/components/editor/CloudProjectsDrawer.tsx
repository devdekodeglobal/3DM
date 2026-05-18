import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { X, FolderOpen, Calendar, Trash2, Loader2, AlertCircle, RefreshCw } from 'lucide-react'

interface CloudProjectsDrawerProps {
  isOpen: boolean
  onClose: () => void
  onLoadProject: (boothConfig: any, elements: any[]) => void
  userId: string | null
}

export const CloudProjectsDrawer: React.FC<CloudProjectsDrawerProps> = ({
  isOpen,
  onClose,
  onLoadProject,
  userId
}) => {
  const [designs, setDesigns] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchDesigns = async () => {
    if (!userId) return
    setLoading(true)
    setErrorMsg(null)
    try {
      const { data, error } = await supabase
        .from('designs')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setDesigns(data || [])
    } catch (err: any) {
      console.error('Fetch error:', err)
      setErrorMsg(err.message || 'Failed to fetch saved designs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && userId) {
      fetchDesigns()
    }
  }, [isOpen, userId])

  if (!isOpen) return null

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this cloud design?')) return

    setDeletingId(id)
    try {
      const { error } = await supabase
        .from('designs')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Filter out deleted design from view
      setDesigns(prev => prev.filter(d => d.id !== id))
    } catch (err: any) {
      console.error('Delete error:', err)
      alert(err.message || 'Failed to delete design.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 z-[80] w-96 bg-[var(--bg-card)] border-l border-[var(--border)] shadow-2xl flex flex-col transition-all">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-subtle)]">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-[var(--brand)]" />
          <h2 className="text-sm font-black font-[Outfit] text-[var(--fg)] tracking-wide uppercase">
            My Cloud Designs
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={fetchDesigns}
            title="Refresh list"
            disabled={loading}
            className="p-1.5 rounded-lg text-[var(--fg-dim)] hover:text-[var(--fg)] hover:bg-[var(--chip-bg)] transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--fg-dim)] hover:text-[var(--fg)] hover:bg-[var(--chip-bg)] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && designs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-[var(--fg-dim)]">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--brand)] mb-2" />
            <span className="text-xs">Fetching your workspace cloud saves...</span>
          </div>
        ) : errorMsg ? (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center py-16 px-4 text-[var(--fg-dim)]">
            <FolderOpen className="w-12 h-12 stroke-[1.2] mx-auto text-[var(--border)] mb-3" />
            <p className="text-sm font-bold text-[var(--fg)]">No designs found</p>
            <p className="text-xs mt-1 max-w-[240px] mx-auto leading-relaxed">
              When you are working, click "Save Project" and select "Save to Cloud" to keep your layouts safe here.
            </p>
          </div>
        ) : (
          designs.map((design) => (
            <div
              key={design.id}
              onClick={() => {
                onLoadProject(design.booth_config, design.elements)
                onClose()
              }}
              className="group relative p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] hover:bg-[var(--chip-bg)] hover:border-[var(--brand)] transition cursor-pointer flex flex-col gap-2"
            >
              {/* Title & Actions */}
              <div className="flex items-start justify-between gap-4">
                <span className="font-bold text-xs text-[var(--fg)] font-[Outfit] group-hover:text-[var(--brand)] transition break-words flex-1">
                  {design.name}
                </span>
                
                {/* Trash delete */}
                <button
                  disabled={deletingId === design.id}
                  onClick={(e) => handleDelete(design.id, e)}
                  className="p-1 rounded text-red-400 hover:text-red-500 hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
                  title="Delete design"
                >
                  {deletingId === design.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Timestamp footer */}
              <div className="flex items-center gap-1.5 text-[10px] text-[var(--fg-dim)] font-medium">
                <Calendar className="w-3 h-3 shrink-0" />
                <span>
                  Saved {new Date(design.updated_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-subtle)] text-[10px] text-center text-[var(--fg-dim)] font-semibold tracking-wide">
        SYNCED SECURELY VIA SUPABASE
      </div>
    </div>
  )
}
