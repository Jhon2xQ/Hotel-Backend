# API de Inventario - Bar

> **Autorización:** Las rutas que restrigen por rol usan `requireRoles(...)` (`src/presentation/middlewares/roles.middleware.ts`) con valores en `src/common/constants/roles.ts` (p. ej. `admin`, `recepcionista`). Cualquier mención a "ADMIN" u otros roles aquí es orientativa; la fuente de verdad es el `*.routes.ts` correspondiente.

Documentación de los endpoints para la gestión del inventario del bar del hotel.

## Base URLs

```
/api/private/bar/insumos
/api/private/bar/movimientos
```

## Autenticación

Todos los endpoints requieren autenticación mediante Better Auth. Los endpoints de creación, actualización y eliminación requieren rol `ADMIN`.

---

## Endpoints - Insumos

### 1. Listar Insumos del Bar

Obtiene la lista de todos los insumos activos del bar.

**Endpoint:** `GET /api/private/bar/insumos`

**Autenticación:** Requerida

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Insumos de bar obtenidos exitosamente",
  "data": [
    {
      "id": "uuid",
      "codigo": "BAR-CERV-001",
      "nombre": "Cerveza Cristal",
      "unidad": "BOTELLA",
      "stock_actual": 50,
      "stock_minimo": 10,
      "activo": true,
      "notas": null,
      "created_at": "2026-04-15T10:00:00.000Z",
      "updated_at": "2026-04-15T10:00:00.000Z"
    }
  ],
  "timestamp": 1234567890
}
```

---

### 2. Obtener Insumo por ID

Obtiene los detalles de un insumo específico del bar.

**Endpoint:** `GET /api/private/bar/insumos/:id`

**Autenticación:** Requerida

**Parámetros de URL:**

- `id` (UUID, requerido): ID del insumo

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Insumo de bar encontrado",
  "data": {
    "id": "uuid",
    "codigo": "BAR-CERV-001",
    "nombre": "Cerveza Cristal",
    "unidad": "BOTELLA",
    "stock_actual": 50,
    "stock_minimo": 10,
    "activo": true,
    "notas": null,
    "created_at": "2026-04-15T10:00:00.000Z",
    "updated_at": "2026-04-15T10:00:00.000Z"
  },
  "timestamp": 1234567890
}
```

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "Insumo de bar con ID [uuid] no encontrado",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 3. Crear Insumo del Bar

Crea un nuevo insumo en el inventario del bar.

**Endpoint:** `POST /api/private/bar/insumos`

**Autenticación:** Requerida (rol ADMIN)

**Body:**

```json
{
  "codigo": "BAR-CERV-001",
  "nombre": "Cerveza Cristal",
  "unidad": "BOTELLA",
  "stock_actual": 50,
  "stock_minimo": 10,
  "notas": "Cerveza rubia de 355ml"
}
```

**Campos:**

- `codigo` (string, requerido): Código único del insumo. Máximo 30 caracteres.
- `nombre` (string, requerido): Nombre del insumo. Máximo 150 caracteres.
- `unidad` (enum, requerido): Unidad de medida. Valores: `UNIDAD`, `LITRO`, `KG`, `GR`, `BOTELLA`, `CAJA`, `FCO`, `SACO`, `TUBO`, `BLISTER`, `PAQUETE`
- `stock_actual` (número, opcional): Cantidad actual en inventario. Default: `0`
- `stock_minimo` (número, opcional): Stock mínimo para alertas. Default: `0`
- `notas` (string, opcional): Notas adicionales

**Respuesta Exitosa (201):**

```json
{
  "success": true,
  "message": "Insumo de bar creado exitosamente",
  "data": {
    "id": "uuid",
    "codigo": "BAR-CERV-001",
    "nombre": "Cerveza Cristal",
    "unidad": "BOTELLA",
    "stock_actual": 50,
    "stock_minimo": 10,
    "activo": true,
    "notas": "Cerveza rubia de 355ml",
    "created_at": "2026-04-15T10:00:00.000Z",
    "updated_at": "2026-04-15T10:00:00.000Z"
  },
  "timestamp": 1234567890
}
```

**Respuesta de Error (409):**

```json
{
  "success": false,
  "message": "Ya existe un insumo de bar con código BAR-CERV-001",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 4. Actualizar Insumo del Bar

Actualiza los datos de un insumo existente.

**Endpoint:** `PUT /api/private/bar/insumos/:id`

**Autenticación:** Requerida (rol ADMIN)

**Parámetros de URL:**

- `id` (UUID, requerido): ID del insumo

**Body:**

```json
{
  "nombre": "Cerveza Heineken",
  "stock_actual": 30,
  "stock_minimo": 15
}
```

**Campos (todos opcionales):**

- `codigo` (string): Código único del insumo
- `nombre` (string): Nombre del insumo
- `unidad` (enum): Unidad de medida
- `stock_actual` (número): Cantidad actual
- `stock_minimo` (número): Stock mínimo
- `notas` (string): Notas adicionales
- `activo` (boolean): Activo/inactivo

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Insumo de bar actualizado exitosamente",
  "data": { ... },
  "timestamp": 1234567890
}
```

---

### 5. Eliminar Insumo del Bar

Desactiva un insumo del inventario (borrado lógico).

**Endpoint:** `DELETE /api/private/bar/insumos/:id`

**Autenticación:** Requerida (rol ADMIN)

**Parámetros de URL:**

