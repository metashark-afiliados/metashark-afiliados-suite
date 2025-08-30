// .docs/espejo/system/004_SERVER_ACTIONS_ARCHITECTURE_MANIFEST.md
/**
 * @file .docs/espejo/system/004_SERVER_ACTIONS_ARCHITECTURE_MANIFEST.md
 * @description Documento Espejo y SSoT conceptual para el Manifiesto de Server Actions.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto Conceptual: Arquitectura de Server Actions v2.0

## 1. Rol Estratégico y Propósito
Este documento es la SSoT canónica que detalla la implementación técnica de la filosofía **"Lógica de Negocio Pura, Blindada por Defecto"**, correspondiente al **Pilar 3 de la Constitución Arquitectónica**. Su propósito es definir los patrones, estructura y estándares de élite para toda la lógica de negocio del lado del servidor en ConvertiKit.

## 2. Arquitectura del Contenido
El manifiesto se estructura en los patrones de élite que rigen la creación de Server Actions:
1.  **El Patrón "Secure Action Factory":** Detalla la arquitectura del wrapper de alto orden que automatiza la seguridad.
2.  **El Mandato de las RPCs:** Explica la directiva de usar funciones de PostgreSQL para operaciones transaccionales.
3.  **El Ciclo de Vida Canónico:** Describe el flujo secuencial que una acción debe seguir.
4.  **Contrato de Comunicación:** Define la API de entrada (`FormData`) y salida (`ActionResult`).
5.  **Estructura de Ficheros:** Documenta la organización atómica de las acciones por dominio.

## 3. Contrato de API
- **Formato de Entrada:** Contenido consolidado de los manifiestos de Server Actions obsoletos.
- **Formato de Salida:** Documento Markdown que sirve como la SSoT técnica detallada para la arquitectura de Server Actions.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Factoría de Acciones Genérica:** Crear una `createGenericAction` que abstraiga patrones comunes más allá de la seguridad, como el logging de auditoría y la revalidación de caché.
 * 2.  **Inyección de Dependencias:** Desarrollar un patrón para inyectar dependencias (como `supabaseClient` o `logger`) en la `businessLogic`, facilitando las pruebas unitarias aisladas.
 * 3.  **Validación de `ActionResult`:** Implementar un guardián de tipo (`isActionResult`) para validar que el retorno de las acciones siempre cumpla el contrato.
 * 4.  **Manejo de Errores de RPC:** Estandarizar cómo las funciones RPC de PostgreSQL devuelven errores y cómo la capa de Server Actions los interpreta y mapea a `error_code`s de i18n.
 * 5.  **Documentación Automática de API:** Crear un script que lea los schemas Zod de entrada de cada acción y genere automáticamente una documentación de API (ej. en Postman o Swagger).
 * 6.  **Tipado de `FormData`:** Investigar librerías o patrones para proporcionar un tipado más estricto a los objetos `FormData`.
 * 7.  **Rate Limiting Integrado:** Integrar la lógica de `rate-limiter.helper.ts` directamente en la `createSecureAction` factory.
 * 8.  **Gestión de Transiciones en Cliente:** Documentar el patrón canónico para usar `useTransition` en el cliente al invocar acciones desde la `Secure Action Factory`.
 * 9.  **Logging de Performance:** Integrar `performance.now()` en la factoría para medir y registrar automáticamente la duración de la ejecución de la `businessLogic`.
 * 10. **Internacionalización de la Documentación:** Traducir este manifiesto para equipos de desarrollo multilingües.
 * =====================================================================
 */
// .docs/espejo/system/004_SERVER_ACTIONS_ARCHITECTURE_MANIFEST.md