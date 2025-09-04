// src/lib/validators/i18n/SocialProof.schema.ts
/**
 * @file SocialProof.schema.ts
 * @description Define el contrato de datos para el namespace 'SocialProof' dentro de `landing.json`.
 *              Valida la estructura del array de logos, asegurando que `src` sea una URL válida.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
import { z } from "zod";

export const SocialProofSchema = z.object({
  title: z.string(),
  logos: z.array(
    z.object({
      name: z.string(),
      src: z.string().url(),
    })
  ),
});
// src/lib/validators/i18n/SocialProof.schema.ts
