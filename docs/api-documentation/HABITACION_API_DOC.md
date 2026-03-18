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

### EstadoLimpieza

Estados de limpieza de una habitación:

- `LIMPIA`: Habitación limpia y lista para uso
- `SUCIA`: Habitación requiere limpieza
- `EN_LIMPIEZA`: Habitación siendo limpiada actualmente
- `INSPECCION`: Habitación en inspección de calidad

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
      "tipo_id": "123e4567-e89b-12d3-a456-426614174000",
      "tipo": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "nombre": "Suite Deluxe",
        "descripcion": "Suite de lujo con vista panorámica al mar"
      },
      "piso": 1,
      "url_imagen": "https://example.com/rooms/101.jpg",
      "estado": "DISPONIBLE",
      "limpieza": "LIMPIA",
      "notas": null,
      "ultima_limpieza": "2026-03-17T08:00:00.000Z",
      "muebles": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "codigo": "CAMA-KING-01",
          "nombre": "Cama King Size",
          "categoria": "CAMA"
        },
        {
          "id": "550e8400-e29b-41d4-a716-446655440002",
          "codigo": "TV-55-01",
          "nombre": "TV 55 pulgadas",
          "categoria": "TECNOLOGIA"
        }
      ],
      "created_at": "2026-03-15T10:00:00.000Z",
      "updated_at": "2026-03-17T08:00:00.000Z"
    },
    {
      "id": "789e4567-e89b-12d3-a456-426614174001",
      "nro_habitacion": "102",
      "tipo_id": "123e4567-e89b-12d3-a456-426614174001",
      "tipo": {
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "nombre": "Habitación Estándar",
        "descripcion": "Habitación cómoda con todas las comodidades básicas"
      },
      "piso": 1,
      "url_imagen": null,
      "estado": "OCUPADA",
      "limpieza": "SUCIA",
      "notas": "Solicitud de almohadas extra",
      "ultima_limpieza": "2026-03-16T09:00:00.000Z",
      "muebles": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440003",
          "codigo": "CAMA-DOBLE-01",
          "nombre": "Cama Doble",
          "categoria": "CAMA"
        }
      ],
      "created_at": "2026-03-15T10:05:00.000Z",
      "updated_at": "2026-03-17T14:30:00.000Z"
    }
  ],
  "timestamp": 1710684600000
}
```

**Notas:**

- Las habitaciones se devuelven ordenadas por número de habitación (ascendente)
- Cada habitación incluye el tipo de habitación asociado y la lista de muebles
- El campo `ultima_limpieza` puede ser `null` si nunca se ha limpiado

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
    "tipo_id": "123e4567-e89b-12d3-a456-426614174000",
    "tipo": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "nombre": "Suite Deluxe",
      "descripcion": "Suite de lujo con vista panorámica al mar"
    },
    "piso": 1,
    "url_imagen": "https://example.com/rooms/101.jpg",
    "estado": "DISPONIBLE",
    "limpieza": "LIMPIA",
    "notas": null,
    "ultima_limpieza": "2026-03-17T08:00:00.000Z",
    "muebles": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "codigo": "CAMA-KING-01",
        "nombre": "Cama King Size",
        "categoria": "CAMA"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "codigo": "TV-55-01",
        "nombre": "TV 55 pulgadas",
        "categoria": "TECNOLOGIA"
      }
    ],
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
  "message": "Habitación con id \"789e4567-e89b-12d3-a456-426614174000\" no encontrada",
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
  "tipo_id": "123e4567-e89b-12d3-a456-426614174000",
  "piso": 3,
  "url_imagen": "https://example.com/rooms/301.jpg",
  "estado": "DISPONIBLE",
  "limpieza": "LIMPIA",
  "notas": "Habitación con vista al mar",
  "muebles": ["550e8400-e29b-41d4-a716-446655440001", "550e8400-e29b-41d4-a716-446655440002"]
}
```

**Campos:**

