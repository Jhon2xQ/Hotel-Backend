# API de Habitaciones

Documentación unificada del módulo `habitacion.routes.ts` (privado y público): CRUD, estado, búsqueda de disponibles e imágenes (`multipart/form-data`).

## Bases URL

| Prefijo | Uso |
| ------- | --- |
| `/api/private/habitaciones` | CRUD y gestión (requiere sesión Better Auth) |
| `/api/public/habitaciones` | Consulta pública: disponibles y precio canal DIRECTO (sin sesión) |

## Orden de endpoints (convención del proyecto)

1. **GET** listado (privado): `GET /api/private/habitaciones`
2. **GET** por id (privado): `GET /api/private/habitaciones/:id`
3. **GET** búsqueda / disponibles (público, query opcional): `GET /api/public/habitaciones`
4. **GET** habitación con precio (público): `GET /api/public/habitaciones/:id`
5. **POST** crear (privado, `multipart/form-data`)
6. **PUT** actualizar (privado, `multipart/form-data`)
7. **PATCH** estado (privado): `PATCH /api/private/habitaciones/:id/estado`
8. **DELETE** (privado): `DELETE /api/private/habitaciones/:id`

En las respuestas, el objeto anidado `tipo_habitacion` sigue el mismo contrato que **Tipo de habitación** (`TipoHabitacionDto`: incluye `id`, `nombre`, `descripcion`, `created_at`, `updated_at`).

## Autenticación

- **Privado:** sesión Better Auth en todas las rutas bajo `/api/private/habitaciones`.
- **Público:** sin autenticación en `/api/public/habitaciones`.

## Imágenes (S3 / multipart)

Creación y actualización aceptan `multipart/form-data` con campos de habitación y archivos de imagen; las URLs resultantes se guardan en `url_imagen`. En la actualización, el cliente envía `imagenes_existentes[]` con las URLs a conservar y `imagenes[]` con los archivos nuevos; las URLs no incluidas se eliminan de S3 automáticamente. Variables de entorno S3: `S3_REGION`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`, `S3_FORCE_PATH_STYLE`.

## Endpoints

### 1. Listar Habitaciones (paginado)

Obtiene la lista paginada de habitaciones del hotel, con opción de filtrar por tipo de habitación.

**Endpoint:** `GET /api/private/habitaciones`

**Permisos:** Usuario autenticado

**Query (opcional):**

| Parámetro | Tipo   | Default | Descripción                                                                      |
| --------- | ------ | ------- | -------------------------------------------------------------------------------- |
| `page`    | number | 1       | Número de página (debe ser mayor a 0)                                            |
| `limit`   | number | 10      | Resultados por página (entre 1 y 100)                                            |
| `numero`  | string | —       | Filtra por número de habitación (coincidencia parcial, sin distinción de mayúsculas) |
| `tipo`    | string | —       | Filtra por nombre de tipo de habitación (coincidencia parcial, sin distinción de mayúsculas) |
| `estado`  | bool   | —       | Filtra por estado de la habitación (`true` = activa, `false` = inactiva)         |

**Ejemplo:** `GET /api/private/habitaciones?page=1&limit=10&numero=10&tipo=suite&estado=true`

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Habitaciones obtenidas exitosamente",
  "data": {
    "list": [
      {
        "id": "789e4567-e89b-12d3-a456-426614174000",
        "nro_habitacion": "101",
        "tipo_habitacion": {
          "id": "123e4567-e89b-12d3-a456-426614174000",
          "nombre": "Suite Deluxe",
          "descripcion": "Suite de lujo con vista panorámica al mar"
        },
        "piso": 1,
        "feature": "WiFi, aire acondicionado",
        "amenities": "TV, minibar",
        "url_imagen": ["https://example.com/rooms/101-1.jpg", "https://example.com/rooms/101-2.jpg"],
        "estado": true,
        "descripcion": "Suite con balcón privado",
        "promociones": ["promo-uuid-1"],
        "created_at": "2026-03-15T10:00:00.000Z",
        "updated_at": "2026-03-17T08:00:00.000Z"
      },
      {
        "id": "789e4567-e89b-12d3-a456-426614174001",
        "nro_habitacion": "102",
        "tipo_habitacion": {
          "id": "123e4567-e89b-12d3-a456-426614174001",
          "nombre": "Habitación Estándar",
          "descripcion": "Habitación cómoda con todas las comodidades básicas"
        },
        "piso": 1,
        "feature": null,
        "amenities": null,
        "url_imagen": null,
        "estado": false,
        "descripcion": null,
        "promociones": [],
        "created_at": "2026-03-15T10:05:00.000Z",
        "updated_at": "2026-03-17T14:30:00.000Z"
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
  "timestamp": 1710684600000
}
```

