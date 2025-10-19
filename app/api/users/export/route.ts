import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import { serializeUsers } from "@/lib/protobuf"

export async function GET() {
  try {
    await connectDB()

    // Fetch all users from database
    const users = await User.find().sort({ createdAt: -1 }).lean()

    // Serialize to protobuf format
    const protobufData = serializeUsers(users)

    // Return as binary data with appropriate content type
    return new NextResponse(protobufData, {
      status: 200,
      headers: {
        "Content-Type": "application/x-protobuf",
        "Content-Disposition": "attachment; filename=users.pb",
      },
    })
  } catch (error) {
    console.error("Error exporting users:", error)
    return NextResponse.json({ error: "Failed to export users" }, { status: 500 })
  }
}
