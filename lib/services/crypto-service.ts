export const cryptoService = {
  async getPublicKey(): Promise<string> {
    const response = await fetch("/api/crypto/public-key")
    if (!response.ok) throw new Error("Failed to fetch public key")
    const { publicKey } = await response.json()
    return publicKey
  },

  async verifySignature(hash: string, signature: string): Promise<boolean> {
    try {
      const publicKeyPem = await this.getPublicKey()

      // Remove PEM headers and clean up
      const pemHeader = "-----BEGIN PUBLIC KEY-----"
      const pemFooter = "-----END PUBLIC KEY-----"
      const pemContents = publicKeyPem
        .replace(pemHeader, "")
        .replace(pemFooter, "")
        .replace(/\n/g, "")
        .trim()

      // Decode base64 to binary DER
      const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0))

      const cryptoKey = await crypto.subtle.importKey(
        "spki",
        binaryDer,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["verify"],
      )

      // Decode signature from base64 (remove newlines first)
      const cleanSignature = signature.replace(/\n/g, "").trim()
      const signatureBytes = Uint8Array.from(atob(cleanSignature), (c) => c.charCodeAt(0))

      // Convert hash to bytes
      const hashBytes = new TextEncoder().encode(hash)

      // Verify signature
      return await crypto.subtle.verify("RSASSA-PKCS1-v1_5", cryptoKey, signatureBytes, hashBytes)
    } catch (error) {
      console.error("[v0] Crypto verification error:", error)
      return false
    }
  },
}
