
/**
 * @file 0004_rpc_get_content_diagnostics.sql
 * @description Script de migración incremental que crea la RPC de diagnóstico de contenido.
 * @version 12.0.0
 * @author L.I.A. Legacy & Raz Podestá
 */

BEGIN;

CREATE OR REPLACE FUNCTION public.get_content_diagnostics()
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
AS $$
SELECT jsonb_build_object(
    'generated_at', NOW(),
    'entity_counts', (
        SELECT jsonb_build_object(
            'profiles', (SELECT COUNT(*) FROM public.profiles),
            'workspaces', (SELECT COUNT(*) FROM public.workspaces),
            'sites', (SELECT COUNT(*) FROM public.sites),
            'creations', (SELECT COUNT(*) FROM public.creations),
            'campaigns', (SELECT COUNT(*) FROM public.campaigns)
        )
    ),
    'relationship_metrics', (
        SELECT jsonb_build_object(
            'avg_members_per_workspace', (SELECT AVG(member_count) FROM (SELECT COUNT(user_id) as member_count FROM public.workspace_members GROUP BY workspace_id) as counts),
            'avg_sites_per_workspace', (SELECT AVG(site_count) FROM (SELECT COUNT(id) as site_count FROM public.sites GROUP BY workspace_id) as counts)
        )
    ),
    'status_distribution', (
        SELECT jsonb_build_object(
            'sites', (SELECT jsonb_object_agg(s.name, t.count) FROM (SELECT status_id, count(*) FROM public.sites GROUP BY status_id) t JOIN public.site_statuses s ON t.status_id = s.id),
            'campaigns', (SELECT jsonb_object_agg(s.name, t.count) FROM (SELECT status_id, count(*) FROM public.campaigns GROUP BY status_id) t JOIN public.campaign_statuses s ON t.status_id = s.id)
        )
    ),
    'system_health', (
        SELECT jsonb_build_object(
            'total_invitations', (SELECT COUNT(*) FROM public.invitations),
            'pending_invitations', (SELECT COUNT(*) FROM public.invitations WHERE status = 'pending'),
            'visitor_logs_24h', (SELECT COUNT(*) FROM public.visitor_logs WHERE created_at > NOW() - INTERVAL '24 hours'),
            'audit_logs_24h', (SELECT COUNT(*) FROM public.audit_logs WHERE created_at > NOW() - INTERVAL '24 hours'),
            'system_errors_total', (SELECT COUNT(*) FROM public.system_errors),
            'system_errors_new', (SELECT COUNT(*) FROM public.system_errors WHERE status = 'new')
        )
    )
);
$$;

COMMIT;
