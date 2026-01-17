import { NextResponse } from 'next/server'
import { ZoneController } from '@/server/controllers/zone.controller'

export async function POST(req: Request) {
  const data = await ZoneController.create(req)
  return NextResponse.json(data, { status: 201 })
}

export async function GET() {
  const data = await ZoneController.getAll()
  return NextResponse.json(data)
}
