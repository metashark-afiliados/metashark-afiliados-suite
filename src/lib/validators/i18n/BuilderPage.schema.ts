// src/lib/validators/i18n/BuilderPage.schema.ts
/**
 * @file BuilderPage.schema.ts
 * @description Define el contrato de datos para el namespace 'pages.BuilderPage'.
 *              Sincronizado para incluir la estructura de `BlockLibrary` y
 *              refactorizado para adherirse al principio DRY.
 * @author Raz Podestá
 * @version 3.0.0
 */
import { z } from "zod";

export const BuilderPageSchema = z.object({
  PrimaryToolBar: z.object({
    design: z.string(),
    elements: z.string(),
    text: z.string(),
    brand: z.string(),
    uploads: z.string(),
    tools: z.string(),
  }),
  // --- INICIO DE SINCRONIZACIÓN ---
  BlockLibrary: z.object({
    title: z.string(),
    category_layout: z.string(),
    category_content: z.string(),
    category_media: z.string(),
    category_forms: z.string(),
    category_footers: z.string(),
  }),
  // --- FIN DE SINCRONIZACIÓN ---
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Integridad de Contrato i18n**: ((Implementada)) El schema Zod ahora valida la nueva estructura `BlockLibrary`, previniendo errores de validación.
 * 2. **Principio DRY**: ((Implementada)) Se ha eliminado el objeto `Header` redefinido. La SSoT para esas claves ahora reside únicamente en `BuilderHeader.schema.ts`.
 *
 * @subsection Melhorias Futuras
 * 1. **Composición de Schemas**: ((Vigente)) Para una adhesión de élite al principio DRY, este schema podría ser refactorizado para importar y componer otros schemas atómicos (`PrimaryToolBar.schema.ts`, etc.) en lugar de redefinir sus claves.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/BuilderPage.schema.ts
