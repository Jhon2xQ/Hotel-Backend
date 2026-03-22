# API de Pagos

Documentación de los endpoints para la gestión de pagos en el sistema hotelero.

## Base URL

```
/api/pagos
```

## Autenticación

Todos los endpoints requieren autenticación mediante Better Auth. Los endpoints de creación, actualización y eliminación requieren rol `ADMIN`.

---

## Endpoints

### 1. Crear Pago

Crea un nuevo registro de pago.

**Endpoint:** `POST /api/pagos`

**Permisos:** `ADMIN`

**Request Body:**

```json
{
  "concepto": "RESERVA",
  "estado": "CONFIRMADO",
  "fecha_pago": "2026-03-18T14:30:00.000Z",
  "monto": 150.0,
  "moneda": "SOL",
  "metodo": "EFECTIVO",
  "recibido_por_id": "uuid-del-personal",
  "observacion": "Pago por reserva de habitación"
}
```

**Campos:**

- `concepto` (requerido): Tipo de pago. Valores: `RESERVA`, `CONSUMO`
- `estado` (opcional): Estado del pago. Valores: `CONFIRMADO`, `DEVUELTO`, `RETENIDO`, `ANULADO`. Default: `CONFIRMADO`
- `fecha_pago` (opcional): Fecha y hora del pago en formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) o YYYY-MM-DD. Default: fecha y hora actual
- `monto` (requerido): Monto del pago, debe ser mayor a cero
- `moneda` (opcional): Código de moneda de 3 caracteres. Default: `SOL`
- `metodo` (requerido): Método de pago. Valores: `EFECTIVO`, `VISA`, `MASTERCARD`, `AMEX`, `TRANSFERENCIA`
- `recibido_por_id` (opcional): UUID del personal que recibió el pago
- `observacion` (opcional): Observaciones adicionales

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Pago creado exitosamente",
  "data": {
    "id": "uuid-del-pago",
    "concepto": "RESERVA",
    "estado": "CONFIRMADO",
    "fecha_pago": "2026-03-18T14:30:00.000Z",
    "monto": "150.00",
    "moneda": "SOL",
    "metodo": "EFECTIVO",
    "recibido_por_id": "uuid-del-personal",
    "recibido_por": {
      "id": "uuid-del-personal",
      "codigo": "P001",
      "nombres": "Juan",
      "apellidos": "Pérez"
    },
    "observacion": "Pago por reserva de habitación",
    "created_at": "2026-03-18T10:30:00.000Z"
  },
  "timestamp": 1710758400000
}
```

**Errores:**

- `400`: Monto inválido (debe ser mayor a cero)
- `404`: Personal no encontrado
- `401`: No autenticado
- `403`: Sin permisos de administrador

---

### 2. Listar Pagos

Obtiene todos los pagos registrados, ordenados por fecha de creación descendente.

**Endpoint:** `GET /api/pagos`

**Permisos:** Usuario autenticado

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Pagos obtenidos exitosamente",
  "data": [
    {
      "id": "uuid-del-pago",
      "concepto": "RESERVA",
      "estado": "CONFIRMADO",
      "fecha_pago": "2026-03-18T14:30:00.000Z",
      "monto": "150.00",
      "moneda": "SOL",
      "metodo": "EFECTIVO",
      "recibido_por_id": "uuid-del-personal",
      "recibido_por": {
        "id": "uuid-del-personal",
        "codigo": "P001",
        "nombres": "Juan",
        "apellidos": "Pérez"
      },
      "observacion": "Pago por reserva de habitación",
      "created_at": "2026-03-18T10:30:00.000Z"
    }
  ],
  "timestamp": 1710758400000
}
```

---

### 3. Obtener Pago por ID

Obtiene los detalles de un pago específico.

**Endpoint:** `GET /api/pagos/:id`

**Permisos:** Usuario autenticado

**Parámetros URL:**

