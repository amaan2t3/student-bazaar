# Graph Report - student-bazaar  (2026-11-28)

## Corpus Check
- 81 files · ~46,466 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 2, (none) 1, .css 1)

## Summary
- 326 nodes · 770 edges · 12 communities (9 shown, 3 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 50 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e7051f87`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- frontend/package.json
- Button
- api.js
- backend/package.json
- projectController.js
- AuthContext.jsx
- config/supabase.js
- teamController.js
- roles.js
- Student Bazaar

## God Nodes (most connected - your core abstractions)
1. `react` - 39 edges
2. `Button()` - 30 edges
3. `AppRoutes()` - 29 edges
4. `react-router-dom` - 25 edges
5. `useAuth()` - 22 edges
6. `lucide-react` - 21 edges
7. `Student Bazaar` - 17 edges
8. `protect()` - 11 edges
9. `express` - 11 edges
10. `isSupabaseConfigured` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Roles and Permissions` --references--> `protect()`  [INFERRED]
  README.md → backend/src/middleware/authMiddleware.js
- `Roles and Permissions` --references--> `restrictTo()`  [INFERRED]
  README.md → backend/src/middleware/authMiddleware.js
- `BrowseProjects()` --calls--> `AcademicFilterBar()`  [EXTRACTED]
  frontend/src/pages/public/BrowseProjects.jsx → frontend/src/components/filters/AcademicFilterBar.jsx
- `Register()` --calls--> `Button()`  [EXTRACTED]
  frontend/src/pages/auth/Register.jsx → frontend/src/components/common/Button.jsx
- `Register()` --calls--> `useAuth()`  [EXTRACTED]
  frontend/src/pages/auth/Register.jsx → frontend/src/context/AuthContext.jsx

## Import Cycles
- None detected.

## Communities (12 total, 3 thin omitted)

### Community 0 - "frontend/package.json"
Cohesion: 0.07
Nodes (33): dependencies, axios@^1.6.8, lucide-react@^0.359.0, react@^18.2.0, react-dom@^18.2.0, react-router-dom@^6.22.3, @supabase/supabase-js@^2.119.2, devDependencies (+25 more)

### Community 1 - "Button"
Cohesion: 0.11
Nodes (38): ProjectCard(), Badge(), Button(), Footer(), Navbar(), PublicLayout(), CheckoutModal(), useAuth() (+30 more)

### Community 2 - "api.js"
Cohesion: 0.13
Nodes (11): AdminDashboard(), adminSections, formatPKR(), CustomRequestModeration(), statusLabels, adminService, api, customRequestService (+3 more)

### Community 3 - "backend/package.json"
Cohesion: 0.12
Nodes (20): dependencies, cors@^2.8.5, dotenv@^16.4.5, morgan@^1.10.0, nodemailer@^10.6.1, @supabase/supabase-js@^2.39.8, ws@^8.23.0, @supabase/supabase-js (+12 more)

### Community 4 - "projectController.js"
Cohesion: 0.14
Nodes (19): createCustomRequest(), DELIVERABLE_EXTRA_PRICES, getAdminCustomRequestsQueue(), getMyCustomRequests(), getOpenRequestsFeed(), getSingleCustomRequest(), getUniversityPriceIncrease(), HIGH_TIER_UNIVERSITY_KEYWORDS (+11 more)

### Community 5 - "AuthContext.jsx"
Cohesion: 0.09
Nodes (23): App(), UniversitySelect(), AcademicFilterBar(), AuthContext, AuthProvider(), CartContext, CartProvider(), CATEGORIES (+15 more)

### Community 6 - "config/supabase.js"
Cohesion: 0.08
Nodes (43): express@^4.19.2, createSupabaseAuthClient(), createSupabaseUserClient(), isSupabaseConfigured, supabase, getDashboardStats(), getMe(), getProfileForSession() (+35 more)

### Community 7 - "teamController.js"
Cohesion: 0.21
Nodes (12): supabaseAdmin, createTeamMember(), DATA_FILE, deleteTeamMember(), __dirname, __filename, getAdminTeamMembers(), getTeamMembers() (+4 more)

### Community 13 - "Student Bazaar"
Cohesion: 0.06
Nodes (35): Administrator accounts, API Overview, Architecture, Backend, Backend: `backend/.env`, Backend returns `503 Supabase Auth is not configured`, Buyer accounts, CORS request blocked (+27 more)

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Student Bazaar` connect `Student Bazaar` to `config/supabase.js`?**
  _High betweenness centrality (0.199) - this node is a cross-community bridge._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07057057057057058 - nodes in this community are weakly interconnected._
- **Why does `Roles and Permissions` connect `config/supabase.js` to `Student Bazaar`?**
  _High betweenness centrality (0.194) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.10667251975417033 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Button` to `frontend/package.json`, `api.js`, `AuthContext.jsx`?**
  _High betweenness centrality (0.170) - this node is a cross-community bridge._
- **Should `api.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13157894736842105 - nodes in this community are weakly interconnected._
- **Should `backend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.12380952380952381 - nodes in this community are weakly interconnected._