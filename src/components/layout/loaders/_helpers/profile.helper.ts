// src/components/layout/loaders/_helpers/profile.helper.ts
/**
 * @file profile.helper.ts
 * @description Helper atómico para la lógica de sondeo resiliente del perfil de usuario.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { type User } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @public
 * @async
 * @function waitForProfile
 * @description Resuelve la condición de carrera entre la creación del usuario en
 *              `auth.users` y la ejecución del trigger que crea el registro
 *              correspondiente en `public.profiles`.
 * @param {User} user - El objeto de usuario de Supabase Auth.
 * @returns {Promise<Tables<'profiles'> | null>} El perfil encontrado o null si se agotan los reintentos.
 */
export async function waitForProfile(
  user: User
): Promise<Tables<"profiles"> | null> {
  const supabase = createClient();
  let attempts = 0;
  while (attempts < 5) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (profile) {
      return profile;
    }
    attempts++;
    logger.trace(
      { userId: user.id, attempt: attempts },
      `[waitForProfile] Perfil no encontrado. Esperando 300ms...`
    );
    await delay(300);
  }
  return null;
}
// src/components/layout/loaders/_helpers/profile.helper.ts
