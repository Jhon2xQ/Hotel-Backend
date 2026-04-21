# API de Folios

> **Autorización:** Las rutas que restrigen por rol usan `requireRoles(...)` (`src/presentation/middlewares/roles.middleware.ts`) con valores en `src/common/constants/roles.ts` (p. ej. `admin`, `recepcionista`). Cualquier mención a "ADMIN" u otros roles aquí es orientativa; la fuente de verdad es el `*.routes.ts` correspondiente.

Documentación de los endpoints para la gestión de folios de consumos asociados a reservas.

## Base URL

```
/api/private/folios
```

## Autenticación

Todos los endpoints requieren autenticación mediante Better Auth. Se requiere rol `ADMIN` o `RECEPCIONISTA`.

---

## Endpoints

### 1. Listar Folios

Obtiene la lista paginada de folios con filtros opcionales.

**Endpoint:** `GET /api/private/folios`

**Autenticación:** Requerida

**Query Parameters:**

- `page` (número, opcional): Número de página (default: 1)
- `limit` (número, opcional): Elementos por página (default: 10)
- `reserva_id` (UUID, opcional): Filtrar por ID de estancia
- `estado` (boolean, opcional): Filtrar por estado (true = abierto, false = cerrado)

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Folios obtenidos exitosamente",
  "data": {
    "list": [
      {
        "id": "uuid",
        "codigo": "FOL-260416-1",
        "reservaId": "uuid-estancia-1",
        "pagoId": null,
        "estado": true,
        "observacion": null,
        "cerradoEn": null,
        "promociones": [
          {
            "id": "uuid-promo-1",
            "codigo": "PROMO-VERANO",
            "tipoDescuento": "PORCENTAJE",
            "valorDescuento": 15,
            "vigDesde": "2026-01-01T00:00:00.000Z",
            "vigHasta": "2026-12-31T23:59:59.000Z",
            "estado": true,
            "createdAt": "2026-01-01T00:00:00.000Z",
            "updatedAt": "2026-01-01T00:00:00.000Z"
          }
        ],
        "createdAt": "2026-04-16T10:00:00.000Z",
        "updatedAt": "2026-04-16T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  },
  "timestamp": 1234567890
}
```

---

### 2. Obtener Folio por ID

Obtiene los detalles de un folio específico.

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
    "codigo": "FOL-260416-1",
    "reservaId": "uuid-estancia-1",
    "pagoId": null,
    "estado": true,
    "observacion": "Folio de ejemplo",
    "cerradoEn": null,
    "promociones": [
      {
        "id": "uuid-promo-1",
        "codigo": "PROMO-VERANO",
        "tipoDescuento": "PORCENTAJE",
        "valorDescuento": 15,
        "vigDesde": "2026-01-01T00:00:00.000Z",
        "vigHasta": "2026-12-31T23:59:59.000Z",
        "estado": true,
        "createdAt": "2026-01-01T00:00:00.000Z",
        "updatedAt": "2026-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2026-04-16T10:00:00.000Z",
    "updatedAt": "2026-04-16T10:00:00.000Z"
  },
  "timestamp": 1234567890
}
```

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "Folio con id \"uuid\" no encontrado",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 3. Crear Folio

Crea un nuevo folio asociado a una reserva.

**Endpoint:** `POST /api/private/folios`

**Autenticación:** Requerida (rol ADMIN o RECEPCIONISTA)

**Body:**

```json
{
  "reserva_id": "uuid-estancia-1",
  "observacion": "Folio de consumos",
  "promocion_ids": ["uuid-promo-1"]
}
```

**Campos:**

- `reserva_id` (UUID, requerido): ID de la estancia a la que pertenece el folio
- `observacion` (string, opcional): Observación o nota del folio
- `promocion_ids` (array de UUID, opcional): IDs de promociones a asociar al folio

**Validaciones de promociones:**

Al asignar promociones, se validan los siguientes requisitos:

1. La promoción debe existir
2. La promoción debe estar activa (`estado: true`)
3. La promoción no debe estar caducada (fecha fin mayor a la actual)
4. La promoción debe estar habilitada (fecha inicio menor o igual a la actual)

**Respuesta Exitosa (201):**

```json
{
  "success": true,
  "message": "Folio creado exitosamente",
  "data": {
    "id": "uuid",
    "codigo": "FOL-260416-1",
    "reservaId": "uuid-estancia-1",
    "pagoId": null,
    "estado": true,
    "observacion": "Folio de consumos",
    "cerradoEn": null,
    "promociones": [
      {
        "id": "uuid-promo-1",
        "codigo": "PROMO-VERANO",
        "tipoDescuento": "PORCENTAJE",
        "valorDescuento": 15,
        "vigDesde": "2026-01-01T00:00:00.000Z",
        "vigHasta": "2026-12-31T23:59:59.000Z",
        "estado": true,
        "createdAt": "2026-01-01T00:00:00.000Z",
        "updatedAt": "2026-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2026-04-16T10:00:00.000Z",
    "updatedAt": "2026-04-16T10:00:00.000Z"
  },
  "timestamp": 1234567890
}
```

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "La reserva especificada no existe",
  "data": null,
  "timestamp": 1234567890
}
```

**Respuesta de Error (400):**

```json
{
  "success": false,
  "message": "La estancia ya tiene un folio abierto",
  "data": null,
  "timestamp": 1234567890
}
```

**Respuestas de Error - Validaciones de promociones:**

```json
{
  "success": false,
  "message": "Una o más promociones especificadas no existen",
  "data": null,
  "timestamp": 1234567890
}
```

```json
{
  "success": false,
  "message": "Una o más promociones especificadas están inactivas",
  "data": null,
  "timestamp": 1234567890
}
```

```json
{
  "success": false,
  "message": "Una o más promociones especificadas han Caducado",
  "data": null,
  "timestamp": 1234567890
}
```

```json
{
  "success": false,
  "message": "Una o más promociones especificadas aún no están habilitadas",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 4. Actualizar Folio

Actualiza los datos de un folio existente.

**Endpoint:** `PUT /api/private/folios/:id`

**Autenticación:** Requerida (rol ADMIN o RECEPCIONISTA)

**Parámetros de URL:**

- `id` (UUID, requerido): ID del folio

**Body:**

```json
{
  "observacion": "Observación actualizada",
  "promocion_ids": ["uuid-promo-nueva-1"]
}
```

**Campos (todos opcionales):**

- `estado` (boolean): Cambiar estado del folio (solo de cerrado a abierto no es posible)
- `observacion` (string): Observación o nota del folio
- `promocion_ids` (array de UUID): IDs de promociones. Al enviar, se **reemplazan** las existentes.

**Validaciones de promociones:**

Al actualizar con promociones, se aplican las mismas validaciones que en la creación:

1. La promoción debe existir
2. La promoción debe estar activa (`estado: true`)
3. La promoción no debe estar caducada (fecha fin mayor a la actual)
4. La promoción debe estar habilitada (fecha inicio menor o igual a la actual)

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Folio actualizado exitosamente",
  "data": { ... },
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

Elimina un folio. Solo folios abiertos y sin pago asociado.

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

**Respuesta de Error (403):**

```json
{
  "success": false,
  "message": "No se puede eliminar un folio cerrado",
  "data": null,
  "timestamp": 1234567890
}
```

```json
{
  "success": false,
  "message": "No se puede eliminar un folio que tiene un pago asociado",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 6. Agregar Producto al Folio

Agrega un producto al folio y descuenta del stock del producto.

**Endpoint:** `POST /api/private/folios/:id/productos`

**Autenticación:** Requerida (rol ADMIN o RECEPCIONISTA)

**Parámetros de URL:**

- `id` (UUID, requerido): ID del folio

**Body:**

```json
{
  "producto_id": "uuid-producto-1",
  "cantidad": 2
}
```

**Campos:**

- `producto_id` (UUID, requerido): ID del producto
- `cantidad` (número, requerido): Cantidad consumida (entero positivo)

**Nota:** El `precio_unit` se obtiene automáticamente del producto.

**Respuesta Exitosa (201):**

```json
{
  "success": true,
  "message": "Producto agregado al folio",
  "data": {
    "id": "uuid-folio-producto",
    "folioId": "uuid-folio-1",
    "productoId": "uuid-producto-1",
    "cantidad": 2,
    "precioUnit": 10,
    "total": 20,
    "createdAt": "2026-04-16T11:00:00.000Z",
    "updatedAt": "2026-04-16T11:00:00.000Z"
  },
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

### 7. Agregar Servicio al Folio

Agrega un servicio (concepto libre) al folio.

**Endpoint:** `POST /api/private/folios/:id/servicios`

**Autenticación:** Requerida (rol ADMIN o RECEPCIONISTA)

**Parámetros de URL:**

- `id` (UUID, requerido): ID del folio

**Body:**

```json
{
  "concepto": "Masaje spa",
  "cantidad": 1,
  "precio_unit": 50.00
}
```

**Campos:**

- `concepto` (string, requerido): Descripción del servicio
- `cantidad` (número, requerido): Cantidad de servicios (entero positivo)
- `precio_unit` (número, requerido): Precio unitario del servicio

**Respuesta Exitosa (201):**

```json
{
  "success": true,
  "message": "Servicio agregado al folio",
  "data": {
    "id": "uuid-folio-servicio",
    "folioId": "uuid-folio-1",
    "concepto": "Masaje spa",
    "cantidad": 1,
    "precioUnit": 50,
    "total": 50,
    "createdAt": "2026-04-16T11:30:00.000Z",
    "updatedAt": "2026-04-16T11:30:00.000Z"
  },
  "timestamp": 1234567890
}
```

---

### 8. Obtener Consumos del Folio

Obtiene todos los productos y servicios consumidos en un folio, además del cálculo de subtotal, descuento y total con promociones aplicadas.

**Endpoint:** `GET /api/private/folios/:id/consumos`

**Autenticación:** Requerida

**Parámetros de URL:**

- `id` (UUID, requerido): ID del folio

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Consumos obtenidos",
  "data": {
    "folio": {
      "id": "uuid-folio-1",
      "codigo": "FOL-260416-1",
      "reservaId": "uuid-estancia-1",
      "pagoId": null,
      "estado": true,
      "observacion": null,
      "cerradoEn": null,
      "promociones": [
        {
          "id": "uuid-promo-1",
          "codigo": "PROMO-OCTUBRE",
          "tipoDescuento": "MONTO_FIJO",
          "valorDescuento": 50,
          "vigDesde": "2026-01-01T00:00:00.000Z",
          "vigHasta": "2026-12-31T23:59:59.000Z",
          "estado": true,
          "createdAt": "2026-01-01T00:00:00.000Z",
          "updatedAt": "2026-01-01T00:00:00.000Z"
        }
      ],
      "createdAt": "2026-04-16T10:00:00.000Z",
      "updatedAt": "2026-04-16T10:00:00.000Z"
    },
    "productos": [
      {
        "id": "uuid-fp-1",
        "folioId": "uuid-folio-1",
        "productoId": "uuid-producto-1",
        "cantidad": 2,
        "precioUnit": 10,
        "total": 20,
        "createdAt": "2026-04-16T11:00:00.000Z",
        "updatedAt": "2026-04-16T11:00:00.000Z"
      }
    ],
    "servicios": [
      {
        "id": "uuid-fs-1",
        "folioId": "uuid-folio-1",
        "concepto": "Masaje spa",
        "cantidad": 1,
        "precioUnit": 50,
        "total": 50,
        "createdAt": "2026-04-16T11:30:00.000Z",
        "updatedAt": "2026-04-16T11:30:00.000Z"
      }
    ],
    "subtotal": 70,
    "descuento": 50,
    "total": 20
  },
  "timestamp": 1234567890
}
```

**Campos de respuesta:**

- `subtotal`: Sumatoria de todos los productos y servicios sin descuentos
- `descuento`: Total de descuentos aplicados (suma de promociones vigentes)
- `total`: Resultado de `subtotal - descuento` (mínimo 0)

**Cálculo de descuentos:**

Las promociones se aplican solo si:
- La promoción está activa (`estado: true`)
- La fecha actual está dentro del rango de vigencia (`vigDesde` <= ahora <= `vigHasta`)

Tipos de descuento:
- `PORCENTAJE`: `subtotal * (valorDescuento / 100)`
- `MONTO_FIJO`: `valorDescuento` (monto fijo)

Los descuentos se suman si hay múltiples promociones vigentes.

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "Folio con id \"uuid\" no encontrado",
  "data": null,
  "timestamp": 1234567890
}
```

---

## Generación de Código de Folio

Los folios tienen un código alfanumérico generado automáticamente con el formato:

```
FOL-YYMMDD-N
```

- `YY`: Año (últimos 2 dígitos)
- `MM`: Mes (01-12)
- `DD`: Día (01-31)
- `N`: Número secuencial del día (comienza en 1 y se reinicia cada día)

**Ejemplo:** `FOL-260416-1` (primer folio del 16 de abril de 2026)

---

## Estados del Folio

| Valor  | Descripción                              |
| ------ | ---------------------------------------- |
| `true` | Abierto - El folio está activo para cargos |
| `false`| Cerrado - El folio está cerrado y no acepta más cargos |

---

## Relación con Estancia

Un folio pertenece a una reserva (relación uno a muchos):

- Una **reserva** puede tener **múltiples folios abiertos**
- Un **folio** solo puede tener **una reserva**

---

## Relación con Promociones

Un folio puede tener múltiples promociones asociadas:

- Las promociones se validan al crear o actualizar el folio
- Solo se aceptan promociones vigentes y activas
- Los descuentos se calculan automáticamente al obtener consumos

---

## Integración con Pagos

Para cobrar un folio, usar el endpoint `POST /api/private/pagos` con el campo `folio_id`:

```json
{
  "concepto": "CONSUMO",
  "metodo": "EFECTIVO",
  "folio_id": "uuid-folio-1"
}
```

Al crear un pago con `folio_id`:
1. Se obtiene el total de consumos del folio (incluyendo descuentos)
2. Se crea el pago con monto = total de consumos
3. Se asocia el pago al folio (`pago_id`)
4. Se cierra el folio automáticamente (`estado = false`)

---

## Códigos de Estado HTTP

- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Datos de entrada inválidos, folio cerrado o promoción inválida
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: Sin permisos suficientes o folio cerrado
- `404 Not Found`: Folio, reserva o promoción no encontrada
- `500 Internal Server Error`: Error del servidor
