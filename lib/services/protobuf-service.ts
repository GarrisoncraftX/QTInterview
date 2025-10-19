import { deserializeUsers } from "@/lib/protobuf"
import type { User } from "./user-service"
import { cryptoService } from "./crypto-service"

export const protobufService = {
  async loadAndVerifyUsers(): Promise<User[]> {
    const response = await fetch("/api/users/export")
    if (!response.ok) throw new Error("Failed to load users")

    const buffer = await response.arrayBuffer()
    const usersData = deserializeUsers(Buffer.from(buffer))

    const verifiedUsers: User[] = []

    for (const user of usersData) {
      const verified = await cryptoService.verifySignature(user.emailHash, user.signature)

      if (verified) {
        verifiedUsers.push({ ...user, _id: user.id, verified: true })
      } else {
        console.warn("[Security] Invalid signature detected for user:", {
          email: user.email,
          id: user.id,
          emailHash: user.emailHash,
          signature: user.signature,
        })
      }
    }

    return verifiedUsers
  },
}
