//slugfy convierte un string en un slug
import slugify from 'slugify'
import { PropertyTypeRepository } from '../repositories/property-type.repository'

export class PropertyTypeService {
  static async create(name: string) {
    const slug = slugify(name, { lower: true })

    const exists = await PropertyTypeRepository.findBySlug(slug)
    if (exists) throw new Error('Property type already exists')

    return PropertyTypeRepository.create({ name, slug })
  }

  static getAll() {
    return PropertyTypeRepository.findAll()
  }
}