- `id` (UUID, requerido): ID del insumo

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Insumo de bar eliminado exitosamente",
  "data": null,
  "timestamp": 1234567890
}
```

---

## Endpoints - Movimientos

### 6. Registrar Movimiento

Registra una entrada o salida de inventario.

**Endpoint:** `POST /api/private/bar/movimientos`

**Autenticación:** Requerida

**Body (Entrada):**

```json
{
  "insumo_id": "uuid-del-insumo",
  "tipo": "ENTRADA",
  "cantidad": 20,
  "motivo_entrada": "COMPRA",
  "notas": "Reposición semanal"
}
```

**Body (Salida):**

```json
{
  "insumo_id": "uuid-del-insumo",
  "tipo": "SALIDA",
  "cantidad": 5,
  "motivo_salida": "CONSUMO",
  "notas": "Consumo del día"
}
```

**Campos:**

- `insumo_id` (UUID, requerido): ID del insumo
- `tipo` (enum, requerido): `ENTRADA` o `SALIDA`
- `cantidad` (número, requerido): Cantidad. Debe ser > 0
- `motivo_entrada` (enum, requerido si tipo=ENTRADA): `COMPRA`, `DONACION`, `AJUSTE`, `REPOSICION`
- `motivo_salida` (enum, requerido si tipo=SALIDA): `CONSUMO`, `DESECHO`, `AJUSTE`, `STOCK_MINIMO`
- `notas` (string, opcional): Notas adicionales

**Respuesta Exitosa (201):**

```json
{
  "success": true,
  "message": "Movimiento registrado exitosamente",
  "data": {
    "id": "uuid",
    "insumo_id": "uuid-del-insumo",
    "tipo": "ENTRADA",
    "cantidad": 20,
    "motivo_entrada": "COMPRA",
    "motivo_salida": null,
    "notas": "Reposición semanal",
    "created_at": "2026-04-15T10:00:00.000Z"
  },
  "timestamp": 1234567890
}
```

**Respuesta de Error (400):**

```json
{
  "success": false,
  "message": "Stock insuficiente para el insumo [uuid]. Solicitado: 10, disponible: 5",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 7. Listar Movimientos (Reportes)

Obtiene el historial de movimientos con filtros para reportes.

**Endpoint:** `GET /api/private/bar/movimientos`

**Autenticación:** Requerida

**Parámetros de Query:**

- `insumo_id` (UUID, opcional): Filtrar por insumo
- `tipo` (enum, opcional): Filtrar por tipo (`ENTRADA` o `SALIDA`)
- `fecha_inicio` (ISO 8601, opcional): Fecha de inicio del rango
- `fecha_fin` (ISO 8601, opcional): Fecha de fin del rango

**Ejemplo - Reporte por día:**

```bash
curl -X GET "http://localhost:3000/api/private/bar/movimientos?fecha_inicio=2026-04-15T00:00:00.000Z&fecha_fin=2026-04-15T23:59:59.999Z" \
  -H "Authorization: Bearer <token>"
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Movimientos obtenidos exitosamente",
  "data": [
    {
      "id": "uuid",
      "insumo_id": "uuid-del-insumo",
      "tipo": "ENTRADA",
      "cantidad": 20,
      "motivo_entrada": "COMPRA",
      "motivo_salida": null,
      "notas": "Reposición semanal",
      "created_at": "2026-04-15T10:00:00.000Z"
    }
  ],
  "timestamp": 1234567890
}
```

---

## Estructura del Insumo

| Campo          | Tipo               | Descripción                                    |
| --------------- | ------------------ | ---------------------------------------------- |
| `id`            | UUID               | Identificador único del insumo              |
| `codigo`        | string             | Código único del insumo (máx. 30 caracteres)|
| `nombre`        | string             | Nombre del insumo (máx. 150 caracteres)     |
| `unidad`        | enum               | Unidad de medida                               |
| `stock_actual`  | number            | Cantidad actual en inventario               |
| `stock_minimo`  | number            | Stock mínimo para alertas                   |
| `activo`        | boolean           | Estado activo/inactivo                      |
| `notas`         | string \| null    | Notas adicionales                           |
| `created_at`    | ISO 8601           | Fecha de creación                              |
| `updated_at`    | ISO 8601           | Fecha de última actualización                  |

---

## Códigos de Estado HTTP

- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Datos de entrada inválidos o stock insuficiente
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: Sin permisos suficientes
- `404 Not Found`: Insumo no encontrado
- `409 Conflict`: Código de insumo duplicado
- `500 Internal Server Error`: Error del servidor

---

## Uso Típico

### Registrar compra de insumos

```bash
curl -X POST https://api.hotel.com/api/private/bar/movimientos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "insumo_id": "<uuid>",
    "tipo": "ENTRADA",
    "cantidad": 24,
    "motivo_entrada": "COMPRA",
    "notas": "Compra semanal"
  }'
```

### Reporte de movimientos del día

```bash
curl -X GET "https://api.hotel.com/api/private/bar/movimientos?fecha_inicio=2026-04-15T00:00:00.000Z" \
  -H "Authorization: Bearer <token>"
```

### Reporte de movimientos de la semana

```bash
curl -X GET "https://api.hotel.com/api/private/bar/movimientos?fecha_inicio=2026-04-09T00:00:00.000Z&fecha_fin=2026-04-15T23:59:59.999Z" \
  -H "Authorization: Bearer <token>"
```