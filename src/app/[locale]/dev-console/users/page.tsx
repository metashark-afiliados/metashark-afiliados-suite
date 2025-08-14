// src/app/[locale]/dev-console/users/page.tsx
/**
 * @file page.tsx
 * @description Punto de entrada principal para la página de gestión de usuarios en la Dev Console.
 *              Actúa como un guardián de seguridad y un cargador de datos, pasando
 *              la información al orquestador de cliente para su renderizado.
 * @author Raz Podestá
 * @version 1.0.0
 */
import type { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";

import { requireAppRole } from "@/lib/auth/user-permissions";
import { admin as adminData } from "@/lib/data";
import { logger } from "@/lib/logging";
import { ErrorStateCard } from "@/components/shared/error-state-card";
import { UsersClient } from "./users-client";

const USERS_PER_PAGE = 20;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: "app.dev-console.UserManagementTable",
  });
  return {
    title: t("table_header.email"),
  };
}

export default async function UsersPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { page?: string; q?: string };
}) {
  unstable_setRequestLocale(locale);

  // 1. Guardián de Seguridad
  const roleCheck = await requireAppRole(["developer"]);
  if (!roleCheck.success) {
    const redirectPath =
      roleCheck.error === "SESSION_NOT_FOUND"
        ? "/auth/login?next=/dev-console/users"
        : "/dashboard";
    return redirect(redirectPath);
  }

  const page = Number(searchParams.page) || 1;
  const searchQuery = searchParams.q || "";

  try {
    // 2. Carga de Datos
    const { profiles, totalCount } = await adminData.getPaginatedUsersWithRoles(
      {
        page,
        limit: USERS_PER_PAGE,
        query: searchQuery,
      }
    );

    // 3. Renderizado del Cliente
    return (
      <div className="space-y-6">
        <UsersClient
          profiles={profiles}
          totalCount={totalCount ?? 0}
          page={page}
          limit={USERS_PER_PAGE}
          searchQuery={searchQuery}
        />
      </div>
    );
  } catch (error) {
    logger.error(
      "[DevConsole/Users] Error al cargar la lista de usuarios:",
      error instanceof Error ? error.message : String(error)
    );
    const t = await getTranslations("app.dev-console.CampaignsTable"); // Namespace similar para errores
    return (
      <ErrorStateCard
        icon={AlertTriangle}
        title={t("error_title")}
        description={t("error_description")}
      />
    );
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura Servidor-Cliente**: ((Implementada)) Sigue el patrón de élite donde el Server Component maneja la seguridad y la carga de datos, pasando props serializables al Client Component.
 * 2. **Paginación y Búsqueda del Lado del Servidor**: ((Implementada)) La lógica de paginación y búsqueda se ejecuta en el servidor, asegurando un rendimiento óptimo al transferir solo los datos necesarios al cliente.
 * 3. **Manejo de Errores Robusto**: ((Implementada)) Incluye un bloque `try/catch` que renderiza un estado de error claro si la capa de datos falla.
 *
 * @subsection Melhorias Futuras
 * 1. **Suspense Boundary**: ((Vigente)) Envolver el `UsersClient` en un `<Suspense>` con un `fallback` de esqueleto de carga (`<UsersTableSkeleton />`) para mejorar la experiencia de usuario percibida.
 *
 * =====================================================================
 */
// src/app/[locale]/dev-console/users/page.tsx
