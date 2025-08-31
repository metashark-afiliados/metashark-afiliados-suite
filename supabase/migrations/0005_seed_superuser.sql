// supabase/migrations/0005_seed_superuser_v1.1.sql
/**
 * @file 0005_seed_superuser_v1.1.sql
 * @description Script de seeding idempotente. Corregido para omitir la columna
 *              generada `confirmed_at` en la inserción de `auth.users`.
 * @version 1.1.0
 * @author L.I.A. Legacy & Raz Podestá
 */

DO $$
DECLARE
    super_user_email TEXT := 'dev@convertikit.com';
    super_user_password TEXT := 'password123';
    super_user_id UUID;
    super_workspace_id UUID;
    workspace_record RECORD;
BEGIN
    -- 1. Crear el usuario en auth.users si no existe (SIN confirmed_at)
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_token, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, email_change, email_change_sent_at)
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        uuid_generate_v4(),
        'authenticated',
        'authenticated',
        super_user_email,
        crypt(super_user_password, gen_salt('bf')),
        NOW(), NULL, NULL, NULL,
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Super Admin"}',
        false, NOW(), NOW(), NULL, NULL, '', NULL
    )
    ON CONFLICT (email) DO NOTHING
    RETURNING id INTO super_user_id;

    -- Si el usuario ya existía, obtenemos su ID
    IF super_user_id IS NULL THEN
        SELECT id INTO super_user_id FROM auth.users WHERE email = super_user_email;
    END IF;
    RAISE NOTICE 'Super usuario ID: %', super_user_id;

    -- 2. Crear el perfil en public.profiles si no existe
    INSERT INTO public.profiles (id, email, full_name, app_role, has_completed_onboarding)
    VALUES (super_user_id, super_user_email, 'Super Admin', 'developer', true)
    ON CONFLICT (id) DO UPDATE SET
        full_name = 'Super Admin',
        app_role = 'developer',
        has_completed_onboarding = true;
    RAISE NOTICE 'Perfil del super usuario creado/actualizado.';

    -- 3. Crear un workspace para el super usuario si no tiene uno
    SELECT id INTO super_workspace_id FROM public.workspaces WHERE owner_id = super_user_id LIMIT 1;
    IF super_workspace_id IS NULL THEN
        INSERT INTO public.workspaces (name, owner_id)
        VALUES ('Super Admin''s Workspace', super_user_id)
        RETURNING id INTO super_workspace_id;

        INSERT INTO public.workspace_members (workspace_id, user_id, role_id)
        VALUES (super_workspace_id, super_user_id, (SELECT id FROM public.workspace_roles WHERE name = 'owner'));
        RAISE NOTICE 'Workspace principal del super usuario creado.';
    ELSE
        RAISE NOTICE 'El super usuario ya tiene un workspace principal.';
    END IF;

    -- 4. Asegurar que el super usuario es owner en TODOS los workspaces
    FOR workspace_record IN SELECT id FROM public.workspaces
    LOOP
        INSERT INTO public.workspace_members (workspace_id, user_id, role_id)
        VALUES (workspace_record.id, super_user_id, (SELECT id FROM public.workspace_roles WHERE name = 'owner'))
        ON CONFLICT (workspace_id, user_id) DO UPDATE SET role_id = (SELECT id FROM public.workspace_roles WHERE name = 'owner');
    END LOOP;
    RAISE NOTICE 'Privilegios de owner garantizados en todos los workspaces.';

END $$;
// supabase/migrations/0005_seed_superuser_v1.1.sql