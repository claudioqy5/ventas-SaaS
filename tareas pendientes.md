# Tareas Pendientes

## 🤖 Implementación de Bot de WhatsApp con IA para la Tienda E-Commerce

### 📌 Prerrequisito
- [ ] **Comprar un chip / número de teléfono dedicado** exclusivo para esta tienda/empresa para mantener la facturación, métricas e identidad de marca totalmente aisladas del otro sistema.

---

### 🚀 Pasos a realizar una vez comprado el chip

1. **Configuración en Meta Developer (WhatsApp Cloud API)**
   - Dar de alta la nueva línea telefónica en el Meta Business Manager.
   - Configurar el perfil comercial (nombre de la empresa, logo, descripción y horarios).
   - Generar el Token de Acceso y obtener el `Phone Number ID`.

2. **Creación del Flujo en n8n (Hostinger VPS)**
   - Configurar un nodo **Webhook** exclusivo para recibir los mensajes entrantes de Meta.
   - Crear el flujo de consulta al Backend `.NET` (endpoints públicos de productos, precios y stock en tiempo real).
   - Integrar el nodo de **Inteligencia Artificial** (Google Gemini 1.5 Flash / OpenAI GPT-4o-mini) con el System Prompt con personalidad de la marca.
   - Probar el envío de respuestas automáticas y fluidas al cliente en WhatsApp.

---

### 💰 Desglose de Costos Estimados

| Componente | Tráfico (< 1,000 chats/mes) | Observaciones |
| :--- | :--- | :--- |
| **Meta WhatsApp** | **$0.00** | Meta incluye 1,000 conversaciones de servicio **GRATIS** al mes por número. |
| **Motor de IA** | **$0.00** (Gemini) / **~$0.50** (OpenAI) | Google Gemini 1.5 Flash ofrece cuota gratuita. OpenAI (GPT-4o-mini) cuesta centavos. |
| **n8n / Servidor** | **$0.00** | Desplegado en la infraestructura VPS actual (Docker). |
