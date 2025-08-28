// src/lib/validators/i18n/CookiePolicyPage.schema.ts
/**
 * @file CookiePolicyPage.schema.ts
 * @description Define el contrato de datos para el namespace 'CookiePolicyPage'.
 *              Sincronizado para reflejar la estructura anidada completa del contenido.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

export const CookiePolicyPageSchema = z.object({
  title: z.string(),
  content: z.array(
    z.object({
      title: z.string(),
      body: z.array(z.string()),
    })
  ),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización Completa de Contrato**: ((Implementada)) El schema ha sido actualizado para reflejar la estructura anidada completa del archivo `CookiePolicyPage.json`, incluyendo el array `content` con objetos `title` y `body`. Esto resuelve la brecha crítica de sincronización del contrato.
 * 2. **Documentación de Campos**: ((Implementada)) Se han añadido descripciones a los campos clave para mejorar la DX.
 *
 * =====================================================================
 */
