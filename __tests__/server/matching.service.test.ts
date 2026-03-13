import { describe, it, expect } from 'vitest'
import { MatchingService } from '@/server/services/matching.service'

describe('MatchingService score computation', () => {
  it('scores a perfect match when zone, type and price overlap', () => {
    const client: any = { zones: ['Centro'], propertyTypes: ['apartamento'], budget: { min: 100000, max: 200000 } }
    const req: any = { zone: 'Centro', type: 'apartamento', priceMin: 110000, priceMax: 180000 }
    const score = MatchingService.scoreMatch(client, req)
    expect(score).toBeCloseTo(1.0, 2)
  })

  it('gives non-zero score for partial matches', () => {
    const client: any = { zones: ['Centro'], propertyTypes: ['casa'], budget: { min: 100000, max: 250000 } }
    const req: any = { zone: 'Centro', type: 'apartamento', priceMin: 250000, priceMax: 300000 }
    const score = MatchingService.scoreMatch(client, req)
    expect(score).toBeGreaterThan(0)
  })
})