**Notas:**

- Las habitaciones se devuelven ordenadas por número de habitación (ascendente)
- Cada habitación incluye el tipo de habitación asociado
- El campo `url_imagen` es un array de strings que puede contener múltiples URLs de imágenes
- El filtro `numero` busca por número de habitación de forma parcial y sin distinción de mayúsculas
- El filtro `tipo` busca por nombre del tipo de habitación de forma parcial y sin distinción de mayúsculas
- El filtro `estado` filtra por el estado booleano de la habitación (`true` = activa, `false` = inactiva)
- Los filtros pueden combinarse (ej. `?numero=10&tipo=suite&estado=true`)

---

### 2. Obtener Habitación por ID

Obtiene los detalles de una habitación junto con las fechas de sus reservas filtradas por estado.

**Endpoint:** `GET /api/private/habitaciones/:id`

**Permisos:** Usuario autenticado

**Parámetros de ruta:**

- `id` (UUID, requerido): ID de la habitación

**Query (opcional):**

| Parámetro     | Tipo   | Default                        | Descripción                                                                   |
| ------------- | ------ | ------------------------------ | ----------------------------------------------------------------------------- |
| `tipo_reserva` | string | `TENTATIVA,CONFIRMADA,EN_CASA` | Estados de reserva separados por coma para filtrar las fechas de la habitación |

Valores válidos para `tipo_reserva`: `TENTATIVA`, `CONFIRMADA`, `EN_CASA`, `COMPLETADA`, `CANCELADA`, `NO_LLEGO`.

**Ejemplos:**

