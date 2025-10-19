"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { TrendingUp, Users, UserCheck, UserX } from "lucide-react"
import { analyticsService, type ChartData, type PieChartData, type UserStats } from "@/lib/services/analytics-service"

const ROLE_COLORS = ["#8B6F47", "#A0826D", "#B8956A", "#D4A574"]
const STATUS_COLORS = ["#6B8E6F", "#D4A574", "#A67C52"]

export function AnalyticsView() {
  const [barData, setBarData] = useState<ChartData[]>([])
  const [roleData, setRoleData] = useState<PieChartData[]>([])
  const [statusData, setStatusData] = useState<PieChartData[]>([])
  const [stats, setStats] = useState<UserStats>({ verified: 0, unverified: 0, growth: 0, total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const [barChartData, roleDistribution, statusDistribution, userStats] = await Promise.all([
        analyticsService.getBarChartData(),
        analyticsService.getRoleDistribution(),
        analyticsService.getStatusDistribution(),
        analyticsService.getUserStats(),
      ])

      setBarData(barChartData)
      setRoleData(roleDistribution)
      setStatusData(statusDistribution)
      setStats(userStats)
    } catch (error) {
      console.error("[v0] Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-border bg-card p-4 shadow-xl">
          <p className="text-sm font-medium text-foreground">{payload[0].payload.date}</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{payload[0].value}</p>
          <p className="text-xs text-muted-foreground">{payload[0].value === 1 ? "new user" : "new users"}</p>
        </div>
      )
    }
    return null
  }

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-border bg-card p-4 shadow-xl">
          <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
          <p className="mt-2 text-2xl font-semibold text-primary">{payload[0].value}</p>
          <p className="text-xs text-muted-foreground">users</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 rounded-xl bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const statsCards = [
    {
      title: "Total Users",
      value: stats.total,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Verified Users",
      value: stats.verified,
      icon: UserCheck,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Unverified Users",
      value: stats.unverified,
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

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <Card
            key={card.title}
            className="group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{card.value}</p>
                </div>
                <div
                  className={`rounded-xl p-3 ${card.bgColor} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl">User Growth Trend</CardTitle>
          <CardDescription>New users created over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 13 }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 13 }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }} />
              <Bar
                dataKey="count"
                fill="hsl(var(--primary))"
                radius={[12, 12, 0, 0]}
                animationDuration={1000}
                animationBegin={0}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-xl">Role Distribution</CardTitle>
            <CardDescription>User breakdown by role type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleData as any}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={1000}
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "13px", paddingTop: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-xl">Verification Distribution</CardTitle>
            <CardDescription>User breakdown by verification status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData as any}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={1000}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "13px", paddingTop: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
