# DB Roadmap — Hotel Mediano Cusco

## Guía de implementación para agentes y desarrolladores

> Este documento describe la lógica de negocio, estructura conceptual y orden
> de implementación del sistema de reservas. No es un listado de campos —
> es el "por qué" detrás de cada decisión de diseño.

---

## Stack

- **ORM**: Prisma con PostgreSQL
- **Auth**: better-auth (gestiona User, Session, Account, Verification)
- **IDs**: UUID en todas las tablas propias
- **Auditoría**: `createdAt` + `updatedAt` en entidades editables.
  Registros contables (Payment, FolioCharge, Invoice, Stay) solo `createdAt`
  — nunca se editan, solo se anulan.

---

## Principios de negocio globales

1. **Sin reserva sin pago.** Una reserva nace como `TENTATIVE` y solo pasa a
   `CONFIRMED` cuando existe un pago `DEPOSIT` confirmado. El sistema debe
   enforcar esto (trigger o validación en servicio).

2. **Habitación sin límite de ocupantes.** El hotel no restringe cuántas
   personas entran a una habitación. `adults` y `children` en la reserva son
   solo informativos para preparar el cuarto (cunas, sillas, etc.).

3. **Prohibido fumar.** No existe el concepto de habitación fumadora.
   No modelar ni mostrar esta opción en ningún flujo.

4. **Reserva ≠ Estadía.** Una reserva es una promesa futura. Una estadía
   (`Stay`) es el hecho real de que el huésped está en el hotel. Pueden
   existir reservas sin estadía (canceladas, no-show) pero nunca estadías
   sin reserva.

5. **Registros contables son inmutables.** Pagos, cargos al folio y facturas
   no se editan ni borran. Se anulan (`void = true`, `status = VOID`) y se
   crea un registro nuevo si es necesario corregir.

6. **Precio diferenciado por canal.** El mismo tipo de habitación puede tener
   precios distintos según el canal (Booking, directo, agencia). El precio
   publicado en OTAs es mayor para absorber la comisión del canal.

7. **Dos estados independientes en habitación.** El estado operativo
   (disponible, ocupada, etc.) y el estado de limpieza (limpia, sucia, etc.)
   son ortogonales. Una habitación `OCCUPIED` puede estar `DIRTY`.

---

## Módulos y su propósito

### AUTH + STAFF

**Qué resuelve:** quién puede operar el sistema y con qué permisos.

better-auth gestiona la autenticación (User, Session, Account). `Staff` es
la entidad del empleado del hotel — tiene nombre, rol operativo, turno, etc.
La relación es **uno a uno opcional**: un empleado puede existir en el sistema
antes de tener cuenta de acceso. Cuando se le crea la cuenta, `Staff.userId`
se enlaza a `User.id`.

**Regla clave:** `User.role` es el permiso de sistema (`ADMIN`, `MANAGER`,
`RECEPTIONIST`). `Staff.role` es la función operativa (`HOUSEKEEPER`,
`WAITER`, etc.). Son dos dimensiones distintas, no mezclar.

**Lo que se implementa:**

- CRUD de Staff (crear empleado, asignar cuenta, activar/desactivar)
- Login y sesión via better-auth
- Middleware de autorización por rol de sistema

---

### TIPOS DE HABITACIÓN + MUEBLES

**Qué resuelve:** la plantilla de lo que ofrece el hotel.

`RoomType` define una categoría (Standard, Deluxe, Suite) con sus
características: área, tipo de cama, vista, si tiene tina, jacuzzi, sala.
No tiene límites de ocupantes — eso lo decide el cliente.

`FurnitureCatalog` es el catálogo maestro de muebles (Cama King, TV 55",
Caja fuerte, etc.). `RoomTypeFurniture` es la tabla pivote que dice
"una habitación Deluxe debe tener: 1 cama king, 1 TV 55", 1 tina..." con
cantidad y si es obligatorio.

**Por qué separar catálogo de instancia:** el catálogo es la plantilla
(qué debería tener), `RoomFurniture` es la realidad (qué tiene la habitación
302 específicamente, con su número de serie y estado actual).

**Lo que se implementa:**

- CRUD de RoomType con sus características booleanas
- CRUD de FurnitureCatalog
- Gestión del inventario estándar por tipo (RoomTypeFurniture)

---

### CANALES + AGENCIAS + TARIFAS + TEMPORADAS

**Qué resuelve:** de dónde vienen las reservas y a qué precio.

Un `Channel` es el origen de la reserva: Booking.com, directo, agencia local,
corporativo. Cada canal tiene un porcentaje de comisión. Una `Agency` es una
agencia o empresa específica que reserva a través de un canal (canal AGENCY
o CORPORATE).