- `GET /api/private/habitaciones/:id` — devuelve fechas con estados TENTATIVA, CONFIRMADA y EN_CASA
- `GET /api/private/habitaciones/:id?tipo_reserva=TENTATIVA,CONFIRMADA` — solo fechas con esos estados
- `GET /api/private/habitaciones/:id?tipo_reserva=CANCELADA,NO_LLEGO` — solo fechas canceladas y no-shows

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Habitación encontrada",
  "data": {
    "habitacion": {
      "id": "789e4567-e89b-12d3-a456-426614174000",
      "nro_habitacion": "101",
      "tipo_habitacion": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "nombre": "Suite Deluxe",
        "descripcion": "Suite de lujo con vista panorámica al mar"
      },
      "piso": 1,
      "feature": "WiFi, aire acondicionado",
      "amenities": "TV, minibar, cafetera",
      "url_imagen": ["https://example.com/rooms/101-1.jpg", "https://example.com/rooms/101-2.jpg"],
      "estado": true,
      "descripcion": "Suite con balcón privado",
      "promociones": ["promo-uuid-1", "promo-uuid-2"],
      "muebles": [
        {
          "id": "mueble-uuid-1",
          "codigo": "CAMA-001",
          "nombre": "Cama King Size",
          "descripcion": "Cama matrimonial con colchon ortopedico",
          "categoria": {
            "id": "cat-uuid-1",
            "nombre": "Camas",
            "descripcion": "Categoria de camas",
            "activo": true,
            "created_at": "2026-01-01T00:00:00.000Z",
            "updated_at": "2026-01-01T00:00:00.000Z"
          },
          "url_imagen": "https://example.com/camas/king-size.jpg",
          "condicion": "BUENO",
          "fecha_adquisicion": "2025-01-15",
          "ultima_revision": "2026-03-01",
          "habitacion_id": "789e4567-e89b-12d3-a456-426614174000",
          "created_at": "2025-01-15T10:00:00.000Z",
          "updated_at": "2026-03-01T10:00:00.000Z"
        },
        {
          "id": "mueble-uuid-2",
          "codigo": "MES-001",
          "nombre": "Mesa de Noche",
          "descripcion": "Mesa de noche con cajon",
          "categoria": {
            "id": "cat-uuid-2",
            "nombre": "Mesas",
            "descripcion": "Categoria de mesas",
            "activo": true,
            "created_at": "2026-01-01T00:00:00.000Z",
            "updated_at": "2026-01-01T00:00:00.000Z"
          },
          "url_imagen": null,
          "condicion": "BUENO",
          "fecha_adquisicion": "2025-01-15",
          "ultima_revision": "2026-03-01",
          "habitacion_id": "789e4567-e89b-12d3-a456-426614174000",
          "created_at": "2025-01-15T10:00:00.000Z",
          "updated_at": "2026-03-01T10:00:00.000Z"
        }
      ],
      "created_at": "2026-03-15T10:00:00.000Z",
      "updated_at": "2026-03-17T08:00:00.000Z"
    },
    "fechas_reserva": [
      {
        "fecha_inicio": "2026-04-01T00:00:00.000Z",
        "fecha_fin": "2026-04-05T00:00:00.000Z",
        "estado": "CONFIRMADA"
      },
      {
        "fecha_inicio": "2026-04-10T00:00:00.000Z",
        "fecha_fin": "2026-04-12T00:00:00.000Z",
        "estado": "TENTATIVA"
      }
    ]
  },
  "timestamp": 1710684600000
}
```

**Notas:**

- `habitacion.muebles` contiene el listado de muebles asociados a la habitación (cada mueble incluye `categoria`, `fecha_adquisicion`, `ultima_revision`, `habitacion_id`, `created_at`, `updated_at`)
- `fechas_reserva` contiene las reservas de la habitación cuyo estado coincida con los filtros, ordenadas por `fecha_inicio` ascendente
- Cada entrada incluye `fecha_inicio`, `fecha_fin` (en formato ISO 8601) y `estado` de la reserva
- Si no hay reservas que coincidan, `fechas_reserva` será un array vacío
- Si no hay muebles asociados, `muebles` será un array vacío

**Errores:**

- `404`: Habitación no encontrada

```json
{
  "success": false,
  "message": "Habitación no encontrada",
  "data": null,
  "timestamp": 1710684600000
}
```

---

### 3. Búsqueda de habitaciones disponibles (público)

Obtiene las habitaciones disponibles con precio de tarifa del canal **DIRECTO**, con filtros opcionales por tipo, rango de fechas y orden de precio.

**Endpoint:** `GET /api/public/habitaciones`

**Permisos:** Sin autenticación

**Query (opcional):**

| Parámetro      | Tipo   | Default | Descripción                                                                      |
| -------------- | ------ | ------- | -------------------------------------------------------------------------------- |
| `tipo`         | string | —       | Filtra por nombre de tipo de habitación                                          |
| `fecha_inicio` | string | —       | Fecha de inicio del rango (ISO 8601, ej. `2026-04-01T00:00:00.000Z`)            |
| `fecha_fin`    | string | —       | Fecha de fin del rango (ISO 8601, ej. `2026-04-05T00:00:00.000Z`)              |
| `orden_precio` | string | —       | Ordenar por precio: `asc` (menor a mayor) o `desc` (mayor a menor)              |

**Validaciones:**

- Si se envían ambas fechas, `fecha_inicio` debe ser anterior a `fecha_fin`
- Las fechas son opcionales individualmente, pero si se envía una sin la otra se ignora el filtro de fechas

**Comportamiento según parámetros:**

- Sin fechas ni tipo: devuelve todas las habitaciones con precio DIRECTO
- Solo tipo: filtra por tipo con precio DIRECTO
- Con fechas (y opcionalmente tipo): busca habitaciones disponibles en ese rango de fechas

**Ejemplos:**

- `GET /api/public/habitaciones` — todas las habitaciones con precio
- `GET /api/public/habitaciones?tipo=suite` — solo suites con precio
- `GET /api/public/habitaciones?fecha_inicio=2026-04-01T00:00:00.000Z&fecha_fin=2026-04-05T00:00:00.000Z` — disponibles en esas fechas
- `GET /api/public/habitaciones?fecha_inicio=2026-04-01T00:00:00.000Z&fecha_fin=2026-04-05T00:00:00.000Z&tipo=suite&orden_precio=asc` — suites disponibles, ordenadas por precio ascendente

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Habitaciones disponibles obtenidas exitosamente",
  "data": [
    {
      "habitacion": {
        "id": "789e4567-e89b-12d3-a456-426614174000",
        "nro_habitacion": "101",
        "tipo_habitacion": {
          "id": "123e4567-e89b-12d3-a456-426614174000",
          "nombre": "Suite Deluxe",
          "descripcion": "Suite de lujo con vista panorámica al mar"
        },
        "piso": 1,
        "feature": "WiFi, aire acondicionado",
        "amenities": "TV, minibar",
        "url_imagen": ["https://example.com/rooms/101-1.jpg"],
        "estado": true,
        "descripcion": "Suite con balcón privado",
        "created_at": "2026-03-15T10:00:00.000Z",
        "updated_at": "2026-03-17T08:00:00.000Z"
      },
      "precio_noche": 150.00
    },
    {
      "habitacion": {
        "id": "789e4567-e89b-12d3-a456-426614174001",
        "nro_habitacion": "102",
        "tipo_habitacion": {
          "id": "123e4567-e89b-12d3-a456-426614174001",
          "nombre": "Habitación Estándar",
          "descripcion": "Habitación cómoda con todas las comodidades básicas"
        },
        "piso": 1,
        "feature": null,
        "amenities": null,
        "url_imagen": null,
        "estado": true,
        "descripcion": null,
        "created_at": "2026-03-15T10:05:00.000Z",
        "updated_at": "2026-03-17T14:30:00.000Z"
      },
      "precio_noche": 80.00
    }
  ],
  "timestamp": 1710684600000
}
```

