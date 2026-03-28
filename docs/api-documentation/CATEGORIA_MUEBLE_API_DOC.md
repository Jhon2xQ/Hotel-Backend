# API de Categorías de mueble


> **Autorización:** Las rutas que restrigen por rol usan `requireRoles(...)` (`src/presentation/middlewares/roles.middleware.ts`) con valores en `src/common/constants/roles.ts` (p. ej. `admin`, `recepcionista`). Cualquier mención a "ADMIN" u otros roles aquí es orientativa; la fuente de verdad es el `*.routes.ts` correspondiente.


Documentación del módulo `categoria-mueble.routes.ts`.

## Base URL

```
/api/private/categorias-mueble
```

## Orden de endpoints

1. `GET /` — listar categorías  
2. `GET /:id` — por id  
3. `POST /` — crear  
4. `PUT /:id` — actualizar  
5. `DELETE /:id` — eliminar  

## Autenticación

Sesión Better Auth en todas las rutas (según política del despliegue).

## Contrato de respuesta

Los cuerpos de respuesta siguen `CategoriaMuebleDto` (`id`, `nombre`, `descripcion`, `activo`, `created_at`, `updated_at`). Ver casos de uso y esquemas Zod en `src/presentation/schemas/categoria-mueble.schema.ts` para cuerpos de petición.
