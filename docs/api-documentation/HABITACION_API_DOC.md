# API de Habitaciones

Documentación de los endpoints para gestionar las habitaciones físicas del hotel.

## Base URL

```
/api/habitaciones
```

## Autenticación

Todos los endpoints requieren autenticación mediante sesión de Better Auth.

## Enums

### EstadoHabitacion

Estados operacionales de una habitación:

- `DISPONIBLE`: Habitación disponible para reserva/ocupación
- `RESERVADA`: Habitación reservada pero no ocupada
- `OCUPADA`: Habitación actualmente ocupada por huéspedes
- `LIMPIEZA`: Habitación en proceso de limpieza
- `MANTENIMIENTO`: Habitación en mantenimiento, no disponible

## Endpoints

### 1. Listar Habitaciones

Obtiene la lista completa de habitaciones del hotel.

**Endpoint:** `GET /api/habitaciones`

**Permisos:** Usuario autenticado

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Habitaciones obtenidas exitosamente",
  "data": [
    {
      "id": "789e4567-e89b-12d3-a456-426614174000",
      "nro_habitacion": "101",
      "tipo_habitacion_id": "123e4567-e89b-12d3-a456-426614174000",
      "tipo": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "nombre": "Suite Deluxe",
        "descripcion": "Suite de lujo con vista panorámica al mar"
      },
      "piso": 1,
      "tiene_ducha": true,
      "tiene_banio": true,
      "url_imagen": ["https://example.com/rooms/101-1.jpg", "https://example.com/rooms/101-2.jpg"],
      "estado": "DISPONIBLE",
      "notas": null,
      "ulti_limpieza": "2026-03-17T08:00:00.000Z",
      "created_at": "2026-03-15T10:00:00.000Z",
      "updated_at": "2026-03-17T08:00:00.000Z"
    },
    {
      "id": "789e4567-e89b-12d3-a456-426614174001",
      "nro_habitacion": "102",
      "tipo_habitacion_id": "123e4567-e89b-12d3-a456-426614174001",
      "tipo": {
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "nombre": "Habitación Estándar",
        "descripcion": "Habitación cómoda con todas las comodidades básicas"
      },
      "piso": 1,
      "tiene_ducha": true,
      "tiene_banio": false,
      "url_imagen": null,
      "estado": "OCUPADA",
      "notas": "Solicitud de almohadas extra",
      "ulti_limpieza": "2026-03-16T09:00:00.000Z",
      "created_at": "2026-03-15T10:05:00.000Z",
      "updated_at": "2026-03-17T14:30:00.000Z"
    }
  ],
  "timestamp": 1710684600000
}
```

**Notas:**

- Las habitaciones se devuelven ordenadas por número de habitación (ascendente)
- Cada habitación incluye el tipo de habitación asociado
- El campo `ulti_limpieza` puede ser `null` si nunca se ha limpiado
- El campo `url_imagen` es un array de strings que puede contener múltiples URLs de imágenes

---

### 2. Obtener Habitación por ID

Obtiene los detalles de una habitación específica.

**Endpoint:** `GET /api/habitaciones/:id`

**Permisos:** Usuario autenticado

**Parámetros de ruta:**

- `id` (UUID, requerido): ID de la habitación

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Habitación encontrada",
  "data": {
    "id": "789e4567-e89b-12d3-a456-426614174000",
    "nro_habitacion": "101",
    "tipo_habitacion_id": "123e4567-e89b-12d3-a456-426614174000",
    "tipo": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "nombre": "Suite Deluxe",
      "descripcion": "Suite de lujo con vista panorámica al mar"
    },
    "piso": 1,
    "tiene_ducha": true,
    "tiene_banio": true,
    "url_imagen": ["https://example.com/rooms/101-1.jpg", "https://example.com/rooms/101-2.jpg"],
    "estado": "DISPONIBLE",
    "notas": null,
    "ulti_limpieza": "2026-03-17T08:00:00.000Z",
    "created_at": "2026-03-15T10:00:00.000Z",
    "updated_at": "2026-03-17T08:00:00.000Z"
  },
  "timestamp": 1710684600000
}
```

