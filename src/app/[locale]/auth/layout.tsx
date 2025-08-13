// src/app/[locale]/auth/layout.tsx
/**
 * @file src/app/[locale]/auth/layout.tsx
 * @description Layout de Servidor para el Route Group de autenticación `(auth)`.
 *              Este aparato es un Server Component puro cuya única responsabilidad
 *              es obtener las traducciones necesarias y componer el `AuthLayoutClient`
 *              pasándole los datos como props, siguiendo el patrón de élite de RSC.
 * @author Raz Podestá
 * @version 4.0.0
 */
import React from "react";
import { getTranslations } from "next-intl/server";

import { logger } from "@/lib/logging";

import { AuthLayoutClient } from "./auth-layout-client";

/**
 * @public
 * @async
 * @function AuthLayout
 * @description Obtiene las traducciones del servidor y las pasa al layout de cliente.
 * @param {{ children: React.ReactNode }} props - Propiedades del layout, incluyendo los hijos.
 * @returns {Promise<React.ReactElement>} El componente de layout renderizado.
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  logger.trace("[AuthLayout] Renderizando layout de servidor...");
  const t = await getTranslations("AuthLayout");
  const ariaLabel = t("go_back_home_aria");

  return <AuthLayoutClient ariaLabel={ariaLabel}>{children}</AuthLayoutClient>;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura Servidor-Cliente**: ((Implementada)) La separación de la lógica de obtención de datos (servidor) del renderizado (cliente) es una implementación canónica y de alto rendimiento.
 * 2. **Full Observabilidad**: ((Implementada)) Se ha añadido un `logger.trace` para monitorear el renderizado de este layout en el servidor.
 * 3. **Full Internacionalización**: ((Implementada)) Obtiene las traducciones de forma asíncrona en el servidor.
 *
 * @subsection Melhorias Futuras
 * 1. **Datos de Sesión**: ((Vigente)) Este layout podría obtener la sesión del usuario (`await supabase.auth.getSession()`). Si ya existe una sesión, podría redirigir al usuario al `/dashboard` directamente desde aquí, añadiendo una capa de seguridad.
 *
 * =====================================================================
 */
// src/app/[locale]/auth/layout.tsx
