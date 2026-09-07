import { createFileRoute, redirect } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getCurrentUser } from '../lib/authClient'
import { getAdminUsers, deleteAdminUser, type AdminUser } from '../lib/adminClient'
import { Trash2, Users, AlertCircle, Loader2 } from 'lucide-react'
import { ConfirmModal } from '../components/editor/ConfirmModal'

export const Route = createFileRoute('/sys-control-889')({
  beforeLoad: async () => {
    const user = await getCurrentUser()
    if (!user || (user.email !== 'devdekodeglobal@gmail.com' && user.email !== 'dev.dekodeglobal@gmail.com')) {
      throw redirect({ to: '/' })
    }
  },
  component: AdminPage,
})

function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmModalState, setConfirmModalState] = useState<{ isOpen: boolean; title?: string; message: string; confirmText?: string; onConfirm: () => void } | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const data = await getAdminUsers()
      setUsers(data || [])
    } catch (err: any) {
      console.error('Fetch users error:', err)
      setErrorMsg(err.message || 'Failed to fetch users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = (id: string, email: string) => {
    setConfirmModalState({
      isOpen: true,
      title: 'Delete User',
      message: `Are you sure you want to completely delete ${email}? This will delete all their designs and cannot be undone.`,
      confirmText: 'Delete User',
      onConfirm: async () => {
        setDeletingId(id)
        try {
          await deleteAdminUser(id)
          setUsers(prev => prev.filter(u => u.id !== id))
        } catch (err: any) {
          console.error('Delete error:', err)
          setErrorMsg(err.message || 'Failed to delete user.')
        } finally {
          setDeletingId(null)
          setConfirmModalState(null)
        }
      }
    })
  }

  return (
    <main className="page-wrap px-4 py-12 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3 border-b border-[var(--line)] pb-6">
        <div className="p-3 bg-[var(--brand)]/10 rounded-xl">
          <Users className="w-8 h-8 text-[var(--brand)]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[var(--fg)]">Admin Dashboard</h1>
          <p className="text-[var(--fg-soft)]">Manage registered users and system data.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-bold">{errorMsg}</span>
        </div>
      )}

      <div className="bg-[var(--surface-strong)] border border-[var(--line)] rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-[var(--line)] bg-[var(--bg-base)] flex items-center justify-between">
          <h2 className="font-bold text-[var(--fg)] text-lg">Registered Users ({users.length})</h2>
          <button onClick={fetchUsers} disabled={loading} className="btn btn-secondary text-sm px-4 py-1.5">
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar max-h-[60vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-[var(--fg-soft)]">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--brand)] mb-4" />
              <p>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center p-12 text-[var(--fg-soft)]">No users found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--surface)] text-[var(--fg-dim)] text-xs uppercase tracking-widest sticky top-0 border-b border-[var(--line)] shadow-sm">
                  <th className="p-4 font-bold">Email</th>
                  <th className="p-4 font-bold">Name</th>
                  <th className="p-4 font-bold text-center">Status</th>
                  <th className="p-4 font-bold text-center">Projects</th>
                  <th className="p-4 font-bold">Joined</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-[var(--surface)]/50 transition-colors">
                    <td className="p-4 font-semibold text-[var(--fg)]">{u.email}</td>
                    <td className="p-4 text-[var(--fg-soft)]">{u.name || '-'}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${u.email_verified ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                        {u.email_verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono text-[var(--fg-soft)]">{u.project_count}</td>
                    <td className="p-4 text-sm text-[var(--fg-dim)]">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      {u.email !== 'devdekodeglobal@gmail.com' && (
                        <button
                          onClick={() => handleDelete(u.id, u.email)}
                          disabled={deletingId === u.id}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition disabled:opacity-50"
                          title="Delete user"
                        >
                          {deletingId === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!confirmModalState}
        title={confirmModalState?.title}
        message={confirmModalState?.message || ''}
        confirmText={confirmModalState?.confirmText}
        onConfirm={() => confirmModalState?.onConfirm()}
        onCancel={() => setConfirmModalState(null)}
      />
    </main>
  )
}
