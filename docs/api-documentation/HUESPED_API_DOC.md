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

### 1. Listar Huéspedes

Obtiene la lista completa de huéspedes registrados en el sistema.

**Endpoint:** `GET /api/huespedes`

**Autenticación:** Requerida

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Huéspedes obtenidos exitosamente",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nombres": "Juan Carlos",
      "apellidos": "Pérez García",
      "email": "juan.perez@example.com",
      "telefono": "+51987654321",
      "nacionalidad": "Perú",
      "nivel_vip": 1,
      "notas": "Cliente frecuente, prefiere habitaciones con vista",
      "created_at": "2026-03-15T10:30:00.000Z",
      "updated_at": "2026-03-15T10:30:00.000Z"
    }
  ],
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
    "nombres": "Juan Carlos",
    "apellidos": "Pérez García",
    "email": "juan.perez@example.com",
    "telefono": "+51987654321",
    "nacionalidad": "Perú",
    "nivel_vip": 1,
    "notas": "Cliente frecuente, prefiere habitaciones con vista",
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
  "nombres": "María Elena",
  "apellidos": "Rodríguez López",
  "email": "maria.rodriguez@example.com",
  "telefono": "+51912345678",
  "nacionalidad": "Argentina",
  "nivel_vip": 0,
  "notas": "Primera visita al hotel"
}
```

**Campos:**

- `nombres` (string, requerido): Nombres del huésped (máx. 80 caracteres)
- `apellidos` (string, requerido): Apellidos del huésped (máx. 80 caracteres)
- `email` (string, requerido): Email del huésped (máx. 120 caracteres, debe ser único)
- `telefono` (string, requerido): Teléfono del huésped (máx. 20 caracteres)
- `nacionalidad` (string, requerido): Nacionalidad del huésped (máx. 60 caracteres)
- `nivel_vip` (number, opcional): Nivel VIP del huésped (0=normal, 1=VIP, 2=VVIP). Por defecto: 0
- `notas` (string, opcional): Notas adicionales sobre el huésped

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "message": "Huésped creado exitosamente",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "nombres": "María Elena",
    "apellidos": "Rodríguez López",
    "email": "maria.rodriguez@example.com",
    "telefono": "+51912345678",
    "nacionalidad": "Argentina",
    "nivel_vip": 0,
    "notas": "Primera visita al hotel",
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

**Respuesta de error (400):**

```json
{
  "success": false,
  "message": "El nivel VIP debe estar entre 0 y 2, recibido: 5",
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
  "nivel_vip": 2,
  "notas": "Cliente VIP, cumpleaños en marzo"
}
```

**Campos (todos opcionales):**

- `nombres` (string): Nombres del huésped (máx. 80 caracteres)
- `apellidos` (string): Apellidos del huésped (máx. 80 caracteres)
- `email` (string): Email del huésped (máx. 120 caracteres, debe ser único)
- `telefono` (string): Teléfono del huésped (máx. 20 caracteres)
- `nacionalidad` (string): Nacionalidad del huésped (máx. 60 caracteres)
- `nivel_vip` (number): Nivel VIP del huésped (0-2)
- `notas` (string): Notas adicionales sobre el huésped

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Huésped actualizado exitosamente",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nombres": "Juan Carlos",
    "apellidos": "Pérez García",
    "email": "juan.perez@example.com",
    "telefono": "+51987654322",
    "nacionalidad": "Perú",
    "nivel_vip": 2,
    "notas": "Cliente VIP, cumpleaños en marzo",
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

### Niveles VIP

El sistema maneja tres niveles de huéspedes:

- **0 (Normal)**: Cliente estándar sin beneficios especiales
- **1 (VIP)**: Cliente frecuente con beneficios como upgrades de habitación
- **2 (VVIP)**: Cliente premium con máxima prioridad y amenities especiales

### Email Único

El email es un campo único en el sistema. No se pueden registrar dos huéspedes con el mismo email. Al actualizar, el sistema valida que el nuevo email no esté en uso por otro huésped.

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