`Season` define períodos del año con un multiplicador de precio (temporada
alta Cusco: jun-ago, Inti Raymi, Semana Santa, Navidad). `RatePlan` define
qué incluye el precio (solo habitación, con desayuno, media pensión) y la
política de cancelación.

`Rate` es la combinación de todo: este tipo de habitación + este plan
tarifario + esta temporada + este canal = este precio por noche. El mismo
tipo de habitación puede tener precio distinto en Booking vs directo porque
en Booking el precio está inflado para absorber la comisión.

**Regla clave para calcular precio:**

1. Buscar la tarifa más específica: roomType + ratePlan + season + channel
2. Si no existe para ese canal, buscar la tarifa general (channel = null)
3. Aplicar el multiplicador de la temporada si corresponde

**Lo que se implementa:**

- CRUD de Channel, Agency, Season, RatePlan
- CRUD de Rate con su lógica de unicidad
- Endpoint de consulta de precio para un tipo de habitación + fechas + canal

---

### SERVICIOS (catálogo cobrable)

**Qué resuelve:** todo lo que se puede cargar al folio del huésped.

`Service` es el catálogo de productos y servicios cobrables: habitación por
noche, desayuno buffet, masaje spa, tour Machu Picchu, cerveza del minibar,
lavandería, transfer aeropuerto. Cada servicio tiene precio, categoría,
y porcentaje de IGV (impuesto peruano 18%). Los tours están exonerados de IGV.

**Lo que se implementa:**

- CRUD de Service con activación/desactivación
- Los servicios de tipo `ROOM` se cargan automáticamente cada noche via job
- Los demás se cargan manualmente desde recepción o los puntos de venta

---

### ROOMS (habitaciones físicas)

**Qué resuelve:** el inventario real del hotel, habitación por habitación.

`Room` es cada habitación física con su número, piso, tipo, y dos estados
independientes:

**Estado operativo** — cambia por eventos de negocio:

- `AVAILABLE` → se puede asignar a una reserva
- `RESERVED` → tiene una reserva confirmada con check-in próximo
- `OCCUPIED` → huésped adentro (post check-in)
- `CLEANING` → en limpieza post check-out
- `MAINTENANCE` → bloqueada por reparación

**Estado de limpieza** — cambia por el equipo de housekeeping:

- `CLEAN` → lista para recibir huésped
- `DIRTY` → sucia, pendiente de limpiar
- `CLEANING` → camarera trabajando en este momento
- `INSPECTING` → supervisora revisando antes de marcarla limpia

**Transiciones automáticas esperadas:**

- Check-in creado → habitación pasa a `OCCUPIED`
- Check-out registrado → habitación pasa a `CLEANING` + `DIRTY`
- Supervisora aprueba → habitación pasa a `AVAILABLE` + `CLEAN`

`RoomFurniture` es el inventario real de esa habitación: cada mueble con
su número de serie, estado (`GOOD`, `FAIR`, `DAMAGED`, `MISSING`) y fecha
de adquisición. Permite detectar habitaciones con muebles dañados antes
de asignarlas.

**Lo que se implementa:**

- CRUD de Room
- Endpoints para cambiar estado operativo y de limpieza
- CRUD de RoomFurniture (inventario por habitación)
- Query de habitaciones disponibles para un rango de fechas

---

### GUESTS (huéspedes)

**Qué resuelve:** el perfil del cliente del hotel.

`Guest` tiene datos personales, documento de identidad (DNI, pasaporte),
nacionalidad, idioma preferido y nivel VIP (0=normal, 1=VIP, 2=VVIP).
El `vipLevel` afecta el tratamiento en recepción (upgrades, amenities, etc.).

`GuestStaysSummary` es una tabla derivada que acumula estadísticas de
fidelización: total de estadías, noches, gasto total, primera y última visita.
Se actualiza cada vez que se cierra un folio.

**Regla clave:** los huéspedes se buscan por documento (DNI o pasaporte)
antes de crear uno nuevo. No debe haber duplicados por mismo documento.

**Lo que se implementa:**

- CRUD de Guest con búsqueda por doc, email, nombre
- Vista de historial del huésped
- Actualización del summary al hacer check-out

---

### DISPONIBILIDAD

**Qué resuelve:** saber qué se puede vender para unas fechas dadas.

La consulta de disponibilidad es el corazón del motor de reservas. Dado un
rango de fechas (check-in / check-out), retorna qué tipos de habitación tienen
unidades libres y a qué precio.

