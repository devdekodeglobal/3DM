import { clearAssetBlobs } from './customAssetDB'
export const WORKSPACE_OWNER = 'kreatekaro-workspace-owner'
const PRIVATE_KEYS = ['stall-config','stall-elements','user-custom-assets']
export interface WorkspaceScope { owner: string; token: string; ready: boolean }
export function readScope(): WorkspaceScope | null {
  try {
    const value = JSON.parse(localStorage.getItem(WORKSPACE_OWNER) || 'null')
    return value && typeof value.owner === 'string' && typeof value.token === 'string' ? value : null
  } catch { return null }
}
export function isCurrentScope(scope: WorkspaceScope) { const current = readScope(); return current?.ready === true && current.token === scope.token }
export function writeWorkspace(scope: WorkspaceScope, key: string, value: string) {
  if (isCurrentScope(scope)) localStorage.setItem(key, value)
}
export async function prepareWorkspace(userId: string | null, preserveGuest = false): Promise<WorkspaceScope> {
  if (typeof navigator !== 'undefined' && navigator.locks) return navigator.locks.request('kreatekaro-workspace', () => prepareUnlocked(userId, preserveGuest))
  return prepareUnlocked(userId, preserveGuest)
}
async function prepareUnlocked(userId: string | null, preserveGuest = false): Promise<WorkspaceScope> {
  const owner = userId || 'guest'
  const previous = readScope()
  if (previous?.owner === owner && previous.ready) return previous
  const scope = { owner, token: crypto.randomUUID(), ready: false }
  // Invalidate writes in other tabs before beginning asynchronous cleanup.
  localStorage.setItem(WORKSPACE_OWNER, JSON.stringify(scope))
  if (!(preserveGuest && previous?.owner === 'guest' && userId)) {
    for (const key of PRIVATE_KEYS) localStorage.removeItem(key)
    try { await clearAssetBlobs() } catch (error) {
      localStorage.removeItem(WORKSPACE_OWNER)
      throw error
    }
  }
  if (readScope()?.token !== scope.token) throw new Error('Workspace changed in another tab. Please reload.')
  scope.ready = true
  localStorage.setItem(WORKSPACE_OWNER, JSON.stringify(scope))
  return scope
}
