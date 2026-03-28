# API de Canales


> **Autorización:** Las rutas que restrigen por rol usan `requireRoles(...)` (`src/presentation/middlewares/roles.middleware.ts`) con valores en `src/common/constants/roles.ts` (p. ej. `admin`, `recepcionista`). Cualquier mención a "ADMIN" u otros roles aquí es orientativa; la fuente de verdad es el `*.routes.ts` correspondiente.


Documentación de los endpoints para la gestión de canales de venta.

## Base URL

```
/api/private/canales
```

## Autenticación

Todos los endpoints requieren autenticación mediante Better Auth. Los endpoints de creación, actualización y eliminación requieren rol `ADMIN`.

---

## Endpoints

### 1. Listar Canales

Obtiene la lista de todos los canales registrados.

**Endpoint:** `GET /api/private/canales`

**Autenticación:** Requerida

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Canales obtenidos exitosamente",
  "data": [
    {
      "id": "uuid",
      "nombre": "Booking.com",
      "tipo": "OTA",
      "activo": true,
      "notas": "Canal principal de reservas online",
      "created_at": "2024-03-22T10:00:00.000Z",
      "updated_at": "2024-03-22T10:00:00.000Z"
    }
  ],
  "timestamp": 1234567890
}
```

---

### 2. Obtener Canal por ID

Obtiene los detalles de un canal específico.

**Endpoint:** `GET /api/private/canales/:id`

**Autenticación:** Requerida

**Parámetros de URL:**

- `id` (UUID, requerido): ID del canal

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Canal encontrado",
  "data": {
    "id": "uuid",
    "nombre": "Booking.com",
    "tipo": "OTA",
    "activo": true,
    "notas": "Canal principal de reservas online",
    "created_at": "2024-03-22T10:00:00.000Z",
    "updated_at": "2024-03-22T10:00:00.000Z"
  },
  "timestamp": 1234567890
}
```

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "Canal no encontrado",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 3. Crear Canal

Crea un nuevo canal de venta.

**Endpoint:** `POST /api/private/canales`

**Autenticación:** Requerida (rol ADMIN)

**Body:**

```json
{
  "nombre": "Booking.com",
  "tipo": "OTA",
  "activo": true,
  "notas": "Canal principal de reservas online"
}
```

**Campos:**

- `nombre` (string, requerido): Nombre único del canal
- `tipo` (enum, requerido): Tipo de canal. Valores: `"OTA"`, `"DIRECTO"`, `"AGENTE"`
- `activo` (boolean, opcional): Estado del canal. Default: `true`
- `notas` (string, opcional): Notas adicionales sobre el canal

**Respuesta Exitosa (201):**

```json
{
  "success": true,
  "message": "Canal creado exitosamente",
  "data": {
    "id": "uuid",
    "nombre": "Booking.com",
    "tipo": "OTA",
    "activo": true,
    "notas": "Canal principal de reservas online",
    "created_at": "2024-03-22T10:00:00.000Z",
    "updated_at": "2024-03-22T10:00:00.000Z"
  },
  "timestamp": 1234567890
}
```

**Respuesta de Error (409):**

```json
{
  "success": false,
  "message": "Ya existe un canal con el nombre 'Booking.com'",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 4. Actualizar Canal

Actualiza los datos de un canal existente.

**Endpoint:** `PUT /api/private/canales/:id`

**Autenticación:** Requerida (rol ADMIN)

**Parámetros de URL:**

- `id` (UUID, requerido): ID del canal

**Body:**

```json
{
  "nombre": "Booking.com Updated",
  "tipo": "OTA",
  "activo": false,
  "notas": "Canal desactivado temporalmente"
}
```

**Campos (todos opcionales):**

- `nombre` (string): Nombre único del canal
- `tipo` (enum): Tipo de canal. Valores: `"OTA"`, `"DIRECTO"`, `"AGENTE"`
- `activo` (boolean): Estado del canal
- `notas` (string): Notas adicionales

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Canal actualizado exitosamente",
  "data": {
    "id": "uuid",
    "nombre": "Booking.com Updated",
    "tipo": "OTA",
    "activo": false,
    "notas": "Canal desactivado temporalmente",
    "created_at": "2024-03-22T10:00:00.000Z",
    "updated_at": "2024-03-22T15:30:00.000Z"
  },
  "timestamp": 1234567890
}
```

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "Canal no encontrado",
  "data": null,
  "timestamp": 1234567890
}
```

**Respuesta de Error (409):**

```json
{
  "success": false,
  "message": "Ya existe un canal con el nombre 'Booking.com Updated'",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 5. Eliminar Canal

Elimina un canal del sistema.

**Endpoint:** `DELETE /api/private/canales/:id`

**Autenticación:** Requerida (rol ADMIN)

**Parámetros de URL:**

- `id` (UUID, requerido): ID del canal

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Canal eliminado exitosamente",
  "data": null,
  "timestamp": 1234567890
}
```

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "Canal no encontrado",
  "data": null,
  "timestamp": 1234567890
}
```

**Respuesta de Error (409):**

```json
{
  "success": false,
  "message": "No se puede eliminar el canal porque tiene registros relacionados",
  "data": null,
  "timestamp": 1234567890
}
```

---

## Tipos de Canal

| Valor     | Descripción                                                           |
| --------- | --------------------------------------------------------------------- |
| `OTA`     | Online Travel Agency (Agencias de viaje online como Booking, Expedia) |
| `DIRECTO` | Reservas directas del hotel (teléfono, email, presencial)             |
| `AGENTE`  | Agentes de viaje o intermediarios                                     |

---

## Códigos de Estado HTTP

- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Datos de entrada inválidos
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: Sin permisos suficientes
- `404 Not Found`: Recurso no encontrado
- `409 Conflict`: Conflicto (nombre duplicado o registros relacionados)
- `500 Internal Server Error`: Error del servidor
