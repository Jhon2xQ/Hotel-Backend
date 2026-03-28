# API de Habitaciones - Manejo de Imágenes

## Descripción General

Los endpoints de habitaciones ahora soportan la subida de imágenes directamente al servidor S3. Las imágenes se envían como archivos en formato `multipart/form-data` y se almacenan en S3, guardando solo las URLs en la base de datos.

## Configuración S3

Las siguientes variables de entorno deben configurarse en `.env`:

```env
S3_REGION=us-east-1
S3_ENDPOINT=http://localhost:8333
S3_ACCESS_KEY_ID=admin
S3_SECRET_ACCESS_KEY=tu-secret-key
S3_BUCKET_NAME=my-bucket
S3_FORCE_PATH_STYLE=true
```

## Endpoints Actualizados

### POST /api/habitaciones

Crea una nueva habitación con imágenes opcionales.

**Content-Type:** `multipart/form-data`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Campos del formulario:**

| Campo              | Tipo    | Requerido | Descripción                               |
| ------------------ | ------- | --------- | ----------------------------------------- |
| nro_habitacion     | string  | Sí        | Número de habitación (máx. 10 caracteres) |
| tipo_habitacion_id | string  | Sí        | UUID del tipo de habitación               |
| piso               | number  | Sí        | Número de piso (entero positivo)          |
| tiene_ducha        | boolean | No        | Indica si tiene ducha                     |
| tiene_banio        | boolean | No        | Indica si tiene baño                      |
| imagenes           | File[]  | No        | Array de archivos de imagen               |
| estado             | string  | No        | Estado inicial (por defecto: DISPONIBLE)  |
| notas              | string  | No        | Notas adicionales                         |

**Ejemplo de uso con JavaScript/Fetch:**

```javascript
const formData = new FormData();
formData.append("nro_habitacion", "101");
formData.append("tipo_habitacion_id", "uuid-del-tipo");
formData.append("piso", "1");
formData.append("tiene_ducha", "true");
formData.append("tiene_banio", "true");

// Agregar múltiples imágenes
const imageFiles = document.querySelector('input[type="file"]').files;
for (const file of imageFiles) {
  formData.append("imagenes", file);
}

const response = await fetch("/api/habitaciones", {
  method: "POST",
  headers: {
    Authorization: "Bearer <token>",
  },
  body: formData,
});

const result = await response.json();
```

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "message": "Habitación creada exitosamente",
  "data": {
    "id": "uuid",
    "nro_habitacion": "101",
    "tipo_habitacion_id": "uuid-del-tipo",
    "piso": 1,
    "tiene_ducha": true,
    "tiene_banio": true,
    "url_imagen": ["http://localhost:8333/my-bucket/uuid-1.jpg", "http://localhost:8333/my-bucket/uuid-2.jpg"],
    "estado": "DISPONIBLE",
    "notas": null,
    "ulti_limpieza": null,
    "created_at": "2024-03-27T10:00:00.000Z",
    "updated_at": "2024-03-27T10:00:00.000Z"
  },
  "timestamp": 1711533600000
}
```

### PUT /api/habitaciones/:id

Actualiza una habitación existente, incluyendo sus imágenes.

**Content-Type:** `multipart/form-data`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Campos del formulario:**

Todos los campos son opcionales. Solo se actualizarán los campos proporcionados.

| Campo              | Tipo    | Descripción                                            |
| ------------------ | ------- | ------------------------------------------------------ |
| nro_habitacion     | string  | Número de habitación (máx. 10 caracteres)              |
| tipo_habitacion_id | string  | UUID del tipo de habitación                            |
| piso               | number  | Número de piso (entero positivo)                       |
| tiene_ducha        | boolean | Indica si tiene ducha                                  |
| tiene_banio        | boolean | Indica si tiene baño                                   |
| imagenes           | File[]  | Array de archivos de imagen (reemplaza las existentes) |
| estado             | string  | Estado de la habitación                                |
| notas              | string  | Notas adicionales                                      |

**Ejemplo de uso con JavaScript/Fetch:**

```javascript
const formData = new FormData();
formData.append("nro_habitacion", "102");

// Agregar nuevas imágenes (reemplazarán las existentes)
const imageFiles = document.querySelector('input[type="file"]').files;
for (const file of imageFiles) {
  formData.append("imagenes", file);
}

const response = await fetch("/api/habitaciones/uuid-habitacion", {
  method: "PUT",
  headers: {
    Authorization: "Bearer <token>",
  },
  body: formData,
});

const result = await response.json();
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Habitación actualizada exitosamente",
  "data": {
    "id": "uuid",
    "nro_habitacion": "102",
    "tipo_habitacion_id": "uuid-del-tipo",
    "piso": 1,
    "tiene_ducha": true,
    "tiene_banio": true,
    "url_imagen": ["http://localhost:8333/my-bucket/uuid-3.jpg"],
    "estado": "DISPONIBLE",
    "notas": null,
    "ulti_limpieza": null,
    "created_at": "2024-03-27T10:00:00.000Z",
    "updated_at": "2024-03-27T10:05:00.000Z"
  },
  "timestamp": 1711533900000
}
```

## Notas Importantes

1. **Formato de archivos:** Se recomienda usar formatos de imagen estándar (JPG, PNG, WebP).

2. **Nombres de archivo:** Los archivos se renombran automáticamente usando UUIDs para evitar conflictos.

3. **URLs generadas:** Las URLs siguen el formato: `${S3_ENDPOINT}/${S3_BUCKET_NAME}/${uuid}.${extension}`

4. **Reemplazo de imágenes:** Al actualizar una habitación con nuevas imágenes, las URLs antiguas se reemplazan completamente. Si deseas mantener las imágenes existentes, no incluyas el campo `imagenes` en la actualización.

5. **Límite de tamaño:** El límite de tamaño de archivo depende de la configuración del servidor S3.

6. **Permisos:** Ambos endpoints requieren autenticación. El POST y PUT requieren rol de ADMIN.

## Errores Comunes

### 400 - Error de validación

```json
{
  "success": false,
  "message": "Error de validacion en cuerpo: nro_habitacion | tipo_habitacion_id",
  "data": null,
  "timestamp": 1711533600000
}
```

### 401 - No autorizado

```json
{
  "success": false,
  "message": "No autorizado",
  "data": null,
  "timestamp": 1711533600000
}
```

### 409 - Número de habitación duplicado

```json
{
  "success": false,
  "message": "El número de habitación ya existe",
  "data": null,
  "timestamp": 1711533600000
}
```

### 500 - Error al subir imagen a S3

```json
{
  "success": false,
  "message": "Error interno del servidor",
  "data": null,
  "timestamp": 1711533600000
}
```
