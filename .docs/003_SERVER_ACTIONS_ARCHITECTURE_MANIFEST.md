// .docs/003_SERVER_ACTIONS_ARCHITECTURE_MANIFEST.md
/**
 * @file .docs/003_SERVER_ACTIONS_ARCHITECTURE_MANIFEST.md
 * @description Manifiesto Canónico de Arquitectura de Server Actions v1.0.
 *              Esta es la Única Fuente de Verdad (SSoT) definitiva que define
 *              la estructura, patrones y estándares de élite para toda la
 *              lógica de negocio del lado del servidor en ConvertiKit.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Canónico de Arquitectura de Server Actions v1.0

## 1. Filosofía: "Cajas Negras Atómicas, Seguras y Observables"

Cada Server Action es una **caja negra** de lógica de negocio. Debe ser:
- **Atómica:** Realizar una única operación de negocio bien definida (SRP).
- **Segura:** Asumir un entorno de "Zero-Trust" y validar cada petición.
- **Observable:** Registrar cada paso crítico, éxito o fracaso.
- **Predecible:** Adherirse a un contrato de entrada (Zod Schema) y salida (`ActionResult`) estricto.

## 2. El Ciclo de Vida Canónico de una Server Action

Toda Server Action que realice una operación sensible o de mutación **DEBE** seguir este flujo secuencial de 5 pasos:

1.  **Autenticación:** La primera línea de código debe ser la invocación del guardián `getAuthenticatedUser()`.
2.  **Validación de Payload:** Los datos de entrada (`formData` o parámetros) deben ser validados y saneados usando un `Schema` de Zod específico del dominio.
3.  **Autorización:** Antes de cualquier mutación, se debe invocar el guardián de permisos apropiado (`requireWorkspacePermission`, `requireSitePermission`, etc.).
4.  **Ejecución de Lógica de Negocio:** Interactuar con la capa de datos, servicios externos o ejecutar algoritmos. Este bloque debe estar envuelto en un `try/catch`.
5.  **Efectos Secundarios y Retorno:**
    *   **En Éxito:** Registrar un `audit_log`, revalidar el caché de Next.js (`revalidatePath`/`revalidateTag`), y devolver un `ActionResult` con `success: true`.
    *   **En Fracaso:** Registrar un `persistent_error_log`, y devolver un `ActionResult` con `success: false` y un `error_code`.

*   **Diagrama de Flujo (Mermaid):**
    ```mermaid
    graph TD
        A[Inicio de Acción] --> B{1. Autenticación};
        B -- Fallo --> X[Retorna Error AUTH_001];
        B -- Éxito --> C{2. Validación de Payload};
        C -- Fallo --> Y[Retorna Error VALIDATION_...];
        C -- Éxito --> D{3. Autorización};
        D -- Fallo --> Z[Retorna Error PERMISSION_...];
        D -- Éxito --> E[4. Ejecución Lógica (try/catch)];
        E -- Éxito --> F[5. Auditoría y Revalidación];
        F --> G[Retorna ActionResult Éxito];
        E -- Fallo --> H[5. Log de Error Persistente];
        H --> I[Retorna ActionResult Fracaso];
    ```

## 3. Contrato de Comunicación (API de la Acción)

*   **Entrada:**
    *   **Payload:** Para acciones simples, parámetros directos (`campaignId: string`). Para formularios, un único objeto `formData: FormData`.
    *   **Estado Anterior (`prevState`):** El primer argumento de acciones usadas con `useFormState` debe ser `prevState: unknown`.
*   **Salida (SSoT):** `Promise<ActionResult<TSuccess, TErrorData>>`
    *   `{ success: true, data: TSuccess }`
    *   `{ success: false, error_code: string, data?: TErrorData }`

## 4. Estructura de Ficheros (Cohesión de Dominio)

*   **Atomicidad:** Cada acción debe residir en su propio fichero (ej. `create.action.ts`, `delete.action.ts`).
*   **Agrupación:** Los ficheros de acción se agrupan por dominio en directorios (ej. `/actions/sites/`, `/actions/workspaces/`).
*   **Manifiesto de Módulo:** Cada directorio de dominio **DEBE** tener un `index.ts` (barrel file) que exporte todas las acciones de ese dominio bajo un `namespace` para su consumo en el manifiesto principal.

## 5. Integración con la Capa de Datos

Las Server Actions son la **única** capa que puede invocar directamente a la capa de datos (`/src/lib/data/`). La UI (`hooks`, `components`) nunca debe importar directamente desde `/lib/data/`.

// .docs/003_SERVER_ACTIONS_ARCHITECTURE_MANIFEST.md
---
// .docs/003_SERVER_ACTIONS_ARCHITECTURE_MANIFEST_V2.md
/**
 * @file .docs/003_SERVER_ACTIONS_ARCHITECTURE_MANIFEST_V2.md
 * @description Manifiesto Canónico de Arquitectura de Server Actions v2.0.
 *              Esta es la SSoT definitiva que define la estructura, patrones y
 *              estándares de élite, introduciendo el patrón "Secure Action Factory"
 *              y la obligatoriedad de transacciones RPC para una máxima
 *              seguridad, atomicidad y testeabilidad.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto Canónico de Arquitectura de Server Actions v2.0

## 1. Filosofía: "Lógica de Negocio Pura, Blindada por Defecto"

Las Server Actions son el núcleo de nuestra lógica de negocio. Deben ser escritas como **funciones puras** que se enfocan exclusivamente en la tarea de negocio. La seguridad (autenticación, validación, autorización) no es algo que se *añade* a la acción; es una **armadura** que la envuelve.

## 2. El Patrón de Élite: "Secure Action Factory" (Wrapper de Alto Orden)

Para eliminar el boilerplate y forzar la seguridad por defecto, todas las Server Actions sensibles **DEBEN** ser creadas utilizando una factoría `createSecureAction`.

*   **Lógica de la Factoría:** Se creará un helper de alto orden (`/lib/actions/_helpers/secure-action.helper.ts`) con la siguiente firma conceptual:

    ```typescript
    createSecureAction<TInput, TOutput>(options: {
      inputSchema: ZodSchema<TInput>,
      requiredRoles?: AppRole[],
      workspacePermission?: {
        getWorkspaceId: (input: TInput) => string,
        requiredRoles: WorkspaceRole[]
      },
      businessLogic: (input: TInput, user: User) => Promise<ActionResult<TOutput>>
    }): ServerAction<TInput, TOutput>
    ```
*   **Flujo de Ejecución (Automatizado por la Factoría):**
    1.  La factoría recibe la petición.
    2.  **Autentica** al usuario. Si falla, retorna error `AUTH_001`.
    3.  **Valida** el payload de entrada contra el `inputSchema`. Si falla, retorna error `VALIDATION_...`.
    4.  **Autoriza** contra los `requiredRoles` o `workspacePermission`. Si falla, retorna error `PERMISSION_...`.
    5.  Si todo lo anterior es exitoso, invoca la función `businessLogic` pasándole los datos ya validados y el objeto de usuario.
*   **Beneficios:**
    *   **DRY:** Elimina el 90% del código repetitivo de seguridad.
    *   **SRP:** La lógica de negocio está 100% aislada de la lógica de seguridad.
    *   **Seguridad por Defecto:** Es imposible crear una acción sin definir sus reglas de validación y permisos.
    *   **Testeabilidad:** La `businessLogic` puede ser probada unitariamente como una función pura.

## 3. Atomicidad Transaccional: El Mandato de las RPCs

*   **Decisión:** Cualquier operación de negocio que requiera **dos o más operaciones de escritura** (`INSERT`, `UPDATE`, `DELETE`) en la base de datos **DEBE** ser implementada como una única **Función de Procedimiento Remoto (RPC)** de PostgreSQL.
*   **Justificación:** Garantiza la **atomicidad** (ACID). Si cualquier paso dentro de la función de la base de datos falla, toda la transacción se revierte (`ROLLBACK`), previniendo estados de datos inconsistentes.
*   **Ejemplo:** `createWorkspaceAction` será refactorizada para invocar una `create_workspace_with_owner_rpc(userId, workspaceName)` que internamente inserta en `workspaces` y `workspace_members` dentro de una única transacción.

## 4. Estructura de Ficheros (Cohesión de Dominio)

La estructura de ficheros se mantiene: atómica por acción, agrupada por dominio, con un manifiesto `index.ts`. La diferencia es que ahora cada fichero de acción contendrá la exportación de la acción segura creada con la factoría.

*Ejemplo de `create-site.action.ts`:*
```typescript
import { createSecureAction } from "@/lib/actions/_helpers";
import { CreateSiteSchema } from "@/lib/validators";
// ...

async function businessLogic(input, user) {
  // Lógica de inserción pura aquí...
  return { success: true, data: { id: newSite.id }};
}

export const createSiteAction = createSecureAction({
  inputSchema: CreateSiteSchema,
  workspacePermission: {
    getWorkspaceId: (input) => input.workspaceId,
    requiredRoles: ['owner', 'admin', 'member'],
  },
  businessLogic,
});
---
