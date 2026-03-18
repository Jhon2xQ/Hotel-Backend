# API de Catálogo de Muebles

Documentación de los endpoints para gestionar el catálogo de muebles del hotel.

## Base URL

```
/api/catalogo-muebles
```

## Autenticación

Todos los endpoints requieren autenticación mediante sesión de Better Auth.

## Endpoints

### 1. Listar Muebles

Obtiene la lista completa de muebles del catálogo.

**Endpoint:** `GET /api/catalogo-muebles`

**Permisos:** Usuario autenticado

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Muebles obtenidos exitosamente",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "codigo": "CAMA-KING-01",
      "nombre": "Cama King Size",
      "categoria": "CAMA",
      "imagen_url": "https://example.com/images/cama-king.jpg",
      "tipo": "King Size",
      "condicion": "BUENO",
      "fecha_adquisicion": "2025-01-15",
      "ultima_revision": "2026-03-01",
      "descripcion": "Cama king size con colchón ortopédico",
      "created_at": "2026-03-17T10:00:00.000Z",
      "updated_at": "2026-03-17T10:00:00.000Z"
    }
  ],
  "timestamp": 1710669600000
}
```

---

### 2. Obtener Mueble por ID

Obtiene los detalles de un mueble específico.

**Endpoint:** `GET /api/catalogo-muebles/:id`

**Permisos:** Usuario autenticado

**Parámetros de ruta:**

- `id` (UUID, requerido): ID del mueble

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Mueble encontrado",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "codigo": "CAMA-KING-01",
    "nombre": "Cama King Size",
    "categoria": "CAMA",
    "imagen_url": "https://example.com/images/cama-king.jpg",
    "tipo": "King Size",
    "condicion": "BUENO",
    "fecha_adquisicion": "2025-01-15",
    "ultima_revision": "2026-03-01",
    "descripcion": "Cama king size con colchón ortopédico",
    "created_at": "2026-03-17T10:00:00.000Z",
    "updated_at": "2026-03-17T10:00:00.000Z"
  },
  "timestamp": 1710669600000
}
```

**Errores:**

- `404`: Mueble no encontrado

---

### 3. Crear Mueble

Crea un nuevo mueble en el catálogo.

**Endpoint:** `POST /api/catalogo-muebles`

**Permisos:** ADMIN

**Body (JSON):**

```json
{
  "codigo": "CAMA-KING-01",
  "nombre": "Cama King Size",
  "categoria": "CAMA",
  "imagen_url": "https://example.com/images/cama-king.jpg",
  "tipo": "King Size",
  "condicion": "BUENO",
  "fecha_adquisicion": "2025-01-15",
  "ultima_revision": "2026-03-01",
  "descripcion": "Cama king size con colchón ortopédico"
}
```

**Campos:**

- `codigo` (string, requerido): Código único del mueble (máx. 30 caracteres)
- `nombre` (string, requerido): Nombre del mueble (máx. 100 caracteres)
- `categoria` (enum, requerido): Categoría del mueble
  - Valores: `CAMA`, `ASIENTO`, `ALMACENAJE`, `TECNOLOGIA`, `BANO`, `DECORACION`, `OTRO`
- `imagen_url` (string, opcional): URL de la imagen del mueble (debe ser una URL válida)
- `tipo` (string, opcional): Tipo específico del mueble (máx. 60 caracteres)
- `condicion` (enum, opcional): Estado físico del mueble (default: `BUENO`)
  - Valores: `BUENO`, `REGULAR`, `DANADO`, `FALTANTE`
