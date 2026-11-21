# student-bazaar
Student Bazaar is a university-focused digital marketplace where students can discover and purchase ready-made programming projects or request custom software projects based on their academic requirements. Built with the MERN stack for students in Pakistan.

## Supabase authentication setup

1. Copy `backend/.env.example` to `backend/.env` and set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `CLIENT_URL`, and `PORT`.
2. Copy `frontend/.env.example` to `frontend/.env` and set the same Supabase project URL and **anon/public** key, plus `VITE_API_URL`.
3. Run `backend/supabase_schema.sql` in the Supabase SQL editor for a new project. For a database that already has the earlier schema, run `backend/supabase_auth_hardening.sql` instead.
4. Configure the Supabase Auth email-confirmation and password policies in the Supabase dashboard.

Supabase Auth handles password hashing and session refresh. Do not store passwords in application tables or expose a service-role key to the frontend. There are no built-in demo accounts; protected API routes require a valid Supabase access token and profile. The existing-database hardening migration resets elevated profiles to buyer to invalidate any roles previously supplied through signup metadata. Assign the initial administrator role only from the trusted Supabase SQL editor (replace the example email):

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

Seller profiles can be restored by reviewing their applications.