**Errores:**

- `404`: Habitación no encontrada

```json
{
  "success": false,
  "message": "Habitación no encontrada",
  "data": null,
  "timestamp": 1710684600000
}
```

---

### 3. Crear Habitación

Crea una nueva habitación física en el sistema.

**Endpoint:** `POST /api/habitaciones`

**Permisos:** ADMIN

**Body (JSON):**

```json
{
  "nro_habitacion": "301",
  "tipo_habitacion_id": "123e4567-e89b-12d3-a456-426614174000",
  "piso": 3,
  "tiene_ducha": true,
  "tiene_banio": true,
  "url_imagen": ["https://example.com/rooms/301-1.jpg", "https://example.com/rooms/301-2.jpg"],
  "estado": "DISPONIBLE",
  "notas": "Habitación con vista al mar"
}
```

**Campos:**

- `nro_habitacion` (string, requerido): Número único de habitación (máx. 10 caracteres)
- `tipo_habitacion_id` (UUID, requerido): ID del tipo de habitación
- `piso` (number, requerido): Número de piso (entero positivo)
- `tiene_ducha` (boolean, opcional): Indica si la habitación tiene ducha (default: `false`)
- `tiene_banio` (boolean, opcional): Indica si la habitación tiene baño completo (default: `false`)
- `url_imagen` (array de strings, opcional): URLs de imágenes de la habitación (máx. 255 caracteres cada una)
- `estado` (EstadoHabitacion, opcional): Estado operacional (default: `DISPONIBLE`)
- `notas` (string, opcional): Notas adicionales para el personal

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "message": "Habitación creada exitosamente",
  "data": {
    "id": "789e4567-e89b-12d3-a456-426614174000",
    "nro_habitacion": "301",
    "tipo_habitacion_id": "123e4567-e89b-12d3-a456-426614174000",
    "tipo": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "nombre": "Suite Deluxe",
      "descripcion": "Suite de lujo con vista panorámica al mar"
    },
    "piso": 3,
    "tiene_ducha": true,
    "tiene_banio": true,
    "url_imagen": ["https://example.com/rooms/301-1.jpg", "https://example.com/rooms/301-2.jpg"],
    "estado": "DISPONIBLE",
    "notas": "Habitación con vista al mar",
    "ulti_limpieza": null,
    "created_at": "2026-03-17T15:00:00.000Z",
    "updated_at": "2026-03-17T15:00:00.000Z"
  },
  "timestamp": 1710687600000
}
```

**Errores:**

- `400`: Datos de entrada inválidos

```json
{
  "success": false,
  "message": "El número de habitación es requerido",
  "data": null,
  "timestamp": 1710687600000
}
```

- `401`: No autenticado

```json
{
  "success": false,
  "message": "No autorizado",
  "data": null,
  "timestamp": 1710687600000
}
```

- `403`: No autorizado (requiere rol ADMIN)

```json
{
  "success": false,
  "message": "Acceso denegado. Se requiere rol de administrador",
  "data": null,
  "timestamp": 1710687600000
}
```

- `404`: Tipo de habitación no encontrado

```json
{
  "success": false,
  "message": "Tipo de habitación no encontrado",
  "data": null,
  "timestamp": 1710687600000
}
```

- `409`: Número de habitación duplicado

```json
{
  "success": false,
  "message": "Ya existe una habitación con ese número",
  "data": null,
  "timestamp": 1710687600000
}
```

---

### 4. Actualizar Habitación (Completo)

Actualiza los datos completos de una habitación existente.

**Endpoint:** `PUT /api/habitaciones/:id`

**Permisos:** ADMIN

**Parámetros de ruta:**

- `id` (UUID, requerido): ID de la habitación

**Body (JSON):**

```json
{
  "nro_habitacion": "301-A",
  "tipo_habitacion_id": "123e4567-e89b-12d3-a456-426614174000",
  "piso": 3,
  "tiene_ducha": true,
  "tiene_banio": false,
  "url_imagen": ["https://example.com/rooms/301-a-1.jpg"],
  "estado": "MANTENIMIENTO",
  "notas": "Reparación de aire acondicionado programada"
}
```

**Campos:** Todos opcionales, mismas validaciones que en crear

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Habitación actualizada exitosamente",
  "data": {
    "id": "789e4567-e89b-12d3-a456-426614174000",
    "nro_habitacion": "301-A",
    "tipo_habitacion_id": "123e4567-e89b-12d3-a456-426614174000",
    "tipo": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "nombre": "Suite Deluxe",
      "descripcion": "Suite de lujo con vista panorámica al mar"
    },
    "piso": 3,
    "tiene_ducha": true,
    "tiene_banio": false,
    "url_imagen": ["https://example.com/rooms/301-a-1.jpg"],
    "estado": "MANTENIMIENTO",
    "notas": "Reparación de aire acondicionado programada",
    "ulti_limpieza": "2026-03-17T08:00:00.000Z",
    "created_at": "2026-03-15T10:00:00.000Z",
    "updated_at": "2026-03-17T16:00:00.000Z"
  },
  "timestamp": 1710691200000
}
```