**Notas:**

- `precio_noche` proviene de la tarifa del canal **DIRECTO**; puede ser `null` si no existe tarifa configurada
- Si no hay habitaciones que coincidan, se devuelve un array vacío
- Al ordenar con `orden_precio`, las habitaciones sin precio (`null`) se ubican al final

**Errores:**

- `400`: Parámetros de query inválidos

```json
{
  "success": false,
  "message": "Error de validación en query: fecha_inicio: fecha_inicio debe ser una fecha ISO válida",
  "data": null,
  "timestamp": 1710684600000
}
```

---

### 4. Habitación por ID con precio (público)

Obtiene los detalles de una habitación junto con el precio de la tarifa del canal **DIRECTO** y el listado de muebles asociados.

**Endpoint:** `GET /api/public/habitaciones/:id`

**Permisos:** Sin autenticación

**Parámetros de ruta:**

- `id` (UUID, requerido): ID de la habitación

**Ejemplo:** `GET /api/public/habitaciones/789e4567-e89b-12d3-a456-426614174000`

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Habitación con precio obtenida exitosamente",
  "data": {
    "id": "789e4567-e89b-12d3-a456-426614174000",
    "nro_habitacion": "101",
    "tipo_habitacion_id": "123e4567-e89b-12d3-a456-426614174000",
    "piso": 1,
    "feature": "WiFi, aire acondicionado",
    "amenities": "TV, minibar, cafetera",
    "url_imagen": ["https://example.com/rooms/101-1.jpg", "https://example.com/rooms/101-2.jpg"],
    "estado": true,
    "descripcion": "Suite con balcón privado",
    "muebles": [
      {
        "id": "mueble-uuid-1",
        "codigo": "CAMA-001",
        "nombre": "Cama King Size",
        "descripcion": "Cama matrimonial con colchon ortopedico",
        "url_imagen": "https://example.com/camas/king-size.jpg",
        "condicion": "BUENO"
      },
      {
        "id": "mueble-uuid-2",
        "codigo": "MES-001",
        "nombre": "Mesa de Noche",
        "descripcion": "Mesa de noche con cajon",
        "url_imagen": null,
        "condicion": "BUENO"
      }
    ]
  },
  "timestamp": 1710684600000
}
```

**Notas:**

- `precio_noche` fue removido del contrato público; ahora la respuesta devuelve directamente los datos de la habitación
- El campo `muebles` contiene el listado de muebles asociados con datos públicos (`id`, `codigo`, `nombre`, `descripcion`, `url_imagen`, `condicion`)
- Si no hay muebles asociados, `muebles` será un array vacío

**Errores:**

- `400`: ID no es un UUID válido
- `404`: Habitación no encontrada

```json
{
  "success": false,
  "message": "Habitación no encontrada",
  "data": null,
  "timestamp": 1710684600000
}
```

---

### 5. Crear Habitación

Crea una nueva habitación física en el sistema. Acepta `multipart/form-data` para permitir la subida de imágenes.

**Endpoint:** `POST /api/private/habitaciones`

**Permisos:** Usuario autenticado

**Body (`multipart/form-data`):**

| Campo                | Tipo             | Requerido | Descripción                                                    |
| -------------------- | ---------------- | --------- | -------------------------------------------------------------- |
| `nro_habitacion`     | string           | Sí        | Número único de habitación (máx. 10 caracteres)               |
| `tipo_habitacion_id` | UUID             | Sí        | ID del tipo de habitación                                      |
| `piso`               | number           | Sí        | Número de piso (entero positivo)                               |
| `feature`            | string           | No        | Características principales de la habitación                  |
| `amenities`          | string           | No        | Comodidades adicionales (separadas por coma)                  |
| `estado`             | boolean          | No        | Estado de la habitación (`true` = activa, `false` = inactiva; default: `false`) |
| `descripcion`        | string           | No        | Descripción o notas adicionales                                |
| `imagenes[]`         | archivos         | No        | Archivos de imagen a subir a S3                                |

**Ejemplo (curl):**

```bash
curl -X POST https://api.hotel.com/api/private/habitaciones \
  -H "Authorization: Bearer <token>" \
  -F "nro_habitacion=301" \
  -F "tipo_habitacion_id=123e4567-e89b-12d3-a456-426614174000" \
  -F "piso=3" \
  -F "feature=WiFi, aire acondicionado" \
  -F "amenities=TV, minibar, cafetera" \
  -F "estado=true" \
  -F "descripcion=Habitación con vista al mar" \
  -F "imagenes[]=@/path/to/room-photo.jpg"
