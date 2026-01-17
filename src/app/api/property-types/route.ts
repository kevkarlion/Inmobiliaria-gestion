import { NextResponse } from 'next/server'
import { PropertyTypeController } from '@/server/controllers/property-type.controller'

export async function POST(req: Request) {
  const data = await PropertyTypeController.create(req)
  return NextResponse.json(data, { status: 201 })
}

export async function GET() {
  const data = await PropertyTypeController.getAll()
  return NextResponse.json(data)
}
