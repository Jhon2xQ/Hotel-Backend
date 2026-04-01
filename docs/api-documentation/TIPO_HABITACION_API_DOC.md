# API de Tipos de Habitación

> **Autorización:** Las rutas que restrigen por rol usan `requireRoles(...)` (`src/presentation/middlewares/roles.middleware.ts`) con valores en `src/common/constants/roles.ts` (p. ej. `admin`, `recepcionista`). Cualquier mención a "ADMIN" u otros roles aquí es orientativa; la fuente de verdad es el `*.routes.ts` correspondiente.

Documentación de los endpoints para gestionar los tipos de habitación del hotel.

## Base URL

| Tipo de ruta | URL base |
|--------------|----------|
| Público | `/api/public/tipos-habitacion` |
| Privado | `/api/private/tipos-habitacion` |

## Autenticación

- **Rutas públicas**: No requieren autenticación
- **Rutas privadas**: Requieren sesión de Better Auth

## Orden de endpoints

1. `GET /` — listar (público)
2. `GET /` — listar (privado)
3. `GET /:id` — por id
4. `POST /` — crear (solo privado)
5. `PUT /:id` — actualizar (solo privado)
6. `DELETE /:id` — eliminar (solo privado)

## Endpoints

### 1. Listar Tipos de Habitación (Público)

Obtiene la lista completa de tipos de habitación. No incluye timestamps.

**Endpoint:** `GET /api/public/tipos-habitacion`

**Permisos:** No requiere autenticación

**Query params:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `habitacion` | `boolean` | No | Si es `true`, cada tipo incluye una habitación de ejemplo (muestra) |

**Respuesta exitosa (200) — sin query params:**

```json
{
  "success": true,
  "message": "Tipos de habitación obtenidos exitosamente",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "nombre": "Suite Deluxe",
      "descripcion": "Suite de lujo con vista panorámica al mar"
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "nombre": "Habitación Estándar",
      "descripcion": "Habitación cómoda con todas las comodidades básicas"
    }
  ],
  "timestamp": 1710669600000
}
```

**Respuesta exitosa (200) — con `?habitacion=true`:**

Cada tipo de habitación incluye una habitación de ejemplo (solo una por tipo). Si el tipo no tiene habitaciones, el campo `habitacion` será `null`. La habitación usa `tipo_habitacion_id` en lugar del objeto completo del tipo.

```json
{
  "success": true,
  "message": "Tipos de habitación obtenidos exitosamente",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "nombre": "Suite Deluxe",
      "descripcion": "Suite de lujo con vista panorámica al mar",
      "habitacion": {
        "id": "456e7890-e89b-12d3-a456-426614174000",
        "nro_habitacion": "101",
        "tipo_habitacion_id": "123e4567-e89b-12d3-a456-426614174000",
        "piso": 1,
        "tiene_ducha": true,
        "tiene_banio": true,
        "url_imagen": ["https://ejemplo.com/img1.jpg"],
        "estado": true,
        "descripcion": "Suite con vista al mar"
      }
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "nombre": "Habitación Estándar",
      "descripcion": "Habitación cómoda con todas las comodidades básicas",
      "habitacion": null
    }
  ],
  "timestamp": 1710669600000
}
```

---

### 2. Listar Tipos de Habitación (Privado)

Obtiene la lista completa de tipos de habitación con timestamps.

**Endpoint:** `GET /api/private/tipos-habitacion`

**Permisos:** Usuario autenticado

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Tipos de habitación obtenidos exitosamente",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "nombre": "Suite Deluxe",
      "descripcion": "Suite de lujo con vista panorámica al mar",
      "created_at": "2026-03-17T10:00:00.000Z",
      "updated_at": "2026-03-17T10:00:00.000Z"
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "nombre": "Habitación Estándar",
      "descripcion": "Habitación cómoda con todas las comodidades básicas",
      "created_at": "2026-03-17T09:00:00.000Z",
      "updated_at": "2026-03-17T09:00:00.000Z"
    }
  ],
  "timestamp": 1710669600000
}
```

---

### 4. Obtener Tipo de Habitación por ID

Obtiene los detalles de un tipo de habitación específico.

**Endpoint:** `GET /api/private/tipos-habitacion/:id` (o `/api/public/tipos-habitacion/:id`)

**Permisos:**
- Público: No requiere autenticación
- Privado: Usuario autenticado

**Parámetros de ruta:**

- `id` (UUID, requerido): ID del tipo de habitación

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Tipo de habitación encontrado",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "nombre": "Suite Deluxe",
    "descripcion": "Suite de lujo con vista panorámica al mar",
    "created_at": "2026-03-17T10:00:00.000Z",
    "updated_at": "2026-03-17T10:00:00.000Z"
  },
  "timestamp": 1710669600000
}
```

**Errores:**

- `404`: Tipo de habitación no encontrado

---

### 5. Crear Tipo de Habitación

Crea un nuevo tipo de habitación en el sistema.

**Endpoint:** `POST /api/private/tipos-habitacion`

**Permisos:** Usuario autenticado

**Body (JSON):**

```json
{
  "nombre": "Suite Deluxe",
  "descripcion": "Suite de lujo con vista panorámica al mar"
}
```

**Campos:**

