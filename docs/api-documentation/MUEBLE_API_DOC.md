# API de Muebles


> **Autorización:** Las rutas que restrigen por rol usan `requireRoles(...)` (`src/presentation/middlewares/roles.middleware.ts`) con valores en `src/common/constants/roles.ts` (p. ej. `admin`, `recepcionista`). Cualquier mención a "ADMIN" u otros roles aquí es orientativa; la fuente de verdad es el `*.routes.ts` correspondiente.


Documentación del módulo `muebles.routes.ts`: gestión de muebles del hotel.

## Base URL

```
/api/private/muebles
```

## Orden de endpoints

1. `GET /` — listar  
2. `GET /:id` — por id  
3. `POST /` — crear  
4. `PUT /:id` — actualizar  
5. `DELETE /:id` — eliminar  

## Endpoints

### 1. Listar Muebles

Obtiene la lista de todos los muebles registrados.

**Endpoint:** `GET /api/private/muebles`

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
      "categoria_id": "uuid-categoria",
      "imagen_url": "https://example.com/cama.jpg",
      "condicion": "BUENO",
      "fecha_adquisicion": "2025-01-15",
      "ultima_revision": "2026-03-01",
      "habitacion_id": "uuid-habitacion",
      "created_at": "2026-03-24T08:00:00.000Z",
      "updated_at": "2026-03-24T08:00:00.000Z"
    },
    {
      "id": "uuid-mueble-2",
      "codigo": "SILLA-001",
      "nombre": "Silla de Escritorio",
      "descripcion": "Silla ergonómica",
      "categoria_id": "uuid-categoria-2",
      "imagen_url": "https://example.com/silla.jpg",
      "condicion": "BUENO",
      "fecha_adquisicion": "2025-02-10",
      "ultima_revision": null,
      "habitacion_id": null,
      "created_at": "2026-03-24T09:00:00.000Z",
      "updated_at": "2026-03-24T09:00:00.000Z"
    }
  ],
  "timestamp": 1711267200000
}
```

**Errores:**

- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No tiene permisos de administrador

---

### 2. Obtener Mueble por ID

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
    "categoria_id": "uuid-categoria",
    "imagen_url": "https://example.com/cama.jpg",
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

### 3. Crear Mueble

Crea un nuevo mueble en el sistema.

**Endpoint:** `POST /api/private/muebles`

**Autenticación:** Requerida (Admin)

**Request Body:**

```json
{
  "codigo": "CAMA-001",
  "nombre": "Cama King Size",
  "descripcion": "Cama de lujo con colchón ortopédico",
  "categoria_id": "uuid-categoria",
  "imagen_url": "https://example.com/cama.jpg",
  "condicion": "BUENO",
  "fecha_adquisicion": "2025-01-15",
  "ultima_revision": "2026-03-01",
  "habitacion_id": "uuid-habitacion"
}
```

**Campos:**

- `codigo` (string, requerido): Código único del mueble (máx. 30 caracteres)
- `nombre` (string, requerido): Nombre del mueble (máx. 100 caracteres)
- `descripcion` (string, opcional): Descripción detallada del mueble
- `categoria_id` (uuid, requerido): ID de la categoría del mueble
- `imagen_url` (string, opcional): URL de la imagen del mueble
- `condicion` (enum, opcional): Estado del mueble (BUENO, REGULAR, DANADO, FALTANTE). Por defecto: BUENO
- `fecha_adquisicion` (date, opcional): Fecha de adquisición (formato: YYYY-MM-DD)
- `ultima_revision` (date, opcional): Fecha de última revisión (formato: YYYY-MM-DD)
- `habitacion_id` (uuid, opcional): ID de la habitación donde se encuentra

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
    "categoria_id": "uuid-categoria",
    "imagen_url": "https://example.com/cama.jpg",
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

### 4. Actualizar Mueble

Actualiza la información de un mueble existente.

**Endpoint:** `PUT /api/private/muebles/:id`

**Autenticación:** Requerida (Admin)

**Parámetros de URL:**

- `id` (uuid, requerido): ID del mueble

**Request Body:**

```json
{
  "codigo": "CAMA-002",
  "nombre": "Cama Queen Size",
  "descripcion": "Cama queen actualizada",
  "categoria_id": "uuid-categoria",
  "imagen_url": "https://example.com/cama-nueva.jpg",
  "condicion": "REGULAR",
  "fecha_adquisicion": "2025-02-01",
  "ultima_revision": "2026-03-15",
  "habitacion_id": "uuid-habitacion-nueva"
}
```

**Campos:**

Todos los campos son opcionales. Solo se actualizarán los campos proporcionados.

- `codigo` (string, opcional): Código único del mueble (máx. 30 caracteres)
- `nombre` (string, opcional): Nombre del mueble (máx. 100 caracteres)
- `descripcion` (string, opcional): Descripción detallada del mueble
- `categoria_id` (uuid, opcional): ID de la categoría del mueble
- `imagen_url` (string, opcional): URL de la imagen del mueble
- `condicion` (enum, opcional): Estado del mueble (BUENO, REGULAR, DANADO, FALTANTE)
- `fecha_adquisicion` (date, opcional): Fecha de adquisición (formato: YYYY-MM-DD)
- `ultima_revision` (date, opcional): Fecha de última revisión (formato: YYYY-MM-DD)
- `habitacion_id` (uuid, opcional): ID de la habitación donde se encuentra (puede ser null para desasignar)

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
    "categoria_id": "uuid-categoria",
    "imagen_url": "https://example.com/cama-nueva.jpg",
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

### 5. Eliminar Mueble

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
  BUENO = "BUENO", // Mueble en buen estado
  REGULAR = "REGULAR", // Mueble con desgaste normal
  DANADO = "DANADO", // Mueble dañado que requiere reparación
  FALTANTE = "FALTANTE", // Mueble faltante o extraviado
}
```

---

## Estructura de Datos

### Objeto Mueble

```typescript
{
  id: string; // UUID del mueble
  codigo: string; // Código único (máx. 30 caracteres)
  nombre: string; // Nombre del mueble (máx. 100 caracteres)
  descripcion: string | null; // Descripción detallada
  categoria_id: string; // UUID de la categoría
  imagen_url: string | null; // URL de la imagen
  condicion: MuebleCondition; // Estado del mueble
  fecha_adquisicion: string | null; // Fecha en formato YYYY-MM-DD
  ultima_revision: string | null; // Fecha en formato YYYY-MM-DD
  habitacion_id: string | null; // UUID de la habitación (puede ser null)
  created_at: string; // Timestamp ISO 8601
  updated_at: string; // Timestamp ISO 8601
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
9. **Respuestas simplificadas**: Las respuestas solo incluyen IDs de relaciones, no objetos anidados
10. **Condición por defecto**: Si no se especifica, la condición del mueble será `BUENO`

---

## Ejemplos de Uso

### Crear mueble sin habitación asignada

```json
POST /api/private/muebles
{
  "codigo": "SILLA-001",
  "nombre": "Silla de Escritorio",
  "categoria_id": "uuid-categoria"
}
```

### Desasignar mueble de una habitación

```json
PUT /api/private/muebles/:id
{
  "habitacion_id": null
}
```

### Actualizar solo la condición

```json
PUT /api/private/muebles/:id
{
  "condicion": "DANADO"
}
```
