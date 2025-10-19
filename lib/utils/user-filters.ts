import type { User } from "@/lib/services/user-service"

export function filterUsers(users: User[], searchQuery: string, roleFilter: string, statusFilter: string): User[] {
  let filtered = [...users]

  if (searchQuery) {
    filtered = filtered.filter((user) => user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  if (roleFilter !== "all") {
    filtered = filtered.filter((user) => user.role === roleFilter)
  }

  if (statusFilter !== "all") {
    filtered = filtered.filter((user) => user.status === statusFilter)
  }

  return filtered
}

export function paginateUsers(users: User[], page: number, itemsPerPage: number) {
  const indexOfLastItem = page * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(users.length / itemsPerPage)

  return {
    currentUsers,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
  }
}
