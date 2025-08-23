// src/app/dashboard/layout.tsx
/**
 * @file layout.tsx
 * @description Layout de servidor para la sección del dashboard. Actúa como un
 *              guardián de seguridad, validando la sesión del usuario, y luego
 *              renderiza el componente de layout de cliente que construye la UI.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { type ReactNode } from "react";
import { redirect } from "next/navigation";

import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout";
import { createClient } from "@/lib/supabase/server";

interface Props {
  children: ReactNode;
}

export default async function Layout({ children }: Props) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alineación Arquitectónica**: ((Implementada)) El layout del servidor ahora se adhiere al patrón de responsabilidad única, delegando toda la construcción de la UI al componente de cliente `DashboardLayout`.
 * 2. **Seguridad Centralizada**: ((Implementada)) Actúa como un guardián de seguridad para todas las rutas anidadas dentro de `/dashboard`, asegurando que solo los usuarios autenticados puedan acceder.
 *
 * @subsection Melhorias Futuras
 * 1. **Carga de Datos Inicial**: ((Vigente)) Este Server Component es el lugar ideal para precargar datos globales del dashboard (como el `activeWorkspace`) y pasarlos a través de un proveedor de contexto en el `DashboardLayout` para evitar cascadas de peticiones en el cliente.
 *
 * =====================================================================
 */
