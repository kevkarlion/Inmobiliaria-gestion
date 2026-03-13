# Diseño Técnico: Sistema de Gestión de Clientes (CRM) con Matching Automático

## 1. Arquitectura de Archivos

```
src/
├── db/
│   └── schemas/
│       └── client.schema.ts          # Schema MongoDB para clientes
│
├── domain/
│   ├── interfaces/
│   │   └── client.interface.ts       # Interfaz IClient
│   ├── enums/
│   │   └── client-status.enum.ts     # Enum: active, inactive, converted, lost
│   ├── types/
│   │   └── Client.types.ts           # Tipos TypeScript relacionados
│   └── mappers/
│       └── client.mapper.ts          # Mapper DB ↔ UI ↔ Form
│
├── dtos/
│   └── client/
│       ├── create-client.dto.ts      # DTO para crear cliente
│       ├── update-client.dto.ts      # DTO para actualizar cliente
│       ├── query-client.dto.ts       # DTO para filtros y paginación
│       └── client-response.dto.ts    # DTO de respuesta
│
├── server/
│   ├── repositories/
│   │   └── client.repository.ts      # Acceso a datos de clientes
│   ├── services/
│   │   ├── client.service.ts         # Lógica de negocio de clientes
│   │   └── matching.service.ts       # Algoritmo de matching automático
│   └── controllers/
│       └── client.controller.ts      # Controlador de API
│
├── app/
│   └── api/
│       └── clients/
│           ├── route.ts              # GET/POST /api/clients
│           └── [id]/
│               └── route.ts          # GET/PUT/DELETE /api/clients/:id
│
└── components/
    └── admin/
        ├── ClientList/
        │   └── ClientList.tsx        # Lista de clientes con filtros
        ├── ClientForm/
        │   └── ClientForm.tsx        # Formulario crear/editar cliente
        ├── ClientDetail/
        │   └── ClientDetail.tsx      # Ver detalle de cliente
        ├── ClientMatchResults/
        │   └── ClientMatchResults.tsx # Resultados de matching
        └── MatchDashboard/
            └── MatchDashboard.tsx    # Dashboard de matches automático
```

---

## 2. Estructura del Modelo MongoDB (Client)

### Schema: `client.schema.ts`

```typescript
import { Schema, model, models } from "mongoose";
import { IClient } from "@/domain/interfaces/client.interface";
import { ClientStatus } from "@/domain/enums/client-status.enum";

const ClientSchema = new Schema<IClient>(
  {
    // Información personal
    name: { 
      type: String, 
      required: true,
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true 
    },
    phone: { 
      type: String, 
      trim: true,
      default: "" 
    },
    
    // Estado del cliente
    status: {
      type: String,
      enum: Object.values(ClientStatus),
      default: ClientStatus.ACTIVE,
      index: true
    },
    
    // Origen del cliente
    source: {
      type: String,
      enum: ["web", "referido", "publicado", "oficina", "otro"],
      default: "web"
    },
    
    // Preferencias del cliente para matching
    preferences: {
      // Tipo de operación: venta o alquiler
      operationType: {
        type: String,
        enum: ["venta", "alquiler"],
        required: true
      },
      
      // Tipos de propiedad deseados (array para múltiples)
      propertyTypes: [{
        type: Schema.Types.ObjectId,
        ref: "PropertyType"
      }],
      
      // Zona(s) deseada(s)
      zones: [{
        province: { type: Schema.Types.ObjectId, ref: "Province" },
        city: { type: Schema.Types.ObjectId, ref: "City" },
        barrio: { type: String }  // Barrio como string libre
      }],
      
      // Rango de precio
      priceRange: {
        min: { type: Number, default: 0 },
        max: { type: Number }
      },
      
      // Características deseadas
      features: {
        bedrooms: { type: Number, default: 0 },
        bathrooms: { type: Number, default: 0 },
        minM2: { type: Number, default: 0 },
        garage: { type: Boolean }
      }
    },
    
    // Notas internas
    notes: {
      type: String,
      default: ""
    },
    
    // Asignación a agente
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    
    // Historial de interacciones
    interactions: [{
      date: { type: Date, default: Date.now },
      type: { 
        type: String, 
        enum: ["llamada", "whatsapp", "email", "reunion", "visita", "nota"] 
      },
      description: String,
      performedBy: { type: Schema.Types.ObjectId, ref: "User" }
    }],
    
    // Resultados de matching (propiedades sugeridas)
    matches: [{
      property: { type: Schema.Types.ObjectId, ref: "Property" },
      score: { type: Number },        // 0-100
      matchedAt: { type: Date, default: Date.now },
      status: { 
        type: String, 
        enum: ["nuevo", "contactado", "interesado", "no_interesado"],
        default: "nuevo"
      },
      notes: String
    }],
    
    // Fecha de última actividad
    lastActivityAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Índices para optimizar queries de matching
ClientSchema.index({ "preferences.operationType": 1, status: 1 });
ClientSchema.index({ "preferences.propertyTypes": 1 });
ClientSchema.index({ "preferences.zones.city": 1 });
ClientSchema.index({ "preferences.priceRange.min": 1, "preferences.priceRange.max": 1 });

export const ClientModel = models.Client || model<IClient>("Client", ClientSchema);
```