**Lógica:** una habitación está NO disponible para un rango si existe alguna
reserva con status `CONFIRMED`, `CHECKED_IN` o `TENTATIVE` reciente cuyas
fechas se solapan con el rango consultado. El solapamiento es:
`reserva.checkInDate < consultaCheckOut AND reserva.checkOutDate > consultaCheckIn`

**Lo que se implementa:**

- Query de habitaciones disponibles por tipo para un rango de fechas
- La respuesta incluye precio calculado según canal y temporada
- Se usa tanto en el flujo de reserva como en el panel de recepción

---

### RESERVAS

**Qué resuelve:** la promesa de que un huésped tendrá una habitación.

`Reservation` vincula un huésped, un tipo de habitación (no una habitación
específica todavía), un canal de venta, un plan tarifario, y unas fechas.
La habitación específica se asigna al hacer check-in.

**Ciclo de vida completo:**

```
TENTATIVE → (pago DEPOSIT registrado) → CONFIRMED
CONFIRMED → (llega el día, check-in) → CHECKED_IN
CHECKED_IN → (check-out) → CHECKED_OUT

CONFIRMED → (huésped no llegó) → NO_SHOW
TENTATIVE | CONFIRMED → (cliente cancela) → CANCELLED
```

**Regla crítica:** la transición `TENTATIVE → CONFIRMED` solo ocurre si
existe un `Payment` con `concept = DEPOSIT` y `status = CONFIRMED` para
esa reserva. El sistema debe validar esto antes de confirmar.

**Campos informativos** (no restricciones del sistema):

- `adults` y `children`: para que recepción prepare cunas, sillas altas, etc.
- `specialRequests`: notas libres (cumpleaños, alergias, hora de llegada)
- `arrivalTime`: hora estimada de llegada, para coordinar con housekeeping

**Lo que se implementa:**

- Crear reserva (validar disponibilidad → crear en TENTATIVE)
- Listar reservas con filtros (por fecha, estado, canal, huésped)
- Modificar reserva (cambio de fechas, tipo de habitación)
- Cancelar reserva (con lógica de penalidad según política)
- Marcar no-show

---

### PAGOS

**Qué resuelve:** todo movimiento de dinero, trazable y auditable.

`Payment` es la tabla unificada para todos los flujos de dinero. Siempre
está ligado a una `Reservation`. Cuando hay estadía, también se liga al
`Folio`.

**Conceptos de pago:**

- `DEPOSIT`: anticipo al confirmar reserva. Nace con `folio = null`.
  Al hacer check-in se marca `APPLIED` y se llena `folioId`.
- `BALANCE`: pago del saldo restante al hacer check-out.
- `EXTRA`: abono parcial durante la estadía.
- `REFUND`: devolución al huésped. Lleva `parentPaymentId` apuntando
  al DEPOSIT original para trazabilidad.
- `FORFEITED`: depósito retenido por no-show o cancelación tardía.

**Métodos:** CASH, VISA, MASTERCARD, AMEX, TRANSFER, AGENCY_CREDIT, VOUCHER.

**Regla:** un pago no se edita. Si hay un error, se `VOID` y se crea uno
nuevo. El campo `parentPaymentId` permite construir el árbol de relaciones
entre pagos originales y sus correcciones o devoluciones.

**Lo que se implementa:**

- Registrar depósito (y disparar confirmación de reserva)
- Aplicar depósito al folio al hacer check-in
- Registrar pago de saldo al check-out
- Procesar devolución (crea un REFUND ligado al DEPOSIT)
- Marcar forfeited en no-show o cancelación sin reembolso

---

### CHECK-IN

**Qué resuelve:** el momento en que el huésped llega y ocupa la habitación.

El check-in es una operación compuesta que dispara varios efectos:

1. Validar que la reserva está en `CONFIRMED`
2. Asignar una habitación física específica (`Room` en `AVAILABLE` + `CLEAN`
   del tipo reservado)
3. Crear el registro `Stay` con hora exacta de entrada
4. Crear el `Folio` (la cuenta del huésped) con número único
5. Mover el `Payment DEPOSIT` a `status = APPLIED` y ligarlo al folio
6. Cambiar `Room.status` a `OCCUPIED`
7. Cambiar `Reservation.status` a `CHECKED_IN`

**Regla:** la habitación asignada debe ser del tipo reservado, estar en
`AVAILABLE` y en `CLEAN` (o al menos `INSPECTING`). Si no hay ninguna
disponible del tipo exacto, recepción puede ofrecer un upgrade.

**Lo que se implementa:**

