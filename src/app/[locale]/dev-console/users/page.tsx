// src/app/[locale]/dev-console/users/page.tsx
/**
 * @file page.tsx
 * @description Punto de entrada y orquestador de UI para la gestión de usuarios.
 *              Refactorizado a un estándar de élite para alinear el logging con la
 *              Constitución y formalizar su arquitectura de carga de datos.
 * @author L.I.A. Legacy
 * @version 4.0.0
 * @see .docs-espejo/app/[locale]/dev-console/users/page.tsx.md
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

// Esqueleto de Carga (Componente Puro)
const UsersTableSkeleton = () => (
  <div className="space-y-6 relative animate-pulse">
    {/* ... contenido del esqueleto sin cambios ... */}
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

// Generador de Metadatos (Función Pura)
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

// Cargador de Datos (Componente de Servidor Atómico)
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
        ? "/login?next=/dev-console/users"
        : "/dashboard";
    return redirect(redirectPath);
  }

  try {
    const { profiles, totalCount } =
      await adminData.users.getPaginatedUsersWithRoles({
        page,
        limit: USERS_PER_PAGE,
        query: searchQuery,
      });

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
      { err: error as Error },
      "[DevConsole/Users] Error al cargar la lista de usuarios."
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

// Componente de Página (Ensamblador Puro)
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
// src/app/[locale]/dev-console/users/page.tsx
