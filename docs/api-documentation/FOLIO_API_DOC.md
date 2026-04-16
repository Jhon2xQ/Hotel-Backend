# API de Folios

> **Autorización:** Las rutas que restrigen por rol usan `requireRoles(...)` (`src/presentation/middlewares/roles.middleware.ts`) con valores en `src/common/constants/roles.ts` (p. ej. `admin`, `recepcionista`). Cualquier mención a "ADMIN" u otros roles aquí es orientativa; la fuente de verdad es el `*.routes.ts` correspondiente.

Documentación de los endpoints para la gestión de folios de reservas.

## Base URL

```
/api/private/folios
```

## Autenticación

Todos los endpoints requieren autenticación mediante Better Auth. Se requiere rol `ADMIN` o `RECEPCIONISTA`.

---

## Endpoints

### 1. Listar Folios

Obtiene la lista completa de todos los folios registrados. Cada folio incluye el array de códigos de promociones asociadas.

**Endpoint:** `GET /api/private/folios`

**Autenticación:** Requerida

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Folios obtenidos exitosamente",
  "data": [
    {
      "id": "uuid",
      "nro_folio": 1,
      "reserva_id": "uuid-reserva-1",
      "estado": true,
      "observacion": null,
      "cerrado_en": null,
      "promociones": ["PROMO-VERANO", "PROMO-DESCUENTO"],
      "created_at": "2026-04-14T10:00:00.000Z",
      "updated_at": "2026-04-14T10:00:00.000Z"
    },
    {
      "id": "uuid",
      "nro_folio": 2,
      "reserva_id": "uuid-reserva-2",
      "estado": false,
      "observacion": "Folio cerrado por checkout",
      "cerrado_en": "2026-04-15T14:30:00.000Z",
      "promociones": [],
      "created_at": "2026-04-14T11:00:00.000Z",
      "updated_at": "2026-04-15T14:30:00.000Z"
    }
  ],
  "timestamp": 1234567890
}
```

---

### 2. Obtener Folio por ID

Obtiene los detalles de un folio específico, incluyendo el array de códigos de promociones asociadas.

**Endpoint:** `GET /api/private/folios/:id`

**Autenticación:** Requerida

**Parámetros de URL:**

- `id` (UUID, requerido): ID del folio

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Folio encontrado",
  "data": {
    "id": "uuid",
    "nro_folio": 1,
    "reserva_id": "uuid-reserva-1",
    "estado": true,
    "observacion": "Folio de ejemplo",
    "cerrado_en": null,
    "promociones": ["PROMO-VERANO"],
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
  "message": "Folio no encontrado",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 3. Crear Folio

Crea un nuevo folio asociado a una reserva. Opcionalmente se pueden asociar promociones.

**Endpoint:** `POST /api/private/folios`

**Autenticación:** Requerida (rol ADMIN o RECEPCIONISTA)

**Body:**

```json
{
  "reserva_id": "uuid-reserva-1",
  "observacion": "Folio de ejemplo",
  "promocion_ids": ["uuid-promo-1", "uuid-promo-2"]
}
```

**Campos:**

- `reserva_id` (UUID, requerido): ID de la reserva a la que pertenece el folio
- `observacion` (string, opcional): Observación o nota del folio
- `promocion_ids` (array de UUID, opcional): IDs de promociones a asociar al folio. Cada ID será validado; si alguno no existe, se rechaza la petición.

**Respuesta Exitosa (201):**

```json
{
  "success": true,
  "message": "Folio creado exitosamente",
  "data": {
    "id": "uuid",
    "nro_folio": 1,
    "reserva_id": "uuid-reserva-1",
    "estado": true,
    "observacion": "Folio de ejemplo",
    "cerrado_en": null,
    "promociones": ["PROMO-VERANO", "PROMO-DESCUENTO"],
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
  "message": "Reserva no encontrada",
  "data": null,
  "timestamp": 1234567890
}
```

```json
{
  "success": false,
  "message": "Una o más promociones especificadas no existen",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 4. Actualizar Folio

Actualiza los datos de un folio existente, incluyendo la relación con promociones.

**Endpoint:** `PUT /api/private/folios/:id`

**Autenticación:** Requerida (rol ADMIN o RECEPCIONISTA)

**Parámetros de URL:**

- `id` (UUID, requerido): ID del folio

**Body:**

```json
{
  "estado": false,
  "observacion": "Observación actualizada",
  "promocion_ids": ["uuid-promo-nueva-1", "uuid-promo-nueva-2"]
}
```

**Campos (todos opcionales):**

- `estado` (boolean): Estado del folio (`true` = abierto, `false` = cerrado). Intentar reopening un folio cerrado generará error.
- `observacion` (string): Observación o nota del folio
- `promocion_ids` (array de UUID): IDs de promociones a asociar al folio. Al enviar este campo, se **reemplazan** todas las relaciones existentes con las nuevas promociones proporcionadas.

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Folio actualizado exitosamente",
  "data": {
    "id": "uuid",
    "nro_folio": 1,
    "reserva_id": "uuid-reserva-1",
    "estado": false,
    "observacion": "Observación actualizada",
    "cerrado_en": "2026-04-15T15:00:00.000Z",
    "promociones": ["PROMO-NUEVA-1", "PROMO-NUEVA-2"],
    "created_at": "2026-04-14T10:00:00.000Z",
    "updated_at": "2026-04-15T15:00:00.000Z"
  },
  "timestamp": 1234567890
}
```

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "Folio no encontrado",
  "data": null,
  "timestamp": 1234567890
}
```

**Respuesta de Error (400):**

```json
{
  "success": false,
  "message": "El folio ya está cerrado",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 5. Eliminar Folio

Elimina un folio del sistema. Solo se pueden eliminar folios abiertos (estado = true).

**Endpoint:** `DELETE /api/private/folios/:id`

**Autenticación:** Requerida (rol ADMIN)

**Parámetros de URL:**

- `id` (UUID, requerido): ID del folio

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Folio eliminado exitosamente",
  "data": null,
  "timestamp": 1234567890
}
```

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "Folio no encontrado",
  "data": null,
  "timestamp": 1234567890
}
```

**Respuesta de Error (403):**

```json
{
  "success": false,
  "message": "No se puede modificar un folio cerrado",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 6. Cerrar Folio

Cierra un folio establecido el estado en `false` y registrando la fecha de cierre en `cerradoEn`.

**Endpoint:** `POST /api/private/folios/:id/close`

**Autenticación:** Requerida (rol ADMIN o RECEPCIONISTA)

**Parámetros de URL:**

- `id` (UUID, requerido): ID del folio

**Body:**

```json
{
  "observacion": "Cierre de folio por checkout"
}
```

**Campos:**

- `observacion` (string, opcional): Observación de cierre

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Folio cerrado exitosamente",
  "data": {
    "id": "uuid",
    "nro_folio": 1,
    "reserva_id": "uuid-reserva-1",
    "estado": false,
    "observacion": "Cierre de folio por checkout",
    "cerrado_en": "2026-04-15T14:30:00.000Z",
    "promociones": ["PROMO-VERANO"],
    "created_at": "2026-04-14T10:00:00.000Z",
    "updated_at": "2026-04-15T14:30:00.000Z"
  },
  "timestamp": 1234567890
}
```

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "Folio no encontrado",
  "data": null,
  "timestamp": 1234567890
}
```

