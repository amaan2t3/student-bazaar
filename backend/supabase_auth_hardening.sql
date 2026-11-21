-- Apply to an existing database without rerunning the full schema.
BEGIN;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, full_name, email, role, university, degree, semester, avatar_url
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Student User'),
    new.email,
    'buyer',
    COALESCE(new.raw_user_meta_data->>'university', 'Pakistani University'),
    COALESCE(new.raw_user_meta_data->>'degree', 'BSCS'),
    COALESCE((new.raw_user_meta_data->>'semester')::integer, 1),
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update only their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public can view seller profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view seller profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_current_user_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated;

UPDATE public.profiles
SET role = 'buyer', is_verified = false
WHERE role <> 'buyer';

CREATE POLICY "Public can view seller profiles"
ON public.profiles FOR SELECT TO anon
USING (role IN ('seller', 'admin'));

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Authenticated users can view seller profiles"
ON public.profiles FOR SELECT TO authenticated
USING (role = 'seller');

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.is_current_user_admin());

REVOKE ALL ON public.profiles FROM anon, authenticated;
REVOKE ALL ON public.profiles FROM PUBLIC;
REVOKE SELECT (email, wallet_balance, escrow_balance, is_verified, created_at, updated_at)
ON public.profiles FROM anon, authenticated, PUBLIC;
REVOKE INSERT (id, full_name, email, role, university, degree, semester, avatar_url,
               wallet_balance, escrow_balance, is_verified, created_at, updated_at)
ON public.profiles FROM anon, authenticated, PUBLIC;
REVOKE UPDATE (id, email, role, wallet_balance, escrow_balance, is_verified, created_at)
ON public.profiles FROM anon, authenticated, PUBLIC;
GRANT SELECT (id, full_name, role, university, degree, semester, avatar_url)
ON public.profiles TO anon, authenticated;
GRANT UPDATE (full_name, university, degree, semester, avatar_url, updated_at)
ON public.profiles TO authenticated;

CREATE OR REPLACE FUNCTION public.prevent_seller_application_review_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.is_current_user_admin() THEN
    IF TG_OP = 'INSERT' THEN
      IF NEW.status <> 'pending' OR NEW.admin_feedback IS NOT NULL OR
         NEW.reviewed_by IS NOT NULL OR NEW.reviewed_at IS NOT NULL THEN
        RAISE EXCEPTION 'Seller applications must be submitted as pending.'
          USING ERRCODE = '42501';
      END IF;
    ELSIF NEW.status IS DISTINCT FROM OLD.status OR
          NEW.admin_feedback IS DISTINCT FROM OLD.admin_feedback OR
          NEW.reviewed_by IS DISTINCT FROM OLD.reviewed_by OR
          NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at THEN
      RAISE EXCEPTION 'Only administrators may review seller applications.'
        USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_seller_application_review_changes ON public.seller_applications;
CREATE TRIGGER prevent_seller_application_review_changes
  BEFORE INSERT OR UPDATE ON public.seller_applications
  FOR EACH ROW EXECUTE FUNCTION public.prevent_seller_application_review_changes();

