# API de Búsqueda de Habitaciones Disponibles

## Endpoint: Buscar Habitaciones Disponibles

### `GET /api/habitaciones/disponibles`

Busca habitaciones disponibles aplicando filtros opcionales por tipo de habitación, rango de fechas y ordenamiento por precio.

---

## Autenticación

Requiere autenticación mediante sesión válida (cookie de sesión).

---

## Query Parameters (Todos opcionales)

| Parámetro      | Tipo     | Descripción                                                                |
| -------------- | -------- | -------------------------------------------------------------------------- |
| `tipo`         | `string` | Nombre del tipo de habitación (búsqueda parcial, case-insensitive)         |
| `fecha_inicio` | `string` | Fecha de inicio del rango en formato ISO 8601 (ej: `2026-03-25T00:00:00Z`) |
| `fecha_fin`    | `string` | Fecha de fin del rango en formato ISO 8601 (ej: `2026-03-30T00:00:00Z`)    |
| `orden_precio` | `string` | Ordenamiento por precio: `asc` (ascendente) o `desc` (descendente)         |

---

## Validaciones

- Si se proporciona `fecha_inicio` y `fecha_fin`, ambas deben ser fechas ISO válidas
- `fecha_inicio` debe ser anterior a `fecha_fin`
- `orden_precio` solo acepta los valores `asc` o `desc`

---

## Lógica de Filtrado

### Filtro por Tipo

- Busca habitaciones cuyo tipo contenga el texto proporcionado (case-insensitive)
- Ejemplo: `tipo=suite` encontrará "Suite Deluxe", "Suite Ejecutiva", etc.

### Filtro por Disponibilidad (Rango de Fechas)

- Excluye habitaciones que tengan reservas **confirmadas** o **en casa** que se solapen con el rango solicitado
- Una habitación está ocupada si existe al menos una reserva que:
  - Comienza antes o durante el rango solicitado Y termina después del inicio
  - Comienza durante el rango solicitado Y termina después o durante el rango
  - Está completamente contenida dentro del rango solicitado

### Ordenamiento por Precio

- Si se especifica `orden_precio`, las habitaciones se ordenan por el precio de la tarifa más baja disponible
- El precio se obtiene de la tabla `tarifas` relacionada con el tipo de habitación
- Si no hay tarifa disponible, la habitación aparece al final del listado

---

## Respuesta Exitosa

**Código:** `200 OK`

```json
{
  "success": true,
  "message": "Habitaciones disponibles obtenidas exitosamente",
  "data": [
    {
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
      "updated_at": "2026-03-24T10:00:00Z",
      "precio_noche": 150.0
    }
  ],
  "timestamp": 1711267200000
}
```

---

## Respuestas de Error

### Error de Validación

**Código:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Error de validación en query: fecha_inicio: fecha_inicio debe ser una fecha ISO válida",
  "data": null,
  "timestamp": 1711267200000
}
```

### No Autorizado

**Código:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "No autorizado",
  "data": null,
  "timestamp": 1711267200000
}
```

---

## Ejemplos de Uso

### 1. Buscar todas las habitaciones disponibles

```bash
GET /api/habitaciones/disponibles
```

### 2. Buscar habitaciones tipo "Suite"

```bash
GET /api/habitaciones/disponibles?tipo=suite
```

### 3. Buscar habitaciones disponibles en un rango de fechas

```bash
GET /api/habitaciones/disponibles?fecha_inicio=2026-03-25T00:00:00Z&fecha_fin=2026-03-30T00:00:00Z
```

### 4. Buscar habitaciones tipo "Doble" disponibles en un rango, ordenadas por precio ascendente

```bash
GET /api/habitaciones/disponibles?tipo=doble&fecha_inicio=2026-04-01T00:00:00Z&fecha_fin=2026-04-05T00:00:00Z&orden_precio=asc
```

### 5. Buscar todas las habitaciones ordenadas por precio descendente

```bash
GET /api/habitaciones/disponibles?orden_precio=desc
```

---

## Notas Técnicas

- El endpoint considera solo reservas con estado `CONFIRMADA` o `EN_CASA` para determinar disponibilidad
- Reservas con estado `TENTATIVA`, `CANCELADA`, `COMPLETADA` o `NO_LLEGO` no afectan la disponibilidad
- El campo `precio_noche` puede ser `null` si no hay tarifas configuradas para ese tipo de habitación
- La búsqueda por tipo es flexible y permite coincidencias parciales
- Todos los filtros son opcionales y se pueden combinar libremente
