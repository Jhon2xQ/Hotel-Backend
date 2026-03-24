# API de Habitaciones Disponibles

## Endpoints de Habitaciones Disponibles

### 1. `GET /api/habitaciones/disponibles`

Busca habitaciones aplicando filtros opcionales por tipo de habitación, rango de fechas y ordenamiento por precio. Siempre devuelve el precio de la tarifa del canal DIRECTO.

### 2. `GET /api/habitaciones/disponibles/:id`

Obtiene una habitación específica con su precio de tarifa del canal DIRECTO.

---

## Autenticación

**Ambos endpoints son públicos y NO requieren autenticación.**

---

## Endpoint 1: Búsqueda con Filtros

### `GET /api/habitaciones/disponibles`

### Query Parameters (Todos opcionales)

| Parámetro      | Tipo     | Descripción                                                                |
| -------------- | -------- | -------------------------------------------------------------------------- |
| `tipo`         | `string` | Nombre del tipo de habitación (búsqueda parcial, case-insensitive)         |
| `fecha_inicio` | `string` | Fecha de inicio del rango en formato ISO 8601 (ej: `2026-03-25T00:00:00Z`) |
| `fecha_fin`    | `string` | Fecha de fin del rango en formato ISO 8601 (ej: `2026-03-30T00:00:00Z`)    |
| `orden_precio` | `string` | Ordenamiento por precio: `asc` (ascendente) o `desc` (descendente)         |

### Validaciones

- Si se proporciona `fecha_inicio` y `fecha_fin`, ambas deben ser fechas ISO válidas
- `fecha_inicio` debe ser anterior a `fecha_fin`
- `orden_precio` solo acepta los valores `asc` o `desc`

### Lógica de Filtrado

#### Sin Filtros

- Devuelve **todas las habitaciones** de la tabla con su precio de tarifa canal DIRECTO

#### Filtro por Tipo

- Busca habitaciones cuyo tipo contenga el texto proporcionado (case-insensitive)
- Ejemplo: `tipo=suite` encontrará "Suite Deluxe", "Suite Ejecutiva", etc.
- Devuelve todas las habitaciones de ese tipo con su precio

#### Filtro por Disponibilidad (Rango de Fechas)

- Excluye habitaciones que tengan reservas **CONFIRMADA** o **EN_CASA** que intersecten con el rango solicitado
- **Ignora** reservas con estado: `TENTATIVA`, `COMPLETADA`, `CANCELADA`, `NO_LLEGO`
- Una habitación está ocupada si existe al menos una reserva activa que:
  - Comienza antes o durante el rango solicitado Y termina después del inicio
  - Comienza durante el rango solicitado Y termina después o durante el rango
  - Está completamente contenida dentro del rango solicitado
- Puede combinarse con filtro por tipo

#### Ordenamiento por Precio

- Si se especifica `orden_precio`, las habitaciones se ordenan por el precio de la tarifa del canal DIRECTO
- El precio se obtiene de la relación: `Habitacion → TipoHabitacion → Tarifa (canal DIRECTO)`
- Si no hay tarifa disponible para el canal DIRECTO, `precio_noche` será `null` y aparecerá al final del listado

### Respuesta Exitosa

**Código:** `200 OK`

```json
{
  "success": true,
  "message": "Habitaciones disponibles obtenidas exitosamente",
  "data": [
    {
      "habitacion": {
        "id": "uuid",
        "nro_habitacion": "301",
        "tipo_habitacion_id": "uuid",
        "tipo": {
          "id": "uuid",
          "nombre": "Suite Deluxe",
          "descripcion": "Suite de lujo con vista al mar"
        },
        "piso": 3,
        "tiene_ducha": true,
        "tiene_banio": true,
        "url_imagen": ["https://example.com/imagen1.jpg"],
        "estado": "DISPONIBLE",
        "notas": null,
        "ulti_limpieza": "2026-03-24T10:00:00Z",
        "created_at": "2026-01-15T08:00:00Z",
        "updated_at": "2026-03-24T10:00:00Z"
      },
      "precio_noche": 150.0
    }
  ],
  "timestamp": 1711267200000
}
```

### Ejemplos de Uso

#### 1. Buscar todas las habitaciones (sin filtros)

```bash
GET /api/habitaciones/disponibles
```

Devuelve todas las habitaciones con su precio de tarifa canal DIRECTO.

#### 2. Buscar habitaciones tipo "Suite"

```bash
GET /api/habitaciones/disponibles?tipo=suite
```

Devuelve todas las habitaciones cuyo tipo contenga "suite".

#### 3. Buscar habitaciones disponibles en un rango de fechas