### Interfaz: `client.interface.ts`

```typescript
import { Document, Types } from "mongoose";
import { ClientStatus } from "@/domain/enums/client-status.enum";

export interface IClient extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  status: ClientStatus;
  source: "web" | "referido" | "publicado" | "oficina" | "otro";
  
  preferences: {
    operationType: "venta" | "alquiler";
    propertyTypes: Types.ObjectId[];
    zones: {
      province?: Types.ObjectId;
      city?: Types.ObjectId;
      barrio?: string;
    }[];
    priceRange: {
      min: number;
      max?: number;
    };
    features: {
      bedrooms: number;
      bathrooms: number;
      minM2: number;
      garage?: boolean;
    };
  };
  
  notes: string;
  assignedTo?: Types.ObjectId;
  
  interactions: {
    date: Date;
    type: "llamada" | "whatsapp" | "email" | "reunion" | "visita" | "nota";
    description: string;
    performedBy?: Types.ObjectId;
  }[];
  
  matches: {
    property: Types.ObjectId;
    score: number;
    matchedAt: Date;
    status: "nuevo" | "contactado" | "interesado" | "no_interesado";
    notes?: string;
  }[];
  
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 3. Algoritmo de Matching con Pesos

### Pesos Definidos
- **Zona**: 40%
- **Tipo de Propiedad**: 30%
- **Precio**: 30%

### Implementación: `matching.service.ts`

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientModel } from "@/db/schemas/client.schema";
import { PropertyModel } from "@/db/schemas/property.schema";
import { connectDB } from "@/db/connection";

// Pesos para el scoring
const WEIGHTS = {
  ZONE: 0.40,         // 40%
  PROPERTY_TYPE: 0.30, // 30%
  PRICE: 0.30         // 30%
};

const MATCH_THRESHOLD = 70; // Porcentaje mínimo para considerar match

interface MatchResult {
  propertyId: string;
  score: number;
  breakdown: {
    zone: number;
    propertyType: number;
    price: number;
  };
}

export class MatchingService {
  
  /**
   * Calcula el score de compatibilidad entre un cliente y una propiedad
   * Retorna score de 0 a 100
   */
  static calculateMatchScore(client: any, property: any): MatchResult {
    const zoneScore = this.calculateZoneScore(client.preferences.zones, property);
    const typeScore = this.calculatePropertyTypeScore(
      client.preferences.propertyTypes, 
      property.propertyType
    );
    const priceScore = this.calculatePriceScore(
      client.preferences.priceRange,
      property.price
    );
    
    // Score ponderado
    const totalScore = Math.round(
      (zoneScore * WEIGHTS.ZONE) +
      (typeScore * WEIGHTS.PROPERTY_TYPE) +
      (priceScore * WEIGHTS.PRICE)
    );
    
    return {
      propertyId: property._id.toString(),
      score: totalScore,
      breakdown: {
        zone: Math.round(zoneScore),
        propertyType: Math.round(typeScore),
        price: Math.round(priceScore)
      }
    };
  }
  
  /**
   * Calcula score de zona (0-100)
   * - Ciudad exacta: 100
   * - Provincia correcta: 60
   * - Barrio específico coincide: +20 bonus
   */
  private static calculateZoneScore(clientZones: any[], property: any): number {
    if (!clientZones || clientZones.length === 0) return 50; // Sin preferencia
    
    const propertyCity = property.address?.city?.toString();
    const propertyProvince = property.address?.province?.toString();
    const propertyBarrio = property.address?.barrio?.toLowerCase();
    
    let bestScore = 0;
    
    for (const zone of clientZones) {
      let score = 0;
      
      // Provincia coincide
      if (zone.province && propertyProvince === zone.province.toString()) {
        score = 60;
      }
      
      // Ciudad coincide
      if (zone.city && propertyCity === zone.city.toString()) {
        score = Math.max(score, 100);
      }
      
      // Barrio coincide (bonus)
      if (zone.barrio && propertyBarrio) {
        if (propertyBarrio.toLowerCase().includes(zone.barrio.toLowerCase())) {
          score = Math.min(score + 20, 100);
        }
      }
      
      bestScore = Math.max(bestScore, score);
    }
    
    return bestScore;
  }
  
  /**
   * Calcula score de tipo de propiedad (0-100)
   * - Tipo exacto: 100
   * - Sin tipo especificado: 50
   */
  private static calculatePropertyTypeScore(
    clientTypes: Types.ObjectId[], 
    propertyType: Types.ObjectId
  ): number {
    if (!clientTypes || clientTypes.length === 0) return 50;
    
    // Verificar si el tipo de propiedad está en las preferencias
    const match = clientTypes.some(
      t => t.toString() === propertyType?.toString()
    );
    
    return match ? 100 : 0;
  }
  
  /**
   * Calcula score de precio (0-100)
   * - Precio dentro del rango: 100
   * - Precio fuera del rango: calcula penalización basada en distancia
   */
  private static calculatePriceScore(
    priceRange: { min: number; max?: number },
    propertyPrice: { amount: number; currency: string }
  ): number {
    if (!priceRange) return 50; // Sin preferencia
    
    const { min = 0, max } = priceRange;
    const price = propertyPrice.amount;
    
    // Dentro del rango
    if (price >= min && (!max || price <= max)) {
      return 100;
    }
    
    // Precio por debajo del mínimo
    if (price < min) {
      const diff = min - price;
      const percentageDiff = (diff / min) * 100;
      return Math.max(0, 100 - percentageDiff * 2);
    }
    
    // Precio por encima del máximo
    if (max && price > max) {
      const diff = price - max;
      const percentageDiff = (diff / max) * 100;
      return Math.max(0, 100 - percentageDiff * 2);
    }
    
    return 50;
  }
  
  /**
   * Ejecuta matching para un cliente específico
   * Retorna propiedades ordenadas por score
   */
  static async matchClientWithProperties(clientId: string): Promise<MatchResult[]> {
    await connectDB();
    
    const client = await ClientModel.findById(clientId).lean();
    if (!client) throw new Error("Cliente no encontrado");
    
    // Obtener propiedades activas que coincidan con el tipo de operación
    const properties = await PropertyModel.find({
      status: "active",
      operationType: client.preferences.operationType
    })
    .populate("propertyType")
    .populate("address.city")
    .populate("address.province")
    .lean();
    
    // Calcular scores
    const results: MatchResult[] = properties
      .map(property => this.calculateMatchScore(client, property))
      .filter(result => result.score >= MATCH_THRESHOLD)
      .sort((a, b) => b.score - a.score);
    
    return results;
  }
  
  /**
   * Ejecuta matching automático para TODOS los clientes activos
   * Se dispara automáticamente al crear/actualizar propiedades o clientes
   */
  static async runAutoMatching(): Promise<{
    updatedClients: number;
    totalMatches: number;
  }> {
    await connectDB();
    
    // Obtener todos los clientes activos
    const clients = await ClientModel.find({ status: "active" }).lean();
    
    let totalMatches = 0;
    
    for (const client of clients) {
      // Obtener propiedades activas del tipo de operación
      const properties = await PropertyModel.find({
        status: "active",
        operationType: client.preferences.operationType
      })
      .populate("propertyType")
      .populate("address.city")
      .populate("address.province")
      .lean();
      
      // Calcular matches
      const matches: any[] = [];
      
      for (const property of properties) {
        const result = this.calculateMatchScore(client, property);
        
        if (result.score >= MATCH_THRESHOLD) {
          matches.push({
            property: property._id,
            score: result.score,
            matchedAt: new Date(),
            status: "nuevo"
          });
        }
      }
      
      // Ordenar por score y tomar los top 20
      const topMatches = matches
        .sort((a, b) => b.score - a.score)
        .slice(0, 20);
      
      // Actualizar cliente con nuevos matches
      await ClientModel.updateOne(
        { _id: client._id },
        { 
          $set: { matches: topMatches },
          $set: { lastActivityAt: new Date() }
        }
      );
      
      totalMatches += topMatches.length;
    }
    
    return {
      updatedClients: clients.length,
      totalMatches
    };
  }
}
```