```

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "message": "Habitación creada exitosamente",
  "data": {
    "id": "789e4567-e89b-12d3-a456-426614174000",
    "nro_habitacion": "301",
    "tipo_habitacion": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "nombre": "Suite Deluxe",
      "descripcion": "Suite de lujo con vista panorámica al mar"
    },
    "piso": 3,
    "feature": "WiFi, aire acondicionado",
    "amenities": "TV, minibar, cafetera",
    "url_imagen": ["https://example.com/rooms/301-1.jpg", "https://example.com/rooms/301-2.jpg"],
    "estado": true,
    "descripcion": "Habitación con vista al mar",
    "created_at": "2026-03-17T15:00:00.000Z",
    "updated_at": "2026-03-17T15:00:00.000Z"
  },
  "timestamp": 1710687600000
}
```

**Errores:**

- `400`: Datos de entrada inválidos

```json
{
  "success": false,
  "message": "Error de validacion en cuerpo: nro_habitacion",
  "data": null,
  "timestamp": 1710687600000
}
```

- `401`: No autenticado

```json
{
  "success": false,
  "message": "No autorizado",
  "data": null,
  "timestamp": 1710687600000
}
```

- `404`: Tipo de habitación no encontrado

```json
{
  "success": false,
  "message": "Tipo de habitación no encontrado",
  "data": null,
  "timestamp": 1710687600000
}
```

- `409`: Número de habitación duplicado

```json
{
  "success": false,
  "message": "Ya existe una habitación con ese número",
  "data": null,
  "timestamp": 1710687600000
}
```

---

### 6. Actualizar Habitación (Completo)

Actualiza los datos completos de una habitación existente. Soporta gestión de imágenes mediante `multipart/form-data`.

**Endpoint:** `PUT /api/private/habitaciones/:id`

**Permisos:** Usuario autenticado

**Parámetros de ruta:**

- `id` (UUID, requerido): ID de la habitación

**Body (`multipart/form-data`):**

| Campo                  | Tipo             | Requerido | Descripción                                                                   |
| ---------------------- | ---------------- | --------- | ----------------------------------------------------------------------------- |
| `nro_habitacion`       | string           | No        | Número de habitación (máx. 10 caracteres)                                     |
| `tipo_habitacion_id`   | UUID             | No        | ID del tipo de habitación                                                     |
| `piso`                 | number           | No        | Número de piso (entero positivo)                                              |
| `feature`              | string           | No        | Características principales de la habitación                                  |
| `amenities`            | string           | No        | Comodidades adicionales (separadas por coma)                                  |
| `estado`               | boolean          | No        | Estado de la habitación (`true` = activa, `false` = inactiva)                 |
| `descripcion`          | string           | No        | Descripción o notas adicionales                                               |
| `imagenes_existentes[]` | array de strings | No        | URLs de imágenes actuales que se desean **conservar**                         |
| `imagenes[]`           | archivos         | No        | Archivos de imagen **nuevos** a subir                                         |

