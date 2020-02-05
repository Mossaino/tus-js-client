import { TusOptions } from './tus'
import Uploader from './upload'

export function Upload (data: File, optsTus: TusOptions) {
  return new Uploader(data, optsTus)
}
