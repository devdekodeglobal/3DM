import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, useRef } from 'react'
import { getCurrentUser, listDesigns, listProjects, createProject, updateProject, deleteProject, deleteDesign, updateDesign, changePassword, deleteAccount, saveDesign, updateProfile, getDisplayName, type User, type Design, type Project } from '../lib/authClient'
import { 
  Plus, 
  FolderPlus, 
  Folder, 
  FileText, 
  Trash2, 
  LayoutGrid, 
  Loader2, 
  Box, 
  Pencil, 
  Check, 
  X, 
  Settings, 
  ShieldAlert, 
  Key, 
  Menu, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  ExternalLink,
  Search,
  Sparkles,
  Clock,
  FolderInput
} from 'lucide-react'
import { ConfirmModal } from '../components/editor/ConfirmModal'
import { PromptModal } from '../components/editor/PromptModal'
import { AnimatedHeaderLogo } from '../components/AnimatedHeaderLogo'
import UserMenuDropdown from '../components/UserMenuDropdown'

interface DashboardSearch {
  tab?: 'projects' | 'settings'
}

export const Route = createFileRoute('/dashboard')({
  validateSearch: (search: Record<string, unknown>): DashboardSearch => {
    return {
      tab: (search.tab as 'projects' | 'settings') || 'projects',
    }
  },
  component: DashboardPage,
})

function timeAgo(dateStr: string): string {
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
  'linear-gradient(135deg, #3730a3 0%, #1e1b4b 50%, #0f172a 100%)',
  'linear-gradient(135deg, #1e3a8a 0%, #0f766e 100%)',
  'linear-gradient(135deg, #4c1d95 0%, #1e1b4b 100%)',
  'linear-gradient(135deg, #065f46 0%, #064e3b 100%)',
  'linear-gradient(135deg, #831843 0%, #4c0519 100%)',
  'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
]

function BoothMiniSVG({ config }: { config: any }) {
  const w = config?.width || 4
  const d = config?.depth || 3
  const walls = config?.walls || {}
  const ratio = Math.max(w, d)
  const sw = Math.min((w / ratio) * 72, 74)
  const sh = Math.min((d / ratio) * 72, 74)
  const ox = (100 - sw) / 2
  const oy = (100 - sh) / 2
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" className="w-full h-full">
      <defs>
        <pattern id="grid-dots" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.8" fill="rgba(255,255,255,0.15)" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#grid-dots)" />
      
      {/* Space Floor */}
      <rect 
        x={ox} 
        y={oy} 
        width={sw} 
        height={sh} 
        fill="rgba(255,255,255,0.06)" 
        rx="3" 
        stroke="rgba(255,255,255,0.25)" 
        strokeWidth="0.8" 
        strokeDasharray="2,2" 
      />
      
      {/* Walls */}
      {walls.north && <line x1={ox} y1={oy} x2={ox + sw} y2={oy} stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />}
      {walls.south && <line x1={ox} y1={oy + sh} x2={ox + sw} y2={oy + sh} stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />}
      {walls.east && <line x1={ox + sw} y1={oy} x2={ox + sw} y2={oy + sh} stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />}
      {walls.west && <line x1={ox} y1={oy} x2={ox} y2={oy + sh} stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />}
      
      {/* Space Badge */}
      <rect x={50 - 18} y={oy + sh / 2 - 5} width={36} height={10} rx="5" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      <text x="50" y={oy + sh / 2 + 2.2} textAnchor="middle" fill="#fff" fontSize="4.5" fontWeight="600" fontFamily="Outfit, Inter, sans-serif">
        {w}m × {d}m
      </text>
    </svg>
  )
}

