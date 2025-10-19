export interface User {
  _id: string
  id?: string
  email: string
  role: string
  status: string
  emailHash: string
  signature: string
  createdAt: string
  verified?: boolean
}

export interface CreateUserData {
  email: string
  role: string
  status: string
}

export interface UpdateUserData extends CreateUserData {}

export const userService = {
  async getAll(): Promise<User[]> {
    const response = await fetch("/api/users")
    if (!response.ok) throw new Error("Failed to fetch users")
    return response.json()
  },

  async create(data: CreateUserData): Promise<User> {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create user")
    }
    return response.json()
  },

  async update(id: string, data: UpdateUserData): Promise<User> {
    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update user")
    }
    return response.json()
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete user")
  },

  async exportProtobuf(): Promise<ArrayBuffer> {
    const response = await fetch("/api/users/export")
    if (!response.ok) throw new Error("Export failed")
    return response.arrayBuffer()
  },

  downloadProtobuf(buffer: ArrayBuffer) {
    const blob = new Blob([buffer], { type: "application/octet-stream" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "users.pb"
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  },
}
