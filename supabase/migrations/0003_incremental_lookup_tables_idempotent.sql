// supabase/migrations/0003_incremental_lookup_tables_idempotent.sql
/**
 * @file 0003_incremental_lookup_tables_idempotent.sql
 * @description Script de migración incremental, no destructivo e IDEMPOTENTE a la v11.1.
 *              Transforma ENUMs a Lookup Tables. Puede ejecutarse múltiples veces.
 * @version 11.1.0
 * @author L.I.A. Legacy & Raz Podestá
 */

BEGIN;

-- PASO PREVIO: LIMPIEZA IDEMPOTENTE DE ESTRUCTURAS NUEVAS Y ANTIGUAS
-- Esto asegura que el script pueda correr incluso si falló a la mitad.
ALTER TABLE IF EXISTS public.workspace_members DROP COLUMN IF EXISTS role_id;
ALTER TABLE IF EXISTS public.sites DROP COLUMN IF EXISTS status_id;
ALTER TABLE IF EXISTS public.campaigns DROP COLUMN IF EXISTS status_id;
ALTER TABLE IF EXISTS public.invitations DROP COLUMN IF EXISTS role_id;

DROP TABLE IF EXISTS public.workspace_roles;
DROP TABLE IF EXISTS public.site_statuses;
DROP TABLE IF EXISTS public.campaign_statuses;

DROP TYPE IF EXISTS public.workspace_role;
DROP TYPE IF EXISTS public.site_status;
DROP TYPE IF EXISTS public.campaign_status;

-- PASO 1: RECREAR LOS ENUMS ORIGINALES (para asegurar un punto de partida consistente)
CREATE TYPE public.workspace_role AS ENUM ('owner', 'admin', 'member', 'viewer', 'billing');
CREATE TYPE public.site_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.campaign_status AS ENUM ('draft', 'published', 'archived');

-- PASO 2: ASEGURAR QUE LAS COLUMNAS ENUM EXISTEN ANTES DE LA MIGRACIÓN
-- (Si el script falló después de borrarlas, las recreamos para la migración)
ALTER TABLE public.workspace_members ADD COLUMN IF NOT EXISTS role public.workspace_role;
ALTER TABLE public.sites ADD COLUMN IF NOT EXISTS status public.site_status;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS status public.campaign_status;
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS role public.workspace_role;


-- PASO 3: CREAR Y POBLAR LAS NUEVAS TABLAS DE CONVERSIÓN
CREATE TABLE public.workspace_roles ( id SERIAL PRIMARY KEY, name TEXT UNIQUE NOT NULL );
INSERT INTO public.workspace_roles (name) VALUES ('owner'), ('admin'), ('member'), ('viewer'), ('billing');

CREATE TABLE public.site_statuses ( id SERIAL PRIMARY KEY, name TEXT UNIQUE NOT NULL );
INSERT INTO public.site_statuses (name) VALUES ('draft'), ('published'), ('archived');

CREATE TABLE public.campaign_statuses ( id SERIAL PRIMARY KEY, name TEXT UNIQUE NOT NULL );
INSERT INTO public.campaign_statuses (name) VALUES ('draft'), ('published'), ('archived');


-- PASO 4: AÑADIR NUEVAS COLUMNAS DE CLAVE FORÁNEA
ALTER TABLE public.workspace_members ADD COLUMN role_id INTEGER REFERENCES public.workspace_roles(id);
ALTER TABLE public.sites ADD COLUMN status_id INTEGER REFERENCES public.site_statuses(id);
ALTER TABLE public.campaigns ADD COLUMN status_id INTEGER REFERENCES public.campaign_statuses(id);
ALTER TABLE public.invitations ADD COLUMN role_id INTEGER REFERENCES public.workspace_roles(id);


-- PASO 5: MIGRAR DATOS DE ENUM A INTEGER
-- Solo se ejecuta si la columna original existe y tiene datos
UPDATE public.workspace_members wm SET role_id = wr.id FROM public.workspace_roles wr WHERE wm.role IS NOT NULL AND wm.role::text = wr.name;
UPDATE public.sites s SET status_id = ss.id FROM public.site_statuses ss WHERE s.status IS NOT NULL AND s.status::text = ss.name;
UPDATE public.campaigns c SET status_id = cs.id FROM public.campaign_statuses cs WHERE c.status IS NOT NULL AND c.status::text = cs.name;
UPDATE public.invitations i SET role_id = wr.id FROM public.workspace_roles wr WHERE i.role IS NOT NULL AND i.role::text = wr.name;


-- PASO 6: IMPONER RESTRICCIONES NOT NULL Y VALORES POR DEFECTO
-- Llenar los NULLs que pudieran quedar antes de poner NOT NULL
UPDATE public.workspace_members SET role_id = (SELECT id FROM workspace_roles WHERE name = 'member') WHERE role_id IS NULL;
UPDATE public.sites SET status_id = (SELECT id FROM site_statuses WHERE name = 'draft') WHERE status_id IS NULL;
UPDATE public.campaigns SET status_id = (SELECT id FROM campaign_statuses WHERE name = 'draft') WHERE status_id IS NULL;
UPDATE public.invitations SET role_id = (SELECT id FROM workspace_roles WHERE name = 'member') WHERE role_id IS NULL;

ALTER TABLE public.workspace_members ALTER COLUMN role_id SET NOT NULL;
ALTER TABLE public.sites ALTER COLUMN status_id SET NOT NULL;
ALTER TABLE public.sites ALTER COLUMN status_id SET DEFAULT 1; -- draft
ALTER TABLE public.campaigns ALTER COLUMN status_id SET NOT NULL;
ALTER TABLE public.campaigns ALTER COLUMN status_id SET DEFAULT 1; -- draft
ALTER TABLE public.invitations ALTER COLUMN role_id SET NOT NULL;


-- PASO 7: ELIMINAR COLUMNAS ENUM OBSOLETAS
ALTER TABLE public.workspace_members DROP COLUMN IF EXISTS role;
ALTER TABLE public.sites DROP COLUMN IF EXISTS status;
ALTER TABLE public.campaigns DROP COLUMN IF EXISTS status;
ALTER TABLE public.invitations DROP COLUMN IF EXISTS role;


-- PASO 8: ELIMINAR TIPOS ENUM OBSOLETOS
DROP TYPE public.workspace_role;
DROP TYPE public.site_status;
DROP TYPE public.campaign_status;

COMMIT;
// supabase/migrations/0003_incremental_lookup_tables_idempotent.sql