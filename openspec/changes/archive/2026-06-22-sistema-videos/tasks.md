# Tasks: Sistema de Videos en Propiedades

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~300 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Backend: schema + API + upload route | PR 1 | Main branch |
| 2 | Frontend: components + forms + detail view | PR 1 | Same PR, ~300 lines total |

## Phase 1: Backend — Data Layer & API

- [ ] 1.1 `src/db/schemas/property.schema.ts` — Add `videos: { type: [String], default: [] }`
- [ ] 1.2 `src/domain/interfaces/property.interface.ts` — Add `videos: string[]` to IProperty
- [ ] 1.3 `src/domain/types/Property.types.ts` — Add `videos: string[]`
- [ ] 1.4 `src/domain/types/PropertyUI.types.ts` — Add `videos: string[]`
- [ ] 1.5 `src/dtos/property/create-property.dto.ts` — Add `videos: string[]` + max 3 validation
- [ ] 1.6 `src/dtos/property/update-property.dto.ts` — Add `videos: string[]`
- [ ] 1.7 `src/dtos/property/property-response.dto.ts` — Map `videos` in response
- [ ] 1.8 `src/server/services/property.service.ts` — Add `videos` to create() mapping + update() simpleFields
- [ ] 1.9 `src/app/api/uploadVideo/route.ts` — **New**: Cloudinary upload, validate MIME types (mp4/webm/mov), max 50MB per file, return URL

## Phase 2: Frontend — Components

- [ ] 2.1 `src/components/CloudinaryUploader/VideoUploader.tsx` — **New**: Video upload component with thumbnail preview, remove button, max 3 limit, drag-to-reorder
- [ ] 2.2 `src/components/shared/PropertyForm/PropertyForm.tsx` — Add `videos` state + VideoUploader section below images
- [ ] 2.3 `src/components/shared/EditPropertyForm/EditPropertyForm.tsx` — Add `videos` state + VideoUploader section, load existing videos
- [ ] 2.4 `src/domain/mappers/mapPropertyToUI.ts` — Map `videos` from PropertyResponse
- [ ] 2.5 `src/domain/mappers/propertyToForm.mapper.ts` — Map `videos` from PropertyResponse

## Phase 3: Frontend — Detail Page

- [ ] 3.1 `src/components/shared/PropertyDetailClient/VideoGallery.tsx` — **New**: Thumbnail grid (3-col), modal with HTML5 video player, close on overlay click/button, stop playback on close
- [ ] 3.2 `src/components/shared/PropertyDetailClient/PropertyDetailClient.tsx` — Import and render VideoGallery below PropertyGallery (conditional: only if videos.length > 0)
