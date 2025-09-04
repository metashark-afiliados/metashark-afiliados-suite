// .docs-espejo/lib/validators/schemas/telemetry.schemas.md
/**
 * @file telemetry.schemas.md
 * @description Documento Espejo y SSoT para los schemas de validación de telemetría.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Conceptual: Schemas de Validación de Telemetría

## 1. Rol Estratégico y Propósito
Este aparato es el **guardián de la integridad de datos** para el sistema de telemetría. Su única responsabilidad es definir los contratos de datos (`schemas` de Zod) para los payloads de telemetría, asegurando que todos los datos que ingresan al sistema, tanto desde el middleware como desde el cliente, tengan la forma y el tipo correctos.

## 2. Arquitectura del Contenido
1.  **Composición de Schemas Base (DRY):** Los schemas de este módulo consumen primitivas de validación (`UuidSchema`, `EmailSchema`, etc.) desde la SSoT de schemas base (`_base.schemas.ts`), adhiriéndose estrictamente al principio DRY.
2.  **Schemas Atómicos por Caso de Uso (SRP):** El módulo define schemas distintos para diferentes operaciones:
    *   `VisitorLogSchema`: Valida el payload completo para la creación inicial de un log de visitante, ejecutado en el middleware.
    *   `ClientEnrichmentSchema`: Valida el payload parcial para el enriquecimiento de datos desde el cliente, que contiene solo los campos que el cliente puede proveer.
3.  **Mensajes de Error Internacionalizados:** Los mensajes de error de validación son claves de i18n (ej. `"ValidationErrors.generic.invalid_uuid"`), desacoplando la lógica de validación de la capa de presentación.

## 3. Contrato de API
- **Entrada:** Objetos de datos crudos (`unknown` o `any`).
- **Salida:** Objetos de datos validados y tipo-seguros, o una `ZodError` si la validación falla.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Tipado Estricto para `geo_data` y `browser_context`**: Reemplazar `z.record(z.any())` por schemas de Zod más específicos que definan la forma esperada de estos objetos JSON, mejorando la integridad de los datos.
 * 2.  **Validación de User-Agent Data**: Para `browser_context`, se podría crear un schema que valide la estructura de la API `User-Agent Client Hints` (`navigator.userAgentData`), proporcionando una validación más robusta de los datos del navegador.
 * 3.  **Schema para `utm_params`**: Crear un schema que valide la presencia de los parámetros UTM estándar (`utm_source`, `utm_medium`, `utm_campaign`), asegurando que los datos de marketing sean consistentes.
 * 4.  **Enum para `status` de Log**: Si en el futuro se añade un campo `status` a `visitor_logs` (ej. 'processing', 'completed'), se debería añadir aquí la validación correspondiente.
 * 5.  **Refinamiento de `referrer`**: La validación de `referrer` podría ser mejorada para permitir `null` o una URL válida, pero no un string vacío.
 * 6.  **Sanitización de Datos**: Añadir un `.transform()` para sanitizar los datos de entrada, como recortar espacios en blanco de los strings, antes de la validación.
 * 7.  **Unificación de Schemas**: Explorar si `ClientEnrichmentSchema` puede ser derivado de `VisitorLogSchema` usando `.partial().pick()` para una mayor adhesión al principio DRY.
 * 8.  **Versión del Schema**: Incluir un campo `schemaVersion: z.literal(1)` para facilitar futuras migraciones de datos de telemetría.
 * 9.  **Logging de Errores de Validación**: Integrar un `z.setErrorMap` para que los errores de validación de Zod puedan ser logueados de forma centralizada con más contexto.
 * 10. **Documentación de Propiedades con `.describe()`**: Añadir `.describe()` a cada propiedad para que sirva como documentación viva dentro del propio schema.
 * =====================================================================
 */
// .docs-espejo/lib/validators/schemas/telemetry.schemas.md