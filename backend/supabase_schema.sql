-- ==============================================================================
-- studentBazaar (CodeShelf) — Supabase PostgreSQL Schema (Phase 5)
-- Run this script in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create the Public Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'buyer',
    university TEXT NOT NULL,
    degree TEXT NOT NULL,
    semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 8),
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    wallet_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (wallet_balance >= 0),
    escrow_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (escrow_balance >= 0),
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profile policies and column grants are applied after the signup trigger.

-- 5. Trigger Function to automatically synchronize auth.users with public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    role,
    university,
    degree,
    semester,
    avatar_url
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

-- Trigger firing on every user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexing for fast role and university queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_degree_semester ON public.profiles(degree, semester);

-- Keep profile access private; only non-sensitive seller fields are public.
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public can view seller profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;

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
ON public.profiles FOR SELECT
TO anon
USING (role IN ('seller', 'admin'));

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Authenticated users can view seller profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (role = 'seller');

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
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


-- ==============================================================================
-- Phase 6: Seller Applications Table & RLS Policies
-- ==============================================================================

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.seller_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    github_url TEXT NOT NULL,
    portfolio_url TEXT,
    id_card_url TEXT NOT NULL,
    specializations TEXT[] NOT NULL DEFAULT '{}',
    bio TEXT,
    status application_status NOT NULL DEFAULT 'pending',
    admin_feedback TEXT,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.seller_applications ENABLE ROW LEVEL SECURITY;

-- Buyers can view their own applications
CREATE POLICY "Users can view their own seller application"
ON public.seller_applications FOR SELECT
USING (auth.uid() = user_id);

-- Buyers can submit a seller application
CREATE POLICY "Users can insert their own seller application"
ON public.seller_applications FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view and update all seller applications
CREATE POLICY "Admins can view and moderate all seller applications"
ON public.seller_applications FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

CREATE INDEX IF NOT EXISTS idx_seller_apps_user ON public.seller_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_seller_apps_status ON public.seller_applications(status);

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


-- ==============================================================================
-- Phase 7: Projects & Project Files Tables & RLS Policies
-- ==============================================================================

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'archived');
    CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    detailed_description TEXT NOT NULL,
    category TEXT NOT NULL,
    degree TEXT NOT NULL,
    semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 8),
    subject TEXT NOT NULL,
    technologies TEXT[] NOT NULL DEFAULT '{}',
    difficulty difficulty_level NOT NULL DEFAULT 'intermediate',
    price_pkr NUMERIC(10, 2) NOT NULL CHECK (price_pkr >= 500),
    screenshots TEXT[] NOT NULL DEFAULT '{}',
    demo_video_url TEXT,
    features_list TEXT[] NOT NULL DEFAULT '{}',
    system_prerequisites TEXT[] NOT NULL DEFAULT '{}',
    installation_guide TEXT NOT NULL,
    package_includes JSONB NOT NULL DEFAULT '[]'::jsonb,
    has_documentation BOOLEAN NOT NULL DEFAULT true,
    has_diagrams BOOLEAN NOT NULL DEFAULT true,
    total_sales_count INTEGER NOT NULL DEFAULT 0,
    average_rating NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
    ratings_count INTEGER NOT NULL DEFAULT 0,
    status project_status NOT NULL DEFAULT 'pending',
    moderation_feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.project_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID UNIQUE NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    archive_storage_key TEXT NOT NULL,
    archive_file_name TEXT NOT NULL,
    archive_size_bytes BIGINT NOT NULL,
    archive_checksum_sha256 TEXT,
    srs_document_key TEXT,
    readme_key TEXT,
    included_database_dump BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

-- Public can view approved projects
CREATE POLICY "Public can view approved projects"
ON public.projects FOR SELECT
USING (status = 'approved');

-- Sellers can view all their own projects regardless of status
CREATE POLICY "Sellers can view own projects"
ON public.projects FOR SELECT
USING (auth.uid() = seller_id);

-- Approved sellers can create project listings
CREATE POLICY "Approved sellers can create projects"
ON public.projects FOR INSERT
WITH CHECK (
    auth.uid() = seller_id AND
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND (profiles.role = 'seller' OR profiles.role = 'admin')
    )
);

-- Sellers can update their own projects
CREATE POLICY "Sellers can update own projects"
ON public.projects FOR UPDATE
USING (auth.uid() = seller_id);

-- Admins can view and moderate all projects
CREATE POLICY "Admins can view and moderate all projects"
ON public.projects FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Project files can only be accessed by seller or admin (or buyers with paid orders via secure RPC/backend)
CREATE POLICY "Seller and Admin can access project files"
ON public.project_files FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE projects.id = project_files.project_id AND (projects.seller_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        ))
    )
);

