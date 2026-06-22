# Proposal: Sistema de Videos en Propiedades

## Intent

Agregar soporte para subir y visualizar videos en las propiedades del sistema inmobiliario. Actualmente las propiedades soportan imágenes (images, imagesDesktop, imagesMobile). Se extenderá el modelo para incluir videos subidos a Cloudinary, con una galería separada en la página de detalle.

**Necesidad del usuario**: 
- Poder subir hasta 3 videos por propiedad (recorridos virtuales, entrevistas, drone shots)
- Visualizar los videos con thumbnail en la página de detalle de la propiedad
- Tanto en creación como en edición de propiedades

## Scope

### In Scope
1. **Modelo de datos**: Nuevo campo `videos: [String]` en el schema de Property (MongoDB), almacena URLs de Cloudinary
2. **Upload API**: Extender `/api/uploadImg` para que también acepte videos, o crear `/api/uploadVideo` con:
   - Validación de tipo de archivo (mp4, webm, mov)
   - Validación de tamaño máximo (ej: 50MB)
   - Subida a Cloudinary con folder separado
3. **DTOs**:
   - `CreatePropertyDTO`: agregar campo `videos: string[]`
   - `UpdatePropertyDTO`: agregar campo `videos: string[]`
   - `propertyResponseDTO`: transformar `videos` en la respuesta API
4. **Service**: 
   - `create()`: mapear `videos` del DTO al documento
   - `update()`: incluir `videos` en los campos simples a actualizar
