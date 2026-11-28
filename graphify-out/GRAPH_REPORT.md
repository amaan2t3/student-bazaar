# Graph Report - student-bazaar  (2026-11-28)

## Corpus Check
- 87 files · ~51,522 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 2, (none) 1, .css 1)

## Summary
- 347 nodes · 849 edges · 16 communities (12 shown, 4 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 56 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `78d31134`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- frontend/package.json
- Button
- AuthContext.jsx
- backend/package.json
- projectController.js
- AppRoutes.jsx
- config/supabase.js
- AddProject.jsx
- react
- react-router-dom
- Badge.jsx
- universityService.js
- roles.js
- Student Bazaar

## God Nodes (most connected - your core abstractions)
1. `react` - 42 edges
2. `Button()` - 36 edges
3. `lucide-react` - 34 edges
4. `AppRoutes()` - 29 edges
5. `react-router-dom` - 26 edges
6. `useAuth()` - 22 edges
7. `Student Bazaar` - 17 edges
8. `isSupabaseConfigured` - 12 edges
9. `express` - 12 edges
10. `protect()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Roles and Permissions` --references--> `protect()`  [INFERRED]
  README.md → backend/src/middleware/authMiddleware.js
- `Roles and Permissions` --references--> `restrictTo()`  [INFERRED]
  README.md → backend/src/middleware/authMiddleware.js
- `ProjectCard()` --calls--> `useCart()`  [EXTRACTED]
  frontend/src/components/cards/ProjectCard.jsx → frontend/src/context/CartContext.jsx
- `ContactMessages()` --calls--> `Badge()`  [EXTRACTED]
  frontend/src/pages/admin/ContactMessages.jsx → frontend/src/components/common/Badge.jsx
- `TeamManagement()` --calls--> `Badge()`  [EXTRACTED]
  frontend/src/pages/admin/TeamManagement.jsx → frontend/src/components/common/Badge.jsx

## Import Cycles
- None detected.

## Communities (16 total, 4 thin omitted)

### Community 0 - "frontend/package.json"
Cohesion: 0.07
Nodes (33): dependencies, axios@^1.6.8, lucide-react@^0.359.0, react@^18.2.0, react-dom@^18.2.0, react-router-dom@^6.22.3, @supabase/supabase-js@^2.119.2, devDependencies (+25 more)

### Community 1 - "Button"
Cohesion: 0.19
Nodes (17): Button(), CheckoutModal(), ContactMessages(), ContactSettings(), ProjectModeration(), SellerApplicationsReview(), TeamManagement(), AcademicIntegrity() (+9 more)

### Community 2 - "AuthContext.jsx"
Cohesion: 0.08
Nodes (21): App(), Footer(), Navbar(), PublicLayout(), AuthContext, AuthProvider(), CartContext, CartProvider() (+13 more)

### Community 3 - "backend/package.json"
Cohesion: 0.12
Nodes (20): dependencies, cors@^2.8.5, dotenv@^16.4.5, morgan@^1.10.0, nodemailer@^10.6.1, @supabase/supabase-js@^2.39.8, ws@^8.23.0, @supabase/supabase-js (+12 more)

### Community 4 - "projectController.js"
Cohesion: 0.12
Nodes (25): createCustomRequest(), DELIVERABLE_EXTRA_PRICES, getAdminCustomRequestsQueue(), getMyCustomRequests(), getOpenRequestsFeed(), getSingleCustomRequest(), getUniversityPriceIncrease(), HIGH_TIER_UNIVERSITY_KEYWORDS (+17 more)

### Community 5 - "AppRoutes.jsx"
Cohesion: 0.22
Nodes (12): UniversitySelect(), useAuth(), getUniversityPricingTier(), Login(), Register(), MyDownloads(), CustomProjectRequest(), DELIVERABLE_BUNDLES (+4 more)

### Community 6 - "config/supabase.js"
Cohesion: 0.06
Nodes (56): express@^4.19.2, createSupabaseAuthClient(), createSupabaseUserClient(), isSupabaseConfigured, supabase, supabaseAdmin, getDashboardStats(), getMe() (+48 more)

### Community 7 - "AddProject.jsx"
Cohesion: 0.24
Nodes (12): Badge(), CATEGORIES, DEGREES, HIGH_TIER_UNIVERSITY_KEYWORDS, SEMESTERS, SUBJECTS_BY_DEGREE, UNIVERSITIES, EMPTY_FORM (+4 more)

### Community 8 - "react"
Cohesion: 0.27
Nodes (5): AVAILABLE_SPECIALIZATIONS, contactService, sellerService, lucide-react, react

### Community 9 - "react-router-dom"
Cohesion: 0.31
Nodes (6): ProjectCard(), NAV_ITEMS, AcademicFilterBar(), BrowseProjects(), Home(), react-router-dom

### Community 10 - "Badge.jsx"
Cohesion: 0.36
Nodes (3): AdminProjectDetails(), formatPKR(), projectService

### Community 13 - "Student Bazaar"
Cohesion: 0.06
Nodes (35): Administrator accounts, API Overview, Architecture, Backend, Backend: `backend/.env`, Backend returns `503 Supabase Auth is not configured`, Buyer accounts, CORS request blocked (+27 more)

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Student Bazaar` connect `Student Bazaar` to `config/supabase.js`?**
  _High betweenness centrality (0.188) - this node is a cross-community bridge._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07057057057057058 - nodes in this community are weakly interconnected._
- **Why does `Roles and Permissions` connect `config/supabase.js` to `Student Bazaar`?**
  _High betweenness centrality (0.183) - this node is a cross-community bridge._
- **Should `AuthContext.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07665505226480836 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `frontend/package.json`, `Button`, `AuthContext.jsx`, `AppRoutes.jsx`, `AddProject.jsx`, `react-router-dom`, `Badge.jsx`?**
  _High betweenness centrality (0.156) - this node is a cross-community bridge._
- **Should `backend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.12380952380952381 - nodes in this community are weakly interconnected._
- **Should `projectController.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12183908045977011 - nodes in this community are weakly interconnected._