- `nombre` (string, requerido): Nombre del tipo de habitación (máx. 100 caracteres, único)
- `descripcion` (string, opcional): Descripción detallada del tipo de habitación

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "message": "Tipo de habitación creado exitosamente",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "nombre": "Suite Deluxe",
    "descripcion": "Suite de lujo con vista panorámica al mar",
    "created_at": "2026-03-17T10:00:00.000Z",
    "updated_at": "2026-03-17T10:00:00.000Z"
  },
  "timestamp": 1710669600000
}
```

**Errores:**

- `400`: Datos de entrada inválidos
- `401`: No autenticado
- `409`: Nombre duplicado

---

### 6. Actualizar Tipo de Habitación

Actualiza los datos de un tipo de habitación existente.

**Endpoint:** `PUT /api/private/tipos-habitacion/:id`

**Permisos:** Usuario autenticado

**Parámetros de ruta:**

- `id` (UUID, requerido): ID del tipo de habitación

**Body (JSON):**

```json
{
  "nombre": "Suite Deluxe Premium",
  "descripcion": "Suite de lujo premium con vista panorámica al mar y jacuzzi"
}
```

**Campos:** Todos opcionales, mismas validaciones que en crear

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Tipo de habitación actualizado exitosamente",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "nombre": "Suite Deluxe Premium",
    "descripcion": "Suite de lujo premium con vista panorámica al mar y jacuzzi",
    "created_at": "2026-03-17T10:00:00.000Z",
    "updated_at": "2026-03-17T12:00:00.000Z"
  },
  "timestamp": 1710676800000
}
```

**Errores:**

- `400`: Datos de entrada inválidos
- `401`: No autenticado
- `404`: Tipo de habitación no encontrado
- `409`: Nombre duplicado

**Notas:**

- Solo se actualizan los campos proporcionados en el body
- El campo `updated_at` se actualiza automáticamente
- Si se intenta cambiar el nombre a uno que ya existe, se retorna error 409

---

### 7. Eliminar Tipo de Habitación

Elimina un tipo de habitación del sistema.

**Endpoint:** `DELETE /api/private/tipos-habitacion/:id`

**Permisos:** Usuario autenticado

**Parámetros de ruta:**

- `id` (UUID, requerido): ID del tipo de habitación

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Tipo de habitación eliminado exitosamente",
  "data": null,
  "timestamp": 1710669600000
}
```

**Errores:**

- `401`: No autenticado
- `404`: Tipo de habitación no encontrado
- `409`: No se puede eliminar porque está en uso (tiene habitaciones relacionadas)

---

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Datos de entrada inválidos (validación de Zod) |
| 401 | No autenticado (sesión inválida o inexistente) |
| 404 | Tipo de habitación no encontrado |
| 409 | Conflicto (nombre duplicado o tiene registros relacionados) |
| 500 | Error interno del servidor |

---

## Validaciones

### Campo `nombre`

- **Requerido**: Sí
- **Tipo**: String
- **Longitud mínima**: 1 carácter
- **Longitud máxima**: 100 caracteres
- **Único**: Sí

### Campo `descripcion`

- **Requerido**: No
- **Tipo**: String

---

## Estructura de Datos

### Público (sin timestamps)

```typescript
// PublicTipoHabitacionDto
{
  id: string;              // UUID
  nombre: string;          // máx. 100 caracteres, único
  descripcion: string | null;
}

// PublicTipoHabitacionWithHabitacionDto (?habitacion=true)
{
  id: string;
  nombre: string;
  descripcion: string | null;
  habitacion: PublicHabitacionDto | null;
}

// PublicHabitacionDto
{
  id: string;                    // UUID
  nro_habitacion: string;
  tipo_habitacion_id: string;    // UUID del tipo (no el objeto completo)
  piso: number;
  tiene_ducha: boolean;
  tiene_banio: boolean;
  url_imagen: string[] | null;
  estado: boolean;
  descripcion: string | null;
}
```

### Privado (con timestamps)

```typescript
{
  id: string;              // UUID
  nombre: string;          // máx. 100 caracteres, único
  descripcion: string | null;
  created_at: string;      // ISO 8601
  updated_at: string;      // ISO 8601
}
```

---

## Ejemplos de Uso

### Listar tipos de habitación (público)

```bash
curl -X GET https://api.hotel.com/api/public/tipos-habitacion
```

### Listar tipos de habitación con habitación de ejemplo (público)

```bash
curl -X GET "https://api.hotel.com/api/public/tipos-habitacion?habitacion=true"
```

### Listar tipos de habitación (privado)

```bash
curl -X GET https://api.hotel.com/api/private/tipos-habitacion \
  -H "Authorization: Bearer <token>"
```

### Crear tipo de habitación

```bash
curl -X POST https://api.hotel.com/api/private/tipos-habitacion \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"nombre": "Suite Deluxe", "descripcion": "Suite de lujo"}'
```

### Actualizar tipo de habitación

```bash
curl -X PUT https://api.hotel.com/api/private/tipos-habitacion/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"nombre": "Suite Deluxe Premium"}'
```

### Eliminar tipo de habitación

```bash
curl -X DELETE https://api.hotel.com/api/private/tipos-habitacion/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer <token>"
```