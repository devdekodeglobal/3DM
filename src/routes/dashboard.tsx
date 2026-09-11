import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getCurrentUser, listDesigns, listProjects, createProject, updateProject, deleteProject, deleteDesign, updateDesign, signOut, changePassword, deleteAccount, saveDesign, type User, type Design, type Project } from '../lib/authClient'
import { PlusCircle, Trash2, Calendar, LayoutGrid, Loader2, Box, Pencil, Check, X, Settings, LogOut, ShieldAlert, Key, Menu, ChevronLeft, ChevronRight } from 'lucide-react'
import { ConfirmModal } from '../components/editor/ConfirmModal'
import { PromptModal } from '../components/editor/PromptModal'
import { AnimatedHeaderLogo } from '../components/AnimatedHeaderLogo'
import ThemeToggle from '../components/ThemeToggle'

export const Route = createFileRoute('/dashboard')({ component: DashboardPage })

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

function DesignCard({ design, index, onOpen, onDeleteRequest, onRenameRequest }: {
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
            title="Delete design"
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
            <button onClick={() => { if (editName.trim()) onRenameRequest(design.id, editName.trim()); setIsEditing(false) }} style={{ color: 'var(--brand)' }}>
              <Check size={16} />
            </button>
            <button onClick={() => setIsEditing(false)} style={{ color: 'var(--fg-dim)' }}>
              <X size={16} />
            </button>
          </div>
        ) : (
          <h3 style={{ margin: '0 0 6px', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: 'var(--fg)' }}>
            {design.name}
          </h3>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--fg-dim)', fontSize: '0.75rem' }}>
          <Calendar size={11} />
          <span>{timeAgo(design.updated_at || design.created_at)}</span>
        </div>
      </div>
    </div>
  )
}

function ProjectFolderCard({ project, onOpen, onDeleteRequest, onRenameRequest }: { project: Project; onOpen: () => void; onDeleteRequest: (id: string, name: string) => void; onRenameRequest: (id: string, name: string) => void }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(project.name)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDeleteRequest(project.id, project.name)
  }

  return (
    <div
      onClick={onOpen}
      className="group relative"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: 24,
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-4px)'
        el.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)'
        el.style.borderColor = 'var(--border-brand)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
        el.style.borderColor = 'var(--border)'
      }}
    >
      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6 }} className="group-hover:opacity-100 opacity-0 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); setIsEditing(true); setEditName(project.name); }}
          style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--fg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          title="Edit project name"
        >
          <Pencil size={12} />
        </button>
        <button
          onClick={handleDelete}
          style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--fg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          title="Delete project"
        >
          <Trash2 size={12} />
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <LayoutGrid size={24} color="var(--brand)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {isEditing ? (
            <div style={{ display: 'flex', gap: 6, marginBottom: 4 }} onClick={e => e.stopPropagation()}>
              <input 
                autoFocus value={editName} onChange={e => setEditName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); if (editName.trim()) { onRenameRequest(project.id, editName.trim()); } setIsEditing(false); }
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                style={{ flex: 1, background: 'var(--surface-strong)', border: '1px solid var(--brand)', color: 'white', fontSize: '0.9rem', borderRadius: 4, padding: '2px 6px', outline: 'none', width: '100%' }}
              />
              <button onClick={() => { if (editName.trim()) onRenameRequest(project.id, editName.trim()); setIsEditing(false) }} style={{ color: 'var(--brand)' }}><Check size={16} /></button>
              <button onClick={() => setIsEditing(false)} style={{ color: 'var(--fg-dim)' }}><X size={16} /></button>
            </div>
          ) : (
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'Outfit, sans-serif', color: 'var(--fg)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.name}</h3>
          )}
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--fg-dim)' }}>
            Created {timeAgo(project.created_at)}
          </p>
        </div>
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

