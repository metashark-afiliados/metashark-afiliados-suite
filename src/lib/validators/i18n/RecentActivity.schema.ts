/**
 * @file RecentActivity.schema.ts
 * @description Define el contrato de datos para el namespace 'components.dashboard.RecentActivity'.
 *              Ha sido actualizado para incluir la clave `viewAll`, completando el
 *              contrato de i18n para la refactorización holística del componente.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

export const RecentActivitySchema = z.object({
  title: z
    .string()
    .describe("El título de la sección, ej. 'Diseños Recientes'"),
  viewAll: z.string().describe("El texto para el enlace 'Ver Todo'."),
  cardAriaLabel: z
    .string()
    .describe(
      "Texto accesible para la tarjeta, ej. 'Continuar trabajando en {campaignName}'"
    ),
  lastEdited: z.string().describe("Etiqueta para la fecha de edición"),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato**: ((Implementada)) El schema ahora incluye la clave `viewAll`, alineándolo con la nueva UI y el archivo de mensajes `RecentActivity.json`. Este es un paso crítico para resolver el error de compilación `TS2345`.
 * 2. **Documentación Embebida**: ((Implementada)) Se han añadido descripciones a cada propiedad para mejorar la DX y facilitar el trabajo de traducción, cumpliendo con las condiciones de entrega.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Parámetros**: ((Vigente)) El schema para `cardAriaLabel` podría ser mejorado para validar la presencia del marcador de posición `{campaignName}` (ej. `.refine(s => s.includes('{campaignName}'))`), garantizando que los archivos de mensajes no lo omitan accidentalmente. Propondré implementar esta mejora en una futura refactorización de validadores.
 * 2. **Clave para Estado Vacío**: ((Pendiente)) Añadir una clave `emptyStateText` al schema para internacionalizar el mensaje que se muestra cuando no hay campañas recientes.
 *
 * =====================================================================
 */
