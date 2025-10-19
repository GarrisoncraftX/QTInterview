"use client"

import { Users, BarChart3, Leaf } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface SidebarProps {
  currentView: "users" | "analytics"
  onViewChange: (view: "users" | "analytics") => void
}

export function SidebarComponent({ currentView, onViewChange }: SidebarProps) {
  const navigation = [
    { name: "Users", icon: Users, view: "users" as const },
    { name: "Analytics", icon: BarChart3, view: "analytics" as const },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-sidebar-foreground">Admin Panel</h1>
            <p className="text-xs text-sidebar-foreground/70">Secure & Verified</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    isActive={currentView === item.view}
                    onClick={() => onViewChange(item.view)}
                  >
                    <item.icon />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-4 backdrop-blur-sm">
          <p className="text-xs font-medium text-sidebar-foreground/70">Cryptographically Verified</p>
          <p className="mt-1 text-xs text-sidebar-foreground/50">All users are RSA signed</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
