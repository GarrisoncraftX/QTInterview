"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react"

interface Stats {
  total: number
  active: number
  inactive: number
  growth: number
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, inactive: 0, growth: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch("/api/users")
      const users = await response.json()

      const active = users.filter((u: any) => u.status === "active").length
      const inactive = users.filter((u: any) => u.status !== "active").length

      // Calculate 7-day growth
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const recentUsers = users.filter((u: any) => new Date(u.createdAt) >= sevenDaysAgo)
      const growth = users.length > 0 ? Math.round((recentUsers.length / users.length) * 100) : 0

      setStats({
        total: users.length,
        active,
        inactive,
        growth,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    {
      title: "Total Users",
      value: stats.total,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Users",
      value: stats.active,
      icon: UserCheck,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Inactive Users",
      value: stats.inactive,
      icon: UserX,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
    {
      title: "7-Day Growth",
      value: `${stats.growth}%`,
      icon: TrendingUp,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
  ]

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="group transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{card.value}</p>
              </div>
              <div className={`rounded-lg p-3 ${card.bgColor} transition-transform duration-200 group-hover:scale-110`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
