// src/app/[locale]/dev-console/users/page.tsx
/**
 * @file page.tsx
 * @description Punto de entrada principal para la página de gestión de usuarios en la Dev Console.
 *              Actúa como un guardián de seguridad y un cargador de datos, pasando
 *              la información al orquestador de cliente para su renderizado.
 *              Corregido para pasar el tipo de dato correcto al componente de cliente
 *              e implementando un `Suspense Boundary` para una UX mejorada.
 * @author Raz Podestá
 * @version 2.0.0
 */
import type { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Suspense } from "react"; // IMPROVEMENT: Import Suspense

import { requireAppRole } from "@/lib/auth/user-permissions";
import { admin as adminData } from "@/lib/data";
import { logger } from "@/lib/logging";
import { ErrorStateCard } from "@/components/shared/error-state-card";
import { UsersClient } from "./users-client";
import { Card } from "@/components/ui/card"; // Required for skeleton

const USERS_PER_PAGE = 20;

// IMPROVEMENT: Add a skeleton for UsersTable
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

// Separate loader component for Suspense
async function UsersPageLoader({
  searchParams,
}: {
  searchParams: { page?: string; q?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const searchQuery = searchParams.q || "";

  // 1. Guardián de Seguridad (moved up as it's critical and should not be suspended)
  const roleCheck = await requireAppRole(["developer"]);
  if (!roleCheck.success) {
    const redirectPath =
      roleCheck.error === "SESSION_NOT_FOUND"
        ? "/auth/login?next=/dev-console/users"
        : "/dashboard";
    return redirect(redirectPath);
  }

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
          profiles={profiles} // Now profiles is UserProfilesWithEmail['Row'][]
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

export default async function UsersPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { page?: string; q?: string };
}) {
  unstable_setRequestLocale(locale);
  // The roleCheck happens directly inside UsersPageLoader,
  // this top-level page component only handles the Suspense boundary.
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
 * @subsection Melhorias Adicionadas
 * 1. **`Suspense Boundary` de Élite**: ((Implementada)) A página agora usa um `<Suspense>` com um `UsersTableSkeleton` como fallback, o que melhora drasticamente a experiência de usuário percebida durante o carregamento de dados.
 * 2. **Separação de Lógica de Carregamento**: ((Implementada)) A lógica de carregamento de dados (incluindo o guardião de segurança) foi encapsulada no componente `UsersPageLoader`, seguindo o padrão canônico para Server Components e `Suspense`.
 *
 * @subsection Melhorias Futuras
 * 1. **Feedback de Carregamento de Ação**: ((Vigente)) O `UsersTableSkeleton` pode ser aprimorado para exibir um spinner ou indicador de carregamento dentro da tabela quando ações de mutação são pendentes.
 *
 * =====================================================================
 */
