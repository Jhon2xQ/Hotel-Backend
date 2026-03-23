# API de Reservas

Documentación de los endpoints para gestionar reservas en el sistema hotelero.

## Base URL

```
/api/reservas
```

## Autenticación

Todos los endpoints requieren autenticación mediante Better Auth. Los endpoints de creación, actualización, eliminación y cancelación requieren rol `ADMIN`.

---

## Endpoints

### 1. Listar Reservas

Obtiene todas las reservas del sistema.

**Endpoint:** `GET /api/reservas`

**Autenticación:** Requerida

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Reservas obtenidas exitosamente",
  "data": [
    {
      "id": "uuid",
      "codigo": "RES-2024-001",
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
        "piso": 1,
        "estado": "RESERVADA"
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
      "iva": 18.0,
      "cargo_servicios": 10.0,
      "monto_total": 300.0,
      "monto_descuento": 0.0,
      "monto_final": 300.0,
      "estado": "TENTATIVA",
      "motivo_cancel": null,
      "cancelado_en": null,
      "created_at": "2024-03-23T10:00:00.000Z",
      "updated_at": "2024-03-23T10:00:00.000Z"
    }
  ],
  "timestamp": 1711188000000
}
```

---

### 2. Obtener Reserva por ID

Obtiene una reserva específica por su ID.

**Endpoint:** `GET /api/reservas/:id`

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
    "codigo": "RES-2024-001",
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
    "iva": 18.0,
    "cargo_servicios": 10.0,
    "monto_total": 300.0,
    "monto_descuento": 0.0,
    "monto_final": 300.0,
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

Crea una nueva reserva. Los campos snapshot (nombre_huesped, nro_habitacion, etc.) se sincronizan automáticamente desde las entidades relacionadas.

**Endpoint:** `POST /api/reservas`

**Autenticación:** Requerida (rol ADMIN)

**Body:**

```json
{
  "codigo": "RES-2024-001",
  "huespedId": "uuid",
  "habitacionId": "uuid",
  "tarifaId": "uuid",
  "fechaEntrada": "2024-03-25T14:00:00.000Z",
  "fechaSalida": "2024-03-27T12:00:00.000Z",
  "adultos": 2,
  "ninos": 1,
  "montoDescuento": 0
}
```

**Validaciones:**

- `codigo`: Requerido, único
- `huespedId`: Requerido, UUID válido, debe existir
- `habitacionId`: Requerido, UUID válido, debe existir
- `tarifaId`: Requerido, UUID válido, debe existir
- `fechaEntrada`: Requerida, formato datetime ISO
- `fechaSalida`: Requerida, formato datetime ISO, debe ser posterior a fechaEntrada
- `adultos`: Requerido, mínimo 1
- `ninos`: Opcional, mínimo 0, default 0
- `montoDescuento`: Opcional, mínimo 0, default 0

**Respuesta Exitosa (201):**

```json
{
  "success": true,
  "message": "Reserva creada exitosamente",
  "data": {
    "id": "uuid",
    "codigo": "RES-2024-001"
    /* ... resto de campos */
  },
  "timestamp": 1711188000000
}
```

**Respuestas de Error:**

- `400`: Validación fallida (fechas inválidas, adultos < 1, etc.)
- `404`: Huésped, habitación o tarifa no encontrados
- `409`: Código de reserva duplicado

---

### 4. Actualizar Reserva

Actualiza una reserva existente. Si el estado es COMPLETADA, la reserva es inmutable y no se puede modificar.

**Endpoint:** `PUT /api/reservas/:id`

**Autenticación:** Requerida (rol ADMIN)

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
  "montoDescuento": 0,
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

**Endpoint:** `PATCH /api/reservas/:id/cancel`

**Autenticación:** Requerida (rol ADMIN)

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

### 6. Eliminar Reserva

Elimina permanentemente una reserva del sistema.

**Endpoint:** `DELETE /api/reservas/:id`

**Autenticación:** Requerida (rol ADMIN)

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

- `monto_total` = `precio_noche` × número de noches
- `monto_final` = `monto_total` - `monto_descuento`
- Número de noches = diferencia en días entre `fecha_salida` y `fecha_entrada`

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

1. **Inmutabilidad**: Las reservas con estado COMPLETADA son inmutables y no pueden ser modificadas.

2. **Sincronización Automática**: Los campos snapshot se actualizan automáticamente cuando cambian las relaciones, no es necesario enviarlos en el request.

3. **Cálculo Automático**: Los montos totales y finales se calculan automáticamente basados en las fechas, precio de la tarifa y descuento.

4. **Cancelación vs Eliminación**:
   - Cancelar una reserva la marca como CANCELADA pero mantiene el registro
   - Eliminar una reserva la borra permanentemente del sistema

5. **Historial**: Los campos snapshot permiten mantener un historial preciso incluso si las entidades relacionadas cambian posteriormente.
