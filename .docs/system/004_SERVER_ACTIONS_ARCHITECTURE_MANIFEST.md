// .docs/system/004_SERVER_ACTIONS_ARCHITECTURE_MANIFEST.md
/**
 * @file .docs/system/004_SERVER_ACTIONS_ARCHITECTURE_MANIFEST.md
 * @description Manifiesto Canónico de Arquitectura de Server Actions v2.0.
 *              Esta es la SSoT que define la estructura, patrones y estándares
 *              de élite para toda la lógica de negocio del servidor, expandiendo
 *              el Pilar 3 de la Constitución Arquitectónica. Consolida y reemplaza
 *              a `.docs/003_SERVER_ACTIONS_ARCHITECTURE_MANIFEST.md`.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto Canónico de Arquitectura de Server Actions v2.0

## 1. Filosofía: "Lógica de Negocio Pura, Blindada por Defecto"
*   **Referencia a la Constitución:** AD-004.
*   Las Server Actions son el núcleo de nuestra lógica de negocio. Deben ser escritas como **funciones puras** que se enfocan exclusivamente en la tarea de negocio. La seguridad (autenticación, validación, autorización) no es algo que se *añade* a la acción; es una **armadura** que la envuelve.

## 2. El Patrón de Élite: "Secure Action Factory"
Para eliminar el boilerplate y forzar la seguridad por defecto, todas las Server Actions sensibles **DEBEN** ser creadas utilizando una factoría `createSecureAction` (futura implementación).
*   **Flujo de Ejecución (Automatizado por la Factoría):**
    1.  **Autentica** al usuario.
    2.  **Valida** el payload de entrada contra un `inputSchema` de Zod.
    3.  **Autoriza** contra los roles requeridos.
    4.  Si todo es exitoso, invoca la función `businessLogic` con datos ya validados.
*   **Beneficios:** Adhesión a DRY, SRP, seguridad por defecto y testeabilidad de la lógica de negocio pura.

## 3. Atomicidad Transaccional: El Mandato de las RPCs
*   **Decisión:** Cualquier operación de negocio que requiera **dos o más operaciones de escritura** (`INSERT`, `UPDATE`, `DELETE`) **DEBE** ser implementada como una única **Función de Procedimiento Remoto (RPC)** de PostgreSQL.
*   **Justificación:** Garantiza la **atomicidad** (ACID). Si cualquier paso falla, toda la transacción se revierte (`ROLLBACK`), previniendo estados de datos inconsistentes.

## 4. El Ciclo de Vida Canónico de una Server Action
Hasta la implementación de la factoría, toda Server Action **DEBE** seguir este flujo secuencial de 5 pasos:
1.  **Autenticación:** Invocación del guardián `getAuthenticatedUser()`.
2.  **Validación de Payload:** Uso de un `Schema` de Zod específico.
3.  **Autorización:** Invocación del guardián de permisos apropiado (`requireWorkspacePermission`).
4.  **Ejecución:** Lógica de negocio en un `try/catch`.
5.  **Efectos Secundarios y Retorno:** Auditoría, revalidación de caché y retorno de `ActionResult`.

## 5. Contrato de Comunicación
*   **Entrada:** `FormData` para formularios.
*   **Salida (SSoT):** `Promise<ActionResult<TSuccess, TErrorData>>`

## 6. Estructura de Ficheros (Cohesión de Dominio)
*   **Atomicidad:** Cada acción reside en su propio fichero (ej. `create.action.ts`).
*   **Agrupación:** Los ficheros se agrupan por dominio en directorios (ej. `/actions/sites/`).
*   **Manifiesto de Módulo:** Cada directorio de dominio tiene un `index.ts` que exporta las acciones.
// .docs/system/004_SERVER_ACTIONS_ARCHITECTURE_MANIFEST.md