function DesignCard({ 
  design, 
  index, 
  onOpen, 
  onDeleteRequest, 
  onRenameRequest,
  onMoveRequest,
  isMenuOpen,
  onToggleMenu
}: {
  design: Design
  index: number
  onOpen: () => void
  onDeleteRequest: (id: string, name: string) => void
  onRenameRequest: (id: string, name: string) => void
  onMoveRequest: (design: Design) => void
  isMenuOpen: boolean
  onToggleMenu: () => void
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

  const handleStartRename = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
    setEditName(design.name)
    onToggleMenu()
  }

  const handleStartMove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleMenu()
    onMoveRequest(design)
  }

  return (
    <div
      onClick={onOpen}
      className={`group relative flex flex-col rounded-2xl cursor-pointer transition-all duration-300 border bg-[var(--bg-card)] hover:-translate-y-1.5 hover:shadow-xl hover:border-[#6366f1] ${
        isMenuOpen ? 'z-40 ring-2 ring-[#6366f1]/30' : 'z-10'
      }`}
      style={{
        borderColor: 'var(--border)',
      }}
    >
      {/* Blueprint Visual Header */}
      <div 
        className="h-36 relative rounded-t-2xl p-3 flex items-center justify-center"
        style={{ background: gradient }}
      >
        <BoothMiniSVG config={config} />

        {/* 3-Dot Dropdown Action */}
        <div className="absolute top-2.5 right-2.5 z-50">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleMenu()
            }}
            className="w-8 h-8 rounded-lg bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-colors shadow-sm"
            title="More actions"
          >
            <MoreVertical size={16} />
          </button>

          {isMenuOpen && (
            <div 
              onClick={e => e.stopPropagation()}
              className="absolute right-0 top-10 w-48 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-2xl py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-150"
              style={{ boxShadow: '0 16px 40px rgba(0,0,0,0.35)' }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleMenu()
                  onOpen()
                }}
                className="w-full px-3.5 py-2.5 text-xs font-semibold text-[var(--fg)] hover:bg-[var(--bg-subtle)] hover:text-[#6366f1] flex items-center gap-2.5 transition-colors"
              >
                <ExternalLink size={14} /> Open in Editor
              </button>
              <button
                onClick={handleStartRename}
                className="w-full px-3.5 py-2.5 text-xs font-semibold text-[var(--fg)] hover:bg-[var(--bg-subtle)] hover:text-[#6366f1] flex items-center gap-2.5 transition-colors"
              >
                <Pencil size={14} /> Rename
              </button>
              <button
                onClick={handleStartMove}
                className="w-full px-3.5 py-2.5 text-xs font-semibold text-[var(--fg)] hover:bg-[var(--bg-subtle)] hover:text-[#6366f1] flex items-center gap-2.5 transition-colors"
              >
                <FolderInput size={14} /> Move to Folder
              </button>
              <div className="my-1 border-t border-[var(--border)]" />
              <button
                onClick={(e) => {
                  onToggleMenu()
                  handleDelete(e)
                }}
                className="w-full px-3.5 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-500/10 flex items-center gap-2.5 transition-colors"
              >
                <Trash2 size={14} /> Delete Design
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Content Footer */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {isEditing ? (
            <div className="flex items-center gap-1.5 mb-2" onClick={e => e.stopPropagation()}>
              <input 
                autoFocus
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    if (editName.trim()) { onRenameRequest(design.id, editName.trim()) }
                    setIsEditing(false)
                  }
                  if (e.key === 'Escape') {
                    setIsEditing(false)
                  }
                }}
                className="flex-1 bg-[var(--bg)] border border-[#6366f1] text-[var(--fg)] text-sm rounded-lg px-2.5 py-1 outline-none"
              />
              <button 
                onClick={() => { 
                  if (editName.trim()) onRenameRequest(design.id, editName.trim())
                  setIsEditing(false) 
                }} 
                className="p-1 text-[#6366f1] hover:bg-[#6366f1]/10 rounded"
              >
                <Check size={16} />
              </button>
              <button onClick={() => setIsEditing(false)} className="p-1 text-[var(--fg-dim)] hover:bg-[var(--bg-subtle)] rounded">
                <X size={16} />
              </button>
            </div>
          ) : (
            <h3 className="font-semibold text-sm font-sans text-[var(--fg)] group-hover:text-[#6366f1] transition-colors line-clamp-1 mb-1">
              {design.name}
            </h3>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-[var(--fg-dim)] pt-2 border-t border-[var(--border)]/60">
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>{timeAgo(design.updated_at || design.created_at)}</span>
          </div>
          <span className="text-[11px] font-medium text-[var(--fg-dim)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded-md">
            {config?.width && config?.depth ? `${config.width}x${config.depth}m` : '3D'}
          </span>
        </div>
      </div>
    </div>
  )
}