- `fecha_adquisicion` (string, opcional): Fecha de adquisición en formato YYYY-MM-DD
- `ultima_revision` (string, opcional): Fecha de última revisión en formato YYYY-MM-DD
- `descripcion` (string, opcional): Descripción del mueble

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "message": "Mueble creado exitosamente",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "codigo": "CAMA-KING-01",
    "nombre": "Cama King Size",
    "categoria": "CAMA",
    "imagen_url": "https://example.com/images/cama-king.jpg",
    "tipo": "King Size",
    "condicion": "BUENO",
    "fecha_adquisicion": "2025-01-15",
    "ultima_revision": "2026-03-01",
    "descripcion": "Cama king size con colchón ortopédico",
    "created_at": "2026-03-17T10:00:00.000Z",
    "updated_at": "2026-03-17T10:00:00.000Z"
  },
  "timestamp": 1710669600000
}
```

**Errores:**

- `409`: Ya existe un mueble con ese código
- `400`: Datos de entrada inválidos

---

### 4. Actualizar Mueble

Actualiza los datos de un mueble existente.

**Endpoint:** `PUT /api/catalogo-muebles/:id`

**Permisos:** ADMIN

**Parámetros de ruta:**

- `id` (UUID, requerido): ID del mueble

**Body (JSON):**

```json
{
  "codigo": "CAMA-KING-02",
  "nombre": "Cama King Size Premium",
  "categoria": "CAMA",
  "imagen_url": "https://example.com/images/cama-king-premium.jpg",
  "tipo": "King Size Premium",
  "condicion": "BUENO",
  "fecha_adquisicion": "2025-02-20",
  "ultima_revision": "2026-03-10",
  "descripcion": "Cama king size premium con colchón memory foam"
}
```

**Campos:** Todos opcionales, mismas validaciones que en crear

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Mueble actualizado exitosamente",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "codigo": "CAMA-KING-02",
    "nombre": "Cama King Size Premium",
    "categoria": "CAMA",
    "imagen_url": "https://example.com/images/cama-king-premium.jpg",
    "tipo": "King Size Premium",
    "condicion": "BUENO",
    "fecha_adquisicion": "2025-02-20",
    "ultima_revision": "2026-03-10",
    "descripcion": "Cama king size premium con colchón memory foam",
    "created_at": "2026-03-17T10:00:00.000Z",
    "updated_at": "2026-03-17T12:00:00.000Z"
  },
  "timestamp": 1710676800000
}
```

**Errores:**

- `404`: Mueble no encontrado
- `409`: Ya existe otro mueble con ese código
- `400`: Datos de entrada inválidos

---

### 5. Eliminar Mueble

Elimina un mueble del catálogo.

**Endpoint:** `DELETE /api/catalogo-muebles/:id`

**Permisos:** ADMIN

**Parámetros de ruta:**

- `id` (UUID, requerido): ID del mueble

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Mueble eliminado exitosamente",
  "data": null,
  "timestamp": 1710669600000
}
```

**Errores:**

- `404`: Mueble no encontrado
- `409`: No se puede eliminar porque está en uso (relaciones con habitaciones)

---

## Categorías de Muebles

| Categoría  | Descripción                                  |
| ---------- | -------------------------------------------- |
| CAMA       | Camas de todos los tipos y tamaños           |
| ASIENTO    | Sillas, sillones, sofás                      |
| ALMACENAJE | Armarios, closets, cajoneras, mesas de noche |
| TECNOLOGIA | TV, minibar, caja fuerte, teléfono           |
| BANO       | Tina, jacuzzi, secador de pelo               |
| DECORACION | Cuadros, lámparas, espejos, plantas          |
| OTRO       | Otros muebles no clasificados                |

---

## Condiciones de Muebles

| Condición | Descripción                                      |
| --------- | ------------------------------------------------ |
| BUENO     | Mueble en buen estado, funcional y presentable   |
| REGULAR   | Mueble con desgaste visible pero funcional       |
| DANADO    | Mueble con daños que requieren reparación        |
| FALTANTE  | Mueble registrado pero no disponible físicamente |

---

## Códigos de Error

| Código | Descripción                           |
| ------ | ------------------------------------- |
| 400    | Datos de entrada inválidos            |
| 401    | No autenticado                        |
| 403    | No autorizado (requiere rol ADMIN)    |
| 404    | Mueble no encontrado                  |
| 409    | Conflicto (código duplicado o en uso) |
| 500    | Error interno del servidor            |

---

## Notas

- El campo `codigo` debe ser único en todo el catálogo
- Los muebles no se pueden eliminar si están asignados a habitaciones o tipos de habitación
- La categoría determina cómo se agrupa el mueble en reportes e inventarios
- La condición por defecto es `BUENO` al crear un mueble
- Las fechas deben estar en formato ISO (YYYY-MM-DD)
- La `imagen_url` debe ser una URL válida si se proporciona
- El campo `tipo` permite especificar variantes dentro de una categoría (ej: "King Size", "Queen Size" para camas)
