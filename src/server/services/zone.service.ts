import slugify from 'slugify'
import { ZoneRepository } from '../repositories/zone.repository'

export class ZoneService {
  static async create(name: string) {
    const slug = slugify(name, { lower: true })

    const exists = await ZoneRepository.findBySlug(slug)
    if (exists) throw new Error('Zone already exists')

    return ZoneRepository.create({ name, slug })
  }

  static getAll() {
    return ZoneRepository.findAll()
  }
}
