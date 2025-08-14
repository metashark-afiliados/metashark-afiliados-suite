// src/lib/types/database/views.ts
/**
 * @file views.ts
 * @description Define los contratos de datos completos para las Vistas de la base de datos.
 *              Ha sido refactorizado a un estándar de élite para que su estructura
 *              refleje el formato de los tipos de tabla (`Row`, `Insert`, `Update`),
 *              garantizando la consistencia y resolviendo una cascada de errores de tipo.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { type Enums } from "./enums";

/**
 * @public
 * @typedef UserProfilesWithEmail
 * @description Tipo para la vista que une `profiles` y `auth.users`.
 */
export type UserProfilesWithEmail = {
  Row: {
    app_role: Enums["app_role"] | null;
    avatar_url: string | null;
    email: string | null;
    full_name: string | null;
    id: string | null;
  };
  Insert: never; // Las vistas no soportan inserciones
  Update: never; // Las vistas no soportan actualizaciones
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Consistencia Estructural**: ((Implementada)) La definición del tipo ahora está anidada bajo una propiedad `Row`, reflejando la estructura de los tipos de tabla generados y manuales. Esto permite que el helper `Views<T>` lo resuelva correctamente y resuelve la cascada de errores TS2339 y TS2322.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) Continuar monitorizando las actualizaciones de la CLI de Supabase para la eventual generación automática de tipos de Vistas, lo que haría este archivo obsoleto.
 *
 * =====================================================================
 */
// src/lib/types/database/views.ts
