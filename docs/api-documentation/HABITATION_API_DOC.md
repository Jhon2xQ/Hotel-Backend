# Documentación API de Habitaciones

## Descripción General

Este documento describe los puntos finales (endpoints) de la API REST para administrar habitaciones de hotel. La API sigue principios de Arquitectura Limpia e implementa control de acceso basado en roles.

## URL Base

```
/api/habitaciones
```

## Autenticación

Todos los endpoints requieren autenticación mediante sesión de Better Auth. Incluye el token de sesión en los encabezados de la solicitud.

## Autorización

- **ADMIN**: Acceso completo CRUD
- **PERSONAL**: Acceso de lectura + actualizaciones de estado solamente

---

## Endpoints

### 1. Crear Habitación

Crea una nueva habitación de hotel.

**Endpoint:** `POST /api/habitaciones`

**Autorización:** Solo ADMIN

**Cuerpo de la Solicitud:**

```json
{
  "numero": "101",
  "piso": 1,
  "tipo": "ESTÁNDAR SIMPLE",
  "precio": 150.0
}
```

**Campos de la Solicitud:**

| Campo  | Tipo   | Requerido | Descripción                                                                      |
| ------ | ------ | --------- | -------------------------------------------------------------------------------- |
| numero | string | Sí        | Número de habitación (único)                                                     |
| piso   | number | Sí        | Número de piso (entero positivo)                                                 |
| tipo   | string | Sí        | Tipo de habitación: "ESTÁNDAR SIMPLE", "ESTÁNDAR DOBLE", "SUITE", "SUITE JUNIOR" |
| precio | number | No        | Precio por noche (decimal positivo con máximo 2 decimales)                       |

**Respuesta de Éxito (201):**

```json
{
  "success": true,
  "message": "Habitación creada exitosamente",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "numero": "101",
    "piso": 1,
    "tipo": "ESTÁNDAR SIMPLE",
    "precio": 150.0,
    "estado": "Disponible",
    "created_at": "2024-03-15T10:30:00.000Z",
    "updated_at": "2024-03-15T10:30:00.000Z"
  },
  "timestamp": 1710499800000
}
```

**Respuestas de Error:**

- `400 Bad Request`: Datos de entrada inválidos
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No es un usuario ADMIN
- `409 Conflict`: El número de habitación ya existe

---

### 2. Listar Todas las Habitaciones

Obtiene todas las habitaciones del hotel.

**Endpoint:** `GET /api/habitaciones`

**Autorización:** ADMIN o PERSONAL

**Respuesta de Éxito (200):**

```json
{
  "success": true,
  "message": "Habitaciones obtenidas exitosamente",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "numero": "101",
      "piso": 1,
      "tipo": "ESTÁNDAR SIMPLE",
      "precio": 150.0,
      "estado": "Disponible",
      "created_at": "2024-03-15T10:30:00.000Z",
      "updated_at": "2024-03-15T10:30:00.000Z"
    }
  ],
  "timestamp": 1710499800000
}
```

**Respuestas de Error:**

- `401 Unauthorized`: No autenticado

---

### 3. Obtener Habitación por ID

Obtiene una habitación de hotel específica por su ID.

**Endpoint:** `GET /api/habitaciones/:id`

**Autorización:** ADMIN o PERSONAL

**Parámetros de URL:**

| Parámetro | Tipo   | Descripción           |
| --------- | ------ | --------------------- |
| id        | string | UUID de la habitación |

**Respuesta de Éxito (200):**

```json
{
  "success": true,
  "message": "Habitación encontrada",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "numero": "101",
    "piso": 1,
    "tipo": "ESTÁNDAR SIMPLE",
    "precio": 150.0,
    "estado": "Disponible",
    "created_at": "2024-03-15T10:30:00.000Z",
    "updated_at": "2024-03-15T10:30:00.000Z"
  },
  "timestamp": 1710499800000
}
```

**Respuestas de Error:**

- `400 Bad Request`: Formato UUID inválido
- `401 Unauthorized`: No autenticado
- `404 Not Found`: Habitación no encontrada

---

### 4. Actualizar Habitación (Actualización Completa)

Actualiza todos los campos de una habitación de hotel.

**Endpoint:** `PUT /api/habitaciones/:id`

**Autorización:** Solo ADMIN

**Parámetros de URL:**

| Parámetro | Tipo   | Descripción           |
| --------- | ------ | --------------------- |
| id        | string | UUID de la habitación |

**Cuerpo de la Solicitud:**

```json
{
  "numero": "101A",
  "piso": 1,
  "tipo": "ESTÁNDAR DOBLE",
  "precio": 200.0,
  "estado": "Mantenimiento"
}
```

**Campos de la Solicitud:**

| Campo  | Tipo   | Requerido | Descripción                                                                      |
| ------ | ------ | --------- | -------------------------------------------------------------------------------- |
| numero | string | Sí        | Número de habitación (único)                                                     |
| piso   | number | Sí        | Número de piso (entero positivo)                                                 |
| tipo   | string | Sí        | Tipo de habitación: "ESTÁNDAR SIMPLE", "ESTÁNDAR DOBLE", "SUITE", "SUITE JUNIOR" |
| precio | number | No        | Precio por noche (decimal positivo con máximo 2 decimales)                       |
| estado | string | Sí        | Estado: "Disponible", "Ocupado", "Mantenimiento", "Reservado"                    |

**Respuesta de Éxito (200):**

