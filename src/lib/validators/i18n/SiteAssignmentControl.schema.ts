// src/lib/validators/i18n/SiteAssignmentControl.schema.ts
/**
 * @file SiteAssignmentControl.schema.ts
 * @description Define el contrato de datos para el namespace 'SiteAssignmentControl'.
 *              Este schema valida las cadenas de texto utilizadas en el componente
 *              para asignar campañas a sitios.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const SiteAssignmentControlSchema = z.object({
  loading_context: z.string(),
  section_title: z.string(),
  description: z.string(),
  select_placeholder: z.string(),
  assign_button: z.string(),
  toast_select_site_error: z.string(),
  toast_load_sites_error: z.string(),
  toast_assign_success: z.string(),
  toast_assign_error: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de UI Atómico**: ((Implementada)) Este nuevo schema crea un contrato de datos robusto y explícito para el componente `SiteAssignmentControl`, asegurando su completa internacionalización.
 *
 * @subsection Melhorias Futuras
 * 1. **Descripciones Detalladas**: ((Vigente)) Añadir `.describe()` a cada propiedad para proporcionar más contexto a los traductores sobre dónde y cómo se utiliza cada cadena de texto.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/SiteAssignmentControl.schema.ts
