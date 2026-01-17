import { connectDB } from '@/db/connection'
import { PropertyTypeService } from '../services/property-type.service'

export class PropertyTypeController {
  static async create(req: Request) {
    await connectDB()
    const { name } = await req.json()
    return PropertyTypeService.create(name)
  }

  static async getAll() {
    await connectDB()
    return PropertyTypeService.getAll()
  }
}
