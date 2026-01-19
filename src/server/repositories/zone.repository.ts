/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZoneModel } from '@/domain/zone/zone.schema'

export class ZoneRepository {
  static create(data: any) {
    return ZoneModel.create(data)
  }

  static findAll() {
    return ZoneModel.find({ active: true }).sort({ name: 1 })
  }

  static findBySlug(slug: string) {
    return ZoneModel.findOne({ slug })
  }
}
