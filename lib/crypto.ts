import crypto from "crypto"
import fs from "fs"
import path from "path"

// Key file paths
const PRIVATE_KEY_PATH = path.join(process.cwd(), "keys", "private.pem")
const PUBLIC_KEY_PATH = path.join(process.cwd(), "keys", "public.pem")

// Ensure keys directory exists
if (!fs.existsSync(path.dirname(PRIVATE_KEY_PATH))) {
  fs.mkdirSync(path.dirname(PRIVATE_KEY_PATH), { recursive: true })
}

// Load or generate RSA keypair
let publicKey: string
let privateKey: string

if (fs.existsSync(PRIVATE_KEY_PATH) && fs.existsSync(PUBLIC_KEY_PATH)) {
  // Load existing keys
  privateKey = fs.readFileSync(PRIVATE_KEY_PATH, "utf8")
  publicKey = fs.readFileSync(PUBLIC_KEY_PATH, "utf8")
} else {
  // Generate new keypair
  const keypair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  })
  publicKey = keypair.publicKey
  privateKey = keypair.privateKey

  // Save keys to files
  fs.writeFileSync(PRIVATE_KEY_PATH, privateKey)
  fs.writeFileSync(PUBLIC_KEY_PATH, publicKey)
}

export function hashEmail(email: string): string {
  return crypto.createHash("sha384").update(email).digest("hex")
}

export function signHash(hash: string): string {
  const sign = crypto.createSign("RSA-SHA256")
  sign.update(hash)
  sign.end()
  return sign.sign(privateKey, "base64")
}

export function verifySignature(hash: string, signature: string): boolean {
  try {
    const verify = crypto.createVerify("RSA-SHA256")
    verify.update(hash)
    verify.end()
    return verify.verify(publicKey, signature, "base64")
  } catch (error) {
    console.error("Signature verification failed:", error)
    return false
  }
}

export function getPublicKey(): string {
  return publicKey
}
