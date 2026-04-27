# API de Internacionalización de Habitaciones

Documentación del módulo `internacionalizacion.routes.ts` (CRUD de traducciones para habitaciones).

## Base URL

| Prefijo | Uso |
| ------- | --- |
| `/api/private/internacionalizaciones` | CRUD (requiere sesión Better Auth + rol ADMIN) |

## Autenticación

- **Requiere:** sesión Better Auth válida + rol `admin`
- Todas las rutas están bajo el prefijo privado

## Endpoints

### 1. Obtener Internacionalización por ID de Habitación

Obtiene las traducciones asociadas a una habitación.

**Endpoint:** `GET /api/private/internacionalizaciones/:habitacionId`

**Permisos:** Usuario autenticado con rol admin

**Parámetros de ruta:**

- `habitacionId` (UUID, requerido): ID de la habitación

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Internacionalización encontrada",
  "data": {
    "id": "int-uuid-1",
    "habitacion": {
      "id": "habitacion-uuid-1",
      "nro_habitacion": "101"
    },
    "descripcion_en": "Room with ocean view",
    "descripcion_fr": "Chambre avec vue sur l'océan",
    "feature_en": "WiFi, air conditioning",
    "feature_fr": "WiFi, climatisation",
    "amenities_en": "TV, minibar, coffee maker",
    "amenities_fr": "TV, minibar, machine à café",
    "created_at": "2026-03-15T10:00:00.000Z",
    "updated_at": "2026-03-17T08:00:00.000Z"
  },
  "timestamp": 1710684600000
}
```

**Errores:**

- `401`: No autenticado

```json
{
  "success": false,
  "message": "No autorizado",
  "data": null,
  "timestamp": 1710684600000
}
```

- `403`: Sin permisos (no es admin)

```json
{
  "success": false,
  "message": "Acceso denegado",
  "data": null,
  "timestamp": 1710684600000
}
```

- `404`: Internacionalización no encontrada

```json
{
  "success": false,
  "message": "Internacionalización no encontrada para esta habitación",
  "data": null,
  "timestamp": 1710684600000
}
```

---

### 2. Crear Internacionalización

Crea las traducciones para una habitación existente.

**Endpoint:** `POST /api/private/internacionalizaciones/:habitacionId`

**Permisos:** Usuario autenticado con rol admin

**Parámetros de ruta:**

- `habitacionId` (UUID, requerido): ID de la habitación

**Body (JSON):**

| Campo            | Tipo   | Requerido | Descripción                           |
| ---------------- | ------ | --------- | ------------------------------------- |
| `descripcion_en` | string | No        | Descripción en inglés                 |
| `descripcion_fr` | string | No        | Descripción en francés                |
| `feature_en`     | string | No        | Características en inglés             |
| `feature_fr`     | string | No        | Características en francés            |
| `amenities_en`   | string | No        | Comodidades en inglés                 |
| `amenities_fr`   | string | No        | Comodidades en francés                |

**Ejemplo (curl):**

```bash
curl -X POST https://api.hotel.com/api/private/internacionalizaciones/789e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "descripcion_en": "Room with ocean view",
    "descripcion_fr": "Chambre avec vue sur l'océan",
    "feature_en": "WiFi, air conditioning",
    "feature_fr": "WiFi, climatisation",
    "amenities_en": "TV, minibar, coffee maker",
    "amenities_fr": "TV, minibar, machine à café"
  }'
```

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "message": "Internacionalización creada exitosamente",
  "data": {
    "id": "int-uuid-1",
    "habitacion": {
      "id": "789e4567-e89b-12d3-a456-426614174000",
      "nro_habitacion": "301"
    },
    "descripcion_en": "Room with ocean view",
    "descripcion_fr": "Chambre avec vue sur l'océan",
    "feature_en": "WiFi, air conditioning",
    "feature_fr": "WiFi, climatisation",
    "amenities_en": "TV, minibar, coffee maker",
    "amenities_fr": "TV, minibar, machine à café",
    "created_at": "2026-03-17T15:00:00.000Z",
    "updated_at": "2026-03-17T15:00:00.000Z"
  },
  "timestamp": 1710687600000
}
```

