# StockFlow Project Handoff

This document provides a comprehensive overview of the **StockFlow** project—its goals, architecture, tech stack, and the exact progress completed to date. This file is intended to serve as complete context for any incoming developer or AI agent taking over the codebase.

## 🎯 Project Goal
**StockFlow** is a multi-tenant SaaS Inventory Management MVP. It provides small-to-medium businesses with an isolated, secure platform to track products, manage stock quantities, and receive automated low-stock alerts.

## 🧱 Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB (via Mongoose ODM)
- **Styling:** Tailwind CSS (v4) + Heroicons
- **Authentication:** Custom JWT-based authentication using HTTP-only cookies

## 🎨 UI/UX Design Principles
We strictly follow a clean, minimalist design aesthetic inspired by **Liner.com**:
- **Palette:** Neutral tones (`gray-50` to `gray-900`) only. Absolutely no flashy gradients or heavy accent colors (e.g., removed all default Tailwind `indigo` references).
- **Structure:** Card-based dashboard, sidebar layout.
- **Micro-interactions:** Smooth hover states (`transition-colors`) and subtle `gray-900` focus rings.
- **Layout:** Plenty of whitespace, rounded corners (`lg`/`xl`), minimal shadows (`shadow-sm`), and soft typography (`Inter` font).
- **Feedback:** Clear loading states (spinners) and empty state placeholders. 

## 🏗️ Architecture & Security Rules
- **Multi-Tenancy:** The core architectural pillar. ALL data (except the `Organization` itself) is strictly scoped by `organizationId`. Cross-tenant data leakage is fundamentally prevented at the database query level.
- **Tenant Enforcement Strategy:** Any secure API route MUST call `requireOrganization()` from `src/lib/auth.ts`, ensuring the request holds a valid JWT matching an existing organization.
- **MVP Restrictions:** Currently, the system supports exactly **one User per Organization**.
- **Route Protection:** Next.js Proxy (`src/proxy.ts`) dynamically protects private dashboard routes and redirects authenticated users away from public auth pages. *(Note: Next.js 16 deprecated `middleware.ts` in favor of `proxy.ts`).*

---

## ✅ Work Accomplished (Phases 1-7)

**1. Infrastructure & Database Setup**
- Configured MongoDB connection globally (`src/lib/db.ts`) with a singleton cache to prevent Hot Module Replacement (HMR) connection drops.
- Defined all Mongoose schemas in `src/models`: `Organization.ts`, `User.ts`, `Product.ts`, and `Settings.ts`.

**2. Authentication System**
- **Signup API:** Wraps the creation of the `Organization`, default `Settings`, and the initial `User` into a sequential flow.
- **Login API:** Validates bcrypt passwords and generates a signed JWT stored securely in an HTTP-only `auth_token` cookie.
- **Logout API:** Exposes a `DELETE /api/auth/logout` endpoint tied to the UI `SignOutButton` to destroy the session.

**3. Products CRUD & Inventory App**
- Implemented `/api/products` (GET, POST, PUT, DELETE) enforcing `organizationId` matching. Contains checks to ensure SKUs are uniquely registered per organization.
- Built the `ProductsPage` (`/products`) with client-side debounced search (hitting the DB with a regex query on name/SKU), separated Status flags (In stock, Low stock, Out of stock), and quantity trackers.
- Created reusable `ProductForm.tsx` for creating and editing stock items. Supports overriding the global low-stock threshold per item.

**4. Dashboard & Settings**
- **Dashboard API:** Aggregates total items, physical stock quantity, and queries specifically for items dipping beneath their assigned thresholds.
- **Dashboard UI:** Clean statistical cards and an actionable Low-Stock table redirecting users straight to the restock interface.
- **Settings:** Allows organizations to define a global `defaultLowStockThreshold` (falling back to 10 automatically if left unset). All products dynamically inherit this setting on the backend unless they have a specific threshold override.

---

## 🚀 Next Steps / Takeover Guide
The application is functionally complete for the MVP scope and is completely ready for deployment (e.g., on Vercel). However, if you are extending this system, consider the following potential features:

1. **Role-Based Access Control (RBAC):** Expanding the MVP to allow multiple users per organization (e.g., Admins vs. Viewers).
2. **Email Infrastructure:** Integrating Resend/SendGrid for signup verification and password reset functionality.
3. **Advanced Analytics:** Adding historical charting (e.g., stock depletion over time) using a library like Recharts. 
4. **Billing & Subscriptions:** Integrating Stripe to limit the number of products an organization can create based on SaaS pricing tiers.

*All system configurations reside in `next.config.js`, `.env.local` handles secrets (requiring `MONGODB_URI` and `JWT_SECRET`), and the core styling tokens act globally through `globals.css`.*
