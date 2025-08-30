// src/db/schema.sql
/**
 * @file src/db/schema.sql
 * @description Manifiesto Canónico Definitivo de Base de Datos v9.0.0.
 *              Este script quirúrgico resuelve los errores de dependencia
 *              eliminando explícitamente las políticas RLS conflictivas
 *              antes de eliminar las tablas, garantizando una idempotencia absoluta.
 * @version 9.0.0
 * @author Raz Podestá
 */

BEGIN;

-- --- PASO 0: LIMPIEZA QUIRÚRGICA IDEMPOTENTE ---
-- Primero, eliminar los objetos de más alto nivel (triggers, funciones)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_setup();

-- --- INICIO DE REFACTORIZACIÓN QUIRÚRGICA (RLS Dependencies) ---
-- Eliminar las políticas en `workspaces` que dependen de `workspace_members`
DROP POLICY IF EXISTS "Members can view workspaces they belong to." ON public.workspaces;
DROP POLICY IF EXISTS "Owners and admins can manage their workspaces." ON public.workspaces;
-- --- FIN DE REFACTORIZACIÓN QUIRÚRGICA ---

-- Ahora, proceder con el DROP de tablas en el orden correcto
DROP TABLE IF EXISTS public.visitor_logs;
DROP TABLE IF EXISTS public.campaigns;
DROP TABLE IF EXISTS public.creations;
DROP TABLE IF EXISTS public.sites;
DROP TABLE IF EXISTS public.invitations;
DROP TABLE IF EXISTS public.workspace_members;
DROP TABLE IF EXISTS public.workspaces;
DROP TABLE IF EXISTS public.profiles;
-- (y el resto de las tablas)
DROP TABLE IF EXISTS public.user_achievements;
DROP TABLE IF EXISTS public.achievements;
DROP TABLE IF EXISTS public.ticket_messages;
DROP TABLE IF EXISTS public.tickets;
DROP TABLE IF EXISTS public.user_tokens;
DROP TABLE IF EXISTS public.system_errors;
DROP TABLE IF EXISTS public.audit_logs;
DROP TABLE IF EXISTS public.subscriptions;
DROP TABLE IF EXISTS public.prices;
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.customers;
DROP TABLE IF EXISTS public.coupons;
DROP TABLE IF EXISTS public.affiliate_products;
DROP TABLE IF EXISTS public.product_categories;
DROP TABLE IF EXISTS public.custom_blocks;
DROP TABLE IF EXISTS public.site_templates;
DROP TABLE IF EXISTS public.template_categories;
DROP TABLE IF EXISTS public.asset_library;
DROP TABLE IF EXISTS public.brand_kits;
DROP TABLE IF EXISTS public.subscribers;
DROP TABLE IF EXISTS public.feature_flags;
DROP TABLE IF EXISTS public.feature_modules;

-- Finalmente, eliminar los tipos ENUM
DROP TYPE IF EXISTS public.achievement_type;
DROP TYPE IF EXISTS public.ticket_priority;
DROP TYPE IF EXISTS public.ticket_status;
DROP TYPE IF EXISTS public.token_type;
DROP TYPE IF EXISTS public.subscription_status;
DROP TYPE IF EXISTS public.subscription_price_type;
DROP TYPE IF EXISTS public.subscription_interval;
DROP TYPE IF EXISTS public.product_status;
DROP TYPE IF EXISTS public.commission_type;
DROP TYPE IF EXISTS public.campaign_status;
DROP TYPE IF EXISTS public.site_status;
DROP TYPE IF EXISTS public.workspace_role;
DROP TYPE IF EXISTS public.plan_type;
DROP TYPE IF EXISTS public.app_role;

