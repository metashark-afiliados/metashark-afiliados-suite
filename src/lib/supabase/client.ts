// src/lib/supabase/client.ts
"use client";

import { createBrowserClient } from "@supabase/ssr";

import { type Database } from "@/lib/types/database";

/**
 * @public
 * @function createClient
 * @description Factoría para crear una instancia del cliente Supabase para el entorno de navegador (Client Components).
 *              Implementa la estrategia de fallback en cascada para las variables de entorno,
 *              priorizando las inyectadas por Vercel (`INTEGRATION_...`) y recurriendo a las
 *              estándar (`NEXT_PUBLIC_...`) para el desarrollo local.
 * @returns Un cliente Supabase de navegador.
 * @author Raz Podestá
 * @version 4.0.0
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_INTEGRATION_NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_INTEGRATION_NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Agnosticismo de Entorno**: ((Implementada)) Al igual que su contraparte de servidor, este cliente ahora utiliza la estrategia de fallback en cascada, restaurando la funcionalidad completa del desarrollo local para los componentes de cliente que interactúan con Supabase.
 * 2. **Cero Regresiones**: ((Implementada)) La refactorización se centra exclusivamente en el consumo de variables de entorno, preservando la funcionalidad original de `createBrowserClient`.
 * 3. **Documentación TSDoc de Élite**: ((Implementada)) La documentación ha sido actualizada para reflejar la nueva arquitectura y su propósito.
 *
 * @subsection Melhorias Futuras
 * 1. **Centralización de Claves**: ((Vigente)) Los nombres de las variables de entorno se repiten en múltiples archivos. Podrían ser definidos como constantes en un archivo de configuración central para mejorar la mantenibilidad y reducir el riesgo de errores de tipeo.
 *
 * =====================================================================
 */
// src/lib/supabase/client.ts
