# API de Muebles


> **Autorización:** Las rutas que restrigen por rol usan `requireRoles(...)` (`src/presentation/middlewares/roles.middleware.ts`) con valores en `src/common/constants/roles.ts` (p. ej. `admin`, `recepcionista`). Cualquier mención a "ADMIN" u otros roles aquí es orientativa; la fuente de verdad es el `*.routes.ts` correspondiente.


Documentación del módulo `muebles.routes.ts`: gestión de muebles del hotel.

## Base URL

```
/api/private/muebles
```

## Orden de endpoints

1. `GET /` — listar (paginado con filtros)
2. `GET /all` — listar todos (sin paginado ni filtros)
3. `GET /:id` — por id
4. `POST /` — crear (`multipart/form-data` si hay imágenes)
5. `PUT /:id` — actualizar (`multipart/form-data` si hay imágenes)
6. `DELETE /:id` — eliminar

## Imágenes (S3 / multipart)

Creación y actualización aceptan `multipart/form-data` con campos de mueble y archivos de imagen; las URLs resultantes se guardan en `url_imagen`. Variables de entorno S3: `S3_REGION`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`, `S3_FORCE_PATH_STYLE`.

En las respuestas, el objeto anidado `categoria` sigue el mismo contrato que **Categoría de mueble** (`CategoriaMuebleDto`: incluye `id`, `nombre`, `descripcion`, `activo`, `created_at`, `updated_at`).

## Endpoints

### 1. Listar Muebles (Paginado)

Obtiene la lista de muebles con soporte para paginación y filtros.

**Endpoint:** `GET /api/private/muebles`

**Autenticación:** Requerida (Admin)

**Query Parameters:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `page` | number | No | Número de página (default: 1) |
| `limit` | number | No | Registros por página (default: 10, máx: 100) |
| `nombre` | string | No | Filtrar por nombre (búsqueda case-insensitive) |
| `categoria` | string | No | Filtrar por nombre de categoría (búsqueda case-insensitive) |
| `condicion` | enum | No | Filtrar por condición: BUENO, REGULAR, DANADO, FALTANTE |

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Muebles obtenidos exitosamente",
  "data": {
    "list": [
      {
        "id": "uuid-mueble-1",
        "codigo": "CAMA-001",
        "nombre": "Cama King Size",
        "descripcion": "Cama de lujo",
        "categoria": {
          "id": "uuid-categoria",
          "nombre": "Cama",
          "descripcion": "Muebles para dormir",
          "activo": true,
          "created_at": "2026-03-24T08:00:00.000Z",
          "updated_at": "2026-03-24T08:00:00.000Z"
        },
        "url_imagen": "https://example.com/cama.jpg",
        "condicion": "BUENO",
        "fecha_adquisicion": "2025-01-15",
        "ultima_revision": "2026-03-01",
        "habitacion_id": "uuid-habitacion",
        "created_at": "2026-03-24T08:00:00.000Z",
        "updated_at": "2026-03-24T08:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  },
  "timestamp": 1711267200000
}
```

**Errores:**

- `400 Bad Request`: Parámetros de paginación inválidos
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No tiene permisos de administrador

---

### 2. Listar Todos los Muebles (Sin paginado)

Obtiene la lista de todos los muebles sin paginación ni filtros.

**Endpoint:** `GET /api/private/muebles/all`

**Autenticación:** Requerida (Admin)

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Muebles obtenidos exitosamente",
  "data": [
    {
      "id": "uuid-mueble-1",
      "codigo": "CAMA-001",
      "nombre": "Cama King Size",
      "descripcion": "Cama de lujo",
      "categoria": {
        "id": "uuid-categoria",
        "nombre": "Cama",
        "descripcion": "Muebles para dormir",
        "activo": true,
        "created_at": "2026-03-24T08:00:00.000Z",
        "updated_at": "2026-03-24T08:00:00.000Z"
      },
      "url_imagen": "https://example.com/cama.jpg",
      "condicion": "BUENO",
      "fecha_adquisicion": "2025-01-15",
      "ultima_revision": "2026-03-01",
      "habitacion_id": "uuid-habitacion",
      "created_at": "2026-03-24T08:00:00.000Z",
      "updated_at": "2026-03-24T08:00:00.000Z"
    }
  ],
  "timestamp": 1711267200000
}
```

**Errores:**

- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No tiene permisos de administrador

---

### 3. Obtener Mueble por ID

Obtiene los detalles de un mueble específico.

**Endpoint:** `GET /api/private/muebles/:id`

**Autenticación:** Requerida (Admin)

**Parámetros de URL:**

- `id` (uuid, requerido): ID del mueble

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Mueble encontrado",
  "data": {
    "id": "uuid-mueble",
    "codigo": "CAMA-001",
    "nombre": "Cama King Size",
    "descripcion": "Cama de lujo con colchón ortopédico",
    "categoria": {
      "id": "uuid-categoria",
      "nombre": "Cama",
      "descripcion": "Muebles para dormir",
      "activo": true,
      "created_at": "2026-03-24T08:00:00.000Z",
      "updated_at": "2026-03-24T08:00:00.000Z"
    },
    "url_imagen": "https://example.com/cama.jpg",
    "condicion": "BUENO",
    "fecha_adquisicion": "2025-01-15",
    "ultima_revision": "2026-03-01",
    "habitacion_id": "uuid-habitacion",
    "created_at": "2026-03-24T08:00:00.000Z",
    "updated_at": "2026-03-24T08:00:00.000Z"
  },
  "timestamp": 1711267200000
}
```