---

## 4. Estructura de la API REST

### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/clients` | Listar clientes con filtros y paginación |
| POST | `/api/clients` | Crear nuevo cliente |
| GET | `/api/clients/:id` | Obtener cliente por ID |
| PUT | `/api/clients/:id` | Actualizar cliente |
| DELETE | `/api/clients/:id` | Eliminar (soft-delete) cliente |
| GET | `/api/clients/:id/matches` | Obtener matches de un cliente |
| POST | `/api/clients/:id/match` | Ejecutar matching manual |
| POST | `/api/clients/batch-match` | Ejecutar matching para todos los clientes |

### Request/Response Examples

#### POST /api/clients
```json
// Request
{
  "name": "Juan Pérez",
  "email": "juan.perez@email.com",
  "phone": "2984123456",
  "source": "web",
  "preferences": {
    "operationType": "venta",
    "propertyTypes": ["tipo-casa-id", "tipo-departamento-id"],
    "zones": [
      { "city": "ciudad-general-roca-id" }
    ],
    "priceRange": {
      "min": 50000,
      "max": 150000
    },
    "features": {
      "bedrooms": 2,
      "bathrooms": 1,
      "minM2": 60
    }
  },
  "notes": "Cliente interesado en zona norte"
}

// Response (201)
{
  "id": "cliente-uuid",
  "name": "Juan Pérez",
  "email": "juan.perez@email.com",
  "status": "active",
  "preferences": { ... },
  "matches": [],
  "createdAt": "2026-03-12T10:00:00Z"
}
```

