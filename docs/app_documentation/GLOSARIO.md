# Glosario de Términos

Este documento define los términos técnicos y de negocio utilizados en el Sistema de Gestión Hotelera.

---

## A

**ADMIN**

- Rol de usuario con permisos completos en el sistema. Puede crear, modificar y eliminar cualquier registro.

**Adultos**

- Número de huéspedes mayores de edad que ocuparán una habitación en una reserva.

---

## B

**Better Auth**

- Sistema de autenticación utilizado por la aplicación para gestionar usuarios, sesiones y permisos.

---

## C

**Canal de Venta**

- Medio a través del cual se realiza una reserva. Puede ser OTA (Online Travel Agency), Directo (reserva directa en el hotel) o Agente (agencia de viajes).

**Cargo por Servicios**

- Porcentaje adicional que se cobra sobre el precio de la habitación por servicios del hotel.

**Check-in**

- Proceso de registro de entrada de un huésped al hotel. Marca el inicio de una estancia.

**Check-out**

- Proceso de registro de salida de un huésped del hotel. Marca el fin de una estancia.

**Código de Reserva**

- Identificador único generado automáticamente para cada reserva (ej: RES-2024-001).

**Comprobante**

- Documento fiscal que respalda una transacción (boleta, factura, nota de crédito).

**Concepto de Pago**

- Tipo de pago que se está registrando. Puede ser RESERVA (pago adelantado) o CONSUMO (pago por servicios durante la estancia).

**Condición de Mueble**

- Estado físico de un mueble del inventario. Puede ser: BUENO, REGULAR, DAÑADO o FALTANTE.

---

## D

**Descuento**

- Reducción aplicada al monto total de una reserva.

**Disponibilidad**

- Estado que indica si una habitación está libre para ser reservada en un rango de fechas específico.

---

## E

**Estancia**

- Período durante el cual un huésped se aloja en el hotel. Se crea con el check-in y se completa con el check-out.

**Estado de Estancia**

- Situación actual de una estancia. Puede ser: EN_CASA (huésped alojado), COMPLETADA (check-out realizado) o SALIDA_ANTICIPADA (salida antes de lo programado).

**Estado de Habitación**

- Situación operacional de una habitación. Puede ser: DISPONIBLE, RESERVADA, OCUPADA, LIMPIEZA o MANTENIMIENTO.

**Estado de Pago**

- Situación de un pago registrado. Puede ser: CONFIRMADO, DEVUELTO, RETENIDO o ANULADO.

**Estado de Reserva**

- Situación actual de una reserva. Puede ser: TENTATIVA, CONFIRMADA, EN_CASA, COMPLETADA, CANCELADA o NO_LLEGO.

---

## F

**Fecha de Entrada**

- Día y hora en que un huésped inicia su estancia en el hotel.

**Fecha de Salida**

- Día y hora en que un huésped finaliza su estancia en el hotel.

**Folio**

- Documento que registra todos los cargos y pagos de una estancia. Se crea al hacer check-in y se cierra al hacer check-out.

---

## H

**Habitación**

- Unidad física del hotel identificada por un número único. Tiene un tipo, ubicación (piso) y características específicas.

**Hono**

- Framework web utilizado para construir la API del sistema.

**Huésped**

- Cliente que se aloja o ha alojado en el hotel. Se registra con datos personales y de contacto.

---

## I

**Inmutable**

- Característica de un registro que no puede ser modificado una vez completado. Las reservas y estancias completadas son inmutables.

**Inventario**

- Catálogo de muebles y productos del hotel con su ubicación y condición.

**IVA (Impuesto al Valor Agregado)**

- Porcentaje de impuesto aplicado sobre el precio de la habitación.

---

## M

**Método de Pago**

- Forma en que el cliente realizó el pago FUERA del sistema. Puede ser: EFECTIVO, VISA, MASTERCARD, AMEX o TRANSFERENCIA. El sistema solo registra qué método se utilizó, NO procesa el pago. El cobro real se hace con terminal POS, efectivo físico, transferencia bancaria, etc.

**Moneda**

- Tipo de divisa utilizada en una transacción (USD, PEN, EUR, etc.).

**Monto Final**

- Precio total de una reserva después de aplicar descuentos. Calculado como: Monto Total - Descuento.

**Monto Total**

- Precio total de una reserva antes de descuentos. Calculado como: Precio por Noche × Número de Noches.

**Mueble**

- Elemento del inventario del hotel (cama, televisor, escritorio, etc.) que puede estar asignado a una habitación.

---

## N

**Niños**

- Número de huéspedes menores de edad que ocuparán una habitación en una reserva.

**Número de Habitación**

- Identificador único de una habitación física del hotel (ej: 101, 202, Suite-A).

**Número de Noches**

