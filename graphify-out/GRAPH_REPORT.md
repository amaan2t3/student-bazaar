# Graph Report - student-bazaar  (2026-11-22)

## Corpus Check
- 81 files · ~50,589 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 2, (none) 1, .css 1)

## Summary
- 336 nodes · 810 edges · 13 communities (9 shown, 4 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e1976927`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- frontend/package.json
- Button
- Button
- backend/package.json
- CustomProjectRequest.jsx
- AuthContext.jsx
- config/supabase.js
- teamController.js
- universityService.js
- roles.js
- Student Bazaar

## God Nodes (most connected - your core abstractions)
1. `react` - 39 edges
2. `Button()` - 38 edges
3. `lucide-react` - 31 edges
4. `AppRoutes()` - 29 edges
5. `react-router-dom` - 25 edges
6. `useAuth()` - 22 edges
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
- `App()` --calls--> `AppRoutes()`  [EXTRACTED]
  frontend/src/App.jsx → frontend/src/routes/AppRoutes.jsx
- `ContactMessages()` --calls--> `Button()`  [EXTRACTED]
  frontend/src/pages/admin/ContactMessages.jsx → frontend/src/components/common/Button.jsx

## Import Cycles
- None detected.

## Communities (13 total, 4 thin omitted)

### Community 0 - "frontend/package.json"
Cohesion: 0.06
Nodes (37): dependencies, axios@^1.6.8, lucide-react@^0.359.0, react@^18.2.0, react-dom@^18.2.0, react-router-dom@^6.22.3, @supabase/supabase-js@^2.119.2, devDependencies (+29 more)

### Community 1 - "Button"
Cohesion: 0.10
Nodes (34): ProjectCard(), Button(), Footer(), Navbar(), UniversitySelect(), AcademicFilterBar(), PublicLayout(), CheckoutModal() (+26 more)

### Community 2 - "Button"
Cohesion: 0.16
Nodes (16): Badge(), DEGREES, AdminDashboard(), adminSections, formatPKR(), ContactMessages(), TeamManagement(), AVAILABLE_SPECIALIZATIONS (+8 more)

### Community 3 - "backend/package.json"
Cohesion: 0.07
Nodes (37): dependencies, cors@^2.8.5, dotenv@^16.4.5, express@^4.19.2, morgan@^1.10.0, nodemailer@^10.6.1, @supabase/supabase-js@^2.39.8, ws@^8.23.0 (+29 more)

### Community 4 - "CustomProjectRequest.jsx"
Cohesion: 0.17
Nodes (12): CATEGORIES, getUniversityPricingTier(), HIGH_TIER_UNIVERSITY_KEYWORDS, MOCK_CUSTOM_REQUESTS, MOCK_PROJECTS, SEMESTERS, SUBJECTS_BY_DEGREE, UNIVERSITIES (+4 more)

### Community 5 - "AuthContext.jsx"
Cohesion: 0.24
Nodes (6): AuthContext, adminService, api, authService, isSupabaseConfigured, supabase

### Community 6 - "config/supabase.js"
Cohesion: 0.06
Nodes (53): createSupabaseAuthClient(), createSupabaseUserClient(), isSupabaseConfigured, supabase, supabaseAdmin, getMe(), getProfileForSession(), login() (+45 more)

### Community 7 - "teamController.js"
Cohesion: 0.21
Nodes (12): createTeamMember(), DATA_FILE, deleteTeamMember(), __dirname, __filename, getAdminTeamMembers(), getTeamMembers(), INITIAL_DEMO_TEAM_MEMBERS (+4 more)

### Community 13 - "Student Bazaar"
Cohesion: 0.06
Nodes (35): Administrator accounts, API Overview, Architecture, Backend, Backend: `backend/.env`, Backend returns `503 Supabase Auth is not configured`, Buyer accounts, CORS request blocked (+27 more)

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Student Bazaar` connect `Student Bazaar` to `config/supabase.js`?**
  _High betweenness centrality (0.194) - this node is a cross-community bridge._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06312292358803986 - nodes in this community are weakly interconnected._
- **Why does `Roles and Permissions` connect `config/supabase.js` to `Student Bazaar`?**
  _High betweenness centrality (0.189) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.1024390243902439 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Button` to `frontend/package.json`, `Button`, `CustomProjectRequest.jsx`, `AuthContext.jsx`?**
  _High betweenness centrality (0.156) - this node is a cross-community bridge._
- **Should `backend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06976744186046512 - nodes in this community are weakly interconnected._
- **Should `config/supabase.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05970149253731343 - nodes in this community are weakly interconnected._