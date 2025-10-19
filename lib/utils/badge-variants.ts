export function getRoleBadgeVariant(role: string) {
  switch (role) {
    case "admin":
      return "default"
    case "moderator":
      return "secondary"
    default:
      return "outline"
  }
}

export function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "active":
      return "default"
    case "suspended":
      return "destructive"
    default:
      return "secondary"
  }
}
