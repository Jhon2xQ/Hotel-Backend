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

1. `GET /` — listar
2. `GET /:id` — por id
3. `POST /` — crear (solo privado)
4. `PUT /:id` — actualizar (solo privado)
5. `DELETE /:id` — eliminar (solo privado)

## Endpoints

### 1. Listar Tipos de Habitación

Obtiene la lista completa de tipos de habitación.

**Endpoint:** `GET /api/private/tipos-habitacion` (o `/api/public/tipos-habitacion`)

**Permisos:** 
- Público: No requiere autenticación
- Privado: Usuario autenticado

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

### 2. Obtener Tipo de Habitación por ID

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

### 3. Crear Tipo de Habitación

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

### 4. Actualizar Tipo de Habitación

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

### 5. Eliminar Tipo de Habitación

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