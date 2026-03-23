# API de Tipos de Habitación

Documentación de los endpoints para gestionar los tipos de habitación del hotel.

## Base URL

```
/api/tipos-habitacion
```

## Autenticación

Todos los endpoints requieren autenticación mediante sesión de Better Auth.

## Endpoints

### 1. Listar Tipos de Habitación

Obtiene la lista completa de tipos de habitación.

**Endpoint:** `GET /api/tipos-habitacion`

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

**Notas:**

- Los tipos de habitación se devuelven ordenados por fecha de creación (más recientes primero)

---

### 2. Obtener Tipo de Habitación por ID

Obtiene los detalles de un tipo de habitación específico.

**Endpoint:** `GET /api/tipos-habitacion/:id`

**Permisos:** Usuario autenticado

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

```json
{
  "success": false,
  "message": "Tipo de habitación no encontrado",
  "data": null,
  "timestamp": 1710669600000
}
```

---

### 3. Crear Tipo de Habitación

Crea un nuevo tipo de habitación en el sistema.

**Endpoint:** `POST /api/tipos-habitacion`

**Permisos:** ADMIN

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

```json
{
  "success": false,
  "message": "El nombre es requerido",
  "data": null,
  "timestamp": 1710669600000
}
```

- `401`: No autenticado

```json
{
  "success": false,
  "message": "No autorizado",
  "data": null,
  "timestamp": 1710669600000
}
```

- `403`: No autorizado (requiere rol ADMIN)

```json
{
  "success": false,
  "message": "Acceso denegado. Se requiere rol de administrador",
  "data": null,
  "timestamp": 1710669600000
}
```

- `409`: Nombre duplicado

```json
{
  "success": false,
  "message": "Ya existe un tipo de habitación con el nombre 'Suite Deluxe'",
  "data": null,
  "timestamp": 1710669600000
}
```

---

### 4. Actualizar Tipo de Habitación

Actualiza los datos de un tipo de habitación existente.

**Endpoint:** `PUT /api/tipos-habitacion/:id`

**Permisos:** ADMIN

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
- `403`: No autorizado (requiere rol ADMIN)
- `404`: Tipo de habitación no encontrado

```json
{
  "success": false,
  "message": "Tipo de habitación no encontrado",
  "data": null,
  "timestamp": 1710669600000
}
```

- `409`: Nombre duplicado

```json
{
  "success": false,
  "message": "Ya existe un tipo de habitación con el nombre 'Suite Deluxe Premium'",
  "data": null,
  "timestamp": 1710669600000
}
```

**Notas:**

- Solo se actualizan los campos proporcionados en el body
- El campo `updated_at` se actualiza automáticamente
- Si se intenta cambiar el nombre a uno que ya existe, se retorna error 409

---

### 5. Eliminar Tipo de Habitación

Elimina un tipo de habitación del sistema.

**Endpoint:** `DELETE /api/tipos-habitacion/:id`

**Permisos:** ADMIN

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
- `403`: No autorizado (requiere rol ADMIN)
- `404`: Tipo de habitación no encontrado

```json
{
  "success": false,
  "message": "Tipo de habitación no encontrado",
  "data": null,
  "timestamp": 1710669600000
}
```

- `409`: No se puede eliminar porque está en uso

```json
{
  "success": false,
  "message": "No se puede eliminar el tipo de habitación porque tiene registros relacionados",
  "data": null,
  "timestamp": 1710669600000
}
```

**Notas:**

- No se puede eliminar un tipo de habitación si tiene habitaciones asociadas
- Esta validación protege la integridad referencial de los datos

---

## Códigos de Error

| Código | Descripción                                                 |
| ------ | ----------------------------------------------------------- |
| 400    | Datos de entrada inválidos (validación de Zod)              |
| 401    | No autenticado (sesión inválida o inexistente)              |
| 403    | No autorizado (requiere rol ADMIN)                          |
| 404    | Tipo de habitación no encontrado                            |
| 409    | Conflicto (nombre duplicado o tiene registros relacionados) |
| 500    | Error interno del servidor                                  |

---

## Validaciones

### Campo `nombre`

- **Requerido**: Sí
- **Tipo**: String
- **Longitud mínima**: 1 carácter
- **Longitud máxima**: 100 caracteres
- **Único**: Sí (no puede haber dos tipos con el mismo nombre)
- **Ejemplo**: "Suite Deluxe", "Habitación Estándar", "Suite Presidencial"

### Campo `descripcion`

- **Requerido**: No
- **Tipo**: String
- **Longitud máxima**: Sin límite
- **Ejemplo**: "Suite de lujo con vista panorámica al mar y todas las comodidades"

---

## Notas

- Los tipos de habitación definen las plantillas o categorías de habitaciones disponibles en el hotel
- Los tipos de habitación se utilizan como referencia para crear habitaciones físicas
- El campo `nombre` debe ser único en todo el sistema
- Los campos `created_at` y `updated_at` se gestionan automáticamente por el sistema
- No se puede eliminar un tipo de habitación si tiene habitaciones asociadas
- Al crear o actualizar, se valida que el nombre no esté duplicado

---

## Ejemplos de Uso

### Crear un tipo de habitación básico

```bash
curl -X POST https://api.hotel.com/api/tipos-habitacion \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nombre": "Habitación Estándar",
    "descripcion": "Habitación cómoda con todas las comodidades básicas"
  }'
```

### Crear un tipo de habitación de lujo

```bash
curl -X POST https://api.hotel.com/api/tipos-habitacion \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nombre": "Suite Deluxe",
    "descripcion": "Suite de lujo con vista panorámica al mar, jacuzzi y todas las comodidades premium"
  }'
```

### Crear un tipo sin descripción

```bash
curl -X POST https://api.hotel.com/api/tipos-habitacion \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nombre": "Habitación Económica"
  }'
```

### Actualizar solo el nombre

```bash
curl -X PUT https://api.hotel.com/api/tipos-habitacion/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nombre": "Suite Deluxe Premium"
  }'
```

### Actualizar solo la descripción

```bash
curl -X PUT https://api.hotel.com/api/tipos-habitacion/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "descripcion": "Suite de lujo premium con vista panorámica al mar, jacuzzi privado y servicio de mayordomo 24/7"
  }'
```

### Actualizar nombre y descripción

```bash
curl -X PUT https://api.hotel.com/api/tipos-habitacion/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nombre": "Suite Presidencial",
    "descripcion": "La suite más lujosa del hotel con todas las comodidades premium"
  }'
```

### Listar todos los tipos

```bash
curl -X GET https://api.hotel.com/api/tipos-habitacion \
  -H "Authorization: Bearer <token>"
```

### Obtener un tipo específico

```bash
curl -X GET https://api.hotel.com/api/tipos-habitacion/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer <token>"
```

### Eliminar un tipo

```bash
curl -X DELETE https://api.hotel.com/api/tipos-habitacion/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer <token>"
```