**Errores:**

- `400`: Datos de entrada inválidos
- `401`: No autenticado
- `403`: No autorizado (requiere rol ADMIN)
- `404`: Habitación o tipo de habitación no encontrado

```json
{
  "success": false,
  "message": "Habitación no encontrada",
  "data": null,
  "timestamp": 1710691200000
}
```

- `409`: Número de habitación duplicado

```json
{
  "success": false,
  "message": "Ya existe una habitación con ese número",
  "data": null,
  "timestamp": 1710691200000
}
```

**Notas:**

- Solo se actualizan los campos proporcionados en el body
- El campo `updated_at` se actualiza automáticamente
- Si el estado cambia a `LIMPIEZA`, el campo `ulti_limpieza` se actualiza automáticamente con la fecha/hora actual

---

### 5. Actualizar Estado de Habitación

Actualiza únicamente el estado operacional de una habitación. Este endpoint está disponible para todos los usuarios autenticados (no requiere rol ADMIN).

**Endpoint:** `PATCH /api/habitaciones/:id/estado`

**Permisos:** Usuario autenticado (cualquier rol)

**Parámetros de ruta:**

- `id` (UUID, requerido): ID de la habitación

**Body (JSON):**

```json
{
  "estado": "OCUPADA",
  "ulti_limpieza": "2026-03-17T17:00:00.000Z"
}
```

**Campos:**

