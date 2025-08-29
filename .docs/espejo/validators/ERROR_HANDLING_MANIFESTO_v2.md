// .docs/espejo/validators/ERROR_HANDLING_MANIFESTO_v2.md
/\*\*

- @file .docs/espejo/validators/ERROR_HANDLING_MANIFESTO_v2.md
- @description Manifiesto de Arquitectura de Élite v2.0 para el Dominio de Errores Soberano.
-              Esta es la Única Fuente de Verdad (SSoT) que define la estrategia
-              canónica para la atomización, estandarización y consumo de TODOS
-              los mensajes de feedback (errores y éxitos) en ConvertiKit,
-              integrando la capa de i18n con la de observabilidad.
- @author Raz Podestá - MetaShark Tech
- @version 2.0.0
  \*/

# Manifiesto del Dominio de Errores Soberano v2.0

## 1. Filosofía y Visión: "Cero Strings Mágicos, Trazabilidad Total"

La gestión de errores y feedback es la columna vertebral de un sistema resiliente y observable. Nuestra visión es erradicar por completo los "strings mágicos" (mensajes de error codificados en duro) de la lógica de negocio. Cada posible resultado de una Server Action o validación de Zod debe ser representado por una **clave de i18n inmutable**.

Esta clave se convierte en la SSoT que fluye a través del sistema:

1.  **Definida** en un schema de Zod atómico.
2.  **Traducida** en un archivo JSON atómico.
3.  **Devuelta** por la Server Action en `ActionResult`.
4.  **Consumida** por la UI para mostrar un mensaje al usuario.
5.  **Registrada** en el `logger` y en la tabla `system_errors` para una trazabilidad perfecta.

## 2. Arquitectura Canónica del Dominio de Errores v2.0

La arquitectura se expande para incluir explícitamente los mensajes de éxito y se integra con la capa de observabilidad.

```mermaid
graph TD
    subgraph "Capa de Contrato (SSoT)"
        A1[schemas/errors/Auth.schema.ts] --> Z;
        A2[schemas/errors/Sites.schema.ts] --> Z;
        A3[schemas/errors/...etc.schema.ts] --> Z;
        Z(schemas/ValidationErrors.schema.ts);

        B1[messages/errors/Auth.json] --> Y;
        B2[messages/errors/Sites.json] --> Y;
        B3[messages/errors/...etc.json] --> Y;
        Y(messages/ValidationErrors.json);
    end

    subgraph "Capa de Lógica de Negocio (Server Actions)"
        SA[actions/sites.actions.ts] -- Si falla --> R1{error: 'sites.create_failed'};
        SA -- Si éxito --> R2{success: true, data: { messageKey: 'sites.create_success' }};
    end

    subgraph "Capa de Observabilidad"
        R1 -- Es registrado por --> L1[logger.error];
        R1 -- Es registrado por --> L2[createPersistentErrorLog];
    end

    subgraph "Capa de Presentación (UI)"
        R1 & R2 -- Es consumido por --> C{useHandleErrors / toast};
        C -- Usa --> Y;
    end

    Z -- Valida --> Y;
2.1. Protocolo de Creación/Refactorización de Aparatos (Mandatorio)
Para cada dominio lógico (ej. sites, auth, onboarding, contact_form), se debe asegurar la existencia de su ecosistema de errores soberano:
Schema de Errores Atómico:
Ubicación: src/lib/validators/i18n/errors/[DomainName]Errors.schema.ts
Contenido: Un z.object que define TODAS las claves de feedback (éxito y error) para ese dominio.
Ejemplo (SiteErrors.schema.ts): export const SiteErrorsSchema = z.object({ create_failed: z.string(), create_success: z.string(), ... });
JSON de Mensajes Atómico:
Ubicación: src/messages/shared/errors/[DomainName]Errors.json
Contenido: Las traducciones para todas las claves definidas en el schema correspondiente.
2.2. Protocolo de Implementación en Server Actions
Toda Server Action que interactúe con el usuario DEBE adherirse al siguiente patrón:
Retorno de Éxito: Debe devolver un ActionResult con una clave de mensaje de éxito.
code
TypeScript
// ✅ Patrón de Élite
return { success: true, data: { messageKey: 'sites.create_success' } };
Retorno de Error: Debe devolver un ActionResult con una clave de error.
code
TypeScript
// ✅ Patrón de Élite
return { success: false, error: 'sites.create_failed' };
Observabilidad Integrada: En CADA catch block o punto de fallo, la clave de error debe ser registrada antes de ser devuelta.
code
TypeScript
// ✅ Patrón de Élite
} catch (error) {
    const errorKey = 'sites.create_failed';
    logger.error(`[SitesAction] ${errorKey}`, { error });
    await createPersistentErrorLog('createSiteAction', error, { errorKey });
    return { success: false, error: errorKey };
}
2.3. Protocolo de Consumo en la UI (useHandleErrors y Toasts)
El hook useHandleErrors o el toast directo en los componentes deben recibir el ActionResult.
Utilizarán la clave (result.error o result.data.messageKey) para buscar la traducción correspondiente en el ValidationErrors.json ensamblado y mostrarla al usuario.
3. Beneficios Estratégicos de la Arquitectura v2.0
Trazabilidad Absoluta: Una clave de error como sites.create_failed puede ser buscada (grep) en toda la base de código, encontrando instantáneamente su definición (schema), su contenido (JSON), el punto exacto donde se genera (Server Action) y donde se consume (UI).
Consistencia de Logging: Los logs de error y los mensajes de la UI están sincronizados, ya que ambos derivan de la misma SSoT (la clave de i18n).
Mantenibilidad de Élite: Modificar un mensaje de error se reduce a editar un pequeño archivo JSON, sin tocar la lógica de negocio.
Internacionalización Robusta: El sistema está diseñado desde su núcleo para ser 100% traducible.
Este manifiesto refactorizado establece el estándar de oro para la gestión de errores y feedback. La ejecución de la atomización continuará bajo esta directiva perfeccionada.
```
