// src/app/[locale]/dev-console/users/page.tsx
/**
 * @file page.tsx
 * @description Punto de entrada para la gestión de usuarios. Ha sido refactorizado
 *              para consumir la nueva API de datos atomizada, resolviendo el
 *              error de compilación TS2339 y alineándose con la SSoT de la
 *              capa de datos.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { AlertTriangle } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { ErrorStateCard } from "@/components/shared/error-state-card";
import { requireAppRole } from "@/lib/auth/user-permissions";
import { admin as adminData } from "@/lib/data";
import { logger } from "@/lib/logger";
import { UsersClient } from "./users-client";

const USERS_PER_PAGE = 20;

const UsersTableSkeleton = () => (
  <div className="space-y-6 relative animate-pulse">
    <div className="h-10 w-1/3 bg-muted rounded-md mb-4" />
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="h-12 px-4 text-left font-medium text-muted-foreground">
              <div className="h-5 w-24 bg-muted-foreground/20 rounded-md" />
            </th>
            <th className="h-12 px-4 text-left font-medium text-muted-foreground">
              <div className="h-5 w-24 bg-muted-foreground/20 rounded-md" />
            </th>
            <th className="h-12 px-4 text-left font-medium text-muted-foreground">
              <div className="h-5 w-24 bg-muted-foreground/20 rounded-md" />
            </th>
            <th className="h-12 px-4 text-right font-medium text-muted-foreground">
              <div className="h-5 w-16 bg-muted-foreground/20 rounded-md ml-auto" />
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b last:border-b-0">
              <td className="p-4 align-middle">
                <div className="h-5 w-3/4 bg-muted rounded-md" />
              </td>
              <td className="p-4 align-middle">
                <div className="h-5 w-1/2 bg-muted rounded-md" />
              </td>
              <td className="p-4 align-middle">
                <div className="h-8 w-24 bg-muted rounded-md" />
              </td>
              <td className="p-4 align-middle text-right">
                <div className="h-8 w-8 bg-muted rounded-md ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="flex items-center justify-end gap-2 mt-8">
      <div className="h-10 w-10 bg-muted rounded-md" />
      <div className="h-10 w-10 bg-muted rounded-md" />
      <div className="h-10 w-10 bg-muted rounded-md" />
    </div>
  </div>
);

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

async function UsersPageLoader({
  searchParams,
}: {
  searchParams: { page?: string; q?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const searchQuery = searchParams.q || "";

  const roleCheck = await requireAppRole(["developer"]);
  if (!roleCheck.success) {
    const redirectPath =
      roleCheck.error === "SESSION_NOT_FOUND"
        ? "/auth/login?next=/dev-console/users"
        : "/dashboard";
    return redirect(redirectPath);
  }

  try {
    // --- INICIO DE CORRECCIÓN ARQUITECTÓNICA (TS2339) ---
    // Se consume la función desde el módulo atomizado y namespaced,
    // alineando el componente con la nueva SSoT de la capa de datos.
    const { profiles, totalCount } =
      await adminData.users.getPaginatedUsersWithRoles({
        page,
        limit: USERS_PER_PAGE,
        query: searchQuery,
      });
    // --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---

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
    const t = await getTranslations("app.dev-console.CampaignsTable");
    return (
      <ErrorStateCard
        icon={AlertTriangle}
        title={t("error_title")}
        description={t("error_description")}
      />
    );
  }
}

export default async function UsersPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { page?: string; q?: string };
}) {
  unstable_setRequestLocale(locale);
  return (
    <Suspense fallback={<UsersTableSkeleton />}>
      <UsersPageLoader searchParams={searchParams} />
    </Suspense>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Abstracción de `loading.tsx`**: ((Vigente)) El componente `UsersTableSkeleton` está definido localmente. Para una adhesión estricta a las convenciones de Next.js y al principio DRY, debería ser extraído a su propio archivo `loading.tsx` en el mismo directorio.
 * 2. **Filtros Avanzados**: ((Vigente)) La UI podría ser extendida para incluir filtros que permitan al administrador buscar usuarios por `app_role` específico. Esto requeriría actualizar la función `getPaginatedUsersWithRoles` para aceptar un nuevo parámetro de filtro.
 *
 * =====================================================================
 */
// src/app/[locale]/dev-console/users/page.tsx