#### GET /api/clients?status=active&operationType=venta&page=1&limit=10
```json
{
  "items": [ ... ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

#### GET /api/clients/:id/matches
```json
{
  "clientId": "cliente-uuid",
  "matches": [
    {
      "property": {
        "id": "prop-uuid",
        "title": "Casa en barrio Norte",
        "price": { "amount": 120000, "currency": "USD" },
        "address": { "city": "General Roca", "barrio": "Norte" }
      },
      "score": 92,
      "breakdown": {
        "zone": 100,
        "propertyType": 100,
        "price": 75
      },
      "matchedAt": "2026-03-12T10:05:00Z",
      "status": "nuevo"
    }
  ]
}
```

---

## 5. Componentes UI Necesarios

### 5.1 ClientList
```typescript
// components/admin/ClientList/ClientList.tsx
interface ClientListProps {
  clients: Client[];
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onFilterChange: (filters: ClientFilters) => void;
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
  onViewMatches: (clientId: string) => void;
}

// Features:
// - Tabla con columnas: Nombre, Email, Teléfono, Estado, Operación, Matches, Última actividad
// - Filtros: Estado, Tipo operación, Fecha desde/hasta
// - Búsqueda por nombre/email
// - Acciones: Editar, Eliminar, Ver matches
// - Paginación
// - Ordenar por columna
```

### 5.2 ClientForm
```typescript
// components/admin/ClientForm/ClientForm.tsx
interface ClientFormProps {
  client?: Client;  // Si existe, es modo edición
  onSubmit: (data: CreateClientDTO) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Features:
// - Datos personales: Nombre, Email, Teléfono
// - Estado: Dropdown (Activo, Inactivo, Convertido, Perdido)
// - Origen: Dropdown
// - Preferencias:
//   - Operación: Venta/Alquiler (required)
//   - Tipo propiedad: Multi-select con tipos disponibles
//   - Zona: Province/City/Barrio selector
//   - Precio: Min/Max inputs
//   - Características: Dormitorios, Baños, Mín m2, Garage
// - Notas: Textarea
// - Validación de email único
```

### 5.3 ClientDetail
```typescript
// components/admin/ClientDetail/ClientDetail.tsx
interface ClientDetailProps {
  client: Client;
  onEdit: () => void;
  onAddInteraction: () => void;
  onContactMatch: (matchId: string) => void;
}

// Features:
// - Información del cliente (header)
// - Preferencias detalladas (cards)
// - Historial de interacciones (timeline)
// - Propiedades sugeridas (cards con score)
// - Acciones rápidas: Contactar, Agregar nota, Editar
```

### 5.4 ClientMatchResults
```typescript
// components/admin/ClientMatchResults/ClientMatchResults.tsx
interface ClientMatchResultsProps {
  matches: Match[];
  onContactProperty: (propertyId: string) => void;
  onNotInterested: (matchId: string) => void;
  onRefresh: () => void;
}

// Features:
// - Lista de propiedades matcheadas
// - Score visual con breakdown (zona/tipo/precio)
// - Información de propiedad (imagen, precio, dirección)
// - Botones: Contactar, No me interesa
// - Indicador visual de match score (color por nivel)
// - Ordenar por score o fecha
```

### 5.5 MatchDashboard
```typescript
// components/admin/MatchDashboard/MatchDashboard.tsx
interface MatchDashboardProps {
  // Stats
  totalClients: number;
  activeMatches: number;
  newMatchesToday: number;
  conversionRate: number;
  // Lists
  recentMatches: Match[];
  topClients: Client[];
  // Actions
  onRunMatching: () => void;
  onViewClient: (clientId: string) => void;
}

// Features:
// - KPIs: Total clientes, Matches activos, Nuevos hoy, Tasa conversión
// - Gráfico de matches por día (últimos 30 días)
// - Lista de matches recientes
// - Clientes más activos
// - Botón: "Ejecutar Matching Ahora"
// - Notificación de nuevos matches
```

---

## 6. Secuencia de Matching Automático

### Flujo Principal

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    MATCHING AUTOMÁTICO - FLUJO COMPLETO                │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌─────────────────┐     ┌──────────────────────┐
│   EVENTO     │────▶│    SERVICIO      │────▶│   RESULTADO          │
│  TRIGGER     │     │   PROCESADO      │     │   GENERADO           │
└──────────────┘     └─────────────────┘     └──────────────────────┘

EVENTOS QUE DISPARAN MATCHING:
1. ✅ Cliente nuevo creado
2. ✅ Cliente existente actualizado (preferencias cambiadas)
3. ✅ Propiedad nueva creada
4. ✅ Propiedad existente actualizada (precio, tipo, zona)
5. ✅ Job programado (diario/semanal)
```

### Secuencia Detallada

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SECUENCIA: Crear Cliente con Matching Automático                           │
└─────────────────────────────────────────────────────────────────────────────┘

