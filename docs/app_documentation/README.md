# Documentación del Sistema de Gestión Hotelera

Bienvenido a la documentación completa del Sistema de Gestión Hotelera. Esta documentación está diseñada para usuarios no técnicos y proporciona toda la información necesaria para entender y operar el sistema.

---

## 📚 Guía de Lectura

Si eres nuevo en el sistema, te recomendamos leer los documentos en el siguiente orden:

1. **[APP_DOCUMENTATION.md](./APP_DOCUMENTATION.md)** - Comienza aquí
   - Visión general del sistema
   - Alcance y limitaciones
   - Módulos principales
   - Requerimientos funcionales y no funcionales

2. **[GLOSARIO.md](./GLOSARIO.md)** - Familiarízate con los términos
   - Definiciones de términos técnicos
   - Vocabulario de negocio
   - Conceptos clave del sistema

3. **[FLUJOS_TRABAJO.md](./FLUJOS_TRABAJO.md)** - Entiende los procesos
   - Flujo completo de reserva a check-out
   - Gestión diaria de habitaciones
   - Configuración inicial del sistema
   - Gestión de tarifas y cancelaciones

4. **[CASOS_USO.md](./CASOS_USO.md)** - Aprende las operaciones
   - 10 casos de uso principales
   - Flujos paso a paso
   - Precondiciones y postcondiciones

5. **[FAQ_Y_MEJORES_PRACTICAS.md](./FAQ_Y_MEJORES_PRACTICAS.md)** - Optimiza tu uso
   - Preguntas frecuentes
   - Mejores prácticas operativas
   - Solución de problemas
   - Consejos de seguridad

---

## 📖 Documentos Disponibles

### Documentación General

| Documento                                                  | Descripción                                                                        | Para quién                    |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------- |
| [APP_DOCUMENTATION.md](./APP_DOCUMENTATION.md)             | Documentación completa del sistema con requerimientos funcionales y no funcionales | Todos los usuarios            |
| [GLOSARIO.md](./GLOSARIO.md)                               | Definiciones de términos técnicos y de negocio                                     | Todos los usuarios            |
| [FLUJOS_TRABAJO.md](./FLUJOS_TRABAJO.md)                   | Diagramas y descripciones de flujos operativos                                     | Personal operativo y gerentes |
| [CASOS_USO.md](./CASOS_USO.md)                             | Casos de uso detallados con flujos paso a paso                                     | Personal operativo            |
| [FAQ_Y_MEJORES_PRACTICAS.md](./FAQ_Y_MEJORES_PRACTICAS.md) | Preguntas frecuentes y mejores prácticas                                           | Todos los usuarios            |

### Documentación Técnica de API

Para desarrolladores e integradores, la documentación técnica de cada endpoint está disponible en:

📁 **[../api-documentation/](../api-documentation/)**

Incluye documentación detallada de:

- Canales de venta
- Habitaciones y tipos de habitación
- Huéspedes
- Reservas
- Estancias (check-in/check-out)
- Pagos
- Tarifas
- Inventario de muebles

---

## 🎯 Acceso Rápido por Rol

### Para Recepcionistas

**Documentos esenciales**:

1. [Casos de Uso](./CASOS_USO.md) - Especialmente:
   - CU-02: Crear Reserva
   - CU-03: Consultar Disponibilidad
   - CU-04: Realizar Check-in
   - CU-05: Realizar Check-out
   - CU-07: Registrar Pago

2. [Flujos de Trabajo](./FLUJOS_TRABAJO.md) - Especialmente:
   - Flujo Completo: De la Reserva al Check-out
   - Flujo: Manejo de Cancelaciones

3. [FAQ y Mejores Prácticas](./FAQ_Y_MEJORES_PRACTICAS.md) - Sección:
   - Mejores Prácticas para Recepcionistas

### Para Personal de Limpieza

**Documentos esenciales**:

1. [Flujos de Trabajo](./FLUJOS_TRABAJO.md) - Especialmente:
   - Flujo: Gestión Diaria de Habitaciones

2. [Casos de Uso](./CASOS_USO.md) - Especialmente:
   - CU-08: Actualizar Estado de Habitación

3. [FAQ y Mejores Prácticas](./FAQ_Y_MEJORES_PRACTICAS.md) - Sección:
   - Mejores Prácticas para Personal de Limpieza

### Para Administradores/Gerentes

**Documentos esenciales**:

1. [APP_DOCUMENTATION.md](./APP_DOCUMENTATION.md) - Documento completo

2. [Flujos de Trabajo](./FLUJOS_TRABAJO.md) - Especialmente:
   - Flujo: Configuración Inicial del Sistema
   - Flujo: Gestión de Tarifas por Temporada
   - Flujo: Control de Inventario

3. [Casos de Uso](./CASOS_USO.md) - Especialmente:
   - CU-09: Configurar Tarifa
   - CU-10: Gestionar Inventario de Muebles

4. [FAQ y Mejores Prácticas](./FAQ_Y_MEJORES_PRACTICAS.md) - Sección:
   - Mejores Prácticas para Administradores

### Para Desarrolladores

**Documentos esenciales**:

1. [../../AGENTS.md](../../AGENTS.md) - Guía de desarrollo del backend

