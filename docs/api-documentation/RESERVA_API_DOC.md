# API de Reservas


> **Autorización:** Las rutas que restrigen por rol usan `requireRoles(...)` (`src/presentation/middlewares/roles.middleware.ts`) con valores en `src/common/constants/roles.ts` (p. ej. `admin`, `recepcionista`). Cualquier mención a "ADMIN" u otros roles aquí es orientativa; la fuente de verdad es el `*.routes.ts` correspondiente.


Documentación de los endpoints para gestionar reservas en el sistema hotelero.

## Base URL

```
/api/private/reservas
```

## Autenticación

Todos los endpoints requieren autenticación mediante Better Auth. Solo el endpoint de actualización de estado (`PATCH /api/private/reservas/:id/estado`) requiere rol `ADMIN`.

---

## Endpoints

### 1. Listar Reservas (Paginado)

Obtiene una lista paginada de reservas con filtros opcionales.

**Endpoint:** `GET /api/private/reservas`

**Autenticación:** Requerida

**Query Parameters:**

- `page` (number, opcional): Número de página (por defecto: 1, mínimo: 1)
- `limit` (number, opcional): Cantidad de resultados por página (por defecto: 10, mínimo: 1, máximo: 100)
- `name` (string, opcional): Filtrar por nombre del huésped (búsqueda parcial, case-insensitive)
- `tipo` (string, opcional): Filtrar por tipo de habitación (búsqueda parcial, case-insensitive)

**Ejemplo de petición:**

```bash
# Sin parámetros (usa valores por defecto: page=1, limit=10)
GET /api/private/reservas

# Con parámetros de paginación
GET /api/private/reservas?page=2&limit=20

# Filtrar por nombre de huésped
GET /api/private/reservas?name=Juan

# Filtrar por tipo de habitación
GET /api/private/reservas?tipo=Suite

# Combinar filtros con paginación
GET /api/private/reservas?name=Garc&tipo=Doble&page=1&limit=10
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Reservas obtenidas exitosamente",
  "data": {
    "list": [
      {
        "id": "uuid",
        "codigo": "KOR-20260327-A7K9P2",
        "huesped": {
          "id": "uuid",
          "tipo_doc": "DNI",
          "nro_doc": "12345678",
          "nombres": "Juan",
          "apellidos": "Pérez",
          "email": "juan@example.com",
          "telefono": "+51999999999",
          "nacionalidad": "PE",
          "observacion": null,
          "created_at": "2024-03-23T10:00:00.000Z",
          "updated_at": "2024-03-23T10:00:00.000Z"
        },
        "habitacion": {
          "id": "uuid",
          "nro_habitacion": "101",
          "tipo_habitacion": {
            "id": "uuid",
            "nombre": "Suite Deluxe",
            "descripcion": "Suite con vista al mar",
            "created_at": "2024-03-23T10:00:00.000Z",
            "updated_at": "2024-03-23T10:00:00.000Z"
          },
          "piso": 1,
          "tiene_ducha": true,
          "tiene_banio": true,
          "url_imagen": ["https://example.com/rooms/101-1.jpg"],
          "estado": "RESERVADA",
          "notas": null,
          "ulti_limpieza": "2024-03-24T08:00:00.000Z",
          "created_at": "2024-03-23T10:00:00.000Z",
          "updated_at": "2024-03-23T10:00:00.000Z"
        },
        "tarifa": {
          "id": "uuid",
          "tipo_habitacion": {
            "id": "uuid",
            "nombre": "Suite Deluxe",
            "descripcion": "Suite con vista al mar",
            "created_at": "2024-03-23T10:00:00.000Z",
            "updated_at": "2024-03-23T10:00:00.000Z"
          },
          "canal": {
            "id": "uuid",
            "nombre": "Booking.com",
            "tipo": "OTA",
            "activo": true,
            "notas": null,
            "created_at": "2024-03-23T10:00:00.000Z",
            "updated_at": "2024-03-23T10:00:00.000Z"
          },
          "precio_noche": 150.0,
          "iva": 18.0,
          "cargo_servicios": 10.0,
          "moneda": "USD",
          "created_at": "2024-03-23T10:00:00.000Z",
          "updated_at": "2024-03-23T10:00:00.000Z"
        },
        "pago": {
          "id": "uuid",
          "concepto": "RESERVA",
          "estado": "CONFIRMADO",
          "fecha_pago": "2024-03-23T10:00:00.000Z",
          "monto": "300.00",
          "moneda": "SOL",
          "metodo": "VISA",
          "recibido_por_id": "user-id",
          "recibido_por": {
            "id": "user-id",
            "name": "María García",
            "email": "maria@hotel.com"
          },
          "observacion": "Pago adelantado por reserva",
          "created_at": "2024-03-23T10:00:00.000Z"
        },
        "fecha_entrada": "2024-03-25T14:00:00.000Z",
        "fecha_salida": "2024-03-27T12:00:00.000Z",
        "adultos": 2,
        "ninos": 1,
        "nombre_huesped": "Juan Pérez",
        "nro_habitacion": "101",
        "nombre_tipo_hab": "Suite Deluxe",
        "nombre_canal": "Booking.com",
        "precio_noche": 150.0,
        "cantidad_noches": 2,
        "iva": 18.0,
        "cargo_servicios": 10.0,
        "monto_total": 420.0,
        "estado": "CONFIRMADA",
        "motivo_cancel": null,
        "cancelado_en": null,
        "created_at": "2024-03-23T10:00:00.000Z",
        "updated_at": "2024-03-23T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  },
  "timestamp": 1711188000000
}
```