**Respuesta de Error (400):**

```json
{
  "success": false,
  "message": "El folio ya está cerrado",
  "data": null,
  "timestamp": 1234567890
}
```

---

## Estados del Folio

| Valor  | Descripción                              |
| ------ | ---------------------------------------- |
| `true` | Abierto - El folio está activo para cargos |
| `false`| Cerrado - El folio está cerrado y no acepta más cargos |

---

## Relación Muchos a Muchos con Promociones

Los folios tienen una relación muchos a muchos con las promociones:

- Un **folio** puede tener **múltiples promociones**
- Una **promoción** puede aplicarse a **múltiples folios**

Esta relación se gestiona mediante el campo `promocion_ids` en los endpoints de creación (`POST`) y actualización (`PUT`).

### Ejemplo: Crear folio con promociones

```json
{
  "reserva_id": "reserva-uuid",
  "observacion": "Folio de ejemplo",
  "promocion_ids": ["promo-uuid-1", "promo-uuid-2"]
}
```

### Ejemplo: Actualizar relación de promociones

```json
{
  "promocion_ids": ["promo-nueva-uuid-1", "promo-nueva-uuid-2"]
}
```

Este request reemplaza todas las relaciones existentes con las dos nuevas promociones.

### Respuesta con promociones

Tanto `GET /` como `GET /:id` devuelven el campo `promociones` como un array de códigos de promociones:

```json
{
  "id": "folio-uuid",
  "nro_folio": 1,
  "promociones": ["PROMO-VERANO", "PROMO-INVIERNO"]
}
```

---

## Relación con Reserva

Un folio pertenece a una reserva (relación uno a muchos):

- Una **reserva** puede tener **múltiples folios**
- Un **folio** solo puede tener **una reserva**

---

## Códigos de Estado HTTP

- `200 OK`: Operación exitosa
- `201 Created`: Folio creado exitosamente
- `400 Bad Request`: Datos de entrada inválidos o folio ya cerrado
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: Sin permisos suficientes o folio cerrado no modificable
- `404 Not Found`: Folio, reserva o promoción no encontrada
- `500 Internal Server Error`: Error del servidor