-- --- PASO 1: EXTENSIONES ---
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --- PASO 2: ENUMS ---
CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'developer');
CREATE TYPE public.plan_type AS ENUM ('free', 'basic', 'pro', 'enterprise');
CREATE TYPE public.workspace_role AS ENUM ('owner', 'admin', 'member', 'viewer', 'billing');
CREATE TYPE public.site_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.campaign_status AS ENUM ('draft', 'published', 'archived');
-- (y el resto de los ENUMs)
CREATE TYPE public.commission_type AS ENUM ('percentage', 'fixed_amount');
CREATE TYPE public.product_status AS ENUM ('active', 'inactive', 'pending_approval');
CREATE TYPE public.subscription_interval AS ENUM ('day', 'week', 'month', 'year');
CREATE TYPE public.subscription_price_type AS ENUM ('one_time', 'recurring');
CREATE TYPE public.subscription_status AS ENUM ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid');
CREATE TYPE public.token_type AS ENUM ('general_purpose', 'image_generation', 'text_analysis');
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'awaiting_reply', 'resolved', 'closed');
CREATE TYPE public.ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.achievement_type AS ENUM ('onboarding', 'creation_milestone', 'performance_milestone', 'community');

-- --- PASO 3: TABLAS ---
-- La creación de tablas sigue el orden de dependencia natural
CREATE TABLE public.profiles ( id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, email TEXT NOT NULL UNIQUE, full_name TEXT, avatar_url TEXT, app_role app_role NOT NULL DEFAULT 'user', plan_type plan_type NOT NULL DEFAULT 'free', dashboard_layout JSONB, has_completed_onboarding BOOLEAN NOT NULL DEFAULT false, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ );
CREATE TABLE public.workspaces ( id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name TEXT NOT NULL, owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT, icon TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ );
CREATE TABLE public.workspace_members ( id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE, user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, role workspace_role NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(workspace_id, user_id) );
CREATE TABLE public.sites ( id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE, owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, name TEXT NOT NULL, subdomain TEXT UNIQUE, custom_domain TEXT UNIQUE, icon TEXT, description TEXT, status site_status NOT NULL DEFAULT 'draft', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ );
CREATE TABLE public.creations ( id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE, name TEXT NOT NULL, content JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ );
CREATE TABLE public.campaigns ( id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), creation_id UUID NOT NULL REFERENCES public.creations(id) ON DELETE CASCADE, site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE, name TEXT NOT NULL, slug TEXT NOT NULL, status campaign_status NOT NULL DEFAULT 'draft', affiliate_url TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ, UNIQUE(site_id, slug) );
CREATE TABLE public.visitor_logs ( id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), session_id UUID NOT NULL UNIQUE, user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, fingerprint TEXT, ip_address INET, geo_data JSONB, user_agent TEXT, utm_params JSONB, referrer TEXT, landing_page TEXT, browser_context JSONB, is_bot BOOLEAN DEFAULT false, is_known_abuser BOOLEAN DEFAULT false, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW() );
CREATE TABLE public.audit_logs ( id BIGSERIAL PRIMARY KEY, actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, action TEXT NOT NULL, target_entity_id UUID, target_entity_type TEXT, metadata JSONB, ip_address INET, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW() );
CREATE TABLE public.system_errors ( id BIGSERIAL PRIMARY KEY, source TEXT NOT NULL, error_message TEXT NOT NULL, stack_trace TEXT, metadata JSONB, status TEXT NOT NULL DEFAULT 'new', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW() );
CREATE TABLE public.customers ( id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE, stripe_customer_id TEXT UNIQUE );
CREATE TABLE public.products ( id TEXT PRIMARY KEY, active BOOLEAN, name TEXT, description TEXT, image TEXT, metadata JSONB );
CREATE TABLE public.prices ( id TEXT PRIMARY KEY, product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE, active BOOLEAN, description TEXT, unit_amount BIGINT, currency TEXT, type subscription_price_type, interval subscription_interval, interval_count INTEGER, trial_period_days INTEGER, metadata JSONB );
CREATE TABLE public.subscriptions ( id TEXT PRIMARY KEY, user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, status subscription_status, metadata JSONB, price_id TEXT REFERENCES public.prices(id) ON DELETE SET NULL, quantity INTEGER, cancel_at_period_end BOOLEAN, created TIMESTAMPTZ NOT NULL DEFAULT NOW(), current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(), current_period_end TIMESTAMPTZ NOT NULL DEFAULT NOW(), ended_at TIMESTAMPTZ, cancel_at TIMESTAMPTZ, canceled_at TIMESTAMPTZ, trial_start TIMESTAMPTZ, trial_end TIMESTAMPTZ );
CREATE TABLE public.invitations ( id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE, invited_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, invitee_email TEXT NOT NULL, role workspace_role NOT NULL, status TEXT NOT NULL DEFAULT 'pending', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ, UNIQUE(workspace_id, invitee_email) );

