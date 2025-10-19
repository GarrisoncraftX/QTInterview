"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

interface ChartData {
  date: string
  count: number
}

export function UserChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [totalUsers, setTotalUsers] = useState(0)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch("/api/users/stats")
      const result = await response.json()

      // Fill in missing days with 0 count
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return date.toISOString().split("T")[0]
      })

      const filledData = last7Days.map((date) => {
        const existing = result.stats.find((s: ChartData) => s.date === date)
        return {
          date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          count: existing?.count || 0,
        }
      })

      setData(filledData)
      setTotalUsers(result.stats.reduce((sum: number, s: ChartData) => sum + s.count, 0))
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{payload[0].payload.date}</p>
          <p className="mt-1 text-2xl font-semibold text-primary">{payload[0].value}</p>
          <p className="text-xs text-muted-foreground">{payload[0].value === 1 ? "new user" : "new users"}</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <div>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Loading chart data...</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New users created over the last 7 days</CardDescription>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-accent/10 px-4 py-3 transition-all duration-200 hover:bg-accent/20">
            <TrendingUp className="h-5 w-5 text-accent" />
            <div className="text-right">
              <div className="text-2xl font-semibold text-foreground">{totalUsers}</div>
              <div className="text-xs text-muted-foreground">New users</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="date"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }} />
            <Bar
              dataKey="count"
              fill="hsl(var(--primary))"
              radius={[8, 8, 0, 0]}
              animationDuration={800}
              animationBegin={0}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