  USUARIO              API                   SERVICIO              DATABASE
   
    │                   │                       │                     │
    │ 1. POST /clients  │                       │                     │
    │    {datos...}     │                       │                     │
    │─────────────────▶│                       │                     │
    │                   │ 2. Validar DTO       │                     │
    │                   │─────────────────────▶│                     │
    │                   │       (OK)           │                     │
    │                   │◀─────────────────────│                     │
    │                   │                       │                     │
    │                   │ 3. Validar email     │                     │
    │                   │    único             │                     │
    │                   │─────────────────────▶│                     │
    │                   │       (OK)           │                     │
    │                   │◀─────────────────────│                     │
    │                   │                       │                     │
    │                   │ 4. Crear cliente     │                     │
    │                   │─────────────────────▶│  5. Insert client  │
    │                   │                       │─────────────────────▶│
    │                   │                       │        (OK)         │
    │                   │                       │◀─────────────────────│
    │                   │                       │                     │
    │                   │ 6. Ejecutar matching │                     │
    │                   │    (async o sync)    │                     │
    │                   │─────────────────────▶│                     │
    │                   │                       │                     │
    │                   │  7. Buscar props     │                     │
    │                   │      activas          │                     │
    │                   │─────────────────────▶│  8. Query props   │
    │                   │                       │─────────────────────▶│
    │                   │                       │    (results)       │
    │                   │                       │◀─────────────────────│
    │                   │                       │                     │
    │                   │  9. Para cada prop:  │                     │
    │                   │     calculateScore() │                     │
    │                   │       - zona (40%)    │                     │
    │                   │       - tipo (30%)    │                     │
    │                   │       - precio (30%)  │                     │
    │                   │                       │                     │
    │                   │ 10. Filter >= 70%    │                     │
    │                   │     Sort by score    │                     │
    │                   │     Take top 20      │                     │
    │                   │                       │                     │
    │                   │ 11. Update client    │                     │
    │                   │     with matches     │                     │
    │                   │─────────────────────▶│ 12. $set {matches} │
    │                   │                       │─────────────────────▶│
    │                   │                       │        (OK)         │
    │                   │                       │◀─────────────────────│
    │                   │                       │                     │
    │ 13. Response      │                       │                     │
    │    with matches   │                       │                     │
    │◀──────────────────│                       │                     │
    │                   │                       │                     │


┌─────────────────────────────────────────────────────────────────────────────┐
│ SECUENCIA: Crear Propiedad con Matching Automático                         │
└─────────────────────────────────────────────────────────────────────────────┘

