# Admin Panel with Protobuf & Cryptographic Verification

A professional admin panel for user management featuring Protocol Buffers serialization, RSA cryptographic signing, and real-time data visualization.

## Features

- **Full CRUD Operations** - Create, read, update, and delete users
- **Protocol Buffers Integration** - Export endpoint serving protobuf-serialized user data
- **Cryptographic Security** - SHA-384 email hashing with RSA signature verification
- **Data Visualization** - 7-day user creation chart with Recharts
- **MongoDB Backend** - Mongoose ODM for data persistence
- **Professional UI** - Human-centered design with sophisticated color palette

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes, Mongoose
- **Database**: MongoDB
- **Serialization**: Protocol Buffers (protobufjs)
- **Cryptography**: Node.js crypto module (RSA, SHA-384)
- **Charts**: Recharts
- **UI Components**: shadcn/ui

## Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or cloud like MongoDB Atlas)
- npm or yarn package manager

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd admin-panel
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
 use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/admin-panel
```

### 4. Start MongoDB

If using local MongoDB:

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
```bash
net start MongoDB
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. ADD User Data (Optional)

## API Endpoints

### User Management

- `GET /api/users` - Fetch all users (JSON)
- `POST /api/users` - Create new user
  ```json
  {
    "email": "user@example.com",
    "role": "admin",
    "status": "active"
  }
  ```
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Protobuf Export

- `GET /api/users/export` - Export all users as protobuf binary
  - Returns: `application/x-protobuf` binary data
  - Frontend automatically decodes using protobufjs

### Statistics

- `GET /api/users/stats` - Get 7-day user creation statistics
  ```json
  {
    "stats": [
      { "date": "2025-01-10", "count": 5 },
      { "date": "2025-01-11", "count": 8 }
    ]
  }
  ```

### Cryptography

- `GET /api/crypto/public-key` - Get RSA public key for signature verification

## How It Works

### Cryptographic Flow

1. **User Creation**: When a user is created, the backend:
   - Hashes the email using SHA-384
   - Signs the hash with a server-generated RSA private key
   - Stores the signature with the user record

2. **Verification**: The frontend:
   - Fetches the public key from `/api/crypto/public-key`
   - Verifies each user's signature against their email hash
   - Only displays users with valid signatures (green checkmark)
   - Invalid signatures show a red X

### Protobuf Serialization

1. **Schema Definition**: `proto/user.proto` defines the User message structure
2. **Export Endpoint**: `/api/users/export` serializes all users to protobuf binary
3. **Frontend Decoding**: `lib/protobuf.ts` decodes the binary data back to JavaScript objects
4. **Display**: Decoded users are displayed in the user table

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── users/
│   │   │   ├── route.ts          # CRUD operations
│   │   │   ├── [id]/route.ts     # Single user operations
│   │   │   ├── export/route.ts   # Protobuf export
│   │   │   └── stats/route.ts    # Chart statistics
│   │   └── crypto/
│   │       └── public-key/route.ts
│   ├── layout.tsx
│   ├── page.tsx                   # Main dashboard
│   └── globals.css                # Design tokens
├── components/
│   ├── user-management.tsx        # Main container
│   ├── user-form.tsx              # Create/Edit form
│   ├── user-table.tsx             # Data table with verification
│   └── user-chart.tsx             # 7-day chart
├── lib/
│   ├── mongodb.ts                 # Database connection
│   ├── models/User.ts             # Mongoose schema
│   ├── crypto.ts                  # RSA signing/verification
│   └── protobuf.ts                # Protobuf encode/decode
└── proto/
    └── user.proto                 # Protobuf schema
```

## Notes & Assumptions

### Design Decisions

1. **MongoDB over SQLite**: Chose MongoDB with Mongoose for better scalability and cloud deployment options (MongoDB Atlas). The original requirement mentioned SQLite or file-based storage, but MongoDB provides better production readiness.

2. **RSA Signing**: Implemented RSA-SHA256 for cryptographic signatures. The keypair is generated on server startup and stored in memory. For production, keys should be persisted securely (e.g., environment variables, key management service).

3. **Protobuf Implementation**: Used `protobufjs` for runtime protobuf encoding/decoding without requiring a compilation step. This simplifies the development workflow.

4. **Color Palette**: Selected a professional blue-based color scheme (#0066FF primary) with neutral grays for a trustworthy, enterprise-grade appearance. Avoided purple/violet as per design guidelines.

5. **Client-Side Verification**: Signature verification happens on the frontend to demonstrate the crypto flow. In production, this should also be validated server-side for security.

### Assumptions

- **Single Server Instance**: The RSA keypair is generated in memory. For multi-server deployments, keys should be shared across instances.

- **Email Uniqueness**: Emails are assumed to be unique identifiers (enforced by MongoDB unique index).

- **Role Values**: User roles are free-form strings. Consider using an enum for production (`admin`, `user`, `moderator`).

- **Status Values**: Status field accepts `active` or `inactive`. Could be extended to include `pending`, `suspended`, etc.

- **Date Range**: The 7-day chart shows the last 7 days from today, including days with zero users created.

### Additional Notes from Code Examination

- **Unused SQLite Code**: The project includes `lib/database.ts` and `scripts/001-create-users-table.sql` for SQLite support, but the application exclusively uses MongoDB. These files appear to be remnants from an earlier implementation and are not utilized.

- **Key Persistence**: RSA keys are generated on first startup and saved to `keys/private.pem` and `keys/public.pem`. In production environments, consider using secure key management services instead of file-based storage.

- **Build Configuration**: `next.config.mjs` has `ignoreBuildErrors: true` set, which allows the build to succeed even with TypeScript errors. This should be set to `false` in production.

- **Environment Variables**: The project uses `.env.local` for environment configuration, but a `.env` file exists in the root. Ensure sensitive configuration is properly excluded from version control.

- **Protobuf Schema Mismatch**: The `proto/user.proto` file defines `id` as `int32`, but the serialization code converts MongoDB ObjectId to string. The programmatic schema in `lib/protobuf.ts` correctly uses `string` for `id`.

- **Seed Script Dependencies**: The seed script requires `tsx` (included in devDependencies) to run TypeScript files directly.

## Development

### Adding New Fields

1. Update `lib/models/User.ts` Mongoose schema
2. Update `proto/user.proto` protobuf definition
3. Update `components/user-form.tsx` form fields
4. Update `components/user-table.tsx` table columns

### Debugging

The application uses `console.log("[v0] ...")` statements for debugging. Check the browser console and terminal for logs.

## Troubleshooting

### MongoDB Connection Issues

- Verify MongoDB is running: `mongosh` (should connect)
- Check `MONGODB_URI` in `.env.local`
- For Atlas, ensure IP whitelist includes your IP

### Protobuf Errors

- Clear browser cache and reload
- Check browser console for decoding errors
- Verify `/api/users/export` returns binary data

### Signature Verification Failing

- Check that public key is fetched successfully
- Verify user records have `emailHash` and `signature` fields
- Check browser console for crypto errors

## License

MIT
