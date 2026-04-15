# API de Promociones

> **Autorización:** Las rutas que restrigen por rol usan `requireRoles(...)` (`src/presentation/middlewares/roles.middleware.ts`) con valores en `src/common/constants/roles.ts` (p. ej. `admin`, `recepcionista`). Cualquier mención a "ADMIN" u otros roles aquí es orientativa; la fuente de verdad es el `*.routes.ts` correspondiente.

Documentación de los endpoints para la gestión de promociones y descuentos aplicables a habitaciones.

## Base URL

```
/api/private/promociones
```

## Autenticación

Todos los endpoints requieren autenticación mediante Better Auth. Los endpoints de creación, actualización y eliminación requieren rol `ADMIN`.

---

## Endpoints

### 1. Listar Promociones

Obtiene la lista completa de todas las promociones registradas. Cada promoción incluye el array de IDs de habitaciones asociadas.

**Endpoint:** `GET /api/private/promociones`

**Autenticación:** Requerida

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Promociones obtenidas exitosamente",
  "data": [
    {
      "id": "uuid",
      "codigo": "PROMO-VERANO",
      "tipo_descuento": "PORCENTAJE",
      "valor_descuento": 15.0,
      "vig_desde": "2026-06-01T00:00:00.000Z",
      "vig_hasta": "2026-08-31T23:59:59.000Z",
      "estado": true,
      "habitaciones": ["uuid-hab-1", "uuid-hab-2"],
      "created_at": "2026-04-14T10:00:00.000Z",
      "updated_at": "2026-04-14T10:00:00.000Z"
    },
    {
      "id": "uuid",
      "codigo": "PROMO-INVIERNO",
      "tipo_descuento": "MONTO_FIJO",
      "valor_descuento": 50.0,
      "vig_desde": "2026-12-01T00:00:00.000Z",
      "vig_hasta": "2027-02-28T23:59:59.000Z",
      "estado": true,
      "habitaciones": [],
      "created_at": "2026-04-14T11:00:00.000Z",
      "updated_at": "2026-04-14T11:00:00.000Z"
    }
  ],
  "timestamp": 1234567890
}
```

---

### 2. Obtener Promoción por ID

Obtiene los detalles de una promoción específica, incluyendo el array de IDs de habitaciones asociadas.

**Endpoint:** `GET /api/private/promociones/:id`

**Autenticación:** Requerida

**Parámetros de URL:**

- `id` (UUID, requerido): ID de la promoción

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Promoción encontrada",
  "data": {
    "id": "uuid",
    "codigo": "PROMO-VERANO",
    "tipo_descuento": "PORCENTAJE",
    "valor_descuento": 15.0,
    "vig_desde": "2026-06-01T00:00:00.000Z",
    "vig_hasta": "2026-08-31T23:59:59.000Z",
    "estado": true,
    "habitaciones": ["uuid-hab-1", "uuid-hab-2"],
    "created_at": "2026-04-14T10:00:00.000Z",
    "updated_at": "2026-04-14T10:00:00.000Z"
  },
  "timestamp": 1234567890
}
```

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "Promoción no encontrada",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 3. Crear Promoción

Crea una nueva promoción con descuento aplicable a habitaciones. Opcionalmente se pueden asociar habitaciones desde la creación.

**Endpoint:** `POST /api/private/promociones`

**Autenticación:** Requerida (rol ADMIN)

**Body:**

```json
{
  "codigo": "PROMO-VERANO",
  "tipo_descuento": "PORCENTAJE",
  "valor_descuento": 15.0,
  "vig_desde": "2026-06-01T00:00:00.000Z",
  "vig_hasta": "2026-08-31T23:59:59.000Z",
  "estado": true,
  "habitaciones": ["uuid-hab-1", "uuid-hab-2"]
}
```

**Campos:**

- `codigo` (string, requerido): Código único de la promoción
- `tipo_descuento` (enum, requerido): Tipo de descuento. Valores: `"PORCENTAJE"`, `"MONTO_FIJO"`
- `valor_descuento` (número, requerido): Valor del descuento (debe ser mayor a 0)
- `vig_desde` (string, requerido): Fecha de inicio de vigencia (ISO 8601)
- `vig_hasta` (string, requerido): Fecha de fin de vigencia (ISO 8601, debe ser posterior a `vig_desde`)
- `estado` (boolean, opcional): Estado de la promoción. Default: `true`
- `habitaciones` (array de UUID, opcional): IDs de habitaciones a las que se aplicará esta promoción. Cada ID será validado; si alguno no existe, se rechaza la petición.

