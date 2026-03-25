import * as fs from 'fs'
import * as path from 'path'

const PUBLISHER = process.env.WALRUS_PUBLISHER_URL ?? 'https://publisher.walrus-testnet.walrus.space'
const AGGREGATOR = process.env.WALRUS_AGGREGATOR_URL ?? 'https://aggregator.walrus-testnet.walrus.space'
const EPOCHS = process.env.WALRUS_EPOCHS ?? '5'
const MOCK = process.env.MOCK_WALRUS === 'true'
const MOCK_DIR = '/tmp/greenproof-walrus'

export interface WalrusUploadResult {
  blobId: string
  suiObjectId: string
  size: number
}

/**
 * Sleep for a given number of milliseconds.
 * Used for retry backoff logic.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Generate a mock blob ID with timestamp and random suffix.
 */
function generateMockBlobId(): string {
  return `mock-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/**
 * Mock upload: write data to filesystem.
 */
function mockUpload(data: Buffer): WalrusUploadResult {
  // Ensure mock directory exists
  if (!fs.existsSync(MOCK_DIR)) {
    fs.mkdirSync(MOCK_DIR, { recursive: true })
  }

  const blobId = generateMockBlobId()
  const filePath = path.join(MOCK_DIR, blobId)
  fs.writeFileSync(filePath, data)

  return {
    blobId,
    suiObjectId: blobId,
    size: data.length,
  }
}

/**
 * Mock retrieve: read data from filesystem.
 */
function mockRetrieve(blobId: string): Buffer {
  const filePath = path.join(MOCK_DIR, blobId)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Mock blob not found: ${blobId}`)
  }
  return fs.readFileSync(filePath)
}

/**
 * Upload data to Walrus with retry logic.
 * Handles both "newlyCreated" and "alreadyCertified" response shapes.
 * If MOCK_WALRUS is enabled, writes to local filesystem instead.
 */
export async function uploadToWalrus(data: Buffer, mimeType: string): Promise<WalrusUploadResult> {
  if (MOCK) {
    return mockUpload(data)
  }

  const url = `${PUBLISHER}/v1/store?epochs=${EPOCHS}`
  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': mimeType,
        },
        body: data,
      })

      if (!response.ok) {
        const errText = await response.text()
        throw new Error(
          `Walrus upload failed ${response.status}: ${errText.slice(0, 200)}`
        )
      }

      const responseData = (await response.json()) as Record<string, unknown>

      // Handle "newlyCreated" response shape
      if ('newlyCreated' in responseData) {
        const newlyCreated = responseData.newlyCreated as Record<string, unknown>
        const blobObject = newlyCreated.blobObject as Record<string, string>
        return {
          blobId: blobObject.blobId,
          suiObjectId: blobObject.id,
          size: data.length,
        }
      }

      // Handle "alreadyCertified" response shape
      if ('alreadyCertified' in responseData) {
        const alreadyCertified = responseData.alreadyCertified as Record<string, string>
        return {
          blobId: alreadyCertified.blobId,
          suiObjectId: alreadyCertified.blobId,  // no object ID in this case
          size: data.length,
        }
      }

      throw new Error(
        `Unexpected Walrus response shape: ${JSON.stringify(responseData).slice(0, 200)}`
      )
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Don't retry on the last attempt
      if (attempt < maxRetries - 1) {
        const backoffMs = Math.pow(2, attempt) * 1000 // 1s, 2s
        await sleep(backoffMs)
      }
    }
  }

  throw new Error(`Walrus upload failed after ${maxRetries} attempts: ${lastError?.message}`)
}

/**
 * Retrieve data from Walrus using the aggregator.
 * If MOCK_WALRUS is enabled, reads from local filesystem instead.
 */
export async function retrieveFromWalrus(blobId: string): Promise<Buffer> {
  if (MOCK) {
    return mockRetrieve(blobId)
  }

  const url = `${AGGREGATOR}/v1/${blobId}`

  const response = await fetch(url, {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error(
      `Walrus retrieval failed with status ${response.status}: ${response.statusText}`
    )
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

/**
 * Verify that a blob exists in Walrus using a HEAD request.
 * If MOCK_WALRUS is enabled, checks local filesystem instead.
 */
export async function verifyBlobExists(blobId: string): Promise<boolean> {
  if (MOCK) {
    const filePath = path.join(MOCK_DIR, blobId)
    return fs.existsSync(filePath)
  }

  const url = `${AGGREGATOR}/v1/${blobId}`

  try {
    const response = await fetch(url, {
      method: 'HEAD',
    })

    return response.ok
  } catch {
    return false
  }
}
