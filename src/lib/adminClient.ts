export interface AdminUser {
  id: string
  email: string
  name: string | null
  email_verified: number
  created_at: string
  project_count: number
}

// Fetch all users
export async function getAdminUsers(): Promise<AdminUser[]> {
  const res = await fetch(`/api/admin/users`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (!res.ok) {
    const error = await res.json() as any
    throw new Error(error.error || 'Failed to fetch users')
  }

  return res.json()
}

// Delete user by id
export async function deleteAdminUser(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const error = await res.json() as any
    throw new Error(error.error || 'Failed to delete user')
  }

  return true
}
