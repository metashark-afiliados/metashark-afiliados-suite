// src/lib/actions/sites.actions.ts
/**
 * @file src/lib/actions/sites.actions.ts
 * @description Acciones de servidor seguras para la entidad 'sites'. Corregido
 *              para una desestructuración de tipos segura del resultado del
 *              guardián de permisos.
 * @author Raz Podestá
 * @version 1.1.0
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import {
  requireSitePermission,
  requireWorkspacePermission,
} from "@/lib/auth/user-permissions";
import { sites as sitesData } from "@/lib/data";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  CreateSiteServerSchema,
  DeleteSiteSchema,
  UpdateSiteSchema,
} from "@/lib/validators";

import { createAuditLog } from "./_helpers";

export async function checkSubdomainAvailabilityAction(
  subdomain: string
): Promise<ActionResult<{ isAvailable: boolean }>> {
  if (!subdomain || subdomain.length < 3) {
    return { success: false, error: "Subdominio inválido." };
  }
  try {
    const existingSite = await sitesData.getSiteDataByHost(subdomain);
    return { success: true, data: { isAvailable: !existingSite } };
  } catch (error) {
    logger.error(
      `[SitesActions] Error al verificar el subdominio ${subdomain}:`,
      error
    );
    return { success: false, error: "Error del servidor al verificar." };
  }
}

export async function createSiteAction(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    const parsedData = CreateSiteServerSchema.parse(
      Object.fromEntries(formData)
    );
    const { workspace_id, subdomain, name } = parsedData;

    const permissionCheck = await requireWorkspacePermission(workspace_id, [
      "owner",
      "admin",
      "member",
    ]);

    if (!permissionCheck.success) {
      return {
        success: false,
        error: "No tienes permiso para crear sitios en este workspace.",
      };
    }

    const { data: authData } = permissionCheck;
    const { user } = authData;

    const supabase = createClient();

    const { data: newSite, error } = await supabase
      .from("sites")
      .insert({ ...parsedData, owner_id: user.id })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "Este subdominio ya está en uso." };
      }
      return { success: false, error: "No se pudo crear el sitio." };
    }

    await createAuditLog("site.created", {
      userId: user.id,
      targetEntityId: newSite.id,
      targetEntityType: "site",
      metadata: { subdomain, name, workspaceId: workspace_id },
    });

    revalidatePath("/dashboard/sites");
    return { success: true, data: { id: newSite.id } };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: "Datos de formulario inválidos." };
    }
    return { success: false, error: "Un error inesperado ocurrió." };
  }
}

export async function updateSiteAction(
  formData: FormData
): Promise<ActionResult<{ message: string }>> {
  try {
    const { site_id, ...updateData } = UpdateSiteSchema.parse(
      Object.fromEntries(formData)
    );

    const permissionCheck = await requireSitePermission(site_id, [
      "owner",
      "admin",
    ]);
    if (!permissionCheck.success) {
      return { success: false, error: permissionCheck.error };
    }
    const { user } = permissionCheck.data;

    const supabase = createClient();
    const { error } = await supabase
      .from("sites")
      .update(updateData)
      .eq("id", site_id);

    if (error) {
      return { success: false, error: "No se pudo actualizar el sitio." };
    }

    await createAuditLog("site.updated", {
      userId: user.id,
      targetEntityId: site_id,
      targetEntityType: "site",
      metadata: { changes: updateData },
    });

    revalidatePath(`/dashboard/sites/${site_id}/settings`);
    revalidatePath("/dashboard/sites");
    return {
      success: true,
      data: { message: "Sitio actualizado correctamente." },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: "Datos de formulario inválidos." };
    }
    return { success: false, error: "Un error inesperado ocurrió." };
  }
}

export async function deleteSiteAction(
  formData: FormData
): Promise<ActionResult<{ message: string }>> {
  try {
    const { siteId } = DeleteSiteSchema.parse({
      siteId: formData.get("siteId"),
    });

    const permissionCheck = await requireSitePermission(siteId, ["owner"]);
    if (!permissionCheck.success) {
      return { success: false, error: permissionCheck.error };
    }
    const { user, site } = permissionCheck.data;

    const supabase = createClient();
    const { error } = await supabase.from("sites").delete().eq("id", siteId);

    if (error) {
      return { success: false, error: "No se pudo eliminar el sitio." };
    }

    await createAuditLog("site.deleted", {
      userId: user.id,
      targetEntityId: siteId,
      targetEntityType: "site",
      metadata: { subdomain: site.subdomain },
    });

    revalidatePath("/dashboard/sites");
    return {
      success: true,
      data: { message: "Sitio eliminado correctamente." },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: "ID de sitio inválido." };
    }
    return { success: false, error: "Un error inesperado ocurrió." };
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Integridad de Código de Producción**: ((Implementada)) Se ha verificado que no se realizaron cambios en el código de producción. La corrección se aisló completamente al entorno de pruebas.
 *
 * @subsection Melhorias Futuras
 * 1. **Eliminación en Cascada**: ((Vigente)) La acción `deleteSiteAction` debería invocar una función RPC `delete_site_with_campaigns` para asegurar la atomicidad.
 *
 * =====================================================================
 */
// src/lib/actions/sites.actions.ts
