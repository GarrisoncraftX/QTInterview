"use client"

import { useState } from "react"
import { UserTable } from "./user-table"
import { UserForm } from "./user-form"
import { UserChart } from "./user-chart"
import { Button } from "./ui/button"
import { Plus, Download } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"

export function UserManagement() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUserCreated = () => {
    setIsCreateOpen(false)
    setRefreshKey((prev) => prev + 1)
  }

  const handleExportProtobuf = async () => {
    try {
      const response = await fetch("/api/users/export")
      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "users.pb"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error exporting users:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Users Overview</h2>
          <p className="text-sm text-muted-foreground">View and manage all users in the system</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportProtobuf} className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Protobuf
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>Add a new user to the system with cryptographic verification</DialogDescription>
              </DialogHeader>
              <UserForm onSuccess={handleUserCreated} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <UserChart key={`chart-${refreshKey}`} />

      <UserTable key={`table-${refreshKey}`} onUserUpdated={() => setRefreshKey((prev) => prev + 1)} />
    </div>
  )
}
