# API de Estancias


> **Autorización:** Las rutas que restrigen por rol usan `requireRoles(...)` (`src/presentation/middlewares/roles.middleware.ts`) con valores en `src/common/constants/roles.ts` (p. ej. `admin`, `recepcionista`). Cualquier mención a "ADMIN" u otros roles aquí es orientativa; la fuente de verdad es el `*.routes.ts` correspondiente.


Documentación del módulo `estancia.routes.ts`: estancias (check-in / checkout).

## Base URL

```
/api/private/estancias
```

## Orden de endpoints

1. `GET /` — listar  
2. `GET /:id` — por id  
3. `POST /` — crear  
4. `PUT /:id` — actualizar  
5. `PATCH /:id/checkout` — checkout  
6. `DELETE /:id` — eliminar  

## Autenticación

Sesión Better Auth. Creación, actualización, eliminación y checkout suelen requerir rol `ADMIN` (según despliegue).

---

## Endpoints

### 1. Listar Estancias

Obtiene todas las estancias del sistema.

**Endpoint:** `GET /api/private/estancias`

**Autenticación:** Requerida

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Estancias obtenidas exitosamente",
  "data": [
    {
      "id": "uuid",
      "reserva_id": "uuid",
      "habitacion": {
        "id": "uuid",
        "nro_habitacion": "101",
        "tipo_habitacion_id": "uuid",
        "tipo": {
          "id": "uuid",
          "nombre": "Suite Deluxe",
          "descripcion": "Suite con vista al mar"
        },
        "piso": 1,
        "tiene_ducha": true,
        "tiene_banio": true,
        "url_imagen": [],
        "estado": "OCUPADA",
        "notas": null
      },
      "huesped": {
        "id": "uuid",
        "tipo_doc": "DNI",
        "nro_doc": "12345678",
        "nombres": "Juan",
        "apellidos": "Pérez",
        "email": "juan@example.com",
        "telefono": "+51999999999",
        "nacionalidad": "PE"
      },
      "fecha_entrada": "2024-03-25T14:00:00.000Z",
      "fecha_salida": null,
      "estado": "EN_CASA",
      "notas": null,
      "created_at": "2024-03-25T14:00:00.000Z",
      "updated_at": "2024-03-25T14:00:00.000Z"
    }
  ],
  "timestamp": 1711188000000
}
```

---

### 2. Obtener Estancia por ID

Obtiene una estancia específica por su ID.

**Endpoint:** `GET /api/private/estancias/:id`

**Autenticación:** Requerida

**Parámetros de URL:**

- `id` (string, UUID): ID de la estancia

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Estancia encontrada",
  "data": {
    "id": "uuid",
    "reserva_id": "uuid",
    "habitacion": {
      /* objeto completo */
    },
    "huesped": {
      /* objeto completo */
    },
    "fecha_entrada": "2024-03-25T14:00:00.000Z",
    "fecha_salida": null,
    "estado": "EN_CASA",
    "notas": null,
    "created_at": "2024-03-25T14:00:00.000Z",
    "updated_at": "2024-03-25T14:00:00.000Z"
  },
  "timestamp": 1711188000000
}
```

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "Estancia con id \"uuid\" no encontrada",
  "data": null,
  "timestamp": 1711188000000
}
```

---

### 3. Crear Estancia (Check-in)

Crea una nueva estancia registrando el check-in de un huésped.

**Endpoint:** `POST /api/private/estancias`

**Autenticación:** Requerida (rol ADMIN)

**Body:**

```json
{
  "reservaId": "uuid",
  "habitacionId": "uuid",
  "huespedId": "uuid",
  "fechaEntrada": "2024-03-25T14:00:00.000Z",
  "fechaSalida": null,
  "estado": "EN_CASA",
  "notas": "Cliente llegó temprano"
}
```

**Validaciones:**

- `reservaId`: Requerido, UUID válido, debe existir
- `habitacionId`: Requerido, UUID válido, debe existir
- `huespedId`: Requerido, UUID válido, debe existir
- `fechaEntrada`: Opcional, formato datetime ISO, default: fecha actual
- `fechaSalida`: Opcional, formato datetime ISO, nullable
- `estado`: Opcional, valores: "EN_CASA", "COMPLETADA", "SALIDA_ANTICIPADA", default: "EN_CASA"
- `notas`: Opcional, texto libre
- Si se proporcionan ambas fechas, `fechaSalida` debe ser posterior a `fechaEntrada`

**Respuesta Exitosa (201):**

```json
{
  "success": true,
  "message": "Estancia creada exitosamente",
  "data": {
    "id": "uuid"
    /* ... resto de campos */
  },
  "timestamp": 1711188000000
}
```

**Respuestas de Error:**

- `400`: Validación fallida (fechas inválidas)
- `404`: Reserva, habitación o huésped no encontrados

---

### 4. Actualizar Estancia

Actualiza una estancia existente. No se puede modificar si el estado es COMPLETADA.

**Endpoint:** `PUT /api/private/estancias/:id`

**Autenticación:** Requerida (rol ADMIN)

**Parámetros de URL:**

- `id` (string, UUID): ID de la estancia

**Body (todos los campos opcionales):**

```json
{
  "reservaId": "uuid",
  "habitacionId": "uuid",
  "huespedId": "uuid",
  "fechaEntrada": "2024-03-25T14:00:00.000Z",
  "fechaSalida": "2024-03-27T12:00:00.000Z",
  "estado": "EN_CASA",
  "notas": "Actualización de notas"
}
```

**Validaciones:**

- No se puede modificar si `estado` es COMPLETADA
- Si se proporcionan ambas fechas, `fechaSalida` debe ser posterior a `fechaEntrada`
- Las entidades relacionadas deben existir si se actualizan

**Estados válidos:**

- `EN_CASA`
- `COMPLETADA`
- `SALIDA_ANTICIPADA`

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Estancia actualizada exitosamente",
  "data": {
    "id": "uuid"
    /* ... campos actualizados */
  },
  "timestamp": 1711188000000
}
```