**Gestión de imágenes:**

- El backend obtiene las URLs actuales de la base de datos y las compara con `imagenes_existentes[]`.
- Las URLs que estaban en la DB pero **no** aparecen en `imagenes_existentes[]` se eliminan de S3.
- Los archivos enviados en `imagenes[]` se suben a S3 y se agregan al resultado.
- `url_imagen` final = `[...imagenes_existentes[], ...urls_nuevas]`.
- Si **no se envía** `imagenes_existentes[]`, las imágenes actuales **se mantienen sin cambios**.
- Si se envía `imagenes_existentes[]` (aunque sea array vacío), se aplica la lógica de sincronización.
- Si no se envía `imagenes[]`, no se sube nada nuevo.

**Ejemplo (curl):**

```bash
curl -X PUT https://api.hotel.com/api/private/habitaciones/789e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer <token>" \
  -F "nro_habitacion=301-A" \
  -F "piso=3" \
  -F "feature=WiFi, aire acondicionado" \
  -F "amenities=TV, minibar, cafetera" \
  -F "estado=false" \
  -F "descripcion=Reparación de aire acondicionado" \
  -F "imagenes_existentes[]=https://example.com/rooms/301-1.jpg" \
  -F "imagenes[]=@/path/to/new-photo.jpg"
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Habitación actualizada exitosamente",
  "data": {
    "id": "789e4567-e89b-12d3-a456-426614174000",
    "nro_habitacion": "301-A",
    "tipo_habitacion": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "nombre": "Suite Deluxe",
      "descripcion": "Suite de lujo con vista panorámica al mar"
    },
    "piso": 3,
    "feature": "WiFi, aire acondicionado",
    "amenities": "TV, minibar, cafetera",
    "url_imagen": [
      "https://example.com/rooms/301-1.jpg",
      "https://example.com/rooms/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg"
    ],
    "estado": false,
    "descripcion": "Reparación de aire acondicionado programada",
    "created_at": "2026-03-15T10:00:00.000Z",
    "updated_at": "2026-03-17T16:00:00.000Z"
  },
  "timestamp": 1710691200000
}
```

**Errores:**

- `400`: Datos de entrada inválidos
- `401`: No autenticado
- `404`: Habitación o tipo de habitación no encontrado

```json
{
  "success": false,
  "message": "Habitación no encontrada",
  "data": null,
  "timestamp": 1710691200000
}
```

- `409`: Número de habitación duplicado

```json
{
  "success": false,
  "message": "Ya existe una habitación con ese número",
  "data": null,
  "timestamp": 1710691200000
}
```

**Notas:**

- Solo se actualizan los campos proporcionados en el body
- El campo `updated_at` se actualiza automáticamente
- Las imágenes eliminadas de la DB se eliminan automáticamente de S3

---

### 7. Actualizar Estado de Habitación

Actualiza únicamente el estado booleano de una habitación.

**Endpoint:** `PATCH /api/private/habitaciones/:id/estado`

**Permisos:** Usuario autenticado

**Parámetros de ruta:**

- `id` (UUID, requerido): ID de la habitación

**Body (JSON):**

```json
{
  "estado": true
}
```

**Campos:**

