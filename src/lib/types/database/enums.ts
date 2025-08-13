/**
 * @file enums.ts
 * @description Contiene las definiciones de tipo para todos los ENUMs de la base de datos.
 *              Ha sido nivelado para incluir el tipo `campaign_status`, resolviendo una
 *              desincronización crítica de esquema que causaba errores de compilación.
 * @author Raz Podestá
 * @version 2.1.0
 */
export type Enums = {
  app_role: "user" | "admin" | "developer";
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
  workspace_role: "owner" | "admin" | "member";
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
  // --- MEJORA DE ÉLITE: Sincronización de Esquema ---
  campaign_status: "draft" | "active" | "paused" | "completed" | "archived";
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Esquema**: ((Implementada)) Se ha añadido el tipo `campaign_status`, alineando este manifiesto con el `schema.sql` y resolviendo la causa raíz del error `TS2339`.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) Este archivo debería ser generado automáticamente a partir de la introspección del esquema de la base de datos.
 *
 * =====================================================================
 */
