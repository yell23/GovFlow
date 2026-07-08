# GovFlow — Implementation Plan v11
### Know where every government document is, in real time.
**Type:** Multi-tenant Startup MVP | **Stack:** React 18 + Vite + TypeScript + Supabase

> **Positioning note:** lead with the outcome, not the software category. "Digital Workflow Operating System" describes the product; "never lose another government document again" is what actually lands with a Mayor. Use the tagline above for the pitch/landing page; keep the fuller category description for technical docs like this one.

> **What changed in v4:** v3 was organized entirely by *module* (Leave, Payroll, Purchase Request...), which is the right lens for **building** the system but the wrong lens for **understanding** who uses it and why. v4 keeps every module and architecture decision from v3 unchanged, but adds a **Role-Based User Flows** section (4.1) so you can trace, end-to-end, what each type of user actually sees and does — not just which tables their data lives in. Module numbering (6.x) is preserved so it still maps 1:1 to your folder structure and build order.

> **What changed in v5:** adds a **Visual Identity & Motion Design** section (2.1) — a concrete blue-and-yellow design system with typography, layout, and motion direction, so "gawing maganda at modern" has an actual spec instead of being left to whoever touches the frontend first. Also flags three open flow questions worth resolving before calling the UX "final": delegation/escalation when an approver is unavailable, the Tenant Admin's first-day onboarding flow, and mobile/desktop parity for approval actions.

> **What changed in v6:** v5 was strong on *architecture* (multi-tenancy, RLS, routing engine) but light on the actual *screen-level* detail — the exact summary cards, table columns, form fields, and the attendance status decision logic your team already worked out separately. v6 pulls all of that in as concrete specs, without changing any architectural decision from v5: HR/Admin dashboard summary cards and Employee Records drill-down (6.12), the Leave Application form fields + approval detail modal (6.4), the full automatic-attendance status decision tree (6.5), Travel Order/Job Order form fields (6.2/6.3), and the Employee dashboard's specific cards + My Attendance table (6.11). Nothing here contradicts v5 — it's the same modules, just specified down to the field level so a developer can build the screen directly instead of inferring it.

> **What changed in v7:** fixes real logic gaps found by walking through v6's attendance decision tree: (1) **reordered the decision tree** so Holiday/Weekend are checked *before* Leave/Travel Order, so a weekend that falls inside a leave date range no longer gets mislabeled "On Leave" or wrongly deducted; (2) added an explicit **`grace_period_minutes` org setting** that the tree was silently assuming; (3) clarified that **Overtime/Undertime are computed fields attached to a Present/Late record**, not separate statuses — the enum stays as-is; (4) added explicit **half-day leave handling** for attendance on a split day; (5) upgraded **Section 2.1 (Visual Identity & Motion Design)** into a fuller, more premium direction — richer surface/elevation system, refined component specs, and a real mockup (see chat) so "maganda at modern" has something you can actually point at, not just hex codes.

> **What changed in v8:** no architecture or logic changes — this just makes the plan point to its own build artifact. The full UI/UX direction in Section 2.1 has been turned into a standalone, paste-ready prompt (`GovFlow_UIUX_Build_Prompt.md`) for whatever AI coding tool actually builds the frontend (Claude Code, Cursor, v0, Lovable, etc.). Section 2.1 now links to it directly instead of the design system living only in this document.

> **What changed in v9:** one terminology fix — Section 4.1 (Approver flow) said "**Reject**" while every module spec (6.1–6.4) and the button component spec (2.1) say "**Decline**" for the same action. Standardized on **Decline** everywhere, since that's the majority usage and matches the original source spec. Small fix, but this is exactly the kind of mismatch that produces inconsistent button labels if a developer or AI coding tool builds off one section without cross-checking the others.

> **What changed in v10:** two requested upgrades to 2.1, both folded straight into `GovFlow_UIUX_Build_Prompt.md` so it stays a single, complete prompt: (1) **all primary navigation moves into the persistent left sidebar** — no top nav bar with clickable tabs; every role's menu items, active/hover states, and collapse behavior are now spelled out per role; (2) **the motion spec got real engineering detail** — actual duration tokens, named easing curves per interaction type, and a per-screen breakdown (sidebar, page transitions, modals, toasts, the Route Line marker) instead of prose-only direction. Nothing architectural changed — this is entirely 2.1 and the build prompt.

> **What changed in v11:** merged the two files into one. The standalone `GovFlow_UIUX_Build_Prompt.md` is now **Section 13** of this document — same content, no separate file to keep track of. Section 2.1 still holds the reasoning behind each design choice; Section 13 is the paste-ready version of the same system for handing straight to an AI coding tool. Everything else is unchanged from v10.

---

## 1. Executive Summary

**Problem:** LGUs don't have a "missing document" problem — they have a **workflow visibility** problem. Travel Orders, Leave Requests, Purchase Requests, Memoranda, and Payroll all move through multi-office approval chains on paper, and nobody can answer "nasaan na?" in real time.

**Product:** GovFlow is a **multi-tenant SaaS** platform. One codebase, one database, many LGUs (tenants) — each with its own users, workflows, and data, fully isolated from each other. The core differentiator is not any single module (leave, attendance, payroll) — it's the **Document Routing Engine**: every document gets a QR code and a trackable, LBC-style journey through its approval chain.

**Target customer sequencing:** Your own municipality is Tenant #1 (design partner / case study). Once proven there, onboarding LGU #2, #3... becomes a repeatable sales motion instead of a rebuild.

**Business model:** Subscription per LGU (e.g., ₱50,000/year tier), scoped by number of users/modules enabled. Billing logic is architected from day one even if the payment gateway itself is a later phase.