```json
{
  "success": true,
  "message": "Habitación actualizada exitosamente",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "numero": "101A",
    "piso": 1,
    "tipo": "ESTÁNDAR DOBLE",
    "precio": 200.0,
    "estado": "Mantenimiento",
    "created_at": "2024-03-15T10:30:00.000Z",
    "updated_at": "2024-03-15T11:00:00.000Z"
  },
  "timestamp": 1710501600000
}
```

**Respuestas de Error:**

- `400 Bad Request`: Datos de entrada inválidos o formato UUID incorrecto
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No es un usuario ADMIN
- `404 Not Found`: Habitación no encontrada
- `409 Conflict`: El número de habitación ya existe (al cambiar numero)

---

### 5. Actualizar Estado de Habitación

Actualiza solo el estado de una habitación de hotel.

**Endpoint:** `PATCH /api/habitaciones/:id/estado`

**Autorización:** ADMIN o PERSONAL

**Parámetros de URL:**

| Parámetro | Tipo   | Descripción           |
| --------- | ------ | --------------------- |
| id        | string | UUID de la habitación |

**Cuerpo de la Solicitud:**

```json
{
  "estado": "Ocupado"
}
```

**Campos de la Solicitud:**

| Campo  | Tipo   | Requerido | Descripción                                                   |
| ------ | ------ | --------- | ------------------------------------------------------------- |
| estado | string | Sí        | Estado: "Disponible", "Ocupado", "Mantenimiento", "Reservado" |

**Respuesta de Éxito (200):**

```json
{
  "success": true,
  "message": "Estado de habitación actualizado exitosamente",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "numero": "101",
    "piso": 1,
    "tipo": "ESTÁNDAR SIMPLE",
    "precio": 150.0,
    "estado": "Ocupado",
    "created_at": "2024-03-15T10:30:00.000Z",
    "updated_at": "2024-03-15T11:30:00.000Z"
  },
  "timestamp": 1710503400000
}
```

**Respuestas de Error:**

- `400 Bad Request`: Datos de entrada inválidos o formato UUID incorrecto
- `401 Unauthorized`: No autenticado
- `404 Not Found`: Habitación no encontrada

**Nota:** Cualquier campo adicional enviado en el cuerpo de la solicitud será ignorado. Solo el campo `estado` será actualizado.

---

### 6. Eliminar Habitación

Elimina permanentemente una habitación de hotel.

**Endpoint:** `DELETE /api/habitaciones/:id`

**Autorización:** Solo ADMIN

**Parámetros de URL:**

| Parámetro | Tipo   | Descripción           |
| --------- | ------ | --------------------- |
| id        | string | UUID de la habitación |

**Respuesta de Éxito (200):**

```json
{
  "success": true,
  "message": "Habitación eliminada exitosamente",
  "data": null,
  "timestamp": 1710505200000
}
```

**Respuestas de Error:**

- `400 Bad Request`: Formato UUID inválido
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No es un usuario ADMIN
- `404 Not Found`: Habitación no encontrada

---

## Modelos de Datos

### Habitación

| Campo      | Tipo         | Descripción                                                                      |
| ---------- | ------------ | -------------------------------------------------------------------------------- |
| id         | string       | Identificador UUID v4                                                            |
| numero     | string       | Número de habitación único                                                       |
| piso       | number       | Número de piso (entero positivo)                                                 |
| tipo       | string       | Tipo de habitación: "ESTÁNDAR SIMPLE", "ESTÁNDAR DOBLE", "SUITE", "SUITE JUNIOR" |
| precio     | number\|null | Precio por noche (decimal con máximo 2 decimales)                                |
| estado     | string       | Estado: "Disponible", "Ocupado", "Mantenimiento", "Reservado"                    |
| created_at | string       | Marca de tiempo ISO 8601 de creación                                             |
| updated_at | string       | Marca de tiempo ISO 8601 de última actualización                                 |

---

## Formato de Respuesta de Error

Todas las respuestas de error siguen este formato:

```json
{
  "success": false,
  "message": "Descripción del error",
  "data": null,
  "timestamp": 1710499800000
}
```

### Códigos de Error Comunes

| Código | Descripción                                                        |
| ------ | ------------------------------------------------------------------ |
| 400    | Bad Request - Datos de entrada inválidos o formato UUID incorrecto |
| 401    | Unauthorized - No autenticado                                      |
| 403    | Forbidden - Permisos insuficientes                                 |
| 404    | Not Found - El recurso no existe                                   |
| 409    | Conflict - Número de habitación duplicado                          |
| 500    | Internal Server Error - Error inesperado del servidor              |

---

## Ejemplos

### Ejemplo 1: Crear una Habitación (ADMIN)

```bash
curl -X POST http://localhost:3000/api/habitaciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{
    "numero": "201",
    "piso": 2,
    "tipo": "SUITE",
    "precio": 350.00
  }'
```

### Ejemplo 2: Actualizar Estado de Habitación (PERSONAL)

```bash
curl -X PATCH http://localhost:3000/api/habitaciones/550e8400-e29b-41d4-a716-446655440000/estado \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{
    "estado": "Ocupado"
  }'
```

### Ejemplo 3: Listar Todas las Habitaciones

```bash
curl -X GET http://localhost:3000/api/habitaciones \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

---

## Notas

- Todas las marcas de tiempo están en formato ISO 8601 (UTC)
- El campo `estado` por defecto es "Disponible" cuando se crea una nueva habitación
- Los números de habitación deben ser únicos en todo el sistema
- Los valores de precio se almacenan con precisión de 2 decimales
- La marca de tiempo `updated_at` se actualiza automáticamente en cualquier modificación