**Notas:**

- La internacionalización se crea automáticamente al crear una habitación
- Este endpoint es para crear traducciones iniciales o agregar nuevas traducciones

---

### 3. Actualizar Internacionalización

Actualiza las traducciones de una habitación existente.

**Endpoint:** `PUT /api/private/internacionalizaciones/:habitacionId`

**Permisos:** Usuario autenticado con rol admin

**Parámetros de ruta:**

- `habitacionId` (UUID, requerido): ID de la habitación

**Body (JSON):**

| Campo            | Tipo   | Requerido | Descripción                           |
| ---------------- | ------ | --------- | ------------------------------------- |
| `descripcion_en` | string | No        | Descripción en inglés (null para borrar) |
| `descripcion_fr` | string | No        | Descripción en francés (null para borrar) |
| `feature_en`     | string | No        | Características en inglés (null para borrar) |
| `feature_fr`     | string | No        | Características en francés (null para borrar) |
| `amenities_en`   | string | No        | Comodidades en inglés (null para borrar) |
| `amenities_fr`   | string | No        | Comodidades en francés (null para borrar) |

**Ejemplo (curl):**

```bash
curl -X PUT https://api.hotel.com/api/private/internacionalizaciones/789e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "descripcion_en": "Luxury ocean view room",
    "amenities_en": "TV, minibar, coffee maker, jacuzzi"
  }'
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Internacionalización actualizada exitosamente",
  "data": {
    "id": "int-uuid-1",
    "habitacion": {
      "id": "789e4567-e89b-12d3-a456-426614174000",
      "nro_habitacion": "301"
    },
    "descripcion_en": "Luxury ocean view room",
    "descripcion_fr": "Chambre avec vue sur l'océan",
    "feature_en": "WiFi, air conditioning",
    "feature_fr": "WiFi, climatisation",
    "amenities_en": "TV, minibar, coffee maker, jacuzzi",
    "amenities_fr": "TV, minibar, machine à café",
    "created_at": "2026-03-15T10:00:00.000Z",
    "updated_at": "2026-03-17T16:00:00.000Z"
  },
  "timestamp": 1710691200000
}
```

**Notas:**

- Enviar `null` en un campo lo limpia (elimina el valor)
- Solo se actualizan los campos proporcionados

---

### 4. Eliminar Internacionalización

Elimina las traducciones de una habitación.

**Endpoint:** `DELETE /api/private/internacionalizaciones/:habitacionId`

**Permisos:** Usuario autenticado con rol admin

**Parámetros de ruta:**

- `habitacionId` (UUID, requerido): ID de la habitación

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Internacionalización eliminada exitosamente",
  "data": null,
  "timestamp": 1710694800000
}
```

**Notas:**

- Al eliminar una habitación, su internacionalización se elimina automáticamente (CASCADE)

---

## Códigos de Error

| Código | Descripción                              |
| ------ | ---------------------------------------- |
| 400    | Datos de entrada inválidos               |
| 401    | No autenticado (sesión inválida)         |
| 403    | Sin permisos (no es admin)               |
| 404    | Internacionalización no encontrada      |
| 409    | Conflicto (ya existe para esta habitación) |
| 500    | Error interno del servidor               |

---

## Notas

- Cada habitación tiene una relación uno a uno con Internacionalización
- Al crear una habitación, se crea automáticamente un registro de internacionalización vacío
- El campo `locale` en las rutas públicas determina qué textos devolver:
  - `es` (default): devuelve `descripcion`, `feature`, `amenities` de la tabla `habitacion`
  - `en`: devuelve `descripcionEn`, `featureEn`, `amenitiesEn` de la tabla `internacionalizacion`
  - `fr`: devuelve `descripcionFr`, `featureFr`, `amenitiesFr` de la tabla `internacionalizacion`
- Si no hay traducción para un locale, se cae al valor en español de la habitación