-- --- PASO 4: TRIGGERS Y FUNCIONES ---
CREATE OR REPLACE FUNCTION public.handle_new_user_setup() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ DECLARE new_workspace_id UUID; BEGIN INSERT INTO public.profiles (id, email, full_name, avatar_url) VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url'); INSERT INTO public.workspaces (name, owner_id) VALUES ( COALESCE(new.raw_user_meta_data->>'full_name', new.email) || '''s Workspace', new.id ) RETURNING id INTO new_workspace_id; INSERT INTO public.workspace_members (workspace_id, user_id, role) VALUES (new_workspace_id, new.id, 'owner'); RETURN new; END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_setup();

-- --- PASO 5: POLÍTICAS DE SEGURIDAD (RLS) ---
-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Recrear las políticas. Ahora es seguro hacerlo.
CREATE POLICY "Users can view all profiles." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage their own profile." ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Members can view workspaces they belong to." ON public.workspaces FOR SELECT USING (EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = id AND user_id = auth.uid()));
CREATE POLICY "Owners and admins can manage their workspaces." ON public.workspaces FOR ALL USING (EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = id AND user_id = auth.uid() AND (role = 'owner' OR role = 'admin')));
CREATE POLICY "Members can view other members of their workspaces." ON public.workspace_members FOR SELECT USING (EXISTS (SELECT 1 FROM public.workspace_members m WHERE m.workspace_id = workspace_members.workspace_id AND m.user_id = auth.uid()));
CREATE POLICY "Owners and admins can manage members." ON public.workspace_members FOR ALL USING (EXISTS (SELECT 1 FROM public.workspace_members m WHERE m.workspace_id = workspace_members.workspace_id AND m.user_id = auth.uid() AND (role = 'owner' OR role = 'admin')));
CREATE POLICY "Members can manage invitations for their workspaces." ON public.invitations FOR ALL USING (EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = invitations.workspace_id AND user_id = auth.uid()));
CREATE POLICY "Workspace members can manage their sites." ON public.sites FOR ALL USING (EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = sites.workspace_id AND user_id = auth.uid()));
CREATE POLICY "Workspace members can manage their creations." ON public.creations FOR ALL USING (EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = creations.workspace_id AND user_id = auth.uid()));
CREATE POLICY "Workspace members can manage their campaigns." ON public.campaigns FOR ALL USING (EXISTS (SELECT 1 FROM public.sites s JOIN public.workspace_members m ON s.workspace_id = m.workspace_id WHERE s.id = campaigns.site_id AND m.user_id = auth.uid()));
CREATE POLICY "Allow anonymous inserts." ON public.visitor_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Deny all reads on visitor logs." ON public.visitor_logs FOR SELECT USING (false);
CREATE POLICY "Users can manage their own subscriptions and customer data." ON public.subscriptions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own customer data." ON public.customers FOR ALL USING (auth.uid() = id);
CREATE POLICY "Allow all users to read product and price information." ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow all users to read price information." ON public.prices FOR SELECT USING (true);
CREATE POLICY "Allow all access to admins" ON public.audit_logs FOR ALL USING ( (SELECT app_role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'developer') );
CREATE POLICY "Allow all access to admins" ON public.system_errors FOR ALL USING ( (SELECT app_role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'developer') );

COMMIT;