**Campos de la respuesta:**

- `list`: Array de reservas en la página actual
- `pagination`: Objeto con información de paginación
  - `page`: Número de página actual
  - `limit`: Cantidad de resultados por página
  - `total`: Total de reservas (considerando filtros)
  - `totalPages`: Total de páginas disponibles
  - `hasNextPage`: `true` si existe una página siguiente
  - `hasPreviousPage`: `true` si existe una página anterior

**Nota:** El campo `pago` será `null` si la reserva no tiene un pago asociado.

---

### 2. Obtener Reserva por ID

Obtiene una reserva específica por su ID.

**Endpoint:** `GET /api/private/reservas/:id`

**Autenticación:** Requerida

**Parámetros de URL:**

- `id` (string, UUID): ID de la reserva

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Reserva encontrada",
  "data": {
    "id": "uuid",
    "codigo": "KOR-20260327-A7K9P2",
    "huesped": {
      /* objeto completo */
    },
    "habitacion": {
      /* objeto completo */
    },
    "tarifa": {
      /* objeto completo */
    },
    "pago": null,
    "fecha_entrada": "2024-03-25T14:00:00.000Z",
    "fecha_salida": "2024-03-27T12:00:00.000Z",
    "adultos": 2,
    "ninos": 1,
    "nombre_huesped": "Juan Pérez",
    "nro_habitacion": "101",
    "nombre_tipo_hab": "Suite Deluxe",
    "nombre_canal": "Booking.com",
    "precio_noche": 150.0,
    "cantidad_noches": 2,
    "iva": 18.0,
    "cargo_servicios": 10.0,
    "monto_total": 420.0,
    "estado": "TENTATIVA",
    "motivo_cancel": null,
    "cancelado_en": null,
    "created_at": "2024-03-23T10:00:00.000Z",
    "updated_at": "2024-03-23T10:00:00.000Z"
  },
  "timestamp": 1711188000000
}
```

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "Reserva con id \"uuid\" no encontrada",
  "data": null,
  "timestamp": 1711188000000
}
```

---

### 3. Crear Reserva

Crea una nueva reserva. El código de reserva se genera automáticamente en formato `KOR-YYYYMMDD-XXXXXX`. Los campos snapshot (nombre_huesped, nro_habitacion, etc.) se sincronizan automáticamente desde las entidades relacionadas.

**Endpoint:** `POST /api/private/reservas`

