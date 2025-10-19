import Database from "better-sqlite3"
import { join } from "path"

let db: Database.Database | null = null

export function getDatabase() {
  if (!db) {
    const dbPath = join(process.cwd(), "data", "users.db")
    db = new Database(dbPath)
    db.pragma("journal_mode = WAL")
  }
  return db
}

export interface User {
  id: number
  email: string
  role: string
  status: string
  email_hash: string
  signature: string
  created_at: string
}
