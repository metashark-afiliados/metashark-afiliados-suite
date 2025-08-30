/**
 * @file 20250830023000_upgrade_system_diagnostics_v2.sql
 * @description Migración de Base de Datos v2.0 para la Función de Diagnóstico.
 *              Esta es la Única Fuente de Verdad (SSoT) para la RPC de diagnóstico
 *              del sistema. Reemplaza la versión anterior con una implementación
 *              de élite que devuelve una radiografía completa del esquema como un
 *              único objeto JSONB consumible.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 */

BEGIN;

CREATE OR REPLACE FUNCTION public.get_system_diagnostics_v2()
RETURNS JSONB AS $$
DECLARE
    diagnostics_json JSONB;
BEGIN
    WITH
    -- CTE para obtener Relaciones (Foreign Keys)
    relations_cte AS (
        SELECT
            tc.table_schema AS table_schema,
            tc.table_name AS table_name,
            kcu.column_name AS column_name,
            ccu.table_schema AS foreign_table_schema,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name,
            tc.constraint_name AS constraint_name
        FROM
            information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
    ),
    -- CTE para obtener Índices
    indexes_cte AS (
        SELECT
            schemaname AS schema_name,
            tablename AS table_name,
            indexname AS index_name,
            indexdef AS index_definition
        FROM
            pg_catalog.pg_indexes
        WHERE
            schemaname NOT IN ('pg_catalog', 'information_schema')
    ),
    -- CTE para obtener Tipos Personalizados (ENUMs)
    types_cte AS (
        SELECT
            n.nspname AS schema_name,
            t.typname AS type_name,
            array_agg(e.enumlabel ORDER BY e.enumsortorder) AS enum_values
        FROM
            pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        JOIN pg_enum e ON t.oid = e.enumtypid
        WHERE
            n.nspname NOT IN ('pg_catalog', 'information_schema')
        GROUP BY
            n.nspname, t.typname
    ),
    -- CTE para obtener Constraints (CHECK, UNIQUE)
    constraints_cte AS (
        SELECT
            tc.table_schema,
            tc.table_name,
            tc.constraint_name,
            tc.constraint_type,
            cc.check_clause
        FROM
            information_schema.table_constraints tc
        LEFT JOIN information_schema.check_constraints cc
          ON tc.constraint_name = cc.constraint_name
          AND tc.table_schema = cc.constraint_schema
        WHERE
            tc.constraint_type IN ('CHECK', 'UNIQUE', 'PRIMARY KEY')
            AND tc.table_schema NOT IN ('pg_catalog', 'information_schema')
    ),
    -- CTE para obtener Vistas
    views_cte AS (
        SELECT
            table_schema AS view_schema,
            table_name AS view_name,
            view_definition
        FROM
            information_schema.views
        WHERE
            table_schema NOT IN ('pg_catalog', 'information_schema')
    ),
    -- CTE para obtener Extensiones
    extensions_cte AS (
        SELECT
            extname AS extension_name,
            extversion AS extension_version
        FROM
            pg_catalog.pg_extension
    ),
    -- CTE para obtener Privilegios
    grants_cte AS (
        SELECT
            grantee,
            table_schema,
            table_name,
            privilege_type
        FROM
            information_schema.role_table_grants
        WHERE
            grantee NOT IN ('postgres', 'supabase_admin')
            AND table_schema NOT IN ('pg_catalog', 'information_schema')
    )
    -- Ensamblaje final en un único objeto JSONB
    SELECT jsonb_build_object(
        'relations', (SELECT COALESCE(jsonb_agg(r), '[]'::jsonb) FROM relations_cte r),
        'indexes', (SELECT COALESCE(jsonb_agg(i), '[]'::jsonb) FROM indexes_cte i),
        'custom_types', (SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM types_cte t),
        'constraints', (SELECT COALESCE(jsonb_agg(c), '[]'::jsonb) FROM constraints_cte c),
        'views', (SELECT COALESCE(jsonb_agg(v), '[]'::jsonb) FROM views_cte v),
        'extensions', (SELECT COALESCE(jsonb_agg(e), '[]'::jsonb) FROM extensions_cte e),
        'grants', (SELECT COALESCE(jsonb_agg(g), '[]'::jsonb) FROM grants_cte g)
    ) INTO diagnostics_json;

    RETURN diagnostics_json;
END;
$$ LANGUAGE plpgsql;

COMMIT;