# Arquitectura y Especificación del Sistema

Este documento describe la arquitectura para la **POC Activación de Servicios con Kafka** de la materia Sistemas Distribuidos (UTN FRCU - 2026).

## Resumen del Flujo de Activación

```mermaid
flowchart TD
  UI["Demo UI (React)"] -->|POST /activations| API["activation-api"]
  API -->|publica| AR["activation.requested"]
  
  AR -->|consume| Billing["billing-service"]
  AR -->|consume| Prov["provisioning-service"]
  AR -->|consume| CRM["crm-analytics-service"]
  
  Billing -->|publica BillingAccountCreated / BillingFailed| BE["billing.events"]
  Prov -->|publica ProvisioningCompleted / ProvisioningFailed| PE["provisioning.events"]
  
  BE -->|consume| API
  PE -->|consume| API
  
  API -->|Agrega resultados| AE["activation.events (Completed / Failed)"]
  AE -->|consume| Notif["notification-service"]
  AE -->|consume si FAILED para compensar| Billing
  AE -->|consume| CRM
  
  API -.->|WebSocket / SSE| UI
```

## Topics de Kafka (3 Particiones c/u, Clave = customerId)
1. `activation.requested` y `activation.requested.dlq`
2. `billing.events` y `billing.events.dlq`
3. `provisioning.events` y `provisioning.events.dlq`
4. `activation.events` y `activation.events.dlq`
