
/**
 * @file 0003_incremental_lookup_tables.sql
 * @description Script de migración incremental y no destructivo a la v11.0.
 *              Transforma ENUMs a Lookup Tables sin pérdida de datos.
 * @version 11.0.0
 * @author Raz Podestá - MetaShark Tech & Raz Podestá
 */

BEGIN;

-- PASO 1: CREAR Y POBLAR LAS NUEVAS TABLAS DE CONVERSIÓN
CREATE TABLE public.workspace_roles ( id SERIAL PRIMARY KEY, name TEXT UNIQUE NOT NULL );
INSERT INTO public.workspace_roles (name) VALUES ('owner'), ('admin'), ('member'), ('viewer'), ('billing');

CREATE TABLE public.site_statuses ( id SERIAL PRIMARY KEY, name TEXT UNIQUE NOT NULL );
INSERT INTO public.site_statuses (name) VALUES ('draft'), ('published'), ('archived');

CREATE TABLE public.campaign_statuses ( id SERIAL PRIMARY KEY, name TEXT UNIQUE NOT NULL );
INSERT INTO public.campaign_statuses (name) VALUES ('draft'), ('published'), ('archived');

-- PASO 2: AÑADIR NUEVAS COLUMNAS DE CLAVE FORÁNEA (NULLABLE INICIALMENTE)
ALTER TABLE public.workspace_members ADD COLUMN role_id INTEGER REFERENCES public.workspace_roles(id);
ALTER TABLE public.sites ADD COLUMN status_id INTEGER REFERENCES public.site_statuses(id);
ALTER TABLE public.campaigns ADD COLUMN status_id INTEGER REFERENCES public.campaign_statuses(id);
ALTER TABLE public.invitations ADD COLUMN role_id INTEGER REFERENCES public.workspace_roles(id);

-- PASO 3: MIGRAR DATOS DE ENUM A INTEGER
UPDATE public.workspace_members wm SET role_id = wr.id FROM public.workspace_roles wr WHERE wm.role::text = wr.name;
UPDATE public.sites s SET status_id = ss.id FROM public.site_statuses ss WHERE s.status::text = ss.name;
UPDATE public.campaigns c SET status_id = cs.id FROM public.campaign_statuses cs WHERE c.status::text = cs.name;
UPDATE public.invitations i SET role_id = wr.id FROM public.workspace_roles wr WHERE i.role::text = wr.name;

-- PASO 4: IMPONER RESTRICCIONES NOT NULL
ALTER TABLE public.workspace_members ALTER COLUMN role_id SET NOT NULL;
ALTER TABLE public.sites ALTER COLUMN status_id SET NOT NULL;
ALTER TABLE public.sites ALTER COLUMN status_id SET DEFAULT 1; -- draft
ALTER TABLE public.campaigns ALTER COLUMN status_id SET NOT NULL;
ALTER TABLE public.campaigns ALTER COLUMN status_id SET DEFAULT 1; -- draft
ALTER TABLE public.invitations ALTER COLUMN role_id SET NOT NULL;

-- PASO 5: ELIMINAR COLUMNAS ENUM OBSOLETAS
ALTER TABLE public.workspace_members DROP COLUMN role;
ALTER TABLE public.sites DROP COLUMN status;
ALTER TABLE public.campaigns DROP COLUMN status;
ALTER TABLE public.invitations DROP COLUMN role;

-- PASO 6: ELIMINAR TIPOS ENUM OBSOLETOS
DROP TYPE public.workspace_role;
DROP TYPE public.site_status;
DROP TYPE public.campaign_status;

COMMIT;
