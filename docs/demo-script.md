# Guión de Demostración (5 Escenarios)

Disposición recomendada de pantalla dividida:
- **Izquierda:** Demo UI (`http://localhost:5173`)
- **Derecha:** Kafka UI (`http://localhost:8080`) y Mailhog (`http://localhost:8025`)

---

### Escenario 1: Camino Feliz (Fan-out)
- **Acción en UI:** Contratar un plan indicando cliente `C-1001`, plan `PLAN DIGITAL` y modo de fallo `Ninguno`.
- **Efecto visual en UI:** Timeline muestra en verde secuencialmente:
  1. `ActivationRequested`
  2. `BillingAccountCreated` y `ProvisioningCompleted` (procesamiento en paralelo)
  3. `ActivationCompleted`
- **Mailhog:** Llega el email de bienvenida confirmando la activación.
- **Concepto clave demostrado:** Fan-out reactivo (un solo evento en Kafka dispara múltiples acciones sin acoplamiento punto a punto).

---

### Escenario 2: Fallo y Compensación (Saga sin llamadas directas)
- **Acción en UI:** Contratar indicando cliente `C-1002`, plan `PLAN FIBRA` y simular fallo en `Provisioning`.
- **Efecto visual en UI:**
  1. `ActivationRequested`
  2. `BillingAccountCreated` (billing procede con éxito)
  3. `ProvisioningFailed` (provisioning falla según lo solicitado)
  4. `ActivationFailed` (activation-api agrega y detecta el fallo)
  5. `BillingAccountCancelled` (billing consume `ActivationFailed` y ejecuta compensación anulando la cuenta)
- **Mailhog:** Llega email informando el error y la anulación del proceso.
- **Concepto clave demostrado:** Patrón Saga coreografiada con compensación automática mediante eventos.

---

### Escenario 3: Servicio Caído y Lag (Offset Commit)
- **Acción:**
  1. Detener notification-service:
     ```bash
     docker compose stop notification-service
     ```
  2. Crear 3 activaciones exitosas desde la UI.
  3. Observar en **Kafka UI** cómo el consumer lag del grupo de notificaciones aumenta a 3.
  4. Volver a iniciar el servicio:
     ```bash
     docker compose start notification-service
     ```
- **Resultado:** El servicio reanuda desde su último offset confirmado y procesa los 3 emails pendientes de inmediato sin pérdida de datos.
- **Concepto clave demostrado:** Tolerancia a caídas y persistencia desacoplada con Kafka Offsets.

---

### Escenario 4: Escalabilidad Horizontal y Rebalanceo
- **Acción:**
  1. Escalar billing a 2 instancias:
     ```bash
     docker compose up -d --scale billing-service=2
     ```
  2. Revisar en **Kafka UI** la pestaña de Consumer Groups para `billing-group`.
- **Resultado:** Las 3 particiones del topic se reparten automáticamente (ej. 2 particiones para una instancia y 1 para la otra).
- **Concepto clave demostrado:** Consumer Groups y escalado dinámico con rebalanceo automático.

---

### Escenario 5: Replay del Log Histórico con Nuevo Consumidor
- **Acción:**
  1. Levantar el servicio `loyalty-service` con `auto.offset.reset=earliest` en un nuevo grupo consumidor:
     ```bash
     docker compose --profile loyalty up -d loyalty-service
     ```
- **Resultado:** El nuevo servicio lee todo el historial de eventos desde el offset 0, acumulando puntos de fidelidad para los clientes históricos sin modificar los servicios existentes.
- **Concepto clave demostrado:** Inmutabilidad del log de eventos y capacidad de time-travel / replay de datos históricos.