5. **Frontend Uploader**: Componente `VideoUploader` similar a `CloudinaryUploader` pero para videos:
   - Input de archivo que acepte video/*
   - Validación de tipo y tamaño
   - Mostrar thumbnail del video (Cloudinary: `video/upload/w_200/q_auto/v1/...`)
   - Mostrar nombre/estado del video subido
   - Botón para eliminar video individual
   - Límite de 3 videos
6. **Formulario de creación** (`PropertyForm.tsx`): 
   - Sección de "Videos" debajo de imágenes
   - Integrar `VideoUploader`
   - Estado local para `videos: string[]`
7. **Formulario de edición** (`EditPropertyForm.tsx`):
   - Misma sección de videos
   - Cargar videos existentes desde la propiedad
8. **Página de detalle** (`PropertyDetailClient.tsx`):
   - Nueva sección "Galería de Videos" debajo de la galería de imágenes
   - Si no hay videos, no se muestra la sección
9. **VideoPlayer component**: 
   - Modal/lightbox para reproducir video
   - Controles nativos del browser
   - Thumbnail como preview antes de reproducir
10. **Mappers**:
    - `mapPropertyToUI.ts`: propagar `videos` al UI type
    - `propertyToForm.mapper.ts`: propagar `videos` al form state
11. **Types**:
    - `Property.types.ts`: agregar `videos: string[]`
    - `PropertyUI.types.ts`: agregar `videos: string[]`
    - `IProperty` interface: agregar `videos: string[]`

### Out of Scope
- Reproductor con calidad adaptativa (HLS/DASH)
- Videos en cards de listado / grillas
- Videos incrustados (YouTube, Vimeo)
- Subtítulos, tracks de audio múltiples
- Analíticas de reproducción de video
- Edición/trimmado de video desde el admin

## Approach

**Arquitectura**: Mismo patrón existente de imágenes, replicado para videos.

1. Agregar campo `videos: [String]` al schema de Mongoose (`property.schema.ts`)
2. Agregar `videos: string[]` a IProperty, Property, PropertyUI
3. Agregar handling de `videos` en DTOs (create, update, response)
4. Modificar `property.service.ts` para incluir `videos` en create y update
5. Modificar `/api/uploadImg/route.tsx` o crear `/api/uploadVideo/route.tsx` que use Cloudinary (mismo patrón, aceptando video/*)
6. Crear `VideoUploader` componente reutilizable
7. Integrar en `PropertyForm.tsx` (create) y `EditPropertyForm.tsx` (edit)
8. Crear `VideoGallery` componente para la página de detalle
9. Integrar `VideoGallery` en `PropertyDetailClient.tsx`
10. Actualizar mappers (mapPropertyToUI, propertyToForm)

**UI/UX Videos**:
- Uploader: misma apariencia que CloudinaryUploader, con icono de video
- Thumbnail: Cloudinary genera automáticamente `video/upload/w_300/q_auto/{id}.jpg`
- Galería en detalle: grid de thumbnails 3 columnas, click → modal reproductor
- Modal: overlay oscuro con reproductor HTML5 y botón cerrar
- Sin videos: no renderizar la sección

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/db/schemas/property.schema.ts` | **Modified** | Agregar campo `videos: [String]` |
| `src/domain/interfaces/property.interface.ts` | **Modified** | Agregar `videos: string[]` a IProperty |
| `src/domain/types/Property.types.ts` | **Modified** | Agregar `videos: string[]` |
| `src/domain/types/PropertyUI.types.ts` | **Modified** | Agregar `videos: string[]` |
| `src/dtos/property/create-property.dto.ts` | **Modified** | Agregar campo `videos` |
| `src/dtos/property/update-property.dto.ts` | **Modified** | Agregar campo `videos` |
| `src/dtos/property/property-response.dto.ts` | **Modified** | Transformar `videos` en response |
| `src/server/services/property.service.ts` | **Modified** | Incluir `videos` en create y update |
| `src/app/api/uploadImg/route.tsx` | **Modified** | Agregar soporte para video/* MIME types |
| `src/components/CloudinaryUploader/VideoUploader.tsx` | **New** | Componente uploader de videos |
| `src/components/shared/PropertyForm/PropertyForm.tsx` | **Modified** | Agregar sección de videos |
| `src/components/shared/EditPropertyForm/EditPropertyForm.tsx` | **Modified** | Agregar sección de videos |
| `src/components/shared/PropertyDetailClient/VideoGallery.tsx` | **New** | Galería de videos en detalle |
| `src/components/shared/PropertyDetailClient/VideoModal.tsx` | **New** | Modal reproductor de video |
| `src/components/shared/PropertyDetailClient/PropertyDetailClient.tsx` | **Modified** | Integrar VideoGallery |
| `src/domain/mappers/mapPropertyToUI.ts` | **Modified** | Propagar `videos` |
| `src/domain/mappers/propertyToForm.mapper.ts` | **Modified** | Propagar `videos` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Archivos de video muy grandes (>100MB) | Medium | Validar tamaño máximo (50MB) en upload API |
| Tiempo de subida lento | Medium | Mostrar barra de progreso, subir uno a la vez |
| Formatos de video no soportados por el browser | Low | Validar MIME type (mp4, webm, mov) y advertir |
| Cloudinary rate limits en video | Low | Subir secuencialmente, no en paralelo |
| Video no reproducible en algunos dispositivos | Medium | Usar formato H.264 mp4 (compatible universal) |
| Conflictos con campo `images` existente | Low | Campo separado `videos`, lógica independiente |

## Rollback Plan

1. Revertir cambios en schema: eliminar campo `videos`
2. Revertir cambios en interfaces, types, DTOs
3. Eliminar VideoUploader, VideoGallery, VideoModal components
4. Revertir cambios en PropertyForm, EditPropertyForm, PropertyDetailClient
5. Revertir cambios en upload API
6. Revertir cambios en mappers
7. Revertir cambios en property.service.ts

## Dependencies

- Cloudinary config existente (variables de entorno)
- Componentes UI existentes (button, modal, input)
- `/api/uploadImg` route existente como base
- `CloudinaryUploader` component como referencia de patrón
- `PropertyGallery` como referencia de galería

## Success Criteria

- [ ] Schema tiene campo `videos: [String]` con default []
- [ ] CreatePropertyDTO acepta y valida `videos`
- [ ] UpdatePropertyDTO acepta y valida `videos`
- [ ] propertyResponseDTO devuelve `videos` en API response
- [ ] property.service.ts persiste `videos` en create y update
- [ ] Upload API acepta videos (mp4, webm, mov) y los sube a Cloudinary
- [ ] Upload API rechaza formatos no válidos
- [ ] Upload API rechaza archivos > 50MB
- [ ] VideoUploader permite seleccionar hasta 3 videos
- [ ] VideoUploader muestra thumbnail de cada video subido
- [ ] VideoUploader permite eliminar videos individuales
- [ ] PropertyForm create tiene sección de videos funcional
- [ ] EditPropertyForm carga videos existentes correctamente
- [ ] VideoGallery se muestra en detalle SOLO si hay videos
- [ ] VideoGallery muestra thumbnails en grid
- [ ] Click en thumbnail abre modal con reproductor HTML5
- [ ] Modal reproductor tiene botón de cierre
- [ ] mapPropertyToUI propaga `videos` correctamente
- [ ] propertyToForm.mapper propaga `videos` correctamente
- [ ] Strict TDD: tests pasan después de cada cambio