**Respuesta Exitosa (201):**

```json
{
  "success": true,
  "message": "Promoción creada exitosamente",
  "data": {
    "id": "uuid",
    "codigo": "PROMO-VERANO",
    "tipo_descuento": "PORCENTAJE",
    "valor_descuento": 15.0,
    "vig_desde": "2026-06-01T00:00:00.000Z",
    "vig_hasta": "2026-08-31T23:59:59.000Z",
    "estado": true,
    "habitaciones": ["uuid-hab-1", "uuid-hab-2"],
    "created_at": "2026-04-14T10:00:00.000Z",
    "updated_at": "2026-04-14T10:00:00.000Z"
  },
  "timestamp": 1234567890
}
```

**Respuesta de Error (400):**

```json
{
  "success": false,
  "message": "La fecha de fin debe ser posterior a la fecha de inicio",
  "data": null,
  "timestamp": 1234567890
}
```

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "Habitación no encontrada",
  "data": null,
  "timestamp": 1234567890
}
```

**Respuesta de Error (409):**

```json
{
  "success": false,
  "message": "Ya existe una promoción con ese código",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 4. Actualizar Promoción

Actualiza los datos de una promoción existente, incluyendo la relación con habitaciones.

**Endpoint:** `PUT /api/private/promociones/:id`

**Autenticación:** Requerida (rol ADMIN)

**Parámetros de URL:**

- `id` (UUID, requerido): ID de la promoción

**Body:**

```json
{
  "codigo": "PROMO-VERANO-2026",
  "tipo_descuento": "MONTO_FIJO",
  "valor_descuento": 50.0,
  "vig_desde": "2026-07-01T00:00:00.000Z",
  "vig_hasta": "2026-07-31T23:59:59.000Z",
  "estado": false,
  "habitaciones": ["uuid-hab-3", "uuid-hab-4", "uuid-hab-5"]
}
```

**Campos (todos opcionales):**

- `codigo` (string): Código único de la promoción
- `tipo_descuento` (enum): Tipo de descuento. Valores: `"PORCENTAJE"`, `"MONTO_FIJO"`
- `valor_descuento` (número): Valor del descuento (debe ser mayor a 0)
- `vig_desde` (string): Fecha de inicio de vigencia (ISO 8601)
- `vig_hasta` (string): Fecha de fin de vigencia (ISO 8601)
- `estado` (boolean): Estado de la promoción
- `habitaciones` (array de UUID): IDs de habitaciones a las que se aplicará esta promoción. Cada ID será validado; si alguno no existe, se rechaza la petición.

**Nota sobre `habitaciones`:** Al enviar este campo, se **reemplazan** todas las relaciones existentes con las nuevas habitaciones proporcionadas. Si se omite, las relaciones actuales se mantienen sin cambios.

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Promoción actualizada exitosamente",
  "data": {
    "id": "uuid",
    "codigo": "PROMO-VERANO-2026",
    "tipo_descuento": "MONTO_FIJO",
    "valor_descuento": 50.0,
    "vig_desde": "2026-07-01T00:00:00.000Z",
    "vig_hasta": "2026-07-31T23:59:59.000Z",
    "estado": false,
    "habitaciones": ["uuid-hab-3", "uuid-hab-4", "uuid-hab-5"],
    "created_at": "2026-04-14T10:00:00.000Z",
    "updated_at": "2026-04-14T15:30:00.000Z"
  },
  "timestamp": 1234567890
}
```

**Respuesta de Error (400):**

```json
{
  "success": false,
  "message": "La fecha de fin debe ser posterior a la fecha de inicio",
  "data": null,
  "timestamp": 1234567890
}
```

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "Promoción no encontrada",
  "data": null,
  "timestamp": 1234567890
}
```

```json
{
  "success": false,
  "message": "Habitación no encontrada",
  "data": null,
  "timestamp": 1234567890
}
```

