// src/lib/types/database/enums.ts
/**
 * @file enums.ts
 * @description Contiene las definiciones de tipo para todos los ENUMs de la
 *              base de datos. Sincronizado con la arquitectura "Lean Database"
 *              (AD-002), eliminando los enums que fueron reemplazados por
 *              tablas de conversión.
 * @author L.I.A. Legacy
 * @copilot RaZ WriTe
 * @version 4.1.0
 */
export type Enums = {
  // --- ENUMs de Sistema y Autenticación ---
  app_role: "user" | "admin" | "developer";
  plan_type: "free" | "basic" | "pro" | "enterprise";

  // --- ENUMs de Monetización (Espejo de Stripe) ---
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

  // --- ENUMs de Dominios de Aplicación Futuros ---
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

  // --- ENUMs OBSOLETOS (Reemplazados por Lookup Tables) ---
  // workspace_role, site_status, campaign_status
};
// src/lib/types/database/enums.ts
