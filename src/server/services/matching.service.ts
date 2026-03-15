/* eslint-disable @typescript-eslint/no-explicit-any */
// Import removed - using any type for flexibility
// import { ClientDocument } from "@/db/schemas/client.schema";
import { RequirementDocument } from "@/domain/models/requirement.model";
import { ClientModel } from "@/db/schemas/client.schema";

export interface MatchResult {
  requirementId: string;
  score: number;
  zoneMatch: boolean;
  typeMatch: boolean;
  priceOverlap: boolean;
}

export interface MatchingResult {
  total: number;
  processed: number;
  matched: number;
  matches: any[];
}

/**
 * Resultado de match entre clientes
 */
export interface ClientMatchResult {
  clientId: string;
  clientName: string;
  score: number;
  operationMatch: boolean;
  propertyTypeMatch: boolean;
  zoneMatch: boolean;
  priceOverlap: boolean;
  priceBonus: number;
}

export class MatchingService {
  /**
   * Calcula el score de match entre dos preferencias de cliente
   * 
   * Reglas:
   * - operationType debe ser complementario (compra ↔ venta)
   * - propertyType debe coincidir
   * - zona DEBE coincidir siempre → si no coincide, score = 0
   * - precio (±20%) da un bonus adicional
   */
  static scoreClientMatch(pref1: any, pref2: any): number {
    if (!pref1 || !pref2) return 0;
    
    // Verificar propertyType primero
    if (!pref1.propertyType || !pref2.propertyType) return 0;
    const propertyTypeMatch = pref1.propertyType === pref2.propertyType;
    if (!propertyTypeMatch) return 0;
    
    // Verificar zona - ES OBLIGATORIA
    const zoneMatch = this.zonesMatch(pref1.zones, pref2.zones);
    if (!zoneMatch) return 0;
    
    // Base: propertyType + zona coinciden = 70%
    let score = 0.7;
    let priceBonus = 0;
    
    // Precio: si ambos tienen rango, verificar overlap con ±20%
    if (pref1.priceRange && pref2.priceRange) {
      const priceBonusResult = this.priceBonus(pref1.priceRange, pref2.priceRange);
      if (priceBonusResult > 0) {
        // Bonus máximo de 30% si el precio coincide muy bien
        priceBonus = priceBonusResult;
        score += priceBonus;
      }
    }
    
    // Retornar score max 1.0 (100%)
    return Math.min(Math.round(score * 100) / 100, 1);
  }

