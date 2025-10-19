import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import { hashEmail, signHash } from "@/lib/crypto"

export async function GET() {
  try {
    await connectDB()
    const users = await User.find().sort({ createdAt: -1 }).lean()

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, role = "user", status = "active" } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    await connectDB()

    const emailHash = hashEmail(email)
    const signature = signHash(emailHash)

    const user = await User.create({
      email,
      role,
      status,
      emailHash,
      signature,
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating user:", error)
    if (error.code === 11000) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