-- Indexes for high performance academic curriculum queries
CREATE INDEX IF NOT EXISTS idx_projects_curriculum ON public.projects(degree, semester, subject, status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_price ON public.projects(price_pkr);
CREATE INDEX IF NOT EXISTS idx_projects_rating ON public.projects(average_rating DESC);

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


-- ==============================================================================
-- Phase 8: Orders, Payments & Secure Download Vault Tables & RLS Policies
-- ==============================================================================

DO $$ BEGIN
    CREATE TYPE order_type_enum AS ENUM ('ready_made', 'custom_request');
    CREATE TYPE payment_status_enum AS ENUM ('unpaid', 'paid', 'refunded');
    CREATE TYPE fulfillment_status_enum AS ENUM ('completed', 'in_progress', 'delivered', 'revision_requested', 'disputed', 'cancelled');
    CREATE TYPE payment_method_enum AS ENUM ('easypaisa_simulated', 'jazzcash_simulated', 'sandbox_card', 'bank_transfer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    order_type order_type_enum NOT NULL DEFAULT 'ready_made',
    project_id UUID REFERENCES public.projects(id),
    total_amount_pkr NUMERIC(10, 2) NOT NULL,
    platform_commission_pkr NUMERIC(10, 2) NOT NULL,
    seller_net_earnings_pkr NUMERIC(10, 2) NOT NULL,
    payment_status payment_status_enum NOT NULL DEFAULT 'unpaid',
    fulfillment_status fulfillment_status_enum NOT NULL DEFAULT 'completed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    payer_id UUID NOT NULL REFERENCES public.profiles(id),
    amount_pkr NUMERIC(10, 2) NOT NULL,
    payment_method payment_method_enum NOT NULL,
    transaction_reference TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'successful',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.download_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    project_id UUID NOT NULL REFERENCES public.projects(id),
    ip_address TEXT,
    downloaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;

-- Buyers can view their own orders
CREATE POLICY "Buyers can view own orders"
ON public.orders FOR SELECT
USING (auth.uid() = buyer_id);

-- Sellers can view orders placed for their projects
CREATE POLICY "Sellers can view own project orders"
ON public.orders FOR SELECT
USING (auth.uid() = seller_id);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
ON public.orders FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Payments RLS
CREATE POLICY "Users can view own payments"
ON public.payments FOR SELECT
USING (auth.uid() = payer_id);

CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON public.orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_project ON public.orders(project_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);


-- ==============================================================================
-- Phase 9: Custom Project Requests Table & RLS Policies
-- ==============================================================================

DO $$ BEGIN
    CREATE TYPE custom_request_status_enum AS ENUM ('pending_review', 'open_for_bidding', 'awarded', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.custom_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    university TEXT NOT NULL DEFAULT 'Not specified',
    degree TEXT NOT NULL,
    semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 8),
    subject TEXT NOT NULL,
    project_level TEXT NOT NULL DEFAULT 'simple',
    deliverable_bundle TEXT NOT NULL DEFAULT 'project_only',
    detailed_scope TEXT NOT NULL,
    budget_pkr NUMERIC(10, 2) NOT NULL CHECK (budget_pkr >= 1000),
    deadline DATE NOT NULL,
    attachment_urls TEXT[] NOT NULL DEFAULT '{}',
    technologies_needed TEXT[] NOT NULL DEFAULT '{}',
    proposals_count INTEGER NOT NULL DEFAULT 0,
    status custom_request_status_enum NOT NULL DEFAULT 'pending_review',
    awarded_proposal_id UUID,
    admin_feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.custom_requests
    ADD COLUMN IF NOT EXISTS university TEXT NOT NULL DEFAULT 'Not specified',
    ADD COLUMN IF NOT EXISTS project_level TEXT NOT NULL DEFAULT 'simple',
    ADD COLUMN IF NOT EXISTS deliverable_bundle TEXT NOT NULL DEFAULT 'project_only';

ALTER TABLE public.custom_requests ENABLE ROW LEVEL SECURITY;

-- Buyers can create and view their own requests; only admins may moderate them.
DROP POLICY IF EXISTS "Buyers can manage own custom requests" ON public.custom_requests;
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

-- Sellers can view requests that are open for bidding
CREATE POLICY "Sellers can view open requests"
ON public.custom_requests FOR SELECT
USING (
    status = 'open_for_bidding' OR status = 'awarded' OR
    auth.uid() = buyer_id OR
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Admins can view and moderate all custom requests
CREATE POLICY "Admins can moderate all custom requests"
ON public.custom_requests FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

CREATE INDEX IF NOT EXISTS idx_custom_req_buyer ON public.custom_requests(buyer_id);
CREATE INDEX IF NOT EXISTS idx_custom_req_status ON public.custom_requests(status);
CREATE INDEX IF NOT EXISTS idx_custom_req_curriculum ON public.custom_requests(degree, semester, subject);

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

-- Table privileges are required in addition to RLS policies. RLS continues
-- to limit each authenticated user to rows permitted by the policies above.
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_files TO authenticated;
GRANT SELECT ON public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.custom_requests TO authenticated;
GRANT SELECT ON public.custom_requests TO anon;
GRANT SELECT, INSERT, UPDATE ON public.seller_applications TO authenticated;