**Autenticación:** Requerida

**Body:**

```json
{
  "huespedId": "uuid",
  "habitacionId": "uuid",
  "tarifaId": "uuid",
  "fechaEntrada": "2024-03-25T14:00:00.000Z",
  "fechaSalida": "2024-03-27T12:00:00.000Z",
  "adultos": 2,
  "ninos": 1
}
```

**Validaciones:**

- `huespedId`: Requerido, UUID válido, debe existir
- `habitacionId`: Requerido, UUID válido, debe existir
- `tarifaId`: Requerido, UUID válido, debe existir
- `fechaEntrada`: Requerida, formato datetime ISO
- `fechaSalida`: Requerida, formato datetime ISO, debe ser posterior a fechaEntrada
- `adultos`: Requerido, mínimo 1
- `ninos`: Opcional, mínimo 0, default 0
- No puede haber solapamiento de fechas con reservas existentes (TENTATIVA, CONFIRMADA, EN_CASA) en la misma habitación

**Código de Reserva:**

El código se genera automáticamente en el formato `KOR-YYYYMMDD-XXXXXX`:

- `KOR`: Prefijo fijo
- `YYYYMMDD`: Fecha actual (año/mes/día)
- `XXXXXX`: 6 caracteres aleatorios (letras mayúsculas y números)

Ejemplo: `KOR-20260327-A7K9P2`

**Respuesta Exitosa (201):**

```json
{
  "success": true,
  "message": "Reserva creada exitosamente",
  "data": {
    "id": "uuid",
    "codigo": "KOR-20260327-A7K9P2"
    /* ... resto de campos */
  },
  "timestamp": 1711188000000
}
```

**Respuestas de Error:**

- `400`: Validación fallida (fechas inválidas, adultos < 1, etc.)
- `404`: Huésped, habitación o tarifa no encontrados
- `500`: Error al generar código único (muy raro, después de 10 intentos)

---

### 4. Actualizar Reserva

Actualiza una reserva existente. Cualquier usuario autenticado puede actualizar reservas. Si el estado es COMPLETADA, la reserva es inmutable y no se puede modificar (use el endpoint de actualización de estado si es admin para cambiar el estado primero).

**Endpoint:** `PUT /api/private/reservas/:id`

**Autenticación:** Requerida

**Parámetros de URL:**

- `id` (string, UUID): ID de la reserva

**Body (todos los campos opcionales):**

```json
{
  "huespedId": "uuid",
  "habitacionId": "uuid",
  "tarifaId": "uuid",
  "pagoId": "uuid",
  "fechaEntrada": "2024-03-25T14:00:00.000Z",
  "fechaSalida": "2024-03-27T12:00:00.000Z",
  "adultos": 2,
  "ninos": 1,
  "estado": "CONFIRMADA"
}
```

**Ejemplos de uso:**

Asociar un pago a la reserva:

```json
{
  "pagoId": "uuid-del-pago"
}
```

Desasociar un pago de la reserva:

```json
{
  "pagoId": null
}
```

Cambiar solo el estado:

```json
{
  "estado": "CONFIRMADA"
}
```

**Validaciones:**

- Si cambian `huespedId`, `habitacionId` o `tarifaId`, los campos snapshot se actualizan automáticamente
- Si cambian fechas o tarifa, los montos se recalculan automáticamente
- No se puede modificar si `estado` es COMPLETADA

**Estados válidos:**

