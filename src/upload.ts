import { TusOptions } from './tus'

export default class Uploader {
  file: File
  opts: TusOptions
  controller: AbortController

  uploadOffset: number
  uploadUrl?: string
  headers: Headers

  constructor (file: File, opts: TusOptions) {
    this.file = file
    this.opts = opts
    this.controller = new AbortController()
    this.headers = new Headers()
    this.uploadOffset = 0 // TODO http HEAD to figure out if it's actually 0 (new file) or if continued upload
    this.headers.set('Tus-Resumable', '1.0.0')
    this.headers.set('Upload-Metadata', this.metadata)
  }

  async start () {
    if (this.uploadUrl === undefined) {
      this.uploadUrl = await fetch(this.opts.endpoint, {
        method: 'POST',
        headers: this.headers
      }).then(res => {
        const location = res.headers.get('Location')
        if (location && res.status === 201) { // HTTP 201 Created
          return location
        } else {
          throw new Error('Location not given')
        }
      })
    }

    let isDone = this.file.size === 0
    while (!isDone) {
      isDone = await this.startChunk(await this.readChunk())
    }
  }

  async readChunk (): Promise<Blob> {
    return this.file.slice(this.uploadOffset, this.uploadOffset + this.opts.chunkSize)
  }

  async startChunk (chunk: Blob): Promise<boolean> {
    // TODO add "progress" sometime https://github.com/whatwg/fetch/issues/607
    if (this.uploadUrl === undefined) {
      throw new Error('uploadUrl required')
    }

    if (chunk.size === 0) {
      throw new Error('Chunk is empty')
    }

    return fetch(this.uploadUrl, {
      method: 'PATCH',
      body: chunk,
      headers: Object.assign({
        'Content-Type': 'application/offset+octet-stream',
        'Tus-Resumable': '1.0.0',
        'Upload-Offset': this.uploadOffset + '',
        'Content-Length': chunk.size + ''
      }, this.opts.headers),
      signal: this.controller.signal
    }).then(res => {
      if (!res.ok) {
        throw new Error(res.statusText)
      }

      this.uploadOffset = Number(res.headers.get('Upload-Offset')) || this.uploadOffset

      if (this.opts.onChunkComplete) {
        this.opts.onChunkComplete(chunk.size, chunk.size, this.file.size)
      }

      if (this.uploadOffset === this.file.size) {
        if (this.opts.onSuccess) {
          this.opts.onSuccess()
        }
        return true // e.g. done
      } else {
        return false // e.g. not done
      }
    }).catch(err => {
      if (this.opts.onError) {
        this.opts.onError(err)
        return true // crashed, therefore don't continue
      } else {
        throw err
      }
    })
  }

  /**
   * Stops the uploading of this particular chunk
   */
  abort () {
    this.controller.abort()
  }

  get metadata (): string {
    const entries = Object.entries(this.opts.metadata).map(([key, value]) => {
      return key + ' ' + self.btoa(value.toString())
    })
    return entries.join(',')
  }
}
