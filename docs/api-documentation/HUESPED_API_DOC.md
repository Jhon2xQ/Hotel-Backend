# API de Huéspedes

Documentación de los endpoints para la gestión de huéspedes del hotel.

## Base URL

```
/api/huespedes
```

## Autenticación

Todos los endpoints requieren autenticación mediante Better Auth. El token de sesión debe incluirse en las cookies de la petición.

---

## Endpoints

### 1. Listar Huéspedes (Paginado)

Obtiene una lista paginada de huéspedes registrados en el sistema.

**Endpoint:** `GET /api/huespedes`

**Autenticación:** Requerida

**Query Parameters:**

- `page` (number, opcional): Número de página (por defecto: 1, mínimo: 1)
- `limit` (number, opcional): Cantidad de resultados por página (por defecto: 10, mínimo: 1, máximo: 100)

**Ejemplo de petición:**

```bash
# Sin parámetros (usa valores por defecto: page=1, limit=10)
GET /api/huespedes

# Con parámetros personalizados
GET /api/huespedes?page=2&limit=20

# Primera página con 50 registros
GET /api/huespedes?page=1&limit=50
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Huéspedes obtenidos exitosamente",
  "data": {
    "list": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "tipo_doc": "DNI",
        "nro_doc": "12345678",
        "nombres": "Juan Carlos",
        "apellidos": "Pérez García",
        "email": "juan.perez@example.com",
        "telefono": "+51987654321",
        "nacionalidad": "Perú",
        "observacion": "Cliente frecuente",
        "created_at": "2026-03-15T10:30:00.000Z",
        "updated_at": "2026-03-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 2,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPreviousPage": true
    }
  },
  "timestamp": 1710498600000
}
```

**Campos de la respuesta:**

- `list`: Array de huéspedes en la página actual
- `pagination`: Objeto con información de paginación
  - `page`: Número de página actual
  - `limit`: Cantidad de resultados por página
  - `total`: Total de huéspedes en el sistema
  - `totalPages`: Total de páginas disponibles
  - `hasNextPage`: `true` si existe una página siguiente, `false` en caso contrario
  - `hasPreviousPage`: `true` si existe una página anterior, `false` en caso contrario

**Respuesta de error (400) - Validación:**

```json
{
  "success": false,
  "message": "Error de validación en query: page: La página debe ser mayor a 0",
  "data": null,
  "timestamp": 1710498600000
}
```

---

### 2. Obtener Huésped por ID

Obtiene los detalles de un huésped específico.

**Endpoint:** `GET /api/huespedes/:id`

**Autenticación:** Requerida

**Parámetros de ruta:**

- `id` (UUID, requerido): ID del huésped

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Huésped encontrado",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "tipo_doc": "DNI",
    "nro_doc": "12345678",
    "nombres": "Juan Carlos",
    "apellidos": "Pérez García",
    "email": "juan.perez@example.com",
    "telefono": "+51987654321",
    "nacionalidad": "Perú",
    "observacion": "Cliente frecuente, prefiere habitaciones con vista",
    "created_at": "2026-03-15T10:30:00.000Z",
    "updated_at": "2026-03-15T10:30:00.000Z"
  },
  "timestamp": 1710498600000
}
```

**Respuesta de error (404):**

```json
{
  "success": false,
  "message": "Huésped con id \"550e8400-e29b-41d4-a716-446655440000\" no encontrado",
  "data": null,
  "timestamp": 1710498600000
}
```

---

### 3. Crear Huésped

Registra un nuevo huésped en el sistema.

**Endpoint:** `POST /api/huespedes`

**Autenticación:** Requerida

**Body (JSON):**

```json
{
  "tipo_doc": "PASAPORTE",
  "nro_doc": "AB123456",
  "nombres": "María Elena",
  "apellidos": "Rodríguez López",
  "email": "maria.rodriguez@example.com",
  "telefono": "+51912345678",
  "nacionalidad": "Argentina",
  "observacion": "Primera visita al hotel"
}
```

**Campos:**

- `tipo_doc` (string, opcional): Tipo de documento ("DNI", "PASAPORTE", "RUC", "CE")
- `nro_doc` (string, opcional): Número de documento (máx. 20 caracteres)
- `nombres` (string, requerido): Nombres del huésped (máx. 80 caracteres)
- `apellidos` (string, requerido): Apellidos del huésped (máx. 80 caracteres)
- `email` (string, requerido): Email del huésped (máx. 120 caracteres, debe ser único)
- `telefono` (string, requerido): Teléfono del huésped (máx. 20 caracteres)
- `nacionalidad` (string, requerido): Nacionalidad del huésped (máx. 60 caracteres)
- `observacion` (string, opcional): Observaciones adicionales sobre el huésped

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "message": "Huésped creado exitosamente",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "tipo_doc": "PASAPORTE",
    "nro_doc": "AB123456",
    "nombres": "María Elena",
    "apellidos": "Rodríguez López",
    "email": "maria.rodriguez@example.com",
    "telefono": "+51912345678",
    "nacionalidad": "Argentina",
    "observacion": "Primera visita al hotel",
    "created_at": "2026-03-18T14:20:00.000Z",
    "updated_at": "2026-03-18T14:20:00.000Z"
  },
  "timestamp": 1710770400000
}
```