**Errores:**

- `400 Bad Request`: ID inválido
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No tiene permisos de administrador
- `404 Not Found`: Mueble no encontrado

---

### 4. Crear Mueble

Crea un nuevo mueble en el sistema. Acepta `multipart/form-data` si se incluyen imágenes.

**Endpoint:** `POST /api/private/muebles`

**Autenticación:** Requerida (Admin)

**Body (`multipart/form-data`):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `codigo` | string | Sí | Código único (máx. 30 caracteres) |
| `nombre` | string | Sí | Nombre del mueble (máx. 100 caracteres) |
| `categoria_id` | uuid | Sí | ID de la categoría del mueble |
| `descripcion` | string | No | Descripción detallada |
| `imagen` | File | No | Archivo de imagen a subir a S3 |
| `condicion` | enum | No | BUENO, REGULAR, DANADO, FALTANTE (default: BUENO) |
| `fecha_adquisicion` | date | No | Fecha en formato YYYY-MM-DD |
| `ultima_revision` | date | No | Fecha en formato YYYY-MM-DD |
| `habitacion_id` | uuid | No | ID de la habitación donde se encuentra |

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Mueble creado exitosamente",
  "data": {
    "id": "uuid-mueble",
    "codigo": "CAMA-001",
    "nombre": "Cama King Size",
    "descripcion": "Cama de lujo con colchón ortopédico",
    "categoria": {
      "id": "uuid-categoria",
      "nombre": "Cama",
      "descripcion": "Muebles para dormir",
      "activo": true,
      "created_at": "2026-03-24T08:00:00.000Z",
      "updated_at": "2026-03-24T08:00:00.000Z"
    },
    "url_imagen": "https://s3.amazonaws.com/bucket/uuid-cama.jpg",
    "condicion": "BUENO",
    "fecha_adquisicion": "2025-01-15",
    "ultima_revision": "2026-03-01",
    "habitacion_id": "uuid-habitacion",
    "created_at": "2026-03-24T08:00:00.000Z",
    "updated_at": "2026-03-24T08:00:00.000Z"
  },
  "timestamp": 1711267200000
}
```

**Errores:**

- `400 Bad Request`: Datos de entrada inválidos
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No tiene permisos de administrador
- `404 Not Found`: Categoría o habitación no encontrada
- `409 Conflict`: Ya existe un mueble con ese código

---

### 5. Actualizar Mueble

Actualiza la información de un mueble existente. Acepta `multipart/form-data` si se incluyen imágenes.

**Endpoint:** `PUT /api/private/muebles/:id`

**Autenticación:** Requerida (Admin)

**Parámetros de URL:**

- `id` (uuid, requerido): ID del mueble

**Body (`multipart/form-data`):**

Todos los campos son opcionales. Solo se actualizarán los campos proporcionados.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `codigo` | string | Código único (máx. 30 caracteres) |
| `nombre` | string | Nombre del mueble (máx. 100 caracteres) |
| `categoria_id` | uuid | ID de la categoría del mueble |
| `descripcion` | string | Descripción detallada |
| `imagen` | File | Archivo de imagen (vacío para eliminar, no enviar para mantener) |
| `condicion` | enum | BUENO, REGULAR, DANADO, FALTANTE |
| `fecha_adquisicion` | date | Fecha en formato YYYY-MM-DD |
| `ultima_revision` | date | Fecha en formato YYYY-MM-DD |
| `habitacion_id` | uuid | ID de la habitación (null para desasignar) |

**Notas sobre imágenes:**
- No enviar campo `imagen`: Mantiene la imagen actual.
- Enviar nueva imagen: Elimina la anterior y sube la nueva.
- Enviar `imagen` vacío: Elimina la imagen del S3.

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Mueble actualizado exitosamente",
  "data": {
    "id": "uuid-mueble",
    "codigo": "CAMA-002",
    "nombre": "Cama Queen Size",
    "descripcion": "Cama queen actualizada",
    "categoria": {
      "id": "uuid-categoria",
      "nombre": "Cama",
      "descripcion": "Muebles para dormir",
      "activo": true,
      "created_at": "2026-03-24T08:00:00.000Z",
      "updated_at": "2026-03-24T08:00:00.000Z"
    },
    "url_imagen": "https://s3.amazonaws.com/bucket/uuid-cama-nueva.jpg",
    "condicion": "REGULAR",
    "fecha_adquisicion": "2025-02-01",
    "ultima_revision": "2026-03-15",
    "habitacion_id": "uuid-habitacion-nueva",
    "created_at": "2026-03-24T08:00:00.000Z",
    "updated_at": "2026-03-24T09:00:00.000Z"
  },
  "timestamp": 1711270800000
}
```

