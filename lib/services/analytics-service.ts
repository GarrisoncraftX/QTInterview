import { deserializeUsers } from "@/lib/protobuf"
import { cryptoService } from "./crypto-service"

export interface ChartData {
  date: string
  count: number
}

export interface PieChartData {
  name: string
  value: number
}

export interface UserStats {
  verified: number
  unverified: number
  growth: number
  total: number
}

export const analyticsService = {
  async getBarChartData(): Promise<ChartData[]> {
    const response = await fetch("/api/users/stats")
    if (!response.ok) throw new Error("Failed to fetch stats")
    const result = await response.json()

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split("T")[0]
    })

    return last7Days.map((date) => {
      const existing = result.stats.find((s: ChartData) => s.date === date)
      return {
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count: existing?.count || 0,
      }
    })
  },

  async getRoleDistribution(): Promise<PieChartData[]> {
    const response = await fetch("/api/users/export")
    if (!response.ok) throw new Error("Failed to fetch users")

    const buffer = await response.arrayBuffer()
    const usersData = deserializeUsers(Buffer.from(buffer))

    // Properly await verification for each user
    const verificationPromises = usersData.map((u: any) =>
      cryptoService.verifySignature(u.emailHash, u.signature)
    )
    const verificationResults = await Promise.all(verificationPromises)

    const roleCounts = usersData.reduce(
      (acc: Record<string, number>, user: any, index: number) => {
        if (verificationResults[index]) {
          acc[user.role] = (acc[user.role] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(roleCounts).map(([name, value]) => ({ name, value: value as number }))
  },

  async getStatusDistribution(): Promise<PieChartData[]> {
    const response = await fetch("/api/users/export")
    if (!response.ok) throw new Error("Failed to fetch users")

    const buffer = await response.arrayBuffer()
    const usersData = deserializeUsers(Buffer.from(buffer))

    // Properly await verification for each user
    const verificationPromises = usersData.map((u: any) =>
      cryptoService.verifySignature(u.emailHash, u.signature)
    )
    const verificationResults = await Promise.all(verificationPromises)

    const statusCounts: Record<string, number> = {}
    usersData.forEach((user: any, index: number) => {
      const isVerified = verificationResults[index]
      const status = isVerified ? "Verified" : "Unverified"
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })

    return Object.entries(statusCounts).map(([name, value]) => ({ name, value: value as number }))
  },

  async getUserStats(): Promise<UserStats> {
    const response = await fetch("/api/users/export")
    if (!response.ok) throw new Error("Failed to fetch users")

    const buffer = await response.arrayBuffer()
    const usersData = deserializeUsers(Buffer.from(buffer))

    // Properly await verification for each user
    const verificationPromises = usersData.map((u: any) =>
      cryptoService.verifySignature(u.emailHash, u.signature)
    )
    const verificationResults = await Promise.all(verificationPromises)

    const verified = verificationResults.filter(Boolean).length
    const unverified = usersData.length - verified

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentUsers = usersData.filter((u: any, index: number) =>
      verificationResults[index] && new Date(u.createdAt) >= sevenDaysAgo
    )
    const growth = verified > 0 ? Math.round((recentUsers.length / verified) * 100) : 0

    return {
      verified,
      unverified,
      growth,
      total: usersData.length,
    }
  },
}
