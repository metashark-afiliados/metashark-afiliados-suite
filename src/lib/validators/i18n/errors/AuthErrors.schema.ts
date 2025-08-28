// src/lib/validators/i18n/errors/AuthErrors.schema.ts
/**
 * @file AuthErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de autenticación (login, OAuth, perfil)
 *              sin un prefijo de dominio.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

export const AuthErrorsSchema = z.object({
  login_invalid_credentials: z.string(),
  oauth_failed: z.string(),
  oauth_provider_missing: z.string(),
  profile_creation_failed: z.string(),
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
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo aparato encapsula los errores de autenticación, mejorando la modularidad.
 * 2. **Consistencia con Prefijos**: ((Implementada)) Las claves se definen sin prefijo, lo que permite que el ensamblador `ValidationErrors.schema.ts` aplique el prefijo `auth_` de forma consistente.
 *
 * @subsection Melhorias Futuras
 * 1. **Errores Específicos de Registro**: ((Vigente)) Si se introducen errores específicos de registro que no sean cubiertos por los genéricos, se podrían añadir aquí.
 *
 * =====================================================================
 */
