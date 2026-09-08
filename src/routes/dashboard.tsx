import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getCurrentUser, listDesigns, deleteDesign, updateDesign, type User, type Design } from '../lib/authClient'
import { PlusCircle, Trash2, Calendar, LayoutGrid, Loader2, Box, Pencil, Check, X } from 'lucide-react'
import { ConfirmModal } from '../components/editor/ConfirmModal'

export const Route = createFileRoute('/dashboard')({ component: DashboardPage })

function timeAgo(dateStr: string): string {
  // SQLite returns dates like "2024-03-05 12:00:00" which are UTC. 
  // We append 'Z' (and replace space with T) to ensure the browser parses it as UTC, not local time.
  const normalized = dateStr.endsWith('Z') ? dateStr : dateStr.replace(' ', 'T') + 'Z'
  const date = new Date(normalized)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #4f46e5 0%, #0891b2 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
  'linear-gradient(135deg, #0891b2 0%, #059669 100%)',
  'linear-gradient(135deg, #d97706 0%, #dc2626 100%)',
  'linear-gradient(135deg, #059669 0%, #0891b2 100%)',
  'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
]

function BoothMiniSVG({ config }: { config: any }) {
  const w = config?.width || 4
  const d = config?.depth || 3
  const walls = config?.walls || {}
  const ratio = Math.max(w, d)
  const sw = (w / ratio) * 80
  const sh = (d / ratio) * 80
  const ox = (100 - sw) / 2
  const oy = (100 - sh) / 2
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ opacity: 0.8 }}>
      <rect width="100" height="100" fill="none" />
      <rect x={ox} y={oy} width={sw} height={sh} fill="rgba(255,255,255,0.1)" rx="2" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      {walls.north && <line x1={ox} y1={oy} x2={ox + sw} y2={oy} stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" />}
      {walls.south && <line x1={ox} y1={oy + sh} x2={ox + sw} y2={oy + sh} stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" />}
      {walls.east && <line x1={ox + sw} y1={oy} x2={ox + sw} y2={oy + sh} stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" />}
      {walls.west && <line x1={ox} y1={oy} x2={ox} y2={oy + sh} stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" />}
      <text x="50" y="96" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="6" fontFamily="Inter, sans-serif">{w}m x {d}m</text>
    </svg>
  )
}

function ProjectCard({ design, index, onOpen, onDeleteRequest, onRenameRequest }: {
  design: Design; index: number; onOpen: () => void; onDeleteRequest: (id: string, name: string) => void; onRenameRequest: (id: string, name: string) => void
}) {
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length]
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(design.name)
  let config: any = null
  try { config = JSON.parse(design.config) } catch {}

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDeleteRequest(design.id, design.name)
  }

  return (
    <div
      onClick={onOpen}
      className="group"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-4px)'
        el.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)'
        el.style.borderColor = 'var(--border-brand)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
        el.style.borderColor = 'var(--border)'
      }}
    >
      <div style={{ height: 140, background: gradient, position: 'relative', padding: 16 }}>
        <BoothMiniSVG config={config} />
        <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }} className="group-hover:opacity-100 opacity-0 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); setEditName(design.name); }}
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(79,70,229,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.4)')}
            title="Edit name"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={handleDelete}
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(220,38,38,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.4)')}
            title="Delete project"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div style={{ padding: '14px 16px' }}>
        {isEditing ? (
          <div style={{ display: 'flex', gap: 6, marginBottom: 6 }} onClick={e => e.stopPropagation()}>
            <input 
              autoFocus
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (editName.trim()) { onRenameRequest(design.id, editName.trim()); }
                  setIsEditing(false)
                }
                if (e.key === 'Escape') {
                  setIsEditing(false)
                }
              }}
              style={{
                flex: 1, background: 'var(--surface-strong)', border: '1px solid var(--brand)',
                color: 'white', fontSize: '0.9rem', borderRadius: 4, padding: '2px 6px',
                outline: 'none', width: '100%'
              }}
            />
            <button onClick={() => { if (editName.trim()) onRenameRequest(design.id, editName.trim()); setIsEditing(false) }} style={{ color: 'var(--brand)' }} title="Save">
              <Check size={16} />
            </button>
            <button onClick={() => setIsEditing(false)} style={{ color: 'var(--fg-dim)' }} title="Cancel">
              <X size={16} />
            </button>
          </div>
        ) : (
          <h3 style={{
            margin: '0 0 6px', fontSize: '0.95rem', fontWeight: 700,
            fontFamily: 'Outfit, sans-serif', color: 'var(--fg)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{design.name}</h3>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--fg-dim)', fontSize: '0.75rem' }}>
          <Calendar size={11} />
          <span>{timeAgo(design.updated_at || design.created_at)}</span>
        </div>
      </div>
    </div>
  )
}

