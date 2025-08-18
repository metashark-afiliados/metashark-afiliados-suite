// src/lib/types/database/enums.ts
/**
 * @file enums.ts
 * @description Contiene las definiciones de tipo para todos los ENUMs de la base de datos.
 *              Ha sido sincronizado con el schema.sql v8.1 para incluir el tipo
 *              `plan_type`, resolviendo una desincronización crítica.
 * @author Raz Podestá
 * @version 3.0.0
 */
export type Enums = {
  app_role: "user" | "admin" | "developer";
  plan_type: "free" | "basic" | "pro" | "enterprise"; // <-- SINCRONIZADO
  workspace_role: "owner" | "admin" | "member";
  site_status: "draft" | "published" | "archived";
  campaign_status: "draft" | "published" | "archived";

  // Enums para futuras funcionalidades (ya presentes en el snapshot)
  subscription_interval: "day" | "week" | "month" | "year";
  subscription_price_type: "one_time" | "recurring";
  subscription_status:
    | "trialing"
    | "active"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "past_due"
    | "unpaid";
  token_type: "general_purpose" | "image_generation" | "text_analysis";
  ticket_status:
    | "open"
    | "in_progress"
    | "awaiting_reply"
    | "resolved"
    | "closed";
  ticket_priority: "low" | "medium" | "high" | "urgent";
  achievement_type:
    | "onboarding"
    | "creation_milestone"
    | "performance_milestone"
    | "community";
  leaderboard_scope: "global" | "workspace" | "country";
  commission_type: "percentage" | "fixed_amount";
  product_status: "active" | "inactive" | "pending_approval";
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Esquema**: ((Implementada)) Se ha añadido el tipo `plan_type`, alineando este manifiesto con el `schema.sql` y resolviendo la causa raíz del error TS2339.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) Este archivo debería ser generado automáticamente a partir de la introspección del esquema de la base de datos para prevenir futuras desincronizaciones.
 *
 * =====================================================================
 */
// src/lib/types/database/enums.ts
