import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import { hashEmail, signHash } from "@/lib/crypto"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await connectDB()
    const user = await User.findById(id).lean()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { email, role, status } = body

    await connectDB()

    const currentUser = await User.findById(id)
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (email && email !== currentUser.email) {
      currentUser.emailHash = hashEmail(email)
      currentUser.signature = signHash(currentUser.emailHash)
      currentUser.email = email
    }

    if (role) currentUser.role = role
    if (status) currentUser.status = status

    await currentUser.save()

    return NextResponse.json({ user: currentUser })
  } catch (error: any) {
    console.error("Error updating user:", error)
    if (error.code === 11000) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await connectDB()

    const result = await User.findByIdAndDelete(id)

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