- Endpoint de check-in que ejecuta todos los pasos como transacción atómica
- Consulta de habitaciones disponibles para asignar en ese momento
- El `checkinById` registra qué recepcionista hizo el check-in

---

### FOLIO + CARGOS

**Qué resuelve:** la cuenta corriente del huésped durante su estadía.

El `Folio` es la cuenta abierta desde check-in hasta check-out. Acumula
todos los consumos del huésped en `FolioCharge`.

**Cargos que se generan:**

- **Automáticos:** el cargo de habitación por noche se registra cada día
  (job nocturno o al hacer check-out para todas las noches)
- **Manuales:** recepción o los puntos de venta cargan restaurante, spa,
  tours, minibar, lavandería, etc.

Cada `FolioCharge` referencia un `Service` del catálogo, tiene cantidad,
precio unitario, y los campos calculados (subtotal, IGV, total) que la BD
calcula automáticamente.

**Un cargo no se borra:** si hay un error, se pone `void = true` con su
razón (`voidReason`) y se crea el cargo correcto. El folio refleja el
historial completo.

`Folio.balance` es un campo calculado: `totalCharges - totalPayments`.
Al hacer check-out este balance debe ser cero (o negativo si hay crédito).

**Lo que se implementa:**

- Agregar cargo al folio (manual desde recepción)
- Job automático de cargo de habitación por noche
- Anular cargo (void) con razón
- Consultar estado actual del folio (balance en tiempo real)

---

### CHECK-OUT

**Qué resuelve:** el cierre de la estadía y cobro del saldo.

El check-out es también una operación compuesta:

1. Calcular el balance del folio (`totalCharges - pagosAplicados`)
2. Si hay saldo pendiente, registrar el pago `BALANCE`
3. Cerrar el folio (`status = CLOSED`, llenar `closedAt`)
4. Registrar hora de salida en `Stay.checkOutAt`
5. Cambiar `Stay.status` a `CHECKED_OUT`
6. Cambiar `Room.status` a `CLEANING` y `housekeepingStatus` a `DIRTY`
7. Cambiar `Reservation.status` a `CHECKED_OUT`
8. Emitir el comprobante (Boleta o Factura según lo que pida el huésped)
9. Actualizar `GuestStaysSummary` con las estadísticas de esta estadía

**Regla:** no se puede hacer check-out si el balance del folio es positivo
(el huésped debe dinero). Si el balance es negativo (pagó de más), se
registra un `REFUND`.

**Lo que se implementa:**

- Endpoint de check-out como transacción atómica
- El `checkoutById` registra qué recepcionista hizo el check-out

---

### FACTURACIÓN (SUNAT)

**Qué resuelve:** la emisión de comprobantes tributarios peruanos.

Al hacer check-out el huésped puede pedir una `BOLETA` (persona natural,
con DNI o pasaporte) o una `FACTURA` (empresa, con RUC). El comprobante
se genera a partir del folio cerrado.

Los campos clave para SUNAT: `series` (B001 para boletas, F001 para
facturas), `number` (correlativo), `subtotal`, `igv` (18% sobre lo gravado),
`total`. Los servicios de tipo TOUR están exonerados de IGV.

Si hay un error en el comprobante emitido, no se edita: se emite una
`NOTA_CRED` (nota de crédito) que lo anula y opcionalmente se emite uno nuevo.

`sunatStatus` trackea el resultado del envío a los servicios de SUNAT:
`PENDING → ACCEPTED` en el flujo normal, `REJECTED` si hay error en los datos.

**Lo que se implementa:**

- Generación de boleta/factura al hacer check-out
- Correlativo automático por serie
- Cálculo de IGV separando servicios gravados y exonerados
- Emisión de nota de crédito para anulaciones

---

## Orden de implementación recomendado

### Fase 1 — Cimientos (datos maestros)

Sin estos no hay nada que reservar ni cobrar. Son CRUDs simples.

| Módulo              | Dependencias                        | Prioridad |
| ------------------- | ----------------------------------- | --------- |
| Auth + Staff        | better-auth                         | 1         |
| RoomType + Muebles  | Staff (para auditoría)              | 2         |
| Channels + Agencies | Staff                               | 2         |
| Seasons + RatePlans | —                                   | 2         |
| Rates               | RoomType, RatePlan, Season, Channel | 3         |
| Services            | —                                   | 2         |

### Fase 2 — Inventario

Con los catálogos listos, se crean las instancias reales.

| Módulo                 | Dependencias           | Prioridad |
| ---------------------- | ---------------------- | --------- |
| Rooms (CRUD + estados) | RoomType               | 4         |
| RoomFurniture          | Room, FurnitureCatalog | 5         |
| Guests                 | —                      | 4         |
| Disponibilidad (query) | Room, Reservation      | 5         |

