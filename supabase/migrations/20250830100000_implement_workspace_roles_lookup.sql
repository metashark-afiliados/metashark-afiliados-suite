// supabase/migrations/20250830100000_implement_workspace_roles_lookup.sql
/**
 * @file 20250830100000_implement_workspace_roles_lookup.sql
 * @description Migración de Base de Datos v13.0 - Fase 1.
 *              Implementa la tabla de conversión `workspace_roles` y migra la
 *              tabla `workspace_members` para utilizarla, reemplazando el tipo ENUM.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 13.0.0
 */

BEGIN;

-- PASO 1: Crear la nueva tabla de lookup para los roles.
CREATE TABLE IF NOT EXISTS public.workspace_roles (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);
ALTER TABLE public.workspace_roles ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.workspace_roles IS 'Lookup table for workspace member roles.';

-- PASO 2: Poblar la tabla de lookup con los roles definidos.
-- Usamos ON CONFLICT DO NOTHING para asegurar que la operación sea idempotente.
INSERT INTO public.workspace_roles (name)
VALUES ('owner'), ('admin'), ('member'), ('viewer'), ('billing')
ON CONFLICT (name) DO NOTHING;

-- PASO 3: Añadir la nueva columna de clave foránea a `workspace_members`.
-- Se permite que sea NULL temporalmente para la migración de datos.
ALTER TABLE public.workspace_members ADD COLUMN IF NOT EXISTS role_id INTEGER REFERENCES public.workspace_roles(id);

-- PASO 4: Migrar los datos existentes de la columna ENUM a la nueva columna de ID.
UPDATE public.workspace_members wm
SET role_id = wr.id
FROM public.workspace_roles wr
WHERE wm.role::text = wr.name AND wm.role_id IS NULL;

-- PASO 5: Eliminar la columna ENUM obsoleta.
-- Se comprueba su existencia para evitar errores en ejecuciones repetidas.
DO $$
BEGIN
   IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='workspace_members' AND column_name='role') THEN
      ALTER TABLE public.workspace_members DROP COLUMN "role";
   END IF;
END $$;

-- PASO 6: Aplicar el constraint NOT NULL a la nueva columna ahora que está poblada.
ALTER TABLE public.workspace_members ALTER COLUMN role_id SET NOT NULL;

-- PASO 7: Eliminar el tipo ENUM obsoleto del sistema.
DROP TYPE IF EXISTS public.workspace_role;

-- PASO 8: Actualizar la función de setup de nuevo usuario para que use los nuevos IDs.
CREATE OR REPLACE FUNCTION public.handle_new_user_setup()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    new_workspace_id UUID;
    owner_role_id INT;
BEGIN
    -- Obtener el ID del rol 'owner' desde la nueva tabla de lookup
    SELECT id INTO owner_role_id FROM public.workspace_roles WHERE name = 'owner';

    -- 1. Insertar perfil
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');

    -- 2. Crear workspace personal
    INSERT INTO public.workspaces (name, owner_id)
    VALUES (
        COALESCE(new.raw_user_meta_data->>'full_name', new.email) || '''s Workspace',
        new.id
    ) RETURNING id INTO new_workspace_id;

    -- 3. Añadir usuario como 'owner' usando el role_id
    INSERT INTO public.workspace_members (workspace_id, user_id, role_id)
    VALUES (new_workspace_id, new.id, owner_role_id);

    RETURN NEW;
END;
$$;


COMMIT;

// supabase/migrations/20250830100000_implement_workspace_roles_lookup.sql