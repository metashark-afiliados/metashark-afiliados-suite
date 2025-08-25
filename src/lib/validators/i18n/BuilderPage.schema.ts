// src/lib/validators/i18n/BuilderPage.schema.ts
/**
 * @file BuilderPage.schema.ts
 * @description Define el contrato de datos para el namespace 'pages.BuilderPage'.
 *              Sincronizado con la nueva semántica del constructor, validando
 *              la estructura para la `PrimaryToolBar` y la `BlockLibrary`.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

export const BuilderPageSchema = z.object({
  PrimaryToolBar: z.object({
    add_content: z.string(), // Anteriormente 'design'
    elements: z.string(),
    text: z.string(),
    brand: z.string(),
    uploads: z.string(),
    tools: z.string(),
  }),
  BlockLibrary: z.object({
    title: z.string(),
    category_templates: z.string(),
    category_headers: z.string(),
    category_heros: z.string(),
    category_features: z.string(),
    category_testimonials: z.string(),
    category_footers: z.string(),
  }),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización Semántica**: ((Implementada)) El schema Zod ahora valida la nueva estructura de claves semánticas (`add_content`, `category_*`), garantizando la integridad del contrato de i18n para la nueva UX del constructor.
 * 2. **Principio DRY**: ((Implementada)) Se ha eliminado la definición duplicada del objeto `Header`, ya que su SSoT canónica ahora reside en `BuilderHeader.schema.ts`, reduciendo la deuda técnica.
 *
 * @subsection Melhorias Futuras
 * 1. **Composición de Schemas**: ((Vigente)) Para una adhesión de élite al principio DRY, este schema podría ser refactorizado para importar y componer otros schemas atómicos (ej. `PrimaryToolBar.schema.ts`, `BlockLibrary.schema.ts`) en lugar de redefinir sus claves internamente.
 * 2. **Generación Automática**: ((Vigente)) Un script podría leer el manifiesto de categorías (`block-categories.config.ts`) y generar dinámicamente las claves `category_*` para este schema, previniendo desincronizaciones futuras.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/BuilderPage.schema.ts