- `TENTATIVA`
- `CONFIRMADA`
- `EN_CASA`
- `COMPLETADA`
- `CANCELADA`
- `NO_LLEGO`

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Reserva actualizada exitosamente",
  "data": {
    "id": "uuid"
    /* ... campos actualizados */
  },
  "timestamp": 1711188000000
}
```

**Respuestas de Error:**

- `400`: Validación fallida
- `403`: No se puede modificar una reserva completada
- `404`: Reserva no encontrada

---

### 5. Cancelar Reserva

Cancela una reserva estableciendo su estado a CANCELADA. No se pueden cancelar reservas completadas.

**Endpoint:** `PATCH /api/private/reservas/:id/cancel`

**Autenticación:** Requerida

**Parámetros de URL:**

- `id` (string, UUID): ID de la reserva

**Body:**

```json
{
  "motivoCancel": "Cliente solicitó cancelación por cambio de planes"
}
```

**Validaciones:**

- `motivoCancel`: Requerido, no puede estar vacío
- No se puede cancelar si el estado es COMPLETADA
- No se puede cancelar si ya está CANCELADA

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Reserva cancelada exitosamente",
  "data": {
    "id": "uuid",
    "estado": "CANCELADA",
    "motivo_cancel": "Cliente solicitó cancelación por cambio de planes",
    "cancelado_en": "2024-03-23T15:30:00.000Z"
    /* ... resto de campos */
  },
  "timestamp": 1711188000000
}
```

**Respuestas de Error:**

- `400`: Motivo de cancelación vacío o reserva ya cancelada
- `403`: No se puede cancelar una reserva completada
- `404`: Reserva no encontrada

---

### 6. Actualizar Estado de Reserva

Actualiza únicamente el estado de una reserva. Este endpoint está diseñado para cambios de estado del flujo normal de la reserva. Para cancelar una reserva, use el endpoint específico de cancelación.

**Endpoint:** `PATCH /api/private/reservas/:id/estado`

**Autenticación:** Requerida (rol ADMIN)

**Parámetros de URL:**

- `id` (string, UUID): ID de la reserva

**Body:**

```json
{
  "estado": "CONFIRMADA"
}
```

**Estados válidos:**

- `TENTATIVA`: Reserva tentativa, pendiente de confirmación
- `CONFIRMADA`: Reserva confirmada por el cliente
- `EN_CASA`: Cliente ya se encuentra en el hotel (check-in realizado)
- `COMPLETADA`: Reserva completada (check-out realizado)
- `NO_LLEGO`: Cliente no se presentó (no-show)

**Validaciones:**

- `estado`: Requerido, debe ser uno de los estados válidos
- No se puede usar este endpoint para cambiar a CANCELADA (usar endpoint de cancelación)
- Los administradores pueden cambiar de cualquier estado a cualquier estado (incluso desde COMPLETADA)

**Flujo típico de estados:**

```
TENTATIVA → CONFIRMADA → EN_CASA → COMPLETADA
         ↘ NO_LLEGO
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Estado de reserva actualizado exitosamente",
  "data": {
    "id": "uuid",
    "estado": "CONFIRMADA"
    /* ... resto de campos */
  },
  "timestamp": 1711188000000
}
```

**Respuestas de Error:**

- `400`: Estado inválido o intento de cambiar a CANCELADA
- `404`: Reserva no encontrada

**Nota:** Para cancelar una reserva, use `PATCH /api/private/reservas/:id/cancel` con el motivo de cancelación. Los administradores tienen permisos completos para cambiar estados, incluso desde COMPLETADA.

---

### 7. Eliminar Reserva

Elimina permanentemente una reserva del sistema.

**Endpoint:** `DELETE /api/private/reservas/:id`

**Autenticación:** Requerida

**Parámetros de URL:**

- `id` (string, UUID): ID de la reserva

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Reserva eliminada exitosamente",
  "data": null,
  "timestamp": 1711188000000
}
```

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "Reserva con id \"uuid\" no encontrada",
  "data": null,
  "timestamp": 1711188000000
}
```

---

## Relación con Pagos

Las reservas tienen una relación **uno a uno opcional** con pagos:

- Una reserva puede tener un pago asociado o no (`pagoId` es opcional)
- El campo `pago` en la respuesta puede ser `null` si no hay pago asociado
- Cuando existe un pago, se incluye el objeto completo con toda su información

### Estructura del Objeto Pago

Cuando una reserva tiene un pago asociado, el objeto incluye:

