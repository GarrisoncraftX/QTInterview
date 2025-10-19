"use client"

import { useState } from "react"
import { SidebarComponent } from "@/components/sidebar"
import { UsersView } from "@/components/users-view"
import { AnalyticsView } from "@/components/analytics-view"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  const [currentView, setCurrentView] = useState<"users" | "analytics">("users")

  return (
    <>
      <SidebarComponent currentView={currentView} onViewChange={setCurrentView} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {currentView === "users" ? "User Management" : "Analytics Dashboard"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {currentView === "users"
                ? "Manage users with cryptographic verification and Protobuf serialization"
                : "Visualize user data with interactive charts and insights"}
            </p>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
          {currentView === "users" ? <UsersView /> : <AnalyticsView />}
        </div>
      </SidebarInset>
    </>
  )
}
