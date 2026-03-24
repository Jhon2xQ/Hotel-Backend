# Preguntas Frecuentes y Mejores Prácticas

Este documento responde las preguntas más comunes sobre el uso del Sistema de Gestión Hotelera y proporciona recomendaciones para su uso óptimo.

---

## Índice

1. [Preguntas Frecuentes](#preguntas-frecuentes)
2. [Mejores Prácticas Operativas](#mejores-prácticas-operativas)
3. [Solución de Problemas Comunes](#solución-de-problemas-comunes)
4. [Consejos de Seguridad](#consejos-de-seguridad)

---

## Preguntas Frecuentes

### Gestión de Reservas

**P: ¿Puedo modificar una reserva después de crearla?**
R: Sí, las reservas pueden modificarse mientras no estén en estado COMPLETADA. Puedes cambiar fechas, habitación, número de huéspedes y aplicar descuentos. Las reservas completadas son inmutables para mantener el historial.

**P: ¿Qué pasa si un cliente no llega (No Show)?**
R: Debes cambiar el estado de la reserva a NO_LLEGO. Esto libera la habitación y mantiene el registro del evento. Si hubo pago adelantado, según tu política, puedes retenerlo.

**P: ¿Cómo cancelo una reserva?**
R: Usa el botón "Cancelar reserva", ingresa el motivo de cancelación y confirma. El sistema cambiará el estado a CANCELADA, liberará la habitación y registrará la fecha de cancelación.

**P: ¿Puedo crear una reserva sin huésped registrado?**
R: No, primero debes registrar al huésped en el sistema. Esto asegura que tengas todos los datos necesarios y evita duplicados.

**P: ¿El sistema calcula automáticamente el precio total?**
R: Sí, el sistema calcula automáticamente el monto total basándose en:

- Precio por noche de la tarifa seleccionada
- Número de noches (diferencia entre fecha de salida y entrada)
- Descuentos aplicados
- IVA y cargos por servicio configurados

### Gestión de Habitaciones

**P: ¿Puedo tener dos habitaciones con el mismo número?**
R: No, el número de habitación debe ser único en todo el sistema. Esto evita confusiones operativas.

**P: ¿Quién puede cambiar el estado de una habitación?**
R: Cualquier usuario autenticado puede actualizar el estado de una habitación (DISPONIBLE, OCUPADA, LIMPIEZA, MANTENIMIENTO). Esto permite que el personal de limpieza y recepción actualice estados en tiempo real.

**P: ¿Qué hago si una habitación necesita mantenimiento urgente?**
R: Cambia el estado de la habitación a MANTENIMIENTO inmediatamente. Esto la sacará de la disponibilidad y evitará que se asigne a nuevas reservas.

**P: ¿Cómo sé cuándo se limpió una habitación por última vez?**
R: El sistema registra automáticamente la fecha de última limpieza cuando cambias el estado a LIMPIEZA. Puedes consultar este dato en los detalles de la habitación.

### Check-in y Check-out

**P: ¿Puedo hacer check-in sin una reserva previa?**
R: Sí, puedes crear una "reserva express" en el momento del check-in. El sistema te permitirá crear la reserva y hacer el check-in inmediatamente.

**P: ¿Qué pasa si un huésped quiere hacer check-out antes de la fecha programada?**
R: Puedes realizar el check-out normalmente. El sistema registrará la fecha real de salida. Opcionalmente, puedes marcar la estancia como SALIDA_ANTICIPADA.

**P: ¿Puedo modificar una estancia después del check-out?**
R: No, las estancias completadas son inmutables. Esto protege la integridad del historial y los registros contables.

**P: ¿El sistema genera automáticamente el folio?**
R: Sí, el sistema crea automáticamente un folio cuando realizas el check-in. El folio acumula todos los cargos durante la estancia.

### Pagos

**P: ¿El sistema procesa pagos con tarjetas o pasarelas de pago?**
R: NO. El sistema solo REGISTRA que recibiste un pago. El cobro real (con terminal POS, efectivo, transferencia bancaria) lo haces fuera del sistema. Luego ingresas al sistema para registrar que recibiste ese pago y por qué método.

**P: ¿Puedo registrar pagos en diferentes monedas?**
R: Sí, el sistema soporta múltiples monedas. Puedes configurar la moneda al registrar cada pago.

**P: ¿Qué métodos de pago puedo registrar?**
R: Puedes indicar que el pago se realizó por: EFECTIVO, VISA, MASTERCARD, AMEX o TRANSFERENCIA. Esto es solo informativo para llevar control. El sistema NO procesa estos pagos.

**P: ¿Cómo registro un pago?**
R: Primero, el cliente te paga fuera del sistema (con efectivo, tarjeta en tu terminal POS, transferencia, etc.). Luego entras al sistema, vas a "Pagos", creas un nuevo registro indicando el monto, el método usado y lo asocias a la reserva correspondiente.

**P: ¿Puedo asociar un pago a una reserva después de crearla?**
R: Sí, al crear o editar un pago, puedes asociarlo a una reserva existente. Esto es útil cuando el cliente paga después de hacer la reserva.

**P: ¿Cómo registro un reembolso?**
R: Busca el pago original y cambia su estado a DEVUELTO. Opcionalmente, puedes agregar observaciones explicando el motivo del reembolso. Recuerda que el reembolso real (devolver el dinero al cliente) lo haces fuera del sistema.

### Tarifas y Canales

**P: ¿Puedo tener diferentes precios para el mismo tipo de habitación?**
R: Sí, puedes configurar diferentes tarifas para el mismo tipo de habitación según el canal de venta. Por ejemplo, el precio directo puede ser menor que el precio en Booking.com.

**P: ¿Cómo actualizo las tarifas para temporada alta?**
R: Edita las tarifas existentes y actualiza el precio por noche. El cambio aplicará inmediatamente a nuevas reservas. Las reservas existentes mantienen el precio original.

**P: ¿Qué es un canal de venta?**
R: Un canal es el medio por el cual llega una reserva: OTA (Booking, Expedia), Directo (teléfono, email, presencial) o Agente (agencias de viaje).

### Inventario

**P: ¿Debo registrar todos los muebles del hotel?**
R: Se recomienda registrar los muebles principales y de valor (camas, televisores, aires acondicionados, etc.). No es necesario registrar items pequeños como toallas o sábanas.

**P: ¿Cómo marco un mueble como dañado?**
R: Edita el mueble y cambia su condición a DAÑADO. Opcionalmente, agrega una descripción del daño en el campo de observaciones.

**P: ¿Puedo mover un mueble de una habitación a otra?**
R: Sí, edita el mueble y cambia la habitación asignada. El sistema actualizará la asignación inmediatamente.

---

## Mejores Prácticas Operativas

### Para Recepcionistas

**1. Verificar Disponibilidad Antes de Confirmar**

- Siempre consulta la disponibilidad en el sistema antes de confirmar una reserva al cliente
- Verifica que la habitación esté en estado DISPONIBLE
- Confirma que no haya reservas superpuestas

**2. Registrar Pagos Inmediatamente**

- Registra los pagos en el sistema tan pronto como los recibas
- Esto mantiene la información financiera actualizada
- Facilita la conciliación al final del día

**3. Actualizar Estados en Tiempo Real**

- Cambia el estado de las habitaciones inmediatamente después del check-in/check-out
- Esto permite que el equipo tenga información precisa
- Evita asignar habitaciones que no están listas

**4. Documentar Observaciones**

- Usa el campo de observaciones para registrar solicitudes especiales del huésped
- Anota cualquier incidente o situación particular
- Esto ayuda al equipo a brindar mejor servicio

**5. Verificar Datos del Huésped**

- Confirma que el email y teléfono sean correctos
- Verifica la identidad del huésped al hacer check-in
- Mantén los datos actualizados

### Para Personal de Limpieza

**1. Actualizar Estado Después de Limpiar**

- Cambia el estado de la habitación a DISPONIBLE cuando termines la limpieza
- Esto permite que recepción asigne la habitación inmediatamente
- Registra la fecha de última limpieza

**2. Reportar Daños Inmediatamente**

- Si encuentras muebles dañados, repórtalo en el sistema
- Cambia la condición del mueble a DAÑADO
- Notifica al supervisor para que programe reparación

**3. Priorizar Habitaciones con Llegadas**

- Limpia primero las habitaciones con check-in programado para ese día
- Consulta el sistema para ver las reservas del día
- Coordina con recepción si hay retrasos

### Para Administradores

**1. Revisar Reportes Regularmente**

- Consulta el estado de ocupación diariamente
- Revisa los pagos pendientes semanalmente
- Analiza las cancelaciones mensualmente

**2. Mantener Tarifas Actualizadas**

- Ajusta las tarifas según la temporada
- Revisa la competencia periódicamente
- Actualiza los precios con anticipación

**3. Gestionar Usuarios Activamente**

- Desactiva usuarios que ya no trabajan en el hotel
- Asigna roles apropiados según las responsabilidades
- Revisa los permisos periódicamente

**4. Realizar Respaldos**

- Asegúrate de que los respaldos automáticos funcionen
- Verifica la integridad de los respaldos mensualmente
- Mantén copias en ubicaciones seguras

**5. Capacitar al Personal**

- Entrena a nuevos empleados en el uso del sistema
- Actualiza al equipo sobre nuevas funcionalidades
- Documenta procedimientos internos

### Para Todo el Personal

**1. Mantener Sesión Segura**

- Cierra sesión cuando te alejes de la computadora
- No compartas tu contraseña con otros
- Usa contraseñas seguras

**2. Verificar Antes de Eliminar**

- Ten cuidado al eliminar registros
- Verifica que no haya información relacionada
- Considera cancelar en lugar de eliminar

**3. Comunicación con el Equipo**

- Usa las observaciones para comunicar información importante
- Notifica cambios importantes al equipo
- Coordina con otros departamentos

---

## Solución de Problemas Comunes

### Problema: No puedo crear una reserva

**Posibles causas y soluciones**:

1. **El huésped no existe**
   - Solución: Registra primero al huésped en el sistema

2. **La habitación no está disponible**
   - Solución: Verifica el estado de la habitación y las fechas de otras reservas

3. **No hay tarifas configuradas**
   - Solución: Configura al menos una tarifa para el tipo de habitación y canal

4. **Las fechas son inválidas**
   - Solución: Verifica que la fecha de salida sea posterior a la fecha de entrada

### Problema: No puedo hacer check-in

**Posibles causas y soluciones**:

1. **No tienes permisos de ADMIN**
   - Solución: Solicita a un administrador que realice el check-in o que te otorgue permisos

2. **La reserva no existe**
   - Solución: Verifica el código de reserva o crea una reserva express

3. **La habitación está ocupada**
   - Solución: Verifica el estado de la habitación y realiza el check-out previo si es necesario

### Problema: No puedo modificar una reserva

**Posibles causas y soluciones**:

1. **La reserva está completada**
   - Solución: Las reservas completadas son inmutables. No se pueden modificar.

2. **No tienes permisos**
   - Solución: Solo usuarios ADMIN pueden modificar reservas

### Problema: El sistema no calcula bien el precio

**Posibles causas y soluciones**:

1. **La tarifa no está configurada correctamente**
   - Solución: Verifica el precio por noche, IVA y cargos por servicio en la tarifa

2. **Las fechas están mal ingresadas**
   - Solución: Verifica que las fechas de entrada y salida sean correctas

3. **El descuento está mal aplicado**
   - Solución: Verifica el monto del descuento ingresado

### Problema: No aparecen habitaciones disponibles

**Posibles causas y soluciones**:

1. **Todas las habitaciones están reservadas**
   - Solución: Verifica las fechas o sugiere fechas alternativas al cliente

2. **Las habitaciones están en mantenimiento**
   - Solución: Cambia el estado de las habitaciones que ya estén listas

3. **Hay un error en las fechas de búsqueda**
   - Solución: Verifica que las fechas sean correctas y estén en el futuro

---

## Consejos de Seguridad

### Protección de Datos

**1. Contraseñas Seguras**

- Usa al menos 8 caracteres
- Combina letras mayúsculas, minúsculas, números y símbolos
- No uses información personal (nombre, fecha de nacimiento)
- Cambia tu contraseña cada 3 meses

**2. Protección de Información del Huésped**

- No compartas datos personales de huéspedes con terceros
- No dejes pantallas con información sensible visibles
- Cierra sesión cuando no uses el sistema
- No tomes fotos de pantallas con datos de clientes

**3. Acceso al Sistema**

- Cada usuario debe tener su propia cuenta
- No compartas tu usuario y contraseña
- Reporta inmediatamente si sospechas que tu cuenta fue comprometida
- No accedas al sistema desde computadoras públicas

### Respaldo de Información

**1. Respaldos Automáticos**

- El sistema realiza respaldos automáticos diarios
- Verifica que los respaldos se completen exitosamente
- Mantén al menos 30 días de respaldos

**2. Respaldos Manuales**

- Realiza respaldos manuales antes de cambios importantes
- Guarda copias en ubicaciones diferentes
- Prueba la restauración periódicamente

### Prevención de Errores

**1. Verificación Doble**

- Verifica los datos antes de confirmar operaciones importantes
- Revisa los montos de pago antes de registrarlos
- Confirma la identidad del huésped en check-in

**2. Capacitación Continua**

- Mantente actualizado sobre las funcionalidades del sistema
- Participa en capacitaciones cuando estén disponibles
- Consulta la documentación ante dudas

**3. Comunicación de Problemas**

- Reporta errores o comportamientos extraños inmediatamente
- Documenta los pasos que causaron el problema
- No intentes "arreglar" problemas técnicos por tu cuenta

---

## Contacto y Soporte

Para soporte técnico o consultas sobre el sistema, contacta a:

- **Administrador del Sistema**: [Contacto interno]
- **Soporte Técnico**: [Información de contacto]
- **Documentación**: Consulta los archivos en `/docs/`

---

## Actualizaciones de este Documento

Este documento se actualiza periódicamente. Última actualización: Marzo 2026

Para sugerencias o correcciones, contacta al administrador del sistema.
