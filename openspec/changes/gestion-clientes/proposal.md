# Proposal: Sistema de Gestión de Clientes (CRM)

## Intent

Crear un sistema de gestión de clientes en el panel de admin para que los administradores puedan cargar, editar, visualizar y eliminar clientes potenciales. Esto permitirá cruzar datos con propiedades y dar seguimiento a prospectos de compra/venta.

**Necesidad del usuario**: 
- Registrar clientes con información de contacto completa
- Registrar intereses (vender, comprar) y tipo de propiedad que buscan
- Visualizar todos los clientes en el dashboard (mobile + desktop)
- Almacenar notas relevantes para cada cliente

## Scope

### In Scope
1. **Modelo de datos MongoDB**: Schema `Client` con:
   - Nombre y apellido
   - Número de contacto (teléfono)
   - Email
   - Dirección (calle, número, ciudad, provincia)
   - Notas (texto libre)
   - Intereses: array de valores (vender, comprar, alquilar)
   - **Zona/Barrio de interés** (requerido para matching)
   - **Rango de precio de interés** (min, max - requerido para matching)
   - Tipo de propiedad de interés (ref a PropertyType)
   - Estado (activo/inactivo)
   - Fechas de creación y actualización

2. **API REST**: Endpoints CRUD:
   - `GET /api/clients` - Listar con filtros y paginación
   - `POST /api/clients` - Crear cliente
   - `GET /api/clients/:id` - Obtener cliente por ID
   - `PUT /api/clients/:id` - Actualizar cliente
   - `DELETE /api/clients/:id` - Eliminar cliente

3. **Capa de servicio y repositorio**:
   - `ClientService` con validación de negocio
   - `ClientRepository` para acceso a datos

4. **DTOs**:
   - `CreateClientDTO`
   - `UpdateClientDTO`
   - `ClientResponseDTO`

5. **UI del Admin**:
   - Página `/admin/clients` con grid responsive
   - Modal para crear/editar clientes
   - Cards de visualización (mobile + desktop)
    - Filtros por interés (vender/comprar)

6. **Sistema de Matching Automático**:
   - Lógica de matching en `ClientService`:
     - Detectar clientes con intereses complementarios (uno vende, otro compra/alquila)
     - Matching por zona/barrio de interés (mismo barrio)
     - Matching por tipo de propiedad compatible
     - Matching por rango de precio overlap:
       - Vendedor pide X, Comprador ofrece rango Y-Z → hay overlap si Y ≤ X ≤ Z
       - Alquiler: mismo análisis con precios de alquiler
   - Endpoint `POST /api/clients/match` - ejecutar matching manual
   - **Trigger automático**: Al crear/actualizar un cliente, el sistema verifica matches
   - Guardar matches encontrados en colección `ClientMatch`:
     - Cliente A (vendedor), Cliente B (comprador)
     - Zona de match
     - Score de compatibilidad (porcentaje)
     - Fecha de detección

7. **UI de Matches**:
   - Badge/aviso en dashboard de admin cuando hay nuevos matches
   - Sección `/admin/clients/matches` para ver todos los matches
   - Cards mostrando: cliente A ↔ cliente B + zona + score
   - Click para ver detalles completos de ambos clientes
   - Marcar match como "contactado" o "descartado"

### Out of Scope
- Autenticación de clientes (no es un portal público)
- Historial de interacciones detallado
- Notificaciones automáticas (email/push de matches)
- Integración con WhatsApp API
- Matching con propiedades (solo cliente-cliente)
- Algoritmos complejos de ML para scoring
- Matching automático en tiempo real via websockets

## Approach

**Arquitectura**: Patrón existente del proyecto (Service → Repository → Controller)

1. Crear schema `src/db/schemas/client.schema.ts` siguiendo el patrón de `property.schema.ts`
2. Crear interfaz `src/domain/interfaces/client.interface.ts`
3. Crear DTOs en `src/dtos/client/`
4. Crear repository, service, controller siguiendo patrones existentes
5. Crear API routes en `src/app/api/clients/`
6. Crear página de admin y componentes UI
7. **Schema `ClientMatch`** para almacenar matches encontrados
8. **Servicio de matching** con lógica de detección de compatibilidad
9. **Componente UI** para visualizar matches en dashboard y página dedicada