```json
{
  "id": "uuid",
  "concepto": "RESERVA",
  "estado": "CONFIRMADO",
  "fecha_pago": "2024-03-23T10:00:00.000Z",
  "monto": "300.00",
  "moneda": "SOL",
  "metodo": "VISA",
  "recibido_por_id": "user-id",
  "recibido_por": {
    "id": "user-id",
    "name": "Juan Pérez",
    "email": "juan@hotel.com"
  },
  "observacion": "Pago adelantado por reserva",
  "created_at": "2024-03-23T10:00:00.000Z"
}
```

### Conceptos de Pago

- `RESERVA`: Pago relacionado a una reserva
- `CONSUMO`: Pago relacionado a consumos en el folio

### Estados de Pago

- `CONFIRMADO`: Pago confirmado y procesado
- `DEVUELTO`: Pago devuelto al cliente
- `RETENIDO`: Pago retenido temporalmente
- `ANULADO`: Pago anulado

### Métodos de Pago

- `EFECTIVO`: Pago en efectivo
- `VISA`: Tarjeta Visa
- `MASTERCARD`: Tarjeta Mastercard
- `AMEX`: American Express
- `TRANSFERENCIA`: Transferencia bancaria

### Asociar un Pago a una Reserva

Para asociar un pago existente a una reserva, use el endpoint `PUT /api/private/reservas/:id` con el campo `pagoId`:

```json
{
  "pagoId": "uuid-del-pago"
}
```

Para desasociar un pago, envíe `pagoId: null`:

```json
{
  "pagoId": null
}
```

**Nota:** Para crear pagos, consulte la documentación de la API de Pagos (`/api/pagos`).

---

## Lógica de Sincronización (Snapshot)

Las reservas implementan un patrón de desnormalización para mantener un historial inmutable:

### Campos Snapshot

Los siguientes campos se sincronizan automáticamente desde las entidades relacionadas:

- `nombre_huesped`: Desde `huesped.nombres + huesped.apellidos`
- `nro_habitacion`: Desde `habitacion.nroHabitacion`
- `nombre_tipo_hab`: Desde `tarifa.tipoHabitacion.nombre`
- `nombre_canal`: Desde `tarifa.canal.nombre`
- `precio_noche`: Desde `tarifa.precioNoche`
- `iva`: Desde `tarifa.IVA`
- `cargo_servicios`: Desde `tarifa.cargoServicios`

### Reglas de Actualización

1. **Mientras estado != COMPLETADA:**
   - Se permite actualizar `huespedId`, `habitacionId`, `tarifaId`
   - Cada cambio actualiza automáticamente los campos snapshot correspondientes
   - Los montos se recalculan automáticamente

2. **Si estado = COMPLETADA:**
   - La reserva se vuelve inmutable
   - No se permiten modificaciones de ningún tipo
   - Solo se permite lectura

### Cálculo de Montos

- `cantidad_noches` = diferencia en días entre `fecha_salida` y `fecha_entrada`
- `subtotal` = `precio_noche` × `cantidad_noches`
- `monto_total` = `subtotal` × (1 + `iva`/100 + `cargo_servicios`/100)
- Los campos `iva` y `cargo_servicios` se expresan como porcentajes (ej: 18.00 = 18%)

---

## Errores Comunes

### Errores de Validación (400)

```json
{
  "success": false,
  "message": "La fecha de salida debe ser posterior a la fecha de entrada",
  "data": null,
  "timestamp": 1711188000000
}
```

Mensajes posibles:

- "La fecha de salida debe ser posterior a la fecha de entrada"
- "Debe haber al menos 1 adulto en la reserva"
- "El número de niños no puede ser negativo"
- "La reserva ya está cancelada"
- "Debe proporcionar un motivo de cancelación"
- "Para cancelar una reserva use el endpoint PATCH /api/private/reservas/:id/cancel con el motivo de cancelación"
- "El intervalo de fechas entra en conflicto con una reserva existente para la misma habitación"

### Errores de Permisos (403)