### Fase 3 — Núcleo operativo

El flujo central del hotel. Implementar en este orden estricto.

| Módulo                    | Dependencias                          | Prioridad |
| ------------------------- | ------------------------------------- | --------- |
| Crear reserva (TENTATIVE) | Guest, RoomType, RatePlan, Channel    | 6         |
| Registrar depósito        | Reservation                           | 7         |
| Confirmar reserva         | Reservation + Payment DEPOSIT         | 7         |
| Check-in                  | Reservation CONFIRMED, Room AVAILABLE | 8         |

### Fase 4 — Facturación y cierre

| Módulo                                 | Dependencias         | Prioridad |
| -------------------------------------- | -------------------- | --------- |
| Cargos al folio                        | Folio, Service       | 9         |
| Job cargo habitación                   | Folio, Stay activo   | 9         |
| Check-out                              | Stay, Folio, Payment | 10        |
| Facturación SUNAT                      | Folio cerrado        | 11        |
| Reportes (ocupación, RevPAR, ingresos) | Todos                | 12        |

---

## Casos de borde importantes

### No-show

El huésped no llegó en la fecha de check-in. El depósito se retiene
(`Payment.status = FORFEITED`). La reserva pasa a `NO_SHOW`. La habitación
que estaba en `RESERVED` vuelve a `AVAILABLE`.

### Cancelación

Depende de la política del plan tarifario (`cancelPolicy`):

- `FLEXIBLE`: se puede cancelar hasta N horas antes sin penalidad →
  `Payment.status = REFUNDED`
- `NON_REFUND`: no hay devolución sin importar cuándo cancela →
  `Payment.status = FORFEITED`
- `MODERATE` / `STRICT`: penalidad parcial dependiendo de cuándo cancela →
  REFUND parcial + FORFEITED por la penalidad

### Upgrade de habitación

Si no hay habitaciones del tipo reservado al momento del check-in, recepción
puede asignar un tipo superior sin costo adicional (upgrade). La reserva
mantiene su `roomTypeId` original, pero el `Stay` apunta a una habitación
de tipo distinto.

### Salida anticipada (early departure)

El huésped quiere salir antes de la fecha de check-out. Dependiendo de la
política puede haber cargo por las noches no utilizadas o no. El folio se
cierra con las noches reales, `Stay.status = EARLY_DEPARTURE`.

### Familia con múltiples habitaciones

Un huésped puede tener varias reservas activas simultáneamente (una para él
y su pareja, otra para los hijos). Son reservas independientes, cada una con
su propio folio. Se vinculan solo a través del `Guest`. No existe el concepto
de "grupo de reservas" en este modelo.

### Depósito insuficiente

Si el huésped pagó un depósito menor al total de la reserva (agencias con
crédito, por ejemplo), al check-out el balance del folio será mayor. Se
registra un `Payment BALANCE` por la diferencia.

---

## Queries clave que el agente debe conocer

### Disponibilidad por rango de fechas

Habitaciones ocupadas son aquellas con reserva `CONFIRMED` o `CHECKED_IN`
cuyas fechas se solapan con el rango buscado. El solapamiento ocurre cuando:
`reserva.checkIn < busqueda.checkOut AND reserva.checkOut > busqueda.checkIn`

### Balance del folio en tiempo real

`balance = SUM(folio_charges donde void=false) - SUM(payments donde status IN [CONFIRMED, APPLIED])`

### Ingresos netos por canal

`ingresoNeto = totalAmount * (1 - commissionPct / 100)`
Solo contar reservas con status `CHECKED_OUT` para ingresos realizados.

### RevPAR (Revenue per Available Room)

`RevPAR = totalIngresoHabitaciones / totalHabitacionesDisponibles`
Métrica estándar de la industria hotelera para medir performance.

---

## Lo que este sistema NO modela (fuera de scope)

- **Channel Manager**: sincronización en tiempo real con Booking/Expedia.
  Las reservas de OTAs se ingresan manualmente o via importación.
- **Revenue Management dinámico**: ajuste automático de precios según
  ocupación. Las tarifas se gestionan manualmente por temporada.
- **Gestión de eventos / grupos**: reservas de grupos con cotización especial.
- **Punto de venta de restaurante**: el restaurante solo carga al folio del
  huésped, no tiene su propio sistema de mesas/comandas.
- **Mantenimiento preventivo**: el módulo de muebles trackea estado pero no
  gestiona órdenes de trabajo de mantenimiento.