- Cantidad de noches que dura una reserva. Se calcula como la diferencia en días entre la fecha de salida y la fecha de entrada.

---

## O

**ORM (Object-Relational Mapping)**

- Técnica de programación que permite interactuar con la base de datos usando objetos. El sistema usa Prisma como ORM.

**OTA (Online Travel Agency)**

- Agencia de viajes online como Booking.com, Expedia, Airbnb, etc.

---

## P

**Pago**

- Registro manual de una transacción monetaria que ya ocurrió FUERA del sistema. El usuario registra que recibió un pago (efectivo, tarjeta, transferencia) y el sistema guarda esta información. El sistema NO procesa ni cobra pagos, solo los registra para llevar control.

**PERSONAL**

- Rol de usuario con permisos limitados. Puede consultar información y actualizar estados de habitaciones, pero no puede crear o eliminar registros.

**Piso**

- Nivel del edificio donde se encuentra una habitación.

**PostgreSQL**

- Sistema de gestión de base de datos relacional utilizado por la aplicación.

**Precio por Noche**

- Tarifa que se cobra por alojar en una habitación durante una noche.

**Prisma**

- ORM (Object-Relational Mapping) utilizado para interactuar con la base de datos PostgreSQL.

---

## R

**React**

- Biblioteca de JavaScript utilizada para construir la interfaz de usuario del sistema.

**Recepcionista**

- Usuario del sistema que gestiona reservas, check-in y check-out. Típicamente tiene rol PERSONAL.

**Reserva**

- Registro que asegura una habitación para un huésped en fechas específicas. Puede estar en diferentes estados desde su creación hasta su finalización.

**Rol**

- Conjunto de permisos asignados a un usuario. El sistema tiene dos roles: ADMIN y PERSONAL.

---

## S

**Sesión**

- Período de tiempo durante el cual un usuario está autenticado en el sistema.

**Snapshot**

- Copia de datos en un momento específico. Las reservas guardan snapshots de información (nombre del huésped, número de habitación, etc.) para mantener un historial inmutable.

**SUNAT**

- Superintendencia Nacional de Aduanas y de Administración Tributaria del Perú. Entidad que regula la facturación electrónica.

---

## T

**Tarifa**

- Precio configurado para un tipo de habitación en un canal de venta específico. Incluye precio por noche, IVA y cargos por servicio.

**Tipo de Canal**

- Categoría de un canal de venta. Puede ser: OTA, DIRECTO o AGENTE.

**Tipo de Documento**

- Categoría del documento de identidad de un huésped. Puede ser: DNI, PASAPORTE, RUC o CE (Carné de Extranjería).

**Tipo de Habitación**

- Categoría o plantilla que define las características de una habitación (Suite Deluxe, Habitación Estándar, etc.).

---

## U

**Usuario**

- Persona que tiene acceso al sistema con credenciales de autenticación. Cada usuario tiene un rol asignado.

**UUID (Universally Unique Identifier)**

- Identificador único universal utilizado como clave primaria en la base de datos. Formato: 123e4567-e89b-12d3-a456-426614174000.

---

## Z

**Zod**

- Biblioteca de validación de esquemas TypeScript utilizada para validar datos de entrada en la API.

---

## Términos Técnicos Adicionales

**API (Application Programming Interface)**

- Interfaz de programación que permite la comunicación entre el frontend y el backend del sistema.

**Arquitectura en Capas**

- Patrón de diseño que organiza el código en capas: presentación, aplicación, dominio e infraestructura.

**Bun**

- Runtime de JavaScript moderno y rápido utilizado para ejecutar el backend.

**CRUD**

- Acrónimo de Create (Crear), Read (Leer), Update (Actualizar), Delete (Eliminar). Operaciones básicas sobre datos.

**Docker**

- Plataforma de contenedores utilizada para empaquetar y desplegar la aplicación.

**Endpoint**

- URL específica de la API que realiza una operación (ej: GET /api/habitaciones).

**HTTP Status Code**

- Código numérico que indica el resultado de una petición HTTP (200 OK, 404 Not Found, etc.).

**JSON (JavaScript Object Notation)**

- Formato de intercambio de datos utilizado en la comunicación entre frontend y backend.

**Middleware**

- Función que se ejecuta antes de procesar una petición. Usado para autenticación, validación, etc.

**Repository Pattern**

- Patrón de diseño que abstrae el acceso a datos, separando la lógica de negocio de la persistencia.

**REST (Representational State Transfer)**

- Estilo arquitectónico para diseñar APIs web.

**TypeScript**

- Lenguaje de programación que extiende JavaScript con tipos estáticos.

**Use Case (Caso de Uso)**

- Clase que encapsula la lógica de negocio de una operación específica.

**Validación**

- Proceso de verificar que los datos de entrada cumplan con las reglas de negocio antes de procesarlos.