- `estado` (boolean, requerido): Nuevo estado de la habitación (`true` = activa, `false` = inactiva)

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Estado de habitación actualizado exitosamente",
  "data": {
    "id": "789e4567-e89b-12d3-a456-426614174000",
    "nro_habitacion": "301",
    "tipo_habitacion": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "nombre": "Suite Deluxe",
      "descripcion": "Suite de lujo con vista panorámica al mar"
    },
    "piso": 3,
    "feature": "WiFi, aire acondicionado",
    "amenities": "TV, minibar, cafetera",
    "url_imagen": ["https://example.com/rooms/301.jpg"],
    "estado": true,
    "descripcion": "Habitación con vista al mar",
    "created_at": "2026-03-15T10:00:00.000Z",
    "updated_at": "2026-03-17T17:00:00.000Z"
  },
  "timestamp": 1710694800000
}
```

**Errores:**

- `400`: Datos de entrada inválidos

```json
{
  "success": false,
  "message": "Error de validacion en cuerpo: estado",
  "data": null,
  "timestamp": 1710694800000
}
```

- `401`: No autenticado

```json
{
  "success": false,
  "message": "No autorizado",
  "data": null,
  "timestamp": 1710694800000
}
```

- `404`: Habitación no encontrada

```json
{
  "success": false,
  "message": "Habitación no encontrada",
  "data": null,
  "timestamp": 1710694800000
}
```

**Notas:**

- Solo actualiza el campo `estado`, no modifica otros datos de la habitación
- El campo `updated_at` se actualiza automáticamente

---

### 8. Eliminar Habitación

Elimina una habitación del sistema.

**Endpoint:** `DELETE /api/private/habitaciones/:id`

**Permisos:** Usuario autenticado

**Parámetros de ruta:**

- `id` (UUID, requerido): ID de la habitación

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Habitación eliminada exitosamente",
  "data": null,
  "timestamp": 1710694800000
}
```

**Errores:**

- `401`: No autenticado
- `404`: Habitación no encontrada

```json
{
  "success": false,
  "message": "Habitación no encontrada",
  "data": null,
  "timestamp": 1710694800000
}
```

- `409`: No se puede eliminar porque está en uso

```json
{
  "success": false,
  "message": "No se puede eliminar la habitación porque tiene registros relacionados",
  "data": null,
  "timestamp": 1710694800000
}
```

**Notas:**

- No se puede eliminar una habitación si tiene registros relacionados (estancias, reservas, etc.)
- Esta validación protege la integridad referencial de los datos

---

## Códigos de Error

| Código | Descripción                                                 |
| ------ | ----------------------------------------------------------- |
| 400    | Datos de entrada inválidos (validación de Zod)              |
| 401    | No autenticado (sesión inválida o inexistente)              |
| 404    | Habitación o tipo de habitación no encontrado               |
| 409    | Conflicto (número duplicado o tiene registros relacionados) |
| 500    | Error interno del servidor                                  |

---

## Validaciones

### Campo `nro_habitacion`

- **Requerido**: Sí
- **Tipo**: String
- **Longitud mínima**: 1 carácter
- **Longitud máxima**: 10 caracteres
- **Único**: Sí (no puede haber dos habitaciones con el mismo número)
- **Ejemplo**: "101", "202", "301-A", "SUITE-01"

### Campo `tipo_habitacion_id`

- **Requerido**: Sí
- **Tipo**: UUID
- **Validación**: Debe corresponder a un tipo de habitación existente
- **Ejemplo**: "123e4567-e89b-12d3-a456-426614174000"

### Campo `piso`

- **Requerido**: Sí
- **Tipo**: Number (entero)
- **Validación**: Debe ser un número positivo
- **Ejemplo**: 1, 2, 3, 10

### Campo `feature`

- **Requerido**: No
- **Tipo**: String
- **Descripción**: Características principales de la habitación (ej. "WiFi, aire acondicionado")

### Campo `amenities`

- **Requerido**: No
- **Tipo**: String
- **Descripción**: Comodidades adicionales separadas por coma (ej. "TV, minibar, cafetera")

### Campo `url_imagen`

- **Requerido**: No
- **Tipo**: Array de strings o `null`
- **Descripción**: URLs de imágenes subidas a S3; se gestiona mediante `multipart/form-data` en creación/actualización

### Campo `estado`

- **Requerido**: No (default: `false`)
- **Tipo**: Boolean
- **Valores**: `true` (activa) o `false` (inactiva)

### Campo `descripcion`

- **Requerido**: No
- **Tipo**: String
- **Longitud máxima**: Sin límite
- **Ejemplo**: "Suite con vista al mar", "Aire acondicionado en reparación"

---

## Notas

