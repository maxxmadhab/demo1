-- ============================================================
-- Budhram — Create a dedicated ADMIN account directly in Supabase
-- ============================================================
-- TWO ways to do this. Pick ONE.

-- ============================================================
-- OPTION A (RECOMMENDED — simplest & most reliable)
-- ============================================================
-- 1) Supabase Dashboard -> Authentication -> Users -> "Add user"
--    - Email: admin@budhram.com
--    - Password: your strong password
--    - "Auto Confirm user" = ON
--    - Click "Create user". (This fires the handle_new_user() trigger
--      which creates a profiles row with role='user'.)
-- 2) Then run ONLY this UPDATE in SQL Editor to promote to admin:
--
--    UPDATE public.profiles
--    SET role = 'admin'
--    WHERE email = 'admin@budhram.com';
--
-- 3) Sign in at your-site/admin/login with that email/password.

-- ============================================================
-- OPTION B (Create everything via SQL in one step)
-- ============================================================
-- Set the two values at the top, then run the whole block.

-- >>> SET THESE TWO VALUES <<<
DO $$
DECLARE
  v_email    TEXT := 'admin@budhram.com';              -- <- your admin email
  v_password TEXT := 'ChangeMe_StrongPassword_123!';   -- <- your admin password
  v_fullname TEXT := 'Budhram Admin';
  v_id       UUID;
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = lower(v_email)) THEN
    RAISE EXCEPTION 'User % already exists. Use OPTION A step 2 (the UPDATE) instead.', v_email;
  END IF;

  -- 1) Create the auth user (fires handle_new_user() -> profiles row, role='user')
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated', 'authenticated',
    lower(v_email),
    crypt(v_password, gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
    jsonb_build_object('full_name', v_fullname),
    now(), now(), '', '', '', ''
  )
  RETURNING id INTO v_id;

  -- 2) Ensure profile exists, then promote to admin
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (v_id, lower(v_email), v_fullname, 'user')
  ON CONFLICT (id) DO NOTHING;

  UPDATE public.profiles
  SET role = 'admin', email = lower(v_email), full_name = v_fullname
  WHERE id = v_id;

  RAISE NOTICE 'Admin created: % (id=%)', lower(v_email), v_id;
END $$;

-- AFTER creating: sign in at your-site/admin/login with the admin credentials.