```json
{
  "success": false,
  "message": "No se puede modificar una reserva completada. La reserva es inmutable.",
  "data": null,
  "timestamp": 1711188000000
}
```

Mensajes posibles:

- "No se puede modificar una reserva completada. La reserva es inmutable."
- "No se puede cancelar una reserva completada"

### Errores de Recursos No Encontrados (404)

```json
{
  "success": false,
  "message": "Reserva con id \"uuid\" no encontrada",
  "data": null,
  "timestamp": 1711188000000
}
```

Mensajes posibles:

- "Reserva con id \"uuid\" no encontrada"
- "Reserva con código \"KOR-20260327-A7K9P2\" no encontrada"
- "El huésped especificado no existe"
- "La habitación especificada no existe"
- "La tarifa especificada no existe"
- "El pago especificado no existe"

### Errores de Conflicto (409)

```json
{
  "success": false,
  "message": "Ya existe una reserva con el código \"KOR-20260327-A7K9P2\"",
  "data": null,
  "timestamp": 1711188000000
}
```

También se devuelve 409 cuando el intervalo de fechas entra en conflicto con una reserva existente para la misma habitación:

```json
{
  "success": false,
  "message": "El intervalo de fechas entra en conflicto con una reserva existente para la misma habitación",
  "data": null,
  "timestamp": 1711188000000
}
```

### Errores del Servidor (500)

```json
{
  "success": false,
  "message": "No se pudo generar un código único para la reserva. Intente nuevamente.",
  "data": null,
  "timestamp": 1711188000000
}
```

---

## Códigos de Estado HTTP

- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Datos de entrada inválidos
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No autorizado (requiere rol ADMIN o reserva inmutable)
- `404 Not Found`: Recurso no encontrado
- `409 Conflict`: Conflicto (código duplicado)
- `500 Internal Server Error`: Error del servidor

---

## Notas Importantes

1. **Código Automático**: El código de reserva se genera automáticamente en formato `KOR-YYYYMMDD-XXXXXX`. No es necesario enviarlo en el request de creación.

2. **Inmutabilidad**: Las reservas con estado COMPLETADA son inmutables y no pueden ser modificadas mediante el endpoint `PUT /api/private/reservas/:id`. Los administradores pueden usar el endpoint `PATCH /api/private/reservas/:id/estado` para cambiar el estado primero si necesitan modificar una reserva completada.

3. **Sincronización Automática**: Los campos snapshot se actualizan automáticamente cuando cambian las relaciones, no es necesario enviarlos en el request.

4. **Cálculo Automático**: Los montos totales se calculan automáticamente basados en las fechas, precio de la tarifa, IVA y cargo de servicios. La fórmula es: `monto_total = (precio_noche × cantidad_noches) × (1 + iva/100 + cargo_servicios/100)`.

5. **Validación de Solapamiento**: Al crear o actualizar una reserva, se verifica que el intervalo de fechas no entre en conflicto con reservas existentes (estado TENTATIVA, CONFIRMADA o EN_CASA) para la misma habitación.

5. **Cancelación vs Eliminación**:
   - Cancelar una reserva la marca como CANCELADA pero mantiene el registro
   - Eliminar una reserva la borra permanentemente del sistema

6. **Historial**: Los campos snapshot permiten mantener un historial preciso incluso si las entidades relacionadas cambian posteriormente.

7. **Permisos de Administrador**: Solo los administradores pueden actualizar el estado de una reserva mediante `PATCH /api/private/reservas/:id/estado`. Este endpoint permite cambiar desde cualquier estado (incluyendo COMPLETADA) a cualquier otro estado válido, excepto CANCELADA (que requiere usar el endpoint de cancelación).

8. **Relación con Pagos**:
   - Una reserva puede tener un pago asociado opcionalmente mediante el campo `pagoId`
   - El pago se incluye automáticamente en las respuestas cuando existe
   - Para crear pagos, use la API de Pagos (`/api/pagos`)
   - Para asociar/desasociar un pago, use el endpoint `PUT /api/private/reservas/:id` con el campo `pagoId`