**Beyond LGUs (future verticals, not MVP scope):** the workflow-routing problem is identical wherever paper moves through offices — Barangay, Province, State Universities, other government agencies, hospitals, and even private companies are all viable later markets. Nothing in the architecture is LGU-specific (the generic `documents` + `workflow_templates` design in Section 5 works for any org type) — this is a positioning note for the pitch deck, not a build task. Don't build for these verticals now; just don't accidentally hardcode anything that would block them later (e.g., don't name a table `municipality_id` — use `organization_id`).

---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript | Matches your existing stack (TitleTrack) |
| Styling/UI | Tailwind CSS + ShadCN UI | Fast, consistent, accessible components |
| State/data | TanStack Query (React Query) + Zustand | Server cache + light client state |
| Backend | Supabase (Postgres, Auth, Storage, Realtime, Edge Functions) | Handles multi-tenant DB, RLS, file storage for signed documents |
| QR generation | `qrcode.react` or `qrcode` npm lib | Generates per-document/per-employee QR |
| QR scanning | `html5-qrcode` (mobile browser camera) | No native app needed for MVP |
| Charts | Recharts | Dashboards for Mayor/HR/Admin |
| Motion | Framer Motion | Page-load reveals, route-progress animation, micro-interactions (2.1) |
| AI Insights | Anthropic API (Claude) via Supabase Edge Function | Summarizes workflow bottlenecks in plain language |
| Email notifications | Resend or Supabase SMTP integration | Approval alerts, SLA breach warnings |
| Hosting | Vercel/Netlify (frontend) + Supabase Cloud (backend) | |

---

## 2.1 Visual Identity & Motion Design (NEW)

> **Build artifact:** the full design system below has been packaged into **Section 13**, a standalone, paste-ready prompt within this same document — meant to be handed directly to whatever AI coding tool builds the frontend (Claude Code, Cursor, v0, Lovable, etc.). Use this section (2.1) for the *reasoning* behind each choice; use Section 13 when you're ready to actually generate screens.

A government-facing tool has a specific tension to solve: it needs to feel **modern and trustworthy at the same time** — an LGU Mayor should look at it and think "credible system of record," not "flashy startup demo." The direction below is built around that, using your requested blue-and-yellow palette.

### Color tokens
| Token | Hex | Use |
|---|---|---|
| Ink Navy | `#122B4D` | Primary text, sidebar/nav background, headers |
| Route Blue | `#2457D6` | Primary actions (Approve & Forward, Submit), links, active states |
| Signal Yellow | `#F4B400` | The one accent — current-step markers, SLA warnings, the "you are here" indicator on the tracking trail |
| Paper | `#F8F9FB` | App background — cool off-white, not stark white, easier on the eyes for long dashboard sessions |
| Slate | `#5C6B7A` | Secondary text, timestamps, metadata |
| Alert Red | `#D64545` | Reserved *only* for rejections/SLA breaches — never used decoratively, so when it appears, it means something |

**Why this palette, not a generic one:** blue carries the "official/institutional" weight (most LGU seals and PH government branding lean blue), and yellow is used sparingly as a single high-visibility accent — not 50/50 blue-yellow, which would read more like a sports team than a government platform. Red is quarantined to actual problems, so it stays meaningful.

### Typography
- **Display/headers:** Space Grotesk — geometric, slightly technical, gives the product a "systems" personality without feeling cold.
- **Body/UI:** Inter — the standard for dense dashboard UI because it stays legible at small sizes; don't fight this one, it's a workhorse choice on purpose.
- **Data/mono:** IBM Plex Mono — for tracking numbers, QR reference codes, timestamps, audit log entries. Using a distinct mono face for these subtly signals "this is a precise, logged fact," which matters for a system LGUs will treat as a record of truth.

### Layout concept — sidebar-first navigation
There is **no top nav bar with clickable tabs.** Every primary action lives in a persistent left sidebar; the top of the screen is reserved for page title, breadcrumbs, and the notification bell only — never a menu.

**Sidebar structure (top to bottom):**
1. Wordmark/logo (GovFlow, small Route Blue icon mark + name in Space Grotesk)
2. Org switcher — only shown if a user belongs to more than one organization (rare); otherwise skip straight to nav
3. Nav items, grouped by section where a role has more than ~5 items (e.g., HR Admin gets an "HR Extended" sub-group)
4. User profile + logout pinned to the bottom, separated by a hairline

**Nav items per role:**
- **Employee:** Dashboard · My Requests (Leave / Travel Order / Job Order — submit + track) · My Attendance · Payslip · Announcements
- **Approver / Department Head:** Dashboard (pending approvals queue) · Approval History · Announcements
- **HR Admin:** Dashboard · Employees (roster + records) · Leave Management · Attendance · Payroll · HR Extended (Evaluation, Service Record, Training, Promotion — as a collapsible sub-group) · Announcements
- **Tenant Admin:** Dashboard (at-a-glance) · Workflow Templates · Users & Departments · Analytics · AI Insights · Subscription · Announcements
- **Super Admin:** Platform Dashboard · Tenants · Billing · Platform Health

**States:**
- Active item: Route Blue tint background, Ink Navy text, `2px` Signal Yellow left accent bar (this ties the sidebar back into the Route Line identity — the "you are here" marker shows up in navigation too, not just document tracking).
- Hover (inactive item): faint Paper-tint background, no accent bar.
- Pending-count badge: small Signal Yellow pill with a number, right-aligned in the row (e.g., "Pending Approvals — 3") — only on items where a count is meaningful (approvals queue, pending requests).
- Icons: one Tabler-style icon per item, always paired with a text label — never icon-only in the expanded state.

**Collapse behavior:** below tablet width, the sidebar collapses to an icon-only rail (~64px); tapping an icon expands it as a temporary overlay drawer rather than pushing page content. Desktop keeps the sidebar always expanded (~240px) — this isn't a "hamburger everything" app, it's a daily-use dashboard.

- **Card-based dashboards** — the at-a-glance widget (6.12) sits in a single wide card at the top, detail charts below in a grid.
- **The tracking view (6.1) is the visual centerpiece**, not a secondary screen — see Signature element below.

### Surface & elevation system
A flat, government-appropriate answer to "why does this look premium and not like a spreadsheet":
- **Page background:** Paper (`#F8F9FB`) — never stark white; this is what makes white cards on top feel like they're actually sitting on something.
- **Cards:** pure white, `12px` radius, hairline `0.5px` border in a slightly darker neutral (`#E3E7ED`) — no drop shadows. Depth comes from the Paper-vs-white contrast, not shadow layering, which keeps the whole UI feeling calm and print-like rather than "app-y."
- **Metric cards** (the at-a-glance numbers): a slightly tinted surface one step down from pure white, small muted label above a large number below — this is the pattern that makes a 9-card summary row scannable in 5 seconds instead of reading like a spreadsheet.
- **Two elevation levels only:** page surface, and card surface. No third floating layer competing for attention — a government dashboard shouldn't have popovers stacked on popovers.
- **Radius discipline:** `12px` for cards and containers, smaller (`~7-8px`) for buttons/badges/pills — consistent enough to feel like one system, not mixed corner values across the app.

### Component specs
- **Buttons:** Primary action (Approve & Forward, Submit) = solid Route Blue fill, white text, `7px` radius. Secondary (Decline, Cancel) = white fill, hairline border, Slate text — never red for Decline; red is reserved for actual breaches, not a routine "no."
- **Status badges:** small pill, colored text on a tint of that same color (never colored text on white) — e.g. "On Leave" in navy-on-pale-blue, "Absent" in red-on-pale-red. Consistent across every table in the app (Leave, Travel Order, Job Order, Attendance) so a user learns the color language once.
- **Tables:** hairline row dividers, no zebra-striping (reads cleaner on dense HR tables), row-hover highlight in the faintest Paper tint to show interactivity without adding visual weight.
- **Data callouts** (attendance counts, leave balances): large number in Space Grotesk, small muted label in Inter above it — the pairing that makes the summary cards feel considered rather than default Bootstrap-style stat blocks.

### Signature element: the Route Line
Since the entire product's differentiator is *watching a document travel through a chain*, that idea should show up as a recurring visual motif everywhere, not just on one tracking screen:
- A thin **Route Blue connector line** links each step in a document's journey, with **Signal Yellow dots** marking completed steps and a pulsing yellow marker on the *current* step.
- The same line-and-dot motif scales down into: status badges in tables ("● ● ●○○" mini-trail instead of a plain text label), the notification icon, and even the loading state for a page transition (a thin yellow line "traveling" left to right).
- This gives GovFlow one unmistakable visual signature tied directly to what the product does — a person who's seen it once should recognize "oh, that's the document-tracking one" from the line motif alone.
- **See the dashboard mockup shared in this conversation** for how the summary cards, the Route Line tracking strip, and the Leave Requests approval list actually look together — that's the reference to hand off to whoever builds the frontend, so "gawing maganda" has a concrete target instead of being reinterpreted per screen.

### Motion direction
Motion should feel **purposeful and calm**, not decorative — this is a tool people use daily for serious documents, not a marketing site.

**Duration tokens:**
| Token | Value | Use |
|---|---|---|
| `fast` | 120ms | Hover states, small toggles |
| `base` | 200ms | Page/panel transitions, sidebar active state |
| `slow` | 320ms | Modal/panel open, larger layout shifts |
| `signature` | 400ms | The Route Line marker advance only |

**Easing curves:**
- `ease-out-standard` — `cubic-bezier(0.16, 1, 0.3, 1)` — default for anything entering the screen (toasts, panels, page content). Fast start, gentle stop, no overshoot — reads as precise, not bouncy.
- `ease-in-out-standard` — `cubic-bezier(0.4, 0, 0.2, 1)` — for state toggles that both enter and exit the same way (sidebar collapse/expand, tab-like section switches).
- `ease-settle` — `cubic-bezier(0.34, 1.56, 0.64, 1)` — the **one** curve allowed a slight overshoot. Reserved exclusively for the Route Line marker's advance, so that single "settle" feeling stays special instead of showing up everywhere.

**Per-screen breakdown:**
- **Sidebar:** hover background fade `fast` / `ease-out-standard`. Active-item change (route navigation) — background + accent bar fade in `base` / `ease-out-standard`. Collapse/expand — width transition `base` / `ease-in-out-standard`, with labels fading out at the midpoint of the width change (not the full duration) so text doesn't visibly wrap before it disappears.
- **Page/section transitions:** cross-fade content, `base` / `ease-out-standard` — never a hard cut, never a slide (slides read as "mobile app," not "dashboard").
- **Route Line marker advance (the signature moment):** position transition `signature` / `ease-settle`, paired with a brief opacity glow pulse (0 → 1 → 0 over 600ms) on arrival at the new step. This is the one place the "delight budget" goes — nowhere else needs this much motion.
- **Modals/panels (Leave approval detail, etc.):** open — slide-up 12px + fade in, `slow` / `ease-out-standard`. Close — same motion reversed but at `base` (faster close reads as more responsive than a symmetrical open/close).
- **Toasts:** slide-in from top-right, `base` / `ease-out-standard`; auto-dismiss after 4s; exit is a plain fade at `fast`.
- **Buttons:** hover is a background/border tint change only, `fast` — no scale on hover (scale-on-hover reads as "trying too hard" on a dense dashboard). A subtle `scale(0.98)` is reserved for the *press* state only, `fast`.
- **Dashboard cards on load:** fade + rise 4px, staggered ~40ms per card — one orchestrated moment, not per-element bouncing.

**Respect `prefers-reduced-motion` without exception** — every transition above collapses to an instant state change when that OS setting is on. Not optional for a government platform serving a broad, mixed-age user base.

**Restraint rule:** if in doubt, cut the animation. One well-executed signature motion (the Route Line marker, using the one overshoot curve in the whole system) beats five small competing effects — over-animating is what makes dashboards feel cheap, not premium.

---

## 3. Multi-Tenant Architecture (build this first — everything depends on it)

This is the single most important architectural decision. Get it right before writing any module.

**Pattern: Shared database, shared schema, tenant isolation via `organization_id` + Row Level Security (RLS).**

- Every business table carries an `organization_id` column referencing `organizations.id`.
- Supabase RLS policies filter every query by the caller's organization membership — enforced at the database level, not just in frontend code.
- A `user_organizations` join table maps a user to one or more organizations with a role (a user could theoretically belong to more than one LGU, e.g. a consultant, though most will belong to one).
- Routing: path-based tenant context for MVP is simplest — `app.govflow.ph/o/{org-slug}/...` — avoids the DNS/subdomain complexity of wildcard subdomains. Subdomains (`sanjose.govflow.ph`) can come later as a "looks more official" upsell.
- Two admin tiers:
  - **Platform Super Admin** (your team) — manages tenant onboarding, billing, platform health. Not scoped to any single organization.
  - **Tenant Admin** (LGU's Mayor's Office/HR Head) — manages their own org's users, workflow templates, and settings only.

**Why this matters for you specifically:** because the answer to Q3 was "full suite," the temptation will be to start building modules in parallel. Don't. Every module (Leave, Travel Order, Payroll) is just a "document type" that rides on top of this foundation and the routing engine in Section 6.1. Build the foundation once, correctly, and the modules become fast to add.

---

## 4. User Roles & Permissions

| Role | Scope | Description |
|---|---|---|
| Super Admin | Platform-wide | GovFlow team; manages tenants, billing, platform monitoring |
| Tenant Admin | Per organization | LGU-side owner; configures workflow templates, manages users/departments |
| HR Admin | Per organization | Manages employees, leave balances, attendance, payroll |
| Department Head / Approver | Per organization | Approves/declines documents at their assigned workflow step |
| Employee | Per organization | Submits requests, views own dashboard (leave balance, attendance, documents) |

Approval-chain participants (Budget Officer, Accountant, Treasurer, Mayor, etc.) don't need to be hardcoded system roles — model them as **"Approver" assignments tied to specific steps in a workflow template**, configurable per tenant. This is what lets one LGU have a 4-step Travel Order chain and another have a 7-step chain, without you touching code.

### 4.1 Role-Based User Flows

> **Open questions before this is "final":** (1) **Delegation/escalation** — what happens when an Approver is on leave or unavailable for days? Needs a "delegate to" or "auto-escalate after N days" rule, or documents will stall exactly like they do on paper today. (2) **Tenant onboarding detail** — the Tenant Admin's actual first-session flow (creating the first workflow template, inviting the first batch of users) isn't spec'd step-by-step yet; needed before demoing to LGU #2. (3) **Mobile/desktop parity** — confirm every approval-critical action (approve, comment, view full document) is genuinely usable on a small screen, not just technically reachable.

This is the piece v3 was missing: what each role actually *does*, in order, from login to notification — cross-referenced to the modules in Section 6. Use this section to sanity-check UI/UX and screen-by-screen scope; use Section 6 for data/logic scope.

**Employee**
1. Logs in → lands on **Employee Self-Service Dashboard** (6.11): leave balance, attendance summary, own document statuses, payslip, announcements.
2. Submits a request (Travel Order, Leave, Job Order, Purchase Request) via the relevant module form (6.2–6.6).
3. Tracks it on the **live LBC-style tracking view** (6.1) — sees current holder, time-in-step, SLA status.
4. Gets **in-app + email notifications** (6.14) on status changes: received, approved, declined, comment/remark added.
5. Can reply to a **threaded remark** if an approver requests a revision (6.1's `workflow_step_comments`).

**Department Head / Approver** (includes ad-hoc approval-chain roles: Budget Officer, Accountant, Treasurer, Mayor)
1. Logs in → sees a **pending approvals queue** (documents currently sitting at their step).
2. Opens a document → reviews attached details + comment thread → **Approve & Forward**, **Decline**, or **Request revision** (comment) (6.1).
3. Can act from **mobile** without returning to the office (6.1 mobile approval caveat: in-app approval + audit trail, not a certificate-based e-signature, for MVP).
4. Gets notified when a new document lands at their step, or when an SLA is approaching/breached (6.14).
5. No config access — workflow templates are read-only from this role's perspective; only Tenant Admin edits them.

**HR Admin**
1. Logs in → sees **HR dashboard** (6.12): roster, leave/attendance trends, evaluation/training/promotion status, org-wide document volume.
2. Manages employee records, leave types/balances (6.4), attendance exceptions and holiday calendar (6.5).
3. Runs/oversees **HR Extended** processes — evaluations, service records, trainings, promotions (6.10) — each optionally routed through the same engine as any other document.
4. Reviews **basic payroll** (6.9) generation per period, using attendance + leave + base pay (no statutory computation in MVP).
5. Does **not** manage other orgs, billing, or platform settings — scope stops at their own organization, same isolation boundary as Tenant Admin (RLS via `organization_id`).

**Tenant Admin** (LGU's Mayor's Office / HR Head — the "owner" of one LGU's instance)
1. Logs in → sees the **at-a-glance widget** (6.12): documents in process, delayed count, average processing time, most-delayed office.
2. **Configures workflow templates** per document type — who approves what, in what order, per their LGU's actual chain (6.1, Section 4 above).
3. **Manages users & departments** for their org — invites employees, assigns roles (Approver, HR Admin, etc.), sets up offices.
4. Views **org-wide analytics** (6.12) and **AI Insights** (6.13) — bottleneck detection, delayed-document trends.
5. Manages their org's **subscription tier / enabled modules** at a high level (actual billing/invoicing is Super Admin-side, Section 7).
6. Scoped strictly to their own organization — cannot see or touch another LGU's data, same as every other non-Super-Admin role.

**Super Admin** (GovFlow team — you)
1. Logs in → sees **platform-wide dashboard** (6.12): active tenants, usage per plan, churn/health signals.
2. Onboards new tenants (creates `organizations` record, initial Tenant Admin account, tier selection).
3. Manages **billing/subscriptions** across all tenants (Section 7) — manual invoicing/activation for MVP.
4. Monitors platform health — not scoped to any single org; the only role that legitimately crosses tenant boundaries.
5. Does not touch any individual LGU's day-to-day workflow templates or approvals — that's Tenant Admin/Approver territory.

**Quick way to tell HR Admin apart from Tenant Admin:** HR Admin owns *people/records* (leave, attendance, evaluations, payroll) within the org. Tenant Admin owns the *org itself* (workflow configuration, user/role management, subscription). One LGU could plausibly have the same person wearing both hats early on, but they're different permission scopes.

---

## 5. Core Database Schema (high-level)

```
organizations              -- tenant record (name, slug, plan, status)
organization_subscriptions -- plan tier, seat limits, billing cycle
profiles                   -- extends Supabase auth.users
user_organizations         -- user_id, organization_id, role
departments                -- offices within an org (HR, Budget, Accounting...)

workflow_templates         -- org_id, document_type, ordered step definitions
workflow_instances         -- a specific document's live routing state
workflow_steps             -- per-instance step: assigned office, status, timestamps
qr_codes                   -- linked to workflow_instances, scan history
qr_scan_logs               -- who scanned, when, from what step to what step
workflow_step_comments     -- threaded remarks per step, e.g. "kulang OR"

documents                  -- generic envelope: type, title, requester, org_id
travel_orders               -- type-specific detail table
job_orders                  -- type-specific detail table
leave_requests             -- type-specific detail table
purchase_requests          -- type-specific detail table
memoranda                  -- type-specific detail table
contracts                   -- type-specific detail table
resolutions                 -- type-specific detail table

leave_types                -- org-configurable (VL, SL, Force Leave...)
leave_balances              -- per-employee ledger, auto-accrual
attendance_records          -- check-in/out, method, computed status, hours_worked, overtime_minutes, undertime_minutes
org_attendance_settings     -- org_id, grace_period_minutes, work_week config (which days count as weekend)
holidays                    -- org_id, date, name -- per-LGU holiday calendar, feeds the attendance decision tree (6.5)

payroll_periods
payroll_records             -- derived from attendance + leave + base pay

employee_evaluations         -- performance review cycles, ratings
service_records              -- 201-file equivalent: appointment history, designations
trainings                    -- training records, certificates, hours
promotions                   -- promotion/reclassification history

announcements                -- org-wide feed, published memoranda land here too
notifications
audit_logs
```

**Design principle:** `documents` is a generic envelope (id, org_id, type, requester, current_status, workflow_instance_id) so the routing engine, QR tracking, and analytics can operate on *any* document type identically. Each specific module (`travel_orders`, `leave_requests`, etc.) just holds the type-specific fields and references back to `documents.id`. This avoids rebuilding routing/tracking/analytics logic for every new module.

---

## 6. Core Modules

*(Reference by module/data-domain — see Section 4.1 for the same features organized by "who uses what.")*

### 6.1 Document Routing Engine — *the killer feature, build this first*
- Tenant Admin defines a **workflow template** per document type: an ordered list of departments/approvers.
- On submission, a `workflow_instance` is created, a unique QR code generated, and step 1 activated.
- **Physical + digital handoff:** each office scans the QR (or clicks "Received"/"Approve & Forward" in-app) to advance the document. Timestamp, scanning user, and status logged.
- **Mobile approval:** approvers (including the Mayor) can approve/decline from their phone without returning to the office — this is just the same "Approve & Forward" action on a mobile-responsive view, no new backend needed.
  - **Caveat on "digital signature":** an in-app approval action with a full audit trail (who, when, from what device/IP) is enough for MVP and covers most internal LGU processes. A legally-binding *e-signature* (RA 8792-compliant, certificate-based) is a separate, later phase if a specific document type requires it — don't conflate the two when scoping.
- **Document comments/remarks:** each workflow step supports a threaded comment (e.g., "Accounting: kulang OR" → "HR: na-upload na" → "Accounting: approved"), so revision requests happen in-app instead of by phone call. Stored in a `workflow_step_comments` table, tied to the step, visible in the document timeline.
- **Live tracking view** (LBC-style): requester and admins see a visual progress trail — current holder, time-in-current-step, expected SLA vs. actual.
- SLA timer per step; auto-flag when a step exceeds its expected duration ("delayed").

### 6.2 Travel Order Module
Request form → routed via engine → approval history → printable copy with QR for physical dispatch if needed.

**Request form fields (Employee side):** Destination · Purpose · Date · Attachment. Submit → status **Pending**.
**Admin-side table:** Employee · Destination · Purpose · Date · Status · Action (View / Approve / Decline).
**On Approve:** attendance for the covered date(s) auto-flips to **Official Business** — not counted as absent. **On Decline:** no attendance change; falls through to the normal decision tree in 6.5.

### 6.3 Job Order Module
Same pattern as Travel Order: request/assignment form → routed via engine (e.g., requesting office → HR/Admin → approving authority) → completion sign-off. Since it rides the same generic `documents` envelope and routing engine, this is largely "Travel Order with different fields" — cheap to add once 6.1–6.2 exist.

**Request form fields (Employee side):** Project · Description · Date · Attachment. Submit → status **Pending**.
**Admin-side table:** Employee · Project · Date · Status · Action (View / Approve / Decline).
**On Approve:** status updates and the record is saved to the employee's document history (6.11) — Job Order doesn't drive an attendance-status change the way Leave/Travel Order do, since it's typically assignment work rather than time away from the post.

### 6.4 Leave Management Module
- Org-configurable leave types (VL, SL, Force Leave, etc.)
- Auto-accrual (e.g., standard CSC accrual rates, configurable per org)
- Leave request rides the routing engine; approved leave auto-deducts from balance
- Employee dashboard shows live balance, no manual computation

**Leave Application form (Employee side) — fields:**
- Leave Type (dropdown, org-configured list)
- From / To (date range)
- Half Day? (toggle, AM/PM) — when on, applies only to a single date and deducts 0.5 day
- Number of Days (auto-computed from range and half-day toggle; excludes weekends/holidays automatically per the org's calendar, so leave credits are never deducted for non-working days)
- Reason (text)
- Attachment — required if Leave Type = Sick Leave (Medical Certificate), optional otherwise
- Actions: **Submit** / **Cancel** → status starts as **Pending**

**Admin-side Leave Requests table** (list view): Employee · Leave Type · Date · Days · Status · Action (Approve/Decline)

**Leave detail view** (opens on clicking an employee/request — this is the screen the Approver actually decides from):
- Header: Employee Name, Department, Position
- Leave Credits snapshot at time of request:
  - Vacation Leave — Used / Remaining
  - Sick Leave — Used / Remaining
- Buttons: **View Attachment**, **Approve**, **Decline**
- On **Approve**: leave credits auto-deduct, and the employee's attendance status for the covered dates flips to **On Leave** (not counted as absent)
- On **Decline**: no deduction, employee is notified, dates remain whatever attendance would otherwise resolve to (see 6.5 decision tree)

### 6.5 Attendance Module
- **MVP scope:** QR check-in/check-out (personal QR scanned at a station, or station QR scanned by employee's phone) — **RFID card tap is a viable alternative/addition**, especially for LGUs that already issue ID cards; both are far cheaper and faster to deploy than biometric hardware
- Optional GPS geofence check for field-based staff
- Auto-computes late/absent/overtime/undertime; cross-references approved leave so a leave day never shows as "absent"
- **Holiday auto-detection:** an org-configurable `holidays` calendar (per LGU, since local holidays vary) so non-working days never get flagged as "absent" — no manual override needed each time
- **Phase 2 (not MVP):** face recognition and fingerprint/biometric device integration — both need external hardware SDKs and are realistically a later add-on, not v1

**Attendance record view (per employee, per day):** Employee · Time In · Time Out · Status, where **Status** is one of: Present, Late, On Leave, Official Business, Holiday, Weekend, Absent.

**Automatic attendance status — decision tree (runs per employee, per calendar day, no manual entry needed):**
```
1. Is the date a Holiday (org's holiday calendar)?     → Status = Holiday        (checked first — overrides everything below)
2. Is the date a Weekend (org's work-week config)?     → Status = Weekend        (checked second — same reason)
3. Did the employee Time In?
   ├─ YES → within grace period (org's `grace_period_minutes`)? → Status = Present
   │        past grace period?                                  → Status = Late
   └─ NO  → check in this order, stop at first match:
            a. Full-day Approved Leave covering this date?        → Status = On Leave
            b. Approved Travel Order covering this date?          → Status = Official Business
            c. None of the above                                  → Status = Absent
```
**Why Holiday/Weekend moved to the top:** in v6 these were checked *after* Leave/Travel Order, which meant a Saturday or Sunday sitting inside an approved leave date range (e.g., a VL from Fri to Tue) got mislabeled "On Leave" — and worse, could get counted against leave credits for a day nobody was scheduled to work anyway. Checking Holiday/Weekend first means those days are never a Leave/OB day, so they can't be miscounted either way.

**Grace period config:** add `grace_period_minutes` to the org settings table (alongside `holidays` and work-week config) — this is what "within grace period" in step 3 actually reads from. Configurable per LGU since late-cutoff policy varies.

**Overtime/Undertime — not a separate status:** these are **computed fields** (`hours_worked`, `overtime_minutes`, `undertime_minutes`) attached to a day that already resolved to Present or Late, not additional entries in the Status enum. The enum stays exactly as before: Present, Late, On Leave, Official Business, Holiday, Weekend, Absent.

**Half-day leave:** when Number of Days on a leave request includes a half-day, the covered half is deducted from leave credits and that half is excluded from the Time In/Time Out expectation; the remaining half of that day still runs through the full decision tree above (so an employee who works the AM and has an approved PM half-day-leave shows Time In/Time Out for the AM half, plus a partial "On Leave" marker for the PM half — surfaced in the UI as a split badge, e.g. "Present (AM) / On Leave (PM)," rather than one single status for the day).

This whole tree runs as a nightly/scheduled job (edge function) plus a real-time check on Time In — not something HR ever sets manually. The point is HR never has to chase down "why is this person marked absent" for a day that was actually a holiday, weekend, approved leave, or travel order.

### 6.6 Purchase Request Module
PR form → routed through Budget → Accounting → Treasurer via the same engine, linked to procurement status.

### 6.7 Contracts & Resolutions Module
- **Contracts:** drafted, routed for multi-party signature (e.g., Legal → Budget → Mayor → external party), status tracked like any other document; stores the signed file in Supabase Storage against the `documents` record.
- **Resolutions:** Sanggunian/council resolution drafting → routed for member signatures/quorum sign-off → published once approved. Simpler than contracts (usually internal-only routing, no external counterparty).
- Both reuse the routing engine and QR tracking exactly like Travel Order/Job Order — the only new work is the `contracts` and `resolutions` detail tables plus their specific fields (parties, effectivity dates, contract value, resolution number/series).

### 6.8 Memorandum / Communications Module
Draft → route for signature(s) → publish to an org-wide `announcements` feed once fully signed. This feed is also where Contracts/Resolutions status and general org announcements surface — one feed, multiple sources.

### 6.9 Payroll Module — *scope this down for MVP*
Full payroll (tax tables, GSIS/PhilHealth/Pag-IBIG deductions, government remittance formats) is a large, compliance-heavy problem on its own. **Realistic MVP scope:** generate a basic payslip pulling from attendance + leave + a manually-entered base pay, without full statutory computation. Flag full payroll compliance as a distinct, later phase — this is the one area where I'd genuinely push back on "buong suite agad," because getting payroll math wrong for a real LGU has real consequences.

### 6.10 HR Extended — Evaluation, Service Record, Training, Promotion
These four were named explicitly as part of "everything" on the HR dashboard, so calling them out as their own module rather than burying them in "HR Admin manages employees":
- **Evaluation:** configurable review periods/forms, rating entry by supervisor, routed for HR/admin acknowledgment like any other document.
- **Service Record:** the 201-file equivalent — appointment history, designations held, status changes over an employee's tenure. Mostly a structured record view, not a workflow.
- **Training:** log of trainings attended/certificates earned, hours accumulated — feeds into promotion eligibility checks if the LGU wants that later.
- **Promotion:** history of promotions/reclassifications, each one optionally itself a routed document (recommendation → HR → Mayor approval) so it benefits from the same tracking as everything else.

This is a genuinely separate mini-module from core "employee management" — budget it as such rather than assuming it's a side effect of the `profiles` table.

### 6.11 Employee Self-Service Dashboard
Consolidates everything an individual employee should see in one place, since the source material was explicit that this needs all of these together, not just leave/attendance:
- Leave balance (6.4) · Attendance summary (6.5) · Own Travel Order / Job Order / Purchase Request status (6.1–6.3, 6.6)
- **Payslip** — read-only view of their own `payroll_records` (6.9)
- **Announcements** — the org-wide feed (6.8)
- Own documents archive (everything they've submitted, searchable by status/date)

**Dashboard summary cards (top of screen, at login):** Present (cumulative, e.g., "224") · Absent (cumulative) · Late (cumulative) · Vacation Leave Remaining · Sick Leave Remaining · Pending Requests (count). These are the numbers an employee actually checks first — everything below is detail they drill into on demand.

**"My Attendance" tab:**
- Table: Date · Time In · Time Out · Status
- Summary strip: Working Days · Present · Late · Absent · On Leave · Official Business
- **Leave Balance** breakdown, per leave type: Total · Used · Remaining — auto-updates the moment a leave request is approved (no manual recompute).

### 6.12 Analytics & Dashboards
| Dashboard | Audience | Key views |
|---|---|---|
| Employee | Individual | Leave balance, attendance, payslip, announcements, own document status *(see 6.11)* |
| HR | Org-wide | Employee roster, leave/attendance trends, evaluations/training/promotion status, org-wide document volume |
| Tenant Admin / Mayor | Org-wide | Average approval time per document type, bottleneck office, delayed documents |
| Super Admin | Platform-wide | Active tenants, usage per plan, churn/health signals |

**Mayor/Tenant Admin "at-a-glance" widget** — the top-of-dashboard summary should be scannable in 5 seconds, not a wall of charts:
```
Today
127 documents in process · 18 delayed · 6 pending signature
Average processing: 2.3 days
Most delayed office: Accounting
```
This sits above the detailed charts, not instead of them — it's the answer to "how are we doing right now," with the charts available for anyone who wants to dig in.

**HR/Admin dashboard summary cards** (the first thing HR Admin sees at login, one row of at-a-glance counts for *today*): Total Employees · Present Today · Absent Today · Late Today · On Leave · Official Business · Pending Requests · Approved Today · Declined Today. These feed straight off the attendance decision tree in 6.5 and the request queues in 6.1–6.4, so no separate computation logic is needed — they're aggregates of data that already exists.

**Employee Records drill-down** (HR Admin clicks into an individual employee from the roster):
- **Attendance Summary:** Total Working Days · Present · Absent · Late · On Leave · Official Business
- **Leave Credits:** per leave type (Vacation, Sick, etc.) — Total · Used · Remaining
- **Documents:** Leave Requests · Travel Orders · Job Orders — full history of everything that employee has submitted, each linked back to its routing-engine record so HR can trace the full approval trail, not just the current status.

### 6.13 AI Insights
Scheduled/edge-function job aggregates `workflow_steps` timing data per org, sends a summarized prompt to Claude, and returns plain-language insights ("Accounting is the current bottleneck for Purchase Requests, averaging 8 days vs. a 3-day target") surfaced as cards on the admin dashboard — not raw report tables.

**Conversational layer (later in the phase, not day one):** letting the Mayor type "Bakit bumagal ang processing ngayong buwan?" and get a direct answer is a strong feature, but scope it carefully — **don't let the LLM generate live SQL against the database** (accuracy and security risk). Safer MVP approach: a fixed set of pre-aggregated queries (by document type, by office, by date range) that the AI selects from based on the question's intent and then explains in natural language. This gets the "ask a question, get an answer" experience without open-ended query generation.

### 6.14 Notifications
In-app + email on: document received at your office, approaching/breached SLA, leave approved/declined, announcement published.

---

## 7. Subscription & Billing Layer
- `organization_subscriptions` table tracks plan tier, seat limit, enabled modules, renewal date — model this from day one even before a payment gateway is wired in.
- **Tiered pricing** (easier to sell than a single flat price — different LGU sizes/budgets map to different tiers):

| Tier | Price | Fit |
|---|---|---|
| Starter | ₱30,000/year | Small municipality/barangay; core routing + 1-2 modules |
| Professional | ₱80,000/year | Full module suite, standard seat limits |
| Enterprise | Custom | Large LGU/province, custom integrations, higher seat/volume limits |

- MVP: manual invoicing/activation by Super Admin, tier selected at onboarding.
- Later: PayMongo or Stripe integration for self-serve signup, since PayMongo has better local (PH) payment method coverage (GCash, etc.) if that matters for your buyers.

---

## 8. Recommended Build Order

Even with "full suite" as the target, a solo/small-team build still has a hard dependency order. Suggested sequence:

1. **Foundation** — Auth, `organizations`/multi-tenancy, RBAC, org onboarding flow, base layout/dashboards shell
2. **Document Routing Engine** — the core innovation; nothing else works without it
3. **Travel Order + Memorandum** — simplest modules to validate the engine end-to-end
4. **Job Order + Contracts + Resolutions** — same routing pattern as #3, mostly new fields/tables, not new logic — batch these together since they're cheap once the engine is proven
5. **Leave Management + Attendance** — higher complexity (accrual logic, computed states)
6. **Purchase Request** — reuses engine, adds budget/accounting-specific fields
7. **Employee Self-Service Dashboard** — pulls together everything from #3–6 into one view; do this once those modules have real data to show
8. **Analytics dashboards + AI Insights** — needs real workflow data flowing first to be meaningful
9. **Payroll (basic scope)** — deliberately kept late; highest compliance risk
10. **HR Extended (Evaluation, Service Record, Training, Promotion)** — lowest urgency; it's records/reporting, not a blocker for the core routing pitch, and least likely to be what a demo needs first
11. **Billing/subscription management + multi-tenant onboarding polish** — needed once you're ready to sell to LGU #2

This order gets you to a demo-able, full-loop product (submit → route → track → approve → analytics) fastest, with payroll's compliance risk isolated to the end rather than blocking everything else.

**Note:** this is *build* order, driven by technical dependency (you can't demo analytics without real workflow data). It intentionally differs from the *user experience* order in 4.1 — e.g., Notifications (6.14) is last to build but is the first thing a live user actually interacts with day-to-day. Don't confuse "built last" with "low priority for UX" once the system is live.

---

## 9. Suggested Folder Structure

```
src/
  app/                 -- routing, layout shells per role
  features/
    auth/
    organizations/
    workflow-engine/
    travel-orders/
    job-orders/
    leave/
    attendance/
    purchase-requests/
    contracts-resolutions/
    memoranda/
    payroll/
    hr-extended/          -- evaluation, service record, training, promotion
    employee-dashboard/
    analytics/
    ai-insights/
  components/ui/        -- ShadCN primitives
  lib/
    supabase.ts
    rls-helpers.ts
  hooks/
  types/
supabase/
  migrations/
  functions/            -- edge functions (AI insights, QR events, notifications)
```

---

## 10. Security & Compliance Notes
- This handles government employee PII and, eventually, payroll data — **Philippine Data Privacy Act (RA 10173)** considerations apply: data minimization, access logs, encryption at rest (Supabase handles this), and a clear data retention policy per tenant.
- RLS is your primary tenant-isolation guarantee — test it explicitly (attempt cross-tenant reads with a test account before launch).
- Full audit trail (`audit_logs`) on every approval/rejection/status change — LGUs will want this for COA (Commission on Audit) purposes.

---

## 11. Success Metrics (for your own municipality as Tenant #1)
- Average document turnaround time (baseline vs. after GovFlow)
- % of documents with zero "wala akong alam" status queries
- HR time saved on manual leave computation
- Bottleneck office identified and (ideally) measurably improved

---

## 12. Next Steps
1. Set up Supabase project + `organizations`/`user_organizations`/RLS skeleton
2. Build the Document Routing Engine on `documents` + `workflow_templates` + `workflow_instances`
3. Wire QR generation/scanning end-to-end for one document type (Travel Order) as the proof-of-concept
4. Use your own municipality's actual approval chains as the first workflow template — this becomes both your test data and your case study
5. When you're ready to scaffold screens, copy **Section 13** below into your AI coding tool of choice (Claude Code, Cursor, v0, Lovable, etc.) — it's the same design system as 2.1, written as one paste-ready prompt

---

## 13. Frontend Build Prompt (paste-ready for your AI coding tool)

> Copy everything below this line into your AI coding tool (Claude Code, Cursor, v0, Lovable, etc.) as the build prompt for the frontend. It's self-contained — the tool doesn't need to read the rest of this document to use it.

---

You are building the frontend for **GovFlow**, a multi-tenant document workflow and HR platform for Philippine local government units (LGUs). The product tracks government documents (Leave Requests, Travel Orders, Job Orders, Purchase Requests, Memoranda, Contracts/Resolutions) as they move through multi-office approval chains, LBC-tracking style — plus an HR module (attendance, leave, payroll basics).

**Design brief in one sentence:** it must look like a credible system of record a Mayor would trust, not a flashy startup demo — modern, calm, and precise, never playful or "SaaS-generic."

### Stack
React 18 + Vite + TypeScript + Tailwind CSS + ShadCN UI + Framer Motion (for the motion notes below) + Recharts (for analytics charts).

### Layout — sidebar-first navigation (no top nav bar)
There is **no top nav with clickable tabs.** Every primary action lives in a persistent left sidebar. The top of the screen is reserved only for page title, breadcrumbs, and the notification bell.

**Sidebar structure (top to bottom):** wordmark/logo → org switcher (only if multi-org) → nav items, grouped into sub-sections where a role has 5+ items → user profile + logout pinned at the bottom, separated by a hairline.

**Nav items per role:**
- **Employee:** Dashboard · My Requests (Leave / Travel Order / Job Order) · My Attendance · Payslip · Announcements
- **Approver / Department Head:** Dashboard (pending approvals queue) · Approval History · Announcements
- **HR Admin:** Dashboard · Employees · Leave Management · Attendance · Payroll · HR Extended (Evaluation, Service Record, Training, Promotion — collapsible sub-group) · Announcements
- **Tenant Admin:** Dashboard · Workflow Templates · Users & Departments · Analytics · AI Insights · Subscription · Announcements
- **Super Admin:** Platform Dashboard · Tenants · Billing · Platform Health

**States:**
- Active item: Route Blue tint background, Ink Navy text, `2px` Signal Yellow left accent bar — this ties the sidebar into the Route Line identity, so "you are here" shows up in navigation, not just document tracking.
- Hover (inactive): faint Paper-tint background, no accent bar.
- Pending-count badge: small Signal Yellow pill with a number, right-aligned — only where a count is meaningful (approvals queue, pending requests).
- Icon + label always paired — never icon-only when expanded.

**Collapse behavior:** below tablet width, collapse to an icon-only rail (~64px); tapping expands as a temporary overlay drawer, not a page-content push. Desktop keeps it expanded (~240px) at all times.

#### Other layout notes
- **Card-based dashboards** — the at-a-glance widget sits in a single wide card at the top, detail charts below in a grid.
- **The tracking view is the visual centerpiece**, not a secondary screen.

### Design tokens

#### Color
| Token | Hex | Use |
|---|---|---|
| Ink Navy | `#122B4D` | Primary text, sidebar/nav background, headers |
| Route Blue | `#2457D6` | Primary actions (Approve & Forward, Submit), links, active states |
| Signal Yellow | `#F4B400` | The one accent — current-step markers, SLA warnings, "you are here" indicator |
| Paper | `#F8F9FB` | App background — cool off-white, never stark white |
| Slate | `#5C6B7A` | Secondary text, timestamps, metadata |
| Alert Red | `#D64545` | Reserved *only* for rejections/SLA breaches — never decorative |

Rule: blue carries institutional weight, yellow is a single sparing accent (not 50/50 with blue), red is quarantined to actual problems so it stays meaningful. Do not introduce any other saturated colors.

#### Typography
- Display/headers: **Space Grotesk**
- Body/UI: **Inter**
- Data/mono (tracking numbers, QR reference codes, timestamps, audit logs): **IBM Plex Mono**

#### Surfaces & elevation (flat system — no drop shadows anywhere)
- Page background: Paper (`#F8F9FB`)
- Cards: pure white, `12px` radius, `0.5px solid #E3E7ED` border. Depth comes from the Paper-vs-white contrast, not shadows.
- Metric cards (dashboard numbers): a faint tint one step below pure white, muted 11-13px label above a 20-24px/500-weight number below.
- Only two elevation levels exist: page and card. No third floating layer — no popover-on-popover.
- Radius: `12px` for cards/containers, `7-8px` for buttons/badges/pills. Keep this consistent everywhere.

#### Components
- **Primary button** (Approve & Forward, Submit): solid Route Blue fill, white text, `7px` radius.
- **Secondary button** (Decline, Cancel): white fill, hairline border, Slate text. Never red for Decline — red is reserved for actual breaches only.
- **Status badges**: colored text on a pale tint of the same color (never colored text on plain white). Same color language across every table (Leave, Travel Order, Job Order, Attendance) so a user learns it once. Statuses: Present, Late, On Leave, Official Business, Holiday, Weekend, Absent, Pending, Approved, Declined.
- **Tables**: hairline row dividers, no zebra striping, faint Paper-tint row-hover.
- **Sidebar**: persistent, left, per-role nav (Employee never sees admin-only items).

### Signature element: the Route Line
The product's whole differentiator is *watching a document travel through a chain* — this must show up everywhere, not just on one screen:
- A thin **Route Blue connector line** links each step in a document's journey; **Signal Yellow dots** mark completed steps; a pulsing yellow marker (larger dot, subtle glow ring) marks the *current* step.
- Reuse this line-and-dot motif at smaller scale in: table status badges (a mini dot-trail instead of plain text), the notification bell icon, and page-transition loading states (a thin yellow line traveling left to right).
- This is the one visual signature of the whole app — build it once as a reusable `<RouteTrail>` component and use it everywhere a document's progress needs to show.

### Motion (Framer Motion)
Purposeful and calm, never decorative — this is a daily-use tool for serious documents.

**Duration tokens:** `fast` 120ms (hovers, small toggles) · `base` 200ms (page/panel transitions, sidebar active state) · `slow` 320ms (modal open) · `signature` 400ms (Route Line marker advance only).

**Easing curves:**
- `ease-out-standard` — `cubic-bezier(0.16, 1, 0.3, 1)` — default for anything entering the screen (toasts, panels, page content). No overshoot.
- `ease-in-out-standard` — `cubic-bezier(0.4, 0, 0.2, 1)` — for toggles that enter and exit the same way (sidebar collapse, section switches).
- `ease-settle` — `cubic-bezier(0.34, 1.56, 0.64, 1)` — the **only** curve allowed a slight overshoot, reserved exclusively for the Route Line marker advance.

**Per-screen:**
- Sidebar hover: background fade `fast`/`ease-out-standard`. Active-item change: background + accent bar fade `base`/`ease-out-standard`. Collapse/expand: width `base`/`ease-in-out-standard`, labels fade out at the midpoint of the width change, not the full duration.
- Page/section transitions: cross-fade `base`/`ease-out-standard` — never a hard cut, never a slide.
- Route Line marker advance: position transition `signature`/`ease-settle` + an opacity glow pulse (0→1→0 over 600ms) on arrival. This is the one place delight budget goes.
- Modals/panels: open = slide-up 12px + fade, `slow`/`ease-out-standard`. Close = same reversed at `base` (faster close reads more responsive).
- Toasts: slide-in from top-right `base`/`ease-out-standard`, auto-dismiss 4s, exit fade `fast`.
- Buttons: hover = background/border tint only, `fast`, no scale. `scale(0.98)` reserved for the press state only, `fast`.
- Dashboard cards on load: fade + rise 4px, staggered ~40ms per card.

**Respect `prefers-reduced-motion` without exception** — every transition above collapses to instant. Not optional for a broad, mixed-age government user base.

Restraint rule: if in doubt, cut the animation. One well-executed signature motion (the Route Line marker, the only curve with overshoot) beats five small competing effects.

### Screens to build

#### 1. HR/Admin dashboard
Top row of summary cards (compact grid, not a wall of charts): Total Employees, Present Today, Absent Today, Late Today, On Leave, Official Business, Pending Requests, Approved Today, Declined Today.
Below: Leave Requests table (Employee, Leave Type, Date, Days, Status, Action) and Travel Order / Job Order tables in the same pattern, each row action opening an approval detail view.

#### 2. Leave approval detail (modal or side panel)
Employee Name, Department, Position header. Leave Credits snapshot (Vacation Leave and Sick Leave — Used / Remaining). Buttons: View Attachment, Approve, Decline.

#### 3. Employee self-service dashboard
Summary cards: Present, Absent, Late (cumulative), Vacation Leave Remaining, Sick Leave Remaining, Pending Requests.
Tabs/sections: Submit Requests (Leave, Travel Order, Job Order forms), My Attendance (Date/Time In/Time Out/Status table + summary strip), Leave Balance breakdown, Announcements feed, Payslip (read-only).

#### 4. Forms
- **Leave Application**: Leave Type (dropdown), From/To (date range), Half Day toggle (AM/PM), Number of Days (auto-computed, read-only), Reason (text), Attachment (required if Sick Leave). Submit / Cancel.
- **Travel Order**: Destination, Purpose, Date, Attachment.
- **Job Order**: Project, Description, Date, Attachment.

#### 5. Document tracking view (the centerpiece screen)
Full-width Route Line showing every step of a document's chain (office/approver name under each dot), current step highlighted, SLA timer per step, threaded comments below for revision requests.

#### 6. Employee Records (HR drill-down)
Attendance Summary (Working Days, Present, Absent, Late, On Leave, Official Business), Leave Credits (per type: Total/Used/Remaining), Documents history (Leave Requests, Travel Orders, Job Orders — each linking back to its tracking view).

### What NOT to do
- No gradients, drop shadows, glow/neon effects, or dark colored page backgrounds.
- No red for anything routine (Decline, Cancel) — red means an actual SLA breach or rejection only.
- No more than one accent-filled primary button per view.
- Don't cycle through unrelated colors for decoration — every color on screen should map to a real status or role.
- Don't over-animate — the Route Line marker slide is the one moment worth spending "delight budget" on.

### Reference
A rendered mockup of the sidebar-navigation dashboard (nav items, active state, Route Line tracking strip, summary cards) was generated alongside this prompt — use it as the visual ground truth for spacing, sidebar density, and the Route Line's look before writing any component code.
