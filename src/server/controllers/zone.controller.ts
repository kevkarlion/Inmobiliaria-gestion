import { connectDB } from '@/db/connection'
import { ZoneService } from '../services/zone.service'

export class ZoneController {
  static async create(req: Request) {
    await connectDB()
    const { name } = await req.json()
    return ZoneService.create(name)
  }

  static async getAll() {
    await connectDB()
    return ZoneService.getAll()
  }
}