- `id` (requerido): UUID del pago

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Pago encontrado",
  "data": {
    "id": "uuid-del-pago",
    "concepto": "CONSUMO",
    "estado": "CONFIRMADO",
    "fecha_pago": "2026-03-18T14:30:00.000Z",
    "monto": "150.00",
    "moneda": "SOL",
    "metodo": "EFECTIVO",
    "recibido_por_id": "uuid-del-personal",
    "recibido_por": {
      "id": "uuid-del-personal",
      "codigo": "P001",
      "nombres": "Juan",
      "apellidos": "Pérez"
    },
    "observacion": "Pago por consumos en el hotel",
    "created_at": "2026-03-18T10:30:00.000Z"
  },
  "timestamp": 1710758400000
}
```

**Errores:**

- `404`: Pago no encontrado
- `401`: No autenticado

---

### 4. Actualizar Pago

Actualiza los datos de un pago existente.

**Endpoint:** `PUT /api/pagos/:id`

**Permisos:** `ADMIN`

**Parámetros URL:**

- `id` (requerido): UUID del pago

**Request Body:**

```json
{
  "estado": "DEVUELTO",
  "observacion": "Pago devuelto"
}
```

**Campos:** Todos los campos son opcionales. Solo se actualizan los campos proporcionados.

- `concepto`: Tipo de pago
- `estado`: Estado del pago
- `fecha_pago`: Fecha y hora del pago en formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) o YYYY-MM-DD
- `monto`: Monto del pago (debe ser mayor a cero)
- `moneda`: Código de moneda
- `metodo`: Método de pago
- `recibido_por_id`: UUID del personal
- `observacion`: Observaciones

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Pago actualizado exitosamente",
  "data": {
    "id": "uuid-del-pago",
    "concepto": "RESERVA",
    "estado": "DEVUELTO",
    "fecha_pago": "2026-03-18T14:30:00.000Z",
    "monto": "150.00",
    "moneda": "SOL",
    "metodo": "EFECTIVO",
    "recibido_por_id": "uuid-del-personal",
    "recibido_por": {
      "id": "uuid-del-personal",
      "codigo": "P001",
      "nombres": "Juan",
      "apellidos": "Pérez"
    },
    "observacion": "Pago devuelto",
    "created_at": "2026-03-18T10:30:00.000Z"
  },
  "timestamp": 1710758400000
}
```

**Errores:**

- `404`: Pago no encontrado
- `400`: Monto inválido
- `404`: Personal no encontrado
- `401`: No autenticado
- `403`: Sin permisos de administrador

---

### 5. Eliminar Pago

Elimina un pago del sistema.

**Endpoint:** `DELETE /api/pagos/:id`

**Permisos:** `ADMIN`

**Parámetros URL:**

- `id` (requerido): UUID del pago

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Pago eliminado exitosamente",
  "data": null,
  "timestamp": 1710758400000
}
```

**Errores:**

- `404`: Pago no encontrado
- `401`: No autenticado
- `403`: Sin permisos de administrador

---

## Modelos de Datos

### ConceptoPago

- `RESERVA`: Pago asociado a una reserva de habitación
- `CONSUMO`: Pago por consumos y servicios durante la estancia

### EstadoPago

- `CONFIRMADO`: Pago confirmado
- `DEVUELTO`: Pago devuelto al cliente
- `RETENIDO`: Pago retenido temporalmente
- `ANULADO`: Pago anulado

### MetodoPago

- `EFECTIVO`: Pago en efectivo
- `VISA`: Tarjeta Visa
- `MASTERCARD`: Tarjeta Mastercard
- `AMEX`: American Express
- `TRANSFERENCIA`: Transferencia bancaria

---

## Notas Importantes

1. Todos los montos se almacenan con precisión decimal (12,2)
2. Las fechas de pago se almacenan en formato TIMESTAMPTZ (fecha y hora con zona horaria)
3. La moneda por defecto es SOL
4. El estado por defecto es CONFIRMADO
5. La fecha de pago por defecto es la fecha y hora actual
6. Los pagos pueden estar asociados a reservas o folios (relaciones opcionales)
7. El campo `recibido_por` muestra información del personal que registró el pago
8. El campo `fecha_pago` acepta formatos: ISO 8601 completo o solo fecha (YYYY-MM-DD)