- `estado` (EstadoHabitacion, opcional): Nuevo estado operacional
- `ulti_limpieza` (string ISO 8601, opcional): Fecha y hora de última limpieza
- **Nota:** Debe proporcionar al menos uno de los dos campos

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Estado de habitación actualizado exitosamente",
  "data": {
    "id": "789e4567-e89b-12d3-a456-426614174000",
    "nro_habitacion": "301",
    "tipo_habitacion_id": "123e4567-e89b-12d3-a456-426614174000",
    "tipo": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "nombre": "Suite Deluxe",
      "descripcion": "Suite de lujo con vista panorámica al mar"
    },
    "piso": 3,
    "tiene_ducha": true,
    "tiene_banio": true,
    "url_imagen": ["https://example.com/rooms/301.jpg"],
    "estado": "OCUPADA",
    "notas": "Habitación con vista al mar",
    "ulti_limpieza": "2026-03-17T17:00:00.000Z",
    "created_at": "2026-03-15T10:00:00.000Z",
    "updated_at": "2026-03-17T17:00:00.000Z"
  },
  "timestamp": 1710694800000
}
```

**Errores:**

- `400`: Datos de entrada inválidos

```json
{
  "success": false,
  "message": "Debe proporcionar al menos un campo (estado o limpieza)",
  "data": null,
  "timestamp": 1710694800000
}
```

- `401`: No autenticado

```json
{
  "success": false,
  "message": "No autorizado",
  "data": null,
  "timestamp": 1710694800000
}
```

- `404`: Habitación no encontrada

```json
{
  "success": false,
  "message": "Habitación no encontrada",
  "data": null,
  "timestamp": 1710694800000
}
```

**Notas:**

- Este endpoint NO requiere rol ADMIN, permitiendo al personal de limpieza y recepción actualizar estados
- Solo actualiza los campos de estado, no modifica otros datos de la habitación
- El campo `updated_at` se actualiza automáticamente

---

### 6. Eliminar Habitación

Elimina una habitación del sistema.

**Endpoint:** `DELETE /api/habitaciones/:id`

**Permisos:** ADMIN

**Parámetros de ruta:**

- `id` (UUID, requerido): ID de la habitación

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Habitación eliminada exitosamente",
  "data": null,
  "timestamp": 1710694800000
}
```

**Errores:**

- `401`: No autenticado
- `403`: No autorizado (requiere rol ADMIN)
- `404`: Habitación no encontrada

```json
{
  "success": false,
  "message": "Habitación no encontrada",
  "data": null,
  "timestamp": 1710694800000
}
```

- `409`: No se puede eliminar porque está en uso

```json
{
  "success": false,
  "message": "No se puede eliminar la habitación porque tiene registros relacionados",
  "data": null,
  "timestamp": 1710694800000
}
```

**Notas:**

- No se puede eliminar una habitación si tiene estancias asociadas
- Esta validación protege la integridad referencial de los datos

---

## Códigos de Error

| Código | Descripción                                                 |
| ------ | ----------------------------------------------------------- |
| 400    | Datos de entrada inválidos (validación de Zod)              |
| 401    | No autenticado (sesión inválida o inexistente)              |
| 403    | No autorizado (requiere rol ADMIN)                          |
| 404    | Habitación o tipo de habitación no encontrado               |
| 409    | Conflicto (número duplicado o tiene registros relacionados) |
| 500    | Error interno del servidor                                  |

---

## Validaciones

### Campo `nro_habitacion`

- **Requerido**: Sí
- **Tipo**: String
- **Longitud mínima**: 1 carácter
- **Longitud máxima**: 10 caracteres
- **Único**: Sí (no puede haber dos habitaciones con el mismo número)
- **Ejemplo**: "101", "202", "301-A", "SUITE-01"

### Campo `tipo_habitacion_id`

- **Requerido**: Sí
- **Tipo**: UUID
- **Validación**: Debe corresponder a un tipo de habitación existente
- **Ejemplo**: "123e4567-e89b-12d3-a456-426614174000"

### Campo `piso`

- **Requerido**: Sí
- **Tipo**: Number (entero)
- **Validación**: Debe ser un número positivo
- **Ejemplo**: 1, 2, 3, 10

### Campo `tiene_ducha`

- **Requerido**: No (default: `false`)
- **Tipo**: Boolean
- **Valores**: `true` o `false`
- **Descripción**: Indica si la habitación tiene ducha

### Campo `tiene_banio`

- **Requerido**: No (default: `false`)
- **Tipo**: Boolean
- **Valores**: `true` o `false`
- **Descripción**: Indica si la habitación tiene baño completo

### Campo `url_imagen`

- **Requerido**: No
- **Tipo**: Array de strings
- **Longitud máxima por URL**: 255 caracteres
- **Ejemplo**: `["https://example.com/rooms/301-1.jpg", "https://example.com/rooms/301-2.jpg"]`

### Campo `estado`

