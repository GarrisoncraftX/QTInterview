"use client"

import { useState } from "react"
import { UserTable } from "./user-table"
import { UserForm } from "./user-form"
import { Button } from "./ui/button"
import { Plus, Download } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { userService } from "@/lib/services/user-service"

export function UsersView() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUserCreated = () => {
    setIsCreateOpen(false)
    setRefreshKey((prev) => prev + 1)
  }

  const handleExportProtobuf = async () => {
    try {
      const buffer = await userService.exportProtobuf()
      userService.downloadProtobuf(buffer)
    } catch (error) {
      console.error("[v0] Error exporting users:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">All Users</h2>
          <p className="text-sm text-muted-foreground">View and manage all verified users in the system</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
          <Button
            variant="outline"
            onClick={handleExportProtobuf}
            className="gap-2 bg-transparent transition-all duration-300 hover:scale-105 w-full sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Export Protobuf
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>Add a new user to the system with cryptographic verification</DialogDescription>
              </DialogHeader>
              <UserForm onSuccess={handleUserCreated} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <UserTable key={`table-${refreshKey}`} onUserUpdated={() => setRefreshKey((prev) => prev + 1)} />
    </div>
  )
}