**Respuesta de Error (409):**

```json
{
  "success": false,
  "message": "Ya existe una promoción con ese código",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 5. Eliminar Promoción

Elimina una promoción del sistema.

**Endpoint:** `DELETE /api/private/promociones/:id`

**Autenticación:** Requerida (rol ADMIN)

**Parámetros de URL:**

- `id` (UUID, requerido): ID de la promoción

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Promoción eliminada exitosamente",
  "data": null,
  "timestamp": 1234567890
}
```

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "Promoción no encontrada",
  "data": null,
  "timestamp": 1234567890
}
```

---

## Tipos de Descuento

| Valor        | Descripción                                              |
| ------------ | -------------------------------------------------------- |
| `PORCENTAJE` | Descuento porcentual sobre el precio (p. ej. 15%)        |
| `MONTO_FIJO` | Descuento de monto fijo en moneda (p. ej. 50.00 soles)   |

---

## Relación Muchos a Muchos con Habitaciones

Las promociones tienen una relación muchos a muchos con las habitaciones:

- Una **promoción** puede aplicarse a **múltiples habitaciones**
- Una **habitación** puede tener **múltiples promociones**

Esta relación se gestiona mediante el campo `habitaciones` en los endpoints de creación (`POST`) y actualización (`PUT`).

### Ejemplo: Crear promoción con habitaciones

```json
{
  "codigo": "PROMO-SUPERIOR",
  "tipo_descuento": "PORCENTAJE",
  "valor_descuento": 20.0,
  "vig_desde": "2026-12-01T00:00:00.000Z",
  "vig_hasta": "2026-12-31T23:59:59.000Z",
  "habitaciones": ["hab-101", "hab-102", "hab-103"]
}
```

### Ejemplo: Actualizar relación de habitaciones

```json
{
  "habitaciones": ["hab-201", "hab-202"]
}
```

Este request reemplaza todas las relaciones existentes con las dos nuevas habitaciones.

### Respuesta con habitaciones

Tanto `GET /` como `GET /:id` devuelven el campo `habitaciones` como un array de UUIDs:

```json
{
  "id": "promo-uuid",
  "codigo": "PROMO-EJEMPLO",
  "habitaciones": ["hab-101", "hab-102"]
}
```

---

## Aplicación en Reservas

Las promociones pueden aplicarse a reservas enviando los IDs de las promociones en el campo `promociones` al crear una reserva:

```json
{
  "huespedId": "uuid",
  "habitacionId": "uuid",
  "tarifaId": "uuid",
  "fechaInicio": "2024-03-25T15:00:00Z",
  "fechaFin": "2024-03-27T12:00:00Z",
  "adultos": 2,
  "ninos": 1,
  "promociones": ["uuid-promocion-1", "uuid-promocion-2"]
}
```

### Validación de Promociones

Solo se aplicarán las promociones que cumplan todas las condiciones:

1. **Activa**: `estado: true`
2. **Vigente**: La fecha actual debe estar dentro del rango `[vig_desde, vig_hasta]`

### Cálculo de Descuentos

- **PORCENTAJE**: `descuento = subtotal × (valor_descuento / 100)`
- **MONTO_FIJO**: `descuento = valor_descuento`

El descuento total es la suma de todas las promociones aplicables. El monto final de la reserva se calcula aplicando el descuento al subtotal antes de agregar IVA y cargo por servicios.

### Respuesta con Promociones

La respuesta de la reserva creada incluirá los códigos de las promociones aplicadas:

```json
{
  "id": "uuid-reserva",
  "codigo": "KOR-20240325-ABC123",
  "monto_total": 420.0,
  "monto_descuento": 50.0,
  "promociones": ["PROMO-VERANO", "PROMO-DESCUENTO"]
}
```

---

## Códigos de Estado HTTP

- `200 OK`: Operación exitosa
- `201 Created`: Promoción creada exitosamente
- `400 Bad Request`: Datos de entrada inválidos (fechas inválidas o valor de descuento <= 0)
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: Sin permisos suficientes
- `404 Not Found`: Promoción o habitación no encontrada
- `409 Conflict`: Código de promoción duplicado
- `500 Internal Server Error`: Error del servidor