- **Requerido**: No (default: `DISPONIBLE`)
- **Tipo**: Enum EstadoHabitacion
- **Valores**: `DISPONIBLE`, `RESERVADA`, `OCUPADA`, `LIMPIEZA`, `MANTENIMIENTO`

### Campo `notas`

- **Requerido**: No
- **Tipo**: String
- **Longitud máxima**: Sin límite
- **Ejemplo**: "Solicitud de almohadas extra", "Aire acondicionado en reparación"

### Campo `ulti_limpieza`

- **Requerido**: No
- **Tipo**: String (formato ISO 8601)
- **Ejemplo**: "2026-03-17T17:00:00.000Z"
- **Nota**: Se actualiza automáticamente cuando el estado cambia a `LIMPIEZA`

---

## Notas

- Las habitaciones representan las unidades físicas del hotel con número y ubicación específicos
- Cada habitación está asociada a un tipo de habitación que define sus características
- Los campos `tiene_ducha` y `tiene_banio` permiten especificar las instalaciones sanitarias de cada habitación individual
- El campo `ulti_limpieza` se actualiza automáticamente cuando el estado cambia a `LIMPIEZA` (vía PUT)
- El campo `url_imagen` es un array que permite almacenar múltiples imágenes de la habitación
- Los campos `created_at` y `updated_at` se gestionan automáticamente por el sistema
- No se puede eliminar una habitación si tiene estancias asociadas
- El endpoint PATCH `/habitaciones/:id/estado` está disponible para todos los usuarios autenticados, permitiendo al personal actualizar estados sin necesidad de permisos de administrador
- El endpoint PUT `/habitaciones/:id` requiere rol ADMIN para actualizaciones completas

---

## Ejemplos de Uso

### Crear una habitación básica

```bash
curl -X POST https://api.hotel.com/api/habitaciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nro_habitacion": "101",
    "tipo_habitacion_id": "123e4567-e89b-12d3-a456-426614174000",
    "piso": 1,
    "tiene_ducha": true,
    "tiene_banio": false
  }'
```

### Crear una habitación completa con imágenes

```bash
curl -X POST https://api.hotel.com/api/habitaciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nro_habitacion": "301",
    "tipo_habitacion_id": "123e4567-e89b-12d3-a456-426614174000",
    "piso": 3,
    "tiene_ducha": true,
    "tiene_banio": true,
    "url_imagen": [
      "https://example.com/rooms/301-1.jpg",
      "https://example.com/rooms/301-2.jpg",
      "https://example.com/rooms/301-3.jpg"
    ],
    "estado": "DISPONIBLE",
    "notas": "Habitación con vista al mar"
  }'
```

### Actualizar estado operacional (recepción)

```bash
curl -X PATCH https://api.hotel.com/api/habitaciones/789e4567-e89b-12d3-a456-426614174000/estado \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "estado": "OCUPADA"
  }'
```

### Actualizar fecha de limpieza

```bash
curl -X PATCH https://api.hotel.com/api/habitaciones/789e4567-e89b-12d3-a456-426614174000/estado \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "ulti_limpieza": "2026-03-17T17:00:00.000Z"
  }'
```

### Actualización completa de habitación (ADMIN)

```bash
curl -X PUT https://api.hotel.com/api/habitaciones/789e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nro_habitacion": "301-A",
    "piso": 3,
    "tiene_ducha": true,
    "tiene_banio": false,
    "estado": "MANTENIMIENTO",
    "notas": "Reparación de aire acondicionado"
  }'
```

### Listar todas las habitaciones

```bash
curl -X GET https://api.hotel.com/api/habitaciones \
  -H "Authorization: Bearer <token>"
```

### Obtener habitación específica

```bash
curl -X GET https://api.hotel.com/api/habitaciones/789e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer <token>"
```

### Eliminar una habitación

```bash
curl -X DELETE https://api.hotel.com/api/habitaciones/789e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer <token>"
```
