import protobuf from "protobufjs"

// Define the protobuf schema programmatically
const root = protobuf.Root.fromJSON({
  nested: {
    user: {
      nested: {
        User: {
          fields: {
            id: { type: "string", id: 1 },
            email: { type: "string", id: 2 },
            role: { type: "string", id: 3 },
            status: { type: "string", id: 4 },
            emailHash: { type: "string", id: 5 },
            signature: { type: "string", id: 6 },
            createdAt: { type: "string", id: 7 },
          },
        },
        UserList: {
          fields: {
            users: { rule: "repeated", type: "User", id: 1 },
          },
        },
      },
    },
  },
})

export const UserMessage = root.lookupType("user.User")
export const UserListMessage = root.lookupType("user.UserList")

export function serializeUsers(users: any[]): Buffer {
  const formattedUsers = users.map((user) => ({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    status: user.status,
    emailHash: user.emailHash,
    signature: user.signature,
    createdAt: user.createdAt.toISOString(),
  }))

  const message = UserListMessage.create({ users: formattedUsers })
  const buffer = UserListMessage.encode(message).finish()
  return Buffer.from(buffer)
}

export function deserializeUsers(buffer: Buffer): any[] {
  const message = UserListMessage.decode(new Uint8Array(buffer))
  const result = UserListMessage.toObject(message, {
    longs: String,
    enums: String,
    bytes: String,
  })
  return result.users || []
}