CREATE OR REPLACE FUNCTION public.review_seller_application(
  application_id_param UUID,
  status_param TEXT,
  feedback_param TEXT
)
RETURNS public.seller_applications
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  reviewed_application public.seller_applications%ROWTYPE;
BEGIN
  IF NOT public.is_current_user_admin() THEN
    RAISE EXCEPTION 'Only administrators may review seller applications.'
      USING ERRCODE = '42501';
  END IF;

  IF status_param NOT IN ('approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid seller application status.'
      USING ERRCODE = '22023';
  END IF;

  UPDATE public.seller_applications
  SET status = status_param::application_status,
      admin_feedback = feedback_param,
      reviewed_by = auth.uid(),
      reviewed_at = now(),
      updated_at = now()
  WHERE id = application_id_param
  RETURNING * INTO reviewed_application;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Seller application not found.'
      USING ERRCODE = 'P0002';
  END IF;

  IF status_param = 'approved' THEN
    UPDATE public.profiles
    SET role = 'seller', is_verified = true
    WHERE id = reviewed_application.user_id;
  END IF;

  RETURN reviewed_application;
END;
$$;

REVOKE ALL ON FUNCTION public.review_seller_application(UUID, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.review_seller_application(UUID, TEXT, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.prevent_seller_project_moderation_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.is_current_user_admin() THEN
    IF TG_OP = 'INSERT' THEN
      IF NEW.status <> 'pending' OR NEW.moderation_feedback IS NOT NULL THEN
        RAISE EXCEPTION 'New projects must be submitted for administrator review.'
          USING ERRCODE = '42501';
      END IF;
    ELSIF NEW.status IS DISTINCT FROM OLD.status OR
          NEW.moderation_feedback IS DISTINCT FROM OLD.moderation_feedback THEN
      RAISE EXCEPTION 'Only administrators may change project moderation fields.'
        USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_seller_project_moderation_changes ON public.projects;
CREATE TRIGGER prevent_seller_project_moderation_changes
  BEFORE INSERT OR UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.prevent_seller_project_moderation_changes();

DROP POLICY IF EXISTS "Buyers can manage own custom requests" ON public.custom_requests;
DROP POLICY IF EXISTS "Buyers can view own custom requests" ON public.custom_requests;
DROP POLICY IF EXISTS "Buyers can create own custom requests" ON public.custom_requests;

CREATE POLICY "Buyers can view own custom requests"
ON public.custom_requests FOR SELECT
USING (auth.uid() = buyer_id);

CREATE POLICY "Buyers can create own custom requests"
ON public.custom_requests FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

CREATE OR REPLACE FUNCTION public.prevent_custom_request_moderation_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.is_current_user_admin() THEN
    IF TG_OP = 'INSERT' THEN
      IF NEW.status <> 'pending_review' OR NEW.admin_feedback IS NOT NULL THEN
        RAISE EXCEPTION 'New custom requests must be submitted for administrator review.'
          USING ERRCODE = '42501';
      END IF;
    ELSIF NEW.status IS DISTINCT FROM OLD.status OR
          NEW.admin_feedback IS DISTINCT FROM OLD.admin_feedback THEN
      RAISE EXCEPTION 'Only administrators may moderate custom requests.'
        USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_custom_request_moderation_changes ON public.custom_requests;
CREATE TRIGGER prevent_custom_request_moderation_changes
  BEFORE INSERT OR UPDATE ON public.custom_requests
  FOR EACH ROW EXECUTE FUNCTION public.prevent_custom_request_moderation_changes();

CREATE OR REPLACE FUNCTION public.admin_notification_recipient(user_id_param UUID)
RETURNS TABLE(email TEXT, full_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.is_current_user_admin() THEN
    RAISE EXCEPTION 'Only administrators may retrieve notification recipients.'
      USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT p.email, p.full_name
  FROM public.profiles AS p
  WHERE p.id = user_id_param;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_notification_recipient(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_notification_recipient(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_dashboard_totals()
RETURNS TABLE(total_paid_revenue NUMERIC, total_request_budget NUMERIC)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.is_current_user_admin() THEN
    RAISE EXCEPTION 'Only administrators may retrieve dashboard totals.'
      USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT
    COALESCE((SELECT SUM(o.total_amount_pkr) FROM public.orders AS o WHERE o.payment_status = 'paid'), 0)::NUMERIC,
    COALESCE((SELECT SUM(r.budget_pkr) FROM public.custom_requests AS r), 0)::NUMERIC;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_dashboard_totals() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_dashboard_totals() TO authenticated;

-- REST table privileges are separate from row-level security policies.
GRANT SELECT ON public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.custom_requests TO authenticated;
GRANT SELECT, INSERT ON public.seller_applications TO authenticated;

COMMIT;

-- This promotes the initial admin account after the elevated-role reset above.
UPDATE public.profiles AS p
SET role = 'admin'
FROM auth.users AS u
WHERE p.id = u.id
  AND lower(u.email) = lower('admin@studentbazaar.com');
