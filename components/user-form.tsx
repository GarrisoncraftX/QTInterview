"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { AlertCircle, Loader2 } from "lucide-react"
import { userService } from "@/lib/services/user-service"

interface UserFormProps {
  user?: {
    _id: string
    email: string
    role: string
    status: string
  }
  onSuccess: () => void
}

export function UserForm({ user, onSuccess }: UserFormProps) {
  const [email, setEmail] = useState(user?.email || "")
  const [role, setRole] = useState(user?.role || "user")
  const [status, setStatus] = useState(user?.status || "active")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [emailError, setEmailError] = useState("")

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError("Email is required")
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address")
      return false
    }
    setEmailError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail(email)) return

    setLoading(true)
    setError("")

    try {
      if (user) {
        await userService.update(user._id, { email, role, status })
      } else {
        await userService.create({ email, role, status })
      }
      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (emailError) validateEmail(e.target.value)
          }}
          onBlur={(e) => validateEmail(e.target.value)}
          placeholder="user@example.com"
          className={emailError ? "border-destructive focus-visible:ring-destructive" : ""}
          required
        />
        {emailError && (
          <div className="flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{emailError}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger id="role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="moderator">Moderator</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={loading || !!emailError}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>{user ? "Update User" : "Create User"}</>
          )}
        </Button>
      </div>
    </form>
  )
}