**Respuestas de Error:**

- `400`: Validación fallida
- `403`: No se puede modificar una estancia completada
- `404`: Estancia no encontrada

---

### 5. Realizar Checkout

Completa el checkout de una estancia estableciendo la fecha de salida y cambiando el estado a COMPLETADA.

**Endpoint:** `PATCH /api/private/estancias/:id/checkout`

**Autenticación:** Requerida (rol ADMIN)

**Parámetros de URL:**

- `id` (string, UUID): ID de la estancia

**Body:**

```json
{
  "fechaSalida": "2024-03-27T12:00:00.000Z"
}
```

**Validaciones:**

- `fechaSalida`: Requerida, formato datetime ISO
- `fechaSalida` debe ser posterior a `fechaEntrada`
- No se puede hacer checkout si ya está COMPLETADA

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Checkout realizado exitosamente",
  "data": {
    "id": "uuid",
    "fecha_salida": "2024-03-27T12:00:00.000Z",
    "estado": "COMPLETADA"
    /* ... resto de campos */
  },
  "timestamp": 1711188000000
}
```

**Respuestas de Error:**

- `400`: Fecha de salida inválida o estancia ya completada
- `404`: Estancia no encontrada

---

### 6. Eliminar Estancia

Elimina permanentemente una estancia del sistema.

**Endpoint:** `DELETE /api/private/estancias/:id`

**Autenticación:** Requerida (rol ADMIN)

**Parámetros de URL:**

- `id` (string, UUID): ID de la estancia

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Estancia eliminada exitosamente",
  "data": null,
  "timestamp": 1711188000000
}
```

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "Estancia con id \"uuid\" no encontrada",
  "data": null,
  "timestamp": 1711188000000
}
```

---

## Estados de Estancia

| Estado              | Descripción                                |
| ------------------- | ------------------------------------------ |
| `EN_CASA`           | Huésped actualmente alojado en el hotel    |
| `COMPLETADA`        | Check-out realizado, estancia finalizada   |
| `SALIDA_ANTICIPADA` | Huésped salió antes de la fecha programada |

---

## Flujo de Trabajo

1. **Check-in (Crear Estancia)**
   - Se crea una estancia con estado `EN_CASA`
   - Se registra la fecha de entrada (por defecto: fecha actual)
   - Se vincula con una reserva, habitación y huésped

2. **Durante la Estancia**
   - Se pueden actualizar datos mientras el estado sea `EN_CASA`
   - Se pueden agregar notas sobre la estancia

3. **Check-out (Completar Estancia)**
   - Se usa el endpoint `/checkout` para finalizar
   - Se registra la fecha de salida
   - El estado cambia automáticamente a `COMPLETADA`
   - Una vez completada, la estancia es inmutable

---

## Relaciones

Una estancia está vinculada con:

- **Reserva**: Solo se devuelve el `reserva_id` (UUID de la reserva)
- **Habitación**: La habitación donde se aloja el huésped (objeto completo)
- **Huésped**: El huésped que se está alojando (objeto completo)

Las relaciones de Habitación y Huésped se incluyen completas en las respuestas, mientras que para Reserva solo se devuelve el ID.

---

## Códigos de Estado HTTP

- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Datos de entrada inválidos
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No autorizado (requiere rol ADMIN o estancia inmutable)
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

---

## Notas Importantes

1. **Inmutabilidad**: Las estancias con estado COMPLETADA son inmutables y no pueden ser modificadas.

2. **Checkout Automático**: El endpoint `/checkout` establece automáticamente el estado a COMPLETADA.

3. **Validación de Fechas**: La fecha de salida siempre debe ser posterior a la fecha de entrada.

4. **Relaciones Completas**: Las respuestas incluyen los objetos completos de habitación y huésped. Para la reserva solo se devuelve el `reserva_id`.

5. **Check-in Flexible**: La fecha de entrada es opcional y por defecto usa la fecha actual, permitiendo check-ins inmediatos.