**Respuesta de error (409):**

```json
{
  "success": false,
  "message": "Ya existe un huésped con el email \"maria.rodriguez@example.com\"",
  "data": null,
  "timestamp": 1710770400000
}
```

---

### 4. Actualizar Huésped

Actualiza los datos de un huésped existente.

**Endpoint:** `PUT /api/huespedes/:id`

**Autenticación:** Requerida

**Parámetros de ruta:**

- `id` (UUID, requerido): ID del huésped a actualizar

**Body (JSON):**

```json
{
  "telefono": "+51987654322",
  "observacion": "Cliente VIP, cumpleaños en marzo"
}
```

**Campos (todos opcionales):**

- `tipo_doc` (string): Tipo de documento ("DNI", "PASAPORTE", "RUC", "CE")
- `nro_doc` (string): Número de documento (máx. 20 caracteres)
- `nombres` (string): Nombres del huésped (máx. 80 caracteres)
- `apellidos` (string): Apellidos del huésped (máx. 80 caracteres)
- `email` (string): Email del huésped (máx. 120 caracteres, debe ser único)
- `telefono` (string): Teléfono del huésped (máx. 20 caracteres)
- `nacionalidad` (string): Nacionalidad del huésped (máx. 60 caracteres)
- `observacion` (string): Observaciones adicionales sobre el huésped

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Huésped actualizado exitosamente",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "tipo_doc": "DNI",
    "nro_doc": "12345678",
    "nombres": "Juan Carlos",
    "apellidos": "Pérez García",
    "email": "juan.perez@example.com",
    "telefono": "+51987654322",
    "nacionalidad": "Perú",
    "observacion": "Cliente VIP, cumpleaños en marzo",
    "created_at": "2026-03-15T10:30:00.000Z",
    "updated_at": "2026-03-18T15:00:00.000Z"
  },
  "timestamp": 1710772800000
}
```

**Respuesta de error (404):**

```json
{
  "success": false,
  "message": "Huésped con id \"550e8400-e29b-41d4-a716-446655440000\" no encontrado",
  "data": null,
  "timestamp": 1710772800000
}
```

**Respuesta de error (409):**

```json
{
  "success": false,
  "message": "Ya existe un huésped con el email \"otro.email@example.com\"",
  "data": null,
  "timestamp": 1710772800000
}
```

---

### 5. Eliminar Huésped

Elimina un huésped del sistema.

**Endpoint:** `DELETE /api/huespedes/:id`

**Autenticación:** Requerida

**Parámetros de ruta:**

- `id` (UUID, requerido): ID del huésped a eliminar

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Huésped eliminado exitosamente",
  "data": null,
  "timestamp": 1710773400000
}
```

**Respuesta de error (404):**

```json
{
  "success": false,
  "message": "Huésped con id \"550e8400-e29b-41d4-a716-446655440000\" no encontrado",
  "data": null,
  "timestamp": 1710773400000
}
```

---

## Notas Importantes

### Paginación

El endpoint principal de listado (`GET /api/huespedes`) utiliza paginación para optimizar el rendimiento y la experiencia del usuario:

- **Valores por defecto**: Si no se especifican parámetros, se usa `page=1` y `limit=10`
- **Límite máximo**: El parámetro `limit` tiene un máximo de 100 registros por página
- **Ordenamiento**: Los resultados se ordenan por fecha de creación descendente (más recientes primero)
- **Metadata completa**: La respuesta incluye información útil como total de páginas, total de registros, y si hay páginas siguiente/anterior

**Ejemplos de uso:**

```bash
# Primera página con valores por defecto (10 registros)
GET /api/huespedes

# Segunda página con 20 registros
GET /api/huespedes?page=2&limit=20

# Obtener todos los registros posibles (máximo 100 por página)
GET /api/huespedes?limit=100
```

### Email Único

El email es un campo único en el sistema. No se pueden registrar dos huéspedes con el mismo email. Al actualizar, el sistema valida que el nuevo email no esté en uso por otro huésped.

### Validación de Datos

Todos los endpoints validan los datos de entrada:

- **Tipos de documento**: Solo se aceptan "DNI", "PASAPORTE", "RUC", "CE"
- **Email**: Debe ser un formato válido de email
- **UUID**: Los IDs deben ser UUIDs válidos
- **Longitudes**: Se respetan los límites máximos de caracteres especificados

### Eliminación

La eliminación de un huésped es permanente. Si el huésped tiene reservas o estadías asociadas, la operación puede fallar debido a restricciones de integridad referencial en la base de datos.

### Búsqueda de Huéspedes

Antes de crear un nuevo huésped, se recomienda buscar por email o documento de identidad para evitar duplicados. El sistema valida automáticamente la unicidad del email.

---

## Códigos de Estado HTTP

- `200 OK`: Operación exitosa
- `201 Created`: Huésped creado exitosamente
- `400 Bad Request`: Datos de entrada inválidos
- `401 Unauthorized`: No autenticado
- `404 Not Found`: Huésped no encontrado
- `409 Conflict`: Email duplicado
- `500 Internal Server Error`: Error del servidor
