-- supabase/migrations/YYYYMMDDHHMMSS_create_system_diagnostics_function.sql
/**
 * @file Creación de la función de diagnóstico del sistema.
 * @description Esta función RPC es el pilar de nuestra herramienta de
 *              auditoría de esquema. Está diseñada para ser 100% resiliente
 *              y ejecutarse en una base de datos completamente vacía,
 *              proporcionando una "radiografía" del estado actual del sistema
 *              (esquemas, tablas, RLS, etc.) en formato JSON.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 */
CREATE OR REPLACE FUNCTION public.get_system_diagnostics()
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
WITH system_tables AS (
  SELECT
    t.table_schema,
    t.table_name,
    COALESCE(jsonb_agg(jsonb_build_object(
      'column_name', c.column_name,
      'data_type', c.data_type,
      'is_nullable', c.is_nullable,
      'column_default', c.column_default
    ) ORDER BY c.ordinal_position) FILTER (WHERE c.column_name IS NOT NULL), '[]'::jsonb) AS columns
  FROM information_schema.tables t
  LEFT JOIN information_schema.columns c
    ON t.table_schema = c.table_schema AND t.table_name = c.table_name
  WHERE t.table_schema NOT IN ('pg_catalog', 'information_schema', 'storage', 'graphql', 'graphql_public', 'realtime', 'pgsodium', 'pgsodium_masks')
  GROUP BY t.table_schema, t.table_name
),
system_rls AS (
  SELECT
    p.schemaname AS table_schema,
    p.tablename AS table_name,
    COALESCE(jsonb_agg(jsonb_build_object(
      'policy_name', p.policyname,
      'command', p.cmd,
      'roles', p.roles,
      'definition', p.qual,
      'with_check', p.with_check
    )), '[]'::jsonb) AS policies
  FROM pg_policies p
  WHERE p.schemaname NOT IN ('pg_catalog', 'information_schema', 'storage', 'graphql', 'graphql_public', 'realtime', 'pgsodium', 'pgsodium_masks')
  GROUP BY p.schemaname, p.tablename
),
system_functions AS (
  SELECT
    r.specific_schema,
    COALESCE(jsonb_agg(jsonb_build_object(
      'function_name', r.routine_name,
      'data_type', r.data_type,
      'type', r.routine_type
    )), '[]'::jsonb) AS functions
  FROM information_schema.routines r
  WHERE r.specific_schema NOT IN ('pg_catalog', 'information_schema', 'storage', 'graphql', 'graphql_public', 'realtime', 'pgsodium', 'pgsodium_masks')
  GROUP BY r.specific_schema
),
system_triggers AS (
    SELECT
        event_object_schema as trigger_schema,
        COALESCE(jsonb_agg(jsonb_build_object(
            'trigger_name', trigger_name,
            'event_manipulation', event_manipulation,
            'event_object_table', event_object_table,
            'action_timing', action_timing
        )), '[]'::jsonb) as triggers
    FROM information_schema.triggers
    WHERE event_object_schema NOT IN ('pg_catalog', 'information_schema', 'storage', 'graphql', 'graphql_public', 'realtime', 'pgsodium', 'pgsodium_masks')
    GROUP BY event_object_schema
)
SELECT jsonb_build_object(
  'tables', (
    SELECT COALESCE(jsonb_agg(
      jsonb_build_object(
        'schema', st.table_schema,
        'name', st.table_name,
        'columns', st.columns,
        'rls_policies', COALESCE(sr.policies, '[]'::jsonb)
      )
    ), '[]'::jsonb)
    FROM system_tables st
    LEFT JOIN system_rls sr ON st.table_schema = sr.table_schema AND st.table_name = sr.table_name
  ),
  'functions', (
      SELECT COALESCE(jsonb_agg(sf), '[]'::jsonb) FROM system_functions sf
  ),
  'triggers', (
      SELECT COALESCE(jsonb_agg(st), '[]'::jsonb) FROM system_triggers st
  )
);
$$;
-- supabase/migrations/YYYYMMDDHHMMSS_create_system_diagnostics_function.sql