  ADMIN                 API                   SERVICIO              DATABASE
   
    │                   │                       │                     │
    │ 1. POST /props    │                       │                     │
    │    {datos...}     │                       │                     │
    │─────────────────▶│                       │                     │
    │                   │ 2. Crear propiedad   │                     │
    │                   │─────────────────────▶│  3. Insert property│
    │                   │                       │─────────────────────▶│
    │                   │                       │        (OK)         │
    │                   │                       │◀─────────────────────│
    │                   │                       │                     │
    │                   │ 4. Encontrar clientes │                     │
    │                   │    con operación      │                     │
    │                   │    = property.opType  │                     │
    │                   │─────────────────────▶│  5. Query clients  │
    │                   │                       │─────────────────────▶│
    │                   │                       │   (all active)     │
    │                   │                       │◀─────────────────────│
    │                   │                       │                     │
    │                   │ 6. Para cada cliente:│                     │
    │                   │     calculateScore()  │                     │
    │                   │                       │                     │
    │                   │ 7. Filter >= 70%      │                     │
    │                   │     Add to client's   │                     │
    │                   │     matches array     │                     │
    │                   │                       │                     │
    │                   │ 8. Bulk update       │                     │
    │                   │    all clients        │─────────────────────▶│
    │                   │                       │        (OK)         │
    │                   │                       │                     │
    │ 9. Notify?        │                       │                     │
    │   (future)        │                       │                     │
```

### Algoritmo de Scoring (Detalle)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CALCULO DE SCORE - DETALLE                              │
└─────────────────────────────────────────────────────────────────────────────┘

SCORE TOTAL = (ZONE × 0.40) + (TYPE × 0.30) + (PRICE × 0.30)


┌─────────────────────────────────────────────────────┐
│ 1. ZONE SCORE (40%)                                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ┌─────────────┐    ┌─────────────┐               │
│   │ Preference  │    │  Property   │   SCORE       │
│   │─────────────│    │─────────────│───────────    │
│   │ city=A      │ vs │ city=A      │   100         │
│   │ province=B  │ vs │ province=B  │   100         │
│   │             │    │             │               │
│   │ city=A      │ vs │ city=B      │   0          │
│   │             │    │             │               │
│   │ province=A  │ vs │ province=B  │   60         │
│   │             │    │             │               │
│   │ barrio=Norte│ vs │barrio=Norte │  +20 bonus   │
│   └─────────────┘    └─────────────┘   (max 100)   │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 2. PROPERTY TYPE SCORE (30%)                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ┌─────────────┐    ┌─────────────┐               │
│   │ Preference  │    │  Property   │   SCORE       │
│   │─────────────│    │─────────────│───────────    │
│   │ [casa,dpto] │    │   casa      │   100         │
│   │             │    │             │               │
│   │ [casa]      │    │   dpto      │   0           │
│   │             │    │             │               │
│   │ [] (any)    │    │   any       │   50          │
│   └─────────────┘    └─────────────┘               │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 3. PRICE SCORE (30%)                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ┌─────────────────────────────────────────────┐  │
│   │ Preference: min=100k, max=200k              │  │
│   ├───────────────────┬─────────────────┬────────┤  │
│   │ Property Price    │ Logic           │ SCORE  │  │
│   ├───────────────────┼─────────────────┼────────┤  │
│   │ 150k (in range)  │ exact match     │  100   │  │
│   │ 80k  (below min) │ 20k diff = 20%  │  60   │  │
│   │ 250k (above max) │ 50k diff = 25%  │  50   │  │
│   │ 300k (way above) │ 50% diff        │  0    │  │
│   └───────────────────┴─────────────────┴────────┘  │
│                                                     │
│   Formula:                                          │
│   - In range: 100                                   │
│   - Below min: max(0, 100 - diff% × 2)             │
│   - Above max: max(0, 100 - diff% × 2)            │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ EJEMPLO COMPLETO                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Client preferences:                                │
│   - operationType: "venta"                         │
│   - propertyTypes: [casa-id]                       │
│   - zones: [{ city: general-roca }]                │
│   - priceRange: { min: 100k, max: 200k }          │
│                                                     │
│ Property A:                                         │
│   - type: casa                                     │
│   - city: general-roca                             │
│   - price: 150k                                    │
│                                                     │
│ Calculation:                                        │
│   - Zone: 100 × 0.40 = 40.0                       │
│   - Type: 100 × 0.30 = 30.0                       │
│   - Price: 100 × 0.30 = 30.0                      │
│   ─────────────────────────────────────            │
│   TOTAL: 100                                        │
│   ✅ MATCH (>= 70 threshold)                       │
│                                                     │
│ ──────────────────────────────────────────────────  │
│                                                     │
│ Property B:                                         │
│   - type: terreno                                  │
│   - city: bariloche                                │
│   - price: 80k                                      │
│                                                     │
│ Calculation:                                        │
│   - Zone: 0 × 0.40 = 0.0                          │
│   - Type: 0 × 0.30 = 0.0                           │
│   - Price: 80 × 0.30 = 24.0                       │
│   ─────────────────────────────────────            │
│   TOTAL: 24                                         │
│   ❌ NO MATCH (< 70 threshold)                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Flujo de Datos Completo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ARQUITECTURA DE DATOS - MATCHING                     │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
    │   CLIENT    │      │  MATCHING   │      │  PROPERTY   │
    │   (MongoDB) │◀────▶│   ENGINE    │◀────▶│  (MongoDB)  │
    └─────────────┘      └─────────────┘      └─────────────┘
         │                      │                      │
         │ preferences:         │                      │
         │   - operationType    │  status: active     │
         │   - propertyTypes   │  operationType       │
         │   - zones           │  propertyType        │
         │   - priceRange      │  address             │
         │   - features       │  price               │
         │                      │                      │
         │ matches: [] ◀────────│── score: number     │
         │   - property ref    │   breakdown         │
         │   - score (0-100)   │   matchedAt         │
         │   - status          │   status            │
         │   - matchedAt       │                      │
         │                      │                      │
         ▼                      ▼                      ▼
    ┌─────────────────────────────────────────────────────────────┐
    │                    CONSIDERACIONES DE RENDIMIENTO            │
    ├─────────────────────────────────────────────────────────────┤
    │  • Matching en background (async) para propiedades nuevas  │
    │  • Matching sync para clientes nuevos (respuesta inmediata)│
    │  • Índice compuesto en operationType + status              │
    │  • Cachear resultados por 1 hora                            │
    │  • Batch matching nocturno (off-peak)                       │
    │  • Límite de 20 matches por cliente                         │
    └─────────────────────────────────────────────────────────────┘
```

---

## 7. Consideraciones Adicionales

### 7.1 Rendimiento
- Matching asíncrono para propiedades nuevas (no bloquear respuesta)
- Job programado (cron) para matching nocturno
- Índices apropiados en MongoDB para queries de matching

### 7.2 Notificaciones (Futuro)
- Notificar al cliente cuando hay nuevos matches
- Notificar al agente asignado sobre matches de sus clientes

### 7.3 Historial
- Mantener historial de matches anteriores
- Registrar cuando cliente rechaza propiedad

### 7.4 Métricas
- Trackear conversión: match → visita → operación
- Score promedio por zona/tipo
- Clientes sin matches (ajustar preferencias)

---

## 8. Próximos Pasos (Implementación)

1. **Fase 1**: Modelos, DTOs, Repositorio
2. **Fase 2**: CRUD básico de clientes
3. **Fase 3**: Matching service
4. **Fase 4**: Integración con eventos (create/update)
5. **Fase 5**: UI - Lista y Formulario
6. **Fase 6**: UI - Resultados de matching
7. **Fase 7**: Dashboard y métricas

---

*Documento generado el 2026-03-12*
*Basado en arquitectura existente: Next.js 16, MongoDB/Mongoose, TypeScript strict*
