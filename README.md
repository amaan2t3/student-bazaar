# student-bazaar
Student Bazaar is a university-focused digital marketplace where students can discover and purchase ready-made programming projects or request custom software projects based on their academic requirements. Built with the MERN stack for students in Pakistan.

## Supabase authentication setup

1. Copy `backend/.env.example` to `backend/.env` and set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `CLIENT_URL`, and `PORT`.
2. Copy `frontend/.env.example` to `frontend/.env` and set the same Supabase project URL and **anon/public** key, plus `VITE_API_URL`.
3. Run `backend/supabase_schema.sql` in the Supabase SQL editor for a new project. For a database that already has the earlier schema, run `backend/supabase_auth_hardening.sql` instead. Run `backend/supabase_contact_team_schema.sql` to create the contact-message and team-member tables, policies, and required table privileges. If the admin dashboard or moderation queues report `permission denied for table orders`, `custom_requests`, or `seller_applications`, run `backend/supabase_table_permissions_fix.sql` in the SQL editor; it grants the needed authenticated table privileges while the existing row-level security policies continue to control row access.
4. Configure the Supabase Auth email-confirmation and password policies in the Supabase dashboard.
5. To deliver admin decision emails, set `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, and `EMAIL_FROM` in `backend/.env`. Without SMTP settings, moderation still saves the decision and the admin UI reports that the email was not sent.

Supabase Auth handles password hashing and session refresh. Do not store passwords in application tables or expose a service-role key to the frontend. There are no built-in demo accounts; protected API routes require a valid Supabase access token and profile. The existing-database hardening migration resets elevated profiles to buyer to invalidate any roles previously supplied through signup metadata. Assign the initial administrator role only from the trusted Supabase SQL editor (replace the example email):

```sql
UPDATE public.profiles AS p
SET role = 'admin'
FROM auth.users AS u
WHERE p.id = u.id
  AND lower(u.email) = lower('admin@example.com');
```

Seller profiles can be restored by reviewing their applications.