function ProjectFolderCard({ 
  project, 
  designCount,
  onOpen, 
  onDeleteRequest, 
  onRenameRequest,
  onNewDesignInProject,
  isMenuOpen,
  onToggleMenu
}: { 
  project: Project
  designCount: number
  onOpen: () => void
  onDeleteRequest: (id: string, name: string) => void
  onRenameRequest: (id: string, name: string) => void
  onNewDesignInProject: () => void
  isMenuOpen: boolean
  onToggleMenu: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(project.name)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDeleteRequest(project.id, project.name)
  }

  const handleStartRename = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
    setEditName(project.name)
    onToggleMenu()
  }

  return (
    <div
      onClick={onOpen}
      className={`group relative flex flex-col p-5 rounded-2xl cursor-pointer transition-all duration-300 border bg-[var(--bg-card)] hover:-translate-y-1.5 hover:shadow-xl hover:border-[#6366f1] ${
        isMenuOpen ? 'z-40 ring-2 ring-[#6366f1]/30' : 'z-10'
      }`}
      style={{
        borderColor: 'var(--border)',
      }}
    >
      {/* 3-Dot Menu */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleMenu()
          }}
          className="w-8 h-8 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--border)] text-[var(--fg-soft)] hover:text-[var(--fg)] flex items-center justify-center transition-colors"
          title="More actions"
        >
          <MoreVertical size={16} />
        </button>

        {isMenuOpen && (
          <div 
            onClick={e => e.stopPropagation()}
            className="absolute right-0 top-10 w-48 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-2xl py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-150"
            style={{ boxShadow: '0 16px 40px rgba(0,0,0,0.35)' }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleMenu()
                onOpen()
              }}
              className="w-full px-3.5 py-2.5 text-xs font-semibold text-[var(--fg)] hover:bg-[var(--bg-subtle)] hover:text-[#6366f1] flex items-center gap-2.5 transition-colors"
            >
              <ExternalLink size={14} /> Open Folder
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleMenu()
                onNewDesignInProject()
              }}
              className="w-full px-3.5 py-2.5 text-xs font-semibold text-[var(--fg)] hover:bg-[var(--bg-subtle)] hover:text-[#6366f1] flex items-center gap-2.5 transition-colors"
            >
              <Plus size={14} /> New Design
            </button>
            <button
              onClick={handleStartRename}
              className="w-full px-3.5 py-2.5 text-xs font-semibold text-[var(--fg)] hover:bg-[var(--bg-subtle)] hover:text-[#6366f1] flex items-center gap-2.5 transition-colors"
            >
              <Pencil size={14} /> Rename
            </button>
            <div className="my-1 border-t border-[var(--border)]" />
            <button
              onClick={(e) => {
                onToggleMenu()
                handleDelete(e)
              }}
              className="w-full px-3.5 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-500/10 flex items-center gap-2.5 transition-colors"
            >
              <Trash2 size={14} /> Delete Folder
            </button>
          </div>
        )}
      </div>

      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 text-[#6366f1] group-hover:scale-110 transition-transform">
          <Folder size={24} />
        </div>
        <div className="flex-1 min-w-0 pr-8">
          {isEditing ? (
            <div className="flex items-center gap-1.5 mb-1" onClick={e => e.stopPropagation()}>
              <input 
                autoFocus 
                value={editName} 
                onChange={e => setEditName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { 
                    e.preventDefault()
                    if (editName.trim()) { onRenameRequest(project.id, editName.trim()) }
                    setIsEditing(false)
                  }
                  if (e.key === 'Escape') setIsEditing(false)
                }}
                className="flex-1 bg-[var(--bg)] border border-[#6366f1] text-[var(--fg)] text-sm rounded-lg px-2.5 py-1 outline-none"
              />
              <button onClick={() => { if (editName.trim()) onRenameRequest(project.id, editName.trim()); setIsEditing(false) }} className="p-1 text-[#6366f1] hover:bg-[#6366f1]/10 rounded"><Check size={16} /></button>
              <button onClick={() => setIsEditing(false)} className="p-1 text-[var(--fg-dim)] hover:bg-[var(--bg-subtle)] rounded"><X size={16} /></button>
            </div>
          ) : (
            <h3 className="font-bold text-base font-sans text-[var(--fg)] group-hover:text-[#6366f1] transition-colors truncate">
              {project.name}
            </h3>
          )}
          <p className="text-xs text-[var(--fg-dim)] mt-0.5">
            Created {timeAgo(project.created_at)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]/60 text-xs">
        <span className="inline-flex items-center gap-1.5 font-medium text-[var(--fg-soft)] bg-[var(--bg-subtle)] px-2.5 py-1 rounded-lg">
          <Box size={13} className="text-[#6366f1]" />
          {designCount} {designCount === 1 ? 'Design' : 'Designs'}
        </span>
        <span className="text-[11px] text-[#6366f1] font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
          Explore folder &rarr;
        </span>
      </div>
    </div>
  )
}

function getInitials(user: User | null) {
  if (!user) return '?'
  const name = user.name
  if (name) {
    const parts = name.split(' ').filter(Boolean)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return name.substring(0, 2).toUpperCase()
  }
  if (user.email) {
    const parts = user.email.split('@')[0].split(/[._-]/)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return user.email.substring(0, 2).toUpperCase()
  }
  return 'U'
}