- `nro_habitacion` (string, requerido): Número único de habitación (máx. 10 caracteres)
- `tipo_id` (UUID, requerido): ID del tipo de habitación
- `piso` (number, requerido): Número de piso (entero positivo)
- `url_imagen` (string, opcional): URL de imagen de la habitación (máx. 255 caracteres)
- `estado` (EstadoHabitacion, opcional): Estado operacional (default: `DISPONIBLE`)
- `limpieza` (EstadoLimpieza, opcional): Estado de limpieza (default: `LIMPIA`)
- `notas` (string, opcional): Notas adicionales para el personal
- `muebles` (array de UUIDs, opcional): Lista de IDs de muebles del catálogo

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "message": "Habitación creada exitosamente",
  "data": {
    "id": "789e4567-e89b-12d3-a456-426614174000",
    "nro_habitacion": "301",
    "tipo_id": "123e4567-e89b-12d3-a456-426614174000",
    "tipo": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "nombre": "Suite Deluxe",
      "descripcion": "Suite de lujo con vista panorámica al mar"
    },
    "piso": 3,
    "url_imagen": "https://example.com/rooms/301.jpg",
    "estado": "DISPONIBLE",
    "limpieza": "LIMPIA",
    "notas": "Habitación con vista al mar",
    "ultima_limpieza": null,
    "muebles": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "codigo": "CAMA-KING-01",
        "nombre": "Cama King Size",
        "categoria": "CAMA"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "codigo": "TV-55-01",
        "nombre": "TV 55 pulgadas",
        "categoria": "TECNOLOGIA"
      }
    ],
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

- `409`: Número de habitación duplicado

```json
{
  "success": false,
  "message": "Ya existe una habitación con el número \"301\"",
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
  "tipo_id": "123e4567-e89b-12d3-a456-426614174000",
  "piso": 3,
  "url_imagen": "https://example.com/rooms/301-a.jpg",
  "estado": "MANTENIMIENTO",
  "limpieza": "EN_LIMPIEZA",
  "notas": "Reparación de aire acondicionado programada",
  "muebles": [
    "550e8400-e29b-41d4-a716-446655440001",
    "550e8400-e29b-41d4-a716-446655440002",
    "550e8400-e29b-41d4-a716-446655440005"
  ]
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
    "tipo_id": "123e4567-e89b-12d3-a456-426614174000",
    "tipo": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "nombre": "Suite Deluxe",
      "descripcion": "Suite de lujo con vista panorámica al mar"
    },
    "piso": 3,
    "url_imagen": "https://example.com/rooms/301-a.jpg",
    "estado": "MANTENIMIENTO",
    "limpieza": "EN_LIMPIEZA",
    "notas": "Reparación de aire acondicionado programada",
    "ultima_limpieza": "2026-03-17T08:00:00.000Z",
    "muebles": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "codigo": "CAMA-KING-01",
        "nombre": "Cama King Size",
        "categoria": "CAMA"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "codigo": "TV-55-01",
        "nombre": "TV 55 pulgadas",
        "categoria": "TECNOLOGIA"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440005",
        "codigo": "MINIBAR-01",
        "nombre": "Minibar",
        "categoria": "AMENIDADES"
      }
    ],
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
- `404`: Habitación no encontrada

```json
{
  "success": false,
  "message": "Habitación con id \"789e4567-e89b-12d3-a456-426614174000\" no encontrada",
  "data": null,
  "timestamp": 1710691200000
}
```

- `409`: Número de habitación duplicado

```json
{
  "success": false,
  "message": "Ya existe una habitación con el número \"301-A\"",
  "data": null,
  "timestamp": 1710691200000
}
```

**Notas:**

- Solo se actualizan los campos proporcionados en el body
- Si se proporciona el array `muebles`, se reemplaza completamente la lista de muebles asociados
- El campo `updated_at` se actualiza automáticamente
- Si el estado cambia a `LIMPIEZA`, el campo `ultima_limpieza` se actualiza automáticamente

---

### 5. Actualizar Estado de Habitación

Actualiza únicamente los estados operacional y de limpieza de una habitación. Este endpoint está disponible para todos los usuarios autenticados (no requiere rol ADMIN).

**Endpoint:** `PATCH /api/habitaciones/:id/estado`

**Permisos:** Usuario autenticado (cualquier rol)

**Parámetros de ruta:**

- `id` (UUID, requerido): ID de la habitación

**Body (JSON):**

```json
{
  "estado": "OCUPADA",
  "limpieza": "LIMPIA"
}
```

**Campos:**

- `estado` (EstadoHabitacion, opcional): Nuevo estado operacional
- `limpieza` (EstadoLimpieza, opcional): Nuevo estado de limpieza
- **Nota:** Debe proporcionar al menos uno de los dos campos

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Estado de habitación actualizado exitosamente",
  "data": {
    "id": "789e4567-e89b-12d3-a456-426614174000",
    "nro_habitacion": "301",
    "tipo_id": "123e4567-e89b-12d3-a456-426614174000",
    "tipo": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "nombre": "Suite Deluxe",
      "descripcion": "Suite de lujo con vista panorámica al mar"
    },
    "piso": 3,
    "url_imagen": "https://example.com/rooms/301.jpg",
    "estado": "OCUPADA",
    "limpieza": "LIMPIA",
    "notas": "Habitación con vista al mar",
    "ultima_limpieza": "2026-03-17T17:00:00.000Z",
    "muebles": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "codigo": "CAMA-KING-01",
        "nombre": "Cama King Size",
        "categoria": "CAMA"
      }
    ],
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
  "message": "Habitación con id \"789e4567-e89b-12d3-a456-426614174000\" no encontrada",
  "data": null,
  "timestamp": 1710694800000
}
```

