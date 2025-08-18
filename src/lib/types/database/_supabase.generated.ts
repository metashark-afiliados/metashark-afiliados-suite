// src/lib/types/database/_supabase.generated.ts
/**
 * @file _supabase.generated.ts
 * @description Manifiesto de tipos de base de datos canónico y ensamblado.
 *              Actualizado para incluir la tabla `feature_modules`.
 * @author Raz Podestá
 * @version 2025-08-15T19:30:00.000Z
 */
import { type Enums } from "./enums";
import { type Functions } from "./functions";
import * as Tables from "./tables";

export type Database = {
  public: {
    Tables: {
      achievements: Tables.Achievements;
      affiliate_products: Tables.AffiliateProducts;
      asset_library: Tables.AssetLibrary;
      audit_logs: Tables.AuditLogs;
      brand_kits: Tables.BrandKits;
      campaigns: Tables.Campaigns;
      coupons: Tables.Coupons;
      custom_blocks: Tables.CustomBlocks;
      customers: Tables.Customers;
      feature_modules: Tables.FeatureModules; // <-- SINCRONIZADO
      invitations: Tables.Invitations;
      notifications: Tables.Notifications;
      prices: Tables.Prices;
      product_categories: Tables.ProductCategories;
      products: Tables.Products;
      profiles: Tables.Profiles;
      site_templates: Tables.SiteTemplates;
      sites: Tables.Sites;
      subscribers: Tables.Subscribers;
      subscriptions: Tables.Subscriptions;
      system_errors: Tables.SystemErrors;
      template_categories: Tables.TemplateCategories;
      ticket_messages: Tables.TicketMessages;
      tickets: Tables.Tickets;
      user_achievements: Tables.UserAchievements;
      user_tokens: Tables.UserTokens;
      visitor_logs: Tables.VisitorLogs;
      workspace_members: Tables.WorkspaceMembers;
      workspaces: Tables.Workspaces;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: Functions;
    Enums: Enums;
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
// src/lib/types/database/_supabase.generated.ts