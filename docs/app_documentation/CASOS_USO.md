# Casos de Uso del Sistema de Gestión Hotelera

## Índice

1. [CU-01: Registrar Nuevo Huésped](#cu-01-registrar-nuevo-huésped)
2. [CU-02: Crear Reserva](#cu-02-crear-reserva)
3. [CU-03: Consultar Disponibilidad](#cu-03-consultar-disponibilidad)
4. [CU-04: Realizar Check-in](#cu-04-realizar-check-in)
5. [CU-05: Realizar Check-out](#cu-05-realizar-check-out)
6. [CU-06: Cancelar Reserva](#cu-06-cancelar-reserva)
7. [CU-07: Registrar Pago](#cu-07-registrar-pago)
8. [CU-08: Actualizar Estado de Habitación](#cu-08-actualizar-estado-de-habitación)
9. [CU-09: Configurar Tarifa](#cu-09-configurar-tarifa)
10. [CU-10: Gestionar Inventario de Muebles](#cu-10-gestionar-inventario-de-muebles)

---

## CU-01: Registrar Nuevo Huésped

**Actor**: Recepcionista o Administrador

**Precondiciones**:

- El usuario debe estar autenticado en el sistema

**Flujo Principal**:

1. El usuario accede al módulo de huéspedes
2. El usuario selecciona "Crear nuevo huésped"
3. El sistema muestra el formulario de registro
4. El usuario ingresa los datos del huésped:
   - Nombres
   - Apellidos
   - Email (único)
   - Teléfono
   - Nacionalidad
   - Tipo de documento (opcional)
   - Número de documento (opcional)
   - Observaciones (opcional)
5. El usuario confirma el registro
6. El sistema valida que el email no exista
7. El sistema guarda el huésped
8. El sistema muestra mensaje de confirmación

**Flujos Alternativos**:

- **4a**: Email duplicado
  - El sistema muestra error "Ya existe un huésped con ese email"
  - El usuario debe usar otro email o buscar el huésped existente

**Postcondiciones**:

- El huésped queda registrado en el sistema
- El huésped puede ser usado para crear reservas

---

## CU-02: Crear Reserva

**Actor**: Recepcionista o Administrador

**Precondiciones**:

- El usuario debe estar autenticado
- Debe existir al menos un huésped registrado
- Debe existir al menos una habitación disponible
- Debe existir al menos una tarifa configurada

**Flujo Principal**:

1. El usuario accede al módulo de reservas
2. El usuario selecciona "Crear nueva reserva"
3. El sistema muestra el formulario de reserva
4. El usuario selecciona o busca el huésped
5. El usuario selecciona las fechas de entrada y salida
6. El sistema muestra las habitaciones disponibles
7. El usuario selecciona una habitación
8. El sistema muestra las tarifas disponibles para esa habitación
9. El usuario selecciona una tarifa (según canal)
10. El usuario ingresa número de adultos y niños
11. El sistema calcula el monto total automáticamente
12. El usuario puede aplicar un descuento (opcional)
13. El sistema recalcula el monto final
14. El usuario confirma la reserva
15. El sistema genera un código único de reserva
16. El sistema guarda la reserva en estado TENTATIVA
17. El sistema muestra mensaje de confirmación con el código

**Flujos Alternativos**:

- **6a**: No hay habitaciones disponibles
  - El sistema muestra mensaje "No hay habitaciones disponibles para esas fechas"
  - El usuario debe seleccionar otras fechas
- **14a**: Usuario registra pago inmediato
  - El sistema cambia el estado a CONFIRMADA
  - El sistema asocia el pago a la reserva

**Postcondiciones**:

- La reserva queda registrada
- La habitación queda marcada como RESERVADA
- Se genera un código único de reserva

---

## CU-03: Consultar Disponibilidad

**Actor**: Recepcionista o Administrador

**Precondiciones**:

- El usuario debe estar autenticado

**Flujo Principal**:

1. El usuario accede al módulo de disponibilidad
2. El usuario ingresa fecha de entrada
3. El usuario ingresa fecha de salida
4. El usuario confirma la búsqueda
5. El sistema consulta habitaciones disponibles
6. El sistema excluye habitaciones:
   - Con reservas en ese rango de fechas
   - Con estado diferente a DISPONIBLE
7. El sistema muestra lista de habitaciones disponibles con:
   - Número de habitación
   - Tipo de habitación
   - Características (ducha, baño)
   - Imágenes
   - Tarifas disponibles

**Postcondiciones**:

- El usuario conoce las habitaciones disponibles
- El usuario puede proceder a crear una reserva

---

## CU-04: Realizar Check-in

**Actor**: Recepcionista o Administrador

**Precondiciones**:

- El usuario debe tener rol ADMIN
- Debe existir una reserva confirmada
- La fecha actual debe estar dentro del rango de la reserva

**Flujo Principal**:

1. El usuario accede al módulo de estancias
2. El usuario selecciona "Realizar check-in"
3. El sistema muestra el formulario de check-in
4. El usuario busca la reserva (por código o huésped)
5. El sistema muestra los datos de la reserva
6. El usuario verifica los datos del huésped
7. El usuario confirma la habitación asignada
8. El sistema registra la fecha y hora de entrada
9. El sistema crea la estancia en estado EN_CASA
10. El sistema cambia el estado de la reserva a EN_CASA
11. El sistema cambia el estado de la habitación a OCUPADA
12. El sistema muestra mensaje de confirmación
13. El usuario entrega la llave al huésped

**Flujos Alternativos**:

- **4a**: No existe reserva previa
  - El usuario crea una reserva express
  - El sistema continúa con el check-in
- **7a**: Cambio de habitación
  - El usuario selecciona otra habitación disponible
  - El sistema actualiza la asignación

**Postcondiciones**:

- La estancia queda registrada
- La habitación queda marcada como OCUPADA
- La reserva queda en estado EN_CASA

---

## CU-05: Realizar Check-out

**Actor**: Recepcionista o Administrador

**Precondiciones**:

- El usuario debe tener rol ADMIN
- Debe existir una estancia activa (EN_CASA)

**Flujo Principal**:

1. El huésped solicita check-out
2. El usuario accede al módulo de estancias
3. El usuario busca la estancia (por habitación o huésped)
4. El sistema muestra los datos de la estancia
5. El sistema muestra consumos pendientes (si existen)
6. El usuario verifica pagos pendientes
7. Si hay pagos pendientes, el usuario los registra
8. El usuario ingresa la fecha y hora de salida
9. El usuario confirma el check-out
10. El sistema cambia el estado de la estancia a COMPLETADA
11. El sistema cambia el estado de la reserva a COMPLETADA
12. El sistema cambia el estado de la habitación a LIMPIEZA
13. El sistema muestra mensaje de confirmación
14. El usuario entrega comprobante al huésped

**Flujos Alternativos**:

- **6a**: Hay pagos pendientes
  - El usuario registra los pagos antes de continuar
  - El sistema valida que todo esté pagado
- **8a**: Salida anticipada
  - El usuario marca la estancia como SALIDA_ANTICIPADA
  - El sistema puede aplicar políticas de cancelación

**Postcondiciones**:

- La estancia queda completada (inmutable)
- La reserva queda completada (inmutable)
- La habitación queda en estado LIMPIEZA

---

## CU-06: Cancelar Reserva

**Actor**: Recepcionista o Administrador

**Precondiciones**:

- El usuario debe tener rol ADMIN
- La reserva no debe estar en estado COMPLETADA

**Flujo Principal**:

1. El usuario accede al módulo de reservas
2. El usuario busca la reserva a cancelar
3. El usuario selecciona "Cancelar reserva"
4. El sistema solicita motivo de cancelación
5. El usuario ingresa el motivo
6. El usuario confirma la cancelación
7. El sistema cambia el estado a CANCELADA
8. El sistema registra la fecha de cancelación
9. El sistema libera la habitación
10. El sistema muestra mensaje de confirmación

**Flujos Alternativos**:

- **3a**: La reserva ya está completada
  - El sistema muestra error "No se puede cancelar una reserva completada"
  - El proceso termina
- **7a**: Hay pago asociado
  - El sistema marca el pago como DEVUELTO (si aplica)
  - El usuario debe gestionar la devolución manualmente

**Postcondiciones**:

- La reserva queda cancelada
- La habitación queda disponible nuevamente
- Se registra el motivo de cancelación

---

## CU-07: Registrar Pago

**Actor**: Recepcionista o Administrador

**Precondiciones**:

- El usuario debe tener rol ADMIN
- Debe existir una reserva o folio al cual asociar el pago

**Flujo Principal**:

1. El cliente realiza un pago
2. El usuario accede al módulo de pagos
3. El usuario selecciona "Registrar nuevo pago"
4. El sistema muestra el formulario de pago
5. El usuario selecciona el concepto (RESERVA o CONSUMO)
6. El usuario ingresa el monto
7. El usuario selecciona el método de pago
8. El usuario selecciona la moneda
9. El usuario asocia el pago a una reserva o folio
10. El usuario puede agregar observaciones
11. El usuario confirma el registro
12. El sistema registra el pago en estado CONFIRMADO
13. El sistema registra qué usuario recibió el pago
14. El sistema muestra mensaje de confirmación

**Flujos Alternativos**:

- **5a**: Pago de reserva
  - El usuario busca y selecciona la reserva
  - El sistema asocia el pago a la reserva
- **5b**: Pago de consumo
  - El usuario busca y selecciona el folio
  - El sistema asocia el pago al folio

**Postcondiciones**:

- El pago queda registrado
- El pago queda asociado a la reserva o folio
- Se registra el usuario que recibió el pago

---

## CU-08: Actualizar Estado de Habitación

**Actor**: Personal o Administrador

**Precondiciones**:

- El usuario debe estar autenticado

**Flujo Principal**:

1. El usuario accede al módulo de habitaciones
2. El usuario busca la habitación
3. El usuario selecciona "Actualizar estado"
4. El sistema muestra los estados disponibles:
   - DISPONIBLE
   - RESERVADA
   - OCUPADA
   - LIMPIEZA
   - MANTENIMIENTO
5. El usuario selecciona el nuevo estado
6. Si el estado es LIMPIEZA, el usuario puede actualizar fecha de última limpieza
7. El usuario confirma el cambio
8. El sistema actualiza el estado
9. El sistema muestra mensaje de confirmación

**Flujos Alternativos**:

- **5a**: Cambio a LIMPIEZA
  - El sistema registra automáticamente la fecha actual como última limpieza
- **5b**: Cambio a DISPONIBLE desde LIMPIEZA
  - El sistema valida que la limpieza esté completada

**Postcondiciones**:

- El estado de la habitación queda actualizado
- Si aplica, se actualiza la fecha de última limpieza

---

## CU-09: Configurar Tarifa

**Actor**: Administrador

**Precondiciones**:

- El usuario debe tener rol ADMIN
- Debe existir al menos un tipo de habitación
- Debe existir al menos un canal de venta

**Flujo Principal**:

1. El usuario accede al módulo de tarifas
2. El usuario selecciona "Crear nueva tarifa"
3. El sistema muestra el formulario de tarifa
4. El usuario selecciona el tipo de habitación
5. El usuario selecciona el canal de venta
6. El usuario ingresa el precio por noche
7. El usuario ingresa el porcentaje de IVA (opcional)
8. El usuario ingresa el cargo por servicios (opcional)
9. El usuario selecciona la moneda
10. El usuario confirma la creación
11. El sistema valida que no exista una tarifa duplicada
12. El sistema guarda la tarifa
13. El sistema muestra mensaje de confirmación

**Flujos Alternativos**:

- **11a**: Ya existe una tarifa para esa combinación
  - El sistema sugiere actualizar la tarifa existente
  - El usuario puede modificar la tarifa existente

**Postcondiciones**:

- La tarifa queda configurada
- La tarifa está disponible para crear reservas

---

## CU-10: Gestionar Inventario de Muebles

**Actor**: Administrador

**Precondiciones**:

- El usuario debe tener rol ADMIN

**Flujo Principal**:

1. El usuario accede al módulo de inventario
2. El usuario selecciona "Crear nuevo mueble"
3. El sistema muestra el formulario de mueble
4. El usuario ingresa:
   - Código único
   - Nombre
   - Categoría
   - Condición (BUENO, REGULAR, DAÑADO, FALTANTE)
   - Fecha de adquisición (opcional)
   - Descripción (opcional)
5. El usuario puede asignar el mueble a una habitación
6. El usuario puede subir una imagen
7. El usuario confirma el registro
8. El sistema valida que el código sea único
9. El sistema guarda el mueble
10. El sistema muestra mensaje de confirmación

**Flujos Alternativos**:

- **5a**: Asignar a habitación
  - El usuario busca y selecciona la habitación
  - El sistema asocia el mueble a la habitación
- **8a**: Código duplicado
  - El sistema muestra error "Ya existe un mueble con ese código"
  - El usuario debe usar otro código

**Postcondiciones**:

- El mueble queda registrado en el inventario
- Si aplica, el mueble queda asignado a una habitación
