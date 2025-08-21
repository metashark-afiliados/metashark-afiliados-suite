// src/lib/supabase/client.ts
/**
 * @file src/lib/supabase/client.ts
 * @description Crea un cliente de Supabase para el navegador. Ha sido
 *              refactorizado para consumir las variables de entorno con prefijo
 *              gestionadas por la integración de Vercel, garantizando el uso de
 *              credenciales SSoT.
 * @author L.I.A. Legacy
 * @version 2.0.0
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
 * 1. **Consumo de SSoT de Credenciales**: ((Implementada)) El cliente ahora consume las variables de entorno gestionadas por la integración de Vercel, alineándose con la nueva estrategia de configuración.
 *
 * =====================================================================
 */