  /**
   * Verifica si las zonas coinciden
   */
  static zonesMatch(zones1: any[], zones2: any[]): boolean {
    if (!zones1 || !zones2 || zones1.length === 0 || zones2.length === 0) return false;
    
    for (const z1 of zones1) {
      for (const z2 of zones2) {
        // Comparar por ID primero
        if (z1.province && z2.province) {
          const p1 = z1.province.toString();
          const p2 = z2.province.toString();
          if (p1 === p2) {
            // Misma provincia, verificar ciudad
            if (z1.city && z2.city) {
              const c1 = z1.city.toString();
              const c2 = z2.city.toString();
              if (c1 === c2) return true;
            }
            // Solo coincide provincia
            return true;
          }
        }
        // Comparar por nombre
        if (z1.provinceName && z2.provinceName) {
          if (z1.provinceName.toLowerCase() === z2.provinceName.toLowerCase()) {
            if (z1.cityName && z2.cityName) {
              if (z1.cityName.toLowerCase() === z2.cityName.toLowerCase()) return true;
            }
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Calcula bonus de precio (±20% de overlap)
   * Retorna 0-0.3 (max 30% bonus)
   */
  static priceBonus(range1: any, range2: any): number {
    if (!range1 || !range2) return 0;
    
    const min1 = range1.min ?? 0;
    const max1 = range1.max ?? Infinity;
    const min2 = range2.min ?? 0;
    const max2 = range2.max ?? Infinity;
    
    // Si no hay rango de precio en ninguno, no hay bonus
    if (min1 === 0 && max1 === Infinity && min2 === 0 && max2 === Infinity) return 0;
    
    // Verificar overlap
    const overlapMin = Math.max(min1, min2);
    const overlapMax = Math.min(max1, max2);
    
    if (overlapMin > overlapMax) return 0; // No hay overlap
    
    // Calcular overlap relativo al rango
    const overlap = overlapMax - overlapMin;
    const range1Size = max1 - min1;
    const range2Size = max2 - min2;
    
    if (range1Size === 0 && range2Size === 0) {
      // Ambos tienen un solo valor → coincide exactamente
      return 0.3;
    }
    
    // Porcentage de overlap
    const avgRange = (range1Size + range2Size) / 2;
    const overlapPercent = avgRange > 0 ? overlap / avgRange : 0;
    
    // Bonus proporcional (max 0.3)
    return Math.min(overlapPercent * 0.3, 0.3);
  }

  /**
   * Verifica si hay solapamiento de precios (legacy - mantener compatibilidad)
   */
  static priceOverlap(range1: any, range2: any): boolean {
    if (!range1 || !range2) return false;
    
    const min1 = range1.min ?? 0;
    const max1 = range1.max ?? Infinity;
    const min2 = range2.min ?? 0;
    const max2 = range2.max ?? Infinity;
    
    return Math.max(min1, min2) <= Math.min(max1, max2);
  }

  /**
   * Encuentra clientes con intereses similares
   * - "compra" matches con "venta" (comprador con vendedor)
   * - "venta" matches con "compra" (vendedor con comprador)
   * - "alquiler" matches con "alquiler" (ambos buscan alquilar)
   */
  static async findSimilarClients(
    clientId: string, 
    minScore: number = 0.3
  ): Promise<ClientMatchResult[]> {
    const currentClient = await ClientModel.findById(clientId).lean();
    if (!currentClient) return [];
    
    const operationType = currentClient.preferences?.operationType;
    const propertyPrefs = currentClient.preferences?.propertyPreferences || [];
    
    if (propertyPrefs.length === 0) return [];
    
    // Determinar qué tipos de operación buscan matches
    // compra busca venta, venta busca compra, alquiler busca alquiler
    let targetOperations: string[];
    if (operationType === "compra") {
      targetOperations = ["venta"]; // Un comprador busca vendedores
    } else if (operationType === "venta") {
      targetOperations = ["compra"]; // Un vendedor busca compradores
    } else {
      targetOperations = ["alquiler"]; // Alquiler busca alquiler
    }
    
    // Buscar clientes con operaciones complementarias
    const otherClients = await ClientModel.find({
      _id: { $ne: clientId },
      "preferences.operationType": { $in: targetOperations },
    }).lean();
    
    const matches: ClientMatchResult[] = [];
    
    for (const other of otherClients) {
      const otherPrefs = other.preferences?.propertyPreferences || [];
      
      // Buscar el mejor match entre las preferencias
      let bestScore = 0;
      let operationMatch = false;
      let propertyTypeMatch = false;
      let zoneMatch = false;
      let priceOverlap = false;
      let priceBonus = 0;
      
      for (const pref1 of propertyPrefs) {
        for (const pref2 of otherPrefs) {
          const score = this.scoreClientMatch(pref1, pref2);
          if (score > bestScore) {
            bestScore = score;
            operationMatch = targetOperations.includes(other.preferences?.operationType);
            propertyTypeMatch = pref1.propertyType === pref2.propertyType;
            zoneMatch = this.zonesMatch(pref1.zones, pref2.zones);
            priceOverlap = this.priceOverlap(pref1.priceRange, pref2.priceRange);
            priceBonus = score - 0.7; // El bonus es la diferencia sobre la base de 0.7
          }
        }
      }
      
      // Score mínimo ahora es 0.7 (70%) si coincide todo excepto precio
      // Si no hay zona, el score ya es 0 por scoreClientMatch
      if (bestScore >= minScore) {
        matches.push({
          clientId: other._id.toString(),
          clientName: other.name,
          score: bestScore,
          operationMatch,
          propertyTypeMatch,
          zoneMatch,
          priceOverlap,
          priceBonus,
        });
      }
    }
    
    // Ordenar por score descendente
    return matches.sort((a, b) => b.score - a.score);
  }

  // Score a single client vs a single requirement
  static scoreMatch(client: any, req: any): number {
    const zoneMatch = Array.isArray(client?.zones) && client.zones.includes(req.zone) ? 1 : 0;
    const typeMatch = Array.isArray(client?.propertyTypes) && client.propertyTypes.includes(req.type) ? 1 : 0;
    const budget = client?.budget;
    const priceOverlap =
      budget &&
      typeof budget.min === "number" &&
      typeof budget.max === "number" &&
      typeof req.priceMin === "number" &&
      typeof req.priceMax === "number" &&
      Math.max(budget.min, req.priceMin) <= Math.min(budget.max, req.priceMax);
    const score = (zoneMatch ? 0.4 : 0) + (typeMatch ? 0.3 : 0) + (priceOverlap ? 0.3 : 0);
    // return as 0-1; scale to 0-100 if needed
    return Math.round(score * 100) / 100;
  }

  // Compute matches for a client given a list of requirements
  static computeMatches(client: any, requirements: any[]): MatchResult[] {
    const results = (requirements || []).map((r: any) => ({
      requirementId: r._id?.toString?.() ?? "",
      score: this.scoreMatch(client, r),
      zoneMatch: Array.isArray(client?.zones) && client.zones.includes(r.zone),
      typeMatch: Array.isArray(client?.propertyTypes) && client.propertyTypes.includes(r.type),
      priceOverlap:
        client?.budget &&
        typeof client.budget.min === "number" &&
        typeof client.budget.max === "number" &&
        typeof r.priceMin === "number" &&
        typeof r.priceMax === "number" &&
        Math.max(client.budget.min, r.priceMin) <= Math.min(client.budget.max, r.priceMax)
    }));
    return results.sort((a, b) => b.score - a.score);
  }

  // Find matches for a property (placeholder implementation)
  static async findMatchesForProperty(propertyId: string, minScore: number = 0): Promise<any[]> {
    // TODO: Implement actual matching logic for property
    console.log(`Finding matches for property ${propertyId} with minScore ${minScore}`);
    return [];
  }

  // Find matches for a requirement (placeholder implementation)
  static async findMatchesForRequirement(requirementId: string, minScore: number = 0): Promise<any[]> {
    // TODO: Implement actual matching logic for requirement
    console.log(`Finding matches for requirement ${requirementId} with minScore ${minScore}`);
    return [];
  }

  // Run full matching (placeholder implementation)
  static async runFullMatching(): Promise<MatchingResult> {
    // TODO: Implement actual full matching logic
    console.log("Running full matching...");
    return {
      total: 0,
      processed: 0,
      matched: 0,
      matches: [],
    };
  }
}

export default MatchingService;
