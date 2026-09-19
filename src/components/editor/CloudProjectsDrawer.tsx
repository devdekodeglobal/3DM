import React, { useEffect, useState } from 'react'
import {
  listDesigns,
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  deleteDesign,
  updateDesign,
  saveDesign,
  type Design,
  type Project
} from '../../lib/authClient'
import {
  X,
  FolderOpen,
  Folder,
  Calendar,
  Trash2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Pencil,
  Check,
  Search,
  ChevronDown,
  ChevronRight,
  FolderPlus,
  MoveRight,
  FileText,
  Plus,
  MoreVertical
} from 'lucide-react'
import { ConfirmModal } from './ConfirmModal'
import { PromptModal } from './PromptModal'

interface CloudProjectsDrawerProps {
  isOpen: boolean
  onClose: () => void
  onLoadProject: (boothConfig: any, elements: any[], designId?: string, designName?: string) => void
  userId: string | null
  onDesignDeleted?: (deleted: { designId?: string | null; projectId?: string | null }) => void
}

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

export const CloudProjectsDrawer: React.FC<CloudProjectsDrawerProps> = ({
  isOpen,
  onClose,
  onLoadProject,
  userId,
  onDesignDeleted
}) => {
  const [designs, setDesigns] = useState<Design[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [collapsedProjects, setCollapsedProjects] = useState<Record<string, boolean>>({})
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  // Close 3-dot menu on outside click or scroll
  useEffect(() => {
    const handleGlobalClick = () => setActiveMenuId(null)
    if (activeMenuId) {
      window.addEventListener('click', handleGlobalClick)
      return () => window.removeEventListener('click', handleGlobalClick)
    }
  }, [activeMenuId])

  // Moving design to project modal/popover state
  const [movingDesign, setMovingDesign] = useState<Design | null>(null)

  // Modals
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean
    title?: string
    message: string
    confirmText?: string
    onConfirm: () => void
  } | null>(null)

  const [promptModalState, setPromptModalState] = useState<{
    isOpen: boolean
    title: string
    placeholder?: string
    initialValue?: string
    confirmText?: string
    onConfirm: (val: string) => void
  } | null>(null)

  const fetchData = async () => {
    if (!userId) return
    setLoading(true)
    setErrorMsg(null)
    try {
      const [pData, dData] = await Promise.all([listProjects(), listDesigns()])
      setProjects(pData || [])
      setDesigns(dData || [])
    } catch (err: any) {
      console.error('Fetch error:', err)
      setErrorMsg(err.message || 'Failed to fetch projects and designs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && userId) {
      fetchData()
    }
  }, [isOpen, userId])

  if (!isOpen) return null

  // Toggle project folder collapse
  const toggleCollapse = (projectId: string) => {
    setCollapsedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }))
  }

  // Create new project
  const handleCreateProject = () => {
    if (projects.length >= 2) {
      setErrorMsg('Limit reached: Maximum 2 projects allowed.')
      return
    }

    setPromptModalState({
      isOpen: true,
      title: 'Create Project',
      placeholder: 'e.g. Summer Expo 2026',
      initialValue: `Project ${projects.length + 1}`,
      confirmText: 'Create Project',
      onConfirm: async (name: string) => {
        try {
          const newProj = await createProject(name.trim(), 'Space designs collection')
          setProjects(prev => [...prev, newProj])
          setPromptModalState(null)
        } catch (err: any) {
          console.error('Failed to create project:', err)
          setErrorMsg(err.message || 'Failed to create project.')
          setPromptModalState(null)
        }
      }
    })
  }

  // Add empty design directly to a project (or as standalone)
  const handleAddEmptyDesign = (targetProjectId: string | null) => {
    if (designs.length >= 6) {
      setErrorMsg('Limit reached: Maximum 6 designs allowed per account.')
      return
    }

    const defaultName = 'Untitled Design'

    setPromptModalState({
      isOpen: true,
      title: targetProjectId ? 'New Design in Project' : 'New Standalone Design',
      placeholder: 'e.g. Space Option A',
      initialValue: defaultName,
      confirmText: 'Create & Open',
      onConfirm: async (name: string) => {
        try {
          const designName = name.trim() || defaultName
          const newDesign = await saveDesign(targetProjectId, designName, null, [])
          setDesigns(prev => [newDesign, ...prev])
          setPromptModalState(null)
          // Open the design in the editor
          onLoadProject(null, [], newDesign.id, newDesign.name)
          if (targetProjectId) {
            localStorage.setItem('current-project-id', targetProjectId)
          } else {
            localStorage.removeItem('current-project-id')
          }
          onClose()
        } catch (err: any) {
          console.error('Failed to create empty design:', err)
          setErrorMsg(err.message || 'Failed to create design.')
          setPromptModalState(null)
        }
      }
    })
  }

  // Rename project
  const handleRenameProject = (project: Project) => {
    setPromptModalState({
      isOpen: true,
      title: 'Rename Project',
      placeholder: 'Project name',
      initialValue: project.name,
      confirmText: 'Rename',
      onConfirm: async (newName: string) => {
        if (!newName.trim()) return
        try {
          const updated = await updateProject(project.id, newName.trim(), project.description || '')
          setProjects(prev => prev.map(p => p.id === project.id ? updated : p))
          setPromptModalState(null)
        } catch (err: any) {
          console.error('Failed to rename project:', err)
          setErrorMsg(err.message || 'Failed to rename project.')
          setPromptModalState(null)
        }
      }
    })
  }

  // Delete project
  const handleDeleteProject = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation()
    setConfirmModalState({
      isOpen: true,
      title: 'Delete Project',
      message: `Are you sure you want to delete "${project.name}"? Designs inside this project will also be deleted. This cannot be undone.`,
      confirmText: 'Delete Project',
      onConfirm: async () => {
        try {
          await deleteProject(project.id)
          setProjects(prev => prev.filter(p => p.id !== project.id))
          setDesigns(prev => prev.filter(d => d.project_id !== project.id))
          if (localStorage.getItem('current-project-id') === project.id) {
            localStorage.removeItem('current-project-id')
          }
          onDesignDeleted?.({ projectId: project.id })
        } catch (err: any) {
          console.error('Delete project error:', err)
          setErrorMsg(err.message || 'Failed to delete project.')
        } finally {
          setConfirmModalState(null)
        }
      }
    })
  }

  // Delete design
  const handleDeleteDesign = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setConfirmModalState({
      isOpen: true,
      title: 'Delete Design',
      message: 'Are you sure you want to delete this cloud design? This cannot be undone.',
      confirmText: 'Delete',
      onConfirm: async () => {
        setDeletingId(id)
        try {
          await deleteDesign(id)
          setDesigns(prev => prev.filter(d => d.id !== id))
          if (localStorage.getItem('current-design-id') === id) {
            localStorage.removeItem('current-design-id')
            localStorage.removeItem('current-design-name')
          }
          onDesignDeleted?.({ designId: id })
        } catch (err: any) {
          console.error('Delete error:', err)
          setErrorMsg(err.message || 'Failed to delete design.')
        } finally {
          setDeletingId(null)
          setConfirmModalState(null)
        }
      }
    })
  }

  // Rename design
  const handleRenameDesign = async (id: string, newName: string) => {
    if (!newName.trim()) { setEditingId(null); return }
    setUpdatingId(id)
    try {
      const target = designs.find(d => d.id === id)
      if (!target) return
      
      const config = typeof target.config === 'string' ? JSON.parse(target.config) : target.config
      const elements = typeof target.elements === 'string' ? JSON.parse(target.elements) : target.elements
      
      await updateDesign(id, { name: newName.trim(), config, elements })
      setDesigns(prev => prev.map(d => d.id === id ? { ...d, name: newName.trim(), updated_at: new Date().toISOString() } : d))
    } catch (err: any) {
      console.error('Rename error:', err)
      setErrorMsg(err.message || 'Failed to rename design.')
    } finally {
      setUpdatingId(null)
      setEditingId(null)
    }
  }

  // Move / assign design to project (or unassign to null)
  const handleMoveDesign = async (designId: string, newProjectId: string | null) => {
    setUpdatingId(designId)
    try {
      const target = designs.find(d => d.id === designId)
      if (!target) return
      
      // No per-project or standalone limit anymore (total 6 limit is maintained, moving between folders does not increase total count)

      await updateDesign(designId, { project_id: newProjectId })
      setDesigns(prev => prev.map(d => d.id === designId ? { ...d, project_id: newProjectId, updated_at: new Date().toISOString() } : d))
      setMovingDesign(null)
    } catch (err: any) {
      console.error('Move design error:', err)
      setErrorMsg(err.message || 'Failed to move design.')
    } finally {
      setUpdatingId(null)
    }
  }

  // Load a design into editor
  const handleSelectDesign = (design: Design) => {
    try {
      let config = design.config;
      while (typeof config === 'string') {
        try { config = JSON.parse(config); } catch { break; }
      }
      let elements = design.elements;
      while (typeof elements === 'string') {
        try { elements = JSON.parse(elements); } catch { break; }
      }
      if (design.project_id) {
        localStorage.setItem('current-project-id', design.project_id)
      } else {
        localStorage.removeItem('current-project-id')
      }
      onLoadProject(config, Array.isArray(elements) ? elements : [], design.id, design.name)
      onClose()
    } catch (e) {
      console.error('Failed to parse design data', e)
      alert('Error loading design data')
    }
  }

  // Filter items by search query
  const q = searchQuery.toLowerCase().trim()
  const filteredDesigns = designs.filter(d => {
    if (!q) return true
    const matchName = d.name.toLowerCase().includes(q)
    const p = projects.find(pr => pr.id === d.project_id)
    const matchProject = p?.name.toLowerCase().includes(q)
    return matchName || matchProject
  })

  // Group into unassigned standalone designs and project-assigned designs
  const standaloneDesigns = filteredDesigns.filter(d => !d.project_id)

  const renderDesignCard = (design: Design) => {
    const isEditing = editingId === design.id
    const isUpdating = updatingId === design.id
    const isMenuOpen = activeMenuId === `design-${design.id}`

    return (
      <div
        key={design.id}
        onClick={() => handleSelectDesign(design)}
        className={`group relative p-4 rounded-xl border border-[var(--border)] dark:border-white/10 bg-[var(--surface-light)] dark:bg-white/[0.04] hover:bg-[var(--bg-card)] dark:hover:bg-white/[0.08] hover:border-[var(--brand)] hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between gap-3.5 min-h-[105px] ${
          isMenuOpen ? 'z-40 ring-2 ring-[var(--brand)]/20' : 'z-0'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          {isEditing ? (
            <div className="flex flex-1 items-center gap-2" onClick={e => e.stopPropagation()}>
              <input
                autoFocus
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleRenameDesign(design.id, editName)
                  if (e.key === 'Escape') setEditingId(null)
                }}
                disabled={isUpdating}
                className="flex-1 bg-[var(--bg-card)] dark:bg-black/60 border border-[var(--brand)] text-[var(--fg)] dark:text-white text-sm px-3 py-1.5 rounded-lg outline-none w-full shadow-inner"
              />
              <button
                onClick={() => handleRenameDesign(design.id, editName)}
                disabled={isUpdating}
                className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition cursor-pointer"
                title="Save name"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setEditingId(null)}
                disabled={isUpdating}
                className="p-2 rounded-lg text-[var(--fg-dim)] hover:bg-[var(--bg-subtle)] dark:hover:bg-white/10 transition cursor-pointer"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[var(--sand)] dark:bg-white/10 border border-[var(--border)] dark:border-white/10 flex items-center justify-center shrink-0 group-hover:border-[var(--brand)] transition-colors">
                  <FileText className="w-5 h-5 text-[var(--fg-soft)] dark:text-white/80 group-hover:text-[var(--brand)] transition-colors" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm text-[var(--fg)] dark:text-white font-[Outfit] group-hover:text-[var(--brand)] transition truncate">
                    {design.name}
                  </span>
                  <span className="text-xs text-[var(--fg-soft)] dark:text-white/70 flex items-center gap-1.5 mt-0.5 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {timeAgo(design.updated_at || design.created_at)}
                  </span>
                </div>
              </div>

              {/* 3-dot Action Menu with labeled dropdown */}
              <div className="relative" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => setActiveMenuId(activeMenuId === `design-${design.id}` ? null : `design-${design.id}`)}
                  title="Design options"
                  className={`p-2 rounded-lg transition cursor-pointer ${
                    activeMenuId === `design-${design.id}`
                      ? 'bg-[var(--sand)] text-[var(--brand)] shadow-xs'
                      : 'text-[var(--fg-soft)] dark:text-white/70 hover:text-[var(--fg)] dark:hover:text-white hover:bg-[var(--sand)] dark:hover:bg-white/10'
                  }`}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {activeMenuId === `design-${design.id}` && (
                  <div 
                    className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border border-[var(--border)] dark:border-white/10 bg-[var(--bg-card)] dark:bg-[#181a1d] shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col"
                    style={{ boxShadow: '0 12px 36px rgba(0,0,0,0.28)' }}
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        setActiveMenuId(null)
                        setMovingDesign(design)
                      }}
                      className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-[var(--sea-ink)] dark:text-white/90 hover:bg-[var(--sand)] dark:hover:bg-white/5 hover:text-[var(--brand)] transition text-left cursor-pointer"
                    >
                      <MoveRight className="w-4 h-4 text-[var(--sea-ink-soft)] dark:text-white/50" />
                      <span>Move to project</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveMenuId(null)
                        setEditingId(design.id)
                        setEditName(design.name)
                      }}
                      className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-[var(--sea-ink)] dark:text-white/90 hover:bg-[var(--sand)] dark:hover:bg-white/5 hover:text-[var(--brand)] transition text-left cursor-pointer"
                    >
                      <Pencil className="w-4 h-4 text-[var(--sea-ink-soft)] dark:text-white/50" />
                      <span>Rename</span>
                    </button>

                    <div className="h-[1px] bg-[var(--border)]/60 dark:bg-white/5 mx-2 my-1" />

                    <button
                      disabled={deletingId === design.id}
                      onClick={(e) => {
                        setActiveMenuId(null)
                        handleDeleteDesign(design.id, e)
                      }}
                      className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition text-left cursor-pointer disabled:opacity-50"
                    >
                      {deletingId === design.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]/40 dark:border-white/5 text-xs font-medium">
          <span className="text-[var(--brand)] font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Open in Editor &rarr;
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl border border-[var(--border)] dark:border-white/15 bg-[var(--bg-card)] dark:bg-[#121417] backdrop-blur-2xl shadow-2xl flex flex-col transition-all text-[var(--fg)] dark:text-white"
        style={{ boxShadow: '0 20px 60px 0 rgba(0, 0, 0, 0.5)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow Orbs */}
        <div className="absolute -top-24 -left-24 -z-10 h-56 w-56 rounded-full bg-[var(--brand)] opacity-10 dark:opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 -z-10 h-56 w-56 rounded-full bg-[var(--accent)] opacity-10 dark:opacity-20 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="px-8 py-6 border-b border-[var(--border)] dark:border-white/10 flex items-center justify-between bg-[var(--bg-subtle)]/40 dark:bg-transparent">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[var(--sand)] dark:bg-white/10 border border-[var(--border)] dark:border-white/10 text-[var(--brand)]">
              <FolderOpen className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold font-[Outfit] text-[var(--fg)] dark:text-white tracking-wide uppercase">
                Projects & Designs
              </h2>
              <p className="text-sm text-[var(--fg-soft)] dark:text-white/80 font-medium mt-0.5">
                Manage your projects and designs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Create Project Button */}
            <button
              onClick={handleCreateProject}
              disabled={projects.length >= 2}
              title={projects.length >= 2 ? 'Maximum of 2 projects reached' : 'Create new project'}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <FolderPlus className="w-4 h-4 text-white" />
              <span className="text-white">New Project</span>
            </button>
            <button
              onClick={fetchData}
              title="Refresh list"
              disabled={loading}
              className="p-2.5 rounded-xl text-[var(--fg)] dark:text-white/80 hover:text-[var(--brand)] dark:hover:text-white hover:bg-[var(--bg-subtle)] dark:hover:bg-white/10 transition disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={onClose}
              className="p-2.5 rounded-xl text-[var(--fg)] dark:text-white/80 hover:text-[var(--brand)] dark:hover:text-white hover:bg-[var(--bg-subtle)] dark:hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3.5 border-b border-[var(--border)] dark:border-white/10 bg-[var(--bg-subtle)]/20 dark:bg-white/[0.02]">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[var(--fg-dim)] dark:text-white/40 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search projects and designs..."
              className="w-full bg-[var(--surface-light)] dark:bg-white/5 border border-[var(--border)] dark:border-white/10 rounded-xl pl-10 pr-9 py-2.5 text-sm text-[var(--fg)] dark:text-white placeholder-[var(--fg-dim)] dark:placeholder-white/40 outline-none focus:border-[var(--brand)] transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 text-[var(--fg-dim)] dark:text-white/40 hover:text-[var(--fg)] dark:hover:text-white rounded"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 custom-scrollbar pb-28">
          {errorMsg && (
            <div className="flex items-start justify-between gap-2 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs p-3 rounded-lg animate-in fade-in">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
              <button onClick={() => setErrorMsg(null)} className="p-0.5 hover:text-red-600 dark:hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {loading && designs.length === 0 && projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[var(--fg-dim)] dark:text-white/50">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--brand)] mb-2" />
              <span className="text-xs">Loading projects and designs...</span>
            </div>
          ) : designs.length === 0 && projects.length === 0 ? (
            <div className="text-center py-16 px-4 text-[var(--fg-dim)] dark:text-white/50">
              <FolderOpen className="w-12 h-12 stroke-[1.2] mx-auto text-[var(--fg-dim)]/40 dark:text-white/20 mb-3" />
              <p className="text-sm font-bold text-[var(--fg)] dark:text-white">No designs or projects yet</p>
              <p className="text-xs mt-1 max-w-[280px] mx-auto leading-relaxed">
                Start drawing in the editor and click "Save" to keep your work safe. You can also create projects to organize them.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  onClick={() => handleAddEmptyDesign(null)}
                  className="px-3.5 py-2 bg-[var(--sand)] hover:bg-[var(--line)] text-[var(--sea-ink)] text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer border border-[var(--border)]"
                >
                  <Plus className="w-4 h-4" />
                  New Empty Design
                </button>
                <button
                  onClick={handleCreateProject}
                  className="px-3.5 py-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <FolderPlus className="w-4 h-4 text-white" />
                  <span className="text-white">Create Project</span>
                </button>
              </div>
            </div>
          ) : filteredDesigns.length === 0 && (!projects.length || !projects.some(p => p.name.toLowerCase().includes(q))) ? (
            <div className="text-center py-12 px-4 text-[var(--fg-dim)] dark:text-white/50">
              <Search className="w-8 h-8 mx-auto text-[var(--fg-dim)]/40 dark:text-white/20 mb-2" />
              <p className="text-xs font-bold text-[var(--fg)] dark:text-white">No matches found</p>
              <p className="text-[11px] text-[var(--fg-dim)] dark:text-white/40 mt-1">No projects or designs match "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-3 px-3 py-1.5 bg-[var(--bg-subtle)] dark:bg-white/10 hover:bg-[var(--border)] dark:hover:bg-white/15 text-[var(--fg)] dark:text-white text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                Clear search
              </button>
            </div>
          ) : (
            <>
              {/* Standalone / Unassigned Designs Section */}
              <div className={`space-y-3.5 relative ${standaloneDesigns.some(d => activeMenuId === `design-${d.id}`) ? 'z-30' : 'z-10'}`}>
                <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border)] dark:border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-[var(--fg)] dark:text-white tracking-wider uppercase font-[Outfit]">
                      Standalone Designs
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--sand)] dark:bg-white/10 text-[var(--fg-soft)] dark:text-white font-bold">
                      {standaloneDesigns.length} {standaloneDesigns.length === 1 ? 'design' : 'designs'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddEmptyDesign(null)}
                    disabled={designs.length >= 6}
                    title={designs.length >= 6 ? 'Total account limit of 6 designs reached' : 'Create empty standalone design'}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[var(--brand)] hover:bg-[var(--brand)]/10 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Design</span>
                  </button>
                </div>

                {standaloneDesigns.length === 0 ? (
                  <div className="p-5 rounded-xl border border-dashed border-[var(--border)] dark:border-white/10 text-center text-sm text-[var(--fg-dim)] dark:text-white/50">
                    No standalone designs. Click <strong className="text-[var(--brand)] cursor-pointer" onClick={() => handleAddEmptyDesign(null)}>+ New Design</strong> to start one.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {standaloneDesigns.map(design => renderDesignCard(design))}
                  </div>
                )}
              </div>

              {/* Projects */}
              {projects.map(project => {
                const projectDesigns = filteredDesigns.filter(d => d.project_id === project.id)
                const isCollapsed = !!collapsedProjects[project.id]
                const isMenuInThisProject = activeMenuId === `project-${project.id}` || projectDesigns.some(d => activeMenuId === `design-${d.id}`)

                return (
                  <div 
                    key={project.id} 
                    className={`rounded-2xl border border-[var(--border)] dark:border-white/10 bg-[var(--surface-light)]/40 dark:bg-white/[0.02] shadow-xs relative ${
                      isMenuInThisProject ? 'z-30' : 'z-0'
                    }`}
                  >
                    {/* Project Header */}
                    <div
                      onClick={() => toggleCollapse(project.id)}
                      className={`p-4 flex items-center justify-between bg-[var(--sand)]/50 dark:bg-white/5 hover:bg-[var(--sand)] dark:hover:bg-white/10 transition cursor-pointer select-none ${
                        isCollapsed ? 'rounded-2xl' : 'rounded-t-2xl'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {isCollapsed ? (
                          <ChevronRight className="w-5 h-5 text-[var(--sea-ink-soft)] dark:text-white/50 shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[var(--sea-ink-soft)] dark:text-white/50 shrink-0" />
                        )}
                        <div className="w-8 h-8 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center shrink-0">
                          <Folder className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-bold text-sm text-[var(--fg)] dark:text-white font-[Outfit] truncate">
                            {project.name}
                          </span>
                          <span className="text-xs text-[var(--fg-soft)] dark:text-white/80 font-bold shrink-0 bg-[var(--sand)] dark:bg-white/10 px-2.5 py-0.5 rounded-md">
                            {projectDesigns.length} {projectDesigns.length === 1 ? 'design' : 'designs'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        {/* Add empty design to this project */}
                        <button
                          onClick={() => handleAddEmptyDesign(project.id)}
                          disabled={designs.length >= 6}
                          title={designs.length >= 6 ? 'Total account limit of 6 designs reached' : 'Create design in this project'}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[var(--brand)] hover:bg-[var(--brand)]/10 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Design</span>
                        </button>

                        {/* 3-dot Action Menu for project */}
                        <div className="relative" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === `project-${project.id}` ? null : `project-${project.id}`)}
                            title="Project options"
                            className={`p-2 rounded-lg transition cursor-pointer ${
                              activeMenuId === `project-${project.id}`
                                ? 'bg-[var(--surface-light)] text-[var(--brand)] shadow-xs'
                                : 'text-[var(--sea-ink-soft)] dark:text-white/40 hover:text-[var(--sea-ink)] dark:hover:text-white hover:bg-[var(--surface-light)] dark:hover:bg-white/10'
                            }`}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Dropdown Menu */}
                          {activeMenuId === `project-${project.id}` && (
                            <div 
                              className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-[var(--border)] dark:border-white/10 bg-[var(--bg-card)] dark:bg-[#181a1d] shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col"
                              style={{ boxShadow: '0 12px 36px rgba(0,0,0,0.28)' }}
                              onClick={e => e.stopPropagation()}
                            >
                              <button
                                onClick={() => {
                                  setActiveMenuId(null)
                                  handleRenameProject(project)
                                }}
                                className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-[var(--sea-ink)] dark:text-white/90 hover:bg-[var(--sand)] dark:hover:bg-white/5 hover:text-[var(--brand)] transition text-left cursor-pointer"
                              >
                                <Pencil className="w-4 h-4 text-[var(--sea-ink-soft)] dark:text-white/50" />
                                <span>Rename</span>
                              </button>

                              <div className="h-[1px] bg-[var(--border)]/60 dark:bg-white/5 mx-2 my-1" />

                              <button
                                onClick={(e) => {
                                  setActiveMenuId(null)
                                  handleDeleteProject(project, e)
                                }}
                                className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition text-left cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Designs inside this project */}
                    {!isCollapsed && (
                      <div className="p-4 border-t border-[var(--border)] dark:border-white/5 rounded-b-2xl">
                        {projectDesigns.length === 0 ? (
                          <div className="py-7 text-center text-[var(--fg-dim)] dark:text-white/50 text-sm">
                            <p>This project is empty.</p>
                            <button
                              onClick={() => handleAddEmptyDesign(project.id)}
                              className="mt-2 text-sm font-bold text-[var(--brand)] hover:underline cursor-pointer"
                            >
                              + Add Empty Design
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {projectDesigns.map(design => renderDesignCard(design))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </>
          )}
        </div>

        {/* Footer info & stats */}
        <div className="px-8 py-4 border-t border-[var(--border)] dark:border-white/10 bg-[var(--bg-subtle)]/40 dark:bg-white/5 flex items-center justify-between text-xs text-[var(--fg-soft)] dark:text-white/80 font-semibold">
          <span>{projects.length} / 2 Projects</span>
          <span>{designs.length} / 6 Total Designs</span>
        </div>
      </div>

      {/* Move / Assign to Project Modal */}
      {movingDesign && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setMovingDesign(null)}>
          <div
            className="w-full max-w-sm rounded-2xl border border-[var(--border)] dark:border-white/10 bg-[var(--bg-card)] dark:bg-[#16181d] p-5 shadow-2xl text-[var(--fg)] dark:text-white space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-[Outfit]">Move "{movingDesign.name}"</h3>
              <button onClick={() => setMovingDesign(null)} className="p-1 text-[var(--fg-dim)] dark:text-white/40 hover:text-[var(--fg)] dark:hover:text-white rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[var(--fg-soft)] dark:text-white/60">
              Select a project to group this design under, or keep it standalone.
            </p>

            <div className="space-y-2">
              {/* None (No Project / Standalone) option */}
              {(() => {
                const isCurrent = !movingDesign.project_id
                return (
                  <button
                    onClick={() => handleMoveDesign(movingDesign.id, null)}
                    disabled={updatingId === movingDesign.id}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                      isCurrent
                        ? 'border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)] font-bold'
                        : 'border-[var(--border)] dark:border-white/10 hover:border-[var(--brand)]/40 bg-[var(--surface-light)] dark:bg-white/5 text-[var(--fg)] dark:text-white/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                      <span className="text-xs">None (Standalone)</span>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-[var(--brand)]" />}
                  </button>
                )
              })()}

              {/* Projects options */}
              {projects.map(proj => {
                const isCurrent = movingDesign.project_id === proj.id
                const countInProj = designs.filter(d => d.project_id === proj.id).length

                return (
                  <button
                    key={proj.id}
                    onClick={() => handleMoveDesign(movingDesign.id, proj.id)}
                    disabled={updatingId === movingDesign.id}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                      isCurrent
                        ? 'border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)] font-bold'
                        : 'border-[var(--border)] dark:border-white/10 hover:border-[var(--brand)]/40 bg-[var(--surface-light)] dark:bg-white/5 text-[var(--fg)] dark:text-white/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Folder className="w-4 h-4 text-[var(--brand)]" />
                      <div>
                        <span className="text-xs font-bold block text-[var(--fg)] dark:text-white">{proj.name}</span>
                        <span className="text-[10px] text-[var(--fg-dim)] dark:text-white/40">{countInProj} {countInProj === 1 ? 'design' : 'designs'}</span>
                      </div>
                    </div>
                    {isCurrent && (
                      <Check className="w-4 h-4 text-[var(--brand)]" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation & Prompt Modals */}
      <ConfirmModal
        isOpen={!!confirmModalState}
        title={confirmModalState?.title}
        message={confirmModalState?.message || ''}
        confirmText={confirmModalState?.confirmText}
        onConfirm={() => confirmModalState?.onConfirm()}
        onCancel={() => setConfirmModalState(null)}
      />

      <PromptModal
        isOpen={!!promptModalState}
        title={promptModalState?.title || ''}
        placeholder={promptModalState?.placeholder}
        initialValue={promptModalState?.initialValue}
        confirmText={promptModalState?.confirmText}
        onConfirm={val => promptModalState?.onConfirm(val)}
        onCancel={() => setPromptModalState(null)}
      />
    </div>
  )
}