**Notas:**

- Este endpoint NO requiere rol ADMIN, permitiendo al personal de limpieza y recepción actualizar estados
- Cuando `limpieza` cambia a `LIMPIA`, el campo `ultima_limpieza` se actualiza automáticamente con la fecha/hora actual
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
  "message": "Habitación con id \"789e4567-e89b-12d3-a456-426614174000\" no encontrada",
  "data": null,
  "timestamp": 1710694800000
}
```

- `409`: No se puede eliminar porque está en uso

```json
{
  "success": false,
  "message": "No se puede eliminar la habitación porque tiene registros relacionados (estancias)",
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
| 404    | Habitación no encontrada                                    |
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

### Campo `tipo_id`

- **Requerido**: Sí
- **Tipo**: UUID
- **Validación**: Debe corresponder a un tipo de habitación existente
- **Ejemplo**: "123e4567-e89b-12d3-a456-426614174000"

### Campo `piso`

- **Requerido**: Sí
- **Tipo**: Number (entero)
- **Validación**: Debe ser un número positivo
- **Ejemplo**: 1, 2, 3, 10

### Campo `url_imagen`

- **Requerido**: No
- **Tipo**: String
- **Longitud máxima**: 255 caracteres
- **Ejemplo**: "https://example.com/rooms/301.jpg"

### Campo `estado`

- **Requerido**: No (default: `DISPONIBLE`)
- **Tipo**: Enum EstadoHabitacion
- **Valores**: `DISPONIBLE`, `RESERVADA`, `OCUPADA`, `LIMPIEZA`, `MANTENIMIENTO`

### Campo `limpieza`

- **Requerido**: No (default: `LIMPIA`)
- **Tipo**: Enum EstadoLimpieza
- **Valores**: `LIMPIA`, `SUCIA`, `EN_LIMPIEZA`, `INSPECCION`

### Campo `notas`

- **Requerido**: No
- **Tipo**: String
- **Longitud máxima**: Sin límite
- **Ejemplo**: "Solicitud de almohadas extra", "Aire acondicionado en reparación"

### Campo `muebles`

- **Requerido**: No
- **Tipo**: Array de UUIDs
- **Validación**: Cada UUID debe corresponder a un mueble existente en el catálogo
- **Ejemplo**: `["550e8400-e29b-41d4-a716-446655440001", "550e8400-e29b-41d4-a716-446655440002"]`

---

## Notas

- Las habitaciones representan las unidades físicas del hotel con número y ubicación específicos
- Cada habitación está asociada a un tipo de habitación que define sus características
- El sistema mantiene dos estados independientes:
  - **Estado operacional** (`estado`): Disponibilidad para reservas y ocupación
  - **Estado de limpieza** (`limpieza`): Estado del servicio de housekeeping
- El campo `ultima_limpieza` se actualiza automáticamente cuando:
  - El estado de limpieza cambia a `LIMPIA` (vía PATCH /estado)
  - El estado operacional cambia a `LIMPIEZA` (vía PUT)
- La lista de muebles asociados se reemplaza completamente al actualizar (no se hace merge)
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
    "tipo_id": "123e4567-e89b-12d3-a456-426614174000",
    "piso": 1
  }'
```

### Crear una habitación completa con muebles

```bash
curl -X POST https://api.hotel.com/api/habitaciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nro_habitacion": "301",
    "tipo_id": "123e4567-e89b-12d3-a456-426614174000",
    "piso": 3,
    "url_imagen": "https://example.com/rooms/301.jpg",
    "estado": "DISPONIBLE",
    "limpieza": "LIMPIA",
    "notas": "Habitación con vista al mar",
    "muebles": [
      "550e8400-e29b-41d4-a716-446655440001",
      "550e8400-e29b-41d4-a716-446655440002"
    ]
  }'
```

### Actualizar estado de limpieza (personal de limpieza)

```bash
curl -X PATCH https://api.hotel.com/api/habitaciones/789e4567-e89b-12d3-a456-426614174000/estado \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "limpieza": "LIMPIA"
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

### Actualizar ambos estados simultáneamente

```bash
curl -X PATCH https://api.hotel.com/api/habitaciones/789e4567-e89b-12d3-a456-426614174000/estado \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "estado": "DISPONIBLE",
    "limpieza": "LIMPIA"
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