```bash
GET /api/habitaciones/disponibles?fecha_inicio=2026-03-25T00:00:00Z&fecha_fin=2026-03-30T00:00:00Z
```

Devuelve habitaciones que NO tengan reservas confirmadas o en casa que intersecten con el rango.

#### 4. Buscar habitaciones tipo "Doble" disponibles en un rango, ordenadas por precio ascendente

```bash
GET /api/habitaciones/disponibles?tipo=doble&fecha_inicio=2026-04-01T00:00:00Z&fecha_fin=2026-04-05T00:00:00Z&orden_precio=asc
```

#### 5. Buscar todas las habitaciones ordenadas por precio descendente

```bash
GET /api/habitaciones/disponibles?orden_precio=desc
```

---

## Endpoint 2: Habitación por ID

### `GET /api/habitaciones/disponibles/:id`

### Parámetros de Ruta

| Parámetro | Tipo   | Descripción               | Requerido |
| --------- | ------ | ------------------------- | --------- |
| `id`      | `UUID` | ID único de la habitación | Sí        |

### Respuesta Exitosa

**Código:** `200 OK`

```json
{
  "success": true,
  "message": "Habitación con precio obtenida exitosamente",
  "data": {
    "habitacion": {
      "id": "uuid",
      "nro_habitacion": "301",
      "tipo_habitacion_id": "uuid",
      "tipo": {
        "id": "uuid",
        "nombre": "Suite Deluxe",
        "descripcion": "Suite de lujo con vista al mar"
      },
      "piso": 3,
      "tiene_ducha": true,
      "tiene_banio": true,
      "url_imagen": ["https://example.com/imagen1.jpg"],
      "estado": "DISPONIBLE",
      "notas": null,
      "ulti_limpieza": "2026-03-24T10:00:00Z",
      "created_at": "2026-01-15T08:00:00Z",
      "updated_at": "2026-03-24T10:00:00Z"
    },
    "precio_noche": 150.0
  },
  "timestamp": 1711267200000
}
```

### Ejemplo de Uso

```bash
GET /api/habitaciones/disponibles/550e8400-e29b-41d4-a716-446655440000
```

---

## Respuestas de Error

### Error de Validación (Endpoint 1)

**Código:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Error de validación en query: fecha_inicio: fecha_inicio debe ser una fecha ISO válida",
  "data": null,
  "timestamp": 1711267200000
}
```

### Habitación No Encontrada (Endpoint 2)

**Código:** `404 Not Found`

```json
{
  "success": false,
  "message": "Habitación no encontrada",
  "data": null,
  "timestamp": 1711267200000
}
```

### ID Inválido (Endpoint 2)

**Código:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Error de validación en parametro: id",
  "data": null,
  "timestamp": 1711267200000
}
```

---

## Notas Técnicas

### Generales

- **Endpoints públicos**: Ambos endpoints NO requieren autenticación
- **Precio siempre del canal DIRECTO**: Solo se consideran tarifas asociadas al canal con `tipo = "DIRECTO"`
- El campo `precio_noche` puede ser `null` si no hay tarifas configuradas para el canal DIRECTO
- La respuesta devuelve un objeto con dos propiedades: `habitacion` (objeto completo) y `precio_noche` (número o null)

### Endpoint 1 (Búsqueda con filtros)

- **Estados de reserva considerados**: Solo `CONFIRMADA` y `EN_CASA` bloquean disponibilidad
- **Estados ignorados**: `TENTATIVA`, `COMPLETADA`, `CANCELADA`, `NO_LLEGO` no afectan la disponibilidad
- La búsqueda por tipo es flexible y permite coincidencias parciales
- Todos los filtros son opcionales y se pueden combinar libremente
- El ordenamiento por precio se aplica después de obtener los resultados filtrados

### Endpoint 2 (Por ID)

- Este endpoint NO verifica disponibilidad por fechas, solo devuelve la habitación y su precio
- Para verificar disponibilidad en un rango de fechas, usar el Endpoint 1 con query params
- El ID debe ser un UUID válido

---

## Comparación de Endpoints

| Endpoint                                | Descripción                                                     | Autenticación |
| --------------------------------------- | --------------------------------------------------------------- | ------------- |
| `GET /api/habitaciones/:id`             | Devuelve solo la habitación sin precio                          | Requerida     |
| `GET /api/habitaciones/disponibles`     | Devuelve lista de habitaciones con filtros y precio             | No requerida  |
| `GET /api/habitaciones/disponibles/:id` | Devuelve una habitación específica con precio del canal DIRECTO | No requerida  |
