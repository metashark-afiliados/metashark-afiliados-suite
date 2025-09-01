// src/lib/types/database/_supabase.manual.ts
/**
 * @file _supabase.manual.ts
 * @description Manifiesto de Tipos Manuales para la Base de Datos.
 *              Este aparato ensambla todos los tipos de entidades de la base de
 *              datos que no son generados automáticamente por la CLI de Supabase,
 *              consumiéndolos desde sus SSoT atómicas.
 * @author L.I.A Legacy
 * @copilot RaZ WriTe
 * @version 4.0.0
 * @see .docs-espejo/lib/types/database/_supabase.manual.ts.md
 */
import * as Views from "./views";

export type ManualDatabaseDefs = {
  public: {
    Views: {
      user_profiles_with_email: Views.UserProfilesWithEmail;
      sites_with_campaign_counts: Views.SitesWithCampaignCounts;
    };
  };
};
// src/lib/types/database/_supabase.manual.ts