**UI/UX**: 
- Usar el diseño existente del admin (PropertiesAdminPage)
- Cards responsivas con grid 1-col mobile, 3-col desktop
- Modal para formularios (mismo patrón que PropertyForm)
- shadcn/ui para inputs, selects, checkboxes

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/db/schemas/client.schema.ts` | **Modified** | Agregar campos zona, precioMin, precioMax |
| `src/db/schemas/client-match.schema.ts` | **New** | Schema para matches entre clientes |
| `src/domain/interfaces/client.interface.ts` | **Modified** | Agregar campos de zona y precio |
| `src/domain/interfaces/client-match.interface.ts` | **New** | Interfaz para match |
| `src/dtos/client/` | **Modified** | DTOs actualizados con zona/precio |
| `src/dtos/client-match/` | **New** | DTOs para matching |
| `src/server/repositories/client.repository.ts` | **New** | Repositorio de datos |
| `src/server/repositories/client-match.repository.ts` | **New** | Repositorio de matches |
| `src/server/services/client.service.ts` | **New** | Lógica de negocio + matching |
| `src/server/services/client-match.service.ts` | **New** | Servicio de matching |
| `src/server/controllers/client.controller.ts` | **New** | Controlador API |
| `src/server/controllers/client-match.controller.ts` | **New** | Controlador de matches |
| `src/app/api/clients/route.ts` | **New** | GET, POST |
| `src/app/api/clients/[id]/route.ts` | **New** | GET, PUT, DELETE |
| `src/app/api/clients/match/route.ts` | **New** | POST ejecutar matching |
| `src/app/api/clients/matches/route.ts` | **New** | GET listar matches |
| `src/app/admin/clients/page.tsx` | **New** | Página del admin |
| `src/components/shared/ClientsAdminPage/` | **New** | Componente cliente |
| `src/components/shared/ClientForm/` | **New** | Formulario crear/editar |
| `src/components/shared/ClientMatchesPage/` | **New** | Página de matches |
| `src/components/shared/MatchCard/` | **New** | Card para mostrar match |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Conflictos con tipos existentes | Low | Usar prefijos `client` en campos |
| Validación de datos | Medium | Validar email formato, teléfono requerido |
| Performance con muchos clientes | Low | Paginación en el listar |
| **Matching lento con muchos clientes** | Medium | Ejecutar matching en background, paginar resultados |
| **Datos de zona inconsistentes** | Medium | Usar dropdown con zonas predefinidas (tabla Zone) |
| **Price range ambiguo** | High | Validar que precioMin < precioMax, campos opcionales con defaults |
| **Matches falsos positivos** | Medium | Score de compatibilidad, permitir descartar matches |
| **Duplicación de matches** | Low | Verificar antes de guardar nuevo match |

## Rollback Plan

1. Eliminar archivos creados:
   - `src/db/schemas/client.schema.ts`
   - `src/db/schemas/client-match.schema.ts`
   - `src/domain/interfaces/client.interface.ts`
   - `src/domain/interfaces/client-match.interface.ts`
   - `src/dtos/client/`
   - `src/dtos/client-match/`
   - `src/server/repositories/client.repository.ts`
   - `src/server/repositories/client-match.repository.ts`
   - `src/server/services/client.service.ts`
   - `src/server/services/client-match.service.ts`
   - `src/server/controllers/client.controller.ts`
   - `src/server/controllers/client-match.controller.ts`
   - `src/app/api/clients/`
   - `src/app/admin/clients/`
   - `src/components/shared/ClientsAdminPage/`
   - `src/components/shared/ClientForm/`
   - `src/components/shared/ClientMatchesPage/`
   - `src/components/shared/MatchCard/`

2. Eliminar colección `clientMatches` de MongoDB (si existe)

## Dependencies

- MongoDB connection existente (`src/db/connection.ts`)
- Shadcn/ui components existentes (input, textarea, select, checkbox)
- PropertyType existente para referencias
- Zone existente para dropdown de zonas
- Modelo Zone existente para obtener lista de zonas

## Success Criteria

- [ ] Cliente puede crear un nuevo cliente con todos los campos
- [ ] Cliente puede editar un cliente existente
- [ ] Cliente puede eliminar un cliente
- [ ] Lista de clientes se muestra correctamente en desktop (grid 3-col)
- [ ] Lista de clientes se muestra correctamente en mobile (grid 1-col)
- [ ] Filtros por interés funcionan correctamente
- [ ] Datos persisten en MongoDB correctamente
- [ ] Validaciones impiden datos inválidos
- [ ] **Al crear cliente, se detectan matches automáticamente**
- [ ] **Matches muestran correctamente en dashboard (badge con count)**
- [ ] **Página de matches lista todos los matches con score**
- [ ] **Click en match muestra detalles de ambos clientes**
- [ ] **Matching considera: zona, operación complementaria, tipo propiedad, overlap de precios**
- [ ] **Se puede marcar match como contactado/descartado**
