/**
 * @file src/db/schema.sql
 * @description Manifiesto Canónico Definitivo de Base de Datos v5.0.0.
 *              Este script es la Única Fuente de Verdad para la infraestructura
 *              completa de la base de datos de ConvertiKit. Es transaccional,
 *              idempotente y contiene la arquitectura de élite completa, incluyendo
 *              tablas, tipos, funciones, triggers, RLS y optimizaciones.
 * @version 5.0.0
 * @author Raz Podestá
 */

BEGIN;

-- --- PASO 0: LIMPIEZA IDEMPOTENTE Y ROBUSTA ---
-- Elimina los objetos en orden inverso de dependencia para evitar errores.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_setup();
DROP FUNCTION IF EXISTS public.duplicate_campaign_rpc(uuid);
-- (Añadir aquí DROP para cualquier otro trigger o RPC)

DROP TABLE IF EXISTS public.visitor_logs;
DROP TABLE IF EXISTS public.campaigns;
DROP TABLE IF EXISTS public.sites;
DROP TABLE IF EXISTS public.invitations;
DROP TABLE IF EXISTS public.workspace_members;
DROP TABLE IF EXISTS public.workspaces;
DROP TABLE IF EXISTS public.profiles;

DROP TYPE IF EXISTS public.campaign_status;
DROP TYPE IF EXISTS public.site_status;
DROP TYPE IF EXISTS public.workspace_role;
DROP TYPE IF EXISTS public.plan_type;
DROP TYPE IF EXISTS public.app_role;

-- --- PASO 1: EXTENSIONES ---
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --- PASO 2: ENUMS (TIPOS DE DATOS PERSONALIZADOS) ---
CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'developer');
CREATE TYPE public.plan_type AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE public.workspace_role AS ENUM ('owner', 'admin', 'member');
CREATE TYPE public.site_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.campaign_status AS ENUM ('draft', 'published', 'archived');

-- --- PASO 3: TABLAS CORE ---

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    app_role app_role NOT NULL DEFAULT 'user',
    plan_type plan_type NOT NULL DEFAULT 'free',
    dashboard_layout JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
COMMENT ON TABLE public.profiles IS 'Extends auth.users with app-specific data.';

CREATE TABLE public.workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    icon TEXT,
    current_site_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
COMMENT ON TABLE public.workspaces IS 'Primary multi-tenant entity.';

CREATE TABLE public.workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role workspace_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(workspace_id, user_id)
);
COMMENT ON TABLE public.workspace_members IS 'Join table for profiles and workspaces.';

CREATE TABLE public.invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    invited_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    invitee_email TEXT NOT NULL,
    role workspace_role NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    UNIQUE(workspace_id, invitee_email)
);
COMMENT ON TABLE public.invitations IS 'Stores pending invitations for users to join workspaces.';

CREATE TABLE public.sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    subdomain TEXT UNIQUE,
    custom_domain TEXT UNIQUE,
    icon TEXT,
    description TEXT,
    status site_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
COMMENT ON TABLE public.sites IS 'Represents a user project or website.';

CREATE TABLE public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    status campaign_status NOT NULL DEFAULT 'draft',
    content JSONB,
    affiliate_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    UNIQUE(site_id, slug)
);
COMMENT ON TABLE public.campaigns IS 'Core marketing asset, a landing page or funnel.';

CREATE TABLE public.visitor_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    fingerprint TEXT NOT NULL,
    ip_address INET,
    geo_data JSONB,
    user_agent TEXT,
    utm_params JSONB,
    referrer TEXT,
    landing_page TEXT,
    browser_context JSONB,
    is_bot BOOLEAN DEFAULT false,
    is_known_abuser BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.visitor_logs IS 'Stores raw analytics data for each visitor interaction.';

-- --- PASO 4: TRIGGERS Y FUNCIONES DE AUTOMATIZACIÓN ---

CREATE OR REPLACE FUNCTION public.handle_new_user_setup()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- 1. Insertar perfil
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  -- 2. Crear workspace personal (Lógica de la RPC `create_workspace_with_owner`)
  INSERT INTO public.workspaces (name, owner_id)
  VALUES (
    COALESCE(new.raw_user_meta_data->>'full_name', new.email) || '''s Workspace',
    new.id
  ) RETURNING id INTO new_workspace_id;

  -- 3. Añadir usuario como 'owner'
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace_id, new.id, 'owner');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_setup();

-- --- PASO 5: FUNCIONES RPC DE LÓGICA DE NEGOCIO ---

CREATE OR REPLACE FUNCTION public.duplicate_campaign_rpc(campaign_id_to_duplicate UUID, new_name TEXT)
RETURNS TABLE(id UUID) AS $$
DECLARE
    original_campaign RECORD;
    new_campaign_id UUID;
BEGIN
    SELECT * INTO original_campaign FROM public.campaigns WHERE id = campaign_id_to_duplicate;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Campaña original con ID % no encontrada', campaign_id_to_duplicate;
    END IF;
    
    INSERT INTO public.campaigns (
        site_id, created_by, name, slug, status, content, affiliate_url
    )
    VALUES (
        original_campaign.site_id,
        original_campaign.created_by,
        new_name,
        original_campaign.slug || '-copia-' || substr(md5(random()::text), 0, 7),
        'draft',
        original_campaign.content,
        original_campaign.affiliate_url
    ) RETURNING campaigns.id INTO new_campaign_id;
    
    RETURN QUERY SELECT new_campaign_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- PASO 6: POLÍTICAS DE SEGURIDAD (RLS) ---
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage their own profile." ON public.profiles FOR ALL USING (auth.uid() = id);

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view workspaces they belong to." ON public.workspaces FOR SELECT USING (EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = id AND user_id = auth.uid()));
CREATE POLICY "Owners and admins can manage their workspaces." ON public.workspaces FOR ALL USING (EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = id AND user_id = auth.uid() AND (role = 'owner' OR role = 'admin')));

ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view other members of their workspaces." ON public.workspace_members FOR SELECT USING (EXISTS (SELECT 1 FROM public.workspace_members m WHERE m.workspace_id = workspace_members.workspace_id AND m.user_id = auth.uid()));
CREATE POLICY "Owners and admins can manage members." ON public.workspace_members FOR ALL USING (EXISTS (SELECT 1 FROM public.workspace_members m WHERE m.workspace_id = workspace_members.workspace_id AND m.user_id = auth.uid() AND (role = 'owner' OR role = 'admin')));

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can manage invitations for their workspaces." ON public.invitations FOR ALL USING (EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = invitations.workspace_id AND user_id = auth.uid()));

ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workspace members can manage their sites." ON public.sites FOR ALL USING (EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = sites.workspace_id AND user_id = auth.uid()));

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workspace members can manage their campaigns." ON public.campaigns FOR ALL USING (EXISTS (SELECT 1 FROM public.sites s JOIN public.workspace_members m ON s.workspace_id = m.workspace_id WHERE s.id = campaigns.site_id AND m.user_id = auth.uid()));

ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous inserts." ON public.visitor_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Deny all reads." ON public.visitor_logs FOR SELECT USING (false);

COMMIT;