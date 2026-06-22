# Design: Sistema de Videos en Propiedades

## Technical Approach

Extender el modelo Property con un campo `videos: string[]` siguiendo el patrón exacto de `images`. Crear un nuevo endpoint `/api/uploadVideo` (mismo mecanismo que `/api/uploadImg` pero para video/*). Componentes UI separados para upload y visualización. Sin mezclar con la galería de imágenes existente.

## Architecture Decisions

### Decision: Endpoint separado vs. extendido

| Opción | Trade-off | Decisión |
|--------|-----------|----------|
| Extender `/api/uploadImg` | Misma ruta, más params | ❌ Complejidad condicional, rompe compatibilidad |
| **Nuevo `/api/uploadVideo`** | **Deduplicación mínima, cada uno hace una cosa** | **✅ Elegido** |

### Decision: Modal reproductor vs. inline

| Opción | Trade-off | Decisión |
|--------|-----------|----------|
| Inline player | Ocupa espacio, múltiples players cargan recursos | ❌ Pesado |
| **Modal overlay** | **Un player a la vez, libera recursos al cerrar** | **✅ Elegido** |

### Decision: Validación de límite de videos

| Opción | Trade-off | Decisión |
|--------|-----------|----------|
| Backend-only | El frontend puede enviar 4+ y recibir error | ❌ Mala UX |
| **Frontend + Backend** | **Doble validación: UX inmediata + seguridad** | **✅ Elegido** |

## Data Flow

### Upload flow
```
User selects video → VideoUploader component
  → POST /api/uploadVideo (FormData: file)
    → Cloudinary upload_stream
    → Returns { success, data: [url] }
  → VideoUploader adds URL to local state
  → Shows thumbnail (Cloudinary auto: url + "w_300" transform)
```

### Create/Edit property flow
```
PropertyForm/EditPropertyForm submits
  → JSON includes videos: ["url1", "url2"]
  → CreatePropertyDTO / UpdatePropertyDTO
  → PropertyService.create / .update
  → PropertyModel saves videos field
```

### Display flow
```
PropertyPageDetail (server) fetches property
  → propertyResponseDTO includes videos[]
  → PropertyDetailClient (client) renders:
    1. PropertyGallery (existing — images)
    2. VideoGallery (new — videos)
       → Grid of thumbnails
       → Click → VideoModal (HTML5 video player)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/db/schemas/property.schema.ts` | Modify | Add `videos: { type: [String], default: [] }` |
| `src/domain/interfaces/property.interface.ts` | Modify | Add `videos: string[]` to IProperty |
| `src/domain/types/Property.types.ts` | Modify | Add `videos: string[]` |
| `src/domain/types/PropertyUI.types.ts` | Modify | Add `videos: string[]` |
| `src/dtos/property/create-property.dto.ts` | Modify | Add `videos: string[]` field + validation (max 3) |
| `src/dtos/property/update-property.dto.ts` | Modify | Add `videos: string[]` field |
| `src/dtos/property/property-response.dto.ts` | Modify | Map `videos` in response |
| `src/server/services/property.service.ts` | Modify | Add `videos` to create mapping + simpleFields in update |
| `src/app/api/uploadVideo/route.ts` | **New** | Cloudinary video upload, MIME validation, size validation |
| `src/components/CloudinaryUploader/VideoUploader.tsx` | **New** | Reusable video upload component (thumbnails, remove, limit 3) |
| `src/components/shared/PropertyForm/PropertyForm.tsx` | Modify | Add videos state + VideoUploader section |
| `src/components/shared/EditPropertyForm/EditPropertyForm.tsx` | Modify | Add videos state + VideoUploader section |
| `src/components/shared/PropertyDetailClient/VideoGallery.tsx` | **New** | Thumbnail grid + modal player |
| `src/components/shared/PropertyDetailClient/PropertyDetailClient.tsx` | Modify | Import and render VideoGallery |
| `src/domain/mappers/mapPropertyToUI.ts` | Modify | Map `videos` |
| `src/domain/mappers/propertyToForm.mapper.ts` | Modify | Map `videos` |

## Interfaces / Contracts

### UploadVideo API Response
```typescript
// POST /api/uploadVideo
// Request: FormData { file: File }
// Success 200: { success: true, data: [string] }  // Cloudinary URL
// Error 400: { success: false, error: string }
// Error 500: { success: false, error: string }
```

### VideoUploader Props
```typescript
interface VideoUploaderProps {
  onVideosChange: (urls: string[]) => void;
  existingVideos?: string[];  // URLs already uploaded
  maxVideos?: number;          // default 3
}
```

### Cloudinary Thumbnail URL
```
Given: https://res.cloudinary.com/demo/video/upload/v123/sample.mp4
Thumb: https://res.cloudinary.com/demo/video/upload/w_300/q_auto/v123/sample.jpg
Pattern: Replace /upload/ with /upload/w_300/q_auto/ and change extension to .jpg
```

## Testing Strategy

| Layer | What | How |
|-------|------|-----|
| Unit | DTO validation (max 3 videos) | Vitest — create/update DTO with 4 videos expects error |
| Unit | ResponseDTO mapping | Vitest — propertyResponseDTO includes videos |
| Unit | VideoUploader component | Vitest — render, add, remove, limit enforcement |
| Integration | Upload API | Vitest — valid file returns URL, invalid type returns 400 |
| Integration | Create/Update property with videos | Vitest — full request/response cycle |

## Migration / Rollout

No migration required. New field defaults to `[]` for existing documents. MongoDB doesn't enforce schema, so existing properties without `videos` will work with the `|| []` fallback in queries.

## Open Questions

None.
