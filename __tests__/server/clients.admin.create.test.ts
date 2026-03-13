import { describe, it, expect } from 'vitest'
import { CreateClientDTO } from '@/dtos/client/create-client.dto'

describe('CreateClientDTO validation', () => {
  it('accepts valid input for venta terreno', () => {
    const data = {
      name: 'Test',
      email: 'test@example.com',
      phone: '123',
      preferences: {
        operationType: 'venta',
        subType: 'terreno',
        propertyTypes: ['terreno'],
        zones: [],
        priceRange: { min: 0, max: 100000 },
        features: { bedrooms: 0, bathrooms: 0, minM2: 0, garage: false }
      },
    }
    const dto = new CreateClientDTO(data)
    expect(dto).toBeTruthy()
  })

  it('rejects invalid operationType', () => {
    const data = {
      name: 'Test2',
      email: 'test2@example.com',
      phone: '123',
      preferences: {
        operationType: 'compra',
        subType: 'terreno',
        propertyTypes: ['terreno'],
        zones: [],
        priceRange: { min: 0, max: 100000 },
        features: { bedrooms: 0, bathrooms: 0, minM2: 0, garage: false }
      },
    }
    expect(() => new CreateClientDTO(data)).toThrow()
  })
})