2. [../api-documentation/](../api-documentation/) - Documentación de todos los endpoints

3. [../../README.md](../../README.md) - Instalación y configuración

---

## 🔍 Búsqueda Rápida de Temas

### Gestión de Reservas

- [Crear una reserva](./CASOS_USO.md#cu-02-crear-reserva)
- [Consultar disponibilidad](./CASOS_USO.md#cu-03-consultar-disponibilidad)
- [Cancelar una reserva](./CASOS_USO.md#cu-06-cancelar-reserva)
- [Flujo completo de reserva](./FLUJOS_TRABAJO.md#flujo-completo-de-la-reserva-al-check-out)

### Check-in y Check-out

- [Realizar check-in](./CASOS_USO.md#cu-04-realizar-check-in)
- [Realizar check-out](./CASOS_USO.md#cu-05-realizar-check-out)
- [Flujo de check-in](./FLUJOS_TRABAJO.md#fase-2-check-in-día-de-llegada)
- [Flujo de check-out](./FLUJOS_TRABAJO.md#fase-4-check-out-día-de-salida)

### Gestión de Habitaciones

- [Actualizar estado de habitación](./CASOS_USO.md#cu-08-actualizar-estado-de-habitación)
- [Estados de habitación](./GLOSARIO.md#estado-de-habitación)
- [Gestión diaria](./FLUJOS_TRABAJO.md#flujo-gestión-diaria-de-habitaciones)

### Pagos

- [Registrar un pago](./CASOS_USO.md#cu-07-registrar-pago)
- [Métodos de pago](./GLOSARIO.md#método-de-pago)
- [FAQ sobre pagos](./FAQ_Y_MEJORES_PRACTICAS.md#pagos)

### Tarifas

- [Configurar tarifa](./CASOS_USO.md#cu-09-configurar-tarifa)
- [Gestión de tarifas por temporada](./FLUJOS_TRABAJO.md#flujo-gestión-de-tarifas-por-temporada)
- [FAQ sobre tarifas](./FAQ_Y_MEJORES_PRACTICAS.md#tarifas-y-canales)

### Configuración Inicial

- [Flujo de configuración inicial](./FLUJOS_TRABAJO.md#flujo-configuración-inicial-del-sistema)
- [Pasos detallados](./FLUJOS_TRABAJO.md#pasos-detallados)

---

## 🆘 Soporte

### Problemas Comunes

Consulta la sección [Solución de Problemas Comunes](./FAQ_Y_MEJORES_PRACTICAS.md#solución-de-problemas-comunes) para resolver:

- No puedo crear una reserva
- No puedo hacer check-in
- No puedo modificar una reserva
- El sistema no calcula bien el precio
- No aparecen habitaciones disponibles

### Preguntas Frecuentes

Consulta la sección [Preguntas Frecuentes](./FAQ_Y_MEJORES_PRACTICAS.md#preguntas-frecuentes) para respuestas sobre:

- Gestión de reservas
- Gestión de habitaciones
- Check-in y check-out
- Pagos
- Tarifas y canales
- Inventario

### Contacto

Para soporte técnico o consultas adicionales, contacta al administrador del sistema.

---

## 📊 Diagramas Disponibles

Los siguientes diagramas están disponibles en [FLUJOS_TRABAJO.md](./FLUJOS_TRABAJO.md):

1. **Flujo Completo: De la Reserva al Check-out** (Diagrama de secuencia)
   - Interacción entre cliente, recepcionista, sistema y habitación

2. **Gestión Diaria de Habitaciones** (Diagrama de flujo)
   - Estados de habitación y transiciones

3. **Configuración Inicial del Sistema** (Diagrama de flujo)
   - Pasos para configurar el sistema por primera vez

4. **Gestión de Tarifas por Temporada** (Diagrama de flujo)
   - Proceso de actualización de tarifas

5. **Manejo de Cancelaciones** (Diagrama de flujo)
   - Proceso de cancelación según políticas

6. **Control de Inventario** (Diagrama de flujo)
   - Proceso de revisión y actualización de inventario

---

## 📝 Notas Importantes

### Inmutabilidad de Registros

- Las **reservas completadas** no pueden modificarse
- Las **estancias completadas** no pueden modificarse
- Esto protege la integridad del historial y los registros contables

### Roles y Permisos

- **ADMIN**: Acceso completo al sistema
- **PERSONAL**: Acceso limitado (consulta y actualización de estados)

### Seguridad

- Cada usuario debe tener su propia cuenta
- No compartir contraseñas
- Cerrar sesión al alejarse de la computadora
- Consulta [Consejos de Seguridad](./FAQ_Y_MEJORES_PRACTICAS.md#consejos-de-seguridad)

---

## 🔄 Actualizaciones

Esta documentación se actualiza periódicamente. Última actualización: **Marzo 2026**

Para sugerencias o correcciones, contacta al administrador del sistema.

---

## 📄 Licencia y Uso

Esta documentación es parte del Sistema de Gestión Hotelera y está destinada exclusivamente para uso interno del hotel.

---

**¿Listo para comenzar?** Empieza con [APP_DOCUMENTATION.md](./APP_DOCUMENTATION.md) para obtener una visión general completa del sistema.
