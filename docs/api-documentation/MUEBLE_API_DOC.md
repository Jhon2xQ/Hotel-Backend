# API de Muebles

Documentación de los endpoints para la gestión de muebles del hotel.

## Endpoints

### 1. Crear Mueble

Crea un nuevo mueble en el sistema.

**Endpoint:** `POST /api/muebles`

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
- `categoria_id` (uuid, opcional): ID de la categoría del mueble
- `imagen_url` (string, opcional): URL de la imagen del mueble
- `condicion` (enum, opcional): Estado del mueble (BUENO, REGULAR, DANADO, FALTANTE)
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
```

    "categoria": {
      "id": "uuid-categoria",
      "nombre": "Cama",
      "descripcion": "Muebles para dormir",
      "activo": true
    },
    "imagen_url": "https://example.com/cama.jpg",
    "condicion": "BUENO",
    "fecha_adquisicion": "2025-01-15",
    "ultima_revision": "2026-03-01",
    "habitacion_id": "uuid-habitacion",
    "habitacion": {
      "id": "uuid-habitacion",
      "nro_habitacion": "101",
      "piso": 1
    },
    "created_at": "2026-03-24T08:00:00.000Z",
    "updated_at": "2026-03-24T08:00:00.000Z"

},
"timestamp": 1711267200000
}

````

**Errores:**

- `400 Bad Request`: Datos de entrada inválidos
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No tiene permisos de administrador
- `404 Not Found`: Categoría o habitación no encontrada
- `409 Conflict`: Ya existe un mueble con ese código

---

### 2. Listar Muebles

Obtiene la lista de todos los muebles registrados.

**Endpoint:** `GET /api/muebles`

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
      "categoria": {
        "id": "uuid-categoria",
        "nombre": "Cama",
        "descripcion": "Muebles para dormir",
        "activo": true
      },
      "imagen_url": "https://example.com/cama.jpg",
      "condicion": "BUENO",
      "fecha_adquisicion": "2025-01-15",
      "ultima_revision": "2026-03-01",
      "habitacion_id": "uuid-habitacion",
      "habitacion": {
        "id": "uuid-habitacion",
        "nro_habitacion": "101",
        "piso": 1
      },
      "created_at": "2026-03-24T08:00:00.000Z",
      "updated_at": "2026-03-24T08:00:00.000Z"
    }
  ],
  "timestamp": 1711267200000
}
````

**Errores:**

- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No tiene permisos de administrador

---

### 3. Obtener Mueble por ID

Obtiene los detalles de un mueble específico.

**Endpoint:** `GET /api/muebles/:id`

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
    "categoria": {
      "id": "uuid-categoria",
      "nombre": "Cama",
      "descripcion": "Muebles para dormir",
      "activo": true
    },
    "imagen_url": "https://example.com/cama.jpg",
    "condicion": "BUENO",
    "fecha_adquisicion": "2025-01-15",
    "ultima_revision": "2026-03-01",
    "habitacion_id": "uuid-habitacion",
    "habitacion": {
      "id": "uuid-habitacion",
      "nro_habitacion": "101",
      "piso": 1
    },
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

### 4. Actualizar Mueble

Actualiza la información de un mueble existente.

**Endpoint:** `PUT /api/muebles/:id`

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
- `habitacion_id` (uuid, opcional): ID de la habitación donde se encuentra

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
    "categoria": {
      "id": "uuid-categoria",
      "nombre": "Cama",
      "descripcion": "Muebles para dormir",
      "activo": true
    },
    "imagen_url": "https://example.com/cama-nueva.jpg",
    "condicion": "REGULAR",
    "fecha_adquisicion": "2025-02-01",
    "ultima_revision": "2026-03-15",
    "habitacion_id": "uuid-habitacion-nueva",
    "habitacion": {
      "id": "uuid-habitacion-nueva",
      "nro_habitacion": "102",
      "piso": 1
    },
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

**Endpoint:** `DELETE /api/muebles/:id`

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

## Notas

1. Todos los endpoints requieren autenticación mediante Better Auth
2. Solo usuarios con rol `ADMIN` pueden acceder a estos endpoints
3. El código del mueble debe ser único en el sistema
4. Las fechas deben estar en formato ISO 8601 (YYYY-MM-DD)
5. Los campos opcionales pueden omitirse en las peticiones
6. La categoría y habitación deben existir antes de asignarlas a un mueble
7. Al actualizar, solo se modifican los campos proporcionados en el request
8. Las respuestas incluyen información relacionada (categoría y habitación) cuando están disponibles
