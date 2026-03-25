import { uploadToWalrus, retrieveFromWalrus, verifyBlobExists } from '@greenproof/sui-client'
export type { WalrusUploadResult } from '@greenproof/sui-client'

/** Upload a photo buffer to Walrus decentralized storage. */
export async function uploadPhoto(
  buffer: Buffer,
  mimeType: string
): Promise<{ blobId: string; suiObjectId: string; size: number }> {
  return uploadToWalrus(buffer, mimeType)
}

/** Retrieve a blob from Walrus by its blob ID. */
export async function fetchPhoto(blobId: string): Promise<Buffer> {
  return retrieveFromWalrus(blobId)
}

/** Check if a blob exists in Walrus without downloading it. */
export async function blobExists(blobId: string): Promise<boolean> {
  return verifyBlobExists(blobId)
}