- Las habitaciones representan las unidades físicas del hotel con número y ubicación específicos
- Cada habitación está asociada a un tipo de habitación que define sus características
- Los campos `feature` y `amenities` permiten especificar características y comodidades de cada habitación individual
- El campo `estado` es booleano: `true` indica habitación activa/disponible, `false` indica inactiva
- El campo `descripcion` permite almacenar información adicional o notas del personal
- El campo `url_imagen` es un array que permite almacenar múltiples imágenes de la habitación
- Creación (POST) y actualización (PUT) aceptan `multipart/form-data`: en la actualización, se envían las URLs existentes a conservar en `imagenes_existentes[]` y los archivos nuevos en `imagenes[]`. Las URLs no incluidas se eliminan de S3 automáticamente.
- Los campos `created_at` y `updated_at` se gestionan automáticamente por el sistema
- No se puede eliminar una habitación si tiene registros relacionados
- Todas las rutas privadas requieren autenticación mediante sesión Better Auth (no hay restricción por rol)
- Los endpoints de detalle por ID (`GET /api/private/habitaciones/:id` y `GET /api/public/habitaciones/:id`) incluyen el array `muebles` con los muebles asociados a la habitación

---

## Ejemplos de Uso

### Crear una habitación con imágenes

```bash
curl -X POST https://api.hotel.com/api/private/habitaciones \
  -H "Authorization: Bearer <token>" \
  -F "nro_habitacion=301" \
  -F "tipo_habitacion_id=123e4567-e89b-12d3-a456-426614174000" \
  -F "piso=3" \
  -F "feature=WiFi, aire acondicionado" \
  -F "amenities=TV, minibar, cafetera" \
  -F "estado=true" \
  -F "descripcion=Habitación con vista al mar" \
  -F "imagenes[]=@/path/to/room1.jpg" \
  -F "imagenes[]=@/path/to/room2.jpg"
```

### Crear una habitación sin imágenes

```bash
curl -X POST https://api.hotel.com/api/private/habitaciones \
  -H "Authorization: Bearer <token>" \
  -F "nro_habitacion=101" \
  -F "tipo_habitacion_id=123e4567-e89b-12d3-a456-426614174000" \
  -F "piso=1" \
  -F "feature=WiFi" \
  -F "amenities=TV"
```

### Listar todas las habitaciones (paginado)

```bash
curl -X GET "https://api.hotel.com/api/private/habitaciones?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### Listar habitaciones filtradas por tipo

```bash
curl -X GET "https://api.hotel.com/api/private/habitaciones?page=1&limit=10&tipo=suite" \
  -H "Authorization: Bearer <token>"
```

### Obtener habitación con fechas de reserva

```bash
curl -X GET "https://api.hotel.com/api/private/habitaciones/789e4567-e89b-12d3-a456-426614174000" \
  -H "Authorization: Bearer <token>"
```

### Obtener habitación filtrando estados de reserva específicos

```bash
curl -X GET "https://api.hotel.com/api/private/habitaciones/789e4567-e89b-12d3-a456-426614174000?tipo_reserva=TENTATIVA,CONFIRMADA" \
  -H "Authorization: Bearer <token>"
```

### Actualizar estado (recepción)

```bash
curl -X PATCH https://api.hotel.com/api/private/habitaciones/789e4567-e89b-12d3-a456-426614174000/estado \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "estado": true
  }'
```

### Actualización completa de habitación

```bash
curl -X PUT https://api.hotel.com/api/private/habitaciones/789e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer <token>" \
  -F "nro_habitacion=301-A" \
  -F "piso=3" \
  -F "feature=WiFi, aire acondicionado" \
  -F "amenities=TV, minibar, cafetera" \
  -F "estado=false" \
  -F "descripcion=Reparación de aire acondicionado" \
  -F "imagenes_existentes[]=https://example.com/rooms/301-1.jpg" \
  -F "imagenes[]=@/path/to/new-image.jpg"
```

### Buscar habitaciones disponibles (público)

```bash
curl -X GET "https://api.hotel.com/api/public/habitaciones?fecha_inicio=2026-04-01T00:00:00.000Z&fecha_fin=2026-04-05T00:00:00.000Z&orden_precio=asc"
```

### Obtener habitación con precio (público)

```bash
curl -X GET "https://api.hotel.com/api/public/habitaciones/789e4567-e89b-12d3-a456-426614174000"
```

### Eliminar una habitación

```bash
curl -X DELETE https://api.hotel.com/api/private/habitaciones/789e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer <token>"
```
