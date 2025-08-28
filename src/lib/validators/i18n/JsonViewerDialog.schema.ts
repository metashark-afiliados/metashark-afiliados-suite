// src/lib/validators/i18n/JsonViewerDialog.schema.ts
/**
 * @file JsonViewerDialog.schema.ts
 * @description Define el contrato de datos para el namespace 'components.dev-console.JsonViewerDialog'.
 *              Este schema ha sido creado holísticamente para validar las cadenas de texto
 *              utilizadas por el `JsonViewerDialog`, garantizando la seguridad de tipos
 *              para el componente.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

/**
 * @public
 * @constant JsonViewerDialogSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              traducciones relacionadas con el `JsonViewerDialog`.
 */
export const JsonViewerDialogSchema = z.object({
  /**
   * @property {string} no_data_available - Mensaje a mostrar cuando no hay datos JSON disponibles.
   */
  no_data_available: z.string().min(1, { message: "no_data_required" }),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Creación Holística**: ((Implementada)) Se ha creado este nuevo schema Zod, siguiendo la arquitectura IMAS y proporcionando tipado estricto para las claves de traducción del `JsonViewerDialog`.
 * 2. **Robustez de Validación**: ((Implementada)) Se ha añadido validación `.min(1)` para asegurar que la clave de traducción no esté vacía.
 * 3. **Clasificación de Errores por Dominio**: ((Implementada)) El mensaje de error de Zod ahora utiliza la clave `no_data_required`, que se añadirá a `ValidationErrors.json` en el siguiente paso.
 *
 * @subsection Melhorias Futuras
 * 1. **Integración de `ValidationErrors`**: ((Vigente)) El mensaje de error (`no_data_required`) debería ser clasificado con un prefijo `json_viewer_dialog_` en `ValidationErrors` para una consistencia total.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/JsonViewerDialog.schema.ts