function SettingsTab({ user, onUserUpdate }: { user: User; onUserUpdate: (u: User) => void }) {
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState(user.name || '')
  const [nameLoading, setNameLoading] = useState(false)
  const [nameMsg, setNameMsg] = useState<{ text: string, type: 'error' | 'success' } | null>(null)

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwdMsg, setPwdMsg] = useState<{ text: string, type: 'error' | 'success' } | null>(null)
  
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean; title?: string; message: string; confirmText?: string; onConfirm: () => void
  } | null>(null)

  const handleNameSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setNameMsg(null)
    setNameLoading(true)
    try {
      const updatedUser = await updateProfile(displayName.trim())
      onUserUpdate(updatedUser)
      setNameMsg({ text: 'Display name updated successfully!', type: 'success' })
    } catch (err: any) {
      setNameMsg({ text: err.message || 'Failed to update display name', type: 'error' })
    } finally {
      setNameLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwdMsg(null)
    if (newPassword !== confirmPassword) {
      return setPwdMsg({ text: 'New passwords do not match', type: 'error' })
    }
    if (newPassword.length < 8) {
      return setPwdMsg({ text: 'Password must be at least 8 characters', type: 'error' })
    }
    try {
      await changePassword(oldPassword, newPassword)
      setPwdMsg({ text: 'Password updated successfully!', type: 'success' })
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setPwdMsg({ text: err.message || 'Failed to update password', type: 'error' })
    }
  }

  const handleDeleteRequest = () => {
    setConfirmModalState({
      isOpen: true,
      title: 'Delete Account',
      message: 'Are you absolutely sure you want to delete your account? This action is permanent and will completely erase all of your designs, settings, and personal data. This cannot be undone.',
      confirmText: 'Yes, Delete My Account',
      onConfirm: async () => {
        try {
          await deleteAccount()
          navigate({ to: '/' })
        } catch (err) {
          console.error("Failed to delete account", err)
        } finally {
          setConfirmModalState(null)
        }
      }
    })
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h2 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', color: 'var(--fg)', marginBottom: 8, marginTop: 0 }}>Account Settings</h2>
      <p style={{ color: 'var(--fg-soft)', marginBottom: 40 }}>Manage your personal details, security, and account preferences.</p>

      {/* Profile Details */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 32 }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', color: 'var(--fg)', fontWeight: 600 }}>Personal Details</h3>
        
        <form onSubmit={handleNameSave} style={{ marginBottom: 20 }}>
          {nameMsg && (
            <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: '0.9rem', 
              background: nameMsg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              color: nameMsg.type === 'error' ? '#ef4444' : '#22c55e',
              border: `1px solid ${nameMsg.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`
            }}>
              {nameMsg.text}
            </div>
          )}
          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--fg-dim)', marginBottom: 6 }}>Display Name</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input 
                  type="text" 
                  value={displayName} 
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder={getDisplayName(user)}
                  maxLength={100}
                  style={{ flex: 1, background: 'var(--bg)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', color: 'var(--fg)', fontSize: '0.95rem', outline: 'none' }} 
                />
                <button 
                  type="submit" 
                  disabled={nameLoading || displayName.trim() === (user.name || '')}
                  className="btn btn-primary"
                  style={{ padding: '10px 18px', fontSize: '0.9rem', opacity: (nameLoading || displayName.trim() === (user.name || '')) ? 0.6 : 1 }}
                >
                  {nameLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--fg-dim)', marginTop: 4, display: 'block' }}>
                Your name as it appears in the app and sidebar.
              </span>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--fg-dim)', marginBottom: 6 }}>Email Address</label>
              <div style={{ background: 'var(--bg)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', color: 'var(--fg-soft)', fontSize: '0.95rem' }}>
                {user.email}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Security */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 32 }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', color: 'var(--fg)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Key size={18} /> Password & Security
        </h3>
        
        {user.google_id ? (
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, color: 'var(--fg-soft)', fontSize: '0.9rem' }}>
            Your account is authenticated via Google. Password management is handled by your Google account.
          </div>
        ) : (
          <form onSubmit={handlePasswordChange}>
            {pwdMsg && (
              <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: '0.9rem', 
                background: pwdMsg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                color: pwdMsg.type === 'error' ? '#ef4444' : '#22c55e',
                border: `1px solid ${pwdMsg.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`
              }}>
                {pwdMsg.text}
              </div>
            )}
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--fg-dim)', marginBottom: 6 }}>Current Password</label>
                <input 
                  type="password" required value={oldPassword} onChange={e => setOldPassword(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', color: 'var(--fg)', fontSize: '0.95rem', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--fg-dim)', marginBottom: 6 }}>New Password</label>
                <input 
                  type="password" required minLength={8} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', color: 'var(--fg)', fontSize: '0.95rem', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--fg-dim)', marginBottom: 6 }}>Confirm New Password</label>
                <input 
                  type="password" required minLength={8} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', color: 'var(--fg)', fontSize: '0.95rem', outline: 'none' }} 
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: 20 }}>Update Password</button>
          </form>
        )}
      </div>

      {/* Danger Zone */}
      <div style={{ border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 16, padding: 24, background: 'rgba(239, 68, 68, 0.05)' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldAlert size={18} /> Delete Account
        </h3>
        <p style={{ color: 'var(--fg-soft)', fontSize: '0.9rem', marginBottom: 20, lineHeight: 1.5 }}>
          Permanently delete your krafc account and all associated designs. This action cannot be undone.
        </p>
        <button onClick={handleDeleteRequest} style={{
          background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px',
          fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
          transition: 'background 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
        onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}
        >
          <Trash2 size={16} /> Delete Account
        </button>
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

function DashboardPage() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const [user, setUser] = useState<User | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [designs, setDesigns] = useState<Design[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'projects' | 'settings'>(search.tab || 'projects')

  useEffect(() => {
    if (search.tab && search.tab !== activeTab) {
      setActiveTab(search.tab)
    }
  }, [search.tab])
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return true
    const saved = localStorage.getItem('dashboard-sidebar-open')
    if (saved !== null) return saved === 'true'
    return true // Always open by default
  })

  const toggleSidebar = () => {
    setSidebarOpen(prev => {
      const next = !prev
      localStorage.setItem('dashboard-sidebar-open', String(next))
      return next
    })
  }

  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean; title?: string; message: string; confirmText?: string; onConfirm: () => void
  } | null>(null)
  
  const [promptModalState, setPromptModalState] = useState<{
    isOpen: boolean; title: string; message?: string; placeholder?: string; initialValue?: string; confirmText?: string; onConfirm: (val: string) => void
  } | null>(null)

  useEffect(() => {
    document.title = 'Dashboard | krafc'
    ;(async () => {
      const u = await getCurrentUser()
      if (!u) { navigate({ to: '/' }); return }
      setUser(u)
      const p = await listProjects()
      setProjects(p)
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
      if (design.project_id) {
        localStorage.setItem('current-project-id', design.project_id)
      } else {
        localStorage.removeItem('current-project-id')
      }
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
          if (localStorage.getItem('current-design-id') === id) {
            localStorage.removeItem('current-design-id')
            localStorage.removeItem('current-design-name')
            localStorage.removeItem('stall-config')
            localStorage.removeItem('stall-elements')
          }
        } catch (err) {
          console.error("Failed to delete", err)
        } finally {
          setConfirmModalState(null)
        }
      }
    })
  }

  const [movingDesign, setMovingDesign] = useState<Design | null>(null)
  const [isMoving, setIsMoving] = useState(false)

  const handleMoveDesignRequest = async (designId: string, targetProjectId: string | null) => {
    setIsMoving(true)
    try {
      await updateDesign(designId, { project_id: targetProjectId })
      setDesigns(prev => prev.map(d => d.id === designId ? { ...d, project_id: targetProjectId, updated_at: new Date().toISOString() } : d))
      setMovingDesign(null)
    } catch (err: any) {
      console.error("Failed to move design", err)
      alert(err.message || "Failed to move design.")
    } finally {
      setIsMoving(false)
    }
  }

  const handleRenameRequest = async (id: string, newName: string) => {
    try {
      const target = designs.find(d => d.id === id)
      if (!target) return
      
      await updateDesign(id, { name: newName, config: JSON.parse(target.config), elements: JSON.parse(target.elements) })
      setDesigns(prev => prev.map(d => d.id === id ? { ...d, name: newName, updated_at: new Date().toISOString() } : d))
    } catch (err) {
      console.error("Failed to rename", err)
    }
  }

  const handleRenameProjectRequest = async (id: string, newName: string) => {
    try {
      await updateProject(id, newName)
      setProjects(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p))
      if (activeProject?.id === id) {
        setActiveProject(prev => prev ? { ...prev, name: newName } : null)
      }
    } catch (err) {
      console.error("Failed to rename project", err)
    }
  }

  const handleDeleteProjectRequest = (id: string, name: string) => {
    setConfirmModalState({
      isOpen: true,
      title: 'Delete Project',
      message: `Are you sure you want to delete "${name}"? All designs inside will be lost. This cannot be undone.`,
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await deleteProject(id)
          setProjects(prev => prev.filter(p => p.id !== id))
          if (localStorage.getItem('current-project-id') === id) {
            localStorage.removeItem('current-project-id')
            localStorage.removeItem('current-design-id')
            localStorage.removeItem('current-design-name')
            localStorage.removeItem('stall-config')
            localStorage.removeItem('stall-elements')
          }
        } catch (err) {
          console.error("Failed to delete project", err)
        } finally {
          setConfirmModalState(null)
        }
      }
    })
  }

  const handleCreateProject = () => {
    setPromptModalState({
      isOpen: true,
      title: 'Name Project',
      placeholder: 'e.g. CES 2027 Space',
      initialValue: `Project ${projects.length + 1}`,
      confirmText: 'Create Project',
      onConfirm: async (name: string) => {
        try {
          const newProject = await createProject(name, 'Event Space Designs')
          setProjects(prev => [...prev, newProject])
          setActiveProject(newProject)
        } catch (err) {
          console.error("Failed to create project", err)
          alert("Failed to create project. Limit of 2 projects may be reached.")
        }
      }
    })
  }

  const [createMenuOpen, setCreateMenuOpen] = useState(false)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const createMenuRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (createMenuRef.current && !createMenuRef.current.contains(e.target as Node)) {
        setCreateMenuOpen(false)
      }
      setActiveMenuId(null)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleCreateNewDesign = (targetProjectId?: string | null) => {
    setCreateMenuOpen(false)
    if (designs.length >= 6) {
      alert("You have reached the limit of 6 designs per account.")
      return
    }

    setPromptModalState({
      isOpen: true,
      title: 'Name Your Design',
      placeholder: 'e.g. Modern Space with LED Wall',
      initialValue: `New Space Design`,
      confirmText: 'Start Space Setup',
      onConfirm: async (name: string) => {
        try {
          // Pass null config and [] elements so editor triggers the Space Setup Wizard
          const newDesign = await saveDesign(targetProjectId || null, name, null, [])
          localStorage.removeItem('stall-config')
          localStorage.setItem('stall-elements', '[]')
          localStorage.setItem('current-design-id', newDesign.id)
          localStorage.setItem('current-design-name', name)
          if (targetProjectId) {
            localStorage.setItem('current-project-id', targetProjectId)
          } else {
            localStorage.removeItem('current-project-id')
          }
          navigate({ to: '/editor' })
        } catch (err) {
          console.error("Failed to create blank design", err)
          alert("Failed to create design in the cloud.")
        }
      }
    })
  }

  const handleNewDesign = () => {
    if (!activeProject) return
    handleCreateNewDesign(activeProject.id)
  }

  if (loading || !user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--brand)' }} />
      </div>
    )
  }

  const filteredStandaloneDesigns = designs
    .filter(d => !d.project_id)
    .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredActiveProjectDesigns = activeProject
    ? designs
        .filter(d => d.project_id === activeProject.id)
        .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:relative inset-y-0 left-0 z-50 bg-[var(--bg-card)] flex flex-col flex-shrink-0 transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full w-[260px] md:translate-x-0 md:w-0'
        }`}
        style={{ borderRight: sidebarOpen ? '1px solid var(--border)' : 'none' }}
      >
        {/* Desktop Toggle Button */}
        <button 
          onClick={toggleSidebar}
          className={`hidden md:flex absolute -right-4 top-6 w-8 h-8 bg-[var(--bg-card)] border border-[var(--border)] rounded-full items-center justify-center text-[var(--fg-soft)] hover:text-[#4f46e5] hover:border-[#4f46e5] transition-all z-50 shadow-sm ${
            !sidebarOpen ? 'translate-x-4' : ''
          }`}
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>

        {/* Inner Content Wrapper */}
        <div className="w-[260px] h-full flex flex-col overflow-hidden transition-opacity duration-300" style={{ opacity: sidebarOpen ? 1 : 0, pointerEvents: sidebarOpen ? 'auto' : 'none', padding: '24px 0' }}>
          <div style={{ padding: '0 24px', marginBottom: 24 }}>
            <AnimatedHeaderLogo href="/dashboard" />
          </div>

          {/* "+ Create new" Button in Left Nav Bar */}
          <div ref={createMenuRef} className="relative px-4 mb-6">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setCreateMenuOpen(prev => !prev)
              }}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              style={{
                boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.35)'
              }}
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>Create new</span>
            </button>

            {/* Create New Dropdown */}
            {createMenuOpen && (
              <div 
                onClick={e => e.stopPropagation()}
                className="absolute left-4 right-4 top-13 mt-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-[var(--fg-dim)] uppercase tracking-wider">
                  New Design
                </div>
                <button
                  disabled={designs.length >= 6}
                  onClick={() => handleCreateNewDesign(null)}
                  className={`w-full px-3 py-2 text-left rounded-lg group flex items-start gap-2.5 transition-colors ${
                    designs.length >= 6 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  <FileText size={16} className="text-[#6366f1] mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-[var(--fg)] group-hover:text-[#4f46e5]">Standalone Design</div>
                      <span className="text-[10px] text-[var(--fg-dim)]">{designs.length}/6</span>
                    </div>
                    <div className="text-[10px] text-[var(--fg-dim)] leading-tight">Launches space setup wizard</div>
                  </div>
                </button>

                {projects.length > 0 && (
                  <>
                    <div className="my-1 border-t border-[var(--border)]" />
                    <div className="px-3 py-1 text-[10px] font-bold text-[var(--fg-dim)] uppercase tracking-wider">
                      Add into Project Folder
                    </div>
                    {projects.map(proj => {
                      const count = designs.filter(d => d.project_id === proj.id).length
                      const isFull = designs.length >= 6
                      return (
                        <button
                          key={proj.id}
                          disabled={isFull}
                          onClick={() => handleCreateNewDesign(proj.id)}
                          className={`w-full px-3 py-1.5 text-left rounded-lg flex items-center justify-between group transition-colors ${
                            isFull ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[var(--bg-subtle)]'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <Folder size={14} className="text-[#6366f1] flex-shrink-0" />
                            <span className="text-xs font-medium text-[var(--fg)] truncate">{proj.name}</span>
                          </div>
                          <span className="text-[10px] text-[var(--fg-dim)] flex-shrink-0">{count} {count === 1 ? 'design' : 'designs'}</span>
                        </button>
                      )
                    })}
                  </>
                )}

                <div className="my-1 border-t border-[var(--border)]" />
                <button
                  disabled={projects.length >= 2}
                  onClick={() => {
                    setCreateMenuOpen(false)
                    handleCreateProject()
                  }}
                  className={`w-full px-3 py-2 text-left rounded-lg flex items-center gap-2.5 group transition-colors ${
                    projects.length >= 2 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  <FolderPlus size={16} className="text-[#6366f1] flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-[var(--fg)] group-hover:text-[#4f46e5]">New Project Folder</div>
                    <div className="text-[10px] text-[var(--fg-dim)]">{projects.length}/2 folders used</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0 16px' }}>
            <button 
              onClick={() => { setActiveTab('projects'); if (window.innerWidth <= 768) setSidebarOpen(false) }}
              style={{ 
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10,
                background: activeTab === 'projects' ? 'var(--bg-subtle)' : 'transparent',
                color: activeTab === 'projects' ? 'var(--brand)' : 'var(--fg-soft)',
                fontWeight: activeTab === 'projects' ? 600 : 500, border: 'none', cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s', textAlign: 'left', fontSize: '0.92rem'
              }}
            >
              <LayoutGrid size={18} /> Projects
            </button>
            
            <button 
              onClick={() => { setActiveTab('settings'); if (window.innerWidth <= 768) setSidebarOpen(false) }}
              style={{ 
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10,
                background: activeTab === 'settings' ? 'var(--bg-subtle)' : 'transparent',
                color: activeTab === 'settings' ? 'var(--brand)' : 'var(--fg-soft)',
                fontWeight: activeTab === 'settings' ? 600 : 500, border: 'none', cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s', textAlign: 'left', fontSize: '0.92rem'
              }}
            >
              <Settings size={18} /> Account Settings
            </button>
          </nav>

          <div style={{ marginTop: 'auto', padding: '0 16px' }}>
            <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid var(--border)' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand), var(--lagoon))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0
              }}>
                {getInitials(user)}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--fg)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {getDisplayName(user)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--fg-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        
        {/* Topbar with Search & Actions */}
        <header className="h-[72px] border-b border-[var(--border)] flex items-center justify-between px-6 md:px-8 bg-[var(--bg-card)] flex-shrink-0 gap-4">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 text-[var(--fg)] hover:text-[#4f46e5] transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* Quick Search */}
            <div className="relative hidden sm:block w-64 md:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-dim)]" />
              <input
                type="text"
                placeholder="Search projects & designs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl pl-9 pr-8 py-2 text-xs text-[var(--fg)] placeholder-[var(--fg-dim)] focus:outline-none focus:border-[#4f46e5] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--fg-dim)] hover:text-[var(--fg)]"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <UserMenuDropdown user={user} onSignedOut={() => { window.location.href = '/' }} />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          
          {activeTab === 'projects' && (
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              
              {!activeProject ? (
                <>
                  {/* Hero / Header Section */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                      <h1 className="font-sans font-extrabold text-2xl md:text-3xl text-[var(--fg)] tracking-tight">
                        Projects & Designs
                      </h1>
                      <p className="text-sm text-[var(--fg-dim)] mt-1">
                        Organize 3D space variants across project folders or manage standalone space setups.
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button 
                        onClick={() => handleCreateNewDesign(null)}
                        disabled={designs.length >= 6}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus size={15} /> New Design
                      </button>
                      {projects.length < 2 && (
                        <button 
                          onClick={handleCreateProject} 
                          className="px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] text-[var(--fg)] text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
                        >
                          <FolderPlus size={15} /> New Folder
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Standalone Designs section if any exist */}
                  {filteredStandaloneDesigns.length > 0 && (
                    <div className="mb-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h2 className="font-sans font-bold text-base text-[var(--fg)]">
                            Standalone Designs
                          </h2>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--fg-dim)] font-medium">
                            {designs.filter(d => !d.project_id).length}
                          </span>
                        </div>
                        <span className="text-xs text-[var(--fg-dim)]">{designs.length} / 6 total designs</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {filteredStandaloneDesigns.map((design, i) => (
                          <DesignCard
                            key={design.id}
                            design={design}
                            index={i}
                            onOpen={() => handleOpen(design)}
                            onDeleteRequest={handleDeleteRequest}
                            onRenameRequest={handleRenameRequest}
                            onMoveRequest={setMovingDesign}
                            isMenuOpen={activeMenuId === design.id}
                            onToggleMenu={() => setActiveMenuId(activeMenuId === design.id ? null : design.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project Folders */}
                  {projects.length === 0 && designs.filter(d => !d.project_id).length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 md:p-16 text-center border-2 border-dashed border-[var(--border)] rounded-2xl bg-[var(--bg-card)] mt-6">
                      <div className="w-16 h-16 rounded-2xl mb-4 bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-[#6366f1]">
                        <Sparkles size={30} />
                      </div>
                      <h2 className="font-sans font-bold text-lg text-[var(--fg)] mb-1">Welcome to your 3D Space Studio</h2>
                      <p className="text-xs text-[var(--fg-dim)] max-w-sm mb-6">
                        Create your first standalone design or create a project folder to organize 3D space variants.
                      </p>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleCreateNewDesign(null)} 
                          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md flex items-center gap-2"
                        >
                          <Plus size={16} /> Create First Design
                        </button>
                        <button 
                          onClick={handleCreateProject} 
                          className="px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] text-[var(--fg)] text-xs font-semibold flex items-center gap-2"
                        >
                          <FolderPlus size={16} /> Create Folder
                        </button>
                      </div>
                    </div>
                  ) : filteredProjects.length > 0 ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h2 className="font-sans font-bold text-base text-[var(--fg)]">
                            Project Folders
                          </h2>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--fg-dim)] font-medium">
                            {projects.length} / 2
                          </span>
                        </div>
                        <span className="text-xs text-[var(--fg-dim)]">Max 2 project folders per account</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {filteredProjects.map((project) => (
                          <ProjectFolderCard
                            key={project.id}
                            project={project}
                            designCount={designs.filter(d => d.project_id === project.id).length}
                            onOpen={() => setActiveProject(project)}
                            onDeleteRequest={handleDeleteProjectRequest}
                            onRenameRequest={handleRenameProjectRequest}
                            onNewDesignInProject={() => handleCreateNewDesign(project.id)}
                            isMenuOpen={activeMenuId === project.id}
                            onToggleMenu={() => setActiveMenuId(activeMenuId === project.id ? null : project.id)}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                /* Inside Active Project Folder */
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3.5">
                      <button 
                        onClick={() => setActiveProject(null)} 
                        className="p-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] text-[var(--fg-soft)] transition-colors"
                        title="Back to all projects"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <h1 className="font-sans font-extrabold text-2xl text-[var(--fg)] tracking-tight">
                            {activeProject.name}
                          </h1>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 font-semibold border border-indigo-500/20">
                            Folder
                          </span>
                        </div>
                        <p className="text-xs text-[var(--fg-dim)] mt-0.5">
                          {designs.filter(d => d.project_id === activeProject.id).length} {designs.filter(d => d.project_id === activeProject.id).length === 1 ? 'variant' : 'variants'} designed ({designs.length} / 6 total designs)
                        </p>
                      </div>
                    </div>

                    <div>
                      <button 
                        onClick={handleNewDesign} 
                        disabled={designs.length >= 6} 
                        className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus size={16} /> New Design
                      </button>
                    </div>
                  </div>

                  {filteredActiveProjectDesigns.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 md:p-16 text-center border-2 border-dashed border-[var(--border)] rounded-2xl bg-[var(--bg-card)]">
                      <div className="w-16 h-16 rounded-2xl mb-4 bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-[#6366f1]">
                        <Box size={28} />
                      </div>
                      <h2 className="font-sans font-bold text-base text-[var(--fg)] mb-1">No designs in this folder yet</h2>
                      <p className="text-xs text-[var(--fg-dim)] max-w-sm mb-6">
                        Launch the space wizard to design your first 3D variant in this folder.
                      </p>
                      <button 
                        onClick={handleNewDesign} 
                        disabled={designs.length >= 6}
                        className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus size={16} /> Create Design
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {designs.length < 6 && (
                        <div
                          onClick={handleNewDesign}
                          className="flex flex-col items-center justify-center min-h-[220px] rounded-2xl border-2 border-dashed border-[var(--border)] hover:border-[#6366f1] bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] cursor-pointer transition-all gap-3 group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus size={22} />
                          </div>
                          <span className="font-semibold text-xs text-[var(--fg)] group-hover:text-[#6366f1] transition-colors">
                            Add Another Design (Variant)
                          </span>
                        </div>
                      )}
                      {filteredActiveProjectDesigns.map((design, i) => (
                        <DesignCard
                          key={design.id}
                          design={design}
                          index={i}
                          onOpen={() => handleOpen(design)}
                          onDeleteRequest={handleDeleteRequest}
                          onRenameRequest={handleRenameRequest}
                          onMoveRequest={setMovingDesign}
                          isMenuOpen={activeMenuId === design.id}
                          onToggleMenu={() => setActiveMenuId(activeMenuId === design.id ? null : design.id)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <SettingsTab user={user} onUserUpdate={setUser} />
            </div>
          )}

        </div>
      </main>

      {confirmModalState && (
        <ConfirmModal
          isOpen={confirmModalState.isOpen}
          title={confirmModalState.title}
          message={confirmModalState.message}
          confirmText={confirmModalState.confirmText}
          onConfirm={confirmModalState.onConfirm}
          onCancel={() => setConfirmModalState(null)}
        />
      )}
      
      {promptModalState && (
        <PromptModal
          isOpen={promptModalState.isOpen}
          title={promptModalState.title}
          message={promptModalState.message}
          placeholder={promptModalState.placeholder}
          initialValue={promptModalState.initialValue}
          confirmText={promptModalState.confirmText}
          onConfirm={promptModalState.onConfirm}
          onCancel={() => setPromptModalState(null)}
        />
      )}

      {/* Move Design to Folder / Standalone Dialog */}
      {movingDesign && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-2xl transition-all text-[var(--fg)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FolderInput size={18} className="text-[#6366f1]" />
                <h3 className="font-sans font-bold text-base text-[var(--fg)]">
                  Move "{movingDesign.name}"
                </h3>
              </div>
              <button 
                onClick={() => setMovingDesign(null)} 
                className="p-1 text-[var(--fg-dim)] hover:text-[var(--fg)] rounded-lg hover:bg-[var(--bg-subtle)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-[var(--fg-dim)] mb-5">
              Select a project folder to group this design under, or keep it standalone.
            </p>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {/* Standalone (None) option */}
              {(() => {
                const isCurrent = !movingDesign.project_id
                return (
                  <button
                    onClick={() => handleMoveDesignRequest(movingDesign.id, null)}
                    disabled={isMoving}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                      isCurrent
                        ? 'border-[#6366f1] bg-[#6366f1]/10 text-[#6366f1] font-bold'
                        : 'border-[var(--border)] hover:border-[#6366f1]/40 bg-[var(--bg)] text-[var(--fg)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-emerald-500" />
                      <div>
                        <span className="text-xs font-semibold block text-[var(--fg)]">None (Standalone Design)</span>
                        <span className="text-[11px] text-[var(--fg-dim)]">Direct space not assigned to any folder</span>
                      </div>
                    </div>
                    {isCurrent && <Check size={16} className="text-[#6366f1]" />}
                  </button>
                )
              })()}

              {/* Project Folders */}
              {projects.map(proj => {
                const isCurrent = movingDesign.project_id === proj.id
                const countInProj = designs.filter(d => d.project_id === proj.id).length

                return (
                  <button
                    key={proj.id}
                    onClick={() => handleMoveDesignRequest(movingDesign.id, proj.id)}
                    disabled={isMoving}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                      isCurrent
                        ? 'border-[#6366f1] bg-[#6366f1]/10 text-[#6366f1] font-bold'
                        : 'border-[var(--border)] hover:border-[#6366f1]/40 bg-[var(--bg)] text-[var(--fg)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Folder size={18} className="text-[#6366f1]" />
                      <div>
                        <span className="text-xs font-semibold block text-[var(--fg)]">{proj.name}</span>
                        <span className="text-[11px] text-[var(--fg-dim)]">{countInProj} {countInProj === 1 ? 'design' : 'designs'}</span>
                      </div>
                    </div>
                    {isCurrent && <Check size={16} className="text-[#6366f1]" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
