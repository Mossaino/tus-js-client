export class TusOptions {
  endpoint: string
  resume: boolean

  onProgress?: Function
  onChunkComplete?: Function
  onSuccess?: Function
  onError?: Function

  headers: object
  chunkSize: number
  withCredentials: boolean
  retryDelays: Array<number>

  metaFields: Array<string>
  removeFingerprintOnSuccess: boolean
  fingerprint: Function
  metadata: object
}
