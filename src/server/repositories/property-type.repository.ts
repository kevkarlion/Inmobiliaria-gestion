import { PropertyTypeModel } from '@/domain/property-type/property-type.schema'

export class PropertyTypeRepository {
  static create(data: any) {
    return PropertyTypeModel.create(data)
  }

  static findAll() {
    return PropertyTypeModel.find({ active: true }).sort({ name: 1 })
  }

  static findBySlug(slug: string) {
    return PropertyTypeModel.findOne({ slug })
  }
}