function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [designs, setDesigns] = useState<Design[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean; title?: string; message: string; confirmText?: string; onConfirm: () => void
  } | null>(null)

  useEffect(() => {
    document.title = 'My Projects | Krafc'
    ;(async () => {
      const u = await getCurrentUser()
      if (!u) { navigate({ to: '/' }); return }
      setUser(u)
      const d = await listDesigns()
      setDesigns(d)
      setLoading(false)
    })()
  }, [])

  const handleOpen = (design: Design) => {
    try {
      localStorage.setItem('stall-config', design.config)
      localStorage.setItem('stall-elements', design.elements)
      localStorage.setItem('current-design-id', design.id)
      localStorage.setItem('current-design-name', design.name)
    } catch {}
    navigate({ to: '/editor' })
  }

  const handleDeleteRequest = (id: string, name: string) => {
    setConfirmModalState({
      isOpen: true,
      title: 'Delete Design',
      message: `Are you sure you want to delete "${name}"? This cannot be undone.`,
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await deleteDesign(id)
          setDesigns(prev => prev.filter(d => d.id !== id))
        } catch (err) {
          console.error("Failed to delete", err)
        } finally {
          setConfirmModalState(null)
        }
      }
    })
  }

  const handleRenameRequest = async (id: string, newName: string) => {
    try {
      // Find the existing design so we don't lose config
      const target = designs.find(d => d.id === id)
      if (!target) return
      
      await updateDesign(id, { name: newName, config: JSON.parse(target.config), elements: JSON.parse(target.elements) })
      setDesigns(prev => prev.map(d => d.id === id ? { ...d, name: newName, updated_at: new Date().toISOString() } : d))
    } catch (err) {
      console.error("Failed to rename", err)
    }
  }

  const handleNewDesign = () => {
    localStorage.removeItem('stall-config')
    localStorage.removeItem('stall-elements')
    localStorage.removeItem('current-design-id')
    localStorage.removeItem('current-design-name')
    navigate({ to: '/editor' })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 80 }}>
      {/* Page title bar — no auth controls (those live in the main site Header) */}
      <div style={{
        borderBottom: '1px solid var(--border)', padding: '14px 0',
        background: 'var(--bg-card)', position: 'sticky', top: 'var(--header-height, 56px)', zIndex: 40,
        backdropFilter: 'blur(12px)',
      }}>
        <div className="page-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LayoutGrid size={18} color="var(--brand)" />
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--fg)' }}>My Projects</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--fg-dim)' }}>
            {!loading && `${designs.length} design${designs.length !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      <div className="page-wrap" style={{ paddingTop: 48 }}>
        {/* Greeting */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: '0.82rem', color: 'var(--brand)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Dashboard</p>
              <h1 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--fg)' }}>
                Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
              </h1>

            </div>
            <button onClick={handleNewDesign} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <PlusCircle size={16} /> New Design
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '80px 0', color: 'var(--fg-dim)' }}>
            <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} />
            <span>Loading your projects…</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && designs.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '80px 20px', textAlign: 'center',
            border: '1px dashed var(--border-brand)', borderRadius: 20, background: 'var(--bg-card)',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, marginBottom: 20,
              background: 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(8,145,178,0.2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Box size={28} color="var(--brand)" />
            </div>
            <h2 style={{ margin: '0 0 8px', fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.2rem', color: 'var(--fg)' }}>No designs yet</h2>
            <p style={{ margin: '0 0 24px', color: 'var(--fg-dim)', fontSize: '0.9rem', maxWidth: 320 }}>
              Start a new project and save it to the cloud to see it here.
            </p>
            <button onClick={handleNewDesign} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <PlusCircle size={16} /> Create First Design
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && designs.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            <div
              onClick={handleNewDesign}
              style={{
                border: '1px dashed var(--border-brand)', borderRadius: 16, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: 210, gap: 10, background: 'transparent', transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(79,70,229,0.06)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
            >
              <PlusCircle size={28} color="var(--brand)" />
              <span style={{ fontFamily: 'Outfit', fontWeight: 600, color: 'var(--brand)', fontSize: '0.9rem' }}>New Design</span>
            </div>
            {designs.map((design, i) => (
              <ProjectCard
                key={design.id}
                design={design}
                index={i}
                onOpen={() => handleOpen(design)}
                onDeleteRequest={handleDeleteRequest}
                onRenameRequest={handleRenameRequest}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!confirmModalState}
        title={confirmModalState?.title}
        message={confirmModalState?.message || ''}
        confirmText={confirmModalState?.confirmText}
        onConfirm={() => confirmModalState?.onConfirm()}
        onCancel={() => setConfirmModalState(null)}
      />
    </div>
  )
}
