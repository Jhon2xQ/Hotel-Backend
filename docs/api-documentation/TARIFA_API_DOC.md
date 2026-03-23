# API de Tarifas

Documentación de los endpoints para la gestión de tarifas de habitaciones por canal.

## Base URL

```
/api/tarifas
```

## Autenticación

Todos los endpoints requieren autenticación mediante Better Auth. Los endpoints de creación, actualización y eliminación requieren rol `ADMIN`.

---

## Endpoints

### 1. Listar Tarifas

Obtiene la lista de todas las tarifas registradas con sus relaciones completas (tipo de habitación y canal).

**Endpoint:** `GET /api/tarifas`

**Autenticación:** Requerida

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Tarifas obtenidas exitosamente",
  "data": [
    {
      "id": "uuid",
      "tipo_habitacion": {
        "id": "uuid",
        "nombre": "Suite Deluxe",
        "descripcion": "Suite de lujo con vista panorámica",
        "created_at": "2024-03-20T10:00:00.000Z",
        "updated_at": "2024-03-20T10:00:00.000Z"
      },
      "canal": {
        "id": "uuid",
        "nombre": "Booking.com",
        "tipo": "OTA",
        "activo": true,
        "notas": "Canal principal de reservas online",
        "created_at": "2024-03-21T10:00:00.000Z",
        "updated_at": "2024-03-21T10:00:00.000Z"
      },
      "precio_noche": 150.0,
      "iva": 18.0,
      "cargo_servicios": 10.0,
      "moneda": "USD",
      "created_at": "2024-03-22T10:00:00.000Z",
      "updated_at": "2024-03-22T10:00:00.000Z"
    }
  ],
  "timestamp": 1234567890
}
```

---

### 2. Obtener Tarifa por ID

Obtiene los detalles de una tarifa específica con sus relaciones completas.

**Endpoint:** `GET /api/tarifas/:id`

**Autenticación:** Requerida

**Parámetros de URL:**

- `id` (UUID, requerido): ID de la tarifa

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Tarifa encontrada",
  "data": {
    "id": "uuid",
    "tipo_habitacion": {
      "id": "uuid",
      "nombre": "Suite Deluxe",
      "descripcion": "Suite de lujo con vista panorámica",
      "created_at": "2024-03-20T10:00:00.000Z",
      "updated_at": "2024-03-20T10:00:00.000Z"
    },
    "canal": {
      "id": "uuid",
      "nombre": "Booking.com",
      "tipo": "OTA",
      "activo": true,
      "notas": "Canal principal de reservas online",
      "created_at": "2024-03-21T10:00:00.000Z",
      "updated_at": "2024-03-21T10:00:00.000Z"
    },
    "precio_noche": 150.0,
    "iva": 18.0,
    "cargo_servicios": 10.0,
    "moneda": "USD",
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
  "message": "Tarifa no encontrada",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 3. Crear Tarifa

Crea una nueva tarifa para un tipo de habitación y canal específicos.

**Endpoint:** `POST /api/tarifas`

**Autenticación:** Requerida (rol ADMIN)

**Body:**

```json
{
  "tipo_habitacion_id": "uuid",
  "canal_id": "uuid",
  "precio_noche": 150.0,
  "iva": 18.0,
  "cargo_servicios": 10.0,
  "moneda": "USD"
}
```

**Campos:**

- `tipo_habitacion_id` (UUID, requerido): ID del tipo de habitación
- `canal_id` (UUID, requerido): ID del canal de venta
- `precio_noche` (number, requerido): Precio por noche (debe ser mayor a 0)
- `iva` (number, opcional): Porcentaje de IVA (0-100)
- `cargo_servicios` (number, opcional): Porcentaje de cargo por servicios (0-100)
- `moneda` (string, opcional): Código de moneda de 3 caracteres. Default: `"USD"`

**Respuesta Exitosa (201):**

```json
{
  "success": true,
  "message": "Tarifa creada exitosamente",
  "data": {
    "id": "uuid",
    "tipo_habitacion": {
      "id": "uuid",
      "nombre": "Suite Deluxe",
      "descripcion": "Suite de lujo con vista panorámica",
      "created_at": "2024-03-20T10:00:00.000Z",
      "updated_at": "2024-03-20T10:00:00.000Z"
    },
    "canal": {
      "id": "uuid",
      "nombre": "Booking.com",
      "tipo": "OTA",
      "activo": true,
      "notas": "Canal principal de reservas online",
      "created_at": "2024-03-21T10:00:00.000Z",
      "updated_at": "2024-03-21T10:00:00.000Z"
    },
    "precio_noche": 150.0,
    "iva": 18.0,
    "cargo_servicios": 10.0,
    "moneda": "USD",
    "created_at": "2024-03-22T10:00:00.000Z",
    "updated_at": "2024-03-22T10:00:00.000Z"
  },
  "timestamp": 1234567890
}
```

**Respuesta de Error (400):**

```json
{
  "success": false,
  "message": "El precio por noche debe ser mayor a 0",
  "data": null,
  "timestamp": 1234567890
}
```

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "Tipo de habitación no encontrado",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 4. Actualizar Tarifa

Actualiza los datos de una tarifa existente.

**Endpoint:** `PUT /api/tarifas/:id`

**Autenticación:** Requerida (rol ADMIN)

**Parámetros de URL:**

- `id` (UUID, requerido): ID de la tarifa

**Body:**

```json
{
  "precio_noche": 175.0,
  "iva": 18.0,
  "cargo_servicios": 12.0
}
```

**Campos (todos opcionales):**

- `tipo_habitacion_id` (UUID): ID del tipo de habitación
- `canal_id` (UUID): ID del canal de venta
- `precio_noche` (number): Precio por noche (debe ser mayor a 0)
- `iva` (number): Porcentaje de IVA (0-100)
- `cargo_servicios` (number): Porcentaje de cargo por servicios (0-100)
- `moneda` (string): Código de moneda de 3 caracteres

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Tarifa actualizada exitosamente",
  "data": {
    "id": "uuid",
    "tipo_habitacion": {
      "id": "uuid",
      "nombre": "Suite Deluxe",
      "descripcion": "Suite de lujo con vista panorámica",
      "created_at": "2024-03-20T10:00:00.000Z",
      "updated_at": "2024-03-20T10:00:00.000Z"
    },
    "canal": {
      "id": "uuid",
      "nombre": "Booking.com",
      "tipo": "OTA",
      "activo": true,
      "notas": "Canal principal de reservas online",
      "created_at": "2024-03-21T10:00:00.000Z",
      "updated_at": "2024-03-21T10:00:00.000Z"
    },
    "precio_noche": 175.0,
    "iva": 18.0,
    "cargo_servicios": 12.0,
    "moneda": "USD",
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
  "message": "Tarifa no encontrada",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 5. Eliminar Tarifa

Elimina una tarifa del sistema.

**Endpoint:** `DELETE /api/tarifas/:id`

**Autenticación:** Requerida (rol ADMIN)

**Parámetros de URL:**

- `id` (UUID, requerido): ID de la tarifa

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Tarifa eliminada exitosamente",
  "data": null,
  "timestamp": 1234567890
}
```

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "Tarifa no encontrada",
  "data": null,
  "timestamp": 1234567890
}
```

---

## Estructura de Respuesta

### Objeto Tarifa

Todas las respuestas que devuelven tarifas incluyen automáticamente las entidades relacionadas completas:

```json
{
  "id": "uuid",
  "tipo_habitacion": {
    "id": "uuid",
    "nombre": "Suite Deluxe",
    "descripcion": "Suite de lujo con vista panorámica",
    "created_at": "2024-03-20T10:00:00.000Z",
    "updated_at": "2024-03-20T10:00:00.000Z"
  },
  "canal": {
    "id": "uuid",
    "nombre": "Booking.com",
    "tipo": "OTA",
    "activo": true,
    "notas": "Canal principal de reservas online",
    "created_at": "2024-03-21T10:00:00.000Z",
    "updated_at": "2024-03-21T10:00:00.000Z"
  },
  "precio_noche": 150.0,
  "iva": 18.0,
  "cargo_servicios": 10.0,
  "moneda": "USD",
  "created_at": "2024-03-22T10:00:00.000Z",
  "updated_at": "2024-03-22T10:00:00.000Z"
}
```

**Nota importante:** La respuesta NO incluye `tipo_habitacion_id` ni `canal_id` como campos separados. En su lugar, se devuelven los objetos completos de `tipo_habitacion` y `canal` con toda su información. Esto elimina la necesidad de hacer múltiples requests para obtener información relacionada.

---

## Validaciones

### Precio por Noche

- Debe ser un número positivo mayor a 0
- Se valida tanto en creación como en actualización

### IVA y Cargo por Servicios

- Deben ser números entre 0 y 100 (porcentajes)
- Son opcionales

### Moneda

- Debe ser un código de 3 caracteres (ISO 4217)
- Ejemplos: USD, EUR, PEN, MXN

### Relaciones

- El `tipo_habitacion_id` debe existir en la tabla de tipos de habitación
- El `canal_id` debe existir en la tabla de canales
- Ambas relaciones son obligatorias y siempre se devuelven en las respuestas

---

## Códigos de Estado HTTP

- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Datos de entrada inválidos
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: Sin permisos suficientes
- `404 Not Found`: Recurso no encontrado (tarifa, tipo de habitación o canal)
- `500 Internal Server Error`: Error del servidor
