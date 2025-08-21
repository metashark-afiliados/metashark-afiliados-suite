// src/lib/supabase/client.ts
/**
 * @file src/lib/supabase/client.ts
 * @description Crea un cliente de Supabase para el navegador. Ha sido
 *              refactorizado para consumir las variables de entorno con prefijo
 *              `INTEGRATION_` gestionadas por la integración de Vercel.
 * @author L.I.A. Legacy
 * @version 3.1.0
 */
"use client";

import { createBrowserClient } from "@supabase/ssr";

import { type Database } from "@/lib/types/database";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_INTEGRATION_NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_INTEGRATION_NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alineación con Vercel**: ((Implementada)) El cliente ahora consume las variables de entorno con prefijo, alineándose con la configuración actual del despliegue.
 *
 * =====================================================================
 */