function SettingsTab({ user }: { user: User }) {
  const navigate = useNavigate()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwdMsg, setPwdMsg] = useState<{ text: string, type: 'error' | 'success' } | null>(null)
  
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean; title?: string; message: string; confirmText?: string; onConfirm: () => void
  } | null>(null)

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
      <h2 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', color: 'var(--fg)', marginBottom: 8, marginTop: 0 }}>Profile Settings</h2>
      <p style={{ color: 'var(--fg-soft)', marginBottom: 40 }}>Manage your personal details, security, and account preferences.</p>

      {/* Profile Details */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 32 }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', color: 'var(--fg)', fontWeight: 600 }}>Personal Details</h3>
        <div style={{ display: 'grid', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--fg-dim)', marginBottom: 6 }}>Full Name</label>
            <div style={{ background: 'var(--bg)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', color: 'var(--fg)', fontSize: '0.95rem' }}>
              {user.name || 'Not provided'}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--fg-dim)', marginBottom: 6 }}>Email Address</label>
            <div style={{ background: 'var(--bg)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', color: 'var(--fg)', fontSize: '0.95rem' }}>
              {user.email}
            </div>
          </div>
        </div>
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
          <ShieldAlert size={18} /> Danger Zone
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
  const [user, setUser] = useState<User | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [designs, setDesigns] = useState<Design[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'projects' | 'settings'>('projects')
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth > 768 : true)

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
      placeholder: 'e.g. CES 2027 Booth',
      initialValue: `Project ${projects.length + 1}`,
      confirmText: 'Create Project',
      onConfirm: async (name: string) => {
        try {
          const newProject = await createProject(name, 'Event Booth Designs')
          setProjects(prev => [...prev, newProject])
          setActiveProject(newProject)
        } catch (err) {
          console.error("Failed to create project", err)
          alert("Failed to create project. Limit of 2 projects may be reached.")
        }
      }
    })
  }

  const handleNewDesign = () => {
    if (!activeProject) return
    if (designs.filter(d => d.project_id === activeProject.id).length >= 2) {
      alert("You have reached the maximum of 2 designs for this project.")
      return
    }
    
    setPromptModalState({
      isOpen: true,
      title: 'Name Design',
      placeholder: 'e.g. 10x10 Island with Demo area',
      initialValue: `Design ${designs.filter(d => d.project_id === activeProject.id).length + 1}`,
      confirmText: 'Start Designing',
      onConfirm: async (name: string) => {
        try {
          const newDesign = await saveDesign(activeProject.id, name, null, [])
          localStorage.removeItem('stall-config')
          localStorage.setItem('stall-elements', '[]')
          localStorage.setItem('current-design-id', newDesign.id)
          localStorage.setItem('current-design-name', name)
          localStorage.setItem('current-project-id', activeProject.id)
          navigate({ to: '/editor' })
        } catch (err) {
          console.error("Failed to create blank design", err)
          alert("Failed to create design in the cloud.")
        }
      }
    })
  }

  if (loading || !user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--brand)' }} />
      </div>
    )
  }

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
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`hidden md:flex absolute -right-4 top-6 w-8 h-8 bg-[var(--bg-card)] border border-[var(--border)] rounded-full items-center justify-center text-[var(--fg-soft)] hover:text-[var(--brand)] hover:border-[var(--brand)] transition-all z-50 shadow-sm ${
            !sidebarOpen ? 'translate-x-4' : ''
          }`}
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>

        {/* Inner Content Wrapper */}
        <div className="w-[260px] h-full flex flex-col overflow-hidden transition-opacity duration-300" style={{ opacity: sidebarOpen ? 1 : 0, pointerEvents: sidebarOpen ? 'auto' : 'none', padding: '24px 0' }}>
          <div style={{ padding: '0 24px', marginBottom: 40 }}>
            <AnimatedHeaderLogo />
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 16px' }}>
            <button 
              onClick={() => { setActiveTab('projects'); if (window.innerWidth <= 768) setSidebarOpen(false) }}
              style={{ 
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10,
                background: activeTab === 'projects' ? 'var(--bg-subtle)' : 'transparent',
                color: activeTab === 'projects' ? 'var(--brand)' : 'var(--fg-soft)',
                fontWeight: activeTab === 'projects' ? 600 : 500, border: 'none', cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s', textAlign: 'left', fontSize: '0.95rem'
              }}
            >
              <LayoutGrid size={18} /> My Projects
            </button>
            
            <button 
              onClick={() => { setActiveTab('settings'); if (window.innerWidth <= 768) setSidebarOpen(false) }}
              style={{ 
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10,
                background: activeTab === 'settings' ? 'var(--bg-subtle)' : 'transparent',
                color: activeTab === 'settings' ? 'var(--brand)' : 'var(--fg-soft)',
                fontWeight: activeTab === 'settings' ? 600 : 500, border: 'none', cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s', textAlign: 'left', fontSize: '0.95rem'
              }}
            >
              <Settings size={18} /> Profile Settings
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
                  {user.name || 'User'}
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
        
        {/* Topbar */}
        <header className="h-[72px] border-b border-[var(--border)] flex items-center justify-between md:justify-end px-6 md:px-8 bg-[var(--bg-card)] flex-shrink-0">
          <button 
            className="md:hidden p-2 text-[var(--fg)] hover:text-[var(--brand)] transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={26} />
          </button>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-[var(--bg-card)] rounded-full border border-[var(--border)] shadow-sm">
              <button onClick={() => { setActiveTab('settings'); if (window.innerWidth <= 768) setSidebarOpen(false); }} className="transition hover:opacity-80 flex-shrink-0" title="Profile Settings">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--lagoon)] to-[var(--brand)] text-white flex items-center justify-center text-xs font-bold shadow-inner">
                  {getInitials(user)}
                </div>
              </button>
              <div className="w-[1px] h-4 bg-[var(--border)] mx-0.5"></div>
              <button
                onClick={async () => { await signOut(); window.location.href = '/' }}
                className="p-1.5 mr-1 text-[var(--fg-soft)] hover:text-red-500 hover:bg-red-500/10 rounded-full transition"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          
          {activeTab === 'projects' && (
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              
              {!activeProject ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
                    <div>
                      <h1 style={{ margin: '0 0 8px', fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800, color: 'var(--fg)' }}>
                        My Projects
                      </h1>
                      <p style={{ margin: 0, color: 'var(--fg-dim)', fontSize: '0.95rem' }}>
                        Manage your overarching event projects (Max 2 projects).
                      </p>
                    </div>
                    {projects.length < 2 && (
                      <button onClick={handleCreateProject} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <PlusCircle size={16} /> Create Project
                      </button>
                    )}
                  </div>

                  {projects.length === 0 ? (
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
                        <LayoutGrid size={28} color="var(--brand)" />
                      </div>
                      <h2 style={{ margin: '0 0 8px', fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.2rem', color: 'var(--fg)' }}>No projects yet</h2>
                      <p style={{ margin: '0 0 24px', color: 'var(--fg-dim)', fontSize: '0.9rem', maxWidth: 320 }}>
                        Create a project to start organizing your booth design variants.
                      </p>
                      <button onClick={handleCreateProject} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <PlusCircle size={16} /> Create First Project
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                      {projects.map((project) => (
                        <ProjectFolderCard
                          key={project.id}
                          project={project}
                          onOpen={() => setActiveProject(project)}
                          onDeleteRequest={handleDeleteProjectRequest}
                          onRenameRequest={handleRenameProjectRequest}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                    <button 
                      onClick={() => setActiveProject(null)} 
                      style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: 8, color: 'var(--fg-soft)', cursor: 'pointer' }}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div>
                      <h1 style={{ margin: '0 0 4px', fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: 'var(--fg)' }}>
                        {activeProject.name}
                      </h1>
                      <p style={{ margin: 0, color: 'var(--fg-dim)', fontSize: '0.9rem' }}>
                        {designs.filter(d => d.project_id === activeProject.id).length} / 2 Designs
                      </p>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                      <button onClick={handleNewDesign} disabled={designs.filter(d => d.project_id === activeProject.id).length >= 2} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: designs.filter(d => d.project_id === activeProject.id).length >= 2 ? 0.5 : 1 }}>
                        <PlusCircle size={16} /> New Design
                      </button>
                    </div>
                  </div>

                  {designs.filter(d => d.project_id === activeProject.id).length === 0 ? (
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
                      <h2 style={{ margin: '0 0 8px', fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.2rem', color: 'var(--fg)' }}>No designs in this project</h2>
                      <p style={{ margin: '0 0 24px', color: 'var(--fg-dim)', fontSize: '0.9rem', maxWidth: 320 }}>
                        Start designing your booth variants. You can create up to 2 variants.
                      </p>
                      <button onClick={handleNewDesign} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <PlusCircle size={16} /> Create Design
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 24 }}>
                      <div
                        onClick={handleNewDesign}
                        style={{
                          border: '1px dashed var(--border-brand)', borderRadius: 16, cursor: designs.filter(d => d.project_id === activeProject.id).length >= 2 ? 'not-allowed' : 'pointer',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          minHeight: 220, gap: 12, background: 'transparent', transition: 'background 0.2s',
                          opacity: designs.filter(d => d.project_id === activeProject.id).length >= 2 ? 0.5 : 1
                        }}
                      >
                        <PlusCircle size={32} color="var(--brand)" />
                        <span style={{ fontFamily: 'Outfit', fontWeight: 600, color: 'var(--brand)', fontSize: '1rem' }}>New Design</span>
                      </div>
                      {designs.filter(d => d.project_id === activeProject.id).map((design, i) => (
                        <DesignCard
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
                </>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <SettingsTab user={user} />
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
    </div>
  )
}
