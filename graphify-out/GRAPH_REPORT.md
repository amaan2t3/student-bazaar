# Graph Report - student-bazaar  (2026-11-22)

## Corpus Check
- 81 files · ~48,783 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 2, (none) 1, .css 1)

## Summary
- 302 nodes · 785 edges · 13 communities (9 shown, 4 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 46 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0b503642`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- frontend/package.json
- Button
- backend/package.json
- CustomProjectRequest.jsx
- AuthContext.jsx
- config/supabase.js
- customRequestController.js
- projectController.js
- teamController.js
- roles.js
- student-bazaar

## God Nodes (most connected - your core abstractions)
1. `Button()` - 41 edges
2. `react` - 39 edges
3. `lucide-react` - 31 edges
4. `AppRoutes()` - 29 edges
5. `react-router-dom` - 25 edges
6. `useAuth()` - 22 edges
7. `express` - 11 edges
8. `isSupabaseConfigured` - 10 edges
9. `protect()` - 10 edges
10. `Badge()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `AppRoutes()`  [EXTRACTED]
  frontend/src/App.jsx → frontend/src/routes/AppRoutes.jsx
- `ProjectCard()` --calls--> `useCart()`  [EXTRACTED]
  frontend/src/components/cards/ProjectCard.jsx → frontend/src/context/CartContext.jsx
- `Register()` --calls--> `Button()`  [EXTRACTED]
  frontend/src/pages/auth/Register.jsx → frontend/src/components/common/Button.jsx
- `BrowseProjects()` --calls--> `Button()`  [EXTRACTED]
  frontend/src/pages/public/BrowseProjects.jsx → frontend/src/components/common/Button.jsx
- `CustomProjectRequest()` --calls--> `Button()`  [EXTRACTED]
  frontend/src/pages/public/CustomProjectRequest.jsx → frontend/src/components/common/Button.jsx

## Import Cycles
- None detected.

## Communities (13 total, 4 thin omitted)

### Community 0 - "frontend/package.json"
Cohesion: 0.06
Nodes (37): dependencies, axios@^1.6.8, lucide-react@^0.359.0, react@^18.2.0, react-dom@^18.2.0, react-router-dom@^6.22.3, @supabase/supabase-js@^2.119.2, devDependencies (+29 more)

### Community 2 - "Button"
Cohesion: 0.10
Nodes (41): Badge(), Button(), Footer(), Navbar(), PublicLayout(), CheckoutModal(), useAuth(), useCart() (+33 more)

### Community 3 - "backend/package.json"
Cohesion: 0.10
Nodes (24): dependencies, cors@^2.8.5, dotenv@^16.4.5, express@^4.19.2, morgan@^1.10.0, nodemailer@^10.6.1, @supabase/supabase-js@^2.39.8, ws@^8.23.0 (+16 more)

### Community 4 - "CustomProjectRequest.jsx"
Cohesion: 0.14
Nodes (20): ProjectCard(), UniversitySelect(), AcademicFilterBar(), CATEGORIES, DEGREES, getUniversityPricingTier(), HIGH_TIER_UNIVERSITY_KEYWORDS, MOCK_CUSTOM_REQUESTS (+12 more)

### Community 5 - "AuthContext.jsx"
Cohesion: 0.14
Nodes (9): AuthContext, statusLabels, adminService, api, authService, customRequestService, isSupabaseConfigured, supabase (+1 more)

### Community 6 - "config/supabase.js"
Cohesion: 0.09
Nodes (32): createSupabaseAuthClient(), createSupabaseUserClient(), isSupabaseConfigured, getDashboardStats(), getMe(), getProfileForSession(), login(), register() (+24 more)

### Community 8 - "customRequestController.js"
Cohesion: 0.22
Nodes (12): createCustomRequest(), DELIVERABLE_EXTRA_PRICES, DEMO_CUSTOM_REQUESTS, getAdminCustomRequestsQueue(), getMyCustomRequests(), getOpenRequestsFeed(), getSingleCustomRequest(), getUniversityPriceIncrease() (+4 more)

### Community 9 - "projectController.js"
Cohesion: 0.15
Nodes (19): createProject(), DEMO_PROJECTS, getAdminModerationQueue(), getAdminProjectById(), getProjectBySlug(), getProjects(), getSellerProjects(), moderateProject() (+11 more)

### Community 10 - "teamController.js"
Cohesion: 0.19
Nodes (14): supabase, supabaseAdmin, createTeamMember(), DATA_FILE, deleteTeamMember(), __dirname, __filename, getAdminTeamMembers() (+6 more)

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Button` to `frontend/package.json`, `CustomProjectRequest.jsx`, `AuthContext.jsx`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06312292358803986 - nodes in this community are weakly interconnected._
- **Why does `axios` connect `frontend/package.json` to `AuthContext.jsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.10250391236306729 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Button` to `frontend/package.json`, `CustomProjectRequest.jsx`, `AuthContext.jsx`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `backend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10256410256410256 - nodes in this community are weakly interconnected._
- **Should `CustomProjectRequest.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14039408866995073 - nodes in this community are weakly interconnected._