**Errores:**

- `400 Bad Request`: Datos de entrada inválidos o ID inválido
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No tiene permisos de administrador
- `404 Not Found`: Mueble o habitación no encontrada
- `409 Conflict`: Ya existe otro mueble con ese código

---

### 6. Eliminar Mueble

Elimina un mueble del sistema.

**Endpoint:** `DELETE /api/private/muebles/:id`

**Autenticación:** Requerida (Admin)

**Parámetros de URL:**

- `id` (uuid, requerido): ID del mueble

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Mueble eliminado exitosamente",
  "data": null,
  "timestamp": 1711267200000
}
```

**Errores:**

- `400 Bad Request`: ID inválido
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No tiene permisos de administrador
- `404 Not Found`: Mueble no encontrado

---

## Enumeraciones

### Condición del Mueble

```typescript
enum MuebleCondition {
  BUENO = "BUENO",       // Mueble en buen estado
  REGULAR = "REGULAR",   // Mueble con desgaste normal
  DANADO = "DANADO",     // Mueble dañado que requiere reparación
  FALTANTE = "FALTANTE", // Mueble faltante o extraviado
}
```

---

## Estructura de Datos

### Objeto Mueble

```typescript
{
  id: string;                        // UUID del mueble
  codigo: string;                    // Código único (máx. 30 caracteres)
  nombre: string;                    // Nombre del mueble (máx. 100 caracteres)
  descripcion: string | null;        // Descripción detallada
  categoria: CategoriaMuebleDto;     // Objeto categoría completo
  url_imagen: string | null;         // URL de la imagen en S3
  condicion: MuebleCondition;        // Estado del mueble
  fecha_adquisicion: string | null;  // Fecha en formato YYYY-MM-DD
  ultima_revision: string | null;    // Fecha en formato YYYY-MM-DD
  habitacion_id: string | null;      // UUID de la habitación (puede ser null)
  created_at: string;                // Timestamp ISO 8601
  updated_at: string;                // Timestamp ISO 8601
}
```

---

## Notas

1. **Autenticación**: Todos los endpoints requieren autenticación mediante Better Auth
2. **Autorización**: Solo usuarios con rol `ADMIN` pueden acceder a estos endpoints
3. **Código único**: El código del mueble debe ser único en el sistema
4. **Formato de fechas**: Las fechas deben estar en formato ISO 8601 (YYYY-MM-DD)
5. **Campos opcionales**: Los campos opcionales pueden omitirse en las peticiones
6. **Validación de relaciones**:
   - La categoría debe existir antes de crear/actualizar un mueble
   - La habitación debe existir si se proporciona `habitacion_id`
7. **Actualización parcial**: Al actualizar, solo se modifican los campos proporcionados en el request
8. **Muebles sin asignar**: Un mueble puede existir sin estar asignado a ninguna habitación (`habitacion_id: null`)
9. **Imágenes**:
   - La imagen se sube a S3 y la URL se almacena en `url_imagen`.
   - No enviar campo `imagen`: Mantiene la imagen actual.
   - Enviar nueva imagen: Elimina la anterior y sube la nueva.
   - Enviar campo `imagen` vacío: Elimina la imagen del S3.
10. **Condición por defecto**: Si no se especifica, la condición del mueble será `BUENO`

---

## Ejemplos de Uso

### Crear mueble sin habitación asignada

```bash
curl -X POST https://api.hotel.com/api/private/muebles \
  -H "Authorization: Bearer <token>" \
  -F "codigo=SILLA-001" \
  -F "nombre=Silla de Escritorio" \
  -F "categoria_id=uuid-categoria"
```

### Crear mueble con imagen

```bash
curl -X POST https://api.hotel.com/api/private/muebles \
  -H "Authorization: Bearer <token>" \
  -F "codigo=CAMA-001" \
  -F "nombre=Cama King Size" \
  -F "categoria_id=uuid-categoria" \
  -F "imagen=@/path/to/cama.jpg"
```

### Desasignar mueble de una habitación

```bash
curl -X PUT https://api.hotel.com/api/private/muebles/:id \
  -H "Authorization: Bearer <token>" \
  -F "habitacion_id="
```

### Actualizar solo la condición

```bash
curl -X PUT https://api.hotel.com/api/private/muebles/:id \
  -H "Authorization: Bearer <token>" \
  -F "condicion=DANADO"
```

### Actualizar imagen de mueble

```bash
curl -X PUT https://api.hotel.com/api/private/muebles/:id \
  -H "Authorization: Bearer <token>" \
  -F "imagen=@/path/to/nueva-imagen.jpg"
```

### Eliminar imagen de mueble

```bash
curl -X PUT https://api.hotel.com/api/private/muebles/:id \
  -H "Authorization: Bearer <token>" \
  -F "imagen="
```

### Mantener imagen actual

```bash
curl -X PUT https://api.hotel.com/api/private/muebles/:id \
  -H "Authorization: Bearer <token>" \
  -F "nombre=NuevoNombre"
```