# API de Productos

> **Autorización:** Las rutas que restrigen por rol usan `requireRoles(...)` (`src/presentation/middlewares/roles.middleware.ts`) con valores en `src/common/constants/roles.ts` (p. ej. `admin`, `recepcionista`). Cualquier mención a "ADMIN" u otros roles aquí es orientativa; la fuente de verdad es el `*.routes.ts` correspondiente.

Documentación de los endpoints para la gestión de productos del inventario del hotel.

## Base URL

```
/api/private/productos
```

## Autenticación

Todos los endpoints requieren autenticación mediante Better Auth. Los endpoints de creación, actualización y eliminación requieren rol `ADMIN`.

---

## Endpoints

### 1. Listar Productos (Paginado)

Obtiene la lista paginada de todos los productos registrados.

**Endpoint:** `GET /api/private/productos`

**Autenticación:** Requerida

**Parámetros de Query:**

- `page` (número, opcional): Número de página. Default: `1`
- `limit` (número, opcional): Elementos por página. Default: `10`. Máximo: `100`

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Productos obtenidos exitosamente",
  "data": {
    "list": [
      {
        "id": "uuid",
        "codigo": "PROD-001",
        "nombre": "Cerveza Cristal",
        "descripcion": "Cerveza rubia de 355ml",
        "precio_unitario": 5.5,
        "stock": 100,
        "created_at": "2026-04-15T10:00:00.000Z",
        "updated_at": "2026-04-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  },
  "timestamp": 1234567890
}
```

---

### 2. Obtener Producto por ID

Obtiene los detalles de un producto específico.

**Endpoint:** `GET /api/private/productos/:id`

**Autenticación:** Requerida

**Parámetros de URL:**

- `id` (UUID, requerido): ID del producto

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Producto encontrado",
  "data": {
    "id": "uuid",
    "codigo": "PROD-001",
    "nombre": "Cerveza Cristal",
    "descripcion": "Cerveza rubia de 355ml",
    "precio_unitario": 5.5,
    "stock": 100,
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
  "message": "Producto con ID [uuid] no encontrado",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 3. Crear Producto

Crea un nuevo producto en el inventario.

**Endpoint:** `POST /api/private/productos`

**Autenticación:** Requerida (rol ADMIN)

**Body:**

```json
{
  "codigo": "PROD-001",
  "nombre": "Cerveza Cristal",
  "descripcion": "Cerveza rubia de 355ml",
  "precio_unitario": 5.5,
  "stock": 100
}
```

**Campos:**

- `codigo` (string, requerido): Código único del producto. Máximo 30 caracteres.
- `nombre` (string, requerido): Nombre del producto. Máximo 150 caracteres.
- `descripcion` (string, opcional): Descripción del producto.
- `precio_unitario` (número, requerido): Precio unitario. Debe ser >= 0 y <= 9999.99
- `stock` (número, opcional): Cantidad en inventario. Debe ser >= 0. Default: `0`

**Respuesta Exitosa (201):**

```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "id": "uuid",
    "codigo": "PROD-001",
    "nombre": "Cerveza Cristal",
    "descripcion": "Cerveza rubia de 355ml",
    "precio_unitario": 5.5,
    "stock": 100,
    "created_at": "2026-04-15T10:00:00.000Z",
    "updated_at": "2026-04-15T10:00:00.000Z"
  },
  "timestamp": 1234567890
}
```

**Respuesta de Error (400):**

```json
{
  "success": false,
  "message": "El precio unitario debe ser mayor o igual a 0",
  "data": null,
  "timestamp": 1234567890
}
```

**Respuesta de Error (409):**

```json
{
  "success": false,
  "message": "Ya existe un producto con código PROD-001",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 4. Actualizar Producto

Actualiza los datos de un producto existente.

**Endpoint:** `PUT /api/private/productos/:id`

**Autenticación:** Requerida (rol ADMIN)

**Parámetros de URL:**

- `id` (UUID, requerido): ID del producto

**Body:**

```json
{
  "nombre": "Cerveza Heineken",
  "precio_unitario": 7.0,
  "stock": 50,
  "descripcion": "Cerveza importada"
}
```

**Campos (todos opcionales):**

- `codigo` (string): Código único del producto
- `nombre` (string): Nombre del producto
- `descripcion` (string): Descripción del producto
- `precio_unitario` (número): Precio unitario
- `stock` (número): Cantidad en inventario

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Producto actualizado exitosamente",
  "data": {
    "id": "uuid",
    "codigo": "PROD-001",
    "nombre": "Cerveza Heineken",
    "descripcion": "Cerveza importada",
    "precio_unitario": 7.0,
    "stock": 50,
    "created_at": "2026-04-15T10:00:00.000Z",
    "updated_at": "2026-04-15T12:00:00.000Z"
  },
  "timestamp": 1234567890
}
```

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "Producto con ID [uuid] no encontrado",
  "data": null,
  "timestamp": 1234567890
}
```

**Respuesta de Error (409):**

```json
{
  "success": false,
  "message": "Ya existe un producto con código PROD-002",
  "data": null,
  "timestamp": 1234567890
}
```

---

### 5. Eliminar Producto

Elimina un producto del sistema.

**Endpoint:** `DELETE /api/private/productos/:id`

**Autenticación:** Requerida (rol ADMIN)

**Parámetros de URL:**

- `id` (UUID, requerido): ID del producto

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Producto eliminado exitosamente",
  "data": null,
  "timestamp": 1234567890
}
```

**Respuesta de Error (404):**

```json
{
  "success": false,
  "message": "Producto con ID [uuid] no encontrado",
  "data": null,
  "timestamp": 1234567890
}
```

---

## Estructura del Producto

| Campo           | Tipo               | Descripción                                    |
| --------------- | ------------------ | ---------------------------------------------- |
| `id`            | UUID               | Identificador único del producto              |
| `codigo`        | string             | Código único del producto (máx. 30 caracteres)|
| `nombre`        | string             | Nombre del producto (máx. 150 caracteres)     |
| `descripcion`   | string \| null     | Descripción opcional del producto             |
| `precio_unitario`| number            | Precio unitario (hasta 9999.99)               |
| `stock`         | integer            | Cantidad en inventario                        |
| `created_at`    | ISO 8601           | Fecha de creación                              |
| `updated_at`    | ISO 8601           | Fecha de última actualización                  |

---

## Códigos de Estado HTTP

- `200 OK`: Operación exitosa
- `201 Created`: Producto creado exitosamente
- `400 Bad Request`: Datos de entrada inválidos (precio negativo, stock negativo, etc.)
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: Sin permisos suficientes
- `404 Not Found`: Producto no encontrado
- `409 Conflict`: Código de producto duplicado
- `500 Internal Server Error`: Error del servidor

---

## Uso Típico

### Crear un nuevo producto

```bash
curl -X POST https://api.hotel.com/api/private/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "codigo": "PROD-001",
    "nombre": "Cerveza Cristal",
    "descripcion": "Cerveza rubia de 355ml",
    "precio_unitario": 5.50,
    "stock": 100
  }'
```

### Listar productos con paginación

```bash
curl -X GET "https://api.hotel.com/api/private/productos?page=1&limit=20" \
  -H "Authorization: Bearer <token>"
```

### Actualizar stock de un producto

```bash
curl -X PUT https://api.hotel.com/api/private/productos/<uuid> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "stock": 150
  }'
```